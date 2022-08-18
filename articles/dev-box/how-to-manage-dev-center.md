---
title: How to manage a dev center
titleSuffix: Microsoft Dev Box
description: This article describes how to create, delete, and manage Microsoft Dev Box dev centers.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 08/18/2022
ms.topic: how-to
---

<!-- Intent: As a dev infrastructure manager, I want to be able to manage dev centers so that I can manage my Microsoft Dev Box implementation. -->

# Manage a dev center

A dev center is a collection of projects that you want to manage together. They may require similar settings, use the same images and SKUs, or connect through the same network connection.

## Permissions

To manage a dev center, you need both:
•	Owner or Contributor permissions on an Azure Subscription or a specific resource group.
•	Network Contributor permissions on an existing virtual network (owner or contributor) or permission to create a new virtual network and subnet.

## Create a dev center

Your development teams’ requirements change over time. You can create a new dev center to support organizational changes like a new business requirement or a new regional center.

Most organizations use a single dev center, but you can create as many as you require.

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
 
   :::image type="content" source="./media/how-to-manage-dev-center/create-devcenter-basics.png" alt-text="Screenshot showing the Create dev center Basics tab."::: 
       
   The currently supported Azure locations with capacity are listed here: [Microsoft Dev Box](https://aka.ms/devbox_acom).

1. [Optional] On the **Tags** tab, enter a name and value pair that you want to assign.
   :::image type="content" source="./media/how-to-manage-dev-center/create-devcenter-tags.png" alt-text="Screenshot showing the Create dev center Tags tab."::: 

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. You can check on the progress of the dev center creation from any page in the Azure portal by opening the notifications pane. 
   :::image type="content" source="./media/how-to-manage-dev-center/azure-notifications.png" alt-text="Screenshot showing Azure portal notifications pane.":::

1. When the deployment is complete, select **Go to resource**. You'll see the dev center page.


## Delete a dev center

You may choose to delete a dev center to reflect organizational or workload changes. Deleting a dev center is irreversible and you must prepare for the deletion carefully. 

A dev center cannot be deleted if it contains any projects. You must delete the projects before you can delete the dev center.

When you are ready to delete your dev center, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *Dev centers* and then select **Dev centers** from the Services list.

1.  From the dev centers page, open the dev center you want to delete.
 
1. Select **Delete**. 
    :::image type="content" source="./media/how-to-manage-dev-center/delete-dev-center.png" alt-text="Screenshot the dev center page with Delete highlighted.":::

1. In the confirmation message, select **OK**.
 
## Next steps

- [Provide access to projects for project admins](./how-to-project-admin.md)