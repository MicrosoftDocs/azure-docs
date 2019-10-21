---
title: Use Azure Service Bus topics with Python
description: Learn how to use Azure Service Bus topics and subscriptions from Python.
services: service-bus-messaging
documentationcenter: python
author: axisc
manager: timlt
editor: spelluru

ms.assetid: c4f1d76c-7567-4b33-9193-3788f82934e4
ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: article
ms.date: 10/21/2019
ms.author: aschhab

---
# Use Service Bus topics and subscriptions with Python

[!INCLUDE [service-bus-selector-topics](../../includes/service-bus-selector-topics.md)]

This article describes how to use Python with Azure Service Bus to: 

- Create topics and subscriptions 
- Create subscription filters 
- Send messages to a topic 
- Receive messages from a subscription
- Delete topics and subscriptions

## Prerequisites
- An Azure subscription. To get one, you can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- A Service Bus *namespace* and *connection string*. Follow the instructions in [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions](service-bus-quickstart-topics-subscriptions-portal.md) to create a namespace and get the connection string.
- Python 3.4x or above, with the [Azure Python SDK][Azure Python package] package installed. For more information, see the [Python Installation Guide](/azure/python/python-sdk-azure-install).

## Work with topics

The **ServiceBusService** object lets you work with topics and subscriptions. To programmatically access Service Bus, add the following code near the top of any Python file:

```python
from azure.servicebus.control_client import ServiceBusService, Message, Topic, Rule, DEFAULT_RULE_NAME
```

## Create a topic

The following code creates a **ServiceBusService** object. Replace `mynamespace`, `sharedaccesskeyname`, and `sharedaccesskey` with your actual namespace, Shared Access Signature (SAS) key name, and key value. You can get these values from the [Azure portal][Azure portal].

```python
bus_service = ServiceBusService(
    service_namespace='mynamespace',
    shared_access_key_name='sharedaccesskeyname',
    shared_access_key_value='sharedaccesskey')

bus_service.create_topic('mytopic')
```

### Set maximum topic size and TTL

The `create_topic` method has options that let you override default topic settings, such as message time to live or maximum topic size. The following example sets the maximum topic size to 5 GB, and a time to live (TTL) value of one minute:

```python
topic_options = Topic()
topic_options.max_size_in_megabytes = '5120'
topic_options.default_message_time_to_live = 'PT1M'

bus_service.create_topic('mytopic', topic_options)
```

## Create a subscription

The **ServiceBusService** object also creates subscriptions to topics. Subscriptions have a name, and can have an optional filter that restricts the message set delivered to the subscription's virtual queue.

> [!NOTE]
> By default, subscriptions are persistent, and will exist until you delete them or the topics they subscribe to. To automatically delete subscriptions after a certain time period, set the [auto_delete_on_idle property](https://docs.microsoft.com/python/api/azure-mgmt-servicebus/azure.mgmt.servicebus.models.sbsubscription?view=azure-python).

If you don't specify a filter, new subscriptions use the default **MatchAll** filter. All messages published to the topic are placed in the subscription's virtual queue. The following example creates a subscription named `AllMessages` with the default **MatchAll** filter.

```python
bus_service.create_subscription('mytopic', 'AllMessages')
```

### Use filters with subscriptions

You can define filters that specify which messages sent to a topic should appear in a specific topic subscription.

The most flexible type of filter supported by subscriptions is a **SqlFilter**, which uses a subset of SQL92. SQL filters operate on the properties of messages published to the topic. For more information about the expressions you can use with a SQL filter, see the [SqlFilter.SqlExpression][SqlFilter.SqlExpression] syntax.

You can add filters to a new or existing subscription by using the `create_rule` method of the **ServiceBusService** object.

> [!NOTE]
> Because the default filter applies automatically to all new subscriptions, you must remove it, or **MatchAll** will override any other filters you specify. You can remove the default rule by using the `delete_rule` method of the **ServiceBusService** object.
> 
The following example creates a subscription named `HighMessages`, with a **SqlFilter** called `HighMessageFilter`. The `HighMessageFilter` rule selects only messages with a `messagenumber` property greater than 3:

```python
bus_service.create_subscription('mytopic', 'HighMessages')

rule = Rule()
rule.filter_type = 'SqlFilter'
rule.filter_expression = 'messagenumber > 3'

bus_service.create_rule('mytopic', 'HighMessages', 'HighMessageFilter', rule)
bus_service.delete_rule('mytopic', 'HighMessages', DEFAULT_RULE_NAME)
```

The following example creates a subscription named `LowMessages`, with a **SqlFilter** called `LowMessageFilter` that  selects only messages with a `messagenumber` property less than or equal to 3:

```python
bus_service.create_subscription('mytopic', 'LowMessages')

rule = Rule()
rule.filter_type = 'SqlFilter'
rule.filter_expression = 'messagenumber <= 3'

bus_service.create_rule('mytopic', 'LowMessages', 'LowMessageFilter', rule)
bus_service.delete_rule('mytopic', 'LowMessages', DEFAULT_RULE_NAME)
```

When a message is sent to `mytopic`, it is always delivered to receivers subscribed to the **AllMessages** topic subscription. The message is selectively delivered to the **HighMessages** or **LowMessages** subscriptions, depending on the message's `messagenumber` property value. 

## Send messages to a topic

Applications use the `send_topic_message` method of the **ServiceBusService** object to send messages to a Service Bus topic.

The following example shows how to send five test messages to the `mytopic` topic. The `messagenumber` property value of each message varies depending on the iteration of the loop. The `messagenumber` property determines which subscriptions receive the message. 

```python
for i in range(5):
    msg = Message('Msg {0}'.format(i).encode('utf-8'),
                  custom_properties={'messagenumber': i})
    bus_service.send_topic_message('mytopic', msg)
```

### Message size limits and quotas

Service Bus topics support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). The header, which includes the standard and custom application properties, can have a maximum size of 64 KB. There's no limit on the number of messages held in a topic, but there's a cap on the total size of the messages held by a topic. You can define topic size at creation time, with an upper limit of 5 GB. 

For more information about quotas, see [Service Bus quotas][Service Bus quotas].

## Receive messages from a subscription

Use the `receive_subscription_message` method on the **ServiceBusService** object to receive messages from a subscription:

```python
msg = bus_service.receive_subscription_message(
    'mytopic', 'LowMessages', peek_lock=False)
print(msg.body)
```

### Use the peek_lock parameter

Set the `peek_lock` parameter to **False** to have messages deleted from the subscription as they are read. Read (peek) and lock the message without deleting it from the queue by setting the  `peek_lock` parameter to **True**.

The behavior of reading and deleting the message as part of the receive operation is the simplest, and works best for scenarios in which an application can tolerate not processing a message when there is a failure. To understand this behavior, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus has marked the message as being consumed, when the application restarts and begins consuming messages again, it has missed the message that was consumed prior to the crash.

If the `peek_lock` parameter is set to **True**, receive is a two-stage operation, which supports applications that can't tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message, or stores it reliably for future processing, it completes the second stage of the receive process by calling the `delete` method on the **Message** object. The `delete` method marks the message as being consumed and removes it from the subscription.

```python
msg = bus_service.receive_subscription_message('mytopic', 'LowMessages', peek_lock=True)
if msg.body is not None:
print(msg.body)
msg.delete()
```

## Handle application crashes and unreadable messages

Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, it can call the `unlock` method on the **Message** object. This method causes Service Bus to unlock the message within the subscription and make it available to be received again, either by the same or another consuming application.

There's also a timeout for messages locked within the subscription. If an application fails to process a message before the lock timeout expires, for example if the application crashes, Service Bus unlocks the message automatically and makes it available to be received again.

If an application crashes after processing the message but before calling the `delete` method, the message will be redelivered to the application when it restarts. This behavior is often called *At-least-once Processing*. Each message is processed at least once, but in certain situations the same message may be redelivered. If your scenario can't tolerate duplicate processing, add logic to your application to handle duplicate message delivery. To do this, you can use the **MessageId** property of the message, which remains constant across delivery attempts.

## Delete topics and subscriptions

Topics and subscriptions are persistent unless the [auto_delete_on_idle](https://docs.microsoft.com/python/api/azure-mgmt-servicebus/azure.mgmt.servicebus.models.sbsubscription?view=azure-python) property is set. You can delete topics and subscriptions through the [Azure portal][Azure portal] or programmatically. The following code shows how to delete the topic named `mytopic`:

```python
bus_service.delete_topic('mytopic')
```

Deleting a topic also deletes any subscriptions to the topic. 

You can also delete subscriptions independently. The following code shows how to delete a subscription named `HighMessages` from the `mytopic` topic:

```python
bus_service.delete_subscription('mytopic', 'HighMessages')
```

> [!NOTE]
> You can manage Service Bus resources with [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/). Service Bus Explorer lets you connect to a Service Bus namespace and easily administer messaging entities. The tool provides advanced features like import/export functionality or the ability to test topic, queues, subscriptions, relay services, notification hubs, and events hubs. 

## Next steps

Now that you've learned the basics of Service Bus topics, follow these links to learn more.

* See [Queues, topics, and subscriptions][Queues, topics, and subscriptions].
* Reference for [SqlFilter.SqlExpression][SqlFilter.SqlExpression].

[Azure portal]: https://portal.azure.com
[Azure Python package]: https://pypi.python.org/pypi/azure
[Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[SqlFilter.SqlExpression]: service-bus-messaging-sql-filter.md
[Service Bus quotas]: service-bus-quotas.md 
