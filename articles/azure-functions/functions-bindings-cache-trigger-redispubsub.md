---
title: RedisPubSubTrigger for Azure Functions
description: Learn how to use RedisPubSubTrigger Azure Function with Azure Cache for Redis.
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: azure-functions
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: reference
ms.date: 05/20/2024
---

# RedisPubSubTrigger for Azure Functions

Redis features [publish/subscribe functionality](https://redis.io/docs/interact/pubsub/) that enables messages to be sent to Redis and broadcast to subscribers.

For more information about Azure Cache for Redis triggers and bindings, [Redis Extension for Azure Functions](https://github.com/Azure/azure-functions-redis-extension/tree/main).

## Scope of availability for functions triggers

|Tier     | Basic | Standard, Premium  | Enterprise, Enterprise Flash  |
|---------|:---------:|:---------:|:---------:|
|Pub/Sub Trigger  | Yes  | Yes  |  Yes  |

> [!WARNING]
> This trigger isn't supported on a [consumption plan](/azure/azure-functions/consumption-plan) because Redis PubSub requires clients to always be actively listening to receive all messages. For consumption plans, your function might miss certain messages published to the channel.
>

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

## Examples

::: zone pivot="programming-language-csharp"

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]

> [!IMPORTANT]
>
>For .NET functions, using the _isolated worker_ model is recommended over the _in-process_ model. For a comparison of the _in-process_ and _isolated worker_ models, see differences between the _isolated worker_ model and the _in-process_ model for .NET on Azure Functions.

### [Isolated worker model](#tab/isolated-process)

This sample listens to the channel `pubsubTest`.

```csharp
﻿using Microsoft.Extensions.Logging;

namespace Microsoft.Azure.Functions.Worker.Extensions.Redis.Samples.RedisPubSubTrigger
{
    internal class SimplePubSubTrigger
    {
        private readonly ILogger<SimplePubSubTrigger> logger;

        public SimplePubSubTrigger(ILogger<SimplePubSubTrigger> logger)
        {
            this.logger = logger;
        }

        [Function(nameof(SimplePubSubTrigger))]
        public void Run(
            [RedisPubSubTrigger(Common.connectionStringSetting, "pubsubTest")] string message)
        {
            logger.LogInformation(message);
        }
    }
}

```

This sample listens to any keyspace notifications for the key `keyspaceTest`.

```csharp
using Microsoft.Extensions.Logging;

namespace Microsoft.Azure.Functions.Worker.Extensions.Redis.Samples.RedisPubSubTrigger
{
    internal class KeyspaceTrigger
    {
        private readonly ILogger<KeyspaceTrigger> logger;

        public KeyspaceTrigger(ILogger<KeyspaceTrigger> logger)
        {
            this.logger = logger;
        }
        
        [Function(nameof(KeyspaceTrigger))]
        public void Run(
            [RedisPubSubTrigger(Common.connectionStringSetting, "__keyspace@0__:keyspaceTest")] string message)
        {
            logger.LogInformation(message);
        }
    }
}

```

This sample listens to any `keyevent` notifications for the delete command [`DEL`](https://redis.io/commands/del/).

```csharp
﻿using Microsoft.Extensions.Logging;

namespace Microsoft.Azure.Functions.Worker.Extensions.Redis.Samples.RedisPubSubTrigger
{
    internal class KeyeventTrigger
    {
        private readonly ILogger<KeyeventTrigger> logger;

        public KeyeventTrigger(ILogger<KeyeventTrigger> logger)
        {
            this.logger = logger;
        }
        
        [Function(nameof(KeyeventTrigger))]
        public void Run(
            [RedisPubSubTrigger(Common.connectionStringSetting, "__keyevent@0__:del")] string message)
        {
            logger.LogInformation($"Key '{message}' deleted.");
        }
    }
}

```

### [In-process model](#tab/in-process)

[!INCLUDE [functions-in-process-model-retirement-note](../../includes/functions-in-process-model-retirement-note.md)]

This sample listens to the channel `pubsubTest`.

```csharp
﻿using Microsoft.Extensions.Logging;

namespace Microsoft.Azure.WebJobs.Extensions.Redis.Samples.RedisPubSubTrigger
{
    internal class SimplePubSubTrigger
    {
        [FunctionName(nameof(SimplePubSubTrigger))]
        public static void Run(
            [RedisPubSubTrigger(Common.connectionStringSetting, "pubsubTest")] string message,
            ILogger logger)
        {
            logger.LogInformation(message);
        }
    }
}
```

This sample listens to any keyspace notifications for the key `keyspaceTest`.

```csharp

﻿using Microsoft.Extensions.Logging;

namespace Microsoft.Azure.WebJobs.Extensions.Redis.Samples.RedisPubSubTrigger
{
    internal class KeyspaceTrigger
    {
        [FunctionName(nameof(KeyspaceTrigger))]
        public static void Run(
            [RedisPubSubTrigger(Common.connectionStringSetting, "__keyspace@0__:keyspaceTest")] string message,
            ILogger logger)
        {
            logger.LogInformation(message);
        }
    }
}
```

This sample listens to any `keyevent` notifications for the delete command [`DEL`](https://redis.io/commands/del/).

```csharp
﻿using Microsoft.Extensions.Logging;

namespace Microsoft.Azure.WebJobs.Extensions.Redis.Samples.RedisPubSubTrigger
{
    internal class KeyeventTrigger
    {
        [FunctionName(nameof(KeyeventTrigger))]
        public static void Run(
            [RedisPubSubTrigger(Common.connectionStringSetting, "__keyevent@0__:del")] string message,
            ILogger logger)
        {
            logger.LogInformation($"Key '{message}' deleted.");
        }
    }
}
```

---

::: zone-end
::: zone pivot="programming-language-java"

This sample listens to the channel `pubsubTest`.

```java
package com.function.RedisPubSubTrigger;

import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.redis.annotation.*;

public class SimplePubSubTrigger {
    @FunctionName("SimplePubSubTrigger")
    public void run(
            @RedisPubSubTrigger(
                name = "req",
                connection = "redisConnectionString",
                channel = "pubsubTest")
                String message,
            final ExecutionContext context) {
            context.getLogger().info(message);
    }
}
```

This sample listens to any keyspace notifications for the key `myKey`.

```java
package com.function.RedisPubSubTrigger;

import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.redis.annotation.*;

public class KeyspaceTrigger {
    @FunctionName("KeyspaceTrigger")
    public void run(
            @RedisPubSubTrigger(
                name = "req",
                connection = "redisConnectionString",
                channel = "__keyspace@0__:keyspaceTest")
                String message,
            final ExecutionContext context) {
            context.getLogger().info(message);
    }
}
```

This sample listens to any `keyevent` notifications for the delete command [`DEL`](https://redis.io/commands/del/).

```java
package com.function.RedisPubSubTrigger;

import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.redis.annotation.*;

public class KeyeventTrigger {
    @FunctionName("KeyeventTrigger")
    public void run(
            @RedisPubSubTrigger(
                name = "req",
                connection = "redisConnectionString",
                channel = "__keyevent@0__:del")
                String message,
            final ExecutionContext context) {
            context.getLogger().info(message);
    }
}
```

::: zone-end
::: zone pivot="programming-language-javascript"

### [Model v3](#tab/node-v3)

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
      "connection": "redisConnectionString",
      "channel": "pubsubTest",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "index.js"
}
```

Here's binding data to listen to keyspace notifications for the key `keyspaceTest`.

```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connection": "redisConnectionString",
      "channel": "__keyspace@0__:keyspaceTest",
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
      "connection": "redisConnectionString",
      "channel": "__keyevent@0__:del",
      "name": "message",
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
      "connection": "redisConnectionString",
      "channel": "pubsubTest",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "run.ps1"
}
```

Here's binding data to listen to keyspace notifications for the key `keyspaceTest`.

```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connection": "redisConnectionString",
      "channel": "__keyspace@0__:keyspaceTest",
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
      "connection": "redisConnectionString",
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
      "connection": "redisConnectionString",
      "channel": "pubsubTest",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "__init__.py"
}
```

Here's binding data to listen to keyspace notifications for the key `keyspaceTest`.

```json
{
  "bindings": [
    {
      "type": "redisPubSubTrigger",
      "connection": "redisConnectionString",
      "channel": "__keyspace@0__:keyspaceTest",
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
      "connection": "redisConnectionString",
      "channel": "__keyevent@0__:del",
      "name": "message",
      "direction": "in"
    }
  ],
  "scriptFile": "__init__.py"
}
```

### [v2](#tab/python-v2)

<!--- Replace with the following when Python v2  is supported:
[!INCLUDE [functions-python-model-tabs-description](../../includes/functions-python-model-tabs-description.md)]  
-->
[!INCLUDE [functions-python-model-tabs-redis-preview](../../includes/functions-python-model-tabs-redis-preview.md)]

---

::: zone-end
::: zone pivot="programming-language-csharp"

## Attributes

| Parameter                 | Description                                                                                                                                   | Required   | Default    |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|:-----:| -----:|
| `Connection` | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...` |   Yes  |     |
| `Channel`                 | The pub sub channel that the trigger should listen to. Supports glob-style channel patterns. This field can be resolved using `INameResolver`.       |  Yes   |     |

::: zone-end
::: zone pivot="programming-language-java"

## Annotations

| Parameter                 | Description                                                                                                                                               | Required   | Default    |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|: -----:| -----:|
| `name`                    | Name of the variable holding the value returned by the function.                                                                                          |  Yes   |     |
| `connection` | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...`|  Yes   |     |
| `channel`                 | The pub sub channel that the trigger should listen to. Supports glob-style channel patterns.                                                               | Yes    |     |

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"

## Configuration

| function.json property    | Description                                                                                                                                               | Required   | Default    |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------| :-----:| -----:|
| `type`                    | Trigger type. For the pub sub trigger, the type is `redisPubSubTrigger`.                                                                                       |  Yes   |     |
| `connection` | The name of the [application setting](functions-how-to-use-azure-function-app-settings.md#settings) that contains the cache connection string, such as: `<cacheName>.redis.cache.windows.net:6380,password...`|  Yes   |     |
| `channel`                 | Name of the pub sub channel that is being subscribed to                                                                                                    |  Yes   |     |
| `name`                    | Name of the variable holding the value returned by the function.                                                                                          |  Yes   |     |
| `direction`               | Must be set to `in`.                                                                                                                                      |  Yes   |     |

::: zone-end

>[!IMPORTANT]
>The `connection` parameter does not hold the Redis cache connection string itself. Instead, it points to the name of the environment variable that holds the connection string. This makes the application more secure. For more information, see [Redis connection string](functions-bindings-cache.md#redis-connection-string).
>

## Usage

Redis features [publish/subscribe functionality](https://redis.io/docs/interact/pubsub/) that enables messages to be sent to Redis and broadcast to subscribers. The `RedisPubSubTrigger` enables Azure Functions to be triggered on pub/sub activity. The `RedisPubSubTrigger`subscribes to a specific channel pattern using [`PSUBSCRIBE`](https://redis.io/commands/psubscribe/), and surfaces messages received on those channels to the function.

### Prerequisites and limitations

- The `RedisPubSubTrigger` isn't capable of listening to [keyspace notifications](https://redis.io/docs/manual/keyspace-notifications/) on clustered caches.
- Basic tier functions don't support triggering on `keyspace` or `keyevent` notifications through the `RedisPubSubTrigger`.
- The `RedisPubSubTrigger` isn't supported on a [consumption plan](/azure/azure-functions/consumption-plan) because Redis PubSub requires clients to always be actively listening to receive all messages. For consumption plans, your function might miss certain messages published to the channel.
- Functions with the `RedisPubSubTrigger` shouldn't be scaled out to multiple instances. Each instance listens and processes each pub sub message, resulting in duplicate processing.

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

::: zone pivot="programming-language-csharp"

| Type | Description|
|---|---|
| `string` | The channel message serialized as JSON (UTF-8 encoded for byte types) in the format that follows. |
| `Custom`| The trigger uses Json.NET serialization to map the message from the channel into the given custom type. |

JSON string format

```json
{
  "SubscriptionChannel":"__keyspace@0__:*",
  "Channel":"__keyspace@0__:mykey",
  "Message":"set"
}

```

::: zone-end

::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python"

| Type | Description                                                                                                     |
|-------------|-----------------------------------------------------------------------------------------------------------------|
| `string`    | The channel message serialized as JSON (UTF-8 encoded for byte types) in the format that follows.                                                                           |
| `Custom`    | The trigger uses Json.NET serialization to map the message from the channel from a `string` into a custom type. |

```json
{
  "SubscriptionChannel":"__keyspace@0__:*",
  "Channel":"__keyspace@0__:mykey",
  "Message":"set"
}

```

::: zone-end

## Related content

- [Introduction to Azure Functions](functions-overview.md)
- [Tutorial: Get started with Azure Functions triggers in Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-functions-getting-started)
- [Tutorial: Create a write-behind cache by using Azure Functions and Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-write-behind)
- [Redis connection string](functions-bindings-cache.md#redis-connection-string)
- [Redis pub sub messages](https://redis.io/docs/latest/develop/interact/pubsub/)
