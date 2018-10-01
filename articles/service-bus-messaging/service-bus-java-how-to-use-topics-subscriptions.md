---
title: How to use Azure Service Bus topics with Java | Microsoft Docs
description: Use Service Bus topics and subscriptions in Azure.
services: service-bus-messaging
documentationcenter: java
author: spelluru
manager: timlt
editor: ''

ms.assetid: 63d6c8bd-8a22-4292-befc-545ffb52e8eb
ms.service: service-bus-messaging
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: Java
ms.topic: article
ms.date: 09/17/2018
ms.author: spelluru

---
# How to use Service Bus topics and subscriptions with Java

[!INCLUDE [service-bus-selector-topics](../../includes/service-bus-selector-topics.md)]

This guide describes how to use Service Bus topics and subscriptions. The samples are written in Java and use the [Azure SDK for Java][Azure SDK for Java]. The scenarios covered include **creating topics and subscriptions**, **creating subscription filters**, **sending messages to a topic**, **receiving messages from a subscription**, and **deleting topics and subscriptions**.

## What are Service Bus topics and subscriptions?
Service Bus topics and subscriptions support a *publish/subscribe*
messaging communication model. When using topics and subscriptions,
components of a distributed application do not communicate directly with
each other; instead they exchange messages via a topic, which acts as an
intermediary.

![TopicConcepts](./media/service-bus-java-how-to-use-topics-subscriptions/sb-topics-01.png)

In contrast with Service Bus queues, in which each message is processed by a
single consumer, topics and subscriptions provide a one-to-many form
of communication, using a publish/subscribe pattern. It is possible to
register multiple subscriptions to a topic. When a message is sent to a
topic, it is then made available to each subscription to handle/process
independently.

A subscription to a topic resembles a virtual queue that receives copies of
the messages that were sent to the topic. You can optionally register
filter rules for a topic on a per-subscription basis, which allows you
to filter or restrict which messages to a topic are received by which topic
subscriptions.

Service Bus topics and subscriptions enable you to scale to process a
large number of messages across a large number of users and
applications.

## Create a service namespace
To begin using Service Bus topics and subscriptions in Azure,
you must first create a *namespace*, which provides
a scoping container for addressing Service Bus resources within your
application.

To create a namespace:

[!INCLUDE [service-bus-create-namespace-portal](../../includes/service-bus-create-namespace-portal.md)]

## Configure your application to use Service Bus
Make sure you have installed the [Azure SDK for Java][Azure SDK for Java] before building this sample. If you are using Eclipse, you can install the [Azure Toolkit for Eclipse][Azure Toolkit for Eclipse] that includes the Azure SDK for Java. You can then add the **Microsoft Azure Libraries for Java** to your project:

![](media/service-bus-java-how-to-use-topics-subscriptions/eclipselibs.png)

Add the following `import` statements to the top of the Java file:

```java
import com.microsoft.windowsazure.services.servicebus.*;
import com.microsoft.windowsazure.services.servicebus.models.*;
import com.microsoft.windowsazure.core.*;
import javax.xml.datatype.*;
```

Add the Azure Libraries for Java to your build path and include it in your project deployment assembly.

## Create a topic
Management operations for Service Bus topics can be performed via the
**ServiceBusContract** class. A **ServiceBusContract** object is
constructed with an appropriate configuration that encapsulates the
SAS token with permissions to manage it, and the **ServiceBusContract** class is
the sole point of communication with Azure.

The **ServiceBusService** class provides methods to create, enumerate,
and delete topics. The following example shows how a **ServiceBusService** object
can be used to create a topic named `TestTopic`, with a namespace called `HowToSample`:

```java
Configuration config =
    ServiceBusConfiguration.configureWithSASAuthentication(
      "HowToSample",
      "RootManageSharedAccessKey",
      "SAS_key_value",
      ".servicebus.windows.net"
      );

ServiceBusContract service = ServiceBusService.create(config);
TopicInfo topicInfo = new TopicInfo("TestTopic");
try  
{
    CreateTopicResult result = service.createTopic(topicInfo);
}
catch (ServiceException e) {
    System.out.print("ServiceException encountered: ");
    System.out.println(e.getMessage());
    System.exit(-1);
}
```

There are methods on **TopicInfo** that enable properties of the topic to
be set (for example: to set the default time-to-live (TTL) value to be
applied to messages sent to the topic). The following example shows how
to create a topic named `TestTopic` with a maximum size of 5 GB:

```java
long maxSizeInMegabytes = 5120;  
TopicInfo topicInfo = new TopicInfo("TestTopic");  
topicInfo.setMaxSizeInMegabytes(maxSizeInMegabytes);
CreateTopicResult result = service.createTopic(topicInfo);
```

You can use the **listTopics** method on
**ServiceBusContract** objects to check if a topic with a specified name
already exists within a service namespace.

## Create subscriptions
Subscriptions to topics are also created with the **ServiceBusService**
class. Subscriptions are named and can have an optional filter that
restricts the set of messages passed to the subscription's virtual
queue.

### Create a subscription with the default (MatchAll) filter
If no filter is specified when a new subscription is created, the **MatchAll** filter is the default filter that is used. When the **MatchAll** filter is used, all messages published to the topic are placed in the subscription's virtual queue. The following example creates a subscription named `AllMessages` and uses the default `MatchAll` filter.

```java
SubscriptionInfo subInfo = new SubscriptionInfo("AllMessages");
CreateSubscriptionResult result =
    service.createSubscription("TestTopic", subInfo);
```

### Create subscriptions with filters
You can also create filters that enable you to scope which messages sent
to a topic should show up within a specific topic subscription.

The most flexible type of filter supported by subscriptions is the
[SqlFilter][SqlFilter], which implements a subset of SQL92. SQL filters operate
on the properties of the messages that are published to the topic. For
more details about the expressions that can be used with a SQL filter,
review the [SqlFilter.SqlExpression][SqlFilter.SqlExpression] syntax.

The following example creates a subscription named `HighMessages` with a
[SqlFilter][SqlFilter] object that only selects messages that have a custom
**MessageNumber** property greater than 3:

```java
// Create a "HighMessages" filtered subscription  
SubscriptionInfo subInfo = new SubscriptionInfo("HighMessages");
CreateSubscriptionResult result = service.createSubscription("TestTopic", subInfo);
RuleInfo ruleInfo = new RuleInfo("myRuleGT3");
ruleInfo = ruleInfo.withSqlExpressionFilter("MessageNumber > 3");
CreateRuleResult ruleResult = service.createRule("TestTopic", "HighMessages", ruleInfo);
// Delete the default rule, otherwise the new rule won't be invoked.
service.deleteRule("TestTopic", "HighMessages", "$Default");
```

Similarly, the following example creates a subscription named `LowMessages` with a [SqlFilter][SqlFilter] object that only selects messages that have a **MessageNumber** property less than or equal to 3:

```java
// Create a "LowMessages" filtered subscription
SubscriptionInfo subInfo = new SubscriptionInfo("LowMessages");
CreateSubscriptionResult result = service.createSubscription("TestTopic", subInfo);
RuleInfo ruleInfo = new RuleInfo("myRuleLE3");
ruleInfo = ruleInfo.withSqlExpressionFilter("MessageNumber <= 3");
CreateRuleResult ruleResult = service.createRule("TestTopic", "LowMessages", ruleInfo);
// Delete the default rule, otherwise the new rule won't be invoked.
service.deleteRule("TestTopic", "LowMessages", "$Default");
```

When a message is now sent to `TestTopic`, it is always delivered to receivers subscribed to the `AllMessages` subscription, and selectively delivered to receivers subscribed to the `HighMessages` and `LowMessages` subscriptions (depending upon the message content).

## Send messages to a topic
To send a message to a Service Bus topic, your application obtains a
**ServiceBusContract** object. The following code demonstrates how to send a
message for the `TestTopic` topic created previously within the `HowToSample` namespace:

```java
BrokeredMessage message = new BrokeredMessage("MyMessage");
service.sendTopicMessage("TestTopic", message);
```

Messages sent to Service Bus Topics are instances of the
[BrokeredMessage][BrokeredMessage] class. [BrokeredMessage][BrokeredMessage]* objects have a set of
standard methods (such as **setLabel** and **TimeToLive**), a dictionary
that is used to hold custom application-specific properties, and a body
of arbitrary application data. An application can set the body of the
message by passing any serializable object into the constructor of the
[BrokeredMessage][BrokeredMessage], and the appropriate **DataContractSerializer** is then used to serialize the object. Alternatively, a
**java.io.InputStream** can be provided.

The following example demonstrates how to send five test messages to the
`TestTopic` **MessageSender** we obtained in the previous code snippet.
Note how the **MessageNumber** property value of each message varies on
the iteration of the loop (this value determines which subscriptions receive it):

```java
for (int i=0; i<5; i++)  {
// Create message, passing a string message for the body
BrokeredMessage message = new BrokeredMessage("Test message " + i);
// Set some additional custom app-specific property
message.setProperty("MessageNumber", i);
// Send message to the topic
service.sendTopicMessage("TestTopic", message);
}
```

Service Bus topics support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). The header, which includes the standard and custom application properties, can have
a maximum size of 64 KB. There is no limit on the number of messages
held in a topic but there is a limit on the total size of the messages
held by a topic. This topic size is defined at creation time, with an
upper limit of 5 GB.

## How to receive messages from a subscription
To receive messages from a subscription, use a
**ServiceBusContract** object. Received messages can work in two
different modes: **ReceiveAndDelete** and **PeekLock** (the default).

When using the **ReceiveAndDelete** mode, receive is a single-shot
operation - that is, when Service Bus receives a read request for a
message, it marks the message as being consumed and returns it to the
application. **ReceiveAndDelete** mode is the simplest model and works
best for scenarios in which an application can tolerate not processing a
message if a failure occurs. For example, consider a
scenario in which the consumer issues the receive request and then
crashes before processing it. Because Service Bus has marked the
message as being consumed, then when the application restarts and begins
consuming messages again, it has missed the message that was
consumed prior to the crash.

In **PeekLock** mode, receive becomes a two stage operation, which makes
it possible to support applications that cannot tolerate missing
messages. When Service Bus receives a request, it finds the next message
to be consumed, locks it to prevent other consumers receiving it, and
then returns it to the application. After the application finishes
processing the message (or stores it reliably for future processing), it
completes the second stage of the receive process by calling **Delete**
on the received message. When Service Bus sees the **Delete** call, it
marks the message as being consumed and removes it from the topic.

The following example demonstrates how messages can be received and
processed using **PeekLock** (the default mode). The example
performs a loop and processes messages in the `HighMessages` subscription and then exits when there are no more messages (alternatively, it can be set to wait for new messages).

```java
try
{
    ReceiveMessageOptions opts = ReceiveMessageOptions.DEFAULT;
    opts.setReceiveMode(ReceiveMode.PEEK_LOCK);

    while(true)  {
        ReceiveSubscriptionMessageResult  resultSubMsg =
            service.receiveSubscriptionMessage("TestTopic", "HighMessages", opts);
        BrokeredMessage message = resultSubMsg.getValue();
        if (message != null && message.getMessageId() != null)
        {
            System.out.println("MessageID: " + message.getMessageId());
            // Display the topic message.
            System.out.print("From topic: ");
            byte[] b = new byte[200];
            String s = null;
            int numRead = message.getBody().read(b);
            while (-1 != numRead)
            {
                s = new String(b);
                s = s.trim();
                System.out.print(s);
                numRead = message.getBody().read(b);
            }
            System.out.println();
            System.out.println("Custom Property: " +
                message.getProperty("MessageNumber"));
            // Delete message.
            System.out.println("Deleting this message.");
            service.deleteMessage(message);
        }  
        else  
        {
            System.out.println("Finishing up - no more messages.");
            break;
            // Added to handle no more messages.
            // Could instead wait for more messages to be added.
        }
    }
}
catch (ServiceException e) {
    System.out.print("ServiceException encountered: ");
    System.out.println(e.getMessage());
    System.exit(-1);
}
catch (Exception e) {
    System.out.print("Generic exception encountered: ");
    System.out.println(e.getMessage());
    System.exit(-1);
}
```

## How to handle application crashes and unreadable messages
Service Bus provides functionality to help you gracefully recover from
errors in your application or difficulties processing a message. If a
receiver application is unable to process the message for some reason,
then it can call the **unlockMessage** method on the received message
(instead of the **deleteMessage** method). This method call causes Service Bus
to unlock the message within the topic and make it available to be
received again, either by the same consuming application or by another
consuming application.

There is also a timeout associated with a message locked within the
topic, and if the application fails to process the message before the
lock timeout expires (for example, if the application crashes), then Service
Bus unlocks the message automatically and makes it available to be
received again.

In the event that the application crashes after processing the message
but before the **deleteMessage** request is issued, then the message
is redelivered to the application when it restarts. This process is often
called **at least once processing**, that is, each message is processed at least once but in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then application developers should add additional logic to their application to handle duplicate message delivery. You can do so by using the **getMessageId** method of the message, which remains
constant across delivery attempts.

## Delete topics and subscriptions
The primary way to delete topics and subscriptions is to use a
**ServiceBusContract** object. Deleting a topic also deletes any subscriptions that are registered
with the topic. Subscriptions can also be deleted independently.

```java
// Delete subscriptions
service.deleteSubscription("TestTopic", "AllMessages");
service.deleteSubscription("TestTopic", "HighMessages");
service.deleteSubscription("TestTopic", "LowMessages");

// Delete a topic
service.deleteTopic("TestTopic");
```

## Next Steps
For more information, see [Service Bus queues, topics, and subscriptions][Service Bus queues, topics, and subscriptions] for more information.

[Azure SDK for Java]: http://azure.microsoft.com/develop/java/
[Azure Toolkit for Eclipse]: ../azure-toolkit-for-eclipse.md
[Service Bus queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[SqlFilter]: /dotnet/api/microsoft.azure.servicebus.sqlfilter
[SqlFilter.SqlExpression]: /dotnet/api/microsoft.azure.servicebus.sqlfilter.sqlexpression
[BrokeredMessage]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage

[0]: ./media/service-bus-java-how-to-use-topics-subscriptions/sb-queues-13.png
[2]: ./media/service-bus-java-how-to-use-topics-subscriptions/sb-queues-04.png
[3]: ./media/service-bus-java-how-to-use-topics-subscriptions/sb-queues-09.png
