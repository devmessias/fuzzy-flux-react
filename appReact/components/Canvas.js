(function( module, undefined) {
    var React = require('react');
    var Acao = require('../actions/Acoes.js');
    var CanvasStore = require('../stores/Canvas.js');
    module.exports = React.createClass({
        _onChange: function() {
            this.setState(CanvasStore.get());
        },
        Draw:{
            draw:function(shapes, location,state,contexto)
            {
                var s = state.escalaPixels;
                var cx = state.camera.x;
                var cy = state.camera.y;
                for(var i in shapes)
                    {
                        contexto.translate(s*(location.x - cx), s*(location.y - cy));
                        var ent = shapes[i];
                        switch(ent.type)
                        {
                            case "rectangle":
                                this.rectangle(s*ent.x, s*ent.y, s*ent.w, s*ent.h, ent.theta, ent.dfc,contexto);
                            break;
                            case "circle":
                                this.circle(s*ent.x, s*ent.y, s*ent.r,ent.theta,contexto);
                            break;
                            default:
                                break;
                        }
                        contexto.setTransform(1, 0, 0, 1, 0, 0);
                    }
            },
            drawXaxis :function(state,kinematics,contexto)
            {
                // How many pixels are equal to one (virtual) meter:
                var s = state.escalaPixels;
                var w = state.widthMetros;
                var h = state.heightMetros;
                var cx = state.camera.x;
                var cartc = kinematics.x;
                for(var i = 0.5; i < w; i += 0.5)
                {
                    //insere os indices que indicam a posicao
                    //vair percorrer o i até que ele atinja um valor maior ou igual a variavel w, e chamara a fillT
                    contexto.fillText(Math.round(10*(i+cx))/10 + 'm', s*i, s*h-10);
                }
                this.drawLine({x: 0, y: s*h-10}, {x: s*w, y: s*h-10},contexto);
            },
            drawLine :function(a, b,contexto)
            {
                contexto.moveTo(a.x, a.y);
                contexto.lineTo(b.x, b.y);
                contexto.stroke();
            },
            circle:function(x,y,r,theta,contexto){
                contexto.translate(x, y);
                contexto.rotate(theta);
                contexto.beginPath();
                contexto.arc(0, 0, r, 0, Math.PI*2, false);
                contexto.fillStyle = 'blue';
                contexto.fill();
                contexto.closePath();
                contexto.setTransform(1, 0, 0, 1, 0, 0);
            },
            rectangle: function(x, y, w, h, theta, draw_from_center,contexto)
            {
                contexto.translate(x, y);
                contexto.rotate(theta);
                contexto.fillStyle = 'black';
                if(draw_from_center)
                    contexto.fillRect(-w/2, -h/2, w, h);
                else
                    contexto.fillRect(-w/2, -h, w, h);
                contexto.setTransform(1, 0, 0, 1, 0, 0);
            },
            clear:function(contexto,canvas){
                contexto.clearRect(0, 0, canvas.width, canvas.height);
            }
        },
        update:function(){
            this.Draw.clear(this.contexto,this.canvas);//limpa a tela para que possa ser recalculado tudo novamente
            //Acao.Pendulum.controlUpdate(Universe.Player.value);
            Acao.Pendulum.player();
            Acao.Pendulum.updateVal({playerX:this.state.playerX,escalaTempo:this.state.escalaTempo});
            this.Draw.draw(this.props.pendulum.shapes, {x: this.props.pendulum.kinematics.x, y: 2},this.state,this.contexto);
            //this.Draw.draw(this.props.pendulum.shapes, {x: -1, y: 2},this.state,this.contexto);
            //Universe.Pendulum.update();
            Acao.Pendulum.update(this.state.escalaTempo);
            Acao.Canvas.cameraX(this.props.pendulum.kinematics.x);
            this.Draw.drawXaxis(this.state,this.props.pendulum.kinematics,this.contexto);
            //Acao.Canvas.cameraX(0);
        },
        componentDidMount: function() {
            this.canvas=this.refs.canvas.getDOMNode();
            this.contexto=this.refs.canvas.getDOMNode().getContext('2d');
            this.timer = setInterval(this.update, this.state.escalaTempo);
            CanvasStore.addChangeListener(this._onChange);
        },
        getInitialState: function() {
            return CanvasStore.get();
        },
        componentWillUnmount: function() {
            CanvasStore.removeChangeListener(this._onChange);
        },
        render: function() {
            var width=this.state.widthMetros*this.state.escalaPixels;
            var height=this.state.heightMetros*this.state.escalaPixels;
            return (<canvas
                    ref='canvas'
                    width={width}
                    height={height}
                    style={
                        {
                            backgroundColor:'white',
                        }
                    }>
                    </canvas>)
        }
    });
}( module));
