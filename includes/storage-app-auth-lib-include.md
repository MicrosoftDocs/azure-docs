---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 07/18/2019
 ms.author: tamram
 ms.custom: include file
---

The [Microsoft Azure App Authentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) client library for .NET (preview) simplifies the process of acquiring and renewing a token from your code. The App Authentication client library manages authentication automatically. The library uses the developer's credentials to authenticate during local development. Using developer credentials during local development is more secure because you do not need to create Azure AD credentials or share credentials between developers. When the solution is later deployed to Azure, the library automatically switches to using application credentials.

To use the App Authentication library in an Azure Storage application, install the latest preview package from [Nuget](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication), as well as the latest version of the [Azure Storage common client library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Storage.Common/) and the [Azure Blob storage client library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Storage.Blob/). Add the following **using** statements to your code:

```csharp
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Azure.Storage.Auth;
using Microsoft.Azure.Storage.Blob;
```
