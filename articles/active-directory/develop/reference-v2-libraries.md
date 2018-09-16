---
title: Azure Active Directory v2.0 authentication libraries | Microsoft Docs
description: Compatible client libraries and server middleware libraries, and related library, source, and samples links, for the Azure Active Directory v2.0 endpoint.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 19cec615-e51f-4141-9f8c-aaf38ff9f746
ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/13/2018
ms.author: celested
ms.reviewer: jmprieur, saeeda
ms.custom: aaddev
---

# Azure Active Directory v2.0 authentication libraries

The [Azure Active Directory (Azure AD) v2.0 endpoint](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-compare) supports the industry-standard OAuth 2.0 and OpenID Connect 1.0 protocols. The Microsoft Authentication Library (MSAL) is designed to work with the Azure AD v2.0 endpoint. It's also possible to use open-source libraries that support OAuth 2.0 and OpenID Connect 1.0.

It's recommended that you use libraries written by protocol domain experts who follow a Security Development Lifecycle (SDL) methodology, like [the one followed by Microsoft][Microsoft-SDL]. If you decide to hand-code support for the protocols, follow a methodology like Microsoft's SDL and pay close attention to the security considerations in the standards specifications for each protocol.

> [!NOTE]
> Looking for the Azure AD v1.0 libraries (ADAL)? Checkout the [ADAL library guide](https://docs.microsoft.com/azure/active-directory/develop/active-directory-authentication-libraries).

## Types of libraries

Azure AD v2.0 endpoint works with two types of libraries:

* **Client libraries**. Native clients and servers use client libraries to get access tokens for calling a resource, such as Microsoft Graph.
* **Server middleware libraries**. Web apps use server middleware libraries for user sign-in. Web APIs use server middleware libraries to validate tokens that are sent by native clients or by other servers.

## Library support

Because you can choose any standards-compliant library when you use the v2.0 endpoint, it’s important to know where to go for support. For issues and feature requests in library code, contact the library owner. For issues and feature requests in the service-side protocol implementation, contact Microsoft. [File a feature request](https://feedback.azure.com/forums/169401-azure-active-directory) for additional features you would like to see in the protocol. [Create a support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request) if you find an issue where the Azure AD v2.0 endpoint is not compliant with OAuth 2.0 or OpenID Connect 1.0.

Libraries come in two support categories:

* **Microsoft-supported**. Microsoft provides fixes for these libraries and has done SDL due diligence on these libraries.
* **Compatible**. Microsoft has tested these libraries in basic scenarios and confirmed that they work with the v2.0 endpoint. Microsoft does not provide fixes for these libraries and has not done a review of these libraries. Issues and feature requests should be directed to the library’s open-source project.

For a list of libraries that work with the v2.0 endpoint, see the next sections in this article.

## Microsoft-supported client libraries

> [!IMPORTANT]
> The MSAL preview libraries are suitable for use in a production environment. Microsoft provides the same production level support for these libraries as the current production libraries (ADAL). During the preview, expect changes to the MSAL API, internal cache format, and other mechanisms of these libraries without notice, which you will be required to take along with bug fixes or feature improvements. This may impact your application. For instance, a change to the cache format may require your users to sign in again. An API change may require you to update your code. When the General Availability (GA) release becomes available, all applications using a preview version of the library must update within six months or they may stop working.

| Platform | Library | Download | Source Code | Sample | Reference
| --- | --- | --- | --- | --- | --- |
| .NET Client, Windows Store, UWP, Xamarin iOS and Android | MSAL .NET (Preview) |[NuGet](https://www.nuget.org/packages/Microsoft.Identity.Client) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) | [Desktop app](guidedsetups/active-directory-mobileanddesktopapp-windowsdesktop-intro.md) |  |
| JavaScript | MSAL.js (Preview) | [GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-js) | [GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-js) | [Single-page app](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi-v2) |  |
| iOS, macOS | MSAL (Preview) | [GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-objc) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-objc) | [iOS App](https://github.com/Azure-Samples/active-directory-msal-ios-swift) |  |
| Android | MSAL (Preview) | [Central repository](https://repo1.maven.org/maven2/com/microsoft/identity/client/msal/) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-android) | [Android app](guidedsetups/active-directory-mobileanddesktopapp-android-intro.md) | [JavaDocs](http://javadoc.io/doc/com.microsoft.identity.client/msal) |

## Microsoft-supported server middleware libraries

| Platform | Library | Download | Source Code | Sample | Reference
| --- | --- | --- | --- | --- | --- |
| .NET 4.x | OWIN OpenID Connect middleware |[NuGet](https://www.nuget.org/packages/Microsoft.Owin.Security.OpenIdConnect) |[GitHub](https://github.com/aspnet/AspNetKatana/) |[MVC app](guidedsetups/active-directory-serversidewebapp-aspnetwebappowin-intro.md) | |
| .NET 4.x | OWIN OAuth Bearer middleware for AzureAD |[NuGet](https://www.nuget.org/packages/Microsoft.Owin.Security.ActiveDirectory/) |[GitHub](https://github.com/aspnet/AspNetKatana/) |  | |
| .NET 4.x | JWT Handler for .NET 4.5 | [NuGet](https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt/4.0.4.403061554) | [GitHub](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) | | |
| .NET Core | ASP.NET OpenID Connect middleware |[Microsoft.AspNetCore.Authentication.OpenIdConnect (NuGet)][ServerLib-NetCore-Owin-Oidc-Lib] |[ASP.NET security (GitHub)][ServerLib-NetCore-Owin-Oidc-Repo] |[MVC app](https://github.com/Azure-Samples/active-directory-dotnet-webapp-openidconnect-aspnetcore-v2) |
| .NET Core | ASP.NET OAuth Bearer middleware |[Microsoft.AspNetCore.Authentication.OAuth (NuGet)][ServerLib-NetCore-Owin-Oauth-Lib] |[ASP.NET security (GitHub)][ServerLib-NetCore-Owin-Oauth-Repo] |  |
| .NET Core | JWT Handler for .NET Core  |[NuGet](https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt) |[GitHub](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) | | |
| Node.js |Azure AD Passport |[npm](https://www.npmjs.com/package/passport-azure-ad) |[GitHub](https://github.com/AzureAD/passport-azure-ad) | [Web app](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs)| |

## Compatible client libraries

| Platform | Library name | Tested version | Source code | Sample |
|:---:|:---:|:---:|:---:|:---:|
| Android |[OIDCAndroidLib](https://github.com/kalemontes/OIDCAndroidLib/) |0.2.1 |[OIDCAndroidLib](https://github.com/kalemontes/OIDCAndroidLib) |[Native app sample](active-directory-v2-devquickstarts-android.md) |
| iOS |[NXOAuth2Client](https://github.com/nxtbgthng/OAuth2Client) |1.2.8 |[NXOAuth2Client](https://github.com/nxtbgthng/OAuth2Client) |[Native app sample](active-directory-v2-devquickstarts-ios.md) |
| JavaScript |[Hello.js](https://adodson.com/hello.js/) |1.13.5 |[Hello.js](https://github.com/MrSwitch/hello.js) |[SPA](https://github.com/Azure-Samples/active-directory-javascript-graphapi-web-v2) |
| Java | [Scribe Java scribejava](https://github.com/scribejava/scribejava) | [Version 3.2.0](https://github.com/scribejava/scribejava/releases/tag/scribejava-3.2.0) | [ScribeJava](https://github.com/scribejava/scribejava/) | |
| PHP | [The PHP League oauth2-client](https://github.com/thephpleague/oauth2-client) | [Version 1.4.2](https://github.com/thephpleague/oauth2-client/releases/tag/1.4.2) | [oauth2-client](https://github.com/thephpleague/oauth2-client/) | |
| Ruby |[OmniAuth](https://github.com/omniauth/omniauth/wiki) |omniauth:1.3.1</br>omniauth-oauth2:1.4.0 |[OmniAuth](https://github.com/omniauth/omniauth)</br>[OmniAuth OAuth2](https://github.com/intridea/omniauth-oauth2) |  |

## Related content
For more information about the Azure AD v2.0 endpoint, see the [Azure AD app model v2.0 overview][AAD-App-Model-V2-Overview].

<!--Image references-->

<!--Reference style links -->
[AAD-App-Model-V2-Overview]: v2-overview.md
[ClientLib-NET-Lib]: http://www.nuget.org/packages/Microsoft.Identity.Client
[ClientLib-NET-Repo]: https://github.com/AzureAD/microsoft-authentication-library-for-dotnet
[ClientLib-NET-Sample]: active-directory-v2-devquickstarts-wpf.md
[ClientLib-Node-Lib]: https://www.npmjs.com/package/passport-azure-ad
[ClientLib-Node-Repo]: https://github.com/AzureAD/passport-azure-ad
[ClientLib-Node-Sample]:/
[ClientLib-Iosmac-Lib]:/
[ClientLib-Iosmac-Repo]:/
[ClientLib-Iosmac-Sample]:/
[ClientLib-Android-Lib]:/
[ClientLib-Android-Repo]:/
[ClientLib-Android-Sample]:/
[ClientLib-Js-Lib]:/
[ClientLib-Js-Repo]:/
[ClientLib-Js-Sample]:/

[Microsoft-SDL]: http://www.microsoft.com/sdl/default.aspx
[ServerLib-Net4-Owin-Oidc-Lib]: https://www.nuget.org/packages/Microsoft.Owin.Security.OpenIdConnect/
[ServerLib-Net4-Owin-Oidc-Repo]: http://katanaproject.codeplex.com/
[ServerLib-Net4-Owin-Oidc-Sample]: active-directory-v2-devquickstarts-dotnet-web.md
[ServerLib-Net4-Owin-Oauth-Lib]: https://www.nuget.org/packages/Microsoft.Owin.Security.OAuth/
[ServerLib-Net4-Owin-Oauth-Repo]: http://katanaproject.codeplex.com/
[ServerLib-Net4-Owin-Oauth-Sample]: https://azure.microsoft.com/documentation/articles/active-directory-v2-devquickstarts-dotnet-api/
[ServerLib-Net-Jwt-Lib]: https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt
[ServerLib-Net-Jwt-Repo]: https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet
[ServerLib-Net-Jwt-Sample]:/
[ServerLib-NetCore-Owin-Oidc-Lib]: https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.OpenIdConnect/
[ServerLib-NetCore-Owin-Oidc-Repo]: https://github.com/aspnet/Security
[ServerLib-NetCore-Owin-Oidc-Sample]: https://github.com/Azure-Samples/active-directory-dotnet-webapp-openidconnect-aspnetcore-v2
[ServerLib-NetCore-Owin-Oauth-Lib]: https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.OAuth/
[ServerLib-NetCore-Owin-Oauth-Repo]: https://github.com/aspnet/Security
[ServerLib-NetCore-Owin-Oauth-Sample]:/
[ServerLib-Node-Lib]: https://www.npmjs.com/package/passport-azure-ad
[ServerLib-Node-Repo]: https://github.com/AzureAD/passport-azure-ad/
[ServerLib-Node-Sample]: https://azure.microsoft.com/documentation/articles/active-directory-v2-devquickstarts-node-web/
