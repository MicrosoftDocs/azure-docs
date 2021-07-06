---
title: MSAL authentication flows | Azure
titleSuffix: Microsoft identity platform
description: Learn about the authentication flows and grants used by the Microsoft Authentication Library (MSAL).
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 01/25/2021
ms.author: marsma
ms.reviewer: saeeda
# Customer intent: As an application developer, I want to learn about the authentication flows supported by MSAL.
---

# Authentication flows

The Microsoft Authentication Library (MSAL) supports several authentication flows for use in different application scenarios.

| Flow | Description | Used in |
|--|--|--|
| [Authorization code](#authorization-code) | Used in apps that are installed on a device to gain access to protected resources, such as web APIs. Enables you to add sign-in and API access to your mobile and desktop apps. | [Desktop apps](scenario-desktop-overview.md), [mobile apps](scenario-mobile-overview.md), [web apps](scenario-web-app-call-api-overview.md) |
| [Client credentials](#client-credentials) | Allows you to access web-hosted resources by using the identity of an application. Commonly used for server-to-server interactions that must run in the background, without immediate interaction with a user. | [Daemon apps](scenario-daemon-overview.md) |
| [Device code](#device-code) | Allows users to sign in to input-constrained devices such as a smart TV, IoT device, or printer. | [Desktop/mobile apps](scenario-desktop-acquire-token.md#command-line-tool-without-a-web-browser) |
| [Implicit grant](#implicit-grant) | Allows the app to get tokens without performing a back-end server credential exchange. Enables the app to sign in the user, maintain session, and get tokens to other web APIs, all within the client JavaScript code. | [Single-page applications (SPA)](scenario-spa-overview.md) |
| [On-behalf-of](#on-behalf-of) | An application invokes a service or web API, which in turn needs to call another service or web API. The idea is to propagate the delegated user identity and permissions through the request chain. | [Web APIs](scenario-web-api-call-api-overview.md) |
| [Username/password](#usernamepassword) | Allows an application to sign in the user by directly handling their password. This flow isn't recommended. | [Desktop/mobile apps](scenario-desktop-acquire-token.md#username-and-password) |
| [Integrated Windows Authentication](#integrated-windows-authentication) | Allows applications on domain or Azure Active Directory (Azure AD) joined computers to acquire a token silently (without any UI interaction from the user). | [Desktop/mobile apps](scenario-desktop-acquire-token.md#integrated-windows-authentication) |

## How each flow emits tokens and codes

Depending on how your client application is built, it can use one or more of the authentication flows supported by the Microsoft identity platform. These flows can produce several types of tokens as well as authorization codes, and require different tokens to make them work.

| Flow                                                                               | Requires            | id_token | access token | refresh token | authorization code |
|------------------------------------------------------------------------------------|:-------------------:|:--------:|:------------:|:-------------:|:------------------:|
| [Authorization code flow](v2-oauth2-auth-code-flow.md)                             |                     | x        | x            | x             | x                  |
| [Client credentials](v2-oauth2-client-creds-grant-flow.md)                         |                     |          | x (app-only) |               |                    |
| [Device code flow](v2-oauth2-device-code.md)                                       |                     | x        | x            | x             |                    |
| [Implicit flow](v2-oauth2-implicit-grant-flow.md)                                  |                     | x        | x            |               |                    |
| [On-behalf-of flow](v2-oauth2-on-behalf-of-flow.md)                                | access token        | x        | x            | x             |                    |
| [Username/password](v2-oauth-ropc.md) (ROPC)                                       | username & password | x        | x            | x             |                    |
| [Hybrid OIDC flow](v2-protocols-oidc.md#protocol-diagram-access-token-acquisition) |                     | x        |              |               | x                  |
| [Refresh token redemption](v2-oauth2-auth-code-flow.md#refresh-the-access-token)   | refresh token       | x        | x            | x             |                    |

### Interactive and non-interactive authentication

Several of these flows support both interactive and non-interactive token acquisition.

  - **Interactive** means that the user can be prompted for input. For example, prompting the user to login, perform multi-factor authentication (MFA), or to grant additional consent to resources.
  - **Non-interactive**, or *silent*, authentication attempts to acquire a token in a way in which the login server *cannot* prompt the user for additional information.

Your MSAL-based application should first attempt to acquire a token *silently*, and then interactively only if the non-interactive method fails. For more information about this pattern, see [Acquire and cache tokens using the Microsoft Authentication Library (MSAL)](msal-acquire-cache-tokens.md).

## Authorization code

The [OAuth 2 authorization code grant](v2-oauth2-auth-code-flow.md) can be used in apps that are installed on a device to gain access to protected resources like web APIs. This allows you to add sign-in and API access to your mobile and desktop apps.

When users sign in to web applications (websites), the web application receives an authorization code. The authorization code is redeemed to acquire a token to call web APIs.

![Diagram of authorization code flow](media/msal-authentication-flows/authorization-code.png)

In the preceding diagram, the application:

1. Requests an authorization code, which is redeemed for an access token.
2. Uses the access token to call a web API.

### Considerations

- You can use the authorization code only once to redeem a token. Don't try to acquire a token multiple times with the same authorization code because it's explicitly prohibited by the protocol standard specification. If you redeem the code several times, either intentionally or because you're unaware that a framework also does it for you, you'll get the following error:

    `AADSTS70002: Error validating credentials. AADSTS54005: OAuth2 Authorization code was already redeemed, please retry with a new valid code or use an existing refresh token.`

## Client credentials

The [OAuth 2 client credentials flow](v2-oauth2-client-creds-grant-flow.md) allows you to access web-hosted resources by using the identity of an application. This type of grant is commonly used for server-to-server interactions that must run in the background, without immediate interaction with a user. These types of applications are often referred to as daemons or service accounts.

The client credentials grant flow permits a web service (a confidential client) to use its own credentials, instead of impersonating a user, to authenticate when calling another web service. In this scenario, the client is typically a middle-tier web service, a daemon service, or a website. For a higher level of assurance, the Microsoft identity platform also allows the calling service to use a certificate (instead of a shared secret) as a credential.

> [!NOTE]
> The confidential client flow isn't available on mobile platforms like UWP, Xamarin.iOS, and Xamarin.Android because they support only public client applications. Public client applications don't know how to prove the application's identity to the identity provider. A secure connection can be achieved on web app or web API back-ends by deploying a certificate.

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
- Passed in when constructing the confidential client application object in your code.

## Device code

The [OAuth 2 device code flow](v2-oauth2-device-code.md) allows users to sign in to input-constrained devices like smart TVs, IoT devices, and printers. Interactive authentication with Azure AD requires a web browser. Where the device or operating system doesn't provide a web browser, the device code flow lets the user use another device like a computer or mobile phone to sign in interactively.

By using the device code flow, the application obtains tokens through a two-step process designed for these devices and operating systems. Examples of such applications include those running on IoT devices and command-line interface (CLI) tools.

![Diagram of device code flow](media/msal-authentication-flows/device-code.png)

In the preceding diagram:

1. Whenever user authentication is required, the app provides a code and asks the user to use another device like an internet-connected smartphone to visit a URL (for example, `https://microsoft.com/devicelogin`). The user is then prompted to enter the code, and proceeding through a normal authentication experience including consent prompts and [multi-factor authentication](../authentication/concept-mfa-howitworks.md), if necessary.
1. Upon successful authentication, the command-line app receives the required tokens through a back channel, and uses them to perform the web API calls it needs.

### Constraints

- Device code flow is available only in public client applications.
- The authority passed in when constructing the public client application must be one of the following:
  - Tenanted, in the form `https://login.microsoftonline.com/{tenant}/,` where `{tenant}` is either the GUID representing the tenant ID or a domain name associated with the tenant.
  - For work and school accounts in the form `https://login.microsoftonline.com/organizations/`.

## Implicit grant

The [OAuth 2 implicit grant](v2-oauth2-implicit-grant-flow.md) flow allows the app to get tokens from the Microsoft identity platform without performing a back-end server credential exchange. This flow allows the app to sign in the user, maintain a session, and get tokens for other web APIs, all within the client JavaScript code.

![Diagram of implicit grant flow](media/msal-authentication-flows/implicit-grant.svg)

Many modern web applications are built as client-side, single page-applications (SPA) written in JavaScript or an SPA framework such as Angular, Vue.js, and React.js. These applications run in a web browser, and have different authentication characteristics than traditional server-side web applications. The Microsoft identity platform enables single page applications to sign in users, and get tokens to access back-end services or web APIs, by using the implicit grant flow. The implicit flow allows the application to get ID tokens to represent the authenticated user, and also access tokens needed to call protected APIs.

This authentication flow doesn't include application scenarios that use cross-platform JavaScript frameworks like Electron or React-Native because they require further capabilities for interaction with the native platforms.

Tokens issued via the implicit flow mode have a **length limitation** because they're returned to the browser by URL (where `response_mode` is either `query` or `fragment`). Some browsers limit the length of the URL in the browser bar and fail when it's too long. Thus, these implicit flow tokens don't contain `groups` or `wids` claims.

## On-behalf-of

The [OAuth 2 on-behalf-of authentication flow](v2-oauth2-on-behalf-of-flow.md) flow is used when an application invokes a service or web API that in turn needs to call another service or web API. The idea is to propagate the delegated user identity and permissions through the request chain. For the middle-tier service to make authenticated requests to the downstream service, it needs to secure an access token from the Microsoft identity platform *on behalf of* the user.

![Diagram of on-behalf-of flow](media/msal-authentication-flows/on-behalf-of.png)

In the preceding diagram:

1. The application acquires an access token for the web API.
2. A client (web, desktop, mobile, or single-page application) calls a protected web API, adding the access token as a bearer token in the authentication header of the HTTP request. The web API authenticates the user.
3. When the client calls the web API, the web API requests another token on-behalf-of the user.
4. The protected web API uses this token to call a downstream web API on-behalf-of the user. The web API can also later request tokens for other downstream APIs (but still on behalf of the same user).

## Username/password

The [OAuth 2 resource owner password credentials](v2-oauth-ropc.md) (ROPC) grant allows an application to sign in the user by directly handling their password. In your desktop application, you can use the username/password flow to acquire a token silently. No UI is required when using the application.

![Diagram of the username/password flow](media/msal-authentication-flows/username-password.png)

In the preceding diagram, the application:

1. Acquires a token by sending the username and password to the identity provider.
2. Calls a web API by using the token.

> [!WARNING]
> This flow isn't recommended. It requires a high degree of trust and credential exposure. You should use this flow *only* when more secure flows can't be used. For more information, see [What's the solution to the growing problem of passwords?](https://news.microsoft.com/features/whats-solution-growing-problem-passwords-says-microsoft/).

The preferred flow for acquiring a token silently on Windows domain-joined machines is [Integrated Windows Authentication](#integrated-windows-authentication). In other cases, use the [device code flow](#device-code).

Although the username/password flow might be useful in some scenarios like DevOps, avoid it if you want to use username/password in interactive scenarios where you provide your own UI.

By using username/password:

- Users that need to perform multi-factor authentication won't be able to sign in because there is no interaction.
- Users won't be able to do single sign-on.

### Constraints

Apart from the [Integrated Windows Authentication constraints](#integrated-windows-authentication), the following constraints also apply:

- The username/password flow isn't compatible with Conditional Access and multi-factor authentication. As a consequence, if your app runs in an Azure AD tenant where the tenant admin requires multi-factor authentication, you can't use this flow. Many organizations do that.
- ROPC works only for work and school accounts. You can't use ROPC for Microsoft accounts (MSA).
- The flow is available on .NET desktop and .NET Core, but not on Universal Windows Platform.
- In Azure AD B2C, the ROPC flow works only for local accounts. For information about ROPC in MSAL.NET and Azure AD B2C, see [Using ROPC with Azure AD B2C](msal-net-aad-b2c-considerations.md#resource-owner-password-credentials-ropc).

## Integrated Windows Authentication

MSAL supports Integrated Windows Authentication (IWA) for desktop and mobile applications that run on a domain-joined or Azure AD-joined Windows computer. Using IWA, these applications can acquire a token silently without requiring UI interaction by user.

![Diagram of Integrated Windows Authentication](media/msal-authentication-flows/integrated-windows-authentication.png)

In the preceding diagram, the application:

1. Acquires a token by using Integrated Windows Authentication.
2. Uses the token to make requests of the resource.

### Constraints

Integrated Windows Authentication (IWA) supports federated users *only* - users created in Active Directory and backed by Azure AD. Users created directly in Azure AD without Active Directory backing (managed users) can't use this authentication flow. This limitation doesn't affect the [username/password flow](#usernamepassword).

IWA is for .NET Framework, .NET Core, and Universal Windows Platform applications.

IWA doesn't bypass multi-factor authentication. If multi-factor authentication is configured, IWA might fail if a multi-factor authentication challenge is required. Multi-factor authentication requires user interaction.

You don't control when the identity provider requests two-factor authentication to be performed. The tenant admin does. Typically, two-factor authentication is required when you sign in from a different country/region, when you're not connected via VPN to a corporate network, and sometimes even when you are connected via VPN. Azure AD uses AI to continuously learn if two-factor authentication is required. If IWA fails, you should fall back to an [interactive user prompt](#interactive-and-non-interactive-authentication).

The authority passed in when constructing the public client application must be one of:

- Tenanted, in the form `https://login.microsoftonline.com/{tenant}/,` where `{tenant}` is either the GUID representing the tenant ID or a domain name associated with the tenant.
- For any work and school accounts (`https://login.microsoftonline.com/organizations/`). Microsoft personal accounts (MSA) are unsupported; you can't use `/common` or `/consumers` tenants.

Because IWA is a silent flow, one of the following must be true:

- The user of your application must have previously consented to use the application.
- The tenant admin must have previously consented to all users in the tenant to use the application.

This means that one of the following is true:

- You as a developer have selected **Grant** in the Azure portal for yourself.
- A tenant admin has selected **Grant/revoke admin consent for {tenant domain}** in the **API permissions** tab of the app registration in the Azure portal (see [Add permissions to access your web API](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-your-web-api)).
- You've provided a way for users to consent to the application; see [Requesting individual user consent](v2-permissions-and-consent.md#requesting-individual-user-consent).
- You've provided a way for the tenant admin to consent for the application; see [admin consent](v2-permissions-and-consent.md#requesting-consent-for-an-entire-tenant).

The IWA flow is enabled for .NET desktop, .NET Core, and Windows Universal Platform apps.

For more information on consent, see [v2.0 permissions and consent](v2-permissions-and-consent.md).

## Next steps

Now that you've reviewed authentication flows supported by the Microsoft Authentication Library (MSAL), learn about acquiring and caching the tokens used in these flows:

[Acquire and cache tokens using the Microsoft Authentication Library (MSAL)](msal-acquire-cache-tokens.md)
