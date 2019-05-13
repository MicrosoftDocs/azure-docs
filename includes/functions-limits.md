---
author: ggailey777
ms.service: billing
ms.topic: include
ms.date: 05/09/2019	
ms.author: glenga
---
| Resource | [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan) | [Premium plan](../articles/azure-functions/functions-scale.md#premium-plan-public-preview) | [App Service plan](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> |
| --- | --- | --- | --- |
| Scale out | Event driven | Event driven | [Manual/autoscale](../articles/app-service/web-sites-scale.md) | 
|Default [time out duration](../articles/azure-functions/functions-scale.md#timeout) (min) |5 | 30 |30<sup>2</sup> |
|Max [time out duration](../articles/azure-functions/functions-scale.md#timeout) (min) |10 | Unlimited |Unlimited<sup>3</sup> |
| Max connections | 300 | ??? | ??? |
| Max request size (MB)<sup>4</sup> | 105 | 105 | 105 |
| Max query string length<sup>4</sup> | 4096 | 4096 | 4096 |
| Max request URL length<sup>4</sup> | 8192 | 8192 | 8192 |
| Function apps per plan |100 |100 |Unlimited<sup>4</sup> |
| [App Service plans](../articles/app-service/overview-hosting-plans.md) | 100 per [region](https://azure.microsoft.com/global-infrastructure/regions/) |100 per resource group |100 per resource group |
| Storage<sup>5</sup> |1 GB |250 GB |50-1000 GB |
| Custom domains per app</a> |0 (azurewebsites.net subdomain only)|500 |500 |
| Custom domain [SSL support](../articles/app-service/app-service-web-tutorial-custom-ssl.md) |Not supported, wildcard certificate for *.azurewebsites.net available by default| Unlimited SNI SSL and 1 IP SSL connections included |Unlimited SNI SSL and 1 IP SSL connections included | 

<sup>1</sup>For specific limits for the various App Service plan options, see the [App Service plan limits](../articles/azure-subscription-service-limits.md#app-service-limits).  
<sup>2</sup>The default timeout for the Functions 1.x runtime in the App Service plan is `unlimited`.  
<sup>3</sup>Requires the App Service plan be set to [Always On](../articles/azure-functions/functions-scale.md#always-on). Pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/).  
<sup>4</sup> These limits are [set in the host](https://github.com/Azure/azure-functions-host/blob/dev/src/WebJobs.Script.WebHost/web.config).  
<sup>4</sup> The actual number of function apps that you can host depends on the activity of the apps, the size of the machine instances, and the corresponding resource utilization. 
<sup>5</sup>The storage limit is the total content size across all apps in the same App Service plan. 
