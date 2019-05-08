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
| Maximum clusters per subscription | 100 |
| Maximum nodes per cluster | 100 |
| Maximum pods per node: [Basic networking][basic-networking] with Kubenet | 110 |
| Maximum pods per node: [Advanced networking][advanced-networking] with Azure Container Networking Interface | Azure CLI deployment: 30<sup>1</sup><br />Azure Resource Manager template: 30<sup>1</sup><br />Portal deployment: 30 |

<sup>1</sup>When you deploy an Azure Kubernetes Service (AKS) cluster with the Azure CLI or a Resource Manager template, this value is configurable up to 250 pods per node. You can't configure maximum pods per node after you've already deployed an AKS cluster, or if you deploy a cluster by using the Azure portal.<br />

<!-- LINKS - Internal -->
[basic-networking]: ../articles/aks/concepts-network.md#kubenet-basic-networking
[advanced-networking]: ../articles/aks/concepts-network.md#azure-cni-advanced-networking

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
