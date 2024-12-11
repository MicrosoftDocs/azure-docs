---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: include
ms.date: 11/04/2024
ms.author: glenga
---
## <a name="timeout"></a>Function app timeout duration 

The timeout duration for functions in a function app is defined by the `functionTimeout` property in the [host.json](../articles/azure-functions/functions-host-json.md#functiontimeout) project file. This property applies specifically to function executions. After the trigger starts function execution, the function needs to return/respond within the timeout duration. To avoid timeouts, it's important to [write robust functions](../articles/azure-functions/functions-best-practices.md#write-robust-functions). For more information, see [Improve Azure Functions performance and reliability](../articles/azure-functions/performance-reliability.md#make-sure-background-tasks-complete). 

The following table shows the default and maximum values (in minutes) for specific plans:

| Plan | Default | Maximum<sup>1</sup> |  
|------|---------|---------|
| **[Flex Consumption plan](../articles/azure-functions/flex-consumption-plan.md)** | 30 | Unbounded<sup>2</sup> |
| **[Premium plan](../articles/azure-functions/functions-premium-plan.md)** |  30<sup>4</sup> | Unbounded<sup>2</sup> |  
| **[Dedicated plan](../articles/azure-functions/dedicated-plan.md)** |  30<sup>4</sup> | Unbounded<sup>3</sup> |  
| **[Container Apps](../articles/azure-functions/functions-container-apps-hosting.md)** | 30 | Unbounded<sup>5</sup>  | 
| **[Consumption plan](../articles/azure-functions/consumption-plan.md)** |  5 | 10 |  

1. Regardless of the function app timeout setting, 230 seconds is the maximum amount of time that an HTTP triggered function can take to respond to a request. This is because of the [default idle timeout of Azure Load Balancer](../articles/app-service/faq-availability-performance-application-issues.yml#why-does-my-request-time-out-after-230-seconds-). For longer processing times, consider using the [Durable Functions async pattern](../articles/azure-functions/durable/durable-functions-overview.md#async-http) or [defer the actual work and return an immediate response](../articles/azure-functions/performance-reliability.md#avoid-long-running-functions).
2. There is no maximum execution timeout duration enforced. However, the grace period given to a function execution is 60 minutes [during scale in](../articles/azure-functions/event-driven-scaling.md#scale-in-behaviors) for the Flex Consumption and Premium plans, and a grace period of 10 minutes is given during platform updates.
3. Requires the App Service plan be set to [Always On](/azure/azure-functions/dedicated-plan#always-on). A grace period of 10 minutes is given during platform updates.
4. The default timeout for version 1.x of the Functions host runtime is _unbounded_. 
5. When the [minimum number of replicas](../articles/container-apps/scale-app.md#scale-definition) is set to zero, the default timeout depends on the specific triggers used in the app.  