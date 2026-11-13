<?php

namespace UxBuilder\Ajax;

class DoShortcode {

  public function do_shortcode() {
    $post_id = isset( $_POST['post_id'] ) ? (int) $_POST['post_id'] : 0;
    $nonce   = isset( $_POST['security'] ) ? $_POST['security'] : '';

	define( 'UX_BUILDER_DOING_AJAX', true );

    if ( ! wp_verify_nonce( $nonce, 'ux-builder-' . $post_id ) ) {
      echo '<div class="uxb-error">';
      echo __( 'Sorry, an error occurred while rendering this element.', 'flatsome' );
      echo '</div>';
      die;
    }

	define( 'UX_BUILDER_AJAX_REQUEST', true );

    $shortcode = wp_parse_args( $_POST['ux_builder_shortcode'], array(
      'tag' => '', '$id' => '', 'options' => array()
    ) );

    setup_postdata( get_the_ID() );

    // Get current shortcode data.
    $current_shortcode = ux_builder_shortcodes()->get( $shortcode['tag'] );

    // Set <content/> as shortcode content to allow nested
    // shortcodes if current shortcode is a container.
    if( $current_shortcode['type'] == 'container' ) {
        $shortcode['children'] = array( array(
            'tag' => 'text',
            'options' => array(),
            'content' => '<content></content>',
        ) );
    }

    add_filter( 'pre_do_shortcode_tag', array( $this, 'restrict_block' ), 10, 3 );

    // Render and return the shortcode markup.
    echo do_shortcode( ux_builder( 'to-string' )->transform( array( $shortcode ) ) );

    die;
  }

  /**
   * Stops the preview from rendering blocks the current user cannot read.
   * Live pages intentionally render unpublished blocks, so this is preview only.
   *
   * @param false|string $output Short-circuit output.
   * @param string       $tag    Shortcode tag.
   * @param array|string $attr   Shortcode attributes.
   * @return false|string
   */
  public function restrict_block( $output, $tag, $attr ) {
    if ( 'block' !== $tag || empty( $attr['id'] ) ) {
      return $output;
    }

    $block_id = flatsome_get_block_id( $attr['id'] );

    if ( $block_id && get_post( $block_id ) && ! current_user_can( 'read_post', $block_id ) ) {
      return '<div class="uxb-error">' . __( 'Sorry, an error occurred while rendering this element.', 'flatsome' ) . '</div>';
    }

    return $output;
  }
}
