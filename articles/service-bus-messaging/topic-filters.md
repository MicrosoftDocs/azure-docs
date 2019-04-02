---
title: Azure Service Bus topic filters | Microsoft Docs
description: Filter Azure Service Bus topics
services: service-bus-messaging
documentationcenter: ''
author: clemensv
manager: timlt
editor: ''

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/26/2018
ms.author: spelluru

---

# Topic filters and actions

Subscribers can define which messages they want to receive from a topic. These messages are specified in the form of one or more named subscription rules. Each rule consists of a condition that selects particular messages and an action that annotates the selected message. For each matching rule condition, the subscription produces a copy of the message, which may be differently annotated for each matching rule.

Each newly created topic subscription has an initial default subscription rule. If you don't explicitly specify a filter condition for the rule, the applied filter is the **true** filter that enables all messages to be selected into the subscription. The default rule has no associated annotation action.

Service Bus supports three filter conditions:

-   *Boolean filters* - The **TrueFilter** and **FalseFilter** either cause all arriving messages (**true**) or none of the arriving messages (**false**) to be selected for the subscription.

-   *SQL Filters* - A **SqlFilter** holds a SQL-like conditional expression that is evaluated in the broker against the arriving messages' user-defined properties and system properties. All system properties must be prefixed with `sys.` in the conditional expression. The [SQL-language subset for filter conditions](service-bus-messaging-sql-filter.md) tests for the existence of properties (`EXISTS`), as well as for null-values (`IS NULL`), logical NOT/AND/OR, relational operators, simple numeric arithmetic, and simple text pattern matching with `LIKE`.

-   *Correlation Filters* - A **CorrelationFilter** holds a set of conditions that are matched against one or more of an arriving message's user and system properties. A common use is to match against the **CorrelationId** property, but the application can also choose to match against **ContentType**, **Label**, **MessageId**, **ReplyTo**, **ReplyToSessionId**, **SessionId**, **To**, and any user-defined properties. A match exists when an arriving message's value for a property is equal to the value specified in the correlation filter. For string expressions, the comparison is case-sensitive. When specifying multiple match properties, the filter combines them as a logical AND condition, meaning for the filter to match, all conditions must match.

All filters evaluate message properties. Filters cannot evaluate the message body.

Complex filter rules require processing capacity. In particular, the use of SQL filter rules results in lower overall message throughput at the subscription, topic, and namespace level. Whenever possible, applications should choose correlation filters over SQL-like filters, since they are much more efficient in processing and therefore have less impact on throughput.

## Actions

With SQL filter conditions, you can define an action that can annotate the message by adding, removing, or replacing properties and their values. The action [uses a SQL-like expression](service-bus-messaging-sql-filter.md) that loosely leans on the SQL UPDATE statement syntax. The action is performed on the message after it has been matched and before the message is selected into the subscription. The changes to the message properties are private to the message copied into the subscription.

## Usage patterns

The simplest usage scenario for a topic is that every subscription gets a copy of each message sent to a topic, which enables a broadcast pattern.

Filters and actions enable two further groups of patterns: partitioning and routing.

Partitioning uses filters to distribute messages across several existing topic subscriptions in a predictable and mutually exclusive manner. The partitioning pattern is used when a system is scaled out to handle many different contexts in functionally identical compartments that each hold a subset of the overall data; for example, customer profile information. With partitioning, a publisher submits the message into a topic without requiring any knowledge of the partitioning model. The message then is moved to the correct subscription from which it can then be retrieved by the partition's message handler.

Routing uses filters to distribute messages across topic subscriptions in a predictable fashion, but not necessarily exclusive. In conjunction with the [auto forwarding](service-bus-auto-forwarding.md) feature, topic filters can be used to create complex routing graphs within a Service Bus namespace for message distribution within an Azure region. With Azure Functions or Azure Logic Apps acting as a bridge between Azure Service Bus namespaces, you can create complex global topologies with direct integration into line-of-business applications.

## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [SQLFilter syntax](service-bus-messaging-sql-filter.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)