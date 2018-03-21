---
title: Timer trigger for Azure Functions
description: Understand how to use timer triggers in Azure Functions.
services: functions
documentationcenter: na
author: tdykstra
manager: cfowler
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.assetid: d2f013d1-f458-42ae-baf8-1810138118ac
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 02/27/2017
ms.author: tdykstra

ms.custom: 

---
# Timer trigger for Azure Functions 

This article explains how to work with timer triggers in Azure Functions. 
A timer trigger lets you run a function on a schedule. 

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Packages

The timer trigger is provided in the [Microsoft.Azure.WebJobs.Extensions](http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions) NuGet package. Source code for the package is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Timers/) GitHub repository.

[!INCLUDE [functions-package-auto](../../includes/functions-package-auto.md)]

## Example

See the language-specific example:

* [C#](#trigger---c-example)
* [C# script (.csx)](#trigger---c-script-example)
* [F#](#trigger---f-example)
* [JavaScript](#trigger---javascript-example)

### C# example

The following example shows a [C# function](functions-dotnet-class-library.md) that runs every five minutes:

```cs
[FunctionName("TimerTriggerCSharp")]
public static void Run([TimerTrigger("0 */5 * * * *")]TimerInfo myTimer, TraceWriter log)
{
    log.Info($"C# Timer trigger function executed at: {DateTime.Now}");
}
```

### C# script example

The following example shows a timer trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function writes a log indicating whether this function invocation is due to a missed schedule occurrence.

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
public static void Run(TimerInfo myTimer, TraceWriter log)
{
    if(myTimer.IsPastDue)
    {
        log.Info("Timer is running late!");
    }
    log.Info($"C# Timer trigger function executed at: {DateTime.Now}" );  
}
```

### F# example

The following example shows a timer trigger binding in a *function.json* file and a [F# script function](functions-reference-fsharp.md) that uses the binding. The function writes a log indicating whether this function invocation is due to a missed schedule occurrence.

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
let Run(myTimer: TimerInfo, log: TraceWriter ) =
    if (myTimer.IsPastDue) then
        log.Info("F# function is running late.")
    let now = DateTime.Now.ToLongTimeString()
    log.Info(sprintf "F# function executed at %s!" now)
```

### JavaScript example

The following example shows a timer trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function writes a log indicating whether this function invocation is due to a missed schedule occurrence.

Here's the binding data in the *function.json* file:

```json
{
    "schedule": "0 */5 * * * *",
    "name": "myTimer",
    "type": "timerTrigger",
    "direction": "in"
}
```

Here's the JavaScript script code:

```JavaScript
module.exports = function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    if(myTimer.isPastDue)
    {
        context.log('Node.js is running late!');
    }
    context.log('Node.js timer trigger function ran!', timeStamp);   

    context.done();
};
```

## Attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [TimerTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Timers/TimerTriggerAttribute.cs).

The attribute's constructor takes a CRON expression or a `TimeSpan`. You can use `TimeSpan`  only if the function app is running on an App Service plan. The following example shows a CRON expression:

```csharp
[FunctionName("TimerTriggerCSharp")]
public static void Run([TimerTrigger("0 */5 * * * *")]TimerInfo myTimer, TraceWriter log)
{
    log.Info($"C# Timer trigger function executed at: {DateTime.Now}");
}
 ```

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `TimerTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "timerTrigger". This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to "in". This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The name of the variable that represents the timer object in function code. | 
|**schedule**|**ScheduleExpression**|A [CRON expression](#cron-expressions) or a [TimeSpan](#timespan) value. A `TimeSpan` can be used only for a function app that runs on an App Service Plan. You can put the schedule expression in an app setting and set this property to the app setting name wrapped in **%** signs, as in this example: "%NameOfAppSettingWithCRONExpression%". |

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

When a timer trigger function is invoked, the 
[timer object](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Timers/TimerInfo.cs) 
is passed into the function. The following JSON is an example representation of the timer object. 

```json
{
    "Schedule":{
    },
    "ScheduleStatus": {
        "Last":"2016-10-04T10:15:00.012699+00:00",
        "Next":"2016-10-04T10:20:00+00:00"
    },
    "IsPastDue":false
}
```

## CRON expressions 

A CRON expression for the Azure Functions timer trigger includes six fields: 

```
{second} {minute} {hour} {day} {month} {day-of-week}
```

Each field can have one of the following types of values:

|Type  |Example  |When triggered  |
|---------|---------|---------|
|A specific value |<nobr>"0 5 * * * *"</nobr>|at hh:05:00 where hh is every hour (once an hour)|
|All values (asterisk)|<nobr>"* 5 * * * *"</nobr>|at hh:05:ss where hh is every hour and ss is every second of hh:05 (60 times an hour)|
|A range (hyphen)|<nobr>"0 5-7 * * * *"</nobr>|at hh:05:00, hh:06:00, and hh:07:00 where hh is every hour (3 times an hour)|  
|A set of values (comma)|<nobr>"0 5,8,10 * * * *"</nobr>|at hh:05:00, hh:08:00, hh:010:00 where hh is every hour (3 times an hour)|
|An interval value (slash)|<nobr>"0 0/5 * * * *"</nobr>|at hh:05:00, hh:10:00, hh:15:00, and so on through hh:55:00 where hh is every hour (12 times an hour)|

### CRON time zones

The numbers in a CRON expression refer to a time and date, not a time span. For example, a 5 in the `hour` field refers to 5:00 AM, not every 5 hours.

The default time zone used with the CRON expressions is Coordinated Universal Time (UTC). To have your CRON expression based on another time zone, create an app setting for your function app named `WEBSITE_TIME_ZONE`. Set the value to the name of the desired time zone as shown in the [Microsoft Time Zone Index](https://technet.microsoft.com/library/cc749073). 

For example, *Eastern Standard Time* is UTC-05:00. To have your timer trigger fire at 10:00 AM EST every day, use the following CRON expression that accounts for UTC time zone:

```json
"schedule": "0 0 15 * * *",
```	

Or create an app setting for your function app named `WEBSITE_TIME_ZONE` and set the value to **Eastern Standard Time**.  Then uses the following CRON expression: 

```json
"schedule": "0 0 10 * * *",
```	

### CRON examples

Here are some examples of CRON expressions you can use for the timer trigger in Azure Functions. 


|Example|When triggered  |
|---------|---------|
|"0 */5 * * * *"|once every five minutes|
|"0 0 * * * *"|once at the top of every hour|
|"0 0 */2 * * *"|once every two hours|
|"0 0 9-17 * * *"|once every hour from 9 AM to 5 PM|
|"0 30 9 * * *"|at 9:30 AM every day|
|"0 30 9 * * 1-5"|at 9:30 AM every weekday|

>[!NOTE]   
>You can find CRON expression examples online, but many of them omit the `{second}` field. If you copy from one of them, add the missing `{second}` field. Usually you'll want a zero in that field, not an asterisk.

## TimeSpan

 A `TimeSpan` can be used only for a function app that runs on an App Service Plan.

Unlike a CRON expression, a `TimeSpan` value specifies the time interval between each time the timer invokes the function. If the function takes a significant amount of time to complete, the timer waits the specified amount of time after function completion.

Expressed as a string, the `TimeSpan` format is `hh:mm:ss`. Here are some examples:

|Example |When triggered  |
|---------|---------|
|"24:00:00" | every 24 hours        |
|"00:01:00"|every minute         |

## Scale-out

If a function app scales out to multiple instances, only a single instance of a timer-triggered function is run across all instances.

## Function apps sharing Storage

If you share a Storage account across multiple function apps, make sure that each function app has a different `id` in *host.json*. You can omit the `id` property or manually set each function app's `id` to a different value. The timer trigger uses a storage lock to ensure that there will be only one timer instance when a function app scales out to multiple instances. If two function apps share the same `id` and each uses a timer trigger, only one timer will run.

## Next steps

> [!div class="nextstepaction"]
> [Go to a quickstart that uses a timer trigger](functions-create-scheduled-function.md)

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
