---
title: Apache Kafka trigger for Azure Functions
description: Learn to run an Azure Functions app from an Apache Kafka stream.
author: craigshoemaker
ms.topic: reference
ms.date: 06/14/2021
ms.author: cshoe
---

# Apache Kafka trigger for Azure Functions

Trigger a function based on a new Kafka event.

Kafka messages can be serialized to multiple formats. Currently the following formats are supported: `string`, [Avro](http://avro.apache.org/docs/current/), and [Protobuf](https://developers.google.com/protocol-buffers/).

## String binding

# [C#](#tab/csharp)

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

# [C# Script](#tab/csharp-script)

**TODO**

# [Java](#tab/Java)

**TODO**

# [JavaScript](#tab/JavaScript)

**TODO**

# [PowerShell](#tab/PowerShell)

**TODO**

# [Python](#tab/python)

**TODO**

---

## Avro binding

The Kafka trigger supports two methods for consuming Avro format:

- **Specific**: A concrete user-defined class is instantiated during message de-serialization.
- **Generic**: An Avro schema and a generic record instance are created during message de-serialization.

### Avro specific

# [C#](#tab/csharp)

1. Define a class that inherits from `ISpecificRecord`.
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

# [C# Script](#tab/csharp-script)

**TODO**

# [Java](#tab/Java)

**TODO**

# [JavaScript](#tab/JavaScript)

**TODO**

# [PowerShell](#tab/PowerShell)

**TODO**

# [Python](#tab/python)

**TODO**

---

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

# [C# Script](#tab/csharp-script)

**TODO**

# [Java](#tab/Java)

**TODO**

# [JavaScript](#tab/JavaScript)

**TODO**

# [PowerShell](#tab/PowerShell)

**TODO**

# [Python](#tab/python)

**TODO**

---

## Protobuf binding

# [C#](#tab/csharp)

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

# [C# Script](#tab/csharp-script)

**TODO**

# [Java](#tab/Java)

**TODO**

# [JavaScript](#tab/JavaScript)

**TODO**

# [PowerShell](#tab/PowerShell)

**TODO**

# [Python](#tab/python)

**TODO**

---

## Next steps

- [Write to an Apache Kafka stream from a function](./functions-bindings-kafka-output.md)
