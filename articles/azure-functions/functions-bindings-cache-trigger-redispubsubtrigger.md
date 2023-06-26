---
title: Using RedisPubSubTrigger Azure Function
description: Learn how to use RedisPubSubTrigger Azure Function
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 06/14/2023

---

# RedisPubSubTrigger Azure Function

The `RedisPubSubTrigger` subscribes to a specific channel pattern using [`PSUBSCRIBE`](https://redis.io/commands/psubscribe/), and surfaces messages received on those channels to the function.

> [!WARNING]
> This trigger isn't supported on a [consumption plan](/azure/azure-functions/consumption-plan) because Redis PubSub requires clients to always be actively listening to receive all messages. For consumption plans, your function might miss certain messages published to the channel.
>

> [!NOTE]
> Functions with the `RedisPubSubTrigger` should not be scaled out to multiple instances.
> Each instance listens and processes each pubsub message, resulting in duplicate processing.

## Example

- `ConnectionString`: connection string to the redis cache (for example, `<cacheName>.redis.cache.windows.net:6380,password=...`).
- `Channel`: name of the pubsub channel that the trigger should listen to.

This sample listens to the channel "channel" at a localhost Redis instance at `127.0.0.1:6379`
::: zone pivot="programming-language-csharp"

[!INCLUDE functions-bindings-csharp-intro]

```csharp
[FunctionName(nameof(PubSubTrigger))]
public static void PubSubTrigger(
    [RedisPubSubTrigger(ConnectionString = "127.0.0.1:6379", Channel = "channel")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```

::: zone-end

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
<!--Content and samples from the Java tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-javascript"

<!--Content and samples from the JavaScript tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-powershell"

<!--Content and samples from the PowerShell tab in ##Examples go here.-->
::: zone-end
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
<!--Content and samples from the Python tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-csharp"

## Attributes

Both in-process and isolated process C# libraries use the <!--attribute API here--> attribute to define the function. C# script instead uses a function.json configuration file.

<!-- If the attribute's constructor takes parameters, you'll need to include a table like this, where the values are from the original table in the Configuration section: The attribute's constructor takes the following parameters: |Parameter | Description| |---------|----------------------| |**Parameter1** |Description 1| |**Parameter2** | Description 2| -->

## Annotations
<!-- Equivalent values for the annotation parameters in Java.-->
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"

## Configuration

The following table explains the binding configuration properties that you set in the function.json file.

<!-- this get more complex when you support the Python v2 model. --> <!-- suggestion |function.json property |Description| |---------|---------| | **type** | Required - must be set to `eventGridTrigger`. | | **direction** | Required - must be set to `in`. | | **name** | Required - the variable name used in function code for the parameter that receives the event data. | -->
::: zone-end

## Example 2

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

::: zone-end
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
<!--Any usage information from the Java tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell"

<!--Any usage information from the JavaScript tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-powershell"

<!--Any usage information from the PowerShell tab in ## Usage. -->
::: zone-end
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
<!--Any usage information from the Python tab in ## Usage. -->
::: zone-end

## Example 3

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

::: zone pivot="programming-language-csharp"
The parameter type supported by the XXX trigger depends on the Functions runtime version and the C# modality used.

::: zone-end

<!--Any of the below pivots can be combined if the usage info is identical.-->
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

<!--Any usage information from the Java tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell"

<!--Any usage information from the JavaScript tab in ## Usage. -->
::: zone-end
::: zone pivot="programming-language-powershell"

<!--Any usage information from the PowerShell tab in ## Usage. -->
::: zone-end
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
<!--Any usage information from the Python tab in ## Usage. -->
::: zone-end

## Extra sections

<!--Put any sections with content that doesn't fit into the above section headings down here. -->
host.json settings
<!-- Some bindings don't have this section. If yours doesn't, please remove this section. -->

Next steps
<!--At least one next step link.-->