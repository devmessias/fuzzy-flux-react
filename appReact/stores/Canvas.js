var AppDispatcher = require('../flux/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var CHANGE_EVENT = 'CHANGE_CANVAS';
var _base ={
    playerX:0,
    widthMetros:6,
    heightMetros:2.5,
    escalaPixels:150,
    escalaTempo:20,
    camera:{
        x:0,
        ressetar:false,
        y:0
    }
};
var Key = {
    _pressed: {},
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,//codigos das teclas pressionados, texto relacionado para facilitar leitura
    isDown: function(keyCode) {
        return this._pressed[keyCode];
    },
    onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
    },
    onKeyup: function(event) {
        delete this._pressed[event.keyCode];
    }
};
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
var BaseStore = _.extend({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    get: function() {
        return _base;
    },
});
BaseStore.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch (action.type) {
        case "CAMERAX":
            var newPosition=null;
        if (_base.camera.ressetar){
            newPosition= (action.data - _base.widthMetros/2 );
            _base.camera.x = newPosition;
            //_base.camera.ressetar=false;
        }else{
            newPosition= 0.1*(action.data  - _base.widthMetros/2 -
                              _base.camera.x);
            _base.camera.x += newPosition;
        }
        //var centro=(action.data - _base.widthMetros/2 );
        BaseStore.emitChange();
        break;
        case "CAMERA_RESSETAR":
            _base.camera.ressetar= !_base.camera.ressetar;
        BaseStore.emitChange();
        break;
        case "SCALE_TIME":
            _base.scalaTempo = action.data;
        BaseStore.emitChange();
        break;
        case "PLAYER":
            if (Key.isDown(Key.LEFT)) _base.playerX+=+1;
        if (Key.isDown(Key.RIGHT)) _base.playerX+=-1;
        _base.playerX *= 0.95;
        BaseStore.emitChange();
        break;
        default:
            // do nothing
    }
});
module.exports = BaseStore;
