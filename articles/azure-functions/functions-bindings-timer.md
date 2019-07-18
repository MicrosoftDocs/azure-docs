---
title: Timer trigger for Azure Functions
description: Understand how to use timer triggers in Azure Functions.
services: functions
documentationcenter: na
author: craigshoemaker
manager: gwallace
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.assetid: d2f013d1-f458-42ae-baf8-1810138118ac
ms.service: azure-functions
ms.devlang: multiple
ms.topic: reference
ms.date: 09/08/2018
ms.author: cshoe

ms.custom: 

---
# Timer trigger for Azure Functions 

This article explains how to work with timer triggers in Azure Functions. 
A timer trigger lets you run a function on a schedule. 

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Packages - Functions 1.x

The timer trigger is provided in the [Microsoft.Azure.WebJobs.Extensions](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions) NuGet package, version 2.x. Source code for the package is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/v2.x/src/WebJobs.Extensions/Extensions/Timers/) GitHub repository.

[!INCLUDE [functions-package-auto](../../includes/functions-package-auto.md)]

## Packages - Functions 2.x

The timer trigger is provided in the [Microsoft.Azure.WebJobs.Extensions](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions) NuGet package, version 3.x. Source code for the package is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Timers/) GitHub repository.

[!INCLUDE [functions-package-auto](../../includes/functions-package-auto.md)]

## Example

See the language-specific example:

* [C#](#c-example)
* [C# script (.csx)](#c-script-example)
* [F#](#f-example)
* [Java](#java-example)
* [JavaScript](#javascript-example)
* [Python](#python-example)

### C# example

The following example shows a [C# function](functions-dotnet-class-library.md) that is executed each time the minutes have a value divisible by five (eg if the function starts at 18:57:00, the next performance will be at 19:00:00). The [`TimerInfo`](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Timers/TimerInfo.cs) object is passed into the function.

```cs
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

### C# script example

The following example shows a timer trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function writes a log indicating whether this function invocation is due to a missed schedule occurrence. The [`TimerInfo`](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Timers/TimerInfo.cs) object is passed into the function.

Here's the binding data in the *function.json* file:

```json
{
    "schedule": "0 */5 * * * *",
    "name": "myTimer",
    "type": "timerTrigger",
    "direction": "in"
}
```

Here's the C# script code:

```csharp
public static void Run(TimerInfo myTimer, ILogger log)
{
    if (myTimer.IsPastDue)
    {
        log.LogInformation("Timer is running late!");
    }
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}" );  
}
```

### F# example

The following example shows a timer trigger binding in a *function.json* file and an [F# script function](functions-reference-fsharp.md) that uses the binding. The function writes a log indicating whether this function invocation is due to a missed schedule occurrence. The [`TimerInfo`](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Timers/TimerInfo.cs) object is passed into the function.

Here's the binding data in the *function.json* file:

```json
{
    "schedule": "0 */5 * * * *",
    "name": "myTimer",
    "type": "timerTrigger",
    "direction": "in"
}
```

Here's the F# script code:

```fsharp
let Run(myTimer: TimerInfo, log: ILogger ) =
    if (myTimer.IsPastDue) then
        log.LogInformation("F# function is running late.")
    let now = DateTime.Now.ToLongTimeString()
    log.LogInformation(sprintf "F# function executed at %s!" now)
```

### Java example

The following example function triggers and executes every five minutes. The `@TimerTrigger` annotation on the function defines the schedule using the same string format as [CRON expressions](https://en.wikipedia.org/wiki/Cron#CRON_expression).

```java
@FunctionName("keepAlive")
public void keepAlive(
  @TimerTrigger(name = "keepAliveTrigger", schedule = "0 *&#47;5 * * * *") String timerInfo,
      ExecutionContext context
 ) {
     // timeInfo is a JSON string, you can deserialize it to an object using your favorite JSON library
     context.getLogger().info("Timer is triggered: " + timerInfo);
}
```

### JavaScript example

The following example shows a timer trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function writes a log indicating whether this function invocation is due to a missed schedule occurrence. A [timer object](#usage) is passed into the function.

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
module.exports = function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    if (myTimer.IsPastDue)
    {
        context.log('Node is running late!');
    }
    context.log('Node timer trigger function ran!', timeStamp);   

    context.done();
};
```

### Python example

The following example uses a timer trigger binding whose configuration is described in the *function.json* file. The actual [Python function](functions-reference-python.md) that uses the binding is described in the *__init__.py* file. The object passed into the function is of type [azure.functions.TimerRequest object](/python/api/azure-functions/azure.functions.timerrequest). The function logic writes to the logs indicating whether the current invocation is due to a missed schedule occurrence. 

Here's the binding data in the *function.json* file:

```json
{
    "name": "mytimer",
    "type": "timerTrigger",
    "direction": "in",
    "schedule": "0 */5 * * * *"
}
```

Here's the Python code:

```python
import datetime
import logging

import azure.functions as func


def main(mytimer: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()

    if mytimer.past_due:
        logging.info('The timer is past due!')

    logging.info('Python timer trigger function ran at %s', utc_timestamp)
```

## Attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [TimerTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Timers/TimerTriggerAttribute.cs).

The attribute's constructor takes a CRON expression or a `TimeSpan`. You can use `TimeSpan`  only if the function app is running on an App Service plan. The following example shows a CRON expression:

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

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `TimerTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "timerTrigger". This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to "in". This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The name of the variable that represents the timer object in function code. | 
|**schedule**|**ScheduleExpression**|A [CRON expression](#cron-expressions) or a [TimeSpan](#timespan) value. A `TimeSpan` can be used only for a function app that runs on an App Service Plan. You can put the schedule expression in an app setting and set this property to the app setting name wrapped in **%** signs, as in this example: "%ScheduleAppSetting%". |
|**runOnStartup**|**RunOnStartup**|If `true`, the function is invoked when the runtime starts. For example, the runtime starts when the function app wakes up after going idle due to inactivity. when the function app restarts due to function changes, and when the function app scales out. So **runOnStartup** should rarely if ever be set to `true`, especially in production. |
|**useMonitor**|**UseMonitor**|Set to `true` or `false` to indicate whether the schedule should be monitored. Schedule monitoring persists schedule occurrences to aid in ensuring the schedule is maintained correctly even when function app instances restart. If not set explicitly, the default is `true` for schedules that have a recurrence interval greater than 1 minute. For schedules that trigger more than once per minute, the default is `false`.

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

> [!CAUTION]
> We recommend against setting **runOnStartup** to `true` in production. Using this setting makes code execute at highly unpredictable times. In certain production settings, these extra executions can result in significantly higher costs for apps hosted in Consumption plans. For example, with **runOnStartup** enabled the trigger is invoked whenever your function app is scaled. Make sure you fully understand the production behavior of your functions before enabling **runOnStartup** in production.   

## Usage

When a timer trigger function is invoked, a timer object is passed into the function. The following JSON is an example representation of the timer object.

```json
{
    "Schedule":{
    },
    "ScheduleStatus": {
        "Last":"2016-10-04T10:15:00+00:00",
        "LastUpdated":"2016-10-04T10:16:00+00:00",
        "Next":"2016-10-04T10:20:00+00:00"
    },
    "IsPastDue":false
}
```

The `IsPastDue` property is `true` when the current function invocation is later than scheduled. For example, a function app restart might cause an invocation to be missed.

## CRON expressions 

Azure Functions uses the [NCronTab](https://github.com/atifaziz/NCrontab) library to interpret CRON expressions. A CRON expression includes six fields:

`{second} {minute} {hour} {day} {month} {day-of-week}`

Each field can have one of the following types of values:

|Type  |Example  |When triggered  |
|---------|---------|---------|
|A specific value |<nobr>"0 5 * * * *"</nobr>|at hh:05:00 where hh is every hour (once an hour)|
|All values (`*`)|<nobr>"0 * 5 * * *"</nobr>|at 5:mm:00 every day, where mm is every minute of the hour (60 times a day)|
|A range (`-` operator)|<nobr>"5-7 * * * * *"</nobr>|at hh:mm:05,hh:mm:06, and hh:mm:07 where hh:mm is every minute of every hour (3 times a minute)|  
|A set of values (`,` operator)|<nobr>"5,8,10 * * * * *"</nobr>|at hh:mm:05,hh:mm:08, and hh:mm:10 where hh:mm is every minute of every hour (3 times a minute)|
|An interval value (`/` operator)|<nobr>"0 */5 * * * *"</nobr>|at hh:05:00, hh:10:00, hh:15:00, and so on through hh:55:00 where hh is every hour (12 times an hour)|

[!INCLUDE [functions-cron-expressions-months-days](../../includes/functions-cron-expressions-months-days.md)]

### CRON examples

Here are some examples of CRON expressions you can use for the timer trigger in Azure Functions.

|Example|When triggered  |
|---------|---------|
|`"0 */5 * * * *"`|once every five minutes|
|`"0 0 * * * *"`|once at the top of every hour|
|`"0 0 */2 * * *"`|once every two hours|
|`"0 0 9-17 * * *"`|once every hour from 9 AM to 5 PM|
|`"0 30 9 * * *"`|at 9:30 AM every day|
|`"0 30 9 * * 1-5"`|at 9:30 AM every weekday|
|`"0 30 9 * Jan Mon"`|at 9:30 AM every Monday in January|
>[!NOTE]   
>You can find CRON expression examples online, but many of them omit the `{second}` field. If you copy from one of them, add the missing `{second}` field. Usually you'll want a zero in that field, not an asterisk.

### CRON time zones

The numbers in a CRON expression refer to a time and date, not a time span. For example, a 5 in the `hour` field refers to 5:00 AM, not every 5 hours.

The default time zone used with the CRON expressions is Coordinated Universal Time (UTC). To have your CRON expression based on another time zone, create an app setting for your function app named `WEBSITE_TIME_ZONE`. Set the value to the name of the desired time zone as shown in the [Microsoft Time Zone Index](https://technet.microsoft.com/library/cc749073). 

For example, *Eastern Standard Time* is UTC-05:00. To have your timer trigger fire at 10:00 AM EST every day, use the following CRON expression that accounts for UTC time zone:

```json
"schedule": "0 0 15 * * *"
```	

Or create an app setting for your function app named `WEBSITE_TIME_ZONE` and set the value to **Eastern Standard Time**.  Then uses the following CRON expression: 

```json
"schedule": "0 0 10 * * *"
```	

When you use `WEBSITE_TIME_ZONE`, the time is adjusted for time changes in the specific timezone, such as daylight savings time. 

## TimeSpan

 A `TimeSpan` can be used only for a function app that runs on an App Service Plan.

Unlike a CRON expression, a `TimeSpan` value specifies the time interval between each function invocation. When a function completes after running longer than the specified interval, the timer immediately invokes the function again.

Expressed as a string, the `TimeSpan` format is `hh:mm:ss` when `hh` is less than 24. When the first two digits are 24 or greater, the format is `dd:hh:mm`. Here are some examples:

|Example |When triggered  |
|---------|---------|
|"01:00:00" | every hour        |
|"00:01:00"|every minute         |
|"24:00:00" | everyday        |

## Scale-out

If a function app scales out to multiple instances, only a single instance of a timer-triggered function is run across all instances.

## Function apps sharing Storage

If you share a Storage account across multiple function apps, make sure that each function app has a different `id` in *host.json*. You can omit the `id` property or manually set each function app's `id` to a different value. The timer trigger uses a storage lock to ensure that there will be only one timer instance when a function app scales out to multiple instances. If two function apps share the same `id` and each uses a timer trigger, only one timer will run.

## Retry behavior

Unlike the queue trigger, the timer trigger doesn't retry after a function fails. When a function fails, it isn't called again until the next time on the schedule.

## Troubleshooting

For information about what to do when the timer trigger doesn't work as expected, see [Investigating and reporting issues with timer triggered functions not firing](https://github.com/Azure/azure-functions-host/wiki/Investigating-and-reporting-issues-with-timer-triggered-functions-not-firing).

## Next steps

> [!div class="nextstepaction"]
> [Go to a quickstart that uses a timer trigger](functions-create-scheduled-function.md)

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
