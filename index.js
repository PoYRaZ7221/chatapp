var express = require('express');
const { URLSearchParams } = require('url');
const PORT = process.env.PORT || 8001
var socket = require('socket.io');
const fetch = require('node-fetch');
//const translate = require('google-translate-api');
var app = express();
var baseurl = 'http://ramazanoglu.email/api/index.php';
app.use(express.static('public'))

var server = app.listen(PORT,()=>{
    console.log('server start port : ',PORT);
});

var io= socket(server);

translate = async (text) => {
    var formData = new URLSearchParams();
    formData.append('msg',text);
    //console.log(formData);
    var data = await fetch(baseurl+`/translate`,{method:'POST',body:formData});
    var json = await data.json();
    console.log(json);
    return json
}



io.on('connection',function(socket){
    //console.log("soket bağlantısı yapıldı");
    socket.on('chat',(data)=>{
        //console.log(data);
        translate(data.msg).then(res => {
        data.ing = res.text;
        io.sockets.emit('chat',data);
        //console.log(data);
        }).catch(err => {
           // console.error(err);
        });
    });
   
});