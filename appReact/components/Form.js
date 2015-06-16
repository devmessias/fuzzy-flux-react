(function( module, undefined) {
    var React = require('react');
    var Acao = require('../actions/Acoes.js');
    var PhysicsStore = require('../stores/Physics.js');
    var centrar=false;
    module.exports = React.createClass({
        _onChange: function() {
            this.setState(PhysicsStore.get());
        },
        componentDidMount: function() {
            PhysicsStore.addChangeListener(this._onChange);
        },
        getInitialState: function() {
            return PhysicsStore.get();
        },
        componentWillUnmount: function() {
            PhysicsStore.removeChangeListener(this._onChange);
        },
        change:function(tipo,event){
            var data =this.state;
            if (event.target.value<=0) return;
            var value = Number(event.target.value)
            //switch (tipo) {
            //case 'tamanhoBastao':
            //data.tamanhoBastao=value;
            //break;
            //default:
            //}
            data[tipo]=value;
            Acao.Variaveis.physics(data);
        },
        centrar:function(){
            Acao.Canvas.cameraCentrar();
            centrar=!centrar;
        },
        render: function() {
            var botaoCentrar = centrar?'Destravar Câmera':'Centrar Câmera';
            return (
                <div className='col s6 card'>
                <form className='row '>
                <div className='input-field col s6'>
                <p className="range-field">
                <input type='range'
                defaultValue={this.state.massaCarro}
                onChange={this.change.bind(this,'massaCarro')}
                name='massaCarro'
                ref='massaCarro'/>
                </p>
                <p>
                <label htmlFor='massaCarro'>Massa do carro</label>
                </p>
                </div>
                <div className='input-field col s6'>
                <p className="range-field">
                <input type='range'
                defaultValue={this.state.massaBastao}
                name='massaPendulo'
                onChange={this.change.bind(this,'massaBastao')}
                ref='massaPendulo'/>
                </p>
                <p>
                <label htmlFor='massaPendulo'>Massa do Pêndulo</label>
                </p>
                </div>
                <div className='col s12'>
                <div className='input-field col s12'>
                <p className="range-field">
                <input type='range'
                onChange={this.change.bind(this,'tamanhoBastao')}
                defaultValue={this.state.tamanhoBastao}
                name='tamanhoPendulo'
                ref='tamanhoPendulo'/>
                </p>
                <p>
                <label htmlFor='tamanhoPendulo'>Comprimento Pêndulo</label>
                </p>
                </div>
                </div>
                <span
                onClick={this.centrar}
                className='btn col s8 offset-s2'>
                {botaoCentrar}
                </span>
                </form>
                </div>)
        }
    });
}( module));
