## Topaz Signature


This Ui5 application utilizes the SigWeb Topaz SDK. The application acts as a proxy to control a Topaz SigGem Color 5.7 Signature Pad (model: T-LBK57GC ) device. The purpose of the development is to display Delivery Items, a customer statement, collect a signature and store the signature in the Delivery Document header text. 



## Functionality

When the Ui5 application is launched it triggers the Sigweb controller. The controller then communciates with the device and begins the process. The process starts with displaying a delivery item header image, delivery item description and delivery item quantity. Depending on the number of items, it will show a Cancel and Accept buttons. In the event there are more than 5 items. It will show a Next button and repeat this process until the user has seen all of the items on the delivery. Once the user decides to accept the items, it then checks to see if they customer needs to be shown the customer certification statement. This is handled by a GET request to the Topaz Integration API (BE dependancy). If the GET request doesn't not return any values, then the user does not need to see the customer certification statement and takes the user to the Signature page. If the GET request does return values for the Delivery. The user will be taken to the Customer Cert screen that has a Customer Cert header image, the customer cert statement and the Cancel and Accept buttons. If the user accepts the statement, it then take the user to the final signature screen.

## Architecture

![image](https://github.com/MindsetConsulting/com.borderstates.topazsignature/assets/91226856/aa3aa5d0-07f6-4f91-b666-ec27425634e1)


## Screen Flow
 Delivery Item Screen
![image](https://github.com/MindsetConsulting/com.borderstates.topazsignature/assets/91226856/88544768-0960-48f3-bc6a-c9fc31e37d61)

 Customer Certification Screen
![image](https://github.com/MindsetConsulting/com.borderstates.topazsignature/assets/91226856/c6b0b5a4-348a-4e39-96d5-b5bf71611bbd)

 Signature Screen
![image](https://github.com/MindsetConsulting/com.borderstates.topazsignature/assets/91226856/db09400e-ea1b-436f-8a8d-71814053ea6a)





## Dependancies 
![image](https://github.com/MindsetConsulting/com.borderstates.topazsignature/assets/91226856/f32d91f1-7a7a-432b-a0de-057e3db22f94)
![image](https://github.com/MindsetConsulting/com.borderstates.topazsignature/assets/91226856/2f77c912-1fc9-4f69-b6ee-b0d43e70d8b0)


## SigWeb Control Documentation
 
https://www.topazsystems.com/software/download/sigweb.pdf

## SDKs

https://www.topazsystems.com/sdks/sigweb.html

## Topaz Device Details

Model: T-LBK57GC-BHSB-R
LBK57, HSB PAD, SigGem Color


## Application Details
|               |
| ------------- |
|**Generation Date and Time**<br>Wed Jul 12 2023 11:14:30 GMT-0500 (Central Daylight Time)|
|**App Generator**<br>@sap/generator-fiori-freestyle|
|**App Generator Version**<br>1.8.3|
|**Generation Platform**<br>Visual Studio Code|
|**Template Used**<br>simple|
|**Service Type**<br>File|
|**Metadata File**<br>OP_API_OUTBOUND_DELIVERY_SRV_0002.edmx
|**Module Name**<br>topazsignature|
|**Application Title**<br>Topaz Signature Capture|
|**Namespace**<br>com.borderstates|
|**UI5 Theme**<br>sap_horizon|
|**UI5 Version**<br>1.112.1|
|**Enable Code Assist Libraries**<br>False|
|**Enable TypeScript**<br>False|
|**Add Eslint configuration**<br>False|

## topazsignature

A Fiori application.

### Starting the generated app

-   This app has been generated using the SAP Fiori tools - App Generator, as part of the SAP Fiori tools suite.  In order to launch the generated app, simply run the following from the generated app root folder:

```
    npm start
```

- It is also possible to run the application using mock data that reflects the OData Service URL supplied during application generation.  In order to run the application with Mock Data, run the following from the generated app root folder:

```
    npm run start-mock
```

#### Pre-requisites:

1. Active NodeJS LTS (Long Term Support) version and associated supported NPM version.  (See https://nodejs.org)
