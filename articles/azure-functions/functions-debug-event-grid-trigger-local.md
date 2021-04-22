---
title: Azure Functions Event Grid local debugging
description: Learn to locally debug Azure Functions triggered by an Event Grid event
author: craigshoemaker

ms.topic: conceptual
ms.date: 10/18/2018
ms.author: cshoe
---

# Azure Function Event Grid Trigger Local Debugging

This article demonstrates how to debug a local function that handles an Azure Event Grid event raised by a storage account. 

## Prerequisites

- Create or use an existing function app
- Create or use an existing storage account
- Download [ngrok](https://ngrok.com/) to allow Azure to call your local function

## Create a new function

Open your function app in Visual Studio and, right-click on the project name in the Solution Explorer and click **Add > New Azure Function**.

In the *New Azure Function* window, select **Event Grid trigger** and click **OK**.

![Create new function](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-add-function.png)

Once the function is created, open the code file and copy the URL commented out at the top of the file. This location is used when configuring the Event Grid trigger.

![Copy location](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-copy-location.png)

Then, set a breakpoint on the line that begins with `log.LogInformation`.

![Set breakpoint](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-set-breakpoint.png)


Next, **press F5** to start a debugging session.

[!INCLUDE [functions-event-grid-local-dev](../../includes/functions-event-grid-local-dev.md)]

## Debug the function

Once the Event Grid recognizes a new file is uploaded to the storage container, the break point is hit in your local function.

![Start ngrok](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-breakpoint.png)

## Clean up resources

To clean up the resources created in this article, delete the **test** container in your storage account.

## Next steps

- [Automate resizing uploaded images using Event Grid](../event-grid/resize-images-on-storage-blob-upload-event.md)
- [Event Grid trigger for Azure Functions](./functions-bindings-event-grid.md)
