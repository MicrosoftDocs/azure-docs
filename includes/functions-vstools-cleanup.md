---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/28/2021
ms.author: glenga
---

Use the following steps to delete the function app and its related resources to avoid incurring any further costs.

1. In the Visual Studio Publish dialogue, in the Hosting section, select **Open in Azure portal**. 

1. In the function app page, select the **Overview** tab and then select the link under **Resource group**.

   :::image type="content" source="media/functions-vstools-cleanup/functions-app-delete-resource-group.png" alt-text="Select the resource group to delete from the function app page":::

2. In the **Resource group** page, review the list of included resources, and verify that they're the ones you want to delete.
 
3. Select **Delete resource group**, and follow the instructions.

   Deletion may take a couple of minutes. When it's done, a notification appears for a few seconds. You can also select the bell icon at the top of the page to view the notification.