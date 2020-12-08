---
title: Microsoft identity platform token exchange scenarios with SAML and OIDC/OAuth
description: Learn about common token exchange scenarios when working with SAML and OIDC/OAuth in the Microsoft identity platform.
services: active-directory
author: kenwith
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 12/08/2020
ms.author: kenwith
ms.reviewer: paulgarn
---

# Microsoft identity platform token exchange scenarios with SAML and OIDC/OAuth

SAML and OpenID Connect (OIDC) / OAuth are popular protocols used to implement Single Sign-On (SSO). Some apps might only implement SAML and others might only implement OIDC/OAuth. Both protocols use tokens to communicate secrets. To learn more about SAML, see [Single Sign-On SAML protocol](single-sign-on-saml-protocol.md). To learn more about OIDC/OAuth, see [OAuth 2.0 and OpenID Connect protocols on Microsoft identity platform](active-directory-v2-protocols.md).

This article outlines a common scenario where an app implements SAML but you need to call into the Graph API which uses OIDC/OAuth. Basic guidance is provided in order to provide direction for those working with this scenario.

## Scenario: You have a SAML token and want to call the Graph API
Many apps are implemented with SAML. However, the Graph API uses the OIDC/OAuth protocols. It is possible, though not trivial, to add OIDC/OAuth functionality to a SAML app in order to work with the Graph API.

The general strategy is to add the OIDC/OAuth stack to your app. With your app that implements both standards you can use a session cookie. You are not exchanging a token explicitly. You are logging a user in with SAML which generates a session cookie. When the Graph API invokes an OAuth flow you use the session cookie to authenticate. This strategy assumes the Certificate Authority checks pass and the user is authorized. 

> [!NOTE]
> The recommended library for adding OIDC/OAuth behavior is the MicroSoft Authentication Library (MSAL). To learn more about MSAL, see [Overview of Microsoft Authentication Library (MSAL)](msal-overview.md). The previous library was called Active Directory Authentication Library (ADAL), however it is not recommended as MSAL is replacing it.


## Scenario: You have an OAuth token and you want to call into an app implemented with SAML

Is this scenario supported? yes, possible. There is an OAuth grant that accepts a SAML token. Was added 2 or 3 years ago and documented in the reference. 

Basic guidance on how to do it? Should we cover using AD FS vs. AAD and also ADAL vs. MSAL? I put placeholder info below.
https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow#saml-assertions-obtained-with-an-oauth20-obo-flow shows info for MSAL.



### AD FS (on premises based identity management) compared to Azure AD (cloud based identity management)

### ADAL vs MSAL (version 1 compared to version 2 of identity library)
Using ADAL library (often called v1 of Microsoft's identity library) compared to using MSAL (often called v2 of Microsoft's identity library). For more information about ADAL versus MSAL, see [Overview of Microsoft Authentication Library (MSAL)](msal-overview.md).

Might be that MSAL endpoint doesn't support it but ADAL does. Need to confirm if this scenario works in MSAL or only in ADAL. (Randy or Adrian Fry - check with Paul)

ADAL details in https://docs.microsoft.com/en-us/azure/active-directory/azuread-dev/v1-oauth2-on-behalf-of-flow ... the V2 doc doesn't have the token request details. need to confirm and if it is supported in MSAL then pull this content to the MSAL doc.




## Scenario: Paul mentioned a couple of other scenarios to cover
You have an OIDC app talking to AD FS, AD FS is trusted by AAD. cannot submit the JWOT 
Apps running on AD FS and you want to move these resources to AAD. Face a choice of moving everything at once or translate an AD FS authorization to present to AAD. JWOT equivalent.



## Next steps
- [authentication flows and application scenarios](authentication-flows-app-scenarios.md)
