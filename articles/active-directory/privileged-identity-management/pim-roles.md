---
title: Roles you can manage in PIM - Azure | Microsoft Docs
description: Describes the Azure AD directory roles and Azure resource roles you can manage in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.component: pim
ms.date: 01/16/2019
ms.author: rolyon
ms.custom: pim ; H1Hack27Feb2017;oldportal;it-pro;
---

# Roles you can manage in PIM

Azure AD Privileged Identity Management (PIM) enables you to manage almost all roles in Azure. There are a few roles that you can't manage in PIM. This article describes the roles you can manage.

## Azure AD directory roles

PIM enables you to manage all Azure AD directory roles. Here is a partial list:

- Global Administrator (also known as Company Administrator)
- Billing Administrator
- Exchange Administrator
- Password Administrator
- Privileged Role Administrator
- Security Administrator
- SharePoint Administrator
- Skype for Business Administrator
- User Administrator

Privileged Role Administrator is role you use to manage PIM and update role assignments for other users. If you want to grant another user access to manage PIM, see [Grant access to other administrators to manage PIM](pim-how-to-give-access-to-pim.md).

For a complete list of Azure AD directory roles you can manage in PIM, see [Administrator role permissions in Azure Active Directory](../users-groups-roles/directory-assign-admin-roles.md).

## Azure resource roles

PIM enables you to manage all Azure resource roles (also known as [Azure role-based access control (RBAC) roles](../../role-based-access-control/overview.md)). This includes built-in roles and your custom roles attached to your management groups, subscriptions, resource groups and resources. Here is a partial list:

- Owner
- Contributor
- Reader
- Billing Reader
- Key Vault Contributor
- Security Admin
- Storage Account Contributor
- User Access Administrator
- Virtual Machine Contributor

For a complete list of Azure resources roles you can manage in PIM, see [Built-in roles for Azure resources](../../role-based-access-control/built-in-roles.md).

## Roles not managed in PIM

You cannot manage the following classic subscription administrator roles in PIM:

- Account Administrator
- Service Administrator
- Co-Administrator

For more information about the classic subscription administrator roles, see [Classic subscription administrator roles, Azure RBAC roles, and Azure AD administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md)

## What about Office 365 admin roles?

Roles within Exchange Online or SharePoint Online, except for those mentioned above, are not represented in Azure AD and so cannot be managed in PIM. For more information on changing fine-grained role assignments in these Office 365 services, see [Office 365 admin roles](https://docs.microsoft.com/office365/admin/add-users/about-admin-roles).

## Next steps

- [Start using PIM](pim-getting-started.md)
- [Assign Azure AD directory roles in PIM](pim-how-to-add-role-to-user.md)
- [Assign Azure resource roles in PIM](pim-resource-roles-assign-roles.md)
