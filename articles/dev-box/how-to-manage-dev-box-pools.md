---
title: How to manage a dev box pool
titleSuffix: Microsoft Dev Box
description: This article describes how to create, delete, and manage Microsoft Dev Box dev box pools.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 08/30/2022
ms.topic: how-to
---

<!-- Intent: As a dev infrastructure manager, I want to be able to manage dev box pools so that I can provide appropriate dev boxes to my users. -->

# Manage a dev box pool
To enable developers to self-serve dev boxes in projects, you must configure dev box pools that specify the dev box definitions and network connections used when dev boxes are created. Dev box users create dev boxes using the dev box pool. 


## Permissions
To manage a dev center, you need the following permissions:

|Action|Permission required|
|-----|-----|
|Create or delete dev center|Owner or Contributor permissions on an Azure Subscription or a specific resource group.|
|Manage a dev center|Owner or Contributor roles, or specific Write permission to the dev center.|
|Attach or remove network connection|Network Contributor permissions on an existing network connection (owner or contributor).|

## Create a dev box pool
A dev box pool is a collection of dev boxes that you manage together. You must have a pool before users can create a dev box, and all dev boxes created in the pool will be in the same region. 

The following steps show you how to create a dev box pool associated with a project. You'll use an existing dev box definition and network connection in the dev center to configure a dev box pool. 

<!-- how many dev box pools? -->

If you don't have an available dev center with an existing dev box definition and network connection, follow the steps in [Quickstart: Configure the Microsoft Dev Box service](quickstart-configure-dev-box-service.md) to create them.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box, type *Projects* and then select **Projects** from the list.

    <!--    :::image type="content" source="./media/quickstart-configure-dev-box-projects/discovery-via-azure-portal.png" alt-text="Screenshot showing the Azure portal with the search box highlighted."::: -->

3. Open the project in which you want to create the dev box pool.
  
   :::image type="content" source="./media/quickstart-configure-dev-box-projects/projects-grid.png" alt-text="Screenshot of the list of existing projects.":::

4. Select **Dev box pools** and then select **+ Create**.
 
   :::image type="content" source="./media/quickstart-configure-dev-box-projects/dev-box-pool-grid-empty.png" alt-text="Screenshot of the list of dev box pools within a project. The list is empty.":::

5. On the **Create a dev box pool** page, enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes, and must be unique within a project.|
   |**Dev box definition**|Select an existing dev box definition. The definition determines the base image and size for the dev boxes created within this pool.|
   |**Network connection**|Select an existing network connection. The network connection determines the region of the dev boxes created within this pool.|
   |**Dev Box Creator Privileges**|Select Local Administrator or Standard User.|
   |**Licensing**| Select this check box if your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/quickstart-configure-dev-box-projects/dev-box-pool-create.png" alt-text="Screenshot of the Create dev box pool dialog."::: 

6. Select **Add**.
 
7. Verify that the new dev box pool appears in the list. You may need to refresh the screen.

The dev box pool will be deployed and health checks will be run to ensure the image and network pass the validation criteria to be used for dev boxes. The screenshot below shows four dev box pools, each with a different status. 

   :::image type="content" source="./media/quickstart-configure-dev-box-projects/dev-box-pool-grid-populated.png" alt-text="Screenshot showing a list of existing pools.":::


## Delete a box pool

 

## Assign permissions for users  
You can assign multiple users permissions to a dev center to help with administrative tasks. You can assign users or groups to the following built-in roles:

|**Role**|**Description**|
|-----|-----|
|**Owner**|Grants full access to manage all resources, including the ability to assign roles in Azure RBAC.|
|**Contributor**|Grants full access to manage all resources, but does not allow you to assign roles in Azure RBAC, manage assignments in Azure Blueprints, or share image galleries.| 
|**Reader**|View all resources, but doesn't allow you to make any changes.|

To make role assignments, use the following steps:
1. In the [Azure portal](https://portal.azure.com), in the search box, type *Dev centers* and then select **Dev centers** from the list.

1. Select the dev center you want to provide access to.

1. Select **Access Control (IAM)** from the left menu.

   :::image type="content" source="./media/how-to-manage-dev-center/dev-center-access-control.png" alt-text="Screenshot showing the dev center page with the Access Control link highlighted.":::

1. Select **Add** > **Add role assignment**.

   :::image type="content" source="./media/how-to-manage-dev-center/add-role-assignment.png" alt-text="Screenshot showing the Add menu with Add role assignment highlighted.":::

1. On the Add role assignment page, choose the built-in role you want to assign, and then select **Next**.

   :::image type="content" source="./media/how-to-manage-dev-center/dev-center-built-in-roles.png" alt-text="Screenshot showing the Add role assignment search box highlighted.":::

1. On the Members page, select **+ Select Members**.

   :::image type="content" source="./media/how-to-manage-dev-center/dev-center-owner-select-members.png" alt-text="Screenshot showing the Members tab with Select members highlighted.":::

1. On the **Select members** pane, select the Active Directory Users or Groups you want to add, and then select **Select**.

   :::image type="content" source="./media/how-to-manage-dev-center/select-members-search.png" alt-text="Screenshot showing the Select members pane with a user account highlighted.":::

1. On the Add role assignment page, select **Review + assign**.
## Next steps

- [Provide access to projects for project admins](./how-to-project-admin.md)
- [Create dev box definitions](./quickstart-configure-dev-box-service.md#create-a-dev-box-definition)
- [Configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md)