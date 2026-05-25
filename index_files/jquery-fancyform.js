/*!
 * Fancyform - jQuery Plugin
 * Simple and fancy form styling alternative
 *
 * Examples and documentation at: https://github.com/Lutrasoft/Fancyform
 * 
 * Copyright (c) 2010-2015 - Lutrasoft
 * 
 * Version: 1.4.3
 * Requires: jQuery v1.6.1+ 
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($) {
    $.simpleEllipsis = function(t, c) {
        return t.length < c ? t : t.substring(0, c) + "...";
    }

    var _touch = !!('ontouchstart' in window),
        _removeClasses = function() {
            var _this = $(this),
                options = _this.data("options") || _this.data("settings"),
                k;

            for (k in options) {
                _this.parent().removeClass(k);
            }
        };

    $.fn.extend({

        /*
        Replace select with list
        =========================
        HTML will look like
        <ul>
        <li><span>Selected value</span>
        <ul>
        <li data-settings='{"alwaysvisible" : true}'><span>Option</span></li>
        <li><span>Option</span></li>
        </ul>
        </li>
        </ul>
        */
        transformSelect: function(opts) {
            var defaults = {
                dropDownClass: "transformSelect",
                showFirstItemInDrop: 1,

                acceptManualInput: 0,
                useManualInputAsFilter: 0,

                subTemplate: function(option) {
                    if ($(this)[0].type == "select-multiple") {

                        return "<span><input type='checkbox' value='" + $(option).val() + "' " + ($(option).is(":selected") ? "checked='checked'" : "") + " name='" + $(this).attr("name").replace("_backup", "") + "' /><ins />" + $(option).text() + "</span>";
                    } else {
                        return "<span>" + $(option).text() + "</span>";
                    }
                },
                initValue: function() { return $(this).text(); },
                valueTemplate: function() { return $(this).text(); },

                ellipsisLength: null,
                addDropdownToBody: 0
            };

            var options = $(this).data("settings"),
                method = {
                    init: function() {
                        // Generate HTML
                        var _this = this,
                            t = $(_this),
                            selectedIndex = 0,
                            selectedOption = t.find("option:first");

                        // Hide mezelf
                        t.hide();

                        if (t.find("option:selected").length && _this.type != "select-multiple") {
                            selectedOption = t.find("option:selected");
                            selectedIndex = t.find("option").index(selectedOption);
                        }

                        // Maak een ul aan
                        var ul = "<ul class='" + options.dropDownClass + " trans-element'><li>";

                        if (options.acceptManualInput && !_touch) {
                            var value = t.data("value") || options.initValue.call(selectedOption);
                            ul += "<ins></ins><input type='text' name='" + t.attr("name").replace("_backup", "") + "' value='" + value + "' />";

                            // Save old select
                            if (t.attr("name").indexOf("_backup") < 0) {
                                t.attr("name", t.attr("name") + "_backup");
                            }
                        } else {
                            if (options.ellipsisLength) {
                                ul += "<span title=\"" + selectedOption.text() + "\">" + $.simpleEllipsis(options.initValue.call(selectedOption), options.ellipsisLength) + "</span>";
                            } else {
                                ul += "<span>" + options.initValue.call(selectedOption) + "</span>";
                            }
                        }

                        ul += "<ul style='display: none;'>";

                        t.children().each(function(i) {
                            if (!i && !options.showFirstItemInDrop) {
                                // Don't do anything when you don't wanna show the first element
                            } else {
                                ul += method[
                                    this.tagName == "OPTION" ? "getLIOptionChild" : "getLIOptgroupChildren"
                                ].call(_this, this);
                            }
                        });

                        ul += "</ul></li></ul>";

                        var $ul = $(ul),
                            $lis = $ul.find("ul li:not(.group)"),
                            $inp = $ul.find("input");
                        t.after($ul);

                        if (_this.type == "select-multiple" && !_touch) {
                            if (t.attr("name") && t.attr("name").indexOf("_backup") == -1) {
                                t.attr("name", t.attr("name") + "_backup");
                            }
                            $lis.click(method.selectCheckbox);
                        } else {
                            $lis.click(method.selectNewValue);

                            $inp.click(method.openDrop)
                                .keydown(function(e) {
                                    // Tab or enter
                                    if ($.inArray(e.which, [9, 13]) >= 0)
                                        method.closeAllDropdowns();
                                })
                                .prev("ins")
                                .click(method.openDrop);
                        }

                        if (options.useManualInputAsFilter) {
                            $inp.keyup(method.filterByInput);
                        }

                        $ul.find("input").keydown(method.navigateThroughDropdown)

                        $ul.find("span:first").click(method.openDrop);

                        // Set data if we use addDropdownToBody option
                        $ul.find("ul:first").data("trans-element", $ul).addClass("transformSelectDropdown");
                        $ul.data("trans-element-drop", $ul.find("ul:first"));

                        if (options.addDropdownToBody) {
                            $ul.find("ul:first").appendTo("body");
                        }

                        // Check if there is already an event
                        $("html").unbind("click.transformSelect").bind("click.transformSelect", method.closeDropDowns) // Bind hotkeys

                        if ($.hotkeys && !$("body").data("trans-element-select")) {
                            $("body").data("trans-element-select", 1);

                            $(document)
                                .bind("keydown", "up", function(e) {
                                    var ul = $(".trans-focused"),
                                        select, selectedIndex;
                                    // Only enable on trans-element without input
                                    if (!ul.length || ul.find("input").length) return 0;
                                    select = ul.prevAll("select").first();

                                    selectedIndex = select[0].selectedIndex - 1
                                    if (selectedIndex < 0) {
                                        selectedIndex = select.find("option").length - 1;
                                    }

                                    method.selectIndex.call(select, selectedIndex);

                                    return 0;
                                })
                                .bind("keydown", "down", function(e) {
                                    var ul = $(".trans-focused"),
                                        select, selectedIndex;
                                    // Only enable on trans-element without input
                                    if (!ul.length || ul.find("input").length) return 0;
                                    select = ul.prevAll("select").first();

                                    selectedIndex = select[0].selectedIndex + 1
                                    if (selectedIndex > select.find("option").length - 1) {
                                        selectedIndex = 0;
                                    }

                                    method.selectIndex.call(select, selectedIndex);
                                    return 0;
                                });
                        }

                        // Gebruik native selects
                        if (_touch) {
                            if (!options.showFirstItemInDrop) {
                                t.find("option:first").remove();
                            }
                            t.appendTo($ul.find("li:first"))
                                .show()
                                .css({
                                    opacity: 0,
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    left: 0,
                                    top: 0
                                });
                            $ul.find("li:first").css({
                                position: "relative"
                            });
                            t.change(method.mobileChange);
                        }

                        // Bind handlers
                        if (t.is(":disabled")) {
                            method.disabled.call(_this, 1);
                        }
                    },
                    getUL: function() {
                        return _touch ? $(this).closest("ul") : $(this).next(".trans-element:first");
                    },
                    getSelect: function($ul) {
                        return _touch ? $ul.find("select") : $ul.prevAll("select:first");
                    },
                    disabled: function(disabled) {

                        method.getUL.call(this)[disabled ? "addClass" : "removeClass"]("disabled");
                    },
                    repaint: function() {
                        var ul = method.getUL.call(this);
                        if (_touch) {
                            ul.before(this);
                        }
                        if (ul.data("trans-element-drop")) {
                            ul.data("trans-element-drop").remove();
                        }
                        ul.remove();

                        method.init.call(this);
                    },
                    filterByInput: function() {
                        var _this = $(this),
                            val = _this.val().toLowerCase(),
                            ul = _this.closest("ul"),
                            drop = ul.data("trans-element-drop"),
                            li = drop.find("li");

                        // val == ""
                        if (!val) {
                            li.show();
                        } else {
                            li.each(function() {
                                var _li = $(this);
                                if (!!_li.data("settings").alwaysvisible) {
                                    _li.show();
                                } else {
                                    _li[_li.text().toLowerCase().indexOf(val) < 0 ? "hide" : "show"]();
                                }
                            });
                        }
                    },
                    navigateThroughDropdown: function(e) {
                        var ul = $(this).closest("ul"),
                            drop = ul.data("trans-element-drop"),
                            sel = drop.find(".active");


                        switch (e.which) {
                            case 40:
                                /* DOWN */
                                if (sel.length) {
                                    sel = sel.nextAll(":not(:hidden):first");
                                }
                                if (!sel.length) {
                                    sel = drop.find("li:not(:hidden):first");
                                }
                                var ToScroll = sel.prevAll(":not(:hidden)").length * sel.height() - (drop.height() - sel.height()),
                                    isVisible = (sel.prevAll(":not(:hidden)").length * sel.height()) > drop.scrollTop() && (sel.prevAll(":not(:hidden)").length * sel.height()) < drop.scrollTop() + drop.height();
                                if (!isVisible) {
                                    drop.scrollTop(ToScroll);
                                }

                                this.lastKeyIsUpOrDown = true;
                                break;
                            case 38:
                                /* UP */
                                if (sel.length) {
                                    sel = sel.prevAll(":not(:hidden):first");
                                }
                                if (!sel.length) {
                                    sel = drop.find("li:not(:hidden):last");
                                }

                                var ToScroll = sel.prevAll(":not(:hidden)").length * sel.height(),
                                    isVisible = (sel.prevAll(":not(:hidden)").length * sel.height()) > drop.scrollTop() && (sel.prevAll(":not(:hidden)").length * sel.height()) < drop.scrollTop() + drop.height();
                                if (!isVisible) {
                                    drop.scrollTop(ToScroll);
                                }
                                this.lastKeyIsUpOrDown = true;
                                break;
                            case 13:
                                /* ENTER = SELECT */
                                if (this.lastKeyIsUpOrDown) {
                                    method.selectIndex.call(ul.prevAll("select:first"), sel.index());
                                }

                                var fn = ul.prev().data("settings").onSubmit;
                                if (fn) {
                                    fn.call(this);
                                }

                                this.lastKeyIsUpOrDown = false;
                                break;
                            default:
                                this.lastKeyIsUpOrDown = false;
                                break;
                        }

                        sel.addClass("active").siblings().removeClass("active");
                    },
                    selectIndex: function(index) {
                        var select = $(this),
                            ul = method.getUL.call(this),
                            drop = ul.data("trans-element-drop");

                        try {
                            drop.find("li").filter(function() {}).first().trigger("click");
                            return $(this).text() == select.find("option").eq(index).text();
                        } catch (e) {}
                    },
                    selectValue: function(value) {
                        var select = $(this),
                            ul = method.getUL.call(this),
                            drop = ul.data("trans-element-drop");

                        method.selectIndex.call(this, select.find(value ? "option[value='" + value + "']" : "option:not([value])").index());
                    },
                    /*
                     *	GET option child
                     */
                    getLIOptionChild: function(option) {
                        var settings = $(option).attr("data-settings") || '',
                            cls = ($(option).attr('class') || '') +
                            ($(option).is(":selected") ? ' selected' : '');

                        return "<li data-settings='" + settings + "' class='" + cls + "'>" + options.subTemplate.call(this, $(option)) + "</li>";
                    },
                    /*
                     *	GET optgroup children
                     */
                    getLIOptgroupChildren: function(group) {
                        var _this = this,
                            li = "<li class='group " + $(group).attr("class") + "'><span>" + $(group).attr("label") + "</span><ul>";

                        $(group).find("option").each(function() {
                            li += method.getLIOptionChild.call(_this, this);
                        });

                        li += "</ul></li>";

                        return li;
                    },
                    getLIIndex: function(el) {
                        var index = 0,
                            group = el.closest(".group"),
                            sel;
                        if (group.length) {
                            index = el.closest(".transformSelectDropdown").find("li").index(el) - group.prevAll(".group").length - 1;
                        } else {
                            index = el.parent().find("li").index(el) - el.prevAll(".group").length;
                        }
                        if (!options.showFirstItemInDrop) {
                            index += 1;
                        }
                        return index;
                    },
                    /*
                     *	Select a new value
                     */
                    selectNewValue: function() {
                        var _this = $(this),
                            $drop = _this.closest(".transformSelectDropdown"),
                            $ul = $drop.data("trans-element"),
                            select = method.getSelect($ul),
                            index = method.getLIIndex(_this);

                        select[0].selectedIndex = index;

                        // If it has an input, there is no span used for value holding
                        if ($ul.find("input[type=text]").length) {
                            $ul.find("input").val(options.valueTemplate.call(_this));
                        } else {
                            sel = select.find("option:selected");
                            $ul
                                .find("span:first")
                                .html(
                                    options.ellipsisLength ?
                                    $.simpleEllipsis(options.valueTemplate.call(sel), options.ellipsisLength) :
                                    options.valueTemplate.call(sel)
                                );
                        }

                        // Set selected
                        $drop.find(".selected").removeClass("selected");
                        _this.addClass("selected");

                        method.closeAllDropdowns();

                        // Trigger onchange
                        select.trigger("change");

                        $(".trans-element").removeClass("trans-focused");
                        $ul.addClass("trans-focused");

                        // Update validator
                        if ($.fn.validate && select.closest("form").length) {
                            select.valid();
                        }
                    },
                    mobileChange: function() {
                        var select = $(this),
                            $ul = method.getUL.call(this),
                            sel = select.find("option:selected");

                        if (this.type != "select-multiple") {
                            $ul
                                .find("span:first")
                                .html(
                                    options.ellipsisLength ?
                                    $.simpleEllipsis(options.valueTemplate.call(sel), options.ellipsisLength) :
                                    options.valueTemplate.call(sel)
                                );
                        }
                    },
                    selectCheckbox: function(e) {
                        var _this = $(this),
                            $drop = _this.closest(".transformSelectDropdown"),
                            $ul = $drop.data("trans-element"),
                            select = method.getSelect($ul),
                            t = _this.closest("li"),
                            checkbox = t.find(":checkbox"),
                            index, group;

                        if ($(e.target).is("li")) {
                            t = _this;
                        }

                        index = method.getLIIndex(t);

                        if (!$(e.target).is(":checkbox")) {
                            checkbox.prop("checked", !checkbox.is(":checked"));
                        }

                        select.find("option").eq(index).prop("selected", checkbox.is(":checked"));

                        if (checkbox.data("tfc.init")) {
                            checkbox.transformCheckbox("setImage");
                        }

                        if (!$(e.target).is(":checkbox")) {
                            checkbox.change();
                        }
                        select.change();
                    },
                    /*
                     *	Open clicked dropdown
                     *		and Close all others
                     */
                    openDrop: function() {
                        var UL = $(this).closest(".trans-element"),
                            childUL = UL.data("trans-element-drop"),
                            childLI = $(this).parent();

                        if (UL.hasClass("disabled")) {
                            return 0;
                        }

                        // Close on second click
                        if (childLI.hasClass("open") && !$(this).is("input")) {
                            method.closeAllDropdowns();
                        }
                        // Open on first click
                        else {
                            childLI
                                .css({ 'z-index': 1200 })
                                .addClass("open");

                            childUL.css({ 'z-index': 1200 }).show();

                            method.hideAllOtherDropdowns.call(this);
                        }

                        if (options.addDropdownToBody) {
                            childUL.css({
                                position: "absolute",
                                top: childLI.offset().top + childLI.outerHeight(),
                                left: childLI.offset().left
                            });
                        }
                    },
                    /*
                     *	Hide all elements except this element
                     */
                    hideAllOtherDropdowns: function() {
                        // Hide elements with the same class
                        var allElements = $("body").find("*"),
                            elIndex = allElements.index($(this).parent());

                        $("body").find("ul.trans-element").each(function() {
                            var childUL = $(this).data("trans-element-drop");

                            if (elIndex - 1 != allElements.index($(this))) {
                                childUL
                                    .hide()
                                    .css('z-index', 0)
                                    .parent()
                                    .css('z-index', 0)
                                    .removeClass("open");
                            }
                        });
                    },
                    /*
                     *	Close all dropdowns
                     */
                    closeDropDowns: function(e) {

                        if (!$(e.target).closest(".trans-element").length) {
                            method.closeAllDropdowns();
                        }
                    },
                    closeAllDropdowns: function() {
                        $("ul.trans-element").each(function() {
                            $(this).data("trans-element-drop").hide();
                            $(this).find("li:first").removeClass("open")
                        }).removeClass("trans-focused");
                    }
                }

            if (typeof opts == "string") {
                method[opts].apply(this, Array.prototype.slice.call(arguments, 1))
                return this;
            }
            return this.each(function() {
                var _this = $(this);

                // Is already initialized
                if (!_this.data("tfs.init")) {
                    options = $.extend(defaults, opts);
                    _this.data("settings", options);

                    // set initialized
                    _this.data("tfs.init", 1);

                    // Call init functions
                    method.init.call(this);
                }
            });
        }
    });

})(jQuery);