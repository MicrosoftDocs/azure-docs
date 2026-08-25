---
title: Configure Grafana Team Sync with Microsoft Entra groups
description: Learn how to configure Grafana Teams and allow access to Grafana folders and dashboards using Microsoft Entra groups in Azure Managed Grafana.
#customer intent: As a Grafana administrator, I want to use Microsoft Entra groups to set up Grafana teams and control access to specific folders and dashboards.
ms.service: azure-managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 08/21/2026
ai-usage: ai-assisted
--- 

# Configure Grafana Team Sync with Microsoft Entra groups

In this guide, you learn how to use Microsoft Entra groups with [Grafana Team Sync](https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/configure-team-sync/) to manage dashboard permissions in Azure Managed Grafana.

In Azure Managed Grafana, Azure role-based access control (RBAC) roles grant access to the workspace and map users to Grafana roles. By default, roles such as Grafana Viewer and Grafana Editor provide access across the workspace. Grafana folder and dashboard permissions let you adjust this access for specific resources. For example, you can grant the Viewer role permission to edit a dashboard or change the dashboard permission for the Editor role from Edit to View.

Microsoft Entra group sync helps you manage these permissions at scale. Create a *Grafana team*, link it to a Microsoft Entra group, and assign folder or dashboard permissions to the team. When group membership changes, Grafana synchronizes the corresponding team membership.

<a name='set-up-azure-ad-group-sync'></a>

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Managed Grafana workspace. If needed, [create a new workspace](quickstart-managed-grafana-portal.md).
- A Microsoft Entra group. If needed, [create a basic group and add members](/entra/fundamentals/how-to-manage-groups#create-a-basic-group-and-add-members).
- The Grafana Admin role on the workspace, which is required to manage Grafana teams and permissions.
- Permission to create Azure role assignments on the workspace, such as [Role Based Access Control Administrator](../role-based-access-control/built-in-roles/privileged.md#role-based-access-control-administrator) or [User Access Administrator](../role-based-access-control/built-in-roles/privileged.md#user-access-administrator).

## Assign a Grafana role to a Microsoft Entra group

The Microsoft Entra group must have a Grafana role to access the Grafana workspace.

1. In the Azure portal, open your Grafana workspace, and then select **Access control (IAM)**.
1. Select **Add** > **Add role assignment**.

   :::image type="content" source="media/azure-ad-group-sync/add-role-assignment.png" alt-text="Screenshot of the Azure portal. Adding a new role assignment.":::

1. Assign a Grafana role to the Microsoft Entra group. To restrict members to selected folders and dashboards, assign **Grafana Limited Viewer**. For workspace-wide view access, assign **Grafana Viewer**. For detailed steps, see [Assign a Grafana role](how-to-manage-access-permissions-users-identities.md#assign-a-grafana-role).

After you assign a Grafana role to the Microsoft Entra group, choose one of the following methods to create and link a Grafana team.

## Create and link a Grafana team in the Azure portal

1. In the Azure portal, open your Grafana workspace. In the left menu, select **Settings** > **Configuration**.
1. Select **Microsoft Entra Team Sync Settings**.
1. Select **Create new Grafana team**.

   :::image type="content" source="media/azure-ad-group-sync/team-sync-settings.png" alt-text="Screenshot of the Azure portal. Configuring Microsoft Entra Team Sync.":::

1. Enter a name for the Grafana team and select **Add**.

   :::image type="content" source="media/azure-ad-group-sync/create-new-grafana-team.png" alt-text="Screenshot of the Azure portal. Creating a new Grafana team.":::

1. In **Assign access to**, select the newly created Grafana team.
1. Select **+ Add a Microsoft Entra group**.

1. In the search box, enter a Microsoft Entra group name and select the group name in the results. Choose **Select** to confirm.

   :::image type="content" source="media/azure-ad-group-sync/select-azure-ad-group.png" alt-text="Screenshot of the Azure portal. Finding and selecting a Microsoft Entra group.":::

1. Optionally repeat the previous three steps to add more Microsoft Entra groups to the Grafana team.

## Create and link a Grafana team in the Grafana UI

1. In the Azure portal, open your Azure Managed Grafana workspace and select the **Endpoint** link to open the Grafana UI.
1. In the Grafana UI, select **Administration** > **Users and Access** > **Teams**.
1. Select **New team**.
   :::image type="content" source="media/azure-ad-group-sync/create-new-team.png" alt-text="Screenshot of the Grafana UI, selecting the New team action." lightbox="media/azure-ad-group-sync/create-new-team.png":::
1. Enter a team name and, optionally, an email address, and then select **Create**.
1. Open the team, and then select **External group sync**.
1. Select **Add group**.
      :::image type="content" source="media/azure-ad-group-sync/add-group.png" alt-text="Screenshot of the Grafana UI, selecting the Add group action.":::
1. In the Azure portal, open the Microsoft Entra group that you want to link. On the group's **Overview** page, copy its **Object ID**.
1. Return to the Grafana UI, paste the object ID into **External group**, and then select **Add group**.
1. Verify that Grafana displays a success notification and lists the group ID under **External group sync**.

After a user in the linked Microsoft Entra group signs in to the Grafana workspace, Grafana adds the user to the team.Synchronization might take a few minutes.

## Assign access to a Grafana folder or dashboard

1. In the Grafana UI, open a folder or a dashboard.
1. Select **Settings**.
1. On the **Permissions** tab, select **Add a permission**.

   :::image type="content" source="media/azure-ad-group-sync/add-permission.png" alt-text="Screenshot of the Grafana UI, selecting Add a permission." lightbox="media/azure-ad-group-sync/add-permission.png":::

1. Under **Add permission for**, select **Team**. Select the team name and the **View**, **Edit**, or **Admin** permission, and then save the permission.

   :::image type="content" source="media/azure-ad-group-sync/add-permission-for-team.png" alt-text="Screenshot of the Grafana UI, adding a permission for a team in a Grafana folder.":::

   > [!IMPORTANT]
   > Grafana applies the highest permission granted through a role, user, team, or parent folder. Assigning a lower permission to a user or team doesn't override a higher permission. To reduce access, change or remove the higher permission that grants it. You can't restrict Grafana Admin access.

   > [!TIP]
   > To check existing access permissions for a dashboard, open a dashboard and go to the **Permissions** tab. This page shows all permissions assigned for this dashboard and all inherited permissions.
   >
   > :::image type="content" source="media/azure-ad-group-sync/view-permissions.png" alt-text="Screenshot of the Grafana UI, showing permission for a Grafana dashboard.":::

### Restrict Grafana Viewer access

Users with the Grafana Viewer role can view all folders by default. To hide a folder from all users with this role, remove the **Viewer** permission from the folder. This change affects all Grafana Viewers, not only members of the synchronized Microsoft Entra group.

If group members have the Grafana Limited Viewer role, skip this procedure. They can access only the folders and dashboards that you explicitly grant them permission to view.

1. In the Grafana UI, go to a folder you want to hide from Grafana Viewers.
1. In the **Permissions** tab, select the **X** button to the right of the **Viewer** permission to remove this permission from this folder.
1. Repeat this step for all folders you want to hide from Grafana Viewers.

   :::image type="content" source="media/azure-ad-group-sync/remove-permission.png" alt-text="Screenshot of the Grafana UI, removing the Viewer permission in a Grafana folder.":::

<a name='remove-azure-ad-group-sync'></a>

## Remove a Grafana team

If you no longer need a Grafana team, follow these steps to delete it. Deleting a Grafana team also removes the link to the Microsoft Entra group.

1. In the Grafana UI, select **Administration** > **Users and Access** > **Teams**.
1. Select the **X** button to the right of a team you're deleting.

   :::image type="content" source="media/azure-ad-group-sync/remove-azure-ad-group-sync.png" alt-text="Screenshot of the Grafana platform. Removing a Grafana team.":::

1. Select **Delete** to confirm.

## Stop synchronizing a Microsoft Entra group

Remove the external group link when you no longer want the Microsoft Entra group to determine membership in the Grafana team.

1. In the Grafana UI, select **Administration** > **Users and Access** > **Teams**.
1. Open the team, and then select **External group sync**.
1. Select the **X** button next to the group ID that you want to unlink.
1. Verify that Grafana displays a success notification and removes the group ID from the list.

After users from the unlinked Microsoft Entra group sign in to the Grafana workspace, Grafana removes them from the team. Synchronization might take a few minutes.

> [!NOTE]
> Unlinking a Microsoft Entra group from a Grafana team doesn’t remove the group’s Azure role assignment on the workspace. To revoke  access, remove the applicable Azure role assignment for the group.

## Next step

In this how-to guide, you learned how to set up Grafana teams backed by Microsoft Entra groups. To learn how to use teams to control access to dashboards in your workspace, see [Manage dashboard permissions](https://grafana.com/docs/grafana/latest/administration/user-management/manage-dashboard-permissions/).
