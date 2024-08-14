const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class NotesController {
    async create(request, response) {
     const { title, description, links, tags } = request.body;
     const  user_id  = request.user.id;

     const [note_id] = await knex("notes").insert({
        title,
        description,
        user_id
     });
   

     if (tags.length){
     const tagInsert = tags.map(name => {
        return {
            note_id,
            name,
            user_id
        }
     });

     await knex("tags").insert(tagInsert);
    }

    if (links.length){
        const linkInsert = links.map(url => {
           return {
               note_id,
               url
           }
    });
   
     await knex("links").insert(linkInsert);
    }
   
     response.json();
    };

    async show(request, response) {
      const user_id = request.user.id;
      const { id } = request.params

      const note = await knex("notes")
                         .where({ id, user_id })
                         .first();
      if(!note){
        throw new AppError(`Nenhuma nota encontrada com o id: ${id}.`, 404);
      }

      const tags = await knex("tags")
                        .where({ note_id: id })
                        .orderBy("name") || [];

      const links = await knex("links")
                         .where({ note_id: id }) || [];
                         
      return response.json({ note, tags, links })
    };
    
    async index(request, response) {
        const { index, tag } = request.body;
        const user_id = request.user.id;
    
        try {
            let notes;
    
            if (index) {
                notes = await knex("notes")
                    .where("title", "like", `%${index}%`)
                    .andWhere({ user_id });
    
                if (!notes.length) {
                    throw new AppError(`Nenhum resultado para ${index}`);
                }
            } else if (tag) {
                const searchTags = await knex("tags")
                    .where("name", "like", `%${tag}%`)
                    .andWhere({ user_id });
    
                if (!searchTags.length) {
                    throw new AppError(`Nenhum resultado para ${tag}`);
                }
    
                const noteIds = searchTags.map(tag => tag.note_id);
    
                notes = await knex("notes")
                    .whereIn("id", noteIds)
                    .andWhere({ user_id });
    
                if (!notes.length) {
                    throw new AppError(`Nenhum resultado para ${tag}`);
                }
            } else {
                notes = await knex("notes")
                    .where({ user_id });
    
                if (!notes.length) {
                    throw new AppError("Nenhuma nota criada ainda.");
                }
            }
    
            const noteIds = notes.map(note => note.id);
    

            const tags = await knex("tags")
                .whereIn("note_id", noteIds)
                .orderBy("name");
    
            const links = await knex("links")
                .whereIn("note_id", noteIds);
   
            const result = notes.map(note => {
                return {
                    ...note,
                    tags: tags.filter(tag => tag.note_id === note.id),
                    links: links.filter(link => link.note_id === note.id)
                };
            });
    
            return response.json(result);
    
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: error.message });
        }
    };

    async tags(request, response) {
      const  user_id  = request.user.id;

      const Tags = await knex("tags")
                        .where({user_id})
                        .distinct("name")
                        .orderBy("name");

      if (!Tags.length){
        throw new AppError("Nenhuma tag criada ainda")
      }

      return response.json({Tags})
    }
    
    async delete(request, response) {
        const { id } = request.params;

        try {
            await knex("notes")
                 .where({id})
                 .first()
                 .delete();

            return response.status(200).json({})
        }catch(error){
            console.error(error);
            return response.status(500).json({ error: error.message });
        }
    };
};

module.exports = NotesController;