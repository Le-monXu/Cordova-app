document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    $(document).ready(function () {
        $.ajax({
            type: "get",
            url: "http://192.168.0.104:8080/ProblemSolvingAPP/getQuestionsByUid",
            data: {
                uid: localStorage.getItem("uid")
            },
            datatype: "jsonp",
            success: getQuestionsByUidSuccess,
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

        $("#submitQuestion").bind("click", function () {
            if ($('#answerTitle').val() == "") {
                alert("请输入问题标题！")
            } else if ($('#answerType').val() == "") {
                alert("请输入问题类别！")
            } else if ($('#answerDescribe').val() == "") {
                alert("请输入问题描述！")
            } else {
                // 上传问题
                $.ajax({
                    type: "get",
                    url: "http://192.168.0.104:8080/ProblemSolvingAPP/addQuestion",
                    data: {
                        uid: localStorage.getItem("uid"),
                        content: $('#answerTitle').val(),
                        category: $('#answerType').val(),
                        describe: $('#answerDescribe').val(),
                    },
                    datatype: "jsonp",
                    success: function (data) {
                        data = $.trim(data); //去掉前后空格
                        console.log("newQid:" + data);
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

//使用FileTransfer插件，上传文件
function upload(fileURL, qid) {
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
    var SERVER = "http://192.168.0.104:8080/ProblemSolvingAPP/uploadFile?method=qid&id=" + qid;
    ft.upload(fileURL, encodeURI(SERVER), success, fail, options);
}

// 显示问题
function getQuestionsByUidSuccess(data) {
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