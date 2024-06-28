---
title: Quotas for Azure Container Apps
description: Learn about quotas for Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 02/17/2023
ms.author: cshoe
---

# Quotas for Azure Container Apps

The following quotas are on a per subscription basis for Azure Container Apps.

You can [request a quota increase in the Azure portal](/azure/quotas/quickstart-increase-quota-portal).

The *Is Configurable* column in the following tables denotes a feature maximum may be increased. For more information, see [how to request a limit increase](faq.yml#how-can-i-request-a-quota-increase-).

| Feature | Scope | Default Quota | Is Configurable | Remarks |
|--|--|--|--|--|
| Environments | Region |  Up to 15 | Yes | Up to 15 environments per subscription, per region. |
| Environments | Global | Up to 20 | Yes | Up to 20 environments per subscription, across all regions. |
| Container Apps | Environment | Unlimited | n/a | |
| Revisions | Container app | Up to 100 | No | |
| Replicas | Revision | Unlimited | No | Maximum replicas configurable are 300 in Azure portal and 1000 in Azure CLI. There must also be enough cores quota available. |
| Session pools | Global | Up to 6 | Yes | Maximum number of dynamic session pools per subscription. |

## Consumption plan

| Feature | Scope | Default | Is Configurable | Remarks |
|--|--|--|--|--|
| Cores | Replica | 2 | No | Maximum number of cores available to a revision replica. |
| Cores | Environment | 100 | Yes | Maximum number of cores an environment can accommodate. Calculated by the sum of cores requested by each active replica of all revisions in an environment. |

## Workload Profiles Environments

### Consumption workload profile

| Feature | Scope | Default | Is Configurable | Remarks |
|--|--|--|--|--|
| Cores | Replica | 4 | No | Maximum number of cores available to a revision replica. |
| Cores | Environment | 100 | Yes | Maximum number of cores the Consumption workload profile in a Dedicated plan environment can accommodate. Calculated by the sum of cores requested by each active replica of all revisions in an environment. |

### Dedicated workload profiles

| Feature | Scope | Default | Is Configurable | Remarks |
|--|--|--|--|--|
| Cores | Subscription | 2000 | Yes  | Maximum number of dedicated workload profile cores within one subscription | 
| Cores | Replica | Up to maximum cores a workload profile supports | No | Maximum number of cores available to a revision replica. |
| Cores | General Purpose Workload Profiles | 100 | Yes | The total cores available to all general purpose (D-series) profiles within an environment. |
| Cores | Memory Optimized Workload Profiles | 50 | Yes | The total cores available to all memory optimized (E-series) profiles within an environment. |

For more information regarding quotas, see the [Quotas roadmap](https://github.com/microsoft/azure-container-apps/issues/503) in the Azure Container Apps GitHub repository.

> [!NOTE]
> For GPU enabled workload profiles, you need to request capacity via a [request for a quota increase in the Azure portal](/azure/quotas/quickstart-increase-quota-portal).

> [!NOTE]
> [Free trial](https://azure.microsoft.com/offers/ms-azr-0044p) and [Azure for Students](https://azure.microsoft.com/free/students/) subscriptions are limited to one environment per subscription globally and ten (10) cores per environment.

## Considerations

* If an environment runs out of allowed cores:
  * Provisioning times out with a failure
  * The app may be restricted from scaling out
* If you encounter unexpected capacity limits, open a support ticket
