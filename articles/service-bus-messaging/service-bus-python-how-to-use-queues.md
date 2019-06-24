---
title: How to use Azure Service Bus queues with Python | Microsoft Docs
description: Learn how to use Azure Service Bus queues from Python.
services: service-bus-messaging
documentationcenter: python
author: axisc
manager: timlt
editor: spelluru

ms.assetid: b95ee5cd-3b31-459c-a7f3-cf8bcf77858b
ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: article
ms.date: 04/10/2019
ms.author: aschhab

---
# How to use Service Bus queues with Python

[!INCLUDE [service-bus-selector-queues](../../includes/service-bus-selector-queues.md)]

In this tutorial, you learn how to create Python applications to send messages to and receive messages from a Service Bus queue. 

## Prerequisites
1. An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
2. Follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article.
    1. Read the quick **overview** of Service Bus **queues**. 
    2. Create a Service Bus **namespace**. 
    3. Get the **connection string**. 

        > [!NOTE]
        > You will create a **queue** in the Service Bus namespace by using Python in this tutorial. 
1. Install Python or the [Python Azure Service Bus package][Python Azure Service Bus package], see the [Python Installation Guide](../python-how-to-install.md). See full documentation of Service Bus Python SDK [here](/python/api/overview/azure/servicebus?view=azure-python).

## Create a queue
The **ServiceBusClient** object enables you to work with queues. Add the following code near the top of any Python file in which you wish to programmatically access Service Bus:

```python
from azure.servicebus import ServiceBusClient
```

The following code creates a **ServiceBusClient** object. Replace `<CONNECTION STRING>` with your servicebus connectionstring.

```python
sb_client = ServiceBusClient.from_connection_string('<CONNECTION STRING>')
```

The values for the SAS key name and value can be found in the [Azure portal][Azure portal] connection information, or in the Visual Studio **Properties** pane when selecting the Service Bus namespace in Server Explorer (as shown in the previous section).

```python
sb_client.create_queue("taskqueue")
```

The `create_queue` method also supports additional options, which enable you to override default queue settings such as message time to live (TTL) or maximum queue size. The following example sets the maximum queue size to 5 GB, and the TTL value to 1 minute:

```python
sb_client.create_queue("taskqueue", max_size_in_megabytes=5120, default_message_time_to_live=datetime.timedelta(minutes=1))
```

For more information, see [Azure Service Bus Python documentation](/python/api/overview/azure/servicebus?view=azure-python).

## Send messages to a queue
To send a message to a Service Bus queue, your application calls the `send` method on the `ServiceBusClient` object.

The following example demonstrates how to send a test message to the queue named `taskqueue` using `send_queue_message`:

```python
from azure.servicebus import QueueClient, Message

# Create the QueueClient 
queue_client = QueueClient.from_connection_string("<CONNECTION STRING>", "<QUEUE NAME>")

# Send a test message to the queue
msg = Message(b'Test Message')
queue_client.send(msg)
```

Service Bus queues support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). The header, which includes the standard and custom application properties, can have
a maximum size of 64 KB. There is no limit on the number of messages held in a queue but there is a cap on the total size of the messages held by a queue. This queue size is defined at creation time, with an upper limit of 5 GB. For more information about quotas, see [Service Bus quotas][Service Bus quotas].

For more information, see [Azure Service Bus Python documentation](/python/api/overview/azure/servicebus?view=azure-python).

## Receive messages from a queue
Messages are received from a queue using the `get_receiver` method on the `ServiceBusService` object:

```python
from azure.servicebus import QueueClient, Message

# Create the QueueClient 
queue_client = QueueClient.from_connection_string("<CONNECTION STRING>", "<QUEUE NAME>")

## Receive the message from the queue
with queue_client.get_receiver() as queue_receiver:
    messages = queue_receiver.fetch_next(timeout=3)
    for message in messages:
        print(message)
        message.complete()
```

For more information, see [Azure Service Bus Python documentation](/python/api/overview/azure/servicebus?view=azure-python).


Messages are deleted from the queue as they are read when the parameter `peek_lock` is set to **False**. You can read (peek) and lock the message without deleting it from the queue by setting the parameter `peek_lock` to **True**.

The behavior of reading and deleting the message as part of the receive operation is the simplest model, and works best for scenarios in which an application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked the message as being consumed, then when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.

If the `peek_lock` parameter is set to **True**, the receive becomes a two stage operation, which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by calling the **delete** method on the **Message** object. The **delete** method will mark the message as being consumed and remove it from the queue.

```python
msg.delete()
```

## How to handle application crashes and unreadable messages
Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, then it can call the **unlock** method on the **Message** object. This will cause Service Bus to unlock the message within the queue and make it available to be received again, either by the same consuming application or by another consuming application.

There is also a timeout associated with a message locked within the queue, and if the application fails to process the message before the lock timeout expires (for example, if the application crashes), then Service Bus will unlock the message automatically and make it available to be received again.

In the event that the application crashes after processing the message but before the **delete** method is called, then the message will be redelivered to the application when it restarts. This is often called **at least once processing**, that is, each message will be processed at least once but in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then application developers should add additional logic to their application to handle duplicate message delivery. This is often achieved using the **MessageId** property of the message, which will remain constant across delivery attempts.

> [!NOTE]
> You can manage Service Bus resources with [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/). The Service Bus Explorer allows users to connect to a Service Bus namespace and administer messaging entities in an easy manner. The tool provides advanced features like import/export functionality or the ability to test topic, queues, subscriptions, relay services, notification hubs and events hubs. 

## Next steps
Now that you have learned the basics of Service Bus queues, see these articles to learn more.

* [Queues, topics, and subscriptions][Queues, topics, and subscriptions]

[Azure portal]: https://portal.azure.com
[Python Azure Service Bus package]: https://pypi.python.org/pypi/azure-servicebus  
[Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[Service Bus quotas]: service-bus-quotas.md

