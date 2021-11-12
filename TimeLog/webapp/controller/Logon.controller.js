sap.ui.define([
	"emp/timelog/TimeLog/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (BaseController, MessageToast, Device, Filter, FilterOperator, JSONModel) {
	"use strict";

	var oGModel, that = this;
	return BaseController.extend("emp.timelog.TimeLog.controller.Logon", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf emp.timelog.TimeLog.view.Logon
		 */
		onInit: function () {
			var oViewModel = new JSONModel();
			this.getView().setModel(oViewModel);

			if (!this._oManualEntryDialog) {
				this._oManualEntryDialog = new sap.ui.xmlfragment("emp.timelog.TimeLog.view.ManualEntry", this);
				this.getView().addDependent(this._oManualEntryDialog);
			}

			this.getRouter().getRoute("logon").attachPatternMatched(this._onObjectMatched, this);
		},

		onExit: function () {
			if (that._oManualEntryDialog) {
				that._oManualEntryDialog.destroy();
			}
		},

		_displayTime: function () {
			if (that.byId("inpScanCode").getValue() === "" && !that._oManualEntryDialog.isOpen()) {
				that.byId("inpScanCode").focus();
			}
			var today = new Date(),
				months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				month = months[today.getMonth()],
				day = that.checkTime(today.getDate()),
				year = today.getFullYear(),
				h = today.getHours() % 12 ? today.getHours() % 12 : 12,
				m = that.checkTime(today.getMinutes()),
				s = that.checkTime(today.getSeconds()),
				ampm = today.getHours() >= 12 ? "PM" : "AM",
				oDate = day + "-" + month + "-" + year,
				oTime = h + ":" + m + ":" + s + " " + ampm,
				dayName = days[today.getDay()];

			that.byId("lblDate").setText(oDate);
			that.byId("lblTime").setText(oTime);
			that.byId("lblDay").setText(dayName);
			setTimeout(that._displayTime, 1000);
		},

		checkTime: function (i) {
			if (i < 10) {
				return "0" + i;
			} else {
				return i;
			}
		},

		onManualEntry: function (oEvent) {
			that._oManualEntryDialog.openBy(oEvent.getSource());
		},

		onManualSubmit: function () {
			var oIpPersno = sap.ui.getCore().byId("inpPersno"),
				oIpSsn = sap.ui.getCore().byId("inpSsn");

			if (oIpPersno.getValue() === "") {
				sap.m.MessageToast.show("Please enter operator ID");
				return;
			} else if (oIpSsn.getValue() === "") {
				sap.m.MessageToast.show("Please enter last four digits of SSN");
				return;
			} else {
				if (oIpPersno.getValue() === "12345" && oIpSsn.getValue() === "6789") {
                    // that.playAudio("sounds/success_new.wav");
                    that.playAudio("sounds/boss.wav");
					MessageToast.show("Login Success");
					jQuery(".sapMMessageToast").css({
						"border": "10px solid rgb(5, 197, 0)"
					});

				} else if (oIpPersno.getValue() === "11111" && oIpSsn.getValue() === "6789") {
					that._onSafeConf();
				} else {
					that.playAudio("sounds/error.wav");
					MessageToast.show("Invalid Scan.");
					jQuery(".sapMMessageToast").css({
						"border": "10px solid rgb(255, 47, 47)"
					});
					that.resetFields();
				}

				that.resetFields();
				that._oManualEntryDialog.close();
			}
		},

		playAudio: function (sSource) {
			var sRootpath = jQuery.sap.getModulePath("emp/timelog/TimeLog", "/"),
				oAudio = that.byId("notificationAudio").getDomRef();
			oAudio.setAttribute("src", sRootpath + sSource);
			oAudio.play();
		},

		_onSafeConf: function () {
			that.playAudio("sounds/boss.wav");
			MessageToast.show("Have a good Day!!");
			jQuery(".sapMMessageToast").css({
				"border": "10px solid rgb(5, 197, 0)"
			});
		},

		resetFields: function () {
			that.getView().byId("inpScanCode").setValue("");
			that.getView().byId("inpScanCode").focus();
			sap.ui.getCore().byId("inpPersno").setValue("");
			sap.ui.getCore().byId("inpSsn").setValue("");
		},

		onReceiveScanCode: function () {
			var sBar = that.getView().byId("inpScanCode").getValue();
			if (sBar) {
				if (sBar === "1") {
					that._onSafeConf();
					that.resetFields();
				} else {
					that.playAudio("sounds/error.wav");
					MessageToast.show("Invalid Scan.");
					jQuery(".sapMMessageToast").css({
						"border": "10px solid rgb(255, 47, 47)"
					});
					that.resetFields();
				}
			}
		},

		_onObjectMatched: function () {
			oGModel = this.getModel("GModel");
			that = this;
			this._displayTime();

		}

	});

});