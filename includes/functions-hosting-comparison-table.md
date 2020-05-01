---
author: rogeriohc
ms.service: azure-functions
ms.topic: include
ms.date: 04/27/2020	
ms.author: rogerioc
---
### Plan summary

|[Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan)|[Premium plan](../articles/azure-functions/functions-scale.md#premium-plan)|[Dedicated (App Service) plan](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup>|[Isolated Service Plan (App Service Environment)](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup>|[Kubernetes](../articles/aks/quotas-skus-regions.md)|
| --- | --- | --- | --- | --- |
|Scale automatically and only pay for compute resources when your functions are running. On the Consumption plan, instances of the Functions host are dynamically added and removed based on the number of incoming events. <ul><li>Default hosting plan</li><li>Pay only when your functions are running.</li><li>Scale out automatically, even during periods of high load</li></ul>|While automatically scaling based on demand, use pre-warmed workers to run applications with no delay after being idle, run on more powerful instances, and connect to VNETs. Consider the Azure Functions Premium plan in the following situations,  in addition to all features of the App Service plan: <ul><li>Your function apps run continuously, or nearly continuously.</li><li>You have a high number of small executions and have a high execution bill but low GB second bill in the Consumption plan.</li><li>You need more CPU or memory options than what is provided by the Consumption plan.</li><li>Your code needs to run longer than the maximum execution time allowed on the Consumption plan.</li><li>You require features that are only avail [able on a Premium plan, such as virtual network connectivity.</li></ul>|Run your functions within an App Service plan at regular App Service plan rates. Good fit for long running operations, as well as when more predictive scaling and costs are required. Consider an App Service plan in the following situations:<ul><li>You have existing, underutilized VMs that are already running other App Service instances.</li><li>You want to provide a custom image on which to run your functions.</li></ul>|The Azure App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for securely running App Service apps at high scale. App Service environments (ASEs) are appropriate for application workloads that require: <ul><li>Very high scale.</li><li>Isolation and secure network access.</li><li>High memory utilization.</li></ul>|Kubernetes (recommended in [AKS](../../aks/intro-kubernetes.md)) provides a fully isolated and dedicated environment running on top of the Kubernetes platform.  Kubernetes is appropriate for application workloads that require: <ul><li>Custom hardware requirements.</li><li>Isolation and secure network access.</li><li>Ability to run in hybrid or multi-cloud environment.</li><li>Run alongside existing Kubernetes applications and services.</li></ul>|

### Operating System/Runtime

|  | [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan) | [Premium plan](../articles/azure-functions/functions-scale.md#premium-plan) | [Dedicated (App Service) plan](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> | [Isolated Service Plan (App Service Environment)](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> | [Kubernetes](../articles/aks/quotas-skus-regions.md) |
| --- | --- | --- | --- | --- | --- |
|**Linux: code-only**<br/>Linux is the only supported operating system for the Python runtime stack.  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>Python</li></ul>  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>Python</li></ul> |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>Python</li></ul>  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>Python</li></ul> |n/a  |
| **Windows: code-only**<br/>Windows is the only supported operating system for the PowerShell runtime stack.  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li></ul> |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li></ul> |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li></ul> |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li></ul> |n/a  |
| **Linux: Docker container**<br/> Linux is the only supported operating system for Docker containers.  |No support.  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li><li>Python</li></ul>  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li><li>Python</li></ul> |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li><li>Python</li></ul>  |<ul><li>.NET Core</li><li>Node.js</li><li>Java</li><li>PowerShell Core</li><li>Python</li></ul>  |
| **Windows: Docker container**. |No support.  |No support.  |No support.  |No support.  |No support.  |

### Scale
| | [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan) | [Premium plan](../articles/azure-functions/functions-scale.md#premium-plan) | [Dedicated (App Service) plan](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> | [Isolated Service Plan (App Service Environment)](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> | [Kubernetes](../articles/aks/quotas-skus-regions.md) |
| --- | --- | --- | --- | --- | --- |
| Scale out | Event driven. Scale out automatically, even during periods of high load. Azure Functions infrastructure scales CPU and memory resources by adding additional instances of the Functions host, based on the number of events that its functions are triggered on. | Event driven. Scale out automatically, even during periods of high load. Azure Functions infrastructure scales CPU and memory resources by adding additional instances of the Functions host, based on the number of events that its functions are triggered on. | Manual/autoscale | Manual/autoscale | [KEDA](https://keda.sh) - Kubernetes-based event driven autoscale |
| Max instances | 200 | 100 | 10-20 | 100| Depends on cluster |

### Cold Start

| [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan) | [Premium plan](../articles/azure-functions/functions-scale.md#premium-plan) | [Dedicated (App Service) plan](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> | [Isolated Service Plan (App Service Environment)](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> | [Kubernetes](../articles/aks/quotas-skus-regions.md) |
| --- | --- | --- | --- | --- |
| Instead of starting from scratch every time, we’ve implemented a way to keep a pool of servers warm and draw workers from that pool. What this means is that at any point in time there are idle workers that have been preconfigured with the Functions runtime up and running. Making these “pre-warmed sites” happen has given us measurable  improvements on our cold start times.  | Perpetually warm instances to avoid any cold start. | When using Azure Functions in the dedicated plan, the Functions host is always running, which means that cold start isn’t really an issue. |When using Azure Functions in the dedicated plan, the Functions host is always running, which means that cold start isn’t really an issue. | Depends on KEDA configuration. Apps can be configured to always run and never have cold start, or configured to scale to zero which would cause cold start on new events. |

### Features limits

| Feature | [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan) | [Premium plan](../articles/azure-functions/functions-scale.md#premium-plan) | [Dedicated (App Service) plan](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> | [Isolated Service Plan (App Service Environment)](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> | [Kubernetes](../articles/aks/quotas-skus-regions.md) |
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

### Advanced features limits

| Feature | [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan) | [Premium plan](../articles/azure-functions/functions-scale.md#premium-plan) | [Dedicated (App Service) plan](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> | [Isolated Service Plan (App Service Environment)](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> | [Kubernetes](../articles/aks/quotas-skus-regions.md) |
| --- | --- | --- | --- | --- | --- |
| Inbound IP restrictions & private site access |Yes |Yes |Yes | Yes | Yes |
| Virtual network integration |No |Yes (Regional) |Yes (Regional and Gateway) | Yes | Yes |
| Virtual network triggers (non-HTTP) |Yes |Yes |Yes | Yes | Yes |
| Hybrid connections (Windows only) |No |Yes |Yes | Yes | Yes |
| Outbound IP restrictions |No |No |Yes | Yes | Yes |
| Regional virtual network integration |No |Yes |Yes | Yes | Yes |

### Billing

| [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan) | [Premium plan](../articles/azure-functions/functions-scale.md#premium-plan) | [Dedicated (App Service) plan](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> | [Isolated Service Plan (App Service Environment)](../articles/azure-functions/functions-scale.md#app-service-plan)<sup>1</sup> | [Kubernetes](../articles/aks/quotas-skus-regions.md) |
| --- | --- | --- | --- | --- |
|Pay only when your functions are running. Billing is based on number of executions, execution time, and memory used. |More predictable pricing. Premium plan is based on the number of core seconds and memory used across needed and pre-warmed instances. At least one instance must be warm at all times per plan. |You pay the same for function apps in an App Service Plan as you would for other App Service resources, like web apps. | There is a flat monthly rate for an ASE that pays for the infrastructure and doesn't change with the size of the ASE. In addition, there is a cost per App Service plan vCPU. All apps hosted in an ASE are in the Isolated pricing SKU. |User would be paying for AKS.  Functions just run as an application workload on top of their cluster - potentially alongside other apps. |  

<sup>1</sup> For specific limits for the various App Service plan options, see the [App Service plan limits](../articles/azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits).  
<sup>2</sup> By default, the timeout for the Functions 1.x runtime in an App Service plan is unbounded.  
<sup>3</sup> Requires the App Service plan be set to [Always On](../articles/azure-functions/functions-scale.md#always-on). Pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/).  
<sup>4</sup> These limits are [set in the host](https://github.com/Azure/azure-functions-host/blob/dev/src/WebJobs.Script.WebHost/web.config).  
<sup>5</sup> The actual number of function apps that you can host depends on the activity of the apps, the size of the machine instances, and the corresponding resource utilization.  
<sup>6</sup> The storage limit is the total content size in temporary storage across all apps in the same App Service plan. Consumption plan uses Azure Files for temporary storage.  
<sup>7</sup> When your function app is hosted in a [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan), only the CNAME option is supported. For function apps in a [Premium plan](../articles/azure-functions/functions-scale.md#premium-plan) or an [App Service plan](../articles/azure-functions/functions-scale.md#app-service-plan), you can map a custom domain using either a CNAME or an A record.  
<sup>8</sup> Guaranteed for up to 60 minutes.
