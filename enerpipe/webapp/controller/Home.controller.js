sap.ui.define([ "com/enerpipe/shopfloor/enerpipe/controller/BaseController","sap/ui/model/json/JSONModel"],
function(BaseController,JSONModel){
	"use strict";
    return BaseController.extend("com.enerpipe.shopfloor.enerpipe.controller.Home",{
      
        onInit:function(){
             var oViewModel = new JSONModel();
             this.getView().setModel(oViewModel);
        },

        onDraftPress:function(){
            this.getRouter().navTo("draft",{});
        },
        onDrawingPress:function(){
            this.getRouter().navTo("drawing",{});
        }

    })
});