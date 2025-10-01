---
title: Manage Dev Box Pools Effectively
titleSuffix: Microsoft Dev Box
description: Manage dev box pools in Microsoft Dev Box with step-by-step guidance on creating, configuring, and deleting pools for optimal developer productivity.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/23/2025
ms.topic: how-to
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:03/23/2025
  - ai-gen-title
---

# Manage a dev box pool in Microsoft Dev Box

In this article, you learn how to manage a dev box pool in Microsoft Dev Box by using the Azure portal.

A dev box pool is a collection of dev boxes that have the same settings, such as the dev box definition and network connection. A dev box pool is associated with a Microsoft Dev Box project.

Dev box pools define the location of the dev boxes through the network connection. You can choose to deploy dev boxes to a Microsoft-hosted network or to a network that you manage. If you choose to deploy dev boxes to a network that you manage, you must first [configure a network connection](./how-to-configure-network-connections.md). Organizations that support developers in multiple geographical locations can create dev box pools for each location by specifying a nearby region.

Select a region close to your developers' physical location to ensure the lowest latency experience with dev box.

Developers that have access to the project in the dev center can create a dev box from a dev box pool.

## Permissions

To manage a dev box pool, you need the following permissions:

| Action | Permissions required |
|---|---|
| _Create, delete, or update a dev box pool_ | - Owner or Contributor permissions on an Azure subscription or a specific resource group. </br> - DevCenter Project Admin permissions for the project. |

## Create a dev box pool

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
| **Cost controls** | You can configure cost controls to help manage the costs of running dev boxes in the pool. </br> - **Auto-stop schedule**: Set an auto-stop schedule to automatically stop or hibernate dev boxes at a specified time. </br> - **Hibernate**: Configure dev boxes to hibernate after a specified grace period when no one is connected or when they have never been connected. |

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
   | **Compute** | Image definitions only. Select the VM size for the dev boxes in this pool. |
   | **Storage** | Image definition only. Select the storage size for the dev boxes in this pool. |
   | **Hibernation** | Shows whether hibernation is supported or not. |
   | **Region** |  |
   | **Network connection** | 1. Select **Deploy to a Microsoft hosted network**. </br>2. Select your desired deployment region for the dev boxes. Choose a region close to your expected dev box users for the optimal user experience. |
   | **Licensing** | Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-pool-create-basics-hibernation.png" alt-text="Screenshot of the Basics pane for creating a dev box pool." lightbox="./media/quickstart-configure-dev-box-service/dev-box-pool-create-basics-hibernation.png":::

1. On the **Management** tab, enter the following values:

   | Setting | Value |
   |---|---|
   | **Roles** | |
   | **Dev box Creator Privileges** | Select **Local Administrator** or **Standard User**. |
   | **Access** | |
   | **Enable single sign-on (SSO)** | Select to enable users to sign in to their dev boxes by using their organizational credentials. |
   | **Headless connections** | Select to enable developers to open a dev box in Visual Studio Code without a full desktop experience. |
   | **Cost controls** | |
   | **Auto-stop on schedule** | Select the checkbox to enable an autostop schedule. You can also configure an autostop schedule after the pool is created. |
   | **Stop time** | Select a time to shut down all the dev boxes in the pool. Dev boxes that support hibernation will hibernate at the specified time. Dev Boxes that don't support hibernation shut down.  |
   | **Time zone** | Select the time zone for the stop time. |
   | **Hibernate on disconnect** | Hibernates dev boxes that no one is connected to after a specified grace period. |
   | **Grace period** | Hibernates dev boxes that have never been connected to after a specified grace period. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-pool-create-management-hibernation.png" alt-text="Screenshot of the Management pane for creating a dev box pool." lightbox="./media/quickstart-configure-dev-box-service/dev-box-pool-create-management-hibernation.png":::

1. Select **Create**.

1. Check that the new dev box pool appears in the list. You might need to refresh the screen.

The Azure portal deploys the dev box pool and runs health checks to make sure the image and network pass the validation criteria for dev boxes. The following screenshot shows four dev box pools, each with a different status.

:::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-pool-grid-populated.png" alt-text="Screenshot that shows a list of dev box pools and status information." lightbox="./media/quickstart-configure-dev-box-service/dev-box-pool-grid-populated.png":::

## Manage dev boxes in a pool

You can manage existing dev boxes in a dev box pool through the Azure portal. You can start, stop, or delete dev boxes. 

> [!Important] 
> You must be a member of the Project Admin role for the project to manage dev boxes in the associated pools.

To manage dev boxes in a pool, you must access the pool through the associated project. The following steps show you how to navigate to the pool.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**, in the list of results, select **Projects**.
 
1. Select the project that contains the dev box pool that you want to manage.

1. Select **Dev box pools**.
 
1. Select the pool that contains the dev box that you want to manage. The names of pools you can manage display as links. If you don't see the pool name displayed as a link, check that you're a member of the Project Admin role for this project.

   :::image type="content" source="media/how-to-manage-dev-box-pools/manage-dev-box-pool.png" alt-text="Screenshot showing a list of dev box pools in Azure portal." lightbox="media/how-to-manage-dev-box-pools/manage-dev-box-pool.png":::
 
1. Select more actions for the dev box that you want to manage. 
 
   :::image type="content" source="media/how-to-manage-dev-box-pools/manage-dev-box-in-azure-portal.png" alt-text="Screenshot of the Azure portal, showing dev boxes in a dev box pool." lightbox="media/how-to-manage-dev-box-pools/manage-dev-box-in-azure-portal.png":::

1. Depending on the current state of the dev box, you can select **Start**, **Stop**, or **Delete**.

   :::image type="content" source="media/how-to-manage-dev-box-pools/dev-box-operations-menu.png" alt-text="Screenshot of the Azure portal, showing the menu for managing a dev box." lightbox="media/how-to-manage-dev-box-pools/dev-box-operations-menu.png":::

## Delete a dev box pool

You can delete a dev box pool when you're no longer using it.

> [!CAUTION]
> When you delete a dev box pool, all existing dev boxes within the pool are permanently deleted.

Deleting a dev box pool permanently deletes all existing dev boxes within the pool.

To delete a dev box pool in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Open the project from which you want to delete the dev box pool.

1. Select more actions for the dev box pool that you want to delete.

1. Select **Delete**.

1. In the confirmation message, confirm the deletion by entering the name of the dev box pool that you want to delete, and then select **Delete**.

   Select **Delete** to confirm.

   :::image type="content" source="./media/how-to-manage-dev-box-pools/dev-box-pool-delete-confirm.png" alt-text="Screenshot of the confirmation message for deleting a dev box pool." lightbox="./media/how-to-manage-dev-box-pools/dev-box-pool-delete-confirm.png":::

## Related content

- [Provide access to projects for project admins](./how-to-project-admin.md)
- [Create a dev box definition](how-to-manage-dev-box-definitions.md#create-a-dev-box-definition)
- [Configure Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md)