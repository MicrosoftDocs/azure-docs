---
title: Manage a dev box pool
titleSuffix: Microsoft Dev Box
description: Microsoft Dev Box dev box pools are collections of dev boxes that you manage together. Learn how to create, configure, and delete dev box pools.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/25/2023
ms.topic: how-to
#Customer intent: As a platform engineer, I want to be able to manage dev box pools so that I can provide appropriate dev boxes to my users.
---

# Manage a dev box pool in Microsoft Dev Box

In this article, you learn how to manage a dev box pool in Microsoft Dev Box by using the Azure portal.

A dev box pool is the collection of dev boxes that have the same settings, such as the dev box definition and network connection. A dev box pool is associated with a Microsoft Dev Box project.

Developers that have access to the project in the dev center, can then choose to create a dev box from a dev box pool.

## Permissions

To manage a dev box pool, you need the following permissions:

|Action|Permissions required|
|-----|-----|
|Create, delete, or update a dev box pool|Owner or Contributor permissions on an Azure subscription or a specific resource group. </br> DevCenter Project Admin permissions for the project.|

## Create a dev box pool

In Microsoft Dev Box, a dev box pool is a collection of dev boxes that you manage together. You must have at least one dev box pool before users can create a dev box. 

The following steps show you how to create a dev box pool that's associated with a project. You use an existing dev box definition and network connection in the dev center to configure the pool.

If you don't have an available dev center with an existing dev box definition and network connection, follow the steps in [Quickstart: Configure Microsoft Dev Box ](quickstart-configure-dev-box-service.md) to create them.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

   :::image type="content" source="./media/how-to-manage-dev-box-pools/discover-projects.png" alt-text="Screenshot that shows a search for projects from the Azure portal search box.":::

1. Open the project with which you want to associate the new dev box pool.
  
   :::image type="content" source="./media/how-to-manage-dev-box-pools/projects-grid.png" alt-text="Screenshot of the list of existing projects.":::

1. Select **Dev box pools**, and then select **Create**.

   :::image type="content" source="./media/how-to-manage-dev-box-pools/dev-box-pool-grid-empty.png" alt-text="Screenshot of the empty list of dev box pools within a project, along with the Create button.":::

1. On the **Create a dev box pool** pane, enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes. It must be unique within a project.|
   |**Dev box definition**|Select an existing dev box definition. The definition determines the base image and size for the dev boxes that are created in this pool.|
   |**Network connection**|Select an existing network connection. The network connection determines the region of the dev boxes that are created in this pool.|
   |**Dev box Creator Privileges**|Select **Local Administrator** or **Standard User**.|
   |**Enable Auto-stop**|**Yes** is the default. Select **No** to disable an auto-stop schedule. You can configure an auto-stop schedule after the pool is created.|
   |**Stop time**| Select a time to shut down all the dev boxes in the pool.|
   |**Time zone**| Select the time zone that the stop time is in.|
   |**Licensing**| Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/how-to-manage-dev-box-pools/dev-box-pool-create.png" alt-text="Screenshot of the pane for creating a dev box pool.":::

1. Select **Add**.

1. Verify that the new dev box pool appears in the list. You might need to refresh the screen.

The Azure portal deploys the dev box pool and runs health checks to ensure that the image and network pass the validation criteria for dev boxes. The following screenshot shows four dev box pools, each with a different status.

:::image type="content" source="./media/how-to-manage-dev-box-pools/dev-box-pool-grid-populated.png" alt-text="Screenshot that shows a list of dev box pools and status information.":::

## Delete a dev box pool

You can delete a dev box pool when you're no longer using it.

> [!CAUTION]
> When you delete a dev box pool, all existing dev boxes within the pool are permanently deleted.

To delete a dev box pool in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Open the project from which you want to delete the dev box pool.
  
1. Select the dev box pool you that you want to delete, and then select **Delete**.

   :::image type="content" source="./media/how-to-manage-dev-box-pools/dev-box-pool-delete.png" alt-text="Screenshot of a selected dev box pool in the list of dev box pools, along with the Delete button.":::

1. In the confirmation message, select **Continue**.

    :::image type="content" source="./media/how-to-manage-dev-box-pools/dev-box-pool-delete-confirm.png" alt-text="Screenshot of the confirmation message for deleting a dev box pool.":::

## Related content

- [Provide access to projects for project admins](./how-to-project-admin.md)
- [3. Create a dev box definition](quickstart-configure-dev-box-service.md#3-create-a-dev-box-definition)
- [Configure Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md)