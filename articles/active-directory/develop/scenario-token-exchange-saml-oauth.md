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
ms.date: 11/10/2020
ms.author: kenwith
ms.reviewer: paulgarn
---

# Microsoft identity platform token exchange scenarios with SAML and OAuth

SAML and OpenID Connect (OIDC) / OAuth are popular standards used to implement single sign-on. Some apps might only speak SAML and others might only speak OIDC/OAuth. Both standards use tokens to communicate secrets.

This article outlines common scenarios where you need to exchange tokens between standards. Basic guidance is provided including what is supported, what is not supported, and what is possible though not recommended.

## Scenario: You have a SAML token and want to call Graph using an OAuth token

AD FS (on premises based identity management) compared to Azure AD (cloud based identity management)

Using ADAL library (often called v1 of Microsoft's identity library) compared to using MSAL (often called v2 of Microsoft's identity library). See See https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview.

## Scenario: You have an OAuth token and you want to call into an app implemented with SAML
AD FS (on premises based identity management) compared to Azure AD (cloud based identity management)

Using ADAL library (often called v1 of Microsoft's identity library) compared to using MSAL (often called v2 of Microsoft's identity library). See See https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview.


## Scenario: <Paul mentioned a couple of other scenarios to cover>


## Next steps
- [authentication flows and application scenarios](authentication-flows-app-scenarios.md)
