---
title: Azure Quickstart - Process event streams using Azure CLI | Microsoft Docs
description: Quickly learn to process event streams using Azure CLI
services: event-hubs
documentationcenter: ''
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: ''
ms.service: event-hubs
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/18/2018
ms.author: sethm

---

# Process event streams using Azure CLI and .NET Standard

Azure Event Hubs is a highly scalable data streaming platform and ingestion service capable of receiving and processing millions of events per second. This quickstart shows how to create an event hub using Azure CLI, and then send to and receive from an event hub using the .NET Standard SDK.

## Prerequisites

To complete this tutorial, make sure you have an Azure subscription. If you don't have one, [create a free subscription][] before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use Azure CLI locally, this tutorial requires that you are running Azure CLI version 2.0.4 or later. Run `az --version` to check your version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Log on to Azure

Once Azure CLI is installed, perform the following steps to install the Event Hubs CLI extension and log on to Azure:

1. Run the following command to log on to Azure:

   ```azurecli-interactive
   az login
   ```

3. Set the current subscription context. Replace `MyAzureSub` with the name of the Azure subscription you want to use:

   ```azurecli
   az account set --subscription MyAzureSub
   ``` 

## Provision resources

After logging in to Azure, issue the following commands to provision Event Hubs resources. Be sure to replace the placeholders `myResourceGroup`, `namespaceName`, `eventHubName`, and `storageAccountName` with the appropriate values:

```azurecli
# Create a resource group
az group create --name myResourceGroup --location eastus

# Create an Event Hubs namespace
az eventhubs namespace create --name namespaceName --resource-group myResourceGroup -l eastus2

# Create an event hub
az eventhubs eventhub create --name eventHubName --resource-group myResourceGroup --namespace-name namespaceName

# Create a general purpose standard storage account
az storage account create --name storageAccountName --resource-group myResourceGroup --location eastus2 --sku Standard_RAGRS --encryption blob

# List the storage account access keys
az storage account keys list --resource-group myResourceGroup --account-name storageAccountName

# Get namespace connection string
az eventhubs namespace authorization-rule keys list --resource-group myResourceGroup --namespace-name namespaceName --name RootManageSharedAccessKey
```

Copy and paste the connection string to a temporary location, such as Notepad, to use later.

## Stream into Event Hubs

The next step is to download the sample code that streams events to an event hub, and receives those events using the Event Processor Host. First, send the messages:

1. Clone the [Event Hubs GitHub repo](https://github.com/Azure/azure-event-hubs).
2. Navigate to the **Send** folder: `\azure-event-hubs\samples\Java\Basic\Send\src\main\java\com\microsoft\azure\eventhubs\samples\send`.
2. In the Send.java file, replace the `----EventHubsNamespaceName-----` value with the Event Hubs namespace you obtained in the "Create an Event Hubs namespace" section of this article.
2. Replace `----EventHubName-----` with the name of the event hub you created within that namespace.
3. Replace `-----SharedAccessSignatureKeyName-----` with the name of the Shared access policy for the namespace. Unless you created a new policy, the default is **RootManageSharedAccessKey**.
4. Replace `---SharedAccessSignatureKey----` with the value of the SAS key for the policy in the previous step.
5. To build the application, navigate to the `\azure-event-hubs\samples\Java\Basic\Send` folder, and issue the following command:

   ```shell
   mvn clean package -DskipTests
   ```

### Receive

Now download the Event Processor Host sample, which receives the messages you just sent:

1. Navigate to the **EventProcessorSample** folder: `\azure-event-hubs\samples\Java\Basic\EventProcessorSample\src\main\java\com\microsoft\azure\eventhubs\samples\eventprocessorsample`.
2. In the EventProcessorSample.java file, replace the `----EventHubsNamespaceName-----` value with the Event Hubs namespace you obtained in the "Create an Event Hubs namespace" section of this article. 
3. Replace `----EventHubName-----` with the name of the event hub you created within that namespace.
4. Replace `-----SharedAccessSignatureKeyName-----` with the name of the Shared access policy for the namespace. Unless you created a new policy, the default is **RootManageSharedAccessKey**.
5. Replace `---SharedAccessSignatureKey----` with the value of the SAS key for the policy in the previous step.
6. Replace `----AzureStorageConnectionString----` with the connection string for the storage account you created.
7. Replace `----StorageContainerName----` with the name of the container under the storage account you created.
8. Replace `----HostNamePrefix----` with the name of the storage account.
9. To build the application, navigate to the `\azure-event-hubs\samples\Java\Basic\EventProcessorSample` folder, and issue the following command:

   ```shell
   mvn clean package -DskipTests
   ```

### Run the apps

If the builds completed successfully, you are ready to send and receive events. 

1. Run the **Send** application and observe events being sent. To run the program, navigate to the `\azure-event-hubs\samples\Java\Basic\Send` folder, and issue the following command:

   ```shell
   java -jar ./target/send-1.0.0-jar-with-dependencies.jar
   ```
2. Run the **EventProcessorSample** app, and observe the events being received. To run the program, navigate to the `\azure-event-hubs\samples\Java\Basic\EventProcessorSample` folder, and issue the following command:
   
   ```shell
   java -jar ./target/eventprocessorsample-1.0.0-jar-with-dependencies.jar
   ```

After running both programs, you can check the Azure portal overview page for the event hub to see the incoming and outgoing message count:

![send and receive](./media/event-hubs-quickstart-cli/ephjava.png)

## Understand the sample code

This section contains more details about what the sample code does.

### Send

In the Send.java file, most of the work is done in the main() method. First, the code uses a `ConnectionStringBuilder` instance to construct the connection string using the user-defined values for the namespace name, event hub name, SAS key name, and the SAS key itself:

```java
final ConnectionStringBuilder connStr = new ConnectionStringBuilder()
           .setNamespaceName("----NamespaceName-----")// to target National clouds - use .setEndpoint(URI)
           .setEventHubName("----EventHubName-----")
           .setSasKeyName("-----SharedAccessSignatureKeyName-----")
           .setSasKey("---SharedAccessSignatureKey---");
```

The Java object containing the event payload is then converted to Json:

```java
final Gson gson = new GsonBuilder().create();

final PayloadEvent payload = new PayloadEvent(1);
byte[] payloadBytes = gson.toJson(payload).getBytes(Charset.defaultCharset());
final EventData sendEvent = EventData.create(payloadBytes);  
```

The Event Hubs client is created in this line of code:

```java
final EventHubClient ehClient = EventHubClient.createSync(connStr.toString(), executorService);
```

The try/finally block send 3 events: one event is sent round robin to a non-specified partition, one event is sent to the partition specified by a partition key, and the third event is sent to a specific partition:

```java
try {
    // Type-1 - Send - not tied to any partition
    // EventHubs service will round-robin the events across all EventHubs partitions.
    // This is the recommended & most reliable way to send to EventHubs.
    ehClient.send(sendEvent).get();

    // Type-2 - Send using PartitionKey - all Events with Same partitionKey will land on the Same Partition
    final String partitionKey = "partitionTheStream";
    ehClient.sendSync(sendEvent, partitionKey);

    // Type-3 - Send to a Specific Partition
    sender = ehClient.createPartitionSenderSync("0");
    sender.sendSync(sendEvent);

    System.out.println(Instant.now() + ": Send Complete...");
    System.in.read();
} finally {
    if (sender != null) {
        sender.close()
                .thenComposeAsync(aVoid -> ehClient.close(), executorService)
                .whenCompleteAsync((aVoid1, throwable) -> {
                    if (throwable != null) {
                        System.out.println(String.format("closing failed with error: %s", throwable.toString()));
                    }
                }, executorService).get();
    } else {
        ehClient.closeSync();
    }

    executorService.shutdown();
}
```

### Receive 

The receive operation occurs in the EventProcessorSample.java file. First, it declares constants to hold the Event Hubs namespace name and other credentials:

```java
String consumerGroupName = "$Default";
String namespaceName = "----NamespaceName----";
String eventHubName = "----EventHubName----";
String sasKeyName = "----SharedAccessSignatureKeyName----";
String sasKey = "----SharedAccessSignatureKey----";
String storageConnectionString = "----AzureStorageConnectionString----";
String storageContainerName = "----StorageContainerName----";
String hostNamePrefix = "----HostNamePrefix----";
```

Similar to the Send program, the code then creates a ConnectionStringBuilder instance to construct the connection string:

```java
ConnectionStringBuilder eventHubConnectionString = new ConnectionStringBuilder()
    .setNamespaceName(namespaceName)
	.setEventHubName(eventHubName)
	.setSasKeyName(sasKeyName)
	.setSasKey(sasKey);
```

The *Event Processor Host* is a class that simplifies receiving events from event hubs by managing persistent checkpoints and parallel receives from those event hubs. The code now creates an instance of `EventProcessorHost`:

```java
EventProcessorHost host = new EventProcessorHost(
    EventProcessorHost.createHostName(hostNamePrefix),
    eventHubName,
	consumerGroupName,
	eventHubConnectionString.toString(),
	storageConnectionString,
	storageContainerName);
```

After declaring some error handling code, the app then defines the `EventProcessor` class, an implementation of the `IEventProcessor` interface. This class processes the received events:

```java
public static class EventProcessor implements IEventProcessor
{
	private int checkpointBatchingCount = 0;
    ...
```

The `onEvents()` method is called when events are received on this partition of the event hub:

```java
// onEvents is called when events are received on this partition of the Event Hub. The maximum number of 
// events in a batch can be controlled via EventProcessorOptions.
@Override
public void onEvents(PartitionContext context, Iterable<EventData> events) throws Exception
{
    System.out.println("SAMPLE: Partition " + context.getPartitionId() + " got event batch");
    int eventCount = 0;
    for (EventData data : events)
    {
    	// It is important to have a try-catch around the processing of each event. Throwing out of onEvents deprives
    	// you of the chance to process any remaining events in the batch. 
    	try
    	{
         System.out.println("SAMPLE (" + context.getPartitionId() + "," + data.getSystemProperties().getOffset() + "," +
         		data.getSystemProperties().getSequenceNumber() + "): " + new String(data.getBytes(), "UTF8"));
             eventCount++;
                
         // Checkpointing persists the current position in the event stream for this partition and means that the next
         // time any host opens an event processor on this event hub+consumer group+partition combination, it will start
         // receiving at the event after this one. Checkpointing is usually not a fast operation, so there is a tradeoff
         // between checkpointing frequently (to minimize the number of events that will be reprocessed after a crash, or
         // if the partition lease is stolen) and checkpointing infrequently (to reduce the impact on event processing
         // performance). Checkpointing every five events is an arbitrary choice for this sample.
         this.checkpointBatchingCount++;
         if ((checkpointBatchingCount % 5) == 0)
         {
         	System.out.println("SAMPLE: Partition " + context.getPartitionId() + " checkpointing at " +
        			data.getSystemProperties().getOffset() + "," + data.getSystemProperties().getSequenceNumber());
         	// Checkpoints are created asynchronously. It is important to wait for the result of checkpointing
         	// before exiting onEvents or before creating the next checkpoint, to detect errors and to ensure proper ordering.
         	context.checkpoint(data).get();
         }
   	}
    	catch (Exception e)
    	{
    		System.out.println("Processing failed for an event: " + e.toString());
    	}
    }
    System.out.println("SAMPLE: Partition " + context.getPartitionId() + " batch size was " + eventCount + " for host " + context.getOwner());
}
```

## Clean up deployment

Run the following command to remove the resource group, namespace, storage account, and all related resources. Replace `myResourceGroup` with the name of the resource group you created:

```azurecli
az group delete --resource-group myResourceGroup
```

## Next steps

In this article, you created the Event Hubs namespace and other resources required to send and receive events from your event hub. To learn more, continue with the following articles.

* [Send events to your event hub](https://github.com/Azure/azure-event-hubs/tree/master/samples/Java)
* [Receive events from your event hub](https://github.com/Azure/azure-event-hubs/tree/master/samples/Java)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install Azure CLI 2.0]: /cli/azure/install-azure-cli
[az group create]: /cli/azure/group#az_group_create
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
