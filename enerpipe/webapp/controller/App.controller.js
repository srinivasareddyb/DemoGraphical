sap.ui.define([
    "com/enerpipe/shopfloor/enerpipe/controller/BaseController"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (BaseController) {
		"use strict";

		return BaseController.extend("com.enerpipe.shopfloor.enerpipe.controller.App", {
			onInit: function () {
		// apply content density mode to root view
			this.getView().addStyleClass(!sap.ui.Device.support.touch ? "sapUiSizeCompact" : "sapUiSizeCozy");
			}
		});
	});
