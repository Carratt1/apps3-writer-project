var USER_TOKEN = 'CARR203292'; // DEFAULT AUTHORIS      var _sendUpdates = setInterval(scrwl.server,ATION: Charlie
var CURRENT_HASH = '';


var MAINE_EL = document.getElementById('scrwl-main');
var FLAIR_EL = document.getElementById('scrwl-flair');

var EDITING_MODE = 0;
var EDITING_ELEM = '';
var EDITING_DOC = '';
var EDITING_CRT = '';
var EDITING_LOG = {};

//loadSCRWLelems('CARR203292','103948uhsd')
//loadSCRWLelems('', '10384ujuhsd')

var socket = io();
var SCRWLAPP = {"init":{}, "D":{}, "Q":{}, "V":{}, "C":{}, "F":{}};
var scrwl = {"server":{"update":{"_queue":{}, "_status":0}}};
  
    scrwl.server.update.do = function() {
      if (scrwl.server.update['_queue'] && scrwl.server.update['_status'] == 0) {
          //TBC: iterate through the element IDs in server update queue and pass the array of changes to server
          for (var _el in scrwl.server.update['_queue']) {
            if (scrwl.server.update['_queue'].hasOwnProperty(_el)) {
                var _c = [];
                while (scrwl.server.update['_queue'][_el].length > 0) {
                  _c.push(scrwl.server.update['_queue'][_el].shift());
                };
                if (_c.length > 0) {socket.emit('scrwl.server.update', {"e": _el, "c" : _c }); console.log(_c);};
            }
          }        
      };
    }


    SCRWLAPP.init = function() { // initial loading behaviour of t      var _sendUpdates = setInterval(scrwl.server,he SCRWL APP
      var LOAD_INIT_FLAG = 0;
      
      var _sendUpdates = setInterval(scrwl.server.update.do, 1000);
      
      if (document.location.hash == '' || document.location.hash == '#' || document.location.hash == '#/') {LOAD_INIT_FLAG = 1;};
      this.Q.loadSCRWLs(USER_TOKEN, SCRWLAPP.V.e1_listSCRWLs, {"$EL":"user-scrwl-list", "$L":LOAD_INIT_FLAG});
     
      
      window.onhashchange = SCRWLAPP.C.route;
      
      window.onkeydown = function (ev) {
        var _key = ev.which || ev.keyCode;
        if ((_key == 13 || _key == 13) && EDITING_MODE == 1) {
          SCRWLAPP.F.newNode('ENTER');
          ev.preventDefault();
        } else if (EDITING_MODE == 1) { // character keypress detected; changes streaming
          
          if (EDITING_ELEM.innerText.charCodeAt(EDITING_ELEM.innerText.length-1) != 160) {EDITING_ELEM.appendChild(document.createTextNode("\u00A0")); EDITING_ELEM.normalize();};
          
          var _eID = EDITING_ELEM.getAttribute('id').replace('scrwl-el-','');
          var _cPo = window.getSelection().anchorOffset;            
          
          if (!scrwl.server.update['_queue'][_eID]) {scrwl.server.update['_queue'][_eID] = []};
          
            if (_key == 8 || _key == 8) {
                if (window.getSelection().type == "Range") {scrwl.server.update['_queue'][_eID].push([_cPo , "~R:"+window.getSelection().focusOffset]);
                } else if (_cPo == 0) {SCRWLAPP.F.collapseNode('DELETE'); return false;
                } else {scrwl.server.update['_queue'][_eID].push([_cPo , "~D"]);};
            }
            else if (_cPo == EDITING_ELEM.innerText.length-1 && (_key == 39 || _key == 40)) {return false;}
            else if ( (_key == 32 || _key > 47 && _key < 58) || (_key > 64 && _key < 91) || (_key > 95 && _key < 112) || (_key > 185 && _key < 193) || (_key > 218 && _key < 223) ) {
                  if (window.getSelection().type == "Range") {scrwl.server.update['_queue'][_eID].push([_cPo , "~R:"+window.getSelection().focusOffset]);};
                  setTimeout(function(_cPo, _eID, _spC){
                    if (!scrwl.server.update['_queue'][_eID]) {scrwl.server.update['_queue'][_eID] = []};
                         scrwl.server.update['_queue'][_eID].push([_cPo , EDITING_ELEM.innerText.charAt(_cPo)]); 
                  },1, _cPo, _eID);              
            }
                      
        } else if (EDITING_MODE == 'X') { // OLD CHARACTER DETECTION
            var _kC = ev.which || ev.keyCode;
                if (_kC != 16) {
                    var _case = ev.shiftKey;
                        console.log(UKM[_kC])
                    var _char = UKM[_kC];
                    if (_case && _kC < 91 && _kC < 64) {_char = _char.toUpperCase()} else {_char = _char.toLowerCase()};
                    if (_case && _kC < 91 && _kC < 64) {_char = _char.toUpperCase()} else {_char = _char.toLowerCase()};
                    var editID = EDITING_ELEM.getAttribute('id').replace('scrwl-el-','');
                    var editObj = [window.getSelection().anchorOffset, _char]
                    if (!scrwl.server.update['_queue'][editID]) {scrwl.server.update['_queue'][editID] = []};
                        scrwl.server.update['_queue'][editID].push(editObj); 
                }
        } else {return true;}
      };

      
      socket.on('handshake', function (data) {
        console.log(data);
        socket.emit('identify', { uID: USER_TOKEN });
      });
      
      socket.on('scrwl_upd', function (data) {console.log(data);});

    
    };          
                
    SCRWLAPP.C.load = function($PTH, $SUCC, $FAIL, $PAY) {
      var req = 'GET'
      var load = new XMLHttpRequest();
      if ($PAY) {req = 'POST'};
          load.open(req, $PTH, true);
          load.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
          load.onload = function() {
            if (load.status >= 200 && load.status < 400) {$SUCC(JSON.parse(load.responseText));} else {$FAIL;};};
          load.onerror = function() {$FAIL;};
      if ($PAY) {load.send($PAY);} else {load.send();};
    };

    SCRWLAPP.C.route = function() {
      
      FLAIR_EL.className = '';
      MAINE_EL.className = MAINE_EL.className + ' md-alpha-30';
      
      EDITING_MODE = 0;
      
      if (document.location.hash == '' || document.location.hash == '#' || document.location.hash == '#/') {
        document.location.hash = '#/'
      } else {
        var hash_locale = document.location.hash.split('/');
            if (hash_locale[1] == 'scrwl') {
              SCRWLAPP.Q.streamSCRWL(USER_TOKEN, hash_locale[2], SCRWLAPP.V.e1_renderSCRWL, {"$EL":MAINE_EL, "$V":0, "$CID": USER_TOKEN, "$SID":hash_locale[2], "$FL":document.getElementById('scrwl-op-'+hash_locale[2])});
            }
//          if (hash_locale[1] == 'public') {SCRWLAPP.Q.streamSCRWL(hash_locale[3], hash_locale[2], SCRWLAPP.V.e1_renderSCRWL, {"$EL":"scrwl-main", "$V":0})}
      }
    };

    SCRWLAPP.Q.loadSCRWLs = function($USR, $FNC, $ARG){ // loads SCRWLs for given user
      SCRWLAPP.C.load("/api/"+$USR+"/scrwls", function($DATA){
        $FNC($DATA, $ARG);
      }, function(){alert('error loading scrawls');});
    };

    SCRWLAPP.Q.streamSCRWL = function($USR, $SCRWL, $FNC, $ARG) { // loads the data for a given SCRWL
      SCRWLAPP.C.load("/api/"+$USR+"/scrwls/"+$SCRWL+"", function($DATA){
        $FNC($DATA, $ARG);
        // >> subscribe to update from this scrwl??
        var s_con = $USR+'~'+$SCRWL;
        socket.emit("stream", {"SCRWL":s_con});
        
        // >> socket connection so that OUR updates get parsed thru
      }, function(){alert('error streaming scrawl');});
    };

    SCRWLAPP.Q.newSCRWL = function($USR, $NAME, $FNC, $ARG) { // creates a new (named) SCRWL for a given user
      SCRWLAPP.C.load("/api/"+$USR+"/scrwls/new/"+$NAME+"", function($DATA){
        $FNC($DATA, "{TEMPLATE}", "$EL", 1);
      }, function(){alert('error creating new scrawl');});
    };

    SCRWLAPP.Q.newNode = function($USR, $SID, $TID, $NOD) { // a promise function to return the correct (new) ID to a temporarily made node
      SCRWLAPP.C.load("/api/"+$USR+"/scrwls/"+$SID+"/new", function($DATA){
        document.getElementById('scrwl-el-'+$TID).setAttribute('id', 'scrwl-el-'+$DATA['_id']);
        if (scrwl.server.update['_queue'][$TID]) {
          if(scrwl.server.update['_queue'][$DATA['_id']]) {
            scrwl.server.update['_queue'][$TID].forEach(function(){
              scrwl.server.update['_queue'][$DATA['_id']].unshift(scrwl.server.update['_queue'][$TID].pop());
            });
          } else {scrwl.server.update['_queue'][$DATA['_id']] = scrwl.server.update['_queue'][$TID];}
          scrwl.server.update['_queue'][$TID] = [];
        };
        socket.emit("scrwl_upd", {$DATA});
        setTimeout("scrwl.server.update['_status']--;",500);
      }, function(){alert('error creating new scrawl node');}, JSON.stringify($NOD));
    };

    SCRWLAPP.Q.updateSCRWL = function($USR, $SCRWL, $PAY) {
      SCRWLAPP.C.load("/api/"+$USR+"/scrwls/"+$SCRWL+"/update", function($DATA){
        alert('updatedscrwlwithpayload');
      }, function(){alert('error updating scrawl');}, $PAY);
    };

    SCRWLAPP.V.e1_listSCRWLs = function($DAT, $ARG) { // displays the SCRWL list in a given structure [[ARG: $TP, $EL, $L]]
      var list_element = document.getElementById($ARG['$EL']);
      var list_fragmnt = document.createDocumentFragment();
      var last_hash = '';
        while ($DAT.length > 0) {
            var scrwl_i = $DAT.shift();
            if (scrwl_i.p != '') {var list_parent = document.getElementById('scrwl-op-'+scrwl_i.p) || list_fragmnt.getElementById('scrwl-op-'+scrwl_i.p);};
              var scrwl_item = document.createElement('a');
                  last_hash = '#/scrwl/'+scrwl_i['_id']+'/';
                  scrwl_item.appendChild(document.createTextNode(scrwl_i.n));
                  scrwl_item.setAttribute('id', 'scrwl-op-'+scrwl_i['_id']);
                  scrwl_item.setAttribute('href', last_hash);
                  scrwl_item.setAttribute('data-scrwl-key', scrwl_i['_id']);
                  scrwl_item.setAttribute('class', 'md-gcbg-' + scrwl_i.c);
                  scrwl_item.setAttribute('tabindex', '-1');
                if (scrwl_i.p != '' && list_parent) {
                  scrwl_item.setAttribute('class', 'sub md-gcbg-' + scrwl_i.c);
                  list_parent.parentNode.insertBefore(scrwl_item, list_parent.nextSibling);
                } else if (scrwl_i.p == '') {
                  list_fragmnt.appendChild(scrwl_item);
                } else {$DAT.push(scrwl_i)};
          list_element.appendChild(list_fragmnt);
        };
      if ($ARG['$L'] == 1) {document.location.hash = last_hash;} else {SCRWLAPP.C.route();};
    };

    SCRWLAPP.V.e1_renderSCRWL = function($DAT, $ARG) { // updates the SCRWL given data and an element to render in [[ARG: $EL]]
      
      EDITING_DOC = $ARG['$SID'];
      EDITING_CRT = $ARG['$CID'];
      
      var menu_item = $ARG['$FL'];
      var scrwl_element = $ARG['$EL'];
          scrwl_element.className = scrwl_element.className.replace(' md-alpha-30','');

      if ($ARG['$V'] == 0) {
        while (scrwl_element.hasChildNodes()) {scrwl_element.removeChild(scrwl_element.firstChild);};
        var scrwl_fragmnt = document.createDocumentFragment();
        while ($DAT.length > 0) {
          var e = $DAT.shift();
          var el = document.createElement(e.e)
              el.setAttribute('id', 'scrwl-el-'+e['_id']);
              el.setAttribute('data-scrwl-ord', e.u);
              if (e.e == 'p' || e.e == 'h1' || e.e == 'h2' || e.e == 'h3') {
                el.appendChild(document.createTextNode(e.c));
                el.addEventListener("focusin", function(){SCRWLAPP.F.editNode(this, e['_id'], $ARG['$SID'], $ARG['$CID']);});
                el.addEventListener("focusout", function(){SCRWLAPP.F.finishEdit(this, e['_id'], $ARG['$SID'], $ARG['$CID']);});
                el.contentEditable = true;
              };
              if (e.e == 'img' || e.e == 'video') {el.setAttribute('src', e.c)};
              scrwl_fragmnt.appendChild(el);        
        }
        scrwl_element.appendChild(scrwl_fragmnt);
        if (menu_item) {
          menu_item.parentNode.childNodes.forEach(function(x){if (x.className) {x.className = x.className.replace('active','')};});
          menu_item.className = menu_item.className + ' active';
          FLAIR_EL.className = menu_item.className;
        }
      } else { // this is an update only
        // check if node exists, or insert in relevant spot
        // update node as needed, incl. checking order
      }
  
    }
    
    SCRWLAPP.F.editNode = function($EL, $ID, $SID, $CID) {
      EDITING_MODE = 1;
      EDITING_ELEM = $EL;
      
      MAINE_EL.className = MAINE_EL.className + ' editing';
     //alert('editing node'+$ID+' in scrawl: '+$SID);
      
    }
    
    SCRWLAPP.F.collapseNode = function($TYP) {
      if ($TYP == 'DELETE') { // user just pressed delete at start of a node
        var PREV_ELEMENT = EDITING_ELEM.previousSibling;
        if (PREV_ELEMENT) {
          
          var _new_caretP = PREV_ELEMENT.innerText.length;
          var _old_text = EDITING_ELEM.innerText;
          var _old_ID = EDITING_ELEM.getAttribute('id').replace('scrwl-el-','');
          var _new_ID = PREV_ELEMENT.getAttribute('id').replace('scrwl-el-','')
          
          PREV_ELEMENT.innerText = PREV_ELEMENT.innerText.concat(_old_text);
          EDITING_ELEM.parentNode.removeChild(EDITING_ELEM);
          
          socket.emit('scrwl.node.collapse', {"i": _old_ID, "r": _new_ID, "c" : _old_text});
          
          PREV_ELEMENT.focus();
          
          var _r = document.createRange(), _s = window.getSelection();
          _r.setStart(PREV_ELEMENT.childNodes[0], _new_caretP);
          _r.collapse(true);
          _s.removeAllRanges();
          _s.addRange(_r);
          
          EDITING_ELEM = PREV_ELEMENT;
          
        
          
          
        }
      }
    }
    
    SCRWLAPP.F.newNode = function($TYP) {
      
      if ($TYP == 'ENTER') { // user just pressed enter
        scrwl.server.update['_status']++;
        var NEXT_ELEMENT = EDITING_ELEM.nextSibling;
        var CARET_POS = window.getSelection().anchorOffset;
        if (NEXT_ELEMENT) {var new_ord = parseFloat(EDITING_ELEM.getAttribute('data-scrwl-ord')) + parseFloat(((NEXT_ELEMENT.getAttribute('data-scrwl-ord') - EDITING_ELEM.getAttribute('data-scrwl-ord')) / 2));}
        else {var new_ord = parseFloat(EDITING_ELEM.getAttribute('data-scrwl-ord')) + 1;}
        
        var txt = '';
        if (CARET_POS == EDITING_ELEM.innerText.length) {txt='';}
        else {
          var _edit_elem_ID = EDITING_ELEM.getAttribute('id').replace('scrwl-el-','');
          txt = EDITING_ELEM.innerText.substring(CARET_POS);
          console.log('deleted from:' + CARET_POS + ' to ' +EDITING_ELEM.innerText.length + ' for eleme: ' +EDITING_ELEM.getAttribute('id').replace('scrwl-el-',''));
          if (!scrwl.server.update['_queue'][_edit_elem_ID]) {scrwl.server.update['_queue'][_edit_elem_ID] = [];};
          scrwl.server.update['_queue'][_edit_elem_ID].push([CARET_POS, "~R:"+EDITING_ELEM.innerText.length]);
          EDITING_ELEM.innerText = EDITING_ELEM.innerText.substring(0,CARET_POS);
        }
        
        
        console.log('selection start: '+ window.getSelection().anchorOffset);
        console.log('text length: '+ EDITING_ELEM.innerText.length);
        console.log('text to be moved: '+ EDITING_ELEM.innerText.substring(EDITING_ELEM.selectionStart));
        
        var tID = Date.now();
        var el = document.createElement('p');
            el.setAttribute('id', 'scrwl-el-' + tID);
            el.setAttribute('data-scrwl-ord', new_ord);
            el.contentEditable = true;
            el.appendChild(document.createTextNode(txt));
        EDITING_ELEM.parentNode.insertBefore(el, NEXT_ELEMENT);
        el.addEventListener("focusin", function(){SCRWLAPP.F.editNode(el, 'new', EDITING_DOC, EDITING_CRT);});
        el.addEventListener("focusout", function(){SCRWLAPP.F.finishEdit(el, 'new', EDITING_DOC, EDITING_CRT);});
        el.focus();
      
        SCRWLAPP.Q.newNode(EDITING_CRT, EDITING_DOC, tID, {'e':'p', 'u':new_ord, 'c':txt});
        
      };
      
      
    };
    
    SCRWLAPP.F.finishEdit = function($EL, $ID, $SID, $CID) {
      
      if (EDITING_ELEM.innerText.charCodeAt(EDITING_ELEM.innerText.length-1) == 160) {
        EDITING_ELEM.innerText = EDITING_ELEM.innerText.substr(0,EDITING_ELEM.innerText.length-1);  
      }
      
      
      EDITING_MODE = 0;
      EDITING_ELEM = '';
      
      var ELE_ID = $ID;
      if (ELE_ID == 'new') {ELE_ID = $EL.getAttribute('id').replace('scrwl-el-','');}
      
      MAINE_EL.className = MAINE_EL.className.replace(' editing', '');
      
      
      //console.log('updating element: ' + ELE_ID + ' - with the new text: '+ $EL.innerText)
      //SCRWLAPP.Q.updateSCRWL($SID, $CID, {'_id': ELE_ID, 'c':$EL.innerText})
      
    }


  

SCRWLAPP.init();





var UKM = [
  "", // [0]
  "", // [1]
  "", // [2]
  "CANCEL", // [3]
  "", // [4]
  "", // [5]
  "HELP", // [6]
  "", // [7]
  "BACK_SPACE", // [8]
  "TAB", // [9]
  "", // [10]
  "", // [11]
  "CLEAR", // [12]
  "ENTER", // [13]
  "ENTER_SPECIAL", // [14]
  "", // [15]
  "SHIFT", // [16]
  "CONTROL", // [17]
  "ALT", // [18]
  "PAUSE", // [19]
  "CAPS_LOCK", // [20]
  "KANA", // [21]
  "EISU", // [22]
  "JUNJA", // [23]
  "FINAL", // [24]
  "HANJA", // [25]
  "", // [26]
  "ESCAPE", // [27]
  "CONVERT", // [28]
  "NONCONVERT", // [29]
  "ACCEPT", // [30]
  "MODECHANGE", // [31]
  " ", // [32]
  "PAGE_UP", // [33]
  "PAGE_DOWN", // [34]
  "END", // [35]
  "HOME", // [36]
  "LEFT", // [37]
  "UP", // [38]
  "RIGHT", // [39]
  "DOWN", // [40]
  "SELECT", // [41]
  "PRINT", // [42]
  "EXECUTE", // [43]
  "PRINTSCREEN", // [44]
  "INSERT", // [45]
  "DELETE", // [46]
  "", // [47]
  "0", // [48]
  "1", // [49]
  "2", // [50]
  "3", // [51]
  "4", // [52]
  "5", // [53]
  "6", // [54]
  "7", // [55]
  "8", // [56]
  "9", // [57]
  ";", // [58]
  ":", // [59]
  "<", // [60]
  "=", // [61]
  ">", // [62]
  "?", // [63]
  "@", // [64]
  "A", // [65]
  "B", // [66]
  "C", // [67]
  "D", // [68]
  "E", // [69]
  "F", // [70]
  "G", // [71]
  "H", // [72]
  "I", // [73]
  "J", // [74]
  "K", // [75]
  "L", // [76]
  "M", // [77]
  "N", // [78]
  "O", // [79]
  "P", // [80]
  "Q", // [81]
  "R", // [82]
  "S", // [83]
  "T", // [84]
  "U", // [85]
  "V", // [86]
  "W", // [87]
  "X", // [88]
  "Y", // [89]
  "Z", // [90]
  "OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
  "", // [92]
  "CONTEXT_MENU", // [93]
  "", // [94]
  "SLEEP", // [95]
  "NUMPAD0", // [96]
  "NUMPAD1", // [97]
  "NUMPAD2", // [98]
  "NUMPAD3", // [99]
  "NUMPAD4", // [100]
  "NUMPAD5", // [101]
  "NUMPAD6", // [102]
  "NUMPAD7", // [103]
  "NUMPAD8", // [104]
  "NUMPAD9", // [105]
  "*", // [106]
  "+", // [107]
  "SEPARATOR", // [108]
  "-", // [109]
  ".", // [110]
  "/", // [111]
  "F1", // [112]
  "F2", // [113]
  "F3", // [114]
  "F4", // [115]
  "F5", // [116]
  "F6", // [117]
  "F7", // [118]
  "F8", // [119]
  "F9", // [120]
  "F10", // [121]
  "F11", // [122]
  "F12", // [123]
  "F13", // [124]
  "F14", // [125]
  "F15", // [126]
  "F16", // [127]
  "F17", // [128]
  "F18", // [129]
  "F19", // [130]
  "F20", // [131]
  "F21", // [132]
  "F22", // [133]
  "F23", // [134]
  "F24", // [135]
  "", // [136]
  "", // [137]
  "", // [138]
  "", // [139]
  "", // [140]
  "", // [141]
  "", // [142]
  "", // [143]
  "NUM_LOCK", // [144]
  "SCROLL_LOCK", // [145]
  "WIN_OEM_FJ_JISHO", // [146]
  "WIN_OEM_FJ_MASSHOU", // [147]
  "WIN_OEM_FJ_TOUROKU", // [148]
  "WIN_OEM_FJ_LOYA", // [149]
  "WIN_OEM_FJ_ROYA", // [150]
  "", // [151]
  "", // [152]
  "", // [153]
  "", // [154]
  "", // [155]
  "", // [156]
  "", // [157]
  "", // [158]
  "", // [159]
  "^", // [160]
  "!", // [161]
  "\"", // [162]
  "#", // [163]
  "$", // [164]
  "%", // [165]
  "&", // [166]
  "_", // [167]
  "(", // [168]
  ")", // [169]
  "*", // [170]
  "+", // [171]
  "|", // [172]
  "-", // [173]
  "{", // [174]
  "}", // [175]
  "~", // [176]
  "", // [177]
  "", // [178]
  "", // [179]
  "", // [180]
  "VOLUME_MUTE", // [181]
  "VOLUME_DOWN", // [182]
  "VOLUME_UP", // [183]
  "", // [184]
  "", // [185]
  ":", // [186]
  "=", // [187]
  ",", // [188]
  "-", // [189]
  ".", // [190]
  "/", // [191]
  "BACK_QUOTE", // [192]
  "", // [193]
  "", // [194]
  "", // [195]
  "", // [196]
  "", // [197]
  "", // [198]
  "", // [199]
  "", // [200]
  "", // [201]
  "", // [202]
  "", // [203]
  "", // [204]
  "", // [205]
  "", // [206]
  "", // [207]
  "", // [208]
  "", // [209]
  "", // [210]
  "", // [211]
  "", // [212]
  "", // [213]
  "", // [214]
  "", // [215]
  "", // [216]
  "", // [217]
  "", // [218]
  "(", // [219]
  "\\", // [220]
  ")", // [221]
  "'", // [222]
  "", // [223]
  "META", // [224]
  "ALTGR", // [225]
  "", // [226]
  "WIN_ICO_HELP", // [227]
  "WIN_ICO_00", // [228]
  "", // [229]
  "WIN_ICO_CLEAR", // [230]
  "", // [231]
  "", // [232]
  "WIN_OEM_RESET", // [233]
  "WIN_OEM_JUMP", // [234]
  "WIN_OEM_PA1", // [235]
  "WIN_OEM_PA2", // [236]
  "WIN_OEM_PA3", // [237]
  "WIN_OEM_WSCTRL", // [238]
  "WIN_OEM_CUSEL", // [239]
  "WIN_OEM_ATTN", // [240]
  "WIN_OEM_FINISH", // [241]
  "WIN_OEM_COPY", // [242]
  "WIN_OEM_AUTO", // [243]
  "WIN_OEM_ENLW", // [244]
  "WIN_OEM_BACKTAB", // [245]
  "ATTN", // [246]
  "CRSEL", // [247]
  "EXSEL", // [248]
  "EREOF", // [249]
  "PLAY", // [250]
  "ZOOM", // [251]
  "", // [252]
  "PA1", // [253]
  "WIN_OEM_CLEAR", // [254]
  "" // [255]
];