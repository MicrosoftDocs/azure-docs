---
title: Azure Functions timer trigger
description: Understand how to use timer triggers in Azure Functions.
services: functions
documentationcenter: na
author: christopheranderson
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
ms.author: glenga

ms.custom: 

---
# Azure Functions timer trigger

This article explains how to work with timer triggers in Azure Functions. 
A timer trigger lets you run a function on a schedule. 

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Example

See the language-specific example:

* [Precompiled C#](#trigger---c-example)
* [C# script](#trigger---c-script-example)
* [F#](#trigger---f-example)
* [JavaScript](#trigger---javascript-example)

### C# example

The following example shows a [precompiled C# function](functions-dotnet-class-library.md) that runs every five minutes:

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

Here's the F# script code:

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

## Attributes for precompiled C#

For [precompiled C#](functions-dotnet-class-library.md) functions, use the [TimerTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Timers/TimerTriggerAttribute.cs), defined in NuGet package [Microsoft.Azure.WebJobs.Extensions](http://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions).

The attribute's constructor takes a CRON expression, as shown in the following example:

```csharp
[FunctionName("TimerTriggerCSharp")]
public static void Run([TimerTrigger("0 */5 * * * *")]TimerInfo myTimer, TraceWriter log)
 ```

You can specify a `TimeSpan` instead of a CRON expression if your function app runs on an App Service plan (not a Consumption plan).

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `TimerTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to "timerTrigger". This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | n/a | Must be set to "in". This property is set automatically when you create the trigger in the Azure portal. |
|**name** | n/a | The name of the variable that represents the timer object in function code. | 
|**schedule**|**ScheduleExpression**|On the Consumption plan, you can define schedules with a CRON expression. If you're using an App Service Plan, you can also use a `TimeSpan` string. The following sections explain CRON expressions. You can put the schedule expression in an app setting and set this property to a value wrapped in **%** signs, as in this example: "%NameOfAppSettingWithCRONExpression%". When you're developing locally, app settings go into the values of the [local.settings.json](../../Documents/GitHub/azure-docs-pr/articles/azure-functions/functions-run-local.md#local-settings-file) file.|

### CRON format 

A [CRON expression](http://en.wikipedia.org/wiki/Cron#CRON_expression) for the Azure Functions timer trigger includes these six fields: 

```
{second} {minute} {hour} {day} {month} {day-of-week}
```

>[!NOTE]   
>Many of the CRON expressions you find online omit the `{second}` field. If you copy from one of them, add the missing `{second}` field.

### CRON time zones

The default time zone used with the CRON expressions is Coordinated Universal Time (UTC). To have your CRON expression based on another time zone, create a new app setting for your function app named `WEBSITE_TIME_ZONE`. Set the value to the name of the desired time zone as shown in the [Microsoft Time Zone Index](https://technet.microsoft.com/library/cc749073(v=ws.10).aspx). 

For example, *Eastern Standard Time* is UTC-05:00. To have your timer trigger fire at 10:00 AM EST every day, use the following CRON expression that accounts for UTC time zone:

```json
"schedule": "0 0 15 * * *",
```	

Alternatively, you could add a new app setting for your function app named `WEBSITE_TIME_ZONE` and set the value to **Eastern Standard Time**.  Then the following CRON expression could be used for 10:00 AM EST: 

```json
"schedule": "0 0 10 * * *",
```	
### CRON examples

Here are some examples of CRON expressions you can use for the timer trigger in Azure Functions. 

To trigger once every five minutes:

```json
"schedule": "0 */5 * * * *"
```

To trigger once at the top of every hour:

```json
"schedule": "0 0 * * * *",
```

To trigger once every two hours:

```json
"schedule": "0 0 */2 * * *",
```

To trigger once every hour from 9 AM to 5 PM:

```json
"schedule": "0 0 9-17 * * *",
```

To trigger At 9:30 AM every day:

```json
"schedule": "0 30 9 * * *",
```

To trigger At 9:30 AM every weekday:

```json
"schedule": "0 30 9 * * 1-5",
```

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

## Scale-out

The timer trigger supports multi-instance scale-out. A single instance of a particular timer function is run across all instances.

## Next steps

> [!div class="nextstepaction"]
> [Go to a quickstart that uses a timer trigger](functions-create-scheduled-function.md)

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
