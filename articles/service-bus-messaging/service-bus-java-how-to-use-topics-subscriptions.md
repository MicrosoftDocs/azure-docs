---
title: How to use Azure Service Bus topics with Java | Microsoft Docs
description: Use Service Bus topics and subscriptions in Azure.
services: service-bus-messaging
documentationcenter: java
author: axisc
manager: timlt
editor: spelluru

ms.assetid: 63d6c8bd-8a22-4292-befc-545ffb52e8eb
ms.service: service-bus-messaging
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: Java
ms.topic: article
ms.date: 04/15/2019
ms.author: aschhab

---
# How to use Service Bus topics and subscriptions with Java

[!INCLUDE [service-bus-selector-topics](../../includes/service-bus-selector-topics.md)]

In this quickstart, you write Java code to send messages to a Service Bus topic and then receive messages from subscriptions to that topic. 

## Prerequisites

1. An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
2. Follow steps in the [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions to the topic](service-bus-quickstart-topics-subscriptions-portal.md) to do the following tasks:
    1. Create a Service Bus **namespace**.
    2. Get the **connection string**.
    3. Create a **topic** in the namespace.
    4. Create **three subscriptions** to the topic in the namespace.
3. [Azure SDK for Java][Azure SDK for Java].

## Configure your application to use Service Bus
Make sure you have installed the [Azure SDK for Java][Azure SDK for Java] before building this sample. If you are using Eclipse, you can install the [Azure Toolkit for Eclipse][Azure Toolkit for Eclipse] that includes the Azure SDK for Java. You can then add the **Microsoft Azure Libraries for Java** to your project:

![Libraries in Eclipse Build Path](media/service-bus-java-how-to-use-topics-subscriptions/eclipselibs.png)

You also need to add the following JARs to the Java Build Path:

- gson-2.6.2.jar
- commons-cli-1.4.jar
- proton-j-0.21.0.jar

Add a class with a **Main** method, and then add the following `import` statements at the top of the Java file:

```java
import com.google.gson.reflect.TypeToken;
import com.microsoft.azure.servicebus.*;
import com.microsoft.azure.servicebus.primitives.ConnectionStringBuilder;
import com.google.gson.Gson;
import static java.nio.charset.StandardCharsets.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.Function;
import org.apache.commons.cli.*;
import org.apache.commons.cli.DefaultParser;
```

## Send messages to a topic
Update the **main** method to create a **TopicClient** object, and invoke a helper method that asynchronously sends sample messages to the Service Bus topic.

> [!NOTE] 
> - Replace `<NameOfServiceBusNamespace>` with the name of your Service Bus namespace. 
> - Replace `<AccessKey>` with the access key for your namespace.

```java
public class MyServiceBusTopicClient {

    static final Gson GSON = new Gson();
    
	public static void main(String[] args) throws Exception, ServiceBusException {
		// TODO Auto-generated method stub

		TopicClient sendClient;
		String connectionString = "Endpoint=sb://<NameOfServiceBusNamespace>.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<AccessKey>";
        sendClient = new TopicClient(new ConnectionStringBuilder(connectionString, "BasicTopic"));       
        sendMessagesAsync(sendClient).thenRunAsync(() -> sendClient.closeAsync());
	}

    static CompletableFuture<Void> sendMessagesAsync(TopicClient sendClient) {
        List<HashMap<String, String>> data =
                GSON.fromJson(
                        "[" +
                                "{'name' = 'Einstein', 'firstName' = 'Albert'}," +
                                "{'name' = 'Heisenberg', 'firstName' = 'Werner'}," +
                                "{'name' = 'Curie', 'firstName' = 'Marie'}," +
                                "{'name' = 'Hawking', 'firstName' = 'Steven'}," +
                                "{'name' = 'Newton', 'firstName' = 'Isaac'}," +
                                "{'name' = 'Bohr', 'firstName' = 'Niels'}," +
                                "{'name' = 'Faraday', 'firstName' = 'Michael'}," +
                                "{'name' = 'Galilei', 'firstName' = 'Galileo'}," +
                                "{'name' = 'Kepler', 'firstName' = 'Johannes'}," +
                                "{'name' = 'Kopernikus', 'firstName' = 'Nikolaus'}" +
                                "]",
                        new TypeToken<List<HashMap<String, String>>>() {
                        }.getType());

        List<CompletableFuture> tasks = new ArrayList<>();
        for (int i = 0; i < data.size(); i++) {
            final String messageId = Integer.toString(i);
            Message message = new Message(GSON.toJson(data.get(i), Map.class).getBytes(UTF_8));
            message.setContentType("application/json");
            message.setLabel("Scientist");
            message.setMessageId(messageId);
            message.setTimeToLive(Duration.ofMinutes(2));
            System.out.printf("Message sending: Id = %s\n", message.getMessageId());
            tasks.add(
                    sendClient.sendAsync(message).thenRunAsync(() -> {
                        System.out.printf("\tMessage acknowledged: Id = %s\n", message.getMessageId());
                    }));
        }
        return CompletableFuture.allOf(tasks.toArray(new CompletableFuture<?>[tasks.size()]));
    }
}
```

Service Bus topics support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). The header, which includes the standard and custom application properties, can have a maximum size of 64 KB. There is no limit on the number of messages held in a topic but there is a limit on the total size of the messages
held by a topic. This topic size is defined at creation time, with an upper limit of 5 GB.

## How to receive messages from a subscription
Update the **main** method to create three **SubscriptionClient** objects for three subscriptions, and invoke a helper method that asynchronously receives messages from the Service Bus topic. The sample code assumes that you created a topic named **BasicTopic** and three subscriptions named **Subscription1**, **Subscription2**, and **Subscription3**. If you used different names for them, update the code before testing it. 

```java
public class MyServiceBusTopicClient {

    static final Gson GSON = new Gson();
    
	public static void main(String[] args) throws Exception, ServiceBusException {
        SubscriptionClient subscription1Client = new SubscriptionClient(new ConnectionStringBuilder(connectionString, "BasicTopic/subscriptions/Subscription1"), ReceiveMode.PEEKLOCK);
        SubscriptionClient subscription2Client = new SubscriptionClient(new ConnectionStringBuilder(connectionString, "BasicTopic/subscriptions/Subscription2"), ReceiveMode.PEEKLOCK);
        SubscriptionClient subscription3Client = new SubscriptionClient(new ConnectionStringBuilder(connectionString, "BasicTopic/subscriptions/Subscription3"), ReceiveMode.PEEKLOCK);        

        registerMessageHandlerOnClient(subscription1Client);
        registerMessageHandlerOnClient(subscription2Client);
        registerMessageHandlerOnClient(subscription3Client);
	}
	
    static void registerMessageHandlerOnClient(SubscriptionClient receiveClient) throws Exception {

        // register the RegisterMessageHandler callback
    	IMessageHandler messageHandler = new IMessageHandler() {
            // callback invoked when the message handler loop has obtained a message
            public CompletableFuture<Void> onMessageAsync(IMessage message) {
                // receives message is passed to callback
                if (message.getLabel() != null &&
                        message.getContentType() != null &&
                        message.getLabel().contentEquals("Scientist") &&
                        message.getContentType().contentEquals("application/json")) {

                    byte[] body = message.getBody();
                    Map scientist = GSON.fromJson(new String(body, UTF_8), Map.class);

                    System.out.printf(
                            "\n\t\t\t\t%s Message received: \n\t\t\t\t\t\tMessageId = %s, \n\t\t\t\t\t\tSequenceNumber = %s, \n\t\t\t\t\t\tEnqueuedTimeUtc = %s," +
                                    "\n\t\t\t\t\t\tExpiresAtUtc = %s, \n\t\t\t\t\t\tContentType = \"%s\",  \n\t\t\t\t\t\tContent: [ firstName = %s, name = %s ]\n",
                            receiveClient.getEntityPath(),
                            message.getMessageId(),
                            message.getSequenceNumber(),
                            message.getEnqueuedTimeUtc(),
                            message.getExpiresAtUtc(),
                            message.getContentType(),
                            scientist != null ? scientist.get("firstName") : "",
                            scientist != null ? scientist.get("name") : "");
                }
                return receiveClient.completeAsync(message.getLockToken());
            }
            
            public void notifyException(Throwable throwable, ExceptionPhase exceptionPhase) {
                System.out.printf(exceptionPhase + "-" + throwable.getMessage());
            }
        };

 
        receiveClient.registerMessageHandler(
        			messageHandler,
                    // callback invoked when the message handler has an exception to report
                // 1 concurrent call, messages are auto-completed, auto-renew duration
                new MessageHandlerOptions(1, false, Duration.ofMinutes(1)));

    }
}
```

## Run the program
Run the program to see the output similar to the following output:

```java
Message sending: Id = 0
Message sending: Id = 1
Message sending: Id = 2
Message sending: Id = 3
Message sending: Id = 4
Message sending: Id = 5
Message sending: Id = 6
Message sending: Id = 7
Message sending: Id = 8
Message sending: Id = 9
	Message acknowledged: Id = 0
	Message acknowledged: Id = 9
	Message acknowledged: Id = 7
	Message acknowledged: Id = 8
	Message acknowledged: Id = 5
	Message acknowledged: Id = 6
	Message acknowledged: Id = 3
	Message acknowledged: Id = 2
	Message acknowledged: Id = 4
	Message acknowledged: Id = 1

				BasicTopic/subscriptions/Subscription1 Message received: 
						MessageId = 0, 
						SequenceNumber = 11, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.442Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.442Z, 
						ContentType = "application/json",  
						Content: [ firstName = Albert, name = Einstein ]

				BasicTopic/subscriptions/Subscription2 Message received: 
						MessageId = 0, 
						SequenceNumber = 11, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.442Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.442Z, 
						ContentType = "application/json",  
						Content: [ firstName = Albert, name = Einstein ]

				BasicTopic/subscriptions/Subscription1 Message received: 
						MessageId = 9, 
						SequenceNumber = 12, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Nikolaus, name = Kopernikus ]

				BasicTopic/subscriptions/Subscription1 Message received: 
						MessageId = 8, 
						SequenceNumber = 13, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Johannes, name = Kepler ]

				BasicTopic/subscriptions/Subscription3 Message received: 
						MessageId = 0, 
						SequenceNumber = 11, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.442Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.442Z, 
						ContentType = "application/json",  
						Content: [ firstName = Albert, name = Einstein ]

				BasicTopic/subscriptions/Subscription2 Message received: 
						MessageId = 9, 
						SequenceNumber = 12, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Nikolaus, name = Kopernikus ]

				BasicTopic/subscriptions/Subscription1 Message received: 
						MessageId = 7, 
						SequenceNumber = 14, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Galileo, name = Galilei ]

				BasicTopic/subscriptions/Subscription3 Message received: 
						MessageId = 9, 
						SequenceNumber = 12, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Nikolaus, name = Kopernikus ]

				BasicTopic/subscriptions/Subscription2 Message received: 
						MessageId = 8, 
						SequenceNumber = 13, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Johannes, name = Kepler ]

				BasicTopic/subscriptions/Subscription1 Message received: 
						MessageId = 6, 
						SequenceNumber = 15, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Michael, name = Faraday ]

				BasicTopic/subscriptions/Subscription3 Message received: 
						MessageId = 8, 
						SequenceNumber = 13, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Johannes, name = Kepler ]

				BasicTopic/subscriptions/Subscription2 Message received: 
						MessageId = 7, 
						SequenceNumber = 14, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Galileo, name = Galilei ]

				BasicTopic/subscriptions/Subscription1 Message received: 
						MessageId = 5, 
						SequenceNumber = 16, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Niels, name = Bohr ]

				BasicTopic/subscriptions/Subscription3 Message received: 
						MessageId = 7, 
						SequenceNumber = 14, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Galileo, name = Galilei ]

				BasicTopic/subscriptions/Subscription2 Message received: 
						MessageId = 6, 
						SequenceNumber = 15, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Michael, name = Faraday ]

				BasicTopic/subscriptions/Subscription1 Message received: 
						MessageId = 4, 
						SequenceNumber = 17, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Isaac, name = Newton ]

				BasicTopic/subscriptions/Subscription3 Message received: 
						MessageId = 6, 
						SequenceNumber = 15, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Michael, name = Faraday ]

				BasicTopic/subscriptions/Subscription2 Message received: 
						MessageId = 5, 
						SequenceNumber = 16, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Niels, name = Bohr ]

				BasicTopic/subscriptions/Subscription1 Message received: 
						MessageId = 3, 
						SequenceNumber = 18, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Steven, name = Hawking ]

				BasicTopic/subscriptions/Subscription3 Message received: 
						MessageId = 5, 
						SequenceNumber = 16, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Niels, name = Bohr ]

				BasicTopic/subscriptions/Subscription2 Message received: 
						MessageId = 4, 
						SequenceNumber = 17, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Isaac, name = Newton ]

				BasicTopic/subscriptions/Subscription1 Message received: 
						MessageId = 2, 
						SequenceNumber = 19, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Marie, name = Curie ]

				BasicTopic/subscriptions/Subscription3 Message received: 
						MessageId = 4, 
						SequenceNumber = 17, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Isaac, name = Newton ]

				BasicTopic/subscriptions/Subscription2 Message received: 
						MessageId = 3, 
						SequenceNumber = 18, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Steven, name = Hawking ]

				BasicTopic/subscriptions/Subscription1 Message received: 
						MessageId = 1, 
						SequenceNumber = 20, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Werner, name = Heisenberg ]

				BasicTopic/subscriptions/Subscription2 Message received: 
						MessageId = 2, 
						SequenceNumber = 19, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Marie, name = Curie ]

				BasicTopic/subscriptions/Subscription3 Message received: 
						MessageId = 3, 
						SequenceNumber = 18, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Steven, name = Hawking ]

				BasicTopic/subscriptions/Subscription3 Message received: 
						MessageId = 2, 
						SequenceNumber = 19, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Marie, name = Curie ]

				BasicTopic/subscriptions/Subscription2 Message received: 
						MessageId = 1, 
						SequenceNumber = 20, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Werner, name = Heisenberg ]

				BasicTopic/subscriptions/Subscription3 Message received: 
						MessageId = 1, 
						SequenceNumber = 20, 
						EnqueuedTimeUtc = 2018-10-29T18:58:12.520Z,
						ExpiresAtUtc = 2018-10-29T19:00:12.520Z, 
						ContentType = "application/json",  
						Content: [ firstName = Werner, name = Heisenberg ]
```

> [!NOTE]
> You can manage Service Bus resources with [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/). The Service Bus Explorer allows users to connect to a Service Bus namespace and administer messaging entities in an easy manner. The tool provides advanced features like import/export functionality or the ability to test topic, queues, subscriptions, relay services, notification hubs and events hubs. 

## Next steps
For more information, see [Service Bus queues, topics, and subscriptions][Service Bus queues, topics, and subscriptions].

[Azure SDK for Java]: https://docs.microsoft.com/java/api/overview/azure/
[Azure Toolkit for Eclipse]: https://docs.microsoft.com/java/azure/eclipse/azure-toolkit-for-eclipse
[Service Bus queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[SqlFilter]: /dotnet/api/microsoft.azure.servicebus.sqlfilter
[SqlFilter.SqlExpression]: /dotnet/api/microsoft.azure.servicebus.sqlfilter.sqlexpression
[BrokeredMessage]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage

[0]: ./media/service-bus-java-how-to-use-topics-subscriptions/sb-queues-13.png
[2]: ./media/service-bus-java-how-to-use-topics-subscriptions/sb-queues-04.png
[3]: ./media/service-bus-java-how-to-use-topics-subscriptions/sb-queues-09.png
