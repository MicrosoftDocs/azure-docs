---
title: Apache Kafka trigger for Azure Functions
description: Use Azure Functions to run your code based on events from an Apache Kafka stream.
ms.topic: reference
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 12/26/2025
zone_pivot_groups: programming-languages-set-functions
---

# Apache Kafka trigger for Azure Functions

Use the Apache Kafka trigger in Azure Functions to run your function code in response to messages in Kafka topics. You can also use a [Kafka output binding](functions-bindings-kafka-output.md) to write from your function to a topic. For information on setup and configuration details, see [Apache Kafka bindings for Azure Functions overview](functions-bindings-kafka.md).

[!INCLUDE [functions-binding-kafka-plan-support-note](../../includes/functions-binding-kafka-plan-support-note.md)]

## Example
::: zone pivot="programming-language-csharp"

The usage of the trigger depends on the C# modality used in your function app, which can be one of the following modes:

# [Isolated worker model](#tab/isolated-process)

A compiled C# function that uses an [isolated worker process class library](dotnet-isolated-process-guide.md) that runs in a process that's separate from the runtime.   

# [In-process model](#tab/in-process)

[!INCLUDE [functions-in-process-model-retirement-note](../../includes/functions-in-process-model-retirement-note.md)]

A compiled C# function that uses an [in-process class library](functions-dotnet-class-library.md) that runs in the same process as the Functions runtime.
 
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

You can define a specific [Avro schema] for the event passed to the trigger. The following code defines the `UserRecord` class:

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

You can define a specific [Avro schema] for the event passed to the trigger. The following code defines the `UserRecord` class:

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
::: zone pivot="programming-language-javascript,programming-language-typescript"
The usage of the trigger depends on your version of the Node.js programming model. 

# [Version 4](#tab/v4) 

In the Node.js v4 model, you define your trigger directly in your function code. For more information, see the [Azure Functions Node.js developer guide](functions-reference-node.md?pivots=nodejs-model-v4).

# [Version 3](#tab/v3)

In the Node.js v3 model, you define your trigger in a `function.json` file with your code. For more information, see the [Azure Functions Node.js developer guide](functions-reference-node.md?pivots=nodejs-model-v3).

---

In these examples, the event providers are either Confluent or Azure Event Hubs. These examples show how to define a Kafka trigger for a function that reads a Kafka message.  
::: zone-end
::: zone pivot="programming-language-javascript"  
# [Confluent](#tab/confluent/v4)

```javascript
const { app } = require("@azure/functions");

async function kafkaTrigger(event, context) {
  context.log("Event Offset: " + event.Offset);
  context.log("Event Partition: " + event.Partition);
  context.log("Event Topic: " + event.Topic);
  context.log("Event Timestamp: " + event.Timestamp);
  context.log("Event Key: " + event.Key);
  context.log("Event Value (as string): " + event.Value);

  let event_obj = JSON.parse(event.Value);

  context.log("Event Value Object: ");
  context.log("   Value.registertime: ", event_obj.registertime.toString());
  context.log("   Value.userid: ", event_obj.userid);
  context.log("   Value.regionid: ", event_obj.regionid);
  context.log("   Value.gender: ", event_obj.gender);
}

app.generic("Kafkatrigger", {
  trigger: {
    type: "kafkaTrigger",
    direction: "in",
    name: "event",
    topic: "topic",
    brokerList: "%BrokerList%",
    username: "%ConfluentCloudUserName%",
    password: "%ConfluentCloudPassword%",
    consumerGroup: "$Default",
    protocol: "saslSsl",
    authenticationMode: "plain",
    dataType: "string"
  },
  handler: kafkaTrigger,
});
```

# [Event Hubs](#tab/event-hubs/v4)

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript-v4/src/functions/kafkaTrigger.js" range="1-19,21-36":::

# [Confluent](#tab/confluent/v3)

This `function.json` file defines the trigger for the Confluent provider:

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTrigger/function.confluent.json" :::

The following code runs when the function is triggered:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTrigger/index.js" :::

# [Event Hubs](#tab/event-hubs/v3)

This `function.json` file defines the trigger for the Event Hubs provider:

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTrigger/function.eventhub.json" :::

The following code runs when the function is triggered:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTrigger/index.js" :::

---

To receive events in a batch, set the `cardinality` value to `many`, as shown in these examples:

# [Confluent](#tab/confluent/v4)

```javascript
const { app } = require("@azure/functions");

async function kafkaTriggerMany(events, context) {
  for (const event of events) {
    context.log("Event Offset: " + event.Offset);
    context.log("Event Partition: " + event.Partition);
    context.log("Event Topic: " + event.Topic);
    context.log("Event Key: " + event.Key);
    context.log("Event Timestamp: " + event.Timestamp);
    context.log("Event Value (as string): " + event.Value);

    let event_obj = JSON.parse(event.Value);

    context.log("Event Value Object: ");
    context.log("   Value.registertime: ", event_obj.registertime.toString());
    context.log("   Value.userid: ", event_obj.userid);
    context.log("   Value.regionid: ", event_obj.regionid);
    context.log("   Value.gender: ", event_obj.gender);
  }
}

app.generic("kafkaTriggerMany", {
  trigger: {
    type: "kafkaTrigger",
    direction: "in",
    name: "event",
    topic: "topic",
    brokerList: "%BrokerList%",
    username: "%ConfluentCloudUserName%",
    password: "%ConfluentCloudPassword%",
    consumerGroup: "$Default",
    protocol: "saslSsl",
    authenticationMode: "plain",
    dataType: "string",
    cardinality: "MANY"
  },
  handler: kafkaTriggerMany,
});
```

# [Event Hubs](#tab/event-hubs/v4)

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript-v4/src/functions/kafkaTriggerMany.js" range="1-21,23-39":::

# [Confluent](#tab/confluent/v3)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerMany/function.confluent.json" :::

This code parses the array of events and logs the event data:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerMany/index.js" :::

This code logs the header data:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerManyWithHeaders/index.js" :::

# [Event Hubs](#tab/event-hubs/v3)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerMany/function.eventhub.json" :::

This code parses the array of events and logs the event data:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerMany/index.js" :::

This code logs the header data:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerManyWithHeaders/index.js" :::

---

You can define a generic [Avro schema] for the event passed to the trigger. This example defines the trigger for the specific provider with a generic Avro schema:

# [Confluent](#tab/confluent/v4)

```javascript
const { app } = require("@azure/functions");

async function kafkaAvroGenericTrigger(event, context) {
  context.log("Processed kafka event: ", event);
  if (context.triggerMetadata?.key !== undefined) {
    context.log("message key: ", context.triggerMetadata?.key);
  }
}

app.generic("kafkaAvroGenericTrigger", {
  trigger: {
    type: "kafkaTrigger",
    direction: "in",
    name: "event",
    protocol: "SASLSSL",
    password: "EventHubConnectionString",
    dataType: "string",
    topic: "topic",
    authenticationMode: "PLAIN",
    avroSchema:
      '{"type":"record","name":"Payment","namespace":"io.confluent.examples.clients.basicavro","fields":[{"name":"id","type":"string"},{"name":"amount","type":"double"},{"name":"type","type":"string"}]}',
    consumerGroup: "$Default",
    username: "$ConnectionString",
    brokerList: "%BrokerList%",
  },
  handler: kafkaAvroGenericTrigger,
});
```

# [Event Hubs](#tab/event-hubs/v4)

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript-v4/src/functions/kafkaAvroGenericTrigger.js" range="1-9,11-28":::

# [Confluent](#tab/confluent/v3)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerAvroGeneric/function.confluent.json" :::

The following code runs when the function is triggered:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerAvroGeneric/index.js" :::

# [Event Hubs](#tab/event-hubs/v3)

:::code language="json" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerAvroGeneric/function.eventhub.json" :::

The following code runs when the function is triggered:

:::code language="javascript" source="~/azure-functions-kafka-extension/samples/javascript/KafkaTriggerAvroGeneric/index.js" :::

---

# [Version 4](#tab/v4) 

For a complete set of working JavaScript examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/tree/dev/samples/javascript-v4/src/functions).

# [Version 3](#tab/v3)

For a complete set of working JavaScript examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/javascript/).

--- 

::: zone-end  
::: zone pivot="programming-language-typescript"

# [Confluent](#tab/confluent/v4)

```typescript
import { app, InvocationContext } from "@azure/functions";

// This is a sample interface that describes the actual data in your event.
interface EventData {
  registertime: number;
  userid: string;
  regionid: string;
  gender: string;
}

export async function kafkaTrigger(
  event: any,
  context: InvocationContext
): Promise<void> {
  context.log("Event Offset: " + event.Offset);
  context.log("Event Partition: " + event.Partition);
  context.log("Event Topic: " + event.Topic);
  context.log("Event Timestamp: " + event.Timestamp);
  context.log("Event Value (as string): " + event.Value);

  let event_obj: EventData = JSON.parse(event.Value);

  context.log("Event Value Object: ");
  context.log("   Value.registertime: ", event_obj.registertime.toString());
  context.log("   Value.userid: ", event_obj.userid);
  context.log("   Value.regionid: ", event_obj.regionid);
  context.log("   Value.gender: ", event_obj.gender);
}

app.generic("Kafkatrigger", {
  trigger: {
    type: "kafkaTrigger",
    direction: "in",
    name: "event",
    topic: "topic",
    brokerList: "%BrokerList%",
    username: "%ConfluentCloudUserName%",
    password: "%ConfluentCloudPassword%",
    consumerGroup: "$Default",
    protocol: "saslSsl",
    authenticationMode: "plain",
    dataType: "string"
  },
  handler: kafkaTrigger,
});
```

# [Event Hubs](#tab/event-hubs/v4)

:::code language="typescript" source="~/azure-functions-kafka-extension/samples/typescript-v4/src/functions/kafkaTrigger.ts" range="1-29,31-46":::

# [Confluent](#tab/confluent/v3)

This `function.json` file defines the trigger for the Confluent provider:

:::code language="json" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTrigger/function.confluent.json" :::

The following code runs when the function is triggered:

:::code language="typescript" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTrigger/index.ts" :::

# [Event Hubs](#tab/event-hubs/v3)

This `function.json` file defines the trigger for the Event Hubs provider:

:::code language="json" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTrigger/function.eventhub.json" :::

The following code runs when the function is triggered:

:::code language="typescript" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTrigger/index.ts" :::

---

To receive events in a batch, set the `cardinality` value to `many`, as shown in these examples:

# [Confluent](#tab/confluent/v4)

```typescript
import { app, InvocationContext } from "@azure/functions";

// This is a sample interface that describes the actual data in your event.
interface EventData {
    registertime: number;
    userid: string;
    regionid: string;
    gender: string;
}

interface KafkaEvent {
    Offset: number;
    Partition: number;
    Topic: string;
    Timestamp: number;
    Value: string;
}

export async function kafkaTriggerMany(
    events: any,
    context: InvocationContext
): Promise<void> {
    for (const event of events) {
        context.log("Event Offset: " + event.Offset);
        context.log("Event Partition: " + event.Partition);
        context.log("Event Topic: " + event.Topic);
        context.log("Event Timestamp: " + event.Timestamp);
        context.log("Event Value (as string): " + event.Value);

        let event_obj: EventData = JSON.parse(event.Value);

        context.log("Event Value Object: ");
        context.log("   Value.registertime: ", event_obj.registertime.toString());
        context.log("   Value.userid: ", event_obj.userid);
        context.log("   Value.regionid: ", event_obj.regionid);
        context.log("   Value.gender: ", event_obj.gender);
    }
}

app.generic("kafkaTriggerMany", {
  trigger: {
    type: "kafkaTrigger",
    direction: "in",
    name: "event",
    topic: "topic",
    brokerList: "%BrokerList%",
    username: "%ConfluentCloudUserName%",
    password: "%ConfluentCloudPassword%",
    consumerGroup: "$Default",
    protocol: "saslSsl",
    authenticationMode: "plain",
    dataType: "string",
    cardinality: "MANY"
  },
  handler: kafkaTriggerMany,
});
```

# [Event Hubs](#tab/event-hubs/v4)

:::code language="typescript" source="~/azure-functions-kafka-extension/samples/typescript-v4/src/functions/kafkaTriggerMany.ts" range="1-39,41-57":::

# [Confluent](#tab/confluent/v3)

:::code language="json" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTriggerMany/function.confluent.json" :::

This code parses the array of events and logs the event data:

:::code language="typescript" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTriggerMany/index.ts" :::

This code logs the header data:

:::code language="typescript" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTriggerManyWithHeaders/index.ts" :::

# [Event Hubs](#tab/event-hubs/v3)

:::code language="json" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTriggerMany/function.eventhub.json" :::

This code parses the array of events and logs the event data:

:::code language="typescript" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTriggerMany/index.ts" :::

This code logs the header data:

:::code language="typescript" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTriggerManyWithHeaders/index.ts" :::

---

You can define a generic [Avro schema] for the event passed to the trigger. This example defines the trigger for the specific provider with a generic Avro schema:

# [Confluent](#tab/confluent/v4)

:::code language="typescript" source="~/azure-functions-kafka-extension/samples/typescript-v4/src/functions/kafkaAvroGenericTrigger.ts" range="1-15,17-34":::

# [Event Hubs](#tab/event-hubs/v4)

```typescript
import { app, InvocationContext } from "@azure/functions";

export async function kafkaAvroGenericTrigger(
  event: any,
  context: InvocationContext
): Promise<void> {
  context.log("Processed kafka event: ", event);
  context.log(
    `Message ID: ${event.id}, amount: ${event.amount}, type: ${event.type}`
  );
  if (context.triggerMetadata?.key !== undefined) {
    context.log(`Message Key : ${context.triggerMetadata?.key}`);
  }
}

app.generic("kafkaAvroGenericTrigger", {
  trigger: {
    type: "kafkaTrigger",
    direction: "in",
    name: "event",
    protocol: "SASLSSL",
    password: "EventHubConnectionString",
    dataType: "string",
    topic: "topic",
    authenticationMode: "PLAIN",
    avroSchema:
      '{"type":"record","name":"Payment","namespace":"io.confluent.examples.clients.basicavro","fields":[{"name":"id","type":"string"},{"name":"amount","type":"double"},{"name":"type","type":"string"}]}',
    consumerGroup: "$Default",
    username: "$ConnectionString",
    brokerList: "%BrokerList%",
  },
  handler: kafkaAvroGenericTrigger,
});
```

# [Confluent](#tab/confluent/v3)

:::code language="json" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTriggerAvroGeneric/function.confluent.json" :::

The following code runs when the function is triggered:

:::code language="typescript" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTriggerAvroGeneric/index.ts" :::

# [Event Hubs](#tab/event-hubs/v3)

:::code language="json" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTriggerAvroGeneric/function.eventhub.json" :::

The following code runs when the function is triggered:

:::code language="typescript" source="~/azure-functions-kafka-extension/samples/typescript/KafkaTriggerAvroGeneric/index.ts" :::

---

# [Version 4](#tab/v4) 

For a complete set of working TypeScript examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/tree/dev/samples/typescript-v4/src/functions).

# [Version 3](#tab/v3)

For a complete set of working TypeScript examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/typescript/).

--- 

::: zone-end  
::: zone pivot="programming-language-powershell" 

The specific properties of the `function.json` file depend on your event provider. In these examples, the event providers are either Confluent or Azure Event Hubs. The following examples show a Kafka trigger for a function that reads and logs a Kafka message.

The following `function.json` file defines the trigger for the specific provider:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTrigger/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTrigger/function.eventhub.json" :::

---

The following code runs when the function is triggered:

:::code language="powershell" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTrigger/run.ps1" :::

To receive events in a batch, set the `cardinality` value to `many` in the function.json file, as shown in the following examples:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerMany/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerMany/function.eventhub.json" :::

---

The following code parses the array of events and logs the event data:

:::code language="powershell" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerMany/run.ps1" :::

The following code logs the header data:

:::code language="powershell" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerManyWithHeaders/run.ps1" :::

You can define a generic [Avro schema] for the event passed to the trigger. The following function.json defines the trigger for the specific provider with a generic Avro schema:

# [Confluent](#tab/confluent)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerAvroGeneric/function.confluent.json" :::

# [Event Hubs](#tab/event-hubs)

:::code language="json" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerAvroGeneric/function.eventhub.json" :::

---

The following code runs when the function is triggered:

:::code language="powershell" source="~/azure-functions-kafka-extension/samples/powershell/KafkaTriggerAvroGeneric/run.ps1" :::

For a complete set of working PowerShell examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/powershell/). 

::: zone-end   
::: zone pivot="programming-language-python"  
The usage of the trigger depends on your version of the Python programming model. 

# [Version 2](#tab/v2) 

In the Python v2 model, you define your trigger directly in your function code using decorators. For more information, see the [Azure Functions Python developer guide](functions-reference-python.md?pivots=python-mode-decorators).

# [Version 1](#tab/v1)

In the Python v1 model, you define your trigger in the `function.json` with your function code. For more information, see the [Azure Functions Python developer guide](functions-reference-python.md?pivots=python-mode-configuration).

---

These examples show how to define a Kafka trigger for a function that reads a Kafka message.

# [Version 2](#tab/v2)

:::code language="python" source="~/azure-functions-kafka-extension/samples/python-v2/kafka_trigger.py" range="10-22" :::

# [Version 1](#tab/v1)

This `function.json` file defines the trigger:

:::code language="json" source="~/azure-functions-kafka-extension/samples/python/KafkaTrigger/function.confluent.json" :::

This code runs when the function is triggered:

:::code language="python" source="~/azure-functions-kafka-extension/samples/python/KafkaTrigger/main.py" :::

---

This example receives events in a batch by setting the `cardinality` value to `many`.

# [Version 2](#tab/v2)

:::code language="python" source="~/azure-functions-kafka-extension/samples/python-v2/kafka_trigger.py" range="24-38" :::

# [Version 1](#tab/v1)

:::code language="json" source="~/azure-functions-kafka-extension/samples/python/KafkaTriggerMany/function.confluent.json" :::

This code parses the array of events and logs the event data:

:::code language="python" source="~/azure-functions-kafka-extension/samples/python/KafkaTriggerMany/main.py" :::

This code logs the header data:

:::code language="python" source="~/azure-functions-kafka-extension/samples/python/KafkaTriggerManyWithHeaders/__init__.py" :::

---

You can define a generic [Avro schema] for the event passed to the trigger. 

# [Version 2](#tab/v2)

:::code language="python" source="~/azure-functions-kafka-extension/samples/python-v2/kafka_trigger_avro.py" range="24-37" :::

# [Version 1](#tab/v1)

This `function.json` defines the trigger with a generic Avro schema:

:::code language="json" source="~/azure-functions-kafka-extension/samples/python/KafkaTriggerAvroGeneric/function.confluent.json" :::

This code runs when the function is triggered:

:::code language="python" source="~/azure-functions-kafka-extension/samples/python/KafkaTriggerAvroGeneric/main.py" :::

---

# [Version 2](#tab/v2) 

For a complete set of working Python examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/python-v2/).

# [Version 1](#tab/v1)

For a complete set of working Python examples, see the [Kafka extension repository](https://github.com/Azure/azure-functions-kafka-extension/blob/dev/samples/python/).

--- 

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

The following table explains the properties you can set by using this trigger attribute:

| Parameter |Description|
| --- | --- |
| **BrokerList** | (Required) The list of Kafka brokers monitored by the trigger. See [Connections](#connections) for more information. |
| **Topic** | (Required) The topic monitored by the trigger. |
| **ConsumerGroup** | (Optional) Kafka consumer group used by the trigger. |
| **AvroSchema** | (Optional) Schema of a generic record of message value when using the Avro protocol. |
| **KeyAvroSchema** | (Optional) Schema of a generic record of message key when using the Avro protocol. |
| **KeyDataType** | (Optional) Data type to receive the message key as from Kafka Topic. If `KeyAvroSchema` is set, this value is generic record. Accepted values are `Int`, `Long`, `String`, and `Binary`. |
| **AuthenticationMode** | (Optional) The authentication mode when using Simple Authentication and Security Layer (SASL) authentication. The supported values are `NotSet` (default), `Gssapi`, `Plain`, `ScramSha256`, `ScramSha512`, and `OAuthBearer`. |
| **Username** | (Optional) The username for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information.| 
| **Password** | (Optional) The password for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information.| 
| **Protocol** | (Optional) The security protocol used when communicating with brokers. The supported values are `NotSet` (default), `plaintext`, `ssl`, `sasl_plaintext`, `sasl_ssl`. |
| **SslCaLocation** | (Optional) Path to CA certificate file for verifying the broker's certificate. |
| **SslCertificateLocation** | (Optional) Path to the client's certificate. |
| **SslKeyLocation** | (Optional) Path to client's private key (PEM) used for authentication. |
| **SslKeyPassword** | (Optional) Password for client's certificate. |
| **SslCertificatePEM** | (Optional) Client certificate in PEM format as a string. See [Connections](#connections) for more information. |
| **SslKeyPEM** | (Optional) Client private key in PEM format as a string. See [Connections](#connections) for more information. |
| **SslCaPEM** | (Optional) CA certificate in PEM format as a string. See [Connections](#connections) for more information. |
| **SslCertificateandKeyPEM** | (Optional) Client certificate and key in PEM format as a string. See [Connections](#connections) for more information. |
| **SchemaRegistryUrl** | (Optional) URL for the Avro Schema Registry. See [Connections](#connections) for more information. |
| **SchemaRegistryUsername** | (Optional) Username for the Avro Schema Registry. See [Connections](#connections) for more information. |
| **SchemaRegistryPassword** | (Optional) Password for the Avro Schema Registry. See [Connections](#connections) for more information. |
| **OAuthBearerMethod** | (Optional) OAuth Bearer method. Accepted values are `oidc` and `default`. |
| **OAuthBearerClientId** | (Optional) When `OAuthBearerMethod` is set to `oidc`, this specifies the OAuth bearer client ID. See [Connections](#connections) for more information. |
| **OAuthBearerClientSecret** | (Optional) When `OAuthBearerMethod` is set to `oidc`, this specifies the OAuth bearer client secret. See [Connections](#connections) for more information. |
| **OAuthBearerScope** | (Optional) Specifies the scope of the access request to the broker. |
| **OAuthBearerTokenEndpointUrl** | (Optional) OAuth/OIDC issuer token endpoint HTTP(S) URI used to retrieve token when `oidc` method is used. See [Connections](#connections) for more information. |
| **OAuthBearerExtensions** | (Optional) Comma-separated list of key=value pairs to be provided as additional information to broker when `oidc` method is used. For example: `supportFeatureX=true,organizationId=sales-emea`. |


::: zone-end  
::: zone pivot="programming-language-java"

## Annotations

The `KafkaTrigger` annotation enables you to create a function that runs when it receives a topic. Supported options include the following elements:

| Element | Description |
|---------|----------------------|
| **name** | (Required) The name of the variable that represents the queue or topic message in function code. |
| **brokerList** | (Required) The list of Kafka brokers monitored by the trigger. See [Connections](#connections) for more information. |
| **topic** | (Required) The topic monitored by the trigger. |
| **cardinality** | (Optional) Indicates the cardinality of the trigger input. The supported values are `ONE` (default) and `MANY`. Use `ONE` when the input is a single message and `MANY` when the input is an array of messages. When you use `MANY`, you must also set a `dataType`. |
| **dataType** | Defines how Functions handles the parameter value. By default, the value is obtained as a string and Functions tries to  deserialize the string to actual plain-old Java object (POJO). When `string`, the input is treated as just a string. When `binary`, the message is received as binary data, and Functions tries to deserialize it to an actual parameter type byte[]. | 
| **consumerGroup** | (Optional) Kafka consumer group used by the trigger. |
| **avroSchema** | (Optional) Schema of a generic record when using the Avro protocol. |
| **authenticationMode** | (Optional) The authentication mode when using Simple Authentication and Security Layer (SASL) authentication. The supported values are `NotSet` (default), `Gssapi`, `Plain`, `ScramSha256`, `ScramSha512`. |
| **username** | (Optional) The username for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information.| 
| **password** | (Optional) The password for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information.| 
| **protocol** | (Optional) The security protocol used when communicating with brokers. The supported values are `NotSet` (default), `plaintext`, `ssl`, `sasl_plaintext`, `sasl_ssl`. |
| **sslCaLocation** | (Optional) Path to CA certificate file for verifying the broker's certificate. |
| **sslCertificateLocation** | (Optional) Path to the client's certificate. |
| **sslKeyLocation** | (Optional) Path to client's private key (PEM) used for authentication. |
| **sslKeyPassword** | (Optional) Password for client's certificate. |
| **lagThreshold** | (Optional) Lag threshold for the trigger. |
| **schemaRegistryUrl** | (Optional) URL for the Avro Schema Registry. See [Connections](#connections) for more information. |
| **schemaRegistryUsername** | (Optional) Username for the Avro Schema Registry. See [Connections](#connections) for more information. |
| **schemaRegistryPassword** | (Optional) Password for the Avro Schema Registry. See [Connections](#connections) for more information. |


::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell"  

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

| _function.json_ property |Description|
| --- | --- |
|**type** | (Required) Set to `kafkaTrigger`. |
|**direction** | (Required) Set to `in`. |
|**name** | (Required) The name of the variable that represents the brokered data in function code. |
| **brokerList** | (Required) The list of Kafka brokers monitored by the trigger.  See [Connections](#connections) for more information.|
| **topic** | (Required) The topic monitored by the trigger. |
| **cardinality** | (Optional) Indicates the cardinality of the trigger input. The supported values are `ONE` (default) and `MANY`. Use `ONE` when the input is a single message and `MANY` when the input is an array of messages. When you use `MANY`, you must also set a `dataType`. |
| **dataType** | Defines how Functions handles the parameter value. By default, the value is obtained as a string and Functions tries to  deserialize the string to actual plain-old Java object (POJO). When `string`, the input is treated as just a string. When `binary`, the message is received as binary data, and Functions tries to deserialize it to an actual byte array parameter type. | 
| **consumerGroup** | (Optional) Kafka consumer group used by the trigger. |
| **avroSchema** | (Optional) Schema of a generic record when using the Avro protocol. |
| **keyAvroSchema** | (Optional) Schema of a generic record of message key when using the Avro protocol. |
| **keyDataType** | (Optional) Data type to receive the message key as from Kafka Topic. If `keyAvroSchema` is set, this value is generic record. Accepted values are `Int`, `Long`, `String`, and `Binary`. |
| **authenticationMode** | (Optional) The authentication mode when using Simple Authentication and Security Layer (SASL) authentication. The supported values are `NotSet` (default), `Gssapi`, `Plain`, `ScramSha256`, `ScramSha512`. |
| **username** | (Optional) The username for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information. | 
| **password** | (Optional) The password for SASL authentication. Not supported when `AuthenticationMode` is `Gssapi`. See [Connections](#connections) for more information.| 
| **protocol** | (Optional) The security protocol used when communicating with brokers. The supported values are `NotSet` (default), `plaintext`, `ssl`, `sasl_plaintext`, `sasl_ssl`. |
| **sslCaLocation** | (Optional) Path to CA certificate file for verifying the broker's certificate. |
| **sslCertificateLocation** | (Optional) Path to the client's certificate. |
| **sslKeyLocation** | (Optional) Path to client's private key (PEM) used for authentication. |
| **sslKeyPassword** | (Optional) Password for client's certificate. |
| **sslCertificatePEM** | (Optional) Client certificate in PEM format as a string. See [Connections](#connections) for more information. |
| **sslKeyPEM** | (Optional) Client private key in PEM format as a string. See [Connections](#connections) for more information. |
| **sslCaPEM** | (Optional) CA certificate in PEM format as a string. See [Connections](#connections) for more information. |
| **sslCertificateandKeyPEM** | (Optional) Client certificate and key in PEM format as a string. See [Connections](#connections) for more information. |
| **lagThreshold** | (Optional) Lag threshold for the trigger. |
| **schemaRegistryUrl** | (Optional) URL for the Avro Schema Registry. See [Connections](#connections) for more information. |
| **schemaRegistryUsername** | (Optional) Username for the Avro Schema Registry. See [Connections](#connections) for more information. |
| **schemaRegistryPassword** | (Optional) Password for the Avro Schema Registry. See [Connections](#connections) for more information. |
| **oAuthBearerMethod** | (Optional) OAuth Bearer method. Accepted values are `oidc` and `default`. |
| **oAuthBearerClientId** | (Optional) When `oAuthBearerMethod` is set to `oidc`, this specifies the OAuth bearer client ID. See [Connections](#connections) for more information. |
| **oAuthBearerClientSecret** | (Optional) When `oAuthBearerMethod` is set to `oidc`, this specifies the OAuth bearer client secret. See [Connections](#connections) for more information. |
| **oAuthBearerScope** | (Optional) Specifies the scope of the access request to the broker. |
| **oAuthBearerTokenEndpointUrl** | (Optional) OAuth/OIDC issuer token endpoint HTTP(S) URI used to retrieve token when `oidc` method is used. See [Connections](#connections) for more information. |

::: zone-end
::: zone pivot="programming-language-python"

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file. Python uses snake_case naming conventions for configuration properties.

| _function.json_ property |Description|
| --- | --- |
|**type** | (Required) Set to `kafkaTrigger`. |
|**direction** | (Required) Set to `in`. |
|**name** | (Required) The name of the variable that represents the brokered data in function code. |
| **broker_list** | (Required) The list of Kafka brokers monitored by the trigger. See [Connections](#connections) for more information.|
| **topic** | (Required) The topic monitored by the trigger. |
| **cardinality** | (Optional) Indicates the cardinality of the trigger input. The supported values are `ONE` (default) and `MANY`. Use `ONE` when the input is a single message and `MANY` when the input is an array of messages. When you use `MANY`, you must also set a `data_type`. |
| **data_type** | Defines how Functions handles the parameter value. By default, the value is obtained as a string and Functions tries to deserialize the string to actual plain-old Java object (POJO). When `string`, the input is treated as just a string. When `binary`, the message is received as binary data, and Functions tries to deserialize it to an actual parameter type byte[]. | 
| **consumerGroup** | (Optional) Kafka consumer group used by the trigger. |
| **avroSchema** | (Optional) Schema of a generic record when using the Avro protocol. |
| **authentication_mode** | (Optional) The authentication mode when using Simple Authentication and Security Layer (SASL) authentication. The supported values are `NOTSET` (default), `Gssapi`, `Plain`, `ScramSha256`, `ScramSha512`. |
| **username** | (Optional) The username for SASL authentication. Not supported when `authentication_mode` is `Gssapi`. See [Connections](#connections) for more information. | 
| **password** | (Optional) The password for SASL authentication. Not supported when `authentication_mode` is `Gssapi`. See [Connections](#connections) for more information.| 
| **protocol** | (Optional) The security protocol used when communicating with brokers. The supported values are `NOTSET` (default), `plaintext`, `ssl`, `sasl_plaintext`, `sasl_ssl`. |
| **sslCaLocation** | (Optional) Path to CA certificate file for verifying the broker's certificate. |
| **sslCertificateLocation** | (Optional) Path to the client's certificate. |
| **sslKeyLocation** | (Optional) Path to client's private key (PEM) used for authentication. |
| **sslKeyPassword** | (Optional) Password for client's certificate. |
| **lag_threshold** | (Optional) Lag threshold for the trigger. |
| **schema_registry_url** | (Optional) URL for the Avro Schema Registry. See [Connections](#connections) for more information. |
| **schema_registry_username** | (Optional) Username for the Avro Schema Registry. See [Connections](#connections) for more information. |
| **schema_registry_password** | (Optional) Password for the Avro Schema Registry. See [Connections](#connections) for more information. |
| **o_auth_bearer_method** | (Optional) OAuth Bearer method. Accepted values are `oidc` and `default`. |
| **o_auth_bearer_client_id** | (Optional) When `o_auth_bearer_method` is set to `oidc`, this specifies the OAuth bearer client ID. See [Connections](#connections) for more information. |
| **o_auth_bearer_client_secret** | (Optional) When `o_auth_bearer_method` is set to `oidc`, this specifies the OAuth bearer client secret. See [Connections](#connections) for more information. |
| **o_auth_bearer_scope** | (Optional) Specifies the scope of the access request to the broker. |
| **o_auth_bearer_token_endpoint_url** | (Optional) OAuth/OIDC issuer token endpoint HTTP(S) URI used to retrieve token when `oidc` method is used. See [Connections](#connections) for more information. |

> [!NOTE]
> Certificate PEM-related properties and Avro key-related properties aren't yet available in the Python library.

::: zone-end

## Usage

::: zone pivot="programming-language-csharp"

# [Isolated worker model](#tab/isolated-process)

The Kafka trigger currently supports Kafka events as strings and string arrays that are JSON payloads.

# [In-process model](#tab/in-process)

The Kafka trigger passes Kafka events to the function as `KafkaEventData<string>` objects or arrays. The trigger also supports strings and string arrays that are JSON payloads.
 
---

::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell" 

The Kafka trigger passes Kafka messages to the function as strings. The trigger also supports string arrays that are JSON payloads.

::: zone-end 

In a Premium plan, you must enable runtime scale monitoring for the Kafka output to scale out to multiple instances. To learn more, see [Enable runtime scaling](functions-bindings-kafka.md#enable-runtime-scaling). 

You can't use the **Test/Run** feature of the **Code + Test** page in the Azure portal to work with Kafka triggers. You must instead send test events directly to the topic being monitored by the trigger.  

For a complete set of supported host.json settings for the Kafka trigger, see [host.json settings](functions-bindings-kafka.md#hostjson-settings). 

[!INCLUDE [functions-bindings-kafka-connections](../../includes/functions-bindings-kafka-connections.md)]

## Next steps

- [Write to an Apache Kafka stream from a function](./functions-bindings-kafka-output.md)

[Avro schema]: http://avro.apache.org/docs/current/
