var currentTarget;
window.node = null;
window.result = [];
var iconFa = ['tachometer', 'desktop', 'list', 'list-alt', 'picture-o', 'barcode', 'cogs', 'exchange', 'folder', 'laptop'];
var sideID;//当前点击侧边栏id
var idCheckResult = [];
var idCheck = function (data, ID) {
    data.forEach(function (value, index, array) {
        if (value.id === ID) {
            idCheckResult = value;
            return;
        }
        if (value.children === undefined) return;
        idCheck(value.children, ID);
    })
};

var merge = function (data) {
    data.forEach(function (value, index, array) {
        idCheck(result, value.id);
        if (idCheckResult.length !== 0) {
            value.apps = idCheckResult.apps;
            idCheckResult = [];
        }
        if (value.children === undefined) return;
        merge(value.children);
    })
};

// 通过result数据加载侧边栏
function loadSideBar() {
    var frame = $('<ul class="nav nav-list"></ul>');

    var firstLevel = function (name, id, index) {
        return $('<li class="">\n' +
             '<a href="#" class="dropdown-toggle">\n' +
             '<i class="menu-icon fa fa-' + iconFa[index] + ' bigger-120"></i>' +
             ' <span class="menu-text" onclick="$(\'#addApps\').css(\'display\',\'none\')" id="side-' + id + '">' + name + '</span></a>' +
             '<ul class="submenu nav-hide"></ul></li>');
    };
    var secondLevel = function (name, id) {
        return $('<li class="">\n' +
             '<a href="#" class="dropdown-toggle" onclick="$(\'#addApps\').css(\'display\',\'none\')" id="side-' + id + '">' +
             '<i class="menu-icon fa fa-caret-right"></i>' + name + '</a>\n' +
             '<ul class="submenu nav-show" style="display: none;"></ul></li>');
    };
    var thirdLevel = function (name, id) {
        return $('<li class=""><a href="#" onclick="showListApp(this)" id="side-' + id + '" ' +
             'class="dropdown-toggle"><i class="menu-icon fa fa-caret-right"></i>' + name + '</a></li>');
    };
    var $li;
    var load = function (data, frame) {
        data.forEach(function (element, index, arr) {
            if (element.id.split('-').length === 2) {
                $li = firstLevel(element.name, element.id, index);
                frame.append($li);
            } else if (element.id.split('-').length === 3) {
                $li = secondLevel(element.name, element.id);
                frame.children('ul:last-child').append($li);
            } else if (element.id.split('-').length === 4) {
                $li = thirdLevel(element.name, element.id);
                frame.children('ul:last-child').append($li);
            }
            if (element.children !== undefined) load(element.children, $li);
        })
    };
    load(result, frame);
    $('.nav.nav-list').append(frame.html());
}