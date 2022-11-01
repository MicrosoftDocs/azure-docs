---
title: Troubleshooting in Azure Communication Services
description: Learn how to gather the information you need to troubleshoot your Communication Services solution.
author: manoskow
manager: chpalm
services: azure-communication-services

ms.author: prakulka
ms.date: 11/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Troubleshooting in Azure Communication Services

This document will help you troubleshoot issues that you may experience within your Communication Services solution. If you're troubleshooting SMS, you can [enable delivery reporting with Event Grid](../quickstarts/sms/handle-sms-events.md) to capture SMS delivery details.

## Getting help

We encourage developers to submit questions, suggest features, and report problems as issues. To aid in doing this we have a [dedicated support and help options page](../support.md) which lists your options for support. 

To help you troubleshoot certain types of issues, you may be asked for any of the following pieces of information:

* **MS-CV ID**: This ID is used to troubleshoot calls and messages.
* **Call ID**: This ID is used to identify Communication Services calls.
* **SMS message ID**: This ID is used to identify SMS messages.
* **Short Code Program Brief ID**: This ID is used to identify a short code program brief application.
* **Call logs**: These logs contain detailed information that can be used to troubleshoot calling and network issues.

Also take a look at our [service limits](service-limits.md) documentation for more information on throttling and limitations.

## Access your MS-CV ID

The MS-CV ID can be accessed by configuring diagnostics in the `clientOptions` object instance when initializing your SDKs. Diagnostics can be configured for any of the Azure SDKs including Chat, Identity, and VoIP calling.

### Client options example

The following code snippets demonstrate diagnostics configuration. When the SDKs are used with diagnostics enabled, diagnostics details will be emitted to the configured event listener:

# [C#](#tab/csharp)
```
// 1. Import Azure.Core.Diagnostics
using Azure.Core.Diagnostics;

// 2. Initialize an event source listener instance
using var listener = AzureEventSourceListener.CreateConsoleLogger();
Uri endpoint = new Uri("https://<RESOURCE-NAME>.communication.azure.net");
var (token, communicationUser) = await GetCommunicationUserAndToken();
CommunicationUserCredential communicationUserCredential = new CommunicationUserCredential(token);

// 3. Setup diagnostic settings
var clientOptions = new ChatClientOptions()
{
    Diagnostics =
    {
        LoggedHeaderNames = { "*" },
        LoggedQueryParameters = { "*" },
        IsLoggingContentEnabled = true,
    }
};

// 4. Initialize the ChatClient instance with the clientOptions
ChatClient chatClient = new ChatClient(endpoint, communicationUserCredential, clientOptions);
ChatThreadClient chatThreadClient = await chatClient.CreateChatThreadAsync("Thread Topic", new[] { new ChatThreadMember(communicationUser) });
```

# [Python](#tab/python)
```
from azure.communication.chat import ChatClient, CommunicationUserCredential
endpoint = "https://communication-services-sdk-live-tests-for-python.communication.azure.com"
chat_client = ChatClient(
    endpoint,
    CommunicationUserCredential(token),
    http_logging_policy=your_logging_policy)
```
---

## Access your server call ID
When troubleshooting issues with the Call Automation SDK, like call recording and call management problems, you'll need to collect the Server Call ID. This ID can be collected using the ```getServerCallId``` method.

#### JavaScript
```
callAgent.on('callsUpdated', (e: { added: Call[]; removed: Call[] }): void => {
    e.added.forEach((addedCall) => {
        addedCall.on('stateChanged', (): void => {
            if (addedCall.state === 'Connected') {
                addedCall.info.getServerCallId().then(result => {
                    dispatch(setServerCallId(result));
                }).catch(err => {
                    console.log(err);
                });
            }
        });
    });
});
```


## Access your client call ID

When troubleshooting voice or video calls, you may be asked to provide a `call ID`. This can be accessed via the `id` property of the `call` object:

# [JavaScript](#tab/javascript)
```javascript
// `call` is an instance of a call created by `callAgent.startCall` or `callAgent.join` methods
console.log(call.id)
```

# [iOS](#tab/ios)
```objc
// The `call id` property can be retrieved by calling the `call.getCallId()` method on a call object after a call ends
// todo: the code snippet suggests it's a property while the comment suggests it's a method call
print(call.callId)
```

# [Android](#tab/android)
```java
// The `call id` property can be retrieved by calling the `call.getCallId()` method on a call object after a call ends
// `call` is an instance of a call created by `callAgent.startCall(…)` or `callAgent.join(…)` methods
Log.d(call.getCallId())
```
---

## Access your SMS message ID

For SMS issues, you can collect the message ID from the response object.

# [.NET](#tab/dotnet)
```
// Instantiate the SMS client
const smsClient = new SmsClient(connectionString);
async function main() {
  const result = await smsClient.send({
    from: "+18445792722",
    to: ["+1972xxxxxxx"],
    message: "Hello World 👋🏻 via Sms"
  }, {
    enableDeliveryReport: true // Optional parameter
  });
console.log(result); // your message ID will be in the result
}
```
---
## Access your short code program brief ID
The program brief ID can be found on the [Azure portal](https://portal.azure.com) in the Short Codes blade. 

:::image type="content" source="./media/short-code-trouble-shooting.png" alt-text="Screenshot showing a short code program brief ID.":::
---

## Enable and access call logs

# [JavaScript](#tab/javascript)

The Azure Communication Services Calling SDK relies internally on [@azure/logger](https://www.npmjs.com/package/@azure/logger) library to control logging.
Use the `setLogLevel` method from the `@azure/logger` package to configure the log output:

```javascript
import { setLogLevel } from '@azure/logger';
setLogLevel('verbose');
const callClient = new CallClient();
```

You can use AzureLogger to redirect the logging output from Azure SDKs by overriding the `AzureLogger.log` method:
This may be useful if you want to redirect logs to a location other than console.

```javascript
import { AzureLogger } from '@azure/logger';
// redirect log output
AzureLogger.log = (...args) => {
  console.log(...args); // to console, file, buffer, REST API..
};
```

# [iOS](#tab/ios)

When developing for iOS, your logs are stored in `.blog` files. Note that you can't view the logs directly because they're encrypted.

These can be accessed by opening Xcode. Go to Windows > Devices and Simulators > Devices. Select your device. Under Installed Apps, select your application and click on "Download container".

This will give you a `xcappdata` file. Right-click on this file and select “Show package contents”. You'll then see the `.blog` files that you can then attach to your Azure support request.

# [Android](#tab/android)

When developing for Android, your logs are stored in `.blog` files. Note that you can't view the logs directly because they're encrypted.

On Android Studio, navigate to the Device File Explorer by selecting View > Tool Windows > Device File Explorer from both the simulator and the device. The `.blog` file will be located within your application's directory, which should look something like `/data/data/[app_name_space:com.contoso.com.acsquickstartapp]/files/acs_sdk.blog`. You can attach this file to your support request.

---

## Enable and access call logs (Windows)

When developing for Windows, your logs are stored in `.blog` files. Note that you can't view the logs directly because they're encrypted.

These can be accessed by looking at where your app is keeping its local data. There are many ways to figure out where a UWP app keeps its local data, the following steps are just one of these ways:
1. Open a Windows Command Prompt (Windows Key + R)
2. Type `cmd.exe`
3. Type `where /r %USERPROFILE%\AppData acs*.blog`
4. Please check if the app ID of your application matches with the one returned by the previous command.
5. Open the folder with the logs by typing `start ` followed by the path returned by the step 3. For example: `start C:\Users\myuser\AppData\Local\Packages\e84000dd-df04-4bbc-bf22-64b8351a9cd9_k2q8b5fxpmbf6`
6. Please attach all the `*.blog` and `*.etl` files to your Azure support request.

## Finding Azure Active Directory information

* **Getting Directory ID**
* **Getting Application ID**
* **Getting User ID**

## Getting Directory ID 
To find your Directory (tenant) ID, follow the steps listed below:

1. Navigate to [Azure portal](https://portal.azure.com) and sign in to the Azure portal using the credentials.
1. From the left-pane, select Azure Active Directory.
1. From **Overview** page in Azure AD, copy the Directory (tenant) ID and store it in your application code.

    ![Screenshot of how to copy Azure Active Directory tenant ID and store it.](./media/troubleshooting/copy-aad-directory-id.png)

## Getting Application ID 
To find your Application ID, follow the steps listed below:

1. Navigate to [Azure portal](https://portal.azure.com) and sign in to the Azure portal using the credentials.
1. From the left-pane, select Azure Active Directory.
1. From **App registrations** in Azure AD, select your application.
1. Copy the **Application ID** and store it in your application code.

   ![Screenshot of how to copy Azure Active Directory application ID and store it.](./media/troubleshooting/copy-aad-application-id.png)

   The directory (tenant) ID can also be found in the application overview page.

## Getting User ID
To find your User ID, follow the steps listed below:

1. Navigate to [Azure portal](https://portal.azure.com) and sign in to the Azure portal using the credentials.
1. From the left-pane, select Azure Active Directory.
1. From **Users** in Azure AD, select your user.
1. From **Profile** page in Azure AD Users, copy the **Object ID** and store it in your application code.

   ![Screenshot of how to copy Azure Active Directory user ID and store it.](./media/troubleshooting/copy-aad-user-id.png)

## Getting immutable resource ID 
Sometimes you also need to provide immutable resource ID of your Communication Service resource. To find it, follow the steps listed below:

1. Navigate to [Azure portal](https://portal.azure.com) and sign in to the Azure portal using the credentials.
1. Open your Communication Service resource.
1. From the left-pane, select **Overview**, and switch to a **JSON view**
    :::image type="content" source="./media/troubleshooting/switch-communication-resource-to-json.png" alt-text="Screenshot of how to switch Communication Resource overview to a JSON view.":::
1. From **Resource JSON** page, copy the `immutableResourceId` value, and provide it to your support team.
    :::image type="content" source="./media/troubleshooting/communication-resource-id-json.png" alt-text="Screenshot of Resource JSON.":::

## Verification of Teams license eligibility to use Azure Communication Services support for Teams users

There are two ways to verify your Teams License eligibility to use Azure Communication Services support for Teams users:

* **Verification via Teams web client**
* **Checking your current Teams license via Microsoft Graph API**

#### Verification via Teams web client 
To verify your Teams License eligibility via Teams web client, follow the steps listed below:

1. Open your browser and navigate to [Teams web client](https://teams.microsoft.com/).
1. Sign in with credentials that have a valid Teams license. 
1. If the authentication is successful and you remain in the https://teams.microsoft.com/ domain, then your Teams License is eligible. If authentication fails or you're redirected to the https://teams.live.com/v2/ domain, then your Teams License isn't eligible to use Azure Communication Services support for Teams users. 

#### Checking your current Teams license via Microsoft Graph API
You can find your current Teams license using [licenseDetails](/graph/api/resources/licensedetails) Microsoft Graph API that returns licenses assigned to a user. Follow the steps below to use the Graph Explorer tool to view licenses assigned to a user:

1. Open your browser and navigate to [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)
1. Sign in to Graph Explorer using the credentials.
    :::image type="content" source="./media/troubleshooting/graph-explorer-sign-in.png" alt-text="Screenshot of how to sign in to Graph Explorer.":::
1. In the query box, enter the following API and click **Run Query** :
    <!-- { "blockType": "request" } -->
    ```http
    https://graph.microsoft.com/v1.0/me/licenseDetails
    ```
    :::image type="content" source="./media/troubleshooting/graph-explorer-query-box.png" alt-text="Screenshot of how to enter API in Graph Explorer.":::

    Or you can query for a particular user by providing the user ID using the following API:
    <!-- { "blockType": "request" } -->
    ```http
    https://graph.microsoft.com/v1.0/users/{id}/licenseDetails
    ```
1.  The **Response preview**  pane displays output as follows:

    Note that the response object shown here might be shortened for readability.
    <!-- {
    "blockType": "response",
    "truncated": true,
    "isCollection": true
    } -->
    ```http
    {
        "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users('071cc716-8147-4397-a5ba-b2105951cc0b')/assignedLicenses",
        "value": [
            {
                "skuId": "b05e124f-c7cc-45a0-a6aa-8cf78c946968",
                "servicePlans":[
                    {
                        "servicePlanId":"57ff2da0-773e-42df-b2af-ffb7a2317929",
                        "servicePlanName":"TEAMS1",
                        "provisioningStatus":"Success",
                        "appliesTo":"User"
                    }
                ]
            }
        ]
    }
    ```
1. Find license detail where property `servicePlanName` has one of the values in the [Eligible Teams Licenses table](../quickstarts/eligible-teams-licenses.md)


## Calling SDK error codes

The Azure Communication Services Calling SDK uses the following error codes to help you troubleshoot calling issues. These error codes are exposed through the `call.callEndReason` property after a call ends.

| Error code | Description | Action to take |
| -------- | ---------------| ---------------|
| 403 | Forbidden / Authentication failure. | Ensure that your Communication Services token is valid and not expired. |
| 404 | Call not found. | Ensure that the number you're calling (or call you're joining) exists. |
| 408 | Call controller timed out. | Call Controller timed out waiting for protocol messages from user endpoints. Ensure clients are connected and available. |
| 410 | Local media stack or media infrastructure error. | Ensure that you're using the latest SDK in a supported environment. |
| 430 | Unable to deliver message to client application. | Ensure that the client application is running and available. |
| 480 | Remote client endpoint not registered. | Ensure that the remote endpoint is available. |
| 481 | Failed to handle incoming call. | File a support request through the Azure portal. |
| 487 | Call canceled, locally declined, ended due to an endpoint mismatch issue, or failed to generate media offer. | Expected behavior. |
| 490, 491, 496, 487, 498 | Local endpoint network issues. | Check your network. |
| 500, 503, 504 | Communication Services infrastructure error. | File a support request through the Azure portal. |
| 603 | Call globally declined by remote Communication Services participant | Expected behavior. |

## Chat SDK error codes

The Azure Communication Services Chat SDK uses the following error codes to help you troubleshoot chat issues. The error codes are exposed through the `error.code` property in the error response.

| Error code | Description | Action to take |
| -------- | ---------------| ---------------|
| 401 | Unauthorized | Ensure that your Communication Services token is valid and not expired. |
| 403 | Forbidden | Ensure that the initiator of the request has access to the resource. |
| 429 | Too many requests | Ensure that your client-side application handles this scenario in a user-friendly manner. If the error persists, please file a support request. |
| 503 | Service Unavailable | File a support request through the Azure portal. |

## SMS error codes

The Azure Communication Services SMS SDK uses the following error codes to help you troubleshoot SMS issues. The error codes are exposed through the "DeliveryStatusDetails" field in the SMS delivery report. 

| Error code | Description | Action to take |
| -------- | ---------------| ---------------|
| 2000 | Message Delivered Successfully |  |
| 4000 | Message is rejected due to fraud detection | Ensure you aren't exceeding the maximum number of messages allowed for your number|
| 4001 | Message is rejected due to invalid Source/From number format| Ensure the To number is in E.164 format and From number format is in E.164 or Short code format |
| 4002 | Message is rejected due to invalid Destination/To number format| Ensure the To number is in E.164 format |
| 4003 | Message failed to deliver due to unsupported destination| Check if the destination you're trying to send to is supported |
| 4004 | Message failed to deliver since Destination/To number doesn't exist| Ensure the To number you're sending to is valid |
| 4005 | Message is blocked by Destination carrier|  |
| 4006 | The Destination/To number isn't reachable| Try resending the message at a later time |
| 4007 | The Destination/To number has opted out of receiving messages from you| Mark the Destination/To number as opted out so that no further message attempts are made to the number|
| 4008 | You've exceeded the maximum number of messages allowed for your profile| Ensure you aren't exceeding the maximum number of messages allowed for your number or use queues to batch the messages |
| 4009 | Message is rejected by Microsoft Entitlement System| Most often it happens if fraudulent activity is detected. Please contact support for more details |
| 4010 | Message was blocked due to the toll free number not being verified | Review unverified sending limits and submit TFN for verification as soon as possible |
| 4020 | Message rejected by carrier due to a volumetric violation |  |
| 5000 | Message failed to deliver. Please reach out Microsoft support team for more details| File a support request through the Azure portal |
| 5001 | Message failed to deliver due to temporary unavailability of application/system|  |
| 5002 | Message Delivery Timeout|  Try resending the message |
| 9999 | Message failed to deliver due to unknown error/failure|  Try resending the message |


## Related information
- [Logs and diagnostics](logging-and-diagnostics.md)
- [Metrics](metrics.md)
- [Service limits](service-limits.md)
