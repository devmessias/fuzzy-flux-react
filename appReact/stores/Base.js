var MSG = require('../Textos/MSG.js');
var Animacoes = require('../utilidades/Animacoes.js');
var Modal= require('./Modal.js');
var AppDispatcher = require('../flux/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var toastr=require('toastr');
var update = require('react/lib/update');
var _ = require('underscore');
var CHANGE_EVENT = 'CHANGE_BASE';
var _base ={
    editor:'fechado',
    icone:'mdi-action-settings',
    tabela:{
        exibir:false,
        width:70,
        full:false,
        logo:{
            nome:'',
            existe:0,
            height:80
        }
    },
    baner:{
        exibir:true,
        width:30,
        full:false,
    },
    contaUser:{
        senha:'1234',
        nome:'user'
    },
    contaSiempre:{
        senha:'1234',
        nome:'siempre',
        logado:false
    },
    tabelaLiberada:true
    //get:function(){
    //return {
    //edito:this.editor,
    //icone:this.icone,
    //tabela:this.tabela,
    //baner:this.baner
    //}
    //}
};
if ('base' in localStorage){
    _base=JSON.parse(localStorage.getItem('base'));
}
function _salvar(){
    _base.editor='fechado';
    _base.icone='mdi-action-settings';
    _base.contaSiempre.logado=false;
    localStorage.setItem('base', JSON.stringify(_base));
    BaseStore.emitChange();
}
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
    iniciar:function(){
        if ('base' in localStorage){
            _base=JSON.parse(localStorage.getItem('base'));
        }
    },
    get: function() {
        return _base;
    },
});
function _toogle(exibirTabela,exibirBaner){
    _base.tabela.exibir=exibirTabela;
    _base.tabela.full=!exibirTabela;
    _base.baner.exibir=exibirBaner;
    _base.baner.full=!exibirBaner;
    BaseStore.emitChange();
}
function _toogleEditar(){
    if(  _base.editor=='aberto'){
        _base.editor='fechado';
        _base.icone='mdi-action-settings';
    }else{
        _base.editor='aberto';
        _base.icone='mdi-content-clear'
    };
    BaseStore.emitChange();
}
BaseStore.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch (action.type) {
        case "TOOGLE_TABELA":
            var bool = action.data.exibir;
        if (action.data.oque=='baner'){
            _base.tabela.exibir=true;
            _base.tabela.full=!bool;
            _base.baner.exibir=bool;
        }else{
            _base.baner.exibir=true;
            _base.baner.full=!bool;
            _base.tabela.exibir=bool;
        }
        BaseStore.emitChange();
        break;
        case "TOOGLE_BANER":
            var exibir=action.data;
        _toogle(!exibir,exibir);
        break;
        case "BASE_EDITAR":
            if(  _base.editor=='aberto'){
            _base.editor='fechado';
            _base.icone='mdi-action-settings';
        }else{
            _base.editor='aberto';
            _base.icone='mdi-content-clear'
        };
        BaseStore.emitChange();
        break;
        case "LIBERAR_TABELA":
            var liberar=action.data;
        _base.tabelaLiberada=liberar;
        _base.tabela.exibir=liberar;
        //if(!liberar){
        _base.baner.exibir=true;
        _base.tabela.full=false;
        _base.baner.full=!liberar;
        //}
        BaseStore.emitChange();
        break;
        case 'LOGIN':
            switch (action.data.nome) {
            case 'user':
                if (_base.contaUser.senha==action.data.senha){
                _toogleEditar();
                $('#reactModal').closeModal();
            }else{
                toastr.error('Senha Errada');
            }
            break;
            case 'siempre':
                if (_base.contaSiempre.senha==action.data.senha){
                Modal.abrirModal('siempre');
                _base.contaSiempre.logado=true;
                _toogleEditar();
            }else{
                toastr.error('Senha Errada');
            }
            break;
            default:

                toastr.error('Usuario não existe');
        }
            break;
            case "LOGO_DELETAR":
                _base.tabela.logo.existe=0;
            _base.tabela.logo.nome='';
            BaseStore.emitChange();
            break;
            case "ATUALIZAR_TABELA":
                var novo = action.data;
            novo.editor=_base.editor;
            novo.icone=_base.icone;
            _base=action.data;
            BaseStore.emitChange();
            break;
            case "LOGO_CARREGA":
                _base.tabela.logo.existe=true;
            _base.tabela.logo.nome=action.data;
            BaseStore.emitChange();
            break;
            case "BASE_SALVAR":
                _salvar();
            break;
            default:
                // do nothing
    }
});
module.exports = BaseStore;
