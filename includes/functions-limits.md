---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: include
ms.date: 06/18/2024
ms.author: glenga
---
| Resource |[Consumption plan](/azure/azure-functions/consumption-plan)|[Flex Consumption plan](/azure/azure-functions/flex-consumption-plan)<sup>13</sup>|[Premium plan](/azure/azure-functions/functions-premium-plan)|[Dedicated plan](/azure/azure-functions/dedicated-plan)/[ASE](/azure/app-service/environment/intro)| [Container Apps](/azure/azure-functions/functions-container-apps-hosting)|
| --- | --- | --- | --- | --- | --- | 
| Default [timeout duration](/azure/azure-functions/functions-scale#timeout) (min) |5 | 30 | 30 |30<sup>1</sup> | 30<sup>17</sup> |
| Max [timeout duration](/azure/azure-functions/functions-scale#timeout) (min) |10 | unbounded<sup>16</sup> | unbounded<sup>8</sup> | unbounded<sup>2</sup> | unbounded<sup>18</sup> |
| Max outbound connections (per instance) | 600 active (1200 total) | unbounded | unbounded | unbounded | unbounded |
| Max request size (MB)<sup>3</sup> | 100 | 100 | 100 | 100 |  100 |
| Max query string length<sup>3</sup> | 4096 | 4096 | 4096 | 4096 |   4096 | 
| Max request URL length<sup>3</sup> | 8192 | 8192 | 8192 | 8192 | 8192 | 
|[ACU](/azure/virtual-machines/acu) per instance | 100 | varies | 210-840 | 100-840/210-250<sup>9</sup> | [varies](/azure/container-apps/billing) |
| Max memory (GB per instance) | 1.5 | 4<sup>14</sup> | 3.5-14 | 1.75-14/3.5-14 | [varies](/azure/container-apps/billing) |
| Max instance count (Windows/Linux) | 200/100 | 1000 <sup>15</sup> | 100/20 | varies by SKU/100<sup>10</sup> |  10-300<sup>19</sup> | 
| Function apps per plan<sup>12</sup> | 100 | 100 | 100 | unbounded<sup>4</sup> | unbounded<sup>4</sup> |
| [App Service plans](/azure/app-service/overview-hosting-plans) | 100 per [region](https://azure.microsoft.com/global-infrastructure/regions/) | n/a | 100 per resource group |100 per resource group | n/a |
| [Deployment slots](/azure/azure-functions/functions-deployment-slots) per app<sup>11</sup> | 2 | n/a | 3 | 1-20<sup>10</sup> | not supported |
| Storage (temporary)<sup>5</sup> | 0.5 GB | 0.8 GB | 21-140 GB |11-140 GB | n/a |
| Storage (persisted) | 1 GB<sup>6</sup> | 0 GB | 250 GB |10-1000 GB<sup>10</sup> | n/a |
| Custom domains per app</a> |500<sup>7</sup> | 500 | 500 | 500 | not supported |
| Custom domain [SSL support](/azure/app-service/configure-ssl-bindings) |unbounded SNI SSL connection included | unbounded SNI SSL and 1 IP SSL connections included | unbounded SNI SSL and 1 IP SSL connections included |unbounded SNI SSL and 1 IP SSL connections included | not supported |

Notes on service limits:

1. By default, the timeout for the Functions 1.x runtime in an App Service plan is unbounded.  
2. Requires the App Service plan be set to [Always On](/azure/azure-functions/dedicated-plan#always-on). Pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/).  
3. These limits are [set in the host](https://github.com/Azure/azure-functions-host/blob/dev/src/WebJobs.Script.WebHost/web.config).  
4. The actual number of function apps that you can host depends on the activity of the apps, the size of the machine instances, and the corresponding resource utilization.  
5. The storage limit is the total content size in temporary storage across all apps in the same App Service plan. For Consumption plans on Linux, the storage is currently 1.5 GB.
6. Consumption plan uses an Azure Files share for persisted storage. When you provide your own Azure Files share, the specific share size limits depend on the storage account you set for [WEBSITE_CONTENTAZUREFILECONNECTIONSTRING](/azure/azure-functions/functions-app-settings#website_contentazurefileconnectionstring). On Linux, you must [explicitly mount your own Azure Files share](/azure/azure-functions/storage-considerations#mount-file-shares) for both Flex Consumption and Consumption plans.
7. When your function app is hosted in a [Consumption plan](/azure/azure-functions/consumption-plan), only the CNAME option is supported. For function apps in a [Premium plan](/azure/azure-functions/functions-premium-plan) or an [App Service plan](/azure/azure-functions/dedicated-plan), you can map a custom domain using either a CNAME or an A record.  
8. Guaranteed for up to 60 minutes.  
9. Workers are roles that host customer apps. Workers are available in three fixed sizes: One vCPU/3.5 GB RAM; Two vCPU/7 GB RAM; Four vCPU/14 GB RAM.   
10. See [App Service limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#app-service-limits) for details.  
11. Including the production slot.  
12. There's currently a limit of 5000 function apps in a given subscription. 
13. The Flex Consumption plan is currently in preview.  
14. Flex Consumption plan instance sizes are currently defined as either 2,048 MB or 4,096 MB. For more information, see [Instance memory](/azure/azure-functions/flex-consumption-plan#instance-memory).  
15. Flex Consumption plan during preview has a regional subscription quota that limits the total memory usage of all instances across a given region. For more information, see [Instance memory](/azure/azure-functions/flex-consumption-plan#instance-memory).  
16. In a Flex Consumption plan, the host doesn't enforce an execution time limit. However, there are currently no guarantees because the platform might need to terminate your instances during scale-in, deployments, or to apply updates.  
17. When the [minimum number of replicas](/azure/container-apps/scale-app#scale-definition) is set to zero, the default timeout depends on the specific triggers used in the app.
18. When the [minimum number of replicas](../articles/container-apps/scale-app.md#scale-definition) is set to one or more.
19. On Container Apps, you can set the [maximum number of replicas](/azure/container-apps/scale-app#scale-definition), which is honored as long as there's enough cores quota available.
