$(function () {
    // 获取用户基本信息
    getUserInfo();

    var layer = layui.layer;

    $('#btn_Logout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确认退出登录？', { icon: 3, title: '提示' }, function (index) {
            //1.清空本地存储的token
            localStorage.removeItem('token');
            //2.重新跳转到登录页面
            location.href = '/login.html';
            layer.close(index);//confirm询问框关闭弹出层
        });
    })
});

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //  headers  请求头配置对象
        // headers: {
        //     //    如果没有获取到token就是空
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            //渲染用户的头像
            renderAvatar(res.data);
        }
        //  ,
        // //不论成功还是失败，最终都会调用complete回调函数
        // complete: function (res) {
        //     // console.log('执行了complete');
        //     // console.log(res);//responseJSON: {status: 1, message: '身份认证失败！'}
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空token  清空手写的token
        //         localStorage.removeItem('token');
        //         //2.强制跳转登录页面
        //         location.href = '/login.html';
        //     }
        // }
    });
}

//渲染用户的头像
function renderAvatar(user) {
    //1.获取用户名称
    var name = user.nickname || user.username;
    //2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.按需渲染用户头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2渲染文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();//第一个字母大写
        $('.text-avatar').html(first).show();
    }
}

