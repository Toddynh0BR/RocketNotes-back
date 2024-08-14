exports.up = knex => knex.schema.createTable("links", table => {
    table.increments('id').primary();
    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
    table.string("url") 
    
    table.timestamp("created_at").default(knex.fn.now());
  });
  
  
  exports.down = knex => knex.schema.dropTable("links");