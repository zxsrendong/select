var SelectEle = function( obj ){
  var doc = document;
	this.container = doc.createElement('div');
	this.list = null;
	this.span = null;
	this.dropBtn = null; 
	that = this;
	var setAttribute = function(dom, attr, value){
		if( typeof value === 'object' ){
			dom.setAttribute(attr, JSON.stringify(value));
		} else if ( typeof value === 'function' ) {
			dom.setAttribute(attr, value());
		} else {
			dom.setAttribute(attr, value);
		}
	},
	createSelect = function( objSelect ){
		// 转换为需要的对象属性，是元素和属性配对
		var ele = {    
				a : 'dropBtn',
				ul : 'list',
				span : 'span'
			}
		var doc = document,
			attrObj = objSelect.attrObj,
			children = objSelect.children,
			nodeName, attribute, prop;
		for( var key in attrObj ){  // 设置container的属性
			setAttribute(that.container, key, attrObj[key]);
		}
		for( var i = 0, len = children.length; i < len; i++ ){  // 生成childnodes节点，并设置属性
			nodeName = children[i].name;
			prop = ele[nodeName];
			attribute = children[i].attr;
			that[ prop ] = doc.createElement( nodeName );
			if( typeof attribute === 'object' ){
				for( var attr in attribute ){
					setAttribute(that[prop], attr, attribute[attr]);
				}
			}
			that.container.appendChild( that[ prop ] );
		}
	},

	createList = function( objList ){
		// obj 至少包含三个属性options(array), childAttr(object), data(string)
		// options 中的项可以是 string、number 和 object，
		// 如果是 object，必须含有 txt(生成列表中显示的内容) 和 data(要绑定到list项中的数据)属性
		var options = objList.options, childAttr = objList.childAttr, data = objList.data,
			childLen = options.length, doc = document, li;
		for( var i = 0; i < childLen; i++ ){
			li = doc.createElement('li');
			// 设置li的属性
			for( var attr in childAttr ){
				setAttribute(that[prop], attr, childAttr[attr]);
			}
			if( options[i] instanceof Array ){
				li.setAttribute( data, options[i] );
				li.appendChild( doc.createTextNode(options[i].join('')) );
			} else if( typeof options[i] === 'object' ){
				li.setAttribute( data, JSON.stringify(options[i]) );
				li.appendChild( doc.createTextNode(options[i].txt) );
			} else if ( typeof options[i] === 'function' ){
				li.setAttribute( data, options[i]() );
				li.appendChild( doc.createTextNode(options[i]()) );
			} else {
				li.setAttribute( data, options[i] );
				li.appendChild( doc.createTextNode(options[i]) );
			}
			that.list.appendChild( li );
		}
		that.container.appendChild( that.list );
		return that.container;
	},
	init = function( obj ){
		createSelect( obj.select );
		if( document.getElementById(obj.parent) ){
			document.getElementById(obj.parent).appendChild( createList( obj.list ) );
		} else {
			document.body.appendChild( createList( obj.list ) );
		}
	};
	init( obj );
	return {
		setVal : function( val ){
			that.span.innerHTML = val.txt;
			that.span.setAttribute('data-value', val.value );
			var className = that.list.className.split(' ');
			className.push('none');
			that.list.className = className.join(' ');
		},
		getVal : function(){
			return that.span.getAttribute('data-value');
		},
		click : function(){
			var className = that.list.className.split(' ');
			if( className.indexOf('none') > -1 ){
				className.splice( className.indexOf('none'), 1);
				that.list.className = className.join(' ');
			}
		}
	}
}

var option = new SelectEle({
		parent : '',
		list : { 
			options : [
				{ txt : '一月', value : 1 },
				{ txt : '二月', value : 2 },
				{ txt : '三月', value : 3 },
				{ txt : '四月', value : 4 },
				{ txt : '五月', value : 5 },
				{ txt : '六月', value : 6 },
				{ txt : '七月', value : 7 },
				{ txt : '八月', value : 8 },
				{ txt : '九月', value : 9 },
				{ txt : '十月', value : 10 },
				{ txt : '十一月', value : 11 },
				{ txt : '十二月', value : 12 }
			],
			childAttr : {},
			data : 'data-option'
		},
		select : {
			attrObj : {'class': 'op-container', id : 'option-container'},
			children : [
				{ name : 'span', attr : { id : 'option-val', 'class' : 'op-text' } },
				{ name : 'a', attr : { href : ''} },
				{ name : 'ul', attr : { 'class': 'op-list none', id : 'option-list'} }
			]
		}
	});

var EventUtil = {
	getEvent:function(event){ //获得浏览器时事件对象
		return event ? event : window.event;
	},
	getTarget:function(event){ //获取当前操作目标对象
		return event.target || event.srcElement;
	},
	addEvent:function(element,type,handler){  //添加事件,重写事件，减少判断次数
		if(element.addEventListener){
			EventUtil.addEvent = function(element,type,handler){element.addEventListener(type,handler,false);}
		}else if(element.attachEvent){
			EventUtil.addEvent= function(element,type,handler){element.attachEvent('on' + type, handler);}
		} else{
			EventUtil.addEvent= function(element,type,handler){element['on' + type] = handler;}
		}
		EventUtil.addEvent(element,type,handler);
	},
	removeEvent : function(element,type,handler){  //删除事件,重写事件，减少判断次数
		if(element.removeEventListener){
			EventUtil.removeEvent= function(element,type,handler){element.removeEventListener(type,handler,false);}
		}else if(element.addEventListener){
			EventUtil.removeEvent = function(element,type,handler){element.detachEvent('on' + type, handler);}
		} else{
			EventUtil.removeEvent= function(element,type,handler){element['on' + type] = null;}
		}
		EventUtil.removeEvent(element,type,handler);
	},
	preventDefault:function(event){//阻止默认行为
		if(event.preventDefault){
			return event.preventDefault();
		} else {
			return event.returnValue = false;
		}
	},
	stopPropagation:function(event){ //终止冒泡
		if(event.stopPropagation){
			return event.stopPropagation();
		}else{
			return event.cancelBubble = true;
		}
	},
	getCharCode : function(event) { //取得的是keypress时的值。
		if(typeof event.charCode == 'number'){
			return event.charCode;
		} else {
			return event.keyCode;
		}
	},
	getWheelDelta : function(event){
		if(event.wheelDelta){
			return (client.engine.opera && client.engine.opera < 9.5 ? - event.wheelDelta : event.wheelDelta);
		} else {
			return -event.detail * 40;
		}
	}
};

EventUtil.addEvent(window, 'click', function(e){ 
	e = EventUtil.getEvent(e);
	var target = EventUtil.getTarget(e),
		nodeName = target.nodeName.toLowerCase();
	EventUtil.preventDefault(e);
	if( nodeName === 'li' ){
		var childNodes = target.parentNode.children;
		for( var i = 0, len = childNodes.length; i < len; i++){
			if(childNodes[i].getAttribute('class')){
				childNodes[i].removeAttribute('class');
			}
		}
		target.setAttribute('class','selected');
		option.setVal( JSON.parse(target.getAttribute('data-option')) );
	} else if( nodeName === 'div' || nodeName === 'a' || nodeName == 'span' ){
		option.click();
	}
});

