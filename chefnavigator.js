var role_regex = /role\[(\w+)\]/;
var recipe_regex = /recipe\[(\w+)(::(\w+))?\]/;
var include_regex = /include_recipe <span class=\"pl-s\"><span class=\"pl-pds\">\"<\/span>(\w+)(::(\w+))?<span class=\"pl-pds\">\"/;
var chefref_regex = /(role\[(\w+)\]|recipe\[(\w+)(::(\w+))?\]|include_recipe <span class=\"pl-s\"><span class=\"pl-pds\">\"<\/span>(\w+)(::(\w+))?<span class=\"pl-pds\">\")/g; // FIXME I'm sure this can be done smarter


function href_for_chefref(chefref) {
    var urlbase = /https:\/\/github.com\/.*\/blob\/\w+\//.exec(window.location.href)[0];

    if (role_regex.test(chefref)) {
        match = role_regex.exec(chefref);
        rolename = match[1];
        return '<a class="cheflink" href="' + urlbase + 'roles/' + rolename + '.json">' + chefref + '</a>';
    } 
    else if (recipe_regex.test(chefref)) {
        match = recipe_regex.exec(chefref);
        cookbook = match[2];
        recipe = match[4] !== undefined ? match[4] : "default";
        return '<a class="cheflink" href="' + urlbase + 'cookbooks/' + cookbook + '/recipes/' + recipe + '.rb">' + chefref + '</a>';
    }
    else if (include_regex.test(chefref)) {
        match = include_regex.exec(chefref);
        cookbook = match[1];
        recipe = match[3] !== undefined ? match[3] : "default";
        return '<a class="cheflink" href="' + urlbase + 'cookbooks/' + cookbook + '/recipes/' + recipe + '.rb">' + chefref + '</a>';
    }
}

window.onload = function() {
    var file_contents = document.getElementsByClassName('file')[0].innerHTML;
    var replaced = file_contents.replace(chefref_regex, href_for_chefref);
    document.getElementsByClassName('file')[0].innerHTML = replaced;
}