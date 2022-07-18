sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, Sorter, FilterOperator) {
        "use strict";

        return Controller.extend("com.ferrero.zibanreq.controller.MyRequests", {
            onInit: function () {

            },
            onpressAddAccount: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("addNewAccount")
            },
            onPressHome: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteHome")
            },
            onSearch: function (oEvent) {
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("iban", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }
                var oList = this.byId("idrequestsData");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            },
            onPressDownloadLink: function (oEvent) {
                var refId = oEvent.getSource().getBindingContext().getObject().linkToAttach_uuid;
                var oModel = this.getOwnerComponent().getModel();
                var sServiceUrl = oModel.sServiceUrl + "/RequestAttachments(guid'" + refId + "')/$value";
                sap.m.URLHelper.redirect(sServiceUrl);
            }
        });
    });
