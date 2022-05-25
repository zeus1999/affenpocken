var express = require("express");
var app = express();
var router = express.Router();
var cors = require("cors");

var getCoordFromCountry = require("./coord");

app.use(cors());


let data = [];

/*

var data = [
    { country: "Germany", cases: 0, death: 0, lat: getCoordFromCountry("DE").latitude, lon: getCoordFromCountry("DE").longitude },
    { country: "England", cases: 0, death: 0, lat: getCoordFromCountry("GB").latitude, lon: getCoordFromCountry("GB").longitude },
    { country: "Spain", cases: 0, death: 0, lat: getCoordFromCountry("ES").latitude, lon: getCoordFromCountry("ES").longitude },
]
*/
var raw = require("./data.json");

var map = {};

for(let i = 0; i < raw.length; i++){

    if(raw[i].Status == "confirmed"){

        if(!map[raw[i].Country]) map[raw[i].Country] = { cases: 0 }

        map[raw[i].Country].cases++;
    }

    for(let key in map){

        let obj = getCoordFromCountry(key);

        if(!obj){
            console.log(key);
            continue;
        }

        data.push({
            country: key,
            cases: map[key].cases,
            lat: obj.latitude,
            lon: obj.longitude
        })
    }

}


app.use("/", express.static("./www"))


router.get("/rest/data", async function(req, res){


    

    res.send(data)
});

app.use(router);
app.listen(80);