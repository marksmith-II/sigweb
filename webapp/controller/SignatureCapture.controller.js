sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("com.borderstates.topazsignature.controller.SignatureCapture", {
            sigWebLoaded: function () {
                if(!!document.IsSigWebInstalled) {
                    MessageBox.error("Unable to load the SigWeb library.");
                    return;
                }

                if(!IsSigWebInstalled()) {
                    MessageBox.error("SigWebSDK must be installed on this computer.");
                    return;
                }

                // All the business logic goes here.
            },

            onInit: function () {
                if(!document.IsSigWebInstalled) {
                    var callback = this.sigWebLoaded;
                    var sigWebScript = document.createElement('script');
                    sigWebScript.setAttribute('src','../lib/SigWebTablet.js');
                    sigWebScript.onload = callback;
                    document.head.appendChild(sigWebScript);
                }
            }
        });
    });
