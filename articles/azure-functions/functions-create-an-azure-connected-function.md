<properties
   pageTitle="Create an Azure Function which binds to an Azure service | Microsoft Azure"
   description="Build an Azure Function, a serverless application, which interacts with other Azure Services."
   services="functions"
   documentationCenter="dev-center-name"
   authors="yochay"
   manager="manager-alias"
   editor=""
   tags=""
   keywords="azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture"/>

<tags
   ms.service="functions"
   ms.devlang="multiple"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="multiple"
   ms.workload="na"
   ms.date="10/25/2016"
   ms.author="rachelap@microsoft.com"/>

# Create an Azure Function which binds to an Azure service

[AZURE.INCLUDE [Getting Started Note](../../includes/functions-getting-started.md)]

In this short video, you will learn how to create an Azure Function that listens to messages on an Azure Queue and copies the messages to an Azure Blob.

## Watch the video

[AZURE.VIDEO create-an-azure-function-which-binds-to-an-azure-service]
&nbsp;

## Create an input queue trigger function

1. Go to the Azure Portal and locate your Azure Function App.

2. Click **New Function** > **TimerTrigger - Node**. Name the function **FunctionsBindingsDemo1**

5. Enter a value of "0/10*****" for the cron expression. This schedules the timer to run every 10 seconds.

6. Click the **Create** button to create the function.

![Add a new trigger timer functions](./media/create-azure-connected-function/new-trigger-timer-function.png)

7. Click the **Save** button to save the function. 

8. Verify that the function works by viewing activity in the log. 

![Verify the function works by viewing the log](./media/create-azure-connected-function/functionsbindingsdemo1-view-log.png)

The goal of this function is to write a message to a queue every 10 seconds. To accomplish this, you'll need to create the message queue and add the code to write messages to the newly created queue.

### Add a message queue

1. Go to the **Integrate** tab.

2. Choose **New Output** > **Queue** > **Select**.

3. Enter **myQueue** in the **Message parameter name** text box.

4. Select a storage account, or click **new** to create a new storage account if you do not have an existing one.

5. Enter **functions-bindings** in the **Queue name** text box.

6. Click **Next**  

![Add a new trigger timer functions](./media/create-azure-connected-function/functionsbindingsdemo1-integrate-tab.png)

### Write to the message queue

1. Return to the **Develop** tab, and add the following code to the function after the existing code:

    function myQueueItem() {
      return {
      msg: "some message goes here",
      time: "time goes here"
      }
    }

2. Modify the existing function code to call the code added in Step 1. Insert the following code around line 9 of the function, after the *if* statement.

    var toBeQed = myQueueItem();
    toBeQed.time = timeStamp;
    context.bindings.myQueue = toBeQed;

This code creates a **myQueueItem** and sets its **time** property to the current timeStamp. It then adds the new queue item to the context's myQueue binding.

3. Verify the code works by viewing the queue in Visual Studio.

  a. Open Visual Stuio, and go to **View** > **Cloud** **Explorer**.

  b. Locate the storage account and **functions-bindings** queue you used when creating the myQueue queue. You should see rows of log data. You might need to sign into Azure through Visual Studio.  

## Create an output queue trigger function

1. Click **New Function** > **QueueTrigger - C#**. Name the function **FunctionsBindingsDemo2**. Notice that you can mix languages in the same function app (Node and C# in this case).

2. Enter **functions-bindings** in the **Queue name** field."

3. Select a storage account to use or create a new one.

4. Click **Create**

5. Verify the new function works by viewing the both the function's log and Visual Studio for updates. The function's log will show that the function is running, as well as items being dequeued. Since the function is bound to the **functions-bindings** output queue as an input trigger, refreshing the **functions-bindings** Queue in Visual Studio should reveal that the items are gone, as they have been dequeued.   

![Add a new output queue timer functions](./media/create-azure-connected-function/functionsbindingsdemo2-integrate-tab.png)   

### Modify the queue item type from JSON to object

1. Add the following class to the **FunctionsBindingsDemo2** code:

    public class QItem
    {
      public string Msg { get; set;}
      public string Time { get; set;}
    }

2. Modify the Run function to accept a **QItem** and **TraceWriter** parameter, instead of a **string** and a **TraceWriter**. It should look like the following:

    public static void Run(QItem myQueueItem, TraceWriter log)
    {
      log.Verbose($"C# Queue trigger function processed: {myQueueItem}");
    }

3. Click the **Save** button.

4. Verify the code works by checking the function's log. Since the item has no toString method, the object name will show in the log, rather than the JSON representation that was displayed in the log in earlier exercises.

5. Modify the **Run** function so that it prints out the message and time from the queue.

    public static void Run(QItem myQueueItem, TraceWriter log)
    {
      log.Verbose($"C# Queue trigger function processed: {myQueueItem.Msg} | {myQueueItem.Time}");
    }

6. Verify the code works by checking the log. Notice that Azure functions automatically serialize and deserialize the object for you, making it easy to access the queue in an object-oriented fashion to pass data around. The completed function should look like the following:

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

## Store messages in an Azure Table

1. Go to the **Integrate** tab.

2. Create a new Azure Storage Table for Output and name it **myTable**.

3. Answer **functionsbindings** to the question "To which table should the data be written?".

5. Change the **PartitionKey** setting from **{project-id}** to **{partition}**.

6. Choose a storage account or create a new one.

7. Click **Save**.

8. Go to the **Develop** tab

9. Create a **TableItem** class to represent an Azure table, and modify the Run function to accept the newly created TableItem object. Notice that you must use the **PartitionKey** and **RowKey** properties in order for it to work.

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

10. Click **Save**

11. Verify that the code works by viewing the function's logs as well as in Visual Studio. To verify in Visual Studio, use the **Cloud Explorer** to navigate to the **functionbindings** Azure Table and verify there are rows in it.

[AZURE.INCLUDE [Getting Started Note](../../includes/functions-bindings-next-steps.md)]
[AZURE.INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]
