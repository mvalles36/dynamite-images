const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: '<Your_Project_ID>',
    keyFilename: '<Your_Credentials>.json',
});


const app = express();
const upload = multer();

const app_host = process.env.APPLICATION_ID.split('~').pop() + '.appspot.com';
const bucketName = app_host;
const storage = new Storage();

// Get the Cloud Storage bucket
const bucket = storage.bucket(bucketName);

// Create the upload URL for the form
const upload_url = `/${bucketName}/upload`;

// Define the route to handle file upload
app.post(upload_url, upload.single('uploaded_files'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = bucket.file(req.file.originalname);

    const stream = file.createWriteStream({
        resumable: false,
        contentType: req.file.mimetype,
    });

    stream.on('error', (err) => {
        console.error('Error uploading file:', err);
        res.status(500).send('Error uploading file.');
    });

    stream.on('finish', () => {
        console.log('File uploaded successfully.');
        res.redirect(`/edit.html?img=${req.file.originalname}`);
    });

    stream.end(req.file.buffer);
});

app.get('/', (req, res) => {
    res.send(`
        <form action="${upload_url}" enctype="multipart/form-data" method="post" style="padding:1em;">
            Images to upload: <br>
            <input type="file" name="uploaded_files" size="40" accept="image/*"> 
            <input type="submit" value="Upload" class="btn btn-primary">
        </form>
    `);
});

const port = 8080; // Set the desired port number
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
