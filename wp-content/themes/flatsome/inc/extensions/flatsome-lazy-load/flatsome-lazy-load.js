/* global objectFitImages */
;(function () {
  function createObserver (handler) {
    return new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        handler(entries[i])
      }
    }, {
      rootMargin: '0px',
      threshold: 0.1
    })
  }

  Flatsome.behavior('lazy-load-images', {
    attach: function (context) {
      var observer = createObserver(function (entry) {
        if (entry.intersectionRatio > 0) {
          observer.unobserve(entry.target)

          var $el = jQuery(entry.target)
          var src = $el.data('src')
          var srcset = $el.data('srcset')

          if ($el.hasClass('lazy-load-active')) return
          else $el.addClass('lazy-load-active')

          if (src) $el.attr('src', src)
          if (srcset) $el.attr('srcset', srcset)

          $el.imagesLoaded(function () {
            $el.removeClass('lazy-load')
            if (typeof objectFitImages !== 'undefined') {
              objectFitImages($el)
            }
          })
        }
      })

      jQuery('.lazy-load', context).each(function (i, el) {
        observer.observe(el)
      })
    }
  })

  Flatsome.behavior('lazy-load-sliders', {
    attach: function (context) {
      var observer = createObserver(function (entry) {
        if (entry.intersectionRatio > 0) {
          observer.unobserve(entry.target)

          var $el = jQuery(entry.target)

          if ($el.hasClass('slider-lazy-load-active')) return
          else $el.addClass('slider-lazy-load-active')

          $el.imagesLoaded(function () {
            if ($el.hasClass('flickity-enabled')) {
              $el.flickity('resize')
            }
          })
        }
      })

      jQuery('.slider', context).each(function (i, el) {
        observer.observe(el)
      })
    }
  })

  Flatsome.behavior('lazy-load-packery', {
    attach: function (context) {
      var observer = createObserver(function (entry) {
        if (entry.intersectionRatio > 0) {
          observer.unobserve(entry.target)

          var $el = jQuery(entry.target)

          $el.imagesLoaded(function () {
            jQuery('.has-packery').packery('layout') // why global selector?
          })
        }
      })

      jQuery('.has-packery .lazy-load', context).each(function (i, el) {
        observer.observe(el)
      })
    }
  })

  // WooCommerce 11.1+ replaces the product gallery element when a variation
  // with its own gallery is selected. The initial gallery is already observed,
  // so only galleries that replace a destroyed one are attached.
  var galleryReplaced = false

  jQuery(document.body)
    .on('wc-product-gallery-before-destroy', function () {
      galleryReplaced = true
    })
    .on('wc-product-gallery-after-init', function (e, galleryEl) {
      if (!galleryReplaced) return
      galleryReplaced = false
      Flatsome.attach('lazy-load-images', jQuery(galleryEl))
    })
})()
