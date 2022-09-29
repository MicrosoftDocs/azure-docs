---
title: Quotas for Azure Container Apps
description: Learn about quotas for Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.date: 09/26/2022
ms.author: cshoe
---

# Quotas for Azure Container Apps

The following quotas are on a per subscription basis for Azure Container Apps.

To request an increase in quota amounts for your container app, [submit a support ticket](https://azure.microsoft.com/support/create-ticket/).

| Feature | Scope | Consumption Default | Premium Default | Is Configurable<sup>1</sup> | Remarks |
|--|--|--|--|--|--|
| Environments | For a subscription per region | 5 | 5| Yes | |
| Container Apps | Environment | 20 | 50 | Yes | |
| Revisions | Container app | 100 | 100 | No | |
| Replicas | Revision | 30 | 30 | Yes | |
| Cores | Replica | 2 | Varies by workload profile | No | Maximum number of cores that can be requested by a revision replica. |
| Cores | Environment | 20 | 50 | Yes | Calculated by the total cores an environment can accommodate. For instance, the sum of cores requested by each active replica of all revisions in an environment. |

<sup>1</sup> The **Is Configurable** column denotes that a feature maximum may be increased through a [support request](https://azure.microsoft.com/support/create-ticket/).

> [!NOTE]
> The number of cores is not configurable via an override request under the Consumption plan. If you need additional cores, refer to the Premium plan.

## Considerations

* Pay-as-you-go and trial subscriptions are limited to 1 environment per region per subscription.
* If an environment runs out of allowed cores:
  * Provisioning times out with a failure
  * The app silently refuses to scale out
