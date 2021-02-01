---
 title: include file
 description: include file
 services: service-bus-messaging
 author: spelluru
 ms.service: service-bus-messaging
 ms.topic: include
 ms.date: 01/22/2021
 ms.author: spelluru
 ms.custom: include file
---

## Examples

### Filter on system properties
To refer to a system property in a filter, use the following format: `sys.<system-property-name>`. 

```csharp
sys.Label LIKE '%bus%'`
sys.messageid = 'xxxx'
sys.correlationid like 'abc-%'
```

### Filter on message properties
Here are the examples of using message properties in a filter. You can access message properties using `user.property-name` or just `property-name`.

```csharp
MessageProperty = 'A'
SuperHero like 'SuperMan%'
```

### Filter on message properties with special characters
If the message property name has special characters, use double quotes (`"`) to enclose the property name. For example if the property name is `"http://schemas.microsoft.com/xrm/2011/Claims/EntityLogicalName"`, use the following syntax in the filter. 

```csharp
"http://schemas.microsoft.com/xrm/2011/Claims/EntityLogicalName" = 'account'
```

### Filter on message properties with numeric values
The following examples show how you can use properties with numeric values in filters. 

```csharp
MessageProperty = 1
MessageProperty > 1
MessageProperty > 2.08
MessageProperty = 1 AND MessageProperty2 = 3
MessageProperty = 1 OR MessageProperty2 = 3
```

### Parameter-based filters
Here are a few examples of using parameter-based filters. In these examples, `DataTimeMp` is a message property of type `DateTime` and `@dtParam` is a parameter passed to the filter as a `DateTime` object.

```csharp
DateTimeMp < @dtParam
DateTimeMp > @dtParam

(DateTimeMp2-DateTimeMp1) <= @timespan //@timespan is a parameter of type TimeSpan
DateTimeMp2-DateTimeMp1 <= @timespan
```

### Using IN and NOT IN

```csharp
StoreId IN('Store1', 'Store2', 'Store3')"

sys.To IN ('Store5','Store6','Store7') OR StoreId = 'Store8'

sys.To NOT IN ('Store1','Store2','Store3','Store4','Store5','Store6','Store7','Store8') OR StoreId NOT IN ('Store1','Store2','Store3','Store4','Store5','Store6','Store7','Store8')
```

For a C# sample, see [Topic Filters sample on GitHub](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Azure.Messaging.ServiceBus/BasicSendReceiveTutorialwithFilters).


### Set rule action for a SQL filter

```csharp
// instantiate the ManagementClient
this.mgmtClient = new ManagementClient(connectionString);

// create the SQL filter
var sqlFilter = new SqlFilter("source = @stringParam");

// assign value for the parameter
sqlFilter.Parameters.Add("@stringParam", "orders");

// instantiate the Rule = Filter + Action
var filterActionRule = new RuleDescription
{
    Name = "filterActionRule",
    Filter = sqlFilter,
    Action = new SqlRuleAction("SET source='routedOrders'")
};

// create the rule on Service Bus
await this.mgmtClient.CreateRuleAsync(topicName, subscriptionName, filterActionRule);
```

### Correlation filter using CorrelationID

```csharp
new CorrelationFilter("Contoso");
```

It filters messages with `CorrelationID` set to `Contoso`. 

### Correlation filter using system and user properties

```csharp
var filter = new CorrelationFilter();
filter.Label = "Important";
filter.ReplyTo = "johndoe@contoso.com";
filter.Properties["color"] = "Red";
```

It's equivalent to: `sys.ReplyTo = 'johndoe@contoso.com' AND sys.Label = 'Important' AND color = 'Red'`

