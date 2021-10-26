$(function () {

    var layer = layui.layer;
    var form = layui.form;
    initArtCataList();
    // 获取文章分类的列表
    function initArtCataList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    //为添加类别按钮绑定点击事件
    var indexAdd = null;//接收获取弹出层的index
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: '1',
            title: '添加文章分类'
            //这里将获取过来的html结构赋值给了content
            , content: $('#dialog-add').html(),
            area: ['500px', '250px']
        });
    })

    // 通过代理的形式，为form-add表单绑定submit事件 （因为它是动态生成的）
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                //  提交成功，就重新获取一下数据，渲染页面
                initArtCataList();
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })

    var indexEdit = null;
    // 编辑按钮--事件代理btn-edit绑定点击事件
    $('tbody').on('click', '#btn-edit', function () {
        //弹出一个修改文章的层
        indexEdit = layer.open({
            type: '1',
            title: '修改文章分类'
            //这里将获取过来的html结构赋值给了content
            , content: $('#dialog-edit').html(),
            area: ['500px', '250px']
        });

        var id = $(this).attr('data-id');
        //发起请求获取对应的数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })

    })

    // 修改分类提交事件--事件代理
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                // 关闭弹出层
                layer.close(indexEdit);
                //重新渲染数据
                initArtCataList();
            }
        })
    })

    // 点击删除--事件代理
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        //提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    initArtCataList();
                }
            })


        });
    })
})