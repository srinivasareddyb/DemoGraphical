sap.ui.define([
	"model/app/Zmodel_test/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"
], function (BaseController, JSONModel, Filter, FilterOperator, Sorter) {
	"use strict";
	var GModel, that;
	return BaseController.extend("model.app.Zmodel_test.controller.Second", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf model.app.Zmodel_test.view.Second
		 */
		onInit: function () {
			this.getRouter().getRoute("second").attachPatternMatched(this._onObjectMatched, this);
			that = this;
		},

		onNavBack: function () {
			history.go(-1);
		},
        
        onMaster:function() {
        this.getRouter().navTo("alldetails", {}); 	
        },	
         
		onSearchEdu: function (oEvent) {
			var value = oEvent.getParameter("newValue");
			var oBinding = this.tableid.getBinding("items");
			var aFilters = GModel.getProperty("/allFilters") || [];
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

		onEmployee: function () {
			this.getRouter().navTo("main", {});
		},

		eduArray: function () {
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
					"Institution": "ALIET",
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
					"Institution": "ALIET",
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
				},{
					"Eid": "211",
					"Edu": "B.Tech",
					"Institution": "ALIET",
					"Yop": "2016-5-25"
				}
			];
			GModel.setProperty("/EDU", this.eduArr);
		},

		_onObjectMatched: function (oEvent) {
			GModel = this.getModel("GModel");
			var Eid = oEvent.getParameter("arguments").Eid;
			var status = [];
			var aFilters = [];
			/*--- Object header Binding start --- */
			var data = GModel.getProperty("/currEmp");
			var oViewModel = new JSONModel(data);
			this.getView().setModel(oViewModel, "homeModel");

			/*--- Object header Binding End --- */

			/*--- Object header status filed Binding Start ---*/
			switch (Eid) {
			case "101":
				status = [{
					Status: "Pass"
				}];
				break;
			case "201":
				status = [{
					Status: "Fail"
				}];
				break;
			case "211":
				status = [{
					Status: "Pass"
				}];
				break;
			default:
				status = [{
					Status: "Hold"
				}];
			}

			var oStatusModel = new JSONModel();
			oStatusModel.setData({
				results: status
			});
			this.getView().setModel(oStatusModel, "secondModel");
			/*--- Object header status filed Binding End ---*/

			/*-- Education Detail Binding start---*/
			if (!GModel.getProperty("/EduLoad")) {
				GModel.setProperty("/EduLoad", false);
				this.eduArray();
				GModel.setProperty("/EduLoad", true);
			}
			this.tableid = this.byId("idTable2");
			this.eduModel = new JSONModel();
			this.eduModel.setData({
				results: this.eduArr
			});
			that.tableid.setModel(this.eduModel);
			var oBinding = that.tableid.getBinding("items");
			var oFilter = new Filter("Eid", FilterOperator.EQ, Eid);
			aFilters.push(oFilter);
			GModel.setProperty("/allFilters", aFilters);
			oBinding.filter([oFilter]);
		}

	});

});