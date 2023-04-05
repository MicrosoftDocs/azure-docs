---
title: Azure Active Directory synchronization protocol overview
description: Architectural guidance on integrating Azure AD with legacy synchronization protocols
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

# Azure Active Directory integrations with synchronization protocols

Microsoft Azure Active Directory (Azure AD) enables integration with many synchronization protocols. The synchronization integrations enable you to sync user and group data to Azure AD, and then user Azure AD management capabilities. Some sync patterns also enable automated provisioning.

## Synchronization patterns

The following table presents Azure AD integration with synchronization patterns and their capabilities. Select the name of a pattern to see

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
