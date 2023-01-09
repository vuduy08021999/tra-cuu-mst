let express = require("express");
let app = new express();
var bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get("/",(req,res)=>{
  res.send("home");
});

app.get("/tra-cuu-mst/:mst",async (req,res)=>{
  let response = require("./response/response.js");
  try{
    let infoDoanhNghiep = await require("./core/getInfoFromMstRequest")(req.params.mst.trim());
    response.data = infoDoanhNghiep
  }catch(e){
    response.statusCode = 1;
    response.message = "Thất bại";
    response.data = e.toString();
  }

  res.json(response);
});

app.listen(8080,()=>{
  console.log("server listening on port 8080");
})
