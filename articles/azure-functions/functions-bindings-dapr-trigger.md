---
title: Dapr trigger for Azure Functions
description: Learn how to run an Azure Function as Dapr data changes.
ms.topic: reference
ms.date: 04/17/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr trigger for Azure Functions

Azure Functions can be triggered using the following Dapr events.

There are no templates for triggers in Dapr in the functions tooling today. Start your project with another trigger type (e.g. Storage Queues) and then modify the function.json or attributes.

## Examples

::: zone pivot="programming-language-csharp"

<!--Optional intro text goes here, followed by the C# modes include.-->
[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [In-process](#tab/in-process)

### Input Binding trigger

```csharp
[FunctionName("ConsumeMessageFromKafka")]
public static void Run(
    // Note: the value of BindingName must match the binding name in components/kafka-bindings.yaml
    [DaprBindingTrigger(BindingName = "%KafkaBindingName%")] JObject triggerData,
    ILogger log)
{
    log.LogInformation("Hello from Kafka!");
    log.LogInformation($"Trigger data: {triggerData}");
}
```

### Service Invocation trigger

```csharp
[FunctionName("RetrieveOrder")]
public static void Run(
    [DaprServiceInvocationTrigger] object args,
    [DaprState("%StateStoreName%", Key = "order")] string data,
    ILogger log)
{
    log.LogInformation("C# function processed a RetrieveOrder request from the Dapr Runtime.");
    // print the fetched state value
    log.LogInformation(data);
}
```

### Topic trigger

```csharp
[FunctionName("PrintTopicMessage")]
public static void Run(
    [DaprTopicTrigger("%PubSubName%", Topic = "B")] CloudEvent subEvent,
    ILogger log)
{
    log.LogInformation("C# function processed a PrintTopicMessage request from the Dapr Runtime.");
    log.LogInformation($"Topic B received a message: {subEvent.Data}.");
}
```

 
# [Isolated process](#tab/isolated-process)

<!--add a link to the extension-specific code example in this repo: https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/Extensions/ as in the following example: 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="35-49"::: 

-->


# [C# Script](#tab/csharp-script)

### Input Binding trigger

The following shows a Dapr binding trigger in a _function.json_ file and code that uses the binding. 

```json
{
    "type": "daprBindingTrigger",
    "bindingName": "myKafkaBinding",
    "name": "triggerData",
    "direction": "in"
}
```

Here's C# script code that binds to a <insert>:

```csharp

```

### Service Invocation trigger

The following shows a Dapr binding trigger in a _function.json_ file and code that uses the binding. 

```json
{
    "type": "daprServiceInvocationTrigger",
    "name": "triggerData",
    "direction": "in"
}
```

Here's C# script code that binds to a <insert>:

```csharp

```

### Topic trigger

The following shows a Dapr binding trigger in a _function.json_ file and code that uses the binding. 

```json
{
    "type": "daprTopicTrigger",
    "pubsubname": "pubsub",
    "topic": "myTopic",
    "name": "triggerData",
    "direction": "in"
}
```

Here's C# script code that binds to a <insert>:

```csharp

```


---

::: zone-end 

::: zone pivot="programming-language-java"

> [!IMPORTANT]
> Dapr triggers for Java are currently under development.

::: zone-end
::: zone pivot="programming-language-javascript"

<!--Content and samples from the JavaScript tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-powershell"

> [!IMPORTANT]
> Dapr triggers for Java are currently under development.

::: zone-end
::: zone pivot="programming-language-python"

<!--Content and samples from the Python tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-csharp"

## Attributes
Both in-process and isolated process C# libraries use the <!--attribute API here--> attribute to define the function. C# script instead uses a function.json configuration file.

# [In-process](#tab/in-process)

### Input Binding trigger

In [C# class libraries], use the [DaprBindingTrigger] to trigger a Dapr input binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **BindingName** | The name of the Dapr trigger. If not specified, the name of the function is used as the trigger name. | 

### Service Invocation trigger

In [C# class libraries], use the [DaprServiceInvocationTrigger] to trigger a Dapr input binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **MethodName** | Optional. The name of the method the Dapr caller should use. If not specified, the name of the function is used as the method name. | 

### Topic trigger

In [C# class libraries], use the [DaprBindingTrigger] to trigger a Dapr input binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **PubSubName** | The name of the Dapr pub/sub. | 
| **Topic** | The name of the Dapr topic. | 

# [Isolated process](#tab/isolated-process)

<!-- C# attribute information for the trigger goes here with an intro sentence. Use a code link like the following to show the method definition: 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="13-16"::: 

-->

# [C# Script](#tab/csharp-script)

C# script uses a _function.json_ file for configuration instead of attributes.

### Input Binding trigger

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprBindingTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**bindingName** | The name of the binding. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#usage) section. |

### Service Invocation trigger

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprServiceInvocationTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#usage) section. |

### Topic trigger

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprTopicTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**pubsubname** |  |
|**topic** |  |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#usage) section. |

---

::: zone-end
::: zone pivot="programming-language-java"

<!--not supported yet -->
::: zone-end
::: zone pivot="programming-language-javascript"
The following table explains the binding configuration properties that you set in the function.json file.

<!-- suggestion |function.json property |Description| |---------|---------| | **type** | Required - must be set to `eventGridTrigger`. | | **direction** | Required - must be set to `in`. | | **name** | Required - the variable name used in function code for the parameter that receives the event data. | -->

::: zone-end

::: zone pivot="programming-language-powershell"
<!--not supported yet -->

::: zone-end

::: zone pivot="programming-language-python"

## Configuration
The following table explains the binding configuration properties that you set in the function.json file.

<!-- suggestion |function.json property |Description| |---------|---------| | **type** | Required - must be set to `eventGridTrigger`. | | **direction** | Required - must be set to `in`. | | **name** | Required - the variable name used in function code for the parameter that receives the event data. | -->
::: zone-end

See the Example section for complete examples.

## Usage
::: zone pivot="programming-language-csharp"
The parameter type supported by the Event Grid trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

# [In-process](#tab/in-process)

<!--Any usage information from the C# tab in ## Usage. -->
 
# [Isolated process](#tab/isolated-process)

<!--If available, call out any usage information from the linked example in the worker repo. -->

# [C# Script](#tab/csharp-script)


---

::: zone-end

<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-java"

<!--Any usage information from the Java tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-javascript"

<!--Any usage information from the JavaScript tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-powershell"

<!--Any usage information from the PowerShell tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-python"

<!--Any usage information from the Python tab in ## Usage. -->
::: zone-end

<!---## Extra sections Put any sections with content that doesn't fit into the above section headings down here. This will likely get moved to another article after the refactor. -->
## host.json settings
<!-- Some bindings don't have this section. If yours doesn't, please remove this section. -->
## Next steps
- [Pull in Dapr state and secrets](./functions-bindings-dapr-input.md)
- [Send a value to a Dapr topic or output binding](./functions-bindings-dapr-output.md)