---
title: Azure Active Directory v2.0 authentication libraries | Microsoft Docs
description: Compatible client libraries and server middleware libraries, and related library, source, and samples links, for the Azure Active Directory v2.0 endpoint.
services: active-directory
documentationcenter: ''
author: negoe
manager: mtillman
editor: ''

ms.assetid: 19cec615-e51f-4141-9f8c-aaf38ff9f746
ms.service: active-directory
ms.component: develop    
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2018
ms.author: negoe
ms.reviewer: jmprieur, saeeda
ms.custom: aaddev
---

# Azure Active Directory v2.0 authentication libraries

The [Azure Active Directory (Azure AD) v2.0 endpoint](active-directory-v2-compare.md) supports the industry-standard OAuth 2.0 and OpenID Connect 1.0 protocols. The Microsoft Authentication Library (MSAL) is designed to work with the Azure AD v2.0 endpoint. It's also possible to use open-source libraries that support OAuth 2.0 and OpenID Connect 1.0.

It's recommended that you use libraries written by protocol domain experts who follow a Security Development Lifecycle (SDL) methodology, like [the one followed by Microsoft][Microsoft-SDL]. If you decide to hand-code for the protocols, you should follow a methodology like Microsoft's SDL and pay close attention to the security considerations in the standards specifications for each protocol.

> [!NOTE]
> Looking for the Azure AD v1.0 library (ADAL)? Checkout the [ADAL library guide](active-directory-authentication-libraries.md).

## Types of libraries

Azure AD v2.0 endpoint works with two types of libraries:

* **Client libraries**: Native clients and servers use client libraries to get access tokens for calling a resource, such as Microsoft Graph.
* **Server middleware libraries**: Web apps use server middleware libraries for user sign-in. Web APIs use server middleware libraries to validate tokens that are sent by native clients or by other servers.

## Library support

Libraries come in two support categories:

* **Microsoft-supported**: Microsoft provides fixes for these libraries and has done SDL due diligence on these libraries.
* **Compatible**: Microsoft has tested these libraries in basic scenarios and confirmed that they work with the v2.0 endpoint. Microsoft does not provide fixes for these libraries and has not done a review of these libraries. Issues and feature requests should be directed to the library’s open-source project.

For a list of libraries that work with the v2.0 endpoint, see the next sections in this article.

## Microsoft-supported client libraries

Client authentication libraries are used to acquire a token to call a protected Web API

| Platform | Library | Download | Source code | Sample | Reference | Conceptual doc | Roadmap |
| --- | --- | --- | --- | --- | --- | --- | ---| ---|
| ![JavaScript](media/sample-v2-code/logo_js.png) | MSAL.js (Preview) | [NPM](https://www.npmjs.com/package/msal) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angularjs/README.md) |  [Single-page app](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi-v2) |  | [wiki](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki)|
|![Angular JS](media/sample-v2-code/logo_angular.png) | MSAL Angular JS | [NPM](https://www.npmjs.com/package/@azure/msal-angularjs) | [GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angularjs/README.md) |  |  | |
![Angular](media/sample-v2-code/logo_angular.png) | MSAL Angular(Preview) | [NPM](https://www.npmjs.com/package/@azure/msal-angular) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/README.md) | | | |
| ![.NET Framework](media/sample-v2-code/logo_NET.png) ![UWP](media/sample-v2-code/logo_windows.png) ![Xamarin](media/sample-v2-code/logo_xamarin.png) | MSAL .NET (Preview) |[NuGet](https://www.nuget.org/packages/Microsoft.Identity.Client) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) | [Desktop app](guidedsetups/active-directory-mobileanddesktopapp-windowsdesktop-intro.md) | [MSAL.NET](https://docs.microsoft.com/dotnet/api/microsoft.identity.client?view=azure-dotnet-preview) |[wiki](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki#conceptual-documentation) | [Roadmap](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki#roadmap)
| ![iOS / Objective C or swift](media/sample-v2-code/logo_iOS.png) | MSAL obj_c (Preview) | [GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-objc) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-objc) | [iOS app](https://github.com/Azure-Samples/active-directory-msal-ios-swift) |  |
|![Android / Java](media/sample-v2-code/logo_Android.png) | MSAL (Preview) | [ Central repository](https://repo1.maven.org/maven2/com/microsoft/identity/client/msal/) |[GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-android) | [Android app](quickstart-v2-android.md) | [JavaDocs](http://javadoc.io/doc/com.microsoft.identity.client/msal) | | |

## Microsoft-supported server middleware libraries

Middleware libraries are used to protect Web applications and Web APIs. For web app or Web API written with ASP.NET or ASP.NET Core, the middleware libraries are used by ASP.NET / ASP.NET Core

| Platform | Library | Download | Source Code | Sample | Reference
| --- | --- | --- | --- | --- | --- |
| ![.NET](media/sample-v2-code/logo_NET.png) ![.NET Core](media/sample-v2-code/logo_NETcore.png) | ASP.NET Security |[NuGet](https://www.nuget.org/packages/Microsoft.AspNet.Mvc/) |[ASP.NET Security (GitHub)](https://github.com/aspnet/Security) |[MVC app](quickstart-v2-aspnet-webapp.md) |[ASP.NET API reference](https://docs.microsoft.com/dotnet/api/?view=aspnetcore-2.0) |
| ![.NET](media/sample-v2-code/logo_NET.png)| IdentityModel Extensions for .NET| |[GitHub](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) | [MVC app](quickstart-v2-aspnet-webapp.md) |[Reference](https://docs.microsoft.com/dotnet/api/overview/azure/activedirectory/client?view=azure-dotnet) |
| ![Node.js](media/sample-v2-code/logo_nodejs.png) | Azure AD Passport |[NPM](https://www.npmjs.com/package/passport-azure-ad) |[GitHub](https://github.com/AzureAD/passport-azure-ad) | [Web app](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs) | |

## Compatible client libraries

| Platform | Library name | Tested version | Source code | Sample |
|:---:|:---:|:---:|:---:|:---:|
|![JavaScript](media/sample-v2-code/logo_js.png)|[Hello.js](https://adodson.com/hello.js/) |1.13.5 |[Hello.js](https://github.com/MrSwitch/hello.js) |[SPA](https://github.com/Azure-Samples/active-directory-javascript-graphapi-web-v2) |
| ![Java](media/sample-v2-code/logo_java.png) | [Scribe Java](https://github.com/scribejava/scribejava) | [Version 3.2.0](https://github.com/scribejava/scribejava/releases/tag/scribejava-3.2.0) | [ScribeJava](https://github.com/scribejava/scribejava/) | |
| ![PHP](media/sample-v2-code/logo_php.png) | [The PHP League oauth2-client](https://github.com/thephpleague/oauth2-client) | [Version 1.4.2](https://github.com/thephpleague/oauth2-client/releases/tag/1.4.2) | [oauth2-client](https://github.com/thephpleague/oauth2-client/) | |
| ![Ruby](media/sample-v2-code/logo_ruby.png) |[OmniAuth](https://github.com/omniauth/omniauth/wiki) |omniauth:1.3.1</br>omniauth-oauth2:1.4.0 |[OmniAuth](https://github.com/omniauth/omniauth)</br>[OmniAuth OAuth2](https://github.com/intridea/omniauth-oauth2) |  |
![iOS](media/sample-v2-code/logo_iOS.png) |[NXOAuth2Client](https://github.com/nxtbgthng/OAuth2Client) |1.2.8 |[NXOAuth2Client](https://github.com/nxtbgthng/OAuth2Client) |[Native app sample](active-directory-v2-devquickstarts-ios.md) |

For any standards-compliant library you can use the v2.0 endpoint, thus it’s important to know where to go for support.

* For issues and new feature requests in library code, contact the library owner.
* For issues and new feature requests in the service-side protocol implementation, contact Microsoft.
* [File a feature request](https://feedback.azure.com/forums/169401-azure-active-directory) for additional features you would like to see in the protocol.
* [Create a support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request) if you find an issue where the Azure AD v2.0 endpoint is not compliant with OAuth 2.0 or OpenID Connect 1.0.

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
