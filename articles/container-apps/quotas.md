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

| Feature | Scope | Default | Is Configurable<sup>1</sup> | Remarks |
|--|--|--|--|--|
| Environments | Region |  Up to 15 | Yes | Limit up to 15 environments per subscription, per region.<br><br>For example, if you deploy to three regions you can get up to 45 environments for a single subscription. |
| Container Apps | Environment | Unlimited | Yes | |
| Revisions | Container app | 100 | No | |
| Replicas | Revision | 30 | Yes | |
| Cores | Replica | 2 | No | Maximum number of cores that can be requested by a revision replica. |
| Cores | Environment | 40 | Yes | Maximum number of cores an environment can accommodate. Calculated by the sum of cores requested by each active replica of all revisions in an environment. |

For more information regarding quotas, see the [Quotas Roadmap](https://github.com/microsoft/azure-container-apps/issues/503) in the Azure Container Apps GitHub repository.

> [!NOTE]
> [Free trial](https://azure.microsoft.com/offers/ms-azr-0044p) and [Azure for Students](https://azure.microsoft.com/free/students/) subscriptions are limited to one environment per subscription  globally.

<sup>1</sup> The **Is Configurable** column denotes that a feature maximum may be increased through a [support request](https://azure.microsoft.com/support/create-ticket/). For more information, see [how to request a limit increase](faq.yml#how-can-i-request-a-quota-increase-).

## Considerations

* If an environment runs out of allowed cores:
  * Provisioning times out with a failure
  * The app may be restricted from scaling out
