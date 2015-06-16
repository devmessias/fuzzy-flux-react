(function( module, undefined) {
    var React = require('react');
    var Acao = require('../actions/Acoes.js');
    var BaseStore = require('../stores/Base.js');
    var Baners =  require('./Baners.js');
    module.exports = React.createClass({
        redimensiona:function(){
            var nBase=this.state.base;
            var nWidth = nBase.baner.width.toString()+'%';
            if (nBase.baner.exibir){
                nWidth = nBase.baner.full ?'100%':nWidth;
                $('#reactBaner').css('width',nWidth);
                $('#reactBaner').css('height',$(window).height().toString()+'px');
                $('.rodape').css('width','100%');
                $('#reactBaner').css('display','block');
            }else{
                $('#reactBaner').css('display','none');
            }
        },
        _onChange: function() {
            if (this.isMounted()){
                this.setState({
                    base:BaseStore.get()
                });
                this.redimensiona();
            }
        },
        componentDidMount: function() {
            this.redimensiona();
            BaseStore.addChangeListener(this._onChange);
        },
        getInitialState: function() {
            return {
                base:BaseStore.get()
            }
        },
        componentWillUnmount: function() {
            BaseStore.removeChangeListener(this._onChange);
        },
        elemento:function(){
            if (this.state.base.baner.exibir){
                return <Baners base={this.state.base}/>
            }else{
                return <div></div>
            }
        },
        render: function() {
            return (<div>
                    {this.elemento()}</div>)
        }
    });
}( module));
