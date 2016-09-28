<properties
	pageTitle="Process IoT Hub device-to-cloud messages (Java) | Microsoft Azure"
	description="Follow this Java tutorial to learn useful patterns to process IoT Hub device-to-cloud messages."
	services="iot-hub"
	documentationCenter="java"
	authors="dominicbetts"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="java"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="09/01/2016"
     ms.author="dobett"/>

# Tutorial: How to process IoT Hub device-to-cloud messages using Java

[AZURE.INCLUDE [iot-hub-selector-process-d2c](../../includes/iot-hub-selector-process-d2c.md)]

## Introduction

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back end. Other tutorials ([Get started with IoT Hub] and [Send cloud-to-device messages with IoT Hub][lnk-c2d]) show you how to use the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub.

This tutorial builds on the code shown in the [Get started with IoT Hub] tutorial, and it shows two scalable patterns that you can use to process device-to-cloud messages:

- The reliable storage of device-to-cloud messages in [Azure Blob storage]. A common scenario is *cold path* analytics, in which you store telemetry data in blobs to use as input into analytics processes. These processes can be driven by tools such as [Azure Data Factory] or the [HDInsight (Hadoop)] stack.

- The reliable processing of *interactive* device-to-cloud messages. Device-to-cloud messages are interactive when they are immediate triggers for a set of actions in the application back end. For example, a device might send an alarm message that triggers inserting a ticket into a CRM system. By contrast, *data-point* messages simply feed into an analytics engine. For example, temperature telemetry from a device that is to be stored for later analysis is a data-point message.

Because IoT Hub exposes an [Event Hubs][lnk-event-hubs]-compatible endpoint to receive device-to-cloud messages, this tutorial uses an [EventProcessorHost] instance. This instance:

* Reliably stores *data-point* messages in Azure blob storage.
* Forwards *interactive* device-to-cloud messages to an Azure [Service Bus queue] for immediate processing.

Service Bus helps ensure reliable processing of interactive messages, as it provides per-message checkpoints, and time window-based de-duplication.

> [AZURE.NOTE] An **EventProcessorHost** instance is only one way to process interactive messages. Other options include [Azure Service Fabric][lnk-service-fabric] and [Azure Stream Analytics][lnk-stream-analytics].

At the end of this tutorial, you run three Java console apps:

* **simulated-device**, a modified version of the app created in the [Get started with IoT Hub] tutorial, sends data-point device-to-cloud messages every second, and interactive device-to-cloud messages every 10 seconds. This app uses the AMQPS protocol to communicate with IoT Hub.
* **process-d2c-messages** uses the [EventProcessorHost] class to retrieve messages from the Event Hubs-compatible endpoint. It then reliably stores data-point messages in Azure Blob storage, and forwards interactive messages to a Service Bus queue.
* **process-interactive-messages** de-queues the interactive messages from the Service Bus queue.

> [AZURE.NOTE] IoT Hub has SDK support for many device platforms and languages, including C, Java, and JavaScript. For instructions on how to replace the simulated device in this tutorial with a physical device, and how to connect devices to an IoT Hub, see the [Azure IoT Developer Center].

This tutorial is directly applicable to other ways to consume Event Hubs-compatible messages, such as [HDInsight (Hadoop)] projects. For more information, see [Azure IoT Hub developer guide - Device to cloud].

To complete this tutorial, you need the following:

+ A complete working version of the [Get started with IoT Hub] tutorial.

+ Java SE 8. <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Java for this tutorial on either Windows or Linux.

+ Maven 3.  <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Maven for this tutorial on either Windows or Linux.

+ An active Azure account. <br/>If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes.

You should have some basic knowledge of [Azure Storage] and [Azure Service Bus].


## Send interactive messages from a simulated device

In this section, you modify the simulated device application you created in the [Get started with IoT Hub] tutorial to send interactive device-to-cloud messages to the IoT hub.

1. Use a text editor to open the simulated-device\src\main\java\com\mycompany\app\App.java file. This file contains the code for the **simulated-device** app you created in the [Get started with IoT Hub] tutorial.

2. Add the following nested class to the **App** class:

    ```
    private static class InteractiveMessageSender implements Runnable {
      public void run() {
        try {
          while (true) {
            String msgStr = "Alert message!";
            Message msg = new Message(msgStr);
            msg.setMessageId(java.util.UUID.randomUUID().toString());
            msg.setProperty("messageType", "interactive");
            System.out.println("Sending interactive message: " + msgStr);

            Object lockobj = new Object();
            EventCallback callback = new EventCallback();
            client.sendEventAsync(msg, callback, lockobj);

            synchronized (lockobj) {
              lockobj.wait();
            }
            Thread.sleep(10000);
          }
        } catch (InterruptedException e) {
          System.out.println("Finished sending interactive messages.");
        }
      }
    }
    ```

    This class is similar to the **MessageSender** class in the **simulated-device** project. The only differences are that you now set the **MessageId** system property, and a custom property called **messageType**.
    The code assigns a universally unique identifier (UUID) to the **MessageId** property. The Service Bus can use this identifier to de-duplicate the messages it receives. The sample uses the **messageType** property to distinguish interactive from data-point messages. The application passes this information in message properties, instead of in the message body, so that the event processor does not need to deserialize the message to perform message routing.

    > [AZURE.NOTE] It is important to create the **MessageId** used to de-duplicate interactive messages in the device code. Intermittent network communications, or other failures, could result in multiple retransmissions of the same message from that device. You can also use a semantic message ID, such as a hash of the relevant message data fields, in place of a UUID.

3. Modify the **main** method to send both interactive messages and data-point messages as shown in the following code snippet:

    ````
    MessageSender sender = new MessageSender();
    InteractiveMessageSender interactiveSender = new InteractiveMessageSender();

    ExecutorService executor = Executors.newFixedThreadPool(2);
    executor.execute(sender);
    executor.execute(interactiveSender);
    ````

4. Save and close the simulated-device\src\main\java\com\mycompany\app\App.java file.

    > [AZURE.NOTE] For the sake of simplicity, this tutorial does not implement any retry policy. In production code, you should implement a retry policy such as exponential backoff, as suggested in the MSDN article [Transient Fault Handling].

5. To build the **simulated-device** application using Maven, execute the following command at the command-prompt in the simulated-device folder:

    ```
    mvn clean package -DskipTests
    ```

## Process device-to-cloud messages

In this section, you create a Java console app that processes device-to-cloud messages from IoT Hub. Iot Hub exposes an [Event Hubs]-compatible endpoint to enable an application to read device-to-cloud messages. This tutorial uses the [EventProcessorHost] class to process these messages in a console app. For more information about how to process messages from Event Hubs, see the [Get Started with Event Hubs] tutorial.

The main challenge when you implement reliable storage of data-point messages or forwarding of interactive messages, is that event processing relies on the message consumer to provide checkpoints for its progress. Moreover, to achieve a high throughput, when you read from Event Hubs you should provide checkpoints in large batches. This approach creates the possibility of duplicate processing for a large number of messages, if there is a failure and you revert to the previous checkpoint. In this tutorial, you see how to synchronize Azure storage writes and Service Bus de-duplication windows with **EventProcessorHost** checkpoints.

To write messages to Azure storage reliably, the sample uses the individual block commit feature of [block blobs][Azure Block Blobs]. The event processor accumulates messages in memory until it is time to provide a checkpoint. For example, after the accumulated buffer of messages reaches the maximum block size of 4 MB, or after the Service Bus de-duplication time window elapses. Then, before the checkpoint, the code commits a new block to the blob.

The event processor uses Event Hubs message offsets as block IDs. This mechanism enables the event processor to perform a de-duplication check before it commits the new block to storage, taking care of a possible crash between committing a block and the checkpoint.

> [AZURE.NOTE] This tutorial uses a single storage account to write all the messages retrieved from IoT Hub. To decide if you need to use multiple Azure Storage accounts in your solution, see [Azure Storage scalability Guidelines].

The application uses the Service Bus de-duplication feature to avoid duplicates when it processes interactive messages. The simulated device stamps each interactive message with a unique **MessageId**. This id Service Bus to ensure that, in the specified de-duplication time window, no two messages with the same **MessageId** are delivered to the receivers. This de-duplication, together with the per-message completion semantics provided by Service Bus queues, makes it easy to implement the reliable processing of interactive messages.

To make sure that no message is resubmitted outside of the de-duplication window, the code synchronizes the **EventProcessorHost** checkpoint mechanism with the Service Bus queue de-duplication window. This synchronization is done by forcing a checkpoint at least once every time the de-duplication window elapses (in this tutorial, the window is one hour).

> [AZURE.NOTE] This tutorial uses a single partitioned Service Bus queue to process all the interactive messages retrieved from IoT Hub. For more information about how to use Service Bus queues to meet the scalability requirements of your solution, see the [Azure Service Bus] documentation.

### Provision an Azure Storage account and a Service Bus queue

To use the [EventProcessorHost] class, you must have an Azure Storage account to enable the **EventProcessorHost** to record checkpoint information. You can use an existing storage account, or follow the instructions in [About Azure Storage] to create a new one. Make a note of the storage account connection string.

> [AZURE.NOTE] When you copy and paste the storage account connection string, make sure there are no spaces included.

You also need a Service Bus queue to enable reliable processing of interactive messages. You can create a queue programmatically, with a one hour de-duplication window, as explained in [How to use Service Bus Queues][Service Bus queue]. Alternatively, you can use the [Azure classic portal][lnk-classic-portal], by following these steps:

1. Click **New** in the lower-left corner. Then click **App Services** > **Service Bus** > **Queue** > **Custom Create**. Enter the name **d2ctutorial**, select a region, and use an existing namespace or create a new one. Make a note of the namespace name, you need it later in this tutorial. On the next page, select **Enable duplicate detection**, and set the **Duplicate detection history time window** to one hour. Then click the check mark in the lower-right corner to save your queue configuration.

    ![Create a queue in Azure portal][30]

2. In the list of Service Bus queues, click **d2ctutorial**, and then click **Configure**. Create two shared access policies, one called **send** with **Send** permissions, and one called **listen** with **Listen** permissions. Make a note of the **Primary key** values for both policies, you need them later in this tutorial. When you are done, click **Save** at the bottom.

    ![Configure a queue in Azure portal][31]

### Create the event processor

In this section, you create a Java application to process messages from the Event Hubs-compatible endpoint.

The first task is to add a Maven project called **process-d2c-messages** that receives device-to-cloud messages from the IoT Hub Event Hubs-compatible endpoint and routes those messages to other back-end services.

1. In the iot-java-get-started folder you created in the [Get started with IoT Hub] tutorial, create a Maven project called **process-d2c-messages** using the following command at your command-prompt. Note this is a single, long command:

    ```
    mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=process-d2c-messages -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
    ```

2. At your command prompt, navigate to the new process-d2c-messages folder.

3. Using a text editor, open the pom.xml file in the process-d2c-messages folder and add the following dependencies to the **dependencies** node. These dependencies enable you to use the azure-eventhubs, azure-eventhubs-eph, and azure-servicebus packages in your application to interact with your IoT hub and Service Bus queue:

    ```
    <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-eventhubs</artifactId>
      <version>0.8.0</version>
    </dependency>
    <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-eventhubs-eph</artifactId>
      <version>0.8.0</version>
    </dependency>
    <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-servicebus</artifactId>
      <version>0.9.4</version>
    </dependency>
    ```

4. Save and close the pom.xml file.

The next task is to add an **ErrorNotificationHandler** class to the project.

1. Use a text editor to create a process-d2c-messages\src\main\java\com\mycompany\app\ErrorNotificationHandler.java file. Add the following code to the file to display error messages from the **EventProcesssorHost** instance:

    ```
    package com.mycompany.app;

    import java.util.function.Consumer;
    import com.microsoft.azure.eventprocessorhost.ExceptionReceivedEventArgs;

    public class ErrorNotificationHandler implements
        Consumer<ExceptionReceivedEventArgs> {
      @Override
      public void accept(ExceptionReceivedEventArgs t) {
        System.out.println("EventProcessorHost: Host " + t.getHostname()
            + " received general error notification during " + t.getAction() + ": "
            + t.getException().toString());
      }
    }
    ```

2. Save and close the ErrorNotificationHandler.java file.

Now you can add a class that implements the **IEventProcessor** interface. The **EventProcessorHost** class calls this class to process device-to-cloud messages received from IoT Hub. The code in this class implements the logic to store messages reliably in a blob container, and forward interactive messages to the Service Bus queue.

The **onEvents** method sets the **latestEventData** variable that tracks the offset and sequence number of the latest message read by this event processor. Remember that each processor is responsible for a single partition. The **onEvents** method then receives a batch of messages from IoT Hub, and processes them as follows: it sends interactive messages to the Service Bus queue, and appends data point messages to the **toAppend** memory buffer. If the memory buffer reaches the 4 MB block limit, or the de-duplication time windows elapses (one hour after the last checkpoint in this tutorial), then the method triggers a checkpoint.

The **AppendAndCheckPoint** method first generates a **blockId** for the block to append to the blob. Azure storage requires all block IDs to have the same length, so the method pads the offset with leading zeros. Then, if a block with this ID is already in the blob, the method overwrites it with the current buffer content.

> [AZURE.NOTE] To simplify the code, this tutorial uses a single blob file per partition to store the messages. A real solution would implement file rolling by creating additional files after a certain amount of time, or when they reach a certain size. Remember that an Azure block blob can contain at most 195 GB of data.

The next task is to implement the **IEventProcessor** interface:

1. Use a text editor to create a process-d2c-messages\src\main\java\com\mycompany\app\EventProcessor.java file.

2. Add the following imports and class definition to the EventProcessor.java file. The **EventProcessor** class implements the **IEventProcessor** interface that defines the behavior of the Event Hubs client:

    ```
    package com.mycompany.app;

    import java.io.ByteArrayInputStream;
    import java.io.ByteArrayOutputStream;
    import java.io.IOException;
    import java.net.URISyntaxException;
    import java.nio.charset.StandardCharsets;
    import java.time.Duration;
    import java.time.Instant;
    import java.util.ArrayList;
    import java.util.Base64;
    import java.util.concurrent.ExecutionException;

    import com.microsoft.azure.eventhubs.EventData;
    import com.microsoft.azure.eventprocessorhost.*;
    import com.microsoft.azure.storage.*;
    import com.microsoft.azure.storage.blob.*;
    import com.microsoft.windowsazure.services.servicebus.*;
    import com.microsoft.windowsazure.services.servicebus.models.BrokeredMessage;

    public class EventProcessor implements IEventProcessor {

    }
    ```

3. Add the following methods to the **EventProcessor** class to implement the **IEventProcessor** interface:

    ```
    @Override
    public void onOpen(PartitionContext context) throws Exception {
      System.out.println("EventProcessorHost: Partition "
          + context.getPartitionId() + " is opening");
    }

    @Override
    public void onClose(PartitionContext context, CloseReason reason)
        throws Exception {
      System.out.println("EventProcessorHost: Partition "
          + context.getPartitionId() + " is closing for reason "
          + reason.toString());
    }

    @Override
    public void onError(PartitionContext context, Throwable error) {
      System.out.println("EventProcessorHost: Partition "
          + context.getPartitionId() + " onError: " + error.toString());
    }

    @Override
    public void onEvents(PartitionContext context, Iterable<EventData> messages)
        throws Exception {
    }
    ```

4. Add the following class-level variables to the **EventProcessor** class:

    ```
    public static CloudBlobContainer blobContainer;
    public static ServiceBusContract serviceBusContract;

    // Use a smaller MAX_BLOCK_SIZE value to test.
    final private int MAX_BLOCK_SIZE = 4 * 1024 * 1024;
    final private Duration MAX_CHECKPOINT_TIME = Duration.ofHours(1);

    private ByteArrayOutputStream toAppend = new ByteArrayOutputStream(
        MAX_BLOCK_SIZE);
    private Instant start = Instant.now();
    private EventData latestEventData;
    ```

5. Add an **AppendAndCheckPoint** method with the following signature to the **EventProcessor** class:

    ```
    private void AppendAndCheckPoint(PartitionContext context)
      throws URISyntaxException, StorageException, IOException,
      IllegalArgumentException, InterruptedException, ExecutionException {
    }
    ```

6. Add the following code to the **AppendAndCheckPoint** method to retrieve the current message offset and sequence number in the partition:

    ```
    String currentOffset = latestEventData.getSystemProperties().getOffset();
    Long currentSequence = latestEventData.getSystemProperties().getSequenceNumber();
    System.out
        .printf(
            "\nAppendAndCheckPoint using partition: %s, offset: %s, sequence: %s\n",
            context.getPartitionId(), currentOffset, currentSequence);
    ```

7. In the **AppendAndCheckPoint** method, use the current offset value to create a **BlockEntry** instance for the next block to save to the blob:

    ```
    Long blockId = Long.parseLong(currentOffset);
    String blockIdString = String.format("startSeq:%1$025d", blockId);
    String encodedBlockId = Base64.getEncoder().encodeToString(
        blockIdString.getBytes(StandardCharsets.US_ASCII));
    BlockEntry block = new BlockEntry(encodedBlockId);
    ```

8. In the **AppendAndCheckPoint** method, upload the latest set of messages to the block blob and retrieve the current list of blocks:

    ```
    String blobName = String.format("iothubd2c_%s", context.getPartitionId());
    CloudBlockBlob currentBlob = blobContainer.getBlockBlobReference(blobName);

    currentBlob.uploadBlock(block.getId(),
        new ByteArrayInputStream(toAppend.toByteArray()), toAppend.size());
    ArrayList<BlockEntry> blockList = currentBlob.downloadBlockList();
    ```

9. In the **AppendAndCheckPoint** method, either create the initial block in a new blob or append the block to the existing blob:

    ```
    if (currentBlob.exists()) {
      // Check if we should append new block or overwrite existing block
      BlockEntry last = blockList.get(blockList.size() - 1);
      if (blockList.size() > 0 && !last.getId().equals(block.getId())) {
        System.out.printf("Appending block %s to blob %s\n", blockId, blobName);
        blockList.add(block);
      } else {
        System.out.printf("Overwriting block %s in blob %s\n", blockId,
            blobName);
      }
    } else {
      System.out.printf("Creating initial block %s in new blob: %s\n", blockId,
          blobName);
      blockList.add(block);
    }
    currentBlob.commitBlockList(blockList);
    ```

10. Finally in the **AppendAndCheckPoint** method, create a checkpoint on the partition and prepare to save the next block of messages:

    ```
    context.checkpoint(latestEventData);

    // Reset everything after the checkpoint.
    toAppend.reset();
    start = Instant.now();
    System.out.printf("Checkpointed on partition id: %s\n",
        context.getPartitionId());
    ```

11. In the **onEvents** method, add the following code to receive messages from the IoT Hub endpoint and forward interactive messages to the Service Bus queue. Then call the **AppendAndCheckPoint** method when the block is full or the timeout expires:

    ```
    if (messages != null) {
      for (EventData eventData : messages) {
        latestEventData = eventData;
        byte[] data = eventData.getBody();
        if (eventData.getProperties().containsKey("messageType")
            && eventData.getProperties().get("messageType")
                .equals("interactive")) {
          String messageId = (String) eventData.getSystemProperties().get(
              "message-id");
          BrokeredMessage message = new BrokeredMessage(data);
          message.setMessageId(messageId);
          serviceBusContract.sendQueueMessage("d2ctutorial", message);
          continue;
        }
        if (toAppend.size() + data.length > MAX_BLOCK_SIZE
            || Duration.between(start, Instant.now()).compareTo(
                MAX_CHECKPOINT_TIME) > 0) {
          AppendAndCheckPoint(context);
        }
        toAppend.write(data);
      }
    }
    ```

12. Finally in the **onEvents** method, add an `else if' clause to call the **AppendAndCheckPoint** if the timeout expires while there are no messages coming from IoT Hub:

    ```
    else if ((toAppend.size() > 0)
        && Duration.between(start, Instant.now())
            .compareTo(MAX_CHECKPOINT_TIME) > 0) {
      AppendAndCheckPoint(context);
    }
    ```

13. Save the changes to the EventProcessor.java file.

The final task in the **process-d2c-messages** project is to add code to the **main** method that instantiates an **EventProcessorHost** instance.

1. Use a text editor to open the process-d2c-messages\src\main\java\com\mycompany\app\App.java file.

2. Add the following **import** statements to the file:

    ```
    import com.microsoft.azure.eventprocessorhost.*;
    import com.microsoft.azure.servicebus.ConnectionStringBuilder;
    import com.microsoft.azure.storage.CloudStorageAccount;
    import com.microsoft.azure.storage.StorageException;
    import com.microsoft.azure.storage.blob.CloudBlobClient;
    import com.microsoft.windowsazure.Configuration;
    import com.microsoft.windowsazure.services.servicebus.ServiceBusConfiguration;
    import com.microsoft.windowsazure.services.servicebus.ServiceBusService;

    import java.net.URISyntaxException;
    import java.security.InvalidKeyException;
    import java.util.concurrent.*;
    ```

3. Add the following class-level variable to the **App** class. Replace **{yourstorageaccountconnectionstring}** with the Azure storage account connection string you made a note of previously in the [Provision an Azure Storage account and a Service Bus queue](#provision-an-azure-storage-account-and-a-service-bus-queue) section:

    ```
    private final static String storageConnectionString = "{yourstorageaccountconnectionstring}";
    ```

4. Add the following class-level variables to the **App** class and replace **{yourservicebusnamespace}** with your Service Bus namespace and **{yourservicebussendkey}** with your queue's **send** key. You previously made a note of namespace and **listen** key values in the [Provision an Azure Storage account and a Service Bus queue](#provision-an-azure-storage-account-and-a-service-bus-queue) section:

    ```
    private final static String serviceBusNamespace = "{yourservicebusnamespace}";
    private final static String serviceBusSasKeyName = "send";
    private final static String serviceBusSASKey = "{yourservicebussendkey}";
    private final static String serviceBusRootUri = ".servicebus.windows.net";
    ```

5. Add the following class-level variables to the **App** class. Replace **{youreventhubcompatibleendpoint}** with the Event Hub-compatible endpoint name. The endpoint name looks like **ihs....namespace** so you should remove the **sb://** prefix and the **.servicebus.windows.net/** suffix. Replace **{youreventhubcompatiblename}** with the Event Hub-compatible name. Replace **{youriothubkey}** with the **iothubowner** key. You made a note of these values in the [Create an IoT Hub][lnk-create-an-iot-hub] section in the *Get started with Azure IoT Hub for Java* tutorial:

    ```
    private final static String consumerGroupName = "$Default";
    private final static String namespaceName = "{youreventhubcompatibleendpoint}";
    private final static String eventHubName = "{youreventhubcompatiblename}";
    private final static String sasKeyName = "iothubowner";
    private final static String sasKey = "{youriothubkey}";
    ```

6. Modify the signature of the **main** method as follows:

    ```
    public static void main(String args[]) throws InvalidKeyException,
      URISyntaxException, StorageException {
    }
    ```

7. Add the following code to the **main** method to get a reference to the blob container that stores the messages:

    ```
    System.out.println("Process D2C messages using EventProcessorHost");
    CloudStorageAccount account = CloudStorageAccount
        .parse(storageConnectionString);
    CloudBlobClient client = account.createCloudBlobClient();
    EventProcessor.blobContainer = client
        .getContainerReference("d2cjavatutorial");
    EventProcessor.blobContainer.createIfNotExists();
    ```

8. Add the following code to the **main** method to get a reference to the Service Bus service:

    ```
    Configuration config = ServiceBusConfiguration
        .configureWithSASAuthentication(serviceBusNamespace,
            serviceBusSasKeyName, serviceBusSASKey, serviceBusRootUri);
    EventProcessor.serviceBusContract = ServiceBusService.create(config);
    ```

9. In the **main** method, configure and create an **EventProcessorHost** instance. The **setInvokeProcessorAfterReceiveTimeout** option ensures that the **EventProcessorHost** instance invokes the **onEvents** method in the **IEventProcessor** interface even when there are no messages to process. The **onEvents** method then always invokes the **AppendAndCheckPoint** method when the timeout expires.

    ```
    ConnectionStringBuilder eventHubConnectionString = new ConnectionStringBuilder(
        namespaceName, eventHubName, sasKeyName, sasKey);
    EventProcessorHost host = new EventProcessorHost(eventHubName,
        consumerGroupName, eventHubConnectionString.toString(),
        storageConnectionString);
    EventProcessorOptions options = new EventProcessorOptions();
    options.setExceptionNotification(new ErrorNotificationHandler());
    options.setInvokeProcessorAfterReceiveTimeout(true);
    ```

10. In the **main** method, register the **IEventProcessor** implementation with the **EventProcessorHost** instance:

    ```
    try {
      System.out.println("Registering host named " + host.getHostName());
      host.registerEventProcessor(EventProcessor.class, options).get();
    } catch (Exception e) {
      System.out.print("Failure while registering: ");
      if (e instanceof ExecutionException) {
        Throwable inner = e.getCause();
        System.out.println(inner.toString());
      } else {
        System.out.println(e.toString());
      }
      System.out.println(e.toString());
    }
    ```

11. Finally, add logic to the **main** method to shut down the **EventProcessorHost** instance:

    ```
    System.out.println("Press enter to stop");
    try {
      System.in.read();
      host.unregisterEventProcessor();

      System.out.println("Calling forceExecutorShutdown");
      EventProcessorHost.forceExecutorShutdown(120);
    } catch (Exception e) {
      System.out.println(e.toString());
      e.printStackTrace();
    }

    System.out.println("End of sample");
    ```

12. Save and close the process-d2c-messages\src\main\java\com\mycompany\app\App.java file.

13. To build the **process-d2c-messages** application using Maven, execute the following command at the command-prompt in the process-d2c-messages folder:

    ```
    mvn clean package -DskipTests
    ```

## Receive interactive messages

In this section, you write a Java console app that receives the interactive messages from the Service Bus queue.

The first task is to add a Maven project called **process-interactive-messages** that receives messages sent on the Service Bus queue from the **EventProcessor** instances.

1. In the iot-java-get-started folder you created in the [Get started with IoT Hub] tutorial, create a Maven project called **process-interactive-messages** using the following command at your command-prompt. Note this is a single, long command:

    ```
    mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=process-interactive-messages -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
    ```

2. At your command prompt, navigate to the new process-interactive-messages folder.

3. Using a text editor, open the pom.xml file in the process-interactive-messages folder and add the following dependency to the **dependencies** node. This dependency enables you to use the azure-servicebus package in your application to interact with your Service Bus queue:

    ```
    <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-servicebus</artifactId>
      <version>0.9.4</version>
    </dependency>
    ```

4. Save and close the pom.xml file.

The next task is to add code to retrieve messages from the Service Bus queue.

1. Use a text editor to open the process-interactive-messages\src\main\java\com\mycompany\app\App.java file.

2. Add the following `import` statements to the file:

    ```
    import java.io.IOException;
    import java.util.concurrent.ExecutorService;
    import java.util.concurrent.Executors;

    import com.microsoft.windowsazure.Configuration;
    import com.microsoft.windowsazure.exception.ServiceException;
    import com.microsoft.windowsazure.services.servicebus.*;
    import com.microsoft.windowsazure.services.servicebus.models.*;
    ```

3. Add the following class-level variables to the **App** class and replace **{yourservicebusnamespace}** with your Service Bus namespace and **{yourservicebuslistenkey}** with your queue's **listen** key. You previously made a note of namespace and **listen** key values in the [Provision an Azure Storage account and a Service Bus queue](#provision-an-azure-storage-account-and-a-service-bus-queue) section:

    ```
    private final static String serviceBusNamespace = "{yourservicebusnamespace}";
    private final static String serviceBusSasKeyName = "listen";
    private final static String serviceBusSASKey = "{yourservicebuslistenkey}";
    private final static String serviceBusRootUri = ".servicebus.windows.net";
    private final static String queueName = "d2ctutorial";
    private static ServiceBusContract service = null;
    ```

4. Add the following nested class to the **App** class to receive messages from the queue:

    ```
    private static class MessageReceiver implements Runnable {
      public void run() {
        ReceiveMessageOptions opts = ReceiveMessageOptions.DEFAULT;
        try {
          while (true) {
            ReceiveQueueMessageResult resultQM = service.receiveQueueMessage(
                queueName, opts);
            BrokeredMessage message = resultQM.getValue();
            if (message != null && message.getMessageId() != null) {
              System.out.println("MessageID: " + message.getMessageId());
              System.out.print("From queue: ");
              byte[] b = new byte[200];
              String s = null;
              int numRead = message.getBody().read(b);
              while (-1 != numRead) {
                s = new String(b);
                s = s.trim();
                System.out.print(s);
                numRead = message.getBody().read(b);
              }
              System.out.println();
            } else {
              Thread.sleep(1000);
            }
          }
        } catch (InterruptedException e) {
          System.out.println("Finished.");
        } catch (ServiceException e) {
          System.out.println("ServiceException: " + e.getMessage());
        } catch (IOException e) {
          System.out.println("IOException: " + e.getMessage());
        }
      }
    }
    ```

5. Modify the signature of the **main** method as follows:

    ```
    public static void main(String args[]) throws ServiceException, IOException {
    }
    ```

6. In the **main** method, add the following code to start listening for new messages:

    ```
    System.out.println("Process interactive messages");

    Configuration config = ServiceBusConfiguration
        .configureWithSASAuthentication(serviceBusNamespace,
            serviceBusSasKeyName, serviceBusSASKey, serviceBusRootUri);
    service = ServiceBusService.create(config);

    MessageReceiver receiver = new MessageReceiver();

    ExecutorService executor = Executors.newFixedThreadPool(2);
    executor.execute(receiver);

    System.out.println("Press ENTER to exit.");
    System.in.read();
    executor.shutdownNow();
    ```

7. Save and close the process-interactive-messages\src\main\java\com\mycompany\app\App.java file.

8. To build the **process-interactive-messages** application using Maven, execute the following command at the command-prompt in the process-interactive-messages folder:

    ```
    mvn clean package -DskipTests
    ```

## Run the applications

Now you are ready to run the three applications.

1.	To run the **process-interactive-messages** application, in a command prompt or shell navigate to the process-interactive-messages folder and execute the following command:

    ```
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App"
    ```

    ![Run process-interactive-messages][processinteractive]

2.	To run the **process-d2c-messages** application, in a command prompt or shell navigate to the process-d2c-messages folder and execute the following command:

    ```
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App"
    ```

    ![Run process-d2c-messages][processd2c]

3.	To run the **simulated-device** application, in a command prompt or shell navigate to the simulated-device folder and execute the following command:

    ```
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App"
    ```

    ![Run simulated-device][simulateddevice]

> [AZURE.NOTE] To see updates in your blob file, you may need to reduce the **MAX_BLOCK_SIZE** constant in the **StoreEventProcessor** class to a smaller value, such as **1024**. This change is useful because it takes some time to reach the block size limit with the data sent by the simulated device. With a smaller block size, you do not need to wait so long to see the blob being created and updated. However, using a larger block size makes the application more scalable.

## Next steps

In this tutorial, you learned how to reliably process data-point and interactive device-to-cloud messages by using the [EventProcessorHost] class.

The [How to send cloud-to-device messages with IoT Hub][lnk-c2d] shows you how to send messages to your devices from your back end.

To see examples of complete end-to-end solutions that use IoT Hub, see [Azure IoT Suite][lnk-suite].

To learn more about developing solutions with IoT Hub, see the [IoT Hub Developer Guide].

<!-- Images. -->
[simulateddevice]: ./media/iot-hub-java-java-process-d2c/runsimulateddevice.png
[processinteractive]: ./media/iot-hub-java-java-process-d2c/runprocessinteractive.png
[processd2c]: ./media/iot-hub-java-java-process-d2c/runprocessd2c.png

[30]: ./media/iot-hub-java-java-process-d2c/createqueue2.png
[31]: ./media/iot-hub-java-java-process-d2c/createqueue3.png

<!-- Links -->

[Azure Blob storage]: ../storage/storage-dotnet-how-to-use-blobs.md
[Azure Data Factory]: https://azure.microsoft.com/documentation/services/data-factory/
[HDInsight (Hadoop)]: https://azure.microsoft.com/documentation/services/hdinsight/
[Service Bus queue]: ../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md

[Azure IoT Hub developer guide - Device to cloud]: iot-hub-devguide-messaging.md

[Azure Storage]: https://azure.microsoft.com/documentation/services/storage/
[Azure Service Bus]: https://azure.microsoft.com/documentation/services/service-bus/

[IoT Hub Developer Guide]: iot-hub-devguide.md
[Get started with IoT Hub]: iot-hub-java-java-getstarted.md
[Azure IoT Developer Center]: https://azure.microsoft.com/develop/iot
[lnk-service-fabric]: https://azure.microsoft.com/documentation/services/service-fabric/
[lnk-stream-analytics]: https://azure.microsoft.com/documentation/services/stream-analytics/
[lnk-event-hubs]: https://azure.microsoft.com/documentation/services/event-hubs/
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh675232.aspx

<!-- Links -->
[About Azure Storage]: ../storage/storage-create-storage-account.md#create-a-storage-account
[Get Started with Event Hubs]: ../event-hubs/event-hubs-java-ephjava-getstarted.md
[Azure Storage scalability Guidelines]: ../storage/storage-scalability-targets.md
[Azure Block Blobs]: https://msdn.microsoft.com/library/azure/ee691964.aspx
[Event Hubs]: ../event-hubs/event-hubs-overview.md
[EventProcessorHost]: https://github.com/Azure/azure-event-hubs/tree/master/java/azure-eventhubs-eph
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx

[lnk-classic-portal]: https://manage.windowsazure.com
[lnk-c2d]: iot-hub-java-java-process-d2c.md
[lnk-suite]: https://azure.microsoft.com/documentation/suites/iot-suite/

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/get_started/java-devbox-setup.md
[lnk-create-an-iot-hub]: iot-hub-java-java-getstarted.md#create-an-iot-hub