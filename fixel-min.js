/*
  fixel v0.0.1
  copyright 2014 - kevin von flotow
  MIT license
*/
(function(c){function e(a,b){this.elem=a;this.opts={top:0,zIndex:1};for(var c in b)this.opts[c]=b[c];this.visible=!1;this.fixed=null;this._resizeHandler=this.resizeHandler.bind(this);this._scrollHandler=this.scrollHandler.bind(this);this.fix()}if(!c)return console.log("fixel: fatal! window object was not found");e.prototype={fix:function(){this.elem&&!this.fixed&&(this.fixed=this.elem.cloneNode(!0),this.fixed.removeAttribute("id"),this.fixed.style.setProperty("position","fixed"),this.fixed.style.setProperty("z-index",
this.opts.zIndex),this.fixed.style.setProperty("top",this.opts.top),this.setPos(),this.setVisible(!1),this.elem.parentNode.insertBefore(this.fixed,this.elem),c.addEventListener("scroll",this._scrollHandler,!1),this.scrollHandler())},unfix:function(){c.removeEventListener("scroll",this._scrollHandler);this.setVisible(!1);this.fixed.remove();this.fixed=null},setDir:function(a,b){b="undefined"!==typeof b?b:this.elem.getBoundingClientRect()[a];this.fixed.style.setProperty(a,b+"px")},setLeft:function(a){this.setDir("left",
a)},setRight:function(a){a="undefined"!==typeof a?a:this.elem.getBoundingClientRect().right;a-=this.elem.parentNode.clientWidth;this.setDir("right",a)},setPos:function(){var a=this.elem.getBoundingClientRect();this.setLeft(a.left);this.setRight(a.right)},setVisible:function(a){var b,d;a?(b="block",d="hidden",this.setPos(),c.addEventListener("resize",this._resizeHandler,!1)):(b="none",d="visible",c.removeEventListener("resize",this._resizeHandler));this.fixed.style.setProperty("display",b);this.elem.style.setProperty("visibility",
d);this.visible=a},scrollHandler:function(){this.elem.getBoundingClientRect().top<parseInt(this.opts.top)?this.visible||this.setVisible(!0):this.visible&&this.setVisible(!1)},resizeHandler:function(){this.setPos()}};c.fixel=e})(this.window);