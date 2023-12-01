import express from "express";
import cors from "cors";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/songs");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname.replace(/\s/g, '').toLowerCase());
    }
});

const upload = multer({ storage: storage });

app.post("/cover-from-mp3", upload.single("audio"), function (req, res) {
    console.log(req.file);
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }
    var command = ffmpeg();
    command
        .input(req.file.path)
        .noAudio()
        .output('output.jpg')
        .on('end', function () {
        res.download('output.jpg');
    })
        .on('error', function (err) {
        console.log('An error occurred: ' + err.message);
        res.status(500).send(err.message);
    })
        .run();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
