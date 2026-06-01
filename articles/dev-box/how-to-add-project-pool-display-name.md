---
title: Add Display Name to Projects and Pools
description: Learn how to provide clarity for developers by adding a display name to Projects and Pools to rename resources.
author: iyervarsha
ms.author: varshaiyer
ms.service: dev-box
ms.topic: how-to
ms.date: 09/22/2025
#Customer intent: As a platform engineer, I want to add a display name to my projects and pools, so I can provide clarity for developers when renaming resources.
---

# Add a display name to projects and pools

Display names create a friendly name to use for resources that developers can view and use in the developer portal. You can add a display name to projects and pools after creating resources. Display names are helpful in several scenarios, for example:  

- **Project and resource naming**: If your current resource names are confusing dev box users, you can create a separate display name to provide more context for developers.

- **Project reorganization**: Rename your projects and pools as developers move to new teams.  

- **Resource degradation**: Mark your projects and pools to communicate legacy resources to developers. 

## Edit display names for projects

The display name for your projects and pools automatically defaults to the resource name specified during project creation. The resource name and display name are initially the same.  

To edit the display name for a project, go to the **Properties** panel, modify the **Display name** value, and select **Apply**:

:::image type="content" source="media/how-to-add-project-pool-display-name/properties-panel.png" alt-text="Screenshot of the Properties panel for a project and the Display name setting highlighted.":::

You can view your changes to the display name in the Azure portal next to the resource name. You should create unique display names for projects. When you create a dev box in the developer portal, if there are duplicate display names for a project, the resource name appears in the project list next to the display name to differentiate projects.

After you change the display name, it can take a few minutes for the update to be visible throughout the Azure portal.

## Edit display names for pools

To edit the display name for a pool, select **More actions** (**...**) for the pool, and then select **Edit**:

:::image type="content" source="media/how-to-add-project-pool-display-name/pool-edit.png" alt-text="Screenshot of the Dev Box pools panel for a project with the Edit option for a pool highlighted.":::

You see a similar **Display name** value for pools as you did for projects. Enter a **Display name** and save your changes:

:::image type="content" source="media/how-to-add-project-pool-display-name/pool-properties.png" alt-text="Screenshot showing the properties for a pool.":::

You can view your changes to the display name in the Azure portal next to the resource name. Pools with duplicate names don't show the resource name in the developer portal. You should create unique pool names to avoid confusion.  

> [!IMPORTANT]
> Resources created before the release of the display names feature don't have a display name. However, you can still add a display name to these resources. 

## View resource names in the developer portal 

Developers see the display names for projects on the dev box tiles in the developer portal: 

:::image type="content" source="media/how-to-add-project-pool-display-name/dev-portal-display-names.png" alt-text="Screenshot showing the dev box tile in the developer portal.":::

Developers also see the display names for projects and pools during dev box creation:

:::image type="content" source="media/how-to-add-project-pool-display-name/dev-portal-display-names-during-creation.png" alt-text="Screenshot showing display names on the dev box creation pane.":::

To view information about the pool resource for a dev box in the developer portal, select **More actions** (**...**) > **Support** for the dev box. You see both the resource name and display name for the associated pool: 

:::image type="content" source="media/how-to-add-project-pool-display-name/dev-portal-support-panel.png" alt-text="Screenshot showing the support panel in the developer portal.":::

> [!Note]
> Changes to display names in the Azure portal can take a few minutes to propagate through the system.

## Related content

- [Manage a Microsoft Dev Box project](how-to-manage-dev-box-projects.md)
- [Manage a dev box pool in Microsoft Dev Box](how-to-manage-dev-box-pools.md)
- [Manage a dev box by using the Microsoft Dev Box developer portal](how-to-create-dev-boxes-developer-portal.md)