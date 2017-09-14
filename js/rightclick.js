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