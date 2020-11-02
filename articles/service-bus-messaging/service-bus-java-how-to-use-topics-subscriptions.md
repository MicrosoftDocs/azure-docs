---
title: Use Azure Service Bus topics and subscriptions with Java (azure-messaging-servicebus)
description: In this quickstart, you write Java code using the azure-messaging-servicebus package to send messages to an Azure Service Bus topic and then receive messages from subscriptions to that topic. 
ms.devlang: Java
ms.topic: quickstart
ms.date: 09/15/2020
---

# Azure Service Bus topics and subscriptions - send and receive messages using azure-messaging-servicebus package
In this quickstart, you write Java code using the azure-messaging-servicebus package to send messages to an Azure Service Bus topic and then receive messages from subscriptions to that topic.

> [!IMPORTANT]
> This quickstart uses the new azure-messaging-servicebus package. For a quickstart that uses the old azure-servicebus package, see [Send and receive messages using azure-servicebus](service-bus-java-how-to-use-topics-subscriptions-legacy.md).

## Prerequisites

- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- Follow steps in the [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions to the topic](service-bus-quickstart-topics-subscriptions-portal.md). Note down the connection string, topic name, and a subscription name. You will use only one subscription for this quickstart. 
- [Azure SDK for Java][Azure SDK for Java].

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
import java.util.concurrent.TimeUnit;
```

## Send messages to a topic
To send messages to a Service Bus topic, your application instantiates a **ServiceBusSenderAsyncClient** object and sends messages asynchronously. The following code shows how to send a message to a topic that was created using the Azure portal.

```csharp
public class TopicClient {	
	static String connectionString = "<CONNECTION STRING - SERVICE BUS NAMESPACE>";
    static String topicName = "<TOPIC NAME>";
    
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
        // create a Service Bus Sender client for the topic 
        ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .sender()
                .topicName(topicName)
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
            System.out.println("Sent a batch of messages to the topic: " + topicName);
            
            // create a new batch
            messageBatch = senderClient.createBatch(new CreateBatchOptions().setMaximumSizeInBytes(1024));

            // Add that message that we couldn't before.
            if (!messageBatch.tryAdd(message)) {
                System.err.printf("Message is too large for an empty batch. Skipping. Max size: %s.", messageBatch.getMaxSizeInBytes());
            }
        }

        System.out.println("Sent a batch of messages to the topic: " + topicName);
        senderClient.sendMessages(messageBatch);

        //close the client
        senderClient.close();
    }

    public static void main(String[] args) {
        sendMessages();
    }
```

## Receive messages from a subscription
Add the following code after the `senderClient.close()` method to receive messages from the subscription for the topic.

```csharp
        String subName = "<SUBSCRIPTION NAME>";

        ServiceBusReceiverAsyncClient receiver = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .receiver()
			    .topicName(topicName)                
                .subscriptionName(subName)
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

            // Receiving messages from the subscription for a duration of 20 seconds.
            // Subscribe is not a blocking call so we sleep here so the program does not end.
            TimeUnit.SECONDS.sleep(20);

            // Disposing of the subscription will cancel the receive() operation.
            subscription.dispose();

            // Close the receiver.
            receiver.close();
```

Add the method for processing messages after the `main` method. This method just returns true, but you can add your own code for processing the message. 

```java
	// processes the message. Return true in this example.
    private static boolean processMessage(ServiceBusReceivedMessage message) {
        return true;
    }
```

## Test the application
Run the program to see the output similar to the following output:

```console
Send complete.
Received message with ID: 00000000000000000000000000000000 and body: First message
Received message with ID: 11111111111111111111111111111111 and body: Second message
Processed at 2020-09-15T20:05:56.171576300Z. Completed: 00000000000000000000000000000000
Processed at 2020-09-15T20:05:56.175578900Z. Completed: 111111111111111111111111111111111
Received message with ID: 22222222222222222222222222222222 and body: Thrid message
Processed at 2020-09-15T20:05:56.248572400Z. Completed: 22222222222222222222222222222222
```

In the Azure portal, navigate to your Service Bus namespace, and select the topic in the bottom pane to see the **Service Bus Topic** page for your topic. On this page, you should see three incoming and three outgoing messages in the **Messages** chart. 

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/topic-page-portal.png" alt-text="Incoming and outgoing messages":::

If you add another subscription for the topic in the portal, create another receiver client code to the main method to receive messages from the second subscription, you see output similar to the following output: 

```console
Send complete.
Received message from subscription 1 with ID: 00000000000000000000000000000000 and body: First message
Received message from subscription 1 with ID: 11111111111111111111111111111111 and body: Second message
Processed at 2020-09-15T20:32:37.981590Z. Completed: 00000000000000000000000000000000
Processed at 2020-09-15T20:32:38.088086900Z. Completed: 11111111111111111111111111111111
Received message from subscription 1 with ID: 22222222222222222222222222222222 and body: Third message
Processed at 2020-09-15T20:32:38.176477200Z. Completed: 22222222222222222222222222222222

Received message from subscription 2 with ID: 00000000000000000000000000000000 and body: First message
Received message from subscription 2 with ID: 11111111111111111111111111111111 and body: Second message
Processed at 2020-09-15T20:32:57.988217900Z. Completed: 00000000000000000000000000000000
Processed at 2020-09-15T20:32:58.097232300Z. Completed: 11111111111111111111111111111111
Received message from subscription 2 with ID: 22222222222222222222222222222222 and body: Third message
Processed at 2020-09-15T20:32:58.237667300Z. Completed: 22222222222222222222222222222222
```

On the **Service Bus Topic** page, you see more outgoing messages (6) than the incoming messages (3). On this page, if you select a subscription, you get to the **Service Bus Subscription** page. You can see the active message count, dead-letter message count, and more on this page. 

If you comment out the receive code in the app, you'll see the active message count as shown in the following image. In this example, there are three active messages that aren't received by a receiver yet. 

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/active-message-count.png" alt-text="Active message count":::

## Next steps
For more information, see [Service Bus queues, topics, and subscriptions][Service Bus queues, topics, and subscriptions].

[Azure SDK for Java]: /java/api/overview/azure/
[Azure Toolkit for Eclipse]: /azure/developer/java/toolkit-for-eclipse/installation
[Service Bus queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[SqlFilter]: /dotnet/api/microsoft.azure.servicebus.sqlfilter
[SqlFilter.SqlExpression]: /dotnet/api/microsoft.azure.servicebus.sqlfilter.sqlexpression
[BrokeredMessage]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage

