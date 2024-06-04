---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: include
ms.date: 05/10/2024
ms.author: glenga
---
| Resource |[Consumption plan](../articles/azure-functions/consumption-plan.md)|[Flex Consumption plan](../articles/azure-functions/flex-consumption-plan.md)<sup>12</sup>|[Premium plan](../articles/azure-functions/functions-premium-plan.md)|[Dedicated plan](../articles/azure-functions/dedicated-plan.md)/[ASE](../articles/app-service/environment/intro.md)| 
| --- | --- | --- | --- | --- | 
| Default [timeout duration](../articles/azure-functions/functions-scale.md#timeout) (min) |5 | 30 | 30 |30<sup>1</sup> |
| Max [timeout duration](../articles/azure-functions/functions-scale.md#timeout) (min) |10 | unbounded<sup>15</sup> | unbounded<sup>7</sup> | unbounded<sup>2</sup> | 
| Max outbound connections (per instance) | 600 active (1200 total) | unbounded | unbounded | unbounded | 
| Max request size (MB)<sup>3</sup> | 100 | 100 | 100 | 100 |  
| Max query string length<sup>3</sup> | 4096 | 4096 | 4096 | 4096 |  
| Max request URL length<sup>3</sup> | 8192 | 8192 | 8192 | 8192 | 
|[ACU](../articles/virtual-machines/acu.md) per instance | 100 | varies | 210-840 | 100-840/210-250<sup>8</sup> |
| Max memory (GB per instance) | 1.5 | 4<sup>13</sup> | 3.5-14 | 1.75-14/3.5-14 | 
| Max instance count (Windows/Linux) | 200/100 | 1000 <sup>14</sup> | 100/20 | varies by SKU/100<sup>9</sup> |   
| Function apps per plan<sup>11</sup> | 100 | 100 | 100 | unbounded<sup>4</sup> |
| [App Service plans](../articles/app-service/overview-hosting-plans.md) | 100 per [region](https://azure.microsoft.com/global-infrastructure/regions/) | n/a | 100 per resource group |100 per resource group |
| [Deployment slots](../articles/azure-functions/functions-deployment-slots.md) per app<sup>10</sup> | 2 | n/a | 3 | 1-20<sup>9</sup> | 
| Storage<sup>5</sup> | 5 GB | 250 GB | 250 GB |50-1000 GB | 
| Custom domains per app</a> |500<sup>6</sup> | 500 | 500 | 500 | 
| Custom domain [SSL support](../articles/app-service/configure-ssl-bindings.md) |unbounded SNI SSL connection included | unbounded SNI SSL and 1 IP SSL connections included | unbounded SNI SSL and 1 IP SSL connections included |unbounded SNI SSL and 1 IP SSL connections included | 

Notes on service limits:

1. By default, the timeout for the Functions 1.x runtime in an App Service plan is unbounded.  
2. Requires the App Service plan be set to [Always On](../articles/azure-functions/dedicated-plan.md#always-on). Pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/).  
3. These limits are [set in the host](https://github.com/Azure/azure-functions-host/blob/dev/src/WebJobs.Script.WebHost/web.config).  
4. The actual number of function apps that you can host depends on the activity of the apps, the size of the machine instances, and the corresponding resource utilization.  
5. The storage limit is the total content size in temporary storage across all apps in the same App Service plan. Consumption plan uses Azure Files for temporary storage.  
6. When your function app is hosted in a [Consumption plan](../articles/azure-functions/consumption-plan.md), only the CNAME option is supported. For function apps in a [Premium plan](../articles/azure-functions/functions-premium-plan.md) or an [App Service plan](../articles/azure-functions/dedicated-plan.md), you can map a custom domain using either a CNAME or an A record.  
7. Guaranteed for up to 60 minutes.  
8. Workers are roles that host customer apps. Workers are available in three fixed sizes: One vCPU/3.5 GB RAM; Two vCPU/7 GB RAM; Four vCPU/14 GB RAM.   
9. See [App Service limits](../articles/azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits) for details.  
10. Including the production slot.  
11. There's currently a limit of 5000 function apps in a given subscription. 
12. The Flex Consumption plan is currently in preview.  
13. Flex Consumption plan instance sizes are currently defined as either 2,048 MB or 4,096 MB. For more information, see [Instance memory](../articles/azure-functions/flex-consumption-plan.md#instance-memory).  
14. Flex Consumption plan during preview has a regional subscription quota that limits the total memory usage of all instances across a given region. For more information, see [Instance memory](../articles/azure-functions/flex-consumption-plan.md#instance-memory).
15. In a Flex Consumption plan, the host doesn't enforce an execution time limit. However, there are currently no guarantees because the platform might need to terminate your instances during scale-in, deployments, or to apply updates.
