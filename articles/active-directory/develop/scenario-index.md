# Authentication scenarios overview

## Introduction - several axes to understand authentication scenarios

Authentication scenarios can be classified along several axes:

- [Protected resources vs client applications](#protected-resources-vs-client-applications): Some scenarios are about protecting a Web App or a Web API, whereas others are about acquiring a security token to call a protected Web API.
- Some scenarios involve a signed-in user, whereas other don't involve a user (daemon scenarios)
- Scenarios can be splatted as a function of the application type they involve. Sometimes some scenarios apply to several application types, and some appplication types can be applies several scenarios.

### Protected resources vs client applications

Authentication scenarios involve two activities:

- **Acquiring security tokens** for a protected Web API. Microsoft recommends that you use authentication libraries to acquire tokens, in particular the MicroSoft Authentication Libraries family (MSAL)
- **Protecting a Web API** (or a Web App). One of the challenges of protecting a resource (Weeb app or Web API) is to validate the security token. Microsoft offers, on some platforms, middleware libraries.

### With users or without users

Most authentication scenarios acquire tokens on behalf of a (signed-in) **user**.

![scenarios with users](media/scenarios/scenarios-with-users.svg))

However there are also scenarios (daemon apps), where applications will acquire tokens on behalf of themselves( with no user)

![daemon apps](media/scenarios/daemon-app.svg)

### Public client applications vs confidential client applications

The security tokens can be acquired from a number of application types. Applications tend to be separated into three categories:

- Single page applications (SPA) which are a form of Web applications where tokens are acquired from the app running in the browser.
- Public client applications always sign-in users. These are:
  - Desktop applications
  - Mobile applications
  - Application running on devices that don't have a browser (iOT for instance).
  They are represented by the MSAL class named [PublicClientApplication](msal-client-applications.md).
- Confidential client applications 
  - Web applications
  - Web APIs,
  - Daemon applications (even when implemented as a console service like a daemon on linux, or a Windows service)
  These type of apps use the [ConfidentialClientApplication](msal-client-applications.md)

### Supported platforms

Not every application type is available on every platform. Microsoft Authentication libraries support a number of **platforms** (JavaScript, .NET Framework, .NET Core, Windows 10/UWP, Xamarin.iOS, Xamarin.Android, native iOS, native Android, Java, Python).

## Scenarios - details

Let's discover the scenarios in more details

### Web Application signing-in a user

![image](media/scenarios/scenario-webapp-signs-in-users.svg)

To **protect a Web App** (signing in the user), you'll use:

- ASP.NET or ASP.NET Core with the ASP.NET Open ID Connect middleware. Under the hood. This involves validating the token, which is done by the [IdentityModel extensions for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/wiki) library, not MSAL libaries
- Passport.js.

See [Web App that signs-in users](scenario-web-app-sign-user-overview.md) for details

### Web Application signing-in a user and calling a Web API on behalf of the user

![image](media/scenarios/web-app.svg)

To **call the Web API** on behalf of the user from the Web App you'll use MSAL ConfidentialClientApplication, leveraging the [Authorization code flow](Acquiring-tokens-with-authorization-codes-on-web-apps), then storing the acquired token in the token cache, and [acquiring silently a token](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/AcquireTokenSilentAsync-using-a-cached-token#recommended-call-pattern-in-web-apps-using-the-authorization-code-flow-to-authenticate-the-user) from the cache when needed. MSAL refreshes the token if needed.

For details, see [Web App calls Web APIs](scenario-web-app-call-api-overview.md)

### Desktop application calling a Web API on behalf of the signed-in user

Desktop applications can use the same [interactive authentication](https://aka.ms/msal-net-acquire-token-interactively) as the [mobile applications](#mobile-application-calling-a-web-api-in-the-name-of-the-user-whos-signed-in-interactively). 

![image](media/scenarios/desktop-app.svg)

For Windows hosted applications, it's also possible for applications running on computers joined to a Windows domain or AAD joined to acquire a token silently by using [Integrated Windows Authentication](https://aka.ms/msal-net-iwa)

If your desktop application is does not have a web browser, the best option in that case is to use device code flow (See [Application without a browser, or iOT application calling an API in the name of the user](#application-without-a-browser-or-iot-application-calling-an-api-in-the-name-of-the-user)) below

Finally, and although it's not recommended, you can use [Username/Password](https://aka.ms/msal-net-up) in public client applications; It's still needed in some scenarios (like DevOps), but beware that using it will impose constraints on your application. For instance it won't be able to sign-in user who need to perform Multi Factor Authentication (conditional access) and it won't enable your application to benefit from Single Sign On. It's also against the principles of modern authentication and is only provided for legacy reasons.

In desktop applications, if you want the token cache to be persistent, you should [customize the token cache serialization](https://aka.ms/msal-net-token-cache-serialization). You can even enable backward and forward compatible token caches with ADAL.NET 3.x and 4.x by implementing [dual token cache serialization](https://aka.ms/msal-net-dual-cache-serialization).

### Mobile application calling a Web API on behalf of the user who's signed-in interactively

![image](media/scenarios/mobile-app.svg)

To call a Web API from a mobile application, you will use MSAL's PublicClientApplication's [interactive](Acquiring-tokens-interactively) token acquisition methods. These interactive methods enable you to control the [sign-in UI experience](Acquiring-tokens-interactively#controlling-the-interactivity-with-the-user-with-the-behavior-parameter-uibehavior), as well as the [location](#controlling-the-location-of-the-dialog-with-the-parent-parameters-uiparent) of the interactive dialog on some platforms.
To enable this interaction, MSAL.NET leverages a [web browser](MSAL.NET-uses-web-browser). There are specificities depending on the mobile platform [UWP](uwp-specificities), [iOS](Xamarin-ios-specificities), [Android](Xamarin-android-specificities)). On iOS and Android, you can even [choose](MSAL.NET-uses-web-browser#by-default-msalnet-supports-a-system-web-browser-on-xamarinios-and-xamarinandroid) if you want to leverage the system browser (the default), or an embedded web browser. You can enable some kind of token cache sharing on iOS

> [!NOTE]
> Some scenarios, involving conditional access related to the device id, or a device being enrolled require a *broker* (Microsoft Company portal or Microsoft Authenticator) to be installed on a device. MSAL is now capable of interacting with these brokers.
>
> Your mobile app (written in Xamarin.iOS or Xamarin.Android) can have app protection policies applied to it (for instance prevent the user to  copy some protected text). This is [managed by Intune](https://docs.microsoft.com/en-gb/intune/app-sdk) and recognized by Intune as a managed app. The [Intune SDK](https://docs.microsoft.com/en-gb/intune/app-sdk-get-started) is separate from MSAL libraries, and it talks to AAD on its own.


### Application without a browser, or iOT application calling an API in the name of the user 

Applications running on a device without a browser will still be able to call an API in the name of a user, after having the user sign-in on another device which has a Web browser. For this you'll need to use the [Device Code flow](Device-Code-Flow)

![image](media/scenarios/device-code-flow-app.svg)

### Web API calling another downstream Web API on behalf of the user for whom it was called

If you want your ASP.NET or ASP.NET Core protected Web API to call another Web API on behalf of the user represented by the access token was used to call you API, you will need to:
- validate the token. For this you'll use the ASP.NET JWT middleware. Under the hood. This also involves validating the token which is done by the [IdentityModel extensions for .NET](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/wiki) library, not MSAL.NET
- then you will need to acquire a token for the downstream Web API by using the ConfidentialClientApplication's method Acquiring a token on [behalf of a user](on-behalf-of) in Service to Services calls.
- Web APIs calling other web API will also need to provide a [custom cache serialization](token-cache-serialization#token-cache-for-a-web-app-confidential-client-application)

  ![image](media/scenarios/web-api.svg)

### Desktop/service or Web daemon application calling Web API without a user (in its own name)

You can write a daemon app acquiring a token for the app on top using MSAL's ConfidentialClientApplication's [client credentials](Client-credential-flows) acquisition methods. These suppose that the app has previously registered a secret (application password or certificate) with Azure AD, which it then shares with this call.

![image](media/scenarios/daemon-app.svg)

#### Web API calling another API in its own name.

like in the case of a desktop/service daemon application, a daemon Web API (or a daemon Web App) can use MSAL.NET's ConfidentialClientApplication's [client credentials](Client-credential-flows) acquisition methods

### Transverse features

In all the scenarios you might want to:

- troubleshoot yourself by activating [logs](logging) or Telemetry
- understand how to react to [exceptions](exceptions#exceptions-in-msalnet) due to the Azure AD service [MsalServiceException](https://docs.microsoft.com/en-us/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet-preview#fields), or to something wrong happening in the client itself [MsalClientException](https://docs.microsoft.com/en-us/dotnet/api/microsoft.identity.client.msalclientexception?view=azure-dotnet-preview#fields)
- use MSAL.NET with a [proxy]()


