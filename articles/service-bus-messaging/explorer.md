---
title: Use Azure Service Bus Explorer to run data operations
description: This article provides information on how to use the portal-based Azure Service Bus Explorer to access Azure Service Bus data.
ms.topic: how-to
ms.date: 12/11/2024
ms.author: egrootenboer
---

# Use Service Bus Explorer to run data operations on Service Bus
Azure Service Bus allows sender and receiver client applications to decouple their business logic with the use of familiar point-to-point (Queue) and publish-subscribe (Topic-Subscription) semantics. 

> [!NOTE]
> This article highlights the functionality of the Azure Service Bus Explorer that's part of the Azure portal.
>
> The community owned [open source Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer) is a standalone application and is different from this one.

Operations run on an Azure Service Bus namespace are of two kinds. 

   * **Management operations** - Create, update, delete of Service Bus namespace, queues, topics, and subscriptions.
   * **Data operations** - Send to and receive messages from queues, topics, and subscriptions.

> [!IMPORTANT]
> - Service Bus Explorer doesn't support **management operations** and **sessions**. 
> - We advice against using the Service Bus Explorer for larger messages, as it may result in time-outs, depending on the message size, network latency between client and Service Bus service etc. Instead, we recommend that you use your own client to work with larger messages, where you can specify your own time-out values.
> - If your Service Bus namespace can only be accessed via a private endpoint, you must run your web browser on a host in the virtual network with the private endpoint, and also ensure that there are no network security gateways (NSGs) in the way.


## Prerequisites

To use the Service Bus Explorer tool, you need to do the following tasks: 

- [Create an Azure Service Bus namespace](service-bus-quickstart-portal.md#create-a-namespace-in-the-azure-portal).
- Create a queue to send and receive message from or a topic with a subscription to test out the functionality. To learn how to create queues, topics, and subscriptions, see the following articles: 
    - [Quickstart - Create queues](service-bus-quickstart-portal.md)
    - [Quickstart - Create topics](service-bus-quickstart-topics-subscriptions-portal.md)

    > [!NOTE]
    > Ensure that you're a member of one of these roles on the namespace or the entities you want to execute send or receive (including peek and purge) operations on: 
    > - [Service Bus Data Owner](../role-based-access-control/built-in-roles.md#azure-service-bus-data-owner); Allows both send and receive operations.
    > - [Service Bus Data Sender](../role-based-access-control/built-in-roles.md#azure-service-bus-data-sender); Allows send operations.
    > - [Service Bus Data Receiver](../role-based-access-control/built-in-roles.md#azure-service-bus-data-receiver); Allows receive operations.

## Use the Service Bus Explorer

To use the Service Bus Explorer, navigate to the Service Bus namespace on which you want to do data operations.

1. If you're looking to run operations against a queue, select **Queues** from the navigation menu. If you're looking to run operations against a topic (and its related subscriptions), select **Topics**. 

    :::image type="content" source="./media/service-bus-explorer/queue-topics-left-navigation.png" alt-text="Screenshot of left side navigation, where entity can be selected." lightbox="./media/service-bus-explorer/queue-topics-left-navigation.png":::
1. After selecting **Queues** or **Topics**, select the specific queue or topic.

    :::image type="content" source="./media/service-bus-explorer/select-specific-queue.png" alt-text="Screenshot of the Queues page with a specific queue selected." lightbox="./media/service-bus-explorer/select-specific-queue.png":::
1. Select the **Service Bus Explorer** from the left navigation menu

    :::image type="content" source="./media/service-bus-explorer/left-navigation-menu-selected.png" alt-text="Screenshot of queue page where Service Bus Explorer can be selected." lightbox="./media/service-bus-explorer/left-navigation-menu-selected.png":::

    > [!NOTE]
    > When peeking or receiving from a subscription, first select the specific **Subscription** from the dropdown selector.
    > :::image type="content" source="./media/service-bus-explorer/subscription-selected.png" alt-text="Screenshot of dropdown for topic subscriptions." lightbox="./media/service-bus-explorer/subscription-selected.png":::

   > [!NOTE]
   > When you navigate to Service Bus explorer for an entity in a namespace that has the public access disabled, you see the following message even though you access it from a virtual machine that's in the same virtual network as the private endpoint. You can ignore it.
   >
   > "The namespace has public network access disabled. Data operations such as Peek, Send, or Receive against this Service Bus entit don't work until you switch to all networks or allowlist your client IP in selected networks."

## Peek a message

With the peek functionality, you can use the Service Bus Explorer to view the top 100 messages in a queue, subscription, or dead-letter queue.

1. To peek messages, select **Peek Mode** in the Service Bus Explorer dropdown.

    :::image type="content" source="./media/service-bus-explorer/peek-mode-selected.png" alt-text="Screenshot of dropdown with Peek Mode selected." lightbox="./media/service-bus-explorer/peek-mode-selected.png":::

1. Check the metrics to see if there are **Active Messages** or **Dead-lettered Messages** to peek and select either **Queue / Subscription** or **DeadLetter** subqueue.

    :::image type="content" source="./media/service-bus-explorer/queue-after-send-metrics.png" alt-text="Screenshot of queue and dead-letter subqueue tabs with message metrics displayed." lightbox="./media/service-bus-explorer/queue-after-send-metrics.png":::

1. Select the **Peek from start** button. 

    :::image type="content" source="./media/service-bus-explorer/queue-peek-from-start.png" alt-text="Screenshot indicating the Peek from start button." lightbox="./media/service-bus-explorer/queue-peek-from-start.png":::

1. Once the peek operation completes, up to 100 messages show up on the grid as shown in the following image. To view the details of a particular message, select it from the grid. You can choose to view the body or the message properties.

    :::image type="content" source="./media/service-bus-explorer/peek-message-from-queue.png" alt-text="Screenshot with overview of peeked messages and message body content shown for peeked messages." lightbox="./media/service-bus-explorer/peek-message-from-queue.png":::

    Switch to the **Message Properties** tab in the bottom pane to see the metadata. 

    :::image type="content" source="./media/service-bus-explorer/peek-message-from-queue-2.png" alt-text="Screenshot with overview of peeked messages and message properties shown for peeked messages." lightbox="./media/service-bus-explorer/peek-message-from-queue-2.png":::

    > [!NOTE]
    > Since peek isn't a destructive operation the message **won't** be removed from the entity.

    > [!NOTE]
    > For performance reasons, when peeking messages from a queue or subscription which has its maximum message size set over 1 MB, the message body isn't retrieved by default. Instead, you can load the message body for a specific message by clicking on the **Load message body** button. If the message body is over 1 MB, it's not truncated before being displayed.
    > :::image type="content" source="./media/service-bus-explorer/peek-message-from-queue-with-large-message-support.png" alt-text="Screenshot with overview of peeked messages and button to load message body shown." lightbox="./media/service-bus-explorer/peek-message-from-queue-with-large-message-support.png":::

### Peek a message with advanced options

The peek with options functionality allows you to use the Service Bus Explorer to view the top messages in a queue, subscription or the dead-letter queue, specifying the number of messages to peek, and the sequence number to start the peek operation.

1. To peek messages with advanced options, select **Peek Mode** in the Service Bus Explorer dropdown.

    :::image type="content" source="./media/service-bus-explorer/peek-mode-selected.png" alt-text="Screenshot of dropdown with Peek Mode selected for peek with advanced options." lightbox="./media/service-bus-explorer/peek-mode-selected.png":::

1. Check the metrics to see if there are **Active Messages** or **Dead-lettered Messages** to peek and select either **Queue / Subscription** or **DeadLetter** subqueue.

    :::image type="content" source="./media/service-bus-explorer/queue-after-send-metrics.png" alt-text="Screenshot of queue and dead-letter subqueue tabs with message metrics displayed for peek with advanced options." lightbox="./media/service-bus-explorer/queue-after-send-metrics.png":::

1. Select the **Peek with options** button. Provide the number of messages to peek, and the sequence number to start peeking from, and select the **Peek** button. 

    :::image type="content" source="./media/service-bus-explorer/queue-peek-with-options.png" alt-text="Screenshot indicating the Peek with options button, and a page where the options can be set." lightbox="./media/service-bus-explorer/queue-peek-with-options.png":::

1. Once the peek operation completes, the messages show up on the grid as shown in the following image. To view the details of a particular message, select it from the grid. You can choose to view the body or the message properties.

    :::image type="content" source="./media/service-bus-explorer/peek-message-from-queue-3.png" alt-text="Screenshot with overview of peeked messages and message body content shown for peek with advanced options." lightbox="./media/service-bus-explorer/peek-message-from-queue-3.png":::

    Switch to the **Message Properties** tab in the bottom pane to see the metadata.
    
    :::image type="content" source="./media/service-bus-explorer/peek-message-from-queue-4.png" alt-text="Screenshot with overview of peeked messages and message properties shown for peek with advanced options." lightbox="./media/service-bus-explorer/peek-message-from-queue-4.png":::

    > [!NOTE]
    > Since peek isn't a destructive operation the message **won't** be removed from the queue.

## Receive a message

The receive function on the Service Bus Explorer permits receiving messages from a queue or subscription.

1. To receive messages, select **Receive Mode** in the Service Bus Explorer dropdown.

    :::image type="content" source="./media/service-bus-explorer/receive-mode-selected.png" alt-text="Screenshot of dropdown with Receive Mode selected." lightbox="./media/service-bus-explorer/receive-mode-selected.png":::

1. Check the metrics to see if there are **Active Messages** or **Dead-lettered Messages** to receive, and select either **Queue / Subscription** or **DeadLetter**.

    :::image type="content" source="./media/service-bus-explorer/queue-after-send-metrics-2.png" alt-text="Screenshot of queue and dead-letter subqueue tabs with message metrics displayed for receive mode." lightbox="./media/service-bus-explorer/queue-after-send-metrics-2.png":::

1. Select the **Receive messages** button, and specify the receive mode, the number of messages to receive, and the maximum time to wait for a message and select **Receive**.

    :::image type="content" source="./media/service-bus-explorer/receive-message-from-queue.png" alt-text="Screenshot indicating the Receive button, and a page where the options can be set." lightbox="./media/service-bus-explorer/receive-message-from-queue.png":::

    > [!IMPORTANT]
    > The ReceiveAndDelete mode is a ***destructive receive***, that is, the message is removed from the queue when it's displayed on the Service Bus Explorer tool.
    >
    > To browse messages without removing them from the queue, consider using the **Peek** functionality, or using the **PeekLock** receive mode.

1. Once the receive operation completes, the messages show up on the grid as shown in the following image. To view the details of a particular message, select it in the grid. 

    :::image type="content" source="./media/service-bus-explorer/receive-message-from-queue-2.png" alt-text="Screenshot with overview of received messages and message body content shown." lightbox="./media/service-bus-explorer/receive-message-from-queue-2.png":::

    :::image type="content" source="./media/service-bus-explorer/receive-message-from-queue-3.png" alt-text="Screenshot with overview of received messages and message properties shown." lightbox="./media/service-bus-explorer/receive-message-from-queue-3.png":::

    > [!NOTE]
    > For performance reasons, when receiving messages from a queue or subscription which has its maximum message size set over 1 MB, only one message is received at a time. If the message body is over 1 MB, it's truncated before being displayed.

After a message is received in **PeekLock** mode, there are various actions you can take on it.

> [!NOTE]
> You can only take these actions as long as you have a lock on the message.

### Complete a message

1. In the grid, select the received messages you want to complete.
1. Select the **Complete** button.

    :::image type="content" source="./media/service-bus-explorer/receive-message-from-queue-complete.png" alt-text="Screenshot indicating the Complete button." lightbox="./media/service-bus-explorer/receive-message-from-queue-complete.png":::

    > [!IMPORTANT]
    > Completing a message is a ***destructive receive***, that is, the message is removed from the queue when **Complete** has been selected in the Service Bus Explorer tool.

### Defer a message

1. In the grid, select one or more received messages you want to [defer](./message-deferral.md).
1. Select the **Defer** button.

    :::image type="content" source="./media/service-bus-explorer/receive-message-from-queue-defer.png" alt-text="Screenshot indicating the Defer button." lightbox="./media/service-bus-explorer/receive-message-from-queue-defer.png":::

### Abandon lock

1. In the grid, select one or more received messages for which you want to abandon the lock.
1. Select the **Abandon lock** button.

    :::image type="content" source="./media/service-bus-explorer/receive-message-from-queue-abandon-lock.png" alt-text="Screenshot indicating the Abandon Lock button." lightbox="./media/service-bus-explorer/receive-message-from-queue-abandon-lock.png":::

After the lock is abandoned, the message is available for receive operations again.

### Dead-letter

1. In the grid, select one or more received messages you want to [dead-letter](./service-bus-dead-letter-queues.md).
1. Select the **Dead-letter** button.

    :::image type="content" source="./media/service-bus-explorer/receive-message-from-queue-dead-letter.png" alt-text="Screenshot indicating the Dead-letter button." lightbox="./media/service-bus-explorer/receive-message-from-queue-dead-letter.png":::

After a message is dead-lettered, it's available from the **Dead-letter** subqueue.

### Purge messages

To Purge messages, select the **Purge messages** button of Service Bus explorer. 
 
 :::image type="content" source="./media/service-bus-explorer/purge-messages.png" alt-text="Screenshot indicating the purge messages button." lightbox="./media/service-bus-explorer/purge-messages.png":::

Once you enter 'purge' to confirm on the operation, messages would be purged from respective service bus entity. 

## Send a message to a queue or topic

To send a message to a **queue** or a **topic**, select the **Send messages** button of the Service Bus Explorer.

1. Select the **Content Type** to be either **Text/Plain**, **Application/Xml** or **Application/Json**.
1. For **Message body**, add the message content. Ensure that it matches the **Content Type** set earlier.
1. Set the **Broker properties** (optional). These properties include Correlation ID, Message ID, ReplyTo, Label/Subject, Time to Live (TTL) and Scheduled Enqueue Time (for Scheduled Messages).
1. Set the **Custom Properties** (optional). These properties can be any user properties set against a dictionary key.
1. Check **Repeat send** to send the same message multiple times. If no Message ID was set, it's automatically populated with sequential values.
1. Once the message is composed, select the **Send** button.

    :::image type="content" source="./media/service-bus-explorer/send-experience.png" alt-text="Screenshot showing the compose message experience." lightbox="./media/service-bus-explorer/send-experience.png":::

1. When the send operation is completed successfully, one of the following changes happens: 

    - If sending to a queue, **Active Messages** metrics counter is incremented.
    - If sending to a topic, **Active Messages** metrics counter is incremented on the subscriptions where the message was routed to.  

## Resend a message

After peeking or receiving a message, you can resend it, which sends a copy of the message to the same entity, while allowing us to update it's content and properties. The original remains and isn't deleted even when resend is from the deadletter queue.

1. In the grid, select one or more messages you want to resend.
1. Select the **Re-send selected messages** button.

    :::image type="content" source="./media/service-bus-explorer/queue-select-messages-for-resend.png" alt-text="Screenshot indicating the Resend selected messages button." lightbox="./media/service-bus-explorer/queue-select-messages-for-resend.png":::

1. Optionally, select any message for which you want to update its details and make the desired changes.
1. Select the **Send** button to send the messages to the entity.

    :::image type="content" source="./media/service-bus-explorer/queue-resend-selected-messages.png" alt-text="Screenshot showing the resend messages experience." lightbox="./media/service-bus-explorer/queue-resend-selected-messages.png":::
    
    > [!NOTE] 
    > - The resend operation sends a copy of the original message. It doesn't remove the original message that you resubmit. 
    > - If you resend a message in a dead-letter queue of a subscription, a copy of the message is sent to the topic. Therefore, all subscriptions receive a copy of the message. 

## Switch authentication type

When working with Service Bus Explorer, it's possible to use either **Access Key** or **Microsoft Entra ID** authentication.

1. Select the **Settings** button.

    :::image type="content" source="./media/service-bus-explorer/select-settings.png" alt-text="Screenshot indicating the Settings button in Service Bus Explorer." lightbox="./media/service-bus-explorer/select-settings.png":::
1. Choose the desired authentication method, and select the **Save** button.

    :::image type="content" source="./media/service-bus-explorer/queue-select-authentication-type.png" alt-text="Screenshot indicating the Settings button and a page showing the different authentication types." lightbox="./media/service-bus-explorer/queue-select-authentication-type.png":::

## Next Steps

   * Learn more about Service Bus [Queues](service-bus-queues-topics-subscriptions.md#queues) and [Topics](service-bus-queues-topics-subscriptions.md#topics-and-subscriptions)
   * Learn more about creating [Service Bus Queues via the Azure portal](service-bus-quickstart-portal.md)
   * Learn more about creating [Service Bus Topics and Subscriptions via the Azure portal](service-bus-quickstart-topics-subscriptions-portal.md)
