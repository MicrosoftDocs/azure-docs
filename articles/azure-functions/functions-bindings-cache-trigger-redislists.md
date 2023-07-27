---
title: Using RedisListTrigger Azure Function (preview)
description: Learn how to use RedisListTrigger Azure Functions
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 07/26/2023

---

# RedisListTrigger Azure Function (preview)

The `RedisListsTrigger` pops new elements from a list and surfaces those entries to the function.

## Scope of availability for functions triggers

|Tier     | Basic | Standard, Premium  | Enterprise, Enterprise Flash  |
|---------|:---------:|:---------:|:---------:|
| Lists | Yes  | Yes   |  Yes  |

> [!IMPORTANT]
> Redis triggers are not currently supported on consumption functions.
>

## Example

::: zone pivot="programming-language-csharp"

The following sample polls the key `listTest` at a localhost Redis instance at `127.0.0.1:6379`:

### [In-process](#tab/in-process)

```csharp
[FunctionName(nameof(ListsTrigger))]
public static void ListsTrigger(
    [RedisListTrigger("Redis", "listTest")] string entry,
    ILogger logger)
{
    logger.LogInformation($"The entry pushed to the list listTest: '{entry}'");
}
```

### [Isolated process](#tab/isolated-process)

```csharp
//TBD
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
<!--Content and samples from the Java tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-javascript"

Each sample uses the same `index.js` file, with binding data in the `function.json` file.

Here is the `index.js` file:

```javascript
module.exports = async function (context, entry) {
    context.log(entry);
}
```

From `function.json`, here is the binding data:

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
<!--Content and samples from the JavaScript tab in ##Examples go here.-->

::: zone-end
::: zone pivot="programming-language-powershell"

Each sample uses the same `run.ps1` file, with binding data in the `function.json` file.

Here is the `run.ps1` file:

```powershell
param($entry, $TriggerMetadata)
Write-Host $entry

```

From `function.json`, here is the binding data:

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

TBD
<!--Content and samples from the PowerShell tab in ##Examples go here.-->

::: zone-end
::: zone pivot="programming-language-python"

Each sample uses the same `__init__.py` file, with binding data in the `function.json` file.

Here is the `__init__.py` file:

```python
import logging

def main(entry: str):
    logging.info(entry)
```

From `function.json`, here is the binding data:

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

| Parameter                 | Description                                                                                                                                                                                                                           | Required | Default |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------:|
| `ConnectionStringSetting` | Name of the setting in the `appsettings` that holds the to the Redis cache connection string (eg `<cacheName>.redis.cache.windows.net:6380,password=...`).                                                                            | Yes      |         |
| `Key`                     | Key to read from. This field can be resolved using `INameResolver`.                                                                                                                                                                   | Yes      |         |
| `PollingIntervalInMs`     | How often to poll Redis in milliseconds.                                                                                                                                                                                              | Optional | `1000`  |
| `MessagesPerWorker`       | How many messages each functions instance should process. Used to determine how many instances the function should scale to.                                                                                                          | Optional | `100`   |
| `Count`                   | Number of entries to pop from Redis at one time. These are processed in parallel. Only supported on Redis 6.2+ using the `COUNT` argument in [`LPOP`](https://redis.io/commands/lpop/) and [`RPOP`](https://redis.io/commands/rpop/). | Optional | `10`    |
| `ListPopFromBeginning`    | Determines whether to pop entries from the beginning using [`LPOP`](https://redis.io/commands/lpop/), or to pop entries from the end using [`RPOP`](https://redis.io/commands/rpop/).                                                 | Optional | `true`  |

::: zone-end
::: zone pivot="programming-language-java"

## Annotations

| Parameter                 | Description                                                                                                                                                 | Required | Default |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------:|
| `name`                    | "entry"                                                                                                                                                     |          |         |
| `connectionStringSetting` | The name of the setting in the `appsettings` that contains the cache connection string. For example: `<cacheName>.redis.cache.windows.net:6380,password...` | Yes      |         |
| `key`                     | This field can be resolved using INameResolver.                                                                                                             | Yes      |         |
| `pollingIntervalInMs`     | How often to poll Redis in milliseconds.                                                                                                                    | Optional | `1000`  |
| `messagesPerWorker`       | How many messages each functions instance should process. Used to determine how many instances the function should scale to.                                | Optional | `100`   |
| `count`                   | Number of entries to read from Redis at one time. These are processed in parallel.                                                                          | Optional | `10`    |
| `listPopFromBeginning`    | Whether to delete the stream entries after the function has run.                                                                                            | Yes      | `true`  |

<!-- Equivalent values for the annotation parameters in Java.-->
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"

## Configuration

The following table explains the binding configuration properties that you set in the function.json file.

| function.json Property | Description                                                                                                                                                 | Optional | Default |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------:|
| `type`                 | Name of the trigger.                                                                                                                                        | No       |         |
| `listPopFromBeginning` | Whether to delete the stream entries after the function has run. Set to `true`.                                                                             | Yes      | `true`  |
| `connectionString`     | The name of the setting in the `appsettings` that contains the cache connection string. For example: `<cacheName>.redis.cache.windows.net:6380,password...` | No       |         |
| `key`                  | This field can be resolved using `INameResolver`.                                                                                                           | No       |         |
| `pollingIntervalInMs`  | How often to poll Redis in milliseconds.                                                                                                                    | Yes      | `1000`  |
| `messagesPerWorker`    | How many messages each functions instance should process. Used to determine how many instances the function should scale to.                                | Yes      | `100`   |
| `count`                | Number of entries to read from the cache at one time. These are processed in parallel.                                                            | Yes      | `10`      |
| `name`                 | ?                                                                                                                                                            | Yes      |         |
| `direction`            | Set to `in`.                                                                                                                                                 | No       |         |

::: zone-end

See the Example section for complete examples.

## Usage

The `RedisListsTrigger` pops new elements from a list and surfaces those entries to the function. The trigger polls Redis at a configurable fixed interval, and uses [`LPOP`](https://redis.io/commands/lpop/) and [`RPOP`](https://redis.io/commands/rpop/) to pop entries from the lists.

### Output
<!-- This isn't in the template. I understand what it is but we need to ask Glenn where this goes.  -->

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python"

| Output Type | Description|
|---|---|
|  |
| [`StackExchange.Redis.RedisValue`](https://github.com/StackExchange/StackExchange.Redis/blob/main/src/StackExchange.Redis/RedisValue.cs)| `string`, `byte[]`, `ReadOnlyMemory<byte>`: The entry from the list.|
| `Custom`| The trigger uses Json.NET serialization to map the message from the channel from a `string` to a custom type. |

<!--Any usage information specific to isolated worker process, including types. -->

::: zone-end

::: zone pivot="programming-language-csharp"

<!-- TBD -->

<!--Any usage information specific to isolated worker process, including types. -->

::: zone-end
<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-java"

<!-- TBD -->

<!--Any usage information from the Java tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell"

<!-- TBD -->
<!--Any usage information from the JavaScript tab in ## Usage. -->

::: zone-end
::: zone pivot="programming-language-powershell"

<!-- TBD -->
<!--Any usage information from the PowerShell tab in ## Usage. -->

::: zone-end
::: zone pivot="programming-language-python"

<!-- TBD -->
<!--Any usage information from the Python tab in ## Usage. -->

::: zone-end

## Next steps

- [Introduction to Azure Functions](functions-overview.md)
- [Get started with Azure Functions triggers in Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-functions-getting-started)
- [Using Azure Functions and Azure Cache for Redis to create a write-behind cache](/azure/azure-cache-for-redis/cache-tutorial-write-behind)
- [Redis lists](https://redis.io/docs/data-types/lists/)
