---
title: Frequently asked questions (FAQ) for Azure Container Storage
description: Get answers to Azure Container Storage frequently asked questions.
author: khdownie
ms.service: azure-container-storage
ms.date: 08/02/2023
ms.author: kendownie
ms.topic: conceptual
ms.custom: references_regions
---

# Frequently asked questions (FAQ) about Azure Container Storage
[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers.

## General questions

* <a id="azure-container-storage-vs-csi-drivers"></a>
  **What's the difference between Azure Container Storage and Azure CSI drivers?**  
  Azure Container Storage is built natively for containers and provides a storage solution that's optimized for creating and managing volumes for running production-scale stateful container applications. Other Azure CSI drivers provide a standard storage solution that can be used with different container orchestrators and support the specific type of storage solution per CSI driver definition.

* <a id="azure-container-storage-regions"></a>
  **In which Azure regions is Azure Container Storage available?**  
  Azure Container Storage Preview is only available in East US, East US 2, West US 2, West US 3, South Central US, Southeast Asia, Australia East, West Europe, North Europe, UK South, Sweden Central, and France Central. See [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products).

* <a id="azure-container-storage-preview-limitations"></a>
  **Which other Azure services does Azure Container Storage support?**  
  During public preview, Azure Container Storage supports only Azure Kubernetes Service (AKS) with storage pools provided by Azure Disks, Ephemeral Disk, or Azure Elastic SAN Preview.

* <a id="azure-container-storage-rwx"></a>
  **Does Azure Container Storage support read-write-many (RWX) workloads?**  
  Azure Container Storage Preview doesn't support RWX workloads. However, Azure's first-party Files and Blob CSI drivers are great alternatives and fully supported.

* <a id="azure-container-storage-delete-aks-resource-group"></a>
  **I've created an Elastic SAN storage pool, and I'm trying to delete my resource group where my AKS cluster is located and it's not working. Why?**  
  Sign in to the [Azure portal](https://portal.azure.com?azure-portal=true) and select **Resource groups**. Locate the resource group that AKS created (the resource group name starts with **MC_**). Select the SAN resource object within that resource group. Manually remove all volumes and volume groups. Then retry deleting the resource group that includes your AKS cluster.

* <a id="azure-container-storage-autoupgrade"></a>
  **Is there any performance impact when upgrading to a new version of Azure Container Storage?**  
  If you leave autoupgrade turned on (recommended), you might experience temporary I/O latency during the upgrade process. If you turn off autoupgrade and install the new version manually, there won't be any impact; however, you won't get the benefit of automatic upgrades and instant access to new features.

* <a id="azure-container-storage-remove"></a>
  **How do I remove Azure Container Storage?**  
  See [Remove Azure Container Storage](remove-container-storage.md).

* <a id="azure-container-storage-remove"></a>
  **I get this error when trying to install Azure Container Storage, how do I resolve it? "(ExtensionOperationFailed) The extension operation failed with the following error: Unable to get the status from the local CRD with the error : {Error : Retry for given duration didn't get any results with err {status not populated}}?"**
  This error is due to a lack of permissions for Azure Container Storage to install and deploy storage in your AKS Cluster. Azure Container Storage Preview is deployed using an ARC extension. To resolve this, you must [assign the Contributor role](install-container-storage-aks.md#assign-contributor-role-to-aks-managed-identity) to the AKS managed identity.

## Billing and pricing

* <a id="azure-container-storage-extension-operation-failed"></a>
  **How much does Azure Container Storage cost to use?**  
  See the [Azure Container Storage pricing page](https://aka.ms/AzureContainerStoragePricingPage).

## See also
- [What is Azure Container Storage?](container-storage-introduction.md)
