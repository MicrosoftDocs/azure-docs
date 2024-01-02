---
title: Apache Kafka output binding for Azure Functions
description: Use Azure Functions to write messages to an Apache Kafka stream.
ms.topic: reference
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 05/14/2022
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Apache Kafka output binding for Azure Functions

The output binding allows an Azure Functions app to write messages to a Kafka topic. 

> [!IMPORTANT]
> Kafka bindings are only available for Functions on the [Elastic Premium Plan](functions-premium-plan.md) and [Dedicated (App Service) plan](dedicated-plan.md). They are only supported on version 3.x and later version of the Functions runtime.

## Example
::: zone pivot="programming-language-csharp"

The usage of the binding depends on the C# modality used in your function app, which can be one of the following:

# [Isolated worker model](#tab/isolated-process)

An [isolated worker process class library](dotnet-isolated-process-guide.md) compiled C# function runs in a process isolated from the runtime.   

# [In-process model](#tab/in-process)

An [in-process class library](functions-dotnet-class-library.md) is a compiled C# function runs in the same process as the Functions runtime.
 
---

The attributes you use depend on the specific event provider.

# [Confluent](#tab/confluent/in-process)

The following example shows a C# function that sends a single message to a Kafka topic, using data provided in HTTP GET request.

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet/Confluent/KafkaOutput.cs" range="12-32" :::

To send events in a batch, use an array of `KafkaEventData` objects, as shown in the following example:

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet/Confluent/KafkaOutputMany.cs" range="12-30" :::

The following function adds headers to the Kafka output data:

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet/Confluent/KafkaOutputWithHeaders.cs" range="11-31" :::

For a complete set of working .NET examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/dotnet/Confluent/). 

# [Event Hubs](#tab/event-hubs/in-process)

The following example shows a C# function that sends a single message to a Kafka topic, using data provided in HTTP GET request.

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet/EventHub/KafkaOutput.cs" range="11-31" :::

To send events in a batch, use an array of `KafkaEventData` objects, as shown in the following example:

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet/EventHub/KafkaOutputMany.cs" range="12-30" :::

The following function adds headers to the Kafka output data:

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet/EventHub/KafkaOutputWithHeaders.cs" range="11-31" :::

For a complete set of working .NET examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/dotnet/EventHub). 

# [Confluent](#tab/confluent/isolated-process)

The following example has a custom return type that is `MultipleOutputType`, which consists of an HTTP response and a Kafka output. 

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/confluent/KafkaOutput.cs" range="11-31" :::

In the class `MultipleOutputType`, `Kevent` is the output binding variable for the Kafka binding.

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/confluent/KafkaOutput.cs" range="34-46" :::

To send a batch of events, pass a string array to the output type, as shown in the following example:

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/confluent/KafkaOutputMany.cs" range="11-30" :::

The string array is defined as `Kevents` property on the class, on which the output binding is defined:  

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/confluent/KafkaOutputMany.cs" range="33-45" :::

The following function adds headers to the Kafka output data:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/Confluent/KafkaOutputWithHeaders.cs" range="11-31" :::

For a complete set of working .NET examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/dotnet-isolated/confluent). 

# [Event Hubs](#tab/event-hubs/isolated-process)


The following example has a custom return type that is `MultipleOutputType`, which consists of an HTTP response and a Kafka output. 

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/eventhub/KafkaOutput.cs" range="11-31" :::

In the class `MultipleOutputType`, `Kevent` is the output binding variable for the Kafka binding.

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/eventhub/KafkaOutput.cs" range="34-46" :::

To send a batch of events, pass a string array to the output type, as shown in the following example:

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/eventhub/KafkaOutputMany.cs" range="11-30" :::

The string array is defined as `Kevents` property on the class, on which the output binding is defined:  

:::code language="json" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/eventhub/KafkaOutputMany.cs" range="33-45" :::

The following function adds headers to the Kafka output data:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/eventhub/KafkaOutputWithHeaders.cs" range="11-31" :::

For a complete set of working .NET examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/dotnet-isolated/eventhub). 

---

::: zone-end  
::: zone pivot="programming-language-javascript"

> [!NOTE]
> For an equivalent set of TypeScript examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/tree/dev/samples/typescript)

The specific properties of the function.json file depend on your event provider, which in these examples are either Confluent or Azure Event Hubs. The following examples show a Kafka output binding for a function that is triggered by an HTTP request and sends data from the request to the Kafka topic.

The following function.json defines the trigger for the specific provider in these examples:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaOutput/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaOutput/function.eventhub.json" :::

---

The following code then sends a message to the topic:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaOutput/index.js" :::

The following code sends multiple messages as an array to the same topic:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaOutputMany/index.js" :::

The following example shows how to send an event message with headers to the same Kafka topic: 

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaOutputWithHeader/index.js" :::

For a complete set of working JavaScript examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/javascript/). 

::: zone-end  
::: zone pivot="programming-language-powershell" 

The specific properties of the function.json file depend on your event provider, which in these examples are either Confluent or Azure Event Hubs. The following examples show a Kafka output binding for a function that is triggered by an HTTP request and sends data from the request to the Kafka topic.

The following function.json defines the trigger for the specific provider in these examples:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaOutput/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaOutput/function.eventhub.json" :::

---

The following code then sends a message to the topic:

:::code language="powershell" source="~/azure-functions-kafka-extension/samples/powershell/KafkaOutput/run.ps1" :::

The following code sends multiple messages as an array to the same topic:

:::code language="powershell" source="~/azure-functions-kafka-extension/samples/powershell/KafkaOutputMany/run.ps1" :::

The following example shows how to send an event message with headers to the same Kafka topic: 

:::code language="powershell" source="~/azure-functions-kafka-extension/samples/powershell/KafkaOutputWithHeaders/run.ps1" :::

For a complete set of working PowerShell examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/javascript/). 

::: zone-end 
::: zone pivot="programming-language-python"  

The specific properties of the function.json file depend on your event provider, which in these examples are either Confluent or Azure Event Hubs. The following examples show a Kafka output binding for a function that is triggered by an HTTP request and sends data from the request to the Kafka topic.

The following function.json defines the trigger for the specific provider in these examples:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/python/KafkaOutput/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/python/KafkaOutput/function.eventhub.json" :::

---

The following code then sends a message to the topic:

:::code language="python" source="~/azure-functions-kafka-extension/samples/python/KafkaOutput/main.py" :::

The following code sends multiple messages as an array to the same topic:

:::code language="python" source="~/azure-functions-kafka-extension/samples/python/KafkaOutputMany/main.py" :::

The following example shows how to send an event message with headers to the same Kafka topic: 

:::code language="python" source="~/azure-functions-kafka-extension/samples/python/KafkaOutputWithHeaders/__init__.py" :::

For a complete set of working Python examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/python/). 


::: zone-end
::: zone pivot="programming-language-java"

The annotations you use to configure the output binding depend on the specific event provider.

# [Confluent](#tab/confluent)

The following function sends a message to the Kafka topic.

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/confluent/src/main/java/com/contoso/kafka/SampleKafkaOutput.java" range="17-38" :::

The following example shows how to send multiple messages to a Kafka topic. 

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/confluent/src/main/java/com/contoso/kafka/KafkaOutputMany.java" range="10-30" :::

In this example, the output binding parameter is changed to string array.

The last example uses to these `KafkaEntity` and `KafkaHeader` classes: 

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/confluent/src/main/java/com/contoso/kafka/entity/KafkaEntity.java" range="3-18" :::

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/confluent/src/main/java/com/contoso/kafka/entity/KafkaHeaders.java" range="3-10" :::

The following example function sends a message with headers to a Kafka topic.

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/confluent/src/main/java/com/contoso/kafka/KafkaOutputWithHeaders.java" range="11-35" :::

For a complete set of working Java examples for Confluent, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/tree/dev/samples/java/confluent/src/main/java/com/contoso/kafka). 

# [Event Hubs](#tab/event-hubs)

The following function sends a message to the Kafka topic.

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/eventhub/src/main/java/com/contoso/kafka/SampleKafkaOutput.java" range="17-38" :::

The following example shows how to send multiple messages to a Kafka topic. 

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/eventhub/src/main/java/com/contoso/kafka/KafkaOutputMany.java" range="10-30" :::

In this example, the output binding parameter is changed to string array.

The last example uses to these `KafkaEntity` and `KafkaHeader` classes: 

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/eventhub/src/main/java/com/contoso/kafka/entity/KafkaEntity.java" range="3-18" :::

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/eventhub/src/main/java/com/contoso/kafka/entity/KafkaHeaders.java" range="3-10" :::

The following example function sends a message with headers to a Kafka topic.

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/eventhub/src/main/java/com/contoso/kafka/KafkaOutputWithHeaders.java" range="11-35" :::

For a complete set of working Java examples for Confluent, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/tree/dev/samples/java/eventhub/src/main/java/com/contoso/kafka). 

---

::: zone-end
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use the `Kafka` attribute to define the function trigger. 

The following table explains the properties you can set using this attribute:

| Parameter |Description|
| --- | --- |
| **BrokerList** | (Required) The list of Kafka brokers to which the output is sent. See [Connections](#connections) for more information. |
| **Topic** | (Required) The topic to which the output is sent. |
| **AvroSchema** | (Optional) Schema of a generic record when using the Avro protocol. |
| **MaxMessageBytes** | (Optional) The maximum size of the output message being sent (in MB), with a default value of `1`. |
| **BatchSize** | (Optional) Maximum number of messages batched in a single message set, with a default value of `10000`.  |
| **EnableIdempotence** | (Optional) When set to `true`, guarantees that messages are successfully produced exactly once and in the original produce order, with a default value of `false`|
| **MessageTimeoutMs** | (Optional) The local message timeout, in milliseconds. This value is only enforced locally and limits the time a produced message waits for successful delivery, with a default `300000`. A time of `0` is infinite. This value is the maximum time used to deliver a message (including retries). Delivery error occurs when either the retry count or the message timeout are exceeded. |
| **RequestTimeoutMs** | (Optional) The acknowledgment timeout of the output request, in milliseconds, with a default of `5000`. |
| **MaxRetries** | (Optional) The number of times to retry sending a failing Message, with a default of `2`. Retrying may cause reordering, unless `EnableIdempotence` is set to `true`.|
| **AuthenticationMode** | (Optional) The authentication  mode when using Simple Authentication and Security Layer (SASL) authentication. The supported values are `Gssapi`, `Plain` (default), `ScramSha256`, `ScramSha512`. |
| **Username** | (Optional) The username for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information.| 
| **Password** | (Optional) The password for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information.| 
| **Protocol** | (Optional) The security protocol used when communicating with brokers. The supported values are `plaintext` (default), `ssl`, `sasl_plaintext`, `sasl_ssl`. |
| **SslCaLocation** | (Optional) Path to CA certificate file for verifying the broker's certificate. |
| **SslCertificateLocation** | (Optional) Path to the client's certificate. |
| **SslKeyLocation** | (Optional) Path to client's private key (PEM) used for authentication. |
| **SslKeyPassword** | (Optional) Password for client's certificate. |

::: zone-end  
::: zone pivot="programming-language-java"

## Annotations

The `KafkaOutput` annotation allows you to create a function that writes to a specific topic. Supported options include the following elements:

|Element | Description|
|---------|----------------------|
|**name** | The name of the variable that represents the brokered data in function code. |
| **brokerList** | (Required) The list of Kafka brokers to which the output is sent. See [Connections](#connections) for more information. |
| **topic** | (Required) The topic to which the output is sent. |
| **dataType** | Defines how Functions handles the parameter value. By default, the value is obtained as a string and Functions tries to  deserialize the string to actual plain-old Java object (POJO). When `string`, the input is treated as just a string. When `binary`, the message is received as binary data, and Functions tries to deserialize it to an actual parameter type byte[]. | 
| **avroSchema** | (Optional) Schema of a generic record when using the Avro protocol. |
| **maxMessageBytes** | (Optional) The maximum size of the output message being sent (in MB), with a default value of `1`. |
| **batchSize** | (Optional) Maximum number of messages batched in a single message set, with a default value of `10000`.  |
| **enableIdempotence** | (Optional) When set to `true`, guarantees that messages are successfully produced exactly once and in the original produce order, with a default value of `false`|
| **messageTimeoutMs** | (Optional) The local message timeout, in milliseconds. This value is only enforced locally and limits the time a produced message waits for successful delivery, with a default `300000`. A time of `0` is infinite. This is the maximum time used to deliver a message (including retries). Delivery error occurs when either the retry count or the message timeout are exceeded. |
| **requestTimeoutMs** | (Optional) The acknowledgment timeout of the output request, in milliseconds, with a default of `5000`. |
| **maxRetries** | (Optional) The number of times to retry sending a failing Message, with a default of `2`. Retrying may cause reordering, unless `EnableIdempotence` is set to `true`.|
| **authenticationMode** | (Optional) The authentication  mode when using Simple Authentication and Security Layer (SASL) authentication. The supported values are `Gssapi`, `Plain` (default), `ScramSha256`, `ScramSha512`. |
| **username** | (Optional) The username for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information.| 
| **password** | (Optional) The password for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information.| 
| **protocol** | (Optional) The security protocol used when communicating with brokers. The supported values are `plaintext` (default), `ssl`, `sasl_plaintext`, `sasl_ssl`. |
| **sslCaLocation** | (Optional) Path to CA certificate file for verifying the broker's certificate. |
| **sslCertificateLocation** | (Optional) Path to the client's certificate. |
| **sslKeyLocation** | (Optional) Path to client's private key (PEM) used for authentication. |
| **sslKeyPassword** | (Optional) Password for client's certificate. |

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"  

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

| _function.json_ property |Description|
| --- | --- |
|**type** | Must be set to `kafka`. |
|**direction** | Must be set to `out`. |
|**name** | The name of the variable that represents the brokered data in function code. |
| **brokerList** | (Required) The list of Kafka brokers to which the output is sent. See [Connections](#connections) for more information. |
| **topic** | (Required) The topic to which the output is sent. |
| **avroSchema** | (Optional) Schema of a generic record when using the Avro protocol. |
| **maxMessageBytes** | (Optional) The maximum size of the output message being sent (in MB), with a default value of `1`. |
| **batchSize** | (Optional) Maximum number of messages batched in a single message set, with a default value of `10000`.  |
| **enableIdempotence** | (Optional) When set to `true`, guarantees that messages are successfully produced exactly once and in the original produce order, with a default value of `false`|
| **messageTimeoutMs** | (Optional) The local message timeout, in milliseconds. This value is only enforced locally and limits the time a produced message waits for successful delivery, with a default `300000`. A time of `0` is infinite. This is the maximum time used to deliver a message (including retries). Delivery error occurs when either the retry count or the message timeout are exceeded. |
| **requestTimeoutMs** | (Optional) The acknowledgment timeout of the output request, in milliseconds, with a default of `5000`. |
| **maxRetries** | (Optional) The number of times to retry sending a failing Message, with a default of `2`. Retrying may cause reordering, unless `EnableIdempotence` is set to `true`.|
| **authenticationMode** | (Optional) The authentication  mode when using Simple Authentication and Security Layer (SASL) authentication. The supported values are `Gssapi`, `Plain` (default), `ScramSha256`, `ScramSha512`. |
| **username** | (Optional) The username for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information.| 
| **password** | (Optional) The password for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information.| 
| **protocol** | (Optional) The security protocol used when communicating with brokers. The supported values are `plaintext` (default), `ssl`, `sasl_plaintext`, `sasl_ssl`. |
| **sslCaLocation** | (Optional) Path to CA certificate file for verifying the broker's certificate. |
| **sslCertificateLocation** | (Optional) Path to the client's certificate. |
| **sslKeyLocation** | (Optional) Path to client's private key (PEM) used for authentication. |
| **sslKeyPassword** | (Optional) Password for client's certificate. |

::: zone-end  

## Usage

::: zone pivot="programming-language-csharp"
Both keys and values types are supported with built-in [Avro](http://avro.apache.org/docs/current/) and [Protobuf](https://developers.google.com/protocol-buffers/) serialization.

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"
The offset, partition, and timestamp for the event are generated at runtime. Only value and headers can be set inside the function. Topic is set in the function.json.
::: zone-end

Please make sure to have access to the Kafka topic to which you are trying to write. You configure the binding with access and connection credentials to the Kafka topic. 

In a Premium plan, you must enable runtime scale monitoring for the Kafka output to be able to scale out to multiple instances. To learn more, see [Enable runtime scaling](functions-bindings-kafka.md#enable-runtime-scaling).

For a complete set of supported host.json settings for the Kafka trigger, see [host.json settings](functions-bindings-kafka.md#hostjson-settings). 

[!INCLUDE [functions-bindings-kafka-connections](../../includes/functions-bindings-kafka-connections.md)]

## Next steps

- [Run a function from an Apache Kafka event stream](./functions-bindings-kafka-trigger.md)
