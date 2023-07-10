---
title: Using RedisPubSubTrigger Azure Function
description: Learn how to use RedisPubSubTrigger Azure Function
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 06/28/2023

---

# RedisPubSubTrigger Azure Function

Redis features [publish/subscribe functionality](https://redis.io/docs/interact/pubsub/) that enables messages to be sent to Redis and broadcast to subscribers. The `RedisPubSubTrigger` enables Azure Functions to be triggered on pub/sub activity. The `RedisPubSubTrigger`subscribes to a specific channel pattern using [`PSUBSCRIBE`](https://redis.io/commands/psubscribe/), and surfaces messages received on those channels to the function.

### Prerequisites and limitations

- The `RedisPubSubTrigger` isn't capable of listening to [keyspace notifications](https://redis.io/docs/manual/keyspace-notifications/) on clustered caches.
- Basic tier functions don't support triggering on `keyspace` or `keyevent` notifications through the `RedisPubSubTrigger`.
- The `RedisPubSubTrigger` isn't supported on a [consumption plan](/azure/azure-functions/consumption-plan) because Redis PubSub requires clients to always be actively listening to receive all messages. For consumption plans, your function might miss certain messages published to the channel.
- Functions with the `RedisPubSubTrigger` should not be scaled out to multiple instances. Each instance listens and processes each pubsub message, resulting in duplicate processing

### Scope of availability for functions triggers

|Tier     | Basic | Standard, Premium  | Enterprise, Enterprise Flash  |
|---------|:---------:|:---------:|:---------:|
|Pub/Sub Trigger  | Yes  | Yes  |  Yes  |

> [!WARNING]
> This trigger isn't supported on a [consumption plan](/azure/azure-functions/consumption-plan) because Redis PubSub requires clients to always be actively listening to receive all messages. For consumption plans, your function might miss certain messages published to the channel.
>

## Triggering on keyspace notifications

Redis offers a built-in concept called [keyspace notifications](https://redis.io/docs/manual/keyspace-notifications/). When enabled, this feature publishes notifications of a wide range of cache actions to a dedicated pub/sub channel. Supported actions include actions that affect specific keys, called _keyspace notifications_, and specific commands, called _keyevent notifications_. A huge range of Redis actions are supported, such as `SET`, `DEL`, and `EXPIRE`. The full list can be found in the [keyspace notification documentation](https://redis.io/docs/manual/keyspace-notifications/).

The `keyspace` and `keyevent` notifications are published with the following syntax:

```
PUBLISH __keyspace@0__:<affectedKey> <command>
PUBLISH __keyevent@0__:<affectedCommand> <key>
```

Because these events are published on pub/sub channels, the `RedisPubSubTrigger` is able to pick them up. See the [RedisPubSubTrigger](functions-bindings-cache-trigger-redispubsub.md) section for more examples.

> [!IMPORTANT]
> In Azure Cache for Redis, `keyspace` events must be enabled before notifications are published. For more information, see [Advanced Settings](/azure/azure-cache-for-redis/cache-configure#keyspace-notifications-advanced-settings).

## Examples

::: zone pivot="programming-language-csharp"

This sample listens to the channel `pubsubTest`.

```csharp
[FunctionName(nameof(PubSubTrigger))]
public static void PubSubTrigger(
    [RedisPubSubTrigger("redisConnectionString", "pubsubTest")] string message,
    ILogger logger)
{
    logger.LogInformation(message);
}
```

This sample listens to any keyspace notifications for the key `myKey`.

```csharp

[FunctionName(nameof(KeyspaceTrigger))]
public static void KeyspaceTrigger(
    [RedisPubSubTrigger("redisConnectionString", "__keyspace@0__:myKey")] string message,
    ILogger logger)
{
    logger.LogInformation(message);
}
```

This sample listens to any `keyevent` notifications for the delete command [`DEL`](https://redis.io/commands/del/).

```csharp
[FunctionName(nameof(KeyeventTrigger))]
public static void KeyeventTrigger(
    [RedisPubSubTrigger("redisConnectionString", "__keyevent@0__:del")] string message,
    ILogger logger)
{
    logger.LogInformation(message);
}
```

::: zone-end
::: zone pivot="programming-language-java"

This sample listens to the channel `pubsubTest`.

```java
@FunctionName("PubSubTrigger")
    public void PubSubTrigger(
            @RedisPubSubTrigger(
                name = "message",
                connectionStringSetting = "redisConnectionString",
                channel = "pubsubTest")
                String message,
            final ExecutionContext context) {
            context.getLogger().info(message);
    }
```
This sample listens to any keyspace notifications for the key `myKey`.

```java
@FunctionName("KeyspaceTrigger")
    public void KeyspaceTrigger(
            @RedisPubSubTrigger(
                name = "message",
                connectionStringSetting = "redisConnectionString",
                channel = "__keyspace@0__:myKey")
                String message,
            final ExecutionContext context) {
            context.getLogger().info(message);
    }
```
This sample listens to any `keyevent` notifications for the delete command [`DEL`](https://redis.io/commands/del/).

```java
 @FunctionName("KeyeventTrigger")
    public void KeyeventTrigger(
            @RedisPubSubTrigger(
                name = "message",
                connectionStringSetting = "redisConnectionString",
                channel = "__keyevent@0__:del")
                String message,
            final ExecutionContext context) {
            context.getLogger().info(message);
    }
```
<!--Content and samples from the Java tab in ##Examples go here.-->

::: zone-end
::: zone pivot="programming-language-javascript"

Each sample uses the same `index.js` file, with binding data in the `function.json` file determining on which channel the trigger will occur. Here is the `index.js` file:

```node
module.exports = async function (context, message) {
    context.log(message);
}
```

Here is binding data to listen to the channel `pubsubTest`:

```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connectionStringSetting": "redisConnectionString",
      "channel": "pubsubTest",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "index.js"
}
```

Here is binding data to listen to keyspace notifications for the key `myKey`:
```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connectionStringSetting": "redisConnectionString",
       "channel": "__keyspace@0__:myKey",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "index.js"
}
```

Here is binding data to listen to `keyevent` notifications for the delete command [`DEL`](https://redis.io/commands/del/):

```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connectionStringSetting": "redisConnectionString",
      "channel": "__keyevent@0__:del",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "index.js"
}
```

::: zone-end
::: zone pivot="programming-language-powershell"

Each sample uses the same `run.ps1` file, with binding data in the `function.json` file determining on which channel the trigger will occur. Here is the `run.ps1` file:

```powershell
param($message, $TriggerMetadata)
Write-Host $message
```
Here is binding data to listen to the channel `pubsubTest`:

```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connectionStringSetting": "redisConnectionString",
      "channel": "pubsubTest",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "run.ps1"
}
```

Here is binding data to listen to keyspace notifications for the key `myKey`:
```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connectionStringSetting": "redisConnectionString",
       "channel": "__keyspace@0__:myKey",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "run.ps1"
}
```

Here is binding data to listen to `keyevent` notifications for the delete command [`DEL`](https://redis.io/commands/del/):

```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connectionStringSetting": "redisConnectionString",
      "channel": "__keyevent@0__:del",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "run.ps1"
}
```

::: zone-end
::: zone pivot="programming-language-python"

Each sample uses the same `__init__.py` file, with binding data in the `function.json` file determining on which channel the trigger will occur. Here is the `__init__.py` file:

```python
import logging

def main(message: str):
    logging.info(message)
```

Here is binding data to listen to the channel `pubsubTest`:

```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connectionStringSetting": "redisConnectionString",
      "channel": "pubsubTest",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "__init__.py"
}
```

Here is binding data to listen to keyspace notifications for the key `myKey`:
```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connectionStringSetting": "redisConnectionString",
      "channel": "__keyspace@0__:myKey",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "__init__.py"
}
```
Here is binding data to listen to `keyevent` notifications for the delete command [`DEL`](https://redis.io/commands/del/):

```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connectionStringSetting": "redisConnectionString",
      "channel": "__keyevent@0__:del",
      "name": "message",
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

| Parameter | Description|
|---|---|
|  |
| `ConnectionStringSetting`| Name of the setting in the appsettings that holds the to the Redis cache connection string (eg `<cacheName>.redis.cache.windows.net:6380,password=...`). |
|  `Channel`| pubsub channel that the trigger should listen to. Supports glob-style channel patterns. This field can be resolved using `INameResolver`. |

::: zone-end
::: zone pivot="programming-language-java"

## Annotations

| Parameter | Description|
|---|---|
|`name`| Name of the variable holding the value returned by the function. |
| `connectionStringSetting`| Name of the setting in the appsettings that holds the to the Redis cache connection string (eg `<cacheName>.redis.cache.windows.net:6380,password=...`) |
| `channel`| pubsub channel that the trigger should listen to. Supports glob-style channel patterns. |

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"

## Configuration

<!-- Equivalent values for the annotation parameters in Java.-->

| function.json property | Description|
|---|---|
|`type`| Trigger type. For the pubsub trigger, this is always `redisPubSubTrigger`. |
| `connectionStringSetting`| Connection string to the cache instance. For example: `<cacheName>.redis.cache.windows.net:6380,password=...`|
| `channel`| Name of the pubsub channel that is being subscribed to |
|  `name`| Name of the variable holding the value returned by the function. |
| `direction` | Must be set to `in`.  |

::: zone-end

## Output

Work in progress

::: zone pivot="programming-language-csharp"

```csharp
## Output Types

| Output Type | Description|
|---|---|
|  |
| [`StackExchange.Redis.ChannelMessage`](https://github.com/StackExchange/StackExchange.Redis/blob/main/src/StackExchange.Redis/ChannelMessageQueue.cs)| The value returned by `StackExchange.Redis`. |
| [`StackExchange.Redis.RedisValue`](https://github.com/StackExchange/StackExchange.Redis/blob/main/src/StackExchange.Redis/RedisValue.cs)| `string`, `byte[]`, `ReadOnlyMemory<byte>`: The message from the channel. |
| `Custom`| The trigger uses Json.NET serialization to map the message from the channel from a `string` into a custom type. |

<!--Any usage information specific to isolated worker process, including types. -->

::: zone-end
<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-java"

```java
public class RedisMessageModel {
    public String Trigger;
    public String Message;
}
```

<!--Any usage information from the Java tab in ## Usage. -->

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell"

TBD
<!--Any usage information from the JavaScript tab in ## Usage. -->

::: zone-end

TBD
<!--Any usage information from the PowerShell tab in ## Usage. -->

::: zone-end

::: zone pivot="programming-language-python"

<!--Any usage information from the Python tab in ## Usage. -->
::: zone-end

## Next steps

- [Introduction to Azure Functions](functions-overview.md)
- [Get started with Azure Functions triggers in Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-functions-getting-started)
- [Using Azure Functions and Azure Cache for Redis to create a write-behind cache](/azure/azure-cache-for-redis/cache-tutorial-write-behind)
- [Redis pubsub messages](https://redis.io/docs/manual/pubsub/)
