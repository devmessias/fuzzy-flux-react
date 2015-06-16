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
        componentDidMount: function(){
            CabecalhoStore.addChangeListener(this._onChange);
        },
        componentWillUnmount: function() {
            CabecalhoStore.removeChangeListener(this._onChange);
        },
        changeLogo:function(){
            var nTamanho = this.refs.logoSlider.getDOMNode().value;
            var dados = this.props.base;
            dados.tabela.logo.height= Number(nTamanho);
            Acoes.base.atualizarTabela(dados);
        },
        changeTamanho:function(){
            var nTamanho = this.refs.tamanho.getDOMNode().value;
            var dados = this.props.base;
            dados.tabela.width = Number(nTamanho);
            dados.baner.width = 100-Number(nTamanho);
            Acoes.base.atualizarTabela(dados);
        },
        toogleTabela : function(event){
            Acoes.base.toogleTabela({oque:'baner',exibir:event.target.checked});
        },
        handleFileSelect:function(evt){
            evt.preventDefault();
            var files = evt.target.files; // FileList object
            var output = [];
            var self =this;
            var reader = new FileReader();
            for (var i = 0, f; f = files[i]; i++) {
                if (!f.type.match('image.*')) {
                    continue;
                }
                reader.onload = (function(theFile) {
                    return function(e) {
                        self.ajaxSubmit();
                    };
                })(f);
                reader.readAsDataURL(f);
            }
        },
        ajaxDeletar:function(event){
            event.preventDefault();
            var self=this;
            $.ajax( {
                type: "POST",
                url: 'deletar.php',
                data: {nome:self.props.base.tabela.logo.nome},
                success: function( nome ) {
                    Acoes.base.logo.deletar();
                }
            } );
        },
        ajaxSubmit:function(){
            var $form = $(this.refs.form.getDOMNode());
            var formData = new FormData($form[0]);
            var self=this;
            $.ajax( {
                type: "POST",
                url: $form.attr( 'action' ),
                data: formData,
                contentType: false,
                processData: false,
                success: function( nome ) {
                    Acoes.base.logo.carrega(nome)
                }
            } );
        },
        carregaImagem:function(event){
            event.preventDefault();
            //submit =true;
            $(this.refs.inputFile.getDOMNode()).click();
        },
        botao:function(){
            if (this.props.base.tabela.logo.existe){
                return (<button className='btn btn-flat center-block center'
                        style={{width:'100%'}}
                        onClick={this.ajaxDeletar}>
                        Excluir Logo
                        </button>);
            }else{
                return (<button className='btn btn-flat center-block center'
                        style={{width:'100%'}}
                        onClick={this.carregaImagem}>
                        Adicionar Logo</button>);
            }
        },
        img:function(){
            imagem='img/baner/x.jpg';
            if (this.props.base.tabela.logo.existe==1){
                imagem=this.props.base.tabela.logo.nome;
            }
            return <img src={imagem} className='logoImgModal center-block'/>
        },
        render: function() {
            var master = this.props.base.contaSiempre.logado;
            var tabela = this.props.display;
            var existeTabela = tabela=='none'?false:true;
            var mostrar = master && existeTabela?'block':'none';
            return (
                <div className="row">
                <form className="col s12">
                <div className="row">
                <div className="input-field ">
                <p>
                <input type="checkbox"
                onChange={this.toogleTabela}
                defaultChecked={this.props.base.baner.exibir ? "checked" : ""}
                id='toogleBaner'/>
                <label htmlFor="toogleBaner">Exibir Baner?</label>
                </p>
                </div>
                </div>
                <div className="row">
                <div className="input-field "
                style={{display:mostrar}}>
                <p className='center'>
                Escolha o tamanho da Tabela
                <h5 className='center'>{this.props.base.tabela.width.toString()}%</h5>
                </p>
                <p className="range-field">
                <input type="range"
                ref='tamanho'
                id="tamanho"
                onChange={this.changeTamanho}
                min="10"
                defaultValue={this.props.base.tabela.width}
                max="100" />
                </p>
                </div>
                </div>
                <div className="row">
                <div className="input-field ">
                <p className='center'>
                Escolha o tamanho da Logo
                <h5 className='center'>{this.props.base.tabela.logo.height.toString()}%</h5>
                </p>
                <p className="range-field">
                <input type="range"
                ref='logoSlider'
                onChange={this.changeLogo}
                min="10"
                defaultValue={this.props.base.tabela.logo.height}
                max="100" />
                </p>
                </div>
                </div>
                </form>
                <form
                onsubmit="return false;"
                ref='form'
                id="form"
                className='center-block'
                method="post"
                encType="multipart/form-data"
                action="upload.php"
                style={{maxWidth:'30%'}}>
                <p className='center'>Escolha o Logo</p>
                <input
                type="file"
                id="files"
                name='imagem'
                onChange={this.handleFileSelect}
                ref='inputFile'
                accept="image/jpg, image/jpeg"
                style={{display:'none'}}  />
                <input
                type='hidden'
                name='nome'
                value='logo'/>
                {this.img()}
                {this.botao()}
                </form>
                </div>
            )
        }
    });
}( module));
