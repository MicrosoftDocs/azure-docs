---
title: "Tutorial: Limit the number of dev boxes in a project to help control costs"
description: Each dev box incurs compute and storage costs. This tutorial shows you how to set a limit on the number of dev boxes developers can create in a project.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: tutorial
ms.date: 01/11/2024

#CustomerIntent: As a project admin, I want to set a limit on the number of dev boxes a dev box user can create as part of my cost management strategy.
---

# Tutorial: Control costs by setting dev box limits on a project 

You can set a limit on the number of dev boxes each developer can create within a project. You can use this functionality to help manage costs, use resources effectively, or prevent dev box creation for a given project. 

In the developer portal, a Dev Box User can see their existing dev boxes and their total number of allocations for each project. When they reach their allocation limit for a project, they can't create a new dev box for that project.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set a dev box limit for your project by using the Azure portal
> * View dev box limits in the developer portal
 
## Prerequisites

- A Dev Box project in your subscription

## Set a dev box limit for your project

The dev box limit is the number of dev boxes each developer can create in a project. For example, if you set the limit to 3, each developer in your team can create three dev boxes.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box, enter **projects**. In the list of results, select **Projects**. 

1. Select the project that you want to set a limit for. 

1. On the left menu, select **Limits**.

1. On the **Limits** page, toggle the **Enable dev box limit** setting to **Yes**.
 
   :::image type="content" source="media/tutorial-dev-box-limits/enable-dev-box-limits.png" alt-text="Screenshot showing the dev box limits options for a project, with Yes highlighted." lightbox="media/tutorial-dev-box-limits/enable-dev-box-limits.png"::: 
 
1. In **Dev boxes per developer**, enter a dev box limit and then select **Apply**. 
 
   :::image type="content" source="media/tutorial-dev-box-limits/dev-box-limit-number.png" alt-text="Screenshot showing dev box limits for a project enabled, with dev boxes per developer highlighted." lightbox="media/tutorial-dev-box-limits/dev-box-limit-number.png":::

> [!TIP]
> To prevent developers creating more dev boxes in a project, set the dev box limit to 0. This action doesn't delete existing dev boxes, but it prevents creation of new dev boxes in the project. 

## View dev box limits in the developer portal

In the developer portal, select a project to see the number of existing dev boxes and the total number of dev boxes you can create in that project. 

:::image type="content" source="media/tutorial-dev-box-limits/dev-boxes-used.png" alt-text="Screenshot showing the developer portal Add new dev box pane with a project selected, the number of dev boxes used, and the total number of dev boxes." lightbox="media/tutorial-dev-box-limits/dev-boxes-used.png" :::

If all of your available dev boxes in a project are in use, you see an error message and you can't create a new dev box:

*Your project administrator has set a limit of \<number> dev boxes per user in \<project name>. Please delete a dev box in this project, or contact your administrator to increase your limit.* 

:::image type="content" source="media/tutorial-dev-box-limits/dev-box-limit-exceeded.png" alt-text="Screenshot showing the developer portal Add new dev box pane with a project selected, and an error message." lightbox="media/tutorial-dev-box-limits/dev-box-limit-exceeded.png":::

## Clean up resources

If you're not going to continue to use dev box limits, remove the limit with the following steps:

1. In the search box, enter **projects**. In the list of results, select **Projects**. 

1. Select the project associated with the limit that you want to remove. 

1. On the left menu, select **Limits**.

1. On the **Limits** page, change the **Enable dev box limit** setting to **No**.

## Next steps

- [Use the Azure CLI to configure dev box limits](/cli/azure/devcenter/admin/project)
- [Manage a dev box project](how-to-manage-dev-box-projects.md)
- [Microsoft Dev Box pricing](https://azure.microsoft.com/pricing/details/dev-box/)