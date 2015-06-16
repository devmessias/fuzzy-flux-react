(function() {
    var _ = require('lodash/array');
    var TIPOS= {
        data:{
            pag:0,
            total:null,
            produtos:null,
            totalPag:null,
        },
        animacao:{
            numLinhas:5,
            tempo:4000
        },
        getItensPaginados:function(page){
            var page = page || 1,
                items=this.data.produtos,
                per_page = Number(this.animacao.numLinhas),
                offset = (page - 1) * per_page,
                paginatedItems = _.rest(items, offset).slice(offset, offset+per_page);
            return paginatedItems;
        },
        ajaxCarrega: function(){
            var self=this;
            var dfd = $.Deferred();
            $.ajax({
                type:'GET',
                url:'produtos.php',
                success:function(produtos){
                    produtos = JSON.parse(produtos);
                    self.data.produtos=produtos;
                    self.data.total=produtos.length;
                    self.data.totalPag=Math.ceil(self.data.total/self.animacao.numLinhas);
                    dfd.resolve();
                },
                error:function(){
                    dfd.fail();
                }
            })
            return dfd.promise();
        },
        retorna:function(){
            return {
                data:this.data,
                itens:this.getItensPaginados(this.data.pag),
                animacao:this.animacao
            };
        }
    };
    module.exports = TIPOS;
}());
