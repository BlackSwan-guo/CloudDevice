handle.state.nowPid=1;
handle.creatTree();
handle.openTree();
handle.showFile();
handle.breadcrumb();
handle.sort();


(function () {  // 文件 大小 图标显示
    var resize=document.querySelector("#tool .rightIcon");
    resize.onclick=function () {
        this.classList.toggle("active");
        if(this.classList.contains("active")){
            handle.state.size=false;  //小图标
        }else {
            handle.state.size=true;  //大图标
        }
        handle.creatTree();
        handle.openTree();
        handle.showFile();
        handle.breadcrumb();
    }
})();
(function () {
    var renameBtn=document.querySelector("#tool div:nth-of-type(4)");
    renameBtn.onclick=handle.btnRename;
})();
(function () { // 新建文件
    var newBtn=document.querySelector("#tool div:nth-of-type(6)");
    newBtn.onclick=handle.newFile;

})();

(function () { // 删除文件
    var removeBtn=document.querySelector("#tool div:nth-of-type(5)");
    removeBtn.onclick=handle.removeFile;

})();
/*
* creatTree
*openTree(handle.state.nowPid)
* breadcrumb(handle.state.nowPid)
* showFile(handle.state.nowPid)
*
* 重命名  如果重名，获得焦点还是使用旧的名字     双击input 将没有效果
* 新建
* 删除
* */

(function () {  //排序方式
    var tool=document.querySelector("#tool");
    var sort=tool.querySelector(".sort");
    var ul=tool.querySelector("ul");
    var lis=ul.querySelectorAll("li");
    sort.onmouseover=function () {
        sort.classList.add("active");
        ul.style.display="block";
    };
    sort.onmouseout=function () {
        sort.classList.remove("active");
        ul.style.display="none";
    };
    ul.onmouseover=function () {
        sort.classList.add("active");
        ul.style.display="block";
    };
    ul.onmouseout=function () {
        sort.classList.remove("active");
        ul.style.display="none";
    };
    lis.forEach(function (item) {
        item.onclick=function () {
            sort.classList.remove("active");
            ul.style.display="none";
        }
    })
})();

/* 右键*/
(function () {
    var file=document.getElementById("file");
    var files=file.querySelector(".files");
    var minFiles=file.querySelector(".min-files");
    var menu=document.querySelector(".menu");
    var menus=menu.querySelectorAll("li");
    var fileRect=file.getBoundingClientRect();
    var w=90,h=136;
    menus.forEach((item,index)=>{
        item.addEventListener("mousedown",function () {
        if(index==0){  // 打开
            setTimeout(handle.btnOpen,100);
        }
        if(index==1){ // 新建
            setTimeout(handle.newFile,100);
        }
        if(index==2){ // 删除
            setTimeout(handle.removeFile,100);
        }
        if(index==3){ // 重命名
            setTimeout(handle.btnRename,100);
        }
    })
})
    file.oncontextmenu=function (e) {
        menu.style.display="none";
        var l=e.clientX,
            t=e.clientY;
        if(e.clientX>fileRect.right-w){
            l=fileRect.right-w;
        }
        if(e.clientY>document.body.getBoundingClientRect().bottom-h){
            t=document.documentElement.getBoundingClientRect().bottom-h;
        }
        menu.style.left=l+"px";
        menu.style.top=t+"px";
        menu.style.display="block";

        return false;
    }
})();


