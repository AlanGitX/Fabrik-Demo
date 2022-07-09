const express = require("express");
const app = express();
// to avoid cors error
const cors = require("cors");
const fileupload = require("express-fileupload");
const fs = require("mz/fs");

app.use(cors());

app.use(fileupload());

const port = 3000;

const baseUrl = ``

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function (filename) {
      fs.readFile(dirname + filename, "utf-8", function (err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

app.post("/upload", function (req, res) {
  let file;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({
      status: "failed",
      message: "No files were uploaded.",
    });
  }

  file = req.files.file;
  uploadPath = __dirname + "/uploads/" + file.name;

  file.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.send({
      status: "success",
    });
  });
});

app.get("/files", (req, res) => {
  res.header.h
  fs.readdir(__dirname + "/uploads/")
    .then((listing) => {
      res.send({
        data: listing,
      });
    })
    .catch((err) => {
      res.send({
        status: "failed",
      });
    });
});

app.get("/files/:name", (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __dirname + "/uploads/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
