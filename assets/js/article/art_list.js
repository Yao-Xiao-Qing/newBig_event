$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义美化事件的过滤器  只要调用了template就能使用

    template.defaults.imports.dataFormate = function (data) {
        const dt = new Date(data);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 补零函数
    function padZero(n) {
        return (n > 9) ? n : '0' + n;
    }

    //定义一个查询的参数对象，将来请求数据的时候
    //需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,//页码1页
        pagesize: 2,//显示两条
        cate_id: '',//文章分类id
        state: ''//文字状态
    }




    //获取文章列表数据的方法
    initTable();
    //初始化文章分类方法
    initCate();




    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                layer.msg('获取文章列表成功！')
                //使用模板引擎渲染表格
                var htmlStr = template('tpl-table', res)
                // console.log(htmlStr);
                $('tbody').html(htmlStr)
                // 调用渲染分页
                renderPage(res.total)
            }

        })
    }

    //初始化文章分类方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //重新渲染表格
                // 通知layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //为查询对象q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //根据最新的数据刷新
        initTable();
    })

    //定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox' //分页容器的id注意不用加 # 号
            , count: total//数据总数，从服务端得到
            , limit: q.pagesize //每页显示的条数
            , curr: q.pagenum //设置默认被选中的分页起始页
            , limits: [2, 3, 4, 5, 8]
            , layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
            //分页发生切换的时候，触发jump回调
            //触发jump回调的方法有两种
            //1.点击分页的时候，触发jump
            //2.只要调用了laypage.render()方法，就会触发jump
            , jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                //把最新的页码赋值给q
                q.pagenum = obj.curr;
                //把最新条目数，赋值给q查询对象中
                q.pagesize = obj.limit;

                // 可以通过first判断触发方式：
                //       1.first为true 则laypage.render()触发
                //       2.first为false 则点击触发
                //如果是通过laypage.render触发jump，first为true
                if (!first) {
                    //根据最新的q获取数据列表并渲染
                    initTable();
                }
            }
        });

    }

    //通过代理的方式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        var len = $('.btn-delete').length;
        // 获取到文章的id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    //当数据删除完成后，需要判断当前这一页中，是否还有剩余数据
                    //如果没有剩余的数据，则让当前页码-1之后，重新调用 initTable()方法
                    if (len === 1) {
                        //如果len的值等于1，证明删除完毕后，页面上没有任何数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    layer.close(index);
                }
            })


        });
    })

    //通过代理的方式，为编辑按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        //获取当前元素的id
        var id = $(this).attr('data-id');
        // 获取当前元素的数据
        $.ajax({
            method: 'get',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败！')
                }
                layer.msg('获取文章成功！')
                console.log(res.data);
            }

        })

    })
})