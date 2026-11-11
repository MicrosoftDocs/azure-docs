---
title: Understand Azure Container Storage Billing
description: Understand the billing and pricing model for Azure Container Storage, including backing storage costs and applicable service fees for orchestration.
author: khdownie
ms.service: azure-container-storage
ms.date: 10/07/2026
ms.author: kendownie
ms.topic: concept-article
# Customer intent: "As a cloud solutions architect, I want to understand the billing and pricing model for Azure Container Storage, so that I can accurately estimate costs based on backing storage options and service fees for different deployment scenarios."
---

# Understand Azure Container Storage billing

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This article describes the billing and pricing model for Azure Container Storage.

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). For earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md). For information about billing for prior releases, see [this article](container-storage-billing-version-1.md).

## Azure Container Storage pricing model

Azure Container Storage doesn’t add any service, orchestration, or distributed accelerator for cloud storage (DACS) software fees. You pay for the underlying Azure resources you use.

- Local NVMe capacity is included in your Azure Kubernetes Service (AKS) virtual machine pricing.
- Azure Elastic SAN is billed at its standard resource rates.
- Distributed accelerator for cloud storage uses customer-selected Azure VMs with local NVMe. Standard Azure VM, Azure Blob Storage, networking, monitoring, and related resource charges apply.

Distributed accelerator for cloud storage can reduce repeated Blob reads, but savings depend on cache-hit ratio, workload behavior, VM topology, and network path.

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
- [Azure Container Storage pricing](https://aka.ms/AzureContainerStoragePricingPage)
- [Azure Container Storage version (1.x.x) billing](container-storage-billing-version-1.md)