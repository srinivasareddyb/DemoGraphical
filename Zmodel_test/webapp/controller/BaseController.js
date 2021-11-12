sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	return Controller.extend("model.app.Zmodel_test.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function () {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/**
		 * Marks data filling
		 * 
		 **/

		onAllMarks: function () {
			var Marks = [{
				"Eid": "101",
				"Edu": "SSC",
				"English": "75",
				"Telugu": "93",
				"Maths": "89",
				"Social": "92",
				"Science": "80",
				"Hindi": "65"
			}, {
				"Eid": "201",
				"Edu": "SSC",
				"English": "75",
				"Telugu": "93",
				"Maths": "89",
				"Social": "92",
				"Science": "80",
				"Hindi": "70"
			}, {
				"Eid": "211",
				"Edu": "SSC",
				"English": "75",
				"Telugu": "93",
				"Maths": "89",
				"Social": "92",
				"Science": "80",
				"Hindi": "80"
			}];

			return Marks;
		},

		onBtechPer: function () {
			var BtechPer = [{
				"Eid": "101",
				"Edu": "B.Tech",
				"First": "86",
				"Second": "74",
				"Third": "79",
				"Four": "81"
			}, {
				"Eid": "211",
				"Edu": "B.Tech",
				"First": "85",
				"Second": "60",
				"Third": "60",
				"Four": "78"
			}];
			return BtechPer;
		},
		//Shoping status application
		onKiosk: function () {
			var Bays = [{
				"KioskId": "FLNG_BAY",
				"Description": "FLNG_BAY"
			}, {
				"KioskId": "NRTH_BAY",
				"Description": "NORTH BAY"
			}, {
				"KioskId": "SHER_BAY",
				"Description": "SHER_BAY"
			}, {
				"KioskId": "WELD_BLD",
				"Description": "WELD BUILDING"
			}];
			return Bays;
		},

		onGroup: function () {
			var Grouping = [{
				"GrpDes": "SMALL FLANGERS",
				"KioskId": "FLNG_BAY",
				"Grouping": "SF"
			}, {
				"GrpDes": "SMALL PRESS",
				"KioskId": "FLNG_BAY",
				"Grouping": "SP"
			}, {
				"GrpDes": "LARGE FLANGERS",
				"KioskId": "NRTH_BAY",
				"Grouping": "LF"
			}, {
				"GrpDes": "LARGE PRESS",
				"KioskId": "NRTH_BAY",
				"Grouping": "LP"
			}, {
				"GrpDes": "FURNACES",
				"KioskId": "SHER_BAY",
				"Grouping": "FR"
			}, {
				"GrpDes": "LARGE FLANGERS",
				"KioskId": "SHER_BAY",
				"Grouping": "LF"
			}, {
				"GrpDes": "SMALL PRESS",
				"KioskId": "SHER_BAY",
				"Grouping": "SP"
			}, {
				"GrpDes": "LARGE PRESS",
				"KioskId": "WELD_BLD",
				"Grouping": "LP"
			}, {
				"GrpDes": "SMALL PRESS",
				"KioskId": "WELD_BLD",
				"Grouping": "SP"
			}, {
				"GrpDes": "WELD BUILDING",
				"KioskId": "WELD_BLD",
				"Grouping": "WB"
			}];
			return Grouping;
		},

		onMainData: function () {
			var Maindata = [{
				"KioskId": "FLNG_BAY",
				"Workcenter": "2001",
				"Vornr": "",
				"Aufnr": "",
				"Status": "R",
				"Pernr": "00000000",
				"Ename": "",
				"Grouping": "SF"
			}, {
				"KioskId": "FLNG_BAY",
				"Workcenter": "2003",
				"Vornr": "",
				"Aufnr": "",
				"Status": "Y",
				"Pernr": "00000000",
				"Ename": "",
				"Grouping": "SF"
			}, {
				"KioskId": "FLNG_BAY",
				"Workcenter": "2021",
				"Vornr": "",
				"Aufnr": "",
				"Status": "G",
				"Pernr": "12345678",
				"Ename": "Srinivasa Reddy B",
				"Grouping": "SP"
			}, {
				"KioskId": "FLAN_BAY",
				"Workcenter": "2022",
				"Vornr": "",
				"Aufnr": "",
				"Status": "Y",
				"Pernr": "00000000",
				"Ename": "",
				"Grouping": "SP"
			}, {
				"KioskId": "NRTH_BAY",
				"Workcenter": "2002",
				"Vornr": "",
				"Aufnr": "",
				"Status": "Y",
				"Pernr": "00000000",
				"Ename": "",
				"Grouping": "LF"
			}, {
				"KioskId": "NRTH_BAY",
				"Workcenter": "2009",
				"Vornr": "",
				"Aufnr": "",
				"Status": "R",
				"Pernr": "00000000",
				"Ename": "",
				"Grouping": "LF"
			}, {
				"KioskId": "NRTH_BAY",
				"Workcenter": "2028",
				"Vornr": "",
				"Aufnr": "",
				"Status": "Y",
				"Pernr": "00000000",
				"Ename": "",
				"Grouping": "LP"
			}, {
				"KioskId": "SHER_BAY",
				"Workcenter": "2071",
				"Vornr": "",
				"Aufnr": "",
				"Status": "G",
				"Pernr": "00000000",
				"Ename": "Reddy",
				"Grouping": "FR"
			}, {
				"KioskId": "SHER_BAY",
				"Workcenter": "2028",
				"Vornr": "",
				"Aufnr": "",
				"Status": "Y",
				"Pernr": "00000000",
				"Ename": "",
				"Grouping": "LF"
			}, {
				"KioskId": "SHER_BAY",
				"Workcenter": "2027",
				"Vornr": "",
				"Aufnr": "",
				"Status": "Y",
				"Pernr": "00000000",
				"Ename": "",
				"Grouping": "SP"
			}, {
				"KioskId": "SHER_BAY",
				"Workcenter": "2029",
				"Vornr": "",
				"Aufnr": "",
				"Status": "G",
				"Pernr": "00000000",
				"Ename": "",
				"Grouping": "SP"
			}, {
				"KioskId": "SHER_BAY",
				"Workcenter": "2008",
				"Vornr": "",
				"Aufnr": "",
				"Status": "R",
				"Pernr": "00000000",
				"Ename": "",
				"Grouping": "LF"
			}, {
				"KioskId": "WELD_BLD",
				"Workcenter": "2026",
				"Vornr": "",
				"Aufnr": "",
				"Status": "R",
				"Pernr": "",
				"Ename": "",
				"Grouping": "SP"
			}, {
				"KioskId": "WELD_BLD",
				"Workcenter": "2021",
				"Vornr": "",
				"Aufnr": "",
				"Status": "Y",
				"Pernr": "00000000",
				"Ename": "",
				"Grouping": "SP"
			}, {
				"KioskId": "WELD_BLD",
				"Workcenter": "2023",
				"Vornr": "",
				"Aufnr": "",
				"Status": "G",
				"Pernr": "78945621",
				"Ename": "bHIMANADHAM",
				"Grouping": "LP"
			}, {
				"KioskId": "WELD_BLD",
				"Workcenter": "2024",
				"Vornr": "",
				"Aufnr": "",
				"Status": "R",
				"Pernr": "00000000",
				"Ename": "",
				"Grouping": "SP"
			}, {
				"KioskId": "WELD_BLD",
				"Workcenter": "2040",
				"Vornr": "",
				"Aufnr": "",
				"Status": "Y",
				"Pernr": "00000000",
				"Ename": "",
				"Grouping": "SP"
			}];
			return Maindata;
		}

	});
});