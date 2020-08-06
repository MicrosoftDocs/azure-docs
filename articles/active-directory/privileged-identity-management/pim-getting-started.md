---
title: Start using PIM - Azure Active Directory | Microsoft Docs
description: Learn how to enable and get started using Azure AD Privileged Identity Management (PIM) in the Azure portal.
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.subservice: pim
ms.topic: how-to
ms.workload: identity
ms.date: 04/23/2020
ms.author: curtand
ms.custom: pim  
ms.collection: M365-identity-device-management
---
# Start using Privileged Identity Management

This article describes how to enable Privileged Identity Management (PIM) and get started using it.

Use Privileged Identity Management (PIM) to manage, control, and monitor access within your Azure Active Directory (Azure AD) organization. With PIM you can provide as-needed and just-in-time access to Azure resources, Azure AD resources, and other Microsoft online services like Office 365 or Microsoft Intune.

## Prerequisites

To use Privileged Identity Management, you must have one of the following licenses:

- Azure AD Premium P2
- Enterprise Mobility + Security (EMS) E5

For more information, see [License requirements to use Privileged Identity Management](subscription-requirements.md).

## Prepare PIM for Azure AD roles

Once you have enabled Privileged Identity Management for your directory, you can prepare Privileged Identity Management to manage Azure AD roles.

Here are the tasks we recommend for you to prepare for Azure AD roles, in order:

1. [Configure Azure AD role settings](pim-how-to-change-default-settings.md).
1. [Give eligible assignments](pim-how-to-add-role-to-user.md).
1. [Allow eligible users to activate their Azure AD role just-in-time](pim-how-to-activate-role.md).

## Prepare PIM for Azure roles

Once you have enabled Privileged Identity Management for your directory, you can prepare Privileged Identity Management to manage Azure roles for Azure resource access on a subscription.

Here are the tasks we recommend for you to prepare for Azure roles, in order:

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
| **My requests** | Displays your pending requests to activate eligible role assignments. |
| **Approve requests** | Displays a list of requests to activate eligible roles by users in your directory that you are designated to approve. |
| **Review access** | Lists active access reviews you are assigned to complete, whether you're reviewing access for yourself or someone else. |
| **Azure AD roles** | Displays a dashboard and settings for Privileged role administrators to manage Azure AD role assignments. This dashboard is disabled for anyone who isn't a privileged role administrator. These users have access to a special dashboard titled My view. The My view dashboard only displays information about the user accessing the dashboard, not the entire organization. |
| **Azure resources** | Displays a dashboard and settings for Privileged role administrators to manage Azure resource role assignments. This dashboard is disabled for anyone who isn't a privileged role administrator. These users have access to a special dashboard titled My view. The My view dashboard only displays information about the user accessing the dashboard, not the entire organization. |

## Add a PIM tile to the dashboard

To make it easier to open Privileged Identity Management, add a PIM tile to your Azure portal dashboard.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **All services** and find the **Azure AD Privileged Identity Management** service.

    ![Azure AD Privileged Identity Management in All services](./media/pim-getting-started/pim-all-services-find.png)

1. Select the Privileged Identity Management Quickstart.

1. Check **Pin blade to dashboard** to pin the Privileged Identity Management Quickstart blade to the dashboard.

    ![Pushpin icon to pin Privileged Identity Management blade to dashboard](./media/pim-getting-started/pim-quickstart-pin-to-dashboard.png)

    On the Azure dashboard, you'll see a tile like this:

    ![Privileged Identity Management Quickstart tile on dashboard](./media/pim-getting-started/pim-quickstart-dashboard-tile.png)

## Next steps

- [Assign Azure AD roles in Privileged Identity Management](pim-how-to-add-role-to-user.md)
- [Manage Azure resource access in Privileged Identity Management](pim-resource-roles-discover-resources.md)
