---
title: Apache Kafka output binding for Azure Functions
description: Learn to write to an Apache Kafka stream from an Azure Functions app.
author: craigshoemaker
ms.topic: reference
ms.date: 06/14/2021
ms.author: cshoe
---

# Apache Kafka output binding for Azure Functions

The output binding allows an Azure Functions app to write messages to a Kafka topic. Both keys and values types are supported with built-in [Avro](http://avro.apache.org/docs/current/) and [Protobuf](https://developers.google.com/protocol-buffers/) serialization.

# [C#](#tab/csharp)

```csharp
[FunctionName("ProduceStringTopic")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
    [Kafka("stringTopicTenPartitions", BrokerList = "LocalBroker")] IAsyncCollector<KafkaEventData<string>> events,
    ILogger log)
{
    var kafkaEvent = new KafkaEventData<string>()
    {
        Value = await new StreamReader(req.Body).ReadToEndAsync(),
    };

    await events.AddAsync(kafkaEvent);

    return new OkResult();
}
```

To define a key of type `string`, declare the key value as `KafkaEventData<string, string>`. Supported key types include `int`, `long`, `string`, and `byte[]`.

To produce messages using Protobuf serialization, use a `KafkaEventData<MyProtobufClass>` as the message type. The `MyProtobufClass` must implement the `IMessage` interface.

For Avro, provide a type that implements `ISpecificRecord`. If nothing is defined, the value is set to a  `byte[]` type, and no key is set.

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

## Configuration

Customization of the Kafka extensions is available in the host file. The interface to Kafka is built on the [Confluent.Kafka](https://www.nuget.org/packages/Confluent.Kafka/) library, so some of the configuration is just a bridge to the producer and consumer.

```json
{
  "version": "2.0",
  "extensions": {
    "kafka": {
      "maxBatchSize": 100
    }
  }
}
```

### Configuration Settings

The Confluent.Kafka library is based on the [librdkafka](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md) C library. Some of the configuration required by librdkafka is also required in the binding configuration.

#### Extension configuration

| Setting |Description|Default Value|
| --- | --- | --- |
| MaxBatchSize | Maximum batch size when calling a Kafka triggered function. | 64 |
| SubscriberIntervalInSeconds | Defines the minimum frequency in messages are executed per function. Only if the message volume is less than MaxBatchSize / SubscriberIntervalInSeconds| 1 |
| ExecutorChannelCapacity | Defines the channel message capacity. Once capacity is reached, the Kafka subscriber pauses until the function catches up. | 1 |
| ChannelFullRetryIntervalInMs | Defines the subscriber retry interval in milliseconds used when attempting to add items to at-capacity channel. | 50 |

#### librdkafka configuration

The following settings are applicable in advanced scenarios. For more information, see the [librdkafka documentation](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md).

| Setting | librdkafka property | Trigger or Output |
| --- | --- | --- |
| ReconnectBackoffMs | reconnect.backoff.max.ms | Trigger |
| ReconnectBackoffMaxMs | reconnect.backoff.max.ms | Trigger |
| StatisticsIntervalMs | statistics.interval.ms | Trigger |
| SessionTimeoutMs | session.timeout.ms | Trigger |
| MaxPollIntervalMs | max.poll.interval.ms | Trigger |
| QueuedMinMessages | queued.min.messages | Trigger |
| QueuedMaxMessagesKbytes | queued.max.messages.kbytes | Trigger |
| MaxPartitionFetchBytes | max.partition.fetch.bytes | Trigger |
| FetchMaxBytes | fetch.max.bytes | Trigger |
| AutoCommitIntervalMs | auto.commit.interval.ms | Trigger |
| LibkafkaDebug | debug | Both |
| MetadataMaxAgeMs | metadata.max.age.ms | Both |
| SocketKeepaliveEnable | socket.keepalive.enable | Both |

> [!NOTE]
> The `MetadataMaxAgeMs` default value is `180000` and `SocketKeepaliveEnable` defaults to `true`, unless overridden by [librdkafka configuration properties](https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md). Refer to [Review default values for configuration settings](https://github.com/Azure/azure-functions-kafka-extension/issues/187) for details.

## Connecting to a secure Kafka broker

Both, trigger and output, can connect to a secure Kafka broker. The following attribute properties are available to establish a secure connection:

|Setting|librdkafka property|Description|
| --- | --- | --- |
| AuthenticationMode | sasl.mechanism | SASL mechanism to use for authentication |
| Username | sasl.username | SASL username for use with the PLAIN and SASL-SCRAM |
| Password | sasl.password | SASL password for use with the PLAIN and SASL-SCRAM |
| Protocol | security.protocol | Security protocol used to communicate with brokers |
| SslKeyLocation | ssl.key.location | Path to client's private key (PEM) used for authentication |
| SslKeyPassword | ssl.key.password | Password for client's certificate |
| SslCertificateLocation | ssl.certificate.location | Path to client's certificate |
| SslCaLocation | ssl.ca.location | Path to CA certificate file for verifying the broker's certificate |

Username and password should reference an Azure Functions application setting.

## Language support configuration

For non-C# languages, you can specify `cardinality` to allow batch processing.

|Setting|Description|Option|
| --- | --- | --- |
| cardinality | Set to `MANY` in order to enable batching. If omitted or set to one, a single message is passed to the function. For Java functions, if you set `MANY`, you need to set a `dataType`. | `ONE`, `MANY` |
| dataType | For Java functions, the type used to deserialize a kafka event. Required when you set cardinality to `MANY` | `string`, `binary`|

## Linux Premium plan configuration

To avoid a runtime error when loading the librdkafka library in the Linux Premium plan, add the following setting.

| Setting | Value | Description |
| --- | --- | --- |
| LD_LIBRARY_PATH| `/home/site/wwwroot/bin/runtimes/linux-x64/native` | librakafka library path |

## Connecting to Confluent Cloud in Azure

Connecting to a managed Kafka cluster as the one provided by [Confluent in Azure](https://www.confluent.io/azure/) requires a few more steps.

# [C#](#tab/csharp)

1. In the function trigger ensure that `Protocol`, `AuthenticationMode`, `Username`, `Password`, and `SslCaLocation` are set.

```c#
public static class ConfluentCloudTrigger
{
    [FunctionName(nameof(ConfluentCloudStringTrigger))]
    public static void ConfluentCloudStringTrigger(
        [KafkaTrigger("BootstrapServer", "my-topic",
            ConsumerGroup = "azfunc",
            Protocol = BrokerProtocol.SaslSsl,
            AuthenticationMode = BrokerAuthenticationMode.Plain,
            Username = "ConfluentCloudUsername",
            Password = "ConfluentCloudPassword")]
        KafkaEventData<string> kafkaEvent,
        ILogger logger)
    {
        logger.LogInformation(kafkaEvent.Value.ToString());
    }
}
```

1. In the Functions App application settings (or _local.settings.json_ during development), set the authentication credentials for your Confluent Cloud environment.

    - **BootstrapServer**: Contains the value of bootstrap server found in Confluent Cloud settings page. The value will resemble `xyz-xyzxzy.westeurope.azure.confluent.cloud:9092`.

    - **ConfluentCloudUsername**: The API access key obtained from the Confluent Cloud web
site.

    - **ConfluentCloudPassword**: The API secret obtained from the Confluent Cloud web site.

# [C# Script](#tab/csharp-script)

**TODO**

# [Java](#tab/Java)

**TODO**

# [JavaScript](#tab/JavaScript)

**TODO**

# [PowerShell](#tab/PowerShell)

**TODO**

# [Python](#tab/python)

---

## Next steps

- [Run a function from an Apache Kafka event stream](./functions-bindings-kafka-trigger.md)
