---
author: ggailey777
ms.service: billing
ms.topic: include
ms.date: 05/09/2019	
ms.author: glenga
---
| Resource | [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan) | [Premium plan](../articles/azure-functions/functions-scale.md#premium-plan) | [App Service plan](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> |
| --- | --- | --- | --- |
| Scale out | Event driven | Event driven | [Manual/autoscale](../articles/app-service/web-sites-scale.md) | 
| Max instances | 200 | 20 | 10-20 |
|Default [time out duration](../articles/azure-functions/functions-scale.md#timeout) (min) |5 | 30 |30<sup>2</sup> |
|Max [time out duration](../articles/azure-functions/functions-scale.md#timeout) (min) |10 | unbounded | unbounded<sup>3</sup> |
| Max outbound connections (per instance) | 600 active (1200 total) | unbounded | unbounded |
| Max request size (MB)<sup>4</sup> | 100 | 100 | 100 |
| Max query string length<sup>4</sup> | 4096 | 4096 | 4096 |
| Max request URL length<sup>4</sup> | 8192 | 8192 | 8192 |
| [ACU](../articles/virtual-machines/windows/acu.md) per instance | 100 | 210-840 | 100-840 |
| Max memory (GB per instance) | 1.5 | 3.5-14 | 1.75-14 |
| Function apps per plan |100 |100 |unbounded<sup>5</sup> |
| [App Service plans](../articles/app-service/overview-hosting-plans.md) | 100 per [region](https://azure.microsoft.com/global-infrastructure/regions/) |100 per resource group |100 per resource group |
| Storage<sup>6</sup> |1 GB |250 GB |50-1000 GB |
| Custom domains per app</a> |500<sup>7</sup> |500 |500 |
| Custom domain [SSL support](../articles/app-service/app-service-web-tutorial-custom-ssl.md) |unbounded SNI SSL connection included | unbounded SNI SSL and 1 IP SSL connections included |unbounded SNI SSL and 1 IP SSL connections included | 

<sup>1</sup> For specific limits for the various App Service plan options, see the [App Service plan limits](../articles/azure-subscription-service-limits.md#app-service-limits).  
<sup>2</sup> By default, the timeout for the Functions 1.x runtime in an App Service plan is unbounded.  
<sup>3</sup> Requires the App Service plan be set to [Always On](../articles/azure-functions/functions-scale.md#always-on). Pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/).  
<sup>4</sup> These limits are [set in the host](https://github.com/Azure/azure-functions-host/blob/dev/src/WebJobs.Script.WebHost/web.config).  
<sup>5</sup> The actual number of function apps that you can host depends on the activity of the apps, the size of the machine instances, and the corresponding resource utilization.
<sup>6</sup> The storage limit is the total content size in temporary storage across all apps in the same App Service plan. Consumption plan uses Azure Files for temporary storage.  
<sup>7</sup> When your function app is hosted in a [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan), only the CNAME option is supported. For function apps in a [Premium plan](../articles/azure-functions/functions-scale.md#premium-plan) or an [App Service plan](../articles/azure-functions/functions-scale.md#app-service-plan), you can map a custom domain using either a CNAME or an A record.
