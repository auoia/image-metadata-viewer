const express = require("express");
const upload = require("express-fileupload");
const path = require("path");
const exif = require("exif-parser");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const port = 3000;

// app.use(express.limit('50M'));
app.use(upload({
	limits: {
		fileSize: 50000000
	}
}));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});

app.get("/uploads/:fileName", (req, res) => {
	fs.readFile(path.resolve(__dirname, "uploads", req.params.fileName), (err, buffer) => {
		if (err) {
			next(err);
		}

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
    if (!req.files
			|| ((req.files.image.mimetype !== "image/jpeg")
			&& (req.files.image.mimetype !== "image/jpg"))) {
		res.send({"Bad Request": "Please upload only .jpg or .jpeg files"});
		next();
		return;
	}

	const file = req.files.image;
	const fileName = file.md5

    file.mv(path.resolve(__dirname, "uploads", fileName), function (err) {
		if (err) {
			next(err);
		}

		res.status(201);
		res.redirect("/uploads/" + fileName);
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

});

//Delete uploaded file from server
// app.use((req, res, next) => {
// });


app.listen(port, () => {
    console.log(`App started listening on port ${port}`);
})
