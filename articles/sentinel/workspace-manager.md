---
title: Manage multiple Microsoft Sentinel workspaces with Workspace Manager
description: Learn how to centrally manage multiple Microsoft Sentinel workspaces within one or more Azure tenants with Workspace Manager. This article takes you through provisioning and usage of Workspace Manager to help you gain operational efficiency and operate at scale.
author: austinmccollum
ms.author: austinmc
ms.topic: how-to
ms.date: 04/24/2023
ms.custom: template-how-to
---

# Centrally manage multiple Microsoft Sentinel workspaces with Workspace Manager

Learn how to centrally manage multiple Microsoft Sentinel workspaces within one or more Azure tenants with Workspace Manager. This article takes you through provisioning and usage of Workspace Manager. Whether you're a global enterprise or a Managed Security Services Provider (MSSP), Workspace Manager helps you gain operational efficiency and operate at scale.

Here are the active content types supported with Workspace Manager:
- Analytics rules
- Automation rules (excluding Playbooks)
- Parsers, Saved Searches and Functions
- Hunting and Livestream queries
- Workbooks

## Prerequisites

- At least two Microsoft Sentinel workspaces. One to be the manager and at least one member to be managed.
- The [Microsoft Sentinel Contributor role assignment](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-contributor) is required on the central workspace (where Workspace Manager is enabled on), and on the member workspace(s) the user needs to manage. To learn more about roles in Microsoft Sentinel, see [Roles and permissions in Microsoft Sentinel](roles.md).
- Enable Azure Lighthouse if you're' managing workspaces across multiple Azure AD tenants. To learn more, see [Manage Microsoft Sentinel workspaces at scale](/azure/lighthouse/how-to/manage-sentinel-workspaces).


## Considerations
Configure a central workspace to be the environment where you consolidate content items and configurations to be published at scale to member workspaces. Create a new Microsoft Sentinel workspace or utilize an existing one to serve as the central workspace.

Depending on your scenario, consider these architectures:
- **Direct-link** is the least complex setup. Control all member workspaces with only one central workspace.
- **Co-Management** supports scenarios where more than one central workspace needs to manage a member workspace. For example, workspaces simultaneously managed by an in-house SOC team and an MSSP.
- **N-Tier** supports complex scenarios where a central workspace controls another central workspace. For example, a conglomerate that manages multiple subsidiaries, where each subsidiary also manages multiple workspaces.

:::image type="content" source="media/workspace-manager/architectures.png" alt-text="A diagram showing various architecture choices for workspace manager in Microsoft Sentinel.":::

## Enable Workspace Manager on the central workspace
Enable the central workspace once you have decided which Microsoft Sentinel workspace should be the Workspace Manager. 

1. Navigate to the **Settings** blade in the Parent workspace, and toggle "On" the Workspace Manager configuration setting.
    :::image type="content" source="media/workspace-manager/enable-workspace-manager.png" alt-text="A screenshot showing the Workspace manager configuration settings with the workspace parent toggle button highlighted.":::

1. Once enabled, a new blade **Workspace manager (preview)** appears on the left menu under **Configuration**.
    :::image type="content" source="media/workspace-manager/enable-workspace-manager-enabled.png" alt-text="A screenshot showing the Workspace manager configuration settings with the new workspace manager menu section highlighted.":::

## Onboard member workspaces
Member workspaces are the set of workspaces that will be managed by Workspace Manager. You can onboard some or all of the workspaces in the tenant, and across multiple tenants as well (if Azure Lighthouse is enabled).
1. Navigate to Workspace Manager and select "Add workspaces"
    :::image type="content" source="media/workspace-manager/add-workspace.png" alt-text="Screenshot shows the add workspace menu." lightbox="media/workspace-manager/add-workspace.png":::
1. Select the member workspace(s) you would like to onboard to Workspace Manager.
    :::image type="content" source="media/workspace-manager/add-workspace-select.png" alt-text="Screenshot shows the add workspace selection menu.":::
1. Once successfully onboarded, the **Members** count increases and your member workspaces are reflected in the **Workspaces** tab.
    :::image type="content" source="media/workspace-manager/add-workspace-selected.png" alt-text="Screenshot shows the added workspaces and the Members count incremented to 2.":::

## Create a Group
Groups allow you to organize workspaces together based on business groups, verticals, geography, etc. Use Groups to pair content items relevant to the workspaces in a group. 

> [!TIP]
> Before proceeding further, make sure that you have at least one active content item deployed in the central workspace. This will enable you to select content items from central to member workspace(s) in the subsequent steps.
>

1. To create a Group:
     - To add one workspace, select **Add** > **Group**. 
     - To add multiple workspaces, select the workspaces and **Add** > **Group from selected**.
    :::image type="content" source="media/workspace-manager/add-group.png" alt-text="Screenshot shows the add group menu.":::

1. On the **Create or update group** page, enter a **Name** and **Description** for the Group.
    :::image type="content" source="media/workspace-manager/add-group-name.png" alt-text="Screenshot shows the group create or update configuration page.":::

1. In the **Select workspaces** tab, click **Add** and select the member workspaces that you would like to add to the Group.
1. In the **Select content** tab, you will have 2 ways to add content items.
    - Method 1: **Snapshot of all content** currently deployed in the central workspace. This point-in-time snapshot selects only active content, not templates.
    - Method 2: **Custom select** which content items should be added. 
    :::image type="content" source="media/workspace-manager/add-group-content.png" alt-text="Screenshot shows the group content selection.":::

1. Once successfully created, the **Group count** increases and your Groups are reflected in the **Groups tab**.

## Publish the Group definition
At this point, the content items selected haven't been published to the member workspace(s) yet.

1. Click **Publish content** in the right flyout.

    :::image type="content" source="media/workspace-manager/publish-group.png" alt-text="Screenshot shows the group publish window.":::

    To bulk Publish, multi-select the desired Groups and click on Publish.
    :::image type="content" source="media/workspace-manager/publish-groups.png" alt-text="Screenshot shows the multi-select group publishing window.":::

1. The **Last publish status** column updates to reflect **In progress**.
    :::image type="content" source="media/workspace-manager/publish-groups-inprogress.png" alt-text="Screenshot shows the multi group publishing progress column.":::

1. If successful, the **Last publish status** updates to reflect **Succeeded**. The selected content items now exist in the member workspaces.
    :::image type="content" source="media/workspace-manager/publish-groups-success.png" alt-text="Screenshot shows the last published column with entries that succeeded.":::

    If unsuccessful, the **Last publish status** updates to reflect **Failed**.


### Troubleshooting
To facilitate troubleshooting, click the **Failed** hyperlink, to open the Job failure details window. A status for each content item and target workspace pair is displayed.
:::image type="content" source="media/workspace-manager/publish-groups-job-details.png" alt-text="Screenshot shows the job details of a group publishing failure event." lightbox="media/workspace-manager/publish-groups-job-details.png":::

Common reasons for failure include:
- Content items referenced in the Group definition no longer exist at the time of Publish (have been deleted).
- Permissions have changed at the time of Publish. For example, the user is no longer a Microsoft Sentinel Contributor or doesn't have sufficient permissions on the member workspace anymore.
- A member workspace has been deleted.

### Known limitations
- Playbooks attributed or attached to Analytics and Automation rules are not currently supported.
- Workbooks stored in bring-your-own-storage aren't currently supported.
- Workspace Manager only manages content items published from the central workspace. It doesn't manage content created locally from member workspace(s).
- Currently, deleting content residing in member workspace(s) centrally via Workspace Manager isn't supported.

### API references
- [Workspace Manager Assignment Jobs](/rest/api/securityinsights/preview/workspace-manager-assignment-jobs)
- [Workspace Manager Assignments](/rest/api/securityinsights/preview/workspace-manager-assignments)
- [Workspace Manager Configurations](/rest/api/securityinsights/preview/workspace-manager-configurations)
- [Workspace Manager Groups](/rest/api/securityinsights/preview/workspace-manager-groups)
- [Workspace Manager Members](/rest/api/securityinsights/preview/workspace-manager-members)

## Next steps
- [Manage multiple tenants in Microsoft Sentinel as an MSSP](multiple-tenants-service-providers.md)
- [Work with Microsoft Sentinel incidents in many workspaces at once](multiple-workspace-view.md)
- [Protecting MSSP intellectual property in Microsoft Sentinel](mssp-protect-intellectual-property.md)