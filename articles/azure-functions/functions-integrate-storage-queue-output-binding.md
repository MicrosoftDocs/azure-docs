---
title: Create a function in Azure triggered by queue messages | Microsoft Docs
description: Use Azure Functions to create a serverless function that is invoked by a messages submitted to an Azure Storage queue.
services: azure-functions
documentationcenter: na
author: ggailey777
manager: erikre
editor: ''
tags: ''

ms.assetid: 0b609bc0-c264-4092-8e3e-0784dcc23b5d
ms.service: functions
ms.devlang: multiple
ms.topic: get-started-article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 04/25/2017
ms.author: glenga

---
# Add messages to an Azure Storage queue using Functions

Learn how to update an existing function by adding an output binding that sends messages to Azure Queue storage. 

![View message in the logs.](./media/functions-integrate-storage-queue-output-binding/functions-integrate-storage-binding-in-portal.png)

[!INCLUDE [Next steps note](../../includes/functions-quickstart-previous-topics.md)]

You also need to download and install the [Microsoft Azure Storage Explorer](http://storageexplorer.com/). 

It should take you less than five minutes to complete all the steps in this topic.

## Find your function    

1. Log in to the [Azure portal](https://portal.azure.com/). 

2. In the search bar at the top of the portal, type the name of your function app, select it from the list. Under the function app, select and expand the HTTP triggered function you created in the previous topic. 

## <a name="add-binding"></a>Add a Queue storage output binding
 
1. In your function, click **Integrate** and **+ New output**, then click **Azure Queue storage** and click **Select**.
    
    ![Add a Queue storage output binding to a function in the Azure portal.](./media/functions-integrate-storage-queue-output-binding/function-add-queue-storage-output-binding.png)

2. Choose a **Storage account connection** or click **New** to create a new one. Type `outqueue` for **Queue name** and `outQueueItem` for **Message parameter name**, then click **Save**.

    ![Add a Queue storage output binding to a function in the Azure portal.](./media/functions-integrate-storage-queue-output-binding/function-add-queue-storage-output-binding-2.png) 

Now that you have an output binding defined, you need to update the code to use the binding to add messages to a queue.  

## Update the function code

1. Click your function to display the function code in the editor. 

2. For a C# function, update your function definition as follows to add the **outQueueItem** storage binding parameter:

    ```cs   
    public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, 
        ICollector<string> outQueueItem, TraceWriter log)
    {
        ....
    }
    ```

3. Add the following code for your chosen language to the function just before the method returns: 

    ```javascript
        context.bindings.outQueueItem = "Name passed to the function: " + 
                (req.query.name || req.body.name);
    ```

    ```cs
    outQueueItem.Add("Name passed to the function: " + name);     
    ```

The value passed to the HTTP trigger is included in the message added to the queue.
 
## Test the function 

1. After the code changes are saved, click **Run**. 

    ![Add a Queue storage output binding to a function in the Azure portal.](./media/functions-integrate-storage-queue-output-binding/functions-test-run-function.png)

2. Check the logs to make sure that the function succeeded. A new queue named **outqueue** is created in your Storage account by Functions when your function runs.

Next, you can connect to your storage account to view the message you added to the new queue.

## Connect to the queue

1. In your function, click **Integrate** and the new **Azure Queue storage** output binding, then expand **Documentation**. Copy both **Account name** and **Account key**. You use these credentials to connect to the storage account.
 
    ![Get the Storage account connection credentials.](./media/functions-integrate-storage-queue-output-binding/function-get-storage-account-credentials.png)

2. Run the [Microsoft Azure Storage Explorer](http://storageexplorer.com/) tool, click the connect icon on the left, choose **Use a storage account name and key**, and click **Next**.

    ![Run the Storage Account Explorer tool.](./media/functions-integrate-storage-queue-output-binding/functions-storage-manager-connect-1.png)
    
3. Enter the **Account name** and **Account key** from step 1, click **Next** and then **Connect**. 
  
    ![Enter the storage credentials and connect.](./media/functions-integrate-storage-queue-output-binding/functions-storage-manager-connect-2.png)

4. Expand the attached storage account, right-click **Queues** and verify that a queue named **outqueue** exists. You should see a message already in the queue.  
 
    ![Create a storage queue.](./media/functions-integrate-storage-queue-output-binding/function-queue-storage-output-view-queue.png)

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps

You have added an output binding to an existing function. This binding adds messages to a storage queue. For more information, see [Azure Functions Storage queue bindings](functions-bindings-storage-queue.md). 

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]

[!INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]

