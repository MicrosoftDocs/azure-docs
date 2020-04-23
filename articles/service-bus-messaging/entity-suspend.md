---
title: Azure Service Bus - suspend messaging entities
description: This article explains how to temporarily suspend and reactivate Azure Service Bus message entities (queues, topics, and subscriptions).
services: service-bus-messaging
documentationcenter: ''
author: axisc
manager: timlt
editor: spelluru

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/24/2020
ms.author: aschhab

---

# Suspend and reactivate messaging entities (disable)

Queues, topics, and subscriptions can be temporarily suspended. Suspension puts the entity into a disabled state in which all messages are maintained in storage. However, messages cannot be removed or added, and the respective protocol operations yield errors.

Suspending an entity is typically done for urgent administrative reasons. One scenario is having deployed a faulty receiver that takes messages off the queue, fails processing, and yet incorrectly completes the messages and removes them. If that behavior is diagnosed, the queue can be disabled for receives until corrected code is deployed and further data loss caused by the faulty code can be prevented.

A suspension or reactivation can be performed either by the user or by the system. The system only suspends entities due to grave administrative reasons such as hitting the subscription spending limit. System-disabled entities cannot be reactivated by the user, but are restored when the cause of the suspension has been addressed.

In the portal, the **Properties** section for the respective entity enables changing the state; the following screenshot shows the toggle for a queue:

![][1]

The portal only permits completely disabling queues. You can also disable the send and receive operations separately using the Service Bus [NamespaceManager](/dotnet/api/microsoft.servicebus.namespacemanager) APIs in the .NET Framework SDK, or with an Azure Resource Manager template through Azure CLI or Azure PowerShell.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Suspension states

The states that can be set for a queue are:

-   **Active**: The queue is active.
-   **Disabled**: The queue is suspended.
-   **SendDisabled**: The queue is partially suspended, with receive being permitted.
-   **ReceiveDisabled**: The queue is partially suspended, with send being permitted.

For subscriptions and topics, only **Active** and **Disabled** can be set.

The [EntityStatus](/dotnet/api/microsoft.servicebus.messaging.entitystatus) enumeration also defines a set of transitional states that can only be set by the system. The PowerShell command to disable a queue is shown in the following example. The reactivation command is equivalent, setting `Status` to **Active**.

```powershell
$q = Get-AzServiceBusQueue -ResourceGroup mygrp -NamespaceName myns -QueueName myqueue

$q.Status = "Disabled"

Set-AzServiceBusQueue -ResourceGroup mygrp -NamespaceName myns -QueueName myqueue -QueueObj $q
```

## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)

[1]: ./media/entity-suspend/queue-disable.png

