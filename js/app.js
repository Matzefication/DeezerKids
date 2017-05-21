var fs = require("fs");
var path = require("path");

// Get version number.
global.version = JSON.parse(fs.readFileSync("package.json", "utf8")).version;
console.log("Starting DeezerKids: v" + global.version);

// global absolute root path
global.root_path = path.resolve(__dirname + "/../");

