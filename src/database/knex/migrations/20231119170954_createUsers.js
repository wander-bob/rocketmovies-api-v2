exports.up = knex => knex.schema.createTableIfNotExists("users", (table)=>{
  table.uuid("id").primary().defaultTo(knex.fn.uuid());
  table.string("name");
  table.string("email").unique();
  table.string("password");
  table.string("avatar");
  table.datetime("created_at").defaultTo(knex.raw(`(datetime('now', 'localtime'))`));
  table.datetime("updated_at").defaultTo(knex.raw(`(datetime('now', 'localtime'))`));
});
exports.down = knex => knex.schema.dropTableIfExists("users");
