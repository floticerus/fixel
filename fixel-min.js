/*
  fixel v0.0.1
  copyright 2014 - kevin von flotow
  MIT license
*/
(function(e){function h(a,b){this.elem=a;this.opts={top:0,zIndex:1};for(var c in b)this.opts[c]=b[c];this.visible=!1;this.fixed=null;(function(b){b._resizeHandler=function(){b.resizeHandler()};b._scrollHandler=function(){b.scrollHandler()}})(this);this.fix()}if(!e)return console.log("fixel: fatal! window object was not found");var g=function(){function a(){}for(var b="Arguments Function String Number Date RegExp Object".split(" "),c=0,d=b.length;c<d;++c)(function(b){a.prototype["is"+b]=function(a){return Object.prototype.toString.call(a)===
"[object "+b+"]"}})(b[c]);return new a}(),f=function(){if(CSSStyleDeclaration.prototype.setProperty){var a=function(b,a,d,e){if(g.isObject(d))for(var f in d)b.style[a](f,d[f]);else b.style[a](d,e)};return function(b,c,d){return"undefined"===typeof d&&g.isString(c)?b.style.getProperty(c):a(b,"setProperty",c,d)}}return CSSStyleDeclaration.prototype.setAttribute?function(b,c,d){return"undefined"===typeof d&&g.isString(c)?b.style.getAttribute(c):a(b,"setAttribute",c,d)}:function(b,a,d){if("undefined"===
typeof d&&g.isString(a))return b.style[a];b.style[a]=d}}();h.prototype={fix:function(){this.elem&&!this.fixed&&(this.fixed=this.elem.cloneNode(!0),this.fixed.removeAttribute("id"),f(this.fixed,{position:"fixed","z-index":this.opts.zIndex,top:this.opts.top}),this.setPos(),this.setVisible(!1),this.elem.parentNode.insertBefore(this.fixed,this.elem),e.addEventListener("scroll",this._scrollHandler,!1),this.scrollHandler())},unfix:function(){e.removeEventListener("scroll",this._scrollHandler);this.setVisible(!1);
this.fixed.remove();this.fixed=null},setDir:function(a,b){b="undefined"!==typeof b?b:this.elem.getBoundingClientRect()[a];f(this.fixed,a,b+"px")},setLeft:function(a){this.setDir("left",a)},setRight:function(a){a="undefined"!==typeof a?a:this.elem.getBoundingClientRect().right;a-=this.elem.parentNode.clientWidth;this.setDir("right",a)},setPos:function(){var a=this.elem.getBoundingClientRect();this.setLeft(a.left);this.setRight(a.right)},setVisible:function(a){var b,c;a?(b="block",c="hidden",this.setPos(),
e.addEventListener("resize",this._resizeHandler,!1)):(b="none",c="visible",e.removeEventListener("resize",this._resizeHandler));f(this.fixed,"display",b);f(this.elem,"visibility",c);this.visible=a},scrollHandler:function(){this.elem.getBoundingClientRect().top<parseInt(this.opts.top)?(this.visible||this.setVisible(!0),this.setLeft()):this.visible&&this.setVisible(!1)},resizeHandler:function(){this.setPos()}};e.fixel=h})(this.window);
