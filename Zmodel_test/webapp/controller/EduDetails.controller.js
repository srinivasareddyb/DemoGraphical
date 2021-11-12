sap.ui.define([
	"model/app/Zmodel_test/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, Filter, FilterOperator, Sorter, MessageToast) {
	"use strict";
	var that, GModel;
	return BaseController.extend("model.app.Zmodel_test.controller.EduDetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf model.app.Zmodel_test.view.EduDetails
		 */
		onInit: function () {
			this.eduModel = new JSONModel();

		},
		onMaster: function () {
			this.getRouter().navTo("alldetails", {});
		},

		onSearchEdu: function (oEvent) {
			var value = oEvent.getParameter("newValue");
			var oBinding = this.tableId.getBinding("items");
			var aFilters = GModel.getProperty("/allFilters1") || [];
			var oFilter;

			if (value !== "" && value !== undefined) {
				oFilter = new Filter({
					filters: [
						new Filter({
							filters: [
								new Filter("Edu", FilterOperator.Contains, value),
								new Filter("Institution", FilterOperator.Contains, value)
							],
							and: false
						}),
						aFilters[0]
					],
					and: true
				});
			} else {
				oFilter = aFilters[0];
			}
			oBinding.filter(oFilter);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf model.app.Zmodel_test.view.EduDetails
		 */
		onBeforeRendering: function () {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf model.app.Zmodel_test.view.EduDetails
		 */
		onAfterRendering: function () {
			this.getView().byId("headSearch").setValue("");
			this.tableId = this.getView().byId("idEduTab");
			GModel = this.getModel("GModel");
			var aFilters = [];
			var data = GModel.getProperty("/EDU");
			this.eduModel.setData({
				results: data
			});
			this.tableId.setModel(this.eduModel);
			var Eid = GModel.getProperty("/Eid");
			var oBinding = this.tableId.getBinding("items");

			var oFilter = new Filter("Eid", FilterOperator.EQ, Eid);

			aFilters.push(oFilter);
			GModel.setProperty("/allFilters1", aFilters);
			oBinding.filter([oFilter]);

			var Emp = GModel.getProperty("/EMPSelect");
			var oViewModel = new JSONModel(Emp);
			this.getView().setModel(oViewModel, "homeModel");
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf model.app.Zmodel_test.view.EduDetails
		 */
		onExit: function () {

		}

	});

});