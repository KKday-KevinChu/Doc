$(function() {
    $('[data-action="allsearch"]').hide();
    $('[data-search-trigger]').on('click', function(e) {
        e.preventDefault();
        $('.c-searchBox').addClass('is-active');
        $(this).hide();
        $('[data-action="allsearch"]').show();
    });

    $(document).on('click', function() {
        if ($('.c-group, [data-userinfo-target]').hasClass('is-active')) {
            $('.c-group, [data-userinfo-target]').removeClass('is-active');
        }
    });

    $(document).on('click', '[data-group-trigger]', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var target = $(this).data('group-trigger');
        $('[data-group-target]').not($('[data-group-target="' + target + '"]')).removeClass('is-active')
        $('[data-group-target="' + target + '"]').toggleClass('is-active');
    });
    // Gotop
    $(window).on('scroll', function() {
        var scrollTopDist = $(window).scrollTop();
        if (scrollTopDist > 500) {
            $('.o-gotop').css({
                display: 'block'
            });
        } else {
            $('.o-gotop').css({
                display: 'none'
            });
        }
    });
    $(window).on('resize', function() {
        var gotopRight = ($(window).width() - 1300) / 2;
        $('.o-gotop, .o-market-cart').css({ 'right': gotopRight < 0 ? 10 : gotopRight });
    }).trigger('resize');
    $('.o-gotop').on('click', function() {
        $("html, body").animate({
            scrollTop: 0
        }, 1000);
    })

    // Tab
    $(document).on('click', '[data-tab-target]', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $li = $(this).closest('li'),
            id = $(this).data('tab-target');

        $li.addClass('is-active').siblings('li').removeClass('is-active');

        var target = $(this).data('tab-target');
        $('[data-tab-id="' + target + '"]').addClass('is-active').siblings('[data-tab-id]').removeClass('is-active');
    });

    // Fancybox
    $('body').on('click', '[data-fancybox-close-all]', function(e) {
        e.preventDefault();
        var loop = true;
        while (loop) {
            var instance = $.fancybox.getInstance();
            if (instance) {
                instance.close();
            }
            loop = (instance !== false);
        }
    });
    $.fancybox.defaults.touch = false;
    $.fancybox.defaults.baseClass = 'is-inlineBlock';

    // Select - normal select don't show the first item
    $('[data-input-type="select"]').transformSelect({
        dropDownClass: "c-dropdown__select"
    });

    // Select - sorting select element , will change the color when select a item
    $('[data-input-type="sort"]').transformSelect({
        dropDownClass: "c-dropdown__select",
    }).each(function(i, el) {
        var isDefault = $(el).find('option:selected').data('sort-default');
        if (!isDefault) {
            $(this).addClass('is-valued')
        } else {
            $(this).removeClass('is-valued')
        }
    }).on('change', function() {
        var isDefault = $(this).find('option:selected').data('sort-default');
        if (!isDefault) {
            $(this).addClass('is-valued')
        } else {
            $(this).removeClass('is-valued')
        }
    });

    // Select - focus on selected element
    $('.transformSelectDropdown li').hover(function() {
        $(this).siblings('li').removeClass('selected');
        $(this).addClass('selected');
    });

    $('html').on('click.initactiveindex', function(e) {
        $("ul.trans-element").each(function() {
            var $select = $(this).prevAll("select").first(),
                index = $select.find('option:selected').index(),
                $lis = $(this).find('.transformSelectDropdown li');
            $lis.removeClass('selected');
            $lis.eq(index).addClass('selected');
        });
    });

    // Panel
    $('.c-panel__item').on('click', function(e) {
        // e.preventDefault();
        e.stopPropagation();
        var icon = $(this).find('i');
        var allIcon = $(this).siblings().find('i');
        var link = $(this).find('.c-iconLink');
        var allLink = $(this).siblings().find('.c-iconLink');
        allIcon.removeClass('is-active');
        allLink.removeClass('is-active');
        icon.addClass('is-active');
        link.addClass('is-active');
    });

    // ※ Date picker Settings ※
    //    Reverse the order of the year list
    //    store original so we can call it inside our overriding method
    $.datepicker._generateMonthYearHeader_original = $.datepicker._generateMonthYearHeader;
    $.datepicker._generateMonthYearHeader = function(inst, dm, dy, mnd, mxd, s, mn, mns) {
        var header = $($.datepicker._generateMonthYearHeader_original(inst, dm, dy, mnd, mxd, s, mn, mns)),
            years = header.find('.ui-datepicker-year');
        // reverse the years and return our new html
        years.html(Array.prototype.reverse.apply(years.children()));
        return $('<div />').append(header).html();
    }

    // Main content min height
    var windowH = $(window).outerHeight(),
        headerH = $('.l-header').height(),
        footerH = $('.l-footer').height(),
        contentH = windowH - headerH - footerH;
    $('.l-main').css('min-height', contentH);
});

//Function: Article thumbnail changes while hovering on article list.
function thumbChanger() {
    $('[data-changer-thumb]').each(function() {
        var groupName = $(this).data('changer-thumb'),
            defaultBg = $('[data-changer-trigger="' + groupName + '"]:first').data('thumb-link'),
            hyperlink = $('[data-changer-trigger="' + groupName + '"]:first').attr('href');
        $(this).css('background-image', 'url(' + defaultBg + ')');
        $(this).parent('a').attr('href', hyperlink);
        if (groupName == 'hotnews') {
            var hires_images = ($('[data-changer-trigger="hotnews"]:first').data('hires-images')) ? $('[data-changer-trigger="hotnews"]:first').data('hires-images') : '';

            $(this).data('image', defaultBg);
            $(this).data('hires-image', hires_images);
            $(this).css('transition', 'background-image 0.3s ease-in-out');
        }
    });
    $('[data-changer-trigger]').on('mouseenter', function() {
        var name = $(this).data('changer-trigger'),
            link = $(this).data('thumb-link'),
            hyperlink = $(this).attr('href');
        $('[data-changer-thumb=' + name + ']').css('background-image', 'url(' + link + ')');
        $('[data-changer-thumb=' + name + ']').parent('a').attr('href', hyperlink);
        if (name == 'hotnews') {
            var hires_images = ($(this).data('hires-images')) ? $(this).data('hires-images') : '';

            $('[data-changer-thumb=hotnews]').data('hires-image', hires_images);
            $('[data-changer-thumb=hotnews]').data('image', link);
        }
    });
    $(document).on("mouseenter mouseleave", '[data-changer-thumb="hotnews"]', function(event) {
        var hires_image = $(this).data('hires-image');

        if (!hires_image) {
            return;
        }
        if (event.type === "mouseenter") {
            $(this).css('background-image', 'url(' + hires_image + ')');
        } else if (event.type === "mouseleave") {
            var image = $(this).data('image');
            $(this).css('background-image', 'url(' + image + ')');
        }
    });
};

//Function: Close block while clicking close btn.
function closeBlock() {
    $('[data-close-tigger]').on('click', function(e) {
        e.preventDefault();
        var target = $(this).data('close-tigger');
        $('[data-close-target=' + target + ']').fadeOut();
    });
}

//Function: Toggle Block
function toggleBlock() {
    $('[data-toggle-trigger]').each(function() {
        var target = $(this).data('toggle-trigger'),
            targetBlock = $('[data-toggle-target="' + target + '"]'),
            minHeight = targetBlock.data('toggle-minheight');
        targetBlock.css('height', minHeight + 'px')
    });

    $('[data-toggle-trigger]').on('click', function(e) {
        var target = $(this).data('toggle-trigger'),
            targetBlock = $('[data-toggle-target="' + target + '"]'),
            minHeight = targetBlock.data('toggle-minheight');
        e.preventDefault();
        $(this).toggleClass('is-open');
        $('[data-toggle-target="' + target + '"]').toggleClass('is-open');
        if ($('[data-toggle-target="' + target + '"]').hasClass('is-open')) {
            targetBlock.css('height', 'auto');
        } else {
            targetBlock.css('height', minHeight + 'px')
        }
    });
};

//Function: Trigger checkbox to toggle a hidden element
function CheckboxToggleBlock() {
    $('[data-checkbox-toggle-trigger]').each(function() {
        var target = $(this).data('checkbox-toggle-trigger'),
            targetBlock = $('[data-checkbox-toggle-target="' + target + '"]'),
            minHeight = targetBlock.data('checkbox-toggle-minheight');
        targetBlock.css('height', minHeight + 'px')
    });
    $('[data-checkbox-toggle-trigger]').on('change', function() {
        var target = $(this).data('checkbox-toggle-trigger'),
            targetBlock = $('[data-checkbox-toggle-target="' + target + '"]'),
            minHeight = targetBlock.data('checkbox-toggle-minheight');
        if ($(this).prop('checked') == true) {
            targetBlock.css('height', 'auto');
        } else {
            targetBlock.css('height', minHeight + 'px')
        }
    });
}

//Function: Toggle text between 'opened' and 'closed'
function toggleBlockWording() {
    $('[data-toggle-trigger]').on('click', function() {
        var text = $(this).find('[data-toggle-wording]').text();
        if (text === '展開') {
            $(this).find('[data-toggle-wording]').text('收合')
        } else {
            $(this).find('[data-toggle-wording]').text('展開')
        }
    });
};
