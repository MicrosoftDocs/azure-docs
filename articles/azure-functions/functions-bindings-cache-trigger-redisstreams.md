---
title: Using RedisStreamTrigger Azure Function (preview)
description: Learn how to use RedisStreamTrigger Azure Function
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 06/28/2023

---

# RedisStreamTrigger Azure Function (preview)

The `RedisStreamsTrigger` pops elements from a stream and surfaces those elements to the function.



| Tier     | Basic | Standard, Premium  | Enterprise, Enterprise Flash  |
|--------- |:---------:|:---------:|:---------:|
| Streams  | Yes  | Yes   |  Yes  |

> [!IMPORTANT]
> Redis triggers are not currently supported on consumption functions.
>

## Example

::: zone pivot="programming-language-csharp"

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]

### [In-process](#tab/in-process)

```csharp
[FunctionName(nameof(StreamsTrigger))]
public static void StreamsTrigger(
    [RedisStreamsTrigger(ConnectionString = "127.0.0.1:6379", Keys = "streamTest")] RedisMessageModel model,
    ILogger logger)
{
    logger.LogInformation(JsonSerializer.Serialize(model));
}
```


### [Isolated process](#tab/isolated-process)

```csharp
//TBD
```
---

::: zone-end
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

<!--Content and samples from the Java tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-javascript"

index.js

```javascript
module.exports = async function (context, entry) {
    context.log(entry);
}
```

function.js


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
  "scriptFile": "index.js"
}
```

<!--Content and samples from the JavaScript tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-powershell"

run.ps1


```powershell
param($entry, $TriggerMetadata)
Write-Host ($entry | ConvertTo-Json)
```

function.json

```powershell
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
  "scriptFile": "run.ps1"
}
```

<!--Content and samples from the PowerShell tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-python"

__init__.py

```python
import logging

def main(entry: str):
    logging.info(entry)
```

```json
function.json
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
<!--Content and samples from the Python tab in ##Examples go here.-->
::: zone-end
::: zone pivot="programming-language-csharp"

## Attributes

| Parameters                | Description                                                                                                                                              | Required | Default |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------:|
| `ConnectionStringSetting` | The name of the setting in the `appsettings` that contains cache connection string  For example: `<cacheName>.redis.cache.windows.net:6380,password=...` | Yes      |         |
| `Key`                     | Key to read from.                                                                                                                                        | Yes      |         |
| `PollingIntervalInMs`     | How often to poll the Redis server in milliseconds.                                                                                                      | Optional | `1000`  |
| `MessagesPerWorker`       | The number of messages each functions worker should process. Used to determine how many workers the function should scale to.                            | Optional | `100`   |
| `Count`                   | Number of elements to pull from Redis at one time.                                                                                                       | Optional | `10`    |
| `DeleteAfterProcess`      | Indicates if the function deletes the stream entries after processing.                                                                                   | Optional | `false` |

::: zone-end
::: zone pivot="programming-language-java"

## Annotations

| Parameter                 | Description                                                                                                                                              | Required | Default |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------:|
| `name`                    | `entry`                                                                                                                                                  |  Yes     |         |
| `connectionStringSetting` | The name of the setting in the `appsettings` that contains cache connection string  For example: `<cacheName>.redis.cache.windows.net:6380,password=...` | Yes      |         |
| `key`                     | Key to read from.                                                                                                                                        | Yes      |         |
| `pollingIntervalInMs`     | How frequently to poll Redis, in milliseconds.                                                                                                           | Optional | `1000`  |
| `messagesPerWorker`       | The number of messages each functions worker should process. It is used to determine how many workers the function should scale to                       | Optional | `100`   |
| `count`                   | Number of entries to read from Redis at one time. These are processed in parallel.                                                                       | Optional | `10`    |
| `deleteAfterProcess`      | Whether to delete the stream entries after the function has run.                                                                                         | Optional | `false` |



<!-- Equivalent values for the annotation parameters in Java.-->
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"

## Configuration

The following table explains the binding configuration properties that you set in the function.json file.

| function.json Properties  | Description                                                                                                                                              | Required | Default |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------:|
| `type`                    |                                                                                                                                                          | Yes      |         |
| `deleteAfterProcess`      |                                                                                                                                                          | Optional | `false` |
| `connectionStringSetting` | The name of the setting in the `appsettings` that contains cache connection string  For example: `<cacheName>.redis.cache.windows.net:6380,password=...` | Yes      |         |
| `key`                     | The key to read from.                                                                                                                                    | Yes      |         |
| `pollingIntervalInMs`     | How often to poll Redis in milliseconds.                                                                                                                 | Optional | `1000`  |
| `messagesPerWorker`       | (optional) The number of messages each functions worker should process. Used to determine how many workers the function should scale                     | Optional | `100`   |
| `count`                   | Number of entries to read from Redis at one time. These are processed in parallel.                                                                       | Optional | `10`    |
| `name`                    |                                                                                                                                                          | Yes      |         |
| `direction`               |                                                                                                                                                          | Yes      |         |

::: zone-end

See the Example section for complete examples.

## Output

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python"

| Output Type                                                                                                                                           | Description                                                                                                                                                                             |
|-------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`StackExchange.Redis.ChannelMessage`](https://github.com/StackExchange/StackExchange.Redis/blob/main/src/StackExchange.Redis/ChannelMessageQueue.cs) | The value returned by `StackExchange.Redis`.                                                                                                                                            |
| `StackExchange.Redis.NameValueEntry`[], `Dictionary<string, string>`                                                                                  | The values contained within the entry.                                                                                                                                                  |
| string, byte[], ReadOnlyMemory<byte>                                                                                                                  | The stream entry serialized as JSON (UTF-8 encoded for byte types) in the following format: `{"Id":"1658354934941-0","Values":{"field1":"value1","field2":"value2","field3":"value3"}}` |
| `Custom`                                                                                                                                              | The trigger uses Json.NET serialization to map the message from the channel from a `string` into a custom type.                                                                         |

::: zone-end


## Usage

The `RedisStreamTrigger` Azure function reads entries from a stream and surfaces those entries to the function. 

The trigger polls Redis at a configurable fixed interval, and uses [`XREADGROUP`](https://redis.io/commands/xreadgroup/) to read elements from the stream.

The consumer group for all function instances is the `ID` of the function. For example, `Microsoft.Azure.WebJobs.Extensions.Redis.Samples.RedisSamples.StreamTrigger`  for the `StreamTrigger` sample. Each function creates a new random GUID to use as its consumer name within the group to ensure that scaled out instances of the function don't read the same messages from the stream.

### Output

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python"

| Output Type                                                                                                                                           | Description                                                                                                                                                                             |
|-------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`StackExchange.Redis.ChannelMessage`](https://github.com/StackExchange/StackExchange.Redis/blob/main/src/StackExchange.Redis/ChannelMessageQueue.cs) | The value returned by `StackExchange.Redis`.                                                                                                                                            |
| `StackExchange.Redis.NameValueEntry`[], `Dictionary<string, string>`                                                                                  | The values contained within the entry.                                                                                                                                                  |
| string, byte[], ReadOnlyMemory<byte>                                                                                                                  | The stream entry serialized as JSON (UTF-8 encoded for byte types) in the following format: `{"Id":"1658354934941-0","Values":{"field1":"value1","field2":"value2","field3":"value3"}}` |
| `Custom`                                                                                                                                              | The trigger uses Json.NET serialization to map the message from the channel from a `string` into a custom type.                                                                         |

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
::: zone pivot="programming-language-python"

<!-- TBD -->

<!--Any usage information from the Python tab in ## Usage. -->
::: zone-end

## Next steps

- [Introduction to Azure Functions](functions-overview.md)
- [Get started with Azure Functions triggers in Azure Cache for Redis](/azure/azure-cache-for-redis/cache-tutorial-functions-getting-started)
- [Using Azure Functions and Azure Cache for Redis to create a write-behind cache](/azure/azure-cache-for-redis/cache-tutorial-write-behind)
- [Redis streams](https://redis.io/docs/data-types/streams/)
