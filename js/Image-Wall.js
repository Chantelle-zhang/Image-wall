// JavaScript Document

function Imgwall(id, options) {

	this.id = id;
	this.defaults = {
		imgArr: imgArr1,
		imgWidth: 150,
		imgHeight: 150,
		rows: 3,
		cols: 3
	};
	this.opts = $.extend({}, this.defaults, options);
	this.disx = 0;
	this.disy = 0;
	this.imageIndex = [];
	this.$a = '';
	this.index=''
	this.index1 = '';
	this.init();

}


Imgwall.prototype.init = function () {

	this.createHtml();

	this.drag();

}



Imgwall.prototype.createHtml = function () {

	var str = '';
	for (var i = 0; i < this.opts.imgArr.length; i++) {

		str = str + '<a target="_blank" href="' + this.opts.imgArr[i] +'" index="' + i+ '"><img src="' + this.opts.imgArr[i] + '"   width="' + this.opts.imgWidth + '" height="' + this.opts.imgHeight + '"></a>';
		this.imageIndex.push(i); /* created index property  for images and push index values to an array*/

	}

	this.id.append('<div id="wrap">' + str + '</div>');
	var $wrap = $("#wrap");
	$wrap.css({
		'width': this.opts.imgWidth * this.opts.cols,
		'height': this.opts.imgHeight * this.opts.rows
	});
	this.$a = $("#wrap a");

	for (var j = 0; j < this.opts.imgArr.length; j++){
    this.$a.eq(j).css({
		
		left:(j%this.opts.cols)*this.opts.imgWidth,
		top:Math.floor(j/this.opts.rows)*this.opts.imgHeight
		
	});
	}
}




Imgwall.prototype.drag = function () {

	var This = this;

	this.$a.on("mousedown", function (event) {

		event.preventDefault();

		This.disx = event.pageX - $(this).offset().left;

		This.disy = event.pageY - $(this).offset().top;


		$this = $(this);

		This.index1 = $(this).attr('index');


		$(document).on("mousemove", function (event) {

			$this.on("click", function () {

				return false;

			})


			$this.offset({
				left: event.pageX - This.disx,
				top: event.pageY - This.disy
			});

			/*set margin for dragging*/
			if ($this.offset().left <= 0) {
				$this.offset({
					"left": 0
				});
			}
			if ($this.offset().left >= $(window).innerWidth() - $this.width()) {
				$this.offset({
					"left": $(window).innerWidth() - $this.width()
				});
			}

			if ($this.offset().top <= 0) {
				$this.offset({
					"top": 0
				});
			}
			if ($this.offset().top >= $(window).innerHeight() - $this.height()) {
				$this.offset({
					"top": $(window).innerHeight() - $this.height()
				});
			}


			$this.css('z-index', '999');

			This.index = This.indexOfImageToExchange($this);

			This.$a.css('opacity', '1');

			var $index2 = "index='" + This.index + "'"

			$("a[" + $index2 + "]").css('opacity', '0.5');

			$this.css('opacity', '1');

			if (event.pageX <= 0 || event.pageX >= ($(window).innerWidth()-1 )|| event.pageY <= 0 || event.pageY >= ($(window).innerHeight()-1) ){


				$(document).off("mousemove");
				/* if mouse is off the above margin , move image back automatically */

                var $left=(This.index%This.opts.cols)*This.opts.imgWidth
                var $top=Math.floor(This.index/This.opts.rows)*This.opts.imgHeight

                $this.animate({
                    left: $left,
                    top: $top
                }, 200);


			}


		})



	})





	$(document).on("mouseup", function (event) {

		$(document).off("mousemove");

		setTimeout(function () {
			This.$a.off("click")
		}, 500);

		if (event.target.nodeName == 'IMG') {

			This.imageExchange($(event.target.parentNode));
		}




	})

	this.$a.on("contextmenu", function () {
		return false;
	});

	$(document).on("dragstart", function () { /*for firefox */


		return false;
	})

}





Imgwall.prototype.imageExchange = function (obj) {

	
		var $left=(this.index%this.opts.cols)*this.opts.imgWidth
		var $top=Math.floor(this.index/this.opts.rows)*this.opts.imgHeight

	obj.animate({
		left: $left,
		top: $top
	}, 200);

	obj.css('opacity', '1');


	var $index2 = "index='" + this.index + "'";

		$left=(this.index1%this.opts.cols)*this.opts.imgWidth
		$top=Math.floor(this.index1/this.opts.rows)*this.opts.imgHeight
		
		
	$("a[" + $index2 + "]").css('opacity', '1');
	$("a[" + $index2 + "]").animate({
		left: $left,
		top: $top
	}, 200);


	setTimeout(zindex, 250, obj);

	$("a[" + $index2 + "]").attr('index', this.index1);

	obj.attr('index', this.index);

	/* exchange the value of index property , and updates the imageIndex Array*/
	var $index1 = "index='" + this.index1 + "'";
	var n = $("a").index($("[" + $index2 + "]"));
	var m = $("a").index($("[" + $index1 + "]"));
	this.imageIndex[n] = this.index;

	this.imageIndex[m] = this.index1;

}




Imgwall.prototype.indexOfImageToExchange = function (obj) {

    
	var index = '';

	var $rowIndex = Math.round(obj.position().left / this.opts.imgWidth);
	var $colIndex = Math.round(obj.position().top / this.opts.imgHeight);

	if ($rowIndex >= 0 && $rowIndex < this.opts.cols && $colIndex >= 0 && $colIndex < this.opts.rows) {
		index = this.opts.cols * $colIndex + $rowIndex;

	} else {
		index = obj.attr('index');
	}
	return index;
}

Imgwall.prototype.sort = function () {
	/* radomnize the imageIndex array  and  move the images to new place accordingly*/
	this.imageIndex.sort(function (a, b) {
		return 0.5 - Math.random()
	});

	for (var i = 0; i < this.imageIndex.length; i++) {

		this.$a.eq(i).attr('index', this.imageIndex[i]);
		var $left=(this.imageIndex[i]%this.opts.cols)*this.opts.imgWidth
		var $top=Math.floor(this.imageIndex[i]/this.opts.rows)*this.opts.imgHeight
	

		this.$a.eq(i).animate({
			left: $left,
			top: $top
		}, 200);


	}

}


function zindex(obj) {
	obj.css('z-index', '0')
}

$("#button").click(function(){
		
		imgwall.sort();
				
		
	})