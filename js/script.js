// requires jquery

jQuery(document).ready(function ($) {
	$(window).load(function () {
	  $("#preloader").fadeOut("slow", function () {
		$(this).remove();
	  });
	});
  });
  