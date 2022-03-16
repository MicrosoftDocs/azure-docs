---
title: Apache Kafka trigger for Azure Functions
description: Learn to run an Azure Functions app from an Apache Kafka stream.
author: craigshoemaker
ms.topic: reference
ms.date: 06/14/2021
ms.author: cshoe
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Apache Kafka trigger for Azure Functions

Trigger a function based on a new Kafka event.

Kafka messages can be serialized to multiple formats. Currently the following formats are supported: 

# [JSON](#tab/string)

String format is supported for JSON payloads.

# [Avro](#tab/avro)

The Kafka trigger supports two methods for consuming [Avro format](http://avro.apache.org/docs/current/):

- **Specific**: A concrete user-defined class is instantiated during message de-serialization.
- **Generic**: An Avro schema and a generic record instance are created during message de-serialization.

# [Protobuf](#tab/protobuf)

[Protobuf](https://developers.google.com/protocol-buffers/

---

## Example
::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]


# [JSON](#tab/string/in-process)

```csharp
public static void StringTopic(
    [KafkaTrigger("BrokerList", "myTopic", ConsumerGroup = "myGroupId")] KafkaEventData<string>[] kafkaEvents,
    ILogger logger)
{
    foreach (var kafkaEvent in kafkaEvents)
    {
      logger.LogInformation(kafkaEvent.Value);
    }
}
```

# [Avro](#tab/avro/in-process)

In the first example, a `UserRecord` class, which inherits from `ISpecificRecord`, is instantiated during message de-serialization.
1. The parameter where `KafkaTrigger` is added should have a value type of the class defined in previous step: `KafkaEventData<MySpecificRecord>`

```csharp
public class UserRecord : ISpecificRecord
{
    public const string SchemaText = @"    {
  ""type"": ""record"",
  ""name"": ""UserRecord"",
  ""namespace"": ""KafkaFunctionSample"",
  ""fields"": [
    {
      ""name"": ""registertime"",
      ""type"": ""long""
    },
    {
      ""name"": ""userid"",
      ""type"": ""string""
    },
    {
      ""name"": ""regionid"",
      ""type"": ""string""
    },
    {
      ""name"": ""gender"",
      ""type"": ""string""
    }
  ]
}";

  public static Schema _SCHEMA = Schema.Parse(SchemaText);

    [JsonIgnore]
    public virtual Schema Schema => _SCHEMA;
    public long RegisterTime { get; set; }
    public string UserID { get; set; }
    public string RegionID { get; set; }
    public string Gender { get; set; }

    public virtual object Get(int fieldPos)
    {
        switch (fieldPos)
        {
            case 0: return this.RegisterTime;
            case 1: return this.UserID;
            case 2: return this.RegionID;
            case 3: return this.Gender;
            default: throw new AvroRuntimeException("Bad index " + fieldPos + " in Get()");
        };
    }
    public virtual void Put(int fieldPos, object fieldValue)
    {
        switch (fieldPos)
        {
            case 0: this.RegisterTime = (long)fieldValue; break;
            case 1: this.UserID = (string)fieldValue; break;
            case 2: this.RegionID = (string)fieldValue; break;
            case 3: this.Gender = (string)fieldValue; break;
            default: throw new AvroRuntimeException("Bad index " + fieldPos + " in Put()");
        };
    }
}


public static void User(
    [KafkaTrigger("BrokerList", "users", ConsumerGroup = "myGroupId")] KafkaEventData<UserRecord>[] kafkaEvents,
    ILogger logger)
{
    foreach (var kafkaEvent in kafkaEvents)
    {
        var user = kafkaEvent.Value;
        logger.LogInformation($"{JsonConvert.SerializeObject(kafkaEvent.Value)}");
    }
}
```

### Avro generic

# [C#](#tab/csharp)

1. In `KafkaTrigger` attribute set the value of `AvroSchema` to the string representation of it.
1. The parameter type used with the trigger must be of type `KafkaEventData<GenericRecord>`.

The sample function contains one consumer using Avro generic. Check the class `AvroGenericTriggers`.

```csharp
public static class AvroGenericTriggers
{
      const string PageViewsSchema = @"{
  ""type"": ""record"",
  ""name"": ""pageviews"",
  ""namespace"": ""ksql"",
  ""fields"": [
    {
      ""name"": ""viewtime"",
      ""type"": ""long""
    },
    {
      ""name"": ""userid"",
      ""type"": ""string""
    },
    {
      ""name"": ""pageid"",
      ""type"": ""string""
    }
  ]
}";

[FunctionName(nameof(PageViews))]
public static void PageViews(
    [KafkaTrigger("BrokerList", "pageviews", AvroSchema = PageViewsSchema, ConsumerGroup = "myGroupId")] KafkaEventData<GenericRecord> kafkaEvent,
    ILogger logger)
{
    if (kafkaEvent.Value != null)
    {
        // Get the field values manually from genericRecord (kafkaEvent.Value)
    }
}
```


# [Protobuf](#tab/protobuf/in-process)

Protobuf is supported in the trigger based on the `Google.Protobuf` NuGet package. To consume a topic using protobuf serialization, set the `TValue` generic argument to be of a type that implements `Google.Protobuf.IMessage`. The sample producer has a producer for topic `protoUser` (must be created). The sample function has a trigger handler for this topic in class `ProtobufTriggers`.

```csharp
public static class ProtobufTriggers
{
    [FunctionName(nameof(ProtobufUser))]
    public static void ProtobufUser(
        [KafkaTrigger("BrokerList", "protoUser", ConsumerGroup = "myGroupId")] KafkaEventData<ProtoUser>[] kafkaEvents,
        ILogger logger)
    {
        foreach (var kafkaEvent in kafkaEvents)
        {
            var user = kafkaEvent.Value;
            logger.LogInformation($"{JsonConvert.SerializeObject(user)}");
        }
    }
}
```

# [JSON](#tab/string/isolated-process)

Here is some code 

:::code language="csharp" source="~/azure-functions-kafka-extension/test/Microsoft.Azure.WebJobs.Extensions.Kafka.LangEndToEndTests/FunctionApps/dotnet-isolated/EventHub/SingleKafkaTriggerQueueOutput.cs" range="18-34" :::



# [Avro](#tab/avro/isolated-process)

# [Protobuf](#tab/protobuf/isolated-process)

# [JSON](#tab/string/csharp-script)

# [Avro](#tab/avro/csharp-script)

# [Protobuf](#tab/protobuf/csharp-script)

---

::: zone-end
::: zone pivot="programming-language-javascript"


---

::: zone-end  
::: zone pivot="programming-language-powershell" 



---
 
Complete PowerShell examples are pending.
::: zone-end 
::: zone pivot="programming-language-python"  



---


::: zone-end
::: zone pivot="programming-language-java"


---

::: zone-end
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated process](dotnet-isolated-process-guide.md) C# libraries use the `KafkaTriggerAttribute` to define the function trigger. C# script instead uses a function.json configuration file.

# [In-process](#tab/in-process)

The following table explains the properties you can set using this trigger attribute:

| Property |Description|
| --- | --- |
| 

# [Isolated process](#tab/isolated-process)

The following table explains the properties you can set using this trigger attribute:

| Property |Description|
| --- | --- |

# [C# script](#tab/csharp-script)

C# script uses a *function.json* file for configuration instead of attributes. The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|----------------------|

---

::: zone-end

## Next steps

- [Write to an Apache Kafka stream from a function](./functions-bindings-kafka-output.md)
