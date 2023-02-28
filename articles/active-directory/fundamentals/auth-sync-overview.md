---
title: Azure Active Directory authentication and synchronization protocol overview
description: Architectural guidance on integrating Azure AD with legacy authentication protocols and sync patterns
services: active-directory
author: janicericketts
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 2/8/2023
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Azure Active Directory integrations with authentication protocols

Microsoft Azure Active Directory (Azure AD) enables integration with many authentication protocols. The authentication integrations enable you to use Azure AD and its security and management features with little or no changes to your applications that use legacy authentication methods.

## Legacy authentication protocols

The following table presents authentication Azure AD integration with legacy authentication protocols and their capabilities. Select the name of an authentication protocol to see

* A detailed description

* When to use it

* Architectural diagram

* Explanation of system components

* Links for how to implement the integration

 

| Authentication protocol| Authentication| Authorization| Multi-factor Authentication| Conditional Access |
| - |- | - | - | - |
| [Header-based authentication](auth-header-based.md)|![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [LDAP authentication](auth-ldap.md)| ![check mark](./media/authentication-patterns/check.png)| | |  |
| [OAuth 2.0 authentication](auth-oauth2.md)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [OIDC authentication](auth-oidc.md)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [Password based SSO authentication](auth-password-based-sso.md )| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [RADIUS authentication]( auth-radius.md)| ![check mark](./media/authentication-patterns/check.png)| | ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [Remote Desktop Gateway services](auth-remote-desktop-gateway.md)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [Secure Shell (SSH)](auth-ssh.md) |  ![check mark](./media/authentication-patterns/check.png)| | ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [SAML authentication](auth-saml.md)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [Windows Authentication - Kerberos Constrained Delegation](auth-kcd.md)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |





