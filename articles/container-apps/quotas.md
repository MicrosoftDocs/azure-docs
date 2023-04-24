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
| Environments | Region |  Up to 15 | Yes | Limit up to 15 environments per subscription, per region.<br><br>For example, if you deploy to three regions you can get up to 45 environments for a single subscription. |
| Container Apps | Environment | Unlimited | n/a | |
| Revisions | Container app | 100 | No | |
| Replicas | Revision | 300 | Yes | |

## Consumption plan

| Feature | Scope | Default | Is Configurable | Remarks |
|--|--|--|--|--|
| Cores | Replica | 2 | No | Maximum number of cores available to a revision replica. |
| Cores | Environment | 40 | Yes | Maximum number of cores an environment can accommodate. Calculated by the sum of cores requested by each active replica of all revisions in an environment. |

## Consumption + Dedicated plan structure

### Consumption workload profile

| Feature | Scope | Default | Is Configurable | Remarks |
|--|--|--|--|--|
| Cores | Replica | 4 | No | Maximum number of cores available to a revision replica. |
| Cores | Environment | 100 | Yes | Maximum number of cores the Consumption workload profile in a Consumption + Dedicated plan structure environment can accommodate. Calculated by the sum of cores requested by each active replica of all revisions in an environment. |

### Dedicated workload profiles

| Feature | Scope | Default | Is Configurable | Remarks |
|--|--|--|--|--|
| Cores | Replica | Up to maximum cores a workload profile supports | No | Maximum number of cores available to a revision replica. |
| Cores | Environment | 100 | Yes | Maximum number of cores all Dedicated workload profiles in a Consumption + Dedicated plan structure environment can accommodate. Calculated by the sum of cores available in each node of all workload profile in a Consumption + Dedicated plan structure environment. |

For more information regarding quotas, see the [Quotas roadmap](https://github.com/microsoft/azure-container-apps/issues/503) in the Azure Container Apps GitHub repository.

> [!NOTE]
> [Free trial](https://azure.microsoft.com/offers/ms-azr-0044p) and [Azure for Students](https://azure.microsoft.com/free/students/) subscriptions are limited to one environment per subscription  globally.

## Considerations

* If an environment runs out of allowed cores:
  * Provisioning times out with a failure
  * The app may be restricted from scaling out
