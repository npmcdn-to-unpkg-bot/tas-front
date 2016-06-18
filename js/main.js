$(function() {

	$('.close-btn i').click(function() {
		$('.dialog-wrap, .dialog-bg').remove();
	});

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
					localStorage.setItem('userInfo', JSON.stringify(data.data));
					window.location.reload();
					// $('.dialog-wrap, .dialog-bg').remove();
					// $('.login-btn').off('click').text(data.data.username);
				} else {
					var html = '<div class="login-err">用户名或密码错误</div>';
					$('.login-sub').before(html);
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
		url: 'http://localhost:3000/api/v1/read/item?tk=' + localStorage.getItem('token'),
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
		var source = '{{each data as value index}}'
						+ '<li class="tas-item like-{{value.isUp + value.isDown}}" data-id={{value.uuid}}>'
							+ '<div class="main">'
								+ '<div class="main-header">'
									+ '{{value.u_name}}'
								+ '</div>'
								+ '<div class="main-vote">'
									+ '<div class="up-vote up-{{value.isUp}}"><span class="up-num">{{value.up}}</span>点头</div>'
									+ '<div class="down-vote down-{{value.isDown}}"><span class="down-num">{{value.down}}</span>摇头</div>'
									+ '<div class="clear"></div>'
								+ '</div>'
								+ '<div class="main-content">'
									+ '{{if value.type == "image"}}'
										+ '<img class="item-image" src="{{value.url}}">'
									+ '{{else}}'
										+ '{{value.content}}'
									+ '{{/if}}'
								+ '</div>'
								+ '<div class="main-footer">'
									+ '<div class="time">'
										+ '{{value.time | dateFormat:"yyyy/MM/dd  hh:mm"}}'
									+ '</div>'
								+ '</div>'
							+ '</div>'
						+ '</li>'
					+'{{/each}}';
		var render = template.compile(source);
		var html = render(data);
		document.getElementById('tasGroup').innerHTML = html;
		// setHeight();

		$('.tas-group').masonry({
	    	itemSelector: '.tas-item',
	    	columnWidth: 240,
	    	gutter: 10,

	    	isAnimated: true
	    });
		// var html = template('item', data);
		// document.getElementById('tasGroup').innerHTML = html;

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

    //render height
    function setHeight() {
    	var $item = $('.tas-item');

	    for(var i = 4; i < $item.length; i++) {
	    	console.log(i);
	    	$item.eq(i).css('top', $item.eq(i-4).outerHeight() + 110 );
	    }    	
    }

    function　initData() {
    	var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
    	if(userInfo && userInfo.username) {
    		$('.login-btn').text(userInfo.username);
    		$('.login-btn').off('click');
    	} else {
    		$('body').on('click', '.login-btn', function() {
				$('.dialog-bg').show();
				$('.dialog-wrap').css('display','flex');
			});
    	}
    }

    initData();

    /**
	 * 登录注册操作
	 */
	 $('.toggle-tip').click(function() {

	 	if($(this).data('login') == 1) {
	    	$('.toggle-tip').data('login', 0);

	    	$('.login-wrap').hide();
	    	$('.register-wrap').show();
	    	$(this).text('已有账号，登录');
	 	} else {
	    	$('.toggle-tip').data('login', 1);
	    	$('.register-wrap').hide();
	 		$('.login-wrap').show();
	    	$(this).text('立即注册');	
	 	}
	 })

	 //注册数据　
	$('#RegisterBtn').click(function() {
		var username = $('#RUsername').val();
		var password = $('#RPassword').val();
		var email = $('#REmail').val();

		var data = {
			username: username,
			password: password,
			email: email
		};

		$.ajax({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/user/register',
			data: data,
			success: function(data) {
				console.log(data);
				if(data.code === 200) {
					$('.login-item').remove();
					localStorage.setItem('token', data.token);
					localStorage.setItem('userInfo', JSON.stringify(data.data));
					// window.location.reload();
					// $('.dialog-wrap, .dialog-bg').remove();
					// $('.login-btn').off('click').text(data.data.username);
				} else {
					var html = '<div class="login-err">用户名或密码错误</div>';
					$('.login-sub').before(html);
				}
			},
			error: function(err) {
				console.log(err);
			}
		})
	});


});