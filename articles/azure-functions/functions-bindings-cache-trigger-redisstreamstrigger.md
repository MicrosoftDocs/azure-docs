---
title: Using RedisStreamTrigger Azure Function
description: Learn how to use RedisStreamTrigger Azure Function
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 06/14/2023

---

# RedisStreamTrigger Azure Function

The `RedisStreamsTrigger` pops elements from a stream and surfaces those elements to the function.

The trigger polls Redis at a configurable fixed interval, and uses [`XREADGROUP`](https://redis.io/commands/xreadgroup/) to read elements from the stream.
Each function creates a new random GUID to use as its consumer name within the group to ensure that scaled out instances of the function don't read the same messages from the stream.
<!--Intro info goes here-->

## Example

::: zone pivot="programming-language-csharp"

<!--Optional intro text goes here, followed by the C# modes include.-->
[!INCLUDE functions-bindings-csharp-intro]

In-process

```csharp
[FunctionName(nameof(StreamsTrigger))]
public static void StreamsTrigger(
    [RedisStreamsTrigger(ConnectionString = "127.0.0.1:6379", Keys = "streamTest")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```

<!--Content and samples from the C# tab in ##Examples go here.-->
Isolated process
<!--add a link to the extension-specific code example in this repo: https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/Extensions/ as in the following example: :::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="35-49"::: -->
::: zone-end
::: zone pivot="programming-language-java"

```java
@FunctionName("StreamTrigger")
    public void StreamTrigger(
            @RedisStreamTrigger(
                name = "entry",
                connectionStringSetting = "redisLocalhost",
                key = "streamTest",
                pollingIntervalInMs = 100,
                messagesPerWorker = 10,
                count = 1,
                deleteAfterProcess = true)
                String entry,
            final ExecutionContext context) {
            context.getLogger().info(entry);
    }
```

<!--Content and samples from the Java tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-javascript"

<!--Content and samples from the JavaScript tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-powershell"

<!--Content and samples from the PowerShell tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-python"

```json
{
  "bindings": [
    {
      "type": "redisStreamTrigger",
      "deleteAfterProcess": false,
      "connectionStringSetting": "redisLocalhost",
      "key": "streamTest",
      "pollingIntervalInMs": 1000,
      "messagesPerWorker": 100,
      "count": 10,
      "name": "entry",
      "direction": "in"
    }
  ],
  "scriptFile": "__init__.py"
}
```
<!--Content and samples from the Python tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-csharp"

Attributes
Both in-process and isolated process C# libraries use the <!--attribute API here--> attribute to define the function. C# script instead uses a function.json configuration file.

<!-- If the attribute's constructor takes parameters, you'll need to include a table like this, where the values are from the original table in the Configuration section: The attribute's constructor takes the following parameters: |Parameter | Description| |---------|----------------------| |**Parameter1** |Description 1| |**Parameter2** | Description 2| -->
In-process
<!--C# attribute information for the trigger from ## Attributes and annotations goes here, with intro sentence.-->
Isolated process
<!-- C# attribute information for the trigger goes here with an intro sentence. Use a code link like the following to show the method definition: :::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="13-16"::: -->
::: zone-end
::: zone pivot="programming-language-java"

Annotations
<!-- Equivalent values for the annotation parameters in Java.-->
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"

### Return values

All triggers return a `RedisMessageModel` object that has two fields:

- `Trigger`: The pubsub channel, list key, or stream key that the function is listening to.
- `Message`: The pubsub message, list element, or stream element.


Configuration
The following table explains the binding configuration properties that you set in the function.json file.

<!-- this get more complex when you support the Python v2 model. --> <!-- suggestion |function.json property |Description| |---------|---------| | **type** | Required - must be set to `eventGridTrigger`. | | **direction** | Required - must be set to `in`. | | **name** | Required - the variable name used in function code for the parameter that receives the event data. | -->
::: zone-end

See the Example section for complete examples.

Usage
::: zone pivot="programming-language-csharp"
The parameter type supported by the XXX trigger depends on the Functions runtime version and the C# modality used.

In-process

```csharp
namespace Microsoft.Azure.WebJobs.Extensions.Redis
{
  public class RedisMessageModel
  {
    public string Trigger { get; set; }
    public string Message { get; set; }
  }
}
```

<!--Any usage information specific to in-process, including types. -->
Isolated process
<!--Any usage information specific to isolated worker process, including types. -->

::: zone-end
<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-java"

```java
public class RedisMessageModel {
    public String Trigger;
    public String Message;
}
```

<!--Any usage information from the Java tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell"

<!--Any usage information from the JavaScript tab in ## Usage. -->
::: zone-end

::: zone pivot="programming-language-powershell"

<!--Any usage information from the PowerShell tab in ## Usage. -->
::: zone-end

::: zone pivot="programming-language-python"

```python
class RedisMessageModel:
    def __init__(self, trigger, message):
        self.Trigger = trigger
        self.Message = message
```
<!--Any usage information from the Python tab in ## Usage. -->
::: zone-end

<!---## Extra sections Put any sections with content that doesn't fit into the above section headings down here. -->
host.json settings

<!-- Some bindings don't have this section. If yours doesn't, please remove this section. -->
Next steps

- [Introduction to Azure Functions](/azure/azure-functions/functions-overview)
- [Get started with Azure Functions triggers in Azure Cache for Redis](/azure/cache/cache-tutorial-functions-getting-started.md)
- [Using Azure Functions and Azure Cache for Redis to create a write-behind cache](/azure/cache/cache-tutorial-write-behind.md)
- 
