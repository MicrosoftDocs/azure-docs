---
title: Azure Cache for Redis input binding for Azure Functions (preview)
description: Learn how to use input bindings to connect to Azure Cache for Redis from Azure Functions.
author: flang-msft
ms.author: franlanglois
ms.service: azure-functions
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: reference
ms.date: 01/26/2024
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Cache for Redis input binding for Azure Functions

When a function runs, the Azure Cache for Redis input binding retrieves data from a cache and passes it to your function as an input parameter.

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

The following code uses the key from the pub/sub trigger to obtain and log the value from an input binding using a `GET` command:

### [Isolated process](#tab/isolated-process)

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

### [In-process](#tab/in-process)

```csharp
using Microsoft.Extensions.Logging;

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

---

More samples for the Azure Cache for Redis input binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-redis-extension).
<!-- link to redis samples -->
::: zone-end
::: zone pivot="programming-language-java"
The following code uses the key from the pub/sub trigger to obtain and log the value from an input binding using a `GET` command:

```java
package com.function.RedisInputBinding;

import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.redis.annotation.*;

public class SetGetter {
    @FunctionName("SetGetter")
    public void run(
            @RedisPubSubTrigger(
                name = "key",
                connectionStringSetting = "redisConnectionString",
                channel = "__keyevent@0__:set")
                String key,
            @RedisInput(
                name = "value",
                connectionStringSetting = "redisConnectionString",
                command = "GET {Message}")
                String value,
            final ExecutionContext context) {
            context.getLogger().info("Key '" + key + "' was set to value '" + value + "'");
    }
}
```

::: zone-end  
::: zone pivot="programming-language-javascript"  
### [Model v3](#tab/nodejs-v3)

This function.json defines both a pub/sub trigger and an input binding to the GET message on an Azure Cache for Redis instance:

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
            "command": "GET {Message}",
            "name": "value",
            "direction": "in"
        }
    ],
    "scriptFile": "index.js"
}
```

This JavaScript code (from index.js) retrives and logs the cached value related to the key provided by the pub/sub trigger. 

```nodejs

module.exports = async function (context, key, value) {
    context.log("Key '" + key + "' was set to value '" + value + "'");
}

```

### [Model v4](#tab/nodejs-v4)

Node.js v4 isn't yet supported by the Azure Cache for Redis extension.

---

::: zone-end  
::: zone pivot="programming-language-powershell"  

This function.json defines both a pub/sub trigger and an input binding to the GET message on an Azure Cache for Redis instance:
<!---Note: it might be confusing that the binding `name` and the parameter name are the same in these examples. --->
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
            "command": "GET {Message}",
            "name": "value",
            "direction": "in"
        }
    ],
    "scriptFile": "run.ps1"
}
```

This PowerShell code (from run.ps1) retrives and logs the cached value related to the key provided by the pub/sub trigger. 

```powershell
param($key, $value, $TriggerMetadata)
Write-Host "Key '$key' was set to value '$value'"
```

::: zone-end  
::: zone pivot="programming-language-python"  

The following example uses a pub/sub trigger with an input binding to the GET message on an Azure Cache for Redis instance. The example depends on whether you use the [v1 or v2 Python programming model](functions-reference-python.md).

### [v1](#tab/python-v1)

This function.json defines both a pub/sub trigger and an input binding to the GET message on an Azure Cache for Redis instance:

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
            "command": "GET {Message}",
            "name": "value",
            "direction": "in"
        }
    ]
}
```

This Python code (from \_\_init\_\_.py) retrives and logs the cached value related to the key provided by the pub/sub trigger:

```python

import logging

def main(key: str, value: str):
    logging.info("Key '" + key + "' was set to value '" + value + "'")

```

The [configuration](#configuration) section explains these properties.

### [v2](#tab/python-v2)

Python v2 isn't yet supported by the Azure Cache for Redis extension.

---

::: zone-end  
::: zone pivot="programming-language-csharp"

## Attributes
    
> [!NOTE]
> Not all commands are supported for this binding. At the moment, only read commands that return a single output are supported. The full list can be found [here](https://github.com/Azure/azure-functions-redis-extension/blob/main/src/Microsoft.Azure.WebJobs.Extensions.Redis/Bindings/RedisConverter.cs#L61)

|Attribute property | Description                   |
|-------------------|-----------------------------------|
| `ConnectionStringSetting ` | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...` |
| `Command` | The redis-cli command to be executed on the cache with all arguments separated by spaces, such as:  `GET key`, `HGET key field`. |

::: zone-end  
::: zone pivot="programming-language-java"  
## Annotations

The `RedisInput` annotation supports these properties: 

| Property | Description                            |
|----------|---------------------------------------------------|
| `name` | The name of the specific input binding. |
| `connectionStringSetting`   | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...` |
| `command` | The redis-cli command to be executed on the cache with all arguments separated by spaces, such as:  `GET key` or `HGET key field`. |
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  
## Configuration

The following table explains the binding configuration properties that you set in the function.json file.

| function.json property |                         |
|------------------------|-------------------------|
| `connectionStringSetting` | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...` |
| `command`     | The redis-cli command to be executed on the cache with all arguments separated by spaces, such as:  `GET key`, `HGET key field`. |

> [!NOTE] 
> Python v2 and Node.js v4 for Functions don't use function.json to define the function. Both of these new language versions aren't currently supported by Azure Redis Cache bindings. 

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

The input binding expects to receive a string from the cache.
::: zone pivot="programming-language-csharp"  
When you use a custom type as the binding parameter, the extension tries to deserialize a JSON-formatted string into the custom type of this parameter.   
::: zone-end  

## Next steps

