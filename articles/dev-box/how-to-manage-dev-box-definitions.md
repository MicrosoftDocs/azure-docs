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

<!-- Intent: As a dev infrastructure manager, I want to be able to manage dev box definitions so that I can provide appropriate dev boxes to my users. -->

# Manage a dev box definition

A dev box definition is a Microsoft Dev Box Preview resource that specifies a source image, compute size, and storage size. You can use a source image from the Azure Marketplace, or a custom image from an Azure Compute Gallery.

Depending on their task, development teams have different software, configuration, compute, and storage size requirements. You can create a new dev box definition to fulfill each team's needs. There's no limit to the number of dev box definitions you can create, and you can use dev box definitions across multiple projects in a dev center. 

## Permissions
To manage a dev box definition, you need the following permissions:

|Action|Permission required|
|-----|-----|
|Create, delete, or update dev box definition|Owner, Contributor, or Write permissions on the dev center in which you want to create the dev box definition. |

## Sources of images

When you create a dev box definition, you can choose a preconfigured image from the Azure Marketplace, or a custom image from an attached Azure Compute Gallery.

### Azure Marketplace
The Azure Marketplace gives you quick, easy access to various images, including images that are preconfigured with productivity tools like Microsoft Teams and provide optimal performance.

When selecting a Marketplace image, consider using an image that has the latest version of Windows 11 Enterprise and the Microsoft 365 Apps installed. 

### Azure Compute Gallery
An Azure Compute Gallery enables you to store and manage a collection of custom images. You can build an image to your dev team's exact requirements, and store it in a gallery. To use the custom image while creating a dev box definition, attach the gallery to your dev center. Learn how to attach a gallery here: [Configure an Azure Compute Gallery](how-to-configure-azure-compute-gallery.md).

## Image versions 
When you select an image to use in your dev box definition, you must specify if updated versions of the image will be used. 
- **Numbered image versions:** If you want a consistent dev box definition in which the base image doesn't change, use a specific, numbered version of the image. Using a numbered version ensures all the dev boxes in the pool always use the same version of the image.
- **Latest image versions:** If you want a flexible dev box definition in which you can update the base image as needs change, use the latest version of the image. Using the latest version of the image ensures that new dev boxes use the most recent version of the image. Existing dev boxes will not be modified when an image version is updated.

## Create a dev box definition

You can create multiple dev box definitions to meet the needs of your developer teams.

The following steps show you how to create a dev box definition using an existing dev center. 

If you don't have an available dev center, follow the steps in [Quickstart: Configure the Microsoft Dev Box service](./quickstart-configure-dev-box-service.md) to create one.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *dev center* and then select **Dev centers** from the list.

   :::image type="content" source="./media/how-to-manage-dev-box-definitions/discover-devcenter.png" alt-text="Screenshot showing a search for devcenter from the Azure portal search box.":::

1. Open the dev center in which you want to create the new dev box definition, and then select **Dev box definitions**.
  
   :::image type="content" source="./media/how-to-manage-dev-box-definitions/select-dev-box-definitions.png" alt-text="Screenshot showing the dev center overview page with Dev box definitions highlighted.":::

1. On the Dev box definitions page, select **+ Create**.
 
   :::image type="content" source="./media/how-to-manage-dev-box-definitions/create-dev-box-definition.png" alt-text="Screenshot of the list of existing dev box definitions with Create highlighted.":::

1. On the Create dev box definition page, enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|Enter a descriptive name for your dev box definition. Note that you can't change the dev box definition name after it's created. |
   |**Image**|Select the base operating system for the dev box. You can select an image from the Marketplace or from an Azure Compute Gallery.|
   |**Image version**|Select a specific, numbered version to ensure all the dev boxes in the pool always use the same version of the image. Select  **Latest** to ensure new dev boxes use the latest image available.|
   |**Compute**|Select the compute combination for your dev box definition.|
   |**Storage**|Select the amount of storage for your dev box definition.|

   :::image type="content" source="./media/how-to-manage-dev-box-definitions/create-dev-box-definition-page.png" alt-text="Screenshot showing the Create dev box definition page.":::

1. To create the dev box definition, select **Create**.

## Update a dev box definition

Over time, your needs for dev boxes will change. You may want to move from a Windows 10 base operating system to a Windows 11 base operating system, or increase the default compute specification for your dev boxes. Your initial dev box definitions may no longer be appropriate for your needs. You can update a dev box definition, so that new dev boxes will use the new configuration.

You can update the image, image version, compute, and storage settings for a dev box definition. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *dev center* and then select **Dev centers** from the list.

   :::image type="content" source="./media/how-to-manage-dev-box-definitions/discover-devcenter.png" alt-text="Screenshot showing a search for devcenter from the Azure portal search box.":::

1. Open the dev center that contains the dev box definition you want to update, and then select **Dev box definitions**.
  
   :::image type="content" source="./media/how-to-manage-dev-box-definitions/select-dev-box-definitions.png" alt-text="Screenshot showing the dev center overview page with Dev box definitions highlighted.":::
  
1. Select the dev box definition(s) you want to update and then select the edit button. 
 
   :::image type="content" source="./media/how-to-manage-dev-box-definitions/update-dev-box-definition.png" alt-text="Screenshot of the list of existing dev box definitions, with the edit button highlighted.":::

1. On the Edit *dev box definition name* page, you can select a new image, change the image version, change the compute, or modify the storage available.
 
   :::image type="content" source="./media/how-to-manage-dev-box-definitions/update-dev-box-definition-page.png" alt-text="Screenshot of the edit dev box definition page.":::

1. When you have made your updates, select **Save**.
## Delete a dev box definition

You can delete a dev box definition when you no longer want to use it. Deleting a dev box definition is permanent, and can't be undone. Dev box definitions can't be deleted if they are in use by one or more dev box pools. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *dev center* and then select **Dev centers** from the list.

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