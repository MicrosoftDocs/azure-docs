---
title: Best practices for Azure AD roles - Azure Active Directory
description: Best practices for using Azure Active Directory roles.
services: active-directory
author: rolyon
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: conceptual
ms.date: 03/04/2021
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Best practices for Azure AD roles

This article describes some best practices for using Azure Active Directory roles. These best practices are derived from our experience with Azure AD roles and the experiences of customers like yourself.

## Limit use of Global Administrator

Users who are assigned to the Global Administrator role can read and modify every administrative setting in your Azure AD organization. By default, when a user signs up for a Microsoft cloud service, an Azure AD tenant is created and the user is made a member of the Global Administrators role. When you add a subscription to an existing tenant, you aren't assigned to the Global Administrator role. Only Global Administrators and Privileged Role administrators can delegate administrator roles. To reduce the risk to your business, we recommend that you assign this role to the fewest possible people in your organization.

As a best practice, we recommend that you assign this role to fewer than five people in your organization. If you have more than five admins assigned to the Global Administrator role in your organization, here are some ways to reduce its use.


## Next steps

- [Securing privileged access for hybrid and cloud deployments in Azure AD](security-planning.md)