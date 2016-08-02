<properties
	pageTitle="Azure Functions timer trigger | Microsoft Azure"
	description="Understand how to use timer triggers in Azure Functions."
	services="functions"
	documentationCenter="na"
	authors="christopheranderson"
	manager="erikre"
	editor=""
	tags=""
	keywords="azure functions, functions, event processing, dynamic compute, serverless architecture"/>

<tags
	ms.service="functions"
	ms.devlang="multiple"
	ms.topic="reference"
	ms.tgt_pltfrm="multiple"
	ms.workload="na"
	ms.date="05/16/2016"
	ms.author="chrande"/>

# Azure Functions timer trigger

This article explains how to configure timer triggers in Azure Functions. Timer triggers call functions based on a schedule, one time or recurring.  

[AZURE.INCLUDE [intro](../../includes/functions-bindings-intro.md)] 

## function.json for timer trigger

The *function.json* file provides a schedule expression.

```json
{
  "bindings": [
    {
      "schedule": "0 * * * * *",
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

The timer trigger handles multi-instance scale-out automatically: only a single instance of a particular timer function will be running across all instances.

## Format of schedule expression

The schedule expression is a [CRON expression](http://en.wikipedia.org/wiki/Cron#CRON_expression) that includes 6 fields:  {second} {minute} {hour} {day} {month} {day of the week}. Many of the cron expression documents you find online omit the {second} field, so if you copy from one of those you'll have to adjust for the extra field. 

Here are some schedule expression examples.

To trigger once every 5 minutes:

```json
"schedule": "0 */5 * * * *"
```

To trigger once every two hours:

```json
"schedule": "0 0 */2 * * *",
```

## Timer trigger C# code example

This C# code example writes a single log each time the function is triggered.

```csharp
public static void Run(TimerInfo myTimer, TraceWriter log)
{
    log.Info($"C# Timer trigger function executed at: {DateTime.Now}");    
}
```

## Next steps

[AZURE.INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)] 
