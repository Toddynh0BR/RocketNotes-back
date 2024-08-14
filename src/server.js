require("express-async-errors");

const uploadConfigs = require("./configs/upload");
const AppError = require("./utils/AppError");
const cors = require("cors");

const express = require('express');
const routes = require("./routes");
const app = express();
app.use(cors());

app.use("/files", express.static(uploadConfigs.UPLOADS_FOLDER));
app.use(express.json());
app.use(routes);

app.use(( error, request, response, next)=>{
 if(error instanceof AppError){
 return response.status(error.statusCode).json({
    status: "error",
    message: error.message
 })
 }

 console.error(error)

 return response.status(500).json({
 status: "error",
 message: "internal server error"
 })
})

const PORT = process.env.PORT || 2245;
app.listen(PORT, () => console.log(`serve is running on port ${PORT}`));