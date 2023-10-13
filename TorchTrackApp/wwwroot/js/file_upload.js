const BASE_URL = "https://localhost:7032/api/File/";

async function uploadFiles() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    const formData = new FormData();

    for (const file of files) {
        formData.append('files', file);
    }

    const fileNameInput = document.getElementById('fileName');
    const fileName = fileNameInput.value; // Get the value from the input field
    formData.append('file_name', fileName);

    try {
        const response = await fetch(`${BASE_URL}UploadModel?file_name=` + encodeURIComponent(fileName), {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Upload successful:', result);
        } else {
            const error = await response.text();
            console.error('Upload failed:', error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('uploadButton').addEventListener('click', uploadFiles);
document.getElementById('fileInput').addEventListener('change', (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
        document.getElementById('fileName').value = selectedFiles[0].name;
    } else {
        document.getElementById('fileName').value = '';
    }
});
