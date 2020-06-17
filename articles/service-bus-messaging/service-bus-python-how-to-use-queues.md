---
title: 'Quickstart: Use Azure Service Bus queues with Python'
description: This article shows you how to use Python to create, send messages to, and receive messages from Azure Service Bus queues. 
services: service-bus-messaging
documentationcenter: python
author: axisc
editor: spelluru

ms.assetid: b95ee5cd-3b31-459c-a7f3-cf8bcf77858b
ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: quickstart
ms.date: 01/27/2020
ms.author: aschhab
ms.custom: seo-python-october2019, tracking-python
---
# Quickstart: Use Azure Service Bus queues with Python

[!INCLUDE [service-bus-selector-queues](../../includes/service-bus-selector-queues.md)]

This article shows you how to use Python to create, send messages to, and receive messages from Azure Service Bus queues. 

For more information about the Python Azure Service Bus libraries, see [Service Bus libraries for Python](/python/api/overview/azure/servicebus?view=azure-python).

## Prerequisites
- An Azure subscription. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- A Service Bus namespace, created by following the steps at [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions](service-bus-quickstart-topics-subscriptions-portal.md). Copy the primary connection string from the **Shared access policies** screen to use later in this article. 
- Python 3.4x or above, with the [Python Azure Service Bus][Python Azure Service Bus package] package installed. For more information, see the [Python Installation Guide](/azure/developer/python/azure-sdk-install). 

## Create a queue

A **ServiceBusClient** object lets you work with queues. To programmatically access Service Bus, add the following line near the top of your Python file:

```python
from azure.servicebus import ServiceBusClient
```

Add the following code to create a **ServiceBusClient** object. Replace `<connectionstring>` with your Service Bus primary connection string value. You can find this value under **Shared access policies** in your Service Bus namespace in the [Azure portal][Azure portal].

```python
sb_client = ServiceBusClient.from_connection_string('<connectionstring>')
```

The following code uses the `create_queue` method of the **ServiceBusClient** to create a queue named `taskqueue` with default settings:

```python
sb_client.create_queue("taskqueue")
```

You can use options to override default queue settings, such as message time to live (TTL) or maximum topic size. The following code creates a queue called `taskqueue` with a maximum queue size of 5 GB and TTL value of 1 minute:

```python
sb_client.create_queue("taskqueue", max_size_in_megabytes=5120,
                       default_message_time_to_live=datetime.timedelta(minutes=1))
```

## Send messages to a queue

To send a message to a Service Bus queue, an application calls the `send` method on the **ServiceBusClient** object. The following code example creates a queue client and sends a test message to the `taskqueue` queue. Replace `<connectionstring>` with your Service Bus primary connection string value. 

```python
from azure.servicebus import QueueClient, Message

# Create the QueueClient
queue_client = QueueClient.from_connection_string("<connectionstring>", "taskqueue")

# Send a test message to the queue
msg = Message(b'Test Message')
queue_client.send(msg)
```

### Message size limits and quotas

Service Bus queues support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). The header, which includes the standard and custom application properties, can have a maximum size of 64 KB. There's no limit on the number of messages a queue can hold, but there's a cap on the total size of the messages the queue holds. You can define queue size at creation time, with an upper limit of 5 GB. 

For more information about quotas, see [Service Bus quotas][Service Bus quotas].

## Receive messages from a queue

The queue client receives messages from a queue by using the `get_receiver` method on the **ServiceBusClient** object. The following code example creates a queue client and receives a message from the `taskqueue` queue. Replace `<connectionstring>` with your Service Bus primary connection string value. 

```python
from azure.servicebus import QueueClient, Message

# Create the QueueClient
queue_client = QueueClient.from_connection_string("<connectionstring>", "taskqueue")

# Receive the message from the queue
with queue_client.get_receiver() as queue_receiver:
    messages = queue_receiver.fetch_next(timeout=3)
    for message in messages:
        print(message)
        message.complete()
```

### Use the peek_lock parameter

The optional `peek_lock` parameter of `get_receiver` determines whether Service Bus deletes messages from the queue as they're read. The default mode for message receiving is *PeekLock*, or `peek_lock` set to **True**, which reads (peeks) and locks messages without deleting them from the queue. Each message must then be explicitly completed to remove it from the queue.

To delete messages from the queue as they're read, you can set the `peek_lock` parameter of `get_receiver` to **False**. Deleting messages as part of the receive operation is the simplest model, but only works if the application can tolerate missing messages if there's a failure. To understand this behavior, consider a scenario in which the consumer issues a receive request and then crashes before processing it. If the message was deleted on being received, when the application restarts and begins consuming messages again, it has missed the message it received before the crash.

If your application can't tolerate missed messages, receive is a two-stage operation. PeekLock finds the next message to be consumed, locks it to prevent other consumers from receiving it, and returns it to the application. After processing or storing the message, the application completes the second stage of the receive process by calling the `complete` method on the **Message** object.  The `complete` method marks the message as being consumed and removes it from the queue.

## Handle application crashes and unreadable messages

Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application can't process a message for some reason, it can call the `unlock` method on the **Message** object. Service Bus unlocks the message within the queue and makes it available to be received again, either by the same or another consuming application.

There's also a timeout for messages locked within the queue. If an application fails to process a message before the lock timeout expires, for example if the application crashes, Service Bus unlocks the message automatically and makes it available to be received again.

If an application crashes after processing a message but before calling the `complete` method, the message is redelivered to the application when it restarts. This behavior is often called *At-least-once Processing*. Each message is processed at least once, but in certain situations the same message may be redelivered. If your scenario can't tolerate duplicate processing, you can use the **MessageId** property of the message, which remains constant across delivery attempts, to handle duplicate message delivery. 

> [!TIP]
> You can manage Service Bus resources with [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/). Service Bus Explorer lets you connect to a Service Bus namespace and easily administer messaging entities. The tool provides advanced features like import/export functionality and the ability to test topics, queues, subscriptions, relay services, notification hubs, and event hubs.

## Next steps

Now that you've learned the basics of Service Bus queues, see [Queues, topics, and subscriptions][Queues, topics, and subscriptions] to learn more.

[Azure portal]: https://portal.azure.com
[Python Azure Service Bus package]: https://pypi.python.org/pypi/azure-servicebus  
[Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[Service Bus quotas]: service-bus-quotas.md
