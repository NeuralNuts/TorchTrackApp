document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    const fileInput = document.getElementById('fileInput');

    if (fileInput.files.length > 0) {
        // Submit the form
        this.submit();
    } else {
        alert('Please select a file to upload.');
    }
});
