var express = require("express");

var morgan = require("morgan");
var path = require("path");

let propertiesReader = require("properties-reader");
let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = propertiesReader(propertiesPath);
let dbPprefix = properties.get("db.prefix");
//URL-Encoding of User and PWD
//for potential special characters
let dbUsername = encodeURIComponent(properties.get("db.user"));
let dbPwd = encodeURIComponent(properties.get("db.pwd"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");
const uri = dbPprefix + dbUsername + ":" + dbPwd + dbUrl + dbParams;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
let db = client.db(dbName);

var cors = require("cors");
var app = express();

app.set("json spaces", 3);
app.use(morgan("short"));
app.use(cors());
app.use(express.json());

app.param("collectionName", function (req, res, next, collectionName) {
  req.collection = db.collection(collectionName);
  return next();
});

app.get("/", function (req, res, next) {
  res.send("choose collection e.g /collections/products");
});

app.get("/collections/:collectionName", function (req, res, next) {
  req.collection.find({}).toArray(function (err, results) {
    if (err) {
      return next(err);
    }
    res.send(results);
  });
});

// Logger middleware
app.use(function (req, res, next) {
  console.log("Request URL:" + req.url);
  console.log("Request Date:" + new Date());
  next();
});

// Static file middleware
var staticPath = path.join(__dirname, "images");
app.use(express.static(staticPath));

app.use(function (req, res) {
  res.status(404);
  res.send("File not found!");
});

app.listen(3000, () => console.log("Server listening on port 3000"));
