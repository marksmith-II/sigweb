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
          
          LCDSetPixelDepth(8);
          LCDWriteString(0, 2, 20, 375, "20pt Verdana", 27, "Tablet Instanciated");
        },
        displayDeliveryItems: function (delItemsJSON) {
          this.deliveryDetailsScreen();
          SetTabletState(1);
          LcdRefresh(0, 0, 0, 640, 480);
          deliveryHeaderScreen

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
              LCDWriteString(0, 2, xposDelivery, ypos, "20pt ARIAL", 30, itemString);
              //Quantity Text
              LCDWriteString(0, 2, xposQuantity, ypos, "20pt ARIAL", 30, quantityString);
              ypos += 50; // increment the y position
            }
          }
        },
         deliveryDetailsScreen: function () {
          
          LcdRefresh(0, 0, 0, 640, 480);
          LCDSendGraphicUrl(1, 2, 0, 0, "webapp/images/Delivery_Details .bmp");

         },
         customerCertHeaderScreen: function () {},
         signatureHeaderScreen: function () {},

        acceptButton: function () {
          LCDSendGraphicUrl(0, 2, 450, 375, "../images/Accept_Button.bmp");
          KeyPadAddHotSpot(0, 2, 450, 370, 135, 75);
        },
        cancelButton: function () {
          LCDSendGraphicUrl(0, 2, 50, 375, "../images/Cancel_Button.bmp");
          KeyPadAddHotSpot(1, 2, 45, 375, 135, 75);


        },
        clearButton: function () {
          LCDSendGraphicUrl(0, 2, 260, 375, "../images/Clear_Button.bmp");
          KeyPadAddHotSpot(2, 2, 260, 375, 135, 75);
        },
        displayCustomerCertStatement: function () {
          let string1 = 'The Customer Signature Certifies the Material';
          let string2 = 'described herein are being used in construction';
          let string3 = 'of the improvments for the referenced project';

          LCDSetPixelDepth(8);
          LCDWriteString(0, 2, 8, 100, "20pt ARIAL", 30, string1);
          LCDWriteString(0, 2, 10, 150, "20pt ARIAL", 30, string2);
          LCDWriteString(0, 2, 10, 200, "20pt ARIAL", 30, string3);


        },
        customerCertScreen: function () {
          displayCustomerCertStatement();
          acceptButton();
          cancelButton();
          // Screen2ButtonListener();
          let acceptClicked = 0;
          let cancelClicked = 0;
          let buttonValue = this.screenButtonListener(acceptClicked, cancelClicked);

          // Handle button value
          if (buttonValue.acceptClicked) {
            // Go to signature screen
          } else if (buttonValue.cancelClicked) {
            // Handle cancel click

            sap.m.MessageBox.show("Customer has canceled Delivery", {
              icon: sap.m.MessageBox.Icon.WARNING,
              title: "Cancel",
              actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {

                }
              }
            });


          }


        },
        signatureScreen: function () {

          acceptButton();
          cancelButton();
          clearButton();
          // Screen2ButtonListener();
          let acceptClicked = 0;
          let cancelClicked = 0;
          let clearButtonClicked = 0;
          let buttonValue = this.screenButtonListener(acceptClicked, cancelClicked, clearButtonClicked);

          // Handle button value
          if (buttonValue.acceptClicked) {
            // Go to signature screen
          } else if (buttonValue.cancelClicked) {
            // Handle cancel click

            sap.m.MessageBox.show("Customer has canceled Delivery", {
              icon: sap.m.MessageBox.Icon.WARNING,
              title: "Cancel",
              actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {

                } else if (buttonValue.clearClicked) {
                  signatureScreen();
                }
              }
            });


          }




        },
        screenButtonListener: function () {

          function checkHotspots() {
            // Check hotspots
            let acceptClicked = KeyPadQueryHotSpot(0);
            let cancelClicked = KeyPadQueryHotSpot(1);
            let clearClicked = KeyPadQueryHotSpot(2);

            // Check if any hotspots were clicked
            if (acceptClicked > 0 || cancelClicked > 0 || clearClicked > 0) {
              // Handle click event
              if (acceptClicked > 0) {
                // Handle accept click
                return acceptClicked;
              } else if (cancelClicked > 0) {
                // Handle cancel click
                return cancelClicked;
              } else if (clearClicked > 0) {
                // Handle clear click
                return clearClicked;
              }
            } else {
              // Hotspots not clicked, wait and check again
              setTimeout(checkHotspots, 100);
            }
          }

          // Start checking hotspots
          checkHotspots();

        },
        Screen2ButtonListener: function (acceptClicked, cancelClicked, clearClicked) {
          acceptClicked = false;
          cancelClicked = false;
          clearClicked = false;

        },
        Screen3ButtonListener: function (acceptClicked, cancelClicked, clearClicked) {
          acceptClicked = false;
          cancelClicked = false;
          clearClicked = false;

        },

        startSigProcess: function () {
          let oPromise = new Promise((resolve, reject) => {
            this.startTablet();
            resolve(true); // return value replaces true
          });

          oPromise
            .then(
              function () {
                return this.getDeliveryItems("80003607", "msmith", "G00d@lien1")
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
            var username = "msmith";
            var password = "G00d@lien1";
            let that = this;
            let aFilters = [];
            let oDataModel = this.getOwnerComponent().getModel();
            // oDataModel.setSizeLimit(99999999);
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
              // $expand: "&$to_customer_cert_status",
              // $top: 99999999
            };
            oDataModel.read("/" + "DeliveryItems", {

              headers: headers,
              filters: aFilters,
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
