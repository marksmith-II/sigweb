var delItemsJSON = {};
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/borderstates/topazsignature/lib/SigWebTablet",
  ],

  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */

  function (Controller, MessageBox, Filter, FilterOperator) {
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
          SetTabletState(1);
          //   var tabletState = GetTabletState();
          LcdRefresh(0, 0, 0, 640, 480);
          LCDSendGraphicUrl(1, 2, 0, 0, "http://localhost:8080/images/Delivery_Details%20.bmp");
          LCDSetPixelDepth(8);
          LCDWriteString(0, 2, 20, 375, "20pt Verdana", 27, "Tablet Instanciated");
        },
        displayDeliveryItems: function (delItemsJSON) {
          SetTabletState(1);
          LcdRefresh(0, 0, 0, 640, 480);

          var ypos = + 50;
          var xposDelivery = 50;
          var xposQuantity = 425;


          for (var key in delItemsJSON) {
            if (delItemsJSON.hasOwnProperty(key)) {

              var deliveryDoc = delItemsJSON[key];
              var Material = deliveryDoc.Material;
              var itemQuantity = deliveryDoc.ActualDeliveryQuantity;
              var itemString = "Item: " + Material;
              var quantityString = "Quantity: " + itemQuantity;
        
              LCDSetPixelDepth(8);
              //Item Text
              LCDWriteString(0, 2, xposDelivery , ypos, "20pt ARIAL", 30, itemString);
              //Quantity Text
              LCDWriteString(0, 2, xposQuantity, ypos, "20pt ARIAL", 30, quantityString);
              ypos += 50; // increment the y position
            }
          }
        },
        // deliveryHeaderScreen: function () {},
        // customerCertHeaderScreen: function () {},
        // signatureHeaderScreen: function () {},

        acceptButton: function () {
          LCDSendGraphicUrl(0, 2, 450, 375, "http://localhost:8081/images/Accept_Button.bmp");
          KeyPadAddHotSpot(0, 2, 450, 370, 135, 75);
        },
        cancelButton: function () {
          LCDSendGraphicUrl(0, 2, 50, 375, "http://localhost:8081/images/Cancel_Button.bmp");
          KeyPadAddHotSpot(1, 2, 45, 375, 135, 75);
        },
        clearButton: function () {
          LCDSendGraphicUrl(0, 2, 260, 375, "http://localhost:8081/images/Clear_Button.bmp");
          KeyPadAddHotSpot(2, 2, 260, 375, 135, 75);
        },

        startSigProcess: function () {
          let oPromise = new Promise((resolve, reject) => {
            this.startTablet();
            resolve(true); // return value replaces true
          });
        
          oPromise
            .then(
              function () {
                return this.getDeliveryItems(80002005, "msmith", "G00d@lien1")
                  .then(function (oData) {
                    // Add oData items to delItemsJSON object
                    for (var i = 0; i < oData.results.length; i++) {
                      var item = oData.results[i];
                      delItemsJSON[item.ID] = item;
                    }
                    return delItemsJSON;
                  })
                  .catch(function (err) {
                    console.log(err);
                  });
              }.bind(this)
            )
            .then(
              function (delItemsJSON) {
                this.displayDeliveryItems(delItemsJSON);
                resolve(true); // resolve the oPromise object
              }.bind(this)
            )
            .catch(function (err) {
              console.log(err);
              // reject(err); // error handling
              //   MessageToast.show(err);
            });
        
          // Define the resolve method outside of the then block
          function resolve(value) {
            console.log(value);
          }
        },

        getDeliveryItems: function (documentNumber, username, password) {
          return new Promise(function (resolve, reject) {
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
              $expand: "&$to_customer_cert_status",
            };
            oDataModel.read("/" + "DeliveryItems", {

              headers: headers,
              // filters: aFilters,
              // urlParameters: sUrlParam,
              async: true,
              success: function (oData) {
                resolve(oData);
                console.log(oData);
              },
              error: function (err) {
                return err;
              },
            });
          }.bind(this));
        },

        onInit: function () {
          if (!document.IsSigWebInstalled) {
            // Do something here to check if SigWeb is installed
            // var callback = this.sigWebLoaded;
            // var sigWebScript = document.createElement("script");
            // sigWebScript.setAttribute("src", "../lib/SigWebTablet.js");
            // sigWebScript.onload = callback;
            // document.head.appendChild(sigWebScript);
          }

          let oPromise = new Promise((resolve, reject) => {
            this.startSigProcess();
            resolve(true); // return value replaces true
          });
          oPromise
            .then(
              function () {
                // next function
              }.bind(this)
            )
            .then(function () { }.bind(this)) // add these to add more functions
            .then(function () { }.bind(this))
            .then(function () { }.bind(this))
            .catch(function (err) {
              console.log(err);
              // reject(err); // error handling
            });
        },
      }
    );
  }
);
