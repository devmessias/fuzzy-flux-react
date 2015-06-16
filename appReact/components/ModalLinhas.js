(function( module, undefined) {
    var React = require('react');
    var TEXTO = require('../Textos/TEXT.js');
    var LinhasStore = require('../stores/Linhas.js');
    var ProdutosStore = require('../stores/Produtos.js');
    var CabecalhoStore = require('../stores/Cabecalho.js');
    var Acoes=require('../actions/Acoes.js');
    function convertHex(hex,transparencia){
        var r=null,g=null,b=null,result=null;
        transparencia = 1-transparencia;
        hex = hex.replace('#','');
        r = parseInt(hex.substring(0,2), 16);
        g = parseInt(hex.substring(2,4), 16);
        b = parseInt(hex.substring(4,6), 16);
        result = 'rgba('+r+','+g+','+b+','+transparencia+')';
        return result;
    }
    module.exports = React.createClass({
        _onChange: function() {
            this.setState({linhas: LinhasStore.get(),produtos:ProdutosStore.get()});
        },
        getInitialState: function() {
            return {linhas: LinhasStore.get(),produtos:ProdutosStore.get()};
        },
        componentWillUnmount: function() {
            ProdutosStore.removeChangeListener(this._onChange);
            LinhasStore.removeChangeListener(this._onChange);
        },
        componentDidMount: function(){
            LinhasStore.addChangeListener(this._onChange);
            ProdutosStore.addChangeListener(this._onChange);
            $('select').material_select();
        },
        changeFamilia:function(event){
            var familia = event.target.value;
            var dados = this.state.linhas.estilo;
            dados.linha.fontFamily = familia;
            Acoes.linhas(dados);
        },
        transparencia:function(){
            var nTamanho = this.refs.transparencia.getDOMNode().value;
            var dados = this.state.linhas.estilo;
            dados.transparencia = Number(nTamanho)/100;
            Acoes.linhas(dados);
        },
        tamanho:function(){
            var nTamanho = this.refs.tamanho.getDOMNode().value;
            var dados = this.state.linhas.estilo;
            dados.linha.fontSize = nTamanho.toString()+'px';
            Acoes.linhas(dados);
        },
        changePadding:function(){
            var nTamanho = this.refs.padding.getDOMNode().value;
            var dados = this.state.linhas.estilo;
            dados.paddingTop = Number(nTamanho);
            Acoes.linhas(dados);
        },
        changeEstilo: function(event){
            var dados = this.state.linhas.estilo;
            dados.linha.fontStyle= event.target.value;
            Acoes.linhas(dados);
        },
        changeWeight: function(event){
            var dados = this.state.linhas.estilo;
            dados.linha.fontWeight= event.target.value;
            Acoes.linhas(dados);
        },
        changeTempo: function(event){
            var dados = this.state.produtos;
            dados.animacao.tempo= Number(event.target.value*1000);
            Acoes.produto.atualizar(dados);
        },
        changeNumLinhas: function(event){
            var dados = this.state.produtos;
            dados.animacao.numLinhas= event.target.value;
            Acoes.produto.atualizar(dados);
        },
        changeAlinhamento: function(event){
            var dados = this.state.linhas.estilo;
            dados.nome.textAlign= event.target.value;
            Acoes.linhas(dados);
        },
        changeAlinhamentoPreco: function(event){
            var dados = this.state.linhas.estilo;
            dados.preco.textAlign= event.target.value;
            Acoes.linhas(dados);
        },
        changeColor: function(event){
            var dados = this.state.linhas.estilo;
            dados.linha.color= event.target.value;
            Acoes.linhas(dados);
        },
        changeBorderColor: function(event){
            var dados = this.state.linhas.estilo;
            dados.borderColor= event.target.value;
            Acoes.linhas(dados);
        },
        changeBorderSize:function(){
            var nTamanho = this.refs.borderSize.getDOMNode().value;
            var dados = this.state.linhas.estilo;
            dados.borderSize = nTamanho.toString();
            Acoes.linhas(dados);
        },
        changeBackColorPromo: function(event){
            var dados = this.state.linhas.estilo;
            dados.linhaPromo.backgroundColor= event.target.value;
            Acoes.linhas(dados);
        },
        changeColorPromo: function(event){
            var dados = this.state.linhas.estilo;
            dados.linhaPromo.color= event.target.value;
            Acoes.linhas(dados);
        },
        changeBackColor: function(event){
            var dados = this.state.linhas.estilo;
            dados.linhaPar.backgroundColor=event.target.value;
            Acoes.linhas(dados);
        },
        changeColorPar: function(event){
            var dados = this.state.linhas.estilo;
            dados.linhaPar.color= event.target.value;
            Acoes.linhas(dados);
        },
        changeCaixaAlta: function(){
            var dados=this.state.linhas.estilo;
            if (dados.linha.textTransform=='uppercase'){
                dados.linha.textTransform='none';
            }else{
                dados.linha.textTransform='uppercase';
            }
            Acoes.linhas(dados);
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
                <div className="input-field col s6">
                <select onChange={this.changeEstilo}
                className='browser-default'>
                <option value="" disabled selected> Escolha o Estilo</option>
                <option value="normal">Normal</option>
                <option value="italic">Itálico</option>
                </select>
                </div>

                <div className='col s12'>
                <div className="input-field col s6">
                <small>Tenha em mente que algumas famílias de fonte tem opções de impacto limitadas, a fonte
                com mais opções e usada pelo google é a Roboto</small>
                <select onChange={this.changeWeight}
                className='browser-default'>
                <option value="" disabled selected> Escolha o impacto da fonte
                </option>
                <option value="bold">5(Negrito)</option>
                <option value="500">4(Pouco forte)</option>
                <option value="normal">3(Normal)</option>
                <option value="300">2(Leve)</option>
                <option value="200">1(Levíssimo)</option>
                </select>
                </div>
                <div className="input-field col s6">
                <select onChange={this.changeAlinhamento}
                className='browser-default'>
                <option value="" disabled selected> Alinhar texto do produto ao...</option>
                <option value="center">Centro</option>
                <option value="left">Esquerda</option>
                <option value="right">Direita</option>
                </select>
                </div>

                </div>
                <div className="input-field col s6">
                <select onChange={this.changeAlinhamentoPreco}
                className='browser-default'>
                <option value="" disabled selected> Alinhar texto do preço ao...</option>
                <option value="center">Centro</option>
                <option value="left">Esquerda</option>
                <option value="right">Direita</option>
                </select>
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
                <p className="range-field">
                <input type="range"
                ref='tamanho'
                id="tamanho"
                defaultValue={Number(this.state.linhas.estilo.linha.fontSize.replace('px',''))}
                onChange={this.tamanho}
                min="10"
                max="100" />
                </p>
                <label
                htmlFor="tamanho">
                {TEXTO.FONTE.TAMANHO}
                &nbsp;&nbsp;{this.state.linhas.estilo.linha.fontSize}
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
                defaultValue={this.state.linhas.estilo.paddingTop}
                onChange={this.changePadding}
                min="1"
                max="18" />
                </p>
                <label
                htmlFor="padding">
                Espaçamento entre as linhas
                &nbsp;&nbsp;{this.state.linhas.estilo.paddingTop}px
                </label>
                </div>
                </div>
                <div className="input-field col s6">
                <p>
                <span>
                Escolha a Cor do Texto das Linhas Brancas
                </span>
                </p>
                <input type="color"
                onChange={this.changeColor}
                defaultValue={this.state.linhas.estilo.linha.color}
                min="10"
                max="100" />
                </div>
                <div className="input-field col s6">
                <p>
                <span>
                Escolha a Cor das Linhas
                </span>
                </p>
                <input type="color"
                id="color"
                onChange={this.changeBackColor}
                defaultValue={this.state.linhas.estilo.linhaPar.backgroundColor}
                />
                </div>
                <div className="input-field col s6">
                <p>
                <span>
                Escolha a Cor do Texto das Linhas Coloridas
                </span>
                </p>
                <input type="color"
                onChange={this.changeColorPar}
                defaultValue={this.state.linhas.estilo.linhaPar.color}
                min="10"
                max="100" />
                </div>
                <div className="input-field col s6">
                <p>
                <span>
                Escolha a Cor da Linha Promocional
                </span>
                </p>
                <input type="color"
                onChange={this.changeBackColorPromo}
                defaultValue={this.state.linhas.estilo.linhaPromo.backgroundColor}
                min="10"
                max="100" />
                </div>
                <div className="input-field col s6">
                <p>
                <span>
                Escolha a Cor do Texto das Linhas Promocionais
                </span>
                </p>
                <input type="color"
                onChange={this.changeColorPromo}
                defaultValue={this.state.linhas.estilo.linhaPromo.color}
                min="10"
                max="100" />
                </div>
                <div className="input-field col s12">
                <p className="range-field">
                <input type="range"
                ref='transparencia'
                defaultValue={this.state.linhas.estilo.transparencia}
                onChange={this.transparencia}
                min="1"
                max="100" />
                </p>
                <label htmlFor='tempo'  >
                    Transparência das linhas
                &nbsp;&nbsp;{this.state.linhas.estilo.transparencia}
                </label>
                </div>
                </div>
                </form>
                <hr/>
                <form className="col s12">
                <legend>Bordas</legend>
                <div className="row">
                <div className="input-field col s6">
                <p className="range-field">
                <input type="range"
                ref='borderSize'
                defaultValue={this.state.linhas.estilo.borderSize}
                onChange={this.changeBorderSize}
                min="1"
                id='borderSize'
                max="5" />
                </p>
                <label htmlFor='borderSize'  >
                    Grossura da Borda em pixels
                &nbsp;&nbsp;{this.state.linhas.estilo.borderSize}
                </label>
                </div>
                <div className="input-field col s6">
                <p>
                <span>
                Escolha a Cor das Bordas
                </span>
                </p>
                <input type="color"
                onChange={this.changeBorderColor}
                defaultValue={this.state.linhas.estilo.borderColor}
                />
                </div>
                </div>
                </form>
                <hr/>
                <form className="col s12">
                <legend>Tabela e animação</legend>
                <div className="row">
                <div className="input-field col s6">
                <p className="range-field">
                <input type="range"
                ref='tempo'
                defaultValue={this.state.produtos.animacao.tempo/1000}
                onChange={this.changeTempo}
                min="1"
                id='tempo'
                max="30" />
                </p>
                <label htmlFor='tempo'  >
                    Tempo para atualizar a tabela
                &nbsp;&nbsp;{this.state.produtos.animacao.tempo/1000}
                &nbsp;segundos
                </label>
                </div>
                <div className="input-field col s6">
                <input id="icon_prefix2"
                type='number'
                onChange={this.changeNumLinhas}
                defaultValue={this.state.produtos.animacao.numLinhas}
                />
                <label htmlFor="icon_prefix2" className='active'>Número de Linhas</label>
                    </div>
                </div>
                </form>
                </div>
            )
        }
    });
}( module));
