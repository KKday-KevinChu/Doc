$(function(){window.setTimeout('showvipMsg()',60*1000);showvipMsg=function showfixedtop(){if($.cookie("vip_msg")!=1){var content='<div id="form_popUp" class="c-popUp--md">'+
'<div class="c-popUp__content">'+
'<div class="u-tac">'+
'<i class="c-icon c-icon--max c-icon--btnAlertGy"></i>'+
'<div class="u-gapTop--md">'+
'<span class="t3">為提供您更優質的服務，誠摯邀請您加入本網站VIP會員。<a role="button" class="c-link c-link--gn" href="https://www.mobile01.com/membercompare.php" target="_blank">了解VIP會員權益</a></span>'+
'</div>'+
'</div>'+
'<div class="l-actions" style="margin-top:15px;">'+
'<button type="button" id="btn-open" class="c-btn c-btn--primary">我要加入VIP會員</button>'+
'</div>'+
'</div>'+
'</div>';var d=new Date();$.fancybox.open({src:content,type:'html',afterClose:function(){d.setTime(d.getTime()+(30*86400*1000));document.cookie="vip_msg="+1+";expires="+d.toUTCString()+";domain=.mobile01.com;samesite=Strict;";if(typeof(gtag)=='function'){gtag('event','Vip_lightbox',{'send_to':'G-WDCDQVB1NT','event_category':'Click','event_label':'close'});}},afterShow:function(){$('#btn-open').click(function(){window.location.href='vipapply.php';d.setTime(d.getTime()+(86400*1000));document.cookie="vip_msg="+1+";expires="+d.toUTCString()+";domain=.mobile01.com;samesite=Strict;";if(typeof(gtag)=='function'){gtag('event','Vip_lightbox',{'send_to':'G-WDCDQVB1NT','event_category':'Click','event_label':'open'});}});}});}}});