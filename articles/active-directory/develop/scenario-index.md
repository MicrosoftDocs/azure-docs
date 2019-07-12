# Authentication scenarios overview

## Introduction - several axes to understand authentication scenarios

Authentication scenarios can be classified along several axes:

- [Protected resources vs client applications](#protected-resources-vs-client-applications): Some scenarios are about protecting resources (Web Apps or Web APIs), whereas others are about acquiring a security token to call a protected Web API.
- [With users or without users](#with-users-or-without-users): Some scenarios involve a signed-in user, whereas other don't involve a user (daemon scenarios)
- [Single page applications, Public client applications, and confidential client applications](single-page-applications--public-client-applications-and-confidential-client-applications): are three large categories of application types. The libraries and objects used to manipulate them will be different. Scenarios and application types don't map one to one.
- [OAuth 2.0 flows](active-directory-v2-protocols.md) are used to implement the scenarios requesting tokens, but they don't form a one to one mapping either.
- [Audience](#audience): Not all the scenarios are available for all the [sign in audiences](v2-supported-account-types). Some are only available for Work or School accounts, some are available for both Work or School accounts and Personal Microsoft accounts. Audience is aligned with authentication flows.
- [Supported platforms](supported-platforms): Not all the scenarios are available for every platform

### Protected resources vs client applications

Authentication scenarios involve two activities:

- **Acquiring security tokens** for a protected Web API. Microsoft recommends that you use [authentication libraries](reference-v2-libraries#microsoft-supported-client-libraries.md) to acquire tokens, in particular the MicroSoft Authentication Libraries family (MSAL)
- **Protecting a Web API** (or a Web App). One of the challenges of protecting a resource (Web app or Web API) is to validate the security token. Microsoft offers, on some platforms, |[middleware libraries](reference-v2-libraries.md#microsoft-supported-server-middleware-libraries).

### With users or without users

Most authentication scenarios acquire tokens on behalf of a (signed-in) **user**.

![scenarios with users](media/scenarios/scenarios-with-users.svg))

However there are also scenarios (daemon apps), where applications will acquire tokens on behalf of themselves(with no user)

![daemon apps](media/scenarios/daemon-app.svg)

### Single page applications, Public client applications, and confidential client applications

The security tokens can be acquired from a number of application types. Applications tend to be separated into three categories:

- **Single page applications** (SPA) are a form of Web applications where tokens are acquired from the app running in the browser (written in JavaScript or Typescript). The only Microsoft authentication library supporting Single Page applications is MSAL.js.

  ![SPA](media/scenarios/spa-app.svg)

- **Public client applications** always sign in users. These apps are:
  - Desktop applications calling Web APIs on behalf of the signed-in user
  - Mobile applications
  - A third category of applications, running on devices that don't have a browser (Browserless apps, running on iOT for instance).

    ![Desktop app](media/msal-client-applications/desktop-app.png) ![Browserless API](media/msal-client-applications/browserless-app.png) ![Mobile app](media/msal-client-applications/mobile-app.png)

  They're represented by the MSAL class named [PublicClientApplication](msal-client-applications.md).

- **Confidential client applications**
  - Web applications calling a Web API
  - Web APIs calling a Web API
  - Daemon applications (even when implemented as a console service like a daemon on linux, or a Windows service)

    ![Web app](media/msal-client-applications/web-app.png) ![Web API](media/msal-client-applications/web-api.png) ![Daemon/service](media/msal-client-applications/daemon-service.png)
  
  These types of apps use the [ConfidentialClientApplication](msal-client-applications.md)

## Scenarios - details

Let's discover the scenarios in more details

### Web Application signing-in a user

![image](media/scenarios/scenario-webapp-signs-in-users.svg)

To **protect a Web App** (signing in the user), you'll use:

- In the .NET world, ASP.NET or ASP.NET Core with the ASP.NET Open ID Connect middleware. Under the hood, protecting a resource involves validating the security token, which is done by the [IdentityModel extensions for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/wiki) library, not MSAL libraries

- If you develop in Node.js, you'll use Passport.js.

See [Web App that signs-in users](scenario-web-app-sign-user-overview.md) for details

### Web Application signing-in a user and calling a Web API on behalf of the user

![image](media/scenarios/web-app.svg)

To **call the Web API** on behalf of the user, from the Web App, you'll use MSAL ConfidentialClientApplication, leveraging the Authorization code flow, then storing the acquired token in the token cache. Then the controller will acquire tokens silently from the cache when needed. MSAL refreshes the token if needed.

For details, see [Web App calls Web APIs](scenario-web-app-call-api-overview.md)

### Desktop application calling a Web API on behalf of the signed-in user

To call a Web API from a desktop application that signs-in users, you'll use MSAL's PublicClientApplication's interactive token acquisition methods. These interactive methods enable you to control the sign in UI experience. To enable this interaction, MSAL leverages a web browser

![image](media/scenarios/desktop-app.svg)

For Windows hosted applications running on computers joined to a Windows domain or AAD joined, there's another possibility. They can acquire a token silently by using [Integrated Windows Authentication](https://aka.ms/msal-net-iwa)

Applications running on a device without a browser will still be able to call an API on behalf of a user. For this the user will have to sign in on another device that has a Web browser. For this, you'll need to use the [Device Code flow](https://aka.ms/msal-net-device-code-flow)

![image](media/scenarios/device-code-flow-app.svg)

Finally, and although it's not recommended, you can use [Username/Password](https://aka.ms/msal-net-up) in public client applications. It's still needed in some scenarios (like DevOps), but beware that using it will impose constraints on your application. For instance, it won't be able to sign in user who needs to perform Multi Factor Authentication (conditional access). It won't enable your application to benefit from Single Sign On either. It's also against the principles of modern authentication and is only provided for legacy reasons.

In desktop applications, if you want the token cache to be persistent, you should [customize the token cache serialization](https://aka.ms/msal-net-token-cache-serialization). You can even enable backward and forward compatible token caches with previous generations of authentication libraries (ADAL.NET 3.x and 4.x) by implementing [dual token cache serialization](https://aka.ms/msal-net-dual-cache-serialization).

See [Desktop app that calls web APIs](scenario-desktop-overview.md) for details

### Mobile application calling a Web API on behalf of the user who's signed-in interactively

![image](media/scenarios/mobile-app.svg)

Like for desktop applications, to acquire a token to call a Web AP, a mobile application will use MSAL's PublicClientApplication's interactive token acquisition methods. On iOS and Android, MSAL, by default, uses the system web browser. But you can direct it to use the embedded Web View. There are specificities depending on the mobile platform: (UWP, iOS, Android).
Some scenarios, involving conditional access related to the device id, or a device being enrolled require a [broker](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/leveraging-brokers-on-Android-and-iOS) (Microsoft Company portal or Microsoft Authenticator) to be installed on a device. MSAL is now capable of interacting with these brokers.

> [!NOTE]
> Your mobile app (using MSAL.iOS, MSAL.Android, or MSAL.NET/Xamarin) can have app protection policies applied to it (for instance prevent the user to  copy some protected text). This is [managed by Intune](https://docs.microsoft.com/en-gb/intune/app-sdk) and recognized by Intune as a managed app. The [Intune SDK](https://docs.microsoft.com/en-gb/intune/app-sdk-get-started) is separate from MSAL libraries, and it talks to AAD on its own.

See [Mobile app that calls web APIs](scenario-mobile-overview.md) for details

### Web API calling another downstream Web API on behalf of the user for whom it was called

If you want your ASP.NET or ASP.NET Core protected Web API to call another Web API on behalf of the user represented by the access token used to call you API, you will need to:

- validate the token. For this, you'll use the ASP.NET JWT middleware. Under the hood. This also involves validating the token that is done by the [IdentityModel extensions for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/wiki) library, not MSAL.NET

  See [Protected Web API](scenario-protected-web-api-overview.md) for details

- then you'll need to acquire a token for the downstream Web API by using the ConfidentialClientApplication's method Acquiring a token on [behalf of a user](https://aka.ms/msal-net-on-behalf-of) in Service to Services calls.
- Web APIs calling other web API will also need to provide a custom cache serialization

  ![image](media/scenarios/web-api.svg)

See [Web API that calls web APIs](scenario-web-api-calls-api-overview.md) for details

### Desktop/service or Web daemon application calling Web API without a user (in its own name)

You can write a daemon app acquiring a token for the app on top using MSAL's ConfidentialClientApplication's [client credentials](https://aka.ms/msal-net-client-credentials) acquisition methods. These suppose that the app has previously registered a secret (application password or certificate or client assertion) with Azure AD, which it then shares with this call.

![image](media/scenarios/daemon-app.svg)

## Summary

### Scenarios and supported authentication flows

Scenarios that involve acquiring tokens also map to OAuth 2.0 authentication flows described in details in [Microsoft identity platform protocols](active-directory-v2-protocols.md)

|Scenario | Detailed Scenario walk-through | OAuth 2.0 Flow/Grant | Audience |
|--|--|--|--|
| [![Single Page App](media/scenarios/spa-app.svg)](scenario-spa-overview.md) | [Single-page app](scenario-spa-overview.md) | [Implicit](v2-oauth2-implicit-grant-flow.md) | Work or  School accounts and Personal accounts, B2C
| [![Web App that signs-in users](media/scenarios/scenario-webapp-signs-in-users.svg)](scenario-web-app-sign-user-overview.md) | [Web App that signs in users](https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-web-app-sign-user-overview) | [Authorization Code](v2-oauth2-auth-code-flow) | Work or  School accounts and Personal accounts, B2C |
| [![Web App that calls Web APIs](media/scenarios/web-app.svg)](scenario-web-app-call-api-overview.md) | [Web App that calls web APIs](scenario-web-app-call-api-overview.md) | [Authorization Code](v2-oauth2-auth-code-flow) | Work or  School accounts and Personal accounts, B2C |
| [![Desktop app that calls web APIs](media/scenarios/desktop-app.svg)](scenario-desktop-overview.md) | [Desktop app that calls web APIs](scenario-desktop-overview.md)| Interactive ([Authorization Code](v2-oauth2-auth-code-flow) with PKCE) | Work or School accounts and Personal accounts, B2C |
| | | Integrated Windows | Work or School accounts |
| | | [Resource Owner Password](v2-oauth-ropc.md)  | Work or School accounts, B2C |
| | | [Device Code](v2-oauth2-device-code.md)  | Work or School accounts* |
| [![Mobile app that calls web APIs](media/scenarios/mobile-app.svg)](scenario-mobile-overview.md) | [Mobile app that calls web APIs](scenario-mobile-overview.md) | Interactive  (A[Authorization Code](v2-oauth2-auth-code-flow) with PKCE)  |   Work or School accounts and Personal accounts, B2C
| | | Resource Owner Password  | Work or School accounts, B2C |
| [![Daemon app](media/scenarios/daemon-app.svg)](scenario-daemon-overview.md) | [Daemon app ](scenario-daemon-overview.md) | [Client credentials](v2-oauth2-client-creds-grant-flow)  |   App only permissions (no user) only on AAD Organizations
| [![Web API that calls web APIs](media/scenarios/web-api.svg)](scenario-web-api-call-api-overview.md) | [Web API that calls web APIs](scenario-web-api-call-api-overview.md)| [On Behalf Of](v2-oauth2-on-behalf-of-flow.md) | Work or School accounts and Personal accounts |

### Scenarios and supported platforms and languages

Not every application type is available on every platform. You can also use various languages to build your applications. Microsoft Authentication libraries support a number of **platforms** (JavaScript, .NET Framework, .NET Core, Windows 10/UWP, Xamarin.iOS, Xamarin.Android, native iOS, native Android, Java, Python)

|Scenario | Detailed Scenario walk-through | Windows | Linux | Mac | iOS | Android
|--|--|--|--|--|--|--|
| [![Single Page App](media/scenarios/spa-app.svg)](scenario-spa-overview.md) | [Single-page app](scenario-spa-overview.md) | ![MSAL.js](media/sample-v2-code/logo_js.png) MSAL.js | ![MSAL.js](media/sample-v2-code/logo_js.png)MSAL.js | ![MSAL.js](media/sample-v2-code/logo_js.png)MSAL.js | ![JavaScript](media/sample-v2-code/logo_js.png) | ![MSAL.js](media/sample-v2-code/logo_js.png)MSAL.js
| [![Web App that signs-in users](media/scenarios/scenario-webapp-signs-in-users.svg)](scenario-web-app-sign-user-overview.md) | [Web App that signs in users](https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-web-app-sign-user-overview) | ![ASP.NET](media/sample-v2-code/logo_NET.png)ASP.NET ![ASP.NET Core](media/sample-v2-code/logo_NETcore.png)ASP.NET Core | ![ASP.NET Core](media/sample-v2-code/logo_NETcore.png)ASP.NET Core | ![ASP.NET Core](media/sample-v2-code/logo_NETcore.png)ASP.NET Core
| [![Web App that calls Web APIs](media/scenarios/web-app.svg)](scenario-web-app-call-api-overview.md) | [Web App that calls web APIs](scenario-web-app-call-api-overview.md) | ![ASP.NET Core](media/sample-v2-code/logo_NETcore.png)ASP.NET Core + MSAL.NET | ![ASP.NET Core](media/sample-v2-code/logo_NETcore.png)ASP.NET Core + MSAL.NET | ![ASP.NET Core](media/sample-v2-code/logo_NETcore.png)ASP.NET Core + MSAL.NET
| [![Desktop app that calls web APIs](media/scenarios/desktop-app.svg)](scenario-desktop-overview.md) | [Desktop app that calls web APIs](scenario-desktop-overview.md)| ![.NET](media/sample-v2-code/logo_NET.png) ![.NET Core](media/sample-v2-code/logo_NETcore.png) MSAL.NET | ![.NET Core](media/sample-v2-code/logo_NETcore.png)MSAL.NET | ![.NET Core](media/sample-v2-code/logo_NETcore.png) MSAL.NET
| [![Mobile app that calls web APIs](media/scenarios/mobile-app.svg)](scenario-mobile-overview.md) | [Mobile app that calls web APIs](scenario-mobile-overview.md) | ![UWP](media/sample-v2-code/logo_windows.png) ![Xamarin](media/sample-v2-code/logo_xamarin.png) MSAL.NET | | | ![iOS / Objective C or swift](media/sample-v2-code/logo_iOS.png) MSAL.iOS | ![Android](media/sample-v2-code/logo_Android.png) MSAL.Android
| [![Daemon app](media/scenarios/daemon-app.svg)](scenario-daemon-overview.md) | [Daemon app ](scenario-daemon-overview.md) | ![.NET](media/sample-v2-code/logo_NET.png)![.NET Core](media/sample-v2-code/logo_NETcore.png)MSAL.NET | ![.NET Core](media/sample-v2-code/logo_NETcore.png) MSAL.NET| ![.NET Core](media/sample-v2-code/logo_NETcore.png)MSAL.NET
| [![Web API that calls web APIs](media/scenarios/web-api.svg)](scenario-web-api-call-api-overview.md) | [Web API that calls web APIs](scenario-web-api-call-api-overview.md)| ![.NET](media/sample-v2-code/logo_NET.png)![.NET Core](media/sample-v2-code/logo_NETcore.png) MSAL.NET| ![.NET Core](media/sample-v2-code/logo_NETcore.png) MSAL.NET| ![.NET Core](media/sample-v2-code/logo_NETcore.png)MSAL.NET