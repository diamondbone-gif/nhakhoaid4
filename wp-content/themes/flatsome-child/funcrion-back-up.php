<?php

// Nạp CSS và JavaScript tùy chỉnh
add_action('wp_enqueue_scripts', 'nhakhoaid4_enqueue_assets');

function nhakhoaid4_enqueue_assets()
{
    $theme_dir = get_stylesheet_directory();
    $theme_uri = get_stylesheet_directory_uri();

    // ==================================================
    // 1. FONT & ROOT - TOÀN WEBSITE
    // ==================================================

    $root_css = '/asset/css/import-font-and-root.css';
    $shared_dependencies = array();

    if (file_exists($theme_dir . $root_css)) {
        wp_enqueue_style(
            'nhakhoaid4-font-root',
            $theme_uri . $root_css,
            array(),
            filemtime($theme_dir . $root_css)
        );

        $shared_dependencies[] = 'nhakhoaid4-font-root';
    }

    // ==================================================
    // 2. MENU CHÍNH - TOÀN WEBSITE
    // ==================================================

    $main_menu_css = '/asset/css/main-menu.css';

    if (file_exists($theme_dir . $main_menu_css)) {
        wp_enqueue_style(
            'nhakhoaid4-main-menu',
            $theme_uri . $main_menu_css,
            $shared_dependencies,
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

    // ==================================================
    // 3. TRANG CHỦ - CHỈ NẠP KHI Ở TRANG CHỦ
    // ==================================================

    if (is_front_page()) {
        $home_css = '/asset/css/nhakhoaid4.css';

        if (file_exists($theme_dir . $home_css)) {
            wp_enqueue_style(
                'nhakhoaid4-home',
                $theme_uri . $home_css,
                array_merge(
                    array('flatsome-main', 'flatsome-style'),
                    $shared_dependencies
                ),
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

    // ==================================================
    // 4. FOOTER - TOÀN WEBSITE
    // ==================================================

    $footer_css = '/asset/css/footer.css';

    if (file_exists($theme_dir . $footer_css)) {
        wp_enqueue_style(
            'nhakhoaid4-footer',
            $theme_uri . $footer_css,
            $shared_dependencies,
            filemtime($theme_dir . $footer_css)
        );
    }

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

    // ==================================================
    // 5. HÌNH ẢNH TRƯỚC SAU - TOÀN WEBSITE
    // ==================================================

    // CSS hình ảnh trước sau
    $before_after_css = '/asset/css/hinh-anh-truoc-sau.css';

    if (file_exists($theme_dir . $before_after_css)) {
        wp_enqueue_style(
            'nhakhoaid4-before-after',
            $theme_uri . $before_after_css,
            $shared_dependencies,
            filemtime($theme_dir . $before_after_css)
        );
    }

    // JavaScript hình ảnh trước sau
    $before_after_js = '/asset/js/hinh-anh-truoc-sau.js';

    if (file_exists($theme_dir . $before_after_js)) {
        wp_enqueue_script(
            'nhakhoaid4-before-after',
            $theme_uri . $before_after_js,
            array(),
            filemtime($theme_dir . $before_after_js),
            true
        );
    }

    // ==================================================
    // 6. CÂU CHUYỆN KHÁCH HÀNG - TOÀN WEBSITE
    // ==================================================

    // CSS giao diện câu chuyện khách hàng
    $customer_story_css = '/asset/css/cau-chuyen-khach-hang.css';

    if (file_exists($theme_dir . $customer_story_css)) {
        wp_enqueue_style(
            'nhakhoaid4-customer-story',
            $theme_uri . $customer_story_css,
            $shared_dependencies,
            filemtime($theme_dir . $customer_story_css)
        );
    }

    // JavaScript tương tác câu chuyện khách hàng
    $customer_story_js = '/asset/js/cau-chuyen-khach-hang.js';

    if (file_exists($theme_dir . $customer_story_js)) {
        wp_enqueue_script(
            'nhakhoaid4-customer-story',
            $theme_uri . $customer_story_js,
            array(),
            filemtime($theme_dir . $customer_story_js),
            true
        );
    }


    // ==================================================
    // 7. ID4 SOLUTION - TOÀN WEBSITE
    // ==================================================

    // CSS giao diện ID4 Solution - /asset/css/id4-solution.css
    $id4_solution_css = '/asset/css/id4-solution.css';

    if (file_exists($theme_dir . $id4_solution_css)) {
        wp_enqueue_style(
            'nhakhoaid4-id4-solution',
            $theme_uri . $id4_solution_css,
            $shared_dependencies,
            filemtime($theme_dir . $id4_solution_css)
        );
    }

    // JavaScript tương tác ID4 Solution - /asset/js/id4-solution.js
    $id4_solution_js = '/asset/js/id4-solution.js';

    if (file_exists($theme_dir . $id4_solution_js)) {
        wp_enqueue_script(
            'nhakhoaid4-id4-solution',
            $theme_uri . $id4_solution_js,
            array(),
            filemtime($theme_dir . $id4_solution_js),
            true
        );
    }

    // ==================================================
    // 8. CÔNG NGHỆ KỸ THUẬT - TOÀN WEBSITE
    // ==================================================

    // CSS giao diện Công nghệ kỹ thuật - /asset/css/cong-nghe-ky-thuat.css
    $technology_css = '/asset/css/cong-nghe-ky-thuat.css';

    if (file_exists($theme_dir . $technology_css)) {
        wp_enqueue_style(
            'nhakhoaid4-technology',
            $theme_uri . $technology_css,
            $shared_dependencies,
            filemtime($theme_dir . $technology_css)
        );
    }

    // JavaScript tương tác Công nghệ kỹ thuật - /asset/js/cong-nghe-ky-thuat.js
    $technology_js = '/asset/js/cong-nghe-ky-thuat.js';

    if (file_exists($theme_dir . $technology_js)) {
        wp_enqueue_script(
            'nhakhoaid4-technology',
            $theme_uri . $technology_js,
            array(),
            filemtime($theme_dir . $technology_js),
            true
        );
    }

    // ==================================================
    // 9. CHÍNH SÁCH BẢO HÀNH - TOÀN WEBSITE
    // ==================================================

    // CSS giao diện Chính sách bảo hành - /asset/css/chinh-sach-bao-hanh.css
    $warranty_css = '/asset/css/chinh-sach-bao-hanh.css';

    if (file_exists($theme_dir . $warranty_css)) {
        wp_enqueue_style(
            'nhakhoaid4-warranty',
            $theme_uri . $warranty_css,
            $shared_dependencies,
            filemtime($theme_dir . $warranty_css)
        );
    }

    // JavaScript tương tác Chính sách bảo hành - /asset/js/chinh-sach-bao-hanh.js
    $warranty_js = '/asset/js/chinh-sach-bao-hanh.js';

    if (file_exists($theme_dir . $warranty_js)) {
        wp_enqueue_script(
            'nhakhoaid4-warranty',
            $theme_uri . $warranty_js,
            array(),
            filemtime($theme_dir . $warranty_js),
            true
        );
    }
}
