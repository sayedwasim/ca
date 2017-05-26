/*---------- PRELOADER ----------*/
function reveal(){
	// window sizes
	var winsize = { width : window.innerWidth, height : window.innerHeight };
	
	// if animating return
	if( this.isAnimating ) {
		return false;
	}
	this.isAnimating = true;
	
	var widthVal, heightVal, transform;
	var pageDiagonal = Math.sqrt(Math.pow(winsize.width, 2) + Math.pow(winsize.height, 2));
	widthVal = heightVal = pageDiagonal + 'px';
	transform = 'translate3d(-50%,-50%,0) rotate3d(0,0,1,45deg) translate3d(0,' + pageDiagonal + 'px,0)';
	
	var revealerWrapper = document.getElementById("revealer");
	revealerWrapper.style.width = widthVal;
	revealerWrapper.style.height = heightVal;
	revealerWrapper.style.WebkitTransform = revealerWrapper.style.transform = transform;
	revealerWrapper.style.opacity = 1;
	
	setTimeout(function(){revealerWrapper.style.opacity = 0;}, 1600);
	setTimeout(function(){$("#loader-wrapper").fadeOut();}, 750);
	
}

function startOdometer(){

	if($('.stats-wrapper').hasClass('is-visible')){

		$('.odometer').each(function(){
				var v = $(this).data('start');
				var o = new Odometer({
						el: this,
						value:0
				});
				o.render();
				setInterval(function(){
						o.update(v);
				}, 500);
		});
	}

}

$(document).ready(function(){
	
	$('.anim-element').viewportChecker();
	
	if ($('.dd').length){
		$('.dd').selectric();
	}
	
	/*---------- SEARCH ----------*/
	$('#nav .btn-search').bind('click', function(){
		$("body").toggleClass("search-open");
		setTimeout(function() { 
			$('.search-box').focus();
		}, 100);
	});
	
	/*--- MOBILE MENU ---*/
	$('.btn-mobile-menu').bind('click', function(){
		$("body").addClass("menu-open");
		$("#mobile_nav_wrapper").scrollTop(0);
	});
	
	$(".menu-close").bind('touchstart click', function(){
		$("body").removeClass("menu-open");
		return false;
	});
	
	$(document).on('click', '.cd-overlay', function(){
		if($("body").hasClass("search-open")){
			$("body").removeClass("search-open");
		}
		$("body").removeClass("menu-open");
	});
	
	/*--- Header ---*/
	var $header = $('.menu-wrapper');
	var offset = 47;
	
	$(window).scroll(function(){
		$("body").removeClass("search-open");
		if ($(this).scrollTop() > offset ) {
			$header.addClass('scrolling');
		} else {
			$header.removeClass('scrolling');
		}
	});
	
	
	$(".banner-slider").owlCarousel({
		items:1,
		dots:false,
		nav:true,
		navText:["<i class='icon-prev'></i>","<i class='icon-next'></i>"],
		responsiveRefreshRate:0,
		loop:true,
		autoplay:true
	});
	
	startOdometer();
	
	/*---------- HOME SECTION BLOCKS ----------*/


	//open section-block info
	$('.section-blocks').find('li a').on('click', function(event){
		event.preventDefault();
		var selected_block = $(this).data('type');
		$('.section-block-info.'+ selected_block +'').addClass('slide-in');
		$('.section-block-close').addClass('is-visible');
		
		$('main').addClass('slide-out');
		$('body').addClass('overflow-hidden');

	});
	
	//close section-block info
	$(document).on('click', '.cd-overlay, .section-block-close', function(event){
		event.preventDefault();
		$('.section-block-info').removeClass('slide-in');
		$('.section-block-close').removeClass('is-visible');
		
		$('main').removeClass('slide-out');
		$('body').removeClass('overflow-hidden');
		
	});
	
	/*---------- LEADERSHIP ----------*/		
	var sliderFinalWidth = 355,
		maxQuickWidth = 900;

	//open the quick view panel
	$('.cd-trigger').on('click', function(event){
		var selectedImage = $(this).children('img'),
			selectedmember = $(this).parent('.cd-item'),
			memberID = $(this).attr("id"),
			qvcontent = selectedmember.children('.quick-view-content').html(),
			qvwrapper = document.getElementById('cd-quick-view');
		
		$('body').addClass('overlay-layer');
		animateQuickView(selectedImage, sliderFinalWidth, maxQuickWidth, 'open');
		
		$('#cd-quick-view').children('.quick-view-content-wrapper').remove();
		$(qvwrapper).append(myData[memberID]);
		
		if($(window).width() > 1000){
			$(".cd-quick-view .desc").niceScroll({cursorcolor:"#000", cursorborder:"0px", autohidemode:false});
		}
		
		event.preventDefault();
		
	});
	
	//close the quick view panel
	$('body').on('click', function(event){
		if( $(event.target).is('.cd-close') || $(event.target).is('body.overlay-layer')) {
			closeQuickView( sliderFinalWidth, maxQuickWidth);
			event.preventDefault();
		}
	});
	
	$(document).keyup(function(event){
		//check if user has pressed 'Esc'
    	if(event.which=='27'){
			closeQuickView( sliderFinalWidth, maxQuickWidth);
		}
	});

	//center quick-view on window resize
	$(window).on('resize', function(){
		if($('.cd-quick-view').hasClass('is-visible')){
			window.requestAnimationFrame(resizeQuickView);
		}
	});

	function resizeQuickView() {
		var quickViewLeft = ($(window).width() - $('.cd-quick-view').width())/2,
			quickViewTop = ($(window).height() - $('.cd-quick-view').height())/2;
		$('.cd-quick-view').css({
		    "top": quickViewTop,
		    "left": quickViewLeft,
		});
	} 
	
	function closeQuickView(finalWidth, maxQuickWidth) {
		var close = $('.cd-close'),
			selectedImage = $('.empty-box').find('img');
		if( !$('.cd-quick-view').hasClass('velocity-animating') && $('.cd-quick-view').hasClass('add-content')) {
			animateQuickView(selectedImage, finalWidth, maxQuickWidth, 'close');
		} else {
			closeNoAnimation(selectedImage, finalWidth, maxQuickWidth);
		}
	}
	
	function animateQuickView(image, finalWidth, maxQuickWidth, animationType) {
		var parentListItem = image.closest('.cd-item'),
			topSelected = image.offset().top - $(window).scrollTop(),
			leftSelected = image.offset().left,
			widthSelected = image.width(),
			heightSelected = image.height(),
			windowWidth = $(window).width(),
			windowHeight = $(window).height(),
			finalLeft = (windowWidth - finalWidth)/2,
			finalHeight = finalWidth * heightSelected/widthSelected,
			finalTop = (windowHeight - finalHeight)/2,
			quickViewWidth = ( windowWidth * .8 < maxQuickWidth ) ? windowWidth * .8 : maxQuickWidth ,
			quickViewLeft = (windowWidth - quickViewWidth)/2;

		if( animationType == 'open') {
			//hide the image in the gallery
			parentListItem.addClass('empty-box');
			//place the quick view over the image gallery and give it the dimension of the gallery image
			$('.cd-quick-view').css({
			    "top": topSelected,
			    "left": leftSelected,
			    "width": widthSelected,
			});
			
			if($(window).width() > 1000){
				$('.cd-quick-view').velocity({
					//animate the quick view: animate its width and center it in the viewport
					//during this animation, only the slider image is visible
						'top': finalTop+ 'px',
						'left': finalLeft+'px',
						'width': finalWidth+'px',
				}, 1000, [ 400, 20 ], function(){
					//animate the quick view: animate its width to the final value
					$('.cd-quick-view').addClass('animate-width').velocity({
						'left': quickViewLeft+'px',
							'width': quickViewWidth+'px',
					}, 300, 'ease' ,function(){
						//show quick view content
						$('.cd-quick-view').addClass('add-content');
					});
				});
			}
			else{
				$('.cd-quick-view').velocity({
					//animate the quick view: animate its width and center it in the viewport
					//during this animation, only the slider image is visible
						'top': finalTop+ 'px',
						'left': finalLeft+'px',
						'width': finalWidth+'px',
				}, 0, [ 400, 20 ], function(){
					//animate the quick view: animate its width to the final value
					$('.cd-quick-view').addClass('animate-width').velocity({
						'left': quickViewLeft+'px',
							'width': quickViewWidth+'px',
					}, 300, 'ease' ,function(){
						//show quick view content
						$('.cd-quick-view').addClass('add-content');
					});
				});
			}
			
			$('.cd-quick-view').addClass('is-visible');
		} else {
			//close the quick view reverting the animation
			$('.cd-quick-view').removeClass('add-content').velocity({
			    'top': finalTop+ 'px',
			    'left': finalLeft+'px',
			    'width': finalWidth+'px',
			}, 300, 'ease', function(){
				$('body').removeClass('overlay-layer');
				$('.cd-quick-view').removeClass('animate-width').velocity({
					"top": topSelected,
				    "left": leftSelected,
				    "width": widthSelected,
				}, 500, 'ease', function(){
					$('.cd-quick-view').removeClass('is-visible');
					parentListItem.removeClass('empty-box');
				});
			});
		}
	}
	
	function closeNoAnimation(image, finalWidth, maxQuickWidth) {
		var parentListItem = image.closest('.cd-item'),
			topSelected = image.offset().top - $(window).scrollTop(),
			leftSelected = image.offset().left,
			widthSelected = image.width();

		//close the quick view reverting the animation
		$('body').removeClass('overlay-layer');
		parentListItem.removeClass('empty-box');
		$('.cd-quick-view').velocity("stop").removeClass('add-content animate-width is-visible').css({
			"top": topSelected,
		    "left": leftSelected,
		    "width": widthSelected,
		});
	}
	
	
	/*---------- ARTICLES PROGRESS ----------*/
	var articlesWrapper = $('.cd-articles');

	if( articlesWrapper.length > 0 ) {
		// cache jQuery objects
		var windowHeight = $(window).height(),
			articles = articlesWrapper.find('article'),
			aside = $('.cd-read-more'),
			articleSidebarLinks = aside.find('li');
		// initialize variables
		var	scrolling = false,
			sidebarAnimation = false,
			resizing = false,
			mq = checkMQ(),
			svgCircleLength = parseInt(Math.PI*(articleSidebarLinks.eq(0).find('circle').attr('r')*2));
		
		// check media query and bind corresponding events
		if( mq == 'desktop' ) {
			$(window).on('scroll', checkRead);
			$(window).on('scroll', checkSidebar);
		}

		$(window).on('resize', resetScroll);

		updateArticle();
		updateSidebarPosition();

		aside.on('click', 'a', function(event){
			event.preventDefault();
			var selectedArticle = articles.eq($(this).parent('li').index()),
				selectedArticleTop = selectedArticle.offset().top;

			$(window).off('scroll', checkRead);

			$('body,html').animate(
				{'scrollTop': selectedArticleTop + 2}, 
				300, function(){
					checkRead();
					$(window).on('scroll', checkRead);
				}
			); 
	    });
	}
	
	function checkRead() {
		if( !scrolling ) {
			scrolling = true;
			(!window.requestAnimationFrame) ? setTimeout(updateArticle, 300) : window.requestAnimationFrame(updateArticle);
		}
	}

	function checkSidebar() {
		if( !sidebarAnimation ) {
			sidebarAnimation = true;
			(!window.requestAnimationFrame) ? setTimeout(updateSidebarPosition, 300) : window.requestAnimationFrame(updateSidebarPosition);
		}
	}

	function resetScroll() {
		if( !resizing ) {
			resizing = true;
			(!window.requestAnimationFrame) ? setTimeout(updateParams, 300) : window.requestAnimationFrame(updateParams);
		}
	}

	function updateParams() {
		windowHeight = $(window).height();
		mq = checkMQ();
		$(window).off('scroll', checkRead);
		$(window).off('scroll', checkSidebar);
		
		if( mq == 'desktop') {
			$(window).on('scroll', checkRead);
			$(window).on('scroll', checkSidebar);
		}
		resizing = false;
	}

	function updateArticle() {
		var scrollTop = $(window).scrollTop();

		articles.each(function(){
			var article = $(this),
				articleTop = article.offset().top,
				articleHeight = article.outerHeight(),
				articleSidebarLink = articleSidebarLinks.eq(article.index()).children('a');

			if( article.is(':last-of-type') ) articleHeight = articleHeight - windowHeight;

			if( articleTop > scrollTop) {
				articleSidebarLink.removeClass('read reading');
			} else if( scrollTop >= articleTop && articleTop + articleHeight > scrollTop) {
				var dashoffsetValue = svgCircleLength*( 1 - (scrollTop - articleTop)/articleHeight);
				articleSidebarLink.addClass('reading').removeClass('read').find('circle').attr({ 'stroke-dashoffset': dashoffsetValue });
			} else {
				articleSidebarLink.removeClass('reading').addClass('read');
			}
		});
		scrolling = false;
	}

	function updateSidebarPosition() {
		var articlesWrapperTop = articlesWrapper.offset().top,
			articlesWrapperHeight = articlesWrapper.outerHeight(),
			scrollTop = $(window).scrollTop();

		if( scrollTop < articlesWrapperTop) {
			aside.removeClass('fixed').attr('style', '');
		} else if( scrollTop >= articlesWrapperTop && scrollTop < articlesWrapperTop + articlesWrapperHeight - windowHeight) {
			aside.addClass('fixed').attr('style', '');
		} else {
			var articlePaddingTop = Number(articles.eq(1).css('padding-top').replace('px', ''));
			if( aside.hasClass('fixed') ) aside.removeClass('fixed').css('top', articlesWrapperHeight + articlePaddingTop - windowHeight + 'px');
		}
		sidebarAnimation =  false;
	}

	function checkMQ() {
		return window.getComputedStyle(articlesWrapper.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
	}
	
	/*---------- TABS ----------*/
	$(".tabs-wrapper a").on("click", function(){
		var tabID = $(this).attr("href");
		$(".tabs-wrapper a").removeClass("active");
		$(this).addClass("active");
		$(".tab-content").removeClass("active");
		$(tabID).addClass("active");
		return false;
	});
	
	/*---------- FILE INPUT ----------*/
	$( '.inputfile' ).each( function()
	{
		var $input	 = $( this ),
			$label	 = $input.next( 'label' ),
			labelVal = $label.html();

		$input.on( 'change', function( e )
		{
			var fileName = '';

			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else if( e.target.value )
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
				$label.find( '.filename' ).html( fileName );
			else
				$label.html( labelVal );
		});

		// Firefox bug fix
		$input
		.on( 'focus', function(){ $input.addClass( 'has-focus' ); })
		.on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
	});
	
	
});
// End of Document ready

$(window).scroll(function(){
	startOdometer();
});

$(window).load(function() {
	if($('body').hasClass("home")){
		reveal();
	}
	$("body").addClass("loaded");
});