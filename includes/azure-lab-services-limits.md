---
author: RoseHJM
ms.author: rosemalcolm
ms.service: lab-services
ms.topic: include
ms.date: 09/02/2022
---

The following limits are for the number of Azure Lab Services resources. 

#### Per Subscription

| Resource type | Limit |
|------|-------|
| Labs | 900 | 

#### Per resource group

| Resource type | Limit |
|------|-------|
| Labs | 800 | 
| Lab plans | 800 |

#### Per region

| Subscription type | Type | Limit |
|------|------|-------|
| Enterprise | Labs | 500 | 
| Sponsored, Azure Pass, Free Trial and Azure for Student subscriptions | Lab plans | 100 |

#### Per lab

| Resource type | Limit |
|------|-------|
| Schedules | 250 | 
| Virtual machines (VMs) | 600<sup>1</sup> |

<sup>1</sup> Limit for VMs with custom templates. See [Virtual machine scale sets limits](../articles/azure-resource-manager/management/azure-subscription-service-limits.md#virtual-machine-scale-sets-limits).


For more information about Azure Lab Services capacity limits, see [Capacity limits in Azure Lab Services](../articles/lab-services/capacity-limits.md).

Contact support to request an increase your limit. <!-- Add when new article is published For more information, see [Request a core limit increase](../articles/lab-services/how-to-request-capacity-increase.md). -->