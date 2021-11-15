const http=require("http");
const fs=require("fs");
var requests=require("requests");

const homeFile=fs.readFileSync("home.html","utf-8");

const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}",(orgVal.main.temp-273.15).toFixed(2));
    temperature=temperature.replace("{%tempmin%}",(orgVal.main.temp_min-273.15).toFixed(2));
    temperature=temperature.replace("{%tempmax%}",(orgVal.main.temp_max-273.15).toFixed(2));
    temperature=temperature.replace("{%location%}",orgVal.name);
    temperature=temperature.replace("{%country%}",orgVal.sys.country);
    temperature=temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;
}

const server=http.createServer((req, res)=>{
    if(req.url=="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=8061c766188832e083da12d8e3c82de6")
        .on("data", (chunk)=>{
            const objData=JSON.parse(chunk);
            const arrData=[objData];
            // console.log(arrData[0].main.temp);
            const realTimeData=arrData.map((val)=>replaceVal(homeFile,val)).join("");
            res.write(realTimeData);
            // console.log(realTimeData);
        })
        .on("end", (err)=>{
            if(err) return console.log("connection closed due to error");
            res.end();
        });
    }
});
server.listen(8000,"127.0.0.1");