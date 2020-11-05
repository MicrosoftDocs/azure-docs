---
title: Troubleshooting in Azure Communication Services
description: Learn how to gather the information you need to troubleshoot your Communication Services solution.
author: manoskow
manager: jken
services: azure-communication-services

ms.author: manoskow
ms.date: 10/23/2020
ms.topic: overview
ms.service: azure-communication-services

---

# Troubleshooting in Azure Communication Services

This document will help you troubleshoot issues that you may experience within your Communication Services solution. If you're troubleshooting SMS, you can [enable delivery reporting with Event Grid](../quickstarts/telephony-sms/handle-sms-events.md) to capture SMS delivery details.

## Getting help

We encourage developers to submit questions, suggest features, and report problems as issues in the Communication Services [GitHub repository](https://github.com/Azure/communication). Other forums include:

* [Microsoft Q&A](https://docs.microsoft.com/answers/questions/topics/single/101418.html)
* [StackOverflow](https://stackoverflow.com/questions/tagged/azure+communication)

Depending on your Azure subscription [support plan](https://azure.microsoft.com/support/plans/) you may submit a support ticket directly through the [Azure portal](https://azure.microsoft.com/support/create-ticket/).

To help you troubleshoot certain types of issues, you may be asked for any of the following pieces of information:

* **MS-CV ID**: This ID is used to troubleshoot calls and messages. 
* **Call ID**: This ID is used to identify Communication Services calls.
* **SMS message ID**: This ID is used to identify SMS messages.
* **Call logs**: These logs contain detailed information that can be used to troubleshoot calling and network issues.


## Access your MS-CV ID

The MS-CV ID can be accessed by configuring diagnostics in the `clientOptions` object instance when initializing your client libraries. Diagnostics can be configured for any of the Azure client libraries including Chat, Administration, and VoIP calling.

### Client options example

The following code snippets demonstrate diagnostics configuration. When the client libraries are used with diagnostics enabled, diagnostics details will be emitted to the configured event listener:

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

## Access your call ID

When filing a support request through the Azure portal related to calling issues, you may be asked to provide ID of the call you're referring to. This can be accessed through the calling client library:

# [JavaScript](#tab/javascript)
```javascript
// `call` is an instance of a call created by `callAgent.call` or `callAgent.join` methods 
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
// `call` is an instance of a call created by `callAgent.call(…)` or `callAgent.join(…)` methods 
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

## Enable and access call logs




# [JavaScript](#tab/javascript)

The following code can be used to configure `AzureLogger` to output logs to the console using the JavaScript client library:

```javascript
import { AzureLogger } from '@azure/logger'; 

AzureLogger.verbose = (...args) => { console.info(...args); } 
AzureLogger.info = (...args) => { console.info(...args); } 
AzureLogger.warning = (...args) => { console.info(...args); } 
AzureLogger.error = (...args) => { console.info(...args); } 

callClient = new CallClient({logger: AzureLogger}); 
```

# [iOS](#tab/ios)

When developing for iOS, your logs are stored in `.blog` files. Note that you can't view the logs directly because they're encrypted.

These can be accessed by opening Xcode. Go to Windows > Devices and Simulators > Devices. Select your device. Under Installed Apps, select your application and click on "Download container". 

This will give you a `xcappdata` file. Right-click on this file and select “Show package contents”. You'll then see the `.blog` files that you can then attach to your Azure support request.

# [Android](#tab/android)

When developing for Android, your logs are stored in `.blog` files. Note that you can't view the logs directly because they're encrypted.

On Android Studio, navigate to the Device File Explorer by selecting View > Tool Windows > Device File Explorer from both the simulator and the device. The `.blog` file will be located within your application's directory, which should look something like `/data/data/[app_name_space:com.contoso.com.acsquickstartapp]/files/acs_sdk.blog`. You can attach this file to your support request. 
   

---


## Related information
- [Logs and diagnostics](logging-and-diagnostics.md)
- [Metrics](metrics.md)
