var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var getId = require('./helper/idGenerator');
var getIdObj = new getId();
var deviceIdAll = {};
var MongoClient = require('mongodb').MongoClient
, format = require('util').format;
    
app.get('/', function(req, res){
  res.sendfile(__dirname+'/map.html');
});
let locArray = {};
let tempArray = {};
let gLat = 25.435801;
let gLng = 81.846311;
locArray.location = [];
tempArray['lat'] = gLat;
tempArray['lng'] = gLng;
locArray.location[0] = tempArray;
io.on('connection', function(socket){
    socket.on('setLatLng',function(data){
        var lat = data.lat;
        var lng = data.lng;
        gLat = lat;
        gLng = lng;
        var data1 = {};
        var channelId = getIdObj.getRandomId(); 
        var deviceId = data.deviceID;
        var maindata = {};
        maindata.location = [];
        maindata['deviceId'] =deviceId;
        data1['lat'] =lat;
        data1['lng'] =lng;
        locArray.location[1] =data1;
        maindata.location[0] =data1;
            MongoClient.connect('mongodb://127.0.0.1:27017/location', function (err, db) {
            if (err) {
                throw err;
                } else {
                    var collection  = db.collection('your collection name');
                    collection.find({device_id:deviceId}).toArray(function(err,result){
                        if(result.length>0){
                            collection.update({ device_id : deviceId },{$push:{location:data1}},{ upsert: true }, function(err, numberAffected){});
                        }else{
                            collection.update({device_id: deviceId},{$set:maindata},{ upsert: true })
                        }
                        let data2 = {"lat":gLat,"lng":gLng};
                        socket.broadcast.emit('getLatLng',{data2});
                        socket.on('disconnect', function () {
                            socket.broadcast.emit('trackAllLocation',{locArray});
                        });
                        db.close();
                    });
                }
            });
        });
    socket.on('deviceID',function(data){
        console.log(data);
        console.log("First Block");
        deviceIdAll[data]=socket;
        console.log(deviceIdAll);
    });
});

  
http.listen(3000, function(){
  console.log('listening on localhost:3000');
});

