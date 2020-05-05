---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/04/2020	
ms.author: glenga
---
| Resource |[Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan)|[Premium plan](../articles/azure-functions/functions-scale.md#premium-plan)|[Dedicated plan](../articles/azure-functions/functions-scale.md#app-service-plan)|[ASE](../articles/app-service/environment/intro.md)| [Kubernetes](../articles/aks/quotas-skus-regions.md) |
| --- | --- | --- | --- | --- | --- |
|Default [timeout duration](../articles/azure-functions/functions-scale.md#timeout) (min) |5 | 30 |30<sup>2</sup> | 30 | 30 |
|Max [timeout duration](../articles/azure-functions/functions-scale.md#timeout) (min) |10 | unbounded<sup>8</sup> | unbounded<sup>3</sup> | unbounded | unbounded |
| Max outbound connections (per instance) | 600 active (1200 total) | unbounded | unbounded | unbounded | unbounded |
| Max request size (MB)<sup>4</sup> | 100 | 100 | 100 | 100 | Depends on cluster |
| Max query string length<sup>4</sup> | 4096 | 4096 | 4096 | 4096 | Depends on cluster |
| Max request URL length<sup>4</sup> | 8192 | 8192 | 8192 | 8192 | Depends on cluster |
|[ACU](../articles/virtual-machines/windows/acu.md) per instance | 100 | 210-840 | 100-840 |Workers are roles that host customer apps. Workers are available in three fixed sizes: One vCPU/3.5 GB RAM; Two vCPU/7 GB RAM; Four vCPU/14 GB RAM | [AKS pricing](https://azure.microsoft.com/pricing/details/container-service/) |
| Max memory (GB per instance) | 1.5 | 3.5-14 | 1.75-14 | 3.5 - 14 | Any node is supported |
| Function apps per plan |100 |100 |unbounded<sup>5</sup> | unbounded | unbounded |
| [App Service plans](../articles/app-service/overview-hosting-plans.md) | 100 per [region](https://azure.microsoft.com/global-infrastructure/regions/) |100 per resource group |100 per resource group | - | - |
| Storage<sup>6</sup> |1 GB |250 GB |50-1000 GB | 1 TB | n/a |
| Custom domains per app</a> |500<sup>7</sup> |500 |500 | 500 | n/a |
| Custom domain [SSL support](../articles/app-service/configure-ssl-bindings.md) |unbounded SNI SSL connection included | unbounded SNI SSL and 1 IP SSL connections included |unbounded SNI SSL and 1 IP SSL connections included | unbounded SNI SSL and 1 IP SSL connections included | n/a |

