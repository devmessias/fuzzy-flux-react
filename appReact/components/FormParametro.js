(function( module, undefined) {
    var React = require('react');
    var Acao = require('../actions/Acoes.js');
    var CanvasStore = require('../stores/Canvas.js');
    module.exports = React.createClass({
        _onChange: function() {
            this.setState(CanvasStore.get());
        },
        componentDidMount: function() {
            CanvasStore.addChangeListener(this._onChange);
        },
        getInitialState: function() {
            return CanvasStore.get();
        },
        componentWillUnmount: function() {
            CanvasStore.removeChangeListener(this._onChange);
        },
        changeTempo:function(){
            var newScale=this.refs.escalaTempo.getDOMNode().value;
            Acao.Canvas.escalaTempo(newScale);
        },
        render: function() {
            return (
                <div className='col s4 offset-s1 card'>
                <form className='row '>
                              <div className='col s12'>
                <div className='input-field col s12'>
                <p className="range-field">
                <input type='range'
                name='escalaTempo'
                ref='escalaTempo'
                onChange={this.changeTempo}
                min='1'
                max='10000'
                defaultValue={this.state.escalaTempo}
                ref='escalaTempo'/>
                </p>
                <p>
                <label htmlFor='escalaTempo'>Escala de Tempo</label>
                </p>
                </div>
                </div>
                </form>
                </div>)
        }
    });
}( module));
