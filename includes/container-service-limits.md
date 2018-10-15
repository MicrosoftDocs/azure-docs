---
title: include file
description: include file
services: container-service
author: dlepow

ms.service: container-service
ms.topic: include
ms.date: 10/11/2018
ms.author: danlep
ms.custom: include file
---

| Resource | Default limit |
| --- | :--- |
| Max clusters per subscription | 100 |
| Max nodes per cluster | 100 |
| Max pods per node: [Basic networking][basic-networking] with Kubenet | 110 |
| Max pods per node: [Advanced networking][advanced-networking] with Azure CNI | Azure CLI deployment: 30<sup>1</sup><br />Resource Manager template: 30<sup>1</sup><br />Portal deployment: 30 |

<sup>1</sup> When you deploy an AKS cluster with the Azure CLI or a Resource Manager template, this value is configurable up to **110 pods per node**. You can't configure max pods per node after you've already deployed an AKS cluster, or if you deploy a cluster using the Azure portal.<br />

<!-- LINKS - Internal -->
[basic-networking]: ../articles/aks/networking-overview.md#basic-networking
[advanced-networking]: ../articles/aks/networking-overview.md#advanced-networking

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
