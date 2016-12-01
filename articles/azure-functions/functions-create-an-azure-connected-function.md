---
title: Create an Azure Function which binds to an Azure service | Microsoft Docs
description: Build an Azure Function, a serverless application, which interacts with other Azure Services.
services: functions
documentationcenter: dev-center-name
author: yochay
manager: manager-alias
editor: ''
tags: ''
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.assetid: ab86065d-6050-46c9-a336-1bfc1fa4b5a1
ms.service: functions
ms.devlang: multiple
ms.topic: get-started-article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 11/29/2016
ms.author: rachelap@microsoft.com

---
# Create an Azure Function which binds to an Azure service
[!INCLUDE [Getting Started Note](../../includes/functions-getting-started.md)]

The this topic shows you how to create an Azure Function that listens to messages on an Azure Queue and copies the messages to an Azure Blob. To do this, you simply create the function and message queues, and add the code to write messages to the newly created queues. 

## Watch the video
>[!VIDEO https://channel9.msdn.com/Series/Windows-Azure-Web-Sites-Tutorials/Create-an-Azure-Function-which-binds-to-an-Azure-service/player]
>
>

## Create an input queue trigger function

1. Go to the Azure portal and locate your function app.

2. Click **New Function** > **TimerTrigger - Node**. 

3. Name the function **FunctionsBindingsDemo1**, enter a cron expression value of `0/10 * * * * *` for **Schedule**, and then click **Create**.
   
    ![Add a timer triggered function](./media/functions-create-an-azure-connected-function/new-trigger-timer-function.png)

	This creates a timer triggered function that runs every 10 seconds.

5. On the **Develop** tab, click **Logs** and view the activity in the log. You see a log entry written every ten seconds.
   
	![View the log to verify the function works](./media/functions-create-an-azure-connected-function/functionsbindingsdemo1-view-log.png)

### Add a message queue

1. On the **Integrate** tab, choose **New Output** > **Azure Queue Storage** > **Select**.

	![Add a trigger timer function](./media/functions-create-an-azure-connected-function/functionsbindingsdemo1-integrate-tab.png)

2. Enter `myQueueItem` for **Message parameter name** and `functions-bindings` for **Queue name**, select a storage account or click **new** to create a storage account, and then click **Save**.  

	![Create the output binding to the storage queue](./media/functions-create-an-azure-connected-function/functionsbindingsdemo1-integrate-tab2.png)
   

### Write to the message queue

1. Back in the **Develop** tab, append the following code to the function:
   
    ```javascript
   
    function myQueueItem() 
      {
        return {
        msg: "some message goes here",
        time: "time goes here"
      }
    }
   
    ```
2. Locate the *if* statement around line 9 of the function, and insert the following code after that statement.
   
    ```javascript
   
    var toBeQed = myQueueItem();
    toBeQed.time = timeStamp;
    context.bindings.myQueue = toBeQed;
   
    ```
   
    This code creates a **myQueueItem** and sets its **time** property to the current timeStamp. It then adds the new queue item to the context's myQueue binding.

3. Click **Save and Run**.

4. (Optional) You can verify the code works by viewing the queue in Visual Studio.
   
   1. Open Visual Studio and select **View** > **Cloud Explorer**. Sign in to your Azure account, if required.
   2. In your subscription, expand **Storage accounts** > *your storage account* > **Queues**, double-click **functions-bindings**, and then verify that rows of log data are written to the queue.  

## Create an output queue trigger function

1. Click **New Function** > **QueueTrigger - CSharp**. Note that a function app can have functions of various languages. 
 
2. Name the function `FunctionsBindingsDemo2`, enter **functions-bindings** in the **Queue name** field, select an existing storage account or create one, and then click **Create**.

	![Add an output queue timer function](./media/functions-create-an-azure-connected-function/function-demo2-new-function.png) 

5. (Optional) You can verify that the new function works by viewing either the function logs of the queue in Visual Studio. The function logs show that the function is running and items are dequeued. Refresh the **functions-bindings** Queue in Visual Studio and notice that items have been removed from the queue. This happens because the function is bound to the **functions-bindings** queue as an input trigger.
   

### Modify the queue item type from JSON to object

1. Replace the code in **FunctionsBindingsDemo2** with the following code:    
   
    ```cs
   
    using System;
   
    public static void Run(QItem myQueueItem, ICollector<TableItem> myTable, TraceWriter log)
    {
      TableItem myItem = new TableItem
      {
        PartitionKey = "key",
        RowKey = Guid.NewGuid().ToString(),
        Time = DateTime.Now.ToString("hh.mm.ss.ffffff"),
        Msg = myQueueItem.Msg,
        OriginalTime = myQueueItem.Time    
      };
      log.Verbose($"C# Queue trigger function processed: {myQueueItem.Msg} | {myQueueItem.Time}");
    }
   
    public class TableItem
    {
      public string PartitionKey {get; set;}
      public string RowKey {get; set;}
      public string Time {get; set;}
      public string Msg {get; set;}
      public string OriginalTime {get; set;}
    }
   
    public class QItem
    {
      public string Msg { get; set;}
      public string Time { get; set;}
    }
   
    ```
   
    This code adds two classes, **TableItem** and **QItem**, that you use to read and write to queues. Additionally, the **Run** function has been modified to accept the **QItem** and **TraceWriter** parameter, instead of a **string** and a **TraceWriter**. 

2. Click the **Save** button.

3. Verify the code works by checking the log. Notice that Azure Functions automatically serializes and deserializes the object for you, which makes it easy to access the queue in an object-oriented fashion to access data. 

## Store messages in an Azure Table
Now that you have the queues working together you can add an output binding to an Azure Storage table for permanent storage of the queue data.

1. In FunctionsBindingsDemo2, click **Integrate** > **New Output** > **Azure Table Storage** > **Select**.

	![Add a binding to an Azure Storage table](./media/functions-create-an-azure-connected-function/functionsbindingsdemo2-integrate-tab.png) 

2. Create an Azure Storage Table for Output and name it **myTable**.

3. Answer **functionsbindings** to the question "To which table should the data be written?".

4. Change the **PartitionKey** setting from **{project-id}** to **{partition}**.

5. Choose a **Storage account connection** or create a new one, and then click **Save**.

7. In the **Develop** tab, create a **TableItem** class to represent an Azure table, and modify the Run function to accept the newly created TableItem object. Notice that you must use the **PartitionKey** and **RowKey** properties in order for it to work.
   
    ```cs
   
    public static void Run(QItem myQueueItem, ICollector<TableItem> myTable, TraceWriter log)
    {    
      TableItem myItem = new TableItem
      {
        PartitionKey = "key",
        RowKey = Guid.NewGuid().ToString(),
        Time = DateTime.Now.ToString("hh.mm.ss.ffffff"),
        Msg = myQueueItem.Msg,
        OriginalTime = myQueueItem.Time    
      };
   
      log.Verbose($"C# Queue trigger function processed: {myQueueItem.RowKey} | {myQueueItem.Msg} | {myQueueItem.Time}");
    }
   
    public class TableItem
    {
      public string PartitionKey {get; set;}
      public string RowKey {get; set;}
      public string Time {get; set;}
      public string Msg {get; set;}
      public string OriginalTime {get; set;}
    }
    ```
9. Click **Save**.
 
10. Verify that the code works by viewing the function's logs and in Visual Studio. To verify in Visual Studio, use the **Cloud Explorer** to navigate to the **functionbindings** Azure Table and verify there are rows in it.

[!INCLUDE [Getting Started Note](../../includes/functions-bindings-next-steps.md)]

[!INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]

