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

* Call ID
* Chat message and thread IDs
* MS-CV

Below are instructions on how to collect this information.

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


## Message and Thread IDs


## MS-CV


## Related information
- [Logs and diagnostics](logging-and-diagnostics.md)
- [Metrics](metrics.md)
