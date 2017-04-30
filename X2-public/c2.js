var _local = {"u":'CARR203292', "s":''}; // DEFAULT AUTHORIS

var _scrwl = io();
var sC = {"docs":{"_queued":{}, "_status":0}, "node":{"_idmap":{}}, "core":{"_init":0}, "user":{}};


//  scrwl : initialize
    _scrwl.on('initialize', function () {
      if (sC.core['_init'] == 0) {
        _local.s = document.location.hash;
        _scrwl.emit('sC.server.user.login', { "u": _local.u });
      
      //(listeners)
        window.onhashchange = sC.core.route;
        window.onkeydown = function($EV){sC.core.press($EV);};
        document.getElementById('new-pad').addEventListener('click', sC.core.new);
      
        setInterval(sC.node.update, 1000);
        sC.core['_init']++;
      }
    });


//  scrwl : user logged in
    _scrwl.on('sC.client.user.login', function ($X) {
      if ($X.s == 'success') {
        _local.u = $X.u;
        _scrwl.emit('sC.server.user.scrwl', { "u": _local.u });
        sC.core.route();
      }
    });

//  scrwl : user returned scrwl list
    _scrwl.on('sC.client.user.scrwl', function ($X) {
      sC.user.scrwl($X);
    });

//  scrwl : new doc created
    _scrwl.on('sC.client.docs.create', function ($X) {
      sC.docs.create($X);
    });

//  scrwl : a doc has been removed
    _scrwl.on('sC.client.docs.remove', function ($X) {
      sC.docs.remove($X);
    });
//  scrwl : docs commence scrwl stream
    _scrwl.on('sC.client.docs.stream', function ($X) {
      sC.docs.stream($X);
    });

//  scrwl : docs update from server
  _scrwl.on('sC.client.node.update', function ($X) {

    var _o = $X['o'], _i = $X['e'], _c = $X['c'], _s = _local.s;
    if (_o == '~S') {
      var _e = document.getElementById('scrwl-el-'+_i);
      var _t = sC.core.parse(_e.textContent, _c);
          _e.textContent = _t;
    }
    if (_o == '~N') {
      var _mC = document.getElementById('scrwl-main').childNodes;
      var _tG = parseFloat($X.c.u);
      var _sE = '';
      var _nI = sC.node['_idmap'][$X.e] || $X.e;
      for (var i=0;i<_mC.length;i++) {
        if (i == _mC.length-1) {
          _sE = _mC[i];
        } else if (_tG > parseFloat(_mC[i].getAttribute('data-scrwl-ord')) && _tG < parseFloat(_mC[i+1].getAttribute('data-scrwl-ord'))) {
          _sE = _mC[i];
          break;
        }
      }
      var _nE = document.createElement($X.c.e);
          _nE.setAttribute('id', 'scrwl-el-' + _nI);
          _nE.setAttribute('data-scrwl-ord', $X.c.u);
          _nE.appendChild(document.createTextNode($X.c.c));
          _sE.parentNode.insertBefore(_nE, _sE.nextSibling);
    }
    if (_o == '~R') {
      setTimeout(function() {
        var _n = document.getElementById('scrwl-el-'+_i);
        if (_n) {_n.parentElement.removeChild(_n);};
      }, 1);
    }
    
  });

//  scrwl : node returned ID
    _scrwl.on('sC.client.node.id', function ($X) {
      sC.node.id($X);      
    });







//  sC.user.route  : route user to location
    sC.core.route = function () {
      var $H = document.location.hash;
      var _h = document.location.hash.split('/');
      var _f = document.getElementById('scrwl-flair');
      var _m = document.getElementById('scrwl-main');
          _m.className = _m.className + ' md-alpha-30';
          _f.className = '';
      if (_h){
        if (_h[1] == 'scrwl') {
          _local.s = _local.u + '~' + _h[2];
          _scrwl.emit('sC.server.docs.stream', { "s": _local.s });
        } else if (_h[1] == 'share') {
          // public share URLs
        };
      };
    }

//  sC.user.scrwl  : build scrwl list
    sC.user.scrwl = function ($S) {
      var _sL_list = $S;      
      var _sL_frag = document.createDocumentFragment();
      var _sL_elem = document.getElementById('user-scrwl-list');   
      var _sL_hash = '';
      while (_sL_list.length > 0) {
        var _s = _sL_list.shift();
        if (!document.getElementById('doc-'+_s['_id'])) {
          if (_s.p != '') {var _sP = document.getElementById('doc-'+_s.p) || _sL_frag.getElementById('doc-'+_s.p);};
          if (_sP || _s.p == '') { 
              var _sI = document.createElement('a');
                  _sI.appendChild(document.createTextNode(_s['n']));
                  _sI.setAttribute('id', 'doc-'+_s['_id']);
                  _sI.setAttribute('data-scrwl-key', _s['_id']);
                  _sI.setAttribute('tabindex', '-1');
                  _sL_hash = '#/scrwl/'+_s['_id']+'/';
                  _sI.setAttribute('href', _sL_hash);
                  if (_sP) {
                      _sI.setAttribute('class', 'sub md-gcbg-' + _s['c']);
                      _sP.parentNode.insertBefore(_sI, _sP.nextSibling);              
                  } else {
                      _sI.setAttribute('class', 'md-gcbg-' + _s['c']);
                      _sL_frag.appendChild(_sI);
                  }
          } else {_sL_list.push(_s)};
        }
      }
      _sL_elem.appendChild(_sL_frag);  
      if (_local.s == '') {document.location.hash = _sL_hash;};
    };


//  sC.docs.create  : create a new scrawl
    sC.docs.create = function ($D) {
      var _sI = document.getElementById('doc-'+$D['d']);
          _sI.setAttribute('href', '#/scrwl/'+$D['_id']+'/');
          _sI.setAttribute('data-scrwl-key', $D['_id']);
          _sI.contentEditable = false;
          _sI.setAttribute('id','doc-'+$D['_id']);
    };

//  sC.docs.remove  : remove a scrwl
    sC.docs.remove = function ($D) {
      var _sI = document.getElementById('doc-'+$D);
      if (_sI) {
        alert('remove SI, check if still on SI page, and then navigate away...')
      }
    };

//  sC.docs.stream  : commence streaming scrwl document
    sC.docs.stream = function ($S) {
      var _sD_pakg = $S;       
      var _sD_elem = document.getElementById('scrwl-main'); 
      var _sD_frag = document.createDocumentFragment();
      while (_sD_elem.hasChildNodes()) {_sD_elem.removeChild(_sD_elem.firstChild);};
      while (_sD_pakg.length > 0) {
        var e = _sD_pakg.shift();
        var _el = document.createElement(e.e);
            _el.setAttribute('id', 'scrwl-el-'+e['_id']);
            _el.setAttribute('data-scrwl-ord', e.u);
        if (e.e == 'p' || e.e == 'h1' || e.e == 'h2' || e.e == 'h3') {_el.appendChild(document.createTextNode(e.c));};
        if (e.e == 'img' || e.e == 'video' || e.e == 'iframe') {_el.setAttribute('src', e.c)};
        _sD_frag.appendChild(_el); 
      }
      _sD_elem.appendChild(_sD_frag);
      _sD_elem.contentEditable = true;
    //_sD_elem.addEventListener("dblclick", function(){this.contentEditable = true; this.focus();});
      sC.core.menu(_local.s.split('~')[1]);
    }

//  sC.node.update  : periodic function, checks queue and updates server $F[lush]/$C[allback]
    sC.node.update = function ($F, $C) {
      if ($F || (sC.docs['_queued'] && (sC.docs['_status'] == 0))) {
          for (var _el in sC.docs['_queued']) {
            if (/[A-Za-z]/.test(_el)) {
              if (sC.docs['_queued'].hasOwnProperty(_el)) {
                  var _c = [];
                  while (sC.docs['_queued'][_el].length > 0) {
                    _c.push(sC.docs['_queued'][_el].shift());
                  };
                  if (_c.length > 0) {_scrwl.emit('sC.server.node.update', {"o": '~S', "e": _el, "c" : _c });};
              }
            }
          }
      };
      if ($C) {$C();}
    }
    
    

//  sC.core.new  : makes a new scrwl in the menu
    sC.core.new = function() {
      var _tI = Date.now()
      var _sL = document.getElementById('user-scrwl-list');
      
      if (/[A-Za-z]/.test(_sL.childNodes[_sL.childElementCount-1].getAttribute('id').replace('doc-',''))) {
        var _sI = document.createElement('a');
        var _sC = sC.core.color();
            _sI.appendChild(document.createTextNode(''));
            _sI.setAttribute('id', 'doc-'+_tI);
            _sI.setAttribute('data-scrwl-key', _tI);
            _sI.setAttribute('tabindex', '-1');
            _sI.setAttribute('class', 'md-gcbg-' + _sC);
            _sI.contentEditable = true;
            _sL.appendChild(_sI);
            _sI.focus();
            _sI.addEventListener("keydown", function cE(ev){
              if (ev.keyCode == 13 || ev.which == 13) {
                ev.preventDefault();
                _sI.blur();
              }
            });
            _sI.addEventListener("blur", function mD(ev){
              if (_sI.textContent != '') {
                _scrwl.emit('sC.server.docs.create', { "n":_sI.textContent, "p":"", "u":_local.u, "d":_tI, "c": _sC});
                _sI.removeEventListener("blur", mD);
                _sI.removeEventListener("keydown", cE);
              }
            });
      } else {_sL.childNodes[_sL.childElementCount-1].focus();}
    }
    
  
//  sC.core.color  : returns a random color code for a gradient
    sC.core.color = function() {
      var _rN = Math.floor(Math.random() * 32); // 0-30
      var _rC = ['ll','sc','em','hd','cf','sm','be','va','jt','hl','rw','bm','sh','mt','pn','nl','al','tr','az','cy','dt','sg','nd','st','tm','mn','rf','pn','bl','pk','og',    'pn','rw','og']
      return _rC[_rN];
    }

    
//  sC.core.menu  : makes a scrwl menu item active
    sC.core.menu = function ($I) {
      var _sL_flar = document.getElementById('scrwl-flair');
      var _sL_menu = document.getElementById('user-scrwl-list'); 
      var _sL_body = document.getElementById('scrwl-main');
      var _sL_acti = document.getElementById('doc-'+$I);      
          _sL_menu.childNodes.forEach(function(x){
            if (x.className) {x.className = x.className.replace(' active','')};
            if (x.childNodes.length > 1) {x.removeChild(x.childNodes[1]);};
          });
          _sL_body.className = _sL_body.className.replace(/ md-alpha-30/g,'');
      if (_sL_acti) {
        _sL_acti.className = _sL_acti.className + ' active';
        _sL_flar.className = _sL_acti.className;
        var _y = document.createElement('span');
            _y.appendChild(document.createTextNode('x'));
            _sL_acti.appendChild(_y);
            _y.addEventListener('click', function(){
              _scrwl.emit('sC.server.docs.remove', {"u": _local.u, "s": $I});
            });
      };
    };     


//  sC.core.press  : handles keypress capture events
    sC.core.press = function ($EV) {

      var _k = $EV.which || $EV.keyCode;
      var _x = window.getSelection();          
      var _e = window.getSelection().focusNode.parentNode;
      var _eI = _e.id.replace('scrwl-el-','');
      var _cP = _x.anchorOffset;      
      
      if (!sC.docs['_queued'][_eI]) {sC.docs['_queued'][_eI] = []};
      if (_e.id.indexOf('scrwl-el-') == 0) {
        if (_e.textContent.charCodeAt(_e.textContent.length-1) != 160) {_e.appendChild(document.createTextNode("\u00A0")); _e.normalize();};
        if ( (_k == 32 || _k > 47 && _k < 58) || (_k > 64 && _k < 91) || (_k > 95 && _k < 112) || (_k > 185 && _k < 193) || (_k > 218 && _k < 223) ) {
            if (_cP == _e.textContent.length) {
              _e.textContent = _e.textContent.substr(0, _cP) + " " + _e.textContent.substr(_cP, _cP+1);
              sC.docs['_queued'][_eI].push([_cP ," "]);
              sC.core.focus(_e, _cP);
            };
            if (_x.type == 'Range') {
              if (_x.anchorNode.parentElement == _x.focusNode.parentElement) {sC.docs['_queued'][_eI].push([_cP , "~R:"+_x.focusOffset]);
              } else {sC.core.multi(_x, _k);};
            } else {
             setTimeout(function(_cPo, _eI, _e){
              sC.docs['_queued'][_eI].push([_cP , _e.textContent.charAt(_cP)]); 
             },1, _cP, _eI, _e); 
            }
        } else if (_k == 8) {
          if (_x.type == 'Range') {
            if (_x.anchorNode.parentElement == _x.focusNode.parentElement) {sC.docs['_queued'][_eI].push([_cP , "~R:"+_x.focusOffset]);
            } else {sC.core.multi(_x, _k);};
            };
          if (_x.type == 'Caret') {sC.docs['_queued'][_eI].push([_cP , "~D"])}; 
        } else if (_k == 13) {
          sC.node.create([_e, _cP]);
          $EV.preventDefault();
        }
      } else {
       // not editing         
      }   
    }
    
//  sC.core.focus  : creates focus / selects text/element
    sC.core.focus = function ($E, $P) {
      var _r = document.createRange(), _s = window.getSelection();
          _r.setStart($E.childNodes[0], $P);
          _r.collapse(true);
          _s.removeAllRanges();
          _s.addRange(_r);
    }
    
//  sC.core.multi  : handles multiple-element-selection scenarios
    sC.core.multi = function ($X, $K) {
      var _x = $X, _fN = _x.anchorNode.parentElement, _sN = _x.focusNode.parentElement, _fO = _x.anchorOffset, _sO = _x.focusOffset;
      var _fI = _fN.id.replace('scrwl-el-',''), _sI = _sN.id.replace('scrwl-el-','');
      if (parseFloat(_fN.getAttribute('data-scrwl-ord')) > parseFloat(_sN.getAttribute('data-scrwl-ord'))) {var _TMP = _sN; _sN = _fN; _fN = _TMP; _TMP = _sO; _sO = _fO; _fO = _TMP; _TMP = _sI; _sI = _fI; _fI = _TMP;};      
      if (!sC.docs['_queued'][_fI]) {sC.docs['_queued'][_fI] = []};
           sC.docs['_queued'][_fI].push([_fO , "~R:"+_fN.textContent.length]);
      setTimeout(function(_cP, _eI, _e){
        sC.docs['_queued'][_eI].push([_cP , _e.textContent.charAt(_cP)]); 
      },1, _fO, _fI, _fN);
      var _cA = _sN.textContent.substring(_sO, _sN.textContent.length).trim().split(''), _cO = _fO, _i = 0;      
        if ($K != 8) {_cO++;}
        _cA.forEach(function(){
            sC.docs['_queued'][_fI].push([_cO , _cA[_i]]);
            _cO++; _i++;
          });
      var _iE = _fN;
      for (var _i = 0; _i < 500; _i++) {
        if (_iE.nextSibling == _sN) {
          sC.node.remove(_sI);
          break;
        } else {
          sC.node.remove(_iE.nextSibling.id.replace('scrwl-el-',''));
          _iE = _iE.nextSibling;
        }
      };
      
      
//  TODO: something with $K/key value; ensure we're still recording the character the user overwrote paragraphs with?
//  TODO: if there are any nodes in between these two nodes, we collapse them, remove all their contents, too.      
    }    
 
//  sC.core.parse : given orginal text and a list of transforms, return new text
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
    
    
//  sC.node.id  : parse the newly given ID for a node $X = [E:[Original-ID], X:[El-Package]]
    sC.node.id = function ($X) {
      var _oI = $X['e'], _nI = $X['x']['_id'];
      console.log('change: ' +_oI+ ' to: '+_nI);
      if (document.getElementById('scrwl-el-'+_oI)) {
        document.getElementById('scrwl-el-'+_oI).id = 'scrwl-el-'+_nI;
        if (sC.docs['_queued'][_oI]) {
            if(sC.docs['_queued'][_nI]) {
              sC.docs['_queued'][_oI].forEach(function(){
                sC.docs['_queued'][_nI].unshift(sC.docs['_queued'][_oI].pop());
              });
            } else {sC.docs['_queued'][_nI] = sC.docs['_queued'][_oI];}
            sC.docs['_queued'][_oI] = [];
          };
          setTimeout("if (sC.docs['_status'] > 0){sC.docs['_status']--;};",500);
      } else {
        sC.node['_idmap'][_oI] = _nI;
      }
    };
    
    
//  sC.node.create  : generates a new node $X = [E[lement], C[aretPos]]
    sC.node.create = function ($X) {
      var _eI = '', _nT = '', _pO = '', _tI = Date.now();;
      if ($X) {
        _eI = $X[0].id.replace('scrwl-el-','');
        _nT = $X[0].textContent.substring($X[1], $X[0].textContent.length);
        _pO = parseFloat($X[0].getAttribute('data-scrwl-ord')) + 1;
        if ($X[0].nextSibling) {
          _pO = parseFloat($X[0].getAttribute('data-scrwl-ord')) + ((parseFloat($X[0].nextSibling.getAttribute('data-scrwl-ord')) - parseFloat($X[0].getAttribute('data-scrwl-ord')))/2);
        }
        sC.docs['_queued'][_eI].push([$X[1], "~R:"+$X[0].textContent.length]);
        $X[0].textContent = $X[0].textContent.substring(0, $X[1]);
      };
      var _nE = document.createElement('p');
          _nE.setAttribute('id', 'scrwl-el-' + _tI);
          _nE.setAttribute('data-scrwl-ord', _pO);
          _nE.appendChild(document.createTextNode(_nT));
      if ($X) {$X[0].parentNode.insertBefore(_nE, $X[0].nextSibling);}
      else {document.getElementById('scrwl-main').appendChild(_nE);}      
      sC.docs['_status']++;
      sC.node.update('Y', function(){        
        _scrwl.emit('sC.server.node.update', {"o": '~N', "e": _tI, "c" : {"e":"p", "u":_pO, "c":_nT}});
      });      
      sC.core.focus(_nE, 0);
      
    }
    
//  sC.node.remove  : destroys a node / $E[lement ID]
    sC.node.remove = function($E) {
      setTimeout(function() {
        var _n = document.getElementById('scrwl-el-'+$E);
        if (_n) {_n.parentElement.removeChild(_n);};
      }, 1);
      _scrwl.emit('sC.server.node.update', {"o": '~R', "e": $E, "c" : {}});
    }

