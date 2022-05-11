//const con = require('./models/db-conncect')
const connection = require('./helpers/db-connection');
const query = require('./helpers/db-query');

// con.getConnection(function(err) {
//     if (err) throw err;
//     console.log("Database connected!");
// });
async function dbConnect() {
    const conn = await connection()
        .then(result => {console.log("Database connected!"); result.end()})
        .catch(e => console.log("Database can't connected!"));
}
//test connect database
dbConnect();

const app = require('./app');
const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Express is running on port ${server.address().port}`);
});