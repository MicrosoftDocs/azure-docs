---
title: Understand billing for Azure Container Storage
description: Understand the billing and pricing model for Azure Container Storage, including backing storage costs and applicable service fees for orchestration.
author: khdownie
ms.service: azure-container-storage
ms.date: 07/09/2024
ms.author: kendownie
ms.topic: conceptual
---

# Understand Azure Container Storage billing

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This article describes the billing and pricing model for Azure Container Storage. It also presents some examples to help you understand the pricing for Azure Container Storage used with different backing storage options.

## Azure Container Storage pricing model

Azure Container Storage pricing is comprised of two components:

1. The cost of the **backing storage resources** you choose: Azure Disks, Ephemeral Disk, or Azure Elastic SAN.
1. A **service fee** for Azure Container Storage orchestration. This fee only applies to storage pools larger than 5 TiB. If the storage pool is less than 5 TiB, there is no service fee. If the storage pool is greater than 5 TiB, the storage fee is based on the amount by which the storage pool capacity exceeds 5 TiB. For example, if you deploy a 9 TiB storage pool, the service fee will be calculated on 4 TiB.

The amount of the Azure Container Storage service fee (if applicable) varies by target region. See [Azure Container Storage Pricing](https://aka.ms/AzureContainerStoragePricingPage) for details.

> [!NOTE]
> If your Azure Container Storage deployment isn't in the **Active** state, for example if you've stopped the Azure Kubernetes Service (AKS) cluster on which Azure Container Storage is installed, the service fee won't apply. However, you'll still be charged for the backing storage.

## Azure Container Storage with Azure Disks

Here are two use case scenarios with Azure Disks as the backing storage resource.

Let's say you want to deploy Azure Container Storage with a storage pool capacity of 4 TiB, using one 4 TiB P50 Premium SSD managed disk with locally redundant storage (LRS) as the backing storage option. The price breakdown is as follows. Notice that there's no service fee for Azure Container Storage orchestration because the storage pool is less than 5 TiB. Only the cost for the backing storage (Premium SSD) applies.

| **Cost type** | **Deployment** | **Price**                 |
|---------------|----------------|---------------------------|
| Service fee   | 4 TiB          | $0 (storage pool < 5 TiB) |
| Storage costs | One 4 TiB P50 Premium SSD managed disk, East US (LRS) | Price of P50 Premium Disk (LRS) |

Now, let's say you want to deploy Azure Container Storage with a storage pool capacity of 9 TiB using a Premium SSD v2 disk. In this case, there's a service fee for Azure Container Storage orchestration because the storage pool is greater than 5 TiB. The service fee is calculated on 4 TiB (the difference between 9 TiB and 5 TiB).

| **Cost type** | **Deployment** | **Price**                 |
|---------------|----------------|---------------------------|
| Service fee   | 9 TiB          | 4 * 1024 * Azure Container Storage service fee per GiB |
| Storage costs | Premium SSD v2 managed disk, East US (LRS) | Price of 9 TiB Premium SSD v2 |

See [Azure Managed Disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/).

## Azure Container Storage with Ephemeral Disk

If you're using ephemeral disks on your AKS cluster nodes, you won't be charged for backing storage, as this is already included as part of your AKS virtual machine (VM) costs. If you deploy storage pools greater than 5 TiB in capacity, you'll be charged the Azure Container Storage service fee. Otherwise, the cost to use Azure Container Storage with Ephemeral Disk is zero.

## Azure Container Storage with Azure Elastic SAN

In this example, you deploy a 9 TiB storage pool capacity backed by Azure Elastic SAN in the East US region with LRS. In this case, there's a service fee for Azure Container Storage orchestration because the storage pool is greater than 5 TiB. The service fee is calculated on 4 TiB (the difference between 9 TiB and 5 TiB).

| **Cost type** | **Deployment** | **Price**                 |
|---------------|----------------|---------------------------|
| Service fee   | 9 TiB          | 4 * 1024 * Azure Container Storage service fee per GiB |
| Storage costs | Azure Elastic SAN, East US (LRS) | Price of 9 TiB Azure Elastic SAN |

See [Azure Elastic SAN pricing](https://azure.microsoft.com/pricing/details/elastic-san/).

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
- [Azure Container Storage Pricing](https://aka.ms/AzureContainerStoragePricingPage)
