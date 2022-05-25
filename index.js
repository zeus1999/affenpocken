var express = require("express");
var app = express();
var path = require("path");
var router = express.Router();
var cors = require("cors");
var request = require("async-request");

var getCoordFromCountry = require("./coord");

app.use(cors());


compiled = [];
let data = [];
var map = {};

(async ()=>{
    await getData();
})();
setInterval(getData, 30000);


async function getData(){

    data = await request("https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest.json");
    data = JSON.parse(data.body);
    map = {};

    compiled = [];
    
    for(let i = 0; i < data.length; i++){

        if(data[i].Status == "confirmed"){

            if(!map[data[i].Country]) map[data[i].Country] = { cases: 0 }

            map[data[i].Country].cases++;
        }

    }

    compiled = [];

    for(let key in map){

        let obj = getCoordFromCountry(key);

        if(!obj){
            console.log(key);
            continue;
        }

        compiled.push({
            country: key,
            cases: map[key].cases,
            lat: obj.latitude,
            lon: obj.longitude
        })
    }


}




app.use("/", express.static("./www"))


router.get("/rest/data", async function(req, res){


    res.send(compiled)
});

app.use(router);



app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "./www/index.html"));
});
    
app.listen(80);