(function () { "use strict";

var background = chrome.extension.getBackgroundPage();

var $balance = $("#time-balance").tooltip({ placement: "right" }),
	$meter = $("#time-meter").tooltip({ placement: "left" }),
	$use = $("button"),
	$usecustom = $("#use-custom");

var update = window.update = function () {
	var balance = background.state.balance,
		meter = background.state.meter;
	
	$balance.text(balance);
	$meter.text(meter);
	
	$use.each(function () {
		this.disabled = parseInt(this.innerText, 10) > balance;
	});
	
	$usecustom.text(balance).parent().prop("disabled", !balance);
	
	if (meter && location.search) {
		location.replace(decodeURIComponent(location.search.substr(1)));
	}
};

$("body").on("focus", "*", function () {
	!location.search && this.blur();
	
	$("body").off("focus", "*");
}).on("click", "button", function () {
	var amount = parseInt(this.innerText, 10);
	
	background.state.balance -= amount;
	background.state.meter += amount;
	background.state.use.start();
	
	background.state.sync();
});

update();

background._gaq.push(["_trackPageview", location.search ? "/tab" : "/popup"]);

})();