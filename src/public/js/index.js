var oldDocument = window.document;

oldDocument.addEventListener('DOMContentLoaded', function() {
    console.log('Old document loaded');
    oldDocument.addEventListener('keydown', function(evt) {
        console.log('event on old window', evt.keyCode, evt.which, evt);
    });
    if (!window.location.search) {
        var newWindow = window.open('http://localhost:8888/?newWindow=true');
        newWindow.addEventListener('DOMContentLoaded', function() {
            newWindow.addEventListener('keydown', function(evt) {
                console.log('event in new window, dispatching event to old window...', evt.keyCode, evt.which, evt);
                var newEvt = new evt.constructor(evt.type, evt);
                oldDocument.dispatchEvent(newEvt);
            });
        });
    }
});