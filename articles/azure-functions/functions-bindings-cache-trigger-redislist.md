---
title: Using RedisListTrigger Azure Function (preview)
description: Learn how to use RedisListTrigger Azure Functions
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: azure-functions
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: reference
ms.date: 08/07/2023
---

# RedisListTrigger Azure Function (preview)

The `RedisListTrigger` pops new elements from a list and surfaces those entries to the function.

## Scope of availability for functions triggers

|Tier     | Basic | Standard, Premium  | Enterprise, Enterprise Flash  |
|---------|:---------:|:---------:|:---------:|
| Lists | Yes  | Yes   |  Yes  |

> [!IMPORTANT]
> Redis triggers aren't currently supported for functions running in the [Consumption plan](consumption-plan.md). 
>

## Example

::: zone pivot="programming-language-csharp"

The following sample polls the key `listTest` at a localhost Redis instance at `127.0.0.1:6379`:

### [Isolated worker model](#tab/isolated-process)

The isolated process examples aren't available in preview.

### [In-process model](#tab/in-process)

```csharp
[FunctionName(nameof(ListsTrigger))]
public static void ListsTrigger(
    [RedisListTrigger("Redis", "listTest")] string entry,
    ILogger logger)
{
    logger.LogInformation($"The entry pushed to the list listTest: '{entry}'");
}
```

---

::: zone-end
::: zone pivot="programming-language-java"

The following sample polls the key `listTest` at a localhost Redis instance at `redisLocalhost`:

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

::: zone-end
::: zone pivot="programming-language-javascript"

### [v3](#tab/node-v3)

This sample uses the same `index.js` file, with binding data in the `function.json` file.

Here's the `index.js` file:

```javascript
module.exports = async function (context, entry) {
    context.log(entry);
}
```

From `function.json`, here's the binding data:

```javascript
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
  "scriptFile": "index.js"
}
```

### [v4](#tab/node-v4)

The JavaScript v4 programming model example isn't available in preview.

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

```powershell
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

### [v2](#tab/python-v2)

The Python v2 programming model example isn't available in preview.

---

::: zone-end
::: zone pivot="programming-language-csharp"

## Attributes

| Parameter                 | Description                                                                                                                                                                                                                           | Required | Default |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|--------:|
| `ConnectionStringSetting` | Name of the setting in the `appsettings` that holds the cache connection string (for example, `<cacheName>.redis.cache.windows.net:6380,password=...`).                                                                            | Yes      |         |
| `Key`                     | Key to read from. This field can be resolved using `INameResolver`.                                                                                                                                                                   | Yes      |         |
| `PollingIntervalInMs`     | How often to poll Redis in milliseconds.                                                                                                                                                                                              | Optional | `1000`  |
| `MessagesPerWorker`       | How many messages each functions instance should process. Used to determine how many instances the function should scale to.                                                                                                          | Optional | `100`   |
| `Count`                   | Number of entries to pop from Redis at one time. These are processed in parallel. Only supported on Redis 6.2+ using the `COUNT` argument in [`LPOP`](https://redis.io/commands/lpop/) and [`RPOP`](https://redis.io/commands/rpop/). | Optional | `10`    |
| `ListPopFromBeginning`    | Determines whether to pop entries from the beginning using [`LPOP`](https://redis.io/commands/lpop/), or to pop entries from the end using [`RPOP`](https://redis.io/commands/rpop/).                                                 | Optional | `true`  |

::: zone-end
::: zone pivot="programming-language-java"

## Annotations

| Parameter                 | Description                                                                                                                                                 | Required | Default |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|--------:|
| `name`                    | "entry"                                                                                                                                                     |          |         |
| `connectionStringSetting` | The name of the setting in the `appsettings` that contains the cache connection string. For example: `<cacheName>.redis.cache.windows.net:6380,password...` | Yes      |         |
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
| `connectionString`     | The name of the setting in the `appsettings` that contains the cache connection string. For example: `<cacheName>.redis.cache.windows.net:6380,password...` | No       |         |
| `key`                  | This field can be resolved using `INameResolver`.                                                                                                           | No       |         |
| `pollingIntervalInMs`  | How often to poll Redis in milliseconds.                                                                                                                    | Yes      | `1000`  |
| `messagesPerWorker`    | How many messages each functions instance should process. Used to determine how many instances the function should scale to.                                | Yes      | `100`   |
| `count`                | Number of entries to read from the cache at one time. These are processed in parallel.                                                                      | Yes      | `10`    |
| `name`                 | ?                                                                                                                                                           | Yes      |         |
| `direction`            | Set to `in`.                                                                                                                                                | No       |         |

::: zone-end

See the Example section for complete examples.

## Usage

The `RedisListTrigger` pops new elements from a list and surfaces those entries to the function. The trigger polls Redis at a configurable fixed interval, and uses [`LPOP`](https://redis.io/commands/lpop/) and [`RPOP`](https://redis.io/commands/rpop/) to pop entries from the lists.

### Output

::: zone pivot="programming-language-csharp"

> [!NOTE]
> Once the `RedisListTrigger` becomes generally available, the following information will be moved to a dedicated Output page.

StackExchange.Redis.RedisValue

| Output Type                                                                                                                              | Description                                                                                                   |
|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| [`StackExchange.Redis.RedisValue`](https://github.com/StackExchange/StackExchange.Redis/blob/main/src/StackExchange.Redis/RedisValue.cs) | `string`, `byte[]`, `ReadOnlyMemory<byte>`: The entry from the list.                                          |
| `Custom`                                                                                                                                 | The trigger uses Json.NET serialization to map the message from the channel from a `string` to a custom type. |

::: zone-end

::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python"

> [!NOTE]
> Once the `RedisListTrigger` becomes generally available, the following information will be moved to a dedicated Output page.

| Output Type | Description                                                                                                     |
|-------------|-----------------------------------------------------------------------------------------------------------------|
| `byte[]`    | The message from the channel.                                                                                    |
| `string`    | The message from the channel.                                                                                   |
| `Custom`    | The trigger uses Json.NET serialization to map the message from the channel from a `string` into a custom type. |

::: zone-end
::: zone pivot="programming-language-java"

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell"

::: zone-end
::: zone pivot="programming-language-powershell"

::: zone-end
::: zone pivot="programming-language-python"

::: zone-end

## Related content

- [Introduction to Azure Functions](functions-overview.md)
- [Tutorial: Get started with Azure Functions triggers in Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-functions-getting-started)
- [Tutorial: Create a write-behind cache by using Azure Functions and Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-write-behind)
- [Redis lists](https://redis.io/docs/data-types/lists/)
