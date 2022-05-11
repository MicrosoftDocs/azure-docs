---
title: Apache Kafka output binding for Azure Functions
description: Learn to write to an Apache Kafka stream from an Azure Functions app.
author: ggailey777
ms.topic: reference
ms.date: 03/14/2022
ms.author: glenga
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Apache Kafka output binding for Azure Functions

The output binding allows an Azure Functions app to write messages to a Kafka topic. 

## Example
::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [In-process](#tab/in-process)

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


For ConfluentCloud, make sure that `Protocol`, `AuthenticationMode`, `Username`, `Password`, and `SslCaLocation` are set in the trigger attribute.

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

# [Isolated process](#tab/isolated-process)


---

::: zone-end  
::: zone pivot="programming-language-javascript"



::: zone-end  
::: zone pivot="programming-language-powershell" 



::: zone-end 
::: zone pivot="programming-language-python"  




::: zone-end
::: zone pivot="programming-language-java"


::: zone-end
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated process](dotnet-isolated-process-guide.md) C# libraries use the `Kafka` attribute to define the function trigger. 

The following table explains the properties you can set using this attribute:

| Parameter |Description|
| --- | --- |
| **BrokerList** | (Required) The list of Kafka brokers to which the output is sent.  |
| **Topic** | (Required) The topic to which the output is sent. |
| **AvroSchema** | (Optional) Schema of a generic record when using the Avro protocol. |
| **MaxMessageBytes** | (Optional) The maximum size of the output message being sent (in MB), with a default value of `1`. |
| **BatchSize** | (Optional) Maximum number of messages batched in a single message set, with a default value of `10000`.  |
| **EnableIdempotence** | (Optional) When set to `true`, guarantees that messages are successfully produced exactly once and in the original produce order, with a default value of `false`|
| **MessageTimeoutMs** | (Optional) The local message timeout, in milliseconds. This value is only enforced locally and limits the time a produced message waits for successful delivery, with a default `300000`. A time of `0` is infinite. This is the maximum time used to deliver a message (including retries). Delivery error occurs when either the retry count or the message timeout are exceeded. |
| **RequestTimeoutMs** | (Optional) The acknowledgement timeout of the output request, in milliseconds, with a default of `5000`. |
| **MaxRetries** | (Optional) The number of times to retry sending a failing Message, with a default of `2`. Retrying may cause reordering, unless `EnableIdempotence` is set to `true`.|
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

+ dataType
+ cardinality For Java functions, if you set `MANY`, you need to set a `dataType`. | `ONE`, `MANY`

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"  

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

| _function.json_ property |Description|
| --- | --- |
|**type** | Must be set to `kafka`. |
|**direction** | Must be set to `out`. |
|**name** | The name of the variable that represents the brokered data in function code. |
| **brokerList** | (Required) The list of Kafka brokers to which the output is sent.  |
| **topic** | (Required) The topic to which the output is sent. |
| **cardinality** | Set to `MANY` in order to enable batching. If omitted or set to `ONE`, a single message is sent.  |
| **avroSchema** | (Optional) Schema of a generic record when using the Avro protocol. |
| **maxMessageBytes** | (Optional) The maximum size of the output message being sent (in MB), with a default value of `1`. |
| **batchSize** | (Optional) Maximum number of messages batched in a single message set, with a default value of `10000`.  |
| **enableIdempotence** | (Optional) When set to `true`, guarantees that messages are successfully produced exactly once and in the original produce order, with a default value of `false`|
| **messageTimeoutMs** | (Optional) The local message timeout, in milliseconds. This value is only enforced locally and limits the time a produced message waits for successful delivery, with a default `300000`. A time of `0` is infinite. This is the maximum time used to deliver a message (including retries). Delivery error occurs when either the retry count or the message timeout are exceeded. |
| **requestTimeoutMs** | (Optional) The acknowledgement timeout of the output request, in milliseconds, with a default of `5000`. |
| **maxRetries** | (Optional) The number of times to retry sending a failing Message, with a default of `2`. Retrying may cause reordering, unless `EnableIdempotence` is set to `true`.|
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

Both keys and values types are supported with built-in [Avro](http://avro.apache.org/docs/current/) and [Protobuf](https://developers.google.com/protocol-buffers/) serialization.

1. In application settings or in the _local.settings.json_ file during local development, set the authentication credentials for your Confluent Cloud environment.

    - **BootstrapServer**: Contains the value of bootstrap server found in Confluent Cloud settings page. The value will resemble `xyz-xyzxzy.westeurope.azure.confluent.cloud:9092`.

    - **ConfluentCloudUsername**: The API access key obtained from the Confluent Cloud web site.

    - **ConfluentCloudPassword**: The API secret obtained from the Confluent Cloud web site.

See the host.json section for settings that apply to Kafka output bindings.

In a Premium plan, you must enable runtime scale monitoring for the Kafka output to be able to scale out to multiple instances. To learn more, see [Premium plan with virtual network triggers](functions-networking-options.md#premium-plan-with-virtual-network-triggers).

## Next steps

- [Run a function from an Apache Kafka event stream](./functions-bindings-kafka-trigger.md)
