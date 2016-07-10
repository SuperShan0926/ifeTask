function getByClass(clsName,parent) {
	var oParent = document.getElementById(parent) || document;
	eles = [];
	elements = oParent.getElementsByTagName('*');
	for (var i = 0; i < elements.length; i++) {
		if(elements[i].className === clsName){
			eles.push(elements[i]);
		}
	}	
	return eles;
}

window.onload = drag;
function drag() {
	var oDarg = getByClass('drag');
	oDarg.forEach(function (item,index) {
		item.onmousedown = fnDown;
		 item.onmouseup = fnUp;
	});
}

function fnDown(event) {
	//兼容处理
	var oEvent = event || window.event;
	var target = oEvent.target || oEvent.srcElement;
	target.className = 'clicked';
	var removed = remove.parentNode.removeChild(remove);
	document.onmousemove = function (e) {	
		var oDarg = document.getElementsByClassName('clicked')[0];
		document.title = e.clientX+','+e.clientY;
		var list = document.getElementsByClassName('list')[0];
		oDarg = list.removeChild(oDarg);
		oDarg.style.position="absolute";
		oDarg.style.left = e.clientX+'px';
		oDarg.style.top = e.clientY+'px';
		oDarg.style.zIndex = 1000;
	};

}

function fnUp(e) {
	// console.log(document.getElementsByClassName('clicked')[0].parentNode.nodeName);
	var remove = document.getElementsByClassName('clicked')[0];
	var removed = remove.parentNode.removeChild(remove);
	var list = document.getElementsByClassName('list1')[0];
	remove.style.position = 'static';
	list.appendChild(removed);
	document.onmousemove = null;
	e.target.className = 'drag';
}


