<?php
defined('ABSPATH') || die();
/** @var $this NextendSocialProviderAdmin */

$provider = $this->getProvider();
?>

<div class="nsl-admin-sub-content">
    <?php $this->renderGettingStartedHead(); ?>

    <ul>
        <li>
            <b>Authorised redirect URIs:</b>
            <ul class='nsl-list-disc'>
                <?php
                $loginUrls = $provider->getAllRedirectUrisForAppCreation();
                foreach ($loginUrls as $loginUrl) {
                    echo "<li>" . esc_url($loginUrl) . "</li>";
                }
                ?>
            </ul>
        </li>
        <?php if (in_array($provider->settings->get('one_tap'), array('buttons', 'all'), true)): ?>
            <li>
                <b>Authorized JavaScript origins:</b>
                <ul class='nsl-list-disc'>
                    <li><?php echo esc_html(NextendSocialLogin::getOrigin()); ?></li>
                </ul>
                <p class="description"><?php _e('Required by Google One Tap. Without it the One Tap prompt never appears.', 'nextend-facebook-connect'); ?></p>
            </li>
        <?php endif; ?>
        <li>
            <b>Authorized domains:</b>
            <ul class='nsl-list-disc'>
                <li><?php echo NextendSocialLogin::getDomain(); ?></li>
            </ul>
        </li>
    </ul>

    <?php $this->renderGettingStartedFooter(); ?>
</div>