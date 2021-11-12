sap.ui.define(["com/enerpipe/shopfloor/enerpipe/controller/BaseController", "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"],
    function (BaseController, MessageToast, MessageBox, JSONModel, Filter, FilterOperator) {
        "use strict";
        var that = this;
        return BaseController.extend("com.enerpipe.shopfloor.enerpipe.controller.Home", {

            onInit: function () {
                var oViewModel = new JSONModel();
                this.getView().setModel(oViewModel);
                if (!this.oDialoF4) {
                    this.oDialoF4 = sap.ui.xmlfragment("com.enerpipe.shopfloor.enerpipe.view.jobsF4", that);
                    this.getView().addDependent(this.oDialoF4);
                }
                this.oModelResponse = new JSONModel();
                // this._oDialogResponse.setModel(this.oModelResponse);
                this.oModeltableData = new sap.ui.model.json.JSONModel();
                this.oModeltableData1 = new sap.ui.model.json.JSONModel();

                that = this;

                this.getRouter().getRoute("drawing").attachPatternMatched(that._onPatternMatched, that);

            },

            /*
             Navigate to Home Screen
            */
            onNavDrawToHome: function () {
                this.getRouter().navTo("home", {});
            },

            /**
             * @param {Add the record to the Table} oEvent 
             */
            onAdd: function (oEvent) {
                var oTable = this.getView().byId("idJobTitle");
                var oItem = new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Input({
                            showValueHelp: true,
                            valueHelpOnly: true,
                            valueHelpRequest: function (oEV) {
                                that.handleValueHelp(oEV);
                            }
                        }),
                        new sap.m.Text({
                            text: ""
                        }),
                        new sap.m.Input({
                            placeholder: that.getResourceBundle().getText("noOfDraw"),
                            type: "Number",
                            liveChange: function (oEV) {
                                that.onInputLiveChange(oEV);
                            }
                        }), new sap.m.Input({
                            placeholder: that.getResourceBundle().getText("noOfSpools"),
                            type: "Number",
                            liveChange: function (oEV) {
                                that.onInputLiveChange(oEV);
                            }
                        })]
                });
                oTable.addItem(oItem);
            },


            /**
             * @param {F4 Help Job#} oEvent 
             */
            handleValueHelp: function (oEvent) {

                that.oDialoF4.open();
            },

            /**
             * 
             * @param {F4Search} oEvent 
             */
            f4Search: function (oEvent) {
                var sQuery = oEvent.getParameter("value");
                var oBinding = sap.ui.getCore().byId("idJobsList").getBinding("items");
                if (sQuery !== "" && sQuery !== undefined) {
                    var oFilter = new Filter({
                        filters: [
                            new Filter("JobNo", FilterOperator.Contains, sQuery),
                            new Filter("Post1", FilterOperator.Contains, sQuery)
                        ],
                        and: false
                    });
                    oBinding.filter([oFilter]);
                } else {
                    oBinding.filter([]);
                }
            },

            /**
             * 
             * @param {*} oEvent 
             */
            handleF4Confirm: function(oEvent) {
               debugger;  
                /*
                    var oSelItem = oEvent.getParameter("selectedItem");
                            var sSelJob = oSelItem.getTitle();
                            var sSelJobDesc = oSelItem.getDescription();
                            var oFilters = [];
                            var sFilter = new sap.ui.model.Filter({
                                path: "JobNo",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: sSelJob
                            });
                            oFilters.push(sFilter);
                            that.getView().getModel().read("/ET_OVERALL_SPOOLSet", {
                                filters: oFilters,
                                success: function (oData) {
                                    if (oData.results.length > 0) {
                                        that.aSelRow[2].setPlaceholder(oData.results[0].OverallDrawing);
                                        that.aSelRow[3].setPlaceholder(oData.results[0].NoOfSpool);
                                    } else {
                                        that.aSelRow[2].setPlaceholder(that.getResourceBundle().getText("noOfDraw"));
                                        that.aSelRow[3].setPlaceholder(that.getResourceBundle().getText("noOfSpools"));
                                    }
                                }
                            });
                            that.aSelRow[0].setValue(sSelJob);
                            that.aSelRow[1].setText(sSelJobDesc);
                            var oBinding = sap.ui.getCore().byId("idJobsList").getBinding("items");
                            oBinding.filter([]);
                
                */


            },
            /*
             * Close the F4 Job
             */
            handleF4Close: function (oEvent) {
                var oBinding = sap.ui.getCore().byId("idJobsList").getBinding("items");
                oBinding.filter([]);
                that.oDialoF4.close();
            },

            /*
                Live Change the Input
            */
            onInputLiveChange: function (oEvent) {
                var oSource = oEvent.getSource();
                var sInpVal = oSource.getValue();
                if (sInpVal) {
                    if (parseFloat(sInpVal) <= 0) {
                        oSource.setValueState("Error");
                        oSource.setValueStateText(that.getResourceBundle().getText("validationMsg"));
                        // that.oGModel.setProperty("/bShowBt",true);
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
             * @param {Delete the Selected Record} oEvent 
             */
            onDelete: function (oEvent) {
                oEvent.getSource().removeItem(oEvent.getParameter("listItem"));
            },


            /*
             *  
             */
            _onPatternMatched: function () {
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

                sap.ui.getCore().byId("idJobsList").setModel(that.oModeltableData);
                that.oModeltableData.setData({ results: oData });
                /*
                that.oModel = that.getView().getModel();
                sap.ui.getCore().byId("idJobsList").setModel(that.oModeltableData);
                sap.ui.getCore().byId("idJobsTable").setModel(that.oModeltableData1);
                that.oModel.read("/ET_JOBSet", {
                    success: function (oData) {
                        that.oModeltableData.setData({
                            results: oData.results
                        });
                    }
                }); */
            }

        })
    });
