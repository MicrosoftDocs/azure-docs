---
title: Manage Dev Box Pools Effectively
titleSuffix: Microsoft Dev Box
description: Manage dev box pools in Microsoft Dev Box with step-by-step guidance on creating, configuring, and deleting pools for optimal developer productivity.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 03/23/2025
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

The following steps show you how to create a dev box pool associated with a project. You use an existing dev box definition and network connection in the dev center to configure the pool.

If you don't have an available dev center with an existing dev box definition and network connection, follow the steps in [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md) to create them.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

   :::image type="content" source="./media/how-to-manage-dev-box-pools/discover-projects.png" alt-text="Screenshot that shows a search for projects from the Azure portal search box." lightbox="./media/how-to-manage-dev-box-pools/discover-projects.png":::

1. Open the Dev Box project with which you want to associate the new dev box pool.
  
   :::image type="content" source="./media/how-to-manage-dev-box-pools/projects-grid.png" alt-text="Screenshot of the list of existing projects." lightbox="./media/how-to-manage-dev-box-pools/projects-grid.png":::

1. Select **Dev box pools**, and then select **Create**.

   :::image type="content" source="./media/how-to-manage-dev-box-pools/dev-box-pool-grid-empty.png" alt-text="Screenshot of the empty list of dev box pools within a project, along with the Create button." lightbox="./media/how-to-manage-dev-box-pools/dev-box-pool-grid-empty.png":::

1. On the **Create a dev box pool** pane, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** |Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes. It must be unique within a project. |
   | **Dev box definition** | Select an existing dev box definition. The definition determines the base image and size for the dev boxes that are created in this pool. |
   | **Network connection** | 1. Select **Deploy to a Microsoft hosted network**, or use an existing network connection. </br>2. Select the region where the dev boxes should be deployed. Be sure to select a region that is close to where your developers are physically located to ensure the lowest latency experience with dev box. |
   |**Enable single sign-on** | Select **Yes** to enable single sign-on for the dev boxes in this pool. Single sign-on must be configured for the organization. See [Enable single sign-on for dev boxes](https://aka.ms/dev-box/single-sign-on). |
   | **Dev box Creator Privileges** | Select **Local Administrator** or **Standard User**. |
   | **Enable Auto-stop** | **Yes** is the default. Select **No** to disable an auto-stop schedule. You can configure an auto-stop schedule after the pool is created. |
   | **Stop time** | Select a time to shut down all the dev boxes in the pool. |
   | **Time zone** | Select the time zone that the stop time is in. |
   | **Licensing** | Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/how-to-manage-dev-box-pools/create-pool-details.png" alt-text="Screenshot of the pane for creating a dev box pool." lightbox="./media/how-to-manage-dev-box-pools/create-pool-details.png":::

1. Select **Create**.

1. Verify that the new dev box pool appears in the list. You might need to refresh the screen.

The Azure portal deploys the dev box pool and runs health checks to ensure that the image and network pass the validation criteria for dev boxes. The following screenshot shows four dev box pools, each with a different status.

:::image type="content" source="./media/how-to-manage-dev-box-pools/dev-box-pool-grid-populated.png" alt-text="Screenshot that shows a list of dev box pools and status information." lightbox="./media/how-to-manage-dev-box-pools/dev-box-pool-grid-populated.png" :::

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