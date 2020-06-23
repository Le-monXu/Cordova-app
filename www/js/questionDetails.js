document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    $(document).ready(function () {
        console.log("uid" + localStorage.getItem("uid"));
        console.log("qid" + localStorage.getItem("qid"));
        $.ajax({
            type: "get",
            url: "http://192.168.0.104:8080/ProblemSolvingAPP/getAQuestion",
            data: {
                qid: localStorage.getItem("qid"),
            },
            datatype: "jsonp",
            success: getAQuestionSuccess,
            error: onError
        });
        $.ajax({
            type: "get",
            url: "http://192.168.0.104:8080/ProblemSolvingAPP/getAllAnswer",
            data: {
                // 从问题
                method: "qid",
                id: localStorage.getItem("qid"),
            },
            datatype: "jsonp",
            success: getAllAnswerSuccess,
            error: onError
        });

        $("#addPhoto").bind("click", function () {
            navigator.camera.getPicture(function (imageURI) {
                imageURI = imageURI.split("?")[0];
                console.log(imageURI)
                $('#imgPath').val(imageURI);
            }, function (message) {
                alert('Failed because: ' + message);
            }, {
                quality: 50, // 相片质量是50
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM, // 设置从图片库获取
                destinationType: Camera.DestinationType.FILE_URI // 以文件路径返回
            });

        });

        $("#submitAnswer").bind("click", function () {
            if ($('#myAnswer').val() == "") {
                alert("请输入回答！")
            } else {
                // 上传answer
                $.ajax({
                    type: "get",
                    url: "http://192.168.0.104:8080/ProblemSolvingAPP/addAnswer",
                    data: {
                        uid: localStorage.getItem("uid"),
                        qid: localStorage.getItem("qid"),
                        answer: $('#myAnswer').val()
                    },
                    datatype: "jsonp",
                    success: function (data) {
                        data = $.trim(data); //去掉前后空格
                        console.log("newAid:" + data);
                        if ($('#imgPath').val() != "") {
                            upload($('#imgPath').val(), data);
                        } else {
                            location.reload();
                        }
                    },
                    error: function (error) {
                        alert(error);
                    }
                });
            }
            return false;
        });
    });
}

//显示问题
function getAQuestionSuccess(data, status) {
    data = $.trim(data); //去掉前后空格
    data = JSON.parse(data);
    var row = "";
    row = row + '<h2 class="display-6 ">' + data.content + '</h2>' +
        '<p>提问者：' + data.uid + '&ensp;&ensp;&ensp;问题分类：' + data.category + "<br>" +
        '问题详情：' + data.describe + '</p>';
    if (data.location != null) {
        row = row + '  <img src="http://192.168.0.104:8080/ProblemSolvingAPP/downloadFile?filename=' + data.location + '" class="figure-img img-fluid rounded">';
    }
    row = row + '<a class="btn btn-primary btn-sm" href="#myAnswer" role="button">我来回答</a>';
    $(".jumbotron").append(row);
}

// 显示答案
function getAllAnswerSuccess(data, status) {
    data = $.trim(data); //去掉前后空格
    data = JSON.parse(data);
    // 遍历返回的数据
    // var list = "";
    for (i = 0; i < data.length; i++) {
        // 格式化输出
        var row = "<div class=\"row card mt-3 mb-3 ml-0 mr-0 shadow\">" +
            "<div class=\"col\">";
        // 判断是否有图片
        if (data[i].location != "null") {
            // getImg(data[i].location);
            row = row + "<img src=\"http://192.168.0.104:8080/ProblemSolvingAPP/downloadFile?filename=" + data[i].location + "\" class=\"card-img-top\"></img>";
            // localStorage.removeItem(data[i].location);
            // row = row + "<img src=\"" + img + "\" class=\"card-img-top\"></img>";
        }
        row = row + "<div class=\"card-body\">" +
            "<h5 class=\"card-title\">" + data[i].uid + "</h5>" +
            "<p class=\"mb-0\">" + data[i].answer + "</p>" +
            "<span class=\"badge badge-primary\">回答得分：" +
            data[i].score + "&ensp;&ensp;&ensp;点赞数：" + data[i].support + "</span>";
        // 判断是否评论过
        $.ajax({
            type: "get",
            // 关闭异步，重点！解决图像绘制失败的问题！
            async: false,
            url: "http://192.168.0.104:8080/ProblemSolvingAPP/checkIsGrading",
            data: {
                uid: localStorage.getItem("uid"),
                aid: data[i].aid,
            },
            datatype: "jsonp",
            success: function (grading) {
                grading = $.trim(grading); //去掉前后空格
                if (grading == "false") {
                    row = row + "<a href=\"#addGrading_" + data[i].aid + "\" data-toggle=\"collapse\" aria-expanded=\"false\" " +
                        "aria-controls=\"collapseExample\" class=\"badge badge-primary\">我要评分</a>" +
                        "<div class=\"collapse\" id=\"addGrading_" + data[i].aid + "\">" +
                        "<div class=\"card card-body\">" +
                        "<form>" +
                        "<div class=\"form-group\">" +
                        "<label for=\"grading\">评分</label>" +
                        "<select class=\"form-control  mb-2\" id=\"score_" + data[i].aid + "\" name=\"score\">" +
                        "<option value=\"1\">1</option>" +
                        "<option value=\"2\">2</option>" +
                        "<option value=\"3\">3</option>" +
                        "<option value=\"4\">4</option>" +
                        "<option value=\"5\" selected>5</option>" +
                        "</select>" +
                        "<label for=\"isSupport\">点赞</label>" +
                        "<select class=\"form-control\" id=\"isSupport_" + data[i].aid + "\" name=\"isSupport\">" +
                        "<option value=\"1\" selected>点赞</option>" +
                        "<option value=\"0\">不点赞</option>" +
                        "</select>" +
                        "</div>" +
                        "<button type=\"button\" class=\"btn btn-primary  btn-block mb-2\" onclick=\"addGrading(" + data[i].aid + ");\">提交</button>" +
                        "</form>" +
                        "</div>" +
                        "</div>";
                } else {
                    grading = JSON.parse(grading)
                    console.log("grading:" + grading)
                    row = row + "<span class=\"badge badge-primary\">我的评分：" + grading.score + "&ensp;&ensp;&ensp;点赞：" + grading.support + "</span>";
                }
            },
            error: function (errorInfo) {
                alert(errorInfo);
            }
        });
        row = row + "</div>" + "</div>" + "</div>";
        // 插入到页面中
        $(".container").append(row);
    }
}

function onError(data, status) {
    //进行错误处理 
    console.info("网络出错");
}

function downloadImg(location) {
    createFilePath(location);
}

//创建文件路径
function createFilePath(location) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        fs.root.getFile(location, {
            create: true,
            exclusive: false
        }, function (fileEntry) {
            console.log(fileEntry);
            //调用fileTransfer插件，下载图片
            downLoadImg(fileEntry.nativeURL, location);
        }, function (err) {
            console.log(err);
        });
    }, function (error) {
        console.log(error);
    });
};

// fileTransfer plugin
function downLoadImg(fileURL, location) {
    // 初始化FileTransfer对象
    var fileTransfer = new FileTransfer();
    // 服务器下载地址
    var uri = encodeURI("http://192.168.0.104:8080/ProblemSolvingAPP/downloadFile?filename=" + location);
    // 调用download方法
    fileTransfer.download(
        uri, //uri网络下载路径
        fileURL, //url本地存储路径
        function (entry) {
            console.log("download complete: " + entry.toURL());
            // 返回图片 src
            localStorage.setItem(location, entry.toURL());
        },
        function (error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
        }
    );
};

//使用FileTransfer插件，上传文件
function upload(fileURL, aid) {
    //上传成功
    var success = function (r) {
        location.reload();
        // alert("上传成功! Code = " + r.responseCode);
    }
    //上传失败
    var fail = function (error) {
        alert("上传失败! Code = " + error.code);
    }

    var options = new FileUploadOptions();
    options.fileKey = "file1";
    console.log("fileURL:" + fileURL)
    options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
    //options.mimeType = "text/plain";

    // //上传参数
    // var params = {};
    // params.aid = "24";
    // params.value2 = "hello";
    // options.params = params;

    var ft = new FileTransfer();
    //上传地址
    var SERVER = "http://192.168.0.104:8080/ProblemSolvingAPP/uploadFile?method=aid&id=" + aid;
    ft.upload(fileURL, encodeURI(SERVER), success, fail, options);
}

function addGrading(aid) {
    addGrading_score = $("#score_" + aid).val();
    addGrading_isSupport = $("#isSupport_" + aid).val();
    console.log(aid + ":" + addGrading_score + ":" + addGrading_isSupport);
    $.ajax({
        type: "get",
        url: "http://192.168.0.104:8080/ProblemSolvingAPP/addGrading",
        data: {
            uid: localStorage.getItem("uid"),
            aid: aid,
            score: addGrading_score,
            isSupport: addGrading_isSupport
        },
        datatype: "jsonp",
        success: function (data) {
            data = $.trim(data); //去掉前后空格
            console.log("addGrading:" + data);
            location.reload();
        },
        error: function (error) {
            alert(error);
        }
    });
}