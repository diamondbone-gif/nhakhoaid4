<?php

namespace UxBuilder\Ajax;

use UxBuilder\Options\Options;
use UxBuilder\Post\PostOptions;
use UxBuilder\Transformers\ArrayToString;

class PostSaver {

  public function save() {
    define( 'UX_BUILDER_SAVING', true );
    $data = json_decode( stripslashes( $_POST['data'] ), true );
    $can_edit = current_user_can( 'edit_post', $data['id'] );
    $can_publish = current_user_can( 'publish_post', $data['id'] );
    $can_save = apply_filters( 'ux_builder_can_save', '__return_true', $data );

    // Return an error if nonce is invalid.
    check_ajax_referer( 'ux-builder-' . $data['id'], 'security' );

    // Stop here if user is not allowed to edit post.
    if ( ! $can_edit or ! $can_save ) {
      return wp_send_json_error();
    }

    $post_content = '';

    if( array_key_exists( 'children', $data['content'] ) ) {
      $post = get_post( $data['id'] );
      $elements = ux_builder( 'elements' );
      $use_blocks = function_exists( 'use_block_editor_for_post' )
        ? use_block_editor_for_post( $post )
        : false;

      $stringify = new ArrayToString( $elements, $use_blocks );

      $post_content = $stringify->transform( $data['content']['children'] );
    }

    $current_status = get_post_status( $data['id'] );
    $post_status    = in_array( $data['status'], array( 'publish', 'private', 'pending', 'draft' ), true )
      ? $data['status']
      : $current_status;

    // Same rule as core: a user who cannot publish submits for review instead.
    if ( ! $can_publish && $post_status !== $current_status && in_array( $post_status, array( 'publish', 'private' ), true ) ) {
      $post_status = 'pending';
    }

    if ( $can_publish ) {
      $save_button = $post_status == 'publish'
        ? __( 'Update', 'wordpress' )
        : __( 'Publish', 'wordpress' );
    } else {
      $save_button = __( 'Submit for Review', 'wordpress' );
    }

    // Only fields the builder exposes for this post can be saved.
    $options    = new PostOptions( get_post( $data['id'] ) );
    $attributes = array_intersect_key( (array) $data['attributes'], $options->get_attributes_array()['values'] );
    $meta       = array_intersect_key( (array) $data['meta'], $options->get_meta_array()['values'] );

    $post = apply_filters( 'ux_builder_save_post', array_merge( $attributes, array(
      'ID' => $data['id'],
      'meta_input' => $meta,
      'post_content' => trim( $post_content ),
      'post_status' => $post_status,
    ) ) );

    if ( wp_update_post( $post ) ) {
      return wp_send_json_success( compact( 'post', 'save_button' ) );
    }

    return wp_send_json_error();
  }
}
