---
author: DaybreakQuip
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/20/2023
ms.author: zehangzheng
---
[!INCLUDE [Emergency Calling Notice](../../../includes/emergency-calling-notice-include.md)]

## Prerequisites

- A working [Communication Services calling web app](../pstn-call.md)

## Important considerations

- The capability to dial an emergency number and receive a callback might be a requirement for your application. Verify the emergency calling requirements with your legal counsel.
- Microsoft uses country/region codes according to the ISO 3166-1 alpha-2 standard.
- Supported ISO codes are US (United States), PR (Puerto Rico), CA (Canada), GB (United Kingdom), and DK (Denmark) only.
- If you don't provide the country/region ISO code to the Azure Communication Services Calling SDK, Microsoft uses the IP address to determine the country or region of the caller.

  If the IP address can't provide reliable geolocation (for example, the user is on a virtual private network), you must set the ISO code of the calling country or region by using the API in the Calling SDK.
- If users are dialing from a US territory (for example, Guam, US Virgin Islands, Northern Mariana Islands, or American Samoa), you must set the ISO code to US.
- Azure Communication Services direct routing is currently in public preview and not intended for production workloads. Emergency dialing is out of scope for Azure Communication Services direct routing.
- For information about billing for the emergency service in Azure Communication Services, see the [pricing page](https://azure.microsoft.com/pricing/details/communication-services/).

## Set up a button for testing

Replace the code in *index.html* with the following snippet. It adds a new button for testing emergency calls.

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

## Specify the country or region

Specify the ISO code of the country or region where the caller is located. For a list of supported ISO codes, see the [conceptual article about emergency calling](/azure/communication-services/concepts/telephony/emergency-calling-concept).

In your *client.js* file, add the following code to retrieve the emergency button that you created in *index.html*:

```javascript
const emergencyButton = document.getElementById("emergency-button");
```

Replace your `init` function to add a field during `callAgent` creation to specify the emergency country or region:

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

## Add functionality to the call button

Add functionality to your emergency call button by adding the following code to your *client.js* file. A temporary caller ID is assigned for your emergency call whether or not you provide the `alternateCallerId` parameter.

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
> 933 is a test call service. You can use it to test emergency calling services without interrupting live 911 emergency call services. 911 must be dialed in actual emergency situations.

## Run the app and place a call

Use `webpack-dev-server` to build and run your app. Run the following command to bundle the application host on a local web server:

```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```

Open your browser and go to `http://localhost:8080/`. The completed web app appears.

:::image type="content" source="../media/emergency-calling/emergency-calling-web-app.png" alt-text="Screenshot of a completed JavaScript calling application.":::

You can place a call to 933 by selecting the **933 Test Call** button.
