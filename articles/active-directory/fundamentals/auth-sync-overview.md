---
title: Azure Active Directory authentication and synchronization protocol overview
description: Architectural guidance on achieving this authentication pattern
services: active-directory
author: BarbaraSelden
manager: daveba

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 10/10/2020
ms.author: baselden
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Azure Active Directory integrations with legacy authentication and synchronization protocols

Microsoft Azure Active Directory (Azure AD) enables integration with many authentication and synchronization protocols. The authentication integrations enable you to use Azure AD and its security and management features with little or no changes to your applications that use legacy authentication methods. The synchronization integrations enable you to sync user and group data to Azure AD, and then user Azure AD management capabilities. Some sync patterns also enable automated provisioning.

## Authentication patterns

The following table presents authentication patterns and their capabilities. Select the name of an authentication patterns to see

* A detailed description

* When to use it

* Architectural diagram

* Explanation of system components

* Links for how to implement the integration

 

| Authentication patterns| Authentication| Authorization| Multi-factor Authentication| Conditional Access |
| - |- | - | - | - |
| [Header-based authentication](auth-header-based.md)|![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [LDAP authentication](auth-ldap.md)| ![check mark](./media/authentication-patterns/check.png)| | |  |
| [OAuth 2.0 authentication](auth-oauth2.md)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [OIDC authentication](auth-oidc.md)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [Password based SSO authentication](auth-password-based-sso.md )| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [RADIUS authentication]( auth-radius.md)| ![check mark](./media/authentication-patterns/check.png)| | ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [Remote Desktop Gateway services](auth-remote-desktop-gateway.md)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [SAML authentication](auth-saml.md)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |
| [Windows Authentication - Kerberos Constrained Delegation](auth-kcd.md)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |


 
## Synchronization patterns

The following table presents synchronization patterns and their capabilities. Select the name of a pattern to see

* A detailed description

* When to use it

* Architectural diagram

* Explanation of system components

* Links for how to implement the integration



| Synchronization pattern| Directory synchronization| User provisioning |
| - | - | - |
| [Directory synchronization](sync-directory.md)| ![check mark](./media/authentication-patterns/check.png)|  |
| [LDAP Synchronization](sync-ldap.md)| ![check mark](./media/authentication-patterns/check.png)|  |
| [SCIM synchronization](sync-scim.md)| ![check mark](./media/authentication-patterns/check.png)| ![check mark](./media/authentication-patterns/check.png) |

