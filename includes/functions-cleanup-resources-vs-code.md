---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/28/2020
ms.author: glenga
---

## Clean up resources

When you continue to the next step, [Add an Azure Storage queue binding to your function][connect-storage-queue], you'll need to keep all your resources in place to build on what you've already done.

Otherwise, you can use the following steps to delete the function app and its related resources to avoid incurring any further costs.

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette. In the command palette, search for and select `Azure Functions: Open in portal`.

1. Choose your function app, and press <kbd>Enter</kbd>. The function app page opens in the Azure portal.

1. In the **Overview** tab, select the named link next to **Resource group**.

   :::image type="content" source="./media/functions-cleanup-resources-vs-code/functions-app-delete-resource-group.png" alt-text="Select the resource group to delete from the function app page.":::

1. In the **Resource group** page, review the list of included resources, and verify that they are the ones you want to delete.
 
1. Select **Delete resource group**, and follow the instructions.

   Deletion may take a couple of minutes. When it's done, a notification appears for a few seconds. You can also select the bell icon at the top of the page to view the notification.

To learn more about Functions costs, see [Estimating Consumption plan costs](../articles/azure-functions/functions-consumption-costs.md).