## Processing device-to-cloud messages

In this section, you will create a Windows console app that processes device-to-cloud messages from IoT Hub. Iot Hub exposes an [Event Hubs]-compatible endpoint to enable an application to read device-to-cloud messages. This tutorial uses the [EventProcessorHost] class to process these messages in a console app. For more information on how to process messages from Event Hubs you can refer to the [Get Started with Event Hubs] tutorial.

The main challenge you face when you implement reliable storage of data point messages or forwarding of interactive messages, is that Event Hubs event processing relies on the message consumer to checkpoint its progress. Moreover, in order to achieve a high throughput, when you read from Event Hubs you should checkpoint in large batches. This creates the possibility of duplicate processing for a large number of messages if there is a failure and you revert to the previous checkpoint. In this tutorial you will see how to synchronize Azure storage writes and Service Bus deduplication windows with **EventProcessorHost** checkpoints.

To reliably write messages to Azure storage, the sample uses the individual block commit feature of [block blobs][Azure Block Blobs]. The event processor accumulates messages in memory until it is time to perform a checkpoint, such as after the accummulated buffer of messages reaches the maximum block size of 4Mb, or after the Service Bus deduplication time window elapses. Then, before checkpointing, the code commits a new block to the blob.

The event processor uses Event Hubs message offsets as block ids. This allows it to perform a deduplication check before it commits the new block to storage, taking care of a possible crash between committing a block and the checkpoint.

> [AZURE.NOTE] This tutorial uses a single storage account to write all the messages retrieved from IoT Hub. Refer to [Azure Storage scalability Guidelines] to decide if you need to use multiple Azure Storage accounts in your solution.

The application makes use of the Service Bus deduplication feature to avoid duplicates when it processes interactive messages. The simulated device stamps each interactive message with a unique **MessageId** to enable Service Bus to ensure that, in the specified deduplication time window, no two messages with the same **MessageId** are delivered to the receivers. This deduplication, together with the per-message completion semantics provided by Service Bus queues, makes it easy to implement the reliable processing of interactive messages.

To make sure that no message is resubmitted outside of the deduplication window, the code synchronizes the **EventProcessorHost** checkpointing mechanism with the Service Bus queue deduplication window. This is done by forcing a checkpoint at least once every time the deduplication window elapses (one hour in this tutorial).

> [AZURE.NOTE] This tutorial uses a single partitioned Service Bus queue to process all the interactive messages retrieved from IoT Hub. Refer to the [Service Bus documentation] for more information on how to use Service Bus Queues to meet the scalability requirements of your solution.

### Provision an Azure Storage account and a Service Bus queue
In order to use the [EventProcessorHost] class, you must have an Azure Storage account to enable the **EventProcessorHost** to record checkpoint information. You can use an existing storage account, or follow the instructions in [About Azure Storage] to create a new one. Make a note of the storage account connection string.

> [AZURE.NOTE] When you copy and paste the storage account connection string, make sure there are no spaces included in the connection string.

You also need a Service Bus queue to enable reliable processing of interactive messages. You can create a queue programmatically with a 1 hour deduplication window, as explained in [How to use Service Bus Queues][Service Bus Queue], or use the [Azure classic portal], following these steps:

1. Click **NEW** in the bottom left corner, then **App Services**, then **Service Bus**, then **Queue**, then **Custom Create**, enter the name **d2ctutorial**, select a  region, use an existing namespace or create a new one, then on the next page select **Enable duplicate detection** and set the **Duplicate detection history time window** to one hour. Then click the check mark to save your queue configuration.

    ![][30]

2. In the list of Service Bus queues, click **d2ctutorial**, and then click **Configure**. Create two shared access policies, one called **send** with **Send** permissions, and one called **listen** with **Listen** permissions. Click **Save** at the bottom, when done.

    ![][31]

3. Click **Dashboard** at the top, then **Connection information** at the bottom, make a note of the two connection strings.

    ![][32]

### Create the event processor

1. In the current Visual Studio solution, click **File**, then **Add**, and then **New Project** to create a new Visual C# Windows project using the **Console Application** project template. Name the project **ProcessDeviceToCloudMessages**.

    ![][10]

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
        queueClient = QueueClient.CreateFromConnectionString(ServiceBusConnectionString, "d2ctutorial");
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

    The **EventProcessorHost** class calls this class to process device-to-cloud messages received from IoT Hub. The code in this class implements the logic to reliably store messages in a blob container and forward interactive messages to the Service Bus queue.
    The **OpenAsync** method, initializes the **currentBlockInitOffset** variable which tracks the current offset of the first message read by this event processor. Remember that each processor is responsible for a single partition.
    
    The **ProcessEventsAsync** method receives a batch of messages from IoT Hub and processes them as follows: it sends interactive messages to the Service Bus queue and appends data point messages to the memory buffer called **toAppend**. If the memory buffer reaches the 4Mb block limit, or the Service Bus deduplication time windows has elapsed since the last checkpoint (one hour in this tutorial), then it triggers a checkpoint.

    The method **AppendAndCheckpoint** first generates a blockId for the block to append. Azure storage requires all block ids to have the same length, so the method pads the offset with leading zeroes - `currentBlockInitOffset.ToString("0000000000000000000000000")`. Then, if a block with this id is already in the blob, the method overwrites it with the current contents of the buffer.

    > [AZURE.NOTE] To simplify the code, this tutorial uses a single blob file per partition to store the messages. A real solution would implement file rolling by creating additional files when they reach a certain size (note Azure block blob can be at most 195Gb in size), or after a certain amount of time.

8. In the **Program** class, add the following **using** statements at the top:

    ```
    using Microsoft.ServiceBus.Messaging;
    ```

9. Modify the **Main** method in the **Program** class as shown below, substituting the IoT Hub **iothubowner** connection string (from the [Get started with IoT Hub] tutorial), the storage connection string, and the Service Bus connection string with **Send** permissions for the queue named **d2ctutorial**:

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
    
    > [AZURE.NOTE] For the sake of simplicity, this tutorial uses a single instance of the [EventProcessorHost] class. Please refer to [Event Hubs Programming Guide] for more information.

## Receive interactive messages
In this section, you'll write a Windows console app that receives the interactive messages from the Service Bus queue. Refer to [Build multi-tier applications with Service Bus][] for more information on how to architect a solution using Service Bus.

1. In the current Visual Studio solution, create a new Visual C# Windows project using the **Console Application** project template. Name the project **ProcessD2CInteractiveMessages**.

2. In Solution Explorer, right-click the **ProcessD2CInteractiveMessages** project, and then click **Manage NuGet Packages**. This displays the **NuGet Package Manager** window.

3. Search for **WindowsAzure.Service Bus**, click **Install**, and accept the terms of use. This downloads, installs, and adds a reference to the [Azure Service Bus](https://www.nuget.org/packages/WindowsAzure.ServiceBus), with all its dependencies.

4. Add the following **using** statement at the top of the **Program.cs** file:

    ```
    using System.IO;
    using Microsoft.ServiceBus.Messaging;
    ```

5. Finally, add the following lines to the **Main** method, substituting the connection string with **Listen** permissions for the queue named **d2ctutorial**:

    ```
    Console.WriteLine("Process D2C Interactive Messages app\n");

    string connectionString = "{service bus listen connection string}";
    QueueClient Client = QueueClient.CreateFromConnectionString(connectionString, "d2ctutorial");

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

<!-- Links -->
[About Azure Storage]: ../storage/storage-create-storage-account.md#create-a-storage-account
[Azure IoT - Service SDK NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.Devices/
[Get Started with Event Hubs]: ../event-hubs/event-hubs-csharp-ephcs-getstarted.md
[IoT Hub Developer Guide - Identity Registry]: iot-hub-devguide.md#identityregistry
[Azure Storage scalability Guidelines]: ../storage/storage-scalability-targets.md
[Azure Block Blobs]: https://msdn.microsoft.com/library/azure/ee691964.aspx
[Event Hubs]: ../event-hubs/event-hubs-overview.md
[Scaled out event processing]: https://code.msdn.microsoft.com/windowsazure/Service-Bus-Event-Hub-45f43fc3
[EventProcessorHost]: http://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost(v=azure.95).aspx
[Event Hubs Programming Guide]: ../event-hubs/event-hubs-programming-guide.md
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[Azure Portal]: https://manage.windowsazure.com/
[Service Bus Queue]: ../service-bus/service-bus-dotnet-how-to-use-queues.md
[Build multi-tier applications with Service Bus]: ../service-bus/service-bus-dotnet-multi-tier-app-using-service-bus-queues.md
[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md
[Service Bus documentation]: https://azure.microsoft.com/documentation/services/service-bus/

<!-- Images -->
[10]: ./media/iot-hub-process-d2c-cloud-csharp/create-identity-csharp1.png
[12]: ./media/iot-hub-process-d2c-cloud-csharp/create-identity-csharp3.png

[20]: ./media/iot-hub-process-d2c-cloud-csharp/create-storage1.png
[21]: ./media/iot-hub-process-d2c-cloud-csharp/create-storage2.png
[22]: ./media/iot-hub-process-d2c-cloud-csharp/create-storage3.png

[30]: ./media/iot-hub-process-d2c-cloud-csharp/createqueue2.png
[31]: ./media/iot-hub-process-d2c-cloud-csharp/createqueue3.png
[32]: ./media/iot-hub-process-d2c-cloud-csharp/createqueue4.png
