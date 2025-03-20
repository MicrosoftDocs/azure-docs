---
title: Azure Cache for Redis input binding for Azure Functions
description: Learn how to use input bindings to connect to Azure Cache for Redis from Azure Functions.
author: flang-msft
ms.author: franlanglois
ms.service: azure-functions
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python, ignite-2024
ms.topic: reference
ms.date: 07/12/2024
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Cache for Redis input binding for Azure Functions

When a function runs, the Azure Cache for Redis input binding retrieves data from a cache and passes it to your function as an input parameter.

For information on setup and configuration details, see the [overview](functions-bindings-cache.md).

## Scope of availability for functions bindings

| Binding Type    | Azure Managed Redis | Azure Cache for Redis |
|---------|:-----:|:-----------------:|
| Input | Yes   | Yes               |

> [!IMPORTANT]
> When using Azure Managed Redis or the Enterprise tiers of Azure Cache for Redis, use port 10000 rather than port 6380 or 6379.
>

::: zone pivot="programming-language-javascript"  
<!--- Replace with the following when Node.js v4 is supported:
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
-->
[!INCLUDE [functions-nodejs-model-tabs-redis-preview](../../includes/functions-nodejs-model-tabs-redis-preview.md)]  
::: zone-end  
::: zone pivot="programming-language-python"
<!--- Replace with the following when Python v2 is supported:
[!INCLUDE [functions-python-model-tabs-description](../../includes/functions-python-model-tabs-description.md)]  
-->
[!INCLUDE [functions-python-model-tabs-redis-preview](../../includes/functions-python-model-tabs-redis-preview.md)]
::: zone-end  

## Example

::: zone pivot="programming-language-csharp"
[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

> [!IMPORTANT]
>
>For .NET functions, using the _isolated worker_ model is recommended over the _in-process_ model. For a comparison of the _in-process_ and _isolated worker_ models, see differences between the _isolated worker_ model and the _in-process_ model for .NET on Azure Functions.

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
                connection = "redisConnectionString",
                channel = "__keyevent@0__:set")
                String key,
            @RedisInput(
                name = "value",
                connection = "redisConnectionString",
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
            "connection": "redisConnectionString",
            "channel": "__keyevent@0__:set",
            "name": "key",
            "direction": "in"
        },
        {
            "type": "redis",
            "connection": "redisConnectionString",
            "command": "GET {Message}",
            "name": "value",
            "direction": "in"
        }
    ],
    "scriptFile": "index.js"
}
```

This JavaScript code (from index.js) retrieves and logs the cached value related to the key provided by the pub/sub trigger.

```javascript

module.exports = async function (context, key, value) {
    context.log("Key '" + key + "' was set to value '" + value + "'");
}

```

### [Model v4](#tab/nodejs-v4)

<!--- Replace with the following when Node.js v4 is supported:
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
-->
[!INCLUDE [functions-nodejs-model-tabs-redis-preview](../../includes/functions-nodejs-model-tabs-redis-preview.md)]  

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
            "connection": "redisConnectionString",
            "channel": "__keyevent@0__:set",
            "name": "key",
            "direction": "in"
        },
        {
            "type": "redis",
            "connection": "redisConnectionString",
            "command": "GET {Message}",
            "name": "value",
            "direction": "in"
        }
    ],
    "scriptFile": "run.ps1"
}
```

This PowerShell code (from run.ps1) retrieves and logs the cached value related to the key provided by the pub/sub trigger.

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
            "connection": "redisConnectionString",
            "channel": "__keyevent@0__:set",
            "name": "key",
            "direction": "in"
        },
        {
            "type": "redis",
            "connection": "redisConnectionString",
            "command": "GET {Message}",
            "name": "value",
            "direction": "in"
        }
    ]
}
```

This Python code (from \_\_init\_\_.py) retrieves and logs the cached value related to the key provided by the pub/sub trigger:

```python

import logging

def main(key: str, value: str):
    logging.info("Key '" + key + "' was set to value '" + value + "'")

```

The [configuration](#configuration) section explains these properties.

### [v2](#tab/python-v2)

<!--- Replace with the following when Python v2  is supported:
[!INCLUDE [functions-python-model-tabs-description](../../includes/functions-python-model-tabs-description.md)]  
-->
[!INCLUDE [functions-python-model-tabs-redis-preview](../../includes/functions-python-model-tabs-redis-preview.md)]
---

::: zone-end  
::: zone pivot="programming-language-csharp"

## Attributes

> [!NOTE]
> Not all commands are supported for this binding. At the moment, only read commands that return a single output are supported. The full list can be found [here](https://github.com/Azure/azure-functions-redis-extension/blob/main/src/Microsoft.Azure.WebJobs.Extensions.Redis/Bindings/RedisAsyncConverter.cs#L63)

|Attribute property | Description                   |
|-------------------|-----------------------------------|
| `Connection` | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...` |
| `Command` | The redis-cli command to be executed on the cache with all arguments separated by spaces, such as:  `GET key`, `HGET key field`. |

::: zone-end  
::: zone pivot="programming-language-java"  

## Annotations

The `RedisInput` annotation supports these properties:

| Property | Description                            |
|----------|---------------------------------------------------|
| `name` | The name of the specific input binding. |
| `connection`   | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...` |
| `command` | The redis-cli command to be executed on the cache with all arguments separated by spaces, such as:  `GET key` or `HGET key field`. |

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  

## Configuration

The following table explains the binding configuration properties that you set in the function.json file.

| function.json property | Description                 |
|------------------------|-------------------------|
| `connection` | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...` |
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

[!INCLUDE [functions-azure-redis-cache-authentication-note](../../includes/functions-azure-redis-cache-authentication-note.md)]

## Related content

- [Introduction to Azure Functions](functions-overview.md)
- [Tutorial: Get started with Azure Functions triggers in Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-functions-getting-started)
- [Tutorial: Create a write-behind cache by using Azure Functions and Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-write-behind)
- [Redis connection string](functions-bindings-cache.md#redis-connection-string)
