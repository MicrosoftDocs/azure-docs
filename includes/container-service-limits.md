---
title: include file
description: include file
services: container-service
author: mmacy

ms.service: container-service
ms.topic: include
ms.date: 08/31/2018
ms.author: marsma
ms.custom: include file
---

| Resource | Default limit |
| --- | :--- |
| Max clusters per subscription | 100 |
| Max nodes per cluster | 100 |
| Max pods per node: [Basic networking][basic-networking] with Kubenet | 110 |
| Max pods per node: [Advanced networking][advanced-networking] with Azure CNI | Azure CLI deployment: 110<sup>1</sup><br />Resource Manager template: 110<sup>1</sup><br />Portal deployment: 30 |

<sup>1</sup> This value is configurable at cluster deployment when deploying an AKS cluster with the Azure CLI or a Resource Manager template.<br />

<!-- LINKS - Internal -->
[basic-networking]: ../articles/aks/concepts-network.md#basic-networking
[advanced-networking]: ../articles/aks/concepts-network.md#advanced-networking

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
