sap.ui.define([
    "com/enerpipe/shopfloor/enerpipe/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, MessageToast, MessageBox, JSONModel, Filter, FilterOperator) {
    'use strict';
    var that = this;
    return BaseController.extend("com.enerpipe.shopfloor.enerpipe.controller.Draft", {

        onInit: function () {
            this.oModeltableData = new sap.ui.model.json.JSONModel();
            this.oModeltableData.setSizeLimit(500);
            if (!this._oDialogResponse) {
            	this._oDialogResponse = sap.ui.xmlfragment("com.enerpipe.shopfloor.enerpipe.view.response", this);
            	this.getView().addDependent(this._oDialogResponse);
            }
            this.oModelResponse = new JSONModel();
            this._oDialogResponse.setModel(this.oModelResponse);
            this.tableData = [];
            that = this;
            this.getRouter().getRoute("draft").attachPatternMatched(this._onPatternMatched.bind(this));
        },

        /** 
		 * called when clicked on save button on footer
		 * send the list items in table to backend and shows the response back to user
		 */
		onSave: function () {
			var oItems = that.getView().byId("jobTable").getItems();
			var oModel = that.getView().getModel();
			var respArray = [];
			// oModel.setUseBatch(true);
			if (oItems.length > 0) {
				that.bCaughtChanges = false;
				that.failedValation = false;
				for (var i = 0; i < oItems.length; i++) {
					var sSpoolDrafted = parseFloat(oItems[i].getCells()[4].getValue());
					if (sSpoolDrafted <= 0) {
						that.failedValation = true;
					}

					if ((parseFloat(sSpoolDrafted) !== parseFloat(oItems[i].getBindingContext().getProperty("SpoolDraft"))) && sSpoolDrafted > 0) {
						var oEntry = {
							"JobNo": oItems[i].getBindingContext().getProperty("JobNo"),
							"SpoolDraft": oItems[i].getCells()[4].getValue()
						};
						respArray.push(oEntry);

						/*      	var oEntry = {};
						oEntry.JobNo = oItems[i].getBindingContext().getProperty("JobNo");
						oEntry.OverallDrawing = oItems[i].getBindingContext().getProperty("OverallDrawing");
						oEntry.NoOfSpool = oItems[i].getBindingContext().getProperty("NoOfSpool");
						oEntry.SpoolDraft = oItems[i].getCells()[4].getValue();
						that.bCaughtChanges = true;
						oModel.createEntry("/ET_SPOOL_DRAFTSet", {
							properties: {
								JobNo: oEntry.JobNo,
								OverallDrawing: oEntry.OverallDrawing,
								NoOfSpool: oEntry.NoOfSpool,
								SpoolDraft: oEntry.SpoolDraft
							}
						});
			       */
					} else if (that.failedValation && i === (oItems.length - 1)) {
						MessageBox.warning("overall drawings and no.of spools should not be 0!", {
							title: "Input Validation", // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					}
				}

				that.oModelResponse.setData({
					Response: respArray
				});
				that._oDialogResponse.open();

				/*if (that.bCaughtChanges) {
					oModel.submitChanges({
						success: function (odata) {
							oModel.setUseBatch(false);
							if (odata.__batchResponses) {
								var data = odata.__batchResponses[0].__changeResponses;
								if (data) {
									var respArray = [];
									for (var j = 0; j < data.length; j++) {
										if (data[j].data.SpoolDraft == "0") {
											data[j].data.SpoolDraft = 'Failed';
										} else {
											data[j].data.SpoolDraft = 'Success';
										}
										respArray.push(data[j].data);
									}
									that.oModelResponse.setData({
										Response: respArray
									});
									that._oDialogResponse.open();
								} else {
									MessageToast.show(that.getResourceBundle().getText("failMsg"));
								}
							} else {
								MessageToast.show(that.getResourceBundle().getText("failMsg1"));
							}
						},
						error: function (oResponse) {
							oModel.setUseBatch(false);
							MessageToast.show(that.getResourceBundle().getText("failMsg"));
						}
					});
				} else {
					MessageToast.show(that.getResourceBundle().getText("failMsg1"));
				}
				*/

			} else {
				MessageToast.show(that.getResourceBundle().getText("warnMsg"));
			}
		},
		/** 
		 * on closing the response dialog
		 * clearing the previous data
		 */
		onResponseFragClose: function () {
			that.oModelResponse.setData({
				Response: []
			});
			that._onPatternMatched();
			that._oDialogResponse.close();
		},

        /**
         * Navigate to Home Screen
         **/          
        onNavDratToHome:function(){
            this.getRouter().navTo("home",{});
        },

        /**
         * Table level Spool Draft livechange 
         * @param {*} oEvent
         */
        onInputLiveChange: function (oEvent) {
            var oSource = oEvent.getSource();
            var sInpVal = oSource.getValue();
            var sSpools = oSource.getBindingContext().getProperty("NoOfSpool");
            if (sInpVal) {
                if (parseFloat(sInpVal) <= 0) {
                    oSource.setValueState("Error");
                    oSource.setValueStateText(that.getResourceBundle().getText("validationMsg"));
                    // that.oGModel.setProperty("/bShowBt",true);
                } else if (parseFloat(sInpVal) > parseFloat(sSpools)) {
                    oSource.setValueState("Error");
                    oSource.setValueStateText(that.getResourceBundle().getText("validationMsg1") + parseFloat(sSpools) + " (" + that.getResourceBundle().getText("noOfSpools") + ")");
                } else {
                    oSource.setValueState("None");
                    oSource.setValueStateText();
                    // that.oGModel.setProperty("/bShowBt",true);
                }
            } else {
                oSource.setValueState("None");
                oSource.setValueStateText();
                // that.oGModel.setProperty("/bShowBt",true);
            }
        },



        /**
         * Search functionality for Job# and Job Des
         * @param {*} oEvent 
         */
        onSearch: function (oEvent) {
            var query = oEvent.getParameter("newValue");
            var oBinding = that.getView().byId("jobTable").getBinding("items");
            if (query !== "" && query !== undefined) {
                var oFilter = new Filter({
                    filters: [
                        new Filter("JobNo", FilterOperator.Contains, query),
                        new Filter("Post1", FilterOperator.Contains, query)
                    ],
                    and: false
                });
                oBinding.filter([oFilter]);
            } else {
                oBinding.filter([]);
            }
        },
        /** 
            
        **/
        _onPatternMatched: function () {
            that.getView().byId("jobTable").setModel(that.oModeltableData);
            that.oModeltableData.setData({
                results: []
            });

            var oData = [{
                "JobNo": "02090022",
                "OverallDrawing": "2.0",
                "NoOfSpool": "130.0",
                "SpoolDraft": "75.0",
                "Post1": "Iracore Suncor 8 inch Line 29 spools"
            }, {
                "JobNo": "02090074",
                "OverallDrawing": "1.0",
                "NoOfSpool": "8.0",
                "SpoolDraft": "8.0",
                "Post1": "Iracore CNRL Expansion Barrels"
            }, {
                "JobNo": "02090077",
                "OverallDrawing": "207.0",
                "NoOfSpool": "956.0",
                "SpoolDraft": "956.0",
                "Post1": "PSI Graphics Packaging Project"
            }, {
                "JobNo": "02090081",
                "OverallDrawing": "75.0",
                "NoOfSpool": "200.0",
                "SpoolDraft": "0.0",
                "Post1": "TIC Kiewit Seminole Combined Cycle"
            }, {
                "JobNo": "02090083",
                "OverallDrawing": "2.0",
                "NoOfSpool": "3.0",
                "SpoolDraft": "3.0",
                "Post1": "Iracore Iracoupling Test Spool"
            }];
            //var sPath = jQuery.sap.getModulePath("com.enerpipe.shopfloor.sf_ep_spools_drafted_m", "/model/Data.json");
            //var oJSONModel = new JSONModel();
            // var oData = oJSONModel.getData().JobList;
            oData.forEach(function (row) {
                row.SpoolDraftNew = "";
            }, that);
            that.oModeltableData.setData({
                results: oData
            });
			/*
			that.getView().getModel().read("/ET_OVERALL_SPOOLSet", {
				success: function (oData) {
					oData.results.forEach(function (row) {
						row.SpoolDraftNew = "";
					}, that);
					that.oModeltableData.setData({
						results: oData.results
					});
				}
			});*/
        }
    })
});