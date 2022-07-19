sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/ferrero/zibanreq/model/models"
],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("com.ferrero.zibanreq.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                this.getUser();
            },
            getUser: async function () {
                var oModel = this.getModel();
                const info = await $.get(oModel.sServiceUrl + '/User_Vendor_V');
                if (info.d) {
                    this.getModel("userModel").setProperty("/userDetail", info.d.results[0]);
                }
            }
        });
    }
);