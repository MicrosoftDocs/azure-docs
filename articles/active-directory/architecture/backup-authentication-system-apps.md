---
title: Application requirements for the backup authentication system
description: How to configure your application to allow for backup authentication system support.

services: active-directory
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 06/02/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: joroja

ms.collection: M365-identity-device-management
---
# Application requirements for the backup authentication system

The Microsoft Entra backup authentication system provides resilience to applications that use supported protocols and flows. For more information about the backup authentication system, see [Microsoft Entra ID's backup authentication system](backup-authentication-system.md).

## Application requirements for protection 

Applications must communicate with a supported hostname for the given Azure environment and use protocols currently supported by the backup authentication system. Use of authentication libraries, such as the [Microsoft Authentication Library (MSAL)](../develop/msal-overview.md), ensures that you're using authentication protocols supported by the backup authentication system.  

### Hostnames supported by the backup authentication system
 
| Azure environment | Supported hostname |
| --- |--- |
| Azure Commercial | login.microsoftonline.com |
| Azure Government | login.microsoftonline.us | 

### Authentication protocols supported by the backup authentication system

#### OAuth 2.0 and OpenID Connect (OIDC) 

##### Common guidance 

All applications using the OAuth 2.0 and/or OIDC protocols should adhere to the following practices to ensure resilience: 

- Your application uses MSAL or strictly adheres to the OpenID Connect & OAuth2 specifications. Microsoft recommends using MSAL libraries appropriate to your platform and use case. Using these libraries ensures the use of APIs and call patterns are supportable by the backup authentication system. 
- Your application uses a fixed set of scopes instead of [dynamic consent](../develop/scopes-oidc.md) when acquiring access tokens.  
- Your application doesn't use the [Resource Owner Password Credentials Grant](../develop/v2-oauth-ropc.md). **This grant type won't be supported** by the backup authentication system for any client type. Microsoft strongly recommends switching to alternative grant flows for better security and resilience. 
- Your application doesn't rely upon the [UserInfo endpoint](../develop/userinfo.md). Switching to using an ID token instead reduces latency by eliminating up to two network requests, and use existing support for ID token resilience within the backup authentication system. 

##### Native applications 

Native applications are public client applications that run directly on desktop or mobile devices and not in a web browser. They're registered as public clients in their application registration on the Microsoft Entra admin center or Azure portal. 

Native applications are protected by the backup authentication system when all the following are true: 

1. Your application persists the token cache for at least three days. Applications should use the device’s token cache location or the [token cache serialization API](../develop/msal-net-token-cache-serialization.md) to persist the token cache even when the user closes the application. 
1. Your application makes use of the MSAL [AcquireTokenSilent API](../develop/msal-net-acquire-token-silently.md) to retrieve tokens using cached Refresh Tokens. The use of the [AcquireTokenInteractive API](../develop/scenario-desktop-acquire-token-interactive.md) may fail to acquire a token from the backup authentication system if user interaction is required. 

The backup authentication system doesn't currently support the [device authorization grant](../develop/v2-oauth2-device-code.md).

##### Single-page web applications 

Single-page web applications (SPAs) have limited support in the backup authentication system. SPAs that use the [implicit grant flow](../develop/v2-oauth2-implicit-grant-flow.md) and request only OpenID Connect ID tokens are protected. Only apps that either use MSAL.js 1.x or implement the implicit grant flow directly can use this protection, as MSAL.js 2.x doesn't support the implicit flow.  

The backup authentication system doesn't currently support the [authorization code flow with Proof Key for Code Exchange](../develop/v2-oauth2-auth-code-flow.md).

##### Web applications & services 

The backup authentication system doesn't currently support web applications and services that are configured as confidential clients. Protection for the [authorization code grant flow](../develop/v2-oauth2-auth-code-flow.md) and subsequent token acquisition using refresh tokens and client secrets or [certificate credentials](../develop/certificate-credentials.md) isn't currently supported. The OAuth 2.0 [on-behalf-of flow](../develop/v2-oauth2-on-behalf-of-flow.md) isn't currently supported.  

#### SAML 2.0 single sign-on (SSO) 

The backup authentication system partially supports the SAML 2.0 SSO protocol. Flows that use the SAML 2.0 Identity Provider (IdP) Initiated flow are protected by the backup authentication system. Applications that use the [Service Provider (SP) Initiated flow](../develop/single-sign-on-saml-protocol.md), aren't currently protected by the backup authentication system.  

### Workload identity authentication protocols supported by the backup authentication system

#### OAuth 2.0 

##### Managed identity 

Applications that use Managed Identities to acquire Microsoft Entra access tokens are protected. Microsoft recommends the use of user-assigned managed identities in most scenarios, however this protection applies to both [user and system-assigned managed identities](../managed-identities-azure-resources/overview.md). 

##### Service principal 

The backup authentication system doesn't currently support service principal-based Workload identity authentication using the [client credentials grant flow](../develop/v2-oauth2-client-creds-grant-flow.md). Microsoft recommends using the version of MSAL appropriate to your platform so your application is protected by the backup authentication system when the protection becomes available. 

## Next steps

- [Microsoft Entra ID's backup authentication system](backup-authentication-system.md)
- [Microsoft Authentication Library (MSAL)](../develop/msal-overview.md)
- [Introduction to the backup authentication system](https://azure.microsoft.com/blog/advancing-service-resilience-in-azure-active-directory-with-its-backup-authentication-service/)
- [Resilience Defaults for Conditional Access](../conditional-access/resilience-defaults.md)
