<!DOCTYPE html>
<html>
<head>
<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<style>
body{
    height:2400px;
    overflow:hidden;
}
</style>
</head>
<body>
<canvas id="projector" width="120" height="240"></canvas>
<canvas id="monitor" width="600" height="600"></canvas>
<script>
    var G = 9.8;
    var PX2M = 0.00028;
    var G2PX = G/PX2M;
    var G2PX_2 = G2PX/2;
    var G2PX_2_1000_1000 = G2PX_2/(1000*1000);
    var drops = [];
    var pipe = function(water,size){
        var line_star_index = (Math.ceil(water.length/size-1))*size;
        var arr = water.splice(line_star_index,(water.length-line_star_index));
        var length = arr.length;
        //var r = Math.floor(Math.random()*255);
        //var g = Math.floor(Math.random()*255);
        //var b = Math.floor(Math.random()*255);
        for(var i = 0; i < length ; i++){
            if(arr[i]){
                drops.push({
                    x:i,
                    time:0,
                    r:0,
                    g:0,
                    b:0
                })
            }
        }
        if(water.length>0){
            setTimeout(function(){
                pipe(water,size);
            },10)
        }
    }
    var clear_ctx = function(dom,color){
        var ctx = dom[0].getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, dom.width(), dom.height());
    }
    var monitor = $('#monitor');
    var monitor_ctx = monitor[0].getContext('2d');
    var flow = function(callback){
        clear_ctx(monitor,'rgba(255, 255, 255, 1)');
        var drop = '';
        for(var i =0;i<drops.length;i++){
            drop = drops[i];
            monitor_ctx.beginPath();
            drop.time += 1;
            if(drop.time > 1000){
                drops.splice(i,1);
            }else{
                //dom.css('top',top>1000?top%1000:top);
                monitor_ctx.fillStyle = 'rgba('+drop.r+', '+drop.g+', '+drop.b+', 1)';
                monitor_ctx.arc(drop.x*5, G2PX_2_1000_1000*Math.pow(drop.time,2), 2, 0, Math.PI*2, true);
            }
            monitor_ctx.fill();
        }
        setTimeout(function(){
            flow(callback);
        },1)
    }
    var format2water = function(data){
        var jump = 0;
        var arr = [];
        var length = data.length/4;
        for(var i=0;i<length;i++){
            var r= Math.abs(data[i*4]-255);
            var g= Math.abs(data[i*4+1]-255);
            var b= Math.abs(data[i*4+1]-255);
            //比较颜色值，超过20%阀值，做可区分处理
            if((r+g+b)>(256*3*(20/100))){
                arr.push(1);
            }else{
                arr.push(0);
            }
        }
        return arr;
    }
    var project = function(url){
        var img = new Image();
        img.onload = function () {
            var projector = $('#projector');
            var ctx = projector[0].getContext('2d');
            clear_ctx(projector,'rgba(255, 255, 255, 1)');
            ctx.drawImage(img, 0, 0);
            var imageData = ctx.getImageData(0,0,projector.width(),projector.height()).data;
            var water = format2water(imageData);
            pipe(water,projector.width());
            //drops = [{x:13,time:0},{x:12,time:0},{x:2,time:0},{x:15,time:0},{x:16,time:0}];
            flow();
        }  
        img.src = url;
    }
    project("2.png");
</script>
</body>
</html>
