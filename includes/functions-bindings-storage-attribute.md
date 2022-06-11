---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 12/8/2021
ms.author: glenga
---

While the attribute takes a `Connection` property, you can also use the [StorageAccountAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs) to specify a storage account connection. You can do this when you need to use a different storage account than other functions in the library. The constructor takes the name of an app setting that contains a storage connection string. The attribute can be applied at the parameter, method, or class level. The following example shows class level and method level:

```csharp
[StorageAccount("ClassLevelStorageAppSetting")]
public static class AzureFunctions
{
    [FunctionName("StorageTrigger")]
    [StorageAccount("FunctionLevelStorageAppSetting")]
    public static void Run( //...
{
    ...
}
```

The storage account to use is determined in the following order:

* The trigger or binding attribute's `Connection` property.
* The `StorageAccount` attribute applied to the same parameter as the trigger or binding attribute.
* The `StorageAccount` attribute applied to the function.
* The `StorageAccount` attribute applied to the class.
* The default storage account for the function app, which is defined in the `AzureWebJobsStorage` application setting.
