---
title: "Tutorial: Limit Number of Dev Boxes, Control Costs"
description: Control compute and storage costs incurred by dev boxes by setting a limit on the number of dev boxes users can create in a project.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: tutorial
ms.date: 09/24/2025

#CustomerIntent: As a project admin, I want to set a limit on the number of dev boxes a dev box user can create as part of my cost management strategy.
---

# Tutorial: Control costs by setting dev box limits on a project 

Each dev box in a project incurs compute and storage costs. You can set a limit on the number of dev boxes each developer can create within a project to help control costs. The limits functionality helps you manage project expenses, use resources effectively, and prevent dev box creation for a given project. 

In the Microsoft developer portal, users with the DevCenter Dev Box User role can see their existing dev boxes and their total number of allocations for each project. When they reach their allocation limit for a project, they can't create a new dev box for that project.

In this tutorial, you:

> [!div class="checklist"]
> * Set a dev box limit for your project in the Azure portal
> * View dev box limits in the developer portal
 
## Prerequisites

- A dev box project in your subscription.

## Set a dev box limit for your project

The dev box limit is the number of dev boxes each developer can create in a project. For example, if you set the limit to 3, each developer in your team can create up to three dev boxes.

If you set a limit on a project that has existing dev boxes, the current resources remain unaffected. The limit applies to the developer's ability to create more resources. A developer can only create new resources if their overall allocation falls below the project limit.

You can prevent developers from creating more dev boxes in a project by setting the dev box limit to 0. This action doesn't delete existing dev boxes, but it prevents creation of new dev boxes in the project. 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box, enter _projects_. In the list of results, select **Projects**. 

1. In the list of projects, select the project for which you want to set limits. 

1. On the **Overview** page for the selected project, expand **Settings** in the left menu and select **Dev box settings**.

1. On the **Dev box settings** page, under **Cost controls**, configure the dev box limits:

   1. Select the **Enable** option for **Dev box limits**.

   1. Enter the maximum number of **Dev boxes per developer**.
 
   :::image type="content" source="media/tutorial-dev-box-limits/enable-dev-box-limits.png" alt-text="Screenshot showing the dev box limits option enabled for a project with the number of dev boxes per developer set to 3." lightbox="media/tutorial-dev-box-limits/enable-dev-box-limits.png"::: 
 
1. Select **Apply**.

## View dev box limits in the developer portal

In the developer portal, dev box limits are visible when you try to create a new dev box.

1. In the developer portal, select **Add a dev box**.

1. In the **Add a dev box** pane, select a project. You see your number of allocated dev boxes and the total number of dev boxes you can create in that project:

   :::image type="content" source="media/tutorial-dev-box-limits/dev-boxes-used.png" alt-text="Screenshot showing the developer portal Add new dev box pane with a project selected, the number of dev boxes used, and the total number of dev boxes.":::

1. If all of your available dev boxes in a project are allocated, you see an error message, and you can't create a new dev box:

   *Your project administrator has set a limit of \<number> dev boxes per user in \<project name>. Please delete a dev box in this project, or contact your administrator to increase your limit.* 

   :::image type="content" source="media/tutorial-dev-box-limits/dev-box-limit-exceeded.png" alt-text="Screenshot showing the developer portal Add new dev box pane with a project selected, and an error message showing new dev boxes can't be created.":::

## Clean up resources

If you're not going to continue to use dev box limits, remove the limit with the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box, enter _projects_. In the list of results, select **Projects**. 

1. In the list of projects, select the project for which you want to remove limits. 

1. On the **Overview** page for the selected project, expand **Settings** in the left menu and select **Dev box settings**.

1. On the **Dev box settings** page, under **Cost controls**, unselect the **Enable** option for **Dev box limits**.

## Related content

- [Use the Azure CLI to configure dev box limits](/cli/azure/devcenter/admin/project)
- [Manage a dev box project](how-to-manage-dev-box-projects.md)
- [Microsoft Dev Box pricing](https://azure.microsoft.com/pricing/details/dev-box/)