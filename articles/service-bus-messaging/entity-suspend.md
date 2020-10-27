---
title: Azure Service Bus - suspend messaging entities
description: This article explains how to temporarily suspend and reactivate Azure Service Bus message entities (queues, topics, and subscriptions).
ms.topic: article
ms.date: 09/29/2020
---

# Suspend and reactivate messaging entities (disable)

Queues, topics, and subscriptions can be temporarily suspended. Suspension puts the entity into a disabled state in which all messages are maintained in storage. However, messages cannot be removed or added, and the respective protocol operations yield errors.

Suspending an entity is typically done for urgent administrative reasons. One scenario is having deployed a faulty receiver that takes messages off the queue, fails processing, and yet incorrectly completes the messages and removes them. If that behavior is diagnosed, the queue can be disabled for receives until corrected code is deployed and further data loss caused by the faulty code can be prevented.

A suspension or reactivation can be performed either by the user or by the system. The system only suspends entities due to grave administrative reasons such as hitting the subscription spending limit. System-disabled entities cannot be reactivated by the user, but are restored when the cause of the suspension has been addressed.

## Queue status 
The states that can be set for a queue are:

-   **Active**: The queue is active.
-   **Disabled**: The queue is suspended. It's equivalent to setting both **SendDisabled** and **ReceiveDisabled**. 
-   **SendDisabled**: The queue is partially suspended, with receive being permitted.
-   **ReceiveDisabled**: The queue is partially suspended, with send being permitted.

### Change the queue status in the Azure portal: 

1. In the Azure portal, navigate to your Service Bus namespace. 
1. Select the queue for which you want to change the status. You see queues in the bottom pane in the middle. 
1. On the **Service Bus Queue** page, see the current status of the queue as a hyperlink. If the **Overview** isn't selected on the left menu, select it to see the status of the queue. Select the current status of the queue to change it. 

    :::image type="content" source="./media/entity-suspend/select-state.png" alt-text="Select state of the queue":::
4. Select the new status for the queue, and select **OK**. 

    :::image type="content" source="./media/entity-suspend/entity-state-change.png" alt-text="Set state of the queue":::
    
The portal only permits completely disabling queues. You can also disable the send and receive operations separately using the Service Bus [NamespaceManager](/dotnet/api/microsoft.servicebus.namespacemanager) APIs in the .NET Framework SDK, or with an Azure Resource Manager template through Azure CLI or Azure PowerShell.

### Change the queue status using Azure PowerShell
The PowerShell command to disable a queue is shown in the following example. The reactivation command is equivalent, setting `Status` to **Active**.

```powershell
$q = Get-AzServiceBusQueue -ResourceGroup mygrp -NamespaceName myns -QueueName myqueue

$q.Status = "Disabled"

Set-AzServiceBusQueue -ResourceGroup mygrp -NamespaceName myns -QueueName myqueue -QueueObj $q
```

## Topic status
Changing the topic status in the Azure portal is similar to changing status of a queue. When you select the current status of the topic, you see the following page that lets you change the status. 

:::image type="content" source="./media/entity-suspend/topic-state-change.png" alt-text="Change topic status":::

The states that can be set for a topic are:
- **Active**: The topic is active.
- **Disabled**: The topic is suspended.
- **SendDisabled**: Same effect as **Disabled**.

## Subscription status
Changing the subscription status in the Azure portal is similar to changing status of a topic or a queue. When you select the current status of the subscription, you see the following page that lets you change the status. 

:::image type="content" source="./media/entity-suspend/subscription-state-change.png" alt-text="Change subscription status":::

The states that can be set for a topic are:
- **Active**: The topic is active.
- **Disabled**: The topic is suspended.
- **ReceiveDisabled**: Same effect as **Disabled**.

## Other statuses
The [EntityStatus](/dotnet/api/microsoft.servicebus.messaging.entitystatus) enumeration also defines a set of transitional states that can only be set by the system. 


## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)

[1]: ./media/entity-suspend/entity-state-change.png

