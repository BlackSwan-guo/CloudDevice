var handel = {
    maxId: data.length,
    now:1,
    getById: function(id){//通过 id 获取元素
        return data.filter( function(item){
            return item.id == id;
        } )[0]
    },
    getByPid: function(pid){//通过 pid 获取元素
        return data.filter( function(item){
            return item.pid == pid;
        } )
    },
    formHtmlByPid:function(pid,plNum){
        var str = "";
        var paddingLeft = plNum;
        var d = this.getByPid( pid );//获取数据
        for (var i = 0; i < d.length; i++) {
            var temp = this.getByPid( d[i].id );//查找以d[i].id为pid的数据,比如查找 pid 为1的所有数据
            if( temp.length === 0 ){//没有 "子级"
                str += "<li><h5 idNum='"+ d[i].id +"' style='padding-left:"+ paddingLeft+"px'><img class=\"fileI\" src=\"img/fileIcon.png\"/>"+ d[i].name +"</h5></li>";
            }else{//有子级
                var a = paddingLeft + 40;
                str += "<li><h5 idNum='"+ d[i].id +"' class='rightArr' style='padding-left:"+ paddingLeft+"px'><img class=\"fileI\" src=\"img/fileIcon.png\"/>"+ d[i].name +"</h5><ul>"+ this.formHtmlByPid( d[i].id, a) +"</ul></li>";
            }
        }
        return str;
    },
    creatTree:function(){//创建左侧树型菜单
        var d = this.getByPid(0);//获取pid为0的数据
        if(d.length == 0){//代表没有获取到
            return
        }
        document.querySelector(".leftList").innerHTML = this.formHtmlByPid(0,10);
        this.addTreeEvent();
    },
    addTreeEvent:function(){//为h5 添加点击事件处理函数
        var h5s = document.querySelectorAll(".leftList h5");
        for (var i = 0; i < h5s.length; i++) {
            if( !h5s[i].nextElementSibling ) continue;
            h5s[i].onclick = function(){
                if( this.classList.contains("downArr") ){//点击的是展开的
                    this.nextElementSibling.querySelectorAll("h5[class~='downArr']").forEach(function(item){
                        item.classList.add("rightArr");
                        item.classList.remove("downArr");
                    })
                }
                this.classList.toggle( "rightArr" );
                this.classList.toggle( "downArr" );
                handel.creatNav( this.getAttribute("idNum") );
                handel.creatFolder( this.getAttribute("idNum") );
            }
        }
    },
    creatNav:function( idNum ){
        var arr = [];
        //如果存在
        fn( idNum );
        function fn( idNum){
            arr.unshift({
                    "name":handel.getById( idNum ).name,
                    "id":handel.getById( idNum ).id
                }
            );
            if( handel.getById( handel.getById( idNum ).pid ) ){
                fn( handel.getById( idNum ).pid );
            }
        }
        var str = arr.map(function(item){
            return "<span idNum='"+ item.id +"'>"+ item.name +"</span>";
        }).join(" > ");
        document.getElementById("nav").innerHTML = str;
        document.querySelectorAll("#nav span").forEach(function(item){
            item.onclick = function(){
                handel.creatFolder( this.getAttribute( "idNum" ) );
                handel.creatNav( this.getAttribute( "idNum" ) );
            }
        })
    },
    //根据data生成初始文件夹
    creatFolder:function( idNum ){//生成文件夹
        var arr = data.filter(function(item){
            return item.pid == idNum;
        });//查找所有pid为idNum的数据
        var str = "";
        arr.forEach(function( item ){
            str += "<li idNum='"+ item.id +"'><img class=\"file\" src=\"img/file.png\" /><span>"+ item.name +"</span><input type='text' /></li>";
        })
        document.getElementById("content").innerHTML = str;
        document.querySelectorAll("#content li").forEach(function(item){
            item.ondblclick = function(){
                var idNum = this.getAttribute( "idNum" );
                handel.creatFolder( idNum );
                handel.creatNav( idNum );
                handel.openPath( idNum );
                handel.now = idNum;
            }
            item.onclick = function(ev){
                if( !ev.ctrlKey ){//单选
                    var that = this;
                    document.querySelectorAll("#content li").forEach(function(item){
                        if( item != that ){
                            item.classList.remove( "active" );
                        }
                    })
                }
                this.classList.toggle( "active" );
            }
            item.children[2].onclick = function(ev){
                ev.cancelBubble = true;
            }
            item.children[1].onclick = function(ev){
                item.classList.add( "edit" );
                item.children[2].focus();
                item.children[2].value = item.children[1].innerHTML;
                ev.cancelBubble = true;
            }
            item.children[2].onblur = function(){
                var newValue = item.children[2].value;
                var thisData = handel.getById(item.getAttribute("idNum"));
                if( handel.checkName(thisData.id, newValue, thisData.pid) ){
                    alert("文件夹已存在");
                }else{
                    item.classList.remove( "edit" );
                    item.children[1].innerHTML = newValue;
                    thisData.name = newValue;
                    handel.creatTree();
                    handel.openPath(thisData.pid);
                }
            }
        })
    },
    //文件夹展开
    openPath:function( nowId ){//打开左侧树状菜单的路径
        fn( nowId );
        function fn( nowId ){
            var el = document.querySelectorAll(".leftList h5[idNum='"+ nowId +"']")[0];
            //根据传入的nowId 修改对应元素的箭头状态(右箭头变成下箭头)
            if( el.classList.contains( "rightArr" ) ){
                el.classList.remove( "rightArr" );
                el.classList.add( "downArr" );
            }
//			如果 存在 以当前元素的pid为id 的数据(存在父级)
            if( handel.getById( handel.getById( nowId ).pid ) ){
                handel.openPath( handel.getById( nowId ).pid );//以父级的id作为参数打开上一级路径
            }
        }
    },
    //检测重命名,pid的文件夹下,检测newName是否已经存在
//		如果存在返回true
//		不存在返回false
    checkName:function(id, newName, pid){
        var tempData = handel.getByPid(pid).filter(function(item){
            return item.id != id;
        });//筛除自己
        return tempData.some(function(item){
            return item.name == newName;
        })
    },

    addDocumentEvent:function(){
        document.onclick = function( ev ){
            if( ev.target.id == "content"){
                document.querySelectorAll("#content .active").forEach(function(item){
                    item.classList.remove("active");
                })
            }
        }
        //框选文件夹
        document.getElementById("content").onmousedown = function(ev){
            var content = document.getElementById("content");
            if( ev.target.id == "content" ){//画框
                var rect = document.createElement("li");
                rect.className = "rect";
                content.appendChild( rect );
                var ori = {
                    x:ev.clientX,
                    y:ev.clientY
                }
                document.onmousemove = function(ev){
                    rect.style.cssText = "width:"+ Math.abs( ev.clientX-ori.x)+"px;height: "+ Math.abs( ev.clientY-ori.y)+"px;left:"+ (Math.min( ev.clientX,ori.x )-content.offsetLeft-10) +"px;top:"+ (Math.min( ev.clientY,ori.y )-content.offsetTop-10) +"px";
                    // console.log(ev.clientX)
                    // console.log(ev.clientY)
                    // console.log(ori.x)
                    // console.log(ori.y)
                    var lis = document.querySelectorAll("#content .item");
                    lis.forEach(function(item){
                        var rectPos = rect.getBoundingClientRect();
                        var itemPos = item.getBoundingClientRect();
                        if( rectPos.right < itemPos.left || rectPos.left > itemPos.right || rectPos.bottom < itemPos.top || rectPos.top > itemPos.bottom ){
                            item.classList.remove( "active" );
                        }else{
                            item.classList.add( "active" );
                        }
                    });
                    return false;
                }
                document.onmouseup = function(){
                    content.removeChild( rect );
                    document.onmousemove = document.onmouseup = null;
                }
            }else if( ev.target.classList.contains("active") ){//移动文件夹
                var badge = document.createElement("li");
                badge.className = "badge";
                var selEl = document.querySelectorAll("#content .active")//选中的元素
                badge.innerHTML = selEl.length;
                document.onmousemove = function(ev){
                    content.appendChild( badge );
                    badge.style.left = ev.clientX - content.offsetLeft - 25 + "px";
                    badge.style.top = ev.clientY - content.offsetTop - 25 + "px";
                    var otherLi = document.querySelectorAll("#content .item:not(.active)");
                    otherLi.forEach(function(item){
                        var pos = item.getBoundingClientRect();
                        if( ev.clientX < pos.right && ev.clientX > pos.left && ev.clientY > pos.top && ev.clientY < pos.bottom ){
                            item.classList.add("goInTo");
                        }else{
                            item.classList.remove("goInTo");
                        }
                    })
                }
                document.onmouseup = function(){
                    var target = document.querySelector("#content .goInTo");
                    if( target ){//进行移动
                        var targetId = target.getAttribute("idNum");
//							console.log( selEl );
                        var targetName = Array.from(handel.getByPid(targetId)).map(function(item){
                            return item.name;
                        })//目标文件夹下的所有文件名
                        console.log( targetName );
                        var selElName = Array.from(selEl).map(function(item){
                            return item.children[1].innerHTML;
                        }) //要移动的文件 名字
                        console.log( selElName );
                        if(targetName.concat(selElName).length == new Set(targetName.concat(selElName)).size){//如果目标文件夹中和要移动的文件夹没有重复的名字
                            Array.from(selEl).map(function(item){
                                return handel.getById(item.getAttribute("idNum"));
                            }).forEach(function(item){
                                item.pid = targetId;
                            })
                            handel.creatFolder( handel.now );
                            handel.creatTree();
                            handel.openPath(handel.now);
                        }else{
                            alert("文件夹已存在");
                            content.removeChild(badge);
                        }
                    }else{
                        if( document.querySelector("#content .badge") ){
                            content.removeChild(badge);
                        }
                    }
                    document.onmousemove = document.onmouseup = null;
                }
            }
        }
    },
    //新建文件夹
    addFolder:function(){
        handel.maxId ++ ;
        var tempData = {
            "id":handel.maxId,
            "name":"新建文件夹",
            "pid":handel.now
        }
        data.push( tempData );
        handel.creatFolder( handel.now );
        handel.creatTree();
        handel.openPath( handel.now );
        var kids = document.getElementById("content").children;
        kids[kids.length-1].classList.add( "edit" );
        kids[kids.length-1].children[2].value = "新建文件夹";
        kids[kids.length-1].children[2].focus();
    },
    //删除文件夹
    delFolder:function(){
        var delFolder = document.querySelectorAll("#content .active");
        var delId = [];
        delFolder.forEach(function( item ){//删文件夹
            delId.push( item.getAttribute("idNum") );
            item.parentNode.removeChild( item );
        })
        var deepID = [];
        delId.forEach(function(item){
            var delH5 = document.querySelectorAll(".leftList h5[idnum='"+ item +"']");
            delH5.forEach(function(item){
                if( item.nextElementSibling ){
                    deepID = deepID.concat( Array.from( item.nextElementSibling.querySelectorAll("h5") ).map(function(item){//遍历ul内部的所有h5(获取他们身上的idNum)
                        return item.getAttribute("idNum") ;
                    }) );
                    item.parentNode.removeChild( item.nextElementSibling );//删除h5后面的ul
                }
                item.parentNode.removeChild( item );//删除h5
            })
        })
        delId = delId.concat(deepID);
        data = data.filter(function(item){
            return delId.indexOf(item.id+"") == -1;
        })
        handel.creatFolder(handel.now);
        handel.creatTree();
        handel.openPath(handel.now);
    },
    rigthclick:function(){
        var menu = document.getElementById("menu");
        document.oncontextmenu = function(e) {
            var e = e || window.event;
            //鼠标点的坐标
            var oX = e.clientX;
            var oY = e.clientY;
            //菜单出现后的位置
            menu.style.display = "block";
            menu.style.left = oX + "px";
            menu.style.top = oY + "px";
            //阻止浏览器默认事件
            return false;//一般点击右键会出现浏览器默认的右键菜单，写了这句代码就可以阻止该默认事件。
        }
        document.onclick = function(e) {
            var e = e || window.event;
            menu.style.display = "none"
        }
        menu.onclick = function(e) {
            var e = e || window.event;
            e.cancelBubble = true;
        }
        document.addEventListener("contextmenu",function(e){
            var e = e || window.event;
            e.preventDefault();
            alert("menu");
        },false)
    }
}
