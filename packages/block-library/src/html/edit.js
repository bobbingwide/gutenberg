/**
 * WordPress dependencies
 */
import {
	__experimentalBlock as Block,
	BlockControls,
	PlainText,
	transformStyles,
} from '@wordpress/block-editor';
import {
	Disabled,
	SandBox,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Default styles used to unset some of the styles
// that might be inherited from the editor style.
const DEFAULT_STYLES = `
	html,body,:root {
		margin: 0 !important;
		padding: 0 !important;
		overflow: visible !important;
		min-height: auto !important;
	}
`;

export default function HTMLEdit( { attributes, setAttributes, isSelected } ) {
	const [ isPreview, setIsPreview ] = useState( false );
	const [ styles, setStyles ] = useState( [] );

	const editorStyles = useSelect(
		( select ) => select( 'core/block-editor' ).getSettings().styles,
		[]
	);

	useEffect( () => {
		setStyles( [ DEFAULT_STYLES, ...transformStyles( editorStyles ) ] );
	}, [ editorStyles ] );

	function switchToPreview() {
		setIsPreview( true );
	}

	function switchToHTML() {
		setIsPreview( false );
	}

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						isPressed={ ! isPreview }
						onClick={ switchToHTML }
					>
						HTML
					</ToolbarButton>
					<ToolbarButton
						isPressed={ isPreview }
						onClick={ switchToPreview }
					>
						{ __( 'Preview' ) }
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			<Disabled.Consumer>
				{ ( isDisabled ) =>
					isPreview || isDisabled ? (
						<Block.div className="wp-block-html">
							<SandBox
								html={ attributes.content }
								styles={ styles }
							/>
							{ /*
								An overlay is added when the block is not selected in order to register click events.
								Some browsers do not bubble up the clicks from the sandboxed iframe, which makes it
								difficult to reselect the block.
							*/ }
							{ ! isSelected && (
								<div className="block-library-html__preview-overlay" />
							) }
						</Block.div>
					) : (
						<Block.div className="wp-block-html is-html-editor">
							<PlainText
								__experimentalVersion={ 2 }
								aria-label={ __( 'HTML' ) }
								value={ attributes.content }
								onChange={ ( content ) =>
									setAttributes( { content } )
								}
								placeholder={ __( 'Write HTML…' ) }
							/>
						</Block.div>
					)
				}
			</Disabled.Consumer>
		</>
	);
}
