---
title: Create Grafana teams with Microsoft Entra groups
description: Learn how to set up Grafana teams using Microsoft Entra groups in Azure Managed Grafana
ms.service: managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 06/7/2024
--- 

# Create Grafana teams with Microsoft Entra groups

In this guide, you learn how to use Microsoft Entra groups with [Grafana Team Sync](https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/configure-team-sync/) (Microsoft Entra group sync) to set dashboard permissions in Azure Managed Grafana. Grafana allows you to control access to its resources at multiple levels. In Managed Grafana, you use the built-in Azure RBAC roles for Grafana to define access rights users have. These permissions are applied to all resources in your Grafana workspace by default. You can't, for example, grant someone edit permission to only one particular dashboard with RBAC. If you assign a user to the Grafana Editor role, that user can make changes to any dashboard in your Grafana workspace. Using Grafana's [granular permission model](https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/configure-team-sync/), you can elevate or demote a user's default permission level for specific dashboards (or dashboard folders).

Setting up dashboard permissions for individual users in Managed Grafana is a little tricky. Managed Grafana stores the user assignments for its built-in RBAC roles in Microsoft Entra ID. For performance reasons, it doesn't automatically synchronize the user assignments to Grafana workspaces. Users in these roles don't show up in Grafana's **Configuration** UI until they've signed in once. You can only grant users extra permissions after they appear in the Grafana user list in **Configuration**. Microsoft Entra group sync gets around this issue. With this feature, you create a *Grafana team* in your Grafana workspace linked with a Microsoft Entra group. You then use that team in configuring your dashboard permissions. For example, you can grant a viewer the ability to modify a dashboard or block an editor from being able to make changes. You don't need to manage the team's member list separately since its membership is already defined in the associated Microsoft Entra group.

<a name='set-up-azure-ad-group-sync'></a>

## Prerequisites

To follow the steps in this guide, you must have:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If needed, [create a new instance](quickstart-managed-grafana-portal.md).
- A Microsoft Entra group. I needed, [create a basic group and add members](/entra/fundamentals/how-to-manage-groups#create-a-basic-group-and-add-members).

## Set up Microsoft Entra group sync

To use Microsoft Entra group sync, you assign a Grafana role to a Microsoft Entra Group, create a Grafana team, and link this Microsoft Entra group to this 

group to add a team to your Grafana workspace, and link this team to an existing Microsoft Entra group through its group ID.

##  Give this group the desired permission on the Grafana instance.

The Microsoft Entra group must have a Grafana role to access the Grafana instance.

    1. In your Grafana workspace, open the **Access control (IAM)** menu select **Add** > **Add new role assignment**.
    1. Assign a role, such as **Grafana viewer**, to the Microsoft Entra group

### Create a Grafana team

Follow these steps to set up a Microsoft Entra ID-backed Grafana team.

1. In the Azure portal, open your Grafana instance and select **Configuration** under *Settings*.
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

1. Repeat the previous three steps to add more Microsoft Entra groups to the Grafana team as appropriate.

### Scope down access to a specific folder

To scope down access to a specific folder, remove permissions to all other folders.

1. Decide which Microsoft Entra group will have access to the folder and give this group the desired permission on the Grafana instance.
    1. In your Grafana workspace, open the **Access control (IAM)** menu select **Add** > **Add new role assignment**.
    1. Select a role such as **Grafana Viewer**.
    1. Assign access to the group of your choice.
1. Add group In Azure portal, use the Microsoft Entra Team Sync Settings page add an AAD group into Grafana Team. This will map users in an AAD group to a Grafana Team.
- In Grafana, grant this AAD group view permission to a folder
- Remove the view permission for view role on all other folders, that way having ‘Grafana Viewer’ role still doesn’t mean they get read access to all other folders.

You can actually map multiple AAD groups to a single Grafana team, effectively granting multiple AAD groups view permission with just one Grafana team.

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
