/** @preserve  fixel v0.0.1
 *  copyright 2014 - kevin von flotow
 *  MIT license
 */
;( function ( window )
    {
        if ( !window )
        {
            // window is not set - trying to run in nodejs or something? hmmm
            return console.log( 'fixel: fatal! window object was not found' )
        }

        var help = ( function ()
            {
                /** @constructor */
                function Helper(){}

                // type checks
                // inspired by underscore.js solution
                var r = [ 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Object' ]

                for ( var i = 0, l = r.length; i < l; ++i )
                {
                    ( function ( type )
                        {
                            Helper.prototype[ 'is' + type ] = function ( obj )
                            {
                                return Object.prototype.toString.call( obj ) === '[object ' + type + ']'
                            }
                        }
                    )( r[ i ] )
                }

                return new Helper()
            }
        )()

        // css function
        var CSS = ( function ()
            {
                if ( CSSStyleDeclaration.prototype.setProperty )
                {
                    function cssSET( elem, method, key, val )
                    {
                        if ( help.isObject( key ) )
                        {
                            // loop and set all keys in the object
                            for ( var k in key )
                            {
                                elem.style[ method ]( k, key[ k ] )
                            }
                        }
                        else
                        {
                            elem.style[ method ]( key, val )
                        }
                    }

                    // modern browsers
                    return function ( elem, key, val )
                    {
                        return typeof val === 'undefined' && help.isString( key ) ? elem.style.getProperty( key ) : cssSET( elem, 'setProperty', key, val )
                    }
                }
                else if ( CSSStyleDeclaration.prototype.setAttribute )
                {
                    // old ie
                    return function ( elem, key, val )
                    {
                        return typeof val === 'undefined' && help.isString( key ) ? elem.style.getAttribute( key ) : cssSET( elem, 'setAttribute', key, val )
                    }
                }
                else
                {
                    // pos - set style directly
                    return function ( elem, key, val )
                    {
                        if ( typeof val === 'undefined' && help.isString( key ) )
                        {
                            // get
                            return elem.style[ key ]
                        }
                        else
                        {
                            // set
                            elem.style[ key ] = val
                        }
                    }
                }
            }
        )()

        /** @constructor */
        function Fixel( elem, opts )
        {
            this.elem = elem

            this.opts = {
                top: 0,

                zIndex: 1
            }

            for ( var key in opts )
                this.opts[ key ] = opts[ key ]

            this.visible = false

            this.fixed = null

            // do this to avoid using Function.bind
            ;( function ( that )
                {
                    that._resizeHandler = function ()
                    {
                        that.resizeHandler()
                    }

                    that._scrollHandler = function ()
                    {
                        that.scrollHandler()
                    }
                }
            )( this )

            this.fix()
        }

        Fixel.prototype = {
            fix: function ()
            {
                if ( !this.elem || this.fixed )
                {
                    return
                }

                this.fixed = this.elem.cloneNode( true )

                // remove id tag since id must be unique
                this.fixed.removeAttribute( 'id' )

                CSS( this.fixed,
                    {
                        'position': 'fixed',

                        'z-index': this.opts.zIndex,

                        'top': this.opts.top
                    }
                )

                this.setPos()

                this.setVisible( false )

                // insert before this.elem
                this.elem.parentNode.insertBefore( this.fixed, this.elem )

                window.addEventListener( 'scroll', this._scrollHandler, false )

                // fire scrollHandler once
                this.scrollHandler()
            },

            unfix: function ()
            {
                window.removeEventListener( 'scroll', this._scrollHandler )

                // hide the element, in case removing doesn't work for some reason
                // setVisible false also removes the resize handler
                this.setVisible( false )

                // attempt to remove the element
                this.fixed.remove()

                // set fixed to null so this.fix() will work properly next time it's called
                this.fixed = null
            },

            setDir: function ( dir, num )
            {
                num = typeof num !== 'undefined' ? num : this.elem.getBoundingClientRect()[ dir ]

                CSS( this.fixed, dir, num + 'px' )
            },

            setLeft: function ( num )
            {
                this.setDir( 'left', num )
            },

            setRight: function ( num )
            {
                num = typeof num !== 'undefined' ? num : this.elem.getBoundingClientRect().right

                num = num - this.elem.parentNode.clientWidth

                this.setDir( 'right', num )
            },

            setPos: function ()
            {
                var rect = this.elem.getBoundingClientRect()

                this.setLeft( rect.left )

                this.setRight( rect.right )
            },

            setVisible: function ( bool )
            {
                var fixedDisplay,

                    elemVis

                if ( bool )
                {
                    fixedDisplay = 'block'

                    elemVis = 'hidden'

                    this.setPos()

                    window.addEventListener( 'resize', this._resizeHandler, false )
                }
                else
                {
                    fixedDisplay = 'none'

                    elemVis = 'visible'

                    window.removeEventListener( 'resize', this._resizeHandler )
                }

                CSS( this.fixed, 'display', fixedDisplay )

                CSS( this.elem, 'visibility', elemVis )

                this.visible = bool
            },

            scrollHandler: function ()
            {
                if ( this.elem.getBoundingClientRect().top < parseInt( this.opts.top ) )
                {
                    if ( !this.visible )
                    {
                        this.setVisible( true )
                    }

                    // set left to retain horizontal scrolling
                    this.setLeft()
                }
                else if ( this.visible )
                {
                    this.setVisible( false )
                }
            },

            resizeHandler: function ()
            {
                this.setPos()
            }
        }

        window.fixel = Fixel
    }
)( this.window );
