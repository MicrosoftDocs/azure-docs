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
ms.date: 10/25/2016
ms.author: rachelap@microsoft.com

---
# Create an Azure Function which binds to an Azure service
[!INCLUDE [Getting Started Note](../../includes/functions-getting-started.md)]

In this short video, you learn how to create an Azure Function that listens to messages on an Azure Queue and copies the messages to an Azure Blob.

## Watch the video
[!VIDEO https://channel9.msdn.com/Series/Windows-Azure-Web-Sites-Tutorials/Create-an-Azure-Function-which-binds-to-an-Azure-service/player]


## Create an input queue trigger function
The goal of this function is to write a message to a queue every 10 seconds. To accomplish this, you must create the function and message queues, and add the code to write messages to the newly created queues.

1. Go to the Azure Portal and locate your Azure Function App.
2. Click **New Function** > **TimerTrigger - Node**. Name the function **FunctionsBindingsDemo1**
3. Enter a value of "0/10 * * * * *" for the Schedule. This value is in the form of a cron expression. This schedules the timer to run every 10 seconds.
4. Click the **Create** button to create the function.
   
    ![Add a trigger timer functions](./media/functions-create-an-azure-connected-function/new-trigger-timer-function.png)
5. Verify that the function works by viewing activity in the log. You might have to click the **Logs** link in the upper right corner to display the log pane.
   
   ![Verify the function works by viewing the log](./media/functions-create-an-azure-connected-function/functionsbindingsdemo1-view-log.png)

### Add a message queue
1. Go to the **Integrate** tab.
2. Choose **New Output** > **Azure Storage Queue** > **Select**.
3. Enter **myQueueItem** in the **Message parameter name** text box.
4. Select a storage account, or click **new** to create a storage account if you do not have an existing one.
5. Enter **functions-bindings** in the **Queue name** text box.
6. Click **Save**.  
   
   ![Add a trigger timer functions](./media/functions-create-an-azure-connected-function/functionsbindingsdemo1-integrate-tab.png)

### Write to the message queue
1. Return to the **Develop** tab, and add the following code to the function after the existing code:
   
    ```javascript
   
    function myQueueItem() 
      {
        return {
        msg: "some message goes here",
        time: "time goes here"
      }
    }
   
    ```
2. Modify the existing function code to call the code added in Step 1. Insert the following code around line 9 of the function, after the *if* statement.
   
    ```javascript
   
    var toBeQed = myQueueItem();
    toBeQed.time = timeStamp;
    context.bindings.myQueue = toBeQed;
   
    ```
   
    This code creates a **myQueueItem** and sets its **time** property to the current timeStamp. It then adds the new queue item to the context's myQueue binding.
3. Click **Save and Run**.
4. Verify the code works by viewing the queue in Visual Studio.
   
   * Open Visual Studio, and go to **View** > **Cloud** **Explorer**.
   * Locate the storage account and **functions-bindings** queue you used when creating the myQueue queue. You should see rows of log data. You might need to sign into Azure through Visual Studio.  

## Create an output queue trigger function
1. Click **New Function** > **QueueTrigger - C#**. Name the function **FunctionsBindingsDemo2**. Notice that you can mix languages in the same function app (Node and C# in this case).
2. Enter **functions-bindings** in the **Queue name** field."
3. Select a storage account to use or create a new one.
4. Click **Create**
5. Verify the new function works by viewing both the function's log and Visual Studio for updates. The function's log shows that the function is running and items are dequeued. Since the function is bound to the **functions-bindings** output queue as an input trigger, refreshing the **functions-bindings** Queue in Visual Studio should reveal that the items are gone. They have been dequeued.   
   
   ![Add an output queue timer functions](./media/functions-create-an-azure-connected-function/functionsbindingsdemo2-integrate-tab.png)   

### Modify the queue item type from JSON to object
1. Replace the code in **FunctionsBindingsDemo2** with the following code:    
   
    ```c#
   
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
3. Verify the code works by checking the log. Notice that Azure functions automatically serialize and deserialize the object for you, making it easy to access the queue in an object-oriented fashion to pass around data. 

## Store messages in an Azure Table
Now that you have the queues working together, it's time to add in an Azure table for permanent storage of the queue data.

1. Go to the **Integrate** tab.
2. Create an Azure Storage Table for Output and name it **myTable**.
3. Answer **functionsbindings** to the question "To which table should the data be written?".
4. Change the **PartitionKey** setting from **{project-id}** to **{partition}**.
5. Choose a storage account or create a new one.
6. Click **Save**.
7. Go to the **Develop** tab.
8. Create a **TableItem** class to represent an Azure table, and modify the Run function to accept the newly created TableItem object. Notice that you must use the **PartitionKey** and **RowKey** properties in order for it to work.
   
    ```c#
   
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

