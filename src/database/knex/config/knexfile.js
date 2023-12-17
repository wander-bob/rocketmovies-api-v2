const path = require('node:path');
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, '..', '..', 'rocket_movies.db')
    },
    pool: {
      afterCreate: (conn, callBack) => conn.run('PRAGMA foreign_keys = ON', callBack)
    },
    migrations: {
      directory: path.resolve(__dirname, '..', 'migrations')
    },
    useNullAsDefault: true,    
  },
};
