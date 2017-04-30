# Planning Required Functionality



## QUERY FUNCTIONS :: return JSON, usually to be parsed by a DISPLAY function

> Load SCRWLs for a User : loadSCRWLs($USER, $DISPLAYFNC)
    - load the scrwls associated with a given user
    - used on startup to load the scrwls of the currently-logged-in-user
    - malleable to allow loading a list of non-current-user scrwls
    - return only; pass to a DISPLAY function

> Stream SCRWL given ID : streamSCRWL($USER, $SCRWL, $DISPLAYFNC, [V, INTVL])
    - load the scrwl associated with a user and scrwl id
    - used to stream a scrwl, also subscribing to future updates from the SCRWL
    - polls the SCRWL regularly to check for updates based on on [V, INTVL] optional params // OPTIONAL: websockets??
    - 'V' is updated to the most recent 'version' entity from the loaded SCRWL package

> Create a new SCRWL : newSCRWL($USER, $NAME, $DISPLAYFNC)
    - builds a new SCRWL with default settings for a given user, provided name
    - passes to the display function to build into a relevant menu
    - automatically load the SCRWL just added

> Send Updated Element : updateSCRWL($USER, $SCRWL, $PAYLOAD)
    - sends the updated ID and contents of a package (payload) to server
    - don't need to worry about updating things because local already changed
    

## DISPLAY FUNCTIONS :: renders given DATA into given TEMPLATE in given ELEMENT

> Show list of SCRWLs : listSCRWLs($DATA, $TEMPLATE, $ELEMENT, [LOAD])
    - given a list of scrwls in $DATA...
    - ...build the DOM for each as per $TEMPLATE...
    - ...and put it all into $ELEMENT
    - (flexible enough to permit multiple dimensions of displaying scrwl lists)
    - optional param: automatically load the last element

> Show a given SCRWL : renderSCRWL($DATA, $ELEMENT)
    - checks the provided $element for entities in a SCRWL package/data
    - updates relevant entity or creates anew as req'd
    - updates the URL to the relevant SCRWL (/#/XXX/)


# TEMPLATE BASES :: display modules for showing DATA

>> SCRWL Option (Menu Item) - <a></a>