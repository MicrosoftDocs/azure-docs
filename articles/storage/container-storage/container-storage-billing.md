---
title: Understand Azure Container Storage Billing
description: Understand the billing and pricing model for Azure Container Storage, including backing storage costs and applicable service fees for orchestration.
author: khdownie
ms.service: azure-container-storage
ms.date: 09/03/2025
ms.author: kendownie
ms.topic: concept-article
# Customer intent: "As a cloud solutions architect, I want to understand the billing and pricing model for Azure Container Storage, so that I can accurately estimate costs based on backing storage options and service fees for different deployment scenarios."
---

# Understand Azure Container Storage billing

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This article describes the billing and pricing model for Azure Container Storage.

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). For earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md). For information about billing for prior releases, see [this article](container-storage-billing-version-1.md).

## Azure Container Storage pricing model

Because Azure Container Storage (version 2.x.x) currently only supports local NVMe disk, there are no extra charges for backing storage. The cost of local NVMe disks is included in your Azure Kubernetes Service (AKS) virtual machine pricing. There's no service fee for orchestration.

## Azure Container Storage with local NVMe Disk

If you use local NVMe disks on your AKS cluster nodes, using Azure Container Storage (version 2.x.x) doesn't incur extra costs.

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
- [Azure Container Storage pricing](https://aka.ms/AzureContainerStoragePricingPage)
- [Azure Container Storage version (1.x.x) billing](container-storage-billing-version-1.md)