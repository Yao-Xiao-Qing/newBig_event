$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击去登录的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 注意：使用form对象和layer的方法前，必须先获取这个对应的对象

    //从layui中获取form对象
    var form = layui.form;//只要我们导入layui就和jquery一样有$符号
    var layer = layui.layer;
    //通过form.verify()函数自定义校验规则
    form.verify({
        //自定义了一个叫做pwd的校验规则 \S 非空格字符集
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //校验两次密码是否一致
        repwd: function (value) {
            //   value是确认密码框内容

            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();//阻止默认提交行为
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post('/api/reguser',
            data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录！');
                // 模拟人的点击事件
                $('#link_login').click();
            })
    });

    //监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/api/login',
            //快速获取本表单的数据，上一个表单应用的是数据拼接的方法
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                // console.log(res.token);
                // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mzk0NDgsInVzZXJuYW1lIjoi5ZCD5LqG5bGOIiwicGFzc3dvcmQiOiIiLCJuaWNrbmFtZSI6IuWwj - WPr - eIsX4iLCJlbWFpbCI6InhAa2VhaS5jb20iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTYzNDk4MjMyMywiZXhwIjoxNjM1MDE4MzIzfQ.cLZ5QN5Ndl28gcaf8vejLyJFFvDp027CSXmi0f9be8U
                //    将登录成功的token值保存在localStorage
                localStorage.setItem('token', res.token);
                //跳转到后台主页
                location.href = '/index.html';
            }
        });
    });
})