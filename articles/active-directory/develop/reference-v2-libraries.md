---
title: Microsoft identity platform authentication libraries
description: Compatible client libraries and server middleware libraries, along with related library, source, and sample links, for the Microsoft identity platform endpoint.
services: active-directory
author: negoe
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: reference
ms.workload: identity
ms.date: 1/12/2021
ms.author: negoe
# ms.reviewer: jmprieur, saeeda
ms.custom: aaddev
# Customer intent: As a developer, I want to know whether there's a Microsoft identity platform-compatible authentication library available for
# for the language/framework I'm using to build my application, and whether the library is supported by Microsoft.
---

# Microsoft identity platform authentication libraries

The Microsoft identity platform supports the industry-standard OAuth 2.0 and OpenID Connect 1.0 protocols. The Microsoft Authentication Library (MSAL) is designed to work with the Microsoft identity platform endpoint. You can also use open-source libraries that support OAuth 2.0 and OpenID Connect 1.0.

We recommend that you use libraries written by protocol domain experts who follow a Security Development Lifecycle (SDL) methodology. Such methodologies include [the one that Microsoft follows][Microsoft-SDL]. If you hand code for the protocols, you should follow a methodology such as Microsoft SDL. Pay close attention to the security considerations in the standards specifications for each protocol.

## Single-page application (SPA)

A single-page application runs entirely on the browser surface and fetches page data (HTML, CSS, and JavaScript) dynamically or at application load time. It can call web APIs to interact with back-end data sources.

Because a SPA's code runs entirely in the browser, it's considered a *public client* that's unable to store secrets securely.

| Platform | Library | Package | Docs quickstart or tutorial | Signs in users | Gets access tokens | Generally available (GA) *or*<br/>Public preview<sup>1</sup> |
|--|--|--|:-:|:-:|:-:|:-:|
| JavaScript | [MSAL.js 2.0]( https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser) | [@azure/msal-browser]( https://www.npmjs.com/package/@azure/msal-browser) | [tutorial](tutorial-v2-javascript-auth-code.md) | ![Green check mark.][y] | ![Green check mark.][y] | GA |
| React | [MSAL for React v1.x (Alpha)]( https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react) | [@azure/msal-react]( https://www.npmjs.com/package/@azure/msal-react) | -- | ![Green check mark.][y] | ![Green check mark.][y] | Public preview |
| Angular | [MSAL for Angular v2.x (Alpha)]( https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular) | [@azure/msal-angular](https://www.npmjs.com/package/@azure/msal-angular) | -- | ![Green check mark.][y] | ![Green check mark.][y] | Public preview |
| Angular | [MSAL for Angular]( https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/msal-angular-v1/lib/msal-angular) | [@azure/msal-angular]( https://www.npmjs.com/package/@azure/msal-angular) | [tutorial](tutorial-v2-angular.md) | ![Green check mark.][y] | ![Green check mark.][y] | GA |
| AngularJS | [MSAL for AngularJS]( https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angularjs) | [@azure/msal-angularjs]( https://www.npmjs.com/package/@azure/msal-angularjs) | -- | ![Green check mark.][y] | ![Green check mark.][y] | Public preview |
<!--
| Vue | [Vue MSAL]( https://github.com/mvertopoulos/vue-msal) | [vue-msal]( https://www.npmjs.com/package/vue-msal) | ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
-->

<sup>1</sup> [Supplemental terms of use for Microsoft Azure Previews][preview-tos] apply to libraries in *Public preview*.

## Web application

A web application runs code on a server that generates and sends HTML, CSS, and JavaScript to a user's web browser to be rendered. The user's identity is maintained as a session between the user's browser (the front end) and the web server (the back end).

Because a web application's code runs on the web server, it's considered a *confidential client* that can store secrets securely.

| Platform | Library | Package | Docs quickstart or tutorial | Signs in users | Gets access tokens | Generally available (GA) *or*<br/>Public preview<sup>1</sup> |
|--|--|--|:-:|:-:|:-:|:-:|
| .NET | [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) | [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) | -- | ![X indicating no.][n] | ![Green check mark.][y] | GA |
| ASP.NET Core | [Microsoft.Identity.Web](https://github.com/AzureAD/microsoft-identity-web/wiki) | [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web) | -- | ![Green check mark.][y] | ![Green check mark.][y] | GA |
| ASP.NET Core | [ASP.NET Security](https://docs.microsoft.com/en-us/aspnet/core/security/) | [Microsoft.AspNetCore.Authentication](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication/) | -- | ![Green check mark.][y] | ![X indicating no.][n] | GA |
| Node.js | [MSAL.js for Node](quickstart-v2-nodejs-webapp-msal.md) | [msal-node](https://www.npmjs.com/package/@azure/msal-node) | [quickstart](quickstart-v2-nodejs-webapp-msal.md) | ![Green check mark.][y] | ![Green check mark.][y] | Public preview |
| Node.js | [Azure AD Passport](https://github.com/AzureAD/passport-azure-ad) | [passport-azure-ad](https://www.npmjs.com/package/passport-azure-ad) | [quickstart](quickstart-v2-nodejs-webapp.md) | ![Green check mark.][y] | ![X indicating no.][n] | Public preview |
| Java | [MSAL4J](https://github.com/AzureAD/microsoft-authentication-library-for-java/wiki) | [msal4j](https://search.maven.org/artifact/com.microsoft.azure/msal4j) | [quickstart](quickstart-v2-java-webapp.md) | ![Green check mark.][y] | ![Green check mark.][y] | GA |
| Python | [MSAL Python](https://github.com/AzureAD/microsoft-authentication-library-for-python/wiki) | [msal](https://pypi.org/project/msal) | [quickstart](quickstart-v2-python-webapp.md) | ![Green check mark.][y] | ![Green check mark.][y] | GA |
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

| Platform | Library | Package | Docs quickstart or tutorial | Signs in users | Gets access tokens | Generally available (GA) *or*<br/>Public preview<sup>1</sup> |
|--|--|--|:-:|:-:|:-:|:-:|
| Electron | [MSAL.js 2.0](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser) | [@azure/msal-node](https://www.npmjs.com/package/@azure/msal-node) | -- | ![Green check mark.][y] | ![Green check mark.][y] | Public preview |
| WPF | [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) | [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) | [tutorial](tutorial-v2-windows-desktop.md) | ![Green check mark.][y] | ![Green check mark.][y] | GA |
| UWP | [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) | [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) | [tutorial](tutorial-v2-windows-uwp.md) | ![Green check mark.][y] | ![Green check mark.][y] | GA |
| Java | [MSAL4J](https://github.com/Azure-Samples/ms-identity-java-desktop/) | [Msal4j](https://mvnrepository.com/artifact/com.microsoft.azure/msal4j) | -- | ![Green check mark.][y] | ![Green check mark.][y] | GA |
| macOS (Swift/Obj-C) | [MSAL for iOS and macOS](https://azuread.github.io/microsoft-authentication-library-for-objc/index.html) | [MSAL](https://cocoapods.org/pods/MSAL) | [tutorial](tutorial-v2-ios.md) | ![Green check mark.][y] | ![Green check mark.][y] | GA |
<!--
| Java | Scribe | [Scribe Java](https://mvnrepository.com/artifact/org.scribe/scribe) | ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
| React Native | [React Native App Auth](https://github.com/FormidableLabs/react-native-app-auth/blob/main/docs/config-examples/azure-active-directory.md) | [react-native-app-auth](https://www.npmjs.com/package/react-native-app-auth) | ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
-->

<sup>1</sup> [Supplemental terms of use for Microsoft Azure Previews][preview-tos] apply to libraries in *Public preview*.

## Mobile application

A mobile application is typically binary (compiled) code that surfaces a user interface and is intended to run on a user's mobile device.

Because a mobile application runs on the the user's mobile device, it's considered a *public client* that's unable to store secrets securely.

|Platform | Library | Package | Docs quickstart or tutorial | Signs in users | Gets access tokens | Generally available (GA) *or*<br/>Public preview<sup>1</sup> |
|--|--|--|:-:|:-:|:-:|:-:|
| Xamarin (.NET) |[MSAL.NET](https://github.com/azure-samples/active-directory-xamarin-native-v2) | [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) | -- | ![Green check mark.][y] | ![Green check mark.][y] | GA |
| iOS (Swift/Obj-C) | [MSAL for iOS and macOS](https://azuread.github.io/microsoft-authentication-library-for-objc/index.html) | [MSAL](https://cocoapods.org/pods/MSAL) | [tutorial](tutorial-v2-ios.md) | ![Green check mark.][y] | ![Green check mark.][y] | GA |
| Android (Java) | [MSAL Android](https://github.com/Azure-Samples/ms-identity-android-java) | [MSAL](https://mvnrepository.com/artifact/com.microsoft.identity.client/msal) | [quickstart](quickstart-v2-android.md) | ![Green check mark.][y] | ![Green check mark.][y] | GA |
| Android (Kotlin) | [MSAL](https://github.com/Azure-Samples/ms-identity-android-kotlin) | [MSAL](https://mvnrepository.com/artifact/com.microsoft.identity.client/msal) | -- | ![Green check mark.][y] | ![Green check mark.][y] | GA |
<!--
| React Native |[React Native App Auth](https://github.com/FormidableLabs/react-native-app-auth/blob/main/docs/config-examples/azure-active-directory.md) | [react-native-app-auth](https://www.npmjs.com/package/react-native-app-auth) | ![X indicating no.][n] | ![Green check mark.][y] | ![Green check mark.][y] | -- |
-->

<sup>1</sup> [Supplemental terms of use for Microsoft Azure Previews][preview-tos] apply to libraries in *Public preview*.

## Service / daemon

Services and daemons are commonly used for server-to-server and other unattended (sometimes called *headless*) communication. Because there's no user at the keyboard to enter credentials or consent to resource access, these applications authenticate as themselves, not a user, when requesting authorized access to a web API's resources.

A service or daemon that runs on a server is considered a *confidential client* that can store its secrets securely.

| Platform | Library | Package | Docs quickstart or tutorial | Signs in users | Gets access tokens | Generally available (GA) *or*<br/>Public preview<sup>1</sup> |
|--|--|--|:-:|:-:|:-:|:-:|
|.NET| [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki) | [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client/) | [quickstart](quickstart-v2-netcore-daemon.md) | ![X indicating no.][n] | ![Green check mark.][y] | Generally available (GA)|
|Java| [MSAL Java](https://github.com/AzureAD/microsoft-authentication-library-for-java/wiki) | [msal4j](https://javadoc.io/doc/com.microsoft.azure/msal4j/latest/index.html) | -- | ![X indicating no.][n] | ![Green check mark.][y] | GA |
|Python | [MSAL Python](https://github.com/AzureAD/microsoft-authentication-library-for-python) | [msal-python](https://github.com/AzureAD/microsoft-authentication-library-for-python) | [quickstart](quickstart-v2-python-daemon.md) | ![X indicating no.][n] | ![Green check mark.][y] | GA |
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
[Microsoft-SDL]: https://www.microsoft.com/sdl/default.aspx
[preview-tos]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
