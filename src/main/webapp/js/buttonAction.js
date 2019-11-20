//                            _ooOoo_
//                           o8888888o
//                           88" . "88
//                           (| -_- |)
//                            O\ = /O
//                        ____/`---'\____
//                      .   ' \\| |// `.
//                       / \\||| : |||// \
//                     / _||||| -:- |||||- \
//                       | | \\\ - /// | |
//                     | \_| ''\---/'' | |
//                      \ .-\__ `-` ___/-. /
//                   ___`. .' /--.--\ `. . __
//                ."" '< `.___\_<|>_/___.' >'"".
//               | | : `- \`.;`\ _ /`;.`/ - ` : | |
//                 \ \ `-. \_ __\ /__ _/ .-` / /
//         ======`-.____`-.___\_____/___.-`____.-'======
//                            `=---='
//
//         .............................................
//                  佛祖镇楼                  BUG辟易
//             佛曰:
//                  写字楼里写字间，写字间里程序员；
//                  程序人员写程序，又拿程序换酒钱。
//                  酒醒只在网上坐，酒醉还来网下眠；
//                  酒醉酒醒日复日，网上网下年复年。
//                  但愿老死电脑间，不愿鞠躬老板前；
//                  奔驰宝马贵者趣，公交自行程序员。
//                  别人笑我忒疯癫，我笑自己命太贱；
//                  不见满街漂亮妹，哪个归得程序员？
//定义tomcat中自带的项目
var tomcatProjectInfo = [];//初始化tomcat项目
$(document).ready(function () {
    getUserInfo();//获取用户信息
    var width = $(window).get(0).innerWidth;//获取屏幕高度
    $('#pageContent').css("width", width - 230);//分页长度自适应
    addAllApp();
    $.ajax({
        type: "post",
        url: "update",
        data: {
            'requestType': 'get'
        },
        success: function (data) {
            if (data !== "") {
                result = JSON.parse(data);
                loadSideBar();
                if (typeof loadCategory !== 'undefined')
                    loadCategory(result, $('body'));
            }
        }
    });
});

// 加载所有app
function addAllApp() {
    $.ajax({//获取tomcat中正在运行的App
        type: "post",
        url: "AppManager",
        data: {},
        success: function (data) {
            tomcatProjectInfo = JSON.parse(data);//获取tomcat所有实例
            addApp(tomcatProjectInfo);
        }
    });
}

// 填充app
function addApp(data) {
    //清空当前app
    $('.gallery-entries.clearfix').children().each(function () {
        if ($(this).attr('id') !== 'addApps') {
            $(this).remove();
        }
    });
    data.forEach(function (element, index, array) {
        if (element.displayName === undefined) {
            console.log('Tomcat中' + element.appPath + '配置不正确');
        } else {
            $('.gallery-entries.clearfix').prepend('<li class="gallery-item"><a href="#"\n' +
                 '  rel="external"><img\n' +
                 '  style="width: 56px; height: 56px;"\n' +
                 '  src="' + element.webAppIcon + '" id="' + element.appPath + '" onclick="basicInfo(this)"\n' +
                 ' ><br>\n' +
                 '<div class="appname-div">' + element.displayName + '</div>\n' +
                 '  </a></li>');
        }
    });
}

//显示所有app信息
function showAllApp(node) {
    $('#mainFunctionBar').html("<i class=\"green ace-icon fa fa-desktop bigger-120\"></i>" + $(node).text());
    $('.gallery-entries.clearfix').empty();//清空列表
    addAllApp();
}

//显示某个app信息
function showListApp(node) {
    $('#mainFunctionBar').html($(node).text());
    sideID = $(node).attr('id').replace('side-', '');
    idCheck(result, sideID);
    addApp(idCheckResult.apps);//添加当前列表app
    idCheckResult = [];
    $('#addApps').css('display', 'block')
}

$(window).resize(function () {
    var width = $(window).get(0).innerWidth;//获取屏幕高度
    $('#pageContent').css("width", width - 230);//分页长度自适应
});

//模态框基本信息
var curProjectNode;

function basicInfo(node) {
    curProjectNode = node;
    $('#manageOftenApp').attr('appId', $(window.event.target).attr('id'));
    $('#appName').html($(node.parentNode).children('div').html());//修改模态框标题
    tomcatProjectInfo.forEach(function (value, index, array) {
        if (value.appPath === $(node).attr('id')) {
            var curTomcatInstance = value;//获取当前tomcat实例信息数组
            $('#appStatus').html(curTomcatInstance.running);//运行状态
            $('#appVisitNum').html(curTomcatInstance.visitNum);//访问次数
            $('#appAttribute').html(curTomcatInstance.webAppAttributeLabel);//属性标签
            $('#appFunctionDes').html(curTomcatInstance.webAppDescription);//功能描述
            $('#appVersion').html(curTomcatInstance.webAppVersion);//版本号
            $('#manageOftenApp').modal('show');
        }
    });
}

function appManagement(data) {
    $.ajax({//管理tomcat中正在运行的项目
        type: "post",
        url: "AppStatus",
        data: data,
        success: function (data) {
            console.log(data);
        }
    });
}

/*
*加载我的最爱软件
*/
function showFavorite(node) {
    $('#mainFunctionBar').html("常用工具");
    var data = {
        "type": "get"
    };
    $.ajax({//管理tomcat中正在运行的项目
        type: "post",
        url: "favoriteService",
        data: data,
        success: function (data) {
            var temp = [];
            tomcatProjectInfo.forEach(function (value) {
                if (data.indexOf(value.appPath) !== -1) {
                    temp.push(value);
                }
            });
            $('.gallery-entries.clearfix').empty();
            addApp(temp);
        }
    });
}

/*
*收藏与取消关注app 
*/
function collectApp(node) {
    var data = {
        "type": "put",
        "appName": $(node).attr('id')
    };
    $.ajax({//管理tomcat中正在运行的项目
        type: "post",
        url: "favoriteService",
        data: data,
        success: function (data) {
            data = JSON.parse(data);
            if (data.status === 200) {
                alert("收藏成功");
            } else {
                alert("我知道你很喜欢我，但也不允许重复收藏哟");
            }
            $('#manageOftenApp').modal('hide');
        }
    });
}

function discardApp(node) {
    var data = {
        "type": "delete",
        "appName": $(node).attr('id')
    };
    $.ajax({//管理tomcat中正在运行的项目
        type: "post",
        url: "favoriteService",
        data: data,
        success: function (data) {
            data = JSON.parse(data);
            if (data.status === 200) {
                alert("好遗憾，期待我们下次在相见");
                if ($('#mainFunctionBar').text().replace(/\s+/g, "") === "常用工具") {
                    showFavorite(node);
                }
            } else {
                alert("你还没关注我哟！");
            }
            $('#manageOftenApp').modal('hide');
        }
    });
}

/*
*进入对应app
*/
function enterApp(node) {
    window.open('http://' + window.location.host + $(node).attr('id'));
}

function startApp(node) {
    var data = {'Info': '/start', 'path': $(node).attr('id')};
    $('#reloadApp').attr('class', 'btn btn-purple');//打开重启按钮
    appManagement(data);
}

function stopApp(node) {
    var data = {'Info': '/stop', 'path': $(node).attr('id')};
    $('#reloadApp').attr('class', 'btn disabled btn-purple');//取消重启按钮
    appManagement(data);
}

function reloadApp(node) {
    var data = {'Info': '/reload', 'path': $(node).attr('id')};
    appManagement(data);
}