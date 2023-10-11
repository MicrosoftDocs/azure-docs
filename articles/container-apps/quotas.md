---
title: Quotas for Azure Container Apps
description: Learn about quotas for Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.date: 02/17/2023
ms.author: cshoe
---

# Quotas for Azure Container Apps

The following quotas are on a per subscription basis for Azure Container Apps.

To request an increase in quota amounts for your container app, learn [how to request a limit increase](faq.yml#how-can-i-request-a-quota-increase-) and [submit a support ticket](https://azure.microsoft.com/support/create-ticket/).

The *Is Configurable* column in the following tables denotes a feature maximum may be increased through a [support request](https://azure.microsoft.com/support/create-ticket/). For more information, see [how to request a limit increase](faq.yml#how-can-i-request-a-quota-increase-).

| Feature | Scope | Default | Is Configurable | Remarks |
|--|--|--|--|--|
| Environments | Region |  Up to 15 | Yes | Limit up to 15 environments per subscription, per region. |
| Environments | Global | Up to 20 | Yes | Limit up to 20 environments per subscription across all regions |
| Container Apps | Environment | Unlimited | n/a | |
| Revisions | Container app | 100 | No | |
| Replicas | Revision | 300 | Yes | |

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
|---|---|---|---|---|
| Cores | Replica | Up to maximum cores a workload profile supports | No | Maximum number of cores available to a revision replica. |
| Cores | Environment | 100 | Yes | Maximum number of cores all Dedicated workload profiles in a Dedicated plan environment can accommodate. Calculated by the sum of cores available in each node of all workload profile in a Dedicated plan environment. |
| Cores | General Purpose Workload Profiles | 100 | Yes | The total cores available to all general purpose (D-series) profiles within an environment. |
| Cores | Memory Optimized Workload Profiles | 50 | Yes | The total cores available to all memory optimized (E-series) profiles within an environment. |

For more information regarding quotas, see the [Quotas roadmap](https://github.com/microsoft/azure-container-apps/issues/503) in the Azure Container Apps GitHub repository.

> [!NOTE]
> For GPU enabled workload profiles, you need to request capacity via a [support ticket](https://azure.microsoft.com/support/create-ticket/).

> [!NOTE]
> [Free trial](https://azure.microsoft.com/offers/ms-azr-0044p) and [Azure for Students](https://azure.microsoft.com/free/students/) subscriptions are limited to one environment per subscription globally and ten (10) cores per environment.

## Considerations

* If an environment runs out of allowed cores:
  * Provisioning times out with a failure
  * The app may be restricted from scaling out
* If you encounter unexpected capacity limits, open a support ticket
