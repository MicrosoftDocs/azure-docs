---
title: Azure Active Directory Authentication Libraries | Microsoft Docs
description: The Azure AD Authentication Library (ADAL) allows client application developers to easily authenticate users to cloud or on-premises Active Directory (AD) and then obtain access tokens for securing API calls.
services: active-directory
documentationcenter: ''
author: bryanla
manager: mbaldwin
editor: mbaldwin

ms.assetid: 2e4fc79a-0285-40be-8c77-65edee408a22
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/27/2017
ms.author: bryanla

---
# Azure Active Directory Authentication Libraries
The Azure AD authentication Library (ADAL) enables client application developers to easily authenticate users to cloud or on-premises Active Directory (AD), and then obtain access tokens for securing API calls. ADAL has many features that make authentication easier for developers, such as asynchronous support, a configurable token cache that stores access tokens and refresh tokens, automatic token refresh when an access token expires and a refresh token is available, and more. By handling most of the complexity, ADAL can help a developer focus on business logic in their application and easily secure resources without being an expert on security.

ADAL is available on a variety of platforms.

### Client Libraries

| Platform | Library | Download | Source Code | Sample | Reference
| --- | --- | --- | --- | --- | --- |
| .NET Client, Windows Store, UWP, Xamarin iOS and Android |ADAL .NET v3 |[NuGet](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet) | [Desktop App](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-devquickstarts-dotnet) |[Reference](https://docs.microsoft.com/active-directory/adal/microsoft.identitymodel.clients.activedirectory) | 
| .NET Client, Windows Store, Windows Phone 8.1 |ADAL .NET v2 |[NuGet](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/2.28.2) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/releases/tag/v2.28.2) | [Desktop App](https://github.com/AzureADQuickStarts/NativeClient-DotNet/releases/tag/v2.X) |[Reference](https://docs.microsoft.com/en-us/active-directory/adal//v2/microsoft.identitymodel.clients.activedirectory) | 
| JavaScript |ADAL.js |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-js) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-js) |[Single Page App](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi) | |
| iOS, macOS |ADAL |[CocoaPods](http://cocoadocs.org/docsets/ADAL/) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-objc) |[iOS App](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-devquickstarts-ios) | [Reference](http://cocoadocs.org/docsets/ADAL/)|
| Android |ADAL |[The Central Repository](http://search.maven.org/remotecontent?filepath=com/microsoft/aad/adal/) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-android) |[Android App](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-devquickstarts-android) | [JavaDocs](http://javadoc.io/doc/com.microsoft.aad/adal/)|
| Node.js |ADAL |[npm](https://www.npmjs.com/package/adal-node) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-nodejs) | | |
| Java |ADAL4J |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-java) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-java) |[Java Web App](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-devquickstarts-webapp-java) | |

### Server Libraries 

| Platform | Library | Download | Source Code | Sample | Reference
| --- | --- | --- | --- | --- | --- |
| .NET |OWIN for AzureAD|[NuGet](https://www.nuget.org/packages/Microsoft.Owin.Security.ActiveDirectory/) |[CodePlex](http://katanaproject.codeplex.com) |[MVC App](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-devquickstarts-webapp-dotnet) | |
| .NET |OWIN for OpenIDConnect |[NuGet](https://www.nuget.org/packages/Microsoft.Owin.Security.OpenIdConnect) |[CodePlex](http://katanaproject.codeplex.com) |[Web App](https://github.com/AzureADSamples/WebApp-OpenIDConnect-DotNet) | |
| Node.js |Azure AD Passport |[npm](https://www.npmjs.com/package/passport-azure-ad) |[GitHub](https://github.com/AzureAD/passport-azure-ad) | [Web API](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-devquickstarts-webapi-nodejs)| |
| .NET |OWIN for WS-Federation |[NuGet](https://www.nuget.org/packages/Microsoft.Owin.Security.WsFederation) |[CodePlex](http://katanaproject.codeplex.com) |[MVC Web App](https://github.com/AzureADSamples/WebApp-WSFederation-DotNet) | |
| .NET |Identity Protocol Extensions for .NET 4.5 |[NuGet](https://www.nuget.org/packages/Microsoft.IdentityModel.Protocol.Extensions) |[GitHub](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) | | |
| .NET |JWT Handler for .NET 4.5 |[NuGet](https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt) |[GitHub](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) | | |



## Scenarios
Here are three common scenarios in which ADAL can be used for authentication.  

### Authenticating Users of a Client Application to a Remote Resource
In this scenario, a developer has a client, such as a WPF application, that needs to access a remote resource secured by Azure AD, such as a web API. He has an Azure subscription, knows how to invoke the downstream web API, and knows the Azure AD tenant that the web API uses. As a result, he can use ADAL to facilitate authentication with Azure AD, either by fully delegating the authentication experience to ADAL or by explicitly handling user credentials. ADAL makes it easy to authenticate the user, obtain an access token and refresh token from Azure AD, and then use the access token to make requests to the web API.

For a code sample that demonstrates this scenario using authentication to Azure AD, see [Native Client WPF Application to Web API](https://github.com/azureadsamples/nativeclient-dotnet).

### Authenticating a Server Application to a Remote Resource
In this scenario, a developer has an application running on a server that needs to access a remote resource secured by Azure AD, such as a web API. He has an Azure subscription, knows how to invoke the downstream service, and knows the Azure AD tenant the web API uses. As a result, he can use ADAL to facilitate authentication with Azure AD by explicitly handling the application’s credentials. ADAL makes it easy to retrieve a token from Azure AD by using the application’s client credential and then use that token to make requests to the web API. ADAL also handles managing the lifetime of the access token by caching it and renewing it as necessary. For a code sample that demonstrates this scenario, see [Console Application to Web API](https://github.com/AzureADSamples/Daemon-DotNet).

### Authenticating a Server Application on Behalf of a User to Access a Remote Resource
In this scenario, a developer has an application running on a server that needs to access a remote resource secured by Azure AD, such as a web API. The request also needs to be made on behalf of a user in Azure AD. He has an Azure subscription, knows how to invoke the downstream web API, and knows the Azure AD tenant the service uses. Once the user is authenticated to the web application, the application can get an authorization code for the user from Azure AD. The web application can then use ADAL to obtain an access token and refresh token on behalf of a user using the authorization code and client credentials associated with the application from Azure AD. Once the web application is in possession of the access token, it can call the web API until the token expires. When the token expires, the web application can use ADAL to get a new access token by using the refresh token that was previously received.

## See Also
[The Azure Active Directory developer's guide](active-directory-developers-guide.md)

[Authentication scenarios for Azure Active directory](active-directory-authentication-scenarios.md)

[Azure Active Directory code samples](active-directory-code-samples.md)
