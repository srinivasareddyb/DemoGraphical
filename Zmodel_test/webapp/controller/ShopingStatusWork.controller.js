sap.ui.define([
	"model/app/Zmodel_test/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, Filter, FilterOperator, Sorter, MessageToast) {
	"use strict";
	var that;
	return BaseController.extend("model.app.Zmodel_test.controller.ShopingStatusWork", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf model.app.Zmodel_test.view.ShopingStatusWork
		 */
		onInit: function () {
			var oViewModel = new JSONModel({
				getKiosks: true,
				currKiosk: "",
				showKiosks: true
			});
			this.setModel(oViewModel, "homeModel");
			this.kioskModel = new JSONModel();
			this.grpModel = new JSONModel();
			this.tilesModel = new JSONModel();
			this.oprsModel = new JSONModel();
			this.wcModel = new JSONModel();
			this.getRouter().getRoute("shopingstatus").attachPatternMatched(this._onObjectMatched.bind(this));
			this._machDownDialog = new sap.ui.xmlfragment("model.app.Zmodel_test.view.MachineDown", this);
			this.getView().addDependent(this._machDownDialog);

		},

		onHome: function () {
			this.getRouter().navTo("home", {});
		},

		onNavBack: function () {
			history.go(-1);
		},

		/** 
		 * Called when a segment button is pressed. Shows the relevant view
		 */
		onChangeView: function () {
			var sText = that.byId("viewTabs").getProperty("selectedKey"),
				oViewModel = that.getModel("homeModel");
			// Clear the search input
			if (that.search) {
				that.search.setValue("");
				that.search = undefined;
			}
			that.initFilters();
			// Clear Grouping
			if (that.groups) {
				that.groups.setSelectedKey(that.i18n.getText("all"));
				that.groups = undefined;
			}

			// Set the tiles based on which view is displayed
			if (sText === "Kiosk") {
				oViewModel.setProperty("/showKiosks", true);
				that.tiles = that.byId("tileSet");
				if (oViewModel.getProperty("/currKiosk") === "") {
					that.getKiosks();
				} else {
					that.getGroups();
					that.getData();
				}
			} else {
				oViewModel.setProperty("/showKiosks", false);
				that.tiles = that.byId("allTileSet");
				that.getData(true);
			}
		},
		
		onChangeGroup:function(){
			
		},

		/** 
		 * Called when the Machine Down icon is pressed
		 */
		onMachineDown: function () {
			var data = that.onMainData();
			var oDiagModel = new JSONModel();
			oDiagModel.setData({
				results: data
			});
            that._machDownDialog.setModel(oDiagModel);
			that._machDownDialog.open();
		},

		/** 
		 * Called before the Machine Down dialog is displayed
		 */
		beforeMDOpen: function () {

		},
		
		onCancel:function(){
			that._machDownDialog.close();
		},

		/** 
		 * Gets all the kiosks available
		 */
		getKiosks: function () {
			var oViewModel = that.getModel("homeModel"),
				currTabs = oViewModel.getProperty("/currTabs") || [];

			//Get the data from base controller
			var data = this.onKiosk();

			that.kioskModel.setData(data);
			for (var i = 0; i < data.length; i++) {
				if (currTabs.indexOf(data[i].KioskId) === -1) {
					// add to existing tabs array
					currTabs.push(data[i].KioskId);
					// Finally, add the Kiosk as an Icon Tab Filter
					that.tabs.addItem(new sap.m.IconTabFilter({
						key: data[i].KioskId,
						text: data[i].Description,
						icon: "",
						content: [
							new sap.ui.layout.Grid({
								vSpacing: 0,
								defaultSpan: "XL10 L10 M10 S12",
								content: [
									new sap.m.Select({
										width: "100%",
										change: that.onChangeGroup,
										layoutData: [
											new sap.ui.layout.GridData({
												span: "XL2 L2 M2 S12"
											})
										]
									}).setModel(that.grpModel).bindAggregation("items", "/results", new sap.ui.core.Item({
										key: "{Grouping}",
										text: "{GrpDes}"
									})),
									new sap.m.HBox({
										width: "100%",
										items: [
											new sap.m.SearchField({
												width: "100%",
												placeholder: that.i18n.getText("wc") + " ," + that.i18n.getText("po") + " " +
													that.i18n.getText("or") + " " + that.i18n.getText("stat")
													// liveChange: that.onSearch,
													// search: that.onSearch
											}),
											new sap.m.Button({
												width: "100%",
												icon: "sap-icon://technical-object",
												tooltip: that.i18n.getText("machDownTT"),
												press: that.onMachineDown
											})
										]
									}).addStyleClass("searchBox")
								]
							})
						]
					}));
				}
			}
			that.tiles.setBusy(false);
			// save list of tabs
			oViewModel.setProperty("/currTabs", currTabs);
			// Fire event to select the first Icon Tab Filter by default
			that.tabs.setSelectedKey(data[0].KioskId);
			that.tabs.fireSelect({
				"selectedKey": data[0].KioskId,
				"selectedItem": that.tabs.getItems()[0]
			});

		},

		/** 
		 * Called when a tab is pressed on the Icon Tab Bar
		 * @param {object} oEvent - the event info
		 */
		handleIconTabBarSelect: function (oEvent) {
			var sKey = oEvent.getParameter("selectedKey"),
				oViewModel = that.getModel("homeModel");

			if (oViewModel.getProperty("/currKiosk") !== sKey) {
				// Store selected kiosk in view model
				oViewModel.setProperty("/currKiosk", sKey);
				// Get the groups of this Kiosk
				that.getGroups();
				// Clear the search input
				if (that.search) {
					that.search.setValue("");
					that.search = undefined;
				}
				that.initFilters();
				// Clear Grouping
				if (that.groups) {
					that.groups.setSelectedKey(that.i18n.getText("all"));
					that.groups = undefined;
				}
				// get the data for the tiles
				that.getData();
			}
		},

		/** 
		 * Gets all the Group ID's available based on KioskId selected
		 */
		getGroups: function () {
			var oViewModel = this.getModel("homeModel");
			//Get the data from base controller
			var Data = this.onGroup();
			this.mybay = oViewModel.getProperty("/currKiosk");

			var data = Data.filter(function (Datas) {
				return Datas.KioskId === that.mybay;
			});
			data = [{
				"GrpDes": that.i18n.getText("grps"),
				"KioskId": "",
				"Grouping": that.i18n.getText("all")
			}].concat(data);
			that.grpModel.setData({
				results: data
			});
		},

		/** 
		 * Gets the data to generate tiles
		 * @param {boolean} bAll - check to get all data or not
		 */
		getData: function (bAll) {
			var tileData = this.onMainData();
			this.myselect = this.tabs.getSelectedKey();
			if (!bAll) {
				tileData = tileData.filter(function (Datas) {
					return Datas.KioskId === that.myselect;
				});
			} else {
				tileData = tileData.filter(function (Datas) {
					return Datas.Status === "G";
				});
			}

			// Remove the tiles if no data
			if (tileData.length > 0) {
				that.setTiles(tileData);
			} else {
				that.tiles.removeAllContent();
				MessageToast.show(that.i18n.getText("noDataErr"));
			}
			that.tilesModel.setData({
				results: tileData
			});

		},

		/** 
		 * Adds the needed panels for the specified container based on provided data
		 * @param {object} oData - the data to be used to genrate panels
		 */
		setTiles: function (oData) {
			var oViewModel = that.getModel("homeModel"),
				aContent = [],
				iconURI, tileClass;

			for (var i = 0; i < oData.length; i++) {
				// Set icon, icon state and tile css class
				if (oData[i].Status === "G") {
					iconURI = "sap-icon://accept";
					tileClass = "Green";
				} else if (oData[i].Status === "Y") {
					iconURI = "sap-icon://appear-offline";
					tileClass = "Yellow";
				} else {
					iconURI = "sap-icon://alert";
					tileClass = "Red";
				}

				// Split Operator names to display only first 3
				var aOperators = oData[i].Ename.split(",");
				if (aOperators.length > 3) {
					aOperators = [aOperators[0], aOperators[1], aOperators[2] + " ..."];
				}

				// Create a tile
				var Tile = new sap.m.GenericTile({
					header: oViewModel.getProperty("/showKiosks") ? oData[i].Workcenter : oData[i].KioskId,
					headerImage: iconURI,
					subheader: oData[i].Aufnr,
					//	press: that.getOperations,
					tileContent: [
						new sap.m.TileContent({
							footer: oData[i].Grouping,
							unit: oViewModel.getProperty("/showKiosks") ? "" : oData[i].Workcenter,
							content: [
								new sap.m.Text({
									text: aOperators[0] !== "" ? aOperators.join(",\n") : ""
								})
							]
						})
					]
				}).addStyleClass(tileClass);
				// push Tiles into an array
				aContent.push(Tile);
			}

			// Finally, add the contents to view using a relevant container
			that.tiles.removeAllContent();
			that.tiles.addContent(new sap.ui.layout.Grid({
				width: "100%",
				defaultSpan: "XL2 L3 M4 S6",
				content: aContent
			}).addStyleClass("sapUiTinyMarginTopBottom"));
		},

		/** 
		 * Sets the filters to default values
		 */
		initFilters: function () {
			var oViewModel = this.getModel("homeModel");
			oViewModel.setProperty("/currFilters", {
				group: that.i18n.getText("all"),
				search: ""
			});
		},

		_onObjectMatched: function () {
			that = this;
			this.tabs = this.byId("idIconTabBar");
			this.i18n = this.getResourceBundle();

			// Set default filters
			this.initFilters();
			// Get the tiles based on which View is to be displayed
			this.onChangeView();

		}

	});

});