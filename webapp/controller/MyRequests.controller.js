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
                this.getOwnerComponent().getRouter().getRoute("myRequests").attachPatternMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function () {
                this.getView().byId("idSTMyRequests").rebindTable(true);
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
            },
            onBeforeRebindTable: async function (oEvent) {
                var mBindingParams = oEvent.getParameter("bindingParams"),
                    oModel = this.getOwnerComponent().getModel();
                var oUserModel = this.getOwnerComponent().getModel("userModel");
                if (!oUserModel.getProperty("/userid")) {
                    await this.getUser();
                }
                var aFilter = [];
                var newFilter = new Filter("createdBy", FilterOperator.EQ, oUserModel.getProperty("/userid"));
                // }
                mBindingParams.filters.push(newFilter);

                oModel.attachRequestFailed(this._showError, this);
                oModel.attachRequestCompleted(this._detach, this);
            },
            _showError: function (oResponse) {
                var oModel = this.getOwnerComponent().getModel(),
                    oMsgs = oResponse.getSource().getMessagesByEntity("/Request");
                if (oMsgs[0]) {
                    MessageBox.error(oMsgs[0].message);
                    oModel.detachRequestFailed(this._showError, this);
                }
            },
            _detach: function (oEvent) {
                var oModel = this.getOwnerComponent().getModel();
                if (oEvent.getParameter("success") === true) {
                    oModel.detachRequestFailed(this._showError, this);
                }
                oModel.detachRequestCompleted(this._detach, this);
            },
            getUser: async function () {
                var oModel = this.getOwnerComponent().getModel();
                const info = await $.get(oModel.sServiceUrl + '/getUserDetails');
                if (info.d) {
                    this.getOwnerComponent().getModel("userModel").setProperty("/userid", info.d.getUserDetails);
                }
            }
        });
    });
