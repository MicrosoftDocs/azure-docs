---
title: Client and server SDK versioning in Mobile Apps and Mobile Services | Microsoft Docs
description: List of client SDKs and compatibility with server SDK versions for Mobile Services and Azure Mobile Apps
services: app-service\mobile
documentationcenter: ''
author: conceptdev
manager: crdun
editor: ''

ms.assetid: 35b19672-c9d6-49b5-b405-a6dcd1107cd5
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-multiple
ms.devlang: dotnet
ms.topic: article
ms.date: 10/01/2016
ms.author: crdun

---
# Client and server versioning in Mobile Apps and Mobile Services
The latest version of Azure Mobile Services is the **Mobile Apps** feature of Azure App Service.

The Mobile Apps client and server SDKs are originally based on those in Mobile Services, but they are *not* compatible with each other.
That is, you must use a *Mobile Apps* client SDK with a *Mobile Apps* server SDK and similarly for *Mobile Services*. This contract is
enforced through a special header value used by the client and server SDKs, `ZUMO-API-VERSION`.

Note: whenever this document refers to a *Mobile Services* backend, it does not necessarily need to be hosted on Mobile Services. It is now possible to migrate a mobile service to run on App Service without any code changes, but the service would still be using *Mobile Services*  SDK versions.

To learn more about migrating to App Service without any code changes, see the article [Migrate a Mobile Service to Azure App Service].

## Header specification
The key `ZUMO-API-VERSION` may be specified in either the HTTP header or the query string. The value is a version string in the form **x.y.z**.

For example:

GET https://service.azurewebsites.net/tables/TodoItem

HEADERS: ZUMO-API-VERSION: 2.0.0

POST https://service.azurewebsites.net/tables/TodoItem?ZUMO-API-VERSION=2.0.0

## Opting out of version checking
You can opt out of version checking by setting a value of **true** for the app setting **MS_SkipVersionCheck**. Specify this either in your web.config or in the Application Settings section of the Azure portal.

> [!NOTE]
> There are a number of behavior changes between Mobile Services and Mobile Apps, particularly in the areas of offline sync, authentication, and push notifications. You should only opt out of version checking after complete testing to ensure that these behavioral changes do not break your app's functionality.

## <a name="2.0.0"></a>Azure Mobile Apps client and server
### <a name="MobileAppsClients"></a> Mobile *Apps* client SDKs
Version checking was introduced starting with the following versions of the client SDK for **Azure Mobile Apps**:

| Client platform | Version | Version header value |
| --- | --- | --- |
| Managed client (Windows, Xamarin) |[2.0.0](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Client/2.0.0) |2.0.0 |
| iOS |[3.0.0](https://go.microsoft.com/fwlink/?LinkID=529823) |2.0.0 |
| Android |[3.0.0](https://go.microsoft.com/fwlink/?LinkID=717033&clcid=0x409) |3.0.0 |

### Mobile *Apps* server SDKs
Version checking is included in following server SDK versions:

| Server platform | SDK | Accepted version header |
| --- | --- | --- |
| .NET |[Microsoft.Azure.Mobile.Server](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server/) |2.0.0 |
| Node.js |[azure-mobile-apps)](https://www.npmjs.com/package/azure-mobile-apps) |2.0.0 |

### Behavior of Mobile Apps backends
| ZUMO-API-VERSION | Value of MS_SkipVersionCheck | Response |
| --- | --- | --- |
| x.y.z or Null |True |200 - OK |
| Null |False/Not Specified |400 - Bad Request |
| 1.x.y |False/Not Specified |400 - Bad Request |
| 2.0.0-2.x.y |False/Not Specified |200 - OK |
| 3.0.0-3.x.y |False/Not Specified |400 - Bad Request |

[Mobile Services clients]: #MobileServicesClients
[Mobile Apps clients]: #MobileAppsClients
[Mobile App Server SDK]: https://www.nuget.org/packages/microsoft.azure.mobile.server
