<?php
defined('ABSPATH') || die();
/**
 * Provider specific rows for the shared PRO settings section.
 *
 * Included from admin/templates-provider/settings-pro.php, so $provider, $settings, $isPRO and
 * $attr are already in scope. Outputs <tr> elements only.
 *
 * @var $this     NextendSocialProviderAdmin
 * @var $provider NextendSocialProviderGoogle
 * @var $settings NextendSocialLoginSettings
 * @var $isPRO    bool
 * @var $attr     string
 */

$oneTap = $settings->get('one_tap');
if (!in_array($oneTap, array('buttons', 'all'), true)) {
    $oneTap = 'disabled';
}

/**
 * The descriptions stay short: each one links to its part of the documentation.
 */
$oneTapDocLink = function ($anchor) use ($provider) {
    return '<a href="' . esc_url($provider->getDocURL() . '#' . $anchor) . '" target="_blank">';
};
?>
<tr>
    <th scope="row"><?php _e('Google One Tap', 'nextend-facebook-connect'); ?></th>
    <td>
        <fieldset>
            <legend class="screen-reader-text">
                <span><?php _e('Google One Tap', 'nextend-facebook-connect'); ?></span></legend>
            <label><input type="radio" name="one_tap"
                          value="disabled" <?php if ($oneTap === 'disabled') : ?> checked="checked" <?php endif; ?><?php echo $attr; ?>>
                <span><?php _e('Disabled', 'nextend-facebook-connect'); ?></span></label><br>
            <label><input type="radio" name="one_tap"
                          value="buttons" <?php if ($oneTap === 'buttons') : ?> checked="checked" <?php endif; ?><?php echo $attr; ?>>
                <span><?php _e('Show where the Google button appears', 'nextend-facebook-connect'); ?></span></label><br>
            <label><input type="radio" name="one_tap"
                          value="all" <?php if ($oneTap === 'all') : ?> checked="checked" <?php endif; ?><?php echo $attr; ?>>
                <span><?php _e('Show on all pages', 'nextend-facebook-connect'); ?></span></label><br>
        </fieldset>
        <p class="description" id="tagline-one_tap"><?php printf(__('Shows Google\'s One Tap prompt, so visitors can sign in with their Google account without leaving the page. %1$sLearn more%2$s.', 'nextend-facebook-connect'), $oneTapDocLink('google-one-tap'), '</a>'); ?></p>
        <p class="description"><?php printf(__('%1$s Requires HTTPS, and %2$s added to the %3$sAuthorized JavaScript origins%4$s of your Google app.', 'nextend-facebook-connect'), '<b>' . __("Usage:", "nextend-facebook-connect") . '</b>', '<code>' . esc_html(NextendSocialLogin::getOrigin()) . '</code>', $oneTapDocLink('google-one-tap-requirements'), '</a>'); ?></p>
        <p class="description"><?php printf(__('%1$s Unlike the Google button, One Tap loads Google\'s script as soon as the page opens. %2$sLearn more%3$s.', 'nextend-facebook-connect'), '<b>' . __("Important:", "nextend-facebook-connect") . '</b>', $oneTapDocLink('google-one-tap-privacy'), '</a>'); ?></p>
    </td>
</tr>
