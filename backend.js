const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("node:path");

let currentUser = {
    email: "",
    password: "",
};

let applicationStatus = {
    status: "Applied Successfully",
    link: '<a href="../index.html">Go to Home</a>',
};

mongoose.connect("mongodb://127.0.0.1:27017/project");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connection Successful");
});
var userresp = new mongoose.Schema({
    email: String,
    password: String,
});
var user = mongoose.model("user", userresp);

var subscriberresp = new mongoose.Schema({
    email: String,
});
var subscriber = mongoose.model("subscriber", subscriberresp);

var jobseekerresp = new mongoose.Schema({
    email: {
        type: String,
        default: currentUser.email,
    },
    keywords: String,
    location: String,
    jobrole: String,
});
var jobseeker = mongoose.model("jobseeker", jobseekerresp);

var applicationresp = new mongoose.Schema({
    name: String,
    age: Number,
    qualification: String,
    degree: String,
    resume: String,
});
var application = mongoose.model("application", applicationresp);

let hostname = "127.0.0.1";
const port = 3000;

app.get("/", (req, res) => {
    let p = path.join(__dirname, "public", "html", "login.html");
    res.sendFile(p);
});
app.get("/signup", (req, res) => {
    let p = path.join(__dirname, "public", "html", "signup2.html");
    res.sendFile(p);
});
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// console.log(__dirname)

app.get("/apply", (req, res) => {
    let p = path.join(__dirname, "public", "html");
    res.sendFile(p + "/jobApplication.html");
});

app.post("/", (req, res) => {
    let p = path.join(__dirname, "public");
    res.sendFile(p + "/index.html");
});

let findJobStatus = {};
app.post("/findjob", (req, res) => {
    let mydata = new jobseeker(req.body);
    mydata.email = currentUser.email;
    mydata
        .save()
        .then(async () => {
            // let userq = user.findOne({email:currentUser.email,password:currentUser.password})
            // console.log(userq);
            // await jobseeker.updateOne({email:''},{email: userq.email})
            // console.log(user)
            // jobseeker.email.push(currentUser.email)

            findJobStatus = {
                status: "Your application has been received",
            };
            let p = path.join(__dirname, 'public', 'index.html')
            res.sendFile(p);
        })
        .catch(() => {
            let p = path.join(__dirname, 'public', 'index.html')
            res.sendFile(p);
        });
});

let subscribeStatus = { status: "" };
app.post("/subscribe", (req, res) => {
    let mydata = new subscriber(req.body);
    mydata
        .save()
        .then(() => {
            subscribeStatus = {
                status: "Subscribed!"
            };
            let p = path.join(__dirname, "public");
            res.sendFile(p + "/index.html");
        })
        .catch(() => {
            subscribeStatus = {
                status: "Oops! Something went wrong. Please try again."
            };
            let p = path.join(__dirname, "public");
            res.sendFile(p + "/index.html");
        });
});
app.post("/application", (req, res) => {
    let mydata = new application(req.body);
    mydata
        .save()
        .then(() => {
            let p = path.join(__dirname, "public", "html");
            res.sendFile(p + "/jobApplication.html");
        })
        .catch();
});
app.get("/api", (req, res) => {
    res.json(applicationStatus);
    // applicationStatus ={}
});

app.get("/api/subscribed", (req, res) => {
    res.json(subscribeStatus);
    // subscribeStatus.status=undefined
    console.log(subscribeStatus.status)
});
app.get("/api/signup", (req, res) => {
    res.json(signupStatus);
    // console.log(subscribeStatus.status)
});
let signupStatus = {};
app.post("/signup", (req, res) => {
    let mydata = new user(req.body);
    mydata
        .save()
        .then(() => {
            let p = path.join(__dirname, "public", "html");
            res.sendFile(p + "/login.html");
        })
        .catch(() => {
            signupStatus = {
                status: "Oops! Something went wrong!! Please try again later!!!",
            };
            let p = path.join(__dirname, "public", "html");
            res.sendFile(p + "/login.html");
        });
});

app.post("/login", async (req, res) => {
    try {
        let check = await user.findOne({ email: req.body.email });
        if (check.password === req.body.password) {
            let p = path.join(__dirname, "public");
            currentUser.email = req.body.email;
            currentUser.password = req.body.password;
            // console.log(currentUser)
            res.sendFile(p + "/" + "index.html");
        } else {
            let p = path.join(__dirname, "public", "html");
            res.sendFile(p + "/" + "login.html");
        }
    } catch {
        let p = path.join(__dirname, "public", "html");
        res.sendFile(p + "/" + "login.html");
    }
});

hostname = '192.168.131.236'

app.listen(port, hostname, () => {
    // console.log(`Server running at http://${hostname}:3000/`);
    console.log(`Server running at http://${hostname}:${port}/`);
});