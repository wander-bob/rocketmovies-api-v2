exports.up = knex => knex.schema.createTable('movie_tags', (table)=>{
  table.uuid('id').primary().default(knex.fn.uuid());
  table.string('name');
  table.uuid('user_id').references('id').inTable('users');
  table.uuid('note_id').references('id').inTable('movie_notes').onDelete('CASCADE');
});
exports.down = knex => knex.schema.dropTable('movie_tags');