
# Serverless Event-based Architectures with Azure Cache for Redis and Azure Functions (Preview)

This article describes how to use Azure Cache for Redis with [Azure Functions](../azure-functions/functions-overview.md) to create optimized serverless and event-driven architectures.
Azure Cache for Redis can be used as a [trigger](../azure-functions/functions-triggers-bindings.md) for Azure Functions, allowing Redis to initiate a serverless workflow.
This functionality can be highly useful in data architectures like a [write-behind cache](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-caching/#types-of-caching), or any [event-based architectures](../architecture/guide/architecture-styles/event-driven.md).

There are three triggers supported in Azure Cache for Redis:
- `RedisPubSubTrigger` triggers on [Redis pubsub messages](https://redis.io/docs/manual/pubsub/)
- `RedisListTrigger` triggers on [Redis lists](https://redis.io/docs/data-types/lists/)
- `RedisStreamTrigger` triggers on [Redis streams](https://redis.io/docs/data-types/streams/)

[Keyspace notifications](https://redis.io/docs/manual/keyspace-notifications/) can also be used as triggers through `RedisPubSubTrigger`. 

## Scope of Availability for Functions Triggers

|Tier     | Basic | Standard & Premium  | Enterprise, Enterprise Flash  |
|---------|---------|---------|---------|
|Pub/Sub  | Yes  | Yes  |  Yes  |
|Lists | Yes  | Yes   |  Yes  |
|Streams | Yes  | Yes  |  Yes  |

> [!IMPORTANT]
> The Pub/Sub trigger is not supported with consumption functions.
>

## Triggering on keyspace notifications

Redis offers a built-in concept called [keyspace notifications](https://redis.io/docs/manual/keyspace-notifications/). When enabled, this feature publishes notifications of a wide range of cache actions to a dedicated pub/sub channel. Supported actions include actions that affect specific keys, called _keyspace notifications_, and specific commands, called _keyevent notifications_. A huge range of Redis actions are supported, such as `SET`, `DEL`, and `EXPIRE`. The full list can be found in the [keyspace notification documentation](https://redis.io/docs/manual/keyspace-notifications/). 

Keyspace and keyevent notifications are published with the following syntax:

```
PUBLISH __keyspace@0__:<affectedKey> <command>
PUBLISH __keyevent@0__:<affectedCommand> <key>
```

Because these events are published on pub/sub channels, the `RedisPubSubTrigger` is able to pick them up. See the [RedisPubSubTrigger](#redispubsubtrigger) section for more examples.

> [!IMPORTANT]
> In Azure Cache for Redis, keyspace events must be enabled before notifications are published. See [Advanced Settings](cache-configure.md#keyspace-notifications-advanced-settings) for more information.


## How to get started
See [Azure Cache for Redis trigger for Azure Functions overview (preview)]() for information on how to install the Functions extension.
See [Get started with Functions triggers in Azure Cache for Redis](cache-tutorial-functions-getting-started.md) for a step-by-step tutorial on how to get started.

## Prerequisites and limitations

- The `RedisPubSubTrigger` is not capable of listening to [keyspace notifications](https://redis.io/docs/manual/keyspace-notifications/) on clustered caches.
- Basic tier functions do not support triggering on keyspace or keyevent notifications through the `RedisPubSubTrigger`.
- The `RedisPubSubTrigger` is not supported with consumption functions.

## Trigger usage

### `RedisPubSubTrigger`
The `RedisPubSubTrigger` subscribes to a specific channel pattern using [`PSUBSCRIBE`](https://redis.io/commands/psubscribe/), and surfaces messages received on those channels to the function.

> [!WARNING]
> This trigger is not supported on a [consumption plan](../azure-functions/consumption-plan) because Redis PubSub requires clients to always be actively listening to receive all messages.For consumption plans, there is a chance your function may miss certain messages published to the channel. 
>

> [!NOTE]
> Functions with the `RedisPubSubTrigger` should not be scaled out to multiple instances.
> Each instance will listen and process each pubsub message, resulting in duplicate processing.

#### Inputs
- `ConnectionString`: connection string to the redis cache (eg `<cacheName>.redis.cache.windows.net:6380,password=...`).
- `Channel`: name of the pubsub channel that the trigger should listen to.

This sample listens to the channel "channel" at a localhost Redis instance at "127.0.0.1:6379"
#### [C#](#tab/Csharp)

```c#
[FunctionName(nameof(PubSubTrigger))]
public static void PubSubTrigger(
    [RedisPubSubTrigger(ConnectionString = "127.0.0.1:6379", Channel = "channel")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```
#### [Java](#tab/Java)

```java
TBD!
```
#### [JavaScript](#tab/JavaScript)

```javascript
TBD!
```
#### [Python](#tab/Python)

```python
TBD!
```
#### [PowerShell](#tab/Powershell)

```powershell
TBD!
```
---

This sample listens to any keyspace notifications for the key `myKey` in a localhost Redis instance at "127.0.0.1:6379.

#### [C#](#tab/Csharp)

```c#
[FunctionName(nameof(PubSubTrigger))]
public static void PubSubTrigger(
    [RedisPubSubTrigger(ConnectionString = "127.0.0.1:6379", Channel = "__keyspace@0__:myKey")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```
#### [Java](#tab/Java)

```java
TBD!
```
#### [JavaScript](#tab/JavaScript)

```javascript
TBD!
```
#### [Python](#tab/Python)

```python
TBD!
```
#### [PowerShell](#tab/Powershell)

```powershell
TBD!
```
---

This sample listens to any keyevent notifications for the delete command [`DEL`](https://redis.io/commands/del/) in a localhost Redis instance at "127.0.0.1:6379.

#### [C#](#tab/Csharp)

```c#
[FunctionName(nameof(PubSubTrigger))]
public static void PubSubTrigger(
    [RedisPubSubTrigger(ConnectionString = "127.0.0.1:6379", Channel = "__keyevent@0__:del")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```
#### [Java](#tab/Java)

```java
TBD!
```
#### [JavaScript](#tab/JavaScript)

```javascript
TBD!
```
#### [Python](#tab/Python)

```python
TBD!
```
#### [PowerShell](#tab/Powershell)

```powershell
TBD!
```
---


### `RedisListsTrigger`

The `RedisListsTrigger` pops elements from a list and surfaces those elements to the function. The trigger polls Redis at a configurable fixed interval, and uses [`LPOP`](https://redis.io/commands/lpop/)/[`RPOP`](https://redis.io/commands/rpop/)/[`LMPOP`](https://redis.io/commands/lmpop/) to pop elements from the lists.

#### Inputs
- `ConnectionString`: connection string to the redis cache (eg `<cacheName>.redis.cache.windows.net:6380,password=...`).
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

#### [C#](#tab/Csharp)
The following sample polls the key "listTest" at a localhost Redis instance at "127.0.0.1:6379"
```c#
[FunctionName(nameof(ListsTrigger))]
public static void ListsTrigger(
    [RedisListsTrigger(ConnectionString = "127.0.0.1:6379", Keys = "listTest")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```

#### [Java](#tab/Java)
The following sample polls the key "listTest" at a localhost Redis instance at "127.0.0.1:6379"

```java
TBD
```

#### [JavaScript](#tab/JavaScript)
The following sample polls the key "listTest" at a localhost Redis instance at "127.0.0.1:6379"

```javascript
Coming Soon
```
#### [Python](#tab/Python)
The following sample polls the key "listTest" at a localhost Redis instance at "127.0.0.1:6379"

```python
Coming soon
```
#### [PowerShell](#tab/Powershell)
The following sample polls the key "listTest" at a localhost Redis instance at "127.0.0.1:6379"

```powershell
Coming Soon
```
---

### `RedisStreamsTrigger`

The `RedisStreamsTrigger` pops elements from a stream and surfaces those elements to the function.
The trigger polls Redis at a configurable fixed interval, and uses [`XREADGROUP`](https://redis.io/commands/xreadgroup/) to read elements from the stream.
Each function creates a new random GUID to use as its consumer name within the group to ensure that scaled out instances of the function will not read the same messages from the stream.

#### Inputs

- `ConnectionString`: connection string to the redis cache (eg `<cacheName>.redis.cache.windows.net:6380,password=...`).
- `Keys`: Keys to read from, space-delimited.
  - Uses [`XREADGROUP`](https://redis.io/commands/xreadgroup/).
- (optional) `PollingIntervalInMs`: How often to poll Redis in milliseconds.
  - Default: 1000
- (optional) `MessagesPerWorker`: How many messages each functions worker "should" process. Used to determine how many workers the function should scale to.
  - Default: 100
- (optional) `BatchSize`: Number of elements to pull from Redis at one time.
  - Default: 10
- (optional) `ConsumerGroup`: The name of the consumer group that the function will use.
  - Default: "AzureFunctionRedisExtension"
- (optional) `DeleteAfterProcess`: If the listener will delete the stream entries after the function runs.
  - Default: false

#### [C#](#tab/Csharp)

The following sample polls the key "streamTest" at a localhost Redis instance at "127.0.0.1:6379"
```c#
[FunctionName(nameof(StreamsTrigger))]
public static void StreamsTrigger(
    [RedisStreamsTrigger(ConnectionString = "127.0.0.1:6379", Keys = "streamTest")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```

#### [Java](#tab/Java)

The following sample polls the key "streamTest" at a localhost Redis instance at "127.0.0.1:6379"
```java
Coming Soon
```
#### [JavaScript](#tab/JavaScript)

The following sample polls the key "streamTest" at a localhost Redis instance at "127.0.0.1:6379"

```javascsript
Coming Soon
```
#### [Python](#tab/Python)

The following sample polls the key "streamTest" at a localhost Redis instance at "127.0.0.1:6379"

```python
Coming Soon
```
#### [PowerShell](#tab/Powershell)

The following sample polls the key "streamTest" at a localhost Redis instance at "127.0.0.1:6379"

```powershell
coming soon
```
---

## Return Values

All triggers return a [`RedisMessageModel`](./src/Models/RedisMessageModel.cs) object that has two fields:

#### [C#](#tab/Csharp)
```c#
namespace Microsoft.Azure.WebJobs.Extensions.Redis
{
  public class RedisMessageModel
  {
    public string Trigger { get; set; }
    public string Message { get; set; }
  }
}
```
#### [Java](#tab/Java)
The following sample polls the key "listTest" at a localhost Redis instance at "127.0.0.1:6379"

```java
TBD
```

#### [JavaScript](#tab/JavaScript)
The following sample polls the key "listTest" at a localhost Redis instance at "127.0.0.1:6379"

```javascript
Coming Soon
```
#### [Python](#tab/Python)
The following sample polls the key "listTest" at a localhost Redis instance at "127.0.0.1:6379"

```python
Coming soon
```
#### [PowerShell](#tab/Powershell)
The following sample polls the key "listTest" at a localhost Redis instance at "127.0.0.1:6379"

```powershell
Coming Soon
```
---
- `Trigger`: The pubsub channel, list key, or stream key that the function is listening to.
- `Message`: The pubsub message, list element, or stream element.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Get started with Functions triggers in Azure Cache for Redis](cache-tutorial-functions-getting-started.md)
