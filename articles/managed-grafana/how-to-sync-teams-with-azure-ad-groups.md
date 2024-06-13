---
title: Create Grafana teams with Microsoft Entra groups
description: Learn how to set up Grafana teams and allow access to Grafana folders and dashboards using Microsoft Entra groups in Azure Managed Grafana.
#customer intent: As a Grafana administrator, I want to set up a Grafana team using Microsoft Entra groups to allow access to specific folders and dashboards. 
ms.service: managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 06/7/2024
--- 

# Create and manage Grafana teams with Microsoft Entra groups

In this guide, you learn how to use Microsoft Entra groups with [Grafana Team Sync](https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/configure-team-sync/) to set dashboard permissions in Azure Managed Grafana.

Grafana allows you to control access to its resources at multiple levels. In Azure Managed Grafana, you use the built-in Azure role-based access control(RBAC) roles for Grafana to define access rights users have. These permissions are applied to all resources in your Grafana workspace by default. You can't, for example, grant someone edit permission to only one particular dashboard with RBAC. If you assign a user to the Grafana Editor role, that user can make changes to any dashboard in your Grafana workspace. Using Grafana's [granular permission model](https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/configure-team-sync/), you can elevate or demote a user's default permission level for specific dashboards, or dashboard folders.

Managed Grafana stores the user assignments for its built-in RBAC roles in Microsoft Entra ID. For performance reasons, it doesn't automatically synchronize the user assignments to Grafana workspaces. Users in these roles don't show up in Grafana's **Configuration** UI until they've signed in once. You can only grant users extra permissions after they appear in the Grafana user list in **Configuration**. Microsoft Entra group sync gets around this issue. With this feature, you create a *Grafana team* in your Grafana workspace linked with a Microsoft Entra group. You then configure your dashboard permissions for that team. For example, you can grant a Grafana viewer the ability to modify a dashboard, or block a Grafana editor from being able to make changes.

Setting up Microsoft Entra group sync is done by following these steps in a given Azure Managed Grafana workspace:

1. Assign a Grafana role to a Microsoft Entra Group
1. Create a Grafana team in an Azure Managed Grafana workspace
1. Assign the Microsoft Entra group in the Grafana team
1. In the Grafana UI, assign permissions at the folder or dashboard level

<a name='set-up-azure-ad-group-sync'></a>

## Prerequisites

To follow the steps in this guide, you must have:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If needed, [create a new instance](quickstart-managed-grafana-portal.md).
- A Microsoft Entra group. If needed, [create a basic group and add members](/entra/fundamentals/how-to-manage-groups.md#create-a-basic-group-and-add-members).

## Give the Microsoft Entra group the required permission on the Grafana instance

The Microsoft Entra group must have a Grafana role to access the Grafana instance.

1. In your Grafana workspace, open the **Access control (IAM)** menu select **Add** > **Add new role assignment**.

    :::image type="content" source="media/azure-ad-group-sync/add-role-assignment.png" alt-text="Screenshot of the Azure portal. Adding a new role assignment.":::

1. Assign a role, such as **Grafana viewer**, to the Microsoft Entra group.

For more information about assigning a role, go to [Grant access](../role-based-access-control/quickstart-assign-role-user-portal.md#grant-access).

### Create a Grafana team

Set up a Microsoft Entra ID-backed Grafana team.

1. In the Azure portal, open your Grafana instance and select **Configuration** under **Settings**.
1. Select the **Microsoft Entra Team Sync Settings** tab.
1. Select **Create new Grafana team**.

    :::image type="content" source="media/azure-ad-group-sync/team-sync-settings.png" alt-text="Screenshot of the Azure portal. Configuring Microsoft Entra team sync.":::

1. Enter a name for the Grafana team and select **Add**.

    :::image type="content" source="media/azure-ad-group-sync/create-new-grafana-team.png" alt-text="Screenshot of the Azure portal. Creating a new Grafana team.":::

### Assign a Microsoft Entra group to a Grafana team

1. In **Assign access to**, select the newly created Grafana team.
1. Select **+ Add a Microsoft Entra group**.

1. In the search box, enter a Microsoft Entra group name and select the group name in the results. Click **Select** to confirm.

    :::image type="content" source="media/azure-ad-group-sync/select-azure-ad-group.png" alt-text="Screenshot of the Azure portal. Finding and selecting a Microsoft Entra group.":::

1. Optionally repeat the previous three steps to add more Microsoft Entra groups to the Grafana team as appropriate.

### Assign access to a Grafana folder or dashboard

1. In the Grafana UI, open a folder or a dashboard.
1. In the **Permissions** tab, select **Add a permission**.

    :::image type="content" source="media/azure-ad-group-sync/add-permission.png" alt-text="Screenshot of the Azure portal, selecting Add a permission." lightbox="media/azure-ad-group-sync/add-permission.png":::

1. Under **Add permission for**, select **Team**, then select the team name, the **View**, **Edit** or **Admin** permission, and save. You can add permissions for a user, a team or a role.

    :::image type="content" source="media/azure-ad-group-sync/add-permission-for-team.png" alt-text="Screenshot of the Grafana UI, adding a permission for a team in a Grafana folder.":::

> [!TIP]
> To check existing access permissions for a dashboard, open a dashboard and go to the **Permissions** tab. This page shows all permissions assigned for this dashboard and all inherited permissions.

:::image type="content" source="media/azure-ad-group-sync/view-permissions.png" alt-text="Screenshot of the Grafana UI, adding a permission for a team in a Grafana folder.":::


### Scope down access

You can scale down access by removing permissions to access one or more folders.

For example, if a user, group of users has the Grafana Viewer role on a Grafana instance, disable their access to a folder by following these steps:

1. In the Grafana UI, go to a folder you want to hide from the user
1. In the **Permissions** tab, select the **X** button to the right of the **Viewer** permission to remove this permission from this folder.
1. Repeat this step for all folders you want to hide from the user.

    :::image type="content" source="media/azure-ad-group-sync/remove-permission.png" alt-text="Screenshot of the Grafana UI, removing the Viewer permission in a Grafana folder.":::

<a name='remove-azure-ad-group-sync'></a>

## Remove Microsoft Entra group sync

If you no longer need a Grafana team, follow these steps to delete it. Deleting a Grafana team also removes the link to the Microsoft Entra group.

1. In the Azure portal, open your Azure Managed Grafana workspace.
1. Select **Administration > Teams**.
1. Select the **X** button to the right of a team you're deleting.

    :::image type="content" source="media/azure-ad-group-sync/remove-azure-ad-group-sync.png" alt-text="Screenshot of the Grafana platform. Removing a Grafana team.":::

1. Select **Delete** to confirm.

## Next steps

In this how-to guide, you learned how to set up Grafana teams backed by Microsoft Entra groups. To learn how to use teams to control access to dashboards in your workspace, see [Manage dashboard permissions](https://grafana.com/docs/grafana/latest/administration/user-management/manage-dashboard-permissions/).
