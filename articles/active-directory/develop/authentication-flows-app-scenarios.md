---
title: Authentication scenarios for Microsoft identity platform | Azure
description: Learn about authentication flows and application scenarios for Microsoft identity platform. Learn about the different types of application that can authenticate identities, acquire tokens, and call protected APIs.
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.assetid: 
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/25/2019
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40
#Customer intent: As an application developer, I want to learn about authentication flows and application scenarios so I can create applications protected by the Microsoft identity platform.
ms.collection: M365-identity-device-management
---

# Authentication flows and application scenarios

The Microsoft identity platform (v2.0) endpoint supports authentication for a variety of modern app architectures, all of them based on industry-standard protocols [OAuth 2.0 or OpenID Connect](active-directory-v2-protocols.md).  Using the [authentication libraries](reference-v2-libraries.md), applications authenticate identities and acquire tokens to access protected APIs. This article describes the different authentication flows and the application scenarios that they're used in.  This article also provides lists of [application scenarios and supported authentication flows](#scenarios-and-supported-authentication-flows) and [application scenarios and supported platforms and languages](#scenarios-and-supported-platforms-and-languages).

## Application categories

Tokens can be acquired from a number of application types: Web applications, Mobile or Desktop applications, Web APIs, and application running on devices that don't have a browser (or iOT). Applications can be categorized by the following:

- [Protected resources vs client applications](#protected-resources-vs-client-applications). Some scenarios are about protecting resources (Web Apps or Web APIs) and others are about acquiring a security token to call a protected Web API.
- [With users or without users](#with-users-or-without-users). Some scenarios involve a signed-in user, whereas other don't involve a user (daemon scenarios).
- [Single page applications, Public client applications, and confidential client applications](#single-page-applications-public-client-applications-and-confidential-client-applications). These are three large categories of application types. The libraries and objects used to manipulate them will be different.
- [Sign-in audience](v2-supported-account-types.md#certain-authentication-flows-dont-support-all-the-account-types). Some authentication flows are unavailable for certain sign in audiences. Some flows are only available for Work or School accounts and some are available for both Work or School accounts and Personal Microsoft accounts. The allowed audience depends on the authentication flows.
- [Supported OAuth 2.0 flows](#scenarios-and-supported-authentication-flows).  Authentication flows are used to implement the application scenarios requesting tokens.  There is not a one-to-one mapping between application scenarios and authentication flows.
- [Supported platforms](#scenarios-and-supported-platforms-and-languages). Not all application scenarios are available for every platform.

### Protected resources vs client applications

Authentication scenarios involve two activities:

- **Acquiring security tokens** for a protected Web API. Microsoft recommends that you use [authentication libraries](reference-v2-libraries.md#microsoft-supported-client-libraries) to acquire tokens, in particular the Microsoft Authentication Libraries family (MSAL)
- **Protecting a Web API** (or a Web App). One of the challenges of protecting a resource (Web app or Web API) is to validate the security token. Microsoft offers, on some platforms, [middleware libraries](reference-v2-libraries.md#microsoft-supported-server-middleware-libraries).

### With users or without users

Most authentication scenarios acquire tokens on behalf of a (signed-in) **user**.

![scenarios with users](media/scenarios/scenarios-with-users.svg)

However there are also scenarios (daemon apps), where applications will acquire tokens on behalf of themselves (with no user).

![daemon apps](media/scenarios/daemon-app.svg)

### Single page applications, Public client applications, and confidential client applications

The security tokens can be acquired from a number of application types. Applications tend to be separated into three categories:

- **Single page applications** (SPA) are a form of Web applications where tokens are acquired from the app running in the browser (written in JavaScript or Typescript). Many modern apps have a single-page app front end that primarily is written in JavaScript. Often, the app is written by using a framework like Angular, React, or Vue. MSAL.js is the only Microsoft authentication library supporting Single Page applications.

- **Public client applications** always sign in users. These apps are:
  - Desktop applications calling Web APIs on behalf of the signed-in user.
  - Mobile applications.
  - A third category of applications, running on devices that don't have a browser (Browserless apps, running on iOT for instance).

  They're represented by the MSAL class named [PublicClientApplication](msal-client-applications.md).

- **Confidential client applications**
  - Web applications calling a Web API
  - Web APIs calling a Web API
  - Daemon applications (even when implemented as a console service like a daemon on linux, or a Windows service)
 
  These types of apps use the [ConfidentialClientApplication](msal-client-applications.md)

## Application scenarios

The Microsoft identity platform endpoint supports authentication for a variety of app architectures: single-page apps, web apps, web APIs, mobile and native apps, and daemons and server-side apps.  Applications use the various authentication flows to sign in users and get tokens to call protected APIs.

### Single-page application

Many modern web applications are built as client-side single-page applications written using JavaScript or a SPA framework such as Angular, Vue.js, and React.js. These applications run in a web browser and have different authentication characteristics than traditional server-side web applications. The Microsoft identity platform enables single-page applications to sign in users and get tokens to access backend services or web APIs.

![Single-page application](media/scenarios/spa-app.svg)

For more information, read [Single-page applications](scenario-spa-overview.md).

### Web Application signing-in a user

![Web app signs in users](media/scenarios/scenario-webapp-signs-in-users.svg)

To **protect a Web App** (signing in the user), you'll use:

- In the .NET world, ASP.NET or ASP.NET Core with the ASP.NET Open ID Connect middleware. Under the hood, protecting a resource involves validating the security token, which is done by the [IdentityModel extensions for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/wiki) library, not MSAL libraries

- If you develop in Node.js, you'll use Passport.js.

For more information, read [Web App that signs-in users](scenario-web-app-sign-user-overview.md).

### Web Application signing-in a user and calling a Web API on behalf of the user

![Web app calls Web APIs](media/scenarios/web-app.svg)

From the Web App, to **call the Web API** on behalf of the user, use MSAL `ConfidentialClientApplication`. You'll use the Authorization code flow, storing the acquired token in the token cache. Then the controller will acquire tokens silently from the cache when needed. MSAL refreshes the token if needed.

For more information, read  [Web App calls Web APIs](scenario-web-app-call-api-overview.md).

### Desktop application calling a Web API on behalf of the signed-in user

To call a Web API from a desktop application that signs in users, use MSAL's PublicClientApplication's interactive token acquisition methods. These interactive methods enable you to control the sign in UI experience. To enable this interaction, MSAL leverages a web browser.

![Desktop](media/scenarios/desktop-app.svg)

For Windows hosted applications running on computers joined to a Windows domain or AAD joined, there's another possibility. These applications can acquire a token silently by using [Integrated Windows Authentication](https://aka.ms/msal-net-iwa).

Applications running on a device without a browser will still be able to call an API on behalf of a user. To authenticate, the user will have to sign in on another device that has a Web browser. To enable this scenario, you'll need to use the [Device Code flow](https://aka.ms/msal-net-device-code-flow)

![Device code flow](media/scenarios/device-code-flow-app.svg)

Finally, though it's not recommended, you can use [Username/Password](https://aka.ms/msal-net-up) in public client applications. This flow is still needed in some scenarios (like DevOps), but beware that using it will impose constraints on your application. For instance, apps using this flow won't be able to sign in a user who needs to perform multi-factor authentication (conditional access). It won't enable your application to benefit from single sign-on either. Authentication with username/password goes against the principles of modern authentication and is only provided for legacy reasons.

In desktop applications, if you want the token cache to be persistent, you should [customize the token cache serialization](https://aka.ms/msal-net-token-cache-serialization). You can even enable backward and forward compatible token caches with previous generations of authentication libraries (ADAL.NET 3.x and 4.x) by implementing [dual token cache serialization](https://aka.ms/msal-net-dual-cache-serialization).

For more information, read [Desktop app that calls web APIs](scenario-desktop-overview.md).

### Mobile application calling a Web API on behalf of the user who's signed-in interactively

Similar to desktop applications, a mobile application will use MSAL's PublicClientApplication's interactive token acquisition methods to acquire a token to call a Web API.

![Mobile](media/scenarios/mobile-app.svg)

MSAL iOS and MSAL Android, by default, use the system web browser. However, you can also direct it to use the embedded Web View. There are specificities depending on the mobile platform: (UWP, iOS, Android).

Some scenarios, involving conditional access related to the device ID, or a device being enrolled require a [broker](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/leveraging-brokers-on-Android-and-iOS) to be installed on a device. Examples of brokers are Microsoft Company portal (on Android), Microsoft Authenticator (Android and iOS). MSAL is now capable of interacting with brokers.

> [!NOTE]
> Your mobile app (using MSAL.iOS, MSAL.Android, or MSAL.NET/Xamarin) can have app protection policies applied to it (for instance prevent the user to  copy some protected text). This is [managed by Intune](https://docs.microsoft.com/intune/app-sdk) and recognized by Intune as a managed app. The [Intune SDK](https://docs.microsoft.com/intune/app-sdk-get-started) is separate from MSAL libraries, and it talks to AAD on its own.

For more information, read [Mobile app that calls web APIs](scenario-mobile-overview.md).

### Protected Web API

You can use the Microsoft identity platform endpoint to secure web services, such as your app's RESTful Web API. A protected Web API is called with an access token to secure its data and to authenticate incoming requests. The caller of a Web API appends an access token in the authorization header of an HTTP request. If you want to protect your ASP.NET or ASP.NET Core Web API, you will need to validate the access token. For this, you'll use the ASP.NET JWT middleware. Under the hood, the validation is done by the [IdentityModel extensions for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/wiki) library, not MSAL.NET

For more information, read [Protected Web API](scenario-protected-web-api-overview.md).

### Web API calling another downstream Web API on behalf of the user for whom it was called

If, moreover, you want your ASP.NET or ASP.NET Core protected Web API to call another Web API on behalf of the user, the app will need to acquire a token for the downstream Web API by using the ConfidentialClientApplication's method Acquiring a token on [behalf of a user](https://aka.ms/msal-net-on-behalf-of). This is also named service to services calls.
The Web APIs calling other web API will also need to provide a custom cache serialization

  ![Web API](media/scenarios/web-api.svg)

For more information, read [Web API that calls web APIs](scenario-web-api-call-api-overview.md).

### Desktop/service or Web daemon application calling Web API without a user (in its own name)

Apps that have long-running processes or that operate without user interaction also need a way to access secured Web APIs. These apps can authenticate and get tokens by using the app's identity, rather than a user's delegated identity. They prove their identity using a client secret or certificate.
You can write such apps (daemon app) acquiring a token for the app on top using MSAL's ConfidentialClientApplication's [client credentials](https://aka.ms/msal-net-client-credentials) acquisition methods. These suppose that the app has previously registered a secret (application password or certificate or client assertion) with Azure AD, which it then shares with this call.

![Daemon app](media/scenarios/daemon-app.svg)

For more information, read [Daemon application that calls web APIs](scenario-daemon-overview.md).

## Scenarios and supported authentication flows

Scenarios that involve acquiring tokens also map to OAuth 2.0 authentication flows described in details in [Microsoft identity platform protocols](active-directory-v2-protocols.md)

|Scenario | Detailed Scenario walk-through | OAuth 2.0 Flow/Grant | Audience |
|--|--|--|--|
| [![Single Page App](media/scenarios/spa-app.svg)](scenario-spa-overview.md) | [Single-page app](scenario-spa-overview.md) | [Implicit](v2-oauth2-implicit-grant-flow.md) | Work or  School accounts and Personal accounts, B2C
| [![Web App that signs-in users](media/scenarios/scenario-webapp-signs-in-users.svg)](scenario-web-app-sign-user-overview.md) | [Web App that signs in users](scenario-web-app-sign-user-overview.md) | [Authorization Code](v2-oauth2-auth-code-flow.md) | Work or  School accounts and Personal accounts, B2C |
| [![Web App that calls Web APIs](media/scenarios/web-app.svg)](scenario-web-app-call-api-overview.md) | [Web App that calls web APIs](scenario-web-app-call-api-overview.md) | [Authorization Code](v2-oauth2-auth-code-flow.md) | Work or  School accounts and Personal accounts, B2C |
| [![Desktop app that calls web APIs](media/scenarios/desktop-app.svg)](scenario-desktop-overview.md) | [Desktop app that calls web APIs](scenario-desktop-overview.md)| Interactive ([Authorization Code](v2-oauth2-auth-code-flow.md) with PKCE) | Work or School accounts and Personal accounts, B2C |
| | | Integrated Windows | Work or School accounts |
| | | [Resource Owner Password](v2-oauth-ropc.md)  | Work or School accounts, B2C |
| ![Device code flow](media/scenarios/device-code-flow-app.svg)| [Desktop app that calls web APIs](scenario-desktop-overview.md) | [Device Code](v2-oauth2-device-code.md)  | Work or School accounts* |
| [![Mobile app that calls web APIs](media/scenarios/mobile-app.svg)](scenario-mobile-overview.md) | [Mobile app that calls web APIs](scenario-mobile-overview.md) | Interactive  ([Authorization Code](v2-oauth2-auth-code-flow.md) with PKCE)  |   Work or School accounts and Personal accounts, B2C
| | | Resource Owner Password  | Work or School accounts, B2C |
| [![Daemon app](media/scenarios/daemon-app.svg)](scenario-daemon-overview.md) | [Daemon app](scenario-daemon-overview.md) | [Client credentials](v2-oauth2-client-creds-grant-flow.md)  |   App only permissions (no user) only on AAD Organizations
| [![Web API that calls web APIs](media/scenarios/web-api.svg)](scenario-web-api-call-api-overview.md) | [Web API that calls web APIs](scenario-web-api-call-api-overview.md)| [On Behalf Of](v2-oauth2-on-behalf-of-flow.md) | Work or School accounts and Personal accounts |

## Scenarios and supported platforms and languages

Not every application type is available on every platform. You can also use various languages to build your applications. Microsoft Authentication libraries support a number of **platforms** (JavaScript, .NET Framework, .NET Core, Windows 10/UWP, Xamarin.iOS, Xamarin.Android, native iOS, native Android, Java, Python)

|Scenario  | Windows | Linux | Mac | iOS | Android
|--|--|--|--|--|--|--|
| [Single-page app](scenario-spa-overview.md) <br/>[![Single Page App](media/scenarios/spa-app.svg)](scenario-spa-overview.md) | ![MSAL.js](media/sample-v2-code/logo_js.png) MSAL.js | ![MSAL.js](media/sample-v2-code/logo_js.png) MSAL.js | ![MSAL.js](media/sample-v2-code/logo_js.png) MSAL.js | ![MSAL.js](media/sample-v2-code/logo_js.png) MSAL.js | ![MSAL.js](media/sample-v2-code/logo_js.png) MSAL.js
| [Web App that signs in users](scenario-web-app-sign-user-overview.md) <br/>[![Web App that signs-in users](media/scenarios/scenario-webapp-signs-in-users.svg)](scenario-web-app-sign-user-overview.md) | ![ASP.NET](media/sample-v2-code/logo_NET.png)</br> ASP.NET ![ASP.NET Core](media/sample-v2-code/logo_NETcore.png)ASP.NET Core | ![ASP.NET Core](media/sample-v2-code/logo_NETcore.png)ASP.NET Core | ![ASP.NET Core](media/sample-v2-code/logo_NETcore.png)ASP.NET Core
| [Web App that calls web APIs](scenario-web-app-call-api-overview.md) <br/> [![Web App that calls Web APIs](media/scenarios/web-app.svg)](scenario-web-app-call-api-overview.md) | ![ASP.NET](media/sample-v2-code/logo_NET.png) </br> ASP.NET + MSAL.NET </br> ![ASP.NET Core](media/sample-v2-code/logo_NETcore.png)ASP.NET Core + MSAL.NET ![MSAL Java](media/sample-v2-code/logo_java.png) msal4j ![MSAL Python](media/sample-v2-code/logo_python.png) Flask + MSAL Python| ![ASP.NET Core](media/sample-v2-code/logo_NETcore.png)ASP.NET Core + MSAL.NET ![MSAL Java](media/sample-v2-code/logo_java.png) msal4j ![MSAL Python](media/sample-v2-code/logo_python.png) Flask + MSAL Python| ![ASP.NET Core](media/sample-v2-code/logo_NETcore.png)ASP.NET Core + MSAL.NET ![MSAL Java](media/sample-v2-code/logo_java.png) msal4j ![MSAL Python](media/sample-v2-code/logo_python.png) Flask + MSAL Python
| [Desktop app that calls web APIs](scenario-desktop-overview.md) <br/> [![Desktop app that calls web APIs](media/scenarios/desktop-app.svg)](scenario-desktop-overview.md) ![Device code flow](media/scenarios/device-code-flow-app.svg) | ![MSAL.NET](media/sample-v2-code/logo_NET.png)  MSAL.NET ![.NET Core](media/sample-v2-code/logo_NETcore.png) MSAL.NET ![MSAL Java](media/sample-v2-code/logo_java.png) msal4j ![MSAL Python](media/sample-v2-code/logo_python.png) MSAL Python| ![.NET Core](media/sample-v2-code/logo_NETcore.png)MSAL.NET ![MSAL Java](media/sample-v2-code/logo_java.png) msal4j ![MSAL Python](media/sample-v2-code/logo_python.png) MSAL Python| ![.NET Core](media/sample-v2-code/logo_NETcore.png) MSAL.NET ![MSAL Java](media/sample-v2-code/logo_java.png) msal4j ![MSAL Python](media/sample-v2-code/logo_python.png) MSAL Python
| [Mobile app that calls web APIs](scenario-mobile-overview.md) <br/> [![Mobile app that calls web APIs](media/scenarios/mobile-app.svg)](scenario-mobile-overview.md) | ![UWP](media/sample-v2-code/logo_windows.png) MSAL.NET ![Xamarin](media/sample-v2-code/logo_xamarin.png) MSAL.NET | | | ![iOS / Objective C or swift](media/sample-v2-code/logo_iOS.png) MSAL.iOS | ![Android](media/sample-v2-code/logo_Android.png) MSAL.Android
| [Daemon app](scenario-daemon-overview.md) <br/> [![Daemon app](media/scenarios/daemon-app.svg)](scenario-daemon-overview.md) | ![.NET](media/sample-v2-code/logo_NET.png) MSAL.NET ![.NET Core](media/sample-v2-code/logo_NETcore.png)MSAL.NET ![MSAL Java](media/sample-v2-code/logo_java.png) msal4j ![MSAL Python](media/sample-v2-code/logo_python.png) MSAL Python| ![.NET Core](media/sample-v2-code/logo_NETcore.png) MSAL.NET ![MSAL Java](media/sample-v2-code/logo_java.png) msal4j ![MSAL Python](media/sample-v2-code/logo_python.png) MSAL Python| ![.NET Core](media/sample-v2-code/logo_NETcore.png)MSAL.NET ![MSAL Java](media/sample-v2-code/logo_java.png) msal4j ![MSAL Python](media/sample-v2-code/logo_python.png) MSAL Python
| [Web API that calls web APIs](scenario-web-api-call-api-overview.md) <br/> [![Web API that calls web APIs](media/scenarios/web-api.svg)](scenario-web-api-call-api-overview.md) | ![.NET](media/sample-v2-code/logo_NET.png) MSAL.NET ![.NET Core](media/sample-v2-code/logo_NETcore.png)MSAL.NET ![MSAL Java](media/sample-v2-code/logo_java.png) msal4j ![MSAL Python](media/sample-v2-code/logo_python.png) MSAL Python| ![.NET Core](media/sample-v2-code/logo_NETcore.png) MSAL.NET ![MSAL Java](media/sample-v2-code/logo_java.png) msal4j ![MSAL Python](media/sample-v2-code/logo_python.png) MSAL Python| ![.NET Core](media/sample-v2-code/logo_NETcore.png)MSAL.NET ![MSAL Java](media/sample-v2-code/logo_java.png) msal4j ![MSAL Python](media/sample-v2-code/logo_python.png) MSAL Python

See also [Microsoft-supported libraries by OS / language](reference-v2-libraries.md#microsoft-supported-libraries-by-os--language)

## Next steps
Learn more about [authentication basics](authentication-scenarios.md) and [access tokens](access-tokens.md).
