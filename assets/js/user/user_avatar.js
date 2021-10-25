$(function () {

    var layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        // 模拟点击文件上传input
        $('#file').click();
        // 给表单添加accept属性accept="image/jpeg,image/png"   image图片文件
    })

    // 文件选择框的change事件
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        var fileList = e.target.files;//FileList {0: File, length: 1}
        if (fileList.length === 0) {
            return layer.msg('请选择照片！')
        }
        //1.拿到用户选择的文件
        var file = e.target.files[0]
        //2.将文件创建一个对应的URL路径
        var newImgURL = URL.createObjectURL(file)
        //3.重新初始化一下裁剪区
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //为确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // 获取裁剪之后的图片url
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                //更新成功之后，要记得重新渲染一遍
                window.parent.getUserInfo();
            }
        })

    })
})