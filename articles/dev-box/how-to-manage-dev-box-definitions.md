---
title: How to manage a dev box definition
titleSuffix: Microsoft Dev Box
description: This article describes how to create, and delete Microsoft Dev Box dev box definitions.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 10/10/2022
ms.topic: how-to
---

<!-- Intent: As a dev infrastructure manager, I want to be able to manage dev box definitions so that I can provide appropriate dev boxes to my users. 
- Create a dev box definition
    - how many dev box definitions can you/should you create
- Delete a dev box definition
- List the sources of images: marketplace and custom Azure compute gallery
- Explain the value of using different images, including Cloud PC images from the marketplace, and your own custom images
- Describe image versions and the impact of selecting "latest"
-->

# Manage a dev box definition


## Permissions
To manage a dev box definition, you need the following permissions:

|Action|Permission required|
|-----|-----|
|Create, delete, or update dev box definition|Owner or Contributor permissions on an Azure Subscription or a specific resource group. </br> DevCenter Project Admin for the project.|

## Create a dev box definition
A dev box definition specifies a source image and size, including compute size and storage size. You can use a source image from the marketplace, or a custom image from your own [Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md). You can use dev box definitions across multiple projects in a dev center. 

### Sources of images
Azure Marketplace (+ recommended images)
Azure Compute Gallery - holds your own custom images
- Explain the value of using different images, including Cloud PC images from the marketplace, and your own custom images

### How to create a custom image 
 - Link to Jordan's article 

You can create multiple dev box definitions to meet the needs of your developer teams.

The following steps show you how to create a dev box definition. You'll use an existing dev center. 

If you don't have an available dev center, follow the steps in [Quickstart: Configure the Microsoft Dev Box service](./quickstart-configure-dev-box-service.md) to create them.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *devcenter* and then select **Dev centers** from the list.

   :::image type="content" source="./media/how-to-manage-dev-box-definitions/discover-devcenter.png" alt-text="Screenshot showing a search for devcenter from the Azure portal search box.":::

1. Open the dev center in which you want to create the new dev box definition, and then select **Dev box definitions**.
  
   :::image type="content" source="./media/how-to-manage-dev-box-definitions/select-dev-box-definitions.png" alt-text="Screenshot showing the dev center overview page with Dev box definitions highlighted.":::

1. On the Dev box definitions page, select **+ Create**.
 
   :::image type="content" source="./media/how-to-manage-dev-box-definitions/create-dev-box-definition.png" alt-text="Screenshot of the list of existing dev box definitions with Create highlighted.":::

|Name|Value|Note|
   |----|----|----|
   |**Name**|Enter a descriptive name for your dev box definition.|
   |**Image**|Select the base operating system for the dev box. You can select an image from the marketplace or from an Azure Compute Gallery.|To use custom images while creating a dev box definition, you can attach an Azure Compute Gallery that has the custom images. Learn [How to configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md).|
   |**Image version**|Select a specific, numbered version to ensure all the dev boxes in the pool always use the same version of the image. Select  **Latest** to ensure new dev boxes use the latest image available.|Selecting the Latest image version enables the dev box pool to use the most recent image version for your chosen image from the gallery. This way, the dev boxes created will stay up to date with the latest tools and code on your image. Existing dev boxes will not be modified when an image version is updated.|

<!-- Image and image version rows need more in-depth explanation, but maybe not in the table itself. -->

   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-definition-create.png" alt-text="Screenshot showing the create dev box definition page with suggested images highlighted.":::

   While selecting the gallery image, consider using either of the two images:
   - Windows 11 Enterprise + Microsoft 365 Apps 21H2
   - Windows 10 Enterprise + Microsoft 365 Apps 21H2
      
   These images are preconfigured with productivity tools like Microsoft Teams and configured for optimal performance.

1. Select **Create**.


## Delete a dev box definition
Over time, your needs for dev boxes will change. You may want top move from a Windows 10 base operating system to a Windows 11 base operating system, or increase the default compute specification for your dev boxes. Your initial dev box definitions may no longer be appropriate for your needs. 

You can delete a dev box definition when you no longer want to use it. Deleting a dev box definition is permanent, and cannot be undone. Dev box definitions cannot be deleted if they are in use by one or more dev box pools. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *devcenter* and then select **Dev centers** from the list.

   :::image type="content" source="./media/how-to-manage-dev-box-definitions/discover-devcenter.png" alt-text="Screenshot showing a search for devcenter from the Azure portal search box.":::

1. Open the dev center from which you want to delete the dev box definition, and then select **Dev box definitions**.
  
   :::image type="content" source="./media/how-to-manage-dev-box-definitions/select-dev-box-definitions.png" alt-text="Screenshot showing the dev center overview page with Dev box definitions highlighted.":::
  
1. Select the dev box definition you want to delete and then select **Delete**.
 
   :::image type="content" source="./media/how-to-manage-dev-box-definitions/delete-dev-box-definition.png" alt-text="Screenshot of the list of existing dev box definitions, with the one to be deleted selected.":::

1.  In the warning message, select **OK**.

    :::image type="content" source="./media/how-to-manage-dev-box-definitions/delete-warning.png" alt-text="Screenshot of the Delete dev box definition warning message.":::


## Next steps

- [Provide access to projects for project admins](./how-to-project-admin.md)
- [Configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md)