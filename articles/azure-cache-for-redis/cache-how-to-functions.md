---
title: Using Azure Functions
description: Learn how to use Azure Functions
author: flang-msft
zone_pivot_groups: cache-redis-zone-pivot-group

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 05/24/2023

---

# Serverless event-based architectures with Azure Cache for Redis and Azure Functions (preview)

This article describes how to use Azure Cache for Redis with [Azure Functions](/azure/azure-functions/functions-overview) to create optimized serverless and event-driven architectures.
Azure Cache for Redis can be used as a [trigger](/azure/azure-functions/functions-triggers-bindings) for Azure Functions, allowing Redis to initiate a serverless workflow.
This functionality can be highly useful in data architectures like a [write-behind cache](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-caching/#types-of-caching), or any [event-based architectures](/azure/architecture/guide/architecture-styles/event-driven).

There are three triggers supported in Azure Cache for Redis:

- `RedisPubSubTrigger` triggers on [Redis pubsub messages](https://redis.io/docs/manual/pubsub/)
- `RedisListTrigger` triggers on [Redis lists](https://redis.io/docs/data-types/lists/)
- `RedisStreamTrigger` triggers on [Redis streams](https://redis.io/docs/data-types/streams/)

[Keyspace notifications](https://redis.io/docs/manual/keyspace-notifications/) can also be used as triggers through `RedisPubSubTrigger`.

## Scope of availability for functions triggers

|Tier     | Basic | Standard, Premium  | Enterprise, Enterprise Flash  |
|---------|:---------:|:---------:|:---------:|
|Pub/Sub  | Yes  | Yes  |  Yes  |
|Lists | Yes  | Yes   |  Yes  |
|Streams | Yes  | Yes  |  Yes  |

> [!IMPORTANT]
> Redis triggers are not currently supported on consumption functions.
>

## Triggering on keyspace notifications

Redis offers a built-in concept called [keyspace notifications](https://redis.io/docs/manual/keyspace-notifications/). When enabled, this feature publishes notifications of a wide range of cache actions to a dedicated pub/sub channel. Supported actions include actions that affect specific keys, called _keyspace notifications_, and specific commands, called _keyevent notifications_. A huge range of Redis actions are supported, such as `SET`, `DEL`, and `EXPIRE`. The full list can be found in the [keyspace notification documentation](https://redis.io/docs/manual/keyspace-notifications/).

The `keyspace` and `keyevent` notifications are published with the following syntax:

```
PUBLISH __keyspace@0__:<affectedKey> <command>
PUBLISH __keyevent@0__:<affectedCommand> <key>
```

Because these events are published on pub/sub channels, the `RedisPubSubTrigger` is able to pick them up. See the [RedisPubSubTrigger](#redispubsubtrigger) section for more examples.

> [!IMPORTANT]
> In Azure Cache for Redis, `keyspace` events must be enabled before notifications are published. For more information, see [Advanced Settings](cache-configure.md#keyspace-notifications-advanced-settings).

## Prerequisites and limitations

- The `RedisPubSubTrigger` isn't capable of listening to [keyspace notifications](https://redis.io/docs/manual/keyspace-notifications/) on clustered caches.
- Basic tier functions don't support triggering on `keyspace` or `keyevent` notifications through the `RedisPubSubTrigger`.
- The `RedisPubSubTrigger` isn't supported with consumption functions.

## Trigger usage

### RedisPubSubTrigger

The `RedisPubSubTrigger` subscribes to a specific channel pattern using [`PSUBSCRIBE`](https://redis.io/commands/psubscribe/), and surfaces messages received on those channels to the function.

> [!WARNING]
> This trigger isn't supported on a [consumption plan](/azure/azure-functions/consumption-plan) because Redis PubSub requires clients to always be actively listening to receive all messages. For consumption plans, your function might miss certain messages published to the channel.
>

> [!NOTE]
> Functions with the `RedisPubSubTrigger` should not be scaled out to multiple instances.
> Each instance listens and processes each pubsub message, resulting in duplicate processing.

#### Inputs for RedisPubSubTrigger

- `ConnectionString`: connection string to the redis cache (for example, `<cacheName>.redis.cache.windows.net:6380,password=...`).
- `Channel`: name of the pubsub channel that the trigger should listen to.

This sample listens to the channel "channel" at a localhost Redis instance at `127.0.0.1:6379`

::: zone pivot="programming-language-csharp"

```csharp
[FunctionName(nameof(PubSubTrigger))]
public static void PubSubTrigger(
    [RedisPubSubTrigger(ConnectionString = "127.0.0.1:6379", Channel = "channel")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```

:::zone-end
::: zone pivot="programming-language-java"

```java
@FunctionName("PubSubTrigger")
    public void PubSubTrigger(
            @RedisPubSubTrigger(
                name = "message",
                connectionStringSetting = "redisLocalhost",
                channel = "channel")
                String message,
            final ExecutionContext context) {
            context.getLogger().info(message);
    }
```

:::zone-end

::: zone pivot="programming-language-python"

```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connectionStringSetting": "redisLocalhost",
      "channel": "channel",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "__init__.py"
}
```

:::zone-end

This sample listens to any keyspace notifications for the key `myKey` in a localhost Redis instance at `127.0.0.1:6379`.

::: zone pivot="programming-language-csharp"

```csharp

[FunctionName(nameof(PubSubTrigger))]
public static void PubSubTrigger(
    [RedisPubSubTrigger(ConnectionString = "127.0.0.1:6379", Channel = "__keyspace@0__:myKey")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```

:::zone-end
::: zone pivot="programming-language-java"

```java
@FunctionName("KeyspaceTrigger")
    public void KeyspaceTrigger(
            @RedisPubSubTrigger(
                name = "message",
                connectionStringSetting = "redisLocalhost",
                channel = "__keyspace@0__:myKey")
                String message,
            final ExecutionContext context) {
            context.getLogger().info(message);
    }
```

:::zone-end

::: zone pivot="programming-language-python"

```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connectionStringSetting": "redisLocalhost",
      "channel": "__keyspace@0__:myKey",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "__init__.py"
}
```

:::zone-end

This sample listens to any `keyevent` notifications for the delete command [`DEL`](https://redis.io/commands/del/) in a localhost Redis instance at `127.0.0.1:6379`.

::: zone pivot="programming-language-csharp"

```csharp
[FunctionName(nameof(PubSubTrigger))]
public static void PubSubTrigger(
    [RedisPubSubTrigger(ConnectionString = "127.0.0.1:6379", Channel = "__keyevent@0__:del")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```

:::zone-end
::: zone pivot="programming-language-java"

```java
 @FunctionName("KeyeventTrigger")
    public void KeyeventTrigger(
            @RedisPubSubTrigger(
                name = "message",
                connectionStringSetting = "redisLocalhost",
                channel = "__keyevent@0__:del")
                String message,
            final ExecutionContext context) {
            context.getLogger().info(message);
    }
```

:::zone-end

::: zone pivot="programming-language-python"

```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connectionStringSetting": "redisLocalhost",
      "channel": "__keyevent@0__:del",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "__init__.py"
}
```

:::zone-end

### RedisListsTrigger

The `RedisListsTrigger` pops elements from a list and surfaces those elements to the function. The trigger polls Redis at a configurable fixed interval, and uses [`LPOP`](https://redis.io/commands/lpop/)/[`RPOP`](https://redis.io/commands/rpop/)/[`LMPOP`](https://redis.io/commands/lmpop/) to pop elements from the lists.

#### Inputs for RedisListsTrigger

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

The following sample polls the key `listTest` at a localhost Redis instance at `127.0.0.1:6379`:

::: zone pivot="programming-language-csharp"

```csharp
[FunctionName(nameof(ListsTrigger))]
public static void ListsTrigger(
    [RedisListsTrigger(ConnectionString = "127.0.0.1:6379", Keys = "listTest")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```

:::zone-end
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

:::zone-end

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

:::zone-end

### RedisStreamsTrigger

The `RedisStreamsTrigger` pops elements from a stream and surfaces those elements to the function.
The trigger polls Redis at a configurable fixed interval, and uses [`XREADGROUP`](https://redis.io/commands/xreadgroup/) to read elements from the stream.
Each function creates a new random GUID to use as its consumer name within the group to ensure that scaled out instances of the function don't read the same messages from the stream.

#### Inputs for RedisStreamsTrigger

- `ConnectionString`: connection string to the redis cache, for example, `<cacheName>.redis.cache.windows.net:6380,password=...`.
- `Keys`: Keys to read from, space-delimited.
  - Uses [`XREADGROUP`](https://redis.io/commands/xreadgroup/).
- (optional) `PollingIntervalInMs`: How often to poll Redis in milliseconds.
  - Default: 1000
- (optional) `MessagesPerWorker`: How many messages each functions worker "should" process. Used to determine how many workers the function should scale to.
  - Default: 100
- (optional) `BatchSize`: Number of elements to pull from Redis at one time.
  - Default: 10
- (optional) `ConsumerGroup`: The name of the consumer group that the function uses.
  - Default: "AzureFunctionRedisExtension"
- (optional) `DeleteAfterProcess`: If the listener will delete the stream entries after the function runs.
  - Default: false

The following sample polls the key `streamTest` at a localhost Redis instance at `127.0.0.1:6379`:

::: zone pivot="programming-language-csharp"

```csharp
[FunctionName(nameof(StreamsTrigger))]
public static void StreamsTrigger(
    [RedisStreamsTrigger(ConnectionString = "127.0.0.1:6379", Keys = "streamTest")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```

:::zone-end
::: zone pivot="programming-language-java"

```java
@FunctionName("StreamTrigger")
    public void StreamTrigger(
            @RedisStreamTrigger(
                name = "entry",
                connectionStringSetting = "redisLocalhost",
                key = "streamTest",
                pollingIntervalInMs = 100,
                messagesPerWorker = 10,
                count = 1,
                deleteAfterProcess = true)
                String entry,
            final ExecutionContext context) {
            context.getLogger().info(entry);
    }
```

:::zone-end

::: zone pivot="programming-language-python"

```json
{
  "bindings": [
    {
      "type": "redisStreamTrigger",
      "deleteAfterProcess": false,
      "connectionStringSetting": "redisLocalhost",
      "key": "streamTest",
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

:::zone-end

### Return values

All triggers return a `RedisMessageModel` object that has two fields:

- `Trigger`: The pubsub channel, list key, or stream key that the function is listening to.
- `Message`: The pubsub message, list element, or stream element.

::: zone pivot="programming-language-csharp"

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

:::zone-end
::: zone pivot="programming-language-java"

```java
public class RedisMessageModel {
    public String Trigger;
    public String Message;
}
```

:::zone-end

::: zone pivot="programming-language-python"

```python
class RedisMessageModel:
    def __init__(self, trigger, message):
        self.Trigger = trigger
        self.Message = message
```

:::zone-end

## Next steps

- [Introduction to Azure Functions](/azure/azure-functions/functions-overview)
- [Get started with Azure Functions triggers in Azure Cache for Redis](cache-tutorial-functions-getting-started.md)
- [Using Azure Functions and Azure Cache for Redis to create a write-behind cache](cache-tutorial-write-behind.md)