---
title: Configure Imaging for Dev Box Team Customizations
description: Configure dev box pools to use image definition files so that you can optimize customizations and create reusable images for your team.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
ms.topic: how-to
ms.date: 09/24/2025

#customer intent: As a Dev Center Admin or Project Admin, I want to configure dev box pools to use image definition files so that my development teams can create customized dev boxes.
---

# Configure dev center imaging

Using a customization file simplifies the creation of dev boxes for your team. With dev box customizations, you can create a shared team customization by creating a file called an *image definition*. Creating a reusable image from this image definition optimizes customizations and saves time during dev box creation. In this article, you learn how to configure a pool to use an image definition and build reusable images for your development teams.

To configure imaging for Microsoft Dev Box team customizations, first enable project-level catalogs and configure catalog sync settings. Next, attach a catalog with a definition file, set up a dev box pool to use an image definition, and verify that customizations apply; once confirmed, you can build a reusable image for faster dev box creation.

## Prerequisites

To complete the steps in this article, you need:

- A dev center with an existing dev box definition and network connection. If you don't have a dev center, follow the steps in [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md) to create it.
- A team customization file that you want to use to create a dev box. If you don't have a customization file, see [Write a customization file for a dev box](./how-to-write-customization-file.md).

## Permissions required to configure customizations
  
[!INCLUDE [permissions-for-customizations](includes/permissions-for-customizations.md)]

To manage a dev box pool, you need the following permissions:

| Action | Permission |
|---|---|
| Create, delete, or update a dev box pool. | - Owner or Contributor permissions on an Azure subscription or a specific resource group. </br>- DevCenter Project Admin permissions for the project. |

## Enable project-level catalogs

To attach a catalog to a project, you must enable project-level catalogs. For more information, see [Configure project-level catalogs](https://aka.ms/deployment-environments/project-catalog).

## Configure catalog sync settings for the project

Configure your project to sync image definitions from the catalog. With this setting, you can use the image definitions in the catalog to create dev box pools.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **projects**. In the list of results, select **Projects**.
1. Open the Dev Box project for which you want to configure catalog sync settings.
1. Select **Catalogs**.
1. Select **Sync settings**.

   :::image type="content" source="./media/how-to-configure-dev-center-imaging/customizations-project-sync-settings-small.png" alt-text="Screenshot of the Catalogs pane in the Azure portal, with the button for sync settings highlighted." lightbox="./media/how-to-configure-dev-center-imaging/customizations-project-sync-settings.png":::

1. On the **Sync settings** pane, select **Image definitions**, and then select **Save**.

   :::image type="content" source="./media/how-to-configure-dev-center-imaging/customizations-project-sync-image-definitions.png" alt-text="Screenshot of the pane for sync settings in the Azure portal, with the checkbox for image definitions highlighted." lightbox="./media/how-to-configure-dev-center-imaging/customizations-project-sync-image-definitions.png":::

## Attach a catalog that contains the definition file

Before you can use a customization file as an image definition, you must attach a catalog that contains the definition file to your dev center or project. The catalog can be from GitHub or Azure Repos.

The **Image definitions** pane lists the image definitions that your project can access.

:::image type="content" source="media/how-to-configure-dev-center-imaging/team-customizations-image-definitions-small.png" alt-text="Screenshot of the Azure portal pane that lists accessible image definitions for a project." lightbox="media/how-to-configure-dev-center-imaging/team-customizations-image-definitions.png":::

For more information about attaching catalogs, see [Add and configure a catalog from GitHub or Azure Repos](../dev-box/how-to-configure-catalog.md).

## Configure a dev box pool to use an image definition

Make customizations available to your development teams by configuring a dev box pool to use a customization file (imagedefinition.yaml). Store the customization file in a repository linked to a catalog in your dev center or project. Specify this file as the image definition for the pool, and the customizations are applied to new dev boxes.

### Create a dev box pool

In Microsoft Dev Box, a dev box pool is a collection of dev boxes that you manage together. You must have at least one dev box pool before users can create a dev box. 

### Pool properties
A dev box pool has the following properties:

| Property | Description |
|----------|-------------|
| **Definition** | Determines the definition used for dev boxes in this pool. You can select an existing dev box definition or image definition when you create a dev box pool.</br>- **Dev Box Definitions** define the base image and size for dev boxes. </br>- **Image definitions** specify the software and configuration for the dev boxes. |
| **Hibernation** |Hibernation is supported when the source image and compute size are both compatible. |
| **Region** | The region where the dev boxes in the pool are deployed. Choose a region close to your expected dev box users for the optimal user experience. |
| **Network connection** | Determines the network that the dev boxes in the pool connect to. </br> - **Microsoft Hosted Network**: You can choose to deploy dev boxes to a Microsoft-hosted network. </br> - **Azure joined network**: You can choose to deploy dev boxes to an Azure joined network that you manage. If you choose to deploy dev boxes to a network that you manage, you must first [configure a network connection](./how-to-configure-network-connections.md). |
| **Licensing** | You can apply Azure Hybrid Benefit licenses to the dev boxes in the pool. Select the checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |
| **Roles** | You can assign users to be either Local Administrators or Standard Users on the dev boxes they create. |
| **Access** | Determines how users can access their dev boxes.</br> - **Single Sign-On (SSO)**: Enable single sign-on (SSO) to allow users to sign in to their dev boxes by using their organizational credentials. </br> - **Headless connections**: Enable headless connections to allow developers to open a dev box in Visual Studio Code without a full desktop experience. |
| **Cost controls** | You can configure cost controls to help manage the costs of running dev boxes in the pool. </br> - **Auto-stop schedule**: Set an autostop schedule to automatically stop or hibernate dev boxes at a specified time. </br> - **Hibernate**: Configure dev boxes to hibernate after a specified grace period when no one is connected or when they have never been connected. |

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
   | **Definition** | Select an existing dev box definition or image definition. </br>A dev box definition determines the base image and size for the dev boxes that are created. </br>An image definition allows you to specify your required Compute and SKU.  |
   | **Compute** | Image definitions only. Select the virtual machine size for the dev boxes in this pool. |
   | **Storage** | Image definition only. Select the storage size for the dev boxes in this pool. |
   | **Hibernation** | Shows whether hibernation is supported or not. |
   | **Region** |  |
   | **Network connection** | 1. Select **Deploy to a Microsoft hosted network**. </br>2. Select your desired deployment region for the dev boxes. Choose a region close to your expected dev box users for the optimal user experience. |
   | **Licensing** | Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/how-to-configure-dev-center-imaging/dev-box-pool-create-basics-hibernation-image.png" alt-text="Screenshot of the Basics pane for creating a dev box pool." lightbox="./media/how-to-configure-dev-center-imaging/dev-box-pool-create-basics-hibernation-image.png":::

1. on the **Management** tab, enter the following values:

   | Setting | Value |
   |---|---|
   | **Roles** | |
   | **Dev box Creator Privileges** | Select **Local Administrator** or **Standard User**. |
   | **Access** | |
   | **Enable single sign-on (SSO)** | Select to enable users to sign in to their dev boxes by using their organizational credentials. |
   | **Headless connections** | Select to enable developers to open a dev box in Visual Studio Code without a full desktop experience. |
   | **Cost controls** | |
   | **Auto-stop on schedule** | Select the checkbox to enable an autostop schedule. You can also configure an autostop schedule after the pool is created. |
   | **Stop time** | Select a time to shut down all the dev boxes in the pool. Dev boxes that support hibernation hibernate at the specified time. Dev boxes that don't support hibernation shut down.  |
   | **Time zone** | Select the time zone for the stop time. |
   | **Hibernate on disconnect** | Hibernates dev boxes that no one is connected to after a specified grace period. |
   | **Grace period** | Hibernates dev boxes that have never been connected to after a specified grace period. |

   :::image type="content" source="./media/how-to-configure-dev-center-imaging/dev-box-pool-create-management-hibernation.png" alt-text="Screenshot of the Management pane for creating a dev box pool." lightbox="./media/how-to-configure-dev-center-imaging/dev-box-pool-create-management-hibernation.png":::

1. Select **Create**.

#### Hibernation support for dev boxes

Dev Box supports hibernation when both these conditions are met:
- The source image supports hibernation.
- The compute resources of the dev box pool support hibernation.

If either the image or the pool doesn't support hibernation, the feature isn't available for dev boxes in that pool. If hibernation isn't supported, verify that the image was created with hibernation support and that the pool is using that image.

For more information about Dev Box support for hibernation, see [Configure hibernation in Microsoft Dev Box](how-to-configure-dev-box-hibernation.md).

### Create a dev box by using the developer portal

To verify that customizations from the image definition file are applied, create a dev box in the Microsoft Dev Box developer portal. Follow the steps in [Quickstart: Create and connect to a dev box by using the Microsoft Dev Box developer portal](quickstart-create-dev-box.md). Then connect to the newly created dev box and verify that the customizations work as you expected.

You can make adjustments to the customization file and create a new dev box to test the changes. When you're happy that the customizations are correct, you can build a reusable image.

## Build a reusable image

To optimize customizations and create a reusable image for your team, you can use the following steps to build an image from the customization file. This image applies to all dev boxes created from the pool.
The DevCenter service creates a Dev Box behind the scenes to create an image, and exports the image to an Azure Compute Gallery in a resource group managed by the DevCenter service. 

### Assign roles to the DevCenter service

In order to generate an image, you need to assign the DevCenter service the requisite roles to publish an image. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource Groups**. 

1. Search for the managed by resource group with the name *DevCenter(yourProjectName)(a random ID)*. 

1. Under that resource group, navigate to Access Control, and give the **Windows 365** and **Project Fidalgo** applications the roles **Storage Account Contributor**, **Storage Blob Data Contributor**, and **Reader**.

During the process of building an image, Dev Box creates a temporary storage account in your subscription to store a snapshot, from which Dev Box generates an image. This storage account doesn't allow anonymous blob access and can only be accessed by identities with the Storage Blob Reader access. This storage account must be accessible from public networks, so that the Dev Box service can export your snapshot to it. If you have Azure policies that block the creation of storage accounts with public network access, create an exception for the subscription your DevCenter project is in.

### Build the image
 

1. On the **Image definitions** pane, select the image that you want to build.

   :::image type="content" source="./media/how-to-configure-dev-center-imaging/customizations-select-image-small.png" alt-text="Screenshot of the pane that lists image definitions, with one definition selected." lightbox="./media/how-to-configure-dev-center-imaging/customizations-select-image-small.png":::

1. Select **Build**.

   :::image type="content" source="./media/how-to-configure-dev-center-imaging/customizations-build-image-small.png" alt-text="Screenshot of the pane that lists image definitions, with the Build button highlighted." lightbox="./media/how-to-configure-dev-center-imaging/customizations-build-image-small.png":::

1. Track the build progress in the **Status** column.

   :::image type="content" source="./media/how-to-configure-dev-center-imaging/customizations-image-build-progress-small.png" alt-text="Screenshot of the pane that lists image definitions, with the in-progress status highlighted for a selected image definition." lightbox="./media/how-to-configure-dev-center-imaging/customizations-image-build-progress.png":::  

> [!IMPORTANT]
> When you're optimizing your image definition into an image, a dev box is created to run your customization file and generate an image. During this process, this dev box is connected to a virtual network that Microsoft manages. Tasks that require access to on-premises resources might fail.

When the build finishes successfully, the dev box pool automatically uses the image for new dev boxes. You don't need to do any extra configuration to assign the image to the pool. You can now create dev boxes from the pool, and the customizations are applied to each dev box.

## Related content

- [Microsoft Dev Box customizations](concept-what-are-dev-box-customizations.md)
- [Write a customization file for a dev box](./how-to-write-customization-file.md)
- [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md)