---
title: Set subscriptions filters in Azure Service Bus | Microsoft Docs
description: This article provides examples for defining filters and actions on Azure Service Bus topic subscriptions.
ms.topic: how-to
ms.date: 02/17/2021
---

# Set subscription filters (Azure Service Bus)
This article provides a few examples on setting filters on Service Bus topic subscriptions. For conceptual information about filters, see [Filters](topic-filters.md).

## Filter on system properties
To refer to a system property in a filter, use the following format: `sys.<system-property-name>`. 

```csharp
sys.label LIKE '%bus%'`
sys.messageid = 'xxxx'
sys.correlationid like 'abc-%'
```

## Filter on message properties
Here are the examples of using message properties in a filter. You can access message properties using `user.property-name` or just `property-name`.

```csharp
MessageProperty = 'A'
SuperHero like 'SuperMan%'
```

## Filter on message properties with special characters
If the message property name has special characters, use double quotes (`"`) to enclose the property name. For example if the property name is `"http://schemas.microsoft.com/xrm/2011/Claims/EntityLogicalName"`, use the following syntax in the filter. 

```csharp
"http://schemas.microsoft.com/xrm/2011/Claims/EntityLogicalName" = 'account'
```

## Filter on message properties with numeric values
The following examples show how you can use properties with numeric values in filters. 

```csharp
MessageProperty = 1
MessageProperty > 1
MessageProperty > 2.08
MessageProperty = 1 AND MessageProperty2 = 3
MessageProperty = 1 OR MessageProperty2 = 3
```

## Parameter-based filters
Here are a few examples of using parameter-based filters. In these examples, `DataTimeMp` is a message property of type `DateTime` and `@dtParam` is a parameter passed to the filter as a `DateTime` object.

```csharp
DateTimeMp < @dtParam
DateTimeMp > @dtParam

(DateTimeMp2-DateTimeMp1) <= @timespan //@timespan is a parameter of type TimeSpan
DateTimeMp2-DateTimeMp1 <= @timespan
```

## Using IN and NOT IN

```csharp
StoreId IN('Store1', 'Store2', 'Store3')"

sys.To IN ('Store5','Store6','Store7') OR StoreId = 'Store8'

sys.To NOT IN ('Store1','Store2','Store3','Store4','Store5','Store6','Store7','Store8') OR StoreId NOT IN ('Store1','Store2','Store3','Store4','Store5','Store6','Store7','Store8')
```

For a C# sample, see [Topic Filters sample on GitHub](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Azure.Messaging.ServiceBus/BasicSendReceiveTutorialwithFilters).


## Correlation filter using CorrelationID

```csharp
new CorrelationFilter("Contoso");
```

It filters messages with `CorrelationID` set to `Contoso`. 

## Correlation filter using system and user properties

```csharp
var filter = new CorrelationFilter();
filter.Label = "Important";
filter.ReplyTo = "johndoe@contoso.com";
filter.Properties["color"] = "Red";
```

It's equivalent to: `sys.ReplyTo = 'johndoe@contoso.com' AND sys.Label = 'Important' AND color = 'Red'`

## Next steps
See the following samples: 

- [.NET - Basic send and receive tutorial with filters](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted/BasicSendReceiveTutorialwithFilters/BasicSendReceiveTutorialWithFilters)
- [.NET - Topic filters](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/TopicFilters)
- [Azure Resource Manager template](/azure/templates/microsoft.servicebus/2017-04-01/namespaces/topics/subscriptions/rules)