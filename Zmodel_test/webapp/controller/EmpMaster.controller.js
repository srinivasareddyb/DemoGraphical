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
	return BaseController.extend("model.app.Zmodel_test.controller.EmpMaster", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf model.app.Zmodel_test.view.EmpMaster
		 */
		onInit: function () {
			that = this;
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("nav", "toBeginPage", {
				viewName: this.getView().getProperty("viewName")
			});
			this.EmpModel = new JSONModel();
				var oViewModel = new JSONModel({
				busy: false
			});
			this.setModel(oViewModel, "EmpMaster");

			this.getRouter().getRoute("empmaster").attachPatternMatched(this._onObjectMatched, this);

		},
		_onObjectMatched: function () {

		},
		
		onhandlePress:function(oEvent){
			var oList = this.getView().byId("idEmpList");
			var Eid =  oList.getSelectedItem().getBindingContext().getProperty("Eid");
			GModel.setProperty("/Eid",Eid);
		    var sPath = oEvent.getParameter("listItem").getBindingContextPath();
		    var oData = this.EmpModel.getProperty(sPath);
		    GModel.setProperty("/EMPSelect",oData);
				this.getOwnerComponent().runAsOwner(function () {
				if (!this.detailView) {
					this.detailView = sap.ui.view({
						id: "detailView",
						viewName: "model.app.Zmodel_test.view.EduDetails",
						type: "XML"
					});
					this.bus.publish("flexible", "addDetailPage", this.detailView);
					this.bus.publish("nav", "toDetailPage", {
						viewName: this.detailView.getViewName()
					});
				} else {
					this.bus.publish("nav", "toDetailPage", {
						viewName: this.detailView.getViewName()
					});
					this.detailView.onAfterRendering();
				}
			}.bind(this));
			
		},

		onAfterRendering: function () {
			this.list = this.getView().byId("idEmpList");
			GModel = this.getModel("GModel");
			var data = GModel.getProperty("/EMP");
			this.EmpModel = new JSONModel();
		    this.EmpModel.setData({
		    	results: data
		    });
			this.list.setModel(this.EmpModel);
		}

	});

});