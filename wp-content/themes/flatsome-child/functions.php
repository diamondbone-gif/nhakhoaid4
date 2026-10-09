<?php

// Nạp CSS và JavaScript tùy chỉnh của website
add_action('wp_enqueue_scripts', 'nhakhoaid4_enqueue_assets');

function nhakhoaid4_enqueue_assets()
{

    $theme_dir = get_stylesheet_directory();
    $theme_uri = get_stylesheet_directory_uri();


    // Menu chính - sử dụng trên toàn website
    $main_menu_css = '/asset/css/main-menu.css';

    if (file_exists($theme_dir . $main_menu_css)) {
        wp_enqueue_style(
            'nhakhoaid4-main-menu',
            $theme_uri . $main_menu_css,
            array(),
            filemtime($theme_dir . $main_menu_css)
        );
    }

    $main_menu_js = '/asset/js/main-menu.js';

    if (file_exists($theme_dir . $main_menu_js)) {
        wp_enqueue_script(
            'nhakhoaid4-main-menu',
            $theme_uri . $main_menu_js,
            array(),
            filemtime($theme_dir . $main_menu_js),
            true
        );
    }


    // Trang chủ - chỉ nạp CSS và JavaScript khi đang ở trang chủ
    if (is_front_page()) {

        $home_css = '/asset/css/nhakhoaid4.css';

        if (file_exists($theme_dir . $home_css)) {
            wp_enqueue_style(
                'nhakhoaid4-home',
                $theme_uri . $home_css,
                array('flatsome-main', 'flatsome-style'),
                filemtime($theme_dir . $home_css)
            );
        }

        $home_js = '/asset/js/nhakhoaid4.js';

        if (file_exists($theme_dir . $home_js)) {
            wp_enqueue_script(
                'nhakhoaid4-home',
                $theme_uri . $home_js,
                array(),
                filemtime($theme_dir . $home_js),
                true
            );
        }
    }
}


// Footer - sử dụng trên toàn website
add_action('wp_enqueue_scripts', 'nhakhoaid4_enqueue_footer_assets');

function nhakhoaid4_enqueue_footer_assets()
{
    $theme_dir = get_stylesheet_directory();
    $theme_uri = get_stylesheet_directory_uri();

    // CSS Footer
    $footer_css = '/asset/css/footer.css';

    if (file_exists($theme_dir . $footer_css)) {
        wp_enqueue_style(
            'nhakhoaid4-footer',
            $theme_uri . $footer_css,
            array(),
            filemtime($theme_dir . $footer_css)
        );
    }

    // JavaScript Footer
    $footer_js = '/asset/js/footer.js';

    if (file_exists($theme_dir . $footer_js)) {
        wp_enqueue_script(
            'nhakhoaid4-footer',
            $theme_uri . $footer_js,
            array(),
            filemtime($theme_dir . $footer_js),
            true
        );
    }
}