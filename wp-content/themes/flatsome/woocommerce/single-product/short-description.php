<?php
/**
 * Single product short description
 *
 * @author           Automattic
 * @package          WooCommerce/Templates
 * @version          3.3.0
 * @flatsome-version 3.16.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

global $post;

$short_description = apply_filters( 'woocommerce_short_description', $post->post_excerpt );

if ( ! $short_description ) {
	return;
}

?>
<div class="product-short-description">
	<?php echo $short_description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Short descriptions intentionally contain filtered post and extension HTML. ?>
</div>
