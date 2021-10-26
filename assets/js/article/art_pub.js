$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 定义加载文章分类的方法
    initCate();
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                layer.msg('初始化文章分类成功！')
                //调用模板引擎获取下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //这里动态添加的文章，要重新调用form.render()
                form.render();
            }
        })
    }

    //实现裁剪功能
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //未选选封面的按钮绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        //模拟文件选择点击
        $('#coverFile').click()
        // 把选择的图片设置到页面中
    })

    //文件change事件，获取文件地址赋值
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表
        var file = e.target.files[0];
        // 用户不一定真的选择了文件，所以要判断
        if (file.length === 0) {
            return
        }
        //根据用户选择的文件创建一个url地址
        var newImgURL = URL.createObjectURL(file)
        //为裁剪区域重新赋值路径
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    //定义文章发布状态
    var atr_state = null;
    //为存为草稿，绑定点击处理函数
    $('#btnSave2').on('click', function () {
        atr_state = '草稿'
    })
    //为存为草稿，绑定点击处理函数
    $('#btnSave1').on('click', function () {
        atr_state = '已发布'
    })


    //表单submit事件
    $('#form-pub').on('submit', function (e) {
        //1.阻止表单数据的默认提交行为
        e.preventDefault();
        //2.基于 form 表单，快速创建一个FormData 对象
        var fd = new FormData($(this)[0])

        //3.在fd中追加属性和值，将文章发布状态，存到fd中
        fd.append('state', atr_state)
        //4.将封面裁剪过后的图片，输出为一个文件对象
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            //5.将文件对象blob，存储到fd中
            fd.append('cover_img', blob)
            //6.发起ajax数据请求
            publishArticle(fd);
        })

        // fd.forEach(function (v, i) {
        //     console.log(i, v);
        // })
    })

    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            //注意如果向服务器提交的是FormData格式的数据，必须添加两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                //发布成功之后,跳转到文章列表页面
                location.href = '/article/art_list.html'

            }
        })
    }
})