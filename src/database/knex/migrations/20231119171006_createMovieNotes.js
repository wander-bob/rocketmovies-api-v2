exports.up = knex => knex.schema.createTable('movie_notes', (table)=>{
  table.uuid('id').primary().default(knex.fn.uuid());
  table.string('title').unique();
  table.string('description');
  table.integer('rating');
  table.uuid('user_id').references('id').inTable('users');
  table.dateTime('created_at').defaultTo(knex.raw(`(datetime('now', 'localtime'))`));
  table.dateTime('updated_at').defaultTo(knex.raw(`(datetime('now', 'localtime'))`));
});
exports.down = knex => knex.schema.dropTable('movie_notes');
