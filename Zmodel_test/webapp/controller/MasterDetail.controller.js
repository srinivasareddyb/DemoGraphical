sap.ui.define([
	"model/app/Zmodel_test/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageToast",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format"

], function (BaseController, JSONModel, Filter, FilterOperator, Sorter, MessageToast, ChartFormatter, Format) {
	// "sap/viz/ui5/format/ChartFormatter",
	// "sap/viz/ui5/api/env/Format"
	"use strict";
	var GModel, that;
	return BaseController.extend("model.app.Zmodel_test.controller.MasterDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf model.app.Zmodel_test.view.MasterDetail
		 */
		onInit: function () {
			this.emp = new JSONModel();
			this.edu = new JSONModel();
			this.head = new JSONModel();
			this.btech = new JSONModel();
			this.pieModel = new JSONModel();
			this.barModel = new JSONModel();
			this.stockModel = new JSONModel();
			this.pieData = [];
			this.getRouter().getRoute("alldetails").attachPatternMatched(this._onObjectMatched, this);

		},

		/**
		 * 
		 * Navigate to back
		 * */
		onNavBack: function () {
			// Clear the model
			this.emp.setData({
				results: []
			});
			this.empid.setModel(this.emp);
			history.go(-1);
		},

		/**
		 * Update function calling  
		 * */
		getFirstItemSelected: function () {
			var oFirstItem = this.empid.getItems()[0];
			this.empid.setSelectedItem(oFirstItem, true);
			this.onSelect();
		},

		/**
		 *  Select Item base data fetching
		 * 
		 **/
		onSelect: function () {
			this.byId("idForm").setVisible(false);
			this.pieId.setVisible(false);
			this.iconId.setVisible(false);
			this.cbarId.setVisible(false);
			var eid = this.empid.getSelectedItems()[0].getBindingContext().getProperty("Eid");
			var edudata = GModel.getProperty("/EDU");
			this.edu.setData({
				results: edudata
			});
			this.eduid.setModel(this.edu);
			var oBinding = this.eduid.getBinding("items");
			var oFilter = new Filter("Eid", FilterOperator.EQ, eid);
			oBinding.filter([oFilter]);
			// this.eduid.attachEventOnce("updateFinished", function () {
			// 	 that.onButtonEnable();
			// });
			var sPath = this.empid.getSelectedItems()[0].getBindingContextPath();
			var oData = this.emp.getProperty(sPath);
			var oViewModel = new JSONModel(oData);
			this.getView().setModel(oViewModel, "homeModel");
			/* --- Status logic*/
			var status = [];
			switch (eid) {
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
		},

		/**
		 * Press on emp list
		 * */
		onhandlePress: function () {
			this.onSelect();
		},

		/**
		 *   Click on the  Button at Btech
		 * 
		 **/
		onMarks: function (oEvent) {
			that.Eid = oEvent.getSource().getBindingContext().getProperty("Eid");
			if (!this._MarksDialog) {
				this._MarksDialog = sap.ui.xmlfragment("model.app.Zmodel_test.view.MarksFragment", this);
				this.getView().addDependent(this._MarksDialog);
				this._MarksDialog.setModel(this.btech);
			}

			this._MarksDialog.open();
		},

		/**
		 *  After dialog open
		 * 
		 */
		onAfterOpenDialog: function () {
			var Btech = this.onBtechPer(),
				data = Btech.filter(function (oEntry) {
					return oEntry.Eid === that.Eid;
				});
			data = [{
				"Eid": data[0].Eid,
				"Edu": data[0].Edu,
				"First": data[0].First,
				"Second": data[0].Second,
				"Third": data[0].Third,
				"Four": data[0].Four,
				"Title": "Btech Marks of " + '" ' + data[0].Eid + ' " ',
				"Avg": ((+data[0].First + +data[0].Second + +data[0].Third + +data[0].Four) / 4)
			}];

			that.btech.setData(data[0]);
			that._MarksDialog.setModel(that.btech, "Dia");
		},

		/***
		 *  SSC press time
		 *  
		 **/

		onSSCPress: function (oEvent) {
			var SSC = this.onAllMarks();
			var Form = this.byId("idForm");
			that.id = oEvent.getSource().getBindingContext().getProperty("Eid");
			Form.setVisible(true);
			this.iconId.setVisible(true);
			this.cbarId.setVisible(true);
			this.pieId.setVisible(true);
			SSC = SSC.filter(function (oEntry) {
				return oEntry.Eid === that.id;
			});
			var sscModel = new JSONModel();
			sscModel.setData(SSC[0]);
			Form.setModel(sscModel, "Form");

			this.pieData = [{
				"Subject": "English",
				"Marks": SSC[0].English
			}, {
				"Subject": "Telugu",
				"Marks": SSC[0].Telugu
			}, {
				"Subject": "Maths",
				"Marks": SSC[0].Maths
			}, {
				"Subject": "Social",
				"Marks": SSC[0].Social
			}, {
				"Subject": "Science",
				"Marks": SSC[0].Science
			}, {
				"Subject": "Hindi",
				"Marks": SSC[0].Hindi
			}];

			this.onTabChange();

		},

		/**
		 *  Icon tab changing
		 * 
		 **/
		onTabChange: function () {
			var key = that.getView().byId("idIconTabBar").getSelectedKey();
			if (key === "Pie") {
				this.pieModel.setData({
					results: that.pieData
				});

				this.pieId.setModel(that.pieModel);

				this.pieId.setVizProperties({
					plotArea: {
						dataLabel: {
							visible: true
						}
					},
					title: {
						visible: true,
						text: "Marks"
					}
				});
			} else if (key === "Bar") {
				this.cbarId.setVisible(true);
				this.barModel.setData({
					results: that.pieData
				});
				this.cbarId.setModel(this.barModel);

				this.cbarId.setVizProperties({
					plotArea: {
						dataLabel: {
							visible: true
						}
					},
					title: {
						visible: true,
						text: "Employee Marks"
					}
				});
			} else if (key === "Stock") {
				this.stockid.setVisible(true);
				var data = [{
					Records: "20",
					Group: "Dealy",
					DelayName: "PO Delay"
				}, {
					Records: "100",
					Group: "NODealy",
					DelayName: "PO Delay"
				}, {
					Records: "10",
					Group: "Dealy",
					DelayName: "Vendor Delay"
				}, {
					Records: "20",
					Group: "NODealy",
					DelayName: "Vendor Delay"
				}, {
					Records: "20",
					Group: "Dealy",
					DelayName: "Material Delay"
				}, {
					Records: "25",
					Group: "NODealy",
					DelayName: "Material Delay"
				}];

				this.stockModel.setData({
					results: data
				});
			
			//	var formatPattern = ChartFormatter.DefaultPattern;
				that.stockid.setVizProperties({
					plotArea: {
						dataLabel: {
							formatString: ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
							visible: true,
							showTotal: false
						}
					},
					valueAxis: {
						label: {
							formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
						},
						title: {
							visible: false
						}
					},
					valueAxis2: {
						label: {
							formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
						},
						title: {
							visible: false
						}
					},
					categoryAxis: {
						title: {
							visible: false
						}
					},
					title: {
						visible: false,
						text: "Revenue by City and Store Name"
					}
				});
	this.stockid.setModel(that.stockModel);
			}
		},

		/**
		 *   Dialog close
		 **/
		onHandleClose: function () {
			this._MarksDialog.close();
		},
		/**
		 *  
		 *  Object match function
		 **/
		_onObjectMatched: function () {
			GModel = this.getModel("GModel");
			this.empid = this.byId("idEmpList");
			this.eduid = this.byId("idEdu");
			this.pieId = this.byId("idVizFramePie");
			this.cbarId = this.byId("idVizFrameBar");
			this.stockid = this.byId("idVizFrameStock");
			this.iconId = this.byId("idIconTabBar");
			this.pieId.setVisible(false);
			this.cbarId.setVisible(false);
			this.iconId.setVisible(false);
			var empdata = GModel.getProperty("/EMP");
			this.emp.setData({
				results: empdata
			});
			this.empid.setModel(this.emp);
			that = this;
			this.empid.attachEventOnce("updateFinished", function () {
				that.getFirstItemSelected();
			});
			// Clear the data
			this.edu.setData({
				results: []
			});
			this.eduid.setModel(this.edu);

			this.pieModel.setData({
				results: []
			});
			this.pieId.setModel(that.pieModel);

			this.barModel.setData({
				results: []
			});
			this.cbarId.setModel(that.barModel);

		}

	});

});