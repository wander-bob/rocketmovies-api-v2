const {hash, compare} = require("bcryptjs");
const AppError = require("../middlewares/AppError");
const knex = require("../database/knex");
const DiskStorage = require("../provider/DiskStorage");

class UserController {
  async create(request, response){
    const {name, email, password} = request.body;
    const checkIfUserExist = await knex("users").where({email}).first();
    if(checkIfUserExist){
      throw new AppError("E-mail já cadastrado.")
    }
    const passwordHashed = await hash(password, 8);
    await knex("users").insert({name, email, password: passwordHashed});
    return response.json({
      message: "User created successfully"
    })
  }
  async show(request, response){
    return response.json({message: "You're tested. Congrats."})
  }
  async update(request, response){
    const { name, email, old_password, new_password} = request.body;
    const user_id = request.user.id;
    const user = await knex("users").where({id: user_id}).first();
    if(!user){
      throw new AppError("Access Denied", 401);
    }
    const checkIfEmailExists = await knex("users").where({email}).first();
    if(checkIfEmailExists && user.id !== checkIfEmailExists.id){
      throw new AppError("This email is already in use.")
    }
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    if(new_password && !old_password){
      throw new AppError("You must provide both old and new password to update them.")
    }
    if(new_password && old_password){
      const checkOldPassword = await compare(old_password, user.password);
      if(!checkOldPassword){
        throw new AppError("Password invalid.", 401);
      }
      user.password = await hash(new_password, 8);
    }
    await knex("users").update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: knex.raw(`(datetime('now', 'localtime'))`)
    }).where({id: user_id});
    return response.json({
      message: "User was updated.",
    })
  }
  async upload(request, response){
    const diskStorage = new DiskStorage();
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;
    const user = await knex("users").where({id: user_id}).first();
    if(!user){
      throw new AppError("Session expired, please signin again", 401);
    }
    if(user.avatar){
      console.log("starting disk storage remove avatar")
      await diskStorage.deleteFile(user.avatar);
    }
    console.log("starting disk storage save avatar")
    const filename = await diskStorage.saveFile(avatarFilename);
    user.avatar = filename;
    await knex("users").update(user).where({id: user_id});
    return response.json({
      message: "Avatar updated successfully.",
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    })
  }
}
module.exports = UserController;