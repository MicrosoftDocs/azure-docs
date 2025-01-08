---
title: Add messages to an Azure Storage queue using Functions 
description: Use Azure Functions to create a serverless function that's triggered by an HTTP request and creates a message in an Azure Storage queue.
ms.service: azure-functions
ms.topic: how-to
ms.date: 06/19/2024
ms.devlang: csharp
# ms.devlang: csharp, javascript
ms.custom: "devx-track-csharp, mvc"

#Customer intent: As a function developer, I want to learn how to use Azure Functions to create a serverless function that's triggered by an HTTP request so that I can create a message in an Azure Storage queue.

---
# Add messages to an Azure Storage queue using Functions

In Azure Functions, input and output bindings provide a declarative way to make data from external services available to your code. In this article, you use an output binding to create a message in a queue when an HTTP request triggers a function. You use Azure storage container to view the queue messages that your function creates.

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Follow the directions in [Create your first function in the Azure portal](./functions-create-function-app-portal.md), omitting the **Clean up resources** step, to create the function app and function to use in this article.

## Add an output binding

In this section, you use the portal UI to add an Azure Queue Storage output binding to the function you created in the prerequisites. This binding makes it possible to write minimal code to create a message in a queue. You don't need to write code for such tasks as opening a storage connection, creating a queue, or getting a reference to a queue. The Azure Functions runtime and queue output binding take care of those tasks for you.

1. In the Azure portal, search for and select the function app that you created in [Create your first function from the Azure portal](./functions-get-started.md).

1. In your function app, select the function that you created.

1. Select **Integration**, and then select **+ Add output**.

   :::image type="content" source="./media/functions-integrate-storage-queue-output-binding/function-create-output-binding.png" alt-text="Screenshot that shows how to create an output binding for your function." lightbox="./media/functions-integrate-storage-queue-output-binding/function-create-output-binding.png":::

1. Select the **Azure Queue Storage** binding type and add the settings as specified in the table that follows this screenshot:

    :::image type="content" source="./media/functions-integrate-storage-queue-output-binding/function-create-output-binding-details.png" alt-text="Screenshot that shows how to add a Queue Storage output binding to a function in the Azure portal.":::

    | Setting      |  Suggested value   | description                              |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Message parameter name** | outputQueueItem | The name of the output binding parameter. |
    | **Queue name**   | outqueue  | The name of the queue to connect to in your storage account. |
    | **Storage account connection** | AzureWebJobsStorage | You can use the existing storage account connection used by your function app or create a new one.  |

1. Select **OK** to add the binding.

Now that you have an output binding defined, you need to update the code to use the binding to add messages to a queue.  

## Add code that uses the output binding

In this section, you add code that writes a message to the output queue. The message includes the value passed to the HTTP trigger in the query string. For example, if the query string includes `name=Azure`, the queue message is *Name passed to the function: Azure*.

1. In your function, select **Code + Test** to display the function code in the editor.

1. Update the function code, according to your function language:

    # [C\#](#tab/csharp)

    Add an **outputQueueItem** parameter to the method signature as shown in the following example:

    ```cs
    public static async Task<IActionResult> Run(HttpRequest req,
        ICollector<string> outputQueueItem, ILogger log)
    {
        ...
    }
    ```

    In the body of the function, just before the `return` statement, add code that uses the parameter to create a queue message:

    ```cs
    outputQueueItem.Add("Name passed to the function: " + name);
    ```

    # [JavaScript](#tab/nodejs)

    To create a queue message, add code that uses the output binding on the `context.bindings` object:

    ```javascript
    context.bindings.outputQueueItem = "Name passed to the function: " + 
                (req.query.name || req.body.name);
    ```

    ---

1. Select **Save** to save your changes.

## Test the function

1. After the code changes are saved, select **Test**.

1. Confirm that your test matches this screenshot, and then select **Run**.

    :::image type="content" source="./media/functions-integrate-storage-queue-output-binding/functions-test-run-function.png" alt-text="Screenshot that shows how to test the Queue Storage binding in the Azure portal." lightbox="./media/functions-integrate-storage-queue-output-binding/functions-test-run-function.png":::

    Notice that the **Request body** contains the `name` value *Azure*. This value appears in the queue message created when the function is invoked.

    As an alternative to selecting **Run**, you can call the function by entering a URL in a browser and specifying the `name` value in the query string. This browser method is shown in [Create your first function from the Azure portal](./functions-get-started.md).

1. Check the logs to make sure that the function succeeded.

   A new queue named **outqueue** is created in your storage account by the Functions runtime when the output binding is first used. You use storage account to verify that the queue and a message in it were created.

### Find the storage account connected to AzureWebJobsStorage

1. In your function app, expand **Settings**, and then select **Environment variables**.

1. In the **App settings** tab, select **AzureWebJobsStorage**.

    :::image type="content" source="./media/functions-integrate-storage-queue-output-binding/function-find-storage-account.png" alt-text="Screenshot that shows the Configuration page with AzureWebJobsStorage selected." lightbox="./media/functions-integrate-storage-queue-output-binding/function-find-storage-account.png":::

1. Locate and make note of the account name.

    :::image type="content" source="./media/functions-integrate-storage-queue-output-binding/function-storage-account-name.png" alt-text="Screenshot that shows how to locate the storage account connected to AzureWebJobsStorage." lightbox="./media/functions-integrate-storage-queue-output-binding/function-storage-account-name.png":::

### Examine the output queue

1. In the resource group for your function app, select the storage account that you're using.

1. Under **Queue service**, select **Queues**, and select the queue named **outqueue**.

   The queue contains the message that the queue output binding created when you ran the HTTP-triggered function. If you invoked the function with the default `name` value of *Azure*, the queue message is *Name passed to the function: Azure*.

1. Run the function again.

   A new message appears in the queue.  

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Related content

In this article, you added an output binding to an existing function. For more information about binding to Queue Storage, see [Queue Storage trigger and bindings](functions-bindings-storage-queue.md).

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps-2.md)]
