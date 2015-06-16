(function( module, undefined) {
    var AppDispatcher = require('../flux/AppDispatcher');
    function _dispacha(data, msg){
        AppDispatcher.handleServerAction({
            type: msg,
            data:data,
        });
    }
    module.exports = {
        Canvas:{
            cameraX:function(kinematicsX){
                _dispacha(kinematicsX,'CAMERAX');
            },
            cameraCentrar:function(){
                _dispacha(null,'CAMERA_RESSETAR');
            },
            escalaTempo:function(newScale){
                _dispacha(newScale,'SCALE_TIME');
            }
        },
        Variaveis:{
            physics:function(newData){
                _dispacha(newData,'PHYSICS_UPDATE');
            }
        },
        Pendulum:{
            updateVal:function(posicao){
                _dispacha(posicao,'PENDULUM_UPDATEVAL');
            },
            update:function(scalaTempo){
                _dispacha(scalaTempo,'PENDULUM_UPDATE');
            },
            player:function(){
                _dispacha(null,'PLAYER');
            }
        },
    };
}( module));
