---
title: Discover Azure resources to manage in PIM
description: Learn how to discover Azure resources to manage in Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 09/13/2023
ms.author: barclayn
ms.reviewer: shaunliu
ms.collection: M365-identity-device-management
---

# Discover Azure resources to manage in Privileged Identity Management

You can use Privileged Identity Management (PIM) in Microsoft Entra ID, to improve the protection of your Azure resources. This helps:

- Organizations that already use Privileged Identity Management to protect Microsoft Entra roles
- Management group and subscription owners who are trying to secure production resources

When you first set up Privileged Identity Management for Azure resources, you need to discover and select the resources you want to protect with Privileged Identity Management. When you discover resources through Privileged Identity Management, PIM creates the PIM service principal (MS-PIM) assigned as User Access Administrator on the resource. There's no limit to the number of resources that you can manage with Privileged Identity Management. However, we recommend starting with your most critical production resources.

## Required permissions

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

You can view and manage the management groups or subscriptions to which you have Microsoft.Authorization/roleAssignments/write permissions, such as User Access Administrator or Owner roles. If you aren't a subscription owner, but are a Global Administrator and don't see any Azure subscriptions or management groups to manage, then you can [elevate access to manage your resources](/azure/role-based-access-control/elevate-access-global-admin).

## Discover resources

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Privileged role administrator](../roles/permissions-reference.md#privileged-role-administrator).

1.  Browse to **Identity governance** > **Privileged Identity Management** > **Azure Resources**.

    If this is your first time using Privileged Identity Management for Azure resources, you'll see a **Discover resources** page.

    ![Discover resources pane with no resources listed for first time experience](./media/pim-resource-roles-discover-resources/discover-resources-first-run.png)

    If another administrator in your organization is already managing Azure resources in Privileged Identity Management, you'll see a list of the resources that are currently being managed.

    ![Discover resources pane listing resources that are currently being managed](./media/pim-resource-roles-discover-resources/discover-resources.png)

1. Select **Discover resources** to launch the discovery experience.

    ![Discovery pane lists resources that can be managed, such as subscriptions and management groups](./media/pim-resource-roles-discover-resources/discovery-pane.png)

1. On the **Discovery** page, use **Resource state filter** and **Select resource type** to filter the management groups or subscriptions you have write permission to. It's probably easiest to start with **All** initially.

   You can search for and select management group or subscription resources to manage in Privileged Identity Management. When you manage a management group or a subscription in Privileged Identity Management, you can also manage its child resources.

   > [!Note]
   > When you add a new child Azure resource to a PIM-managed management group, you can bring the child resource under management by searching for it in PIM.

1. Select any unmanaged resources that you want to manage.

1. Select **Manage resource** to start managing the selected resources. The PIM service principal (MS-PIM) is 
assigned as User Access Administrator on the resource.

    > [!NOTE]
    > Once a management group or subscription is managed, it can't be unmanaged. This prevents another resource administrator from removing Privileged Identity Management settings.
     
    ![Discovery pane with a resource selected and the Manage resource option highlighted](./media/pim-resource-roles-discover-resources/discovery-manage-resource.png)

1. If you see a message to confirm the onboarding of the selected resource for management, select **Yes**. PIM will then be configured to manage all the new and existing child objects under the resource(s).

    ![Message confirming to onboard the selected resources for management](./media/pim-resource-roles-discover-resources/discovery-manage-resource-message.png)

## Next steps

- [Configure Azure resource role settings in Privileged Identity Management](pim-resource-roles-configure-role-settings.md)
- [Assign Azure resource roles in Privileged Identity Management](pim-resource-roles-assign-roles.md)
