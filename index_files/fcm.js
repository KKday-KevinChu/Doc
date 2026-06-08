if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/firebase-messaging-sw.js');
    });
}

var messaging;

if (firebase.messaging.isSupported()) {
    messaging = firebase.messaging();

    //在頁面停留 1分鐘 才執行
    setTimeout("requestPermission()", 60000);

    //收到訊息後的處理
    messaging.onMessage(function (payload) {
        //如果可以顯示通知就做顯示通知
        if (Notification.permission === 'granted') {
            var data = payload.data;
            var requireInteraction = false;
            if (data.requireInteraction == 'true') {
                var requireInteraction = true;
            }

            var notificationTitle = data.title;
            var notificationOptions = {
                body: data.body,
                icon: data.icon,
                requireInteraction: requireInteraction,
                event_action: data.event_action
            };

            // GA4 收集事件追蹤
            const ga_measurement_id = data.ga_measurement_id;
            const ga_collect_url = data.ga_collection;
            const ga_event = data.ga_event_name;
            const ga_category = data.ga_category;
            const ga_label = data.ga_label;
            const ga_debug = data.ga_debug;
            const gaPayload = {
                client_id: '',
                events: [{
                    name: ga_event,
                    params: {
                        event_action: "received",
                        event_category: ga_category,
                        event_label: ga_label,
                        debug_mode: ga_debug
                    }
                }]
            };

            try {
                var open_status = false;
                var notification = new Notification(notificationTitle, notificationOptions);
                notification.onclick = function(e) {
                    e.preventDefault();
                    window.open(data.click_action, '_blank');
                    if (typeof(ga_collect_url) != 'undefined' && typeof(ga_measurement_id) != 'undefined' && ga_collect_url != '' && ga_measurement_id != '') {
                        gtag('get', ga_measurement_id, 'client_id', (clientID) => {
                            gaPayload.client_id = clientID;
                            gaPayload.events[0].params.event_action = 'click';
                            fetch(ga_collect_url, {
                                method: 'POST',
                                body: JSON.stringify(gaPayload),
                            }).then(response => {
                            }).catch(error => {
                            });
                        });
                    }
                    if (data.event_action) {
                        console.log('FCM_click');
                        fetch(data.event_action + '&action=open', {method: 'get'});
                    }
                    open_status = true;
                    notification.close();
                }

                notification.onclose = function(e) {
                    if (open_status == false) {
                        e.preventDefault();
                        if (typeof(ga_collect_url) != 'undefined' && typeof(ga_measurement_id) != 'undefined' && ga_collect_url != '' && ga_measurement_id != '') {
                            gtag('get', ga_measurement_id, 'client_id', (clientID) => {
                                gaPayload.client_id = clientID;
                                gaPayload.events[0].params.event_action = 'close';
                                fetch(ga_collect_url, {
                                    method: 'POST',
                                    body: JSON.stringify(gaPayload)
                                }).then(response => {
                                }).catch(error => {
                                });
                            });
                        }
                        if (data.event_action) {
                            console.log('FCM_close');
                            fetch(data.event_action + '&action=close', {method: 'get'});
                        }
                    }
                }

                try {
                    console.log('aa'+ga_collect_url);
                    if (typeof(ga_collect_url) != 'undefined' && typeof(ga_measurement_id) != 'undefined' && ga_collect_url != '' && ga_measurement_id != '') {
                        gtag('get', ga_measurement_id, 'client_id', (clientID) => {
                            gaPayload.client_id = clientID;
                            console.log('fff');
                            fetch(ga_collect_url, {
                                method: 'POST',
                                body: JSON.stringify(gaPayload)
                            }).then(response => {
                            }).catch(error => {
                            });
                        });
                    }
                } catch (error) {
                    console.log('GA4 fetch failed:' + error);
                }

                if (data.event_action) {
                    console.log('FCM_received');
                    fetch(data.event_action + '&action=received', {method: 'get'});
                }
            } catch (error) {
                console.log('Notification error: ' + error);
            }
        }
    });
}

function requestPermission() {
    Notification.requestPermission()
    .then(function(permission) {
        if (permission === 'granted') {
            FCM();
            tokenRefresh();
        }
    }).catch(function(err) {
    });
}

function FCM() {
    messaging.getToken().then(function(currentToken) {
        if (currentToken) {
            sendTokenToServer(currentToken);
        } else {
            setTokenSentToServer(false);
        }
    }).catch(function(err) {
        setTokenSentToServer(false);
    });
}

function tokenRefresh() {
    messaging.onTokenRefresh(function() {
        messaging.getToken().then(function(refreshedToken) {
            setTokenSentToServer(false);

            sendTokenToServer(refreshedToken);
        }).catch(function(err) {
        });
    });
}

function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
        var ajax_url = "ajax/firebase/fcm_fetchToken.php";
        $.ajax({
            url: ajax_url,
            data: {notify_token: currentToken, device_id: navigator.userAgent.toLowerCase()},
            type: 'POST',
            cache: false,
            dataType: 'json'
        });
        setTokenSentToServer(true);
    }
}

function isTokenSentToServer(currentToken) {
    //Insert cookie
    var d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    document.cookie = "regId=" + currentToken + ";expires=" + d.toUTCString() + ";samesite=Strict;";

    if (window.localStorage.getItem('sent_status') === '7') {
        return true;
    }

    return false;
}

function setTokenSentToServer(sent) {
    if (sent) {
        window.localStorage.setItem('sent_status', '7');
    } else {
        window.localStorage.removeItem('sent_status');

        //delete cookie
        var expires = new Date();
        expires.setTime(expires.getTime() - 1);
        document.cookie = "regId=;expires=" + expires.toUTCString() + ";samesite=Strict;";
    }
}