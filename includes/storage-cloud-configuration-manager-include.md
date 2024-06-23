---
author: tamram
ms.service: azure-storage
ms.topic: include
ms.date: 10/26/2018
ms.author: tamram
---
The [Microsoft Azure Configuration Manager Library for .NET](https://www.nuget.org/packages/Microsoft.Azure.ConfigurationManager/) provides a class for parsing a connection string from a configuration file. The [CloudConfigurationManager](/previous-versions/azure/reference/mt634650(v=azure.100)) class parses configuration settings. It parses settings for client applications that run on the desktop, on a mobile device, in an Azure virtual machine, or in an Azure cloud service.

To reference the `CloudConfigurationManager` package, add the following `using` directives:

```csharp
using Microsoft.Azure; //Namespace for CloudConfigurationManager
using Microsoft.Azure.Storage;
```

Here's an example that shows how to retrieve a connection string from a configuration file:

```csharp
// Parse the connection string and return a reference to the storage account.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));
```

Using the Azure Configuration Manager is optional. You can also use an API such as the .NET Framework's [ConfigurationManager Class](/dotnet/api/system.configuration.configurationmanager).