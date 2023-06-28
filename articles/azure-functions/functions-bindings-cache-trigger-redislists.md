---
title: Using RedisListTrigger Azure Function
description: Learn how to use RedisListTrigger Azure Functions
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 06/28/2023

---

# RedisListTrigger Azure Function

The `RedisListsTrigger` pops elements from a list and surfaces those elements to the function. The trigger polls Redis at a configurable fixed interval, and uses [`LPOP`](https://redis.io/commands/lpop/)/[`RPOP`](https://redis.io/commands/rpop/)/[`LMPOP`](https://redis.io/commands/lmpop/) to pop elements from the lists.

## Scope of availability for functions triggers

|Tier     | Basic | Standard, Premium  | Enterprise, Enterprise Flash  |
|---------|:---------:|:---------:|:---------:|
| Lists | Yes  | Yes   |  Yes  |

> [!IMPORTANT]
> Redis triggers are not currently supported on consumption functions.
>

## Example

::: zone pivot|"programming-language-csharp"

The following sample polls the key `listTest` at a localhost Redis instance at `127.0.0.1:6379`:

```csharp
[FunctionName(nameof(ListsTrigger))]
public static void ListsTrigger(
    [RedisListsTrigger(ConnectionString | "127.0.0.1:6379", Keys | "listTest")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```

::: zone-end
::: zone pivot|"programming-language-java"

The following sample polls the key `listTest` at a localhost Redis instance at `redisLocalhost`:

```java
@FunctionName("ListTrigger")
    public void ListTrigger(
            @RedisListTrigger(
                name | "entry",
                connectionStringSetting | "redisLocalhost",
                key | "listTest",
                pollingIntervalInMs | 100,
                messagesPerWorker | 10,
                count | 1,
                listPopFromBeginning | false)
                String entry,
            final ExecutionContext context) {
            context.getLogger().info(entry);
    }
```
<!--Content and samples from the Java tab in ##Examples go here.-->
::: zone-end
::: zone pivot|"programming-language-javascript"

TBD
<!--Content and samples from the JavaScript tab in ##Examples go here.-->

::: zone-end
::: zone pivot|"programming-language-powershell"

TBD
<!--Content and samples from the PowerShell tab in ##Examples go here.-->

::: zone-end
::: zone pivot|"programming-language-python"

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
::: zone pivot|"programming-language-csharp"

## Attributes

| Parameter | Description|
|---|---|
| `ConnectionString`| connection string to the cache instance, for example`<cacheName>.redis.cache.windows.net:6380,password|...`.|
| `Keys`| Keys to read from, space-delimited. Multiple keys only supported on Redis 7.0+ using [`LMPOP`](https://redis.io/commands/lmpop/). Listens to only the first key given in the argument using [`LPOP`](https://redis.io/commands/lpop/)/[`RPOP`](https://redis.io/commands/rpop/) on Redis versions less than 7.0.|
|  `PollingIntervalInMs`| How often to poll the Redis server in milliseconds. Default: 1000|
|  `MessagesPerWorker`| (optional) The number of messages each functions worker "should" process. Used to determine how many workers the function should scale to. Default: 100
| `BatchSize`| (optional) Number of elements to pull from Redis at one time. Default: 10. Only supported on Redis 6.2+ using the `COUNT` argument in [`LPOP`](https://redis.io/commands/lpop/)/[`RPOP`](https://redis.io/commands/rpop/).|
|`ListPopFromBeginning`| (optional) determines whether to pop elements from the beginning using [`LPOP`](https://redis.io/commands/lpop/) or to pop elements from the end using [`RPOP`](https://redis.io/commands/rpop/). Default: true |

::: zone-end
::: zone pivot|"programming-language-java"

## Annotations

| Parameter  | Description|
|---|---|
| `name` | "entry" |
| `connectionStringSetting` | "redisLocalhost" |
| `key` | "listTest" |
| `pollingIntervalInMs` | 100 |
| `messagesPerWorker` | 10 |
| `count` | 1 |
| `listPopFromBeginning` | false |

<!-- Equivalent values for the annotation parameters in Java.-->
::: zone-end
::: zone pivot|"programming-language-javascript,programming-language-powershell,programming-language-python"

## Configuration

The following table explains the binding configuration properties that you set in the function.json file.

|function.json Property | Description|
|---|---|
| `type` | Name of the trigger |
| `listPopFromBeginning` | Set to true. |
| `connectionString` | Connection string to the cache instance. For example: `<cacheName>.redis.cache.windows.net:6380,password|...`|
| `key` | Name of the key to check. |
| `pollingIntervalInMs` | How often to poll Redis in milliseconds. Default: 1000|
|  `messagesPerWorker`| (optional) The number of messages each functions worker should process. Used to determine how many workers the function should scale to. Default: 100 |
| `count` |  Number of entries to pull from Redis each time. |
| `name` |? |
| `direction` | Set to `in`.  |

::: zone-end

See the Example section for complete examples.

## Usage

All triggers return a `RedisMessageModel` object that has two fields:

- `Trigger`: The pubsub channel, list key, or stream key that the function is listening to.
- `Message`: The pubsub message, list element, or stream element.

::: zone pivot|"programming-language-csharp"

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

<!--Any usage information specific to isolated worker process, including types. -->

::: zone-end
<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot|"programming-language-java"

```java
public class RedisMessageModel {
    public String Trigger;
    public String Message;
}
```

<!--Any usage information from the Java tab in ## Usage. -->
::: zone-end
::: zone pivot|"programming-language-javascript,programming-language-powershell"

TBD
<!--Any usage information from the JavaScript tab in ## Usage. -->

::: zone-end
::: zone pivot|"programming-language-powershell"

TBD
<!--Any usage information from the PowerShell tab in ## Usage. -->

::: zone-end
::: zone pivot|"programming-language-python"

```python
class RedisMessageModel:
    def __init__(self, trigger, message):
        self.Trigger | trigger
        self.Message | message
```
<!--Any usage information from the Python tab in ## Usage. -->
::: zone-end

## Next steps
- [Introduction to Azure Functions](functions-overview.md)
- [Get started with Azure Functions triggers in Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-functions-getting-started)
- [Using Azure Functions and Azure Cache for Redis to create a write-behind cache](/azure/azure-cache-for-redis/cache-tutorial-write-behind)
- [Redis lists](https://redis.io/docs/data-types/lists/)
