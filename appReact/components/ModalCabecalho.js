(function( module, undefined) {
    var React = require('react');
    var TEXTO = require('../Textos/TEXT.js');
    var CabecalhoStore = require('../stores/Cabecalho.js');
    var Acoes=require('../actions/Acoes.js');
    module.exports = React.createClass({
        _onChange: function() {
            this.setState({cabecalho: CabecalhoStore.get()});
        },
        getInitialState: function() {
            return {cabecalho: CabecalhoStore.get()};
        },
        componentWillUnmount: function() {
            CabecalhoStore.removeChangeListener(this._onChange);
        },
        componentDidMount: function(){
            CabecalhoStore.addChangeListener(this._onChange);
            $('select').material_select();
        },
        tamanho:function(){
            var nTamanho = this.refs.tamanho.getDOMNode().value;
            var dados = this.state.cabecalho.estilo;
            dados.header.fontSize = nTamanho.toString()+'px';
            Acoes.cabecalho(dados);
        },
        changeFamilia:function(event){
            var familia = event.target.value;
            var dados = this.state.cabecalho.estilo;
            dados.header.fontFamily = familia;
            Acoes.cabecalho(dados);
        },
        changeEstilo: function(event){
            var dados = this.state.cabecalho.estilo;
            dados.header.fontStyle= event.target.value;
            dados.produto.fontStyle= event.target.value;
            dados.preco.fontStyle= event.target.value;
            Acoes.cabecalho(dados);
        },
        changeWeight: function(event){
            var dados = this.state.cabecalho.estilo;
            dados.header.fontWeight= event.target.value;
            dados.produto.fontWeight= event.target.value;
            dados.preco.fontWeight= event.target.value;
            Acoes.cabecalho(dados);
        },
        changeAlinhamento: function(event){
            var dados = this.state.cabecalho.estilo;
            dados.header.textAlign= event.target.value;
            dados.produto.textAlign= event.target.value;
            dados.preco.textAlign= event.target.value;
            Acoes.cabecalho(dados);
        },
        changeColor: function(event){
            var dados = this.state.cabecalho.estilo;
            dados.header.color= event.target.value;
            Acoes.cabecalho(dados);
        },
        changePadding:function(){
            var nTamanho = this.refs.padding.getDOMNode().value;
            var dados = this.state.cabecalho.estilo;
            dados.paddingTop = Number(nTamanho);
            Acoes.cabecalho(dados);
        },
        changeBackColorTopo: function(event){
            var dados = this.state.cabecalho.estilo;
            dados.gradiente1= event.target.value;
            Acoes.cabecalho(dados);
        },
        changeBackColorBaixo: function(event){
            var dados = this.state.cabecalho.estilo;
            dados.gradiente2= event.target.value;
            Acoes.cabecalho(dados);
        },
        changeCaixaAlta: function(){
            var dados=this.state.cabecalho.estilo;
            if (dados.header.textTransform=='uppercase'){
                dados.header.textTransform='none';
            }else{
                dados.header.textTransform='uppercase';
            }
            Acoes.cabecalho(dados);
        },
        render: function() {
            var master = this.props.base.contaSiempre.logado;
            var mostrar = master?'block':'none';
            return (
                <div className="row">
                <form className="col s12">
                <legend>Texto</legend>
                <div className="row">
                <div className="input-field col s6">
                <select onChange={this.changeFamilia}
                value={this.state.cabecalho.estilo.textAlign}
                className='browser-default'>
                <option value="" disabled selected> {TEXTO.FONTE.FAMILIA}</option>
                <option className='Roboto' value="Roboto">Roboto</option>
                <option className='DroidSerif' value="Droid Serif">Droid Serif</option>
                <option className='Handlee' value="Handlee">Handlee</option>
                <option className='OpenSans' value="Open Sans">Open Sans</option>
                <option className='Tahoma' value="Tahoma">Tahoma</option>
                <option className='GloriaHallelujah' value="Gloria Hallelujah">Gloria Hallelujah</option>
                </select>
                </div>
                <div className='col s12'>
                <div className="input-field col s6">
                <select onChange={this.changeEstilo}
                className='browser-default'>
                <option value="" disabled selected> Escolha o Estilo</option>
                <option value="normal">Normal</option>
                <option value="italic">Itálico</option>
                </select>
                </div>
                <div className="input-field col s6">
                <small>Tenha em mente que algumas famílias de fonte tem opções de impacto limitadas, a fonte
                com mais opções e usada pelo google é a Roboto</small>
                <select onChange={this.changeWeight}
                className='browser-default'>
                <option value="" disabled selected> Escolha o impacto da fonte</option>
                <option value="bold">5(Negrito)</option>
                <option value="500">4(Pouco forte)</option>
                <option value="normal">3(Normal)</option>
                <option value="300">2(Leve)</option>
                <option value="200">1(Levíssimo)</option>
                </select>
                </div>
                <div className="input-field col s6">
                <select onChange={this.changeAlinhamento}
                value={this.state.cabecalho.estilo.textAlign}
                className='browser-default'>
                <option value="center" disabled selected> {TEXTO.FONTE.ALINHAMENTO}</option>
                <option value="center">Centro</option>
                <option value="left">Esquerda</option>
                <option value="right">Direita</option>
                </select>
                </div>
                </div>
                <div className="input-field col s6">
                <p className="range-field">
                <input type="range"
                ref='tamanho'
                defaultValue={Number(this.state.cabecalho.estilo.header.fontSize.replace('px',''))}
                id="tamanho"
                onChange={this.tamanho}
                min="10"
                max="100" />
                </p>
                <label
                htmlFor="tamanho">
                {TEXTO.FONTE.TAMANHO}
                &nbsp;&nbsp;{this.state.cabecalho.estilo.header.fontSize}
                </label>
                </div>
                <div className="input-field col s6"
                style={{display:mostrar}}
                >
                <p className="range-field"
                >
                <input type="range"
                ref='padding'
                id="padding"
                defaultValue={this.state.cabecalho.estilo.paddingTop}
                onChange={this.changePadding}
                min="1"
                max="18" />
                </p>
                <label
                htmlFor="padding">
                Espaço livre no cabecalho
                &nbsp;&nbsp;{this.state.cabecalho.estilo.paddingTop}px
                </label>
                </div>
                <div className='input-field col s6'>
                <div className="switch">
                <label>
                Ligar Caixa Alta?
                &nbsp;&nbsp;Sim
                <input type="checkbox" onChange={this.changeCaixaAlta}/>
                <span className="lever"></span>
                Não
                </label>
                </div>
                </div>
                <div className='col s12'>
                <div className="input-field col s6">
                <p>
                <span>
                Escolha a Cor do Topo do Cabecalho
                </span>
                </p>
                <input type="color"
                onChange={this.changeBackColorTopo}
                defaultValue={this.state.cabecalho.estilo.gradiente1}
                />
                </div>
                <div className="input-field col s6">
                <p>
                <span>
                Escolha a Cor da parte de baixo do Cabecalho
                </span>
                </p>
                <input type="color"
                onChange={this.changeBackColorBaixo}
                defaultValue={this.state.cabecalho.estilo.gradiente2}
                />
                </div>
                <div className="input-field col s6">
                <p>
                <span>
                Escolha a Cor do Texto
                </span>
                </p>
                <input type="color"
                onChange={this.changeColor}
                defaultValue={this.state.cabecalho.estilo.header.color}/>
                </div>
                </div>
                </div>
                </form>
                </div>
            )
        }
    });
}( module));
