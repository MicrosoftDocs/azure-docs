---
title: Roles you cannot manage in Privileged Identity Management - Azure Active Directory | Microsoft Docs
description: Describes the roles you cannot manage in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: pim
ms.date: 05/11/2020
ms.author: curtand
ms.custom: pim ; H1Hack27Feb2017;oldportal;it-pro;
ms.collection: M365-identity-device-management
---

# Roles you can't manage in Privileged Identity Management

Azure Active Directory (Azure AD) Privileged Identity Management (PIM) enables you to manage all [Azure AD roles](../users-groups-roles/directory-assign-admin-roles.md) and all [Azure roles](../../role-based-access-control/built-in-roles.md). Azure roles can also include your custom roles attached to your management groups, subscriptions, resource groups, and resources. However, there are few roles that you cannot manage. This article describes the roles you can't manage in Privileged Identity Management.

## Classic subscription administrator roles

You cannot manage the following classic subscription administrator roles in Privileged Identity Management:

- Account Administrator
- Service Administrator
- Co-Administrator

For more information about the classic subscription administrator roles, see [Classic subscription administrator roles, Azure RBAC roles, and Azure AD administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md).

## What about Office 365 admin roles?

We support all Office365 roles in the Azure AD Roles and Administrators portal experience, such as Exchange Administrator and SharePoint Administrator, but we don't support specific roles within Exchange RBAC or SharePoint RBAC. For more information about these Office 365 services, see [Office 365 admin roles](https://docs.microsoft.com/office365/admin/add-users/about-admin-roles).

> [!NOTE]
> Eligible users for the SharePoint administrator role, the Device administrator role, and any roles trying to access the Microsoft Security and Compliance Center might experience delays of up to a few hours after activating their role. We are working with those teams to fix the issues.

## Next steps

- [Assign Azure AD roles in Privileged Identity Management](pim-how-to-add-role-to-user.md)
- [Assign Azure resource roles in Privileged Identity Management](pim-resource-roles-assign-roles.md)
