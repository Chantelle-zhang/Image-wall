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
	this.$img = '';
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

		str = str + '<a target="_blank" href="' + this.opts.imgArr[i] + '"><img src="' + this.opts.imgArr[i] + '" index="' + i + '" width="' + this.opts.imgWidth + '" height="' + this.opts.imgHeight + '"></a>';
		this.imageIndex.push(i); /* created index property  for images and push index values to an array*/

	}

	this.id.append('<div id="wrap">' + str + '</div>');
	var $wrap = $("#wrap");
	$wrap.css({
		'width': this.opts.imgWidth * this.opts.cols,
		'height': this.opts.imgHeight * this.opts.rows
	});
	this.$a = $("#wrap a");
	this.$a.css({
		'width': this.opts.imgWidth,
		'height': this.opts.imgHeight
	});

}




Imgwall.prototype.drag = function () {


	this.$img = $("#wrap img");

	var This = this;

	this.$img.on("mousedown", function (event) {

		event.preventDefault();

		This.disx = event.pageX - $(this).offset().left;

		This.disy = event.pageY - $(this).offset().top;
		console.log(This.disx)

		$this = $(this);

		This.index1 = $(this).attr('index');


		$(document).on("mousemove", function (event) {

			This.$a.on("click", function () {

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

			var index = This.indexOfImageToExchange($this);

			This.$img.css('opacity', '1');

			var $index2 = "index='" + index + "'"

			$("img[" + $index2 + "]").css('opacity', '0.5');

			$this.css('opacity', '1');

			if (event.pageX <= 0 || event.pageX >= $(window).innerWidth() || event.pageY <= 0 || event.pageY >= $(window).innerHeight()) {

				$(document).off("mousemove");

				This.imageExchange($this);


			}


		})



	})





	$(document).on("mouseup", function (event) {

		$(document).off("mousemove");

		setTimeout(function () {
			This.$a.off("click")
		}, 500);

		if (event.target.nodeName == 'IMG') {

			This.imageExchange($(event.target));
		}




	})

	this.$img.on("contextmenu", function () {
		return false;
	});

	$(document).on("dragstart", function () { /*for firefox */


		return false;
	})

}





Imgwall.prototype.imageExchange = function (obj) {

	var index = this.indexOfImageToExchange(obj); /* find the index of the rignt image to be exchanged*/

	var $left = this.$a.eq(index).position().left + 'px';

	var $top = this.$a.eq(index).position().top + 'px';

	obj.animate({
		left: $left,
		top: $top
	}, 200);

	obj.css('opacity', '1');

	var t = index;

	var $index2 = "index='" + index + "'";

	$left = this.$a.eq(this.index1).position().left;
	$top = this.$a.eq(this.index1).position().top;
	$("img[" + $index2 + "]").css('opacity', '1');
	$("img[" + $index2 + "]").animate({
		left: $left,
		top: $top
	}, 200);


	setTimeout(zindex, 250, obj);

	$("img[" + $index2 + "]").attr('index', this.index1);

	obj.attr('index', index);

	/* exchange the value of index property , and updates the imageIndex Array*/
	var $index1 = "index='" + this.index1 + "'";
	var n = $("img").index($("[" + $index2 + "]"));
	var m = $("img").index($("[" + $index1 + "]"));
	this.imageIndex[n] = index;

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

		this.$img.eq(i).attr('index', this.imageIndex[i]);

		var $left = this.$a.eq(this.imageIndex[i]).position().left + 'px';

		var $top = this.$a.eq(this.imageIndex[i]).position().top + 'px';

		this.$img.eq(i).animate({
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