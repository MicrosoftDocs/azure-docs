---
author: DaybreakQuip
ms.service: azure-communication-services
ms.topic: include
ms.date: 12/09/2021
ms.author: zehangzheng
---
[!INCLUDE [Emergency Calling Notice](../../../includes/emergency-calling-notice-include.md)]

## Prerequisites

- A working [Communication Services calling web app](../pstn-call.md).

## Important considerations
-	The capability to dial 911 and receive a call-back may be a requirement for your application. Verify the E911 requirements with your legal counsel. 
- Microsoft uses country codes according to ISO 3166-1 alpha-2 standard 
-	If the country ISO code is not provided to the SDK, the IP address will be used to determine the country of the caller. 
-	In case IP address cannot provide reliable geolocation, for example the user is on a Virtual Private Network, it is required to set the ISO Code of the calling country using the API in the Azure Communication Services Calling SDK. 
-	If users are dialing from a US territory (for example Guam, US Virgin Islands, Northern Marianas, or American Samoa), it is required to set the ISO code to the US   
-	Supported ISO codes are US and Puerto Rico only
-	Azure Communication Services direct routing is currently in public preview and not intended for production workloads. So E911 dialing is out of scope for Azure Communication Services direct routing.
-	The 911 service is temporarily free to use for Azure Communication Services customers within reasonable use, however billing for the service will be enabled in 2022.   
-	Calls to 911 are capped at 10 concurrent calls per Azure Resource.   


## Setting up
Replace the code in **index.html** with following snippet. It will add a new button for testing emergency calls.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Communication Client - Calling Sample</title>
  </head>
  <body>
    <h4>Azure Communication Services</h4>
    <h1>Calling Quickstart</h1>
    <input 
      id="callee-phone-input"
      type="text"
      placeholder="Who would you like to call?"
      style="margin-bottom:1em; width: 230px;"
    />
    <div>
      <button id="call-phone-button" type="button">
        Start Call
      </button>
      &nbsp;
      <button id="hang-up-phone-button" type="button" disabled="true">
        Hang Up
      </button>
      <button id="emergency-button" type="button">
        933 Test Call
      </button>
    </div>
    <script src="./bundle.js"></script>
  </body>
</html>
```
## Emergency test call to phone 
Specify the ISO code of the country where the caller is located. If the ISO code is not provided, the IP address will be used to determine the callers location.  Microsoft uses the ISO 3166-1 alpha-2 standard for country ISO codes, supported ISO codes are listed on the concept page for emergency calling. 

In your **client.js**, add the following code to retrieve the emergency button you've created in index.html.

```javascript
const emergencyButton = document.getElementById("emergency-button");
```

Replace your init function to add a field during callAgent creation to specify the emergency country:

```javascript
async function init() {
    const callClient = new CallClient();
    const tokenCredential = new AzureCommunicationTokenCredential('<USER ACCESS TOKEN with PSTN scope>');
    callAgent = await callClient.createCallAgent(tokenCredential, {
                emergencyCallOptions: {"countryCode": "<COUNTRY CODE>"}
            });
  //  callPhoneButton.disabled = false;
}

```
> [!WARNING]
> Note Azure Communication Services supports enhanced emergency calling to 911 from the United States and Puerto Rico only, calling 911 from other countries is not supported.

## Start a call to 933 test call service

Add the following code to your **client.js** to add functionality to your emergency call button. For US only, a temporary Caller Id will be assigned for your emergency call despite of whether alternateCallerId param is provided or not. 

```javascript
emergencyButton.addEventListener("click", () => {
  const phoneToCall = "933";
  call = callAgent.startCall(
    [{phoneNumber: phoneToCall}]);
  // toggle button states
  hangUpPhoneButton.disabled = false;
  callPhoneButton.disabled = true;
});
```
> [!IMPORTANT]
> 933 is a test emergency call service, used to test emergency calling services without interrupting live production emergency calling handling 911 services.  911 must be dialled in actual emergency situations.


## Run the code

Use the `webpack-dev-server` to build and run your app. Run the following command to bundle the application host on a local webserver:

```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```

Open your browser and navigate to `http://localhost:8080/`. You should see the following:

:::image type="content" source="../media/emergency-calling/emergency-calling-web-app.png" alt-text="Screenshot of the completed JavaScript application.":::

You can place a call to 933 by clicking the **933 Test Call** button.
