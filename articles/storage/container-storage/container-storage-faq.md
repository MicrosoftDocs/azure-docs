---
title: Frequently asked questions (FAQ) for Azure Container Storage
description: Get answers to Azure Container Storage frequently asked questions.
author: khdownie
ms.service: storage
ms.date: 05/12/2023
ms.author: kendownie
ms.subservice: container-storage
ms.topic: conceptual
---

# Frequently asked questions (FAQ) about Azure Container Storage
[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers.

## General questions

* <a id="azure-container-storage-vs-csi-drivers"></a>
  **What's the difference between Azure Container Storage and Azure CSI drivers?**  
  Azure Container Storage is built natively for containers and provides a storage solution that's optimized for creating and managing volumes for running production-scale stateful container applications. Other Azure CSI drivers provide a standard storage solution that can be used with different container orchestrators and support the specific type of storage solution per CSI driver definition.

* <a id="azure-container-storage-regions"></a>
  **In which Azure regions is Azure Container Storage available?**  
  Azure Container Storage Preview is only available in East US, West Europe, West US 2, and West US 3. See [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products).

* <a id="azure-container-storage-preview-limitations"></a>
  **Which other Azure services does Azure Container Storage support?**  
  During public preview, Azure Container Storage supports only Azure Kubernetes Service (AKS) with storage pools provided by Azure Disks, Ephemeral Disk, or Azure Elastic SAN Preview.

* <a id="azure-container-storage-delete-aks-resource-group"></a>
  **I've created an Elastic SAN storage pool, and I'm trying to delete my resource group where my AKS cluster is located and it's not working. Why?**  
  Sign into the [Azure portal](https://portal.azure.com?azure-portal=true) and select **Resource groups**. Locate the resource group that AKS created (the resource group name starts with **MC_**). Select the SAN resource object within that resource group. Manually remove all volumes and volume groups. Then retry deleting the resource group that includes your AKS cluster.

* <a id="azure-container-storage-autoupgrade"></a>
  **Is there any performance impact when upgrading to a new version of Azure Container Storage?**  
  If you leave autoupgrade turned on (recommended), you might experience temporary I/O latency during the upgrade process. If you turn off autoupgrade and install the new version manually, there won't be any impact; however, you won't get the benefit of automatic upgrades and instant access to new features.

* <a id="azure-container-storage-uninstall"></a>
  **How do I uninstall Azure Container Storage?**  
  To uninstall Azure Container Storage, you can delete the `k8s-extension` by running the following Azure CLI command. Be sure to replace `<cluster-name>`, `<resource-group>`, and `<name>` with your own values (`<name>` should be the value you specified for the --name parameter when you installed Azure Container Storage).
  
  ```azurecli-interactive
  az k8s-extension delete --cluster-type managedClusters --cluster-name <cluster-name> --resource-group <resource-group> --name <extension-name>
  ```
  
  You can also use the [`az group delete`](/cli/azure/group) command to delete the resource group and all resources contained in the resource group:
  
  ```azurecli-interactive
  az group delete --name <resource-group>
  ```

## Billing and pricing

* <a id="azure-container-storage-billing"></a>
  **How much does Azure Container Storage cost to use?**  
  See the [Azure Container Storage pricing page](https://aka.ms/AzureContainerStoragePricingPage).

## See also
- [What is Azure Container Storage?](container-storage-introduction.md)
