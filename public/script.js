// public/script.js

document.getElementById('upload-button').addEventListener('click', async () => {
    const fileInput = document.getElementById('pdf-upload');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a PDF file to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/process-pdf', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Network response was not ok');
        }

        const result = await response.json();
        console.log(result);

        // Display extracted text
        document.getElementById('output').innerText = result.text || 'No text extracted.';

        // Optionally, display mapped elements
        const elementsContainer = document.createElement('div');
        elementsContainer.innerHTML = '<h2>Mapped Elements:</h2>';
        result.elements.forEach((element, index) => {
            const elemDiv = document.createElement('div');
            elemDiv.className = `element ${element.className}`;
            elemDiv.innerText = `${element.className}: ${element.text}`;
            elementsContainer.appendChild(elemDiv);
        });
        document.getElementById('output').appendChild(elementsContainer);
    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred while processing the PDF: ${error.message}`);
    }
});
