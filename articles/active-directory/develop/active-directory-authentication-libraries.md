---
title: Azure Active Directory Authentication Libraries | Microsoft Docs
description: The Azure AD Authentication Library (ADAL) allows client application developers to easily authenticate users to cloud or on-premises Active Directory (AD) and then obtain access tokens for securing API calls.
services: active-directory
author: rwike77
manager: CelesteDG

ms.assetid: 2e4fc79a-0285-40be-8c77-65edee408a22
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 12/01/2018
ms.author: ryanwi
ms.reviewer: saeeda, jmprieur
ms.custom: aaddev, identityplatformtop40
---

# Azure Active Directory Authentication Libraries

The Azure Active Directory Authentication Library (ADAL) v1.0 enables application developers to authenticate users to cloud or on-premises Active Directory (AD), and obtain tokens for securing API calls. ADAL makes authentication easier for developers through features such as:

- Configurable token cache that stores access tokens and refresh tokens
- Automatic token refresh when an access token expires and a refresh token is available
- Support for asynchronous method calls

> [!NOTE]
> Looking for the Azure AD v2.0 libraries (MSAL)? Checkout the [MSAL library guide](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-libraries).
>
>

## Microsoft-supported Client Libraries

| Platform | Library | Download | Source Code | Sample | Reference
| --- | --- | --- | --- | --- | --- |
| .NET Client, Windows Store, UWP, Xamarin iOS and Android |ADAL .NET v3 |[NuGet](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet) | [Desktop app](https://docs.microsoft.com/azure/active-directory/active-directory-devquickstarts-dotnet) |[Reference](https://docs.microsoft.com/dotnet/api/microsoft.identitymodel.clients.activedirectory?view=azure-dotnet) |
| .NET Client, Windows Store, Windows Phone 8.1 |ADAL .NET v2 |[NuGet](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/2.28.4) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/releases/tag/v2.28.4) | [Desktop app](https://github.com/AzureADQuickStarts/NativeClient-DotNet/releases/tag/v2.X) | |
| JavaScript |ADAL.js |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-js) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-js) |[Single-page app](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi) | |
| iOS, macOS |ADAL |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-objc/releases) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-objc) |[iOS app](https://docs.microsoft.com/azure/active-directory/active-directory-devquickstarts-ios) | [Reference](http://cocoadocs.org/docsets/ADAL/2.5.1/)|
| Android |ADAL |[Maven](https://search.maven.org/search?q=g:com.microsoft.aad+AND+a:adal&core=gav) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-android) |[Android app](https://docs.microsoft.com/azure/active-directory/active-directory-devquickstarts-android) | [JavaDocs](https://javadoc.io/doc/com.microsoft.aad/adal/)|
| Node.js |ADAL |[npm](https://www.npmjs.com/package/adal-node) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-nodejs) | [Node.js web app](https://github.com/Azure-Samples/active-directory-node-webapp-openidconnect)|[Reference](https://docs.microsoft.com/javascript/api/overview/azure/activedirectory) |
| Java |ADAL4J |[Maven](https://search.maven.org/#search%7Cga%7C1%7Ca%3Aadal4j%20g%3Acom.microsoft.azure) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-java) |[Java web app](https://github.com/Azure-Samples/active-directory-java-webapp-openidconnect) |[Reference](https://javadoc.io/doc/com.microsoft.azure/adal4j) |
| Python |ADAL |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-python) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-python) |[Python web app](https://github.com/Azure-Samples/active-directory-python-webapp-graphapi) |[Reference](https://adal-python.readthedocs.io/) |

## Microsoft-supported Server Libraries

| Platform | Library | Download | Source Code | Sample | Reference
| --- | --- | --- | --- | --- | --- |
| .NET |OWIN for AzureAD|[NuGet](https://www.nuget.org/packages/Microsoft.Owin.Security.ActiveDirectory/) |[GitHub](https://github.com/aspnet/AspNetKatana/tree/dev/src/Microsoft.Owin.Security.ActiveDirectory) |[MVC App](https://docs.microsoft.com/azure/active-directory/active-directory-devquickstarts-webapp-dotnet) | |
| .NET |OWIN for OpenIDConnect |[NuGet](https://www.nuget.org/packages/Microsoft.Owin.Security.OpenIdConnect) |[GitHub](https://github.com/aspnet/AspNetKatana/tree/dev/src/Microsoft.Owin.Security.OpenIdConnect) |[Web App](https://github.com/AzureADSamples/WebApp-OpenIDConnect-DotNet) | |
| .NET |OWIN for WS-Federation |[NuGet](https://www.nuget.org/packages/Microsoft.Owin.Security.WsFederation) |[GitHub](https://github.com/aspnet/AspNetKatana/tree/dev/src/Microsoft.Owin.Security.WsFederation) |[MVC Web App](https://github.com/AzureADSamples/WebApp-WSFederation-DotNet) | |
| .NET |Identity Protocol Extensions for .NET 4.5 |[NuGet](https://www.nuget.org/packages/Microsoft.IdentityModel.Protocol.Extensions) |[GitHub](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) | | |
| .NET |JWT Handler for .NET 4.5 |[NuGet](https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt) |[GitHub](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) | | |
| Node.js |Azure AD Passport |[npm](https://www.npmjs.com/package/passport-azure-ad) |[GitHub](https://github.com/AzureAD/passport-azure-ad) | [Web API](https://docs.microsoft.com/azure/active-directory/active-directory-devquickstarts-webapi-nodejs)| |

## Scenarios

Here are three common scenarios for using ADAL in a client that accesses a remote resource:

### Authenticating users of a native client application running on a device

In this scenario, a developer has a mobile client or desktop application that needs to access a remote resource, such as a web API. The web API does not allow anonymous calls and must be called in the context of an authenticated user. The web API is pre-configured to trust access tokens issued by a specific Azure AD tenant. Azure AD is pre-configured to issue access tokens for that resource. To invoke the web API from the client, the developer uses ADAL to facilitate authentication with Azure AD. The most secure way to use ADAL is to have it render the user interface for collecting user credentials (rendered as browser window).

ADAL makes it easy to authenticate the user, obtain an access token and refresh token from Azure AD, and then call the web API using the access token.

For a code sample that demonstrates this scenario using authentication to Azure AD, see [Native Client WPF Application to Web API](https://github.com/azureadsamples/nativeclient-dotnet).

### Authenticating a confidential client application running on a web server

In this scenario, a developer has an application running on a server that needs to access a remote resource, such as a web API. The web API does not allow anonymous calls, so it must be called from an authorized service. The web API is pre-configured to trust access tokens issued by a specific Azure AD tenant. Azure AD is pre-configured to issue access tokens for that resource to a service with client credentials (client ID and secret). ADAL facilitates authentication of the service with Azure AD returning an access token that can be used to call the web API. ADAL also handles managing the lifetime of the access token by caching it and renewing it as necessary. For a code sample that demonstrates this scenario, see [Daemon console Application to Web API](https://github.com/AzureADSamples/Daemon-DotNet).

### Authenticating a confidential client application running on a server, on behalf of a user

In this scenario, a developer has a web application running on a server that needs to access a remote resource, such as a web API. The web API does not allow anonymous calls, so it must be called from an authorized service on behalf of an authenticated user. The web API is pre-configured to trust access tokens issued by a specific Azure AD tenant, and Azure AD is pre-configured to issue access tokens for that resource to a service with client credentials. Once the user is authenticated in the web application, the application can get an authorization code for the user from Azure AD. The web application can then use ADAL to obtain an access token and refresh token on behalf of a user using the authorization code and client credentials associated with the application from Azure AD. Once the web application is in possession of the access token, it can call the web API until the token expires. When the token expires, the web application can use ADAL to get a new access token by using the refresh token that was previously received. For a code sample that demonstrates this scenario, see [Native client to Web API to Web API](https://github.com/Azure-Samples/active-directory-dotnet-webapi-onbehalfof).

## See Also

- [The Azure Active Directory developer's guide](v1-overview.md)
- [Authentication scenarios for Azure Active directory](v1-authentication-scenarios.md)
- [Azure Active Directory code samples](sample-v1-code.md)
