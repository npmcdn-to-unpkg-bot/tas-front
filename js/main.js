$(function() {
	$('#loginBtn').click(function() {
		var username = $('#username').val();
		var password = $('#password').val();

		var data = {
			username: username,
			password: password
		}
		console.log(data);

		$.ajax({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/user/login',
			data: data,
			success: function(data) {
				if(data.code === 200) {
					$('.login-item').remove();
					localStorage.setItem('token', data.token);
					$('.login-name').text(data.data.username);
				}
			},
			error: function(err) {
				console.log(err);
			}
		})
	});

	//say 
	$('.send').click(function() {
		var data = {
			content: $('.say-zone').val(),
			token: localStorage.getItem('token')
		};

		$.ajax({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/say/item',
			data: data,
			success: function(data) {
				console.log('success');
			},
			error: function(err) {
				console.log('error');
			}
		})
	});// end say

	//read 
	$.ajax({
		method: 'GET',
		url: 'http://localhost:3000/api/v1/read/item',
		success: function(data) {
			console.log(data);
			renderData(data);
		},
		error: function(err) {
			console.log(err);
		}
	});

	//render items
	//el ID
	function renderData(data) {
		var html = template('item', data);
		document.getElementById('tasGroup').innerHTML = html;
	}

    function handleDragOver(evt) {
    	// alert('test');
        evt.stopPropagation();
        evt.preventDefault();

        $dropZone.addClass('dragOver');
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }


    function handleFileSelect(evt) {

        evt.stopPropagation();
        evt.preventDefault();

        $dropZone.removeClass('dragOver');

        var files = evt.dataTransfer.files;
        var new_file;

        if(Qiniu_isUploading){
            notice('error', '还有没上传完的 :)', 2000);
            return;
        }

        if(files && files.length > 1){
            notice('error', '一次只上传一个文件就可以 :)', 2000);
            return;
        }

        if(files && files.length > 0){
            for (var i = 0; file = files[i]; i++) {

                //判断文件类型
                if(!file.type || $.inArray(file.type, allowedfiletypes) < 0) {
                    notice('error', '唉，上传图片才可以啊', 2000);
                    return;
                }

                //判断文件大小

                if(file.size > 2000000) {
                    notice('error', '艾玛！文件太大了！减减肥，要小于2M才可以。', 2000);
                    return;
                }

                // 判断是否正在上传、或者有上传完成但未发布的图片
                if($('#imagePreview').size() > 0){
                    notice('error', '别着急，一个一个来', 2000)
                    return;
                }

                var extra = new Object();
                var key = file.name.replace(/[ ]/g, "");
                var time = new Date().getTime();

                extra.key = base64encode(key) + '_' + time;

                new_file = file;

                $('#upimg').fadeIn().css({
                    'background':'#fff',
                });

                var reader = new FileReader();

                reader.onload = (function(theFile) {
                    return function(e) {
                        // Render thumbnail.
                        var div = document.createElement('div');
                        div.setAttribute('id', 'imageThumb')
                        div.setAttribute('style', 'background:url('+ e.target.result +') center center no-repeat;background-size:cover;')
                        document.getElementById('upimg').insertBefore(div, null);
                    };
                })(file);

                reader.readAsDataURL(file);

            }
        }
    }


    function handleDragLeave(evt){
        console.log('鼠标移开');
        evt.stopPropagation();
        evt.preventDefault();

        $dropZone.removeClass('dragOver');
    }

    	//drop upload image
	var dropZone = document.getElementById('dropZone');
	var $dropZone = $('#dropZone');

	dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('dragleave', handleDragLeave, false);
    dropZone.addEventListener('drop', handleFileSelect, false);

})