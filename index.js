var express = require("express");
var app = express();
var router = express.Router();

router.get("/", async function(req, res){
    res.send("i'm alive")
});

app.use(router);
app.listen(80);