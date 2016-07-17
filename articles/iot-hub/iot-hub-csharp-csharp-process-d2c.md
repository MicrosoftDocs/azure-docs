<properties
	pageTitle="Process IoT Hub device-to-cloud messages | Microsoft Azure"
	description="Follow this tutorial to learn useful patterns to process IoT Hub device-to-cloud messages."
	services="iot-hub"
	documentationCenter=".net"
	authors="dominicbetts"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="csharp"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="04/29/2016"
     ms.author="dobett"/>

# Tutorial: How to process IoT Hub device-to-cloud messages

## Introduction

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back end. Other tutorials ([Get started with IoT Hub] and [Send cloud-to-device messages with IoT Hub][lnk-c2d]) show you how to use the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub.

This tutorial builds on the code shown in the [Get started with IoT Hub] tutorial, and it shows two scalable patterns that you can use to process device-to-cloud messages:

- The reliable storage of device-to-cloud messages in [Azure Blob storage]. A very common scenario is *cold path* analytics, in which you store telemetry data in blobs to use as input into analytics processes. These processes can be driven by tools such as [Azure Data Factory] or the [HDInsight (Hadoop)] stack.

- The reliable processing of *interactive* device-to-cloud messages. Device-to-cloud messages are interactive when they are immediate triggers for a set of actions in the application back end. For example, a device might send an alarm message that triggers inserting a ticket into a CRM system. By contrast, *data point* messages simply feed into an analytics engine. For example, temperature telemetry from a device that is to be stored for later analysis is a data point message.

Because IoT Hub exposes an [Event Hubs][lnk-event-hubs]-compatible endpoint to receive device-to-cloud messages, this tutorial uses an [EventProcessorHost] instance. This instance:

* Reliably stores *data point* messages in Azure blob storage.
* Forwards *interactive* device-to-cloud messages to an Azure [Service Bus queue] for immediate processing.

Service Bus helps ensure reliable processing of interactive messages, as it provides per-message checkpoints, and time window-based de-duplication.

> [AZURE.NOTE] An **EventProcessorHost** instance is only one way to process interactive messages. Other options include [Azure Service Fabric][lnk-service-fabric] and [Azure Stream Analytics][lnk-stream-analytics].

At the end of this tutorial, you will run three Windows console apps:

* **SimulatedDevice**, a modified version of the app created in the [Get started with IoT Hub] tutorial, sends data point device-to-cloud messages every second, and interactive device-to-cloud messages every 10 seconds. This app uses the AMQPS protocol to communicate with IoT Hub.
* **ProcessDeviceToCloudMessages** uses the [EventProcessorHost] class to retrieve messages from the Event Hubs-compatible endpoint. It then reliably stores data point messages in  Azure Blob storage, and forwards interactive messages to a Service Bus queue.
* **ProcessD2CInteractiveMessages** de-queues the interactive messages from the Service Bus queue.

> [AZURE.NOTE] IoT Hub has SDK support for many device platforms and languages, including C, Java, and JavaScript. For step-by-step instructions on how to replace the simulated device in this tutorial with a physical device, and generally how to connect devices to an IoT Hub, see the [Azure IoT Developer Center].

This tutorial is directly applicable to other ways to consume Event Hubs-compatible messages, such as [HDInsight (Hadoop)] projects. For more information, see [Azure IoT Hub developer guide - Device to cloud].

To complete this tutorial, you'll need the following:

+ Microsoft Visual Studio 2015.

+ An active Azure account. <br/>If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes.

You should have some basic knowledge of [Azure Storage] and [Azure Service Bus].


## Send interactive messages from a simulated device

In this section, you'll modify the simulated device application you created in the [Get started with IoT Hub] tutorial to send interactive device-to-cloud messages to the IoT hub.

1. In Visual Studio, in the **SimulatedDevice** project, add the following method to the **Program** class.

    ```
    private static async void SendDeviceToCloudInteractiveMessagesAsync()
    {
      while (true)
      {
        var interactiveMessageString = "Alert message!";
        var interactiveMessage = new Message(Encoding.ASCII.GetBytes(interactiveMessageString));
        interactiveMessage.Properties["messageType"] = "interactive";
        interactiveMessage.MessageId = Guid.NewGuid().ToString();

        await deviceClient.SendEventAsync(interactiveMessage);
        Console.WriteLine("{0} > Sending interactive message: {1}", DateTime.Now, interactiveMessageString);

        Task.Delay(10000).Wait();
      }
    }
    ```

    This method is very similar to the **SendDeviceToCloudMessagesAsync** method in the **SimulatedDevice** project. The only differences are that you now set the **MessageId** system property, and a user property called **messageType**.
    The code assigns a globally unique identifier (GUID) to the **MessageId** property. The Service Bus can use this to de-duplicate the messages it receives. The sample uses the **messageType** property to distinguish interactive from data point messages. The application passes this information in message properties, instead of in the message body, so that the event processor does not need to deserialize the message to perform message routing.

    > [AZURE.NOTE] It is important to create the **MessageId** used to de-duplicate interactive messages in the device code. Intermittent network communications, or other failures, could result in multiple re-transmissions of the same message from that device. You can also use a semantic message ID, such as a hash of the relevant message data fields, in place of a GUID.

2. Add the following method in the **Main** method, right before the `Console.ReadLine()` line:

    ````
    SendDeviceToCloudInteractiveMessagesAsync();
    ````

    > [AZURE.NOTE] For the sake of simplicity, this tutorial does not implement any retry policy. In production code, you should implement a retry policy such as exponential backoff, as suggested in the MSDN article [Transient Fault Handling].

## Process device-to-cloud messages

In this section, you will create a Windows console app that processes device-to-cloud messages from IoT Hub. Iot Hub exposes an [Event Hubs]-compatible endpoint to enable an application to read device-to-cloud messages. This tutorial uses the [EventProcessorHost] class to process these messages in a console app. For more information about how to process messages from Event Hubs, see the [Get Started with Event Hubs] tutorial.

When you implement reliable storage of data point messages or forwarding of interactive messages, the main challenge is that Event Hubs event processing relies on the message consumer to provide checkpoints for its progress. Moreover, in order to achieve a high throughput, when you read from Event Hubs you should provide checkpoints in large batches. This creates the possibility of duplicate processing for a large number of messages, if there is a failure and you revert to the previous checkpoint. In this tutorial, you will see how to synchronize Azure storage writes and Service Bus de-duplication windows with **EventProcessorHost** checkpoints.

To write messages to Azure storage reliably, the sample uses the individual block commit feature of [block blobs][Azure Block Blobs]. The event processor accumulates messages in memory until it is time to provide a checkpoint, such as after the accumulated buffer of messages reaches the maximum block size of 4 MB, or after the Service Bus de-duplication time window elapses. Then, before the checkpoint, the code commits a new block to the blob.

The event processor uses Event Hubs message offsets as block IDs. This allows it to perform a de-duplication check before it commits the new block to storage, taking care of a possible crash between committing a block and the checkpoint.

> [AZURE.NOTE] This tutorial uses a single storage account to write all the messages retrieved from IoT Hub. To decide if you need to use multiple Azure Storage accounts in your solution, see [Azure Storage scalability Guidelines].

The application makes use of the Service Bus de-duplication feature to avoid duplicates when it processes interactive messages. The simulated device stamps each interactive message with a unique **MessageId**. This enables Service Bus to ensure that, in the specified de-duplication time window, no two messages with the same **MessageId** are delivered to the receivers. This de-duplication, together with the per-message completion semantics provided by Service Bus queues, makes it easy to implement the reliable processing of interactive messages.

To make sure that no message is resubmitted outside of the de-duplication window, the code synchronizes the **EventProcessorHost** checkpoint mechanism with the Service Bus queue de-duplication window. This is done by forcing a checkpoint at least once every time the de-duplication window elapses (in this tutorial, the window is one hour).

> [AZURE.NOTE] This tutorial uses a single partitioned Service Bus queue to process all the interactive messages retrieved from IoT Hub. For more information about how to use Service Bus queues to meet the scalability requirements of your solution, see the [Azure Service Bus] documentation.

### Provision an Azure Storage account and a Service Bus queue
In order to use the [EventProcessorHost] class, you must have an Azure Storage account to enable the **EventProcessorHost** to record checkpoint information. You can use an existing storage account, or follow the instructions in [About Azure Storage] to create a new one. Make a note of the storage account connection string.

> [AZURE.NOTE] When you copy and paste the storage account connection string, make sure there are no spaces included.

You also need a Service Bus queue to enable reliable processing of interactive messages. You can create a queue programmatically, with a one hour de-duplication window, as explained in [How to use Service Bus Queues][Service Bus queue]. Alternatively, you can use the [Azure classic portal][lnk-classic-portal], by following these steps:

1. Click **New** in the lower-left corner. Then click **App Services** > **Service Bus** > **Queue** > **Custom Create**. Enter the name **d2ctutorial**, select a  region, and use an existing namespace or create a new one. On the next page, select **Enable duplicate detection**, and set the **Duplicate detection history time window** to one hour. Then click the check mark in the lower-right corner to save your queue configuration.

    ![Create a queue in Azure portal][30]

2. In the list of Service Bus queues, click **d2ctutorial**, and then click **Configure**. Create two shared access policies, one called **send** with **Send** permissions, and one called **listen** with **Listen** permissions. When you are done, click **Save** at the bottom.

    ![Configure a queue in Azure portal][31]

3. Click **Dashboard** at the top, and then **Connection information** at the bottom. Make a note of the two connection strings.

    ![Queue dashboard in Azure portal][32]

### Create the event processor

1. In the current Visual Studio solution, to create a new Visual C# Windows project by using the **Console Application** project template, click **File** > **Add** > **New Project**. Make sure the .NET Framework version is 4.5.1 or later. Name the project **ProcessDeviceToCloudMessages**, and click **OK**.

    ![New project in Visual Studio][10]

2. In Solution Explorer, right-click the **ProcessDeviceToCloudMessages** project, and then click **Manage NuGet Packages**. The **NuGet Package Manager** dialog box appears.

3. Search for **WindowsAzure.ServiceBus**, click **Install**, and accept the terms of use. This downloads, installs, and adds a reference to the [Azure Service Bus NuGet package](https://www.nuget.org/packages/WindowsAzure.ServiceBus), with all its dependencies.

4. Search for **Microsoft Azure Service Bus Event Hub - EventProcessorHost**, click **Install**, and accept the terms of use. This downloads, installs, and adds a reference to the [Azure Service Bus Event Hub - EventProcessorHost NuGet package](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost), with all its dependencies.

5. Right-click the **ProcessDeviceToCloudMessages** project, click **Add**, and then click **Class**. Name the new class **StoreEventProcessor**, and then click **OK** to create the class.

6. Add the following statements at the top of the StoreEventProcessor.cs file:

    ```
    using System.IO;
    using System.Diagnostics;
    using System.Security.Cryptography;
    using Microsoft.ServiceBus.Messaging;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Blob;
    ```

7. Substitute the following code for the body of the class:

    ```
    class StoreEventProcessor : IEventProcessor
    {
      private const int MAX_BLOCK_SIZE = 4 * 1024 * 1024;
      public static string StorageConnectionString;
      public static string ServiceBusConnectionString;

      private CloudBlobClient blobClient;
      private CloudBlobContainer blobContainer;
      private QueueClient queueClient;

      private long currentBlockInitOffset;
      private MemoryStream toAppend = new MemoryStream(MAX_BLOCK_SIZE);

      private Stopwatch stopwatch;
      private TimeSpan MAX_CHECKPOINT_TIME = TimeSpan.FromHours(1);

      public StoreEventProcessor()
      {
        var storageAccount = CloudStorageAccount.Parse(StorageConnectionString);
        blobClient = storageAccount.CreateCloudBlobClient();
        blobContainer = blobClient.GetContainerReference("d2ctutorial");
        blobContainer.CreateIfNotExists();
        queueClient = QueueClient.CreateFromConnectionString(ServiceBusConnectionString);
      }

      Task IEventProcessor.CloseAsync(PartitionContext context, CloseReason reason)
      {
        Console.WriteLine("Processor Shutting Down. Partition '{0}', Reason: '{1}'.", context.Lease.PartitionId, reason);
        return Task.FromResult<object>(null);
      }

      Task IEventProcessor.OpenAsync(PartitionContext context)
      {
        Console.WriteLine("StoreEventProcessor initialized.  Partition: '{0}', Offset: '{1}'", context.Lease.PartitionId, context.Lease.Offset);

        if (!long.TryParse(context.Lease.Offset, out currentBlockInitOffset))
        {
          currentBlockInitOffset = 0;
        }
        stopwatch = new Stopwatch();
        stopwatch.Start();

        return Task.FromResult<object>(null);
      }

      async Task IEventProcessor.ProcessEventsAsync(PartitionContext context, IEnumerable<EventData> messages)
      {
        foreach (EventData eventData in messages)
        {
          byte[] data = eventData.GetBytes();

          if (eventData.Properties.ContainsKey("messageType") && (string) eventData.Properties["messageType"] == "interactive")
          {
            var messageId = (string) eventData.SystemProperties["message-id"];

            var queueMessage = new BrokeredMessage(new MemoryStream(data));
            queueMessage.MessageId = messageId;
            queueMessage.Properties["messageType"] = "interactive";
            await queueClient.SendAsync(queueMessage);

            WriteHighlightedMessage(string.Format("Received interactive message: {0}", messageId));
            continue;
          }

          if (toAppend.Length + data.Length > MAX_BLOCK_SIZE || stopwatch.Elapsed > MAX_CHECKPOINT_TIME)
          {
            await AppendAndCheckpoint(context);
          }
          await toAppend.WriteAsync(data, 0, data.Length);

          Console.WriteLine(string.Format("Message received.  Partition: '{0}', Data: '{1}'",
            context.Lease.PartitionId, Encoding.UTF8.GetString(data)));
        }
      }

      private async Task AppendAndCheckpoint(PartitionContext context)
      {
        var blockIdString = String.Format("startSeq:{0}", currentBlockInitOffset.ToString("0000000000000000000000000"));
        var blockId = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(blockIdString));
        toAppend.Seek(0, SeekOrigin.Begin);
        byte[] md5 = MD5.Create().ComputeHash(toAppend);
        toAppend.Seek(0, SeekOrigin.Begin);

        var blobName = String.Format("iothubd2c_{0}", context.Lease.PartitionId);
        var currentBlob = blobContainer.GetBlockBlobReference(blobName);

        if (await currentBlob.ExistsAsync())
        {
          await currentBlob.PutBlockAsync(blockId, toAppend, Convert.ToBase64String(md5));
          var blockList = await currentBlob.DownloadBlockListAsync();
          var newBlockList = new List<string>(blockList.Select(b => b.Name));

          if (newBlockList.Count() > 0 && newBlockList.Last() != blockId)
          {
            newBlockList.Add(blockId);
            WriteHighlightedMessage(String.Format("Appending block id: {0} to blob: {1}", blockIdString, currentBlob.Name));
          }
          else
          {
            WriteHighlightedMessage(String.Format("Overwriting block id: {0}", blockIdString));
          }
          await currentBlob.PutBlockListAsync(newBlockList);
        }
        else
        {
          await currentBlob.PutBlockAsync(blockId, toAppend, Convert.ToBase64String(md5));
          var newBlockList = new List<string>();
          newBlockList.Add(blockId);
          await currentBlob.PutBlockListAsync(newBlockList);

          WriteHighlightedMessage(String.Format("Created new blob", currentBlob.Name));
        }

        toAppend.Dispose();
        toAppend = new MemoryStream(MAX_BLOCK_SIZE);

        // checkpoint.
        await context.CheckpointAsync();
        WriteHighlightedMessage(String.Format("Checkpointed partition: {0}", context.Lease.PartitionId));

        currentBlockInitOffset = long.Parse(context.Lease.Offset);
        stopwatch.Restart();
      }

      private void WriteHighlightedMessage(string message)
      {
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine(message);
        Console.ResetColor();
      }
    }
    ```

    The **EventProcessorHost** class calls this class to process device-to-cloud messages received from IoT Hub. The code in this class implements the logic to store messages reliably in a blob container, and forward interactive messages to the Service Bus queue.

    The **OpenAsync** method initializes the **currentBlockInitOffset** variable, which tracks the current offset of the first message read by this event processor. Remember that each processor is responsible for a single partition.

    The **ProcessEventsAsync** method receives a batch of messages from IoT Hub, and processes them as follows: it sends interactive messages to the Service Bus queue, and appends data point messages to the memory buffer called **toAppend**. If the memory buffer reaches the 4 MB block limit, or the Service Bus de-duplication time windows has elapsed since the last checkpoint (one hour in this tutorial), then it triggers a checkpoint.

    The **AppendAndCheckpoint** method first generates a blockId for the block to append. Azure storage requires all block IDs to have the same length, so the method pads the offset with leading zeroes - `currentBlockInitOffset.ToString("0000000000000000000000000")`. Then, if a block with this ID is already in the blob, the method overwrites it with the current contents of the buffer.

    > [AZURE.NOTE] To simplify the code, this tutorial uses a single blob file per partition to store the messages. A real solution would implement file rolling by creating additional files after a certain amount of time, or when they reach a certain size (note that an Azure block blob can be at most 195 GB).

8. In the **Program** class, add the following **using** statement at the top:

    ```
    using Microsoft.ServiceBus.Messaging;
    ```

9. Modify the **Main** method in the **Program** class as shown below. Substitute the IoT Hub **iothubowner** connection string (from the [Get started with IoT Hub] tutorial), the storage connection string, and the Service Bus connection string with **Send** permissions for the queue named **d2ctutorial**:

    ```
    static void Main(string[] args)
    {
      string iotHubConnectionString = "{iot hub connection string}";
      string iotHubD2cEndpoint = "messages/events";
      StoreEventProcessor.StorageConnectionString = "{storage connection string}";
      StoreEventProcessor.ServiceBusConnectionString = "{service bus send connection string}";

      string eventProcessorHostName = Guid.NewGuid().ToString();
      EventProcessorHost eventProcessorHost = new EventProcessorHost(eventProcessorHostName, iotHubD2cEndpoint, EventHubConsumerGroup.DefaultGroupName, iotHubConnectionString, StoreEventProcessor.StorageConnectionString, "messages-events");
      Console.WriteLine("Registering EventProcessor...");
      eventProcessorHost.RegisterEventProcessorAsync<StoreEventProcessor>().Wait();

      Console.WriteLine("Receiving. Press enter key to stop worker.");
      Console.ReadLine();
      eventProcessorHost.UnregisterEventProcessorAsync().Wait();
    }
    ```

    > [AZURE.NOTE] For the sake of simplicity, this tutorial uses a single instance of the [EventProcessorHost] class. For more information, see the [Event Hubs Programming Guide].

## Receive interactive messages
In this section, you'll write a Windows console app that receives the interactive messages from the Service Bus queue. For more information about how to architect a solution using Service Bus, see [Build multi-tier applications with Service Bus][].

1. In the current Visual Studio solution, create a new Visual C# Windows project by using the **Console Application** project template. Name the project **ProcessD2CInteractiveMessages**.

2. In Solution Explorer, right-click the **ProcessD2CInteractiveMessages** project, and then click **Manage NuGet Packages**. This displays the **NuGet Package Manager** window.

3. Search for **WindowsAzure.Service Bus**, click **Install**, and accept the terms of use. This downloads, installs, and adds a reference to the [Azure Service Bus](https://www.nuget.org/packages/WindowsAzure.ServiceBus), with all its dependencies.

4. Add the following **using** statements at the top of the **Program.cs** file:

    ```
    using System.IO;
    using Microsoft.ServiceBus.Messaging;
    ```

5. Finally, add the following lines to the **Main** method. Substitute the connection string with **Listen** permissions for the queue named **d2ctutorial**:

    ```
    Console.WriteLine("Process D2C Interactive Messages app\n");

    string connectionString = "{service bus listen connection string}";
    QueueClient Client = QueueClient.CreateFromConnectionString(connectionString);

    OnMessageOptions options = new OnMessageOptions();
    options.AutoComplete = false;
    options.AutoRenewTimeout = TimeSpan.FromMinutes(1);

    Client.OnMessage((message) =>
    {
      try
      {
        var bodyStream = message.GetBody<Stream>();
        bodyStream.Position = 0;
        var bodyAsString = new StreamReader(bodyStream, Encoding.ASCII).ReadToEnd();

        Console.WriteLine("Received message: {0} messageId: {1}", bodyAsString, message.MessageId);

        message.Complete();
      }
      catch (Exception)
      {
        message.Abandon();
      }
    }, options);

    Console.WriteLine("Receiving interactive messages from SB queue...");
    Console.WriteLine("Press any key to exit.");
    Console.ReadLine();
    ```

## Run the applications

Now you are ready to run the applications.

1.	In Visual Studio, in Solution Explorer, right-click your solution and select **Set StartUp Projects**. Select **Multiple startup projects**, then select **Start** as the action for the **ProcessDeviceToCloudMessages**, **SimulatedDevice**, and **ProcessD2CInteractiveMessages** projects.

2.	Press **F5** to start the three console applications. The **ProcessD2CInteractiveMessages** application should process every interactive message sent from the **SimulatedDevice** application.

  ![Three console applicatons][50]

> [AZURE.NOTE] In order to see updates in your blob file, you may need to reduce the **MAX_BLOCK_SIZE** constant in the **StoreEventProcessor** class to a smaller value, such as **1024**. This is because it takes some time to reach the block size limit with the data sent by the simulated device. With a smaller block size, you will not need to wait so long to see the blob being created and updated. However, using a larger block size makes the application more scalable.

## Next steps

In this tutorial, you learned how to reliably process data point and interactive device-to-cloud messages by using the [EventProcessorHost] class.

The [How to send cloud-to-device messages with IoT Hub][lnk-c2d] shows you how to send messages to your devices from your back end.

To see examples of complete end-to-end solutions that use IoT Hub, see [Azure IoT Suite][lnk-suite].

To learn more about developing solutions with IoT Hub, see the [IoT Hub Developer Guide].

<!-- Images. -->
[50]: ./media/iot-hub-csharp-csharp-process-d2c/run1.png
[10]: ./media/iot-hub-csharp-csharp-process-d2c/create-identity-csharp1.png

[30]: ./media/iot-hub-csharp-csharp-process-d2c/createqueue2.png
[31]: ./media/iot-hub-csharp-csharp-process-d2c/createqueue3.png
[32]: ./media/iot-hub-csharp-csharp-process-d2c/createqueue4.png

<!-- Links -->

[Azure Blob storage]: ../storage/storage-dotnet-how-to-use-blobs.md
[Azure Data Factory]: https://azure.microsoft.com/documentation/services/data-factory/
[HDInsight (Hadoop)]: https://azure.microsoft.com/documentation/services/hdinsight/
[Service Bus queue]: ../service-bus/service-bus-dotnet-get-started-with-queues.md

[Azure IoT Hub developer guide - Device to cloud]: iot-hub-devguide.md#d2c

[Azure Storage]: https://azure.microsoft.com/documentation/services/storage/
[Azure Service Bus]: https://azure.microsoft.com/documentation/services/service-bus/

[IoT Hub Developer Guide]: iot-hub-devguide.md
[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md
[Azure IoT Developer Center]: https://azure.microsoft.com/develop/iot
[lnk-service-fabric]: https://azure.microsoft.com/documentation/services/service-fabric/
[lnk-stream-analytics]: https://azure.microsoft.com/documentation/services/stream-analytics/
[lnk-event-hubs]: https://azure.microsoft.com/documentation/services/event-hubs/
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh675232.aspx

<!-- Links -->
[About Azure Storage]: ../storage/storage-create-storage-account.md#create-a-storage-account
[Get Started with Event Hubs]: ../event-hubs/event-hubs-csharp-ephcs-getstarted.md
[Azure Storage scalability Guidelines]: ../storage/storage-scalability-targets.md
[Azure Block Blobs]: https://msdn.microsoft.com/library/azure/ee691964.aspx
[Event Hubs]: ../event-hubs/event-hubs-overview.md
[EventProcessorHost]: http://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost(v=azure.95).aspx
[Event Hubs Programming Guide]: ../event-hubs/event-hubs-programming-guide.md
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[Build multi-tier applications with Service Bus]: ../service-bus/service-bus-dotnet-multi-tier-app-using-service-bus-queues.md

[lnk-classic-portal]: https://manage.windowsazure.com
[lnk-c2d]: iot-hub-csharp-csharp-process-d2c.md
[lnk-suite]: https://azure.microsoft.com/documentation/suites/iot-suite/