---
title: Azure Functions Event Grid local debugging
description: Learn to locally debug Azure functions triggered by an Event Grid event
services: functions
documentationcenter: na
author: craigshoemaker
manager: jeconnoc
keywords: azure functions, functions, serverless architecture

ms.service: azure-functions
ms.devlang: multiple
ms.topic: reference
ms.date: 10/18/2018
ms.author: cshoe
---

# Azure Function Event Grid Trigger Local Debugging

This article demonstrates how to debug a local function triggered by an Event Grid event. 

To locally debug a function triggered by an Event Grid event, you must expose your local function to Azure and initiate an action to trigger the function. This article demonstrates how to break into your local function that handles an Azure Event Grid event raised by a storage account.

## Prerequisites

Download [ngrok](https://ngrok.com/)

## Create a function app

To begin, create a new function app that responds to an Event Grid event. 

Open Visual Studio and select **File > New > Project**.

In the *New Project* window open the template pane to **Other Languages > Visual C# > Cloud > Azure Functions**. 

![Create new function app](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-create-new-project.png)

Give your project a name and click **OK**.

In the *New Project* window, select **Empty** and click **OK**.


![Select function type](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-select-type.png)

Next, right-click on the project name in the Solution Explorer and click **Add > New Azure Function**.

In the New Azure Function window select **Event Grid Trigger** and click **OK**.

![Create new function](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-add-function.png)

Once the function is created, open the code file and copy the URL commented out at the top of the file. This location is used when configuring the Event Grid trigger.

![Copy location](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-copy-location.png)

Next, set a breakpoint on othe line that begins with `log.LogInformation`.

![Set breakpoint](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-set-breakpoint.png)


Next, **press F5** to start a debugging session.

## Allow Azure to call your local function

To break into a function running in a debug context on your machine, you must enable a way for Azure to communicate with your local function from the cloud.

[ngrok](https://ngrok.com/)

```bash
ngrok http -host-header=localhost 7071
```
![Start ngrok](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-ngrok.png)

 ## Create a storage account

Next, create a new storage account an name it **functionlocaldebug**. Once the account is created, click on the Events option to create a new event subscription.

![Add storage account event](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-add-event.png)

In the Events window, click on the **\+ Event Subscription** button to create a new event subscription.

![Select subscription type](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-event-subscription-type.png)

![Select endpoint type](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-event-subscription-endpoint.png)

![Endpoint selection](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-event-subscription-endpoint-selection.png)



## Upload a file

Storage Explorer

create blob container

![Create blob container](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-create-blob-container.png)

upload file to container

## Debug the function

Once the Event Grid recognizes there is a new file uploaded to the storage container, 

![Start ngrok](./media/functions-debug-event-grid-trigger-local/functions-debug-event-grid-trigger-local-breakpoint.png)



## Clean up resources

To clean up the resources created in this article, delete the **functionlocaldebug** storage account.



