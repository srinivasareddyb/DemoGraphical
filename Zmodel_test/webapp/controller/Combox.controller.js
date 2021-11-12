sap.ui.define([
	"model/app/Zmodel_test/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("model.app.Zmodel_test.controller.Combox", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf model.app.Zmodel_test.view.Combox
		 */
		onInit: function () {

			var oViewModel = new JSONModel();

			this.getView().setModel(oViewModel);

			this.getRouter().getRoute("combox").attachPatternMatched(this._onObjectMatched, this);

		},

		/**
		 * Navagation
		 */
		onNavBack: function () {
			this.getRouter().navTo("home", {});
		},

		_onObjectMatched: function () {
				this.eduArr = [{
						"Eid": "101",
						"Edu": "SSC",
						"Institution": "ZP.High.School",
						"Yop": "2010-4-10"
					}, {
						"Eid": "101",
						"Edu": "Inter",
						"Institution": "V.B.R.College",
						"Yop": "2012-3-15"
					}, {
						"Eid": "101",
						"Edu": "B.Tech",
						"Institution": "ALIET",
						"Yop": "2016-5-25"
					}, {
						"Eid": "101",
						"Edu": "MBA",
						"Institution": "SRK",
						"Yop": "2018-6-25"
					}, {
						"Eid": "201",
						"Edu": "SSC",
						"Institution": "ZP.High.School",
						"Yop": "2010-4-10"
					}, {
						"Eid": "201",
						"Edu": "Inter",
						"Institution": "V.B.R.College",
						"Yop": "2012-3-15"
					}, {
						"Eid": "201",
						"Edu": "MBA",
						"Institution": "SRK",
						"Yop": "2018-6-25"
					},
					{
						"Eid": "211",
						"Edu": "SSC",
						"Institution": "ZP.High.School",
						"Yop": "2016-5-25"
					}, {
						"Eid": "211",
						"Edu": "Inter",
						"Institution": "V.B.R.College",
						"Yop": "2016-5-25"
					}, {
						"Eid": "211",
						"Edu": "B.Tech",
						"Institution": "ABC",
						"Yop": "2016-5-25"
					}
				];

			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf model.app.Zmodel_test.view.Combox
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf model.app.Zmodel_test.view.Combox
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf model.app.Zmodel_test.view.Combox
		 */
		//	onExit: function() {
		//
		//	}

	});

});