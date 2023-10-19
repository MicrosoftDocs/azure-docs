---
title: Microsoft identity platform token exchange scenario with SAML and OIDC/OAuth in Microsoft Entra ID
description: Learn about common token exchange scenarios when working with SAML and OIDC/OAuth in Microsoft Entra ID.
services: active-directory
author: OwenRichards1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 12/08/2020
ms.author: owenrichards
ms.reviewer: jmprieur
ms.custom: has-adal-ref
---

# Microsoft identity platform token exchange scenarios with SAML and OIDC/OAuth

SAML and OpenID Connect (OIDC) / OAuth are popular protocols used to implement single sign-on (SSO). Some apps might only implement SAML and others might only implement OIDC/OAuth. Both protocols use tokens to communicate secrets. To learn more about SAML, see [single sign-on SAML protocol](single-sign-on-saml-protocol.md). To learn more about OIDC/OAuth, see [OAuth 2.0 and OpenID Connect protocols on Microsoft identity platform](./v2-protocols.md).

This article outlines a common scenario where an app implements SAML but calls the Graph API, which uses OIDC/OAuth. Basic guidance is provided for people working with this scenario.

## Scenario: You have a SAML token and want to call the Graph API
Many apps are implemented with SAML. However, the Graph API uses the OIDC/OAuth protocols. It's possible, though not trivial, to add OIDC/OAuth functionality to a SAML app. Once OAuth functionality is available in an app, the Graph API can be used.

The general strategy is to add the OIDC/OAuth stack to your app. With your app that implements both standards you can use a session cookie. You aren't exchanging a token explicitly. You're logging a user in with SAML, which generates a session cookie. When the Graph API invokes an OAuth flow, you use the session cookie to authenticate. This strategy assumes the Conditional Access checks pass and the user is authorized.

> [!NOTE]
> The recommended library for adding OIDC/OAuth behavior to your applications is the [Microsoft Authentication Library (MSAL)](/entra/msal/).

## Next steps
- [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)
