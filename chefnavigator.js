var role_regex = /role\[([\w-]+)\]/;
var recipe_regex = /recipe\[([\w-]+)(::([\w-]+))?\]/;
var include_regex = /include_recipe <span class=\"pl-s\"><span class=\"pl-pds\">\"<\/span>([\w-]+)(::([\w-]+))?<span class=\"pl-pds\">\"/;
var include_regex_single_quote = /include_recipe <span class=\"pl-s\"><span class=\"pl-pds\">\'<\/span>([\w-]+)(::([\w-]+))?<span class=\"pl-pds\">\'/;
var chefref_regex = /(role\[([\w-]+)\]|recipe\[([\w-]+)(::([\w-]+))?\]|include_recipe <span class=\"pl-s\"><span class=\"pl-pds\">\"<\/span>([\w-]+)(::([\w-]+))?<span class=\"pl-pds\">\"|include_recipe <span class=\"pl-s\"><span class=\"pl-pds\">\'<\/span>([\w-]+)(::([\w-]+))?<span class=\"pl-pds\">\')/g; // FIXME I'm sure this can be done smarter

var urlbase_regex = /https:\/\/github.com\/.*\/blob\/\w+\//;

function href_for_chefref(chefref) {
    if (role_regex.test(chefref)) {
        match = role_regex.exec(chefref);
        rolename = match[1];
        return '<a class="cheflink" href="' + urlbase + 'roles/' + rolename + '.json">' + chefref + '</a>';
    } 
    else if (recipe_regex.test(chefref)) {
        match = recipe_regex.exec(chefref);
        cookbook = match[1];
        recipe = match[3] !== undefined ? match[3] : "default";
        return '<a class="cheflink" href="' + urlbase + 'cookbooks/' + cookbook + '/recipes/' + recipe + '.rb">' + chefref + '</a>';
    }
    else if (include_regex.test(chefref)) {
        match = include_regex.exec(chefref);
        cookbook = match[1];
        recipe = match[3] !== undefined ? match[3] : "default";
        return '<a class="cheflink" href="' + urlbase + 'cookbooks/' + cookbook + '/recipes/' + recipe + '.rb">' + chefref + '</a>';
    }
    else if (include_regex_single_quote.test(chefref)) {
        match = include_regex_single_quote.exec(chefref);
        cookbook = match[1];
        recipe = match[3] !== undefined ? match[3] : "default";
        return '<a class="cheflink" href="' + urlbase + 'cookbooks/' + cookbook + '/recipes/' + recipe + '.rb">' + chefref + '</a>';
    }
}

function change_references() {
    var urlbase_result = urlbase_regex.exec(window.location.href);
    if (urlbase_result) {
        urlbase = urlbase_result[0];
        var file_contents = document.getElementsByClassName('file')[0].innerHTML;
        var replaced = file_contents.replace(chefref_regex, href_for_chefref);
        document.getElementsByClassName('file')[0].innerHTML = replaced;
    }
}

//

window.onload = function() {
    bind_click_handler();
    if (window.location.href.indexOf('/blob/') !== -1) {
        change_references();
    }
}

function bind_click_handler() {
    document.onclick = function(e) {
        var target = e.target.closest('a');
        if (target.href && target.href.indexOf('/blob/') !== -1) {
            console.log('clicked link!!')
            interval_change_references();
        } else {
            console.log('clicked but not link')
        }
    }
}

function interval_change_references() {
    var interval = setInterval(function() {
        if (document.getElementsByClassName('file').length) {
            console.log('yay')
            change_references();
            clearInterval(interval);
        } else {
            console.log('nah')
        }
    }, 200);
}
