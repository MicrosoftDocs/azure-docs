---
title: Authentication flows (Microsoft Authentication Library) | Azure
description: Learn about the authentication flows and grants used by the Microsoft Authentication Library (MSAL).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/25/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about the types of authentication flows so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Authentication flows

This article describes the different authentication flows provided by Microsoft Authentication Library (MSAL).  These flows can be used in a variety of different application scenarios.

| Flow | Description | Used in|  
| ---- | ----------- | ------- | 
| [Interactive](#interactive) | Gets the token through an interactive process that prompts the user for credentials through a browser or pop-up window. | [Desktop apps](scenario-desktop-overview.md), [mobile apps](scenario-mobile-overview.md) |
| [Implicit grant](#implicit-grant) | Allows the app to get tokens without performing a back-end server credential exchange. This allows the app to sign in the user, maintain session, and get tokens to other web APIs, all within the client JavaScript code.| [Single-page applications (SPA)](scenario-spa-overview.md) |
| [Authorization code](#authorization-code) | Used in apps that are installed on a device to gain access to protected resources, such as web APIs. This allows you to add sign-in and API access to your mobile and desktop apps. | [Desktop apps](scenario-desktop-overview.md), [mobile apps](scenario-mobile-overview.md), [web apps](scenario-web-app-call-api-overview.md) | 
| [On-behalf-of](#on-behalf-of) | An application invokes a service or web API, which in turn needs to call another service or web API. The idea is to propagate the delegated user identity and permissions through the request chain. | [Web APIs](scenario-web-api-call-api-overview.md) |
| [Client credentials](#client-credentials) | Allows you to access web-hosted resources by using the identity of an application. Commonly used for server-to-server interactions that must run in the background, without immediate interaction with a user. | [Daemon apps](scenario-daemon-overview.md) |
| [Device code](#device-code) | Allows users to sign in to input-constrained devices such as a smart TV, IoT device, or printer. | [Desktop/mobile apps](scenario-desktop-acquire-token.md#command-line-tool-without-web-browser) |
| [Integrated Windows Authentication](scenario-desktop-acquire-token.md#integrated-windows-authentication) | Allows applications on domain or Azure Active Directory (Azure AD) joined computers to acquire a token silently (without any UI interaction from the user).| [Desktop/mobile apps](scenario-desktop-acquire-token.md#integrated-windows-authentication) |
| [Username/password](scenario-desktop-acquire-token.md#username--password) | Allows an application to sign in the user by directly handling their password. This flow isn't recommended. | [Desktop/mobile apps](scenario-desktop-acquire-token.md#username--password) | 

## Interactive
MSAL supports the ability to interactively prompt the user for their credentials to sign in, and obtain a token by using those credentials.

![Diagram of interactive flow](media/msal-authentication-flows/interactive.png)

For more information on using MSAL.NET to interactively acquire tokens on specific platforms, see:
- [Xamarin Android](msal-net-xamarin-android-considerations.md)
- [Xamarin iOS](msal-net-xamarin-ios-considerations.md)
- [Universal Windows Platform](msal-net-uwp-considerations.md)

For more information on interactive calls in MSAL.js, see [Prompt behavior in MSAL.js interactive requests](msal-js-prompt-behavior.md).

## Implicit grant

MSAL supports the [OAuth 2 implicit grant flow](v2-oauth2-implicit-grant-flow.md), which allows the app to get tokens from Microsoft identity platform without performing a back-end server credential exchange. This allows the app to sign in the user, maintain session, and get tokens to other web APIs, all within the client JavaScript code.

![Diagram of implicit grant flow](media/msal-authentication-flows/implicit-grant.svg)

Many modern web applications are built as client-side, single page applications, written by using JavaScript or an SPA framework such as Angular, Vue.js, and React.js. These applications run in a web browser, and have different authentication characteristics than traditional server-side web applications. The Microsoft identity platform enables single page applications to sign in users, and get tokens to access back-end services or web APIs, by using the implicit grant flow. The implicit flow allows the application to get ID tokens to represent the authenticated user, and also access tokens needed to call protected APIs.

This authentication flow doesn't include application scenarios that use cross-platform JavaScript frameworks such as Electron and React-Native, because they require further capabilities for interaction with the native platforms.

## Authorization code
MSAL supports the [OAuth 2 authorization code grant](v2-oauth2-auth-code-flow.md). This grant can be used in apps that are installed on a device to gain access to protected resources, such as web APIs. This allows you to add sign-in and API access to your mobile and desktop apps. 

When users sign in to web applications (websites), the web application receives an authorization code.  The authorization code is redeemed to acquire a token to call web APIs. In ASP.NET and ASP.NET Core web apps, the only goal of `AcquireTokenByAuthorizationCode` is to add a token to the token cache. The token can then be used by the application (usually in the controllers, which just get a token for an API by using `AcquireTokenSilent`).

![Diagram of authorization code flow](media/msal-authentication-flows/authorization-code.png)

In the preceding diagram, the application:

1. Requests an authorization code, which is redeemed for an access token.
2. Uses the access token to call a web API.

### Considerations
- You can use the authorization code only once to redeem a token. Don't try to acquire a token multiple times with the same authorization code (it's explicitly prohibited by the protocol standard specification). If you redeem the code several times intentionally, or because you are not aware that a framework also does it for you, you'll get the following error: `AADSTS70002: Error validating credentials. AADSTS54005: OAuth2 Authorization code was already redeemed, please retry with a new valid code or use an existing refresh token.`

- If you're writing an ASP.NET or ASP.NET Core application, this might happen if you don't tell the framework that you've already redeemed the authorization code. For this, you need to call the `context.HandleCodeRedemption()` method of the `AuthorizationCodeReceived` event handler.

- Avoid sharing the access token with ASP.NET, which might prevent incremental consent happening correctly. For more information, see [issue #693](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/issues/693).

## On-behalf-of

MSAL supports the [OAuth 2 on-behalf-of authentication flow](v2-oauth2-on-behalf-of-flow.md).  This flow is used when an application invokes a service or web API, which in turn needs to call another service or web API. The idea is to propagate the delegated user identity and permissions through the request chain. For the middle-tier service to make authenticated requests to the downstream service, it needs to secure an access token from the Microsoft identity platform, on behalf of the user.

![Diagram of on-behalf-of flow](media/msal-authentication-flows/on-behalf-of.png)

In the preceding diagram:

1. The application acquires an access token for the web API.
2. A client (web, desktop, mobile, or single-page application) calls a protected web API, adding the access token as a bearer token in the authentication header of the HTTP request. The web API authenticates the user.
3. When the client calls the web API, the web API requests another token on-behalf-of the user.  
4. The protected web API uses this token to call a downstream web API on-behalf-of the user.  The web API can also later request tokens for other downstream APIs (but still on behalf of the same user).

## Client credentials

MSAL supports the [OAuth 2 client credentials flow](v2-oauth2-client-creds-grant-flow.md). This flow allows you to access web-hosted resources by using the identity of an application. This type of grant is commonly used for server-to-server interactions that must run in the background, without immediate interaction with a user. These types of applications are often referred to as daemons or service accounts. 

The client credentials grant flow permits a web service (a confidential client) to use its own credentials, instead of impersonating a user, to authenticate when calling another web service. In this scenario, the client is typically a middle-tier web service, a daemon service, or a website. For a higher level of assurance, the Microsoft identity platform also allows the calling service to use a certificate (instead of a shared secret) as a credential.

> [!NOTE]
> The confidential client flow isn't available on the mobile platforms (UWP, Xamarin.iOS, and Xamarin.Android), because these only support public client applications. Public client applications don't know how to prove the application's identity to the Identity Provider. A secure connection can be achieved on web app or web API back ends by deploying a certificate.

MSAL.NET supports two types of client credentials. These client credentials need to be registered with Azure AD. The credentials are passed in to the constructors of the confidential client application in your code.

### Application secrets 

![Diagram of confidential client with password](media/msal-authentication-flows/confidential-client-password.png)

In the preceding diagram, the application:

1. Acquires a token by using application secret or password credentials.
2. Uses the token to make requests of the resource.

### Certificates 

![Diagram of confidential client with cert](media/msal-authentication-flows/confidential-client-certificate.png)

In the preceding diagram, the application:

1. Acquires a token by using certificate credentials.
2. Uses the token to make requests of the resource.

These client credentials need to be:
- Registered with Azure AD.
- Passed in at the construction of the confidential client application in your code.


## Device code
MSAL supports the [OAuth 2 device code flow](v2-oauth2-device-code.md), which allows users to sign in to input-constrained devices, such as a smart TV, IoT device, or printer. Interactive authentication with Azure AD requires a web browser. The device code flow lets the user use another device (for example, another computer or a mobile phone) to sign in interactively, where the device or operating system doesn't provide a web browser.

By using the device code flow, the application obtains tokens through a two-step process especially designed for these devices or operating systems. Examples of such applications include those running on IoT devices or command-line tools (CLI). 

![Diagram of device code flow](media/msal-authentication-flows/device-code.png)

In the preceding diagram:

1. Whenever user authentication is required, the app provides a code, and asks the user to use another device (such as an internet-connected smartphone) to go to a URL (for example, https://microsoft.com/devicelogin). The user is then prompted to enter the code, and proceeds through a normal authentication experience, including consent prompts and multi-factor authentication if necessary.

2. Upon successful authentication, the command-line app receives the required tokens through a back channel, and uses them to perform the web API calls it needs.

### Constraints

- Device code flow is only available on public client applications.
- The authority passed in when constructing the public client application must be one of the following:
  - Tenanted (of the form `https://login.microsoftonline.com/{tenant}/` where `{tenant}` is either the GUID representing the tenant ID or a domain associated with the tenant).
  - For any work and school accounts (`https://login.microsoftonline.com/organizations/`).
- Microsoft personal accounts aren't yet supported by the Azure AD v2.0 endpoint (you can't use the `/common` or `/consumers` tenants).

## Integrated Windows Authentication
MSAL supports Integrated Windows Authentication (IWA) for desktop or mobile applications that run on a domain joined or Azure AD joined Windows computer. Using IWA, these applications can acquire a token silently (without any UI interaction from the user). 

![Diagram of Integrated Windows Authentication](media/msal-authentication-flows/integrated-windows-authentication.png)

In the preceding diagram, the application:

1. Acquires a token by using Integrated Windows Authentication.
2. Uses the token to make requests of the resource.

### Constraints

IWA supports federated users only, meaning users created in Active Directory and backed by Azure AD. Users created directly in Azure AD, without Active Directory backing (managed users) can't use this authentication flow. This limitation doesn't affect the [username/password flow](#usernamepassword).

IWA is for apps written for .NET Framework, .NET Core, and Universal Windows Platform platforms.

IWA doesn't bypass multi-factor authentication. If multi-factor authentication is configured, IWA might fail if a multi-factor authentication challenge is required. Multi-factor authentication requires user interaction.

You don't control when the identity provider requests two-factor authentication to be performed. The tenant admin does. Typically, two-factor authentication is required when you sign in from a different country, when you're not connected via VPN to a corporate network, and sometimes even when you are connected via VPN. Azure AD uses AI to continuously learn if two-factor authentication is required. If IWA fails, you should fall back to an [interactive user prompt] (#interactive).

The authority passed in when constructing the public client application must be one of the following:
- Tenanted (of the form `https://login.microsoftonline.com/{tenant}/` where `tenant` is either the guid representing the tenant ID or a domain associated with the tenant).
- For any work and school accounts (`https://login.microsoftonline.com/organizations/`). Microsoft personal accounts are not supported (you can't use `/common` or `/consumers` tenants).

Because IWA is a silent flow, one of the following must be true:
- The user of your application must have previously consented to use the application. 
- The tenant admin must have previously consented to all users in the tenant to use the application.

This means that one of the following is true:
- You as a developer have selected **Grant** on the Azure portal for yourself.
- A tenant admin has selected **Grant/revoke admin consent for {tenant domain}** in the **API permissions** tab of the registration for the application (see [Add permissions to access web APIs](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis)).
- You have provided a way for users to consent to the application (see [Requesting individual user consent](v2-permissions-and-consent.md#requesting-individual-user-consent)).
- You have provided a way for the tenant admin to consent for the application (see [admin consent](v2-permissions-and-consent.md#requesting-consent-for-an-entire-tenant)).

The IWA flow is enabled for .NET desktop, .NET Core, and Windows Universal Platform apps. On .NET Core, only the overload taking the username is available. The .NET Core platform can't ask the username to the operating system.
  
For more information on consent, see [v2.0 permissions and consent](v2-permissions-and-consent.md).

## Username/password 
MSAL supports the [OAuth 2 resource owner password credentials grant](v2-oauth-ropc.md), which allows an application to sign in the user by directly handling their password. In your desktop application, you can use the username/password flow to acquire a token silently. No UI is required when using the application.

![Diagram of the username/password flow](media/msal-authentication-flows/username-password.png)

In the preceding diagram, the application:

1. Acquires a token by sending the username and password to the identity provider.
2. Calls a web API by using the token.

> [!WARNING]
> This flow isn't recommended. It requires a high degree of trust and user exposure.  You should only use this flow when other, more secure, flows can't be used. For more information, see [What's the solution to the growing problem of passwords?](https://news.microsoft.com/features/whats-solution-growing-problem-passwords-says-microsoft/). 

The preferred flow for acquiring a token silently on Windows domain-joined machines is [Integrated Windows Authentication](#integrated-windows-authentication). Otherwise, you can also use [Device code flow](#device-code).

Although this is useful in some cases (DevOps scenarios), if you want to use username/password in interactive scenarios where you provide your own UI, try to avoid it. By using username/password:
- Users who need to do multi-factor authentication won't be able to sign in (as there is no interaction).
- Users won't be able to do single sign-on.

### Constraints

Apart from the [Integrated Windows Authentication constraints](#integrated-windows-authentication), the following constraints also apply:

- The username/password flow isn't compatible with conditional access and multi-factor authentication. As a consequence, if your app runs in an Azure AD tenant where the tenant admin requires multi-factor authentication, you can't use this flow. Many organizations do that.
- It works only for work and school accounts (not Microsoft accounts).
- The flow is available on .NET desktop and .NET Core, but not on Universal Windows Platform.

### Azure AD B2C specifics

For more information on using MSAL.NET and Azure AD B2C, see [Using ROPC with Azure AD B2C (MSAL.NET)](msal-net-aad-b2c-considerations.md#resource-owner-password-credentials-ropc-with-azure-ad-b2c).
