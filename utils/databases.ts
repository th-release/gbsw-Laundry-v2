import knex from 'knex';
export const db = knex({
  client: 'mysql',
  connection: {
    host: 'host',
    user: 'user',
    password: 'password',
    database: 'GBSW',
  },
});
