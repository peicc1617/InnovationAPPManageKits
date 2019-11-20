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

// 编辑分类名
function editName() {
    $(currentTarget).parents('.dd2-content').find('span.textClass').text($('#projectNameModal').val());
    $('#editName').modal('hide');
    var tempJson = $('div.dd.dd-draghandle').nestable('serialize');
    merge(tempJson);
    result = tempJson;
}

// 添加新节点
function addNew() {
    if ($('#newItemName').val() !== '') {
        var tempHtml = '<li class="dd-item dd2-item" data-id="level-' + ($('#firstOl').children('li').length + 1) + '">\n' +
             '<div class="dd-handle dd2-handle">\n' +
             '  <i class="normal-icon ace-icon fa fa-bars blue bigger-130"></i>\n' +
             '  <i class="drag-icon ace-icon fa fa-arrows bigger-125"></i>\n' +
             '</div>\n' +
             '<div class="dd2-content">\n' +
             '  <span class="textClass">' + $('#newItemName').val() + '</span>\n' +
             '  <div class="pull-right action-buttons">\n' +
             '<a class="tooltip-info" data-rel="tooltip" title="编辑">\n' +
             '  <span class="blue">\n' +
             '<i class="ace-icon fa fa-pencil-square-o bigger-120"\n' +
             '   onclick="$(\'#editName\').modal(\'show\');currentTarget = this;"></i>\n' +
             '  </span>\n' +
             '</a>\n' +
             '<a class="tooltip-error" data-rel="tooltip" title="删除">\n' +
             '  <span class="red">\n' +
             '<i class="ace-icon fa fa-trash-o bigger-120"\n' +
             '   onclick="deleteItem(this)"></i>\n' +
             '  </span>\n' +
             '</a>\n' +
             '</div>\n' +
             '</div>\n' +
             '</li>';
        $('#firstOl').append(tempHtml);
        var tempJson = $('div.dd.dd-draghandle').nestable('serialize');
        merge(tempJson);
        result = tempJson;
    }
}

// 删除项目
function deleteItem(node) {
    if (confirm("项目删除后相关子类将会一起被删除，而且将无法恢复，确认要删除吗？")) {
        $(node).parents('li')[0].remove();
        var tempJson = $('div.dd.dd-draghandle').nestable('serialize');
        merge(tempJson);
        result = tempJson;
    }
    merge(tempJson);
    result = tempJson;
}

// 更新分类
function updateCategory() {
    var tempJson = $('div.dd.dd-draghandle').nestable('serialize');
    merge(tempJson);
    result = tempJson;
    // 保存数据到数据库
    $.ajax({
        type: "post",
        url: "update",
        data: {
            'result': JSON.stringify(result),
            'requestType': 'modify'
        },
        success: function (result) {
            alert("数据保存成功");
            loadSideBar();
            $('#appEditCategroy').modal('hide');
        }
    });
}

// 通过result数据加载侧边栏
function loadSideBar() {
    var frame = $('<ul class="nav nav-list"></ul>');
    $('.nav.nav-list').replaceWith(frame);
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
}

// 通过result加载编辑分类
function loadCategory(jsonArray, root) {
    if (typeof root === 'undefined') {
        root = $('body');
    }
    var $div = $('<div id="nestable"><ol class="dd-list"></ol></div>');
    root.append($div);
    for (var i = 0; i < jsonArray.length; i++) {
        var buttonStyle = '';
        if (jsonArray[i].children.length !== 0) {
            buttonStyle = '<button data-action="collapse" type="button" style="display: block;">Collapse</button>\n' +
                 '<button data-action="expand" type="button" style="display: none;">Expand</button>';
        }
        var $li = $('<li class="dd-item dd2-item" data-id="' + jsonArray[i].id + '">\n' + buttonStyle +
             '<div class="dd-handle dd2-handle">\n' +
             '  <i class="normal-icon ace-icon fa fa-bars blue bigger-130"></i>\n' +
             '  <i class="drag-icon ace-icon fa fa-arrows bigger-125"></i></div>\n' +
             '<div class="dd2-content">\n' +
             '  <span class="textClass">' + jsonArray[i].name + '</span>\n' +
             '  <div class="pull-right action-buttons">\n' +
             '<a class="tooltip-info" data-rel="tooltip" title="" data-original-title="编辑">\n' +
             '  <span class="blue">\n' +
             '<i class="ace-icon fa fa-pencil-square-o bigger-120" onclick="$(\'#editName\').modal(\'show\');currentTarget = this;"></i>\n' +
             '  </span></a><a class="tooltip-error" data-rel="tooltip" title="" data-original-title="删除">\n' +
             '  <span class="red">\n' +
             '<i class="ace-icon fa fa-trash-o bigger-120" onclick="deleteItem(this)"></i></span></a></div></div>\n' +
             '<ol class="dd-list"></ol></li>');
        root.find('ol.dd-list:first').append($li);
        if (typeof jsonArray[i].children !== 'undefined') {
            loadCategory(jsonArray[i].children, $li);
        }
    }
    $('#nestable').nestable();
}

//加载app选项模态框
function showCategory() {
    var nodeId = sideID.replace('side-', '');
    idCheck(result, nodeId);
    var addedApp = idCheckResult.apps;
    idCheckResult = [];

    // 清空数据
    $('#duallist').remove();
    $('div.bootstrap-duallistbox-container.row.moveonselect').remove();
    $('.form-group').append(
         '<select multiple="multiple" size="100" name="duallistbox" id="duallist" style="height: 150px"></select>'
    );
    //将数据添加到模态框中
    for (var i = 0; i < addedApp.length; i++) {
        var optionNode = '<option value="' + addedApp[i]['appPath'] + '" selected="selected">' + addedApp[i]['displayName'] + '</option>';
        $('select[name="duallistbox"]')[0].options.add($(optionNode).get(0));
    }
    //将为未添加app添加到模态框中
    tomcatProjectInfo.forEach(function (element, index, array) {
        if (addedApp.find(function (ele) {
            return ele.appPath === element['appPath']
        }) === undefined) {//未添加
            var optionNode = '<option value="' + element['appPath'] + '">' + element['displayName'] + '</option>';
            $('select[name="duallistbox"]')[0].options.add($(optionNode).get(0));
        }
    });
    //初始化选项列表
    $('select[name="duallistbox"]').bootstrapDualListbox({
        infoTextFiltered: '<span class="label label-purple label-lg">Filtered</span>'
    });
    $('#classify').modal('show');
}

// 更新app集合数据
function updateApps() {
    var apps = [];
    $.each($('#bootstrap-duallistbox-selected-list_duallistbox').children(), function (index, ele, array) {
        var tempElement = tomcatProjectInfo.find((element) => (element.appPath === $(ele).attr('value')));
        if (tempElement !== undefined) {
            apps.push(tempElement);
        }
    });
    //更新全局结果result
    var addCategory = function (data, ID) {
        data.forEach(function (value, index, array) {
            if (value.id === ID) value.apps = apps;
            if (value.children === undefined) return;
            addCategory(value.children, ID);
        })
    };
    addCategory(result, sideID.replace('side-', ''));
    updateCategory();
    addApp(apps);
    $('#classify').modal('hide');
}

jQuery(function ($) {
    // li具有拖动功能
    $('.dd').nestable();
    $('[data-rel="tooltip"]').tooltip();
});