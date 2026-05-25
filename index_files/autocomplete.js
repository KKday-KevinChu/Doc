var suggestCallBack; // global var for autocomplete jsonp
function autocomplete(id) {
    $("#"+id).autocomplete({
        source: function(request, response) {
            $.getJSON("https://suggestqueries.google.com/complete/search?callback=?",
                {
                  "hl":"zh-tw",
                  "gl":"tw",
                  "jsonp":"suggestCallBack",
                  "q":request.term,
                  "client":"chrome"
                }
            );
            suggestCallBack = function (data) {
                var suggestions = [];
                $.each(data[1], function(key, val) {
                    suggestions.push({"value":val});
                });
                suggestions.length = 5;
                response(suggestions);
            };
        },
    });
}