---
title: Quotas for Azure Container Apps
description: Learn about quotas for Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.date: 10/25/2022
ms.author: cshoe
---

# Quotas for Azure Container Apps

The following quotas are on a per subscription basis for Azure Container Apps.

To request an increase in quota amounts for your container app, [submit a support ticket](https://azure.microsoft.com/support/create-ticket/).

| Feature | Scope | Default | Is Configurable<sup>1</sup> | Remarks |
|--|--|--|--|--|
| Environments | Region | 5 | Yes | |
| Container Apps | Environment | 20 | Yes | |
| Revisions | Container app | 100 | No | |
| Replicas | Revision | 30 | Yes | |
| Cores | Replica | 2 | No | Maximum number of cores that can be requested by a revision replica. |
| Cores | Environment | 20 | Yes | Maximum number of cores an environment can accommodate. Calculated by the sum of cores requested by each active replica of all revisions in an environment. |

<sup>1</sup> The **Is Configurable** column denotes that a feature maximum may be increased through a [support request](https://azure.microsoft.com/support/create-ticket/).

## Considerations

* If an environment runs out of allowed cores:
  * Provisioning times out with a failure
  * The app silently refuses to scale out
