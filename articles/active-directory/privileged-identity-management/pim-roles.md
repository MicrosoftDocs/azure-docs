---
title: Roles you cannot manage in PIM - Azure | Microsoft Docs
description: Describes the roles you cannot manage in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.component: pim
ms.date: 01/17/2019
ms.author: rolyon
ms.custom: pim ; H1Hack27Feb2017;oldportal;it-pro;
---

# Roles you cannot manage in PIM

Azure AD Privileged Identity Management (PIM) enables you to manage all [Azure AD directory roles](../users-groups-roles/directory-assign-admin-roles.md) and all [Azure resource roles](../../role-based-access-control/built-in-roles.md). This includes your custom roles attached to your management groups, subscriptions, resource groups, and resources. However, there are few roles that you cannot manage. This article describes the roles you cannot manage in PIM.

## Classic subscription administrator roles

You cannot manage the following classic subscription administrator roles in PIM:

- Account Administrator
- Service Administrator
- Co-Administrator

For more information about the classic subscription administrator roles, see [Classic subscription administrator roles, Azure RBAC roles, and Azure AD administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md)

## What about Office 365 admin roles?

Roles within Exchange Online or SharePoint Online, except for Exchange Administrator and SharePoint Administrator, are not represented in Azure AD and so cannot be managed in PIM. For more information on changing fine-grained role assignments in these Office 365 services, see [Office 365 admin roles](https://docs.microsoft.com/office365/admin/add-users/about-admin-roles).

## Next steps

- [Start using PIM](pim-getting-started.md)
- [Assign Azure AD directory roles in PIM](pim-how-to-add-role-to-user.md)
- [Assign Azure resource roles in PIM](pim-resource-roles-assign-roles.md)
