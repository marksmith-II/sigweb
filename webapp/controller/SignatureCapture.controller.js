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



	function startTablet()
	{
	
		
		
			SetTabletState(1);
			var tabletState = GetTabletState();
			    LcdRefresh(0, 0, 0, 640, 480);
				ClearSigWindow(1);
				// SetDisplayXSize( 640 );
				// SetDisplayYSize( 33 );
				// SetImageXSize(640);
				// SetImageYSize(33);

				 SetLCDCaptureMode( 2 );
				 LCDSetPixelDepth(8);
				 LCDSendGraphicUrl(1, 2, 0, 0, "https://github.com/MindsetConsulting/com.borderstates.topazsignature/blob/main/webapp/images/Delivery_Details%20.bmp");
				LCDSetPixelDepth(8);
				LCDWriteString(0, 2, 20, 375, "20pt Verdana", 27, "Tablet Instanciated");
				 LCDSetWindow(0, 0, 1, 1);
				 SetSigWindow(1, 0, 0, 1, 1);
				// KeyPadAddHotSpot(0, 1, 20, 370, 300, 50);
				 SetLCDCaptureMode( 2 );
			

	}
    startTablet();
 
                 
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
