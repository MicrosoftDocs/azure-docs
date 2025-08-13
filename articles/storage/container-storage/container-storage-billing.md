---
title: Understand Billing for Azure Container Storage
description: Understand the billing and pricing model for Azure Container Storage, including backing storage costs and applicable service fees for orchestration.
author: khdownie
ms.service: azure-container-storage
ms.date: 08/13/2025
ms.author: kendownie
ms.topic: concept-article
# Customer intent: "As a cloud solutions architect, I want to understand the pricing model for Azure Container Storage, so that I can accurately estimate costs based on backing storage options and service fees for different deployment scenarios."
---

# Understand Azure Container Storage billing

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This article describes the billing and pricing model for Azure Container Storage. It also presents some examples to help you understand the pricing for Azure Container Storage used with different backing storage options.

> [!NOTE]
> This article applies to Azure Container Storage v2.0.0 and above. For information about billing for prior releases, see [this article](container-storage-billing-v1.md).

## Azure Container Storage pricing model

Azure Container Storage pricing is composed of two components:

1. The cost of the **backing storage resources** you choose: local NVMe Disk.
1. A **service fee** for Azure Container Storage orchestration. It's free with Azure Container Storage.

## Azure Container Storage with local NVMe Disk

If you use local NVMe disks on your AKS cluster nodes, there are no extra charges for backing storage. The cost of local NVMe disks is included in your Azure Kubernetes Service virtual machine (VM) pricing. Therefore, using Azure Container Storage with Ephemeral Disk doesn't incur extra costs.

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
- [Azure Container Storage Pricing](https://aka.ms/AzureContainerStoragePricingPage)
- [Azure Container Storage v1 billing](container-storage-billing.md)