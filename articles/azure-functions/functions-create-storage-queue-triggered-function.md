---
title: Create a function in Azure triggered by queue messages 
description: Use Azure Functions to create a serverless function that is invoked by a messages submitted to a queue in Azure.

ms.assetid: 361da2a4-15d1-4903-bdc4-cc4b27fc3ff4
ms.topic: how-to
ms.date: 10/01/2018
ms.custom: mvc, cc996988-fb4f-47
---
# Create a function triggered by Azure Queue storage

Learn how to create a function that is triggered when messages are submitted to an Azure Storage queue.

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Azure Function app

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

   :::image type="content" source="./media/functions-create-storage-queue-triggered-function/function-app-create-success.png" alt-text="Function app successfully created.." border="true":::

Next, you create a function in the new function app.

<a name="create-function"></a>

## Create a Queue triggered function

1. Select **Functions**, and then select **+ Add** to add a new function.

   :::image type="content" source="./media/functions-create-storage-queue-triggered-function/functions-app-quickstart-choose-template.png" alt-text="Choose a Function template in the Azure portal." border="true":::

1. Choose the **Azure Queue Storage trigger** template.

1. Use the settings as specified in the table below the image.

    :::image type="content" source="./media/functions-create-storage-queue-triggered-function/functions-create-queue-storage-trigger-portal.png" alt-text="Name and configure the queue storage triggered function." border="true":::


    | Setting | Suggested value | Description |
    |---|---|---|
    | **Name** | Unique in your function app | Name of this queue triggered function. |
    | **Queue name**   | myqueue-items    | Name of the queue to connect to in your Storage account. |
    | **Storage account connection** | AzureWebJobsStorage | You can use the storage account connection already being used by your function app, or create a new one.  |    

1. Select **Create Function** to create your function.

    :::image type="content" source="./media/functions-create-storage-queue-triggered-function/functions-create-queue-storage-trigger-portal-3.png" alt-text="Create the queue storage triggered function." border="true":::

Next, you connect to your Azure storage account and create the **myqueue-items** storage queue.

## Create the queue

1. In your function, on the **Overview** page, select your resource group.

    :::image type="content" source="./media/functions-create-storage-queue-triggered-function/functions-storage-resource-group.png" alt-text="Select your Azure portal resource group." border="true":::

1. Find and select your resource group's storage account.

    :::image type="content" source="./media/functions-create-storage-queue-triggered-function/functions-storage-account-access.png" alt-text="Access the storage account." border="true":::

1. Choose **Queues**, and then choose **+ Queue**. 

    :::image type="content" source="./media/functions-create-storage-queue-triggered-function/functions-storage-add-queue.png" alt-text="Add a queue to your storage account in the Azure portal." border="true":::

1. In the **Name** field, type `myqueue-items`, and then select **Create**.

    :::image type="content" source="./media/functions-create-storage-queue-triggered-function/functions-storage-name-queue.png" alt-text="Name the queue storage container." border="true":::

Now that you have a storage queue, you can test the function by adding a message to the queue.

## Test the function

1. Back in the Azure portal, browse to your function expand the **Logs** at the bottom of the page and make sure that log streaming isn't paused.

    :::image type="content" source="./media/functions-create-storage-queue-triggered-function/functions-queue-storage-log-expander.png" alt-text="Expand the log in the Azure portal." border="true":::

1. In a separate browser window, go to your resource group in the Azure portal, and select the storage account.

1. Select **Queues**, and then select the **myqueue-items** container.

    :::image type="content" source="./media/functions-create-storage-queue-triggered-function/functions-storage-queue.png" alt-text="Go to your myqueue-items queue in the Azure portal." border="true":::

1. Select **Add message**, and type "Hello World!" in **Message text**. Select **OK**.

    :::image type="content" source="./media/functions-create-storage-queue-triggered-function/functions-storage-queue-test.png" alt-text="Go to your myqueue-items queue in the Azure portal." border="true":::

1. Wait for a few seconds, then go back to your function logs and verify that the new message has been read from the queue.

    :::image type="content" source="./media/functions-create-storage-queue-triggered-function/function-app-in-portal-editor.png" alt-text="View message in the logs." border="true":::

1. Back in your storage queue, select **Refresh** and verify that the message has been processed and is no longer in the queue.

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps

You have created a function that runs when a message is added to a storage queue. For more information about Queue storage triggers, see [Azure Functions Storage queue bindings](functions-bindings-storage-queue.md).

Now that you have a created your first function, let's add an output binding to the function that writes a message back to another queue.

> [!div class="nextstepaction"]
> [Add messages to an Azure Storage queue using Functions](functions-integrate-storage-queue-output-binding.md)
