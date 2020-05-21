---
title: Best practices for Microsoft identity platform | Azure
description: Learn about best practices, recommendations, and common oversights when integrating with the Microsoft identity platform.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/08/2020
ms.author: ryanwi
ms.reviewer: lenalepa, sureshja, jesakowi
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started
#Customer intent: As an application developer, I want to learn about best practices so I can integrate my application with the Microsoft identity platform.
---

# Microsoft identity platform best practices and recommendations

This article highlights best practices, recommendations, and common oversights when integrating with the Microsoft identity platform.  This checklist will guide you to a high-quality and secure integration. Review this list on a regular basis to make sure you maintain the quality and security of your app’s integration with the identity platform. The checklist isn't intended to review your entire application. The contents of the checklist are subject to change as we make improvements to the platform.

If you’re just getting started, check out the [Microsoft identity platform documentation](index.yml) to learn about authentication basics, application scenarios in the Microsoft identity platform, and more.

Use the following checklist to ensure that your application is effectively integrated with the [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/).

> [!TIP]
> The *Integration assistant* in the Azure portal can help you apply many of these best practices and recommendations. Select any of your [app registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) in the Azure portal, and then select the **Integration assistant (preview)** menu item to get started with the assistant.

## Basics

|   |   |
|---|---|
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Read and understand the [Microsoft Platform Policies](https://go.microsoft.com/fwlink/?linkid=2090497&clcid=0x409). Ensure that your application adheres to the terms outlined as they're designed to protect users and the platform. |

## Ownership

|   |   |
|---|---|
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Make sure the information associated with the account you used to register and manage apps is up-to-date. |

## Branding

|   |   |
|---|---|
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Adhere to the [Branding guidelines for applications](howto-add-branding-in-azure-ad-apps.md). |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Provide a meaningful name and logo for your application. This information appears on your [application’s consent prompt](application-consent-experience.md). Make sure your name and logo are representative of your company/product so that users can make informed decisions. Ensure that you're not violating any trademarks. |

## Privacy

|   |   |
|---|---|
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Provide links to your app's terms of service and privacy statement. |

## Security

|   |   |
|---|---|
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Manage your redirect URIs: <ul><li>Maintain ownership of all your redirect URIs and keep the DNS records for them up-to-date.</li><li>Don't use wildcards (*) in your URIs.</li><li>For web apps, make sure all URIs are secure and encrypted (for example, using https schemes).</li><li>For public clients, use platform-specific redirect URIs if applicable (mainly for iOS and Android). Otherwise, use redirect URIs with a high amount of randomness to prevent collisions when calling back to your app.</li><li>If your app is being used from an isolated web agent, you may use `https://login.microsoftonline.com/common/oauth2/nativeclient`.</li><li>Review and trim all unused or unnecessary redirect URIs on a regular basis.</li></ul> |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | If your app is registered in a directory, minimize and manually monitor the list of app registration owners. |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Don't enable support for the [OAuth2 implicit grant flow](v2-oauth2-implicit-grant-flow.md) unless explicitly required. Learn about the valid scenario [here](v2-oauth2-implicit-grant-flow.md#suitable-scenarios-for-the-oauth2-implicit-grant). |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Move beyond username/password. Don't use [resource owner password credential flow (ROPC)](v2-oauth-ropc.md), which directly handles users’ passwords. This flow requires a high degree of trust and user exposure and should only be used when other, more secure, flows can't be used. This flow is still needed in some scenarios (like DevOps), but beware that using it will impose constraints on your application.  For more modern approaches, read [Authentication flows and application scenarios](authentication-flows-app-scenarios.md).|
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Protect and manage your confidential app credentials for web apps, web APIs and daemon apps. Use [certificate credentials](active-directory-certificate-credentials.md), not password credentials (client secrets). If you must use a password credential, don't set it manually. Don't store credentials in code or config, and never allow them to be handled by humans. If possible, use [managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) or [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis) to store and regularly rotate your credentials. |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Make sure your application requests the least privilege permissions. Only ask for permissions that your application absolutely needs, and only when you need them. Understand the different [types of permissions](v2-permissions-and-consent.md#permission-types). Only use application permissions if necessary; use delegated permissions where possible. For a full list of Microsoft Graph permissions, see this [permissions reference](https://docs.microsoft.com/graph/permissions-reference). |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | If you're securing an API using the Microsoft identity platform, carefully think through the permissions it should expose. Consider what's the right granularity for your solution and which permission(s) require admin consent. Check for expected permissions in the incoming tokens before making any authorization decisions. |

## Implementation

|   |   |
|---|---|
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Use modern authentication solutions (OAuth 2.0, [OpenID Connect](v2-protocols-oidc.md)) to securely sign in users. |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) |  Don't program directly against protocols such as OAuth 2.0 and Open ID. Instead, leverage the [Microsoft Authentication Library (MSAL)](msal-overview.md). The MSAL libraries securely wrap security protocols in an easy-to-use library, and you get built-in support for [Conditional Access](/azure/active-directory/conditional-access/overview) scenarios, device-wide [single sign-on (SSO)](/azure/active-directory/manage-apps/what-is-single-sign-on), and built-in token caching support. For more info, see the list of Microsoft supported [client libraries](reference-v2-libraries.md#microsoft-supported-client-libraries) and [middleware libraries](reference-v2-libraries.md#microsoft-supported-server-middleware-libraries) and the list of [compatible third-party client libraries](reference-v2-libraries.md#compatible-client-libraries).<br/><br/>If you must hand code for the authentication protocols, you should follow a methodology such as [Microsoft SDL](https://www.microsoft.com/sdl/default.aspx). Pay close attention to the security considerations in the standards specifications for each protocol.|
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) |  Migrate existing apps from [Azure Active Directory Authentication Library (ADAL)](../azuread-dev/active-directory-authentication-libraries.md) to [Microsoft Authentication Library](msal-overview.md). MSAL is Microsoft’s latest identity platform solution and is preferred to ADAL. It is available on .NET, JavaScript, Android, iOS, macOS and is also in public preview for Python and Java. Read more about migrating [ADAL.NET](msal-net-migration.md), [ADAL.js](msal-compare-msal-js-and-adal-js.md), and [ADAL.NET and iOS broker](msal-net-migration-ios-broker.md) apps.|
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) |  For mobile apps, configure each platform using the application registration experience. In order for your application to take advantage of the Microsoft Authenticator or Microsoft Company Portal for single sign-in, your app needs a “broker redirect URI” configured. This allows Microsoft to return control to your application after authentication. When configuring each platform, the app registration experience will guide you through the process. Use the quickstart to download a working example. On iOS, use brokers and system webview whenever possible.|
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) |  In web apps or web APIs, keep one token cache per account.  For web apps, the token cache should be keyed by the account ID.  For web APIs, the account should be keyed by the hash of the token used to call the API. MSAL.NET provides custom token cache serialization in the .NET Framework and .NET Core subplatforms. For security and performance reasons, our recommendation is to serialize one cache per user. For more information, read about [token cache serialization](msal-net-token-cache-serialization.md#token-cache-for-a-web-app-confidential-client-application).|
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | If the data your app requires is available through [Microsoft Graph](https://developer.microsoft.com/graph), request permissions for this data using the Microsoft Graph endpoint rather than the individual API. |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) |Don't look at the access token value, or attempt to parse it as a client.  They can change values, formats, or even become encrypted without warning - always use the id_token if your client needs to learn something about the user, or call Microsoft Graph.  Only web APIs should parse access tokens (since they are the ones defining the format and setting the encryption keys). |

## End-user experience

|   |   |
|---|---|
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | [Understand the consent experience](application-consent-experience.md) and configure the pieces of your app’s consent prompt so that end users and admins have enough information to determine if they trust your app. |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Minimize the number of times a user needs to enter login credentials while using your app by attempting silent authentication (silent token acquisition) before interactive flows. |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Don't use “prompt=consent” for every sign-in. Only use prompt=consent if you’ve determined that you need to ask for consent for additional permissions (for example, if you’ve changed your app’s required permissions). |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Where applicable, enrich your application with user data. Using the [Microsoft Graph API](https://developer.microsoft.com/graph) is an easy way to do this. The [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) tool that can help you get started. |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Register the full set of permissions that your app requires so admins can grant consent easily to their tenant. Use [incremental consent](../azuread-dev/azure-ad-endpoint-comparison.md#incremental-and-dynamic-consent) at run time to help users understand why your app is requesting permissions that may concern or confuse users when requested on first start. |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Implement a [clean single sign-out experience](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-6-SignOut). It’s a privacy and a security requirement, and makes for a good user experience. |

## Testing

|   |   |
|---|---|
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Test for [Conditional Access policies](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-6-SignOut) that may affect your users’ ability to use your application. |
| ![checkbox](./media/active-directory-integration-checklist/checkbox-two.svg) | Test your application with all possible accounts that you plan to support (for example, work or school accounts, personal Microsoft accounts, child accounts, and sovereign accounts). |

## Additional resources

Explore in-depth information about v2.0:

* [Microsoft identity platform (v2.0 overview)](v2-overview.md)
* [Microsoft identity platform protocols reference](active-directory-v2-protocols.md)
* [Access tokens reference](access-tokens.md)
* [ID tokens reference](id-tokens.md)
* [Authentication libraries reference](reference-v2-libraries.md)
* [Permissions and consent in the Microsoft identity platform](v2-permissions-and-consent.md)
* [Microsoft Graph API](https://developer.microsoft.com/graph)
