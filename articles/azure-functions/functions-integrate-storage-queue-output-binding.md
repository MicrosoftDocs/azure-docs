---
title: Add messages to an Azure Storage queue using Functions 
description: Use Azure Functions to create a serverless function that is invoked by an HTTP request and creates a message in an Azure Storage queue.

ms.assetid: 0b609bc0-c264-4092-8e3e-0784dcc23b5d
ms.topic: how-to
ms.date: 04/24/2020
ms.custom: mvc
---
# Add messages to an Azure Storage queue using Functions

In Azure Functions, input and output bindings provide a declarative way to make data from external services available to your code. In this quickstart, you use an output binding to create a message in a queue when a function is triggered by an HTTP request. You use Azure storage container to view the queue messages that your function creates.

## Prerequisites

To complete this quickstart:

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Follow the directions in [Create your first function from the Azure portal](functions-create-first-azure-function.md) and don't do the **Clean up resources** step. That quickstart creates the function app and function that you use here.

## <a name="add-binding"></a>Add an output binding

In this section, you use the portal UI to add a queue storage output binding to the function you created earlier. This binding makes it possible to write minimal code to create a message in a queue. You don't have to write code for tasks such as opening a storage connection, creating a queue, or getting a reference to a queue. The Azure Functions runtime and queue output binding take care of those tasks for you.

1. In the Azure portal, open the function app page for the function app that you created in [Create your first function from the Azure portal](functions-create-first-azure-function.md). To do open the page, search for and select **Function App**. Then, select your function app.

1. Select your function app, and then select the function that you created in that earlier quickstart.

1. Select **Integration**, and then select **+ Add output**.

   :::image type="content" source="./media/functions-integrate-storage-queue-output-binding/function-create-output-binding.png" alt-text="Create an output binding for your function." border="true":::

1. Select the **Azure Queue Storage** binding type, and add the settings as specified in the table that follows this screenshot: 

    :::image type="content" source="./media/functions-integrate-storage-queue-output-binding/function-create-output-binding-details.png" alt-text="Add a Queue storage output binding to a function in the Azure portal." border="true":::
    
    | Setting      |  Suggested value   | Description                              |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Message parameter name** | outputQueueItem | The name of the output binding parameter. | 
    | **Queue name**   | outqueue  | The name of the queue to connect to in your Storage account. |
    | **Storage account connection** | AzureWebJobsStorage | You can use the storage account connection already being used by your function app, or create a new one.  |

1. Select **OK** to add the binding.

Now that you have an output binding defined, you need to update the code to use the binding to add messages to a queue.  

## Add code that uses the output binding

In this section, you add code that writes a message to the output queue. The message includes the value that is passed to the HTTP trigger in the query string. For example, if the query string includes `name=Azure`, the queue message will be *Name passed to the function: Azure*.

1. In your function, select **Code + Test** to display the function code in the editor.

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

1. After the code changes are saved, select **Test**.
1. Confirm that your test matches the image below and select **Run**. 

    :::image type="content" source="./media/functions-integrate-storage-queue-output-binding/functions-test-run-function.png" alt-text="Test the queue storage binding in the Azure portal." border="true":::

    Notice that the **Request body** contains the `name` value *Azure*. This value appears in the queue message that is created when the function is invoked.
    
    As an alternative to selecting **Run** here, you can call the function by entering a URL in a browser and specifying the `name` value in the query string. The browser method is shown in the [previous quickstart](functions-create-first-azure-function.md#test-the-function).

1. Check the logs to make sure that the function succeeded. 

A new queue named **outqueue** is created in your Storage account by the Functions runtime when the output binding is first used. You'll use storage account to verify that the queue and a message in it were created.

### Find the storage account connected to AzureWebJobsStorage


1. Go to your function app and select **Configuration**.

1. Under **Application settings**, select **AzureWebJobsStorage**.

    :::image type="content" source="./media/functions-integrate-storage-queue-output-binding/function-find-storage-account.png" alt-text="Locate the storage account connected to AzureWebJobsStorage." border="true":::

1. Locate and make note of the account name.

    :::image type="content" source="./media/functions-integrate-storage-queue-output-binding/function-storage-account-name.png" alt-text="Locate the storage account connected to AzureWebJobsStorage." border="true":::

### Examine the output queue

1. In the resource group for your function app, select the storage account that you're using for this quickstart.

1. Under **Queue service**, select **Queues** and select the queue named **outqueue**. 

   The queue contains the message that the queue output binding created when you ran the HTTP-triggered function. If you invoked the function with the default `name` value of *Azure*, the queue message is *Name passed to the function: Azure*.

1. Run the function again, and you'll see a new message appear in the queue.  

## Clean up resources

[!INCLUDE [Clean up resources](../../includes/functions-quickstart-cleanup.md)]

## Next steps

In this quickstart, you added an output binding to an existing function. For more information about binding to Queue storage, see [Azure Functions Storage queue bindings](functions-bindings-storage-queue.md).

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps-2.md)]
