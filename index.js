const express = require('express');
const fs = require('fs');
const cors = require('cors')
const bodyParser = require('body-parser');
const mysql = require('mysql');
const credentials = require('./credentials');
const fileUpload = require('express-fileupload');
const multer  = require('multer')
const serveIndex = require('serve-index');

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());

const db = mysql.createPool({
  /*
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test',
   */
  multipleStatements: true,
  host: credentials.host,
  user: credentials.user,
  password: credentials.password,
  database: credentials.database,
})

app.use(bodyParser.json());
app.use(express.static(__dirname + "/"))
app.use('/uploads', serveIndex(__dirname + '/uploads'));


var upload = multer({ dest: 'uploads/' })

app.use(fileUpload({
    createParentPath: true
}));

fs.readdirSync(__dirname + '/routes').forEach(function(file) {
          var name = file.substr(0, file.indexOf('.'));
          require('./routes/' + name)(app, upload);
      
});
app.listen(PORT, () => {
  console.log(`APP is now running on port ${PORT}!`);
})
