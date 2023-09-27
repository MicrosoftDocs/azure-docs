---
title: Sync Grafana teams with Azure Active Directory groups
description: Learn how to set up Grafana teams using Azure Active Directory groups in Azure Managed Grafana
ms.service: managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 9/11/2023
--- 

# Sync Grafana teams with Azure Active Directory groups (preview)

In this guide, you learn how to use Azure Active Directory (Azure AD) groups with [Grafana Team Sync](https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/configure-team-sync/) (Azure AD group sync) to set dashboard permissions in Azure Managed Grafana. Grafana allows you to control access to its resources at multiple levels. In Managed Grafana, you use the built-in Azure RBAC roles for Grafana to define access rights users have. These permissions are applied to all resources in your Grafana workspace by default. You can't, for example, grant someone edit permission to only one particular dashboard with RBAC. If you assign a user to the Grafana Editor role, that user can make changes to any dashboard in your Grafana workspace. Using Grafana's [granular permission model](https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/configure-team-sync/), you can elevate or demote a user's default permission level for specific dashboards (or dashboard folders).

Setting up dashboard permissions for individual users in Managed Grafana is a little tricky. Managed Grafana stores the user assignments for its built-in RBAC roles in Azure AD. For performance reasons, it doesn't automatically synchronize the user assignments to Grafana workspaces. Users in these roles don't show up in Grafana's **Configuration** UI until they've signed in once. You can only grant users extra permissions after they appear in the Grafana user list in **Configuration**. Azure AD group sync gets around this issue. With this feature, you create a *Grafana team* in your Grafana workspace linked with an Azure AD group. You then use that team in configuring your dashboard permissions. For example, you can grant a viewer the ability to modify a dashboard or block an editor from being able to make changes. You don't need to manage the team's member list separately since its membership is already defined in the associated Azure AD group.

> [!IMPORTANT]
> Azure AD group sync is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Set up Azure AD group sync

To use Azure AD group sync, you add a new team to your Grafana workspace and link it to an existing Azure AD group through its group ID. Follow these steps to set up an Azure AD-backed Grafana team.

1. In the Azure portal, open your Grafana instance and select **Configuration** under *Settings*.
1. Select the **Azure AD Team Sync Settings** tab.
1. Select **+ Create new Grafana team**.

    :::image type="content" source="media/azure-ad-group-sync/team-sync-settings.png" alt-text="Screenshot of the Azure portal. Configuring Azure AD team sync.":::

1. Enter a name for the Grafana team and select **Add**.

    :::image type="content" source="media/azure-ad-group-sync/create-new-grafana-team.png" alt-text="Screenshot of the Azure portal. Creating a new Grafana team.":::

1. In **Assign access to**, select the newly created Grafana team.
1. Select **+ Add an Azure AD Group**.

    :::image type="content" source="media/azure-ad-group-sync/add-azure-ad-group.png" alt-text="Screenshot of the Azure portal. Adding an Azure AD group to Grafana team.":::

1. In the **Select** search box, enter an Azure AD group name.
1. Select the group name in the search result and **Select**.

    :::image type="content" source="media/azure-ad-group-sync/select-azure-ad-group.png" alt-text="Screenshot of the Azure portal. Finding and selecting an Azure AD group.":::

1. Repeat the previous three steps to add more Azure AD groups to the Grafana team as appropriate.

    :::image type="content" source="media/azure-ad-group-sync/view-grafana-team.png" alt-text="Screenshot of the Azure portal. Viewing a Grafana team and Azure AD group(s) linked to it.":::

## Remove Azure AD group sync

If you no longer need a Grafana team, follow these steps to delete it, which also removes the link to the Azure AD group.

1. In the Azure portal, open your Azure Managed Grafana workspace.
1. Select **Administration > Teams**.
1. Select the **X** button to the right of a team you're deleting.

    :::image type="content" source="media/azure-ad-group-sync/remove-azure-ad-group-sync.png" alt-text="Screenshot of the Grafana platform. Removing a Grafana team.":::

1. Select **Delete** to confirm.

## Next steps

In this how-to guide, you learned how to set up Grafana teams backed by Azure AD groups. To learn how to use teams to control access to dashboards in your workspace, see [Manage dashboard permissions](https://grafana.com/docs/grafana/latest/administration/user-management/manage-dashboard-permissions/).

