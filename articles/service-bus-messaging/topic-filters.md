---
title: Azure Service Bus topic filters | Microsoft Docs
description: This article explains how subscribers can define which messages they want to receive from a topic by specifying filters. 
ms.topic: conceptual
ms.date: 02/28/2023
---

# Topic filters and actions

Subscribers can define which messages they want to receive from a topic. These messages are specified in the form of one or more named subscription rules. Each rule consists of a **filter condition** that selects particular messages, and **optionally** contain an **action** that annotates the selected message. 

All rules **without actions** are combined using an `OR` condition and result in a **single message** on the subscription even if you have multiple matching rules. 

Each rule **with an action** produces a copy of the message. This message will have a property called `RuleName` where the value is the name of the matching rule. The action may add or update properties, or delete properties from the original message to produce a message on the subscription. 

Consider the following scenario:

- Subscription has five rules.
- Two rules contain actions.
- Three rules don't contain actions.

In this example, if you send one message that matches all five rules, you get three messages on the subscription. That's two messages for two rules with actions and one message for three rules without actions. 

Each newly created topic subscription has an initial default subscription rule. If you don't explicitly specify a filter condition for the rule, the applied filter is the **true** filter that enables all messages to be selected into the subscription. The default rule has no associated annotation action.

## Filters
Service Bus supports three types of filters:

- SQL filters
- Boolean filters
- Correlation filters

The following sections provide details about these filters.

### SQL filters
A **SqlFilter** holds a SQL-like conditional expression that's evaluated in the broker against the arriving messages' user-defined properties and system properties. All system properties must be prefixed with `sys.` in the conditional expression. The [SQL-language subset for filter conditions](service-bus-messaging-sql-filter.md) tests for the existence of properties (`EXISTS`), null-values (`IS NULL`), logical `NOT`/`AND`/`OR`, relational operators, simple numeric arithmetic, and simple text pattern matching with `LIKE`.

Here's a .NET example for defining a SQL filter:

```csharp
adminClient = new ServiceBusAdministrationClient(connectionString);    

// Create a SQL filter with color set to blue and quantity to 10
await adminClient.CreateSubscriptionAsync(
		new CreateSubscriptionOptions(topicName, "ColorBlueSize10Orders"), 
		new CreateRuleOptions("BlueSize10Orders", new SqlRuleFilter("color='blue' AND quantity=10")));

// Create a SQL filter with color set to red
// Action is defined to set the quantity to half if the color is red
await adminClient.CreateRuleAsync(topicName, "ColorRed", new CreateRuleOptions 
{ 
	Name = "RedOrdersWithAction",
	Filter = new SqlRuleFilter("user.color='red'"),
	Action = new SqlRuleAction("SET quantity = quantity / 2;")
}
```
### Boolean filters
The **TrueFilter** and **FalseFilter** either cause all arriving messages (**true**) or none of the arriving messages (**false**) to be selected for the subscription. These two filters derive from the SQL filter. 

Here's a .NET example for defining a boolean filter:

```csharp
// Create a True Rule filter with an expression that always evaluates to true
// It's equivalent to using SQL rule filter with 1=1 as the expression
await adminClient.CreateSubscriptionAsync(
		new CreateSubscriptionOptions(topicName, subscriptionAllOrders), 
		new CreateRuleOptions("AllOrders", new TrueRuleFilter()));	
```
### Correlation filters
A **CorrelationFilter** holds a set of conditions that are matched against one or more of an arriving message's user and system properties. A common use is to match against the **CorrelationId** property, but the application can also choose to match against the following properties:

- `ContentType`
- `Label`
- `MessageId`
- `ReplyTo`
- `ReplyToSessionId`
- `SessionId` 
- `To`
- any user-defined properties. 
	 
A match exists when an arriving message's value for a property is equal to the value specified in the correlation filter. For string expressions, the comparison is case-sensitive. If you specify multiple match properties, the filter combines them as a logical AND condition, meaning for the filter to match, all conditions must match.

Here's a .NET example for defining a correlation filter:

```csharp
// Create a correlation filter with color set to Red and priority set to High
await adminClient.CreateSubscriptionAsync(
		new CreateSubscriptionOptions(topicName, "HighPriorityRedOrders"), 
		new CreateRuleOptions("HighPriorityRedOrdersRule", new CorrelationRuleFilter() {Subject = "red", CorrelationId = "high"} ));	
```

Use the [`CorrelationRuleFilter` constructor that takes a `String` argument](/dotnet/api/azure.messaging.servicebus.administration.correlationrulefilter.-ctor#azure-messaging-servicebus-administration-correlationrulefilter-ctor(system-string)) to create a correlation filter with a correlation ID. 

When you use the [`CorrelationRuleFilter` default constructor](/dotnet/api/azure.messaging.servicebus.administration.correlationrulefilter.-ctor#azure-messaging-servicebus-administration-correlationrulefilter-ctor), you can assign system properties (`ContentType`, `Label`, `MessageId`, `ReplyTo`, `ReplyToSessionId`, `SessionId`, `To`), and user-defined properties for filtering. To specify user-defined properties for correlation filter, use the property `Properties` of type `IDictionary <string, object>`. Keys for this dictionary are the user-defined properties to look up on messages. Values associated with keys are the values to correlate on. Here’s an example. 

```csharp
var filter = new CorrelationFilter();
filter.Label = "abc";
filter.ReplyTo = "xdeu@hotmail.com";
filter.Properties["prop1"] = "abc";
filter.Properties["prop2"] = "xyz";
```


> [!NOTE]
> - All filters evaluate message properties. Filters can't evaluate the message body.
> - Complex filter rules require processing capacity. In particular, the use of SQL filter rules cause lower overall message throughput at the subscription, topic, and namespace level. Whenever possible, applications should choose correlation filters over SQL-like filters because they're much more efficient in processing and have less impact on throughput.

## Actions
With SQL filter conditions, you can define an action that can annotate the message by adding, removing, or replacing properties and their values. The action [uses a SQL-like expression](service-bus-messaging-sql-rule-action.md) that loosely leans on the `SQL UPDATE` statement syntax. The action is done on the message after it has been matched and before the message is selected into the subscription. The changes to the message properties are private to the message copied into the subscription.

Here's a .NET example that creates a SQL rule with an action to update the quantity when the color is Red. 

```csharp
adminClient = new ServiceBusAdministrationClient(connectionString);    

// Create a SQL filter with color set to red
// Action is defined to set the quantity to half if the color is red
await adminClient.CreateRuleAsync(topicName, "ColorRed", new CreateRuleOptions 
{ 
	Name = "RedOrdersWithAction",
	Filter = new SqlRuleFilter("user.color='red'"),
	Action = new SqlRuleAction("SET quantity = quantity / 2;")
}
```

## Usage patterns

- **Broadcast** pattern

    The simplest usage scenario for a topic is that every subscription gets a copy of each message sent to a topic, which enables a broadcast pattern.
- **Partitioning** pattern

    Partitioning uses filters to distribute messages across several existing topic subscriptions in a predictable and **mutually exclusive** manner. The partitioning pattern is used when a system is scaled out to handle many different contexts in functionally identical compartments that each hold a subset of the overall data; for example, customer profile information. With partitioning, a publisher submits the message into a topic without requiring any knowledge of the partitioning model. The message then is moved to the correct subscription from which it can then be retrieved by the partition's message handler.
- **Routing** pattern

    Routing uses filters to distribute messages across topic subscriptions in a predictable fashion, but **not necessarily exclusive**. In conjunction with the [auto forwarding](service-bus-auto-forwarding.md) feature, topic filters can be used to create complex routing graphs within a Service Bus namespace for message distribution within an Azure region. With Azure Functions or Azure Logic Apps acting as a bridge between Azure Service Bus namespaces, you can create complex global topologies with direct integration into line-of-business applications.
    
> [!NOTE]
> Because the Azure portal now supports Service Bus Explorer functionality, subscription filters can be created or edited from the portal. 

## Next steps
For more examples, see [Service Bus filter examples](service-bus-filter-examples.md).