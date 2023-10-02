---
title: Using RedisPubSubTrigger Azure Function (preview)
description: Learn how to use RedisPubSubTrigger Azure Function
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: azure-functions
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: reference
ms.date: 08/07/2023
---

# RedisPubSubTrigger Azure Function (preview)

Redis features [publish/subscribe functionality](https://redis.io/docs/interact/pubsub/) that enables messages to be sent to Redis and broadcast to subscribers.

## Scope of availability for functions triggers

|Tier     | Basic | Standard, Premium  | Enterprise, Enterprise Flash  |
|---------|:---------:|:---------:|:---------:|
|Pub/Sub Trigger  | Yes  | Yes  |  Yes  |

> [!WARNING]
> This trigger isn't supported on a [consumption plan](/azure/azure-functions/consumption-plan) because Redis PubSub requires clients to always be actively listening to receive all messages. For consumption plans, your function might miss certain messages published to the channel.
>

## Examples

::: zone pivot="programming-language-csharp"

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]

### [Isolated worker model](#tab/isolated-process)

The isolated process examples aren't available in preview.

```csharp
//TBD
```

### [In-process model](#tab/in-process)

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

---

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

::: zone-end
::: zone pivot="programming-language-javascript"

### [v3](#tab/node-v3)

This sample uses the same `index.js` file, with binding data in the `function.json` file determining on which channel the trigger occurs.

Here's the `index.js` file:

```javascript
module.exports = async function (context, message) {
    context.log(message);
}
```

From `function.json`:

Here's binding data to listen to the channel `pubsubTest`.

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

Here's binding data to listen to keyspace notifications for the key `myKey`.

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

Here's binding data to listen to `keyevent` notifications for the delete command [`DEL`](https://redis.io/commands/del/).

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
### [v4](#tab/node-v4)

The JavaScript v4 programming model example isn't available in preview.

---
::: zone-end
::: zone pivot="programming-language-powershell"

This sample uses the same `run.ps1` file, with binding data in the `function.json` file determining on which channel the trigger occurs.

Here's the `run.ps1` file:

```powershell
param($message, $TriggerMetadata)
Write-Host $message
```

From `function.json`:

Here's binding data to listen to the channel `pubsubTest`.

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

Here's binding data to listen to keyspace notifications for the key `myKey`.

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

Here's binding data to listen to `keyevent` notifications for the delete command [`DEL`](https://redis.io/commands/del/).

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

### [v1](#tab/python-v1)

The Python v1 programming model requires you to define bindings in a separate _function.json_ file in the function folder. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-configuration#programming-model).

This sample uses the same `__init__.py` file, with binding data in the `function.json` file determining on which channel the trigger occurs.

Here's the `__init__.py` file:

```python
import logging

def main(message: str):
    logging.info(message)
```

From `function.json`:

Here's binding data to listen to the channel `pubsubTest`.

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

Here's binding data to listen to keyspace notifications for the key `myKey`.

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

Here's binding data to listen to `keyevent` notifications for the delete command [`DEL`](https://redis.io/commands/del/).

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

### [v2](#tab/python-v2)

The Python v2 programming model example isn't available in preview.

---

::: zone-end
::: zone pivot="programming-language-csharp"

## Attributes

| Parameter                 | Description                                                                                                                                   | Required   | Default    |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|:-----:| -----:|
| `ConnectionStringSetting` | Name of the setting in the `appsettings` that holds the cache connection string. For example,`<cacheName>.redis.cache.windows.net:6380,password=...`. |   Yes  |     |
| `Channel`                 | The pub sub channel that the trigger should listen to. Supports glob-style channel patterns. This field can be resolved using `INameResolver`.       |  Yes   |     |

::: zone-end
::: zone pivot="programming-language-java"

## Annotations

| Parameter                 | Description                                                                                                                                               | Required   | Default    |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|: -----:| -----:|
| `name`                    | Name of the variable holding the value returned by the function.                                                                                          |  Yes   |     |
| `connectionStringSetting` | Name of the setting in the `appsettings` that holds the cache connection string (for example, `<cacheName>.redis.cache.windows.net:6380,password=...`) |  Yes   |     |
| `channel`                 | The pub sub channel that the trigger should listen to. Supports glob-style channel patterns.                                                               | Yes    |     |

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"

## Configuration

| function.json property    | Description                                                                                                                                               | Required   | Default    |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------| :-----:| -----:|
| `type`                    | Trigger type. For the pub sub trigger, this is `redisPubSubTrigger`.                                                                                       |  Yes   |     |
| `connectionStringSetting` | Name of the setting in the `appsettings` that holds the cache connection string (for example, `<cacheName>.redis.cache.windows.net:6380,password=...`) |  Yes   |     |
| `channel`                 | Name of the pub sub channel that is being subscribed to                                                                                                    |  Yes   |     |
| `name`                    | Name of the variable holding the value returned by the function.                                                                                          |  Yes   |     |
| `direction`               | Must be set to `in`.                                                                                                                                      |  Yes   |     |

::: zone-end

>[!IMPORTANT]
>The `connectionStringSetting` parameter does not hold the Redis cache connection string itself. Instead, it points to the name of the environment variable that holds the connection string. This makes the application more secure. For more information, see [Redis connection string](functions-bindings-cache.md#redis-connection-string).
>

## Usage

Redis features [publish/subscribe functionality](https://redis.io/docs/interact/pubsub/) that enables messages to be sent to Redis and broadcast to subscribers. The `RedisPubSubTrigger` enables Azure Functions to be triggered on pub/sub activity. The `RedisPubSubTrigger`subscribes to a specific channel pattern using [`PSUBSCRIBE`](https://redis.io/commands/psubscribe/), and surfaces messages received on those channels to the function.

### Prerequisites and limitations

- The `RedisPubSubTrigger` isn't capable of listening to [keyspace notifications](https://redis.io/docs/manual/keyspace-notifications/) on clustered caches.
- Basic tier functions don't support triggering on `keyspace` or `keyevent` notifications through the `RedisPubSubTrigger`.
- The `RedisPubSubTrigger` isn't supported on a [consumption plan](/azure/azure-functions/consumption-plan) because Redis PubSub requires clients to always be actively listening to receive all messages. For consumption plans, your function might miss certain messages published to the channel.
- Functions with the `RedisPubSubTrigger` shouldn't be scaled out to multiple instances. Each instance listens and processes each pub sub message, resulting in duplicate processing

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

## Output

::: zone pivot="programming-language-csharp"

> [!NOTE]
> Once the `RedisPubSubTrigger` becomes generally available, the following information will be moved to a dedicated Output page.


| Output Type | Description|
|---|---|
| [`StackExchange.Redis.ChannelMessage`](https://github.com/StackExchange/StackExchange.Redis/blob/main/src/StackExchange.Redis/ChannelMessageQueue.cs)| The value returned by `StackExchange.Redis`. |
| [`StackExchange.Redis.RedisValue`](https://github.com/StackExchange/StackExchange.Redis/blob/main/src/StackExchange.Redis/RedisValue.cs)| `string`, `byte[]`, `ReadOnlyMemory<byte>`: The message from the channel. |
| `Custom`| The trigger uses Json.NET serialization to map the message from the channel from a `string` into a custom type. |

::: zone-end

::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python"

> [!NOTE]
> Once the `RedisPubSubTrigger` becomes generally available, the following information will be moved to a dedicated Output page.

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
- [Redis pub sub messages](https://redis.io/docs/manual/pubsub/)
