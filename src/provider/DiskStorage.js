const fs = require("node:fs");
const path = require("node:path");
const uploadConfig = require("../configs/multerConfig");

class DiskStorage {
  async saveFile(file){
    await fs.promises.rename(
      path.resolve(uploadConfig.TEMP_FOLDER, file),
      path.resolve(uploadConfig.UPLOAD_FOLDER, file)
    )
    return file;
  }
  async deleteFile(file){
    const filePath = path.resolve(uploadConfig.UPLOAD_FOLDER, file);
    try {
      await fs.promises.stat(filePath);
    }catch (error){
      return console.log(error);
    }
    await fs.promises.unlink(filePath);
  }
}
module.exports = DiskStorage;