---
title: Timer trigger for Azure Functions
description: Understand how to use timer triggers in Azure Functions.
ms.assetid: d2f013d1-f458-42ae-baf8-1810138118ac
ms.topic: reference
ms.date: 03/06/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, devx-track-python, devx-track-extended-java, devx-track-js
zone_pivot_groups: programming-languages-set-functions
---

# Timer trigger for Azure Functions

This article explains how to work with timer triggers in Azure Functions. A timer trigger lets you run a function on a schedule.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

For information on how to manually run a timer-triggered function, see [Manually run a non HTTP-triggered function](./functions-manually-run-non-http.md).

[!INCLUDE [functions-package-auto](../../includes/functions-package-auto.md)]

Source code for the timer extension package is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Timers/) GitHub repository.

::: zone pivot="programming-language-javascript,programming-language-typescript"
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
::: zone-end
::: zone pivot="programming-language-python"
Azure Functions supports two programming models for Python. The way that you define your bindings depends on your chosen programming model.

# [v2](#tab/python-v2)
The Python v2 programming model lets you define bindings using decorators directly in your Python function code. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-decorators#programming-model).

# [v1](#tab/python-v1)
The Python v1 programming model requires you to define bindings in a separate *function.json* file in the function folder. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-configuration#programming-model).

---

This article supports both programming models.

::: zone-end

## Example

::: zone pivot="programming-language-csharp"

This example shows a C# function that executes each time the minutes have a value divisible by five. For example, when the function starts at 18:55:00, the next execution is at 19:00:00. A `TimerInfo` object is passed to the function.

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [Isolated worker model](#tab/isolated-process)

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Timer/TimerFunction.cs" range="11-17":::

# [In-process model](#tab/in-process)

```csharp
[FunctionName("TimerTriggerCSharp")]
public static void Run([TimerTrigger("0 */5 * * * *")]TimerInfo myTimer, ILogger log)
{
    if (myTimer.IsPastDue)
    {
        log.LogInformation("Timer is running late!");
    }
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
}
```

---

::: zone-end
::: zone pivot="programming-language-java"

The following example function triggers and executes every five minutes. The `@TimerTrigger` annotation on the function defines the schedule using the same string format as [CRON expressions](https://en.wikipedia.org/wiki/Cron#CRON_expression).

```java
@FunctionName("keepAlive")
public void keepAlive(
  @TimerTrigger(name = "keepAliveTrigger", schedule = "0 */5 * * * *") String timerInfo,
      ExecutionContext context
 ) {
     // timeInfo is a JSON string, you can deserialize it to an object using your favorite JSON library
     context.getLogger().info("Timer is triggered: " + timerInfo);
}
```

::: zone-end  
::: zone pivot="programming-language-python"  

The following example shows a timer trigger binding and function code that uses the binding, where an instance representing the timer is passed to the function. The function writes a log indicating whether this function invocation is due to a missed schedule occurrence. The example depends on whether you use the [v1 or v2 Python programming model](functions-reference-python.md).

# [v2](#tab/python-v2)

```python
import datetime
import logging
import azure.functions as func

app = func.FunctionApp()

@app.function_name(name="mytimer")
@app.schedule(schedule="0 */5 * * * *", 
              arg_name="mytimer",
              run_on_startup=True) 
def test_function(mytimer: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()
    if mytimer.past_due:
        logging.info('The timer is past due!')
    logging.info('Python timer trigger function ran at %s', utc_timestamp)
```

# [v1](#tab/python-v1)

Here's the binding data in the *function.json* file:

```json
{
    "schedule": "0 */5 * * * *",
    "name": "myTimer",
    "type": "timerTrigger",
    "direction": "in"
}
```

Here's the Python code, where the object passed into the function is of type [azure.functions.TimerRequest object](/python/api/azure-functions/azure.functions.timerrequest).

```python
import datetime
import logging

import azure.functions as func


def main(mytimer: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()

    if mytimer.past_due:
        logging.info('The timer is past due!')

    logging.info('Python timer trigger function ran at %s', utc_timestamp)
```

---

::: zone-end  
::: zone pivot="programming-language-typescript"  

The following example shows a timer trigger [TypeScript function](functions-reference-node.md?tabs=typescript).

# [Model v4](#tab/nodejs-v4)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/timerTrigger1.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

::: zone-end  
::: zone pivot="programming-language-javascript"  

The following example shows a timer trigger [JavaScript function](functions-reference-node.md).

# [Model v4](#tab/nodejs-v4)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/timerTrigger1.js" :::

# [Model v3](#tab/nodejs-v3)

Here's the binding data in the *function.json* file:

```json
{
    "schedule": "0 */5 * * * *",
    "name": "myTimer",
    "type": "timerTrigger",
    "direction": "in"
}
```

Here's the JavaScript code:

```JavaScript
module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    if (myTimer.isPastDue)
    {
        context.log('Node is running late!');
    }
    context.log('Node timer trigger function ran!', timeStamp);   
};
```

---

::: zone-end  
::: zone pivot="programming-language-powershell"  

Here's the binding data in the *function.json* file:

```json
{
    "schedule": "0 */5 * * * *",
    "name": "myTimer",
    "type": "timerTrigger",
    "direction": "in"
}
```

The following is the timer function code in the run.ps1 file:

```powershell
# Input bindings are passed in via param block.
param($myTimer)

# Get the current universal time in the default string format.
$currentUTCtime = (Get-Date).ToUniversalTime()

# The 'IsPastDue' property is 'true' when the current function invocation is later than scheduled.
if ($myTimer.IsPastDue) {
    Write-Host "PowerShell timer is running late!"
}

# Write an information log with the current time.
Write-Host "PowerShell timer trigger function ran! TIME: $currentUTCtime"
```

::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes

[In-process](functions-dotnet-class-library.md) C# library uses [TimerTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Timers/TimerTriggerAttribute.cs) from [Microsoft.Azure.WebJobs.Extensions](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions) whereas [isolated worker process](dotnet-isolated-process-guide.md) C# library uses [TimerTriggerAttribute](https://github.com/Azure/azure-functions-dotnet-worker/blob/main/extensions/Worker.Extensions.Timer/src/TimerTriggerAttribute.cs) from [Microsoft.Azure.Functions.Worker.Extensions.Timer](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Timer) to define the function. C# script instead uses a [function.json configuration file](#configuration).

# [Isolated worker model](#tab/isolated-process)

|Attribute property | Description|
|---------|----------------------|
|**Schedule**| A [CRON expression](#ncrontab-expressions) or a [TimeSpan](#timespan) value. A `TimeSpan` can be used only for a function app that runs on an App Service Plan. You can put the schedule expression in an app setting and set this property to the app setting name wrapped in **%** signs, as `%ScheduleAppSetting%`. |
|**RunOnStartup**| If `true`, the function is invoked when the runtime starts. For example, the runtime starts when the function app wakes up after going idle due to inactivity. when the function app restarts due to function changes, and when the function app scales out. *Use with caution.* **RunOnStartup** should rarely if ever be set to `true`, especially in production. |
|**UseMonitor**| Set to `true` or `false` to indicate whether the schedule should be monitored. Schedule monitoring persists schedule occurrences to aid in ensuring the schedule is maintained correctly even when function app instances restart. If not set explicitly, the default is `true` for schedules that have a recurrence interval greater than or equal to 1 minute. For schedules that trigger more than once per minute, the default is `false`. |

# [In-process model](#tab/in-process)

|Attribute property | Description|
|---------|----------------------|
|**Schedule**| A [CRON expression](#ncrontab-expressions) or a [TimeSpan](#timespan) value. A `TimeSpan` can be used only for a function app that runs on an App Service Plan. You can put the schedule expression in an app setting and set this property to the app setting name wrapped in **%** signs, as `%ScheduleAppSetting%`. |
|**RunOnStartup**| If `true`, the function is invoked when the runtime starts. For example, the runtime starts when the function app wakes up after going idle due to inactivity. when the function app restarts due to function changes, and when the function app scales out. *Use with caution.* **RunOnStartup** should rarely if ever be set to `true`, especially in production. |
|**UseMonitor**| Set to `true` or `false` to indicate whether the schedule should be monitored. Schedule monitoring persists schedule occurrences to aid in ensuring the schedule is maintained correctly even when function app instances restart. If not set explicitly, the default is `true` for schedules that have a recurrence interval greater than or equal to 1 minute. For schedules that trigger more than once per minute, the default is `false`. |

---

::: zone-end  

::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

For Python v2 functions defined using a decorator, the following properties on the `schedule`:

| Property    | Description |
|-------------|-----------------------------|
| `arg_name` | The name of the variable that represents the timer object in function code. |
| `schedule` | A [CRON expression](#ncrontab-expressions) or a [TimeSpan](#timespan) value. A `TimeSpan` can be used only for a function app that runs on an App Service Plan. You can put the schedule expression in an app setting and set this property to the app setting name wrapped in **%** signs, as in this example: "%ScheduleAppSetting%".  |
| `run_on_startup` | If `true`, the function is invoked when the runtime starts. For example, the runtime starts when the function app wakes up after going idle due to inactivity. when the function app restarts due to function changes, and when the function app scales out. *Use with caution.* **runOnStartup** should rarely if ever be set to `true`, especially in production. |
| `use_monitor` | Set to `true` or `false` to indicate whether the schedule should be monitored. Schedule monitoring persists schedule occurrences to aid in ensuring the schedule is maintained correctly even when function app instances restart. If not set explicitly, the default is `true` for schedules that have a recurrence interval greater than or equal to 1 minute. For schedules that trigger more than once per minute, the default is `false`. |

For Python functions defined by using *function.json*, see the [Configuration](#configuration) section.
::: zone-end

::: zone pivot="programming-language-java"  
## Annotations

The `@TimerTrigger` annotation on the function defines the `schedule` using the same string format as [CRON expressions](https://en.wikipedia.org/wiki/Cron#CRON_expression). The annotation supports the following settings:

+ [dataType](/java/api/com.microsoft.azure.functions.annotation.timertrigger.datatype)
+ [name](/java/api/com.microsoft.azure.functions.annotation.timertrigger.name)
+ [schedule](/java/api/com.microsoft.azure.functions.annotation.timertrigger.schedule)

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python" 
 
## Configuration
::: zone-end

::: zone pivot="programming-language-python" 
_Applies only to the Python v1 programming model._

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

The following table explains the properties that you can set on the `options` object passed to the `app.timer()` method.

| Property | Description |
|---------|----------------------|
|**schedule**| A [CRON expression](#ncrontab-expressions) or a [TimeSpan](#timespan) value. A `TimeSpan` can be used only for a function app that runs on an App Service Plan. You can put the schedule expression in an app setting and set this property to the app setting name wrapped in **%** signs, as in this example: "%ScheduleAppSetting%". |
|**runOnStartup**| If `true`, the function is invoked when the runtime starts. For example, the runtime starts when the function app wakes up after going idle due to inactivity. when the function app restarts due to function changes, and when the function app scales out. *Use with caution.* **runOnStartup** should rarely if ever be set to `true`, especially in production. |
|**useMonitor**| Set to `true` or `false` to indicate whether the schedule should be monitored. Schedule monitoring persists schedule occurrences to aid in ensuring the schedule is maintained correctly even when function app instances restart. If not set explicitly, the default is `true` for schedules that have a recurrence interval greater than or equal to 1 minute. For schedules that trigger more than once per minute, the default is `false`. |

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the *function.json* file.

| Property | Description |
|---------|----------------------|
|**type** | Must be set to "timerTrigger". This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | Must be set to "in". This property is set automatically when you create the trigger in the Azure portal. |
|**name** | The name of the variable that represents the timer object in function code. | 
|**schedule**| A [CRON expression](#ncrontab-expressions) or a [TimeSpan](#timespan) value. A `TimeSpan` can be used only for a function app that runs on an App Service Plan. You can put the schedule expression in an app setting and set this property to the app setting name wrapped in **%** signs, as in this example: "%ScheduleAppSetting%". |
|**runOnStartup**| If `true`, the function is invoked when the runtime starts. For example, the runtime starts when the function app wakes up after going idle due to inactivity. when the function app restarts due to function changes, and when the function app scales out. *Use with caution.* **runOnStartup** should rarely if ever be set to `true`, especially in production. |
|**useMonitor**| Set to `true` or `false` to indicate whether the schedule should be monitored. Schedule monitoring persists schedule occurrences to aid in ensuring the schedule is maintained correctly even when function app instances restart. If not set explicitly, the default is `true` for schedules that have a recurrence interval greater than or equal to 1 minute. For schedules that trigger more than once per minute, the default is `false`. |

---

::: zone-end  
::: zone pivot="programming-language-powershell,programming-language-python"  


The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to "timerTrigger". This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | Must be set to "in". This property is set automatically when you create the trigger in the Azure portal. |
|**name** | The name of the variable that represents the timer object in function code. | 
|**schedule**| A [CRON expression](#ncrontab-expressions) or a [TimeSpan](#timespan) value. A `TimeSpan` can be used only for a function app that runs on an App Service Plan. You can put the schedule expression in an app setting and set this property to the app setting name wrapped in **%** signs, as in this example: "%ScheduleAppSetting%". |
|**runOnStartup**| If `true`, the function is invoked when the runtime starts. For example, the runtime starts when the function app wakes up after going idle due to inactivity. when the function app restarts due to function changes, and when the function app scales out. *Use with caution.* **runOnStartup** should rarely if ever be set to `true`, especially in production. |
|**useMonitor**| Set to `true` or `false` to indicate whether the schedule should be monitored. Schedule monitoring persists schedule occurrences to aid in ensuring the schedule is maintained correctly even when function app instances restart. If not set explicitly, the default is `true` for schedules that have a recurrence interval greater than or equal to 1 minute. For schedules that trigger more than once per minute, the default is `false`. |

<!--The following Include and Caution are from the original file and I wasn't sure if these need to be here-->

::: zone-end  

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

> [!CAUTION]
> Don't set **runOnStartup** to `true` in production. Using this setting makes code execute at highly unpredictable times. In certain production settings, these extra executions can result in significantly higher costs for apps hosted in a Consumption plan. For example, with **runOnStartup** enabled the trigger is invoked whenever your function app is scaled. Make sure you fully understand the production behavior of your functions before enabling **runOnStartup** in production.

See the [Example section](#example) for complete examples.

## Usage

When a timer trigger function is invoked, a timer object is passed into the function. The following JSON is an example representation of the timer object.

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-powershell,programming-language-python"
```json
{
    "Schedule":{
        "AdjustForDST": true
    },
    "ScheduleStatus": {
        "Last":"2016-10-04T10:15:00+00:00",
        "LastUpdated":"2016-10-04T10:16:00+00:00",
        "Next":"2016-10-04T10:20:00+00:00"
    },
    "IsPastDue":false
}
```
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"
```json
{
    "schedule":{
        "adjustForDST": true
    },
    "scheduleStatus": {
        "last":"2016-10-04T10:15:00+00:00",
        "lastUpdated":"2016-10-04T10:16:00+00:00",
        "next":"2016-10-04T10:20:00+00:00"
    },
    "isPastDue":false
}
```
::: zone-end  

The `isPastDue` property is `true` when the current function invocation is later than scheduled. For example, a function app restart might cause an invocation to be missed.

### NCRONTAB expressions

Azure Functions uses the [NCronTab](https://github.com/atifaziz/NCrontab) library to interpret NCRONTAB expressions. An NCRONTAB expression is similar to a CRON expression except that it includes an additional sixth field at the beginning to use for time precision in seconds:

`{second} {minute} {hour} {day} {month} {day-of-week}`

Each field can have one of the following types of values:

|Type  |Example  |When triggered  |
|---------|---------|---------|
|A specific value |<nobr>`0 5 * * * *`</nobr>| Once every hour of the day at minute 5 of each hour |
|All values (`*`)|<nobr>`0 * 5 * * *`</nobr>| At every minute in the hour, during hour 5 |
|A range (`-` operator)|<nobr>`5-7 * * * * *`</nobr>| Three times a minute - at seconds 5 through 7 during every minute of every hour of each day |
|A set of values (`,` operator)|<nobr>`5,8,10 * * * * *`</nobr>| Three times a minute - at seconds 5, 8, and 10 during every minute of every hour of each day |
|An interval value (`/` operator)|<nobr>`0 */5 * * * *`</nobr>| 12 times an hour - at second 0 of every 5th minute of every hour of each day |

[!INCLUDE [functions-cron-expressions-months-days](../../includes/functions-cron-expressions-months-days.md)]

#### NCRONTAB examples

Here are some examples of NCRONTAB expressions you can use for the timer trigger in Azure Functions.

| Example            | When triggered                     |
|--------------------|------------------------------------|
| `0 */5 * * * *`    | once every five minutes            |
| `0 0 * * * *`      | once at the top of every hour      |
| `0 0 */2 * * *`    | once every two hours               |
| `0 0 9-17 * * *`   | once every hour from 9 AM to 5 PM  |
| `0 30 9 * * *`     | at 9:30 AM every day               |
| `0 30 9 * * 1-5`   | at 9:30 AM every weekday           |
| `0 30 9 * Jan Mon` | at 9:30 AM every Monday in January |

> [!NOTE]
> NCRONTAB expression supports both **five field** and **six field** format. The sixth field position is a value for seconds which is placed at the beginning of the expression.

#### NCRONTAB time zones

The numbers in a CRON expression refer to a time and date, not a time span. For example, a 5 in the `hour` field refers to 5:00 AM, not every 5 hours.

[!INCLUDE [functions-timezone](../../includes/functions-timezone.md)]

### TimeSpan

 A `TimeSpan` can be used only for a function app that runs on an App Service Plan.

Unlike a CRON expression, a `TimeSpan` value specifies the time interval between each function invocation. When a function completes after running longer than the specified interval, the timer immediately invokes the function again.

Expressed as a string, the `TimeSpan` format is `hh:mm:ss` when `hh` is less than 24. When the first two digits are 24 or greater, the format is `dd:hh:mm`. Here are some examples:

| Example      | When triggered |
|--------------|----------------|
| "01:00:00"   | every hour     |
| "00:01:00"   | every minute   |
| "25:00:00:00"| every 25 days  |
| "1.00:00:00" | every day      |

### Scale-out

If a function app scales out to multiple instances, only a single instance of a timer-triggered function is run across all instances. It will not trigger again if there is an outstanding invocation is still running.

### Function apps sharing Storage

If you are sharing storage accounts across function apps that are not deployed to app service, you might need to explicitly assign host ID to each app.

| Functions version | Setting                                              |
| ----------------- | ---------------------------------------------------- |
| 2.x (and higher)  | `AzureFunctionsWebHost__hostid` environment variable |
| 1.x               | `id` in *host.json*                                  |

You can omit the identifying value or manually set each function app's identifying configuration to a different value.

The timer trigger uses a storage lock to ensure that there is only one timer instance when a function app scales out to multiple instances. If two function apps share the same identifying configuration and each uses a timer trigger, only one timer runs.

### Retry behavior

Unlike the queue trigger, the timer trigger doesn't retry after a function fails. When a function fails, it isn't called again until the next time on the schedule.

### Manually invoke a timer trigger

The timer trigger for Azure Functions provides an HTTP webhook that can be invoked to manually trigger the function. This can be extremely useful in the following scenarios.

* Integration testing
* Slot swaps as part of a smoke test or warmup activity
* Initial deployment of a function to immediately populate a cache or lookup table in a database

Please refer to [manually run a non HTTP-triggered function](./functions-manually-run-non-http.md) for details on how to manually invoke a timer triggered function.

### Troubleshooting

For information about what to do when the timer trigger doesn't work as expected, see [Investigating and reporting issues with timer triggered functions not firing](https://github.com/Azure/azure-functions-host/wiki/Investigating-and-reporting-issues-with-timer-triggered-functions-not-firing).


## Next steps

> [!div class="nextstepaction"]
> [Go to a quickstart that uses a timer trigger](functions-create-scheduled-function.md)

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
