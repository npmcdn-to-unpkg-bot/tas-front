// http://blog.codebusters.pl/en/images-height-and-position-problem-masonry-isotope/
$(window).load(function() {

	var BaseUrl = 'http://polande.com:3000';

	$('.close-btn i').click(function() {
		$('.dialog-wrap, .dialog-bg').hide();
	});

	$('#loginBtn').click(function() {
		var username = $('#username').val();
		var password = $('#password').val();

		var data = {
			username: username,
			password: password
		};

		$.ajax({
			method: 'POST',
			url: BaseUrl + '/api/v1/user/login',
			data: data,
			success: function(data) {
				console.log(data);
				if(data.code === 200) {
					$('.login-item').remove();
					localStorage.setItem('token', data.token);
					localStorage.setItem('userInfo', JSON.stringify(data.data));
					window.location.reload();
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

	//check is login
	// only front end
	function isLogin() {
    	var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
    	var token = window.localStorage.getItem('token');

    	if(userInfo && userInfo.username && token) {
    		return true;
    	} else {
    		return false;
    	}
	}
	//say
	$('.send').click(function() {
		if(!isLogin()) {
			$('.login-btn').trigger('click');
			return false;
		}

		var data = {
			content: $.trim($('.main-content').val()),
			token: localStorage.getItem('token')
		};

		if(data.content.length < 5) {
			toast('至少五个字');
			return false;
		}

		$.ajax({
			method: 'POST',
			url: BaseUrl + '/api/v1/say/item',
			data: data,
			success: function(data) {
				if(data.code == 200) {
					window.location.reload();
				}
				console.log('success');
			},
			error: function(err) {
				console.log('error');
			}
		})
	});// end say

	//render items
	//el ID
	function renderData(data) {
		var source = '{{each data as value index}}'
						+ '<li class="tas-item like-{{value.isUp + value.isDown}}" data-tk="{{value.token}}" data-id="{{value.uuid}}">'
							+ '<div class="main">'
								+ '<div class="main-header">'
									+ '{{value.u_name}}'
								+ '</div>'
								+ '<div class="main-vote">'
									+ '<div class="up-vote up-{{value.isUp}}"><span class="up-num">{{value.up}}</span>点头</div>'
									+ '<div class="down-vote down-{{value.isDown}}"><span class="down-num">{{value.down}}</span>摇头</div>'
									+ '<div class="clear"></div>'
								+ '</div>'
								+ '<div class="main-content" data-url="{{value.url}}">'
									+ '{{if value.type == "image"}}'
										+ '<img class="item-image" src="{{value.url}}">'
									+ '{{ else if value.type == "url" }}'
										+ '<a href="{{value.url}}" class="item-url">{{value.title}} <i class="fa fa-link" aria-hidden="true"></i></a>'
									+ '{{ else if value.type == "taobao"}}'
										+ '<a href="{{value.url}}"> <img class="item-image" src="http:{{value.cover_img}}"></a>'
										+ '<a href="{{value.url}}" class="goods-title" title="{{value.title}}">{{value.title}}</a>'
										+ '<div class="goods-price">'
											+ '￥{{value.price}}'
											+ '<div class="goods-ref">淘宝</div>'
										+ '</div>'
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

		$('.tas-item').hammer().on('press', function(event) {
			var $that = $(this);

			$that.addClass('animate');
			deleteItem($that);

		})

	}

	$(document).keyup(function(e) {
	  	if (e.keyCode === 27) { //esc
	  		$('.tas-item').removeClass('animate');
	 	}
	});

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        $dropZone.addClass('dragOver');
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }

    function handleDragLeave(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        // $('.say-zone').css('visibility', 'visible');

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
    	if(!isLogin()) {
			$('.login-btn').trigger('click');
			return false;
		}
    	var data = {
    		uuid: $(this).parents('.tas-item').data('id'),
    		token: localStorage.getItem('token')
    	};
    	$.ajax({
    		method: 'POST',
    		data: data,
    		url: BaseUrl + '/api/v1/upVote/item',
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
    	if(!isLogin()) {
			$('.login-btn').trigger('click');
			return false;
		}
    	var data = {
    		uuid: $(this).parents('.tas-item').data('id'),
    		token: localStorage.getItem('token')
    	};
    	$.ajax({
    		method: 'POST',
    		data: data,
    		url: BaseUrl + '/api/v1/downVote/item',
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
	    	$item.eq(i).css('top', $item.eq(i-4).outerHeight() + 110 );
	    }
    }

    function　initData() {
    	var userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
    	if(userInfo && userInfo.username) {
    		$('.login-btn').text(userInfo.username);
    	} else {
    		$('body').on('click', '.login-btn', function() {
				$('.dialog-bg').show();
				$('.dialog-wrap').css('display','flex');
			});
    	}
    }

    initData();	
	pagination();

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
		var username = $.trim($('#RUsername').val());
		var password = $.trim($('#RPassword').val());
		var email = $.trim($('#REmail').val());

		if(username.length < 3) {
			toast('user name 3 length');
			return false;
		}
		if(password.length < 6) {
			toast('password must 6 length');
			return false;
		}
		var mailReg = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/;
		if(!mailReg.test(email)) {
			toast('input right email');
			return false;
		}

		var data = {
			username: username,
			password: password,
			email: email
		};

		$.ajax({
			method: 'POST',
			url: BaseUrl + '/api/v1/user/register',
			data: data,
			success: function(data) {
				console.log(data);
				if(data.code === 200) {
					$('.login-item').remove();
					localStorage.setItem('token', data.token);
					localStorage.setItem('userInfo', JSON.stringify(data.data));
					window.location.reload();
				} else {
					$('.login-err').remove();
					var html = '<div class="login-err">' + data.msg + '</div>';
					$('.register-sub').before(html);
				}
			},
			error: function(err) {
				console.log(err);
			}
		})
	});

	//删除操作
	function deleteItem($that) {
		layer.confirm('你确定要删除？', {
			  btn: ['取消','删除'] //按钮
			}, function() {
				layer.close(1);
				$that.removeClass('animate');
			}, function() {
				data = {
					u_token: window.localStorage.getItem('token'),
					i_token: $that.data('tk')
				};
				$.ajax({
					url: BaseUrl + '/api/v1/delete/item',
					method: 'POST',
					data: data,
					success: function(data) {
						if(data.code == 200) {
							$that.remove();
							$('.tas-group').masonry();
						} else {
							console.log(data);
						}
					},
					fail: function(err) {
						console.log('delete item error');
					}
				})
			});
	}

	//分页操作
	function pagination(num) {
		if(!num) {
			var num = 0;
			window.localStorage.setItem('currentPage', 0);
		}
		// var num = num || 0;
		var param = 'tk=' + localStorage.getItem('token') + '&num=' + num;
		$.ajax({
			method: 'GET',
			url: BaseUrl + '/api/v1/read/item?' + param,
			success: function(data) {
				renderData(data);
				// http://imagesloaded.desandro.com/
				// 防止图片资源加载问题的高度折叠
				$('.tas-group').imagesLoaded(function () {

					$('.tas-group').masonry().masonry('destroy');
					$('.tas-group').masonry().masonry('remove', '.tas-item');
					$('.tas-group').masonry({
						itemSelector: '.tas-item',
						columnWidth: 240,
						gutter: 10,
						isAnimated: true
					});
				})

			},
			error: function(err) {
				console.log(err);
			}
		})
	}
//common
	function toast(text) {
		layer.msg(text, {
			time: 1500
		}, function() {
			console.log('test');
		});
	}

	// 翻页操作

	$('.next-page').click(function() {
		var currentPage = window.localStorage.getItem('currentPage') || 0;
		var nextPage = parseInt(currentPage) + 1;
		pagination(nextPage);

		window.localStorage.setItem('currentPage', nextPage);
	});

});
