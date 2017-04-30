sC.x.ex = require('express');
sC.x.bp = require('body-parser');
sC.x.ap = sC.x.ex();
sC.x.use(sC.x.ex.static('public'));
sC.x.ap.use(sC.x.bp.json());
sC.x.sv = require('http').createServer(sC.x.ap);
sC.x.io = require('socket.io')(sC.x.sv);
sC.x.l = sC.x.sv.listen(process.env.PORT, function () {
        console.log('SCRWL app is listening : ' + sC.x.l.address().port);
      });


# scrwl.co : sC

## sC.docs
    sC.docs.create      creates a new scrwl page for user
    sC.docs.stream      loads the scrwl page for user
    sC.docs.remove      deletes a scrwl page from user lib
    sC.docs.update
    
    sC.docs['_locked'][X] = flag indicating if the document is locked     @SRV
    sC.docs['_queued'][X] = pending operations  (create, remove, change)
    
##  sC.node
    sC.node.create       creates a new node on the page of specific type
    sC.node.remove       deletes a specific node in a document
    sC.node.change       handles transforms of text/elements in a document
    ^^^^^^^^^^^^^^
    sC.node.update       add operations to a queue, and process them
    
##  sC.core
    sC.core.parse        parses operational transforms on an element
    
##  sC.user   
    sC.user.scrwl        returns the users lists of scrwls
    sC.user.login        function to log in user?????

##  sC.x.io








