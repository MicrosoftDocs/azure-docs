<properties
  pageTitle="Client and server SDK versioning in Mobile Apps and Mobile Services | Azure App Service"
  description="List of client SDKs and compatibility with server SDK versions for Mobile Services and Azure Mobile Apps"
  services="app-service\mobile"
  documentationCenter=""
  authors="lindydonna"
  manager="erikre"
  editor=""/>

<tags
  ms.service="app-service-mobile"
  ms.workload="mobile"
  ms.tgt_pltfrm="mobile-multiple"
  ms.devlang="dotnet"
  ms.topic="article"
  ms.date="05/10/2016"
  ms.author="donnam"/>

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

You can opt out of version checking by setting a value of **true** for the app setting **MS_SkipVersionCheck**. Specify this either in your web.config or in the Application Settings section of the Azure Portal.

> [AZURE.NOTE] There are a number of behavior changes between Mobile Services and Mobile Apps, particularly in the areas of offline sync, authentication, and push notifications. You should only opt out of version checking after complete testing to enure that these behavioral changes do not break your app's functionality.

## Summary of compatibility for all versions

The chart below shows the compatibility between all client and server types. A backend is classfied as either Mobile **Services** or Mobile **Apps** based on the server SDK that it uses.

|                           | **Mobile Services** Node.js or .NET | **Mobile Apps** Node.js or .NET |
| ----------                | -----------------------             |   ----------------              |
| [Mobile Services clients] | Ok                                  | Error\*                         |
| [Mobile Apps clients]     | Error\*                             | Ok                              |

\*This can be controlled by specifying **MS_SkipVersionCheck**.


<!-- IMPORTANT!  The anchors for Mobile Services and Mobile Apps MUST be 1.0.0 and 2.0.0 respectively, since there is an exception error message that uses those anchors. -->

<!-- NOTE: the fwlink to this document is http://go.microsoft.com/fwlink/?LinkID=690568 -->

## <a name="1.0.0"></a>Mobile Services client and server

The client SDKs in the table below are compatible with **Mobile Services**.

Note: the Mobile Services client SDKs *do not* send a header value for `ZUMO-API-VERSION`. If the service receives this header or query string value, an error will be returned, unless you have explicitly opted out as described above.

### <a name="MobileServicesClients"></a> Mobile *Services* client SDKs

| Client platform                   | Version                                                                   | Version header value |
| -------------------               | ------------------------                                                  | -------------------  |
| Managed client (Windows, Xamarin) | [1.3.2](https://www.nuget.org/packages/WindowsAzure.MobileServices/1.3.2) | n/a                  |
| iOS                               | [2.2.2](http://aka.ms/gc6fex)                                             | n/a                  |
| Android                           | [2.0.3](https://go.microsoft.com/fwLink/?LinkID=280126)                   | n/a                  |
| HTML                              | [1.2.7](http://ajax.aspnetcdn.com/ajax/mobileservices/MobileServices.Web-1.2.7.min.js) | n/a     |

### Mobile *Services* server SDKs

| Server platform  | Version                                                                                                        | Accepted version header |
| ---------------- | ------------------------------------------------------------                                                   | ----------------------- |
| .NET             | [WindowsAzure.MobileServices.Backend.* Version 1.0.x](https://www.nuget.org/packages/WindowsAzure.MobileServices.Backend/) | **No version header ** |
| Node.js          | (coming soon)                        | **No version header** |

<!-- TODO: add Node npm version -->

### Behavior of Mobile Services backends

| ZUMO-API-VERSION | Value of MS_SkipVersionCheck | Response |
| ---------------- | ---------------------------- | -------- |
| Not specified    | Any                          | 200 - OK |
| Any value        | True                         | 200 - OK |
| Any value        | False/Not Specified          | 400 - Bad Request |

## <a name="2.0.0"></a>Azure Mobile Apps client and server

### <a name="MobileAppsClients"></a> Mobile *Apps* client SDKs

Version checking was introduced starting with the following versions of the client SDK for **Azure Mobile Apps**:

| Client platform                   | Version                   | Version header value |
| -------------------               | ------------------------  | -----------------    |
| Managed client (Windows, Xamarin) | [2.0.0](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Client/2.0.0) | 2.0.0 |
| iOS                               | [3.0.0](http://go.microsoft.com/fwlink/?LinkID=529823) | 2.0.0  |
| Android                           | [3.0.0](http://go.microsoft.com/fwlink/?LinkID=717033&clcid=0x409) | 3.0.0 |

<!-- TODO: add HTML version when released -->

### Mobile *Apps* server SDKs

Version checking is included in following server SDK versions:

| Server platform  | SDK                                                                                                        | Accepted version header |
| ---------------- | ------------------------------------------------------------                                                   | ----------------------- |
| .NET             | [Microsoft.Azure.Mobile.Server](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server/) | 2.0.0 |
| Node.js          | [azure-mobile-apps)](https://www.npmjs.com/package/azure-mobile-apps)                         | 2.0.0 |

### Behavior of Mobile Apps backends

| ZUMO-API-VERSION | Value of MS_SkipVersionCheck | Response |
| ---------------- | ---------------------------- | -------- |
| x.y.z or Null    | True                         | 200 - OK |
| Null             | False/Not Specified          | 400 - Bad Request |
| 1.x.y            | False/Not Specified          | 400 - Bad Request |
| 2.0.0-2.x.y      | False/Not Specified          | 200 - OK |
| 3.0.0-3.x.y      | False/Not Specified          | 400 - Bad Request |


## Next Steps

- [Migrate a Mobile Service to Azure App Service]


[Mobile Services clients]: #MobileServicesClients
[Mobile Apps clients]: #MobileAppsClients


[Mobile App Server SDK]: http://www.nuget.org/packages/microsoft.azure.mobile.server
[Migrate a Mobile Service to Azure App Service]: app-service-mobile-migrating-from-mobile-services.md

