---
title: OpenID Connect authentication with Microsoft Entra ID
description: Architectural guidance on achieving OpenID Connect authentication with Microsoft Entra ID.
services: active-directory
author: janicericketts
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 01/10/2023
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# OpenID Connect authentication with Microsoft Entra ID

OpenID Connect (OIDC) is an authentication protocol based on the OAuth2 protocol (which is used for authorization). OIDC uses the standardized message flows from OAuth2 to provide identity services. 

The design goal of OIDC is "making simple things simple and complicated things possible". OIDC lets developers authenticate their users across websites and apps without having to own and manage password files. This provides the app builder with a secure way to verify  the identity of the person currently using the browser or native app that is connected to the application.

The authentication of the user must take place at an identity provider where the user's session or credentials will be checked. To do that, you need a trusted agent. Native apps usually launch the system browser for that purpose. Embedded views are considered not trusted since there's nothing to prevent the app from snooping on the user password. 

In addition to authentication, the user can be asked for consent. Consent is the user's explicit permission to allow an application to access protected resources. Consent is different from authentication because consent only needs to be provided once for a resource. Consent remains valid until the user or admin manually revokes the grant. 

## Use when

There is a need for user consent and for web sign in.

![architectural diagram](./media/authentication-patterns/oidc-auth.png)

## Components of system

* **User**: Requests a service from the application.

* **Trusted agent**: The component that the user interacts with. This trusted agent is usually a web browser.

* **Application**: The application, or Resource Server, is where the resource or data resides. It trusts the identity provider to securely authenticate and authorize the trusted agent. 

* **Microsoft Entra ID**: The OIDC provider, also known as the identity provider, securely manages anything to do with the user's information, their access, and the trust relationships between parties in a flow. It authenticates the identity of the user, grants and revokes access to resources, and issues tokens. 

<a name='implement-oidc-with-azure-ad'></a>

## Implement OIDC with Microsoft Entra ID

* [Integrating applications with Microsoft Entra ID](../saas-apps/tutorial-list.md) 

* [OAuth 2.0 and OpenID Connect protocols on the Microsoft identity platform](../develop/v2-protocols.md) 

* [Microsoft identity platform and OpenID Connect protocol](../develop/v2-protocols-oidc.md) 

* [Web sign-in with OpenID Connect in Azure Active Directory B2C](/azure/active-directory-b2c/openid-connect) 

* [Secure your application by using OpenID Connect and Microsoft Entra ID](../develop/v2-protocols-oidc.md) 
