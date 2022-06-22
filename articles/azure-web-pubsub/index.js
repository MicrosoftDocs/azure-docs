var fs = require("fs");
var path = require("path");

module.exports = function (context, req) {
  if (!context.bindingData.path) {
    context.res = {
      status: 308,
      headers: {
        Location: req.url + "/index.html",
      },
    };
    context.done();
    return;
  }
  let file = context.bindingData.path ?? "index.html";
  let fileName = path.join(
    context.executionContext.functionDirectory,
    "public",
    file
  );
  context.log("Requesting file " + fileName);
  if (!fs.existsSync(fileName)) {
    context.res = {
      status: 404,
    };
    context.done();
    return;
  }
  fs.readFile(fileName, "utf8", function (err, data) {
    if (err) {
      console.log(err);
      context.done(err);
      return;
    }
    let contentType = "text/html";
    if (fileName.endsWith(".css")) {
      contentType = "text/css";
    } else if (fileName.endsWith(".js")) {
      contentType = "application/javascript";
    }
    context.res = {
      status: 200,
      headers: {
        "Content-Type": contentType,
      },
      body: data,
    };
    context.done();
  });
};