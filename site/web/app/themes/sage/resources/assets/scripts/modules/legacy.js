require('imagesloaded')
import 'smartmenus'
import 'respondjs'

/*eslint-disable */
const animateElement = (e) => {
  $('.animate').each(function (i) {
    var top_of_object = $(this).offset().top
    var bottom_of_window = $(window).scrollTop() + $(window).height()
    if ((bottom_of_window - 70) > top_of_object) {
      $(this).addClass('show-it')
    }
  })
}

const multiClickFunctionStop = (e) => {
  $('#toggle').off('click')
  $('#toggle, .toggle-holder, body').toggleClass('on')

  if ($('#toggle').hasClass('on')) {
    $('.menu-holder').addClass('show')
    $('#toggle').on('click', multiClickFunctionStop)
  } else {
    $('.menu-holder').removeClass('show')
    $('#toggle').on('click', multiClickFunctionStop)
  }
}

/**
 * loadMoreArticleIndex
 */
const loadMoreArticleIndex = () => {
  if (parseInt(ajax_var.posts_per_page_index) < parseInt(ajax_var.total_index)) {
      $('.more-posts').css('visibility', 'visible')
      $('.more-posts').animate({opacity: 1}, 1500)
  } else {
      $('.more-posts').css('display', 'none')
  }

  $('.more-posts:visible').on('click', function () {
    $('.more-posts').css('display', 'none')
    $('.more-posts-loading').css('display', 'inline-block')
    count++
    loadArticleIndex(count)
  })
}

/**
 * loadArticleIndex
 */
const loadArticleIndex = (pageNumber) => {
  $.ajax({
    url: ajax_var.url,
    type: 'POST',
    data: 'action=infinite_scroll_index&page_no_index=' + pageNumber + '&loop_file_index=loop-index&security=' + ajax_var.nonce,
    success: function (html) {
      $('.blog-holder').imagesLoaded(function () {
        $('.blog-holder').append(html)
        setTimeout(function () {
          animateElement()
          showBlogFeatureImage()
          if (count == ajax_var.num_pages_index) {
            $('.more-posts').css('display', 'none')
            $('.more-posts-loading').css('display', 'none')
            $('.no-more-posts').css('display', 'inline-block')
          } else {
            $('.more-posts').css('display', 'inline-block')
            $('.more-posts-loading').css('display', 'none')
            $('.more-posts-index-holder').removeClass('stop-loading')
          }
        }, 100)
      })
    }
  })

  return false
}

const loadMorePostsItemsOnScroll = e => {
  $('.more-posts-index-holder.scroll').not('.stop-loading').each(function (i) {
    var top_of_object = $(this).offset().top
    var bottom_of_window = $(window).scrollTop() + $(window).height()
    if ((bottom_of_window - 170) > top_of_object) {
      $(this).addClass('stop-loading')
      count++
      loadArticleIndex(count)
      if (count <= ajax_var.num_pages_index) {
          $('.more-posts-loading').css('display', 'inline-block')
      }
    }
  })
}

const showFirstBlogPostFeatureImage = () => {
  $('.blog-item-holder .entry-holder').first().addClass('active-post')
}

const showBlogFeatureImage = () => {
  $('.blog-item-holder .entry-holder').on('hover', function () {
      $('.blog-item-holder .entry-holder').removeClass('active-post')
      $(this).addClass('active-post')
  })
}

const fixPullquoteClass = () => {
  $('figure.wp-block-pullquote').find('blockquote').first().addClass('cocobasic-block-pullquote')
}

/*eslint-enable */
const doLegacy = () => {
  let scrollPosition = window.document.scrollTop
  fixPullquoteClass()

  window.document.addEventListener('scroll', () => {
    let currentScroll = window.document.scrollTop
    if (currentScroll > scrollPosition) {
      loadMorePostsItemsOnScroll()
    }

    scrollPosition = currentScroll
  })

  //Fix for Default menu
  document.querySelectorAll('.default-menu ul:first-child').forEach(element => {
    element.classList.addClass('sm sm-clean main-menu')
  })

  /**
   * Todo: replace smartmenus
   */
  $('.main-menu').smartmenus({
    subMenusSubOffsetX: 1,
    subMenusSubOffsetY: -8,
    markCurrentTree: true,
  })

  /*eslint-disable */
  var $mainMenu = $('.main-menu').on('click', 'span.sub-arrow', e => {
    var obj = $mainMenu.data('smartmenus')
    if (obj.isCollapsible()) {
      var $item = $(this).parent(),
      $sub = $item.parent().dataSM('sub')
      $sub.dataSM('arrowClicked', true)
    }
  }).bind({
    'beforeshow.smapi': (e, menu) => {
      var obj = $mainMenu.data('smartmenus')
      if (obj.isCollapsible()) {
        var $menu = $(menu)
        if (!$menu.dataSM('arrowClicked')) {
          return false
        }
        $menu.removeDataSM('arrowClicked')
      }
    },
  })
  /*eslint-enable */

  loadMoreArticleIndex()

  //Blog show feature image
  showFirstBlogPostFeatureImage()
  showBlogFeatureImage()

  //Placeholder show/hide
  $('input, textarea').on('focus', function () {
      $(this).data('placeholder', $(this).attr('placeholder'))
      $(this).attr('placeholder', '')
  })

  $('input, textarea').on('blur', function () {
      $(this).attr('placeholder', $(this).data('placeholder'))
  })

  //Show-Hide header sidebar
  $('#toggle').on('click', multiClickFunctionStop)

 /*  document.querySelector('#toggle').addEventListener('mousedown', function () {
    document.querySelector('body').classList.toggle('on')
  }) */

  $(window).on('load', function () {
    // Animate the elemnt if is allready visible on load
    animateElement()

    //Fix for hash
    var hash = location.hash
    if ((hash !== '') && ($(hash).length)) {
      $('html, body').animate({scrollTop: $(hash).offset().top - 77}, 1)
    }
    $('.doc-loader').fadeOut(300)
  })

  document.addEventListener('scroll', () => animateElement())
}

export default doLegacy
