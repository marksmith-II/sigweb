sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageBox) {
    "use strict";

    return Controller.extend(
      "com.borderstates.topazsignature.controller.SignatureCapture",
      {
        sigWebLoaded: function () {
          if (!!document.IsSigWebInstalled) {
            MessageBox.error("Unable to load the SigWeb library.");
            return;
          }

          if (!IsSigWebInstalled()) {
            MessageBox.error("SigWebSDK must be installed on this computer.");
            return;
          }

          // All the business logic goes here.

          function startTablet() {
            SetTabletState(1);
            var tabletState = GetTabletState();
            LcdRefresh(0, 0, 0, 640, 480);

            // var url = "http://localhost:8081/images/Delivery_Details%20.bmp";
            //  LCDSendGraphicUrl(0, 2, 0, 0, "https://www.topazsystems.com/SigWeb/ColorTopazLogo.bmp");
            //  LCDSendGraphicUrl(1, 2, 0, 0, "http://localhost:8081/images/Delivery_Details%20.bmp");
            // LCDSendGraphicUrl(
            //   1,
            //   2,
            //   0,
            //   0,
            //   "http://localhost:8080/images/Delivery_Details%20.bmp"
            // );
            LCDSetPixelDepth(8);
            LCDWriteString(0, 2, 20, 375, "20pt Verdana", 27, "Tablet Instanciated");
          }
          function deliveryHeaderScreen() {}
          function customerCertHeaderScreen() {}
          function signatureHeaderScreen() {}
          function acceptButton() {}
          function cancelButton() {}
          function clearButton() {}



          
          function getDeliveryItems(documentNumber, username, password) {
            var oModel = new sap.ui.model.odata.ODataModel("https://s4hana2020.mindsetconsulting.com:44300/sap/opu/odata/sap/ZTOPAZ_INTEGRATION_API/");
          

            oModel.attachMetadataLoaded(function () {
            // Use $filter to get delivery details based on document number
            var filter = "DeliveryDocument eq '" + documentNumber + "'";
            var url = "/DeliveryItems?$filter=" + filter;
          
            // Add Authorization header with user credentials
            var headers = {
              "Authorization": "Basic " + btoa(username + ":" + password)
            };
          
            oModel.read(url, {
              headers: headers,
              success: function (data) {
                console.log(data);
              },
              error: function (error) {
                console.log(error);
              }
            });
        });
          }

          startTablet();
          getDeliveryItems(80000023, "msmith", "G00d@lien1");
        },

        onInit: function () {
          if (!document.IsSigWebInstalled) {
            var callback = this.sigWebLoaded;
            var sigWebScript = document.createElement("script");
            sigWebScript.setAttribute("src", "../lib/SigWebTablet.js");
            sigWebScript.onload = callback;
            document.head.appendChild(sigWebScript);
          }
        },
      }
    );
  }
);
