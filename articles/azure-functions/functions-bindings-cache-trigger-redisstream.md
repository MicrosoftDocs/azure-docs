---
title: RedisStreamTrigger for Azure Functions
description: Learn how to use RedisStreamTrigger Azure Function for Azure Cache for Redis.
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: azure-functions
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: reference
ms.date: 05/20/2024
---

# RedisStreamTrigger for Azure Functions

The `RedisStreamTrigger` reads new entries from a stream and surfaces those elements to the function.

| Tier    | Basic | Standard, Premium | Enterprise, Enterprise Flash |
|---------|:-----:|:-----------------:|:----------------------------:|
| Streams | Yes   | Yes               | Yes                          |

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
<!--- Replace with the following when Python v2 is supported:
[!INCLUDE [functions-python-model-tabs-description](../../includes/functions-python-model-tabs-description.md)]  
-->
[!INCLUDE [functions-python-model-tabs-redis-preview](../../includes/functions-python-model-tabs-redis-preview.md)]
::: zone-end

## Example

> [!IMPORTANT]
>
>For .NET functions, using the _isolated worker_ model is recommended over the _in-process_ model. For a comparison of the _in-process_ and _isolated worker_ models, see differences between the _isolated worker_ model and the _in-process_ model for .NET on Azure Functions.

::: zone pivot="programming-language-csharp"

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]

### [Isolated worker model](#tab/isolated-process)


```csharp
﻿using Microsoft.Extensions.Logging;

namespace Microsoft.Azure.Functions.Worker.Extensions.Redis.Samples.RedisStreamTrigger
{
    internal class SimpleStreamTrigger
    {
        private readonly ILogger<SimpleStreamTrigger> logger;

        public SimpleStreamTrigger(ILogger<SimpleStreamTrigger> logger)
        {
            this.logger = logger;
        }

        [Function(nameof(SimpleStreamTrigger))]
        public void Run(
            [RedisStreamTrigger(Common.connectionStringSetting, "streamKey")] string entry)
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

namespace Microsoft.Azure.WebJobs.Extensions.Redis.Samples.RedisStreamTrigger
{
    internal class SimpleStreamTrigger
    {
        [FunctionName(nameof(SimpleStreamTrigger))]
        public static void Run(
            [RedisStreamTrigger(Common.connectionStringSetting, "streamKey")] string entry,
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

```java

package com.function.RedisStreamTrigger;

import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.redis.annotation.*;

public class SimpleStreamTrigger {
    @FunctionName("SimpleStreamTrigger")
    public void run(
            @RedisStreamTrigger(
                name = "req",
                connection = "redisConnectionString",
                key = "streamTest",
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
      "type": "redisStreamTrigger",
      "connection": "redisConnectionString",
      "key": "streamTest",
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
Write-Host ($entry | ConvertTo-Json)
```

From `function.json`, here's the binding data:

```json
{
  "bindings": [
    {
      "type": "redisStreamTrigger",
      "connection": "redisConnectionString",
      "key": "streamTest",
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

### [v1](#tab/python-v1)

The Python v1 programming model requires you to define bindings in a separate _function.json_ file in the function folder. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-configuration#programming-model).

This sample uses the same `__init__.py` file, with binding data in the `function.json` file.

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
      "type": "redisStreamTrigger",
      "connection": "redisConnectionString",
      "key": "streamTest",
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

| Parameters                | Description                                                                                                                                              | Required | Default |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|--------:|
| `Connection` | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...`| Yes      |         |
| `Key`                     | Key to read from.                                                                                                                                        | Yes      |         |
| `PollingIntervalInMs`     | How often to poll the Redis server in milliseconds.                                                                                                      | Optional | `1000`  |
| `MessagesPerWorker`       | The number of messages each functions worker should process. Used to determine how many workers the function should scale to.                            | Optional | `100`   |
| `Count`                   | Number of elements to pull from Redis at one time.                                                                                                       | Optional | `10`    |
| `DeleteAfterProcess`      | Indicates if the function deletes the stream entries after processing.                                                                                   | Optional | `false` |

::: zone-end
::: zone pivot="programming-language-java"

## Annotations

| Parameter                 | Description                                                                                                                                              | Required | Default |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|--------:|
| `name`                    | `entry`                                                                                                                                                  |  Yes     |         |
| `connection` | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...` | Yes      |         |
| `key`                     | Key to read from.                                                                                                                                        | Yes      |         |
| `pollingIntervalInMs`     | How frequently to poll Redis, in milliseconds.                                                                                                           | Optional | `1000`  |
| `messagesPerWorker`       | The number of messages each functions worker should process. It's used to determine how many workers the function should scale to.                       | Optional | `100`   |
| `count`                   | Number of entries to read from Redis at one time. Entries are processed in parallel.                                                                       | Optional | `10`    |
| `deleteAfterProcess`      | Whether to delete the stream entries after the function has run.                                                                                         | Optional | `false` |

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"

## Configuration

The following table explains the binding configuration properties that you set in the function.json file.

| function.json Properties  | Description                                                                                                                                              | Required | Default |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|--------:|
| `type`                    |                                                                                                                                                          | Yes      |         |
| `deleteAfterProcess`      |                                                                                                                                                          | Optional | `false` |
| `connection` | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...` | Yes      |         |
| `key`                     | The key to read from.                                                                                                                                    | Yes      |         |
| `pollingIntervalInMs`     | How often to poll Redis in milliseconds.                                                                                                                 | Optional | `1000`  |
| `messagesPerWorker`       | (optional) The number of messages each functions worker should process. Used to determine how many workers the function should scale                     | Optional | `100`   |
| `count`                   | Number of entries to read from Redis at one time. These are processed in parallel.                                                                       | Optional | `10`    |
| `name`                    |                                                                                                                                                          | Yes      |         |
| `direction`               |                                                                                                                                                          | Yes      |         |

::: zone-end

See the Example section for complete examples.

## Usage

The `RedisStreamTrigger` Azure Function reads new entries from a stream and surfaces those entries to the function.

The trigger polls Redis at a configurable fixed interval, and uses [`XREADGROUP`](https://redis.io/commands/xreadgroup/) to read elements from the stream.

The consumer group for all instances of a function is the name of the function, that is, `SimpleStreamTrigger` for the [StreamTrigger sample](https://github.com/Azure/azure-functions-redis-extension/blob/main/samples/dotnet/RedisStreamTrigger/SimpleStreamTrigger.cs).

Each functions instance uses the [`WEBSITE_INSTANCE_ID`](/azure/app-service/reference-app-settings?tabs=kudu%2Cdotnet#scaling) or generates a random GUID to use as its consumer name within the group to ensure that scaled out instances of the function don't read the same messages from the stream.

<!-- ::: zone pivot="programming-language-csharp"

|  Type                                                                                                                                           | Description                                                                                                                                                                             |
|-------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`StackExchange.Redis.ChannelMessage`](https://github.com/StackExchange/StackExchange.Redis/blob/main/src/StackExchange.Redis/ChannelMessageQueue.cs) | The value returned by `StackExchange.Redis`.                                                                                                                                            |
| `StackExchange.Redis.NameValueEntry[]`, `Dictionary<string, string>`                                                                                  | The values contained within the entry.                                                                                                                                                  |
| `string, byte[], ReadOnlyMemory<byte>`                                                                                                                | The stream entry serialized as JSON (UTF-8 encoded for byte types) in the following format: `{"Id":"1658354934941-0","Values":{"field1":"value1","field2":"value2","field3":"value3"}}` |
| `Custom`                                                                                                                                              | The trigger uses Json.NET serialization to map the message from the channel from a `string` into a custom type.                                                                         |

::: zone-end -->

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
- [Using Azure Functions and Azure Cache for Redis to create a write-behind cache](/azure/azure-cache-for-redis/cache-tutorial-write-behind)
- [Redis connection string](functions-bindings-cache.md#redis-connection-string)
- [Redis streams](https://redis.io/docs/data-types/streams/)
