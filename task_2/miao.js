var radius = 120;
var dtr = Math.PI/180;//转换弧度值
var d=300;

var mcList = [];//保存a标签的大小信息
var active = false;
var lasta = 1;
var lastb = 1;
var distr = true;
var tspeed=10;
var size=250;

var mouseX=0;
var mouseY=0;

var howElliptical=1;

var aA=null;//保存a标签
var oDiv=null;//保存div

window.onload=function ()
{
    var i=0;
    var oTag=null;
    
    oDiv=document.getElementById('div1');
    
    aA=oDiv.getElementsByTagName('a');
    
    for(i=0;i<aA.length;i++)
    {
        oTag={};
        
        oTag.offsetWidth=aA[i].offsetWidth;//a标签的宽度和高度
        oTag.offsetHeight=aA[i].offsetHeight;
        // console.log(i+":"+aA[i].offsetHeight)
        
        mcList.push(oTag);
    }
    
    sineCosine( 0,0,0 );
    
    positionAll();
    
    oDiv.onmouseover=function ()
    {
        active=true;
    };
    
    oDiv.onmouseout=function ()
    {
        active=false;
    };
    
    oDiv.onmousemove=function (ev)
    {
        var oEvent=window.event || ev;
        
        mouseX=oEvent.clientX-(oDiv.offsetLeft+oDiv.offsetWidth/2);//相对于中心点坐标
        mouseY=oEvent.clientY-(oDiv.offsetTop+oDiv.offsetHeight/2);//相对于中心点坐标
        
        mouseX/=5;
        mouseY/=5;
    };
    
    setInterval(update, 30);
};

function update()
{
    var a;
    var b;
    
    if(active)
    {
        a = (-Math.min( Math.max( -mouseY, -size ), size ) / radius ) * tspeed;//size = 250
        b = (Math.min( Math.max( -mouseX, -size ), size ) / radius ) * tspeed;
    }
    else
    {
        a = lasta * 0.98;
        b = lastb * 0.98;
    }
    
    lasta=a;
    lastb=b;
    
    if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01)
    {
        return;//a,b很小时直接返回
    }
    
    var c=0;
    sineCosine(a,b,c);//求sca, b, c
    for(var j=0;j<mcList.length;j++)//对么每个a标签更新
    {
        var rx1=mcList[j].cx;
        var ry1=mcList[j].cy*ca+mcList[j].cz*(-sa);
        var rz1=mcList[j].cy*sa+mcList[j].cz*ca;
        
        var rx2=rx1*cb+rz1*sb;
        var ry2=ry1;
        var rz2=rx1*(-sb)+rz1*cb;
        
        var rx3=rx2*cc+ry2*(-sc);
        var ry3=rx2*sc+ry2*cc;
        var rz3=rz2;
        
        mcList[j].cx=rx3;
        mcList[j].cy=ry3;
        mcList[j].cz=rz3;
        
        per=d/(d+rz3);
        
        mcList[j].x=(howElliptical*rx3*per)-(howElliptical*2);
        mcList[j].y=ry3*per;
        mcList[j].scale=per;
        mcList[j].alpha=per;
        
        mcList[j].alpha=(mcList[j].alpha-0.6)*(10/6);
    }
    
    doPosition();//根据计算的位置及透明度放置a标签的位置
    depthSort();//深度排序，避免后面的遮挡前面的
}

function doPosition()
{
    var l=oDiv.offsetWidth/2;
    var t=oDiv.offsetHeight/2;
    for(var i=0;i<mcList.length;i++)
    {
        aA[i].style.left=mcList[i].cx+l-mcList[i].offsetWidth/2+'px';
        aA[i].style.top=mcList[i].cy+t-mcList[i].offsetHeight/2+'px';
        
        aA[i].style.fontSize=Math.ceil(12*mcList[i].scale/2)+8+'px';
        
        aA[i].style.filter="alpha(opacity="+100*mcList[i].alpha+")";
        aA[i].style.opacity=mcList[i].alpha;
    }
}

function depthSort()//深度排序
{
    var i=0;
    var aTmp=[];
    
    for(i=0;i<aA.length;i++)
    {
        aTmp.push(aA[i]);
    }
    
    aTmp.sort
    (
        function (vItem1, vItem2)
        {
            if(vItem1.cz>vItem2.cz)
            {
                return -1;
            }
            else if(vItem1.cz<vItem2.cz)
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }
    );
    
    for(i=0;i<aTmp.length;i++)
    {
        aTmp[i].style.zIndex=i;
    }
}

function positionAll()
{
    var phi=0;
    var theta=0;
    var max=mcList.length;//a标签的数量
    var i=0;
    
    var aTmp=[];
    var oFragment=document.createDocumentFragment();//文档片段
    
    //随机排序
    for(i=0;i<aA.length;i++)//aA:a标签的数量
    {
        aTmp.push(aA[i]);//将A标签放置在aTmp中
    }
    //
    aTmp.sort//对a标签随机排序
    (
        function ()
        {
            return Math.random()<0.5?1:-1;
        }
    );
    
    for(i=0;i<aTmp.length;i++)
    {
        oFragment.appendChild(aTmp[i]);//将随机排序的a标签存入文档片段
    }
    
    oDiv.appendChild(oFragment);//oDiv指向div,会打乱a标签的顺序
    
    for( var i=1; i<max+1; i++){
        if( distr )
        {
            phi = Math.acos(-1+(2*i-1)/max);//acos求反余弦值(-1,1)=>(3.14,0)
            theta = Math.sqrt(max*Math.PI)*phi;
        }
        else
        {
            phi = Math.random()*(Math.PI);
            theta = Math.random()*(2*Math.PI);
        }
        //坐标变换
        mcList[i-1].cx = radius * Math.cos(theta)*Math.sin(phi);
        mcList[i-1].cy = radius * Math.sin(theta)*Math.sin(phi);
        mcList[i-1].cz = radius * Math.cos(phi);
        
        aA[i-1].style.left=mcList[i-1].cx+oDiv.offsetWidth/2-mcList[i-1].offsetWidth/2+'px';
        aA[i-1].style.top=mcList[i-1].cy+oDiv.offsetHeight/2-mcList[i-1].offsetHeight/2+'px';
    }
}

function sineCosine( a, b, c)
{
    sa = Math.sin(a * dtr);//Math.cos(弧度制)
    ca = Math.cos(a * dtr);//而a,b,c为角度制
    sb = Math.sin(b * dtr);
    cb = Math.cos(b * dtr);
    sc = Math.sin(c * dtr);
    cc = Math.cos(c * dtr);//全部是全局变量
}