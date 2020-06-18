var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // deviceready Event Handler
    onDeviceReady: function () {
        this.receivedEvent();
    },
    // get DOM
    $$: function (id) {
        return document.getElementById(id);
    },
    receivedEvent: function () {
        var _this = this;
        var dlDom = this.$$('download');
        dlDom.onclick = function () {
            _this.createFilePath();
        }
    },

    // 创建文件路径
    createFilePath: function () {
        var _this = this;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            fs.root.getFile("downloadedImage.png", {
                create: true,
                exclusive: false
            }, function (fileEntry) {
                console.log(fileEntry);
                //调用fileTransfer插件，下载图片
                _this.downLoadImg(fileEntry.nativeURL);

            }, function (err) {
                console.log(err);
            });
        }, function (error) {
            console.log(error);
        });
    },
    // fileTransfer plugin
    downLoadImg: function (fileURL) {
        var _this = this;
        // 初始化FileTransfer对象
        var fileTransfer = new FileTransfer();
        // 服务器下载地址
        var uri = encodeURI("http://192.168.0.104:8080/ProblemSolvingAPP/downloadFile?filename=0c3041cf06e344419195282daf9d599a_b50fc9d1873b01bd4f0b6182247c6420.png");
        // 调用download方法
        fileTransfer.download(
            uri, //uri网络下载路径
            fileURL, //url本地存储路径
            function (entry) {
                console.log("download complete: " + entry.toURL());
                _this.$$('myImage1').src = entry.toURL();
            },
            function (error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code" + error.code);
            }
        );
    }
};

app.initialize();