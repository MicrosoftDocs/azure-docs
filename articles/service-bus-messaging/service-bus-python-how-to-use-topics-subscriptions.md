---
title: How to use Azure Service Bus topics with Python | Microsoft Docs
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
ms.date: 04/15/2019
ms.author: aschhab

---
# How to use Service Bus topics and subscriptions with Python

[!INCLUDE [service-bus-selector-topics](../../includes/service-bus-selector-topics.md)]

This article describes how to use Service Bus topics and subscriptions. The samples are written in Python and use the [Azure Python SDK package][Azure Python package]. The scenarios covered include:

- Creating topics and subscriptions 
- Creating subscription filters 
- Sending messages to a topic 
- Receiving messages from a subscription
- Deleting topics and subscriptions

## Prerequisites
1. An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
2. Follow steps in the [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions to the topic](service-bus-quickstart-topics-subscriptions-portal.md) to create a Service Bus **namespace** and get the **connection string**.

    > [!NOTE]
    > You will create a **topic** and a **subscription** to the topic by using **Python** in this quickstart. 
3. Install [Azure Python package][Azure Python package]. See the [Python Installation Guide](../python-how-to-install.md).

## Create a topic

The **ServiceBusService** object enables you to work with topics. Add the following code near the top of any Python file in which you wish to programmatically access Service Bus:

```python
from azure.servicebus.control_client import ServiceBusService, Message, Topic, Rule, DEFAULT_RULE_NAME
```

The following code creates a **ServiceBusService** object. Replace `mynamespace`, `sharedaccesskeyname`, and `sharedaccesskey` with your actual namespace, Shared Access Signature (SAS) key name, and key value.

```python
bus_service = ServiceBusService(
    service_namespace='mynamespace',
    shared_access_key_name='sharedaccesskeyname',
    shared_access_key_value='sharedaccesskey')
```

You can obtain the values for the SAS key name and value from the [Azure portal][Azure portal].

```python
bus_service.create_topic('mytopic')
```

The `create_topic` method also supports additional options, which enable you to override default topic settings such as message time to live or maximum topic size. The following example sets the maximum topic size to 5 GB, and a time to live (TTL) value of one minute:

```python
topic_options = Topic()
topic_options.max_size_in_megabytes = '5120'
topic_options.default_message_time_to_live = 'PT1M'

bus_service.create_topic('mytopic', topic_options)
```

## Create subscriptions

Subscriptions to topics are also created with the **ServiceBusService** object. Subscriptions are named and can have an optional filter that restricts the set of messages delivered to the subscription's virtual queue.

> [!NOTE]
> By default, subscriptions are persistent and will continue to exist until either they, or the topic to which they are subscribed, are deleted.
> 
> You can have the subscriptions automatically deleted by setting the [auto_delete_on_idle property](https://docs.microsoft.com/python/api/azure-mgmt-servicebus/azure.mgmt.servicebus.models.sbsubscription?view=azure-python).

### Create a subscription with the default (MatchAll) filter

If no filter is specified when a new subscription is created, the **MatchAll** filter (default) is used. When the **MatchAll** filter is used, all messages published to the topic are placed in the subscription's virtual queue. The following example creates a subscription named `AllMessages` and uses the default **MatchAll**
filter.

```python
bus_service.create_subscription('mytopic', 'AllMessages')
```

### Create subscriptions with filters

You can also define filters that enable you to specify which messages sent to a topic should show up within a specific topic subscription.

The most flexible type of filter supported by subscriptions is a **SqlFilter**, which implements a subset of SQL92. SQL filters operate on the properties of the messages that are published to the topic. For more information about the expressions that can be used with a SQL filter, see the [SqlFilter.SqlExpression][SqlFilter.SqlExpression] syntax.

You can add filters to a subscription by using the **create\_rule** method of the **ServiceBusService** object. This method allows you to add new filters to an existing subscription.

> [!NOTE]
> Because the default filter is applied automatically to all new subscriptions, you must first remove the default filter or the **MatchAll** will override any other filters you may specify. You can remove the default rule by using the `delete_rule` method of the **ServiceBusService** object.
> 
> 

The following example creates a subscription named `HighMessages` with a **SqlFilter** that only selects messages that have a custom `messagenumber` property greater than 3:

```python
bus_service.create_subscription('mytopic', 'HighMessages')

rule = Rule()
rule.filter_type = 'SqlFilter'
rule.filter_expression = 'messagenumber > 3'

bus_service.create_rule('mytopic', 'HighMessages', 'HighMessageFilter', rule)
bus_service.delete_rule('mytopic', 'HighMessages', DEFAULT_RULE_NAME)
```

Similarly, the following example creates a subscription named `LowMessages` with a **SqlFilter** that only selects messages that have a `messagenumber` property less than or equal to 3:

```python
bus_service.create_subscription('mytopic', 'LowMessages')

rule = Rule()
rule.filter_type = 'SqlFilter'
rule.filter_expression = 'messagenumber <= 3'

bus_service.create_rule('mytopic', 'LowMessages', 'LowMessageFilter', rule)
bus_service.delete_rule('mytopic', 'LowMessages', DEFAULT_RULE_NAME)
```

Now, when a message is sent to `mytopic` it is always delivered to receivers subscribed to the **AllMessages** topic subscription, and selectively delivered to receivers subscribed to the **HighMessages** and **LowMessages** topic subscriptions (depending on the message content).

## Send messages to a topic

To send a message to a Service Bus topic, your application must use the `send_topic_message` method of the **ServiceBusService** object.

The following example demonstrates how to send five test messages to `mytopic`. The `messagenumber` property value of each message varies on the iteration of the loop (this determines which subscriptions receive it):

```python
for i in range(5):
    msg = Message('Msg {0}'.format(i).encode('utf-8'), custom_properties={'messagenumber':i})
    bus_service.send_topic_message('mytopic', msg)
```

Service Bus topics support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). The header, which includes the standard and custom application properties, can have
a maximum size of 64 KB. There is no limit on the number of messages held in a topic but there is a cap on the total size of the messages held by a topic. This topic size is defined at creation time, with an upper limit of 5 GB. For more information about quotas, see [Service Bus quotas][Service Bus quotas].

## Receive messages from a subscription

Messages are received from a subscription using the `receive_subscription_message` method on the **ServiceBusService** object:

```python
msg = bus_service.receive_subscription_message('mytopic', 'LowMessages', peek_lock=False)
print(msg.body)
```

Messages are deleted from the subscription as they are read when the parameter `peek_lock` is set to **False**. You can read (peek) and lock the message without deleting it from the queue by setting the parameter `peek_lock` to **True**.

The behavior of reading and deleting the message as part of the receive operation is the simplest model, and works best for scenarios in which an application can tolerate not processing a message when there is a failure. To understand this behavior, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus has marked the message as being consumed, then when the application restarts and begins consuming messages again, it has missed the message that was consumed prior to the crash.

If the `peek_lock` parameter is set to **True**, the receive becomes a two stage operation, which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by calling `delete` method on the **Message** object. The `delete` method marks the message as being consumed and removes it from the subscription.

```python
msg = bus_service.receive_subscription_message('mytopic', 'LowMessages', peek_lock=True)
if msg.body is not None:
print(msg.body)
msg.delete()
```

## How to handle application crashes and unreadable messages

Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, then it can call the `unlock` method on the **Message** object. This method causes Service Bus to unlock the message within the subscription and make it available to be received again, either by the same consuming application or by another consuming application.

There is also a timeout associated with a message locked within the subscription, and if the application fails to process the message before the lock timeout expires (for example, if the application crashes), then Service Bus unlocks the message automatically and makes it available to be received again.

In the event that the application crashes after processing the message but before the `delete` method is called, then the message will be redelivered to the application when it restarts. This behavior is often called. At least Once Processing\*; that is, each message is processed at least once but in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then application developers should add additional logic to their application to handle duplicate message delivery. To do so, you can use the **MessageId** property of the message, which remains constant across delivery attempts.

## Delete topics and subscriptions

Topics and subscriptions are persistent unless the [auto_delete_on_idle property](https://docs.microsoft.com/python/api/azure-mgmt-servicebus/azure.mgmt.servicebus.models.sbsubscription?view=azure-python) is set. They can be deleted either through the [Azure portal][Azure portal] or programmatically. The following example shows how to delete the topic named `mytopic`:

```python
bus_service.delete_topic('mytopic')
```

Deleting a topic also deletes any subscriptions that are registered with the topic. Subscriptions can also be deleted independently. The following code shows how to delete a subscription named `HighMessages` from the `mytopic` topic:

```python
bus_service.delete_subscription('mytopic', 'HighMessages')
```

> [!NOTE]
> You can manage Service Bus resources with [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/). The Service Bus Explorer allows users to connect to a Service Bus namespace and administer messaging entities in an easy manner. The tool provides advanced features like import/export functionality or the ability to test topic, queues, subscriptions, relay services, notification hubs and events hubs. 

## Next steps

Now that you've learned the basics of Service Bus topics, follow these links to learn more.

* See [Queues, topics, and subscriptions][Queues, topics, and subscriptions].
* Reference for [SqlFilter.SqlExpression][SqlFilter.SqlExpression].

[Azure portal]: https://portal.azure.com
[Azure Python package]: https://pypi.python.org/pypi/azure  
[Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[SqlFilter.SqlExpression]: service-bus-messaging-sql-filter.md
[Service Bus quotas]: service-bus-quotas.md 
