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

        // fixel = fixed element

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

            this._resizeHandler = this.resizeHandler.bind( this )

            this._scrollHandler = this.scrollHandler.bind( this )

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

                this.fixed.style.setProperty( 'position', 'fixed' )

                this.fixed.style.setProperty( 'z-index', this.opts.zIndex )

                this.fixed.style.setProperty( 'top', this.opts.top )

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

                this.fixed.style.setProperty( dir, num + 'px' )
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

                this.fixed.style.setProperty( 'display', fixedDisplay )

                this.elem.style.setProperty( 'visibility', elemVis )

                this.visible = bool
            },

            scrollHandler: function ()
            {
                // vertical scrolling
                if ( this.elem.getBoundingClientRect().top < parseInt( this.opts.top ) )
                {
                    if ( !this.visible )
                    {
                        this.setVisible( true )
                    }
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
