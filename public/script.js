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
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);
        // Handle the processed PDF or results here
        document.getElementById('output').innerText = JSON.stringify(result, null, 2);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing the PDF.');
    }
});
