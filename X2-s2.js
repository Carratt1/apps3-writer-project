var sC = {"docs":{"_queued":{}, "_locked":{}}, "node":{}, "core":{}, "user":{},"x":{}};
    sC.x.ex = require('express');
    sC.x.bp = require('body-parser');
    sC.x.ap = sC.x.ex();
    sC.x.ap.use(sC.x.ex.static('X2-public'));
    sC.x.ap.use(sC.x.bp.json());
    sC.x.sv = require('http').createServer(sC.x.ap);
    sC.x.io = require('socket.io')(sC.x.sv);
    sC.x.l = sC.x.sv.listen(process.env.PORT, function () {
                console.log('SCRWLV2 app is listening : ' + sC.x.l.address().port);
             });



//  sC.x     : core routing

    sC.x.ap.get("/", function (q, r) {r.sendFile(__dirname + '/X2-views/i2.html');});



//  sC.x.io  : io socket functions  

    sC.x.io.on('connection', function(_scrwl){
    
      var _local = {"u":{},"s":{},"e":{}};
      
      _scrwl.emit('initialize', {});
      
      
      //     _scrwl : client - user handlers
            _scrwl.on('sC.server.user.login', function ($X) {
              console.log($X.u);
              _local.u = $X.u;
              _scrwl.emit('sC.client.user.login', {"s":"success", "u":_local.u});
            });
      
            _scrwl.on('sC.server.user.scrwl', function ($X) {
              sC.user.scrwl($X.u, function($S){
                _scrwl.emit('sC.client.user.scrwl', $S);
              });
            });
      
      
            _scrwl.on('sC.server.docs.create', function ($X) {
              sC.docs.create($X, function($D){
                _scrwl.emit('sC.client.docs.create', $D);
              });
            }); 
            _scrwl.on('sC.server.docs.remove', function ($X) {
              sC.docs.remove($X, function($D){
                _scrwl.emit('sC.client.docs.remove', $D);
              });
            }); 
      
            _scrwl.on('sC.server.docs.stream', function ($X) {
              _scrwl.leave(_local.s);
              _local.s = $X.s;
              _scrwl.join(_local.s);
              sC.docs.stream($X.s, function($D){
                _scrwl.emit('sC.client.docs.stream', $D);
              });
            });
      
            _scrwl.on('sC.server.node.update', function ($X) {
              if (sC.docs['_locked'][_local.s]) {
                if (!sC.docs['_queued'][_local.s]) {sC.docs['_queued'][_local.s] = [];}
                sC.docs['_queued'][_local.s].push($X);
              } else {
                sC.docs['_locked'][_local.s] = "true";
                sC.node.update(_local.s, $X, function(y, z){
                  _scrwl.emit(y, z);
                  _scrwl.broadcast.to(_local.s).emit(y, z);
                });
              }    
              _scrwl.broadcast.to(_local.s).emit('sC.client.node.update', $X);
            });      
      
    
      
    });




//  sC.user  : user functions
    sC.user.scrwl = function ($U, $C) {
      var _uS = [];
      var _dQ = require('nedb'), _dB = new _dQ({ filename: '.data/'+$U+'-scrwls', autoload: true });
          _dB.find({}, function (f, l) {
            l.forEach(function(x) {_uS.push(x);});
            $C(_uS);
          });
    };
    //sC.user.login = function($U) {};


//  sC.docs  : document functions
    sC.docs.create = function ($S, $C) {
      console.log($S);
      var _dQ = require('nedb'), _dB = new _dQ({ filename: '.data/'+$S['u']+'-scrwls', autoload: true });
          _dB.insert($S, function (f, x) {
            var _p = new _dQ({ filename: '.data/'+x['u']+'~'+x['_id'], autoload: true });
                _p.remove({}, { multi: true }, function (f) {});
                _p.insert(DEFAULT_SCRWLDATA, function (f, a) {});
            $C(x);
            console.log(x);
          });
    }
    
    sC.docs.remove = function ($X, $C) {
      console.log($X);
      var _dQ = require('nedb'), _dB = new _dQ({ filename: '.data/'+$X['u']+'-scrwls', autoload: true });
          _dB.remove({"_id":$X['s']}, { multi: false }, function (f) {
            $C($X['s']);
          });
    }
    
    sC.docs.stream = function ($S, $C) {
      var _sE =[];
      var _dQ = require('nedb'), _dB = new _dQ({ filename: '.data/'+$S, autoload: true });
          _dB.find().sort({"u":1}).exec(function (f, e) {
            e.forEach(function(x) {_sE.push(x);});
            $C(_sE);
          });
    }
    
    sC.node.update = function ($S, $X, $CB) {
      console.log($X);
      var _s = $S, _o = $X['o'], _e = $X['e'], _c = $X['c'];
      if (_o == '~S') {sC.node.change(_s, _e, _c, function(    ){sC.docs['_locked'][_s] = null; if (sC.docs['_queued'][_s]) { if (sC.docs['_queued'][_s].length != 0) { var _n = sC.docs['_queued'][_s].shift(); sC.docs['_locked'][_s] = 'true'; sC.node.update(_s, _n, $CB);} else {sC.docs['_locked'][_s] = null;};}});}
      if (_o == '~N') {sC.node.create(_s, _e, _c, function(x, e){sC.docs['_locked'][_s] = null; if (sC.docs['_queued'][_s]) { if (sC.docs['_queued'][_s].length != 0) { var _n = sC.docs['_queued'][_s].shift(); sC.docs['_locked'][_s] = 'true'; sC.node.update(_s, _n, $CB);} else {sC.docs['_locked'][_s] = null;};};  $CB('sC.client.node.id',     {"x":x, "e":e}); }); }
      if (_o == '~R') {sC.node.remove(_s, _e, _c, function(e   ){sC.docs['_locked'][_s] = null; if (sC.docs['_queued'][_s]) { if (sC.docs['_queued'][_s].length != 0) { var _n = sC.docs['_queued'][_s].shift(); sC.docs['_locked'][_s] = 'true'; sC.node.update(_s, _n, $CB);} else {sC.docs['_locked'][_s] = null;};};  $CB('sC.client.node.remove', {"e":e });       }); }
      
    }


//  sC.node  : node functions
    sC.node.change = function ($S, $E, $C, $PASS) {
      var _dQ = require('nedb'), _p = new _dQ({ filename: '.data/'+$S, autoload: true });
          _p.find({"_id":$E}).exec(function (f, x) {
            _p.update({ "_id": $E}, { $set: {"c": sC.core.parse(x[0]['c'], $C)} }, { multi: false }, function (f,x){
              $PASS();
            });
          });
    };
    sC.node.create = function ($S, $E, $C, $PASS) {
      var _dQ = require('nedb'), _p = new _dQ({ filename: '.data/'+$S, autoload: true });
          _p.insert($C, function (f, x) {
            $PASS(x, $E);
          });
    };
    sC.node.remove = function ($S, $E, $C, $PASS) {
      var _dQ = require('nedb'), _p = new _dQ({ filename: '.data/'+$S, autoload: true });
          _p.remove({"_id":$E}, { multi: false }, function (f) {
            $PASS($E);
          });
    };



    
  

//  sC.core  : core functions
    sC.core.parse = function ($b, $o) { // $b[ase], $o[perations]
        var b = $b;
        var o = $o;
        o.forEach(function(t){
          var _c = t[1];
          if (_c == "~D") {
            b = b.substring(0, t[0]-1).concat(b.substr(t[0]));
          } else if (_c.substring(0,3) == "~R:") {
            var _n1 = t[0], _n2 = parseInt(_c.replace('~R:',''));
            if (_n1 < _n2) {b = b.substring(0, _n1).concat(b.substr(_n2));} else {b = b.substring(0, _n2).concat(b.substr(_n1));}
          } else {
            b = b.substring(0, t[0]).concat(_c, b.substr(t[0]));
          }
        });
        return b;
    }
    
    
    
    
var DEFAULT_SCRWLDATA = [
    {"e":"h1","v":1, "u":1,"c":"A New SCRWL"},
    {"e":"p","v":1, "u":2,"c":"Start Typing..."}
  ]
//    {"e":"iframe","v":1, "u":4,"c":"https://www.youtube.com/embed/Irl_Dc-Tc8U"}

var DEFAULT_SCRWLS = [
      {"n":"My First SCRWL", "p":"", "u":"CARR203292", "d":"16-04-2017","v":0, "c":"sh"},
      {"n":"Getting Started", "p":"", "u":"CARR203292", "d":"16-04-2017","v":0, "c":"sc"},
      {"n":"Advanced Tips, Ideas", "p":"", "u":"CARR203292", "d":"16-04-2017","v":0, "c":"ll"}
    ];


// CLEAN/DEFAULT/INIT USER?
sC.x.ap.get("/api/:userid/reset", function (req, res) {
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

sC.x.ap.get('/api/:userid/scrwls/:scrwlid/reset', function (req, res) {
  var SCRWL_ELEMS=unescape(req.query);
    var dataquery = require('nedb'), scrwlDB = new dataquery({ filename: '.data/'+req.params.userid+'~'+req.params.scrwlid, autoload: true });
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