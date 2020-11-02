---
title: Use Azure Service Bus queues with Java (azure-messaging-servicebus)
description: In this tutorial, you learn how to create Java applications to send messages to and receive messages from an Azure Service Bus queue using the azure-messaging-servicebus package. 
ms.devlang: Java
ms.topic: quickstart
ms.date: 06/23/2020
ms.custom: seo-java-july2019, seo-java-august2019, seo-java-september2019, devx-track-java
---

# Azure Service Bus queues - send and receive messages using azure-messaging-servicebus package
In this tutorial, you learn how to create Java applications to send messages to and receive messages from an Azure Service Bus queue using the azure-messaging-servicebus package. 

> [!IMPORTANT]
> This quickstart uses the new azure-messaging-servicebus package. For a quickstart that uses the old azure-servicebus package, see [Send and receive messages using azure-servicebus](service-bus-java-how-to-use-queues-legacy.md).

## Prerequisites
- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue. Note down the **connection string** for your Service Bus namespace and the name of the **queue** you created.
- Install [Azure SDK for Java][Azure SDK for Java]. 

## Create a Java project 
Create a Java project using Eclipse or a tool of your choice. 

## Configure your application to use Service Bus
Make sure you've installed the [Azure SDK for Java][Azure SDK for Java] before building this sample. 

If you're using Eclipse, you can install the [Azure Toolkit for Eclipse][Azure Toolkit for Eclipse] that includes the Azure SDK for Java. You can then add the **Microsoft Azure Libraries for Java** to your project. If you're using IntelliJ, see [Install the Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/installation). 


## Add a reference to Azure Service Bus library
The Java client library for Service Bus is available in the [Maven Central Repository](https://search.maven.org/search?q=a:azure-messaging-servicebus). You can reference this library using the following dependency declaration inside your Maven project file:

```xml
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-messaging-servicebus</artifactId>
      <version>7.0.0-beta.4</version>
    </dependency>
```

## Add the import statements
Add the following `import` statements at the topic of the Java file. 

```java
import com.azure.messaging.servicebus.*;
import com.azure.messaging.servicebus.models.*;
import reactor.core.Disposable;
import java.time.Instant;
import java.util.concurrent.TimeUnit;
```

## Send messages to a queue
To send messages to a Service Bus Queue, your application instantiates a **ServiceBusSenderAsyncClient** object and sends messages asynchronously. The following code shows how to send a message to a queue that was created using the Azure portal.

```java
public class QueueClient {
	
	static String connectionString = "<CONNECTION STRING - SERVICE BUS NAMESPACE>";
    static String queueName = "<QUEUE NAME>";
    
    static List<ServiceBusMessage> createMessages()
    {
        // create a list of messages and return it to the caller
        ServiceBusMessage[] messages = {
            new ServiceBusMessage("First message"),
            new ServiceBusMessage("Second message"),
            new ServiceBusMessage("Three message")
        };
        return Arrays.asList(messages);
    }
    
    static void sendMessages()
    {
        // create a Service Bus Sender client for the queue 
        ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .sender()
                .queueName(queueName)
                .buildClient();

        // Creates an ServiceBusMessageBatch where the ServiceBus.
        ServiceBusMessageBatch messageBatch = senderClient.createBatch(new CreateBatchOptions().setMaximumSizeInBytes(1024));        
        
        // create a list of messages
        List<ServiceBusMessage> listOfMessages = createMessages();
        
        // We try to add as many messages as a batch can fit based on the maximum size and send to Service Bus when
        // the batch can hold no more messages. Create a new batch for next set of messages and repeat until all
        // messages are sent.        
        for (ServiceBusMessage message : listOfMessages) {
            if (messageBatch.tryAdd(message)) {
                continue;
            }

            // The batch is full, so we create a new batch and send the batch.
            senderClient.sendMessages(messageBatch);
            System.out.println("Sent a batch of messages to the queue: " + queueName);
            
            // create a new batch
            messageBatch = senderClient.createBatch(new CreateBatchOptions().setMaximumSizeInBytes(1024));

            // Add that message that we couldn't before.
            if (!messageBatch.tryAdd(message)) {
                System.err.printf("Message is too large for an empty batch. Skipping. Max size: %s.", messageBatch.getMaxSizeInBytes());
            }
        }

        System.out.println("Sent a batch of messages to the queue: " + queueName);
        senderClient.sendMessages(messageBatch);

        //close the client
        senderClient.close();
    }

    public static void main(String[] args) {
        sendMessages();
    }
```

## Receive messages from a queue
Add the following code after the `senderClient.close()` method to receive messages from the queue.

```java
        ServiceBusReceiverAsyncClient receiver = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .receiver()
                .queueName(queueName)
                .buildAsyncClient();
        
        Disposable subscription = receiver.receiveMessages()
                .flatMap(context -> {
                    ServiceBusReceivedMessage message = context.getMessage();

                    // print ID and body of the received message
                    System.out.println("Received message with ID: " + message.getMessageId() + " and body: " + new String(message.getBody()));

                    // process the received message
                    boolean isSuccessfullyProcessed = processMessage(message);

                    // When we are finished processing the message, then complete or abandon it.
                    if (isSuccessfullyProcessed) {
                        return receiver.complete(message).thenReturn("Completed: " + message.getMessageId());
                    } else {
                        return receiver.abandon(message).thenReturn("Abandoned: " + message.getMessageId());
                    }
                })
                .subscribe(message -> System.out.printf("Processed at %s. %s%n", Instant.now(), message),
                    error -> System.err.println("Error occurred while receiving message: " + error),
                    () -> System.out.println("Receiving complete."));

            // Receiving messages from the queue for a duration of 20 seconds.
            // Subscribe is not a blocking call so we sleep here so the program does not end.
            TimeUnit.SECONDS.sleep(20);

            // Disposing of the subscription will cancel the receive() operation.
            subscription.dispose();

            // Close the receiver.
            receiver.close();
```

Add the method for processing messages after the `main` method. This method just returns true, but you can add your own code for processing the message. 

```java
	// Processes the message. Returns true in this example.
    private static boolean processMessage(ServiceBusReceivedMessage message) {
        return true;
    }
```

## Test the application
When you run the application, you see the following messages in the console window. 

```console
Send complete.
Received message with ID: 000000000000000000000000000000000 and body: First message
Received message with ID: 111111111111111111111111111111111 and body: Second message
Processed at 2020-09-15T20:05:56.171576300Z. Completed: 000000000000000000000000000000000
Processed at 2020-09-15T20:05:56.175578900Z. Completed: 111111111111111111111111111111111
Received message with ID: 22222222222222222222222222222 and body: Thrid message
Processed at 2020-09-15T20:05:56.248572400Z. Completed: 22222222222222222222222222222
```

On the **Overview** page for the Service Bus namespace in the Azure portal, you see **incoming** and **outgoing** message count. You may need to wait for a minute or so and then refresh the page to see the latest values. 

:::image type="content" source="./media/service-bus-java-how-to-use-queues/overview-incoming-outgoing-messages.png" alt-text="Incoming and outgoing message count":::

You can select the queue on this **Overview** page to navigate to the **Service Bus Queue** page. You see the **incoming** and **outgoing** message count, and also other information such as the **current size** of the queue, **maximum size**, **active message count**, and so on. 

:::image type="content" source="./media/service-bus-java-how-to-use-queues/queue-details.png" alt-text="Queue details":::

In this example, there are three active messages in the queue that haven't been received and completed yet. The size of the queue is 0.5 KB. There are nine incoming messages and six outgoing messages. Other three messages haven't been received by a receiver yet. 


## Next Steps
See [more samples on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/servicebus/azure-messaging-servicebus). 

[Azure SDK for Java]: /azure/developer/java/sdk/java-sdk-azure-get-started
[Azure Toolkit for Eclipse]: /azure/developer/java/toolkit-for-eclipse/installation
[Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[BrokeredMessage]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage
