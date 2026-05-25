//fancy form select
function build_fance_select(select_name) {
    $(select_name).transformSelect({
        dropDownClass: "c-dropdown__select",
    });
}

function getUrlParameter(name) {
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function strip_tags(input, allowed) {
    allowed = (((allowed || "") + "")
            .toLowerCase()
            .match(/<[a-z][a-z0-9]*>/g) || [])
            .join('');
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1){
        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}

function MinuteDiff(sDate, eDate) {
    let iMins;
    sDate = new Date(new Date(sDate + ' GMT+0800').toUTCString());
    iMins = parseInt(Math.abs(eDate - sDate) / 1000 / 60);
    return iMins;
};