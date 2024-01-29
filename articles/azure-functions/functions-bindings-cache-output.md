---
title: Using Redis Output Azure Functions for Azure Cache for Redis (preview)
description: Learn how to use Redis an output Azure Functions 
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers
ms.author: franlanglois
ms.service: azure-functions
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: reference
ms.date: 01/18/2024
---

# Azure Cache for Redis output binding for Azure Functions

The Azure Cache for Redis output bindings lets you change the keys in a cache based on a set of available trigger on the cache.

For information on setup and configuration details, see the [overview](functions-bindings-cache.md).

::: zone pivot="programming-language-javascript"  
<!--- Replace with the following when Node.js v4 is supported:
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
-->
[!INCLUDE [functions-nodejs-model-tabs-redis-preview](../../includes/functions-nodejs-model-tabs-redis-preview.md)]  
::: zone-end  
::: zone pivot="programming-language-python"   
<!--- Replace with the following when Node.js v4 is supported:
[!INCLUDE [functions-python-model-tabs-description](../../includes/functions-python-model-tabs-description.md)]  
-->
[!INCLUDE [functions-python-model-tabs-redis-preview](../../includes/functions-python-model-tabs-redis-preview.md)] 
::: zone-end 

## Example

::: zone pivot="programming-language-csharp"
[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

The following example shows a pub/sub trigger on the set event with an output binding to the same Redis instance. The set event triggers the cache and the output binding returns a delete command for the key that triggered the function.

### [In-process](#tab/in-process)

```c#
using Microsoft.Extensions.Logging;

namespace Microsoft.Azure.WebJobs.Extensions.Redis.Samples.RedisOutputBinding
{
    internal class SetDeleter
    {
        [FunctionName(nameof(SetDeleter))]
        public static void Run(
            [RedisPubSubTrigger(Common.connectionStringSetting, "__keyevent@0__:set")] string key,
            [Redis(Common.connectionStringSetting, "DEL")] out string[] arguments,
            ILogger logger)
        {
            logger.LogInformation($"Deleting recently SET key '{key}'");
            arguments = new string[] { key };
        }
    }
}
```

### [Isolated process](#tab/isolated-process)


```csharp
﻿using Microsoft.Extensions.Logging;

namespace Microsoft.Azure.WebJobs.Extensions.Redis.Samples.RedisOutputBinding
{
    internal class SetDeleter
    {
        [FunctionName(nameof(SetDeleter))]
        [return: Redis(Common.connectionStringSetting, "DEL")]
        public static string Run(
            [RedisPubSubTrigger(Common.connectionStringSetting, "__keyevent@0__:set")] string key,
            ILogger logger)
        {
            logger.LogInformation($"Deleting recently SET key '{key}'");
            return key;
        }
    }
}
```

---

::: zone-end
::: zone pivot="programming-language-java"
The following example shows a pub/sub trigger on the set event with an output binding to the same Redis instance. The set event triggers the cache and the output binding returns a delete command for the key that triggered the function.
<!---Note: it might be confusing that the binding `name` and the parameter name are the same in these examples. --->
```java
package com.function.RedisOutputBinding;

import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.redis.annotation.*;

public class SetDeleter {
    @FunctionName("SetDeleter")
    @RedisOutput(
                name = "value",
                connectionStringSetting = "redisConnectionString",
                command = "DEL")
    public String run(
            @RedisPubSubTrigger(
                name = "key",
                connectionStringSetting = "redisConnectionString",
                channel = "__keyevent@0__:set")
                String key,
            final ExecutionContext context) {
        context.getLogger().info("Deleting recently SET key '" + key + "'");
        return key;
    }
}

```

::: zone-end  
::: zone pivot="programming-language-javascript" 
This example shows a pub/sub trigger on the set event with an output binding to the same Redis instance. The set event triggers the cache and the output binding returns a delete command for the key that triggered the function.
 
### [Model v3](#tab/nodejs-v3)

The bindings are defined in this `function.json`` file:

```json
{
    "bindings": [
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
            "command": "DEL",
            "name": "$return",
            "direction": "out"
        }
    ],
    "scriptFile": "index.js"
}
```

This code from the `index.js` file takes the key from the trigger and returns it to the output binding to delete the cached item.

```javascript
module.exports = async function (context, key) {
    context.log("Deleting recently SET key '" + key + "'");
    return key;
}

```

### [Model v4](#tab/nodejs-v4)

Node.js v4 isn't yet supported by the Azure Cache for Redis extension.

---
::: zone-end  
::: zone pivot="programming-language-powershell"  
This example shows a pub/sub trigger on the set event with an output binding to the same Redis instance. The set event triggers the cache and the output binding returns a delete command for the key that triggered the function.

The bindings are defined in this `function.json` file:

```json
{
    "bindings": [
        {
            "type": "redisPubSubTrigger",
            "connectionStringSetting": "redisLocalhost",
            "channel": "__keyevent@0__:set",
            "name": "key",
            "direction": "in"
        },
        {
            "type": "redis",
            "connectionStringSetting": "redisLocalhost",
            "command": "DEL",
            "name": "retVal",
            "direction": "out"
        }
    ],
    "scriptFile": "run.ps1"
}

```

This code from the `run.ps1` file takes the key from the trigger and passes it to the output binding to delete the cached item.

```powershell
param($key, $TriggerMetadata)
Write-Host "Deleting recently SET key '$key'"
Push-OutputBinding -Name retVal -Value $key
```

::: zone-end  
::: zone pivot="programming-language-python"  
This example shows a pub/sub trigger on the set event with an output binding to the same Redis instance. The set event triggers the cache and the output binding returns a delete command for the key that triggered the function.

### [v1](#tab/python-v1)

The bindings are defined in this `function.json` file:

```json
{
    "bindings": [
        {
            "type": "redisPubSubTrigger",
            "connectionStringSetting": "redisLocalhost",
            "channel": "__keyevent@0__:set",
            "name": "key",
            "direction": "in"
        },
        {
            "type": "redis",
            "connectionStringSetting": "redisLocalhost",
            "command": "DEL",
            "name": "$return",
            "direction": "out"
        }
    ],
    "scriptFile": "__init__.py"
}
```

This code from the `__init__.py` file takes the key from the trigger and passes it to the output binding to delete the cached item.

```python
import logging

def main(key: str) -> str:
    logging.info("Deleting recently SET key '" + key + "'")
    return key
```
### [v2](#tab/python-v2)

Python v2 isn't yet supported by the Azure Cache for Redis extension.

---
::: zone-end  
::: zone pivot="programming-language-csharp"

## Attributes

> [!NOTE]
> All commands are supported for this binding.

The way in which you define an output binding parameter depends on whether your C# functions runs [in-process](functions-dotnet-class-library.md) or in an [isolated worker process](dotnet-isolated-process-guide.md). 

### [In-process](#tab/in-process)

The output binding is defined in one of these ways: 

| Definition | Example | Description |
| ----- | ----- | ----- |
| On the method | `[return: Redis(<ConnectionStringSetting>, <Command>)]` | An explicit `return` command returns a key value from the method that the binding uses to execute the command against the specific cache. |
| On an `out` parameter | `[Redis(<ConnectionStringSetting>, <Command>)] out string <Return_Variable>` | The string variable retuned by the method is a key value that the binding uses to execute the command against the specific cache. |

### [Isolated process](#tab/isolated-process)
 
The output binding is defined by placing this attribute on the method:

`[RedisOutput(<ConnectionStringSetting>, <Command>)]`

In this case, the type returned by the method is a key value that the binding uses to execute the command against the specific cache. 

When your function has multiple output bindings, you can instead apply the binding attribute to the property of a type that is a key value, which the binding uses to execute the command against the specific cache. For more information, see [Multiple output bindings](dotnet-isolated-process-guide.md#multiple-output-bindings). 

---

Regardless of the C# process mode, the same properties are supported by the output binding attribute:
 
| Attribute property | Description  |
|--------------------| -------------|
| `ConnectionStringSetting`  | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...` |
| `Command`  | The redis-cli command to be executed on the cache, such as:  `DEL`.  |

::: zone-end  
::: zone pivot="programming-language-java"  

## Annotations

The `RedisOutput` annotation supports these properties: 

| Property | Description                            |
|----------|---------------------------------------------------|
| `name` | The name of the specific input binding. |
| `connectionStringSetting`   | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...` |
| `command` | The redis-cli command to be executed on the cache, such as:  `DEL`. |
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file. 

| Property | Description                            |
|----------|---------------------------------------------------|
| `name` | The name of the specific input binding. |
| `connectionStringSetting`   | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...` |
| `command` | The redis-cli command to be executed on the cache, such as:  `DEL`. |
::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

The output returns a string, which is the key of the cache entry on which apply the specific command. 

## Next steps

<!--At least one next step link.-->