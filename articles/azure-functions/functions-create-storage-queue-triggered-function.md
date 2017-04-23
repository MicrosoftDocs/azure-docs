---
title: Create a function in Azure triggered by queue messages | Microsoft Docs
description: Use Azure Functions to create a serverless function that is invoked by a messages submitted to an Azure Storage queue.
services: azure-functions
documentationcenter: na
author: ggailey777
manager: erikre
editor: ''
tags: ''

ms.assetid: 361da2a4-15d1-4903-bdc4-cc4b27fc3ff4
ms.service: functions
ms.devlang: multiple
ms.topic: get-started-article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 04/22/2017
ms.author: glenga

---
# Create a function triggered by Azure Queue storage

Learn how to create a function triggered when messages are submitted to an Azure Storage queue. 

![View message in the logs.](./media/functions-create-storage-queue-triggered-function/functions-queue-storage-trigger-view-logs.png)

[!INCLUDE [Next steps note](../../includes/functions-quickstart-previous-topics.md)]

You also need to download and install the [Microsoft Azure Storage Explorer](http://storageexplorer.com/). 

It should take you less than five minutes to complete all the steps in this topic.

## Find your function app    

1. Log in to the [Azure portal](https://portal.azure.com/). 

2. In the search bar at the top of the portal, type the name of your function app and select it from the list.

## <a name="create-function"></a>Create a Queue storage triggered function

In your function app, click the **+** button next to **Functions**, click the **QueueTrigger** template for your desired language, and click **Create**.
   
![Create a Queue storage triggered function in the Azure portal.](./media/functions-create-storage-queue-triggered-function/functions-create-queue-storage-trigger-portal.png) 

This function is connected to the default storage account, the same one already used by the function app. Next, you create the **myqueue-items** queue in that storage account.

## Create the queue

1. In your function, click **Integrate**, expand **Documentation**, and copy both **Account name** and **Account key**. You use these credentials to connect to the storage account.
 
    ![Get the Storage account connection credentials.](./media/functions-create-storage-queue-triggered-function/functions-storage-account-connection.png)

2. Run the [Microsoft Azure Storage Explorer](http://storageexplorer.com/) tool, click the connect icon on the left, choose **Use a storage account name and key**, and click **Next**.

    ![Run the Storage Account Explorer tool.](./media/functions-create-storage-queue-triggered-function/functions-storage-manager-connect-1.png)
    
4. Enter the **Account name** and **Account key** from step 1, click **Next** and then **Connect**. 
  
    ![Enter the storage credentials and connect.](./media/functions-create-storage-queue-triggered-function/functions-storage-manager-connect-2.png)

5. Expand the attached storage account, right-click **Queues**, click **Create queue**, type `myqueue-items`, and then press enter.
 
    ![Create a storage queue.](./media/functions-create-storage-queue-triggered-function/functions-storage-manager-create-queue.png)

Now that you have a storage queue, you can test the function by adding a message to the queue.  

## Test the function

1. Back in the Azure portal, browse to your function expand the **Logs** at the bottom of the page and make sure that log streaming isn't paused.

2. In Storage Explorer, expand your storage account, **Queues**, and **myqueue-items**, then click **Add message**. 

    ![Add a message to the queue.](./media/functions-create-storage-queue-triggered-function/functions-storage-manager-add-message.png)

2. Type your **Message text** and click **OK**.
 
3. Go back to your function logs and verify that the new message is read from the queue. 

    ![View message in the logs.](./media/functions-create-storage-queue-triggered-function/functions-queue-storage-trigger-view-logs.png)

4. Back in Storage Explorer, click **Refresh** and verify that the message has been processed and is no longer in the queue.

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps

You have created a function that runs when a message is added to a storage queue. For more information, see [Azure Functions Storage queue bindings](functions-bindings-storage-queue.md). 

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]

[!INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]

