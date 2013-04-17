var SelectEle = function( obj ){
	var doc = document,
		containerAttr = { 'class':'op-container'},
		childName = ['span', 'a', 'ul'],
		childAttrs = {
			span : { 'class':'op-text', id : obj.span_id },
			ul : { 'class':'op-list', id : obj.list_id },
			a : {id : obj.dropBtn_id}
		};
	var setAttribute = function(dom, attr, value){
		if( typeof value === 'object' ){
			dom.setAttribute(attr, JSON.stringify(value));
		} else if ( typeof value === 'function' ) {
			dom.setAttribute(attr, value());
		} else {
			dom.setAttribute(attr, value);
		}
	},
	createSelect = function( obj ){
		// 转换为需要的对象属性，是元素和属性配对
		var e_div = doc.createElement('div'),
			attributes = containerAttr,
			e_ul;
		e_div.id = obj.container_id;
		if( typeof attributes === 'object' ){
			for( var attr in attributes ){  // 设置container的属性
				if( attr == 'class' || attr == 'cls' || attr == 'className'){ //兼容老版IE
					e_div.className = attributes[attr];
				} else {
					setAttribute( e_div, attr, attributes[attr]);
				}
			}
		}
		if( typeof obj.attr === 'object' ){
			for( var attr in obj.attr ){  // 设置container的属性
				if( e_div.hasAttribute(attr) && attr == 'class' ) {
					e_div.className = e_div.getAttribute(attr) + ' ' + obj.attr[attr];
				} else {
					setAttribute( e_div, attr, obj.attr[attr]);
				}
			}
		}
		if( document.getElementById(obj.parentNode) ){
			document.getElementById(obj.parentNode).appendChild( e_div );
		} else {
			document.body.appendChild( e_div );
		}
		if( childName.length > 0 ){
			var child = childName.shift();
			while( !!child ){
				var e_child = doc.createElement(child);
				if( child === 'ul') {
					e_ul = e_child;
				}
				if( typeof childAttrs[child] === 'object' ){
					for( var key in childAttrs[child] ){
						if( key == 'class' || key == 'cls' || key == 'className'){ //兼容老版IE
							e_child.className = childAttrs[child][key];
						} else {
							setAttribute(e_child, key, childAttrs[child][key]);
						}
						
					}
				}
				e_div.appendChild(e_child);
				child = childName.shift();
			}
		}
		return e_ul;
	},

	createList = function( obj ){
		var e_ul = createSelect(obj),
			attributes = obj.listItems.attr,
			data = obj.listItems.data,
			e_li,
			options;
			len;
		if( typeof obj.listItems.options === 'function' ){
			options = obj.listItems.options();
		} else {
			options = obj.listItems.options;
		}
		for( var i = 0, len = options.length; i < len; i++ ){
			e_li = doc.createElement('li');
			// 设置li的属性
			for( var attr in attributes ){
				if( attr == 'class' || attr == 'cls' || attr == 'className'){ //兼容老版IE
					e_li.className = attributes[attr];
				} else {
					setAttribute(e_li, attr, attributes[attr]);
				}
			}
			if( options[i] instanceof Array ){
				e_li.setAttribute( data, options[i] );
				e_li.appendChild( doc.createTextNode(options[i].join(',')) );
			} else if( typeof options[i] === 'object' ){
				e_li.setAttribute( data, JSON.stringify(options[i]) );
				e_li.appendChild( doc.createTextNode(options[i].txt) );
			} else if ( typeof options[i] === 'function' ){
				e_li.setAttribute( data, options[i]() );
				e_li.appendChild( doc.createTextNode(options[i]()) );
			} else {
				e_li.setAttribute( data, options[i] );
				e_li.appendChild( doc.createTextNode(options[i]) );
			}
			e_ul.appendChild( e_li );
		}
	}
	createList( obj );
	return {
		container : doc.getElementById( obj.container_id ),
		list : doc.getElementById( obj.list_id ),
		span : doc.getElementById( obj.span_id ),
		dropBtn : doc.getElementById( obj.dropBtn_id ),
		setVal : function( val ){
			this.span.innerHTML = val.txt;
			this.span.setAttribute('data-value', val.value );
			var className = this.list.className.split(' ');
			className.push('none');
			this.list.className = className.join(' ');
			// if( callback ){  //添加change方法
			// 	callback();
			// }
		},
		getVal : function(){
			return this.span.getAttribute('data-value');
		},
		click : function(){
			var className = this.list.className.split(' ');
			if( className.indexOf('none') > -1 ){
				className.splice( className.indexOf('none'), 1);
				this.list.className = className.join(' ');
			}
		}
	}
}

var option = new SelectEle({
	container_id : 'mon',
	list_id : 'option-mon-list',
	span_id : 'option-mon-text',
	dropBtn_id : 'option-mon-btn',
	parentNode : 'body', // 组件渲染的位置， 默认body
	attr : {}, // 设置自定义的container属性
	listItems : {
		attr : {},
		data : 'data-option',
		options : [  //可以是functio，返回值是 数组
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
		]
	}
});
