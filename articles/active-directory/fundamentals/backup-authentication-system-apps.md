---
title: 
description: 

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
# Understanding Application Support for the backup authentication system 

The Azure AD backup authentication system provides seamless resilience to applications which use any of the set of protocols and flows supported by the backup authentication system. Before reading this article, we recommend reading the Resilience provided by the backup authentication system article to become familiar with the high-level requirements for application resilience using the backup authentication system.  

## What are the baseline application requirements for protection? 

Applications developers must ensure their applications communicate with supported hostnames for the given cloud environment and use protocols currently supported by the backup authentication system. Use of authentication libraries, such as the Microsoft Authentication Library (MSAL), will ensure that you are using standards-compliant authentication protocols that are or will be supported by the backup authentication system.  

### What hostnames are supported by the backup authentication system per cloud environment? 
 
| Azure environment | backup authentication system available | Supported hostnames |
| --- | --- | --- |
| Azure Commercial | Yes | login.microsoftonline.com |
| Azure Government | Yes | login.microsoftonline.us | 

### What User authentication protocols are supported by the backup authentication system? 

#### OAuth 2.0 and OpenID Connect (OIDC) 

##### Common Guidance 

All applications using the OAuth 2.0 and/or OIDC protocols should adhere to the following practices to ensure resilience: 

Your application uses MSAL or strictly adheres to the OpenID Connect & OAuth2 specifications. Microsoft recommends using MSAL libraries appropriate to your platform and use case, as this ensures the use of APIs and call patterns that are or will be supportable by the backup authentication system. 

Your application uses a fixed set of scopes instead of dynamic consent when acquiring access tokens.  

Your application does not use the Resource Owner Password Credentials Grant. This grant type is not and will not be supported by the backup authentication system for any client type. Microsoft strongly recommends switching to alternative grant flows for better security and resilience. 

Your application does not rely upon the UserInfo endpoint. Switching to using an ID token instead will reduce latency by eliminating up to two network requests, as well as leverage existing support for ID token resilience within the backup authentication system. 

##### Native (Desktop or Mobile) Applications 

Native applications are public client applications that run directly on desktop or mobile devices and not in a web browser. They are registered as public clients in their application registration on the Microsoft Entra or Azure portal. 

Native applications are protected by the backup authentication system when all the following are true: 

Your application persists the token cache for at least three days. Your application should use the device’s token cache location or the token cache serialization API to persist the token cache even when the user closes the application. 

Your application makes use of the MSAL AcquireTokenSilent API to retrieve tokens using cached Refresh Tokens. The use of the AcquireTokenInteractive API may fail to acquire a token from the backup authentication system if user interaction is required. 

Certain authentication flows are not yet supported by the backup authentication system. These include 

The device authorization grant flow.  

##### Single-page web applications 

Single-page web applications (SPAs) have limited support in the backup authentication system. SPAs which use the implicit grant flow and request only OpenID Connect ID tokens are protected. Only apps that either use MSAL.js 1.x or implement the implicit grant flow directly can use this protection, as MSAL.js 2.x does not support the implicit flow.  

The recommended authorization code flow with Proof Key for Code Exchange is not yet supported by the backup authentication system but will be supported by December 2023. 

##### Web Applications & Services 

Web applications and services that are configured as confidential clients are not yet supported by the backup authentication system. Protection for the authorization code grant flow and subsequent token acquisition using refresh tokens and client secrets or certificate credentials is expected by September 2024. The OAuth 2.0 on-behalf-of flow will be protected, although a date is not yet available.  

#### SAML 2.0 Single Sign-On (SSO) 

The SAML 2.0 SSO protocol is currently partially supported by the backup authentication system. Flows that use the SAML 2.0 Identity Provider (IdP) Initiated flow are protected by the Backup Authentication Service. Most applications should and do use the Service Provider (SP) Initiated flow, which is not yet protected by the backup authentication system. The backup authentication system will support SP-Initiated SSO flows by March 2024.  

 

### What Workload Identity authentication protocols are supported by the backup authentication system? 

#### OAuth 2.0 

##### Managed Identity 

Applications that use Managed Identities to acquire Azure Active Directory access tokens are protected. Microsoft recommends the use of user-assigned managed identities in most scenarios, however this protection applies to both user and system-assigned managed identities. 

##### Service Principal 

Service Principal-based Workload identity authentication using the client credentials grant flow is not yet supported by the backup authentication system. Microsoft recommends using the version of MSAL appropriate to your platform so your application will be protected by the backup authentication system when the protection becomes available in December 2024. 

## Next steps