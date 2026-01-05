---
title: Configure Imaging for Dev Box Team Customizations
description: Configure dev box pools to use image definition files so that you can optimize customizations and create reusable images for your team.
author: RoseHJM
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
ms.topic: how-to
ms.date: 11/11/2025

#customer intent: As a Dev Center Admin or Project Admin, I want to configure dev box pools to use image definition files so that my development teams can create customized dev boxes.
---

# Configure dev center imaging

Using a customization file simplifies the creation of dev boxes for your team. With dev box customizations, you can create a shared team customization by creating a file called an *image definition*. You can then create a reusable image from this image definition to optimize customizations and save time during dev box creation. 

Images are automatically built by default for catalogs containing image definitions whenever a new image definition is detected or an existing one is updated. While automatic builds help prevent stale configurations and improve dev box reliability, they incur costs through dev box meters during runtime. During the image build process, a dev box is created to run your customization file and generate an image, which incurs costs based on the compute resources and time required to build the image. You can disable automatic image builds during catalog creation or afterward via catalog settings.

In this article, you learn how to configure dev center imaging for your development teams.

## Prerequisites

To complete the steps in this article, you need:

- A team customization file that you want to use to create a dev box. If you don't have a customization file, see [Configure team customizations](how-to-configure-team-customizations.md).

## Permissions required to configure customizations
  
To perform the required actions for creating and applying customizations to a dev box, you need the following permissions:

| Action | Permission/Role |
| --- | --- |
| Enable project-level catalogs for a dev center. | Platform engineer with write access on the subscription. |
| Enable catalog sync settings for a project. | Platform engineer with write access on the subscription. |
| Attach a catalog to a project. | Project Admin or Contributor permissions on the project. |
| Add tasks to a catalog. | Permission to add to the repository that hosts the catalog. |

To manage a dev box pool, you need the following permissions:

| Action | Permission |
|---|---|
| Create, delete, or update a dev box pool. | - Owner or Contributor permissions on an Azure subscription or a specific resource group. </br>- DevCenter Owner permissions on the dev center. </br>- DevCenter Project Admin permissions for the project. |

## Enable project-level catalogs

To attach a catalog to a project, you must enable project-level catalogs. For more information, see [Add and manage catalogs in Microsoft Dev Box](how-to-configure-catalog.md).

## Configure catalog sync settings for the project

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **projects**. In the list of results, select **Projects**.
1. Open the Dev Box project for which you want to configure catalog sync settings.
1. Select **Catalogs**.
1. Select **Sync settings**.

   :::image type="content" source="./media/how-to-configure-dev-center-imaging/customizations-project-sync-settings-small.png" alt-text="Screenshot of the Catalogs pane in the Azure portal, with the button for sync settings highlighted." lightbox="./media/how-to-configure-dev-center-imaging/customizations-project-sync-settings.png":::

1. On the **Sync settings** pane, select **Image definitions**, then select **Save**.

   :::image type="content" source="./media/how-to-configure-dev-center-imaging/customizations-project-sync-image-definitions.png" alt-text="Screenshot of the pane for sync settings in the Azure portal, with the checkbox for image definitions highlighted." lightbox="./media/how-to-configure-dev-center-imaging/customizations-project-sync-image-definitions.png":::

## Attach a catalog that contains the definition file

Before you can use a customization file as an image definition, attach a catalog that contains the definition file to your project. The catalog can be from GitHub or Azure Repos. For more information, see [Add and configure a catalog from GitHub or Azure Repos](../dev-box/how-to-configure-catalog.md).

> [!NOTE]
> Image definitions are only supported at the project level. You must attach catalogs containing image definitions to a project, not to a dev center.

The **Image definitions** pane lists the image definitions that your project can access.

:::image type="content" source="media/how-to-configure-dev-center-imaging/team-customizations-image-definitions-small.png" alt-text="Screenshot of the Azure portal pane that lists accessible image definitions for a project." lightbox="media/how-to-configure-dev-center-imaging/team-customizations-image-definitions.png":::

## Build a reusable image

You can build a reusable image from an image definition to optimize performance and enhance reliability. The built image applies to all dev boxes created from the pool. The DevCenter service creates a dev box behind the scenes, applies your customizations from the image definition, and exports the resulting image to an Azure Compute Gallery in a managed resource group.

There are two ways to build images: automatic or manual. By default, images are automatically built whenever a new image definition is detected or an existing image definition is updated. This feature helps prevent stale configurations and improves dev box reliability. To control when images are built, you can disable automatic image builds and manually trigger builds.

> [!NOTE]
> Image builds incur costs through dev box meters during runtime when customizations are applied.

*Select the tabs below to learn how to configure automatic and manual image builds.*

# [Automatic image builds for existing catalogs](#tab/auto-builds-existing-catalogs)
## Configure automatic image builds for existing catalogs

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Open the project that contains the catalog you want to configure.

1. On the left menu, select **Catalogs**.

1. From the list of catalogs, select the catalog that contains image definitions.

1. On the catalog details page, enable or disable the use of automatic image builds by using the **Automatically build an image** checkbox. </br>We recommend enabling auto-builds to take advantage of the reliability and performance improvements Dev Center imaging provides.

1. Select **Save** to apply your changes. The auto-build capability flattens customizations into a reusable image that dramatically enhances dev box creation performance and reliability.
 
   :::image type="content" source="media/how-to-configure-dev-center-imaging/dev-box-add-catalog-auto-build-image.png" alt-text="Screenshot showing the automatically build an image option in catalog settings.":::

When automatic image builds are disabled, you must manually trigger image builds when you want to create or update reusable images from your image definitions.

# [Automatic image builds for new catalogs](#tab/auto-builds-new-catalogs)
## Configure automatic image builds during catalog creation

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Open the project where you want to add the catalog.

1. On the left menu, select **Catalogs**, and then select **Add**.

1. On the **Add catalog** pane, enter the following information:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for the catalog. |
   | **Catalog source** | Select **GitHub** or **Azure DevOps**. |
   | **Repo** | Select or enter the URL for your repository. |
   | **Branch** | Enter the repository branch to connect to. |
   | **Folder path** | Enter the folder path relative to the repository root that contains your image definitions. |

1. Enable or disable the use of automatic image builds by using the **Automatically build an image** checkbox. </br>We recommend enabling auto-builds to take advantage of the reliability and performance improvements that Dev Center imaging provides.

1. Select **Add** to create the catalog.

When automatic image builds are disabled, you must manually trigger image builds when you want to create or update reusable images from your image definitions.

# [Manual image builds](#tab/manual-image-builds)
## Build an image manually

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Open the project that contains the catalog you want to configure.

1. On the left menu, select **Catalogs**.

1. From the list of catalogs, select the catalog that contains image definitions.

1. On the catalog details page, select **Image definitions**.

1. On the **Image definitions** pane, select the image that you want to build.

   :::image type="content" source="./media/how-to-configure-dev-center-imaging/customizations-select-image-small.png" alt-text="Screenshot of the pane that lists image definitions, with one definition selected." lightbox="./media/how-to-configure-dev-center-imaging/customizations-select-image-small.png":::

1. Select **Build**.

   :::image type="content" source="./media/how-to-configure-dev-center-imaging/customizations-build-image-small.png" alt-text="Screenshot of the pane that lists image definitions, with the Build button highlighted." lightbox="./media/how-to-configure-dev-center-imaging/customizations-build-image-small.png":::

1. Track the build progress in the **Status** column.

   :::image type="content" source="./media/how-to-configure-dev-center-imaging/customizations-image-build-progress-small.png" alt-text="Screenshot of the pane that lists image definitions, with the in-progress status highlighted for a selected image definition." lightbox="./media/how-to-configure-dev-center-imaging/customizations-image-build-progress.png":::  

When the build finishes successfully, the dev box pool automatically uses the built image for new dev boxes. You don't need extra configuration to assign the image to the pool. You can now create dev boxes from the pool with the customizations applied.

---

During the image build process, Dev Box creates a temporary storage account in your subscription to store a snapshot. This storage account doesn't allow anonymous blob access and can only be accessed by identities with Storage Blob Reader access. The storage account must be accessible from public networks so the Dev Box service can export your snapshot. If you have Azure policies that block the creation of storage accounts with public network access, create an exception for the subscription that your DevCenter project is in.

> [!IMPORTANT]
> When an image is built from an image definition, a dev box is created to apply all the customizations and generate an image. By default, if no custom network is configured at the image definition level, the dev box is connected to a virtual network that Microsoft manages. Use the [network configuration](./reference-dev-box-customizations.md#networkconnection) property in image definitions for tasks that need access to on-premises or private resources to ensure that image generation is successful.

## Configure a dev box pool to use an image definition

To make customizations available to your development teams, configure a dev box pool to use an image definition. Store the customization file (imagedefinition.yaml) in a repository linked to a catalog in your project. When you specify the image definition for the pool, the customizations are applied to new dev boxes.

### Create a dev box pool

In Microsoft Dev Box, a dev box pool is a collection of dev boxes that you manage together. You must have at least one dev box pool before users can create a dev box. 

The following steps show you how to create a dev box pool in a project. 

If you don't have an available dev center and project, follow the steps in [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md) to create them.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Open the project where you want to create the dev box pool.
  
   :::image type="content" source="./media/quickstart-configure-dev-box-service/select-project.png" alt-text="Screenshot that shows the list of existing projects." lightbox="./media/quickstart-configure-dev-box-service/select-project.png":::

1. Select **Dev box pools**, then select **Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-pool.png" alt-text="Screenshot of an empty list of dev box pools within a project, along with selections to start creating a pool." lightbox="./media/quickstart-configure-dev-box-service/create-pool.png":::

1. On the **Create a dev box pool** pane, on the **Basics** tab, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes. The name must be unique within a project. |
   | **Definition** | Select an **Image definition**. |
   | **Compute** | Select the virtual machine size for the dev boxes in this pool. |
   | **Storage** | Select the storage size for the dev boxes in this pool. |
   | **Hibernation** | Shows whether hibernation is supported or not. |
   | **Region** |  |
   | **Network connection** | 1. Select **Deploy to a Microsoft hosted network**. </br>2. Select your desired deployment region for the dev boxes. Choose a region close to your expected dev box users for the optimal user experience. |
   | **Licensing** | Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/how-to-configure-dev-center-imaging/dev-box-pool-create-basics-hibernation-image.png" alt-text="Screenshot of the Basics pane for creating a dev box pool." lightbox="./media/how-to-configure-dev-center-imaging/dev-box-pool-create-basics-hibernation-image.png":::

1. Select **Create**.

#### Hibernation support for dev boxes

Dev Box supports hibernation when both these conditions are met:
- The source image defined in the image definition supports hibernation.
- The compute resources of the dev box pool support hibernation.

If either the image or the pool doesn't support hibernation, the feature isn't available for dev boxes in that pool. If hibernation isn't supported, verify that the base image specified in your image definition is created with hibernation support and that the pool uses that image definition.

For more information about Dev Box support for hibernation, see [Configure hibernation in Microsoft Dev Box](how-to-configure-dev-box-hibernation.md).

### Create a dev box by using the developer portal

To verify that customizations are applied correctly, create a dev box in the Microsoft Dev Box developer portal. Follow the steps in [Quickstart: Create and connect to a dev box by using the Microsoft Dev Box developer portal](quickstart-create-dev-box.md), then connect to the newly created dev box and verify that the customizations work as expected.

You can make adjustments to the image definition and create a new dev box to test the changes. When the customizations are correct, you can build a reusable image from the image definition.

## Related content

- [Microsoft Dev Box customizations](concept-what-are-dev-box-customizations.md)
- [Write a customization file for a dev box](./how-to-write-customization-file.md)
- [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md)