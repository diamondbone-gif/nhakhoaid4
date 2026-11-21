<?php

// Preserve raw UX HTML while WordPress formats the surrounding content.
function nhakhoaid4_preserve_ux_html_formatting()
{
    $placeholders = array();

    add_filter('the_content', static function ($content) use (&$placeholders) {
        if (! has_shortcode($content, 'ux_html')) {
            return $content;
        }

        return preg_replace_callback(
            '~' . get_shortcode_regex(array('ux_html')) . '~s',
            static function ($match) use (&$placeholders) {
                if ('[' === $match[1] && ']' === $match[6]) {
                    return $match[0];
                }

                $placeholder = '<div data-id4-raw-ux="' . wp_generate_uuid4() . '"></div>';
                $placeholders[$placeholder] = $match[0];
                return $placeholder;
            },
            $content
        );
    }, 9);

    add_filter('the_content', static function ($content) use (&$placeholders) {
        if (empty($placeholders)) {
            return $content;
        }

        return preg_replace_callback(
            '~<div data-id4-raw-ux="[a-f0-9-]+"></div>~',
            static function ($match) use (&$placeholders) {
                $placeholder = $match[0];
                $shortcode = $placeholders[$placeholder] ?? $placeholder;
                unset($placeholders[$placeholder]);
                return $shortcode;
            },
            $content
        );
    }, 10);
}
add_action('after_setup_theme', 'nhakhoaid4_preserve_ux_html_formatting');



// Nạp CSS và JavaScript tùy chỉnh
add_action('wp_enqueue_scripts', 'nhakhoaid4_enqueue_assets');

function nhakhoaid4_enqueue_assets()
{
    $theme_dir = get_stylesheet_directory();
    $theme_uri = get_stylesheet_directory_uri();

    // ==================================================
    // 0. GOOGLE FONTS (Open Sans, Allura, Roboto)
    // ==================================================
    wp_enqueue_style(
        'nhakhoaid4-google-fonts',
        'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap',
        array(),
        null
    );

    // 2. Dán ở cuối file functions.php
    add_action('wp_head', 'nhakhoaid4_google_fonts_preconnect', 1);
    function nhakhoaid4_google_fonts_preconnect()
    {
        echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
        echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
    }

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


    // ==================================================
    // 10. ID4 ABOUT US - TOÀN WEBSITE
    // ==================================================

    // CSS giao diện ID4 About Us - /asset/css/id4-about-us.css
    $id4_about_us_css = '/asset/css/id4-about-us.css';

    if (file_exists($theme_dir . $id4_about_us_css)) {
        wp_enqueue_style(
            'nhakhoaid4-about-us',
            $theme_uri . $id4_about_us_css,
            $shared_dependencies,
            filemtime($theme_dir . $id4_about_us_css)
        );
    }

    // JavaScript tương tác ID4 About Us - /asset/js/id4-about-us.js
    $id4_about_us_js = '/asset/js/id4-about-us.js';

    if (file_exists($theme_dir . $id4_about_us_js)) {
        wp_enqueue_script(
            'nhakhoaid4-about-us',
            $theme_uri . $id4_about_us_js,
            array(),
            filemtime($theme_dir . $id4_about_us_js),
            true
        );
    }


    // ==================================================
    // 11. ID4 SOLUTION VIDEO - TOÀN WEBSITE
    // ==================================================

    // CSS giao diện ID4 Solution Video
    // Nạp sau import-font-and-root.css
    $id4_solution_video_css = '/asset/css/id4-solution-video.css';

    if (file_exists($theme_dir . $id4_solution_video_css)) {
        wp_enqueue_style(
            'nhakhoaid4-id4-solution-video',
            $theme_uri . $id4_solution_video_css,
            $shared_dependencies,
            filemtime($theme_dir . $id4_solution_video_css)
        );
    }

    // JavaScript tương tác ID4 Solution Video
    // Đảm bảo import-font-and-root.css được nạp trước
    $id4_solution_video_js = '/asset/js/id4-solution-video.js';

    if (file_exists($theme_dir . $id4_solution_video_js)) {
        wp_enqueue_script(
            'nhakhoaid4-id4-solution-video',
            $theme_uri . $id4_solution_video_js,
            array(),
            filemtime($theme_dir . $id4_solution_video_js),
            true
        );
    }


    // ==================================================
    // 12. ĐỘI NGŨ BÁC SĨ - TOÀN WEBSITE
    // ==================================================

    // CSS giao diện Đội ngũ bác sĩ - /asset/css/doi-ngu-bs.css
    // Nạp sau import-font-and-root.css
    $doctor_team_css = '/asset/css/doi-ngu-bs.css';

    if (file_exists($theme_dir . $doctor_team_css)) {
        wp_enqueue_style(
            'nhakhoaid4-doctor-team',
            $theme_uri . $doctor_team_css,
            $shared_dependencies,
            filemtime($theme_dir . $doctor_team_css)
        );
    }

    // JavaScript tương tác Đội ngũ bác sĩ - /asset/js/doi-ngu-bs.js
    $doctor_team_js = '/asset/js/doi-ngu-bs.js';

    if (file_exists($theme_dir . $doctor_team_js)) {
        wp_enqueue_script(
            'nhakhoaid4-doctor-team',
            $theme_uri . $doctor_team_js,
            array(),
            filemtime($theme_dir . $doctor_team_js),
            true
        );
    }

    // ==================================================
    // 13. VỀ ID4 - TOÀN WEBSITE
    // ==================================================

    // CSS giao diện Về ID4 - /asset/css/ve-id4.css
    // Nạp sau import-font-and-root.css
    $ve_id4_css = '/asset/css/ve-id4.css';

    if (file_exists($theme_dir . $ve_id4_css)) {
        wp_enqueue_style(
            'nhakhoaid4-ve-id4',
            $theme_uri . $ve_id4_css,
            $shared_dependencies,
            filemtime($theme_dir . $ve_id4_css)
        );
    }

    // JavaScript tương tác Về ID4 - /asset/js/ve-id4.js
    // Nạp JavaScript ở footer
    $ve_id4_js = '/asset/js/ve-id4.js';

    if (file_exists($theme_dir . $ve_id4_js)) {
        wp_enqueue_script(
            'nhakhoaid4-ve-id4',
            $theme_uri . $ve_id4_js,
            array(),
            filemtime($theme_dir . $ve_id4_js),
            true
        );
    }

    // ==================================================
    // 14. ID4 VIDEO KHÁCH HÀNG - TOÀN WEBSITE
    // ==================================================

    // JavaScript tương tác ID4 Video Khách Hàng
    // Đường dẫn: /asset/js/id4-video-khach-hang.js
    // Nạp JavaScript ở footer
    $id4_video_khach_hang_js = '/asset/js/id4-video-khach-hang.js';

    if (file_exists($theme_dir . $id4_video_khach_hang_js)) {
        wp_enqueue_script(
            'nhakhoaid4-id4-video-khach-hang',
            $theme_uri . $id4_video_khach_hang_js,
            array(),
            filemtime($theme_dir . $id4_video_khach_hang_js),
            true
        );
    }

    // ==================================================
    // 15. ĐẶT LỊCH TƯ VẤN - TOÀN WEBSITE
    // ==================================================

    // CSS giao diện Đặt lịch tư vấn - /asset/css/dat-lich-tu-van.css
    // Nạp sau import-font-and-root.css
    $consultation_css = '/asset/css/dat-lich-tu-van.css';

    if (file_exists($theme_dir . $consultation_css)) {
        wp_enqueue_style(
            'nhakhoaid4-consultation',
            $theme_uri . $consultation_css,
            $shared_dependencies,
            filemtime($theme_dir . $consultation_css)
        );
    }

    // JavaScript tương tác Đặt lịch tư vấn - /asset/js/dat-lich-tu-van.js
    // Nạp JavaScript ở footer
    $consultation_js = '/asset/js/dat-lich-tu-van.js';

    if (file_exists($theme_dir . $consultation_js)) {
        wp_enqueue_script(
            'nhakhoaid4-consultation',
            $theme_uri . $consultation_js,
            array(),
            filemtime($theme_dir . $consultation_js),
            true
        );
    }

    // ==================================================
    // 16. TRANG VIDEO CÂU CHUYỆN KHÁCH HÀNG - 
    // TOÀN WEBSITE TRANG VIDEO CÂU CHUYỆN KHÁCH HÀNG
    // ==================================================

    // CSS giao diện Trang Video Câu Chuyện Khách Hàng
    // Đường dẫn: /asset/css/trang-video-cckh.css
    // Nạp sau import-font-and-root.css
    $trang_video_cckh_css = '/asset/css/trang-video-cckh.css';

    if (file_exists($theme_dir . $trang_video_cckh_css)) {
        wp_enqueue_style(
            'nhakhoaid4-trang-video-cckh',
            $theme_uri . $trang_video_cckh_css,
            $shared_dependencies,
            filemtime($theme_dir . $trang_video_cckh_css)
        );
    }

    // JavaScript tương tác Trang Video Câu Chuyện Khách Hàng
    // Đường dẫn: /asset/js/trang-video-cckh.js
    // Nạp JavaScript ở footer
    $trang_video_cckh_js = '/asset/js/trang-video-cckh.js';

    if (file_exists($theme_dir . $trang_video_cckh_js)) {
        wp_enqueue_script(
            'nhakhoaid4-trang-video-cckh',
            $theme_uri . $trang_video_cckh_js,
            array(),
            filemtime($theme_dir . $trang_video_cckh_js),
            true
        );
    }

    /**
     * ==================================================
     * FIX LỖI TỰ ĐỘNG CHÈN THẺ BR - FLATSOME UX BUILDER
     * ==================================================
     *
     * - Xóa thẻ <br> dư nằm giữa hai khối <main>.
     * - Không tắt wpautop() trên toàn website.
     * - Không ảnh hưởng đến thẻ <br> trong nội dung văn bản.
     * - Áp dụng khi WordPress xử lý nội dung trang.
     */

    add_filter('the_content', 'nhakhoaid4_fix_extra_br', 999);

    function nhakhoaid4_fix_extra_br($content)
    {
        if (is_admin()) {
            return $content;
        }

        // Xóa thẻ BR nằm giữa hai khối MAIN.
        $content = preg_replace(
            '/(<\/main>)\s*(?:<br\s*\/?>\s*)+(?=<main\b) /i',
            '$1',
            $content
        );
        return $content;
    }
}
