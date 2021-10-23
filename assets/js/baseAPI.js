//注意：每次调用$.post() $.get() $.ajax()的时候，会先调用$.ajaxPrefilter
//在这个函数中，会拿到我们给ajax提供的配置对象

//注意：每新建一个页面都要重新调用一下

$.ajaxPrefilter(function (options) {
    // console.log(options.url);///api/login
    //在发起真正的ajax请求之前，统一拼接地址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    console.log(options.url);
});