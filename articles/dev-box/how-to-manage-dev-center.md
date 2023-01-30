---
title: How to manage a dev center
titleSuffix: Microsoft Dev Box Preview
description: This article describes how to create, delete, and manage Microsoft Dev Box Preview dev centers.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 10/12/2022
ms.topic: how-to
---

<!-- Intent: As a dev infrastructure manager, I want to be able to manage dev centers so that I can manage my Microsoft Dev Box Preview implementation. -->

# Manage a dev center
Development teams vary in the way they function and may have different needs. A dev center helps you to manage these different scenarios by enabling you to group similar sets of projects together and apply similar settings.
## Permissions
To manage a dev center, you need the following permissions:

|Action|Permission required|
|-----|-----|
|Create or delete dev center|Owner or Contributor permissions on an Azure Subscription or a specific resource group.|
|Manage a dev center|Owner or Contributor roles, or specific Write permission to the dev center.|
|Attach or remove network connection|Network Contributor permissions on an existing network connection (owner or contributor).|

## Create a dev center
Your development teams’ requirements change over time. You can create a new dev center to support organizational changes like a new business requirement or a new regional center. You can create as many or as few dev centers as you need, depending on how you organize and manage your development teams.

The following steps show you how to create a dev center.  

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *Dev centers* and then select **Dev centers** from the Services list.

   :::image type="content" source="./media/how-to-manage-dev-center/search-dev-center.png" alt-text="Screenshot showing the Azure portal with the search box highlighted."::: 

1. On the dev centers page, select **+Create**. 
   :::image type="content" source="./media/how-to-manage-dev-center/create-dev-center.png" alt-text="Screenshot showing the Azure portal Dev center with create highlighted.":::

1. On the **Create a dev center** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the dev center.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Name**|Enter a name for your dev center.|
   |**Location**|Select the location/region you want the dev center to be created in.|
 
   :::image type="content" source="./media/how-to-manage-dev-center/create-dev-center-basics.png" alt-text="Screenshot showing the Create dev center Basics tab."::: 
       
   The currently supported Azure locations with capacity are listed here: [Microsoft Dev Box Preview](https://aka.ms/devbox_acom).

1. [Optional] On the **Tags** tab, enter a name and value pair that you want to assign.
   :::image type="content" source="./media/how-to-manage-dev-center/create-dev-center-tags.png" alt-text="Screenshot showing the Create dev center Tags tab."::: 

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. You can check on the progress of the dev center creation from any page in the Azure portal by opening the notifications pane. 
   :::image type="content" source="./media/how-to-manage-dev-center/azure-notifications.png" alt-text="Screenshot showing Azure portal notifications pane.":::

1. When the deployment is complete, select **Go to resource**. You'll see the dev center page.

## Delete a dev center
You may choose to delete a dev center to reflect organizational or workload changes. Deleting a dev center is irreversible and you must prepare for the deletion carefully. 

A dev center cannot be deleted any projects are associated with it. You must delete the projects before you can delete the dev center.
Attached network connections and their associated virtual networks are not deleted when you delete a dev center.

When you're ready to delete your dev center, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *Dev centers* and then select **Dev centers** from the Services list.

1.  From the dev centers page, open the dev center you want to delete.
 
1. Select **Delete**. 
    :::image type="content" source="./media/how-to-manage-dev-center/delete-dev-center.png" alt-text="Screenshot the dev center page with Delete highlighted.":::

1. In the confirmation message, select **OK**.
 
## Attach a network connection
You can attach existing network connections to a dev center. You must attach a network connection to a dev center before it can be used in projects to create dev box pools.

1. In the [Azure portal](https://portal.azure.com), in the search box, type *Dev centers* and then select **Dev centers** from the list.

1. Select the dev center you want to attach the network connection to and select **Networking**. 
 
1. Select  **+ Add**.
 
1. In the **Add network connection** pane, select the network connection you created earlier, and then select **Add**. 

## Remove a network connection
You can remove network connections from dev centers. Network connections cannot be removed if they are in use by one or more dev box pools. When a network connection is removed, it's no longer available for use in dev box pools within the DevCenter.

1. In the [Azure portal](https://portal.azure.com), in the search box, type *Dev centers* and then select **Dev centers** from the list.

1. Select the dev center you want to detach the network connection from and select **Networking**. 
 
1. Select the network connection you want to detach and select **Remove**.
 
1. In the confirmation message, select **OK**.
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