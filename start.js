const con = require('./models/db-conncect')
con.getConnection(function(err) {
    if (err) throw err;
    console.log("Database connected!");
});
// con.getConnection(function(err) {
//     if (err) throw err;
//     con.query("SELECT * From DAILY", function (err, result, fields) {
//         if (err) throw err;
//         console.log(result);
//     });
// });

const app = require('./app');
const server = app.listen(3000, () => {
    console.log(`Express is running on port ${server.address().port}`);
});