// import pg from 'pg'

// const db = new pg.Client({
//     user: 'tanmay',
//     host: 'dpg-cq7mejbv2p9s73c6n6a0-a.singapore-postgres.render.com',
//     database: 'musicwebapp',
//     password: 'Wf1Y10WnxRbxKrCQdzcwM13KhTKvSBKC',
//     port: 5432,
//     ssl: {
//       rejectUnauthorized: false, // This allows connections even if the server's SSL certificate is self-signed.
//     }
//   });
  
//   db.connect();
//   export default db

import pg from 'pg';

const db = new pg.Client({
    user: 'postgres', // Default PostgreSQL user
    host: 'localhost',
    database: 'music_app',
    password: '4072', // Your local password
    port: 5432,
    ssl: false,
});

db.connect();
export default db;