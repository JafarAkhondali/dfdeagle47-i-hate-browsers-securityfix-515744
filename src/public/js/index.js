function sendEvent(contextWindow, contextDocumnent, keyCode) {
    var customEvent;
    var type = 'keydown';
    var bubbles = true;
    var cancelable = true;
    var view = contextWindow;
    var ctrlKey = false;
    var altKey = false;
    var shiftKey = false;
    var metaKey = false;
    // var keyCode = 40;
    var charCode = keyCode;
    var which = keyCode;

    try {
        //try to create key event
        customEvent = contextDocumnent.createEvent("KeyEvents");

        /*
         * Interesting problem: Firefox implemented a non-standard
         * version of initKeyEvent() based on DOM Level 2 specs.
         * Key event was removed from DOM Level 2 and re-introduced
         * in DOM Level 3 with a different interface. Firefox is the
         * only browser with any implementation of Key Events, so for
         * now, assume it's Firefox if the above line doesn't error.
         */
        //TODO: Decipher between Firefox's implementation and a correct one.
        customEvent.initKeyEvent(type, bubbles, cancelable, view, ctrlKey,
            altKey, shiftKey, metaKey, keyCode, charCode);

    } catch ( ex /*:Error*/ ) {
        /*
         * If it got here, that means key events aren't officially supported. 
         * Safari/WebKit is a real problem now. WebKit 522 won't let you
         * set keyCode, charCode, or other properties if you use a
         * UIEvent, so we first must try to create a generic event. The
         * fun part is that this will throw an error on Safari 2.x. The
         * end result is that we need another try...catch statement just to
         * deal with this mess.
         */
        try {

            //try to create generic event - will fail in Safari 2.x
            customEvent = contextDocumnent.createEvent("Events");

        } catch ( uierror /*:Error*/ ) {

            //the above failed, so create a UIEvent for Safari 2.x
            customEvent = contextDocumnent.createEvent("UIEvents");

        } finally {

            customEvent.initEvent(type, bubbles, cancelable);

            //initialize
            customEvent.view = view;
            customEvent.altKey = altKey;
            customEvent.ctrlKey = ctrlKey;
            customEvent.shiftKey = shiftKey;
            customEvent.metaKey = metaKey;
            customEvent.keyCode = keyCode;
            customEvent.charCode = charCode;
            customEvent.which = which;

        }

    }

    //fire the event
    contextDocumnent.dispatchEvent(customEvent);
}


var oldDocument = window.document;
oldDocument.addEventListener('DOMContentLoaded', function() {
    console.log('Old document loaded');
    oldDocument.addEventListener('keydown', function(evt) {
        console.log('event on old window', evt.keyCode, evt.which, evt);
    });
    if (!window.location.search) {
        var newWindow = window.open('/?newWindow=true');
        newWindow.addEventListener('DOMContentLoaded', function() {
            newWindow.addEventListener('keydown', function(evt) {
                console.log('event in new window, dispatching event to old window...', evt.keyCode, evt.which, evt);
                var newEvt = new evt.constructor(evt.type, evt);
                oldDocument.dispatchEvent(newEvt);
                sendEvent(window, document, evt.keyCode)
            });
        });
    }
});