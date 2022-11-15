---
title: How to manage a dev box pool
titleSuffix: Microsoft Dev Box Preview
description: This article describes how to create, and delete Microsoft Dev Box Preview dev box pools.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 10/12/2022
ms.topic: how-to
---

<!-- Intent: As a dev infrastructure manager, I want to be able to manage dev box pools so that I can provide appropriate dev boxes to my users. -->

# Manage a dev box pool
To enable developers to self-serve dev boxes from projects, you must configure dev box pools that specify the dev box definitions and network connections used when dev boxes are created. Dev box users create dev boxes from the dev box pools they have access to through their project memberships.

## Permissions
To manage a dev box pool, you need the following permissions:

|Action|Permission required|
|-----|-----|
|Create, delete, or update dev box pool|Owner or Contributor permissions on an Azure Subscription or a specific resource group. </br> DevCenter Project Admin for the project.|

## Create a dev box pool
A dev box pool is a collection of dev boxes that you manage together. You must have a pool before users can create a dev box.  

The following steps show you how to create a dev box pool associated with a project. You'll use an existing dev box definition and network connection in the dev center to configure a dev box pool. 

<!-- how many dev box pools can you create -->

If you don't have an available dev center with an existing dev box definition and network connection, follow the steps in [Quickstart: Configure the Microsoft Dev Box Preview service](quickstart-configure-dev-box-service.md) to create them.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *Projects* and then select **Projects** from the list.

   :::image type="content" source="./media/how-to-manage-dev-box-pools/discover-projects.png" alt-text="Screenshot showing a search for projects from the Azure portal search box.":::

1. Open the project with which you want to associate the new dev box pool.
  
   :::image type="content" source="./media/how-to-manage-dev-box-pools/projects-grid.png" alt-text="Screenshot of the list of existing projects.":::

1. Select **Dev box pools** and then select **+ Create**.
 
   :::image type="content" source="./media/how-to-manage-dev-box-pools/dev-box-pool-grid-empty.png" alt-text="Screenshot of the list of dev box pools within a project. The list is empty.":::

1. On the **Create a dev box pool** page, enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes, and must be unique within a project.|
   |**Dev box definition**|Select an existing dev box definition. The definition determines the base image and size for the dev boxes created within this pool.|
   |**Network connection**|Select an existing network connection. The network connection determines the region of the dev boxes created within this pool.|
   |**Dev Box Creator Privileges**|Select Local Administrator or Standard User.|
   |**Licensing**| Select this check box if your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/how-to-manage-dev-box-pools/dev-box-pool-create.png" alt-text="Screenshot of the Create dev box pool dialog."::: 

1. Select **Add**.
 
1. Verify that the new dev box pool appears in the list. You may need to refresh the screen.

The dev box pool will be deployed and health checks will be run to ensure the image and network pass the validation criteria to be used for dev boxes. The screenshot below shows four dev box pools, each with a different status. 

   :::image type="content" source="./media/how-to-manage-dev-box-pools/dev-box-pool-grid-populated.png" alt-text="Screenshot showing a list of existing pools.":::


## Delete a dev box pool
You can delete a dev box pool when you're no longer using it. 

> [!CAUTION]
> When you delete a dev box pool, all existing dev boxes within the pool will be permanently deleted.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *Projects* and then select **Projects** from the list.

1. Open the project from which you want to delete the dev box pool.
  
1. Select the dev box pool you want to delete and then select **Delete**.
 
   :::image type="content" source="./media/how-to-manage-dev-box-pools/dev-box-pool-delete.png" alt-text="Screenshot of the list of existing dev box pools, with the one to be deleted selected.":::

1.  In the confirmation message, select **Confirm**.

    :::image type="content" source="./media/how-to-manage-dev-box-pools/dev-box-pool-delete-confirm.png" alt-text="Screenshot of the Delete dev box pool confirmation message.":::

## Next steps

- [Provide access to projects for project admins](./how-to-project-admin.md)
- [Create dev box definitions](./quickstart-configure-dev-box-service.md#create-a-dev-box-definition)
- [Configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md)