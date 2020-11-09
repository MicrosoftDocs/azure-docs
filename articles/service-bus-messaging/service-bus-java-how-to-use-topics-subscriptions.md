---
title: Use Azure Service Bus topics and subscriptions with Java (azure-messaging-servicebus)
description: In this quickstart, you write Java code using the azure-messaging-servicebus package to send messages to an Azure Service Bus topic and then receive messages from subscriptions to that topic. 
ms.devlang: Java
ms.topic: quickstart
ms.date: 09/15/2020
---

# Send messages to an Azure Service Bus topic and receive messages from subscriptions to the topic (Java)
In this quickstart, you write Java code using the azure-messaging-servicebus package to send messages to an Azure Service Bus topic and then receive messages from subscriptions to that topic.

> [!IMPORTANT]
> This quickstart uses the new azure-messaging-servicebus package. For a quickstart that uses the old azure-servicebus package, see [Send and receive messages using azure-servicebus](service-bus-java-how-to-use-topics-subscriptions-legacy.md).

## Prerequisites

- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- Follow steps in the [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions to the topic](service-bus-quickstart-topics-subscriptions-portal.md). Note down the connection string, topic name, and a subscription name. You'll use only one subscription for this quickstart. 
- Install [Azure SDK for Java][Azure SDK for Java]. If you're using Eclipse, you can install the [Azure Toolkit for Eclipse][Azure Toolkit for Eclipse] that includes the Azure SDK for Java. You can then add the **Microsoft Azure Libraries for Java** to your project. If you're using IntelliJ, see [Install the Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/installation). 


## Send messages to a topic
In this section, you'll create a Java console project, and add code to send messages to the topic you created. 

### Create a Java console project
Create a Java project using Eclipse or a tool of your choice. 

### Configure your application to use Service Bus
Add a reference to Azure Service Bus library. The Java client library for Service Bus is available in the [Maven Central Repository](https://search.maven.org/search?q=a:azure-messaging-servicebus). You can reference this library using the following dependency declaration inside your Maven project file:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-messaging-servicebus</artifactId>
    <version>7.0.0-beta.7</version>
</dependency>
```

### Add code to send messages to the topic
1. Add the following `import` statements at the topic of the Java file. 

    ```java
    import com.azure.messaging.servicebus.*;
    import com.azure.messaging.servicebus.models.*;
    import java.util.concurrent.TimeUnit;
    import java.util.function.Consumer;
    import java.util.Arrays;
    import java.util.List;
    ```    
5. In the class, define variables to hold connection string and topic name as shown below: 

    ```java
    static String connectionString = "<CONNECTION STRING - SERVICE BUS NAMESPACE>";
    static String topicName = "<TOPIC NAME>";    
    ```

    Replace `<NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace. And, replace `<TOPIC NAME>` with the name of the topic.
3. Add a method named `CreateMessages` in the class to create a list of messages. Typically, you get these messages from different parts of your application. Here, we're simply making a list of messages.

    ```java
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
    ```
1. Add a method named `sendMessages` method to send messages to the topic you created. This method creates a `ServiceBusSenderClient` for the topic, invokes the `createMessages` method to get the list of messages, prepares one or more batches, and sends the batches to the topic. 

```java
    static void sendMessages()
    {
        // create a Service Bus Sender client for the topic 
        ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .sender()
                .topicName(topicName)
                .buildClient();

        // Creates an ServiceBusMessageBatch where the ServiceBus.
        ServiceBusMessageBatch messageBatch = senderClient.createMessageBatch(new CreateMessageBatchOptions().setMaximumSizeInBytes(1024));        
        
    	// create a list of messages
        List<ServiceBusMessage> listOfMessages = createMessages();
        
        // We try to add as many messages as a batch can fit based on the maximum size and send to Service Bus when
        // the batch can hold no more messages. Create a new batch for next set of messages and repeat until all
        // messages are sent.        
        for (ServiceBusMessage message : listOfMessages) {
            if (messageBatch.tryAddMessage(message)) {
                continue;
            }

            // The batch is full, so we create a new batch and send the batch.
            senderClient.sendMessages(messageBatch);
            System.out.println("Sent a batch of messages to the topic: " + topicName);
            
            // create a new batch
            messageBatch = senderClient.createMessageBatch(new CreateMessageBatchOptions().setMaximumSizeInBytes(1024));

            // Add that message that we couldn't before.
            if (!messageBatch.tryAddMessage(message)) {
                System.err.printf("Message is too large for an empty batch. Skipping. Max size: %s.", messageBatch.getMaxSizeInBytes());
            }
        }

        System.out.println("Sent a batch of messages to the topic: " + topicName);
        senderClient.sendMessages(messageBatch);

        //close the client
        senderClient.close();
    }
```

## Receive messages from a subscription to the topic
In this section, you'll add code to retrieve messages from a subscription to the topic. 

1. Add a method named `receiveMessages` to receive messages from the subscription. This method creates a `ServiceBusProcessorClient` for the subscription by specifying a handler for processing messages and another one for handling errors. Then, it starts the processor, waits for few seconds, prints the messages that are received, and then stops and closes the processor.

    ```java
    // handles received messages
    static void receiveMessages() throws InterruptedException
    {
        // Consumer that processes a single message received from Service Bus
        Consumer<ServiceBusReceivedMessageContext> messageProcessor = context -> {
            ServiceBusReceivedMessage message = context.getMessage();
            System.out.println("Received message: " + message.getBody().toString() + " from the subscription: " + subName);
        };

        // Consumer that handles any errors that occur when receiving messages
        Consumer<Throwable> errorHandler = throwable -> {
            System.out.println("Error when receiving messages: " + throwable.getMessage());
            if (throwable instanceof ServiceBusReceiverException) {
                ServiceBusReceiverException serviceBusReceiverException = (ServiceBusReceiverException) throwable;
                System.out.println("Error source: " + serviceBusReceiverException.getErrorSource());
            }
        };

        // Create an instance of the processor through the ServiceBusClientBuilder
        ServiceBusProcessorClient processorClient = new ServiceBusClientBuilder()
            .connectionString(connectionString)
            .processor()
            .topicName(topicName)
            .subscriptionName(subName)
            .processMessage(messageProcessor)
            .processError(errorHandler)
            .buildProcessorClient();

        System.out.println("Starting the processor");
        processorClient.start();

        TimeUnit.SECONDS.sleep(10);
        System.out.println("Stopping and closing the processor");
        processorClient.close();    	
    }
    ```
2. Update the `main` method to invoke both `sendMessages` and `receiveMessages` methods and to throw `InterruptedException`.     

    ```java
    public static void main(String[] args) throws InterruptedException {    	
    	sendMessages();
    	receiveMessages();
    }   
    ```

## Test the application
Run the program to see the output similar to the following output:

```console
Sent a batch of messages to the topic: mytopic
Starting the processor
Received message: First message from the subscription: mysub
Received message: Second message from the subscription: mysub
Received message: Three message from the subscription: mysub
Stopping and closing the processor
```

In the Azure portal, navigate to your Service Bus namespace, and select the topic in the bottom pane to see the **Service Bus Topic** page for your topic. On this page, you should see three incoming and three outgoing messages in the **Messages** chart. 

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/topic-page-portal.png" alt-text="Incoming and outgoing messages":::

If you comment out the receive code and run the app again, on the **Service Bus Topic** page, you see six incoming messages (3 new) but three outgoing messages. 

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/updated-topic-page.png" alt-text="Updated topic page":::

On this page, if you select a subscription, you get to the **Service Bus Subscription** page. You can see the active message count, dead-letter message count, and more on this page. In this example, there are three active messages that aren't received by a receiver yet. 

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/active-message-count.png" alt-text="Active message count":::

## Next steps
For more information, see [Service Bus queues, topics, and subscriptions][Service Bus queues, topics, and subscriptions].

[Azure SDK for Java]: /java/api/overview/azure/
[Azure Toolkit for Eclipse]: /azure/developer/java/toolkit-for-eclipse/installation
[Service Bus queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[SqlFilter]: /dotnet/api/microsoft.azure.servicebus.sqlfilter
[SqlFilter.SqlExpression]: /dotnet/api/microsoft.azure.servicebus.sqlfilter.sqlexpression
[BrokeredMessage]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage

