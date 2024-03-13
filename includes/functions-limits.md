---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/23/2023	
ms.author: glenga
---
| Resource |[Consumption plan](../articles/azure-functions/consumption-plan.md)|[Premium plan](../articles/azure-functions/functions-premium-plan.md)|[Dedicated plan](../articles/azure-functions/dedicated-plan.md)|[ASE](../articles/app-service/environment/intro.md)| [Kubernetes](../articles/aks/quotas-skus-regions.md) |
| --- | --- | --- | --- | --- | --- |
|Default [timeout duration](../articles/azure-functions/functions-scale.md#timeout) (min) |5 | 30 |30<sup>1</sup> | 30 | 30 |
|Max [timeout duration](../articles/azure-functions/functions-scale.md#timeout) (min) |10 | unbounded<sup>7</sup> | unbounded<sup>2</sup> | unbounded | unbounded |
| Max outbound connections (per instance) | 600 active (1200 total) | unbounded | unbounded | unbounded | unbounded |
| Max request size (MB)<sup>3</sup> | 100 | 100 | 100 | 100 | Depends on cluster |
| Max query string length<sup>3</sup> | 4096 | 4096 | 4096 | 4096 | Depends on cluster |
| Max request URL length<sup>3</sup> | 8192 | 8192 | 8192 | 8192 | Depends on cluster |
|[ACU](../articles/virtual-machines/acu.md) per instance | 100 | 210-840 | 100-840 | 210-250<sup>8</sup> | [AKS pricing](https://azure.microsoft.com/pricing/details/container-service/) |
| Max memory (GB per instance) | 1.5 | 3.5-14 | 1.75-14 | 3.5 - 14 | Any node is supported |
| Max instance count (Windows/Linux) | 200/100 | 100/20 | varies by SKU<sup>9</sup> | 100<sup>9</sup> | Depends on cluster |   
| Function apps per plan<sup>11</sup> |100 |100 |unbounded<sup>4</sup> | unbounded | unbounded |
| [App Service plans](../articles/app-service/overview-hosting-plans.md) | 100 per [region](https://azure.microsoft.com/global-infrastructure/regions/) |100 per resource group |100 per resource group | - | - |
| [Deployment slots](../articles/azure-functions/functions-deployment-slots.md) per app<sup>10</sup> | 2 | 3 | 1-20<sup>9</sup> | 20 | n/a |
| Storage<sup>5</sup> |5 GB |250 GB |50-1000 GB | 1 TB | n/a |
| Custom domains per app</a> |500<sup>6</sup> |500 |500 | 500 | n/a |
| Custom domain [SSL support](../articles/app-service/configure-ssl-bindings.md) |unbounded SNI SSL connection included | unbounded SNI SSL and 1 IP SSL connections included |unbounded SNI SSL and 1 IP SSL connections included | unbounded SNI SSL and 1 IP SSL connections included | n/a |

<sup>1</sup> By default, the timeout for the Functions 1.x runtime in an App Service plan is unbounded.  
<sup>2</sup> Requires the App Service plan be set to [Always On](../articles/azure-functions/dedicated-plan.md#always-on). Pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/).  
<sup>3</sup> These limits are [set in the host](https://github.com/Azure/azure-functions-host/blob/dev/src/WebJobs.Script.WebHost/web.config).  
<sup>4</sup> The actual number of function apps that you can host depends on the activity of the apps, the size of the machine instances, and the corresponding resource utilization.  
<sup>5</sup> The storage limit is the total content size in temporary storage across all apps in the same App Service plan. Consumption plan uses Azure Files for temporary storage.  
<sup>6</sup> When your function app is hosted in a [Consumption plan](../articles/azure-functions/consumption-plan.md), only the CNAME option is supported. For function apps in a [Premium plan](../articles/azure-functions/functions-premium-plan.md) or an [App Service plan](../articles/azure-functions/dedicated-plan.md), you can map a custom domain using either a CNAME or an A record.  
<sup>7</sup> Guaranteed for up to 60 minutes.  
<sup>8</sup> Workers are roles that host customer apps. Workers are available in three fixed sizes: One vCPU/3.5 GB RAM; Two vCPU/7 GB RAM; Four vCPU/14 GB RAM.   
<sup>9</sup> See [App Service limits](../articles/azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits) for details.  
<sup>10</sup> Including the production slot.  
<sup>11</sup> There's currently a limit of 5000 function apps in a given subscription. 
