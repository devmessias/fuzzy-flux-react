(function( module, undefined) {
    var React = require('react');
    var LinhasStore = require('../stores/Linhas.js');
    var CabecalhoStore = require('../stores/Cabecalho.js');
    var ProdutosStore = require('../stores/Produtos.js');
    var Acao = require('../actions/Acoes.js');
    function isEven(n) {
        return n == parseFloat(n) && !(n % 2);
    }
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
            var data = LinhasStore.get();
            this.setState({linhas:data,produtos:ProdutosStore.get()});

            CabecalhoStore.emitChange();
        },
        getInitialState: function() {
            LinhasStore.iniciar();
            ProdutosStore.iniciar();
            return { linhas:LinhasStore.get(),produtos:ProdutosStore.get()};
        },
        atualizarLinhas:function(){
            var data = this.state.produtos;
            data.data.pag=this.state.produtos.data.pag+1;
            if (data.data.pag > data.data.totalPag || data.data.pag==data.data.totalPag){data.data.pag=1};
            Acao.produto.atualizar(data);
        },
        componentDidMount: function(){
            var self = this;
            LinhasStore.addChangeListener(this._onChange);
            ProdutosStore.addChangeListener(this._onChange);
            ProdutosStore.iniciar();
            this.interval = setInterval(this.atualizarLinhas, self.state.produtos.animacao.tempo);
        },
        componentWillUnmount: function() {
            ProdutosStore.removeChangeListener(this._onChange);
            LinhasStore.removeChangeListener(this._onChange);
        },
        nbsp:function(preco){
            var num = (5-preco.length);
            var nbsp=[];
            if (num>0){
                for (var i=0; i<num;i++) {
                    nbsp.push(<span  className='fantasma'>9</span>);
                }
            }
            return nbsp;
        },
        casas:function(preco){
            var elemen=preco.split('.');
            if (1 in elemen){
                var casas = elemen[1].length;
                if(casas<2){
                    var max=2-casas;
                    for (i=0; i<max;i++){
                        preco=preco+'0';
                    }
                }
            }else{
            preco=preco+'.00';
            }
            return preco;
        },
        linhas:function(){
            var self=this;
            var produtos=[];
            var primeiro = true;
            self.state.produtos.itens.map(function(item,key) {
                var estilo =JSON.parse(JSON.stringify(self.state.linhas.estilo.linha));
                var preco = (item.precopromocional=='1')?item.precopromocao:item.precovenda;
                if (isEven(key)){
                    estilo.backgroundColor=self.state.linhas.estilo.linhaPar.backgroundColor;
                    estilo.color=self.state.linhas.estilo.linhaPar.color;
                }
                preco=self.casas(preco);
                estilo.color = (item.precopromocional=='1')?self.state.linhas.estilo.linhaPromo.color:estilo.color;
                estilo.backgroundColor = (item.precopromocional=='1')?self.state.linhas.estilo.linhaPromo.backgroundColor:estilo.backgroundColor;
                estilo.backgroundColor=convertHex(estilo.backgroundColor,self.state.linhas.estilo.transparencia);
                if (primeiro) {
                    produtos.push(
                        <tr style={estilo} key={key}>
                        <td style={self.state.linhas.estilo.nome}>
                        <i
                        onClick={Acao.abrirModal.bind(this,'linhas')}
                        className={'left  mdi-action-settings '+self.props.base.editor}></i>
                        {item.descricao}</td>
                        <td style={self.state.linhas.estilo.preco}>
                        R$&nbsp;&nbsp;{self.nbsp(preco)}
                        {preco}
                        <span className=''> {item.tipovenda}</span>
                        </td>
                        </tr>
                    )
                }else{
                    produtos.push(
                        <tr style={estilo} key={key}>
                        <td style={self.state.linhas.estilo.nome}>
                        {item.descricao}</td>
                        <td style={self.state.linhas.estilo.preco}>
                        R$&nbsp;&nbsp;{self.nbsp(preco)}
                        {preco}
                        <span className=''> {item.tipovenda}</span>
                        </td>
                        </tr>
                    );
                }
                primeiro=false;
            }.bind(this));
            return produtos;
        },
        render: function() {
            return (
                <tbody>
                {this.linhas()}
                </tbody>
            )
        }
    });
}( module));
