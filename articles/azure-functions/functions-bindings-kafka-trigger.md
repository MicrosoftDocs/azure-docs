---
title: Apache Kafka trigger for Azure Functions
description: Learn to run an Azure Functions app from an Apache Kafka stream.
author: ggailey777
ms.topic: reference
ms.date: 03/14/2022
ms.author: glenga
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Apache Kafka trigger for Azure Functions

The Kafka trigger runs a function based on a new Kafka event.

## Example
::: zone pivot="programming-language-csharp"

The usage of the binding depends on the C# modality used in your function app, which can be one of the following:

# [In-process](#tab/in-process)

An [in-process class library](functions-dotnet-class-library.md) is a compiled C# function runs in the same process as the Functions runtime.
 
# [Isolated process](#tab/isolated-process)

An [isolated process class library](dotnet-isolated-process-guide.md) compiled C# function runs in a process isolated from the runtime. Isolated process is required to support C# functions running on .NET 5.0.  

---

Kafka messages can be serialized to multiple formats. A complete set of samples  

# [JSON](#tab/string/in-process)

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/KafkaFunctionSample/RawTypeTriggers.cs" range="14-20":::

# [Avro](#tab/avro/in-process)

The Kafka trigger supports two methods for consuming the [Avro format](http://avro.apache.org/docs/current/):

- **Specific**: A concrete user-defined class is instantiated during message de-serialization.
- **Generic**: An Avro schema and a generic record instance are created during message de-serialization.

In the first example, a specific `UserRecord` class, which inherits from `ISpecificRecord`, is instantiated during message de-serialization. The parameter to which the `KafkaTrigger` attribute is added should have a value type of the class defined in previous step: `KafkaEventData<UserRecord>`.

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

The next example is a generic class set to a specific Avro schema. In this example the `KafkaTrigger` attribute sets the value of the `AvroSchema` property to the string representation of the schema name. The parameter type used with the trigger is of type `KafkaEventData<GenericRecord>`.


```csharp
public static class GenericRecord
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

[Protobuf](https://developers.google.com/protocol-buffers/) is supported in the trigger based on the `Google.Protobuf` NuGet package. To consume a topic using protobuf serialization, set the `TValue` generic argument to be of a type that implements `Google.Protobuf.IMessage`. The sample producer has a producer for topic `protoUser` (must be created). The sample function has a trigger handler for this topic in class `ProtobufTriggers`.

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

The following example shows a Kafka trigger that writes output to a storage queue. 

:::code language="csharp" source="~/azure-functions-kafka-extension/test/Microsoft.Azure.WebJobs.Extensions.Kafka.LangEndToEndTests/FunctionApps/dotnet-isolated/EventHub/SingleKafkaTriggerQueueOutput.cs" range="18-34" :::

# [Avro](#tab/avro/isolated-process)

Isolated process only supported string (JSON) payloads.

# [Protobuf](#tab/protobuf/isolated-process)

Isolated process only supported string (JSON) payloads.

---


::: zone-end  
::: zone pivot="programming-language-javascript"

The following function.json defines the trigger for the specific provider:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTrigger/function.confluent.json" :::

# [Event Hubs](#tab/event-hub)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTrigger/function.eventhub.json" :::

---

The following code is run when the function is triggered:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTrigger/index.js" :::

For a complete set of working JavaScript examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/javascript/). 

::: zone-end  
::: zone pivot="programming-language-powershell" 



::: zone-end 
::: zone pivot="programming-language-python"  




::: zone-end
::: zone pivot="programming-language-java"


::: zone-end
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated process](dotnet-isolated-process-guide.md) C# libraries use the `KafkaTriggerAttribute` to define the function trigger. 

The following table explains the properties you can set using this trigger attribute:

| Parameter |Description|
| --- | --- |
| **BrokerList** | (Required) The list of Kafka brokers monitored by the trigger.  |
| **Topic** | (Required) The topic monitored by the trigger. |
| **ConsumerGroup** | (Optional) Kafka consumer group used by the trigger. |
| **AvroSchema** | (Optional) Schema of a generic record when using the Avro protocol. |
| **AuthenticationMode** | (Optional) The authentication  mode when using Simple Authentication and Security Layer (SASL) authentication. The supported values are `Gssapi`, `Plain` (default), `ScramSha256`, `ScramSha512`. |
| **Username** | (Optional) The username for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. | 
| **Password** | (Optional) The password for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. | 
| **Protocol** | (Optional) The security protocol used when communicating with brokers. The supported values are `plaintext` (default), `ssl`, `sasl_plaintext`, `sasl_ssl`. |
| **SslCaLocation** | (Optional) Path to CA certificate file for verifying the broker's certificate. |
| **SslCertificateLocation** | (Optional) Path to the client's certificate. |
| **SslKeyLocation** | (Optional) Path to client's private key (PEM) used for authentication. |
| **SslKeyPassword** | (Optional) Password for client's certificate. |


::: zone-end  
::: zone pivot="programming-language-java"

## Annotations

TBD

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"  

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

| _function.json_ property |Description|
| --- | --- |
|**type** | Must be set to `kafkaTrigger`. |
|**direction** | Must be set to `in`. |
|**name** | The name of the variable that represents the brokered data in function code. |
| **brokerList** | (Required) The list of Kafka brokers monitored by the trigger.  |
| **topic** | (Required) The topic monitored by the trigger. |
| **consumerGroup** | (Optional) Kafka consumer group used by the trigger. |
| **avroSchema** | (Optional) Schema of a generic record when using the Avro protocol. |
| **authenticationMode** | (Optional) The authentication  mode when using Simple Authentication and Security Layer (SASL) authentication. The supported values are `Gssapi`, `Plain` (default), `ScramSha256`, `ScramSha512`. |
| **username** | (Optional) The username for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. | 
| **password** | (Optional) The password for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. | 
| **protocol** | (Optional) The security protocol used when communicating with brokers. The supported values are `plaintext` (default), `ssl`, `sasl_plaintext`, `sasl_ssl`. |
| **sslCaLocation** | (Optional) Path to CA certificate file for verifying the broker's certificate. |
| **sslCertificateLocation** | (Optional) Path to the client's certificate. |
| **sslKeyLocation** | (Optional) Path to client's private key (PEM) used for authentication. |
| **sslKeyPassword** | (Optional) Password for client's certificate. |

::: zone-end

## Usage

::: zone pivot="programming-language-csharp"
Kafka messages can be serialized to multiple formats. Currently the following formats are supported: 

# [JSON](#tab/string)

String format is supported for JSON payloads.

# [Avro](#tab/avro)

The Kafka trigger supports two methods for consuming [Avro format](http://avro.apache.org/docs/current/):

- **Specific**: A concrete user-defined class is instantiated during message de-serialization.
- **Generic**: An Avro schema and a generic record instance are created during message de-serialization.

# [Protobuf](#tab/protobuf)

[Protobuf](https://developers.google.com/protocol-buffers/)

---

::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell" 

Kafka messages are currently supported as strings that are JSON payloads.

::: zone-end 

## Next steps

- [Write to an Apache Kafka stream from a function](./functions-bindings-kafka-output.md)
