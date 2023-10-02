---
title: Manage a dev center
titleSuffix: Microsoft Dev Box
description: Microsoft Dev Box dev centers help you manage dev box resources, grouping projects with similar settings. Learn how to create, delete, and manage dev centers.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/25/2023
ms.topic: how-to
#Customer intent: As a platform engineer, I want to be able to manage dev centers so that I can manage my Microsoft Dev Box implementation.
---

# Manage a Microsoft Dev Box dev center

Development teams vary in the way they function and might have different needs. A dev center helps you manage these scenarios by enabling you to group similar sets of projects together and apply similar settings.

## Permissions

To manage a dev center, you need the following permissions:

|Action|Permissions required|
|-----|-----|
|Create or delete a dev center|Owner or Contributor permissions on an Azure subscription or a specific resource group.|
|Manage a dev center|Owner or Contributor role, or specific Write permission to the dev center.|
|Attach or remove a network connection|Network Contributor permissions on an existing network connection (Owner or Contributor).|

## Create a dev center

Your development teams' requirements change over time. You can create a new dev center to support organizational changes like a new business requirement or a new regional center. You can create as many or as few dev centers as you need, depending on how you organize and manage your development teams.

To create a dev center: 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the search results, select **Dev centers** from the **Services** list.

   :::image type="content" source="./media/how-to-manage-dev-center/search-dev-center.png" alt-text="Screenshot that shows the search box and list of services on the Azure portal.":::

1. On the **Dev centers** page, select **Create**.

   :::image type="content" source="./media/how-to-manage-dev-center/create-dev-center.png" alt-text="Screenshot that shows the Create button on the page for dev centers.":::

1. On the **Create a dev center** pane, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the dev center.|
   |**ResourceGroup**|Select an existing resource group, or select **Create new** and then enter a name for the new resource group.|
   |**Name**|Enter a name for the dev center.|
   |**Location**|Select the location or region where you want to create the dev center.|

   :::image type="content" source="./media/how-to-manage-dev-center/create-dev-center-basics.png" alt-text="Screenshot that shows the Basics tab on the pane for creating a dev center.":::

   For a list of supported Azure locations with capacity, see [Frequently asked questions about Microsoft Dev Box](https://aka.ms/devbox_acom).

1. (Optional) On the **Tags** tab, enter a name/value pair that you want to assign.

   :::image type="content" source="./media/how-to-manage-dev-center/create-dev-center-tags.png" alt-text="Screenshot that shows the Tags tab on the page for creating a dev center.":::

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Monitor the progress of the dev center creation from any page in the Azure portal by opening the **Notifications** pane.

   :::image type="content" source="./media/how-to-manage-dev-center/azure-notifications.png" alt-text="Screenshot that shows the Notifications pane in the Azure portal.":::

1. When the deployment is complete, select **Go to resource** and confirm that the dev center appears on the **Dev centers** page.

## Delete a dev center

You might choose to delete a dev center to reflect organizational or workload changes. Deleting a dev center is irreversible, and you must prepare for the deletion carefully.

A dev center can't be deleted while any projects are associated with it. You must delete the projects before you can delete the dev center.
Attached network connections and their associated virtual networks are not deleted when you delete a dev center.

When you're ready to delete your dev center, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the search results, select **Dev centers** from the **Services** list.

1. On the **Dev centers** page, open the dev center that you want to delete.

1. Select **Delete**.

    :::image type="content" source="./media/how-to-manage-dev-center/delete-dev-center.png" alt-text="Screenshot of the Delete button on the page for a dev center.":::

1. In the confirmation message, select **OK**.

## Attach a network connection

You can attach existing network connections to a dev center. You must attach a network connection to a dev center before you can use it in projects to create dev box pools.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the list of results, select **Dev centers**.

1. Select the dev center that you want to attach the network connection to, and then select **Networking**.

1. Select **+ Add**.

1. On the **Add network connection** pane, select the network connection that you created earlier, and then select **Add**.

## Remove a network connection

You can remove network connections from dev centers. Network connections can't be removed if one or more dev box pools are using them. When you remove a network connection, it's no longer available for use in dev box pools within the dev center.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the list of results, select **Dev centers**.

1. Select the dev center that you want to detach the network connection from, and then select **Networking**.

1. Select the network connection that you want to detach, and then select **Remove**.

1. In the confirmation message, select **OK**.

## Assign permissions for users

You can assign multiple users permissions to a dev center to help with administrative tasks. You can assign users or groups to the following built-in roles:

|**Role**|**Description**|
|-----|-----|
|**Owner**|Grants full access to manage all resources, including the ability to assign roles in Azure role-based access control (RBAC).|
|**Contributor**|Grants full access to manage all resources, but doesn't allow the user to assign roles in Azure RBAC, manage assignments in Azure Blueprints, or share image galleries.|
|**Reader**|Grants the ability to view all resources, but doesn't allow the user to make any changes.|

To make role assignments:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the list of results, select **Dev centers**.

1. Select the dev center that you want to give access to.

1. On the left menu, select **Access Control (IAM)**.

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | **Role** | Select **Owner**, **Contributor**, or **Reader**. |
    | **Assign access to** | Select **User, group, or service principal**. |
    | **Members** | Select the users or groups that you want to be able to access the dev center. |

## Next steps

- [Provide access to projects for project admins](./how-to-project-admin.md)
- [3. Create a dev box definition](quickstart-configure-dev-box-service.md#3-create-a-dev-box-definition)
- [Configure Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md)
