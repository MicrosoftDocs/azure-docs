---
title: Use Azure Service Bus Explorer to run data operations on Service Bus (Preview)
description: This article provides information on how to use the portal-based Azure Service Bus Explorer to access Azure Service Bus data. 
ms.topic: how-to
ms.date: 12/02/2021
ms.custom: contperf-fy22q2
---

# Use Service Bus Explorer to run data operations on Service Bus (Preview)
Azure Service Bus allows sender and receiver client applications to decouple their business logic with the use of familiar point-to-point (Queue) and publish-subscribe (Topic-Subscription) semantics. 

> [!NOTE]
> This article highlights the functionality of the Azure Service Bus Explorer that's part of the Azure portal.
>
> The community owned [open source Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer) is a standalone application and is different from this one, which is part of the Azure portal. 

Operations run on an Azure Service Bus namespace are of two kinds 

   * **Management operations** - Create, update, delete of Service Bus namespace, queues, topics, and subscriptions.
   * **Data operations** - Send to and receive messages from queues, topics, and subscriptions.

> [!IMPORTANT]
> Service Bus Explorer doesn't support **sessions**. 


## Prerequisites

To use the Service Bus Explorer tool, you'll need to do the following tasks: 

- [Create an Azure Service Bus namespace](service-bus-create-namespace-portal.md).
- Create a queue to send and receive message from or a topic with a subscription to test out the functionality. To learn how to create queues, topics, and subscriptions, see the following articles: 
    - [Quickstart - Create queues](service-bus-quickstart-portal.md)
    - [Quickstart - Create topics](service-bus-quickstart-topics-subscriptions-portal.md)


    > [!NOTE]
    > If it's not the namespace you created, ensure that you're a member of one of these roles on the namespace: 
    > - [Service Bus Data Owner](../role-based-access-control/built-in-roles.md#azure-service-bus-data-owner) 
    > - [Contributor](../role-based-access-control/built-in-roles.md#contributor) 
    > - [Owner](../role-based-access-control/built-in-roles.md#owner)


## Using the Service Bus Explorer

To use the Service Bus Explorer, navigate to the Service Bus namespace on which you want to do send, peek, and receive operations.


1. If you're looking to run operations against a queue, select **Queues** from the navigation menu. If you're looking to run operations against a topic (and it's related subscriptions), select **Topics**. 

    :::image type="content" source="./media/service-bus-explorer/queue-topics-left-navigation.png" alt-text="Entity select":::
2. After selecting **Queues** or **Topics**, select the specific queue or topic.
1. Select the **Service Bus Explorer (preview)** from the left navigation menu

    :::image type="content" source="./media/service-bus-explorer/left-navigation-menu-selected.png" alt-text="SB Explorer Left nav menu":::

    > [!NOTE]
    > Service Bus Explorer supports messages of size up to 1 MB. 

### Sending a message to a queue or topic

To send a message to a **queue** or a **topic**, select the **Send** tab of the Service Bus Explorer.

To compose a message here - 

1. Select the **Content Type** to be either **Text/Plain**, **Application/Xml** or **Application/Json**.
2. For **Content**, add the message content. Ensure that it matches the **Content Type** set earlier.
3. Set the **Advanced Properties** (optional) - these include Correlation ID, Message ID, Label, ReplyTo, Time to Live (TTL) and Scheduled Enqueue Time (for Scheduled Messages).
4. Set the **Custom Properties** - can be any user properties set against a dictionary key.
1. Once the message has been composed, select **Send**.

    :::image type="content" source="./media/service-bus-explorer/send-experience.png" alt-text="Compose Message":::
1. When the send operation is completed successfully, do one of the following actions: 

    - If sending to the queue, **Active Messages** metrics counter will increment.

        :::image type="content" source="./media/service-bus-explorer/queue-after-send-metrics.png" alt-text="QueueAfterSendMetrics":::
    - If sending to the topic, **Active Messages** metrics counter will increment on the Subscription where the message was routed to.

        :::image type="content" source="./media/service-bus-explorer/topic-after-send-metrics.png" alt-text="TopicAfterSendMetrics":::

### Receiving a message from a Queue

The receive function on the Service Bus Explorer permits receiving a single message at a time. The receive operation is performed using the **ReceiveAndDelete** mode.

> [!IMPORTANT]
> Please note that the receive operation performed by the Service Bus explorer is a *destructive receive*, i.e. the message is removed from the queue when it is displayed on the Service Bus Explorer tool.
>
> To browse messages without removing them from the queue, consider using the ***Peek*** functionality.
>

To receive a message from a Queue (or its DeadLetter subqueue) 

1. Click on the ***Receive*** tab on the Service Bus Explorer.
2. Check the metrics to see if there are **Active Messages** or **Dead-lettered Messages** to receive.

    :::image type="content" source="./media/service-bus-explorer/queue-after-send-metrics.png" alt-text="QueueAfterSendMetrics":::

3. Select either **Queue** or **DeadLetter**.

    :::image type="content" source="./media/service-bus-explorer/queue-or-deadletter.png" alt-text="QueueOrDeadLetter":::

4. Select **Receive** button, followed by **Yes** to confirm the operation.
1. When the receive operation is successful, the message details will display on the grid as below. You can select the message from the grid to display its details.

    :::image type="content" source="./media/service-bus-explorer/receive-message-from-queue-2.png" alt-text="Screenshot of the Queues window in Service Bus Explorer with message details.":::


### Peeking a message from a Queue

With the peek functionality, you can use the Service Bus Explorer to view the top 32 messages in a queue or the dead-letter queue.

1. To peek messages in a queue, select the ***Peek*** tab in the Service Bus Explorer.

    :::image type="content" source="./media/service-bus-explorer/peek-tab-selected.png" alt-text="PeekTab":::
2. Check the metrics to see if there are **Active Messages** or **Dead-lettered Messages** to peek.

    :::image type="content" source="./media/service-bus-explorer/queue-after-send-metrics.png" alt-text="QueueAfterSendMetrics":::
3. Then select either **Queue** or **DeadLetter** subqueue.

    :::image type="content" source="./media/service-bus-explorer/queue-or-deadletter.png" alt-text="QueueOrDeadLetter":::
4. Select ***Peek***. 
1. Once the peek operation completes, up to 32 messages will show up on the grid as below. To view the details of a particular message, select it from the grid. 

    :::image type="content" source="./media/service-bus-explorer/peek-message-from-queue-2.png" alt-text="PeekMessageFromQueue":::

    > [!NOTE]
    > Since peek is not a destructive operation the message **won't** be removed from the queue.
    

### Receiving a message from a Subscription

Just like with a queue, the **Receive** operation can be performed against a subscription (or its dead-letter entity). 

> [!IMPORTANT]
> Please note that the receive operation performed by the Service Bus explorer is a ***destructive receive***, that is, the message is removed from the queue when it's displayed in the Service Bus Explorer tool.
>
> To browse messages without removing them from the queue, use the **Peek** functionality.
>

1. Select the ***Receive*** tab, and select the specific **Subscription** from the dropdown selector.

    :::image type="content" source="./media/service-bus-explorer/receive-subscription-tab-selected.png" alt-text="ReceiveTabSelected":::
2. Select either **Subscription** or **DeadLetter** subentity.

    :::image type="content" source="./media/service-bus-explorer/subscription-or-deadletter.png" alt-text="SubscriptionOrDeadLetter":::
3. Select **Receive**, and then select **Yes** to confirm the receive and delete operation.
1. When the receive operation is successful, the received message will display on the grid as below. To view the message details, select the message.

    :::image type="content" source="./media/service-bus-explorer/receive-message-from-subscription.png" alt-text="Screenshot of the Receive tab in Service Bus Explorer with message details.":::

### Peeking a message from a Subscription

To browse messages on a subscription or its deadLetter subentity, the **Peek** functionality can be utilized on the subscription as well.

1. Click on the **Peek** tab and select the specific **Subscription** from the dropdown selector.

    :::image type="content" source="./media/service-bus-explorer/peek-subscription-tab-selected.png" alt-text="PeekTabSelected":::
2. Pick between the **Subscription** or the **DeadLetter** subentity.

    :::image type="content" source="./media/service-bus-explorer/subscription-or-deadletter.png" alt-text="SubscriptionOrDeadLetter":::
3. Select **Peek** button.
1. Once the peek operation completes, up to 32 messages will show up on the grid as below. To view the details of a particular message, select it in the grid. 

    :::image type="content" source="./media/service-bus-explorer/peek-message-from-subscription.png" alt-text="PeekMessageFromSubscription":::

    > [!NOTE]
    >
    > - Since peek is not a destructive operation the message **will not** be removed from the queue.
    

## Next Steps

   * Learn more about Service Bus [Queues](service-bus-queues-topics-subscriptions.md#queues) and [Topics](service-bus-queues-topics-subscriptions.md#topics-and-subscriptions)
   * Learn more about creating [Service Bus Queues via the Azure portal](service-bus-quickstart-portal.md)
   * Learn more about creating [Service Bus Topics and Subscriptions via the Azure portal](service-bus-quickstart-topics-subscriptions-portal.md)
