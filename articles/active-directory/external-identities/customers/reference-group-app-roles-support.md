---
title: Groups and app roles support in customer tenants
description: Find out which core Microsoft Entra features related to the user and group management model and application assignment are available in customer tenants.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: reference
ms.date: 05/01/2023
ms.author: mimart
ms.custom: it-pro
---

# Groups and application roles support

A customer tenant follows the Microsoft Entra user and group management model and application assignment. Many of the core Microsoft Entra features are being phased into customer tenants. The following table shows which features are currently available.

| **Feature** | **Currently available?** |
| ------------ | --------- |
| Create an application role for a resource | Yes, by modifying the application manifest |
| Assign an application role to users | Yes |
| Assign an application role to groups | Yes, via Microsoft Graph only |
| Assign an application role to applications | Yes, via application permissions |
| Assign a user to an application role | Yes |
| Assign an application to an application role (application permission) | Yes |
| Add a group to an application/service principal (groups claim) | Yes, via Microsoft Graph only |
| Create/update/delete a customer (local user) via the Microsoft Entra admin center | Yes |
| Reset a password for a customer (local user) via the Microsoft Entra admin center | Yes |
| Create/update/delete a customer (local user) via Microsoft Graph | Yes |
| Reset a password for a customer (local user) via Microsoft Graph | Yes, only if the service principal is added to the Global administrator role |
| Create/update/delete a security group via the Microsoft Entra admin center | Yes |
| Create/update/delete a security group via the Microsoft Graph API | Yes |
| Change security group members using the Microsoft Entra admin center | Yes |
| Change security group members using the Microsoft Graph API | Yes |
| Scale up to 50,000 users and 50,000 groups | Not currently available |
| Add 50,000 users to at least two groups | Not currently available |
