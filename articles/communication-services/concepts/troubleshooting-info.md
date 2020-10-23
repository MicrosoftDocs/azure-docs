---
title: Collecting troubleshooting information
description: Learn how to collect pieces of information that are helpful in troubleshooting issues.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 10/23/2020
ms.topic: overview
ms.service: azure-communication-services

---

# Getting help

We encourage developers to submit questions, suggest features, and report problems as issues in the Communication Services [github repo](https://github.com/Azure/communication). Other forums include:

* [Microsoft Q&A](https://docs.microsoft.com/answers/questions/topics/single/101418.html)
* [StackOverflow](https://stackoverflow.com/questions/tagged/azure+communication)
Depending on your Azure subscription [support plan](https://azure.microsoft.com/support/plans/) you can access support directly in the [Azure portal](https://azure.microsoft.com/support/create-ticket/).

In order to help debug certain issues, a member of the product group might ask for some of the following information:

* MS-CV
* Call ID
* SMS message ID

## MS-CV
If you need to log more details (i.e include the MS-CV header in the logs), the user can set up the clientOptions object instance accordingly and pass it to thedesired object in the constructor.
**Note:**
The same applies for any of the Azure SDK clients including Chat, Administration, and VoIP calling.

### Client options example

# [C#](#tab/csharp)
``` 
//1. Import Azure.Core.Diagnostics
using Azure.Core.Diagnostics;
//2. Initialize an event source listener instance
using var listener = AzureEventSourceListener.CreateConsoleLogger();

Uri endpoint = new Uri("https://<RESOURCE-NAME>.communication.azure.net");
var (token, communicationUser) = await GetCommunicationUserAndToken();

CommunicationUserCredential communicationUserCredential = new CommunicationUserCredential(token);

//3. Setup diagnostic settings
var clientOptions = new ChatClientOptions()
{
    Diagnostics =
    {
        LoggedHeaderNames = { "*" },
        LoggedQueryParameters = { "*" },
        IsLoggingContentEnabled = true,
    }
};
//4. Initialize the ChatClient instance with the clientOptions 
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
--

## Access your call ID

When filing a support request through the Azure portal, you'll be asked to provide your call ID. This can be accessed through the calling client library:

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


## Message ID
For SMS issues, you can collect the message ID from the response object.

# [C#](#tab/csharp)
```
// Instantiate the SMS client
const smsClient = new SmsClient(connectionString);
async function main() {
  const result = await smsClient.send({
    from: "+18445792722",
    to: ["+1972xxxxxxx"],
    message: "Hello World 👋🏻 via Sms"
  }, {
    enableDeliveryReport: true //Optional parameter
  });

console.log(result);
}
```
---

## Related information
- [Logs and diagnostics](logging-and-diagnostics.md)
- [Metrics](metrics.md)
