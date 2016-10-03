<properties
   pageTitle="Azure Active Directory v2.0 libraries | Microsoft Azure"
   description="Provides a list of all compatible client libraries and server middleware libraries, along with related library/source/samples links, for the Azure Active Directory v2.0 endpoint."
   services="active-directory"
   documentationCenter=""
   authors="skwan"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="09/26/2016"
   ms.author="skwan;bryanla"/>


# Azure Active Directory (AD) v2.0 and authentication libraries
The Azure AD v2.0 endpoint supports the industry standard OAuth 2.0 and OpenID Connect 1.0 protocols.  A variety of libraries from Microsoft and from others can be used with the v2.0 endpoint.

When building an application that uses the v2.0 endpoint, we recommend you use libraries written by protocol domain experts who follow a Security Development Lifecycle (SDL) methodology, [such as the one followed by Microsoft][Microsoft-SDL].  If you decide to hand-code support for the protocols, we recommend you follow SDL and carefully observe the security considerations found in the standards specifications for each of the protocols.

## Types of libraries
There are two kinds of libraries that work with v2.0: 

- **Client libraries**:  Client libraries are used on native clients and on servers to obtain access tokens for calling a resource, such as the Microsoft Graph.
- **Server middleware libraries**:  Server middleware libraries are used by web applications to sign a user in, and by web APIs to validate tokens that are sent by native clients or other servers.

## Library support
Since you can choose any standards-compliant library when using the v2.0 endpoint, it’s important to know where to go for support.  Issues and feature requests in library code go to the library owner. Issues and feature requests in the service-side protocol implementation go to Microsoft.

Libraries come in two support categories:

- **Microsoft supported**:  Microsoft provides fixes for these libraries.  Microsoft has done Security Development Lifecycle due diligence on these libraries. 
- **Compatible**:  Microsoft has tested a set of libraries in basic scenarios and confirmed they work with the v2.0 endpoint.  Microsoft does not provide fixes for these libraries and has not done a review of these libraries.  Issues and feature requests should be directed to the library’s open source project.

For a list of libraries that work with the v2.0 endpoint, see the following sections. 

## Microsoft supported client libraries
| Platform| Library Name| Download | Source code | Sample |
| :-: | :-: | :-: | :-: | :-: |
| .NET, Windows Store, Xamarin | Microsoft Authentication Library (MSAL) for .NET | [Microsoft.Identity.Client (NuGet)][ClientLib-NET-Lib] | [MSAL for .NET (GitHub)][ClientLib-NET-Repo] | [Windows desktop native client sample][ClientLib-NET-Sample] |
| Node.js | Microsoft Azure Active Directory Passport.js Plug-In | [Passport-Azure-AD (npm)][ClientLib-Node-Lib] | [Passport-Azure-AD (GitHub)][ClientLib-Node-Repo] | Coming soon |

<!--- COMMENTING OUT UNTIL THEY ARE READY
| iOS, Mac | Microsoft Authentication Library (MSAL) for ObjC | In development | In development | In development |
| Android | Microsoft Authentication Library (MSAL) for Android | In development | In development | In development |
| JavaScript | Microsoft Authentication Library (MSAL) for JavaScript | In development | In development | In development |
 -->

## Microsoft supported server middleware libraries
| Platform| Library Name| Download | Source code | Sample |
| :-: | :-: | :-: | :-: | :-: |
| .NET 4.x | OWIN OpenID Connect Middleware for ASP.NET | [Microsoft.Owin.Security.OpenIdConnect (NuGet)][ServerLib-Net4-Owin-Oidc-Lib] | [Katana Project (CodePlex)][ServerLib-Net4-Owin-Oidc-Repo] | [Web app sample][ServerLib-Net4-Owin-Oidc-Sample] |
| .NET 4.x | OWIN OAuth Bearer Middleware for ASP.Net | [Microsoft.Owin.Security.OAuth (NuGet)][ServerLib-Net4-Owin-Oauth-Lib] | [Katana Project (CodePlex)][ServerLib-Net4-Owin-Oauth-Repo] | [Web API sample][ServerLib-Net4-Owin-Oauth-Sample] |
| .NET Core | OWIN OpenID Connect Middleware for .Net Core | [Microsoft.AspNetCore.Authentication.OpenIdConnect (NuGet)][ServerLib-NetCore-Owin-Oidc-Lib] | [ASP.Net Security (GitHub)][ServerLib-NetCore-Owin-Oidc-Repo] | [Web app sample][ServerLib-NetCore-Owin-Oidc-Sample] |
| .NET Core | OWIN OAuth Bearer Middleware for .Net Core | [Microsoft.AspNetCore.Authentication.OAuth (NuGet)][ServerLib-NetCore-Owin-Oauth-Lib] | [ASP.Net Security (GitHub)][ServerLib-NetCore-Owin-Oauth-Repo] | Coming soon |
| Node.js | Microsoft Azure Active Directory Passport.js Plug-In | [Passport-Azure-AD (npm)][ServerLib-Node-Lib] | [Passport-Azure-AD (GitHub)][ServerLib-Node-Repo] | [Web app sample][ServerLib-Node-Sample] |
<!--- COMMENTING UNTIL SAMPLE IS AVAILABLE
| .NET 4.x, .NET Core | JSON Web Token Handler for .Net | [System.IdentityModel.Tokens.Jwt (NuGet)][ServerLib-Net-Jwt-Lib] | [Azure AD identity model extensions for .Net (GitHub)][ServerLib-Net-Jwt-Repo] | Coming soon |
--->
## Compatible client libraries
| Platform| Name | Tested Version | Source code | Sample |
| :-: | :-: | :-: | :-: | :-: |
| Android | [OIDCAndroidLib](https://github.com/kalemontes/OIDCAndroidLib/wiki) | 0.2.1 | [OIDCAndroidLib](https://github.com/kalemontes/OIDCAndroidLib) | [Native app sample](active-directory-v2-devquickstarts-android.md) |
| iOS | [NXOAuth2Client](https://github.com/nxtbgthng/OAuth2Client) | 1.2.8 | [NXOAuth2Client](https://github.com/nxtbgthng/OAuth2Client) | [Native app sample](active-directory-v2-devquickstarts-ios.md)|
| JavaScript | [Hello.js](https://adodson.com/hello.js/) | 1.13.5 | [Hello.js](https://github.com/MrSwitch/hello.js) | Coming soon |
| Python - Flask | [Flask-OAuthlib](https://github.com/lepture/flask-oauthlib) | 0.9.3 | [Flask-OAuthlib](https://github.com/lepture/flask-oauthlib) | Coming soon |
| Ruby | [OmniAuth](https://github.com/omniauth/omniauth/wiki) | omniauth:1.3.1</br>omniauth-oauth2:1.4.0 | [OmniAuth](https://github.com/omniauth/omniauth)</br>[OmniAuth OAuth2](https://github.com/intridea/omniauth-oauth2) | Coming soon |
<!--- REMOVING BRANDON'S FOR NOW
|  |  |  |  |  |
| Android | [OAuth2 Client](https://github.com/wuman/android-oauth-client) |   | [OAuth2 Client](https://github.com/wuman/android-oauth-client)  | Coming soon  |
| Java | [WSO2 Identity Server](https://docs.wso2.com/display/IS500/Introducing+the+Identity+Server) | [Version 5.2.0](http://wso2.com/products/identity-server/) | [Source](https://docs.wso2.com/display/IS500/Building+from+Source) | [Samples index](https://docs.wso2.com/display/IS500/Samples)  |
| Java | [Java Gluu Server](https://gluu.org/docs/) |   | [oxAuth](https://github.com/GluuFederation/oxAuth)  | Coming soon |
| Node.js | [NPM passport-openidconnect](https://www.npmjs.com/package/passport-openidconnect) | 0.0.1  | [Passport-OpenID Connect](https://github.com/jaredhanson/passport-openidconnect) | Coming soon  |
| PHP | [OpenID Connect Basic Client](https://github.com/jumbojett/OpenID-Connect-PHP) |   | [OpenID Connect Basic Client](https://github.com/jumbojett/OpenID-Connect-PHP)  | Coming soon  |
-->

## Compatible server middleware libraries 
Coming soon


## Related content
See the [Azure AD App Model v2 Overview][AAD-App-Model-V2-Overview] for more information on the Azure AD v2.0 endpoint. 

Please use the following Disqus comments section to provide feedback and help us refine and shape our content.

<!--Image references-->

<!--Reference style links -->
[AAD-App-Model-V2-Overview]: active-directory-appmodel-v2-overview.md
[ClientLib-NET-Lib]: http://www.nuget.org/packages/Microsoft.Identity.Client
[ClientLib-NET-Repo]: https://github.com/AzureAD/microsoft-authentication-library-for-dotnet
[ClientLib-NET-Sample]: active-directory-v2-devquickstarts-wpf.md
[ClientLib-Node-Lib]: https://www.npmjs.com/package/passport-azure-ad
[ClientLib-Node-Repo]: https://github.com/AzureAD/passport-azure-ad
[ClientLib-Node-Sample]:
[ClientLib-Iosmac-Lib]:
[ClientLib-Iosmac-Repo]:
[ClientLib-Iosmac-Sample]:
[ClientLib-Android-Lib]:
[ClientLib-Android-Repo]:
[ClientLib-Android-Sample]:
[ClientLib-Js-Lib]:
[ClientLib-Js-Repo]:
[ClientLib-Js-Sample]:
[Microsoft-SDL]: http://www.microsoft.com/sdl/default.aspx
[ServerLib-Net4-Owin-Oidc-Lib]: https://www.nuget.org/packages/Microsoft.Owin.Security.OpenIdConnect/
[ServerLib-Net4-Owin-Oidc-Repo]: http://katanaproject.codeplex.com/
[ServerLib-Net4-Owin-Oidc-Sample]: active-directory-v2-devquickstarts-dotnet-web.md
[ServerLib-Net4-Owin-Oauth-Lib]: https://www.nuget.org/packages/Microsoft.Owin.Security.OAuth/
[ServerLib-Net4-Owin-Oauth-Repo]: http://katanaproject.codeplex.com/
[ServerLib-Net4-Owin-Oauth-Sample]: https://azure.microsoft.com/en-us/documentation/articles/active-directory-v2-devquickstarts-dotnet-api/
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
[ServerLib-Node-Sample]: https://azure.microsoft.com/en-us/documentation/articles/active-directory-v2-devquickstarts-node-web/

