/*! RateIt | v1.1.0 / 10/20/2016
    https://github.com/gjunge/rateit.js | Twitter: @gjunge
*/
! function(e) {
    function t(e) {
        var t = e.originalEvent.changedTouches,
            a = t[0],
            i = "";
        switch (e.type) {
            case "touchmove":
                i = "mousemove";
                break;
            case "touchend":
                i = "mouseup";
                break;
            default:
                return
        }
        var r = document.createEvent("MouseEvent");
        r.initMouseEvent(i, !0, !0, window, 1, a.screenX, a.screenY, a.clientX, a.clientY, !1, !1, !1, !1, 0, null), a.target.dispatchEvent(r), e.preventDefault()
    }
    e.rateit = { aria: { resetLabel: "reset rating", ratingLabel: "rating" } }, e.fn.rateit = function(a, i) {
        var r = 1,
            n = {},
            s = "init",
            d = function(e) { return e.charAt(0).toUpperCase() + e.substr(1) };
        if (0 === this.length) return this;
        var l = e.type(a);
        if ("object" == l || void 0 === a || null === a) n = e.extend({}, e.fn.rateit.defaults, a);
        else { if ("string" == l && "reset" !== a && void 0 === i) return this.data("rateit" + d(a)); "string" == l && (s = "setvalue") }
        return this.each(function() {
            var l = e(this),
                o = function(e, t) {
                    if (null != t) {
                        var a = "aria-value" + ("value" == e ? "now" : e),
                            i = l.find(".rateit-range");
                        void 0 != i.attr(a) && i.attr(a, t)
                    }
                    return arguments[0] = "rateit" + d(e), l.data.apply(l, arguments)
                };
            if ("reset" == a) { var u = o("init"); for (var v in u) l.data(v, u[v]); if (o("backingfld")) { var m = e(o("backingfld")); "SELECT" == m[0].nodeName && "index" === m[0].getAttribute("data-rateit-valuesrc") ? m.prop("selectedIndex", o("value")) : m.val(o("value")), m.trigger("change"), m[0].min && (m[0].min = o("min")), m[0].max && (m[0].max = o("max")), m[0].step && (m[0].step = o("step")) } l.trigger("reset") } l.hasClass("rateit") || l.addClass("rateit");
            var h = "rtl" != l.css("direction");
            if ("setvalue" == s) { if (!o("init")) throw "Can't set value before init"; if ("readonly" != a || 1 != i || o("readonly") || (l.find(".rateit-range").unbind(), o("wired", !1)), "value" == a && (i = null == i ? o("min") : Math.max(o("min"), Math.min(o("max"), i))), o("backingfld")) { var m = e(o("backingfld")); "SELECT" == m[0].nodeName && "index" === m[0].getAttribute("data-rateit-valuesrc") ? "value" == a && m.prop("selectedIndex", i) : "value" == a && m.val(i), "min" == a && m[0].min && (m[0].min = i), "max" == a && m[0].max && (m[0].max = i), "step" == a && m[0].step && (m[0].step = i) } o(a, i) }
            if (!o("init")) {
                if (o("mode", o("mode") || n.mode), o("icon", o("icon") || n.icon), o("min", isNaN(o("min")) ? n.min : o("min")), o("max", isNaN(o("max")) ? n.max : o("max")), o("step", o("step") || n.step), o("readonly", void 0 !== o("readonly") ? o("readonly") : n.readonly), o("resetable", void 0 !== o("resetable") ? o("resetable") : n.resetable), o("backingfld", o("backingfld") || n.backingfld), o("starwidth", o("starwidth") || n.starwidth), o("starheight", o("starheight") || n.starheight), o("value", Math.max(o("min"), Math.min(o("max"), isNaN(o("value")) ? isNaN(n.value) ? n.min : n.value : o("value")))), o("ispreset", void 0 !== o("ispreset") ? o("ispreset") : n.ispreset), o("backingfld")) {
                    var m = e(o("backingfld")).hide();
                    if ((m.attr("disabled") || m.attr("readonly")) && o("readonly", !0), "INPUT" == m[0].nodeName && ("range" != m[0].type && "text" != m[0].type || (o("min", parseInt(m.attr("min")) || o("min")), o("max", parseInt(m.attr("max")) || o("max")), o("step", parseInt(m.attr("step")) || o("step")))), "SELECT" == m[0].nodeName && m[0].options.length > 1) {
                        "index" === m[0].getAttribute("data-rateit-valuesrc") ? (o("min", isNaN(o("min")) ? Number(m[0].options[0].index) : o("min")), o("max", Number(m[0].options[m[0].length - 1].index)), o("step", Number(m[0].options[1].index) - Number(m[0].options[0].index))) : (o("min", isNaN(o("min")) ? Number(m[0].options[0].value) : o("min")), o("max", Number(m[0].options[m[0].length - 1].value)), o("step", Number(m[0].options[1].value) - Number(m[0].options[0].value)));
                        var c = m.find("option[selected]");
                        1 == c.length && ("index" === m[0].getAttribute("data-rateit-valuesrc") ? o("value", c[0].index) : o("value", c.val()))
                    } else o("value", m.val())
                }
                var g = "DIV" == l[0].nodeName ? "div" : "span";
                r++;
                var f = '<button id="rateit-reset-{{index}}" type="button" data-role="none" class="rateit-reset" aria-label="' + e.rateit.aria.resetLabel + '" aria-controls="rateit-range-{{index}}"><span></span></button><{{element}} id="rateit-range-{{index}}" class="rateit-range" tabindex="0" role="slider" aria-label="' + e.rateit.aria.ratingLabel + '" aria-owns="rateit-reset-{{index}}" aria-valuemin="' + o("min") + '" aria-valuemax="' + o("max") + '" aria-valuenow="' + o("value") + '"><{{element}} class="rateit-empty"></{{element}}><{{element}} class="rateit-selected"></{{element}}><{{element}} class="rateit-hover"></{{element}}></{{element}}>';
                l.append(f.replace(/{{index}}/gi, r).replace(/{{element}}/gi, g)), h || (l.find(".rateit-reset").css("float", "right"), l.find(".rateit-selected").addClass("rateit-selected-rtl"), l.find(".rateit-hover").addClass("rateit-hover-rtl")), "font" == o("mode") ? l.addClass("rateit-font").removeClass("rateit-bg") : l.addClass("rateit-bg").removeClass("rateit-font"), o("init", JSON.parse(JSON.stringify(l.data())))
            }
            var p = "font" == o("mode");
            p || l.find(".rateit-selected, .rateit-hover").height(o("starheight"));
            var b = l.find(".rateit-range");
            if (p) {
                for (var x = o("icon"), w = o("max") - o("min"), N = "", y = 0; y < w; y++) N += x;
                b.find("> *").text(N), o("starwidth", b.width() / (o("max") - o("min")))
            } else b.width(o("starwidth") * (o("max") - o("min"))).height(o("starheight"));
            var C = "rateit-preset" + (h ? "" : "-rtl");
            if (o("ispreset") ? l.find(".rateit-selected").addClass(C) : l.find(".rateit-selected").removeClass(C), null != o("value")) {
                var k = (o("value") - o("min")) * o("starwidth");
                l.find(".rateit-selected").width(k)
            }
            var E = l.find(".rateit-reset");
            E.data("wired") !== !0 && E.bind("click", function(t) { t.preventDefault(), E.blur(); var a = e.Event("beforereset"); return l.trigger(a), !a.isDefaultPrevented() && (l.rateit("value", null), void l.trigger("reset")) }).data("wired", !0);
            var M = function(t, a) {
                    var i = a.changedTouches ? a.changedTouches[0].pageX : a.pageX,
                        r = i - e(t).offset().left;
                    return h || (r = b.width() - r), r > b.width() && (r = b.width()), r < 0 && (r = 0), k = Math.ceil(r / o("starwidth") * (1 / o("step")))
                },
                I = function(e) {
                    var t = e * o("starwidth") * o("step"),
                        a = b.find(".rateit-hover");
                    if (a.data("width") != t) {
                        b.find(".rateit-selected").hide(), a.width(t).show().data("width", t);
                        var i = [e * o("step") + o("min")];
                        l.trigger("hover", i).trigger("over", i)
                    }
                },
                L = function(t) { var a = e.Event("beforerated"); return l.trigger(a, [t]), !a.isDefaultPrevented() && (o("value", t), o("backingfld") && ("SELECT" == m[0].nodeName && "index" === m[0].getAttribute("data-rateit-valuesrc") ? e(o("backingfld")).prop("selectedIndex", t).trigger("change") : e(o("backingfld")).val(t).trigger("change")), o("ispreset") && (b.find(".rateit-selected").removeClass(C), o("ispreset", !1)), b.find(".rateit-hover").hide(), b.find(".rateit-selected").width(t * o("starwidth") - o("min") * o("starwidth")).show(), l.trigger("hover", [null]).trigger("over", [null]).trigger("rated", [t]), !0) };
            o("readonly") ? E.hide() : (o("resetable") || E.hide(), o("wired") || (b.bind("touchmove touchend", t), b.mousemove(function(e) {
                var t = M(this, e);
                I(t)
            }), b.mouseleave(function(e) { b.find(".rateit-hover").hide().width(0).data("width", ""), l.trigger("hover", [null]).trigger("over", [null]), b.find(".rateit-selected").show() }), b.mouseup(function(e) {
                var t = M(this, e),
                    a = t * o("step") + o("min");
                L(a), b.blur()
            }), b.keyup(function(e) { 38 != e.which && e.which != (h ? 39 : 37) || L(Math.min(o("value") + o("step"), o("max"))), 40 != e.which && e.which != (h ? 37 : 39) || L(Math.max(o("value") - o("step"), o("min"))) }), o("wired", !0)), o("resetable") && E.show()), b.attr("aria-readonly", o("readonly"))
        })
    }, e.fn.rateit.defaults = { min: 0, max: 5, step: .5, mode: "bg", icon: "★", starwidth: 16, starheight: 16, readonly: !1, resetable: !0, ispreset: !1 }, e(function() { e("div.rateit, span.rateit").rateit() })
}(jQuery);
//# sourceMappingURL=jquery-rateit-min-js.map