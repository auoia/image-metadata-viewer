const express = require('express');
const upload = require('express-fileupload');

const exif = require('exif-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(upload());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    if (req.files) {
        console.log(req.files);
        const file = req.files.image;
        const filename = file.name;
        console.log(filename);

        file.mv('./uploads/' + filename, function (err) {
            if (err) {
                res.send(err);
            } else {
                const buffer = fs.readFileSync(__dirname + '/uploads/' + filename);
                const parser = exif.create(buffer);
                
                try {
                    const result = parser.parse();
                    res.send(result);
                } catch (err) {
                    res.send(err); 
                }
            }
        });
    }
})

app.listen(port, () => {
    console.log(`App started listening on port ${port}`);
})