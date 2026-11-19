/**
 * Final Tiles Gallery block
 *
 */
( function( blocks, i18n, element, components, blockEditor ) {
	var el = element.createElement;
	var __ = i18n.__;
	var SelectControl = components.SelectControl;
	var PanelBody = components.PanelBody;
	var TextareaControl = components.TextareaControl;

	var InspectorControls = blockEditor.InspectorControls;
	// useBlockProps exists only from WP 5.6, older versions fall back to API v1.
	var useBlockProps = blockEditor.useBlockProps;
	var galleries = ftg_galleries.items;

	var attributes = {
		galleryId: {
			type: 'number',
			default: 0
		},
		layout: {
			type: 'string',
			default: 'columns'
		},
		shortcodeAtts: {
			type: 'string',
		},
	};

	function buildShortcode( attrs ) {
		var galleryId = parseInt( attrs.galleryId );
		if ( ! galleryId || galleryId <= 0 ) {
			return '';
		}

		var extra = attrs.shortcodeAtts ? String( attrs.shortcodeAtts ).trim() : '';

		return '[FinalTilesGallery id="' + galleryId + '" layout="' + attrs.layout + '"' + ( extra ? ' ' + extra : '' ) + ']';
	}

	blocks.registerBlockType( 'ftg/gallery', {
		apiVersion: useBlockProps ? 3 : 1,
		title: __( 'Final Tiles Gallery', 'FinalTiles-gallery' ),
		icon: 'images-alt2',
		category: 'common',
		description: '',
		attributes: attributes,

		edit: function( props ) {
			var galleryId = props.attributes.galleryId;
			var layout = props.attributes.layout;
			var shortcodeAtts = props.attributes.shortcodeAtts;
			var blockProps = useBlockProps ? useBlockProps() : { className: props.className };

			function onChangeId( newID ) {
				props.setAttributes( { galleryId: parseInt( newID ) } );
			}

			function onChangeLayout( newLayout ) {
				props.setAttributes( { layout: newLayout } );
			}

			function onChangeshortcodeAtts( newContent ) {
				props.setAttributes( { shortcodeAtts: newContent } );
			}

			var controls = el(
				InspectorControls,
				{},
				el( PanelBody, {
					title: __( 'Shortcode parameters', 'FinalTiles-gallery' ),
					initialOpen: true
				},
					el( SelectControl, {
						label: __( 'Select gallery layout', 'FinalTiles-gallery' ),
						value: layout,
						options: [
							{ label: __( 'Masonry', 'FinalTiles-gallery' ), value: 'columns' },
							{ label: __( 'Final Tiles', 'FinalTiles-gallery' ), value: 'final' }
						],
						onChange: onChangeLayout
					} ),
					el( 'p', {}, __( 'Shortcode Attributes', 'FinalTiles-gallery' ) ),
					el(
						TextareaControl,
						{
							onChange: onChangeshortcodeAtts,
							value: shortcodeAtts || '',
							help: __( 'Space separated list of attributes. Example: margin="10" loaded_easing="linear" min_tile_width="250"', 'FinalTiles-gallery' )
						}
					)
				)
			);

			var editorOut = null;
			if ( galleries.length > 1 ) {
				editorOut = el( SelectControl, {
					label: __( 'Select gallery', 'FinalTiles-gallery' ),
					value: galleryId,
					options: galleries,
					onChange: onChangeId
				} );
			} else {
				editorOut = el( 'div', {},
					el( 'p', {}, __( "You don't seem to have any galleries.", 'FinalTiles-gallery' ) ),
					el( 'a', {
						target: '_blank',
						href: ftg_galleries.add_new_galler_url,
						className: 'components-button is-button is-default'
					}, __( 'Add Gallery', 'FinalTiles-gallery' ) )
				);
			}

			return el( element.Fragment, {},
				controls,
				el( 'div', blockProps, editorOut )
			);
		},

		save: function( props ) {
			var blockProps = useBlockProps ? useBlockProps.save() : {};

			return el( 'div', blockProps, buildShortcode( props.attributes ) );
		},

		deprecated: [
			{
				// Old markup kept " undefined" / trailing space when no extra attributes were set.
				attributes: attributes,
				save: function( props ) {
					var galleryId = parseInt( props.attributes.galleryId );
					var galleryShortcode = '';
					if ( galleryId > 0 ) {
						galleryShortcode = '[FinalTilesGallery id="' + galleryId + '" layout="' + props.attributes.layout + '" ' + props.attributes.shortcodeAtts + ']';
					}

					return el( 'div', { className: 'wp-block-ftg-gallery' }, galleryShortcode );
				},
			},
		],
	} );
}(
	window.wp.blocks,
	window.wp.i18n,
	window.wp.element,
	window.wp.components,
	window.wp.blockEditor || window.wp.editor
) );
