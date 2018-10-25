---
title: Receive events from Azure Event Hubs using Java | Microsoft Docs
description: Get started receiving from Event Hubs using Java
services: event-hubs
author: ShubhaVijayasarathy
manager: timlt

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.date: 08/26/2018
ms.author: shvija

---

# Receive events from Azure Event Hubs using Java

Event Hubs is a highly scalable ingestion system that can ingest millions of events per second, enabling an application to process and analyze the massive amounts of data produced by your connected devices and applications. Once collected into Event Hubs, you can transform and store data using any real-time analytics provider or storage cluster.

For more information, see the [Event Hubs overview][Event Hubs overview].

This tutorial shows how to receive events into an event hub using a console application written in Java.

## Prerequisites

In order to complete this tutorial, you need the following prerequisites:

* A Java development environment. For this tutorial, we assume [Eclipse](https://www.eclipse.org/).
* An active Azure account. If you do not have an Azure subscription, create a [free account][] before you begin.

The code in this tutorial is based on the [EventProcessorSample code on GitHub](https://github.com/Azure/azure-event-hubs/tree/master/samples/Java/Basic/EventProcessorSample), which you can examine to see the full working application.

## Receive messages with EventProcessorHost in Java

**EventProcessorHost** is a Java class that simplifies receiving events from Event Hubs by managing persistent checkpoints and parallel receives from those Event Hubs. Using EventProcessorHost, you can split events across multiple receivers, even when hosted in different nodes. This example shows how to use EventProcessorHost for a single receiver.

### Create a storage account

To use EventProcessorHost, you must have an [Azure Storage account][Azure Storage account]:

1. Log on to the [Azure portal][Azure portal], and click **+ Create a resource** on the left-hand side of the screen.
2. Click **Storage**, then click **Storage account**. In the **Create storage account** window, type a name for the storage account. Complete the rest of the fields, select your desired region, and then click **Create**.
   
    ![](./media/event-hubs-dotnet-framework-getstarted-receive-eph/create-storage2.png)

3. Click the newly created storage account, and then click **Access Keys**:
   
    ![](./media/event-hubs-dotnet-framework-getstarted-receive-eph/create-storage3.png)

    Copy the key1 value to a temporary location, to use later in this tutorial.

### Create a Java project using the EventProcessor Host

The Java client library for Event Hubs is available for use in Maven projects from the [Maven Central Repository][Maven Package], and can be referenced using the following dependency declaration inside your Maven project file. The current version is for the artifact azure-eventhubs-eph is 2.0.1 and the current version for the artifact azure-eventhubs is 1.0.2:    

```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-eventhubs</artifactId>
    <version>1.0.2</version>
</dependency>
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-eventhubs-eph</artifactId>
    <version>2.0.1</version>
</dependency>
```

For different types of build environments, you can explicitly obtain the latest released JAR files from the [Maven Central Repository][Maven Package].  

1. For the following sample, first create a new Maven project for a console/shell application in your favorite Java development environment. The class is called `ErrorNotificationHandler`.     
   
    ```java
    import java.util.function.Consumer;
    import com.microsoft.azure.eventprocessorhost.ExceptionReceivedEventArgs;
   
    public class ErrorNotificationHandler implements Consumer<ExceptionReceivedEventArgs>
    {
        @Override
        public void accept(ExceptionReceivedEventArgs t)
        {
            System.out.println("SAMPLE: Host " + t.getHostname() + " received general error notification during " + t.getAction() + ": " + t.getException().toString());
        }
    }
    ```
2. Use the following code to create a new class called `EventProcessorSample`. Replace the placeholders with the values used when you created the event hub and storage account:
   
   ```java
   package com.microsoft.azure.eventhubs.samples.eventprocessorsample;

   import com.microsoft.azure.eventhubs.ConnectionStringBuilder;
   import com.microsoft.azure.eventhubs.EventData;
   import com.microsoft.azure.eventprocessorhost.CloseReason;
   import com.microsoft.azure.eventprocessorhost.EventProcessorHost;
   import com.microsoft.azure.eventprocessorhost.EventProcessorOptions;
   import com.microsoft.azure.eventprocessorhost.ExceptionReceivedEventArgs;
   import com.microsoft.azure.eventprocessorhost.IEventProcessor;
   import com.microsoft.azure.eventprocessorhost.PartitionContext;

   import java.util.concurrent.ExecutionException;
   import java.util.function.Consumer;

   public class EventProcessorSample
   {
       public static void main(String args[]) throws InterruptedException, ExecutionException
       {
       	   String consumerGroupName = "$Default";
    	   String namespaceName = "----NamespaceName----";
    	   String eventHubName = "----EventHubName----";
    	   String sasKeyName = "----SharedAccessSignatureKeyName----";
    	   String sasKey = "----SharedAccessSignatureKey----";
    	   String storageConnectionString = "----AzureStorageConnectionString----";
    	   String storageContainerName = "----StorageContainerName----";
    	   String hostNamePrefix = "----HostNamePrefix----";
    	
    	   ConnectionStringBuilder eventHubConnectionString = new ConnectionStringBuilder()
    			.setNamespaceName(namespaceName)
    			.setEventHubName(eventHubName)
    			.setSasKeyName(sasKeyName)
    			.setSasKey(sasKey);
    	
		   EventProcessorHost host = new EventProcessorHost(
				EventProcessorHost.createHostName(hostNamePrefix),
				eventHubName,
				consumerGroupName,
				eventHubConnectionString.toString(),
				storageConnectionString,
				storageContainerName);
		
		   System.out.println("Registering host named " + host.getHostName());
		   EventProcessorOptions options = new EventProcessorOptions();
		   options.setExceptionNotification(new ErrorNotificationHandler());

		   host.registerEventProcessor(EventProcessor.class, options)
		   .whenComplete((unused, e) ->
		   {
			   if (e != null)
			   {
				   System.out.println("Failure while registering: " + e.toString());
				   if (e.getCause() != null)
				   {
					   System.out.println("Inner exception: " + e.getCause().toString());
				   }
			   }
		   })
		   .thenAccept((unused) ->
		   {
			   System.out.println("Press enter to stop.");
		  	   try 
			   {
				   System.in.read();
			   }
			   catch (Exception e)
			   {
				   System.out.println("Keyboard read failed: " + e.toString());
			   }
		   })
		   .thenCompose((unused) ->
	 	   {
		 	   return host.unregisterEventProcessor();
		   })
		   .exceptionally((e) ->
		   {
			   System.out.println("Failure while unregistering: " + e.toString());
			   if (e.getCause() != null)
			   {
				   System.out.println("Inner exception: " + e.getCause().toString());
			   }
			   return null;
		   })
		   .get(); // Wait for everything to finish before exiting main!
		
           System.out.println("End of sample");
       }
    ```
3. Create one more class called `EventProcessor`, using the following code:
   
    ```java
    public static class EventProcessor implements IEventProcessor
    {
    	private int checkpointBatchingCount = 0;

    	// OnOpen is called when a new event processor instance is created by the host. 
    	@Override
        public void onOpen(PartitionContext context) throws Exception
        {
        	System.out.println("SAMPLE: Partition " + context.getPartitionId() + " is opening");
        }

        // OnClose is called when an event processor instance is being shut down. 
    	@Override
        public void onClose(PartitionContext context, CloseReason reason) throws Exception
        {
            System.out.println("SAMPLE: Partition " + context.getPartitionId() + " is closing for reason " + reason.toString());
        }
    	
    	// onError is called when an error occurs in EventProcessorHost code that is tied to this partition, such as a receiver failure.
    	@Override
    	public void onError(PartitionContext context, Throwable error)
    	{
    		System.out.println("SAMPLE: Partition " + context.getPartitionId() + " onError: " + error.toString());
    	}

    	// onEvents is called when events are received on this partition of the Event Hub. 
    	@Override
        public void onEvents(PartitionContext context, Iterable<EventData> events) throws Exception
        {
            System.out.println("SAMPLE: Partition " + context.getPartitionId() + " got event batch");
            int eventCount = 0;
            for (EventData data : events)
            {
            	try
            	{
	                System.out.println("SAMPLE (" + context.getPartitionId() + "," + data.getSystemProperties().getOffset() + "," +
	                		data.getSystemProperties().getSequenceNumber() + "): " + new String(data.getBytes(), "UTF8"));
	                eventCount++;
	                
	                // Checkpointing persists the current position in the event stream for this partition and means that the next
	                // time any host opens an event processor on this event hub+consumer group+partition combination, it will start
	                // receiving at the event after this one. 
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
    }
    ```

This tutorial uses a single instance of EventProcessorHost. To increase throughput, it is recommended that you run multiple instances of EventProcessorHost, preferably on separate machines.  This provides redundancy as well. In those cases, the various instances automatically coordinate with each other in order to load balance the received events. If you want multiple receivers to each process *all* the events, you must use the **ConsumerGroup** concept. When receiving events from different machines, it might be useful to specify names for EventProcessorHost instances based on the machines (or roles) in which they are deployed.

## Publishing Messages to EventHub

Before messages are retrieved by consumers, they have to be published to the partitions first by the publishers. It is worth noting that when messages are published to event hub synchronously using the sendSync() method on the com.microsoft.azure.eventhubs.EventHubClient object, the message could be sent to a specific partition or distributed to all available partitions in a round-robin manner depending on whether the partition key is specified or not.

When a string representing the partition key is specified, the key will be hashed to determine which partition to send the event to.

When the partition key is not set, then messages will round-robined to all available partitions

```java
// Serialize the event into bytes
byte[] payloadBytes = gson.toJson(messagePayload).getBytes(Charset.defaultCharset());

// Use the bytes to construct an {@link EventData} object
EventData sendEvent = EventData.create(payloadBytes);

// Transmits the event to event hub without a partition key
// If a partition key is not set, then we will round-robin to all topic partitions
eventHubClient.sendSync(sendEvent);

//  the partitionKey will be hash'ed to determine the partitionId to send the eventData to.
eventHubClient.sendSync(sendEvent, partitionKey);

```

## Implementing a Custom CheckpointManager for EventProcessorHost (EPH)

The API provides a mechanism to implement your custom checkpoint manager for scenarios where the default implementation is not compatible with your use case.

The default checkpoint manager uses blob storage but if you override the checkpoint manager used by EPH with your own implementation, you can use any store you want to back the your checkpoint manager implementation.

You have to create a class that implements the interface com.microsoft.azure.eventprocessorhost.ICheckpointManager

Use your custom implementation of the checkpoint manager (com.microsoft.azure.eventprocessorhost.ICheckpointManager)

Within your implementation, you can override the default checkpointing mechanism and implement our own checkpoints based on your own data store (SQL Server, CosmosDB, Redis Cache etc). It is recommended that the store used to back your checkpoint manager implementation be accessible to all EPH instances that are processing events for the consumer group.

You can use any datastore that will be available in your environment.

The com.microsoft.azure.eventprocessorhost.EventProcessorHost class provides you with 2 constructors that allow you to override the checkpoint manager for your EventProcessorHost.

## Next steps

You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an Event Hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)

<!-- Links -->
[Event Hubs overview]: event-hubs-what-is-event-hubs.md
[Azure Storage account]: ../storage/common/storage-create-storage-account.md
[Azure portal]: https://portal.azure.com
[Maven Package]: https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-eventhubs-eph%22

<!-- Images -->
[11]: ./media/service-bus-event-hubs-get-started-receive-ephjava/create-eph-csharp2.png
[12]: ./media/service-bus-event-hubs-get-started-receive-ephjava/create-eph-csharp3.png
[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
