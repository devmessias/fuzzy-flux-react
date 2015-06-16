var AppDispatcher = require('../flux/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var Fuzzy = require('../services/Fuzzy.js');
var Phys = require('../Variaveis/Physics.js');
var CHANGE_EVENT = 'CHANGE_PENDULUM';
//var pendulum = new InvertedPendulum(3, Math.PI/180 * 25);
var _base ={
    u:0,
    kinematics:{
        x:3,
        xd:0,
        xdd:0,
        theta:Math.PI/180 * 25,
        thetad:0,
        thetadd:0,
    },
    shapes:{
        "body": {
            type: "rectangle",
            x: 0,	//Locates on the center
            y: 0,
            w: 1,
            h: 0.2,
            dfc: true //Draw From Center
        },
        "rod": {
            type: "rectangle",
            x: 0,	//Attached to the center
            y: 0,
            w: 0.02,
            h: 1.5,
            theta:1,
        },
        "wheelRod":{
            type:'circle',
            y:0,
            x:0,
            r: 0.1,//raio
        },
        "wheel1": {
            type: "circle",
            r: 0.1,//raio
            x: -0.35,//posicao em relacao ao centro do carrinho
            y: 0.2//distancia entre o centro da roda e o solo
        },
        "wheel2": {
            type: "circle",
            r: 0.1,
            x: 0.35,
            y: 0.2
        }
    },
};
function _update(playerX,w){
    _base.u=playerX;
    _base.u += Fuzzy.controller(-_base.kinematics.theta, -_base.kinematics.thetad );
    PendulumStore.emitChange();
}
function _redesenha(scalaTempo){
    var g = Phys.g;
    var M = Phys.massaCarro;
    var m = Phys.massaBastao;
    var l = Phys.tamanhoBastao;
    var time_scale_factor = scalaTempo/1000.0;
    _base.u *= 0.7;	// Notice that this is dependant on the size of the simulation step
    var x1 = _base.kinematics.theta;
    var x2 = _base.kinematics.thetad;
    var D = l*(4/3 - m*Math.pow(Math.cos(x1), 2)/(M + m));
    _base.kinematics.xdd = _base.u;
    _base.kinematics.xd += _base.kinematics.xdd * time_scale_factor;
    //_base.kinematics.xd *= 0.95;
    _base.kinematics.x += _base.kinematics.xd * time_scale_factor;
    // Magic happens here
    _base.kinematics.thetadd = ((g*Math.sin(x1) - m*l*Math.pow(x2, 2) * Math.cos(x1)*Math.sin(x1)/(M + m)) / D + Math.cos(x1)/(M + m) / D * _base.u);
    _base.kinematics.thetad += _base.kinematics.thetadd * time_scale_factor;
    _base.kinematics.theta += _base.kinematics.thetad * time_scale_factor;
    // Boundary check, se o theta calculado for maior que 90 entao deve ser setado como 0, tipo solo
    if(_base.kinematics.theta >= Math.PI/2){
        _base.kinematics.theta = Math.PI/2;
        _base.kinematics.thetad = 0;
        _base.kinematics.thetadd = 0;
    }else if(_base.kinematics.theta <= -Math.PI/2){
        _base.kinematics.theta = -Math.PI/2;
        _base.kinematics.thetad = 0;
        _base.kinematics.thetadd = 0;
    }
    _base.shapes.rod.theta = -_base.kinematics.theta;	// Must be updated for drawing
    _base.shapes.wheelRod.y=_base.shapes.rod.h*(-Math.cos(_base.kinematics.theta));
        _base.shapes.wheelRod.x=_base.shapes.rod.h*(-Math.sin(_base.kinematics.theta));
}
var PendulumStore = _.extend({}, EventEmitter.prototype, {
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
PendulumStore.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch (action.type) {
        case "PENDULUM_UPDATEVAL":
            _update(action.data.playerX,action.data.scalaTempo);
        break;
        case "PENDULUM_UPDATE":
            _redesenha(action.data);
        PendulumStore.emitChange();
        break;
        default:
    }
});
module.exports = PendulumStore;
