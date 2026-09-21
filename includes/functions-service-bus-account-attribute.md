---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/16/2026
ms.author: glenga
---

Use the `Connection` property of the `ServiceBusTrigger` attribute to specify the name of an app setting that contains the Service Bus connection string:

```csharp
[FunctionName("ServiceBusQueueTriggerCSharp")]
public static void Run(
  [ServiceBusTrigger("myqueue", Connection = "ServiceBusAppSetting")]
  string myQueueItem,
  ILogger log)
{
  // ...
}
```
