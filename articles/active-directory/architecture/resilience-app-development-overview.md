---
title: Increase the resilience of authentication and authorization applications you develop
description: Resilience guidance for application development using Microsoft Entra ID and the Microsoft identity platform
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals 
ms.workload: identity
ms.topic: how-to
author: jricketts
ms.author: jricketts
manager: martinco
ms.date: 03/02/2023
---

# Increase the resilience of authentication and authorization applications you develop

The Microsoft identity platform helps you build applications your users and customers can sign in to using their Microsoft identities or social accounts. Microsoft identity platform uses token-based authentication and authorization. Client applications acquire tokens from an identity provider (IdP) to authenticate users and authorize applications to call protected APIs. A service validates tokens.

Learn more: 

[What is the Microsoft identity platform?](../develop/v2-overview.md)
[Security tokens](../develop/security-tokens.md)

A token is valid for a length of time, and then the app must acquire a new one. Rarely, a call to retrieve a token fails due to network or infrastructure issues or an authentication service outage. 

The following articles have guidance for client and service applications for a signed in user and daemon applications. They contain best practices for using tokens and calling resources.

- [Increase the resilience of authentication and authorization in client applications you develop](resilience-client-app.md)
- [Increase the resilience of authentication and authorization in daemon applications you develop](resilience-daemon-app.md)
- [Build resilience in your identity and access management infrastructure](resilience-in-infrastructure.md)
- [Build resilience in your customer identity and access management with Azure AD B2C](resilience-b2c.md)
- [Build services that are resilient to Microsoft Entra ID OpenID Connect metadata refresh](../develop/howto-build-services-resilient-to-metadata-refresh.md)
