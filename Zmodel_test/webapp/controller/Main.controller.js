sap.ui.define([
	"model/app/Zmodel_test/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, Filter, FilterOperator, Sorter, MessageToast) {
	"use strict";

	return BaseController.extend("model.app.Zmodel_test.controller.Main", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf model.app.Zmodel_test.view.Main
		 */
		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("flexible", "addBeginPage", this.addBeginPage, this);
			this.bus.subscribe("flexible", "addDetailPage", this.addDetailPage, this);
			this.bus.subscribe("nav", "toBeginPage", this.toBeginPage, this);
			this.bus.subscribe("nav", "toDetailPage", this.toDetailPage, this);
			this.bus.subscribe("nav", "backToBegin", this.backToBegin, this);

			this.oFlexibleColumnLayout = this.byId("fcl");
			this.getRouter().getRoute("main").attachPatternMatched(this._onObjectMatched, this);
		},

		onExit: function () {
			this.bus.unsubscribe("flexible", "addBeginPage", this.addBeginPage, this);
			this.bus.unsubscribe("flexible", "addDetailPage", this.addDetailPage, this);
			this.bus.unsubscribe("nav", "toBeginPage", this.toBeginPage, this);
			this.bus.unsubscribe("nav", "toDetailPage", this.toDetailPage, this);
			this.bus.unsubscribe("nav", "backToBegin", this.backToBegin, this);
		},

		/** 
		 * To set the master page
		 * @param {string} sChannel - Event channel
		 * @param {string} sEvent - Event name
		 * @param {object} oView - View to be displayed
		 */
		addBeginPage: function (sChannel, sEvent, oView) {
			this.oFlexibleColumnLayout.addBeginColumnPage(oView);
		},

		/** 
		 * Lazy loader for the mid page - only on demand (when the user clicks)
		 * @param {string} sChannel - Event channel
		 * @param {string} sEvent - Event name
		 * @param {object} oView - View to be displayed
		 */
		addDetailPage: function (sChannel, sEvent, oView) {
			var pages = this.oFlexibleColumnLayout.getMidColumnPages();
			var flag = false;
			for (var i = 0; i < pages.length; i++) {
				if (pages[i].getProperty("viewName") === oView.getViewName()) {
					flag = true;
					break;
				} else {
					flag = false;
				}
			}
			if (!flag) {
				this.oFlexibleColumnLayout.addMidColumnPage(oView);
			}
		},

		/** 
		 * To initialize master page
		 * @param {string} sChannel - Event channel
		 * @param {string} sEvent - Event name
		 * @param {object} oView - View to be displayed
		 */
		toBeginPage: function (sChannel, sEvent, oView) {
			var pages = this.oFlexibleColumnLayout.getBeginColumnPages();
			for (var i = 0; i < pages.length; i++) {
				if (pages[i].getProperty("viewName") === oView.viewName) {
					this.oFlexibleColumnLayout.toBeginColumnPage(this.oFlexibleColumnLayout.getBeginColumnPages()[i]);
					break;
				}
			}
		},
		/** 
		 * To get the required detail page
		 * @param {string} sChannel - Event channel
		 * @param {string} sEvent - Event name
		 * @param {object} oView - View to be displayed
		 */
		toDetailPage: function (sChannel, sEvent, oView) {
			var pages = this.oFlexibleColumnLayout.getMidColumnPages();
			for (var i = 0; i < pages.length; i++) {
				if (pages[i].getProperty("viewName") === oView.viewName) {
					this.oFlexibleColumnLayout.toMidColumnPage(this.oFlexibleColumnLayout.getMidColumnPages()[i]);
					break;
				}
			}
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);
		},

		/** 
		 * To show only the master page
		 */
		backToBegin: function () {
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
		},

		onNavBack: function () {
		// var sPreviousHash = History.getInstance().getPreviousHash(),
		// 		oCrossAppNavigator;
		// 	if(sap.ushell){
		// 		oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
		// 	}
		// 	if (sPreviousHash !== undefined || (oCrossAppNavigator && !oCrossAppNavigator.isInitialNavigation())) {
		// 		history.go(-1);
		// 	} else {
				this.getRouter().navTo("home", {});
			// }
		},
		_onObjectMatched: function () {
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
			var pages = this.oFlexibleColumnLayout.getBeginColumnPages();
			if (pages.length < 1) {
				this.getOwnerComponent().runAsOwner(function () {
					this.masterView = sap.ui.view({
						id: "masterView",
						viewName: "model.app.Zmodel_test.view.EmpMaster",
						type: "XML"
					});
					this.oFlexibleColumnLayout.addBeginColumnPage(this.masterView);
				}.bind(this));
			} else {
				this.oFlexibleColumnLayout.toBeginColumnPage(pages[0]);
				pages[0].onAfterRendering();
			}
		}

	});

});