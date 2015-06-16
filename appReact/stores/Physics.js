var AppDispatcher = require('../flux/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var Phys = require('../Variaveis/Physics.js');
var CHANGE_EVENT = 'CHANGE_PHYSICS';


var PhysStore = _.extend({}, EventEmitter.prototype, {
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
        return Phys;
    },
});
PhysStore.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch (action.type) {
        case "PHYSICS_UPDATE":
            Phys=action.data;
            break;
        default:
    }
});
module.exports = PhysStore;
