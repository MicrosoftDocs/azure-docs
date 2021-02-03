---
title: Microsoft identity platform authentication libraries | Azure
description: List of client libraries and middleware compatible with the Microsoft identity platform. Use these libraries to add support for user sign-in (authentication) and protected web API access (authorization) to your applications.
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: reference
ms.workload: identity
ms.date: 01/29/2021
ms.author: marsma
ms.reviewer: jmprieur, saeeda
ms.custom: aaddev
# Customer intent: As a developer, I want to know whether there's a Microsoft Authentication Library (MSAL) available for
# the language/framework I'm using to build my application, and whether the library is GA or in preview.
---

# Microsoft identity platform authentication libraries

The following tables show Microsoft authentication library support for several application types. They include links to library source code, where to get the package for your app's project, and whether the library supports user sign-in (authentication), access to protected web APIs (authorization), or both.

The Microsoft identity platform has been certified by the OpenID Foundation as a [certified OpenID provider](https://openid.net/certification/). If you prefer to use a library other than the Microsoft Authentication Library (MSAL) or another Microsoft-supported library, choose one with a [certified OpenID Connect implementation](https://openid.net/developers/certified/).

If you choose to hand-code your own protocol-level implementation of [OAuth 2.0 or OpenID Connect 1.0](active-directory-v2-protocols.md), pay close attention to the security considerations in each standard's specification and follow a software development lifecycle (SDL) methodology like the [Microsoft SDL][Microsoft-SDL].

## Single-page application (SPA)

A single-page application runs entirely on the browser surface and fetches page data (HTML, CSS, and JavaScript) dynamically or at application load time. It can call web APIs to interact with back-end data sources.

Because a SPA's code runs entirely in the browser, it's considered a *public client* that's unable to store secrets securely.

| Language / framework | Project on<br/>GitHub                                                                                                    | Package                                                                      | Getting<br/>started                             | Sign in users                                         | Access web APIs                                                 | Generally available (GA) *or*<br/>Public preview<sup>1</sup> |
|----------------------|--------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|:-----------------------------------------------:|:-----------------------------------------------------:|:---------------------------------------------------------------:|:------------------------------------------------------------:|
| Angular              | [MSAL Angular 2.0](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular)         | [@azure/msal-angular](https://www.npmjs.com/package/@azure/msal-angular)     | —                                               | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | Public preview                                               |
| Angular              | [MSAL Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/msal-angular-v1/lib/msal-angular) | [@azure/msal-angular](https://www.npmjs.com/package/@azure/msal-angular)     | [Tutorial](tutorial-v2-angular.md)              | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
| AngularJS            | [MSAL AngularJS](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angularjs)         | [@azure/msal-angularjs](https://www.npmjs.com/package/@azure/msal-angularjs) | —                                               | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | Public preview                                               |
| JavaScript           | [MSAL.js 2.0](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser)              | [@azure/msal-browser](https://www.npmjs.com/package/@azure/msal-browser)     | [Tutorial](tutorial-v2-javascript-auth-code.md) | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
| React                | [MSAL React](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)                 | [@azure/msal-react](https://www.npmjs.com/package/@azure/msal-react)         | —                                               | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | Public preview                                               |
<!--
| Vue | [Vue MSAL]( https://github.com/mvertopoulos/vue-msal) | [vue-msal]( https://www.npmjs.com/package/vue-msal) | ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
-->

<sup>1</sup> [Supplemental terms of use for Microsoft Azure Previews][preview-tos] apply to libraries in *Public preview*.

## Web application

A web application runs code on a server that generates and sends HTML, CSS, and JavaScript to a user's web browser to be rendered. The user's identity is maintained as a session between the user's browser (the front end) and the web server (the back end).

Because a web application's code runs on the web server, it's considered a *confidential client* that can store secrets securely.

| Language / framework | Project on<br/>GitHub                                                                                     | Package                                                                                                    | Getting<br/>started                               | Sign in users                                            | Access web APIs                                                    | Generally available (GA) *or*<br/>Public preview<sup>1</sup> |
|----------------------|-----------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|:-------------------------------------------------:|:--------------------------------------------------------:|:------------------------------------------------------------------:|:------------------------------------------------------------:|
| .NET                 | [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet)                        | [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client)                      | —                                                 | ![Library cannot request ID tokens for user sign-in.][n] | ![Library can request access tokens for protected web APIs.][y]    | GA                                                           |
| ASP.NET Core         | [ASP.NET Security](/aspnet/core/security/)                                                                | [Microsoft.AspNetCore.Authentication](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication/) | —                                                 | ![Library can request ID tokens for user sign-in.][y]    | ![Library cannot request access tokens for protected web APIs.][n] | GA                                                           |
| ASP.NET Core         | [Microsoft.Identity.Web](https://github.com/AzureAD/microsoft-identity-web)                               | [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web)                            | —                                                 | ![Library can request ID tokens for user sign-in.][y]    | ![Library can request access tokens for protected web APIs.][y]    | GA                                                           |
| Java                 | [MSAL4J](https://github.com/AzureAD/microsoft-authentication-library-for-java)                            | [msal4j](https://search.maven.org/artifact/com.microsoft.azure/msal4j)                                     | [Quickstart](quickstart-v2-java-webapp.md)        | ![Library can request ID tokens for user sign-in.][y]    | ![Library can request access tokens for protected web APIs.][y]    | GA                                                           |
| Node.js              | [MSAL Node.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) | [msal-node](https://www.npmjs.com/package/@azure/msal-node)                                                | [Quickstart](quickstart-v2-nodejs-webapp-msal.md) | ![Library can request ID tokens for user sign-in.][y]    | ![Library can request access tokens for protected web APIs.][y]    | Public preview                                               |
| Node.js              | [Azure AD Passport](https://github.com/AzureAD/passport-azure-ad)                                         | [passport-azure-ad](https://www.npmjs.com/package/passport-azure-ad)                                       | [Quickstart](quickstart-v2-nodejs-webapp.md)      | ![Library can request ID tokens for user sign-in.][y]    | ![Library cannot request access tokens for protected web APIs.][n] | GA                                                           |
| Python               | [MSAL Python](https://github.com/AzureAD/microsoft-authentication-library-for-python)                     | [msal](https://pypi.org/project/msal)                                                                      | [Quickstart](quickstart-v2-python-webapp.md)      | ![Library can request ID tokens for user sign-in.][y]    | ![Library can request access tokens for protected web APIs.][y]    | GA                                                           |
<!--
| Java | [ScribeJava](https://github.com/scribejava/scribejava) | [ScribeJava 3.2.0](https://github.com/scribejava/scribejava/releases/tag/scribejava-3.2.0) | ![X indicating no.][n] | ![X indicating no.][n] | ![Green check mark.][y] | -- |
| Java | [Gluu oxAuth](https://github.com/GluuFederation/oxAuth) | [oxAuth 3.0.2](https://github.com/GluuFederation/oxAuth/releases/tag/3.0.2) | ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
| Node.js | [openid-client](https://github.com/panva/node-openid-client/) | [openid-client 2.4.5](https://github.com/panva/node-openid-client/releases/tag/v2.4.5) | ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
| PHP | [PHP League oauth2-client](https://github.com/thephpleague/oauth2-client) | [oauth2-client 1.4.2](https://github.com/thephpleague/oauth2-client/releases/tag/1.4.2) | ![X indicating no.][n] | ![X indicating no.][n] | ![Green check mark.][y] | -- |
| Ruby | [OmniAuth](https://github.com/omniauth/omniauth) | [omniauth 1.3.1](https://github.com/omniauth/omniauth/releases/tag/v1.3.1)<br/>[omniauth-oauth2 1.4.0](https://github.com/intridea/omniauth-oauth2) | ![X indicating no.][n] | ![X indicating no.][n] | ![Green check mark.][y] | -- |
-->

<sup>1</sup> [Supplemental terms of use for Microsoft Azure Previews][preview-tos] apply to libraries in *Public preview*.

## Desktop application

A desktop application is typically binary (compiled) code that surfaces a user interface and is intended to run on a user's desktop.

Because a desktop application runs on the user's desktop, it's considered a *public client* that's unable to store secrets securely.

| Language / framework | Project on<br/>GitHub                                                                                     | Package                                                                               | Getting<br/>started                        | Sign in users                                         | Access web APIs                                                 | Generally available (GA) *or*<br/>Public preview<sup>1</sup> |
|----------------------|-----------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|:------------------------------------------:|:-----------------------------------------------------:|:---------------------------------------------------------------:|:------------------------------------------------------------:|
| Electron             | [MSAL Node.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) | [@azure/msal-node](https://www.npmjs.com/package/@azure/msal-node)                    | —                                          | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | Public preview                                               |
| Java                 | [MSAL4J](https://github.com/AzureAD/microsoft-authentication-library-for-java)                            | [msal4j](https://mvnrepository.com/artifact/com.microsoft.azure/msal4j)               | —                                          | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
| macOS (Swift/Obj-C)  | [MSAL for iOS and macOS](https://github.com/AzureAD/microsoft-authentication-library-for-objc)            | [MSAL](https://cocoapods.org/pods/MSAL)                                               | [Tutorial](tutorial-v2-ios.md)             | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
| UWP                  | [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet)                        | [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) | [Tutorial](tutorial-v2-windows-uwp.md)     | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
| WPF                  | [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet)                        | [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) | [Tutorial](tutorial-v2-windows-desktop.md) | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
<!--
| Java | Scribe | [Scribe Java](https://mvnrepository.com/artifact/org.scribe/scribe) | ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
| React Native | [React Native App Auth](https://github.com/FormidableLabs/react-native-app-auth/blob/main/docs/config-examples/azure-active-directory.md) | [react-native-app-auth](https://www.npmjs.com/package/react-native-app-auth) | ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
-->

<sup>1</sup> [Supplemental terms of use for Microsoft Azure Previews][preview-tos] apply to libraries in *Public preview*.

## Mobile application

A mobile application is typically binary (compiled) code that surfaces a user interface and is intended to run on a user's mobile device.

Because a mobile application runs on the the user's mobile device, it's considered a *public client* that's unable to store secrets securely.

| Platform          | Project on<br/>GitHub                                                                          | Package                                                                               | Getting<br/>started                    | Sign in users                                         | Access web APIs                                                 | Generally available (GA) *or*<br/>Public preview<sup>1</sup> |
|-------------------|------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|:--------------------------------------:|:-----------------------------------------------------:|:---------------------------------------------------------------:|:------------------------------------------------------------:|
| Android (Java)    | [MSAL Android](https://github.com/AzureAD/microsoft-authentication-library-for-android)        | [MSAL](https://mvnrepository.com/artifact/com.microsoft.identity.client/msal)         | [Quickstart](quickstart-v2-android.md) | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
| Android (Kotlin)  | [MSAL Android](https://github.com/AzureAD/microsoft-authentication-library-for-android)        | [MSAL](https://mvnrepository.com/artifact/com.microsoft.identity.client/msal)         | —                                      | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
| iOS (Swift/Obj-C) | [MSAL for iOS and macOS](https://github.com/AzureAD/microsoft-authentication-library-for-objc) | [MSAL](https://cocoapods.org/pods/MSAL)                                               | [Tutorial](tutorial-v2-ios.md)         | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
| Xamarin (.NET)    | [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet)             | [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) | —                                      | ![Library can request ID tokens for user sign-in.][y] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
<!--
| React Native |[React Native App Auth](https://github.com/FormidableLabs/react-native-app-auth/blob/main/docs/config-examples/azure-active-directory.md) | [react-native-app-auth](https://www.npmjs.com/package/react-native-app-auth) | ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
-->

<sup>1</sup> [Supplemental terms of use for Microsoft Azure Previews][preview-tos] apply to libraries in *Public preview*.

## Service / daemon

Services and daemons are commonly used for server-to-server and other unattended (sometimes called *headless*) communication. Because there's no user at the keyboard to enter credentials or consent to resource access, these applications authenticate as themselves, not a user, when requesting authorized access to a web API's resources.

A service or daemon that runs on a server is considered a *confidential client* that can store its secrets securely.

| Language / framework | Project on<br/>GitHub                                                                 | Package                                                                                | Getting<br/>started                           | Sign in users                                            | Access web APIs                                                 | Generally available (GA) *or*<br/>Public preview<sup>1</sup> |
|----------------------|---------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|:---------------------------------------------:|:--------------------------------------------------------:|:---------------------------------------------------------------:|:------------------------------------------------------------:|
| .NET                 | [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet)    | [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client/) | [Quickstart](quickstart-v2-netcore-daemon.md) | ![Library cannot request ID tokens for user sign-in.][n] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
| Java                 | [MSAL4J](https://github.com/AzureAD/microsoft-authentication-library-for-java)        | [msal4j](https://javadoc.io/doc/com.microsoft.azure/msal4j/latest/index.html)          | —                                             | ![Library cannot request ID tokens for user sign-in.][n] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
| Python               | [MSAL Python](https://github.com/AzureAD/microsoft-authentication-library-for-python) | [msal-python](https://github.com/AzureAD/microsoft-authentication-library-for-python)  | [Quickstart](quickstart-v2-python-daemon.md)  | ![Library cannot request ID tokens for user sign-in.][n] | ![Library can request access tokens for protected web APIs.][y] | GA                                                           |
<!--
|PHP| [The PHP League oauth2-client](https://oauth2-client.thephpleague.com/usage/) | [League\OAuth2](https://oauth2-client.thephpleague.com/) | ![Green check mark.][n] | ![X indicating no.][n] | ![Green check mark.][y] | -- |
-->

<sup>1</sup> [Supplemental terms of use for Microsoft Azure Previews][preview-tos] apply to libraries in *Public preview*.

## Next steps

For more information about the Microsoft Authentication Library, see the [Overview of the Microsoft Authentication Library (MSAL)](msal-overview.md).

<!--Image references-->
[y]: ./media/common/yes.png
[n]: ./media/common/no.png

<!--Reference-style links -->
[AAD-App-Model-V2-Overview]: v2-overview.md
[Microsoft-SDL]: https://www.microsoft.com/securityengineering/sdl/
[preview-tos]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
