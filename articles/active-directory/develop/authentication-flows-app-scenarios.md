---
title: Microsoft identity platform authentication flows & app scenarios | Azure
description: Learn about authentication flows and application scenarios for the Microsoft identity platform. Learn about the different types of applications that can authenticate identities, acquire tokens, and call protected APIs.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.assetid:
ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 09/27/2019
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started
#Customer intent: As an app developer, I want to learn about authentication flows and application scenarios so I can create applications protected by the Microsoft identity platform.
---

# Authentication flows and application scenarios

The Microsoft identity platform (v2.0) endpoint supports authentication for different kinds of modern application architectures. All of the architectures are based on the industry-standard protocols [OAuth 2.0 and OpenID Connect](active-directory-v2-protocols.md).  Using the [authentication libraries](reference-v2-libraries.md), applications authenticate identities and acquire tokens to access protected APIs.

This article describes the different authentication flows and the application scenarios they're used in. This article also provides lists of:
- [Application scenarios and supported authentication flows](#scenarios-and-supported-authentication-flows).
- [Application scenarios and supported platforms and languages](#scenarios-and-supported-platforms-and-languages).

## Application categories

Tokens can be acquired from several types of applications including:

- Web apps
- Mobile apps
- Desktop apps
- Web APIs

They can also be acquired from apps running on devices that don't have a browser or are running on IoT.

Applications can be categorized as in the following list:

- [Protected resources vs. client applications](#protected-resources-vs-client-applications): Some scenarios are about protecting resources like web apps or web APIs. Other scenarios are about acquiring a security token to call a protected web API.
- [With users or without users](#with-users-or-without-users): Some scenarios involve a signed-in user, but others like daemon scenarios don't involve a user.
- [Single-page, public client, and confidential client applications](#single-page-public-client-and-confidential-client-applications): These are three large categories of application types. Each is used with different libraries and objects.
- [Sign-in audience](v2-supported-account-types.md#certain-authentication-flows-dont-support-all-the-account-types): The available authentication flows differ depending on the sign-in audience. Some flows are available only for work or school accounts. And some are available both for work or school accounts and for personal Microsoft accounts. The allowed audience depends on the authentication flows.
- [Supported OAuth 2.0 flows](#scenarios-and-supported-authentication-flows):  Authentication flows are used to implement the application scenarios that are requesting tokens. There isn't a one-to-one mapping between application scenarios and authentication flows.
- [Supported platforms](#scenarios-and-supported-platforms-and-languages): Not all application scenarios are available for every platform.

### Protected resources vs. client applications

Authentication scenarios involve two activities:

- **Acquiring security tokens for a protected web API**: Microsoft recommends that you use [authentication libraries](reference-v2-libraries.md#microsoft-supported-client-libraries) to acquire tokens, in particular the Microsoft Authentication Library (MSAL) family.
- **Protecting a web API or a web app**: One challenge of protecting a web API or web app resource is validating the security token. On some platforms, Microsoft offers [middleware libraries](reference-v2-libraries.md#microsoft-supported-server-middleware-libraries).

### With users or without users

Most authentication scenarios acquire tokens on behalf of signed-in users.

![Scenarios with users](media/scenarios/scenarios-with-users.svg)

However, there are also daemon-app scenarios, in which applications acquire tokens on behalf of themselves with no user.

![Scenarios with daemon apps](media/scenarios/daemon-app.svg)

### Single-page, public client, and confidential client applications

The security tokens can be acquired from multiple types of applications. These applications tend to be separated into three categories:

- **Single-page applications**: Also known as SPAs, these are web apps in which tokens are acquired from a JavaScript or TypeScript app running in the browser. Many modern apps have a single-page application front end that is primarily written in JavaScript. The application often uses a framework like Angular, React, or Vue. MSAL.js is the only Microsoft authentication library that supports single-page applications.

- **Public client applications**: These applications always sign in users:
  - Desktop apps calling web APIs on behalf of the signed-in user
  - Mobile apps
  - Apps running on devices that don't have a browser, like those running on iOT

  These apps are represented by the MSAL [PublicClientApplication](msal-client-applications.md) class.

- **Confidential client applications**:
  - Web apps calling a web API
  - Web APIs calling a web API
  - Daemon apps, even when implemented as a console service like a Linux daemon or a Windows service

  These types of apps use the [ConfidentialClientApplication](msal-client-applications.md) class.

## Application scenarios

The Microsoft identity platform endpoint supports authentication for different kinds of app architectures:

- Single-page apps
- Web apps
- Web APIs
- Mobile apps
- Native apps
- Daemon apps
- Server-side apps

Applications use the different authentication flows to sign in users and get tokens to call protected APIs.

### A single-page application

Many modern web apps are built as client-side single-page applications written using JavaScript or an SPA framework like Angular, Vue.js, and React.js. These applications run in a web browser. Their authentication characteristics differ from those of traditional server-side web apps. By using the Microsoft identity platform, single-page applications can sign in users and get tokens to access back-end services or web APIs.

![A single-page application](media/scenarios/spa-app.svg)

For more information, see [Single-page applications](scenario-spa-overview.md).

### A web app that is signing in a user

![A web app that signs in a user](media/scenarios/scenario-webapp-signs-in-users.svg)

To protect a web app that is signing in a user:

- If you develop in .NET, you use ASP.NET or ASP.NET Core with the ASP.NET Open ID Connect middleware. Protecting a resource involves validating the security token, which is done by the [IdentityModel extensions for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/wiki) library and not MSAL libraries.

- If you develop in Node.js, you use Passport.js.

For more information, see [Web app that signs in users](scenario-web-app-sign-user-overview.md).

### A web app that signs in a user and calling a web API on behalf of the user

![A web app calling web APIs](media/scenarios/web-app.svg)

To call a web API from a web app on behalf of a user, use the MSAL **ConfidentialClientApplication** class. You use the Authorization code flow and store the acquired tokens in the token cache. When needed, MSAL refreshes tokens and the controller silently acquires tokens from the cache.

For more information, see [A web app calling web APIs](scenario-web-app-call-api-overview.md).

### A desktop app calling a web API on behalf of a signed-in user

For a desktop app to call a web API that signs in users, use the interactive token-acquisition methods of the MSAL **PublicClientApplication** class. With these interactive methods, you can control the sign-in UI experience. MSAL uses a web browser for this interaction.

![A desktop app calling a web API](media/scenarios/desktop-app.svg)

There's another possibility for Windows-hosted applications on computers joined either to a Windows domain or by Azure Active Directory (Azure AD). These applications can silently acquire a token by using [Integrated Windows Authentication](https://aka.ms/msal-net-iwa).

Applications running on a device without a browser can still call an API on behalf of a user. To authenticate, the user must sign in on another device that has a web browser. This scenario requires that you use the [Device Code flow](https://aka.ms/msal-net-device-code-flow).

![Device Code flow](media/scenarios/device-code-flow-app.svg)

Though we don't recommend you use it, the [Username/Password flow](https://aka.ms/msal-net-up) is available in public client applications. This flow is still needed in some scenarios like DevOps.

But using this flow imposes constraints on your applications. For instance, applications using this flow can't sign in a user who needs to perform multi-factor authentication or Conditional Access. Your applications also don't benefit from single sign-on.

Authentication with the Username/Password flow goes against the principles of modern authentication and is provided only for legacy reasons.

In desktop apps, if you want the token cache to be persistent, you should [customize the token cache serialization](https://aka.ms/msal-net-token-cache-serialization). By implementing [dual token cache serialization](https://aka.ms/msal-net-dual-cache-serialization), you can use backward-compatible and forward-compatible token caches with previous generations of authentication libraries. Specific libraries include Azure AD Authentication Library for .NET (ADAL.NET) version 3 and version 4.

For more information, see [Desktop app that calls web APIs](scenario-desktop-overview.md).

### A mobile app calling a web API on behalf of an interactive user

Similar to a desktop app, a mobile app calls the interactive token-acquisition methods of the MSAL **PublicClientApplication** class to acquire a token for calling a web API.

![A mobile app calling a web API](media/scenarios/mobile-app.svg)

MSAL iOS and MSAL Android use the system web browser by default. However, you can direct them to use the embedded Web View instead. There are specificities that depend on the mobile platform: Universal Windows Platform (UWP), iOS, or Android.

Some scenarios, like those that involve Conditional Access related to a device ID or a device enrollment, require a [broker](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/leveraging-brokers-on-Android-and-iOS) to be installed on the device. Examples of brokers are Microsoft Company Portal on Android and Microsoft Authenticator on Android and iOS. Also, MSAL can now interact with brokers.

> [!NOTE]
> Your mobile app that uses MSAL.iOS, MSAL.Android, or MSAL.NET on Xamarin can have app protection policies applied to it. For instance, the policies might prevent a user from copying protected text. The mobile app is [managed by Intune](https://docs.microsoft.com/intune/app-sdk) and recognized by Intune as a managed app. The [Intune App SDK](https://docs.microsoft.com/intune/app-sdk-get-started) is separate from MSAL libraries and interacts with Azure AD on its own.

For more information, see [Mobile app that calls web APIs](scenario-mobile-overview.md).

### A protected web API

You can use the Microsoft Identity Platform endpoint to secure web services like your app's RESTful web API. A protected web API is called with an access token to secure the API's data and to authenticate incoming requests. The caller of a web API appends an access token in the authorization header of an HTTP request.

If you want to protect your ASP.NET or ASP.NET Core Web API, you need to validate the access token. For this validation, you use the ASP.NET JWT middleware. The validation is done by the [IdentityModel extensions for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/wiki) library and not by MSAL.NET.

For more information, see [Protected web API](scenario-protected-web-api-overview.md).

### A web API calling another web API on behalf of a user

For your ASP.NET or ASP.NET Core protected Web API to call another web API on behalf of a user, your app needs to acquire a token for the downstream web API. It does so by calling the **ConfidentialClientApplication** class's [AcquireTokenOnBehalfOf](https://aka.ms/msal-net-on-behalf-of) method. Such calls are also named service-to-services calls. The web APIs that call other web APIs need to provide custom cache serialization.

  ![A web API calling another web API](media/scenarios/web-api.svg)

For more information, see [Web API that calls web APIs](scenario-web-api-call-api-overview.md).

### A daemon app calling a web API in the daemon's name

Apps that have long-running processes or that operate without user interaction also need a way to access secure web APIs. Such an app can authenticate and get tokens by using the app's identity rather than a user's delegated identity. The app proves its identity by using a client secret or certificate.

You can write such daemon apps that acquire a token for the calling app by using the MSAL **ConfidentialClientApplication** class's [client credentials](https://aka.ms/msal-net-client-credentials) acquisition methods. These methods require that the calling app has registered a secret with Azure AD. The app then shares the secret with the called daemon. Examples of such secrets include application passwords, certificate assertion, or client assertion.

![A daemon app called by other apps and APIs](media/scenarios/daemon-app.svg)

For more information, see [Daemon application that calls web APIs](scenario-daemon-overview.md).

## Scenarios and supported authentication flows

Scenarios that involve acquiring tokens also map to OAuth 2.0 authentication flows, as detailed in [Microsoft identity platform protocols](active-directory-v2-protocols.md).

<table>
 <thead>
  <tr><th>Scenario</th> <th>Detailed scenario walk-through</th> <th>OAuth 2.0 flow and grant</th> <th>Audience</th></tr>
 </thead>
 <tbody>
  <tr>
   <td><a href="scenario-spa-overview.md"><img alt="Single-Page App" src="media/scenarios/spa-app.svg"></a></td>
   <td><a href="scenario-spa-overview.md">Single-page app</a></td>
   <td><a href="v2-oauth2-implicit-grant-flow.md">Implicit</a></td>
   <td>Work or school accounts, personal accounts, and Microsoft Azure Active Directory B2C (Azure AD B2C)</td>
 </tr>

  <tr>
   <td><a href="scenario-web-app-sign-user-overview.md"><img alt="Web App that signs in users" src="media/scenarios/scenario-webapp-signs-in-users.svg"></a></td>
   <td><a href="scenario-web-app-sign-user-overview.md">A web app that signs in users</a></td>
   <td><a href="v2-oauth2-auth-code-flow.md">Authorization Code</a></td>
   <td>Work or school accounts, personal accounts, and Azure AD B2C</td>
 </tr>

  <tr>
   <td><a href="scenario-web-app-call-api-overview.md"><img alt="Web App that signs in users" src="media/scenarios/web-app.svg"></a></td>
   <td><a href="scenario-web-app-call-api-overview.md">A web app that calls web APIs</a></td>
   <td><a href="v2-oauth2-auth-code-flow.md">Authorization Code</a></td>
   <td>Work or school accounts, personal accounts, and Azure AD B2C</td>
 </tr>

  <tr>
   <td rowspan="3"><a href="scenario-desktop-overview.md"><img alt=Desktop app that calls web APIs" src="media/scenarios/desktop-app.svg"></a></td>
   <td rowspan="4"><a href="scenario-desktop-overview.md">A desktop app that calls web APIs</a></td>
   <td>Interactive by using <a href="v2-oauth2-auth-code-flow.md">Authorization Code</a> with PKCE</td>
   <td>Work or school accounts, personal accounts, and Azure AD B2C</td>
 </tr>

  <tr>
   <td>Integrated Windows Auth</td>
   <td>Work or school accounts</td>
 </tr>

  <tr>
   <td><a href="v2-oauth-ropc.md">Resource Owner Password</a></td>
   <td>Work or school accounts and Azure AD B2C</td>
 </tr>

  <tr>
   <td><a href="scenario-desktop-acquire-token.md#command-line-tool-without-a-web-browser"><img alt="Browserless application" src="media/scenarios/device-code-flow-app.svg"></a></td>
   <td><a href="v2-oauth2-device-code.md">Device code</a></td>
   <td>Work or school accounts</td>
 </tr>

 <tr>
   <td rowspan="2"><a href="scenario-mobile-overview.md"><img alt="Mobile app that calls web APIs" src="media/scenarios/mobile-app.svg"></a></td>
   <td rowspan="2"><a href="scenario-mobile-overview.md">A mobile app that calls web APIs</a></td>
   <td>Interactive by using <a href="v2-oauth2-auth-code-flow.md">Authorization Code</a> with PKCE</td>
   <td>Work or school accounts, personal accounts, and Azure AD B2C</td>
 </tr>

  <tr>
   <td><a href="v2-oauth-ropc.md">Resource Owner Password</a></td>
   <td>Work or school accounts and Azure AD B2C</td>
 </tr>

  <tr>
   <td><a href="scenario-daemon-overview.md"><img alt="Daemon app that calls web APIs" src="media/scenarios/daemon-app.svg"></a></td>
   <td><a href="scenario-daemon-overview.md">A daemon app that calls web APIs</a></td>
   <td><a href="v2-oauth2-client-creds-grant-flow.md">Client credentials</a></td>
   <td>App-only permissions with no user and used only in Azure AD organizations</td>
 </tr>

  <tr>
   <td><a href="scenario-web-api-call-api-overview.md"><img alt="Web API that calls web APIs" src="media/scenarios/web-api.svg"></a></td>
   <td><a href="scenario-web-api-call-api-overview.md">A web API that calls web APIs</a></td>
   <td><a href="v2-oauth2-on-behalf-of-flow.md">On Behalf Of</a></td>
   <td>Work or school accounts and personal accounts</td>
 </tr>

 </tbody>
</table>

## Scenarios and supported platforms and languages

Microsoft Authentication libraries support multiple platforms:

- JavaScript
- .NET Framework
- .NET Core
- Windows 10/UWP
- Xamarin.iOS
- Xamarin.Android
- Native iOS
- macOS
- Native Android
- Java
- Python

You can also use various languages to build your applications. Note that some application types aren't available on every platform.

In the Windows column of the following table, each time .NET Core is mentioned, .NET Framework is also possible. The latter is omitted to avoid cluttering the table.

|Scenario  | Windows | Linux | Mac | iOS | Android
|--|--|--|--|--|--|--|
| [Single-page app](scenario-spa-overview.md) <br/>[![Single-Page App](media/scenarios/spa-app.svg)](scenario-spa-overview.md) | ![MSAL.js](media/sample-v2-code/small_logo_js.png)<br/>MSAL.js | ![MSAL.js](media/sample-v2-code/small_logo_js.png)<br/>MSAL.js | ![MSAL.js](media/sample-v2-code/small_logo_js.png)<br/>MSAL.js | ![MSAL.js](media/sample-v2-code/small_logo_js.png) MSAL.js | ![MSAL.js](media/sample-v2-code/small_logo_js.png)<br/>MSAL.js
| [Web App that signs in users](scenario-web-app-sign-user-overview.md) <br/>[![Web App that signs-in users](media/scenarios/scenario-webapp-signs-in-users.svg)](scenario-web-app-sign-user-overview.md) | ![ASP.NET Core](media/sample-v2-code/small_logo_NETcore.png)<br/>ASP.NET Core | ![ASP.NET Core](media/sample-v2-code/small_logo_NETcore.png)<br/>ASP.NET Core | ![ASP.NET Core](media/sample-v2-code/small_logo_NETcore.png)<br/>ASP.NET Core
| [Web App that calls web APIs](scenario-web-app-call-api-overview.md) <br/> <br/>[![Web App that calls web APIs](media/scenarios/web-app.svg)](scenario-web-app-call-api-overview.md) | ![ASP.NET Core](media/sample-v2-code/small_logo_NETcore.png)<br/>ASP.NET Core + MSAL.NET ![MSAL Java](media/sample-v2-code/small_logo_java.png) <br/>MSAL Java<br/>![MSAL Python](media/sample-v2-code/small_logo_python.png)<br/>Flask + MSAL Python| ![ASP.NET Core](media/sample-v2-code/small_logo_NETcore.png)<br/>ASP.NET Core + MSAL.NET ![MSAL Java](media/sample-v2-code/small_logo_java.png)<br/>MSAL Java<br/>![MSAL Python](media/sample-v2-code/small_logo_python.png)<br/>Flask + MSAL Python| ![ASP.NET Core](media/sample-v2-code/small_logo_NETcore.png)<br/>ASP.NET Core + MSAL.NET ![MSAL Java](media/sample-v2-code/small_logo_java.png)<br/>MSAL Java<br/> ![MSAL Python](media/sample-v2-code/small_logo_python.png)<br/>Flask + MSAL Python
| [Desktop app that calls web APIs](scenario-desktop-overview.md) <br/> <br/>[![Desktop app that calls web APIs](media/scenarios/desktop-app.svg)](scenario-desktop-overview.md) ![Device code flow](media/scenarios/device-code-flow-app.svg) | ![.NET Core](media/sample-v2-code/small_logo_NETcore.png)MSAL.NET ![MSAL Java](media/sample-v2-code/small_logo_java.png)<br/>MSAL Java<br/> ![MSAL Python](media/sample-v2-code/small_logo_python.png)<br/>MSAL Python| ![.NET Core](media/sample-v2-code/small_logo_NETcore.png)MSAL.NET ![MSAL Java](media/sample-v2-code/small_logo_java.png)<br/>MSAL Java<br/>![MSAL Python](media/sample-v2-code/small_logo_python.png)<br/>MSAL Python| ![.NET Core](media/sample-v2-code/small_logo_NETcore.png)MSAL.NET ![MSAL Java](media/sample-v2-code/small_logo_java.png)<br/>MSAL Java<br/>![MSAL Python](media/sample-v2-code/small_logo_python.png)<br/>MSAL Python <br/> ![iOS / Objective C or swift](media/sample-v2-code/small_logo_iOS.png) MSAL.objc |
| [Mobile app that calls web APIs](scenario-mobile-overview.md) <br/> [![Mobile app that calls web APIs](media/scenarios/mobile-app.svg)](scenario-mobile-overview.md) | ![UWP](media/sample-v2-code/small_logo_windows.png) MSAL.NET ![Xamarin](media/sample-v2-code/small_logo_xamarin.png) MSAL.NET | | | ![iOS / Objective C or swift](media/sample-v2-code/small_logo_iOS.png) MSAL.objc | ![Android](media/sample-v2-code/small_logo_Android.png) MSAL.Android
| [Daemon app](scenario-daemon-overview.md) <br/> [![Daemon app](media/scenarios/daemon-app.svg)](scenario-daemon-overview.md) | ![.NET Core](media/sample-v2-code/small_logo_NETcore.png)MSAL.NET ![MSAL Java](media/sample-v2-code/small_logo_java.png)<br/>MSAL Java<br/>![MSAL Python](media/sample-v2-code/small_logo_python.png)<br/>MSAL Python| ![.NET Core](media/sample-v2-code/small_logo_NETcore.png) MSAL.NET ![MSAL Java](media/sample-v2-code/small_logo_java.png)<br/>MSAL Java<br/>![MSAL Python](media/sample-v2-code/small_logo_python.png)<br/>MSAL Python| ![.NET Core](media/sample-v2-code/small_logo_NETcore.png)MSAL.NET ![MSAL Java](media/sample-v2-code/small_logo_java.png)<br/>MSAL Java<br/>![MSAL Python](media/sample-v2-code/small_logo_python.png)<br/>MSAL Python
| [Web API that calls web APIs](scenario-web-api-call-api-overview.md) <br/><br/> [![Web API that calls web APIs](media/scenarios/web-api.svg)](scenario-web-api-call-api-overview.md) | ![ASP.NET Core](media/sample-v2-code/small_logo_NETcore.png)<br/>ASP.NET Core + MSAL.NET ![MSAL Java](media/sample-v2-code/small_logo_java.png)<br/>MSAL Java<br/>![MSAL Python](media/sample-v2-code/small_logo_python.png)<br/>MSAL Python| ![.NET Core](media/sample-v2-code/small_logo_NETcore.png)<br/>ASP.NET Core + MSAL.NET ![MSAL Java](media/sample-v2-code/small_logo_java.png)<br/>MSAL Java<br/>![MSAL Python](media/sample-v2-code/small_logo_python.png)<br/>MSAL Python| ![.NET Core](media/sample-v2-code/small_logo_NETcore.png)<br/>ASP.NET Core + MSAL.NET ![MSAL Java](media/sample-v2-code/small_logo_java.png)<br/>MSAL Java<br/>![MSAL Python](media/sample-v2-code/small_logo_python.png)<br/>MSAL Python

See also [Microsoft-supported libraries by OS / language](reference-v2-libraries.md#microsoft-supported-libraries-by-os--language).

## Next steps
Learn more about [authentication basics](authentication-scenarios.md) and [access tokens](access-tokens.md).
