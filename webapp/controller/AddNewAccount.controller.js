sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, MessageBox) {
        "use strict";

        return Controller.extend("com.ferrero.zibanreq.controller.AddNewAccount", {
            onInit: function () {

            },
            onPressHome: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteHome")
            },
            onPressMyRequests: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("myRequests")
            },
            onPressNavBack: function () {
                history.go(-1);
            },
            onSubmitAdd: function () {
                var that = this;
                var oIpIban = this.getView().byId("idIpIBAN"),
                    oIpSwift = this.getView().byId("idIpSwiftCode"),
                    sIbanValueState = oIpIban.getValueState(),
                    sSwiftValueState = oIpSwift.getValueState();
                var oUserDetail = this.getOwnerComponent().getModel("userModel").getProperty("/userDetail");
                var oPayLoad = {
                    "AccountHolder": this.getView().byId("idIpAccountHolder").getValue(),
                    "IBAN": oIpIban.getValue(),
                    "RequestType": "New",
                    "BIC_SWIFT_Code": oIpSwift.getValue(),
                    "VendorUser": oUserDetail.User,
                    "VendorCode": oUserDetail.VendoCode,
                    "VendorName": oUserDetail.VendorName
                }
                if (sIbanValueState !== "Success") {
                    MessageBox.error("Please Provide valid IBAN code");
                    return;
                }
                if (sSwiftValueState !== "Success") {
                    MessageBox.error("Please Provide valid Swift code");
                    return;
                }
                if (!this.content || this.content === "") {
                    MessageBox.error("Please add the attachment");
                    return;
                }
                var oAttachData = {
                    "content": this.content,
                    "fileType": this.file.type,
                    "fileName": this.file.name
                };
                oPayLoad.linkToAttach = oAttachData;


                var oModel = this.getOwnerComponent().getModel();
                // var sURL = "/RequestAttachments";
                var sURL = "/Request";
                //Create call for CAP OData Service
                this.getView().setBusy(true);
                oModel.create(sURL, oPayLoad, {
                    success: function (oData, oResponse) {
                        // var id = oData.id;
                        var sMsg = "Request Created Successfully";
                        this.getView().setBusy(false);
                        MessageBox.success(sMsg);
                        this.removeDataPopulated();
                    }.bind(this),
                    error: function (error) {
                        this.getView().setBusy(false);
                        MessageBox.error(error);
                    }.bind(this),
                });
                // window.open("/sap/opu/odata/sap/MYSERVICE_SRV/DownloadFileSet('"+ guid +"')/$value");
                // this.getView().setBusy(true);
                // oCAPModel.read("/ProductImages(guid'5a8800be-f66a-453c-bbae-b779637adc91')/$value", {
                //     method: "GET",
                //     success: function (oData, oResponse) {
                //         // var id = oData.id;
                //         // var sMsg = "File Uploaded Successfully for ID: " + id;
                //         this.getView().setBusy(false);
                //         MessageBox.success(sMsg);
                //     }.bind(this),
                //     error: function (jqXHR, textStatus) {
                //         this.getView().setBusy(false);
                //     }.bind(this),
                // });
                // var sServiceUrl = oCAPModel.sServiceUrl + "/ProductImages(guid'0d89d46c-1f0c-40a3-8a71-dc76d90147e7')/$value";
                // var oUplColItem = new sap.m.UploadCollectionItem();
                // oUplColItem.setUrl(sServiceUrl);
                // oUplColItem.setMimeType("application/pdf");
                // oUplColItem.download(false);
                // sap.m.URLHelper.redirect(sServiceUrl);  

            },
            removeDataPopulated: function () {
                this.getView().byId("idIpAccountHolder").setValue("");
                this.getView().byId("idIpIBAN").setValue("");
                this.getView().byId("idIpSwiftCode").setValue("");
                this.getView().byId("idUploadFile").setValue("");
                this.getView().byId("message1").setVisible(false);
                this.getView().byId("swiftMessage2").setVisible(false);

            },

            validateIBAN: function () {
                // var sCoordinateValue = this.getView().byId("idIpIBAN").getValue();
                var oIpIban = this.getView().byId("idIpIBAN"),
                    sCoordinateValue = oIpIban.getValue();
                if (sCoordinateValue == '') {
                    this.getView().byId("message").setText("IBAN cannot be blank");
                    this.getView().byId("message").setVisible(true);
                    this.getView().byId("message1").setVisible(false);
                    oIpIban.setValueState("Error");
                } else if (sCoordinateValue.length < 15) {
                    this.getView().byId("message").setText(" IBAN Validation Error!! IBAN should contains atleast 15 character ");
                    this.getView().byId("message").setVisible(true);
                    this.getView().byId("message1").setVisible(false);
                    oIpIban.setValueState("Error");
                }
                else {
                    this.isValidIBANNumber(sCoordinateValue);
                    if (this.isValidIBANNumber(sCoordinateValue) == true) {
                        this.getView().byId("message1").setText("IBAN IS CORRECT");
                        this.getView().byId("message1").setVisible(true);
                        this.getView().byId("message").setVisible(false);
                        oIpIban.setValueState("Success");
                    } else if (this.isValidIBANNumber(sCoordinateValue) == false) {
                        this.getView().byId("message").setText("Invalid IBAN, PLease enter the Valid One");
                        this.getView().byId("message").setVisible(true);
                        this.getView().byId("message1").setVisible(false);
                        oIpIban.setValueState("Error");
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
            validateSwiftCode: function () {
                // var sSwiftCode = this.getView().byId("idIpSwiftCode").getValue();
                var oIpSwift = this.getView().byId("idIpSwiftCode"),
                    sSwiftCode = oIpSwift.getValue();
                if (sSwiftCode == '') {
                    this.getView().byId("swiftMessage1").setText("IBAN BIC/SWIFT code cannot be empty");
                    this.getView().byId("swiftMessage1").setVisible(true);
                    this.getView().byId("swiftMessage2").setVisible(false);
                    oIpSwift.setValueState("Error");
                } else if (sSwiftCode.length < 8 || sSwiftCode.length > 11) {
                    this.getView().byId("swiftMessage1").setText("Minimum length of BIC/SWIFT Code is 8 or 11 characters");
                    this.getView().byId("swiftMessage1").setVisible(true);
                    this.getView().byId("swiftMessage2").setVisible(false);
                    oIpSwift.setValueState("Error");
                } else {
                    this.isValidateSwiftCode(sSwiftCode);
                }

            },
            isValidateSwiftCode: function (sSwiftCode) {
                var sCode = sSwiftCode.replace(/ /g, "").toUpperCase();
                var oIpSwift = this.getView().byId("idIpSwiftCode");

                if (sCode.length == 11) //to check the length is 11
                {
                    var reg = /[A-Z]{4}[A-Z0-9]{7}$/;    //to validate for capital letters and alphanumerical values for 11 char
                    if (sCode.match(reg)) {
                        this.getView().byId("swiftMessage2").setText("Swift code is vaid");
                        this.getView().byId("swiftMessage2").setVisible(true);
                        this.getView().byId("swiftMessage1").setVisible(false);
                    } else {
                        this.getView().byId("swiftMessage1").setText("Incorrect swift code");
                        this.getView().byId("swiftMessage1").setVisible(true);
                        this.getView().byId("swiftMessage2").setVisible(false);
                    }
                }
                else if (sCode.length == 8) //to check the length is 8
                {

                    var reg = /[A-Z]{4}[A-Z0-9]{4}$/;    //to check all caps and last 4 char as alphanumerical
                    if (sCode.match(reg)) {
                        this.getView().byId("swiftMessage2").setText("Swift code is vaid");
                        this.getView().byId("swiftMessage2").setVisible(true);
                        this.getView().byId("swiftMessage1").setVisible(false);
                        oIpSwift.setValueState("Success");
                    } else {
                        this.getView().byId("swiftMessage1").setText("Incorrect swift code");
                        this.getView().byId("swiftMessage1").setVisible(true);
                        this.getView().byId("swiftMessage2").setVisible(false);
                        oIpSwift.setValueState("Error");
                    }
                }
                else {
                    this.getView().byId("swiftMessage1").setText("Incorrect Length ");
                    this.getView().byId("swiftMessage1").setVisible(true);
                    this.getView().byId("swiftMessage2").setVisible(false);
                    oIpSwift.setValueState("Error");
                }
            },
            onUpload: function (oEvent) {
                var file = oEvent.getParameters("files").files[0];
                this.file = file;
                var oUploadSet = this.byId("idUploadFile");
                //Upload image
                var reader = new FileReader();
                reader.onload = function (oEvent) {
                    // get an access to the content of the file
                    this.content = oEvent.currentTarget.result.split(',').pop();
                    // this.createfile();
                }.bind(this);
                reader.readAsDataURL(this.file);
            }


        });
    });