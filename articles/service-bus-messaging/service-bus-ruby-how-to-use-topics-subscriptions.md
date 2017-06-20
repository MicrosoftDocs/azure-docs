---
title: How to use Service Bus topics (Ruby) | Microsoft Docs
description: Learn how to use Service Bus topics and subscriptions in Azure. Code samples are written for Ruby applications.
services: service-bus-messaging
documentationcenter: ruby
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: 3ef2295e-7c5f-4c54-a13b-a69c8045d4b6
ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: ruby
ms.topic: article
ms.date: 04/27/2017
ms.author: sethm

---
# How to Use Service Bus Topics/Subscriptions
[!INCLUDE [service-bus-selector-topics](../../includes/service-bus-selector-topics.md)]

This article describes how to use Service Bus topics and subscriptions from Ruby applications. The scenarios covered include **creating topics and subscriptions, creating subscription filters, sending messages** to a topic, **receiving messages from a subscription**, and **deleting topics and subscriptions**. For more information on topics and subscriptions, see the [Next Steps](#next-steps) section.

[!INCLUDE [howto-service-bus-topics](../../includes/howto-service-bus-topics.md)]

[!INCLUDE [service-bus-create-namespace-portal](../../includes/service-bus-create-namespace-portal.md)]

## Create a Ruby application
For instructions, see [Create a Ruby Application on Azure](../virtual-machines/linux/classic/virtual-machines-linux-classic-ruby-rails-web-app.md).

## Configure Your application to Use Service Bus
To use Service Bus, download and use the Azure Ruby package, which includes a set of convenience libraries that communicate with the storage REST services.

### Use RubyGems to obtain the package
1. Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix).
2. Type "gem install azure" in the command window to install the gem and dependencies.

### Import the package
Using your favorite text editor, add the following to the top of the Ruby file in which you intend to use storage:

```ruby
require "azure"
```

## Set up a Service Bus connection
The Azure module reads the environment variables **AZURE\_SERVICEBUS\_NAMESPACE** and **AZURE\_SERVICEBUS\_ACCESS\_KEY**
for information required to connect to your namespace. If these environment variables are not set, you must specify the namespace information before using **Azure::ServiceBusService** with the following code:

```ruby
Azure.config.sb_namespace = "<your azure service bus namespace>"
Azure.config.sb_access_key = "<your azure service bus access key>"
```

Set the namespace value to the value you created rather than the entire URL. For example, use **"yourexamplenamespace"**, not "yourexamplenamespace.servicebus.windows.net".

## Create a topic
The **Azure::ServiceBusService** object enables you to work with topics. The following code creates an **Azure::ServiceBusService** object. To create a topic, use the **create\_topic()** method. The following example creates a topic or prints out the errors if there are any.

```ruby
azure_service_bus_service = Azure::ServiceBusService.new
begin
  topic = azure_service_bus_service.create_queue("test-topic")
rescue
  puts $!
end
```

You can also pass a **Azure::ServiceBus::Topic** object with additional options, which allow you to override default topic settings such as message time to live or maximum queue size. The following example shows setting the maximum queue size to 5GB and time to live to 1 minute:

```ruby
topic = Azure::ServiceBus::Topic.new("test-topic")
topic.max_size_in_megabytes = 5120
topic.default_message_time_to_live = "PT1M"

topic = azure_service_bus_service.create_topic(topic)
```

## Create subscriptions
Topic subscriptions are also created with the **Azure::ServiceBusService** object. Subscriptions are named and can have an optional filter that restricts the set of messages delivered to the subscription's virtual queue.

Subscriptions are persistent and will continue to exist until either they, or the topic they are associated with, are deleted. If your application contains logic to create a subscription, it should first check if the subscription already exists by using the getSubscription method.

### Create a subscription with the default (MatchAll) filter
The **MatchAll** filter is the default filter that is used if no filter is specified when a new subscription is created. When the **MatchAll** filter is used, all messages published to the topic are placed in the subscription's virtual queue. The following example creates a subscription named "all-messages" and uses the default **MatchAll** filter.

```ruby
subscription = azure_service_bus_service.create_subscription("test-topic", "all-messages")
```

### Create subscriptions with filters
You can also define filters that enable you to specify which messages sent to a topic should show up within a specific subscription.

The most flexible type of filter supported by subscriptions is the **Azure::ServiceBus::SqlFilter**, which implements a subset of SQL92. SQL filters operate on the properties of the messages that are published to the topic. For more details about the expressions that can be used with a SQL filter, review the [SqlFilter](service-bus-messaging-sql-filter.md) syntax.

You can add filters to a subscription by using the **create\_rule()** method of the **Azure::ServiceBusService** object. This method enables you to add new filters to an existing subscription.

Since the default filter is applied automatically to all new subscriptions, you must first remove the default filter, or the **MatchAll** will override any other filters you may specify. You can remove the default rule by using the **delete\_rule()** method on the **Azure::ServiceBusService** object.

The following example creates a subscription named "high-messages" with a **Azure::ServiceBus::SqlFilter** that only selects messages that have a custom **message\_number** property greater than 3:

```ruby
subscription = azure_service_bus_service.create_subscription("test-topic", "high-messages")
azure_service_bus_service.delete_rule("test-topic", "high-messages", "$Default")

rule = Azure::ServiceBus::Rule.new("high-messages-rule")
rule.topic = "test-topic"
rule.subscription = "high-messages"
rule.filter = Azure::ServiceBus::SqlFilter.new({
  :sql_expression => "message_number > 3" })
rule = azure_service_bus_service.create_rule(rule)
```

Similarly, the following example creates a subscription named "low-messages" with a **Azure::ServiceBus::SqlFilter** that only selects messages that have a **message_number** property less than or equal to 3:

```ruby
subscription = azure_service_bus_service.create_subscription("test-topic", "low-messages")
azure_service_bus_service.delete_rule("test-topic", "low-messages", "$Default")

rule = Azure::ServiceBus::Rule.new("low-messages-rule")
rule.topic = "test-topic"
rule.subscription = "low-messages"
rule.filter = Azure::ServiceBus::SqlFilter.new({
  :sql_expression => "message_number <= 3" })
rule = azure_service_bus_service.create_rule(rule)
```

When a message is now sent to "test-topic", it is always be delivered to receivers subscribed to the "all-messages" topic subscription, and selectively delivered to receivers subscribed to the "high-messages" and "low-messages" topic subscriptions (depending upon the message content).

## Send messages to a topic
To send a message to a Service Bus topic, your application must use the **send\_topic\_message()** method on the **Azure::ServiceBusService** object. Messages sent to Service Bus topics are instances of the **Azure::ServiceBus::BrokeredMessage** objects. **Azure::ServiceBus::BrokeredMessage** objects have a set of standard properties (such as **label** and **time\_to\_live**), a dictionary that is used to hold custom application-specific properties, and a body of string data. An application can set the body of the message by passing a string value to the **send\_topic\_message()** method and any required standard properties will be populated by default values.

The following example demonstrates how to send five test messages to "test-topic". Note that the **message_number** custom property value of each message varies on the iteration of the loop (this determines which subscription receives it):

```ruby
5.times do |i|
  message = Azure::ServiceBus::BrokeredMessage.new("test message " + i,
    { :message_number => i })
  azure_service_bus_service.send_topic_message("test-topic", message)
end
```

Service Bus topics support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). The header, which includes the standard and custom application properties, can have
a maximum size of 64 KB. There is no limit on the number of messages held in a topic but there is a cap on the total size of the messages held by a topic. This topic size is defined at creation time, with an upper limit of 5 GB.

## Receive messages from a subscription
Messages are received from a subscription using the **receive\_subscription\_message()** method on the **Azure::ServiceBusService** object. By default, messages are read(peak) and locked without deleting it from the subscription. You can read and delete the message from the subscription by setting the **peek\_lock** option to **false**.

The default behavior makes the reading and deleting a two-stage operation, which also makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by calling **delete\_subscription\_message()** method and providing the message to be deleted as a parameter. The **delete\_subscription\_message()** method will mark the message as being consumed and remove it from the subscription.

If the **:peek\_lock** parameter is set to **false**, reading and deleting the message becomes the simplest model, and works best for scenarios in which an application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked the message as being consumed, then when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.

The following example demonstrates how messages can be received and processed using **receive\_subscription\_message()**. The example first receives and deletes a message from the "low-messages" subscription by using **:peek\_lock** set to **false**, then it receives another message from the "high-messages" and then deletes the message using **delete\_subscription\_message()**:

```ruby
message = azure_service_bus_service.receive_subscription_message(
  "test-topic", "low-messages", { :peek_lock => false })
message = azure_service_bus_service.receive_subscription_message(
  "test-topic", "high-messages")
azure_service_bus_service.delete_subscription_message(message)
```

## Handle application crashes and unreadable messages
Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, then it can call the **unlock\_subscription\_message()** method on the **Azure::ServiceBusService** object. This causes Service Bus to unlock the message within the subscription and make it available to be received again, either by the same consuming application or by another consuming application.

There is also a timeout associated with a message locked within the subscription, and if the application fails to process the message before the lock timeout expires (for example, if the application crashes), then Service Bus will unlock the message automatically and make it available to be received again.

In the event that the application crashes after processing the message but before the **delete\_subscription\_message()** method is called, then the message is redelivered to the application when it restarts. This is often called *At Least Once Processing*; that is, each message will be processed at least once but in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then application developers should add additional logic to their application to handle duplicate message delivery. This logic is often achieved using the **message\_id** property of the message, which will remain constant across delivery attempts.

## Delete topics and subscriptions
Topics and subscriptions are persistent, and must be explicitly deleted either through the [Azure portal][Azure portal] or programmatically. The example below demonstrates how to delete the topic named "test-topic".

```ruby
azure_service_bus_service.delete_topic("test-topic")
```

Deleting a topic also deletes any subscriptions that are registered with the topic. Subscriptions can also be deleted independently. The following code demonstrates how to delete the subscription named "high-messages" from the "test-topic" topic:

```ruby
azure_service_bus_service.delete_subscription("test-topic", "high-messages")
```

## Next steps
Now that you've learned the basics of Service Bus topics, follow these links to learn more.

* See [Queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md).
* API reference for [SqlFilter](/dotnet/api/microsoft.servicebus.messaging.sqlfilter#microsoft_servicebus_messaging_sqlfilter).
* Visit the [Azure SDK for Ruby](https://github.com/Azure/azure-sdk-for-ruby) repository on GitHub.

[Azure portal]: https://portal.azure.com
