const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const exif = require("exif-parser");
const fs = require("fs");

const app = express();
const port = 3000;

// app.use(express.limit('50M'));
app.use(fileUpload({
	limits: {
		fileSize: 1024 * 1024 * 100 // 50MB filesize limit
	},
	// abortOnLimit: true
}));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});

app.get("/uploads/:fileName", (req, res) => {
	fs.readFile(path.resolve(__dirname, "uploads", req.params.fileName), (err, buffer) => {
		if (err) {
			next(err);
		}
		// if fileTypes.mime
		const parser = exif.create(buffer);

		try {
			const result = parser.parse();
			res.send(result);
		} catch (err) {
			res.send({"Bad Request": "File could not be parsed."});
		}
	})
});

app.post("/", (req, res, next) => {
	if (!req.files || req.files.image.size > 1024*1024*20) {
		res.status(400).send({"Bad Request": "Upload file is empty or the filesize is >20mb"});
		next();
		return;
	}
	const file = req.files.image;
	const fileName = file.md5

    file.mv(path.resolve(__dirname, "uploads", fileName), function (err) {
		if (err) {
			next(err);
		}

		res.status(201).redirect("/uploads/" + fileName);
	});
});

	// const buffer = fs.readFileSync(path.resolve(__dirname, "uploads", fileNameMd5Hash));
	// const parser = exif.create(buffer);
	//
	// try {
	// 	const result = parser.parse();
	// 	res.send(result);
	// } catch (err) {
	// 	res.send({"Bad Request": "File could not be parsed."});
	// }


//Delete uploaded file from server
// app.use((req, res, next) => {
// });


app.listen(port, () => {
    console.log(`App started listening on port ${port}`);
})
