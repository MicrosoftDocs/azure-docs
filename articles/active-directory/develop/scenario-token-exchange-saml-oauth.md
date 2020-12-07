---
title: Microsoft identity platform token exchange scenarios with SAML and OAuth
description: Learn about common token exchange scenarios when working with SAML and OAuth in the Microsoft identity platform.
services: active-directory
author: kenwith
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 12/07/2020
ms.author: kenwith
ms.reviewer: paulgarn
---

# Microsoft identity platform token exchange scenarios with SAML and OAuth

SAML and OpenID Connect (OIDC) / OAuth are popular protocols used to implement Single Sign-On (SSO). Some apps might only implement SAML and others might only implement OIDC/OAuth. Both protocols use tokens to communicate secrets.

This article outlines common scenarios where you need to exchange tokens between SAML and OIDC/OAuth. Basic guidance is provided including what is supported, what is not supported, and what is possible though not recommended.

## Scenario: You have a SAML token and want to call Graph using an OAuth token

Is this scenario supported? Basic guidance on how to do it? Should we cover using AD FS vs. AAD and also ADAL vs. MSAL? I put placeholder info below.

### AD FS (on premises based identity management) compared to Azure AD (cloud based identity management)


### ADAL vs MSAL
Using ADAL library (often called v1 of Microsoft's identity library) compared to using MSAL (often called v2 of Microsoft's identity library). For more information about ADAL versus MSAL, see [Overview of Microsoft Authentication Library (MSAL)](msal-overview.md).

## Scenario: You have an OAuth token and you want to call into an app implemented with SAML

Is this scenario supported? Basic guidance on how to do it? Should we cover using AD FS vs. AAD and also ADAL vs. MSAL? I put placeholder info below.

### AD FS (on premises based identity management) compared to Azure AD (cloud based identity management)

### ADAL vs MSAL
Using ADAL library (often called v1 of Microsoft's identity library) compared to using MSAL (often called v2 of Microsoft's identity library). For more information about ADAL versus MSAL, see [Overview of Microsoft Authentication Library (MSAL)](msal-overview.md).


## Scenario: Paul mentioned a couple of other scenarios to cover


## Next steps
- [authentication flows and application scenarios](authentication-flows-app-scenarios.md)
