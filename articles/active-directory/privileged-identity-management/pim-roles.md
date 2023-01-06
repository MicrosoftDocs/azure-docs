---
title: Roles you cannot manage in Privileged Identity Management - Azure Active Directory | Microsoft Docs
description: Describes the roles you cannot manage in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: amsliu
manager: amycolannino
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: pim
ms.date: 06/27/2022
ms.author: amsliu
ms.reviewer: shaunliu
ms.custom: pim ; H1Hack27Feb2017;oldportal;it-pro;
ms.collection: M365-identity-device-management
---

# Roles you can't manage in Privileged Identity Management

You can manage just-in-time assignments to all [Azure AD roles](../roles/permissions-reference.md) and all [Azure roles](../../role-based-access-control/built-in-roles.md) using Privileged Identity Management (PIM) in Azure Active Directory (Azure AD), part of Microsoft Entra. Azure roles include built-in and custom roles attached to your management groups, subscriptions, resource groups, and resources. However, there are few roles that you can't manage. This article describes the roles you can't manage in Privileged Identity Management.

## Classic subscription administrator roles

You cannot manage the following classic subscription administrator roles in Privileged Identity Management:

- Account Administrator
- Service Administrator
- Co-Administrator

For more information about the classic subscription administrator roles, see [Classic subscription administrator roles, Azure roles, and Azure AD administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md).

## What about Microsoft 365 admin roles?

We support all Microsoft 365 roles in the Azure AD Roles and Administrators portal experience, such as Exchange Administrator and SharePoint Administrator, but we don't support specific roles within Exchange RBAC or SharePoint RBAC. For more information about these Microsoft 365 services, see [Microsoft 365 admin roles](/office365/admin/add-users/about-admin-roles).

> [!NOTE]
> - Eligible users for the SharePoint administrator role, the Device administrator role, and any roles trying to access the Microsoft Security & Compliance Center might experience delays of up to a few hours after activating their role. We are working with those teams to fix the issues.
> - For information about delays activating the Azure AD Joined Device Local Administrator role, see [How to manage the local administrators group on Azure AD joined devices](../devices/assign-local-admin.md#manage-the-device-administrator-role).

## Next steps

- [Assign Azure AD roles in Privileged Identity Management](pim-how-to-add-role-to-user.md)
- [Assign Azure resource roles in Privileged Identity Management](pim-resource-roles-assign-roles.md)
