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
	return BaseController.extend("model.app.Zmodel_test.controller.Home", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf model.app.Zmodel_test.view.Home
		 */
		onInit: function () {
			this.oTable = this.byId("idTable");
			this.tModel = new JSONModel();

			this.getRouter().getRoute("home").attachPatternMatched(this._onObjectMatched, this);

		},

		onMaster: function () {
			this.getRouter().navTo("alldetails", {});
		},
		
		/**
		 * Nav to comboBox Screen 
		 */ 
		 onComboBox:function(){
		   this.getRouter().navTo("combox", {});	
		 },
		
		//
		onEmpSelect: function (oEvent) {
			var Eid = oEvent.getParameter("listItem").getBindingContext().getProperty("Eid"),
				sPath = oEvent.getParameter("listItem").getBindingContextPath(),
				oData = that.tModel.getProperty(sPath);
			this.getModel("GModel").setProperty("/currEmp", oData);
			this.getRouter().navTo("second", {
				Eid: Eid
			});
		},

		// Live change  the data
		onSearch: function (oEvent) {
			var value = oEvent.getParameter("newValue");
			var oBinding = this.oTable.getBinding("items");
			if (value !== "" && value !== undefined) {
				var oFilter = new Filter({
					filters: [
						new Filter("Eid", FilterOperator.Contains, value),
						new Filter("Name", FilterOperator.Contains, value),
						new Filter("City", FilterOperator.Contains, value)
					],
					and: false
				});

				oBinding.filter([oFilter]);
			} else {
				oBinding.filter([]);
			}
		},
		// Shoping Application
		onShopingApp: function () {
			this.getRouter().navTo("shopingstatus", {});
		},

		_onObjectMatched: function () {
			this.oTable.removeSelections();
			GModel = this.getModel("GModel");
			that = this;
			var data = [{
				Eid: "101",
				Name: "Srinivas",
				Phone: "1234569874",
				City: "Hyd",
				Email: "abc@gmail.com"
			}, {
				Eid: "201",
				Name: "Raju",
				Phone: "7894561234",
				City: "Bng",
				Email: "Rishi@gmail.com"
			}, {
				Eid: "211",
				Name: "Vasu",
				Phone: "7894561234",
				City: "Hyd",
				Email: "Rani@gmail.com"
			}];

			this.tModel.setData({
				results: data
			});

			that.oTable.setModel(that.tModel);
			GModel.setProperty("/EMP", data);
		}

	});

});