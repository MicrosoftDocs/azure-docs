---
title: include file
description: include file
services: functions
author: nzthiago
ms.service: azure-functions
ms.topic: include
ms.date: 02/21/2018
ms.author: nzthiago
ms.custom: include file
---
## <a name="timeout"></a>Function app timeout duration 

The timeout duration of a function app is defined by the functionTimeout property in the [host.json](../articles/azure-functions/functions-host-json.md#functiontimeout) project file. The following table shows the default and maximum values in minutes for both plans and in both runtime versions:

| Plan | Runtime Version | Default | Maximum |
|------|---------|---------|---------|
| Consumption | 1.x | 5 | 10 |
| Consumption | 2.x | 5 | 10 |
| App Service | 1.x | Unlimited | Unlimited |
| App Service | 2.x | 30 | Unlimited |

> [!NOTE] 
> Regardless of the function app timeout setting, 230 seconds is the maximum amount of time that an HTTP triggered function can take to respond to a request. This is because of the [default idle timeout of Azure Load Balancer](../articles/app-service/faq-availability-performance-application-issues.md#why-does-my-request-time-out-after-230-seconds). For longer processing times, consider using the [Durable Functions async pattern](../articles/azure-functions/durable/durable-functions-concepts.md#async-http) or [defer the actual work and return an immediate response](../articles/azure-functions/functions-best-practices.md#avoid-long-running-functions).
