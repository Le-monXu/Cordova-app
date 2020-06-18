var app = {
	initialize: function () {
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	},
	onDeviceReady: function () {
		this.receivedEvent();
	},
	$$: function (id) {
		return document.getElementById(id);
	},
	receivedEvent: function () {
		var getDomLabrary = this.$$('openLabrary');
		var _this = this;
		getDomLabrary.onclick = function () {
			// 打开图片库
			navigator.camera.getPicture(onSuccess, onFail, {
				quality: 50, // 相片质量是50
				sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM, // 设置从图片库获取
				destinationType: Camera.DestinationType.FILE_URI // 以文件路径返回
			});

			function onSuccess(imageURI) {
				imageURI = imageURI.split("?")[0];
				console.log(imageURI)
				_this.$$('myImage').src = imageURI;

				// 上传
				_this.upload(imageURI);
			}

			function onFail(message) {
				alert('Failed because: ' + message);
			}
		}
	},
	//使用FileTransfer插件，上传文件
	upload(fileURL) {
		//上传成功
		var success = function (r) {
			alert("上传成功! Code = " + r.responseCode);
		}
		//上传失败
		var fail = function (error) {
			alert("上传失败! Code = " + error.code);
		}

		var options = new FileUploadOptions();
		options.fileKey = "file1";
		options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
		//options.mimeType = "text/plain";

		// //上传参数
		// var params = {};
		// params.aid = "24";
		// params.value2 = "hello";
		// options.params = params;
		var aid = 24;

		var ft = new FileTransfer();
		//上传地址
		var SERVER = "http://192.168.0.104:8080/ProblemSolvingAPP/uploadFile?aid=" + aid;
		ft.upload(fileURL, encodeURI(SERVER), success, fail, options);
	}
};

app.initialize();