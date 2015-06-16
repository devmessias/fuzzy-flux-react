/** @jsx React.DOM */
(function( module, undefined) {
    var React = require('react');
    var CanvasApp = require('./components/Canvas.js');
    var FormApp = require('./components/Form.js');
    var FormParametroApp = require('./components/FormParametro.js');

    var PendulumStore = require('./stores/Pendulum.js');
    var Base = React.createClass({
        _onChange: function() {
            this.setState(PendulumStore.get());
        },
        componentDidMount: function() {
            PendulumStore.addChangeListener(this._onChange);
        },
        getInitialState: function() {
            return PendulumStore.get();
        },
        componentWillUnmount: function() {
            PendulumStore.removeChangeListener(this._onChange);
        },
        //salvar:function(){
            //Acao.salvar();
            //Acao.abrirModal('dialogo');
        //},
        //editor:function(){
            //if (this.state.editor=='fechado'){
                //Acao.abrirModal('senha');
            //}else{
                //Acao.editor();
            //}
        //},
        //limpar:function(){
            //Acao.abrirModal('restaurar');
        //},
        render: function() {
            return(<div>
                   <CanvasApp pendulum={this.state}/>
                  <FormApp pendulum={this.state}/>
                  <FormParametroApp />
                   </div>)
        }
    });
    React.render( <Base/> ,document.getElementById('react'));
}( module));
