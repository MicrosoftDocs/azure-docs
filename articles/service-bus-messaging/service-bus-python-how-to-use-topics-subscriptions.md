---
title: 'Quickstart: Use Azure Service Bus topics and subscriptions with Python'
description: This article shows you how to create an Azure Service Bus topic, subscription, send messages to a topic and receive messages from subscription.
services: service-bus-messaging
documentationcenter: python
author: axisc
editor: spelluru

ms.assetid: c4f1d76c-7567-4b33-9193-3788f82934e4
ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: quickstart
ms.date: 01/27/2020
ms.author: aschhab
ms.custom: tracking-python

---
# Quickstart: Use Service Bus topics and subscriptions with Python

[!INCLUDE [service-bus-selector-topics](../../includes/service-bus-selector-topics.md)]

This article describes how to use Python with Azure Service Bus topics and subscriptions. The samples use the [Azure Python SDK][Azure Python package] package to: 

- Create topics and subscriptions to topics
- Create subscription filters and rules
- Send messages to topics 
- Receive messages from subscriptions
- Delete topics and subscriptions

## Prerequisites
- An Azure subscription. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- A Service Bus namespace, created by following the steps at [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions](service-bus-quickstart-topics-subscriptions-portal.md). Copy the namespace name, shared access key name, and primary key value from the **Shared access policies** screen to use later in this quickstart. 
- Python 3.4x or above, with the [Azure Python SDK][Azure Python package] package installed. For more information, see the [Python Installation Guide](/azure/developer/python/azure-sdk-install).

## Create a ServiceBusService object

A **ServiceBusService** object lets you work with topics and subscriptions to topics. To programmatically access Service Bus, add the following line near the top of your Python file:

```python
from azure.servicebus.control_client import ServiceBusService, Message, Topic, Rule, DEFAULT_RULE_NAME
```

Add the following code to create a **ServiceBusService** object. Replace `<namespace>`, `<sharedaccesskeyname>`, and `<sharedaccesskeyvalue>` with your Service Bus namespace name, Shared Access Signature (SAS) key name, and primary key value. You can find these values under **Shared access policies** in your Service Bus namespace in the [Azure portal][Azure portal].

```python
bus_service = ServiceBusService(
    service_namespace='<namespace>',
    shared_access_key_name='<sharedaccesskeyname>',
    shared_access_key_value='<sharedaccesskeyvalue>')
```

## Create a topic

The following code uses the `create_topic` method to create a Service Bus topic called `mytopic`, with default settings:

```python
bus_service.create_topic('mytopic')
```

You can use topic options to override default topic settings, such as message time to live (TTL) or maximum topic size. The following example creates a topic named `mytopic` with a maximum topic size of 5 GB and default message TTL of one minute:

```python
topic_options = Topic()
topic_options.max_size_in_megabytes = '5120'
topic_options.default_message_time_to_live = 'PT1M'

bus_service.create_topic('mytopic', topic_options)
```

## Create subscriptions

You also use the **ServiceBusService** object to create subscriptions to topics. A subscription can have a filter to restrict the message set delivered to its virtual queue. If you don't specify a filter, new subscriptions use the default **MatchAll** filter, which places all messages published to the topic into the subscription's virtual queue. The following example creates a subscription to `mytopic` named `AllMessages` that uses the **MatchAll** filter:

```python
bus_service.create_subscription('mytopic', 'AllMessages')
```

### Use filters with subscriptions

Use the `create_rule` method of the **ServiceBusService** object to filter the messages that appear in a subscription. You can specify rules when you create the subscription, or add rules to existing subscriptions.

The most flexible type of filter is a **SqlFilter**, which uses a subset of SQL-92. SQL filters operate based on the properties of messages published to the topic. For more information about the expressions you can use with a SQL filter, see the [SqlFilter.SqlExpression][SqlFilter.SqlExpression] syntax.

Because the **MatchAll** default filter applies automatically to all new subscriptions, you must remove it from subscriptions you want to filter, or **MatchAll** will override any other filters you specify. You can remove the default rule by using the `delete_rule` method of the **ServiceBusService** object.

The following example creates a subscription to `mytopic` named `HighMessages`, with a **SqlFilter** rule named `HighMessageFilter`. The `HighMessageFilter` rule selects only messages with a custom `messageposition` property greater than 3:

```python
bus_service.create_subscription('mytopic', 'HighMessages')

rule = Rule()
rule.filter_type = 'SqlFilter'
rule.filter_expression = 'messageposition > 3'

bus_service.create_rule('mytopic', 'HighMessages', 'HighMessageFilter', rule)
bus_service.delete_rule('mytopic', 'HighMessages', DEFAULT_RULE_NAME)
```

The following example creates a subscription to `mytopic` named `LowMessages`, with a **SqlFilter** rule named `LowMessageFilter`. The `LowMessageFilter` rule selects only messages with a `messageposition` property less than or equal to 3:

```python
bus_service.create_subscription('mytopic', 'LowMessages')

rule = Rule()
rule.filter_type = 'SqlFilter'
rule.filter_expression = 'messageposition <= 3'

bus_service.create_rule('mytopic', 'LowMessages', 'LowMessageFilter', rule)
bus_service.delete_rule('mytopic', 'LowMessages', DEFAULT_RULE_NAME)
```

With `AllMessages`, `HighMessages`, and `LowMessages` all in effect, messages sent to `mytopic` are always delivered to receivers of the `AllMessages` subscription. Messages are also selectively delivered to the `HighMessages` or `LowMessages` subscription, depending on the message's `messageposition` property value. 

## Send messages to a topic

Applications use the `send_topic_message` method of the **ServiceBusService** object to send messages to a Service Bus topic.

The following example sends five test messages to the `mytopic` topic. The custom `messageposition` property value depends on the iteration of the loop, and determines which subscriptions receive the messages. 

```python
for i in range(5):
    msg = Message('Msg {0}'.format(i).encode('utf-8'),
                  custom_properties={'messageposition': i})
    bus_service.send_topic_message('mytopic', msg)
```

### Message size limits and quotas

Service Bus topics support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). The header, which includes the standard and custom application properties, can have a maximum size of 64 KB. There's no limit on the number of messages a topic can hold, but there's a cap on the total size of the messages the topic holds. You can define topic size at creation time, with an upper limit of 5 GB. 

For more information about quotas, see [Service Bus quotas][Service Bus quotas].

## Receive messages from a subscription

Applications use the `receive_subscription_message` method on the **ServiceBusService** object to receive messages from a subscription. The following example receives messages from the `LowMessages` subscription and deletes them as they're read:

```python
msg = bus_service.receive_subscription_message('mytopic', 'LowMessages', peek_lock=False)
print(msg.body)
```

The optional `peek_lock` parameter of `receive_subscription_message` determines whether Service Bus deletes messages from the subscription as they're read. The default mode for message receiving is *PeekLock*, or `peek_lock` set to **True**, which reads (peeks) and locks messages without deleting them from the subscription. Each message must then be explicitly completed to remove it from the subscription.

To delete messages from the subscription as they're read, you can set the `peek_lock` parameter to **False**, as in the preceding example. Deleting messages as part of the receive operation is the simplest model, and works fine if the application can tolerate missing messages if there's a failure. To understand this behavior, consider a scenario in which the application issues a receive request and then crashes before processing it. If the message was deleted on being received, when the application restarts and begins consuming messages again, it has missed the message it received before the crash.

If your application can't tolerate missed messages, the receive becomes a two-stage operation. PeekLock finds the next message to be consumed, locks it to prevent other consumers from receiving it, and returns it to the application. After processing or storing the message, the application completes the second stage of the receive process by calling the `complete` method on the **Message** object.  The `complete` method marks the message as being consumed and removes it from the subscription.

The following example demonstrates a peek lock scenario:

```python
msg = bus_service.receive_subscription_message('mytopic', 'LowMessages', peek_lock=True)
if msg.body is not None:
    print(msg.body)
    msg.complete()
```

## Handle application crashes and unreadable messages

Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application can't process a message for some reason, it can call the `unlock` method on the **Message** object. Service Bus unlocks the message within the subscription and makes it available to be received again, either by the same or another consuming application.

There's also a timeout for messages locked within the subscription. If an application fails to process a message before the lock timeout expires, for example if the application crashes, Service Bus unlocks the message automatically and makes it available to be received again.

If an application crashes after processing a message but before calling the `complete` method, the message will be redelivered to the application when it restarts. This behavior is often called *At-least-once Processing*. Each message is processed at least once, but in certain situations the same message may be redelivered. If your scenario can't tolerate duplicate processing, you can use the **MessageId** property of the message, which remains constant across delivery attempts, to handle duplicate message delivery. 

## Delete topics and subscriptions

To delete topics and subscriptions, use the [Azure portal][Azure portal] or the `delete_topic` method. The following code deletes the topic named `mytopic`:

```python
bus_service.delete_topic('mytopic')
```

Deleting a topic deletes all subscriptions to the topic. You can also delete subscriptions independently. The following code deletes the subscription named `HighMessages` from the `mytopic` topic:

```python
bus_service.delete_subscription('mytopic', 'HighMessages')
```

By default, topics and subscriptions are persistent, and exist until you delete them. To automatically delete subscriptions after a certain time period elapses, you can set the [auto_delete_on_idle](https://docs.microsoft.com/python/api/azure-mgmt-servicebus/azure.mgmt.servicebus.models.sbsubscription?view=azure-python) parameter on the subscription. 

> [!TIP]
> You can manage Service Bus resources with [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/). Service Bus Explorer lets you connect to a Service Bus namespace and easily administer messaging entities. The tool provides advanced features like import/export functionality and the ability to test topics, queues, subscriptions, relay services, notification hubs, and event hubs. 

## Next steps

Now that you've learned the basics of Service Bus topics, follow these links to learn more:

* [Queues, topics, and subscriptions][Queues, topics, and subscriptions]
* [SqlFilter.SqlExpression][SqlFilter.SqlExpression] reference

[Azure portal]: https://portal.azure.com
[Azure Python package]: https://pypi.python.org/pypi/azure
[Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[SqlFilter.SqlExpression]: service-bus-messaging-sql-filter.md
[Service Bus quotas]: service-bus-quotas.md 
