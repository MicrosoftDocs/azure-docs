---
title: Quotas, SKU, and region availability in Azure Kubernetes Service (AKS)
description: Learn about the default quotas, restricted node VM SKU sizes, and region availability of the Azure Kubernetes Service (AKS).
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 04/09/2019
ms.author: iainfou
---
# Quotas, virtual machine size restrictions, and region availability in Azure Kubernetes Service (AKS)

All Azure services include certain default limits and quotas for resources and features. For the node size, certain virtual machine (VM) SKUs are then restricted for use.

This article details the default resource limits for Azure Kubernetes Service (AKS) resources, as well as the availability of the AKS service in Azure regions.

## Service quotas and limits

[!INCLUDE [container-service-limits](../../includes/container-service-limits.md)]

## Provisioned infrastructure

All other network, compute, and storage limitations apply to the provisioned infrastructure. See [Azure subscription and service limits](../azure-subscription-service-limits.md) for the relevant limits.

## Restricted VM sizes

Each node in an AKS cluster contains a fixed amount of compute resources such as vCPU and memory. If an AKS node contains insufficient compute resources, pods may fail to run correctly. To ensure that the required *kube-system* pods and your applications can reliably be scheduled, the following VM SKUs can't be used in AKS:

- Standard_A0
- Standard_A1
- Standard_A1_v2
- Standard_B1s
- Standard_B1ms
- Standard_F1
- Standard_F1s

For more information on VM types and their compute resources, see [Sizes for virtual machines in Azure][vm-skus].

## Region availability

For the latest list of where you can deploy and run clusters, see [AKS region availability][region-availability].

## Next steps

Certain default limits and quotas can be increased. To request an increase of one or more resources that support such an increase, submit an [Azure support request][azure-support] (select "Quota" for **Issue type**).

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
[region-availability]: https://azure.microsoft.com/en-us/global-infrastructure/services/?products=kubernetes-service

<!-- LINKS - Internal -->
[vm-skus]: ../virtual-machines/linux/sizes.md
