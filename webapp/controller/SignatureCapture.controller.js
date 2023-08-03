var delItemsJSON = {};
var delPOCustJSON = {};
var deliveryNumber = "80003607";
var customerJSON = {};
var customerCertRequired = false;
// var username = "msmith";
// var password = "G00d@lien1";
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
          // SetTabletState(1);
          //   var tabletState = GetTabletState();
          LcdRefresh(0, 0, 0, 640, 480);

          LCDSetPixelDepth(8);
          LCDWriteString(0, 2, 20, 375, "20pt Verdana", 27, "Tablet Instanciated");
        },
        displayDeliveryItems: function (delItemsJSON) {
          var that = this;
          // SetTabletState(1);
          LcdRefresh(0, 0, 0, 640, 480);
          this.deliveryDetailsScreenHeader();
          var itemsPerPage = 5;
          var currentPage = 1;
          var totalPages = Math.ceil(Object.keys(delItemsJSON).length / itemsPerPage);

          var displayItems = function () {

            var ypos = + 50;
            var xposDelivery = 50;
            var xposQuantity = 425;

            // Loop through items for current page
            var startIndex = (currentPage - 1) * itemsPerPage;
            var endIndex = Math.min(startIndex + itemsPerPage, Object.keys(delItemsJSON).length);
            for (var i = startIndex; i < endIndex; i++) {
              var key = Object.keys(delItemsJSON)[i];
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

            // Show "Next" button if there are more pages
            if (currentPage < totalPages) {
              that.nextButton();
              currentPage++;
              that.screenButtonListener(3, displayItems);
              // if (buttonValue.nextClicked) {


              // Show "Next" button
              // }
            } else {
              let acceptFunction = function () {
                that.isCustomerCertRequired().then(function (isCertRequired) {
                  if (isCertRequired) {
                    // Display Customer Cert screen
                    that.customerCertScreen();
                  } else {
                    // If no, display Signature screen
                    that.signatureScreen();
                  }

                })
              };
              let cancelFunction = function () {
                sap.m.MessageBox.show("Customer has canceled Delivery", {
                  icon: sap.m.MessageBox.Icon.WARNING,
                  title: "Cancel",
                  actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                  onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.YES) {
                      window.close();
                    }
                  }
                });
              };
              // Show "Accept" and "Cancel" buttons
              that.screenButtonListener(0, acceptFunction);
              that.screenButtonListener(1, cancelFunction);
              that.acceptButton();
              that.cancelButton();

            }
          }
          // Display items for first page
          displayItems();
        },
        deliveryDetailsScreenHeader: function () {
          LcdRefresh(0, 0, 0, 640, 480);
          LCDSetPixelDepth(8);

          LCDSendGraphicUrl(0, 2, 0, 0, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/DeliveryDetails.bmp"), document.baseURI).href);

          //  LcdRefresh(0, 0, 0, 640, 480);
        },
        customerCertHeaderImage: function () {
          LcdRefresh(0, 0, 0, 640, 480);
          // LCDSendGraphicUrl(1, 2, 0, 0, "webapp/images/CustomerCertification.bmp");
          LCDSendGraphicUrl(1, 2, 0, 0, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/CustomerCertification.bmp"), document.baseURI).href);
        },

        signatureScreenImages: function () {
          LcdRefresh(0, 0, 0, 640, 480);
          // LCDSendGraphicUrl(1, 2, 0, 0, "http://localhost:8080/images/Signature.bmp");
          LCDSendGraphicUrl(1, 2, 0, 0, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/Signature.bmp"), document.baseURI).href);
          // LCDSendGraphicUrl(1, 2, 0, 0, "http://localhost:8080/images/SignatureArea.bmp");
          LCDSendGraphicUrl(1, 2, 0, 0, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/SignatureArea.bmp"), document.baseURI).href);

        },

        acceptButton: function () {
          // LCDSendGraphicUrl(0, 2, 450, 375, "http://localhost:8080/images/AcceptButton.bmp");
          LCDSendGraphicUrl(0, 2, 450, 375, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/AcceptButton.bmp"), document.baseURI).href);
          KeyPadAddHotSpot(0, 1, 450, 370, 135, 75);
        },
        cancelButton: function () {
          // LCDSendGraphicUrl(0, 2, 50, 375, "http://localhost:8080/images/CancelButton.bmp");
          LCDSendGraphicUrl(0, 2, 50, 375, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/CancelButton.bmp"), document.baseURI).href);
          KeyPadAddHotSpot(1, 1, 45, 375, 135, 75);
        },
        clearButton: function () {
          // LCDSendGraphicUrl(0, 2, 260, 375, "http://localhost:8080/images/ClearButton.bmp");
          LCDSendGraphicUrl(0, 2, 260, 375, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/ClearButton.bmp"), document.baseURI).href);
          KeyPadAddHotSpot(2, 1, 260, 375, 135, 75);
        },
        nextButton: function () {
          // LCDSendGraphicUrl(0, 2, 260, 375, "http://localhost:8080/images/Next.bmp");
          LCDSendGraphicUrl(0, 2, 450, 375, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/Next.bmp"), document.baseURI).href);
          KeyPadAddHotSpot(3, 1, 450, 370, 135, 75);
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
          customerCertHeaderImage();
          displayCustomerCertStatement();
          acceptButton();
          cancelButton();

          let acceptClicked = 0;
          let cancelClicked = 0;
          // let buttonValue = this.screenButtonListener(acceptClicked, cancelClicked);

          // Handle button value
          if (buttonValue.acceptClicked) {
            // Go to signature screen
            signatureScreen();
          } else if (buttonValue.cancelClicked) {
            // Handle cancel click

            sap.m.MessageBox.show("Customer has canceled Delivery", {
              icon: sap.m.MessageBox.Icon.WARNING,
              title: "Cancel",
              actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {
                  window.close(); // Close window

                }
              }
            });
          }
        },
        signatureScreen: function () {
          signatureScreenImages();

          acceptButton();
          cancelButton();
          clearButton();
          //get Delivery Number, PO Number, and Customer Name from backend

          //capture signature

          //send signature to backend
          //close application 

          let acceptClicked = 0;
          let cancelClicked = 0;
          let clearButtonClicked = 0;
          // let buttonValue = this.screenButtonListener(acceptClicked, cancelClicked, clearButtonClicked);

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
                  window.close(); // Close window
                } else if (buttonValue.clearClicked) {
                  signatureScreen();
                }
              }
            });
          }
        },

        getPODelNumCustomerName: function (deliveryNumber) {

          return new Promise(function (resolve, reject) {

            let that = this;
            let aFilters = [];
            let oDataModel = this.getOwnerComponent().getModel();

            let oDeliveryDocumentNum = new Filter(
              "DeliveryNumber",
              FilterOperator.EQ,
              deliveryNumber
            );
            aFilters.push(oDeliveryDocumentNum);

            // var headers = {
            //   Authorization: "Basic " + btoa(username + ":" + password),
            //   username: username,
            //   password: password,
            // };

            oDataModel.read("/" + "DeliveryPOCustomerInfo", {

              // headers: headers,
              filters: aFilters,
              // urlParameters: sUrlParam,
              async: true,
              success: function (oData) {
                resolve(oData);
                console.log(oData);
                // Add oData items to customerJSON object
                for (var i = 0; i < oData.results.length; i++) {
                  var item = oData.results[i];
                  delPOCustJSON[item.ID] = item;
                }
                resolve(true); // Resolve promise with true if oData comes back
              },
              error: function (err) {
                return err;
              },
            });
          }.bind(this));

        },
        isCustomerCertRequired: function (deliveryNumber) {
          return new Promise(function (resolve, reject) {

            let that = this;
            let aFilters = [];
            let oDataModel = this.getOwnerComponent().getModel();

            let oDeliveryDocumentNum = new Filter(
              "DeliveryDocument",
              FilterOperator.EQ,
              deliveryNumber,
              "CustomerCertRequired",
              FilterOperator.EQ,
              'X'
            );
            aFilters.push(oDeliveryDocumentNum);

            // var headers = {
            //   Authorization: "Basic " + btoa(username + ":" + password),
            //   username: username,
            //   password: password,
            // };

            oDataModel.read("/" + "CustomerCertStatus", {

              // headers: headers,
              filters: aFilters,
              // urlParameters: sUrlParam,
              async: true,
              success: function (oData) {
                resolve(oData);
                console.log(oData);
                // Add oData items to customerJSON object
                for (var i = 0; i < oData.results.length; i++) {
                  var item = oData.results[i];
                  customerJSON[item.ID] = item;
                }
                // return return customerJSON;
                resolve(true); // Resolve promise with true if oData comes back
              },
              error: function (err) {
                return err;
              },
            });
          }.bind(this));

        },

        screenButtonListener: function (hotSpotNumber, callback) {
          SetLCDCaptureMode(2);
          function checkHotspots() {

            let hotspot = KeyPadQueryHotSpot(hotSpotNumber);
            // Check if any hotspots were clicked
            ClearTablet();
            if (KeyPadQueryHotSpot(hotSpotNumber) > 0 ) {
              
              // ClearSigWindow(1);
               ClearTablet();
              // LcdRefresh(1, 0, 0, 640, 480);
              LcdRefresh(0, 0, 0, 640, 480);
              KeyPadClearHotSpotList();
              callback();
            } else {
              // Hotspots not clicked, wait and check again
              setTimeout(checkHotspots, 5);
            }
          }

          // Start checking hotspots
          checkHotspots();

        },

        startSigProcess: function () {
          let oPromise = new Promise((resolve, reject) => {
            this.startTablet();
            resolve(true); // return value replaces true
          });

          oPromise
            .then(
              function () {
                return this.getDeliveryItems(deliveryNumber) //, username, password
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

            // var headers = {
            //   Authorization: "Basic " + btoa(username + ":" + password),
            //   // username: username,
            //   // password: password,
            // };

            let sUrlParam = {
              // $expand: "&$to_customer_cert_status",
              // $top: 99999999
            };
            oDataModel.read("/" + "DeliveryItems", {

              // headers: headers,
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
          if(
            this.getOwnerComponent().getComponentData().startupParameters.DeliveryNumber &&
            this.getOwnerComponent().getComponentData().startupParameters.DeliveryNumber.length > 0) {
              deliveryNumber = this.getOwnerComponent().getComponentData().startupParameters.DeliveryNumber[0];
          }
          this.isCustomerCertRequired();
          this.getPODelNumCustomerName();
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
