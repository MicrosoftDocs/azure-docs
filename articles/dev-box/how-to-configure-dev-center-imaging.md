---
title: Configure Imaging for Dev Box Team Customizations
description: Configure dev box pools to use image definition files so that you can optimize customizations and create reusable images for your team.
author: RoseHJM
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
  - ai-usage: ai-assisted
ms.topic: how-to
ms.date: 02/06/2026

#customer intent: As a Dev Center Admin or Project Admin, I want to configure dev box pools to use image definition files so that my development teams can create customized dev boxes.
---

# Configure dev center imaging

Using a customization file simplifies the creation of dev boxes for your team. With dev box customizations, you can create a shared team customization by creating a file called an *image definition*. You can then create a reusable image from this image definition to optimize customizations and save time during dev box creation. 

Images are automatically built by default for catalogs containing image definitions whenever a new image definition is detected or an existing one is updated. While automatic builds help prevent stale configurations and improve dev box reliability, they incur costs through dev box meters during runtime. During the image build process, a dev box is created to run your customization file and generate an image, which incurs costs based on the compute resources and time required to build the image. You can disable automatic image builds during catalog creation or afterward via catalog settings.

In this article, you learn how to configure dev center imaging for your development teams.

## Prerequisites

To complete the steps in this article, you need:

- A dev center with a project and dev box pool. If you don't have one, see [Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md).
- A catalog attached to your project with image definitions. If you don't have a catalog, see [Add and manage catalogs](how-to-configure-catalog.md).
- A team customization file (image definition) in your catalog. If you don't have one, see [Configure team customizations](how-to-configure-team-customizations.md).

For permissions required to configure customizations, see [Permissions for customizations](concept-what-are-dev-box-customizations.md#permissions-for-customizations).

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

To use an image definition, you must configure a dev box pool to reference it. When developers create dev boxes from the pool, the customizations from the image definition are applied automatically.

For detailed steps on creating a dev box pool with an image definition, see [Configure a dev box pool to use an image definition](how-to-configure-team-customizations.md#configure-a-dev-box-pool-to-use-an-image-definition).

### Hibernation support

Dev Box supports hibernation when both these conditions are met:
- The source image defined in the image definition supports hibernation.
- The compute resources of the dev box pool support hibernation.

For more information, see [Configure hibernation in Microsoft Dev Box](how-to-configure-dev-box-hibernation.md).

## Related content

- [Microsoft Dev Box customizations](concept-what-are-dev-box-customizations.md)
- [Configure team customizations](how-to-configure-team-customizations.md)
- [Add and configure a catalog from GitHub or Azure Repos](how-to-configure-catalog.md)