---
title: Quotas for Azure Container Apps
description: Learn about quotas for Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 07/02/2024
ms.author: cshoe
---

# Quotas for Azure Container Apps

The following quotas are on a per subscription basis for Azure Container Apps.

You can [request a quota increase in the Azure portal](/azure/quotas/quickstart-increase-quota-portal). Any time when the maximum quota is larger than the default quota you can request a quota increase. When requesting a quota increase make sure to pick type _Container Apps_. For more information, see [how to request a limit increase](faq.yml#how-can-i-request-a-quota-increase-).

| Feature | Scope | Default Quota | Maximum Quota | Remarks |
|--|--|--|--|--|
| Environments | Region | 15 | Unlimited | 15 environments per subscription, per region. Quota name: Managed Environment Count|
| Environments | Global | 20 | Unlimited | Up to 20 environments per subscription, across all regions. Quota name: ??? |
| Container Apps | Environment | Unlimited | Unlimited | |
| Revisions | Container app | Up to 100 | Unlimited | |
| Replicas | Revision | Unlimited | Unlimited | Maximum replicas configurable are 300 in Azure portal and 1000 in Azure CLI. There must also be enough cores quota available. |
| Session pools | Global | Up to 6 | 10,000 | Maximum number of dynamic session pools per subscription. Quota name: ??? |

## Consumption plan

| Feature | Scope | Default Quota | Maximum Quota | Remarks |
|--|--|--|--|--|
| Cores | Replica | 2 | 2 | Maximum number of cores available to a revision replica. |
| Cores | Environment | 100 | 10,000 | Maximum number of cores an environment can accommodate. Calculated by the sum of cores requested by each active replica of all revisions in an environment. Quota name: Managed Environment Consumption Cores |


## Workload Profiles Environments

### Consumption workload profile

| Feature | Scope | Default Quota | Maximum Quota | Remarks |
|--|--|--|--|--|
| Cores | Replica | 4 | 4 | Maximum number of cores available to a revision replica. |
| Cores | Environment | 100 | 100,000 | Maximum number of cores the Consumption workload profile in a Dedicated plan environment can accommodate. Calculated by the sum of cores requested by each active replica of all revisions in an environment. Quota name: ??? |

### Dedicated workload profiles

| Feature | Scope | Default Quota | Maximum Quota | Remarks |
|--|--|--|--|--|
| Cores | Subscription | 2,000 | Unlimited  | Maximum number of dedicated workload profile cores within one subscription | 
| Cores | Replica | Maximum cores a workload profile supports | Same as default quota | Maximum number of cores available to a revision replica. |
| Cores | General Purpose Workload Profiles | 100 | 100,000 | The total cores available to all general purpose (D-series) profiles within an environment. Maximum assumes appropriate network size. Quota name: Managed Environment General Purpose Cores |
| Cores | Memory Optimized Workload Profiles | 50 | 100,000 | The total cores available to all memory optimized (E-series) profiles within an environment. Maximum assumes appropriate network size. Quota name: Managed Environment Memory Optimized Cores |

> [!NOTE]
> For GPU enabled workload profiles, you need to request capacity via a [request for a quota increase in the Azure portal](/azure/quotas/quickstart-increase-quota-portal).

> [!NOTE]
> [Free trial](https://azure.microsoft.com/offers/ms-azr-0044p) and [Azure for Students](https://azure.microsoft.com/free/students/) subscriptions are limited to one environment per subscription globally and ten (10) cores per environment.

## Considerations

* If an environment runs out of allowed cores:
  * Provisioning times out with a failure
  * The app may be restricted from scaling out
* If you encounter unexpected capacity limits, open a support ticket
