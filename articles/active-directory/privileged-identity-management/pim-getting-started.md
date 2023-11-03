---
title: Start using PIM
description: Learn how to enable and get started using Privileged Identity Management (PIM) in the Microsoft Entra admin center.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: ''

ms.service: active-directory
ms.subservice: pim
ms.topic: how-to
ms.workload: identity
ms.date: 09/13/2023
ms.author: barclayn
ms.reviewer: shaunliu
ms.custom: pim  
ms.collection: M365-identity-device-management
---
# Start using Privileged Identity Management

This article describes how to enable Privileged Identity Management (PIM) and get started using it.

Use Privileged Identity Management (PIM) to manage, control, and monitor access within your Microsoft Entra organization. With PIM you can provide as-needed and just-in-time access to Azure resources, Microsoft Entra resources, and other Microsoft online services like Microsoft 365 or Microsoft Intune.

## Prerequisites

To use Privileged Identity Management, you must have one of the following licenses:

- [!INCLUDE [entra-id-license-pim.md](../../../includes/entra-id-license-pim.md)]


For more information, see [License requirements to use Privileged Identity Management](../governance/licensing-fundamentals.md).

> [!Note]
> When a user who is active in a privileged role in a Microsoft Entra organization with a Premium P2 license goes to **Roles and administrators** in Microsoft Entra ID and selects a role (or even just visits Privileged Identity Management):
>
> - We automatically enable PIM for the organization
> - Their experience is now that they can either assign a "regular" role assignment or an eligible role assignment
>
> When PIM is enabled it doesn't have any other effect on your organization that you need to worry about. It gives you additional assignment options such as active vs eligible with start and end time. PIM also enables you to define scope for role assignments using Administrative Units and custom roles. If you are a Global Administrator or Privileged Role Administrator, you might start getting a few additional emails like the PIM weekly digest. You might also see MS-PIM service principal in the audit log related to role assignment. This is an expected change that should have no effect on your workflow.

<a name='prepare-pim-for-azure-ad-roles'></a>

## Prepare PIM for Microsoft Entra roles

Here are the tasks we recommend for you to prepare Privileged Identity Management to manage Microsoft Entra roles:

1. [Configure Microsoft Entra role settings](pim-how-to-change-default-settings.md).
1. [Give eligible assignments](pim-how-to-add-role-to-user.md).
1. [Allow eligible users to activate their Microsoft Entra role just-in-time](pim-how-to-activate-role.md).

## Prepare PIM for Azure roles

Here are the tasks we recommend for you to prepare Privileged Identity Management to manage Azure roles for a subscription:

1. [Discover Azure resources](pim-resource-roles-discover-resources.md)
1. [Configure Azure role settings](pim-resource-roles-configure-role-settings.md).
1. [Give eligible assignments](pim-resource-roles-assign-roles.md).
1. [Allow eligible users to activate their Azure roles just-in-time](pim-resource-roles-activate-your-roles.md).

## Navigate to your tasks

Once Privileged Identity Management is set up, you can learn your way around.

![Navigation window in Privileged Identity Management showing Tasks and Manage options](./media/pim-getting-started/pim-quickstart-tasks.png)

| Task + Manage | Description |
| --- | --- |
| **My roles**  | Displays a list of eligible and active roles assigned to you. This is where you can activate any assigned eligible roles. |
| **Pending requests** | Displays your pending requests to activate eligible role assignments. |
| **Approve requests** | Displays a list of requests to activate eligible roles by users in your directory that you are designated to approve. |
| **Review access** | Lists active access reviews you are assigned to complete, whether you're reviewing access for yourself or someone else. |
| **Microsoft Entra roles** | Displays a dashboard and settings for Privileged role administrators to manage Microsoft Entra role assignments. This dashboard is disabled for anyone who isn't a privileged role administrator. These users have access to a special dashboard titled My view. The My view dashboard only displays information about the user accessing the dashboard, not the entire organization. |
| **Azure resources** | Displays a dashboard and settings for Privileged role administrators to manage Azure resource role assignments. This dashboard is disabled for anyone who isn't a privileged role administrator. These users have access to a special dashboard titled My view. The My view dashboard only displays information about the user accessing the dashboard, not the entire organization. |


## Next steps

- [Assign Microsoft Entra roles in Privileged Identity Management](pim-how-to-add-role-to-user.md)
- [Manage Azure resource access in Privileged Identity Management](pim-resource-roles-discover-resources.md)
