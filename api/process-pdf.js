// api/process-pdf.js

import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false, 
    },
};

const client = new DocumentProcessorServiceClient({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
}); // fixed

const processorName = 'projects/352947746227/locations/us/processors/ddfc0425595073d4';


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error parsing the file' });
        }

        const file = files.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            const fileBuffer = fs.readFileSync(file.filepath);
            const encodedFile = fileBuffer.toString('base64');

            const request = {
                name: processorName,
                rawDocument: {
                    content: encodedFile,
                    mimeType: 'application/pdf',
                },
            };

            const [result] = await client.processDocument(request);

            // Extracted text and entities
            const document = result.document;

            // Example: Extract paragraphs, lines, and tokens
            const text = document.text;

            // Process the document to map elements with classes/IDs
            const elements = mapElements(document);

            res.status(200).json({ text, elements });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the PDF with Document AI' });
        }
    });
}

// Helper function to map elements based on your criteria
function mapElements(document) {
    const elements = [];

    // Iterate through pages
    for (const page of document.pages) {
        // Iterate through blocks (e.g., title, paragraphs, tables)
        for (const block of page.blocks) {
            let className = 'unknown';

            // Simple example: Assign class based on block type or content
            if (isTitle(block)) {
                className = 'h1-title';
            } else if (isVocabList(block)) {
                className = 'vocab';
            }
            // Add more conditions as needed

            elements.push({
                className,
                text: getText(block),
                boundingBox: block.layout?.boundingPoly,
                // Add more properties as needed
            });
        }
    }

    return elements;
}

// Example condition to identify a title block
function isTitle(block) {
    // Implement your logic, e.g., font size, boldness, position
    return block.layout.textAnchor.textSegments[0].text.toLowerCase().includes('title');
}

// Example condition to identify a vocabulary list
function isVocabList(block) {
    // Implement your logic, e.g., presence of bullet points, specific keywords
    return block.layout.textAnchor.textSegments[0].text.toLowerCase().includes('vocab');
}

// Helper function to extract text from a block
function getText(block) {
    return block.layout.textAnchor.textSegments.map(segment => segment.text).join('');
}
