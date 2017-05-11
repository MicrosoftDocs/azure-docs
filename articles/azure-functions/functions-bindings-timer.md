---
title: Azure Functions timer trigger | Microsoft Docs
description: Understand how to use timer triggers in Azure Functions.
services: functions
documentationcenter: na
author: christopheranderson
manager: erikre
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
ms.author: chrande; glenga

ms.custom: H1Hack27Feb2017

---
# Schedule code execution with Azure Functions
[!INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article explains how to configure and code timer triggers in Azure Functions. 
Azure Functions has a timer trigger binding that lets you run your function code based on a defined schedule. 

The timer trigger supports multi-instance scale-out. A single instance of a particular timer function is run across all instances.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

<a id="trigger"></a>

## Timer trigger
The timer trigger to a function uses the following JSON object in the `bindings` array of function.json:

```json
{
    "schedule": "<CRON expression - see below>",
    "name": "<Name of trigger parameter in function signature>",
    "type": "timerTrigger",
    "direction": "in"
}
```

The value of `schedule` is a [CRON expression](http://en.wikipedia.org/wiki/Cron#CRON_expression) that includes these six fields: 

	{second} {minute} {hour} {day} {month} {day-of-week}
&nbsp;
>[!NOTE]   
>Many of the cron expressions you find online omit the `{second}` field. If you copy from one of them, you need to adjust for the extra `{second}` field. For specific examples, see [Schedule examples](#examples) below.

The default time zone used with the CRON expressions is Coordinated Universal Time (UTC). To have your CRON expression based on another time zone, create a new app setting for your function app named `WEBSITE_TIME_ZONE`. Set the value to the name of the desired time zone as shown in the [Microsoft Time Zone Index](https://msdn.microsoft.com/library/ms912391.aspx). 

For example, *Eastern Standard Time* is UTC-05:00. To have your timer trigger fire at 10:00 AM EST every day, use the following CRON expression that accounts for UTC time zone:

```json
"schedule": "0 0 15 * * *",
```	

Alternatively, you could add a new app setting for your function app named `WEBSITE_TIME_ZONE` and set the value to **Eastern Standard Time**.  Then the following CRON expression could be used for 10:00 AM EST: 

```json
"schedule": "0 0 10 * * *",
```	


<a name="examples"></a>

## Schedule examples
Here are some samples of CRON expressions you can use for the `schedule` property. 

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

<a name="usage"></a>

## Trigger usage
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

<a name="sample"></a>

## Trigger sample
Suppose you have the following timer trigger in the `bindings` array of function.json:

```json
{
    "schedule": "0 */5 * * * *",
    "name": "myTimer",
    "type": "timerTrigger",
    "direction": "in"
}
```

See the language-specific sample that reads the timer object to see whether it's running late.

* [C#](#triggercsharp)
* [F#](#triggerfsharp)
* [Node.js](#triggernodejs)

<a name="triggercsharp"></a>

### Trigger sample in C# #
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

<a name="triggerfsharp"></a>

### Trigger sample in F# #
```fsharp
let Run(myTimer: TimerInfo, log: TraceWriter ) =
    if (myTimer.IsPastDue) then
        log.Info("F# function is running late.")
    let now = DateTime.Now.ToLongTimeString()
    log.Info(sprintf "F# function executed at %s!" now)
```

<a name="triggernodejs"></a>

### Trigger sample in Node.js
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

## Next steps
[!INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]

