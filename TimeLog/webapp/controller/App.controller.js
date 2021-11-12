sap.ui.define([
	"emp/timelog/TimeLog/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("emp.timelog.TimeLog.controller.App", {

		onInit: function () {
			var oViewModel;
			//fnSetAppNotBusy,
			//iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: true,
				delay: 0
			});
			this.setModel(oViewModel, "appView");

			// apply content density mode to root view
			this.getView().addStyleClass(!sap.ui.Device.support.touch ? "sapUiSizeCompact" : "sapUiSizeCozy");
			// If launchpad, the keep session alive forever by pinging the server every 2 minutes
			if (sap.hana) {
				setInterval(function () {
					sap.hana.uis.flp.SessionTimeoutHandler.pingServer();
				}, 120000);
			}

			// fnSetAppNotBusy = function() {
			// 	oViewModel.setProperty("/busy", false);
			// 	oViewModel.setProperty("/delay", iOriginalBusyDelay);
			// };

			// disable busy indication when the metadata is loaded and in case of errors
			// this.getOwnerComponent().getModel().metadataLoaded().
			//     then(fnSetAppNotBusy);
			// this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);

			// apply content density mode to root view
			//	this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});

});