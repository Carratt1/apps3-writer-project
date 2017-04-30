  var scrwl = {"node":{"collapse":{"do":{}}}, "core":{},"server":{"update":{"_queue":{}, "_locked":{}, "do":{}}}};
  var eth = {};

      eth.ex = require('express');
      eth.bp = require('body-parser')
      eth.ap = eth.ex();
      eth.ap.use(eth.ex.static('public'));
      eth.ap.use(eth.bp.json());
      eth.sv = require('http').createServer(eth.ap);
      eth.io = require('socket.io')(eth.sv);

      eth.l = eth.sv.listen(process.env.PORT, function () {
        console.log('SCRWL app is listening : ' + eth.l.address().port);
      });
    

  // --------------------------
  // SCRWL APP : Server Functions

      scrwl.server.update.do = function($s, $e, $c) { // $s[crwl], $e[lement], $c[ontents]
        
        var _fN = $s.replace('~', '-scrwls-');
        var _dQ = require('nedb'), _p = new _dQ({ filename: '.data/'+_fN, autoload: true });

        _p.find({"_id":$e}).exec(function (f, x) {
            _p.update({ "_id": $e}, { $set: {"c": scrwl.core.parse(x[0]['c'], $c)} }, { multi: false }, function (f,x){
              scrwl.server.update['_locked'][$s] = null;
              if (scrwl.server.update['_queue'][$s]) {
                if (scrwl.server.update['_queue'][$s].length != 0) {
                  var _N = scrwl.server.update['_queue'][$s].shift();
                  scrwl.server.update['_locked'][$s] = 'true';
                  scrwl.server.update.do($s, _N[0], _N[1]);
                } else {scrwl.server.update['_locked'][$s] = null;};
              }
            });
        });

      }
  
  // --------------------------
  // SCRWL APP : Node Functions
      
      scrwl.node.collapse.do = function($s, $i, $r, $c) { // $s[crwl], $i[d-to be destroyed], $r[ehome-contents], $c[ontents-saved]
       
        var _fN = $s.replace('~', '-scrwls-');
        var _dQ = require('nedb'), _p = new _dQ({ filename: '.data/'+_fN, autoload: true });

        _p.remove({"_id":$i}, {});
        _p.find({"_id":$r}).exec(function (f, x) {
            _p.update({ "_id": $r}, { $set: {"c": x[0]['c'].concat($c)} }, { multi: false }, function (f,x){
            });
        });
        
      }
      
      
  // --------------------------
  // SCRWL APP : Core Functions
      
      scrwl.core.parse = function ($b, $o) { // $b[ase], $o[perations]
        var b = $b;
        var o = $o;
        o.forEach(function(t){
          var _char = t[1];
          if (_char == "~D") {
            b = b.substring(0, t[0]-1).concat(b.substr(t[0]));
          } else if (_char.substring(0,3) == "~R:") {
            var _n1 = t[0], _n2 = parseInt(_char.replace('~R:',''));
            if (_n1 < _n2) {b = b.substring(0, _n1).concat(b.substr(_n2));} else {b = b.substring(0, _n2).concat(b.substr(_n1));}
          } else {
            b = b.substring(0, t[0]).concat(_char, b.substr(t[0]));
          }
        });
        return b;
      };




  // --------------------------
  // ETHER : Routing Functions

     eth.ap.get("/", function (q, r) {r.sendFile(__dirname + '/views/index.html');});





eth.io.on('connection', function(socket){
  
  var CURRENT_USER = '';
  var CURRENT_SCRWL = '';
  var CURRENT_EDITS = {};
    
  // NEW FUNCTIONS

  var L = {"s":'',"u":''}

  socket.on('scrwl.server.update', function(x) {
    if (scrwl.server.update['_locked'][L['s']]) {
      if (!scrwl.server.update['_queue'][L['s']]) {scrwl.server.update['_queue'][L['s']] = [];}
      scrwl.server.update['_queue'][L['s']].push([x['e'], x['c']]);
    } else {
      scrwl.server.update['_locked'][L['s']] = "true";
      scrwl.server.update.do(L['s'], x['e'], x['c']);
    }    
    socket.broadcast.to(L['s']).emit('scrwl.client.update', x);
  });
  
  
  socket.on('scrwl.node.collapse', function(x) {
    // TEMPORARY : rebuild scrwl.node functionality to involve an operations/queue function
    scrwl.node.collapse.do(L['s'], x['i'], x['r'], x['c']);   
  });
  
  
  
  // OLD FUNCTIONS
  
  socket.emit('handshake', { hello: 'user' });
  socket.on('identify', function (data) {console.log(data); CURRENT_USER = data; L['u']= data;});
  socket.on('stream', function(data) { socket.join(data.SCRWL); CURRENT_SCRWL = data.SCRWL; L['s']= data.SCRWL;})
  socket.on('scrwl_upd', function(data) { socket.broadcast.to(CURRENT_SCRWL).emit('scrwl_upd', data);});
  
  socket.on('scrwling', function(x) {
    scrwl.update(CURRENT_SCRWL, x['$ID'], x['$P']);
    socket.broadcast.to(CURRENT_SCRWL).emit('scrwl_upds', x);
  });
  
  


});






// OLD FUNCTIONALITY -----------------
  
  scrwl.server.update.OLDDOBATCH = function() { //scrawl
    var $s = scrwl.server.update['_active'].shift();
    if ($s) {

      var s = $s.replace('~', '-scrwls-');

      var _dQ = require('nedb'), _p = new _dQ({ filename: '.data/'+s, autoload: true });
      
      var _u = [];
      var e = [];
      var c = [];
      var _nP = [];
      var _R = [];
      var l = 0;
      
      while (l<scrwl.server.update['_queue'][$s].length) {
        _u[l] = scrwl.server.update['_queue'][$s].shift();
        e[l] = _u[l][0];
        c[l] = _u[l][1];
        l++;        
      };
      
      for(var i=0; i<_u.length;i++) {
        _p.find({"_id":e[i]}).exec(function (f, x) {
          _R.push(x[0]['c']);
          if (i==_u.length) {
            for(var j=0; j<_u.length;j++) {
              _nP[j] = scrwl.core.parse(_R[j], c[j]);
              _p.update({ "_id": e[j]}, { $set: {"c": _nP[j]} }, { multi: false }, function (f,x){});
            }
          };
        });
      }
                                        
      } // else {if ((scrwl.server.update['_queue'][$s].length == 0)) {scrwl.server.update['_active'][$s] = "none";};};
  };
        
  
  



//---------------------------------------**************
// TEMPORARY - DEFAULTS DATA
var DEFAULT_SCRWLS = [
      {"n":"My First SCRWL", "p":"", "u":"CARR203292", "d":"16-04-2017","v":0, "c":"og"},
      {"n":"Getting Started", "p":"", "u":"CARR203292", "d":"16-04-2017","v":0, "c":"pk"},
      {"n":"Advanced Tips, Ideas", "p":"", "u":"CARR203292", "d":"16-04-2017","v":0, "c":"bl"}
    ];
var DEFAULT_SCRWLDATA = [
    {"e":"h1","v":1, "u":1,"c":"Welcome to SCRWL.CO"},
    {"e":"p","v":1, "u":7,"c":"Two driven jocks help fax my big quiz. Quick, Baz, get my woven flax jodhpurs! &quote;Now fax quiz Jack!&quote; my brave ghost pled. Five quacking zephyrs jolt my wax bed. Flummoxed by job, kvetching W. zaps Iraq. Cozy sphinx waves quart jug of bad milk. A very bad quack might jinx zippy fowls. Rick quiz whangs jumpy veldt fox. Bright vixens jump; dozy fowl quack. Quick wafting zephyrs vex bold Jim. Quick zephyrs blow, vexing daft Jim. Sex-charged fop blew my junk TV quiz. How quickly daft jumping zebras vex."}
  ]

//---------------------------------------**************


// # API Functions

    // Return User SCRWLs
    eth.ap.get("/api/:userid/scrwls", function (req, res) {
      var USER_SCRWLS=[];
      var dataquery = require('nedb'), scrwlDB = new dataquery({ filename: '.data/'+req.params.userid+'-scrwls', autoload: true });
      scrwlDB.find({}, function (err, scrwl) {
        scrwl.forEach(function(scrwl) {
          USER_SCRWLS.push(scrwl);
        });
        res.send(USER_SCRWLS);
      });
    });

    // Return SCRWL package (TBC: 'v' optional param in query)
    eth.ap.get('/api/:userid/scrwls/:scrwlid', function (req, res) {
      var SCRWL_ELEMS=[];
        var dataquery = require('nedb'), scrwlPAX = new dataquery({ filename: '.data/'+req.params.userid+'-scrwls-'+req.params.scrwlid, autoload: true });
        scrwlPAX.find().sort({"u":1}).exec(function (err, scrwl) {
        scrwl.forEach(function(scrwl) {
          SCRWL_ELEMS.push(scrwl);
        });
        res.send(SCRWL_ELEMS);
      });
    });



    // Create new SCRWL
    eth.ap.get('/api/:userid/scrwls/new/:scrwlname', function (req, res) {
      var SCRWL_NEW = {name: req.params.scrwlname, keyid: 'RANDOMKEYX'};
      var dataquery = require('nedb'), scrwlDB = new dataquery({ filename: '.data/'+req.params.userid+'-scrwls', autoload: true });
      scrwlDB.insert(SCRWL_NEW, function (err, success) {
        if(err) console.log("There's a problem with the database: ", err);
        else if(success) console.log("New SCRWL inserted in the database");
      });
      // TBC: add a new default sheet into the SCRWL (create the base)
      // TBC: generate a perfectly random key for each
      res.send([SCRWL_NEW]);
    });

    // Create new Element in the given SCRWL
    eth.ap.post('/api/:userid/scrwls/:scrwlid/new', function (req, res) {
      var SCRWL_ELEM = req.body;
        var dataquery = require('nedb'), scrwlPAX = new dataquery({ filename: '.data/'+req.params.userid+'-scrwls-'+req.params.scrwlid, autoload: true });
        scrwlPAX.insert(SCRWL_ELEM, function (err, newElem) {
          if(err) {console.log("There's a problem with the database: ", err);}
          else if(newElem) {  res.send(newElem);}
        });
    });


  // scrwlapp functions

    scrwl.update = function (scrwl, element, content) {
      
      var scrwl_name = scrwl.replace('~', '-scrwls-');
      
      var _dQ = require('nedb'), _p = new _dQ({ filename: '.data/'+scrwl_name, autoload: true });
        _p.find({"_id":element}).exec(function (err, x) {
          console.log(x);
        });
      
    }





//---------------------------------------**************
// TEMPORARY - VARIOUS

eth.ap.post("/api/:userid/scrwls/new", function (req, res) {
  var dataquery = require('nedb'), scrwlDB = new dataquery({ filename: '.data/'+req.params.userid+'-scrwls', autoload: true });
  scrwlDB.insert({ name: req.query.name, keyid: req.query.keyid}, function (err, success) {
    if(err) console.log("There's a problem with the database: ", err);
    else if(success) console.log("New SCRWL inserted in the database");
  });
  res.sendStatus(200);
});

// CLEAN/DEFAULT/INIT USER?
eth.ap.get("/api/:userid/reset", function (req, res) {
  // removes all entries from the collection
  var dataquery = require('nedb'), scrwlDB = new dataquery({ filename: '.data/'+req.params.userid+'-scrwls', autoload: true });
  scrwlDB.remove({}, { multi: true }, function (err) {
    if(err) console.log("There's a problem with the database: ", err);
    else console.log("Database cleared");
  });
  // default users inserted in the database
  scrwlDB.insert(DEFAULT_SCRWLS, function (err, usersAdded) {
    if(err) console.log("There's a problem with the database: ", err);
    else if(usersAdded) console.log("Default user scrawl list inserted in the database");
  });
  res.send("Reset User Scrawls")
});

// INSERT DEFAULT SCRWL DATA?
eth.ap.get('/api/:userid/scrwls/:scrwlid/reset', function (req, res) {
  var SCRWL_ELEMS=unescape(req.query);
    var dataquery = require('nedb'), scrwlDB = new dataquery({ filename: '.data/'+req.params.userid+'-scrwls-'+req.params.scrwlid, autoload: true });
    scrwlDB.remove({}, { multi: true }, function (err) {
        if(err) console.log("There's a problem with the database: ", err);
        else console.log("Database cleared");
      });
    scrwlDB.insert(DEFAULT_SCRWLDATA, function (err, usersAdded) {
    if(err) console.log("There's a problem with the database: ", err);
    else if(usersAdded) console.log("Default SCRAWL DATA inserted in the database");
    });
  res.send("Reset Scrawl")
});
