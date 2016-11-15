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
ms.date: 10/31/2016
ms.author: chrande; glenga

---
# Azure Functions timer trigger
[!INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article explains how to configure and code timer triggers in Azure Functions. 
Azure Functions supports the trigger for timers. Timer triggers call functions based on a schedule, one time or recurring. 

The timer trigger supports multi-instance scale-out. One single instance of a particular timer function is run across all instances.

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

The value of `schedule` is a [CRON expression](http://en.wikipedia.org/wiki/Cron#CRON_expression) that includes 6 fields: 
`{second} {minute} {hour} {day} {month} {day of the week}`. Many of the cron expressions you find online omit the 
`{second}` field. If you copy from one of them, you need to adjust for the extra `{second}` field. See 
[`schedule` examples](#examples) below.

<a name="examples"></a>

## `schedule` examples
Here are some samples of CRON expressions you can use for the `schedule` property. 

To trigger once every 5 minutes:

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

