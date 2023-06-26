---
title: Using RedisListTrigger Azure Function
description: Learn how to use RedisListTrigger Azure Functions
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 06/14/2023

---

# RedisListTrigger Azure Function

The `RedisListsTrigger` pops elements from a list and surfaces those elements to the function. The trigger polls Redis at a configurable fixed interval, and uses [`LPOP`](https://redis.io/commands/lpop/)/[`RPOP`](https://redis.io/commands/rpop/)/[`LMPOP`](https://redis.io/commands/lmpop/) to pop elements from the lists.

## Inputs for RedisListsTrigger

The following sample polls the key `listTest` at a localhost Redis instance at `127.0.0.1:6379`:

## Example

::: zone pivot="programming-language-csharp"

<!--Optional intro text goes here, followed by the C# modes include.-->
[!INCLUDE functions-bindings-csharp-intro]

In-process

```csharp
[FunctionName(nameof(ListsTrigger))]
public static void ListsTrigger(
    [RedisListsTrigger(ConnectionString = "127.0.0.1:6379", Keys = "listTest")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```

Isolated process
<!--add a link to the extension-specific code example in this repo: https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/Extensions/ as in the following example: :::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="35-49"::: -->
::: zone-end
::: zone pivot="programming-language-java"

```java
@FunctionName("ListTrigger")
    public void ListTrigger(
            @RedisListTrigger(
                name = "entry",
                connectionStringSetting = "redisLocalhost",
                key = "listTest",
                pollingIntervalInMs = 100,
                messagesPerWorker = 10,
                count = 1,
                listPopFromBeginning = false)
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
      "type": "redisListTrigger",
      "listPopFromBeginning": true,
      "connectionStringSetting": "redisLocalhost",
      "key": "listTest",
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

## Attributes

- `ConnectionString`: connection string to the redis cache, for example`<cacheName>.redis.cache.windows.net:6380,password=...`.
- `Keys`: Keys to read from, space-delimited.
  - Multiple keys only supported on Redis 7.0+ using [`LMPOP`](https://redis.io/commands/lmpop/).
  - Listens to only the first key given in the argument using [`LPOP`](https://redis.io/commands/lpop/)/[`RPOP`](https://redis.io/commands/rpop/) on Redis versions less than 7.0.
- (optional) `PollingIntervalInMs`: How often to poll Redis in milliseconds.
  - Default: 1000
- (optional) `MessagesPerWorker`: How many messages each functions worker "should" process. Used to determine how many workers the function should scale to.
  - Default: 100
- (optional) `BatchSize`: Number of elements to pull from Redis at one time.
  - Default: 10
  - Only supported on Redis 6.2+ using the `COUNT` argument in [`LPOP`](https://redis.io/commands/lpop/)/[`RPOP`](https://redis.io/commands/rpop/).
- (optional) `ListPopFromBeginning`: determines whether to pop elements from the beginning using [`LPOP`](https://redis.io/commands/lpop/) or to pop elements from the end using [`RPOP`](https://redis.io/commands/rpop/).
  - Default: true

<!-- If the attribute's constructor takes parameters, you'll need to include a table like this, where the values are from the original table in the Configuration section: The attribute's constructor takes the following parameters: |Parameter | Description| |---------|----------------------| |**Parameter1** |Description 1| |**Parameter2** | Description 2| -->

::: zone-end
::: zone pivot="programming-language-java"

## Annotations
<!-- Equivalent values for the annotation parameters in Java.-->
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"

## Configuration

The following table explains the binding configuration properties that you set in the function.json file.

<!-- this get more complex when you support the Python v2 model. --> <!-- suggestion |function.json property |Description| |---------|---------| | **type** | Required - must be set to `eventGridTrigger`. | | **direction** | Required - must be set to `in`. | | **name** | Required - the variable name used in function code for the parameter that receives the event data. | -->
::: zone-end

See the Example section for complete examples.

## Usage

::: zone pivot="programming-language-csharp"
The parameter type supported by the XXX trigger depends on the Functions runtime version and the C# modality used.

::: zone-end

<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-java"

<!--Any usage information from the Java tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell"

<!--Any usage information from the JavaScript tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-powershell"

<!--Any usage information from the PowerShell tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-python"

<!--Any usage information from the Python tab in ## Usage. -->
::: zone-end

<!---## Extra sections Put any sections with content that doesn't fit into the above section headings down here. -->
host.json settings
<!-- Some bindings don't have this section. If yours doesn't, please remove this section. -->
Next steps
<!--At least one next step link.-->