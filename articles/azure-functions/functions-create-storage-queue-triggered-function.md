---
title: Create a function in Azure triggered by queue messages 
description: Use Azure Functions to create a serverless function that is invoked by messages submitted to a queue in Azure.
ms.assetid: 361da2a4-15d1-4903-bdc4-cc4b27fc3ff4
ms.topic: how-to
ms.date: 09/18/2024
ms.custom: mvc, cc996988-fb4f-47
---
# Create a function triggered by Azure Queue storage

Learn how to create a function that is triggered when messages are submitted to an Azure Storage queue.

[!INCLUDE [functions-in-portal-editing-note](../../includes/functions-in-portal-editing-note.md)]

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Azure Function app

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

Next, you create a function in the new function app.

<a name="create-function"></a>

## Create a Queue triggered function

1. In your function app, select **Overview**, and then select **+ Create** under **Functions**.

1. Under **Select a template**, scroll down and choose the **Azure Queue Storage trigger** template.

1. In **Template details**, configure the new trigger with the settings as specified in this table, then select **Create**:

    | Setting | Suggested value | Description |
    |---|---|---|
    | **Job type** | Append to app | You only see this setting for a Python v2 app. | 
    | **Name** | Unique in your function app | Name of this queue triggered function. |
    | **Queue name**   | myqueue-items    | Name of the queue to connect to in your Storage account. |
    | **Storage account connection** | AzureWebJobsStorage | You can use the storage account connection already being used by your function app, or create a new one.  |    

    Azure creates the Queue Storage triggered function based on the provided values. Next, you connect to your Azure storage account and create the **myqueue-items** storage queue.

## Create the queue

1. Return to the **Overview** page for your function app, select your **Resource group**, then find and select the storage account in your resource group.

1. In the storage account page, select **Data storage** > **Queues** > **+ Queue**. 

1. In the **Name** field, type `myqueue-items`, and then select **Create**.

1. Select the new **myqueue-items** queue, which you use to test the function by adding a message to the queue.

## Test the function

1. In a new browser window, return to your function app page and select **Log stream**, which displays real-time logging for your app.
    
1. In the **myqueue-items** queue, select **Add message**, type "Hello World!" in **Message text**, and select **OK**.

1. Go back to your function app logs and verify that the function ran to process the message from the queue.

1. Back in your storage queue, select **Refresh** and verify that the message has been processed and is no longer in the queue.

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps

You have created a function that runs when a message is added to a storage queue. For more information about Queue storage triggers, see [Azure Functions Storage queue bindings](functions-bindings-storage-queue.md).

Now that you have a created your first function, let's add an output binding to the function that writes a message back to another queue.

> [!div class="nextstepaction"]
> [Add messages to an Azure Storage queue using Functions](functions-integrate-storage-queue-output-binding.md)
