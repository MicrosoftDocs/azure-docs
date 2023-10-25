---
title: Azure Service Bus - suspend messaging entities
description: This article explains how to temporarily suspend and reactivate Azure Service Bus message entities (queues, topics, and subscriptions).
ms.topic: article
ms.date: 09/06/2022 
---

# Suspend and reactivate messaging entities (disable)

Queues, topics, and subscriptions can be temporarily suspended. Suspension puts the entity into a disabled state in which all messages are maintained in storage. However, messages can't be removed or added, and the respective protocol operations yield errors.

You may want to suspend an entity for urgent administrative reasons. For example, a faulty receiver takes messages off the queue, fails processing, and yet incorrectly completes the messages and removes them. In this case, you may want to disable the queue for receives until you correct and deploy the code. 

A suspension or reactivation can be performed either by the user or by the system. The system only suspends entities because of grave administrative reasons such as hitting the subscription spending limit. System-disabled entities can't be reactivated by the user, but are restored when the cause of the suspension has been addressed.

## Queue status 
The states that can be set for a **queue** are:

-   **Active**: The queue is active. You can send messages to and receive messages from the queue. 
-   **Disabled**: The queue is suspended. It's equivalent to setting both **SendDisabled** and **ReceiveDisabled**. 
-   **SendDisabled**: You can't send messages to the queue, but you can receive messages from it. You'll get an exception if you try to send messages to the queue. 
-   **ReceiveDisabled**: You can send messages to the queue, but you can't receive messages from it. You'll get an exception if you try to receive messages from the queue.


### Change the queue status in the Azure portal: 

1. In the Azure portal, navigate to your Service Bus namespace. 
1. Select the queue for which you want to change the status. You see queues in the bottom pane in the middle. 
1. On the **Service Bus Queue** page, see the current status of the queue as a hyperlink. If the **Overview** isn't selected on the left menu, select it to see the status of the queue. Select the current status of the queue to change it. 

    :::image type="content" source="./media/entity-suspend/select-state.png" alt-text="Select state of the queue":::
4. Select the new status for the queue, and select **OK**. 

    :::image type="content" source="./media/entity-suspend/entity-state-change.png" alt-text="Set state of the queue":::
    
You can also disable the send and receive operations using an Azure Resource Manager template through Azure CLI or Azure PowerShell.

### Change the queue status using Azure PowerShell
The PowerShell command to disable a queue is shown in the following example. The reactivation command is equivalent, setting `Status` to **Active**.

```powershell
$q = Get-AzServiceBusQueue -ResourceGroup mygrp -NamespaceName myns -QueueName myqueue

$q.Status = "Disabled"

Set-AzServiceBusQueue -ResourceGroup mygrp -NamespaceName myns -QueueName myqueue -QueueObj $q
```

## Topic status
You can change topic status in the Azure portal. Select the current status of the topic to see the following page, which allows you to change the status. 

:::image type="content" source="./media/entity-suspend/topic-state-change.png" alt-text="Change topic status":::

The states that can be set for a **topic** are:
- **Active**: The topic is active. You can send messages to the topic. 
- **Disabled**: The topic is suspended. You can't send messages to the topic. Setting **Disabled** is equivalent to setting **SendDisabled** for a topic. 
- **SendDisabled**: Same effect as **Disabled**. You can't send messages to the topic. You'll get an exception if you try to send messages to the topic. 

## Subscription status
You can change subscription status in the Azure portal. Select the current status of the subscription to see the following page, which allows you to change the status. 

:::image type="content" source="./media/entity-suspend/subscription-state-change.png" alt-text="Change subscription status":::

The states that can be set for a **subscription** are:
- **Active**: The subscription is active. You can receive messages from the subscription.
- **Disabled**: The subscription is suspended. You can't receive messages from the subscription. Setting **Disabled** on a subscription is equivalent to setting **ReceiveDisabled**. You'll get an exception if you try to receive messages from the subscription.
- **ReceiveDisabled**: Same effect as **Disabled**. You can't receive messages from the subscription. You'll get an exception if you try to receive messages from the subscription.

Here's how the behavior is based on the status you set on a topic and its subscription. 

| Topic status | Subscription status | Behavior | 
| ------------ | ------------------- | -------- | 
| Active | Active | You can send messages to the topic and receive messages from the subscription. | 
| Active | Disabled or Receive Disabled | You can send messages to the topic, but you can't receive messages from the subscription | 
| Disabled or Send Disabled | Active | You can't send messages to the topic, but you can receive messages that are already at the subscription. | 
| Disabled or Send Disabled | Disabled or Receive Disabled | You can't send messages to the topic and you can't receive from the subscription either. | 

## Other statuses
The [EntityStatus](/dotnet/api/azure.messaging.servicebus.administration.entitystatus) enumeration also defines a set of transitional states that can only be set by the system. 


## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
