require("express-async-errors");
const express = require("express")
const cors = require("cors");
const multerConfig = require("./configs/multerConfig")
const server = express();

const routes = require("./routes");
const AppError = require("./middlewares/AppError");
const port = 3000;

server.use(express.json());
server.use(cors());
server.use("/files", express.static(multerConfig.UPLOAD_FOLDER))
server.use(routes);

server.use((error, request, response, next)=>{
  console.log(error);
  if(error instanceof AppError){
    return response.status(error.statusCode).json({
      message: error.message
    })
  };
  response.status(500).json({
    message: "Internal server error."
  })
})
server.listen(port, ()=>{
  console.log(`Server is running on port: ${port}`);
})