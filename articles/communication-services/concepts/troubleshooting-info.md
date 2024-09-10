---
title: Troubleshooting in Azure Communication Services
description: Learn how to gather the information you need to troubleshoot your Communication Services solution.
author: manoskow
manager: chpalm
services: azure-communication-services

ms.author: prakulka
ms.date: 03/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---

# Troubleshooting in Azure Communication Services
<a name="calling-sdk-error-codes"></a>

This document helps you troubleshoot issues that you might experience within your Communication Services solution. If you're troubleshooting SMS, you can [enable delivery reporting with Event Grid](../quickstarts/sms/handle-sms-events.md) to capture SMS delivery details.

## Getting help

We encourage developers to submit questions, suggest features, and report problems as issues. For more information, see the [dedicated support and help options page](../support.md). 

To help you troubleshoot certain issues, you might need one or more of the following pieces of information:

* **MS-CV ID**: Troubleshoot calls and messages.
* **Call ID**: Identify Communication Services calls.
* **SMS message ID**: Identify SMS messages.
* **Short Code Program Brief ID**: Identify a short code program brief application.
* **Toll-free verification campaign brief ID**: Identify a toll-free verification campaign brief application.
* **Email message ID**: Identify Send Email requests.
* **Correlation ID**: Identify requests made using Call Automation. 
* **Call logs**: Contain detailed information can be used to troubleshoot calling and network issues.

For more information about throttling and limitations, see [Service limits](service-limits.md).

## Access your MS-CV ID

You can access the MS-CV ID by configuring diagnostics in the `clientOptions` object instance when initializing your SDKs. You can configure diagnostics for any Azure SDK including Chat, Identity, and VoIP calling.

### Client options example

The following code snippets demonstrate diagnostics configuration. When you enable diagnostics for SDKs, diagnostics details can be emitted to the configured event listener:

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

## Access IDs required for Call Automation
When troubleshooting issues with the Call Automation SDK, such as call management or recording problems, you need to collect the IDs that help identify the failing call or operation. You can provide either of the following two IDs.

- From the header of API response, locate the field `X-Ms-Skype-Chain-Id`.
 
    ![Screenshot of response header showing X-Ms-Skype-Chain-Id.](media/troubleshooting/response-header.png)

- From the callback events, your application receives after executing an action. For example `CallConnected` or `PlayFailed`, locate the correlationID.

    ![Screenshot of call disconnected event showing correlation ID.](media/troubleshooting/correlation-id-in-callback-event.png)

In addition to one of these IDs, you need to provide details about the failing use case and the timestamp when the failure occurred.

## Access your client call ID

When troubleshooting voice or video calls, you might need to provide a `call ID`. Access this value via the `id` property of the `call` object:

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
console.log(result); // your message ID is in the result
}
```
---
## Access your short code program brief ID
Find the program brief ID on the [Azure portal](https://portal.azure.com) in the Short Codes section. 

:::image type="content" source="./media/short-code-trouble-shooting.png" alt-text="Screenshot showing a short code program brief ID.":::

---
## Access your toll-free verification campaign brief ID
Find the program brief ID on the [Azure portal](https://portal.azure.com) in the Regulatory Documents section. 

:::image type="content" source="./media/toll-free-troubleshooting.png" alt-text="Screenshot showing a toll free verification campaign brief ID.":::

---

## Access your email operation ID
When troubleshooting send email or email message status requests, you might need to provide an `operation ID`. You can access this value in the response:

# [.NET](#tab/dotnet)
```csharp
var emailSendOperation = await emailClient.SendAsync(
    wait: WaitUntil.Completed,
    senderAddress: sender,
    recipientAddress: recipient,
    subject: subject,
    htmlContent: htmlContent);

/// Get the OperationId so that it can be used for tracking the message for troubleshooting
Console.WriteLine($"Email operation id = {emailSendOperation.Id}");
```
---

## Accessing Support Files in the Calling SDK

Calling SDK provides convenient methods to access to the Log Files. These files can serve valuable to Microsoft support specialists and engineers. We recommend that you collect these logs when you detect an issue.

## Enable and Access Call Logs

### [JavaScript]

The Azure Communication Services Calling SDK relies internally on [@azure/logger](https://www.npmjs.com/package/@azure/logger) library to control logging.

Use the `setLogLevel` method from the `@azure/logger` package to configure the log output level. Create a logger and pass it into the `CallClient` constructor as follows:

```javascript
import { setLogLevel, createClientLogger, AzureLogger } from '@azure/logger';
setLogLevel('verbose');
let logger = createClientLogger('ACS');
const callClient = new CallClient({ logger });
```

You can use AzureLogger to redirect the logging output from Azure SDKs by overriding the `AzureLogger.log` method:

You can log to the browser console, a file, buffer, send to our own service, and so on. If you're going to send logs over the network to your own service, don't send a request per log line because this adversely affects browser performance. Instead, accumulate logs lines and send them in batches.

```javascript
// Redirect log output
AzureLogger.log = (...args) => {
    // To console, file, buffer, REST API, etc...
    console.log(...args); 
};
```

### Native SDK (Android/iOS)

For Android, iOS, and Windows, the Azure Communication Services Calling SDK offers access to log files.

For Calling Native SDKs, see the [Log file access tutorials](../tutorials/log-file-retrieval-tutorial.md)

### UI Libraries (Android, iOS)

If you're using the Azure Communication Services UI Libraries for Android or iOS, you can solicit user feedback through the built-in support form.

For more information about the support functions of the Calling UI Support form, see the [Support Form integration tutorial](../tutorials/collecting-user-feedback/collecting-user-feedback.md). This document guides you through adding the necessary event handler, and creating a basic client/server implementation for centralized storage of support information. This guide describes the path for integrating with the support services used by your organization.

## Building end to end Support Flows in your ACS Integrations

Whether you're using Calling SDK or Calling UI SDK, providing support to your customers is a key component of any robust integration. The following document highlights the key considerations at each point of the Support feedback loop, and provides jumping off points to learn more.

[Providing User Support](../concepts/voice-video-calling/retrieve-support-files.md)

---
<a name='finding-azure-active-directory-information'></a>

## Finding Microsoft Entra information

* **Getting Directory ID**
* **Getting Application ID**
* **Getting User ID**

## Getting Directory ID 
To find your Directory (tenant) ID, follow these steps:

1. Navigate to [Azure portal](https://portal.azure.com) and sign in to the Azure portal using the credentials.
1. From the left-pane, select Microsoft Entra ID.
1. From **Overview** page in Microsoft Entra ID, copy the Directory (tenant) ID and store it in your application code.

    ![Screenshot of how to copy Microsoft Entra tenant ID and store it.](./media/troubleshooting/copy-aad-directory-id.png)

## Getting Application ID 
To find your Application ID, follow these steps:

1. Navigate to [Azure portal](https://portal.azure.com) and sign in to the Azure portal using the credentials.
1. From the left-pane, select Microsoft Entra ID.
1. From **App registrations** in Microsoft Entra ID, select your application.
1. Copy the **Application ID** and store it in your application code.

   ![Screenshot of how to copy Microsoft Entra application ID and store it.](./media/troubleshooting/copy-aad-application-id.png)

   The directory (tenant) ID can also be found in the application overview page.

## Getting User ID
To find your User ID, follow these steps:

1. Navigate to [Azure portal](https://portal.azure.com) and sign in to the Azure portal using the credentials.
1. From the left-pane, select Microsoft Entra ID.
1. From **Users** in Microsoft Entra ID, select your user.
1. From **Profile** page in Microsoft Entra users, copy the **Object ID** and store it in your application code.

   ![Screenshot of how to copy Microsoft Entra user ID and store it.](./media/troubleshooting/copy-aad-user-id.png)

## Getting immutable resource ID 
Sometimes you also need to provide immutable resource ID of your Communication Service resource. To find it, follow these steps:

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
To verify your Teams License eligibility via Teams web client, follow these steps:

1. Open your browser and navigate to [Teams web client](https://teams.microsoft.com/).
1. Sign in with credentials that have a valid Teams license. 
1. If the authentication is successful and you remain in the https://teams.microsoft.com/ domain, then your Teams License is eligible. If authentication fails or you're redirected to the https://teams.live.com/v2/ domain, then your Teams License isn't eligible to use Azure Communication Services support for Teams users. 

#### Checking your current Teams license via Microsoft Graph API
You can find your current Teams license using [licenseDetails](/graph/api/resources/licensedetails) Microsoft Graph API that returns the licenses assigned to a user. Follow these steps to use the Graph Explorer tool to view licenses assigned to a user:

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

    The response object shown here might be shortened for readability.
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

## Related articles
- [Troubleshooting Azure Communication Services PSTN call failures](./telephony/troubleshooting-pstn-call-failures.md).
- [Troubleshooting call end response codes for Calling SDK, Call Automation SDK, PSTN, Chat SDK, and SMS SDK](../resources/troubleshooting/voice-video-calling/troubleshooting-codes.md)(./troubleshooting-codes.md).
- Access logs for [voice and video](./analytics/logs/voice-and-video-logs.md), [chat](./analytics/logs/chat-logs.md), [email](./analytics/logs/email-logs.md), [network traversal](./analytics/logs/network-traversal-logs.md), [recording](./analytics/logs/recording-logs.md), [SMS](./analytics/logs/sms-logs.md) and [call automation](./analytics/logs/call-automation-logs.md).
- [Metrics](metrics.md).
- [Service limits](service-limits.md).
