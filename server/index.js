var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8000;
const bodyParser = require('body-parser'); 
const myConnection =  require('express-myconnection')

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());



var mysql = require('mysql');


app.use(myConnection(mysql, {
  host: 'sql138.main-hosting.eu.',
  user: 'u868365439_diag',
  password: '123456',
  database: 'u868365439_diag'
}, 'single'));
/*
var connection = mysql.createConnection({
   host: 'sql138.main-hosting.eu.',
   user: 'u868365439_diag',
   password: '123456',
   database: 'u868365439_diag'
});
*/

/*var connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'diagramsql',
   port: 3306
});
*/

/*connection.connect(function(error){
   if(error){
      throw error;
   }else{
      console.log('Conexion correcta.');
   }
});
*/

app.use(express.static('public'));

app.post('/registrar',(req,res)=>{
  var query = connection.query("INSERT INTO `usuario`(`id`, `nombre`, `email`, `password`, `grupo`, `estado`) VALUES (NULL,'"+req.body.nombre+"','"+req.body.correo+"','"+req.body.pass+"','sa',1)", 
  function(error,result){
      if(error)
      throw error;
      else {
          res.status(200).send({operation:true});
      }
  });
});


app.post('/ingresar/',(req,res) =>{
  console.log("entro");
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM `usuario` WHERE email='"+req.body.email+"' and password = '"+req.body.password+"'", (error, result) =>{
      console.log(result);
        if(error)
        throw error;
        else {
          if(result.length > 0)
            res.status(200).send({access : true, datos : result});
          else
            res.status(200).send({access: false});
        }
    });
   });
    
});

/*app.post('/getUsuario', (req, res) => {
      var query = connection.query("SELECT * FROM usuario WHERE id = " + req.body.usuario_id,
    function(error,result){
      if(result.length > 0)
        res.status(200).send({access: true, nombre : result[0].nombre});
        else
        res.status(200).send({access: false});
    });
});*/

app.post('/getUsuario', (req, res) => {
      req.getConnection((err, conn) => {
    conn.query("SELECT * FROM usuario WHERE id = " + req.body.usuario_id, (error, result) =>{
      if(result.length > 0)
        res.status(200).send({access: true, nombre : result[0].nombre});
        else
        res.status(200).send({access: false});
    });
   });
});



io.on('connection',function (socket) {
  console.log("alguien se conecto");

  socket.on('servidor',function(data){
       if(data.length != undefined)
        io.emit('mensajes',data);
         else{
           var sql = ""
          io.emit('cliente',data);
          /* var query = connection.query('UPDATE `proyecto` SET `xml`='+data.xml, 
          function(error,result){
              if(error)
              throw error;
              else {
                  res.status(200).send({operation:true});
              }
          }); */
         }
        
  });
});



server.listen(port, function () {
  console.log("inicio el servidor en el puerto..",port);
});
