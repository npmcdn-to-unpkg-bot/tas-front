$(function() {
	$('#loginBtn').click(function() {
		var username = $('#username').val();
		var password = $('#password').val();

		var data = {
			username: username,
			password: password
		}

		$.ajax({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/user/login',
			data: data,
			success: function(data) {
				console.log(data);
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
			content: $('.main-content').val(),
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
        evt.stopPropagation();
        evt.preventDefault();
        $dropZone.addClass('dragOver');
        $('.say-zone').css('visibility', 'hidden');
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    function handleFileSelect(evt) {

        evt.stopPropagation();
        evt.preventDefault();
        $('.say-zone').css('visibility', 'visible');

        $dropZone.removeClass('dragOver');

    }

    function handleDragLeave(evt){
        evt.stopPropagation();
        evt.preventDefault();
        $('.say-zone').css('visibility', 'visible');

        $dropZone.removeClass('dragOver');
    }
   
   	//drop upload image
	var dropZone = document.getElementById('dropZone');
	var $dropZone = $('#dropZone');

	dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('dragleave', handleDragLeave, false);
    dropZone.addEventListener('drop', handleFileSelect, false);

    //upVote 
    $('body').on('click', '.like-0 .up-vote', function() {
    	console.log('lll');
    	var data = {
    		uuid: $(this).parents('.tas-item').data('id'),
    		token: localStorage.getItem('token')
    	};
    	$.ajax({
    		method: 'POST',
    		data: data,
    		url: 'http://localhost:3000/api/v1/upVote/item',
    		success: function(data) {
    			console.log(data);
    			console.log('success');
    		},
    		error: function(err) {
    			console.log(error);
    			console.log('error');
    		}
    	});
    });

    //downVote 
    $('body').on('click', '.like-0 .down-vote', function() {
    	var data = {
    		uuid: $(this).parents('.tas-item').data('id'),
    		token: localStorage.getItem('token')
    	};
    	$.ajax({
    		method: 'POST',
    		data: data,
    		url: 'http://localhost:3000/api/v1/downVote/item',
    		success: function(data) {
    			console.log(data);
    			console.log('success');
    		},
    		error: function(err) {
    			console.log(error);
    			console.log('error');
    		}
    	});
    });

});