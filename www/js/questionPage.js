$(document).ready(function () {
    $("#listview li").bind("click", function () {
        alert("ok" + $("#listview li").text());
        // $.ajax({
        //     type: "get",
        //     url: "http://192.168.0.104:8080/ProblemSolvingAPP/getAllAnswer",
        //     data: {
        //         method: $('#method').val(),
        //         id: $('#id').val(),
        //     },
        //     datatype: "jsonp",
        //     success: onSuccess,
        //     error: onError
        // });
        // return false;
    });

});