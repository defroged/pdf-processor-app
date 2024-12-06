// api/process-pdf.js

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Adjust as needed
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Placeholder: Handle the uploaded PDF file
        // Extract file from req (implementation will come later)
        res.status(200).json({ message: 'PDF received and processed (placeholder)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
