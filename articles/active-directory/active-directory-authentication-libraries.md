<properties
   pageTitle="Azure Active Directory Authentication Libraries | Microsoft Azure"
   description="The Azure AD Authentication Library (ADAL) allows client application developers to easily authenticate users to cloud or on-premises Active Directory (AD) and then obtain access tokens for securing API calls."
   services="active-directory"
   documentationCenter=""
   authors="msmbaldwin"
   manager="mbaldwin"
   editor="mbaldwin" />
<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="05/31/2016"
   ms.author="mbaldwin" />

# Azure Active Directory Authentication Libraries

The Azure AD authentication Library (ADAL) enables client application developers to easily authenticate users to cloud or on-premises Active Directory (AD), and then obtain access tokens for securing API calls. ADAL has many features that make authentication easier for developers, such as asynchronous support, a configurable token cache that stores access tokens and refresh tokens, automatic token refresh when an access token expires and a refresh token is available, and more. By handling most of the complexity, ADAL can help a developer focus on business logic in their application and easily secure resources without being an expert on security.

ADAL is available on a variety of platforms.

|Platform|Package Name|Client/Server|Download|Source Code|Documentation & Samples|
|---|---|---|---|---|---|
|.NET Client, Windows Store, Windows Phone (8.1)|Active Directory  Authentication Library (ADAL) for .NET|Client|[Microsoft.IdentityModel.Clients.ActiveDirectory (NuGet)](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory)|[ADAL for .NET (Github)](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet)|[Documentation](https://msdn.microsoft.com/library/azure/mt417579.aspx)|
|JavaScript|Active Directory Authentication Library (ADAL) for JavaScript|Client|[ADAL for JavaScript (Github)](https://github.com/AzureAD/azure-activedirectory-library-for-js)|[ADAL for JavaScript (Github)](https://github.com/AzureAD/azure-activedirectory-library-for-js)|Sample: [SinglePageApp-DotNet (Github)](https://github.com/AzureADSamples/SinglePageApp-DotNet)|
|OS X, iOS|Active Directory Authentication Library (ADAL) for Objective-C|Client|[ADAL for Objective-C (CocoaPods)](https://cocoapods.org/?q=adal%20io)|[ADAL for Objective-C (Github)](https://github.com/AzureAD/azure-activedirectory-library-for-objc)|Sample: [NativeClient-iOS (Github)](https://github.com/AzureADSamples/NativeClient-iOS)|
|Android|Active Directory Authentication Library (ADAL) for Android|Client|[ADAL for Android (The Central Repository)](http://search.maven.org/remotecontent?filepath=com/microsoft/aad/adal/)|[ADAL for Android (Github)](https://github.com/AzureAD/azure-activedirectory-library-for-android)|Sample: [NativeClient-Android (Github)](https://github.com/AzureADSamples/NativeClient-Android)|
|Node.js|Active Directory Authentication Library (ADAL) for Node.js|Client|[ADAL for Node.js (npm)](https://www.npmjs.com/package/adal-node)|[ADAL for Node.js (Github)](https://github.com/AzureAD/azure-activedirectory-library-for-nodejs)|Sample: [WebAPI-Nodejs (Github)](https://github.com/AzureADSamples/WebAPI-Nodejs)|
|Node.js|Microsoft Azure Active Directory Passport authentication middleware for Node|Client|[Azure Active Directory Passport for Node.js (npm)](https://www.npmjs.com/package/passport-azure-ad)|[Azure Active Directory for Node.js (Github)](https://github.com/AzureAD/passport-azure-ad)||
|Java|Active Directory Authentication Library (ADAL) for Java|Client|[ADAL for Java (Github)](https://github.com/AzureAD/azure-activedirectory-library-for-java)|[ADAL for Java (Github)](https://github.com/AzureAD/azure-activedirectory-library-for-java)||
|.NET|Identity Protocol Extensions for the Microsoft .NET Framework 4.5|Server|[Microsoft.IdentityModel.Protocol.Extensions (NuGet)](https://www.nuget.org/packages/Microsoft.IdentityModel.Protocol.Extensions)|[Azure AD identity model extensions for .NET (Github)](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet)||
|.NET|JSON Web Token Handler For the Microsoft .Net Framework 4.5|Server|[System.IdentityModel.Tokens.Jwt (NuGet)](https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt)|[Azure AD identity model extensions for .NET (Github)](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet)||
|.NET|OWIN middleware that enables an application to use Microsoft's technology for authentication.|Server|[Microsoft.Owin.Security.ActiveDirectory (NuGet)](https://www.nuget.org/packages/Microsoft.Owin.Security.ActiveDirectory/)|[OWIN (CodePlex)](http://katanaproject.codeplex.com)||
|.NET|OWIN middleware that enables an application to use OpenIDConnect for authentication.|Server|[Microsoft.Owin.Security.OpenIdConnect (NuGet)](https://www.nuget.org/packages/Microsoft.Owin.Security.OpenIdConnect)|[OWIN (CodePlex)](http://katanaproject.codeplex.com)|Sample: [WebApp-OpenIDConnecty-DotNet (Github)](https://github.com/AzureADSamples/WebApp-OpenIDConnect-DotNet)|
|.NET|OWIN middleware that enables an application to use WS-Federation for authentication.|Server|[Microsoft.Owin.Security.WsFederation (NuGet)](https://www.nuget.org/packages/Microsoft.Owin.Security.WsFederation)|[OWIN (CodePlex)](http://katanaproject.codeplex.com)|Sample: [WebApp-WSFederation-DotNet (Github)](https://github.com/AzureADSamples/WebApp-WSFederation-DotNet)|

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
