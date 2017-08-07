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
ms.date: 08/02/2017
ms.author: bryanla
ms.custom: aaddev

---
# Azure Active Directory Authentication Libraries
The Azure Active Directory Authentication Library (ADAL) enables client application developers to easily authenticate users to cloud or on-premises Active Directory (AD), and obtain access tokens for securing API calls. ADAL makes authentication easier for developers through features such as:
 - support for asynchronous method calls
 - a configurable token cache that stores access tokens and refresh tokens
 - automatic token refresh when an access token expires and a refresh token is available
 - and more
 
By handling most of the complexity, ADAL helps developers focus on business logic and easily secure resources, without being an expert in security.

ADAL is available on a variety of platforms.

### Client Libraries

| Platform | Library | Download | Source Code | Sample | Reference
| --- | --- | --- | --- | --- | --- |
| .NET Client, Windows Store, UWP, Xamarin iOS and Android |MSAL for .NET (preview) |[NuGet](https://www.nuget.org/packages/Microsoft.Identity.Client/1.1.0-preview) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) | [Desktop app](~/articles/active-directory/develop/guidedsetups/active-directory-windesktop.md) |[Reference](https://docs.microsoft.com/dotnet/api/?view=identityclient-1.1.0-preview) | 
| JavaScript |MSAL for JavaScript (preview) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-js) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-js) | [Single Page App](~/articles/active-directory/develop/GuidedSetups/active-directory-javascriptspa.md) | [Reference](https://htmlpreview.github.io/?https://raw.githubusercontent.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/docs/classes/_useragentapplication_.msal.useragentapplication.html) | 
| iOS |MSAL for iOS (preview) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-objc) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-objc) | [iOS app](~/articles/active-directory/develop/GuidedSetups/active-directory-ios.md) | [Reference](https://azuread.github.io/docs/objc/) |
| Android |MSAL for Android (preview) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-android) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-android) | [Android app](~/articles/active-directory/develop/GuidedSetups/active-directory-android.md) | [Reference](http://javadoc.io/doc/com.microsoft.identity.client/msal/0.1.1) |
| .NET Client, Windows Store, UWP, Xamarin iOS and Android |ADAL .NET v3 |[NuGet](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet) | [Desktop app](https://docs.microsoft.com/azure/active-directory/active-directory-devquickstarts-dotnet) |[Reference](https://docs.microsoft.com/dotnet/api/?view=identitymodelclientsad-3.13.9) | 
| .NET Client, Windows Store, Windows Phone 8.1 |ADAL .NET v2 |[NuGet](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/2.28.4) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/releases/tag/v2.28.4) | [Desktop app](https://github.com/AzureADQuickStarts/NativeClient-DotNet/releases/tag/v2.X) | | 
| JavaScript |ADAL.js |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-js) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-js) |[Single Page App](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi) | |
| iOS, macOS |ADAL |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-objc/releases) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-objc) |[iOS app](https://docs.microsoft.com/azure/active-directory/active-directory-devquickstarts-ios) | [Reference](https://cocoapods.org/pods/ADAL)|
| Android |ADAL |[The Central Repository](http://search.maven.org/remotecontent?filepath=com/microsoft/aad/adal/) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-android) |[Android app](https://docs.microsoft.com/azure/active-directory/active-directory-devquickstarts-android) | [JavaDocs](http://javadoc.io/doc/com.microsoft.aad/adal/)|
| Node.js |ADAL |[npm](https://www.npmjs.com/package/adal-node) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-nodejs) | | |
| Java |ADAL4J |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-java) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-java) |[Java web app](https://docs.microsoft.com/azure/active-directory/active-directory-devquickstarts-webapp-java) | |
| Python |ADAL |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-python) |[GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-python) | | |
### Server Libraries 

| Platform | Library | Download | Source Code | Sample | Reference
| --- | --- | --- | --- | --- | --- |
| .NET |OWIN for AzureAD|[NuGet](https://www.nuget.org/packages/Microsoft.Owin.Security.ActiveDirectory/) |[CodePlex](http://katanaproject.codeplex.com) |[MVC App](https://docs.microsoft.com/azure/active-directory/active-directory-devquickstarts-webapp-dotnet) | |
| .NET |OWIN for OpenIDConnect |[NuGet](https://www.nuget.org/packages/Microsoft.Owin.Security.OpenIdConnect) |[CodePlex](http://katanaproject.codeplex.com) |[Web App](https://github.com/AzureADSamples/WebApp-OpenIDConnect-DotNet) | |
| Node.js |Azure AD Passport |[npm](https://www.npmjs.com/package/passport-azure-ad) |[GitHub](https://github.com/AzureAD/passport-azure-ad) | [Web API](https://docs.microsoft.com/azure/active-directory/active-directory-devquickstarts-webapi-nodejs)| |
| .NET |OWIN for WS-Federation |[NuGet](https://www.nuget.org/packages/Microsoft.Owin.Security.WsFederation) |[CodePlex](http://katanaproject.codeplex.com) |[MVC Web App](https://github.com/AzureADSamples/WebApp-WSFederation-DotNet) | |
| .NET |Identity Protocol Extensions for .NET 4.5 |[NuGet](https://www.nuget.org/packages/Microsoft.IdentityModel.Protocol.Extensions) |[GitHub](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) | | |
| .NET |JWT Handler for .NET 4.5 |[NuGet](https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt) |[GitHub](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) | | |



## Scenarios

Here are three common scenarios in which ADAL can be used for authenticating a client that accesses a remote resource:  

### Authenticating users of a native client application running on a device 

In this scenario, a developer has a WPF client application, that needs to access a remote resource secured by Azure AD, such as a web API. He has an Azure subscription, knows how to invoke the downstream web API, and knows the Azure AD tenant that the web API uses. As a result, he can use ADAL to facilitate authentication with Azure AD, either by fully delegating the authentication experience to ADAL or by explicitly handling user credentials. ADAL makes it easy to authenticate the user, obtain an access token and refresh token from Azure AD, and then use the access token to make requests to the web API.

For a code sample that demonstrates this scenario using authentication to Azure AD, see [Native Client WPF Application to Web API](https://github.com/azureadsamples/nativeclient-dotnet).

### Authenticating a confidential client application running on a web server

In this scenario, a developer has an application running on a server that needs to access a remote resource secured by Azure AD, such as a web API. He has an Azure subscription, knows how to invoke the downstream service, and knows the Azure AD tenant the web API uses. As a result, he can use ADAL to facilitate authentication with Azure AD by explicitly handling the application’s credentials. ADAL makes it easy to retrieve a token from Azure AD by using the application’s client credential and then use that token to make requests to the web API. ADAL also handles managing the lifetime of the access token by caching it and renewing it as necessary. For a code sample that demonstrates this scenario, see [Daemon console Application to Web API](https://github.com/AzureADSamples/Daemon-DotNet).

### Authenticating a confidential client application running on a server, on behalf of a user 

In this scenario, a developer has an application running on a server that needs to access a remote resource secured by Azure AD, such as a web API. The request also needs to be made on behalf of an Azure AD user. He has an Azure subscription, knows how to invoke the downstream web API, and knows the Azure AD tenant the service uses. Once the user is authenticated to the web application, the application can get an authorization code for the user from Azure AD. The web application can then use ADAL to obtain an access token and refresh token on behalf of a user using the authorization code and client credentials associated with the application from Azure AD. Once the web application is in possession of the access token, it can call the web API until the token expires. When the token expires, the web application can use ADAL to get a new access token by using the refresh token that was previously received. For a code sample that demonstrates this scenario, see [Native client to Web API to Web API](https://github.com/Azure-Samples/active-directory-dotnet-webapi-onbehalfof).

## See Also

- [The Azure Active Directory developer's guide](active-directory-developers-guide.md)
- [Authentication scenarios for Azure Active directory](active-directory-authentication-scenarios.md)
- [Azure Active Directory code samples](active-directory-code-samples.md)
