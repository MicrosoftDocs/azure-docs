---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/03/2022
ms.author: glenga
---
## <a name="timeout"></a>Function app timeout duration 

The timeout duration for functions in a function app is defined by the `functionTimeout` property in the [host.json](../articles/azure-functions/functions-host-json.md#functiontimeout) project file. This property applies specifically to function executions. After the trigger starts function execution, the function needs to return/respond within the timeout duration. For more information, see [Improve Azure Functions performance and reliability](../articles/azure-functions/performance-reliability.md#make-sure-background-tasks-complete). 

The following table shows the default and maximum values (in minutes) for specific plans:

| Plan | Default | Maximum<sup>1</sup> |
|------|---------|---------|---------|
| **[Consumption plan](../articles/azure-functions/consumption-plan.md)** |  5 | 10 |
| **[Premium plan](../articles/azure-functions/functions-premium-plan.md)** |  30<sup>2</sup> | Unlimited |
| **[Dedicated plan](../articles/azure-functions/dedicated-plan.md)** |  30<sup>2</sup> | Unlimited |

<sup>1</sup> Regardless of the function app timeout setting, 230 seconds is the maximum amount of time that an HTTP triggered function can take to respond to a request. This is because of the [default idle timeout of Azure Load Balancer](../articles/app-service/faq-availability-performance-application-issues.yml#why-does-my-request-time-out-after-230-seconds-). For longer processing times, consider using the [Durable Functions async pattern](../articles/azure-functions/durable/durable-functions-overview.md#async-http) or [defer the actual work and return an immediate response](../articles/azure-functions/performance-reliability.md#avoid-long-running-functions). <br/>
<sup>2</sup> The default timeout for version 1.x of the Functions runtime is _unlimited_.
