---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/04/2022
ms.author: glenga
---

You can also use the [ServiceBusAccountAttribute](https://github.com/Azure/azure-functions-servicebus-extension/blob/master/src/Microsoft.Azure.WebJobs.Extensions.ServiceBus/ServiceBusAccountAttribute.cs) to specify the Service Bus account to use. The constructor takes the name of an app setting that contains a Service Bus connection string. The attribute can be applied at the parameter, method, or class level. The following example shows class level and method level:

  ```csharp
  [ServiceBusAccount("ClassLevelServiceBusAppSetting")]
  public static class AzureFunctions
  {
      [ServiceBusAccount("MethodLevelServiceBusAppSetting")]
      [FunctionName("ServiceBusQueueTriggerCSharp")]
      public static void Run(
          [ServiceBusTrigger("myqueue", AccessRights.Manage)] 
          string myQueueItem, ILogger log)
  {
      ...
  }
  ```

The Service Bus account to use is determined in the following order:

* The `ServiceBusTrigger` attribute's `Connection` property.
* The `ServiceBusAccount` attribute applied to the same parameter as the `ServiceBusTrigger` attribute.
* The `ServiceBusAccount` attribute applied to the function.
* The `ServiceBusAccount` attribute applied to the class.
* The `AzureWebJobsServiceBus` app setting.
