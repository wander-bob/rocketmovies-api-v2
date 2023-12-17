const AppError = require("../middlewares/AppError");
const knex = require("../database/knex");

class MovieNotesController {
  async create(request, response){
    const {title, description, tags, rating} = request.body;
    const lowerTitle = String(title).toLocaleLowerCase();
    const user_id = request.user.id;
    const [checkIfNoteExists] = await knex("movie_notes").where({title: lowerTitle})
    if(checkIfNoteExists){
      throw new AppError("This movie has been already saved.");
    }
    const filteredTags = tags.filter((tag, index)=> index == tags.indexOf(String(tag).toLocaleLowerCase()));
    const [note] = await knex("movie_notes").returning("id").insert({title:lowerTitle, description, rating, user_id});
    const tagsToInsert = filteredTags.map((tag)=>{
      return {note_id: note.id, name: tag, user_id};
    });
    await knex("movie_tags").insert(tagsToInsert);
    return response.json({
      message: "Note was created.",
      note_id: note.id
    })
  }
  async index(request, response){
    const {title} = request.query;
    const user_id = request.user.id;
    const validatedTitle = title ? title : "";
    const userNotes = await knex("movie_notes")
    .select("id", "title", "description", "rating", "created_at")
    .where("movie_notes.user_id", user_id)
    .whereLike("title", `%${validatedTitle}%`)
    .orderBy("title");
    const userTags = await knex("movie_tags").select("id","name", "note_id").where("user_id", user_id);
    const notes = userNotes.map((note)=>{
      const filteredTags = userTags.filter(({note_id})=> note_id === note.id );
      return {...note, tags: filteredTags}
    })
    return response.json(notes)
  }
  async show(request, response){
    const id = request.params.id;
    const user_id = request.user.id;
    const note = await knex("movie_notes").select("title", "description", "rating", "created_at").where({id}, {user_id}).first();
    const tags = await knex("movie_tags").select("name").where({note_id: id});
    
    return response.json({...note, tags})
  }
  async delete(request, response){
    const id  = request.params.id;
    const user_id = request.user.id;
    const checkIfNoteExists = await knex("movie_notes").where({id}).first();
    if(!checkIfNoteExists){
      throw new AppError("Note not found", 404);
    }
    await knex("movie_notes").andWhere({id, user_id}).delete();
    return response.json({message: `Note ${id} was deleted.`})
  }
}
module.exports = MovieNotesController;