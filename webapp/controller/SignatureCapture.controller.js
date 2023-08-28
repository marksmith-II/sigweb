var delItemsJSON = {};
var delPOCustJSON = {};
var deliveryNumber = " ";
var customerJSON = {};
var customerCertRequired = false;




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
        startSigProcess: function () {
          let oPromise = new Promise((resolve, reject) => {
            this.startTablet();
            resolve(true);
          });

          oPromise
            .then(
              function () {
                return this.getDeliveryItems(deliveryNumber)
                  .then(function (oData) {

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
                resolve(true);
              }.bind(this)
            )
            .catch(function (err) {
              console.log(err);

            });

          function resolve(value) {
            console.log(value);
          }
        },

        startTablet: function () {
          let tmr = null;
          SetTabletComTest(false);
          SetTabletState(0, tmr);
          SetTabletComTest(true);
          if (tmr == null) {
            tmr = SetTabletState(1, ctx, 50);
          }
          else {
            SetTabletState(0, tmr);
            tmr = null;
            tmr = SetTabletState(1, ctx, 50);
          }
          if (GetTabletState() == 0) {
            //Cannot locate signature pad
            SetTabletState(0, tmr);
            SetTabletComTest(false);
            MessageBox.error("Tablet not connected");
          }
          else {
            //Located signature pad
            SetTabletComTest(false);
          }
          //you are ready to proceed.
          SetTabletState(1);
          LcdRefresh(0, 0, 0, 640, 480);
          LCDSetPixelDepth(8);



          // LCDWriteString(0, 2, 20, 375, "20pt Verdana", 27, "Tablet Instanciated");
        },

        getDeliveryItems: function (documentNumber) {
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

            let sUrlParam = {

            };
            oDataModel.read("/" + "DeliveryItems", {

              filters: aFilters,
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

        displayDeliveryItems: function (delItemsJSON) {
          ClearTablet();
          // KeyPadClearHotSpotList();
          var that = this;
          SetTabletState(1);
          LcdRefresh(0, 0, 0, 640, 480);
          this.deliveryDetailsScreenHeader();
          var itemsPerPage = 5;
          var currentPage = 1;
          var totalPages = Math.ceil(Object.keys(delItemsJSON).length / itemsPerPage);

          var displayItems = function () {

            var ypos = + 50;
            var xposDelivery = 10;
            var xposQuantity = 425;


            // Loop through items for current page
            var startIndex = (currentPage - 1) * itemsPerPage;
            var endIndex = Math.min(startIndex + itemsPerPage, Object.keys(delItemsJSON).length);
            for (var i = startIndex; i < endIndex; i++) {
              var key = Object.keys(delItemsJSON)[i];
              var deliveryDoc = delItemsJSON[key];
              var Material = deliveryDoc.Material;
              var itemQuantity = deliveryDoc.ActualDeliveryQuantity;
              var itemString = " " + Material;
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
              that.screenButtonListener(3, displayItems)

            } else {

              var promise = new Promise(function (resolve, reject) {
                KeyPadClearHotSpotList();
                resolve();
              });

              promise.then(function () {
                let acceptFunction = function () {
                  that.isCustomerCertRequired(deliveryNumber).then(function (isCertRequired) {
                    if (isCertRequired.results.length > 0) {
                      // Display Customer Cert screen
                      that.customerCertScreen.bind(that)();
                    } else {
                      // If no, display Signature screen
                      that.signatureScreen.bind(that)();
                    }

                  })
                };

                let cancelFunction = function () {

                  sap.m.MessageBox.show("Customer has canceled Delivery", {
                    icon: sap.m.MessageBox.Icon.WARNING,
                    title: "Cancel",
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function (oAction) {
                      if (oAction === sap.m.MessageBox.Action.OK) {
                        LcdRefresh(0, 0, 0, 640, 480);
                        Reset();
                        window.close();
                      }
                    }
                  });
                };
                // Show "Accept" and "Cancel" buttons
                LcdRefresh(0, 0, 375, 390, 375,);
                that.acceptButton();
                that.cancelButton();
                that.screenButtonListener(0, acceptFunction);
                that.screenButtonListener(1, cancelFunction);
              });
            }

          }

          // Display items for page
          displayItems();

        },

        customerCertScreen: function () {
          ClearTablet();
          SetTabletState(1);
          var that = this;
          KeyPadClearHotSpotList();
          this.customerCertHeaderImage();
          this.displayCustomerCertStatement();
          this.acceptButton();
          this.cancelButton();

          let acceptFunction = function () {
            that.signatureScreen.bind(that)();

          };

          let cancelFunction = function () {
            sap.m.MessageBox.show("Customer has canceled Delivery", {
              icon: sap.m.MessageBox.Icon.WARNING,
              title: "Cancel",
              actions: [sap.m.MessageBox.Action.OK],
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  LcdRefresh(0, 0, 0, 640, 480);
                  Reset();
                  window.close();
                }
              }
            });
          };

          this.acceptButton();
          this.cancelButton();
          this.screenButtonListener(0, acceptFunction);
          this.screenButtonListener(1, cancelFunction);

        },

        signatureScreen: function () {
          SetImageXSize(250);
          SetImageYSize(75);
          SetImagePenWidth(10);
          ClearTablet();
          SetTabletState(1);
          KeyPadClearHotSpotList();
          SetSigWindow(1, 27, 150, 582, 210);
          this.signatureScreenImages();


          var keys = Object.keys(delPOCustJSON);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var headerInfo = delPOCustJSON[key];
            var delivery = headerInfo.DeliveryNumber;
            var PO = headerInfo.PONumber;
            var customer = headerInfo.Customer;
            var deliveryString = "Delivery: " + delivery;
            var poString = "PO: " + PO;
            var customerString = "Customer: " + customer;

            LCDSetPixelDepth(8);
            //Item Text
            LCDWriteString(0, 2, 25, 50, "20pt ARIAL", 30, deliveryString);
            //Quantity Text
            LCDWriteString(0, 2, 25, 75, "20pt ARIAL", 30, poString);
            LCDWriteString(0, 2, 25, 100, "20pt ARIAL", 30, customerString);

          }

          let acceptFunction = function () {
         // check if signature is present before sending to BE
         var signature = GetSigString();

         if (signature > 0) {
        
            window.topazCallBack = async function (base64image) {

              const b64toBlob = (b64Data, contentType, sliceSize) => {
                contentType = contentType || "";
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                  var slice = byteCharacters.slice(offset, offset + sliceSize);
                  var byteNumbers = new Array(slice.length);
                  for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                  }
                  var byteArray = new Uint8Array(byteNumbers);
                  byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
              };

              let blobImage = b64toBlob(base64image, 'image/png');
              const csrfResponse = await fetch('/sap/opu/odata/sap/ZTOPAZ_SIG_UPLOAD_SRV/', {
                headers: {
                  "X-CSRF-Token": "Fetch"
                },
                method: "HEAD"
              });

              const response = await fetch('/sap/opu/odata/sap/ZTOPAZ_SIG_UPLOAD_SRV/DeliveryDocumentSet', {
                headers: {
                  slug: deliveryNumber + '.png',
                  "Content-Type": 'image/png',
                  "DocumentNumber": deliveryNumber,
                  "X-CSRF-Token": csrfResponse.headers.get("X-CSRF-Token")
                },
                method: "POST",
                body: blobImage,
              })
                .then((response) => response.text())
                .then((data) => {
                  sap.m.MessageBox.show("Signature successfully uploaded to delivery document " + deliveryNumber, {
                    icon: sap.m.MessageBox.Icon.SUCCESS,
                    title: "Signature Complete",
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function (oAction) {
                      if (oAction === sap.m.MessageBox.Action.OK) {
                        LcdRefresh(0, 0, 0, 640, 480);
                        window.close();
                      }
                    }
                  });
                });
              return response;
            }

            SetImageXSize(582);
            SetImageYSize(210);
            SetImagePenWidth(5);
            GetSigImageB64(window.topazCallBack);
          }else {
            this.signatureScreen();
          }
          };
          let cancelFunction = function () {
            sap.m.MessageBox.show("Customer has canceled Delivery", {
              icon: sap.m.MessageBox.Icon.WARNING,
              title: "Cancel",
              actions: [sap.m.MessageBox.Action.OK],
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  LcdRefresh(0, 0, 0, 640, 480);
                  Reset();
                  window.close();
                }
              }
            });
          };
          let clearFunction = function () {

            // ClearSigWindow(0);
            this.signatureScreen();

          };
          // Show "Accept" and "Cancel" buttons
          this.acceptButton();
          this.cancelButton();
          this.clearButton();
          this.screenButtonListener(0, acceptFunction.bind(this));
          this.screenButtonListener(1, cancelFunction.bind(this));
          this.screenButtonListener(2, clearFunction.bind(this));

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


            oDataModel.read("/" + "DeliveryPOCustomerInfo", {

              filters: aFilters,
              async: true,
              success: function (oData) {
                resolve(oData);
                console.log(oData);

                for (var i = 0; i < oData.results.length; i++) {
                  var item = oData.results[i];
                  delPOCustJSON[item.ID] = item;
                }
                resolve(true);
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

            let oFilters = new Filter({
              filters: [
                new Filter({
                  path: 'DeliveryDocument',
                  operator: FilterOperator.EQ,
                  value1: deliveryNumber
                }),
                new Filter({
                  path: 'CustomerCertRequired',
                  operator: FilterOperator.EQ,
                  value1: 'X'
                })

              ],
              and: true
            });

            aFilters.push(oFilters);

            oDataModel.read("/" + "CustomerCertStatus", {

              filters: aFilters,
              async: true,
              success: function (oData) {
                resolve(oData);
                console.log(oData);
                for (var i = 0; i < oData.results.length; i++) {
                  var item = oData.results[i];
                  customerJSON[item.ID] = item;
                }

                resolve(true);
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


            if (KeyPadQueryHotSpot(hotSpotNumber) > 0) {

              KeyPadClearHotSpotList();
              callback();
            } else {
              setTimeout(checkHotspots, 3000);
            }
          }

          // Start checking hotspots
          checkHotspots();

        },
        deliveryDetailsScreenHeader: function () {
          LcdRefresh(0, 0, 0, 640, 480);
          LCDSetPixelDepth(8);

          LCDSendGraphicUrl(0, 2, 0, 0, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/DeliveryDetails.bmp"), document.baseURI).href);
        },
        customerCertHeaderImage: function () {
          LcdRefresh(0, 0, 0, 640, 480);
          LCDSendGraphicUrl(0, 2, 0, 0, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/CustomerCertification.bmp"), document.baseURI).href);
        },
        signatureScreenImages: function () {
          LcdRefresh(0, 0, 0, 640, 480);
          
          LCDSendGraphicUrl(0, 2, 0, 0, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/SignatureHeader.bmp"), document.baseURI).href);
          
          LCDSendGraphicUrl(0, 2, 27, 150, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/SignatureArea.bmp"), document.baseURI).href);
        },
        acceptButton: function () {
          LCDSendGraphicUrl(0, 2, 450, 375, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/AcceptButton.bmp"), document.baseURI).href);
          KeyPadAddHotSpot(0, 1, 450, 370, 135, 75);

        },
        cancelButton: function () {
          
          LCDSendGraphicUrl(0, 2, 50, 375, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/CancelButton.bmp"), document.baseURI).href);
          KeyPadAddHotSpot(1, 1, 45, 375, 135, 75);
        },
        clearButton: function () {
          
          LCDSendGraphicUrl(0, 2, 260, 375, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/ClearButton.bmp"), document.baseURI).href);
          KeyPadAddHotSpot(2, 1, 260, 375, 135, 75);
        },
        nextButton: function () {
          
          LCDSendGraphicUrl(0, 2, 260, 375, new URL(sap.ui.require.toUrl("com/borderstates/topazsignature/images/Next.bmp"), document.baseURI).href);
          KeyPadAddHotSpot(3, 1, 260, 375, 135, 75);
        },
        displayCustomerCertStatement: function () {
          let string1 = 'The Customer Signature Certifies the Material';
          let string2 = 'described herein are being used in construction';
          let string3 = 'of the improvments for the referenced project';

          LCDSetPixelDepth(8);
          LCDWriteString(0, 2, 12, 100, "20pt ARIAL", 30, string1);
          LCDWriteString(0, 2, 12, 150, "20pt ARIAL", 30, string2);
          LCDWriteString(0, 2, 12, 200, "20pt ARIAL", 30, string3);

        },

        onInit: function () {
          // if (!document.IsSigWebInstalled) {
          //   // Do something here to check if SigWeb is installed
          //   var callback = this.sigWebLoaded;
          //   var sigWebScript = document.createElement("script");
          //   sigWebScript.setAttribute("src", "../lib/SigWebTablet.js");
          //   sigWebScript.onload = callback;
          //   document.head.appendChild(sigWebScript);
          // }
          this.sigWebLoaded();
          if (
            this.getOwnerComponent().getComponentData() && 
            this.getOwnerComponent().getComponentData().startupParameters.DeliveryNumber &&
            this.getOwnerComponent().getComponentData().startupParameters.DeliveryNumber.length > 0) {
            deliveryNumber = this.getOwnerComponent().getComponentData().startupParameters.DeliveryNumber[0];
          }else { 
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            deliveryNumber = urlParams.get('DeliveryNumber');}
          this.isCustomerCertRequired(deliveryNumber);
          this.getPODelNumCustomerName(deliveryNumber);
          let oPromise = new Promise((resolve, reject) => {
            this.startSigProcess();
            resolve(true);
          });
          oPromise
            .then(
              function () {
              }.bind(this)
            )

            .catch(function (err) {
              console.log(err);
              // reject(err); // error handling
            });
        },
      }
    );
  }
);
