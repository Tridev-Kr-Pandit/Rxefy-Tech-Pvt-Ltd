const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const exp = require('constants');
const app = express();
app.use(express.urlencoded({ extended: false }))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./uploads");
    },

    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    },
})


// Configure Multer to handle file uploads
const upload = multer({ storage: storage });


app.set('view engine', "ejs");
app.get('/', (req, res) => {
    res.render("homePage");
})

app.post('/getimage', upload.single('AdharImage'), (req, res) => {
    // console.log(req.body)
    // console.log(req.file)

    const filePath = path.join(__dirname, req.file.path);

    // Process the image using Tesseract.js
    Tesseract.recognize(
        filePath,
        'eng', // Assuming the Aadhaar card is in English
        {
            logger: (m) => console.log(m), // Optional logging
        }
    )
        .then(({ data: { text } }) => {
            // Clean up the uploaded file
            fs.unlinkSync(filePath);

            const name = extractName(text);
            const aadhaarNumber = extractAadhaarNumber(text);
            res.render('dataPage', { name, aadhaarNumber })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Failed to process image' });
        });
})

function extractName(text) {
    const nameMatch = text.match(/Name\s*:\s*(.*)/i);
    return nameMatch ? nameMatch[1].trim() : 'Name not found';
}

function extractAadhaarNumber(text) {
    const aadhaarMatch = text.match(/\d{4}\s?\d{4}\s?\d{4}/);
    return aadhaarMatch ? aadhaarMatch[0].replace(/\s/g, '') : 'Aadhaar number not found';
}



app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
