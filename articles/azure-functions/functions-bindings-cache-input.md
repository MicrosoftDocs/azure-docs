---
title: Using Redis Input Azure Function for Azure Cache for Redis (preview)
description: Learn how to use Redis an input Azure Functions 
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: azure-functions
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: reference
ms.date: 12/19/2023
---

# Azure Cache for Redis input binding for Azure Functions

When a function runs, the Azure Azure Cache for Redis input binding retrieves data from a cache and passes it to the input parameter of the function.

For information on setup and configuration details, see the [overview](functions-bindings-cache.md).

## Example

::: zone pivot="programming-language-csharp"

The following sample gets any key that was recently set from the _SetGetter_ sample.

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

More samples for the Azure Cache for Redis input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-redis-extension/tree/main).
<!-- link to redis samples -->

# [In-process](#tab/in-process)

```C#
﻿using Microsoft.Extensions.Logging;

namespace Microsoft.Azure.WebJobs.Extensions.Redis.Samples.RedisPubSubTrigger
{
    internal class SetGetter
    {
        [FunctionName(nameof(SetGetter))]
        public static void Run(
            [RedisPubSubTrigger(Common.connectionStringSetting, "__keyevent@0__:set")] string key,
            [Redis(Common.connectionStringSetting, "GET {Message}")] string value,
            ILogger logger)
        {
            logger.LogInformation($"Key '{key}' was set to value '{value}'");
        }
    }
}
```

# [Isolated process](#tab/isolated-process)

```csharp
﻿using Microsoft.Extensions.Logging;

namespace Microsoft.Azure.Functions.Worker.Extensions.Redis.Samples.RedisInputBinding
{
    public class SetGetter
    {
        private readonly ILogger<SetGetter> logger;

        public SetGetter(ILogger<SetGetter> logger)
        {
            this.logger = logger;
        }

        [Function(nameof(SetGetter))]
        public void Run(
            [RedisPubSubTrigger(Common.connectionStringSetting, "__keyevent@0__:set")] string key,
            [RedisInput(Common.connectionStringSetting, "GET {Message}")] string value)
        {
            logger.LogInformation($"Key '{key}' was set to value '{value}'");
        }
    }
}

```
---

::: zone-end
::: zone pivot="programming-language-java"

Not available in preview.

<!--Content and samples from the Java tab in ##Examples go here.-->

::: zone-end  
::: zone pivot="programming-language-javascript"  

Not available in preview.

<!--Content and samples from the JavaScript tab in ##Examples go here.-->

::: zone-end  
::: zone pivot="programming-language-powershell"  

Not available in preview.

<!--Content and samples from the PowerShell tab in ##Examples go here.-->

::: zone-end  
::: zone pivot="programming-language-python"  

Here's the binding data in the _function.json_ file.

```python
        {
            "type": "redisPubSubTrigger",
            "connectionStringSetting": "redisConnectionString",
            "channel": "__keyevent@0__:set",
            "name": "key",
            "direction": "in"
        },
        {
            "type": "redis",
            "connectionStringSetting": "redisConnectionString",
            "command": "GET {Message}",
            "name": "value",
            "direction": "in"
        }
```



```python
import logging

def main(key: str, value: str):
    logging.info("Key '" + key + "' was set to value '" + value + "'")

```

The [configuration](#configuration) section explains these properties.

::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes

# [In-process](#tab/in-process)

|Attribute property | Description                                                                                                                                                 |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ConnectionString`     | The name of the setting in the `appsettings` that contains the cache connection string. For example: `<cacheName>.redis.cache.windows.net:6380,password...` |
| `Command`     | The redis-cli command to be executed on the cache with all arguments separated by spaces. For example:  `GET key`, `HGET key field`. |

> [!NOTE]
> Not all commands are supported for this binding. At the moment, only read commands that return a single output are supported. The full list can be found [here](https://github.com/Azure/azure-functions-redis-extension/blob/main/src/Microsoft.Azure.WebJobs.Extensions.Redis/Bindings/RedisConverter.cs#L61)

# [Isolated process](#tab/isolated-process)

<!-- 
C# attribute information for the trigger goes here with an intro sentence. Use a code link like the following to show the method definition: 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="13-16":::
-->

---

::: zone-end  
::: zone pivot="programming-language-java"  

## Annotations

| Attribute property | Description                                                                                                                                                 |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `connectionString`     | The name of the setting in the `appsettings` that contains the cache connection string. For example: `<cacheName>.redis.cache.windows.net:6380,password...` |
| `command`     | The redis-cli command to be executed on the cache with all arguments separated by spaces. For example:  `GET key`, `HGET key field`. |

<!-- Equivalent values for the annotation parameters in Java.-->
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  

## Configuration

### [v1](#tab/python-v1)

The following table explains the binding configuration properties that you set in the function.json file.

| function.json Property | Description                                                                                                                                                 |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `connectionString`     | The name of the setting in the `appsettings` that contains the cache connection string. For example: `<cacheName>.redis.cache.windows.net:6380,password...` |
| `command`     | The redis-cli command to be executed on the cache with all arguments separated by spaces. For example:  `GET key`, `HGET key field`. |


### [v2](#tab/python-v2)

<!-- this get more complex when you support the Python v2 model. -->

The Python v2 programming model example isn't available in preview.

---

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp"  
The parameter type supported by the XXX trigger depends on the Functions runtime version and the C# modality used.

# [In-process](#tab/in-process)

<!--Any usage information specific to in-process, including types. -->

# [Isolated process](#tab/isolated-process)

<!--Any usage information specific to isolated worker process, including types. -->

---

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

## Available Parameter Types

- `StackExchange.Redis.RedisValue, string, byte[], ReadOnlyMemory<byte>`:
  - The value returned by the command.
- `Custom`: 
  - The trigger uses Json.NET serialization to map the value returned by the command from a string into a custom type.

## Next steps

<!--At least one next step link.-->