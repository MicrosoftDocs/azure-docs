---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 11/26/2019
 ms.author: tamram
 ms.custom: include
---

## Install client library packages

> [!NOTE]
> The examples shown here use the Azure Storage client library version 12. The version 12 client library is part of the Azure SDK. For more information about the Azure SDK, see the Azure SDK repository on [GitHub](https://github.com/Azure/azure-sdk).

To install the Blob storage package, run the following command from the NuGet package manager console:

```powershell
Install-Package Azure.Storage.Blobs
```

The examples shown here also use the latest version of the [Azure Identity client library for .NET](https://www.nuget.org/packages/Azure.Identity/) to authenticate with Azure AD credentials. To install the package, run the following command from the NuGet package manager console:

```powershell
Install-Package Azure.Identity
```
