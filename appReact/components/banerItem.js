(function( module, undefined) {
    var React = require('react');
    var Acoes=require('../actions/Acoes.js');
    module.exports = React.createClass({
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
                data: {nome:self.props.baner.nome},
                success: function( nome ) {
                    Acoes.baner.deletar({key:self.props.num})
                }
            } );
        },
        ajaxSubmit:function(){
            var $form = $(this.refs.form.getDOMNode());
            var formData = new FormData($form[0]);
            var self=this;
            console.log(formData);
            $.ajax( {
                type: "POST",
                url: $form.attr( 'action' ),
                data: formData,
                contentType: false,
                processData: false,
                success: function( nome ) {
                    Acoes.baner.carrega({key:self.props.num,nome:nome})
                }
            } );
        },
        componentWillUnmount:function(){
        },
        componentDidMount: function(){
        },
        carregaImagem:function(event){
            event.preventDefault();
            //submit =true;
            $(this.refs.inputFile.getDOMNode()).click();
        },
        botao:function(){
            if (this.props.baner.existe){
                return (<button className='btn btn-flat'
                        onClick={this.ajaxDeletar}>
                        Excluir
                        </button>);
            }else{
                return (<button className='btn btn-flat'
                        onClick={this.carregaImagem}>
                        <i className='mdi-image-image'></i>
                        Adicionar Imagem</button>);
            }
        },
        img:function(){
            imagem='img/baner/x.jpg';
            if (this.props.baner.existe){
                imagem=this.props.baner.nome;
            }
            return <img src={imagem}/>
        },
        render: function() {
            return (
                <div className='imgContainerBaner col s3'>
                <form
                onsubmit="return false;"
                ref='form'
                id="form"
                method="post"
                encType="multipart/form-data"
                action="upload.php">
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
                value={this.props.num.toString()}/>
                {this.img()}
                {this.botao()}
                </form>
                </div>
            )
        }
    });
}( module));
