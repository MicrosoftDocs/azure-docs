---
title: Frequently asked questions (FAQ) for Azure Container Storage Preview
description: Get answers to Azure Container Storage frequently asked questions.
author: khdownie
ms.service: azure-container-storage
ms.date: 03/21/2024
ms.author: kendownie
ms.topic: conceptual
ms.custom: references_regions
---

# Frequently asked questions (FAQ) about Azure Container Storage Preview

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers.

## General questions

* <a id="azure-container-storage-vs-csi-drivers"></a>
  **What's the difference between Azure Container Storage and Azure CSI drivers?**  
  Azure Container Storage is built natively for containers and provides a storage solution that's optimized for creating and managing volumes for running production-scale stateful container applications. Other Azure CSI drivers provide a standard storage solution that can be used with different container orchestrators and support the specific type of storage solution per CSI driver definition.

* <a id="azure-container-storage-regions"></a>
  **In which Azure regions is Azure Container Storage available?**  
  [!INCLUDE [container-storage-regions](../../../includes/container-storage-regions.md)]

* <a id="storage-pool-parameters"></a>
  **What parameters can I specify for the storage pool that's created when Azure Container Storage is installed with the `az aks create` command?**  
  The following table lists the mandatory and optional storage pool parameters, along with their default values.
  [!INCLUDE [container-storage-storage-pool-parameters](../../../includes/container-storage-storage-pool-parameters.md)]

* <a id="azure-container-storage-limitations"></a>
  **Which other Azure services does Azure Container Storage support?**  
  Currently, Azure Container Storage supports only Azure Kubernetes Service (AKS) with storage pools provided by Azure Disks, Ephemeral Disk, or Azure Elastic SAN.

* <a id="azure-container-storage-rwx"></a>
  **Does Azure Container Storage support read-write-many (RWX) workloads?**  
  Azure Container Storage doesn't support RWX workloads. However, Azure's first-party Files and Blob CSI drivers are great alternatives and fully supported.

* <a id="azure-container-storage-autoupgrade"></a>
  **Is there any performance impact when upgrading to a new version of Azure Container Storage?**  
  If you leave autoupgrade turned on (recommended), you might experience temporary I/O latency during the upgrade process. If you turn off autoupgrade and install the new version manually, there won't be any impact; however, you won't get the benefit of automatic upgrades and instant access to new features.

* <a id="azure-container-storage-remove"></a>
  **How do I remove Azure Container Storage?**  
  See [Remove Azure Container Storage](remove-container-storage.md).

## Billing and pricing

* <a id="azure-container-storage-extension-operation-failed"></a>
  **How much does Azure Container Storage cost to use?**  
  See the [Azure Container Storage pricing page](https://aka.ms/AzureContainerStoragePricingPage).

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
