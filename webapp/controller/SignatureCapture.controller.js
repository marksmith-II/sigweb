sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/borderstates/topazsignature/lib/SigWebTablet"
  ],

  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */

  function (Controller, MessageBox, Filter, FilterOperator, SigWebTablet) {
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
        },

        // All the business logic goes here.

        startTablet: function () {
            SigWebTablet.SetTabletState(1);
          //   var tabletState = GetTabletState();
          SigWebTablet.LcdRefresh(0, 0, 0, 640, 480);
          SigWebTablet.LCDSendGraphicUrl(
            1,
            2,
            0,
            0,
            "http://localhost:8081/images/Delivery_Details%20.bmp"
          );
          // LCDSendGraphicUrl( 1, 2, 0, 0, "http://localhost:8080/images/Delivery_Details%20.bmp");
          SigWebTablet.LCDSetPixelDepth(8);
          SigWebTablet.LCDWriteString(
            0,
            2,
            20,
            375,
            "20pt Verdana",
            27,
            "Tablet Instanciated"
          );
        },

        // deliveryHeaderScreen: function () {},
        // customerCertHeaderScreen: function () {},
        // signatureHeaderScreen: function () {},

        acceptButton: function () {
            SigWebTablet.LCDSendGraphicUrl(
            0,
            2,
            450,
            375,
            "http://localhost:8081/images/Accept_Button.bmp"
          );
          SigWebTablet.KeyPadAddHotSpot(0, 2, 450, 370, 135, 75);
        },
        cancelButton: function () {
            SigWebTablet.LCDSendGraphicUrl(
            0,
            2,
            50,
            375,
            "http://localhost:8081/images/Cancel_Button.bmp"
          );
          SigWebTablet.KeyPadAddHotSpot(1, 2, 45, 375, 135, 75);
        },
        clearButton: function () {
            SigWebTablet.LCDSendGraphicUrl(
            0,
            2,
            260,
            375,
            "http://localhost:8081/images/Clear_Button.bmp"
          );
          SigWebTablet.KeyPadAddHotSpot(2, 2, 260, 375, 135, 75);
        },

        deliveryDetails: function () {
          let oPromise = new Promise((resolve, reject) => {
            this.startTablet();
            resolve(true); // return value replaces true
          });
          oPromise
            .then(
              function () {
                this.getDeliveryItems(80003607, "msmith", "G00d@lien1"); // next function
              }.bind(this)
            )
            .catch(function (err) {
                console.log(err);
              // reject(err); // error handling
              //   MessageToast.show(err);
            });

          //   this.startTablet();
          //   this.getDeliveryItems(80003607, "msmith", "G00d@lien1");
        },

        getDeliveryItems: function (documentNumber, username, password) {
          let that = this;
          let aFilters = [];
          let oDataModel = this.getOwnerComponent().getModel();
          let oDeliveryDocumentNum = new Filter(
            "DeliveryDocument",
            FilterOperator.EQ,
            documentNumber
          );
          aFilters.push(oDeliveryDocumentNum);

          var headers = {
            Authorization: "Basic " + btoa(username + ":" + password),
            username: username,
            password: password,
          };

          let sUrlParam = {
            $expand: "to_customer_cert_status",
          };
          oDataModel.read("/" + "DeliveryItems", {
            headers: headers,
            filters: aFilters,
            urlParameters: sUrlParam,
            async: true,
            success: function (oData) {
              console.log(oData);
            },
            error: function (err) {
              return err;
            },
          });
        },

        // startTablet();
        // getDeliveryItems(80000023, "msmith", "G00d@lien1");

        onInit: function () {
          if (!document.IsSigWebInstalled) {
            // var callback = this.sigWebLoaded;
            // var sigWebScript = document.createElement("script");
            // sigWebScript.setAttribute("src", "../lib/SigWebTablet.js");
            // sigWebScript.onload = callback;
            // document.head.appendChild(sigWebScript);
          }

          let oPromise = new Promise((resolve, reject) => {
            this.deliveryDetails();
            resolve(true); // return value replaces true
          });
          oPromise
            .then(
              function () {
                // next function
              }.bind(this)
            )
            .then(function () {}.bind(this)) // add these to add more functions
            .then(function () {}.bind(this))
            .then(function () {}.bind(this))
            .catch(function (err) {
                console.log(err);
              // reject(err); // error handling
              //   MessageToast.show(err);
            });
        },
      }
    );
  }
);
