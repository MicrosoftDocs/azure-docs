---
title: Apache Kafka trigger for Azure Functions
description: Use Azure Functions to run your code based on events from an Apache Kafka stream.
ms.topic: reference
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 05/14/2022
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Apache Kafka trigger for Azure Functions

You can use the Apache Kafka trigger in Azure Functions to run your function code in response to messages in Kafka topics. You can also use a [Kafka output binding](functions-bindings-kafka-output.md) to write from your function to a topic. For information on setup and configuration details, see [Apache Kafka bindings for Azure Functions overview](functions-bindings-kafka.md).

> [!IMPORTANT]
> Kafka bindings are only available for Functions on the [Elastic Premium Plan](functions-premium-plan.md) and [Dedicated (App Service) plan](dedicated-plan.md). They are only supported on version 3.x and later version of the Functions runtime.

## Example
::: zone pivot="programming-language-csharp"

The usage of the trigger depends on the C# modality used in your function app, which can be one of the following modes:

# [Isolated worker model](#tab/isolated-process)

An [isolated worker process class library](dotnet-isolated-process-guide.md) compiled C# function runs in a process isolated from the runtime.  

# [In-process model](#tab/in-process)

An [in-process class library](functions-dotnet-class-library.md) is a compiled C# function runs in the same process as the Functions runtime.
 
---

The attributes you use depend on the specific event provider.

# [Confluent (in-process)](#tab/confluent/in-process)

The following example shows a C# function that reads and logs the Kafka message as a Kafka event:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/Confluent/KafkaTrigger.cs" range="10-21" :::

To receive events in a batch, use an input string or `KafkaEventData` as an array, as shown in the following example:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/Confluent/KafkaTriggerMany.cs" range="10-24" :::

The following function logs the message and headers for the Kafka Event:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/Confluent/KafkaTriggerWithHeaders.cs" range="10-27" :::

You can define a generic [Avro schema] for the event passed to the trigger. The following string value defines the generic Avro schema:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/KafkaFunctionSample/AvroGenericTriggers.cs" range="23-41" :::

In the following function, an instance of `GenericRecord` is available in the `KafkaEvent.Value` property:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/KafkaFunctionSample/AvroGenericTriggers.cs" range="43-60" :::

You can define a specific [Avro schema] for the event passed to the trigger. The following defines the `UserRecord` class:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/KafkaFunctionSample/User.cs" range="9-32" :::

In the following function, an instance of `UserRecord` is available in the `KafkaEvent.Value` property:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/KafkaFunctionSample/AvroSpecificTriggers.cs" range="16-25" :::

For a complete set of working .NET examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/dotnet/). 

# [Event Hubs (in-process)](#tab/event-hubs/in-process)

The following example shows a C# function that reads and logs the Kafka message as a Kafka event:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/EventHub/KafkaTrigger.cs" range="10-21" :::

To receive events in a batch, use a string array or `KafkaEventData` array as input, as shown in the following example:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/EventHub/KafkaTriggerMany.cs" range="10-24" :::

The following function logs the message and headers for the Kafka Event:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/EventHub/KafkaTriggerWithHeaders.cs" range="10-26" :::

You can define a generic [Avro schema] for the event passed to the trigger. The following string value defines the generic Avro schema:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/KafkaFunctionSample/AvroGenericTriggers.cs" range="23-41" :::

In the following function, an instance of `GenericRecord` is available in the `KafkaEvent.Value` property:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/KafkaFunctionSample/AvroGenericTriggers.cs" range="43-60" :::

You can define a specific [Avro schema] for the event passed to the trigger. The following defines the `UserRecord` class:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/KafkaFunctionSample/User.cs" range="9-32" :::

In the following function, an instance of `UserRecord` is available in the `KafkaEvent.Value` property:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet/KafkaFunctionSample/AvroSpecificTriggers.cs" range="16-25" :::

For a complete set of working .NET examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/dotnet/). 

# [Confluent (isolated process)](#tab/confluent/isolated-process)

The following example shows a C# function that reads and logs the Kafka message as a Kafka event:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/confluent/KafkaTrigger.cs" range="12-24" :::

To receive events in a batch, use a string array as input, as shown in the following example:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/confluent/KafkaTriggerMany.cs" range="12-27" :::

The following function logs the message and headers for the Kafka Event:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/Confluent/KafkaTriggerWithHeaders.cs" range="12-32" :::

For a complete set of working .NET examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/dotnet-isolated/). 

# [Event Hubs (isolated process)](#tab/event-hubs/isolated-process)

The following example shows a C# function that reads and logs the Kafka message as a Kafka event:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/eventhub/KafkaTrigger.cs" range="12-24" :::

To receive events in a batch, use a string array as input, as shown in the following example:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/eventhub/KafkaTriggerMany.cs" range="12-27" :::

The following function logs the message and headers for the Kafka Event:

:::code language="csharp" source="~/azure-functions-kafka-extension/samples/dotnet-isolated/eventhub/KafkaTriggerWithHeaders.cs" range="12-32" :::

For a complete set of working .NET examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/dotnet-isolated/). 

---

::: zone-end  
::: zone pivot="programming-language-javascript"

> [!NOTE]
> For an equivalent set of TypeScript examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/tree/dev/samples/typescript)

The specific properties of the function.json file depend on your event provider, which in these examples are either Confluent or Azure Event Hubs. The following examples show a Kafka trigger for a function that reads and logs a Kafka message.

The following function.json defines the trigger for the specific provider:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTrigger/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTrigger/function.eventhub.json" :::

---

The following code then runs when the function is triggered:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTrigger/index.js" :::

To receive events in a batch, set the `cardinality` value to `many` in the function.json file, as shown in the following examples:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerMany/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerMany/function.eventhub.json" :::

---

The following code then parses the array of events and logs the event data:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerMany/index.js" :::

The following code also logs the header data:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerManyWithHeaders/index.js" :::

You can define a generic [Avro schema] for the event passed to the trigger. The following function.json defines the trigger for the specific provider with a generic Avro schema:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerAvroGeneric/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerAvroGeneric/function.eventhub.json" :::

---

The following code then runs when the function is triggered:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerAvroGeneric/index.js" :::

For a complete set of working JavaScript examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/javascript/). 

::: zone-end  
::: zone pivot="programming-language-powershell" 

The specific properties of the function.json file depend on your event provider, which in these examples are either Confluent or Azure Event Hubs. The following examples show a Kafka trigger for a function that reads and logs a Kafka message.

The following function.json defines the trigger for the specific provider:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTrigger/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTrigger/function.eventhub.json" :::

---

The following code then runs when the function is triggered:

:::code language="powershell" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTrigger/run.ps1" :::

To receive events in a batch, set the `cardinality` value to `many` in the function.json file, as shown in the following examples:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerMany/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerMany/function.eventhub.json" :::

---

The following code then parses the array of events and logs the event data:

:::code language="powershell" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerMany/run.ps1" :::

The following code also logs the header data:

:::code language="powershell" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerManyWithHeaders/run.ps1" :::

You can define a generic [Avro schema] for the event passed to the trigger. The following function.json defines the trigger for the specific provider with a generic Avro schema:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerAvroGeneric/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerAvroGeneric/function.eventhub.json" :::

---

The following code then runs when the function is triggered:

:::code language="powershell" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerAvroGeneric/run.ps1" :::

For a complete set of working PowerShell examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/powershell/). 

::: zone-end   
::: zone pivot="programming-language-python"  

The specific properties of the function.json file depend on your event provider, which in these examples are either Confluent or Azure Event Hubs. The following examples show a Kafka trigger for a function that reads and logs a Kafka message.

The following function.json defines the trigger for the specific provider:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/python/KafkaTrigger/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/python/KafkaTrigger/function.eventhub.json" :::

---

The following code then runs when the function is triggered:

:::code language="python" source="~/azure-functions-kafka-extension/samples/python/KafkaTrigger/main.py" :::

To receive events in a batch, set the `cardinality` value to `many` in the function.json file, as shown in the following examples:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/python/KafkaTriggerMany/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/python/KafkaTriggerMany/function.eventhub.json" :::

---

The following code then parses the array of events and logs the event data:

:::code language="python" source="~/azure-functions-kafka-extension/samples/python/KafkaTriggerMany/main.py" :::

The following code also logs the header data:

:::code language="python" source="~/azure-functions-kafka-extension/samples/python/KafkaTriggerManyWithHeaders/__init__.py" :::

You can define a generic [Avro schema] for the event passed to the trigger. The following function.json defines the trigger for the specific provider with a generic Avro schema:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/python/KafkaTriggerAvroGeneric/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/python/KafkaTriggerAvroGeneric/function.eventhub.json" :::

---

The following code then runs when the function is triggered:

:::code language="powershell" source="~/azure-functions-kafka-extension/samples/python/KafkaTriggerAvroGeneric/main.py" :::

For a complete set of working Python examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/python/). 

::: zone-end  
::: zone pivot="programming-language-java"  

The annotations you use to configure your trigger depend on the specific event provider.

# [Confluent](#tab/confluent)

The following example shows a Java function that reads and logs the content of the Kafka event:

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/confluent/src/main/java/com/contoso/kafka/SampleKafkaTrigger.java" range="19-35" :::

To receive events in a batch, use an input string as an array, as shown in the following example:

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/confluent/src/main/java/com/contoso/kafka/KafkaTriggerMany.java" range="8-27" :::

The following function logs the message and headers for the Kafka Event:

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/confluent/src/main/java/com/contoso/kafka/KafkaTriggerManyWithHeaders.java" range="12-38" :::

You can define a generic [Avro schema] for the event passed to the trigger. The following function defines a trigger for the specific provider with a generic Avro schema:

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/confluent/src/main/java/com/contoso/kafka/avro/generic/KafkaTriggerAvroGeneric.java" range="15-31" :::

For a complete set of working Java examples for Confluent, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/tree/dev/samples/java/confluent/src/main/java/com/contoso/kafka). 

# [Event Hubs](#tab/event-hubs)

The following example shows a Java function that reads and logs the content of the Kafka event:

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/eventhub/src/main/java/com/contoso/kafka/SampleKafkaTrigger.java" range="19-35" :::

To receive events in a batch, use an input string as an array, as shown in the following example:

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/eventhub/src/main/java/com/contoso/kafka/KafkaTriggerMany.java" range="8-27" :::

The following function logs the message and headers for the Kafka Event:

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/eventhub/src/main/java/com/contoso/kafka/KafkaTriggerManyWithHeaders.java" range="12-38" :::

You can define a generic [Avro schema] for the event passed to the trigger. The following function defines a trigger for the specific provider with a generic Avro schema:

:::code language="java" source="~/azure-functions-kafka-extension/samples/java/eventhub/src/main/java/com/contoso/kafka/avro/generic/KafkaTriggerAvroGeneric.java" range="15-31" :::

For a complete set of working Java examples for Event Hubs, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/tree/dev/samples/java/confluent/src/main/java/com/contoso/kafka). 

---

::: zone-end
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use the `KafkaTriggerAttribute` to define the function trigger. 

The following table explains the properties you can set using this trigger attribute:

| Parameter |Description|
| --- | --- |
| **BrokerList** | (Required) The list of Kafka brokers monitored by the trigger. See [Connections](#connections) for more information. |
| **Topic** | (Required) The topic monitored by the trigger. |
| **ConsumerGroup** | (Optional) Kafka consumer group used by the trigger. |
| **AvroSchema** | (Optional) Schema of a generic record when using the Avro protocol. |
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

The `KafkaTrigger` annotation allows you to create a function that runs when a topic is received. Supported options include the following elements:

|Element | Description|
|---------|----------------------|
|**name** | (Required) The name of the variable that represents the queue or topic message in function code. |
| **brokerList** | (Required) The list of Kafka brokers monitored by the trigger. See [Connections](#connections) for more information. |
| **topic** | (Required) The topic monitored by the trigger. |
| **cardinality** | (Optional) Indicates the cardinality of the trigger input. The supported values are `ONE` (default) and `MANY`. Use `ONE` when the input is a single message and `MANY` when the input is an array of messages. When you use `MANY`, you must also set a `dataType`. |
| **dataType** | Defines how Functions handles the parameter value. By default, the value is obtained as a string and Functions tries to  deserialize the string to actual plain-old Java object (POJO). When `string`, the input is treated as just a string. When `binary`, the message is received as binary data, and Functions tries to deserialize it to an actual parameter type byte[]. | 
| **consumerGroup** | (Optional) Kafka consumer group used by the trigger. |
| **avroSchema** | (Optional) Schema of a generic record when using the Avro protocol. |
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
|**type** | (Required) Must be set to `kafkaTrigger`. |
|**direction** | (Required) Must be set to `in`. |
|**name** | (Required) The name of the variable that represents the brokered data in function code. |
| **brokerList** | (Required) The list of Kafka brokers monitored by the trigger.  See [Connections](#connections) for more information.|
| **topic** | (Required) The topic monitored by the trigger. |
| **cardinality** | (Optional) Indicates the cardinality of the trigger input. The supported values are `ONE` (default) and `MANY`. Use `ONE` when the input is a single message and `MANY` when the input is an array of messages. When you use `MANY`, you must also set a `dataType`. |
| **dataType** | Defines how Functions handles the parameter value. By default, the value is obtained as a string and Functions tries to  deserialize the string to actual plain-old Java object (POJO). When `string`, the input is treated as just a string. When `binary`, the message is received as binary data, and Functions tries to deserialize it to an actual parameter type byte[]. | 
| **consumerGroup** | (Optional) Kafka consumer group used by the trigger. |
| **avroSchema** | (Optional) Schema of a generic record when using the Avro protocol. |
| **authenticationMode** | (Optional) The authentication  mode when using Simple Authentication and Security Layer (SASL) authentication. The supported values are `Gssapi`, `Plain` (default), `ScramSha256`, `ScramSha512`. |
| **username** | (Optional) The username for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information. | 
| **password** | (Optional) The password for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information.| 
| **protocol** | (Optional) The security protocol used when communicating with brokers. The supported values are `plaintext` (default), `ssl`, `sasl_plaintext`, `sasl_ssl`. |
| **sslCaLocation** | (Optional) Path to CA certificate file for verifying the broker's certificate. |
| **sslCertificateLocation** | (Optional) Path to the client's certificate. |
| **sslKeyLocation** | (Optional) Path to client's private key (PEM) used for authentication. |
| **sslKeyPassword** | (Optional) Password for client's certificate. |

::: zone-end

## Usage

::: zone pivot="programming-language-csharp"

# [Isolated worker model](#tab/isolated-process)

Kafka events are currently supported as strings and string arrays that are JSON payloads.

# [In-process model](#tab/in-process)

Kafka events are passed to the function as `KafkaEventData<string>` objects or arrays. Strings and string arrays that are JSON payloads are also supported.
 
---

::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell" 

Kafka messages are passed to the function as strings and string arrays that are JSON payloads.

::: zone-end 

In a Premium plan, you must enable runtime scale monitoring for the Kafka output to be able to scale out to multiple instances. To learn more, see [Enable runtime scaling](functions-bindings-kafka.md#enable-runtime-scaling). 

You can't use the **Test/Run** feature of the **Code + Test** page in the Azure Portal to work with Kafka triggers. You must instead send test events directly to the topic being monitored by the trigger.  

For a complete set of supported host.json settings for the Kafka trigger, see [host.json settings](functions-bindings-kafka.md#hostjson-settings). 

[!INCLUDE [functions-bindings-kafka-connections](../../includes/functions-bindings-kafka-connections.md)]

## Next steps

- [Write to an Apache Kafka stream from a function](./functions-bindings-kafka-output.md)

[Avro schema]: http://avro.apache.org/docs/current/
