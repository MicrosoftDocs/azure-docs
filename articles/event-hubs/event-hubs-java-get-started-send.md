---
title: Send or receive events from Azure Event Hubs using Java (latest)
description: This article provides a walkthrough of creating a Java application that sends/receives events to/from Azure Event Hubs.
ms.topic: quickstart
ms.date: 02/10/2023
ms.devlang: java
ms.custom: devx-track-java, mode-api, passwordless-java, devx-track-extended-java
---

# Use Java to send events to or receive events from Azure Event Hubs

This quickstart shows how to send events to and receive events from an event hub using the **azure-messaging-eventhubs** Java package.

> [!TIP]
> If you're working with Azure Event Hubs resources in a Spring application, we recommend that you consider [Spring Cloud Azure](/azure/developer/java/spring-framework/) as an alternative. Spring Cloud Azure is an open-source project that provides seamless Spring integration with Azure services. To learn more about Spring Cloud Azure, and to see an example using Event Hubs, see [Spring Cloud Stream with Azure Event Hubs](/azure/developer/java/spring-framework/configure-spring-cloud-stream-binder-java-app-azure-event-hub).

## Prerequisites

If you're new to Azure Event Hubs, see [Event Hubs overview](event-hubs-about.md) before you do this quickstart.

To complete this quickstart, you need the following prerequisites:

- **Microsoft Azure subscription**. To use Azure services, including Azure Event Hubs, you need a subscription.  If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/) or use your MSDN subscriber benefits when you [create an account](https://azure.microsoft.com).
- A Java development environment. This quickstart uses [Eclipse](https://www.eclipse.org/). Java Development Kit (JDK) with version 8 or above is required.
- **Create an Event Hubs namespace and an event hub**. The first step is to use the [Azure portal](https://portal.azure.com) to create a namespace of type Event Hubs, and obtain the management credentials your application needs to communicate with the event hub. To create a namespace and an event hub, follow the procedure in [this article](event-hubs-create.md). Then, get the **connection string for the Event Hubs namespace** by following instructions from the article: [Get connection string](event-hubs-get-connection-string.md#azure-portal). You use the connection string later in this quickstart.

## Send events

This section shows you how to create a Java application to send events an event hub.

### Add reference to Azure Event Hubs library

First, create a new **Maven** project for a console/shell application in your favorite Java development environment. Update the `pom.xml` file as follows. The Java client library for Event Hubs is available in the [Maven Central Repository](https://search.maven.org/search?q=a:azure-messaging-eventhubs). 

### [Passwordless (Recommended)](#tab/passwordless)

```xml
		<dependency>
		    <groupId>com.azure</groupId>
		    <artifactId>azure-messaging-eventhubs</artifactId>
		    <version>5.15.0</version>
		</dependency>
		<dependency>
		    <groupId>com.azure</groupId>
		    <artifactId>azure-identity</artifactId>
		    <version>1.8.0</version>
		    <scope>compile</scope>
		</dependency>
```

### [Connection String](#tab/connection-string)

```xml
		<dependency>
		    <groupId>com.azure</groupId>
		    <artifactId>azure-messaging-eventhubs</artifactId>
		    <version>5.15.0</version>
		</dependency>
```

---

> [!NOTE]
> Update the version to the latest version published to the Maven repository.

### Authenticate the app to Azure

[!INCLUDE [event-hub-passwordless-template-tabbed-basic](../../includes/passwordless/event-hub/event-hub-passwordless-template-tabbed-basic.md)]

### Write code to send messages to the event hub

## [Passwordless (Recommended)](#tab/passwordless)
Add a class named `Sender`, and add the following code to the class:

> [!IMPORTANT]
> - Update `<NAMESPACE NAME>` with the name of your Event Hubs namespace.
> - Update `<EVENT HUB NAME>` with the name of your event hub. 

```java
package ehubquickstart;

import com.azure.messaging.eventhubs.*;
import java.util.Arrays;
import java.util.List;

import com.azure.identity.*;

public class SenderAAD {

    // replace <NAMESPACE NAME> with the name of your Event Hubs namespace.
    // Example: private static final String namespaceName = "contosons.servicebus.windows.net";
    private static final String namespaceName = "<NAMESPACE NAME>.servicebus.windows.net";

    // Replace <EVENT HUB NAME> with the name of your event hub. 
    // Example: private static final String eventHubName = "ordersehub";
    private static final String eventHubName = "<EVENT HUB NAME>";

    public static void main(String[] args) {
        publishEvents();
    }
    /**
     * Code sample for publishing events.
     * @throws IllegalArgumentException if the EventData is bigger than the max batch size.
     */
    public static void publishEvents() {
        // create a token using the default Azure credential        
        DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
                .authorityHost(AzureAuthorityHosts.AZURE_PUBLIC_CLOUD)
                .build();

        // create a producer client        
        EventHubProducerClient producer = new EventHubClientBuilder()        
            .fullyQualifiedNamespace(namespaceName)
            .eventHubName(eventHubName)
            .credential(credential)
            .buildProducerClient();

        // sample events in an array
        List<EventData> allEvents = Arrays.asList(new EventData("Foo"), new EventData("Bar"));

        // create a batch
        EventDataBatch eventDataBatch = producer.createBatch();

        for (EventData eventData : allEvents) {
            // try to add the event from the array to the batch
            if (!eventDataBatch.tryAdd(eventData)) {
                // if the batch is full, send it and then create a new batch
                producer.send(eventDataBatch);
                eventDataBatch = producer.createBatch();

                // Try to add that event that couldn't fit before.
                if (!eventDataBatch.tryAdd(eventData)) {
                    throw new IllegalArgumentException("Event is too large for an empty batch. Max size: "
                        + eventDataBatch.getMaxSizeInBytes());
                }
            }
        }
        // send the last batch of remaining events
        if (eventDataBatch.getCount() > 0) {
            producer.send(eventDataBatch);
        }
        producer.close();
    }   
}
```

## [Connection String](#tab/connection-string)
Add a class named `Sender`, and add the following code to the class:

> [!IMPORTANT]
> Update `<Event Hubs namespace connection string>` with the connection string to your Event Hubs namespace. Update `<Event hub name>` with the name of your event hub in the namespace.

```java
import com.azure.messaging.eventhubs.*;
import java.util.Arrays;
import java.util.List;

public class Sender {
    private static final String connectionString = "<Event Hubs namespace connection string>";
    private static final String eventHubName = "<Event hub name>";

    public static void main(String[] args) {
        publishEvents();
    }
}
```

### Add code to publish events to the event hub

Add a method named `publishEvents` to the `Sender` class:

```java
    /**
     * Code sample for publishing events.
     * @throws IllegalArgumentException if the EventData is bigger than the max batch size.
     */
    public static void publishEvents() {
        // create a producer client
        EventHubProducerClient producer = new EventHubClientBuilder()
            .connectionString(connectionString, eventHubName)
            .buildProducerClient();

        // sample events in an array
        List<EventData> allEvents = Arrays.asList(new EventData("Foo"), new EventData("Bar"));

        // create a batch
        EventDataBatch eventDataBatch = producer.createBatch();

        for (EventData eventData : allEvents) {
            // try to add the event from the array to the batch
            if (!eventDataBatch.tryAdd(eventData)) {
                // if the batch is full, send it and then create a new batch
                producer.send(eventDataBatch);
                eventDataBatch = producer.createBatch();

                // Try to add that event that couldn't fit before.
                if (!eventDataBatch.tryAdd(eventData)) {
                    throw new IllegalArgumentException("Event is too large for an empty batch. Max size: "
                        + eventDataBatch.getMaxSizeInBytes());
                }
            }
        }
        // send the last batch of remaining events
        if (eventDataBatch.getCount() > 0) {
            producer.send(eventDataBatch);
        }
        producer.close();
    }
```
---

Build the program, and ensure that there are no errors. You'll run this program after you run the receiver program.

## Receive events

The code in this tutorial is based on the [EventProcessorClient sample on GitHub](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs-checkpointstore-blob/src/samples/java/com/azure/messaging/eventhubs/checkpointstore/blob/EventProcessorBlobCheckpointStoreSample.java), which you can examine to see the full working application.

[!INCLUDE [storage-checkpoint-store-recommendations](./includes/storage-checkpoint-store-recommendations.md)]

### Create an Azure Storage and a blob container

In this quickstart, you use Azure Storage (specifically, Blob Storage) as the checkpoint store. Checkpointing is a process by which an event processor marks or commits the position of the last successfully processed event within a partition. Marking a checkpoint is typically done within the function that processes the events. To learn more about checkpointing, see [Event processor](event-processor-balance-partition-load.md).

Follow these steps to create an Azure Storage account.

1. [Create an Azure Storage account](../storage/common/storage-account-create.md?tabs=azure-portal)
2. [Create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)
3. Authenticate to the blob container
    
## [Passwordless (Recommended)](#tab/passwordless)

[!INCLUDE [event-hub-storage-assign-roles](../../includes/passwordless/event-hub/event-hub-storage-assign-roles.md)]

## [Connection String](#tab/connection-string)

[Get the connection string to the storage account](../storage/common/storage-configure-connection-string.md)

Note down the **connection string** and the **container name**. You use them in the receive code. 

---
### Add Event Hubs libraries to your Java project

## [Passwordless (Recommended)](#tab/passwordless)

Add the following dependencies in the pom.xml file.

- [azure-messaging-eventhubs](https://search.maven.org/search?q=a:azure-messaging-eventhubs)
- [azure-messaging-eventhubs-checkpointstore-blob](https://search.maven.org/search?q=a:azure-messaging-eventhubs-checkpointstore-blob)
- [azure-identity](https://search.maven.org/search?q=a:azure-identity)

```xml
	<dependencies>
		<dependency>
		    <groupId>com.azure</groupId>
		    <artifactId>azure-messaging-eventhubs</artifactId>
		    <version>5.15.0</version>
		</dependency>
		<dependency>
		    <groupId>com.azure</groupId>
		    <artifactId>azure-messaging-eventhubs-checkpointstore-blob</artifactId>
		    <version>1.16.1</version>
		</dependency>
		<dependency>
		    <groupId>com.azure</groupId>
		    <artifactId>azure-identity</artifactId>
		    <version>1.8.0</version>
		    <scope>compile</scope>
		</dependency>	
	</dependencies>
```


### [Connection String](#tab/connection-string)

Add the following dependencies in the pom.xml file.

- [azure-messaging-eventhubs](https://search.maven.org/search?q=a:azure-messaging-eventhubs)
- [azure-messaging-eventhubs-checkpointstore-blob](https://search.maven.org/search?q=a:azure-messaging-eventhubs-checkpointstore-blob)

```xml
	<dependencies>
		<dependency>
		    <groupId>com.azure</groupId>
		    <artifactId>azure-messaging-eventhubs</artifactId>
		    <version>5.15.0</version>
		</dependency>
		<dependency>
		    <groupId>com.azure</groupId>
		    <artifactId>azure-messaging-eventhubs-checkpointstore-blob</artifactId>
		    <version>1.16.1</version>
		</dependency>
	</dependencies>
```
---


## [Passwordless (Recommended)](#tab/passwordless)

1. Add the following `import` statements at the top of the Java file.

    ```java
    import com.azure.messaging.eventhubs.*;
    import com.azure.messaging.eventhubs.checkpointstore.blob.BlobCheckpointStore;
    import com.azure.messaging.eventhubs.models.*;
    import com.azure.storage.blob.*;
    import java.util.function.Consumer;
    
    import com.azure.identity.*;
    ```
2. Create a class named `Receiver`, and add the following string variables to the class. Replace the placeholders with the correct values.

    > [!IMPORTANT]
    > Replace the placeholders with the correct values.
    > - `<NAMESPACE NAME>` with the name of your Event Hubs namespace.
    > - `<EVENT HUB NAME>` with the name of your event hub in the namespace.

    ```java
    private static final String namespaceName = "<NAMESPACE NAME>.servicebus.windows.net";
    private static final String eventHubName = "<EVENT HUB NAME>";
    ```
3. Add the following `main` method to the class.

    > [!IMPORTANT]
    > Replace the placeholders with the correct values.
    > - `<STORAGE ACCOUNT NAME>` with the name of your Azure Storage account.
    > - `<CONTAINER NAME>` with the name of the blob container in the storage account

    ```java
    // create a token using the default Azure credential
    DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
            .authorityHost(AzureAuthorityHosts.AZURE_PUBLIC_CLOUD)
            .build();

    // Create a blob container client that you use later to build an event processor client to receive and process events
    BlobContainerAsyncClient blobContainerAsyncClient = new BlobContainerClientBuilder()
            .credential(credential)
            .endpoint("https://<STORAGE ACCOUNT NAME>.blob.core.windows.net")
            .containerName("<CONTAINER NAME>")
            .buildAsyncClient();
    
    // Create an event processor client to receive and process events and errors.
    EventProcessorClient eventProcessorClient = new EventProcessorClientBuilder()
        .fullyQualifiedNamespace(namespaceName)
        .eventHubName(eventHubName)
        .consumerGroup(EventHubClientBuilder.DEFAULT_CONSUMER_GROUP_NAME)
        .processEvent(PARTITION_PROCESSOR)
        .processError(ERROR_HANDLER)
        .checkpointStore(new BlobCheckpointStore(blobContainerAsyncClient))            
        .credential(credential)
        .buildEventProcessorClient();

    System.out.println("Starting event processor");
    eventProcessorClient.start();

    System.out.println("Press enter to stop.");
    System.in.read();

    System.out.println("Stopping event processor");
    eventProcessorClient.stop();
    System.out.println("Event processor stopped.");

    System.out.println("Exiting process");  
    ```

## [Connection String](#tab/connection-string)

1. Add the following **import** statements at the top of the Java file.

    ```java
    import com.azure.messaging.eventhubs.*;
    import com.azure.messaging.eventhubs.checkpointstore.blob.BlobCheckpointStore;
    import com.azure.messaging.eventhubs.models.*;
    import com.azure.storage.blob.*;
    import java.util.function.Consumer;
    ```
2. Create a class named `Receiver`, and add the following string variables to the class. Replace the placeholders with the correct values.

    > [!IMPORTANT]
    > Replace the placeholders with the correct values.
    > - `<Event Hubs namespace connection string>` with the connection string to your Event Hubs namespace. Update
    > - `<Event hub name>` with the name of your event hub in the namespace.
    > - `<Storage connection string>` with the connection string to your Azure storage account.
    > - `<Storage container name>` with the name of your container in your Azure Blob storage.

    ```java
    private static final String connectionString = "<Event Hubs namespace connection string>";
    private static final String eventHubName = "<Event hub name>";
    private static final String storageConnectionString = "<Storage connection string>";
    private static final String storageContainerName = "<Storage container name>";
    ```
3. Add the following `main` method to the class.

    ```java
    public static void main(String[] args) throws Exception {
        // Create a blob container client that you use later to build an event processor client to receive and process events
        BlobContainerAsyncClient blobContainerAsyncClient = new BlobContainerClientBuilder()
            .connectionString(storageConnectionString)
            .containerName(storageContainerName)
            .buildAsyncClient();

        // Create a builder object that you will use later to build an event processor client to receive and process events and errors.
        EventProcessorClientBuilder eventProcessorClientBuilder = new EventProcessorClientBuilder()
            .connectionString(connectionString, eventHubName)
            .consumerGroup(EventHubClientBuilder.DEFAULT_CONSUMER_GROUP_NAME)
            .processEvent(PARTITION_PROCESSOR)
            .processError(ERROR_HANDLER)
            .checkpointStore(new BlobCheckpointStore(blobContainerAsyncClient));

        // Use the builder object to create an event processor client
        EventProcessorClient eventProcessorClient = eventProcessorClientBuilder.buildEventProcessorClient();

        System.out.println("Starting event processor");
        eventProcessorClient.start();

        System.out.println("Press enter to stop.");
        System.in.read();

        System.out.println("Stopping event processor");
        eventProcessorClient.stop();
        System.out.println("Event processor stopped.");

        System.out.println("Exiting process");
    }
    ```
---

4. Add the two helper methods (`PARTITION_PROCESSOR` and `ERROR_HANDLER`) that process events and errors to the `Receiver` class.

    ```java
    public static final Consumer<EventContext> PARTITION_PROCESSOR = eventContext -> {
        PartitionContext partitionContext = eventContext.getPartitionContext();
        EventData eventData = eventContext.getEventData();

        System.out.printf("Processing event from partition %s with sequence number %d with body: %s%n",
            partitionContext.getPartitionId(), eventData.getSequenceNumber(), eventData.getBodyAsString());

        // Every 10 events received, it will update the checkpoint stored in Azure Blob Storage.
        if (eventData.getSequenceNumber() % 10 == 0) {
            eventContext.updateCheckpoint();
        }
    };

    public static final Consumer<ErrorContext> ERROR_HANDLER = errorContext -> {
        System.out.printf("Error occurred in partition processor for partition %s, %s.%n",
            errorContext.getPartitionContext().getPartitionId(),
            errorContext.getThrowable());
    };
    ```

5. Build the program, and ensure that there are no errors.

## Run the applications

1. Run the **Receiver** application first.
1. Then, run the **Sender** application.
1. In the **Receiver** application window, confirm that you see the events that were published by the Sender application.

    ```cmd
    Starting event processor
    Press enter to stop.
    Processing event from partition 0 with sequence number 331 with body: Foo
    Processing event from partition 0 with sequence number 332 with body: Bar
    ```
    
1. Press **ENTER** in the receiver application window to stop the application.

    ```cmd
    Starting event processor
    Press enter to stop.
    Processing event from partition 0 with sequence number 331 with body: Foo
    Processing event from partition 0 with sequence number 332 with body: Bar

    Stopping event processor
    Event processor stopped.
    Exiting process
    ```

## Next steps

See the following samples on GitHub:

- [azure-messaging-eventhubs samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs)
- [azure-messaging-eventhubs-checkpointstore-blob samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventhubs/azure-messaging-eventhubs-checkpointstore-blob/src/samples/java/com/azure/messaging/eventhubs/checkpointstore/blob).
