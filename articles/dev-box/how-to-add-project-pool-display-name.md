---
title: Add a display name to projects and pools
description: Learn how to add clarity for developers by adding a display name to Projects and Pools to rename resources.
author: iyervarsha
ms.author: varshaiyer
ms.service: devbox
ms.topic: article
ms.date: 05/28/2024
---

# Add a display name to projects and pools

Display names create a friendly name to use for resources that developers can view and use in the developer portal. You can add a display name to projects and pools after creating resources. Display names are helpful in several circumstances like:  

- **Renaming projects/ resources:** If your current resource names are confusing dev box users, you can create a separate display name to communicate to developers.

- **Reorganizations:** Rename your projects and pools as developers move to new teams.  

- **Resource Degradation:** Mark your projects and pools to communicate legacy resources to developers. 
 
## Edit display names 

The display name for your projects and pools automatically defaults to its resource name during project creation. The resource name and display name are initially the same.  

To edit the project display name, go to the properties panel of the project. Modify the display name under the **Display Name** text box, then select **Apply**.

:::image type="content" source="media/how-to-add-project-pool-display-name/properties-panel-small.png" alt-text="Screenshot showing the properties panel." lightbox="media/how-to-add-project-pool-display-name/properties-panel-large.png":::  

To edit the display name for a pool, select the ellipses associated with the pool, and then select **Edit**.  

:::image type="content" source="media/how-to-add-project-pool-display-name/pool-edit.png" alt-text="Screenshot showing the edit button for a pool." lightbox="media/how-to-add-project-pool-display-name/pool-edit.png":::

You  see a similar **Display Name** text box for pools as you did for projects. Enter a display name and save your changes.  

:::image type="content" source="media/how-to-add-project-pool-display-name/pool-properties.png" alt-text="Screenshot showing the properties for a pool." lightbox="media/how-to-add-project-pool-display-name/pool-properties.png":::

> [!Important]
> Resources created before the release of the display names feature will not have a display name. However, you can still add a display name to these resources. 

### Duplicate display names

You should create unique display names for projects and pools. 

When you're creating a dev box in the developer portal, if there are duplicate display names for a project the resource name appears in the project list alongside the display name to differentiate projects.

Pools with duplicate names don't show the resource name in the developer portal; you should create unique pool names to avoid confusion. You can view your changes to the display name in the Azure portal next to the resource name.  

## Find resource names in the developer portal 

Developers see the display names for projects on the dev box tiles in the Developer Portal. 

:::image type="content" source="media/how-to-add-project-pool-display-name/dev-portal-display-names-small.png" alt-text="Screenshot showing the dev box tile in the developer portal." lightbox="media/how-to-add-project-pool-display-name/dev-portal-display-names-large.png":::

Developers also see the display names for projects and pools during dev box creation. 

:::image type="content" source="media/how-to-add-project-pool-display-name/dev-portal-display-names-during-creation.png" alt-text="Screenshot showing display names on the dev box creation pane." lightbox="media/how-to-add-project-pool-display-name/dev-portal-display-names-during-creation.png":::

To view information on the pool resource name for the associated dev box, view the Support panel of the developer portal. You  see both the resource name and display name for the associated pool. 

:::image type="content" source="media/how-to-add-project-pool-display-name/dev-portal-support-panel.png" alt-text="Screenshot showing the support panel in the developer portal." lightbox="media/how-to-add-project-pool-display-name/dev-portal-support-panel.png":::

> [!Note]
> Changes to display names in the Azure portal may take a few minutes to update everywhere.

## Related content
- [Manage a Microsoft Dev Box project](how-to-manage-dev-box-projects.md)
- [Manage a dev box pool in Microsoft Dev Box](how-to-manage-dev-box-pools.md)
- [Manage a dev box by using the Microsoft Dev Box developer portal](how-to-create-dev-boxes-developer-portal.md)