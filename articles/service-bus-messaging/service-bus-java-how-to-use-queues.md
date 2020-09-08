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
1. An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
2. If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue.
    1. Read the quick **overview** of Service Bus **queues**. 
    2. Create a Service Bus **namespace**. 
    3. Get the **connection string**.
    4. Create a Service Bus **queue**.
3. Install [Azure SDK for Java][Azure SDK for Java]. 

## Create a Java project 
Create a Java project using Eclipse or a tool of your choice. 

## Configure your application to use Service Bus
Make sure you have installed the [Azure SDK for Java][Azure SDK for Java] before building this sample. 

If you are using Eclipse, you can install the [Azure Toolkit for Eclipse][Azure Toolkit for Eclipse] that includes the Azure SDK for Java. You can then add the **Microsoft Azure Libraries for Java** to your project. If you are using IntelliJ, see [Install the Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/installation). 

![Add Microsoft Azure Libraries for Java to your Eclipse project](./media/service-bus-java-how-to-use-queues/eclipse-azure-libraries-java.png)


## Add a reference to Azure Service Bus library
The Java client library for Service Bus is available in the [Maven Central Repository](https://search.maven.org/search?q=a:azure-messaging-servicebus). You can reference this library using the following dependency declaration inside your Maven project file:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-messaging-servicebus</artifactId>
    <version>7.0.0</version>
</dependency>
```

## Add the import statements
Add the following `import` statements at the topic of the Java file. 

```java
import com.azure.core.util.IterableStream;
import com.azure.messaging.servicebus.*;
import com.azure.messaging.servicebus.models.*;

import reactor.core.Disposable;
import reactor.core.publisher.Mono;

import static java.nio.charset.StandardCharsets.UTF_8;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.TimeUnit;
```

## Send messages to a queue
To send messages to a Service Bus Queue, your application instantiates a **ServiceBusSenderAsyncClient** object and sends messages asynchronously. The following code shows how to send a message to a queue that was created using the Azure portal.

```java
public class QueueClient {

    public static void main(String[] args) throws InterruptedException {

        String connectionString = "<NAMESPACE CONNECTION STRING>";
        String queueName = "<QUEUE NAME>";

        // create a Service Bus Sender client for the queue 
        ServiceBusSenderAsyncClient senderClient = new ServiceBusClientBuilder()
            .connectionString(connectionString)
            .sender()
            .queueName(queueName)
            .buildAsyncClient();
	
        // Creates a batch of Service Bus messages
        ServiceBusMessageBatch currentBatch = senderClient.createBatch(new CreateBatchOptions().setMaximumSizeInBytes(1024)).block();
        currentBatch.tryAdd(new ServiceBusMessage("First message"));
        currentBatch.tryAdd(new ServiceBusMessage("Second message"));
        currentBatch.tryAdd(new ServiceBusMessage("Thrid message"));
       
        // send the batch of messages
        senderClient.sendMessages(currentBatch).subscribe(
                unused -> System.out.println("Sent a bath of three messages to the queue:" + queueName),
                error -> System.err.println("Error occurred while publishing message: " + error),
                () -> System.out.println("Send complete."));        
      
        // subscribe() is not a blocking call. We sleep here so the program does not end before the send is complete.
        TimeUnit.SECONDS.sleep(5);

        //close the client
        senderClient.close();        
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
                    ServiceBusReceivedMessage messageReceived = context.getMessage();

                    // print the message
                    System.out.println("Received Message: " + new String(messageReceived.getBody()));

                    // process the messages. just returns true in this example
                    boolean isSuccessfullyProcessed = processMessage(messageReceived);

                    // When we are finished processing the message, then complete or abandon it.
                    if (isSuccessfullyProcessed) {
                        return receiver.complete(messageReceived.getLockToken());
                    } else {
                        return receiver.abandon(messageReceived.getLockToken());
                    }
                })
                .subscribe(messageReturned -> System.out.println(messageReturned),
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

Add the method for processing messages. This method just returns true, but you can add your own code for processing the message. 

```java
	// Processes the message. Returns true in this example.
    private static boolean processMessage(ServiceBusReceivedMessage message) {
        return true;
    }
```

## Next Steps
Now that you've learned the basics of Service Bus queues, see [Queues, topics, and subscriptions][Queues, topics, and subscriptions] for more information.

For more information, see the [Java Developer Center](https://azure.microsoft.com/develop/java/).

[Azure SDK for Java]: /azure/developer/java/sdk/java-sdk-azure-get-started
[Azure Toolkit for Eclipse]: /azure/developer/java/toolkit-for-eclipse/installation
[Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[BrokeredMessage]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage