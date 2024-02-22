---
title: Manage dev box definitions
titleSuffix: Microsoft Dev Box
description: Microsoft Dev Box dev box definitions define a source image, compute size, and storage size for your dev boxes. Learn how to manage dev box definitions.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 01/05/2024
ms.topic: how-to
#Customer intent: As a platform engineer, I want to be able to manage dev box definitions so that I can provide appropriate dev boxes to my users.
---

# Manage a dev box definition

In this article, you learn how to manage a dev box definition by using the Azure portal. A dev box definition is a Microsoft Dev Box resource that specifies the source image, compute size, and storage size for a dev box.

Depending on their task, development teams have different software, configuration, compute, and storage requirements. You can create a new dev box definition to fulfill each team's needs. There's no limit to the number of dev box definitions that you can create, and you can use dev box definitions across multiple projects in a dev center.

## Permissions

To manage a dev box definition, you need the following permissions:

| Action | Permissions required |
|---|---|
| _Create, delete, or update a dev box definition_ | Owner, Contributor, or Write permissions on the dev center in which you want to create the dev box definition. |

## Sources of images

When you create a dev box definition, you need to select a virtual machine image. Microsoft Dev Box supports the following types of images:

- Preconfigured images from Azure Marketplace
- Custom images stored in an Azure compute gallery

### Azure Marketplace

Azure Marketplace gives you quick access to various images, including images that are preconfigured with productivity tools like Microsoft Teams and provide optimal performance.

When you're selecting an Azure Marketplace image, consider using an image that has the latest version of Windows 11 Enterprise and the Microsoft 365 apps installed.

### Azure Compute Gallery

Azure Compute Gallery enables you to store and manage a collection of custom images. You can build an image to your dev team's exact requirements and store it in a compute gallery.

To use the custom image while creating a dev box definition, attach the compute gallery to your dev center in Microsoft Dev Box. Follow these steps to [attach a compute gallery to a dev center](how-to-configure-azure-compute-gallery.md).

## Image versions

When you select an image to use in your dev box definition, you must specify which version of the image you want to use:

- **Numbered image versions**: If you want a consistent dev box definition in which the base image doesn't change, use a specific, numbered version of the image. Using a numbered version ensures that all the dev boxes in the pool always use the same version of the image.
- **Latest image versions**: If you want a flexible dev box definition in which you can update the base image as requirements change, use the latest version of the image. This choice ensures that new dev boxes use the most recent version of the image. Existing dev boxes aren't modified when an image version is updated.

## Create a dev box definition

In Microsoft Dev Box, you can create multiple dev box definitions to meet the needs of your developer teams. You associate dev box definitions with a dev center.

The following steps show you how to create a dev box definition by using an existing dev center. If you don't have an available dev center, follow the steps in [Quickstart: Configure Microsoft Dev Box](./quickstart-configure-dev-box-service.md) to create one.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev center**. In the list of results, select **Dev centers**.

   :::image type="content" source="./media/how-to-manage-dev-box-definitions/discover-devcenter.png" alt-text="Screenshot that shows a search for dev centers from the Azure portal search box." lightbox="./media/how-to-manage-dev-box-definitions/discover-devcenter.png":::

1. Open the dev center in which you want to create the dev box definition, and then select **Dev box definitions**.
  
   :::image type="content" source="./media/how-to-manage-dev-box-definitions/select-dev-box-definitions.png" alt-text="Screenshot that shows the dev center overview page and the menu item for dev box definitions." lightbox="./media/how-to-manage-dev-box-definitions/select-dev-box-definitions.png":::

1. On the **Dev box definitions** page, select **Create**.

   :::image type="content" source="./media/how-to-manage-dev-box-definitions/create-dev-box-definition.png" alt-text="Screenshot of the Create button and the list of existing dev box definitions." lightbox="./media/how-to-manage-dev-box-definitions/create-dev-box-definition.png":::

1. On the **Create dev box definition** pane, enter the following values:

   | Setting | Value | Note |
   |---|---|---|
   | **Name** | Enter a descriptive name for your dev box definition. | You can't change the dev box definition name after creation. |
   | **Image** | Select the base operating system for the dev box. You can select an image from Azure Marketplace or from Azure Compute Gallery. </br> If you're creating a dev box definition for testing purposes, consider using the **Visual Studio 2022 Enterprise on Windows 11 Enterprise + Microsoft 365 Apps 22H2** image or **Visual Studio 2022 Pro on Windows 11 Enterprise + Microsoft 365 Apps 22H2** image. | To access custom images when you create a dev box definition, you can use Azure Compute Gallery. For more information, see [Configure Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md). |
   | **Image version** | Select a specific, numbered version to ensure that all the dev boxes in the pool always use the same version of the image. Select **Latest** to ensure that new dev boxes use the latest image available. | Selecting the **Latest** image version enables the dev box pool to use the most recent version of your chosen image from the gallery. This approach ensures the created dev boxes stay up to date with the latest tools and code for your image. Existing dev boxes aren't modified when an image version is updated. |
   | **Compute** | Select the compute combination for your dev box definition. | Dev boxes use [Dsv5-series virtual machines](/azure/virtual-machines/dv5-dsv5-series#dsv5-series) for compute. |
   | **Storage** | Select the amount of storage for your dev box definition. | Dev boxes use [Azure Premium SSDs](/azure/virtual-machines/disks-types#premium-ssds) for storage. |
   | **Enable hibernation**| Leave this checkbox unselected. | |

   :::image type="content" source="./media/how-to-manage-dev-box-definitions/recommended-test-image.png" alt-text="Screenshot that shows the pane for creating a dev box definition.":::

1. Select **Create**.

> [!NOTE]
> Dev box definitions with 4 core SKUs are no longer supported. You need to update to an 8 core SKU or delete the dev box definition.

## Update a dev box definition

Over time, your needs for dev boxes can change. You might want to move from a Windows 10 base operating system to a Windows 11 base operating system, or increase the default compute specification for your dev boxes. Your initial dev box definitions might no longer be appropriate for your needs. You can update a dev box definition so new dev boxes use the new configuration.

You can update the image, image version, compute, and storage settings for a dev box definition:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev center**. In the list of results, select **Dev centers**.

1. Open the dev center that contains the dev box definition that you want to update, and then select **Dev box definitions**.
  
1. Select the dev box definitions that you want to update, and then select the edit (**pencil**) button.

   :::image type="content" source="./media/how-to-manage-dev-box-definitions/update-dev-box-definition.png" alt-text="Screenshot of the list of existing dev box definitions and the edit button." lightbox="./media/how-to-manage-dev-box-definitions/update-dev-box-definition.png":::

1. On the page for editing a dev box definition, you can select a new image, change the image version, change the compute, or modify the available storage.

   :::image type="content" source="./media/how-to-manage-dev-box-definitions/update-dev-box-definition-page.png" alt-text="Screenshot of the page for editing a dev box definition.":::

1. Select **Save**.

## Delete a dev box definition

You can delete a dev box definition when you no longer want to use it. Deleting a dev box definition is permanent and can't be undone. Dev box definitions can't be deleted if one or more dev box pools are using them.

To delete a dev box definition in the Azure portal: 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev center**. In the list of results, select **Dev centers**.

1. Open the dev center from which you want to delete the dev box definition, and then select **Dev box definitions**.
  
1. Select the dev box definition that you want to delete, and then select **Delete**.

   :::image type="content" source="./media/how-to-manage-dev-box-definitions/delete-dev-box-definition.png" alt-text="Screenshot of a selected dev box definition and the Delete button." lightbox="./media/how-to-manage-dev-box-definitions/delete-dev-box-definition.png":::

1. In the warning message, select **OK**.

   :::image type="content" source="./media/how-to-manage-dev-box-definitions/delete-warning.png" alt-text="Screenshot of the warning message about deleting a dev box definition.":::

## Related content

- [Provide access to projects for project admins](./how-to-project-admin.md)
- [Configure Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md)
