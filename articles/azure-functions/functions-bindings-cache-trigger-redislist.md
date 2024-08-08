---
title: RedisListTrigger for Azure Functions
description: Learn how to use the RedisListTrigger Azure Functions for Azure Cache for Redis.
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: azure-functions
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: reference
ms.date: 05/20/2024
---

# RedisListTrigger for Azure Functions

The `RedisListTrigger` pops new elements from a list and surfaces those entries to the function.

For more information about Azure Cache for Redis triggers and bindings, [Redis Extension for Azure Functions](https://github.com/Azure/azure-functions-redis-extension/tree/main).

## Scope of availability for functions triggers

|Tier     | Basic | Standard, Premium  | Enterprise, Enterprise Flash  |
|---------|:---------:|:---------:|:---------:|
| Lists | Yes  | Yes   |  Yes  |

> [!IMPORTANT]
> Redis triggers aren't currently supported for functions running in the [Consumption plan](consumption-plan.md).
>

::: zone pivot="programming-language-javascript"  
<!--- Replace with the following when Node.js v4 is supported:
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
-->
[!INCLUDE [functions-nodejs-model-tabs-redis-preview](../../includes/functions-nodejs-model-tabs-redis-preview.md)]  
::: zone-end  
::: zone pivot="programming-language-python"
<!--- Replace with the following when Python v2  is supported:
[!INCLUDE [functions-python-model-tabs-description](../../includes/functions-python-model-tabs-description.md)]  
-->
[!INCLUDE [functions-python-model-tabs-redis-preview](../../includes/functions-python-model-tabs-redis-preview.md)]
::: zone-end

## Example

::: zone pivot="programming-language-csharp"

> [!IMPORTANT]
>
>For .NET functions, using the _isolated worker_ model is recommended over the _in-process_ model. For a comparison of the _in-process_ and _isolated worker_ models, see differences between the _isolated worker_ model and the _in-process_ model for .NET on Azure Functions.

The following sample polls the key `listTest`.:

### [Isolated worker model](#tab/isolated-process)

```csharp
﻿using Microsoft.Extensions.Logging;

namespace Microsoft.Azure.Functions.Worker.Extensions.Redis.Samples.RedisListTrigger
{
    public class SimpleListTrigger
    {
        private readonly ILogger<SimpleListTrigger> logger;

        public SimpleListTrigger(ILogger<SimpleListTrigger> logger)
        {
            this.logger = logger;
        }

        [Function(nameof(SimpleListTrigger))]
        public void Run(
            [RedisListTrigger(Common.connectionStringSetting, "listTest")] string entry)
        {
            logger.LogInformation(entry);
        }
    }
}

```

### [In-process model](#tab/in-process)

[!INCLUDE [functions-in-process-model-retirement-note](../../includes/functions-in-process-model-retirement-note.md)]

```csharp
﻿using Microsoft.Extensions.Logging;

namespace Microsoft.Azure.WebJobs.Extensions.Redis.Samples.RedisListTrigger
{
    internal class SimpleListTrigger
    {
        [FunctionName(nameof(SimpleListTrigger))]
        public static void Run(
            [RedisListTrigger(Common.connectionStringSetting, "listTest")] string entry,
            ILogger logger)
        {
            logger.LogInformation(entry);
        }
    }
}
```

---

::: zone-end
::: zone pivot="programming-language-java"

The following sample polls the key `listTest` at a localhost Redis instance at `redisLocalhost`:

```java
package com.function.RedisListTrigger;

import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.redis.annotation.*;

public class SimpleListTrigger {
    @FunctionName("SimpleListTrigger")
    public void run(
            @RedisListTrigger(
                name = "req",
                connection = "redisConnectionString",
                key = "listTest",
                pollingIntervalInMs = 1000,
                maxBatchSize = 1)
                String message,
            final ExecutionContext context) {
            context.getLogger().info(message);
    }
}
```

::: zone-end
::: zone pivot="programming-language-javascript"

### [Model v3](#tab/node-v3)

This sample uses the same `index.js` file, with binding data in the `function.json` file.

Here's the `index.js` file:

```javascript
module.exports = async function (context, entry) {
    context.log(entry);
}
```

From `function.json`, here's the binding data:

```json
{
    "bindings": [
        {
            "type": "redisListTrigger",
            "listPopFromBeginning": true,
            "connection": "redisConnectionString",
            "key": "listTest",
            "pollingIntervalInMs": 1000,
            "maxBatchSize": 16,
            "name": "entry",
            "direction": "in"
        }
      ],
    "scriptFile": "index.js"
}
```

### [Model v4](#tab/node-v4)

<!--- Replace with the following when Node.js v4 is supported:
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
-->
[!INCLUDE [functions-nodejs-model-tabs-redis-preview](../../includes/functions-nodejs-model-tabs-redis-preview.md)]  

---

::: zone-end
::: zone pivot="programming-language-powershell"

This sample uses the same `run.ps1` file, with binding data in the `function.json` file.

Here's the `run.ps1` file:

```powershell
param($entry, $TriggerMetadata)
Write-Host $entry

```

From `function.json`, here's the binding data:

```json
{
    "bindings": [
        {
            "type": "redisListTrigger",
            "listPopFromBeginning": true,
            "connection": "redisConnectionString",
            "key": "listTest",
            "pollingIntervalInMs": 1000,
            "maxBatchSize": 16,
            "name": "entry",
            "direction": "in"
        }
      ],
    "scriptFile": "run.ps1"
}
```

::: zone-end
::: zone pivot="programming-language-python"

This sample uses the same `__init__.py` file, with binding data in the `function.json` file.

### [v1](#tab/python-v1)

The Python v1 programming model requires you to define bindings in a separate _function.json_ file in the function folder. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-configuration#programming-model).

Here's the `__init__.py` file:

```python
import logging

def main(entry: str):
    logging.info(entry)
```

From `function.json`, here's the binding data:

```json
{
    "bindings": [
        {
            "type": "redisListTrigger",
            "listPopFromBeginning": true,
            "connection": "redisConnectionString",
            "key": "listTest",
            "pollingIntervalInMs": 1000,
            "maxBatchSize": 16,
            "name": "entry",
            "direction": "in"
        }
      ],
    "scriptFile": "__init__.py"
}
```

### [v2](#tab/python-v2)

<!--- Replace with the following when Python v2 is supported:
[!INCLUDE [functions-python-model-tabs-description](../../includes/functions-python-model-tabs-description.md)]  
-->
[!INCLUDE [functions-python-model-tabs-redis-preview](../../includes/functions-python-model-tabs-redis-preview.md)]

---

::: zone-end
::: zone pivot="programming-language-csharp"

## Attributes

| Parameter                 | Description                                                                                                                                                                                                                           | Required | Default |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|--------:|
| `Connection`              | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...`                        | Yes      |         |
| `Key`                     | Key to read from. This field can be resolved using `INameResolver`.                                                                                                                                                                   | Yes      |         |
| `PollingIntervalInMs`     | How often to poll Redis in milliseconds.                                                                                                                                                                                              | Optional | `1000`  |
| `MessagesPerWorker`       | How many messages each functions instance should process. Used to determine how many instances the function should scale to.                                                                                                          | Optional | `100`   |
| `Count`                   | Number of entries to pop from Redis at one time. Entries are processed in parallel. Only supported on Redis 6.2+ using the `COUNT` argument in [`LPOP`](https://redis.io/commands/lpop/) and [`RPOP`](https://redis.io/commands/rpop/). | Optional | `10`  |
| `ListPopFromBeginning`    | Determines whether to pop entries from the beginning using [`LPOP`](https://redis.io/commands/lpop/), or to pop entries from the end using [`RPOP`](https://redis.io/commands/rpop/).                                                 | Optional | `true`  |

::: zone-end
::: zone pivot="programming-language-java"

## Annotations

| Parameter                 | Description                                                                                                                                                 | Required | Default |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|--------:|
| `name`                    | "entry"                                                                                                                                                     |          |         |
| `connection` | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...`| Yes      |         |
| `key`                     | This field can be resolved using INameResolver.                                                                                                             | Yes      |         |
| `pollingIntervalInMs`     | How often to poll Redis in milliseconds.                                                                                                                    | Optional | `1000`  |
| `messagesPerWorker`       | How many messages each functions instance should process. Used to determine how many instances the function should scale to.                                | Optional | `100`   |
| `count`                   | Number of entries to read from Redis at one time. These are processed in parallel.                                                                          | Optional | `10`    |
| `listPopFromBeginning`    | Whether to delete the stream entries after the function has run.                                                                                            | Yes      | `true`  |

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"

## Configuration

The following table explains the binding configuration properties that you set in the function.json file.

| function.json Property | Description                                                                                                                                                 | Optional | Default |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|--------:|
| `type`                 | Name of the trigger.                                                                                                                                        | No       |         |
| `listPopFromBeginning` | Whether to delete the stream entries after the function has run. Set to `true`.                                                                             | Yes      | `true`  |
| `connection`     | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...` | No       |         |
| `key`                  | This field can be resolved using `INameResolver`.                                                                                                           | No       |         |
| `pollingIntervalInMs`  | How often to poll Redis in milliseconds.                                                                                                                    | Yes      | `1000`  |
| `messagesPerWorker`    | How many messages each functions instance should process. Used to determine how many instances the function should scale to.                                | Yes      | `100`   |
| `count`                | Number of entries to read from the cache at one time. Entries are processed in parallel.                                                                      | Yes      | `10`    |
| `name`                 | ?                                                                                                                                                           | Yes      |         |
| `direction`            | Set to `in`.                                                                                                                                                | No       |         |

::: zone-end

See the Example section for complete examples.

## Usage

The `RedisListTrigger` pops new elements from a list and surfaces those entries to the function. The trigger polls Redis at a configurable fixed interval, and uses [`LPOP`](https://redis.io/commands/lpop/) and [`RPOP`](https://redis.io/commands/rpop/) to pop entries from the lists.

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python"

|  Type | Description                                                                                                     |
|-------------|-----------------------------------------------------------------------------------------------------------------|
| `byte[]`    | The message from the channel.                                                                                    |
| `string`    | The message from the channel.                                                                                   |
| `Custom`    | The trigger uses Json.NET serialization to map the message from the channel from a `string` into a custom type. |

::: zone-end

## Related content

- [Introduction to Azure Functions](functions-overview.md)
- [Tutorial: Get started with Azure Functions triggers in Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-functions-getting-started)
- [Tutorial: Create a write-behind cache by using Azure Functions and Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-write-behind)
- [Redis connection string](functions-bindings-cache.md#redis-connection-string)
- [Redis lists](https://redis.io/docs/data-types/lists/)
