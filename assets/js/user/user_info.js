$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return layer.msg('昵称必须在1-6个字符之间')
            }

        }
    });

    initUserInfo();
    //初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // 调用form.val() 快速给表单赋值  一定要给form加属性lay - filter="formUserInfo"
                form.val('formUserInfo', res.data);
            }
        })
    }


    //重置表单的数据
    $('#btnReset').on('click', function (e) {
        //阻止表单的默认重置行为
        e.preventDefault();
        initUserInfo();
    })


    //监听表单的提交事件
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            //提交数据 进行表单数据序列化
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！');
                // 欢迎文本也要修改
                // 在子页面中调取父页面中方法，重新渲染用户的信息
                window.parent.getUserInfo();
            }
        })
    })

})
