function onLoad() {
    // alert("ok");
    $(document).ready(function () {
        $.ajax({
            type: "get",
            url: "http://192.168.0.104:8080/ProblemSolvingAPP/getAllQuestion",
            data: {},
            datatype: "jsonp",
            success: getAllQuestionSuccess,
            error: onError
        });
    });
}

// 显示问题
function getAllQuestionSuccess(data) {
    data = $.trim(data); //去掉前后空格
    data = JSON.parse(data)
    // 遍历返回的数据
    // var list = "";
    for (i = 0; i < data.length; i++) {
        var text = "";
        text = text + '<div onclick="JumpToDetail(' + data[i].qid + ');" class="card mt-3 mb-3 ml-0 mr-0 shadow"><div class="card-body"><h5>' + data[i].content + '</h5><p>' + data[i].describe + '</p></div></div>';
        $(".container").append(text);
    }
}

function onError(data) {
    //进行错误处理 
    console.info("网络出错");
}

function JumpToDetail(qid) {
    localStorage.setItem("qid", qid);
    location.href = "questionDetails.html"; //登录成功跳转
}