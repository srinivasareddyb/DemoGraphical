/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"model/app/Zmodel_test/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});