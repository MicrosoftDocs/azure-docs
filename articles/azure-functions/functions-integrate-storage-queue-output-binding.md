---
title: Add messages to an Azure Storage queue using Functions | Microsoft Docs
description: Use Azure Functions to create a serverless function that is invoked by an HTTP request and creates a message in an Azure Storage queue.
services: azure-functions
documentationcenter: na
author: ggailey777
manager: jeconnoc

ms.assetid: 0b609bc0-c264-4092-8e3e-0784dcc23b5d
ms.service: azure-functions
ms.devlang: multiple
ms.topic: quickstart
ms.date: 09/19/2017
ms.author: glenga
ms.custom: mvc
---
# Add messages to an Azure Storage queue using Functions

In Azure Functions, input and output bindings provide a declarative way to make data from external services available to your code. In this quickstart, you use an output binding to create a message in a queue when a function is triggered by an HTTP request. You use Azure Storage Explorer to view the queue messages that your function creates:

![Queue message shown in Storage Explorer](./media/functions-integrate-storage-queue-output-binding/function-queue-storage-output-view-queue.png)

## Prerequisites

To complete this quickstart:

* Follow the directions in [Create your first function from the Azure portal](functions-create-first-azure-function.md) and don't do the **Clean up resources** step. That quickstart creates the function app and function that you use here.

* Install [Microsoft Azure Storage Explorer](http://storageexplorer.com/). This is a tool you'll use to examine queue messages that your output binding creates.

## <a name="add-binding"></a>Add an output binding

In this section, you use the portal UI to add a queue storage output binding to the function you created earlier. This binding will make it possible to write minimal code to create a message in a queue. You don't have to write code for tasks such as opening a storage connection, creating a queue, or getting a reference to a queue. The Azure Functions runtime and queue output binding take care of those tasks for you.

1. In the Azure portal, open the function app page for the function app that you created in [Create your first function from the Azure portal](functions-create-first-azure-function.md). To do this, select **All services > Function Apps**, and then select your function app.

1. Select the function that you created in that earlier quickstart.

1. Select **Integrate > New output > Azure Queue storage**.

1. Click **Select**.

    ![Add a Queue storage output binding to a function in the Azure portal.](./media/functions-integrate-storage-queue-output-binding/function-add-queue-storage-output-binding.png)

1. If you get an **Extensions not installed** message, choose **Install** to install the Storage bindings extension in the function app. This may take a minute or two.

    ![Install the Storage binding extension](./media/functions-integrate-storage-queue-output-binding/functions-integrate-install-binding-extension.png)

1. Under **Azure Queue Storage output**, use the settings as specified in the table that follows this screenshot: 

    ![Add a Queue storage output binding to a function in the Azure portal.](./media/functions-integrate-storage-queue-output-binding/function-add-queue-storage-output-binding-2.png)

    | Setting      |  Suggested value   | Description                              |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Message parameter name** | outputQueueItem | The name of the output binding parameter. | 
    | **Storage account connection** | AzureWebJobsStorage | You can use the storage account connection already being used by your function app, or create a new one.  |
    | **Queue name**   | outqueue    | The name of the queue to connect to in your Storage account. |

1. Click **Save** to add the binding.

Now that you have an output binding defined, you need to update the code to use the binding to add messages to a queue.  

## Add code that uses the output binding

In this section, you add code that writes a message to the output queue. The message includes the value that is passed to the HTTP trigger in the query string. For example, if the query string includes `name=Azure`, the queue message will be *Name passed to the function: Azure*.

1. Select your function to display the function code in the editor.

1. Update the function code depending on your function language:

    # [C\#](#tab/csharp)

    Add an **outputQueueItem** parameter to the method signature as shown in the following example.

    ```cs
    public static async Task<IActionResult> Run(HttpRequest req,
        ICollector<string> outputQueueItem, ILogger log)
    {
        ...
    }
    ```

    In the body of the function just before the `return` statement, add code that uses the parameter to create a queue message.

    ```cs
    outputQueueItem.Add("Name passed to the function: " + name);
    ```

    # [JavaScript](#tab/nodejs)

    Add code that uses the output binding on the `context.bindings` object to create a queue message. Add this code before the`context.done` statement.

    ```javascript
    context.bindings.outputQueueItem = "Name passed to the function: " + 
                (req.query.name || req.body.name);
    ```

    ---

1. Select **Save** to save changes.

## Test the function

1. After the code changes are saved, select **Run**. 

    ![Add a Queue storage output binding to a function in the Azure portal.](./media/functions-integrate-storage-queue-output-binding/functions-test-run-function.png)

    Notice that the **Request body** contains the `name` value *Azure*. This value appears in the queue message that is created when the function is invoked.
    
    As an alternative to selecting **Run** here, you can call the function by entering a URL in a browser and specifying the `name` value in the query string. The browser method is shown in the [previous quickstart](functions-create-first-azure-function.md#test-the-function).

2. Check the logs to make sure that the function succeeded. 

A new queue named **outqueue** is created in your Storage account by the Functions runtime when the output binding is first used. You'll use Storage Explorer to verify that the queue and a message in it were created.

### Connect Storage Explorer to your account

Skip this section if you have already installed Storage Explorer and connected it to the storage account that you're using with this quickstart.

2. Run the [Microsoft Azure Storage Explorer](http://storageexplorer.com/) tool, select the connect icon on the left, choose **Use a storage account name and key**, and select **Next**.

    ![Run the Storage Account Explorer tool.](./media/functions-integrate-storage-queue-output-binding/functions-storage-manager-connect-1.png)

1. In the Azure portal, on the function app page, select your function and then select **Integrate**.

1. Select the **Azure Queue storage** output binding that you added in an earlier step.

1. Expand the **Documentation** section at the bottom of the page. 

   The portal shows credentials that you can use in Storage Explorer to connect to the storage account.

   ![Get the Storage account connection credentials.](./media/functions-integrate-storage-queue-output-binding/function-get-storage-account-credentials.png)

1. Copy the **Account Name** value from the portal and paste it in the **Account name** box in Storage Explorer.
 
1. Click the show/hide icon next to **Account Key** to display the value, and then copy the **Account Key** value and paste it in the **Account key** box in Storage Explorer.
  
3. Select **Next > Connect**.

   ![Paste the storage credentials and connect.](./media/functions-integrate-storage-queue-output-binding/functions-storage-manager-connect-2.png)

### Examine the output queue

4. In Storage Explorer, select the storage account that you're using for this quickstart.

1. Expand the **Queues** node, and then select the queue named **outqueue**. 

   The queue contains the message that the queue output binding created when you ran the HTTP-triggered function. If you invoked the function with the default `name` value of *Azure*, the queue message is *Name passed to the function: Azure*.

    ![Queue message shown in Storage Explorer](./media/functions-integrate-storage-queue-output-binding/function-queue-storage-output-view-queue.png)

2. Run the function again, and you'll see a new message appear in the queue.  

## Clean up resources

[!INCLUDE [Clean up resources](../../includes/functions-quickstart-cleanup.md)]

## Next steps

In this quickstart, you added an output binding to an existing function. For more information about binding to Queue storage, see [Azure Functions Storage queue bindings](functions-bindings-storage-queue.md). 

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]
