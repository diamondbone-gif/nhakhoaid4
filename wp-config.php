<?php
define( 'WP_CACHE', true );

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'nhakhoaid4' );

/** Database username */
define( 'DB_USER', 'nhakhoaid4' );

/** Database password */
define( 'DB_PASSWORD', '!dHOOr3yGqK_[uvB' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         ' Z,LL4_md3d9kV0,6*^~U>P(DWos{snqiZO_j9;l9&-z R.MJ7kgn:l>}t{;spw7' );
define( 'SECURE_AUTH_KEY',  'fJ@YjZ2Oc10D-,SAFZb|1K]k#UqT tbY=m7un,`U6%ufz0u)]_iEggIBI%/Uo&1Y' );
define( 'LOGGED_IN_KEY',    'kd4.SdfBr(LFPt#U%q)UiGJyD7bhW]PexAaJJ=.GKL:8x@>4ek,(Ucfh=<UjRaT2' );
define( 'NONCE_KEY',        'p*e.ZNq_fut[[$R }@Xb9T?$`1OD]04y+[waM<IyVFf>k9xG~{T v6npro6$tuf7' );
define( 'AUTH_SALT',        '55Yiw~;ldd,W{ys{RLz(NmW_7!zgBivs=}v=S7M]O6T0N$-P(@$#$+YVtO+)0SIL' );
define( 'SECURE_AUTH_SALT', '[{Zlb0,UicTEn$1mP*iU,I/h<7}UprKcAOi.NI;{K@jie!EEK{j|m2$~AM21e{t<' );
define( 'LOGGED_IN_SALT',   '7z,1F@y2.CE]XB4`;pMYl(}&hD!^P 3eu3[9h2U_&IWk5Hqp$4nkULH#tby@,mW:' );
define( 'NONCE_SALT',       '^Kamg4WK$H:q6FiAUCyUL;>y!1F(5G72nuC3Q3z)MY*1*dte?mc5*Xl`pf833jRg' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
