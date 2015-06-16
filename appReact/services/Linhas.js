(function() {
    var format = require('string-format');
    format.extend(String.prototype);
    var TIPOS= {
        estilo:{
            transparencia:0.1,
            borderSize:'1',
            borderColor:'#EBEBEB',
            paddingTop:10,
            linha:{
                fontFamily: "'Roboto'",
                fontStyle:'normal',
                fontWeight:'normal',
                color:'#000000',
                backgroundColor:'#ffffff',
                fontSize:'20px',
                borderBottom:'1px solid #ffffff'
            },
            linhaPromo:{
                backgroundColor:'#ffffff',
                color:'#000000'
            },
            linhaPar:{
                backgroundColor:'#ffffff',
                color:'#000000'
            },
            nome:{
                textAlign:'center',
                width:'70%',
            },
            preco:{
                textAlign:'center',
                width:'30%'
            }
        },
        retorna:function(){
            var borderBottom='{0}px solid {1}'.format(
                this.estilo.borderSize,this.estilo.borderColor);
                var padding='{0}px 5px'.format(
                    this.estilo.paddingTop);
                    this.estilo.linha.borderBottom=borderBottom;
                    this.estilo.nome.padding= padding;
                    this.estilo.preco.padding=padding;
                    return {
                        estilo:this.estilo,
                    };
        }
    };
    module.exports = TIPOS;
}());
