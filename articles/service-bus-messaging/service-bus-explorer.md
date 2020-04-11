---
title: Use Service Bus Explorer to perform data operations on Service Bus (Preview)
description: This article provides information on how to use the portal-based Azure Service Bus Explorer to access Azure Service Bus data. 
services: service-bus-messaging
ms.service: service-bus
documentationcenter: ''
author: axisc

ms.topic: conceptual
ms.date: 03/04/2020
ms.author: aschhab

---

# Use Service Bus Explorer to perform data operations on Service Bus (Preview)

## Overview

Azure Service Bus allows sender and receiver client applications to decouple their business logic with the use of familiar point-to-point (Queue) and publish-subscribe (Topic-Subscription) semantics.

Operations performed on an Azure Service Bus namespace are of two kinds 
   * Management Operations - Create, Update, Delete of Service Bus Namespace, Queues, Topics, and Subscriptions.
   * Data Operations - Send to and Receive Messages from Queues, Topics, and Subscriptions.

The Azure Service Bus Explorer expands the portal functionality beyond the management operations to support data operations (Send, Receive, Peek) on the Queues, Topics, and Subscriptions (and their dead letter subentities) - right from the Azure portal itself.

> [!NOTE]
> This article highlights the functionality of the Azure Service Bus Explorer that lives on the Azure Portal.
>
> The Azure Service Bus explorer tool is ***not*** the community owned OSS tool [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer).
>

## Prerequisites

To use the Service Bus Explorer tool, you will need to provision an Azure Service Bus namespace. 

Once the Service Bus namespace is provisioned, you need to create a Queue to send and receive message from or a Topic with a Subscription to test out the functionality.

To know more about how to create Queues, Topics and Subscriptions, refer to the below links
   * [Quickstart - Create Queues](service-bus-quickstart-portal.md)
   * [Quickstart - Create Topics](service-bus-quickstart-topics-subscriptions-portal.md)


## Using the Service Bus Explorer

To use the Azure Service Bus explorer, you need to navigate to the Service Bus namespace on which you want to perform send, peek and receive operations.

If you are looking to perform operations against a Queue, pick **'Queues'** from the navigation menu. If you are looking to perform operations against a Topic (and it's related subscriptions), pick **Topics**. 

[!div class="mx-imgBorder"]
![Entity select](./media/service-bus-explorer/queue-topics-leftnav.png)

After picking the **'Queues'** or **'Topics'**, pick the specific Queue or Topic.

![QueueSelected](./media/service-bus-explorer/queue-selected.png)

Select the **'Service Bus Explorer (preview)'** from the left navigation menu

![SB Explorer Left nav menu](./media/service-bus-explorer/leftnavmenu-selected.png)

### Sending a Message to a Queue or Topic

To send a message to a **Queue** or a **Topic**, click on the ***Send*** tab on the Service Bus Explorer.

![Send Tab](./media/service-bus-explorer/sendtab-selected.png) 

To compose a message here - 

1. Pick the **Content Type** to be either 'Text/Plain', 'Application/Xml' or 'Application/Json'.
2. Add the message **Content**. Ensure that it matches the **Content Type** set earlier.
3. Set the **Advanced Properties** (optional) - these include Correlation ID, Message ID, Label, ReplyTo, Time to Live (TTL) and Scheduled Enqueue Time (for Scheduled Messages).
4. Set the **Custom Properties** - can be any user properties set against a dictionary key.

Once the message has been composed, hit send.

![Compose Message](./media/service-bus-explorer/send-compose-message.png)

When the send operation is completed successfully, 

1. If sending to the Queue, **Active Messages** metrics counter will increment.

    ![QueueAfterSendMetrics](./media/service-bus-explorer/queue-after-send-metrics.png)
2. If sending to the Topic, **Active Messages** metrics counter will increment on the Subscription where the message was routed to.

    ![TopicAfterSendMetrics](./media/service-bus-explorer/topic-after-send-metrics.png)

### Receiving a Message from a Queue

The receive function on the Service Bus Explorer permits receiving a single message at a time. The receive operation is performed using the ***ReceiveAndDelete** mode.

> [!IMPORTANT]
> Please note that the Receive operation performed by the Service Bus explorer is a ***destructive receive***, i.e. the message is removed from the queue when it is displayed on the Service Bus Explorer tool.
>
> To browse messages without removing them from the queue, consider using the ***Peek*** functionality.
>

To receive a message from a Queue (or its deadletter subqueue), click on the ***Receive*** tab on the Service Bus Explorer.

![ReceiveTab](./media/service-bus-explorer/receive-tab-selected.png)

Check the metrics to see if there are **Active Messages** or **Dead-lettered Messages** to receive.

![QueueAfterSendMetrics](./media/service-bus-explorer/queue-after-send-metrics.png)

Then pick between the ***Queue*** or the ***Deadletter*** subqueue.

![QueueOrDeadletter](./media/service-bus-explorer/queue-or-deadletter.png)

Click the ***Receive*** button, followed by ***Yes*** to confirm the 'Receive and Delete' operation.

When the receive operation is successful, the message details will display on the grid as below.

![ReceiveMessageFromQueue](./media/service-bus-explorer/receive-message-from-queue.png)

To view the message details and the content, click on the message.

![ReceivedMessageDetails](./media/service-bus-explorer/received-message-details.png)

### Peeking a Message from a Queue

With the peek functionality, you can use the Service Bus Explorer to view the top 32 messages on a queue or the deadletter queue.

To peek the message on a queue, click on the ***Peek*** tab on the Service Bus Explorer.

![PeekTab](./media/service-bus-explorer/peek-tab-selected.png)

Check the metrics to see if there are **Active Messages** or **Dead-lettered Messages** to peek.

![QueueAfterSendMetrics](./media/service-bus-explorer/queue-after-send-metrics.png)

Then pick between the ***Queue*** or the ***Deadletter*** subqueue.

![QueueOrDeadletter](./media/service-bus-explorer/queue-or-deadletter.png)

Click the ***Peek*** button to peek up to top 32 messages from the queue. Since peek is not a destructive operation the message will not be removed from the queue.

![PeekMessageFromQueue](./media/service-bus-explorer/peek-message-from-queue.png)

To view the message details and the content, click on the message from the list.
![PeekMessageDetails](./media/service-bus-explorer/peek-message-details.png)

### Receiving a Message from a Subscription

Just like with a queue, the ***Receive*** operation can be performed against a subscription (or its deadletter entity). However, since a Subscription lives within the context of the Topic, the receive operation is performed by navigating to the Service Bus Explorer for a given Topic.

Click on the ***Receive*** tab and select the specific ***Subscription*** from the dropdown selector.

![ReceiveTabSelected](./media/service-bus-explorer/receive-subscription-tab-selected.png)

Then pick between the ***Subscription*** or the ***DeadLetter*** subentity.

![SubscriptionOrDeadletter](./media/service-bus-explorer/subscription-or-deadletter.png)

Click the ***Receive*** button, followed by ***Yes*** to confirm the 'Receive and Delete' operation.

When the receive operation is successful, the message details will display on the grid as below.

![ReceiveMessageFromQueue](./media/service-bus-explorer/receive-message-from-queue.png)

To view the message details and the content, click on the message.

![ReceivedMessageDetails](./media/service-bus-explorer/received-message-details.png)


### Peeking a Message from a Subscription

To simply browse the messages on a Subscription or its deadletter subentity, the ***Peek*** functionality can be utilized on the Subscription as well.

Click on the ***Peek*** tab and select the specific ***Subscription*** from the dropdown selector.

![PeekTabSelected](./media/service-bus-explorer/peek-subscription-tab-selected.png)

Then pick between the ***Subscription*** or the ***DeadLetter*** subentity.

![SubscriptionOrDeadletter](./media/service-bus-explorer/subscription-or-deadletter.png)

Click the ***Peek*** button to receive at most 32 messages. The message details will then display on the grid as below.

![PeekMessageFromSubscription](./media/service-bus-explorer/peek-message-from-subscription.png)

To view the message details and the content, click on the message.

![ReceivedMessageDetails](./media/service-bus-explorer/received-message-details.png)

## Next Steps

   * Learn more about Service Bus [Queues](service-bus-queues-topics-subscriptions.md#queues) and [Topics](service-bus-queues-topics-subscriptions.md#topics-and-subscriptions)
   * Learn more about creating [Service Bus Queues via the Azure Portal](service-bus-quickstart-portal.md)
   * Learn more about creating [Service Bus Topics and Subscriptions via the Azure Portal](service-bus-quickstart-topics-subscriptions-portal.md)