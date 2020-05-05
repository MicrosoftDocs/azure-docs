---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/04/2020	
ms.author: glenga
---
<sup>1</sup> For specific limits for the various App Service plan options, see the [App Service plan limits](../articles/azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits).  
<sup>2</sup> By default, the timeout for the Functions 1.x runtime in an App Service plan is unbounded.  
<sup>3</sup> Requires the App Service plan be set to [Always On](../articles/azure-functions/functions-scale.md#always-on). Pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/).  
<sup>4</sup> These limits are [set in the host](https://github.com/Azure/azure-functions-host/blob/dev/src/WebJobs.Script.WebHost/web.config).  
<sup>5</sup> The actual number of function apps that you can host depends on the activity of the apps, the size of the machine instances, and the corresponding resource utilization.  
<sup>6</sup> The storage limit is the total content size in temporary storage across all apps in the same App Service plan. Consumption plan uses Azure Files for temporary storage.  
<sup>7</sup> When your function app is hosted in a [Consumption plan](../articles/azure-functions/functions-scale.md#consumption-plan), only the CNAME option is supported. For function apps in a [Premium plan](../articles/azure-functions/functions-scale.md#premium-plan) or an [App Service plan](../articles/azure-functions/functions-scale.md#app-service-plan), you can map a custom domain using either a CNAME or an A record.  
<sup>8</sup> Guaranteed for up to 60 minutes.