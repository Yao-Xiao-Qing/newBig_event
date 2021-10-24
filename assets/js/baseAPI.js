//注意：每次调用$.post() $.get() $.ajax()的时候，会先调用$.ajaxPrefilter
//在这个函数中，会拿到我们给ajax提供的配置对象

//注意：每新建一个页面都要重新调用一下

$.ajaxPrefilter(function (options) {
    // console.log(options.url);///api/login
    //在发起真正的ajax请求之前，统一拼接地址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    // 统一为有权限的接口设置请求头
    // 首先判断options.url  indexOf('/my/')  不等于-1 说明找到
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 使用$.ajax()等 都会有success，error，complete回调函数，complete无论成功失败都会执行
    // 可以在此函数中判断status，验证身份是否登录成功，在获取用户信息的时候调用


    // 全局挂载统一的complete回调函数

    //不论成功还是失败，最终都会调用complete回调函数
    options.complete = function (res) {
        // console.log('执行了complete');
        // console.log(res);//responseJSON: {status: 1, message: '身份认证失败！'}
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token  清空手写的token
            localStorage.removeItem('token');
            //2.强制跳转登录页面
            location.href = '/login.html';
        }
    }
});