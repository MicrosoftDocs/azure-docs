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
ms.date: 12/19/2018
ms.author: rolyon
ms.custom: pim ; H1Hack27Feb2017;oldportal;it-pro;
---

# Roles you can manage in PIM

Azure AD Privileged Identity Management (PIM) enables you to manage almost all roles in Azure. There are a few roles that you can't manage in PIM. This article describes the roles you can manage.

## Azure AD directory roles you can manage in PIM

PIM enables you to manage all Azure AD directory roles. Here is a partial list:

- Global Administrator (also known as Company Administrator)
- Privileged Role Administrator
- Billing Administrator
- Password Administrator
- User Administrator
- Exchange Administrator
- SharePoint Service Administrator
- Skype for Business Administrator

Privileged Role Administrator is role you use to manage PIM and updates role assignments for other users. If you want to grant another user access to manage PIM, see [Grant access to other administrators to manage PIM](pim-how-to-give-access-to-pim.md).

For a complete list of Azure AD directory roles you can manage in PIM, see [Administrator role permissions in Azure Active Directory](../users-groups-roles/directory-assign-admin-roles.md).

## Azure resource roles you can manage in PIM

PIM enables you to manage all Azure resource roles (also known as Azure role-based access control (RBAC) roles). This includes built-in roles and your custom roles. Here is a partial list:

- Owner
- Contributor
- Reader
- Billing Reader
- Exchange Administrator
- Key Vault Contributor
- Security Admin
- SharePoint Service Administrator
- Storage Account Contributor
- User Access Administrator
- Virtual Machine Contributor

For a complete list of Azure resources roles you can manage in PIM, see [Built-in roles for Azure resources](../users-groups-roles/directory-assign-admin-roles.md).

## Roles not managed in PIM

You cannot manage the following classic subscription administrator roles in PIM:

- Account Administrator
- Service Administrator
- Co-Administrator

For more information about the classic subscription administrator roles, see [Classic subscription administrator roles, Azure RBAC roles, and Azure AD administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md)

## What about Office 365 admin roles?

Roles within Exchange Online or SharePoint Online, except for those mentioned above, are not represented in Azure AD and so cannot be managed in PIM. For more information on changing fine-grained role assignments in these Office 365 services, see [Office 365 admin roles](https://docs.microsoft.com/office365/admin/add-users/about-admin-roles).

## User roles and signing in

For some Microsoft services and applications, assigning a user to a role may not be sufficient to enable that user to be an administrator.

Access to the Azure portal requires the user be an Owner of an Azure subscription, even if the user does not need to manage the Azure subscriptions.  For example, to manage configuration settings for Azure AD, a user must be both a Global Administrator in Azure AD and an Owner on an Azure subscription.  To learn how to add users to Azure subscriptions, see [Manage access using RBAC and the Azure portal](../../role-based-access-control/role-assignments-portal.md).

Access to Microsoft Online Services may require the user also be assigned a license before they can open the service's portal or perform administrative tasks.

## Next steps

- [Start using PIM](pim-getting-started.md)
- [Assign Azure AD directory roles in PIM](pim-how-to-add-role-to-user.md)

