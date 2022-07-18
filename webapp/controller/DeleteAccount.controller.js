sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageStrip"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, MessageStrip) {
        "use strict";

        return Controller.extend("com.ferrero.zibanreq.controller.DeleteAccount", {
            onInit: function () {

            },
            onPressHome: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteHome")
            },
            onPressMyRequest: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("myRequests")
            },

            onSubmitDelete: function () {
                this.validateIBAN();
            },
            validateIBAN: function () {
                var sCoordinateValue = this.getView().byId("coordinateNo").getValue();
                if (sCoordinateValue == '') {
                    this.getView().byId("message").setText("IBAN cannot be blank");
                    this.getView().byId("message").setVisible(true);
                    this.getView().byId("message1").setVisible(false);
                } else if (sCoordinateValue.length < 15) {
                    this.getView().byId("message").setText(" IBAN Validation Error!! IBAN should contains atleast 15 character ");
                    this.getView().byId("message").setVisible(true);
                    this.getView().byId("message1").setVisible(false);
                }
                else {
                    this.isValidIBANNumber(sCoordinateValue);
                    if (this.isValidIBANNumber(sCoordinateValue) == true) {
                        this.getView().byId("message1").setText("IBAN IS CORRECT");
                        this.getView().byId("message1").setVisible(true);
                        this.getView().byId("message").setVisible(false);
                    } else if (this.isValidIBANNumber(sCoordinateValue) == false) {
                        this.getView().byId("message").setText("Invalid IBAN, PLease enter the Valid One");
                        this.getView().byId("message").setVisible(true);
                        this.getView().byId("message1").setVisible(false);
                    }
                }
            },
            isValidIBANNumber: function (value) {
                var iban = value.replace(/ /g, "").toUpperCase(),
                    ibancheckdigits = "",
                    leadingZeroes = true,
                    cRest = "",
                    cOperator = "",
                    countrycode, ibancheck, charAt, cChar, bbanpattern, bbancountrypatterns, ibanregexp, i, p;
                var minimalIBANlength = 5;
                if (iban.length < minimalIBANlength) {
                    return false;
                }
                countrycode = iban.substring(0, 2);
                bbancountrypatterns = {
                    "AL": "\\d{8}[\\dA-Z]{16}",
                    "AD": "\\d{8}[\\dA-Z]{12}",
                    "AT": "\\d{16}",
                    "AZ": "[\\dA-Z]{4}\\d{20}",
                    "BE": "\\d{12}",
                    "BH": "[A-Z]{4}[\\dA-Z]{14}",
                    "BA": "\\d{16}",
                    "BR": "\\d{23}[A-Z][\\dA-Z]",
                    "BG": "[A-Z]{4}\\d{6}[\\dA-Z]{8}",
                    "CR": "\\d{17}",
                    "HR": "\\d{17}",
                    "CY": "\\d{8}[\\dA-Z]{16}",
                    "CZ": "\\d{20}",
                    "DK": "\\d{14}",
                    "DO": "[A-Z]{4}\\d{20}",
                    "EE": "\\d{16}",
                    "FO": "\\d{14}",
                    "FI": "\\d{14}",
                    "FR": "\\d{10}[\\dA-Z]{11}\\d{2}",
                    "GE": "[\\dA-Z]{2}\\d{16}",
                    "DE": "\\d{18}",
                    "GI": "[A-Z]{4}[\\dA-Z]{15}",
                    "GR": "\\d{7}[\\dA-Z]{16}",
                    "GL": "\\d{14}",
                    "GT": "[\\dA-Z]{4}[\\dA-Z]{20}",
                    "HU": "\\d{24}",
                    "IS": "\\d{22}",
                    "IE": "[\\dA-Z]{4}\\d{14}",
                    "IL": "\\d{19}",
                    "IT": "[A-Z]\\d{10}[\\dA-Z]{12}",
                    "KZ": "\\d{3}[\\dA-Z]{13}",
                    "KW": "[A-Z]{4}[\\dA-Z]{22}",
                    "LV": "[A-Z]{4}[\\dA-Z]{13}",
                    "LB": "\\d{4}[\\dA-Z]{20}",
                    "LI": "\\d{5}[\\dA-Z]{12}",
                    "LT": "\\d{16}",
                    "LU": "\\d{3}[\\dA-Z]{13}",
                    "MK": "\\d{3}[\\dA-Z]{10}\\d{2}",
                    "MT": "[A-Z]{4}\\d{5}[\\dA-Z]{18}",
                    "MR": "\\d{23}",
                    "MU": "[A-Z]{4}\\d{19}[A-Z]{3}",
                    "MC": "\\d{10}[\\dA-Z]{11}\\d{2}",
                    "MD": "[\\dA-Z]{2}\\d{18}",
                    "ME": "\\d{18}",
                    "NL": "[A-Z]{4}\\d{10}",
                    "NO": "\\d{11}",
                    "PK": "[\\dA-Z]{4}\\d{16}",
                    "PS": "[\\dA-Z]{4}\\d{21}",
                    "PL": "\\d{24}",
                    "PT": "\\d{21}",
                    "RO": "[A-Z]{4}[\\dA-Z]{16}",
                    "SM": "[A-Z]\\d{10}[\\dA-Z]{12}",
                    "SA": "\\d{2}[\\dA-Z]{18}",
                    "RS": "\\d{18}",
                    "SK": "\\d{20}",
                    "SI": "\\d{15}",
                    "ES": "\\d{20}",
                    "SE": "\\d{20}",
                    "CH": "\\d{5}[\\dA-Z]{12}",
                    "TN": "\\d{20}",
                    "TR": "\\d{5}[\\dA-Z]{17}",
                    "AE": "\\d{3}\\d{16}",
                    "GB": "[A-Z]{4}\\d{14}",
                    "VG": "[\\dA-Z]{4}\\d{16}"
                };

                bbanpattern = bbancountrypatterns[countrycode];
                if (typeof bbanpattern !== "undefined") {
                    ibanregexp = new RegExp("^[A-Z]{2}\\d{2}" + bbanpattern + "$", "");
                    if (!(ibanregexp.test(iban))) {
                        return false; // Invalid country specific format
                    }
                }
                ibancheck = iban.substring(4, iban.length) + iban.substring(0, 4);
                for (i = 0; i < ibancheck.length; i++) {
                    charAt = ibancheck.charAt(i);
                    if (charAt !== "0") {
                        leadingZeroes = false;
                    }
                    if (!leadingZeroes) {
                        ibancheckdigits += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(charAt);
                    }
                }
                for (p = 0; p < ibancheckdigits.length; p++) {
                    cChar = ibancheckdigits.charAt(p);
                    cOperator = "" + cRest + "" + cChar;
                    cRest = cOperator % 97;
                }
                return cRest === 1;
            },

        });
    });