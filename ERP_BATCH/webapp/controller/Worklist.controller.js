sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, MessageToast) {
	"use strict";
	var oModel, oTable;
	return BaseController.extend("erp.com.ERP_BATCH.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oViewModel;

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			//	iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");
		},

		onCreate: function () {
			oModel = this.getView().getModel();
			oTable = this.byId("table");
			// oModel.setUseBatch(true);
			if (oModel.hasPendingChanges()) {
				oModel.resetChanges();
			}
			for (var i = 0; i < oTable.getSelectedItems().length; i++) {
				var oEntry = {};
				oEntry.Mandt = "800";
				oEntry.Eid = oTable.getSelectedItems()[i].getBindingContext().getProperty("Eid");
				oEntry.Name = oTable.getSelectedItems()[i].getBindingContext().getProperty("Name");
				oEntry.Phone = oTable.getSelectedItems()[i].getBindingContext().getProperty("Phone");
				oEntry.City = oTable.getSelectedItems()[i].getBindingContext().getProperty("City");
				oEntry.State = oTable.getSelectedItems()[i].getBindingContext().getProperty("State");
				oEntry.Country = oTable.getSelectedItems()[i].getBindingContext().getProperty("Country");
				oEntry.Flag = oTable.getSelectedItems()[i].getBindingContext().getProperty("Flag");
				oModel.createEntry("/EMPSet", {
					properties: {
						Mandt: oEntry.Mandt,
						Eid: oEntry.Eid,
						Name: oEntry.Name,
						Phone: oEntry.Phone,
						City: oEntry.City,
						State: oEntry.State,
						Country: oEntry.Country,
						Flag: oEntry.Flag
					}
				});
			}

			sap.ui.core.BusyIndicator.show();
			oModel.submitChanges({
				//    groupId: "mygrpid",
				success: function (odata) {
					sap.ui.core.BusyIndicator.hide();
					// oModel.setUseBatch(false);
				},
				error: function (oResponse) {
					sap.ui.core.BusyIndicator.hide();
					// oModel.setUseBatch(false);
				}
			});

			MessageToast.show("Create");
		},

		onDelete: function () {
			oModel = this.getView().getModel();
			oTable = this.byId("table");
			//	oModel.setUseBatch(true);
			if (oModel.hasPendingChanges()) {
				oModel.resetChanges();
			}

			var mParameters = {};
			for (var i = 0; i < oTable.getSelectedItems().length; i++) {
				var oEntry = {};
				oEntry.Mandt = "800";
				oEntry.Eid = oTable.getSelectedItems()[i].getBindingContext().getProperty("Eid");
				oEntry.Name = oTable.getSelectedItems()[i].getBindingContext().getProperty("Name");
				oEntry.Phone = oTable.getSelectedItems()[i].getBindingContext().getProperty("Phone");
				oEntry.City = oTable.getSelectedItems()[i].getBindingContext().getProperty("City");
				oEntry.State = oTable.getSelectedItems()[i].getBindingContext().getProperty("State");
				oEntry.Country = oTable.getSelectedItems()[i].getBindingContext().getProperty("Country");
				oEntry.Flag = oTable.getSelectedItems()[i].getBindingContext().getProperty("Flag");
				mParameters.groupId = "deleteGroup";
				oModel.remove("/EMPSet(Eid='" + oEntry.Eid + "')", mParameters);
			}
			sap.ui.core.BusyIndicator.show();
			oModel.setDeferredGroups(["deleteGroup", "myGroupId2"]);
			oModel.submitChanges({
				groupId: "deleteGroup",
				success: function (odata, oRes) {
					sap.ui.core.BusyIndicator.hide();
					var a = oData.__batchResponses[0].response.body.split("message")[2].split(',"propertyref"')[0].split(":")[1].split('"')[1];
					if (a === "Yes") {
						sap.m.MessageToast.show("Deleted Successfully");
					} else if (a === "No") {
						sap.m.MessageToast.show("Delete Fail");
					}

					//	oModel.setUseBatch(false);
				},
				error: function (oResponse) {
					sap.ui.core.BusyIndicator.hide();
					//	oModel.setUseBatch(false);
				}
			});
		},

		onUpdate: function () {
			oModel = this.getView().getModel();
			oTable = this.byId("table");
			oModel.setUseBatch(true);
			var mParameters = {};
			for (var i = 0; i < oTable.getSelectedItems().length; i++) {
				var oEntry = {};
				oEntry.Mandt = "800";
				oEntry.Eid = oTable.getSelectedItems()[i].getBindingContext().getProperty("Eid");
				oEntry.Name = oTable.getSelectedItems()[i].getBindingContext().getProperty("Name");
				oEntry.Phone = oTable.getSelectedItems()[i].getBindingContext().getProperty("Phone");
				oEntry.City = oTable.getSelectedItems()[i].getBindingContext().getProperty("City");
				oEntry.State = oTable.getSelectedItems()[i].getBindingContext().getProperty("State");
				oEntry.Country = oTable.getSelectedItems()[i].getBindingContext().getProperty("Country");
				oEntry.Flag = oTable.getSelectedItems()[i].getBindingContext().getProperty("Flag");
				mParameters.groupId = "updateGroup";
				oModel.update("/EMPSet(Eid='" + oEntry.Eid + "')", oEntry, mParameters);
			}
			sap.ui.core.BusyIndicator.show();
			oModel.setDeferredGroups(["updateGroup"]);
			oModel.submitChanges({
				groupId: "updateGroup",
				success: function (odata, oRes) {
					sap.ui.core.BusyIndicator.hide();
					var a = oData.__batchResponses[0].response.body.split("message")[2].split(',"propertyref"')[0].split(":")[1].split('"')[1];
					if (a === "Yes") {
						sap.m.MessageToast.show("updated Successfully");
					} else if (a === "No") {
						sap.m.MessageToast.show("update Fail");
					}
					oModel.setUseBatch(false);
				},
				error: function (oResponse) {
					sap.ui.core.BusyIndicator.hide();
					oModel.setUseBatch(false);
				}
			});
		}

	});
});