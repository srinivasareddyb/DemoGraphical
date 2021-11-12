/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comenerpipe.shopfloor./enerpipe/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
