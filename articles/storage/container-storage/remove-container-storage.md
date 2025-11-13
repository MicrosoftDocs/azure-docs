---
title: Remove Azure Container Storage
description: Remove Azure Container Storage by deleting the extension instance for Azure Kubernetes Service (AKS). Optionally delete the AKS cluster or entire resource group to clean up resources.
author: khdownie
ms.service: azure-container-storage
ms.date: 09/10/2025
ms.author: kendownie
ms.topic: how-to
# Customer intent: "As a cloud administrator, I want to remove Azure Container Storage from my AKS environment, so that I can clean up resources and ensure no unnecessary costs are incurred for unused components."
---

# Remove Azure Container Storage

This article shows you how to remove Azure Container Storage by deleting the extension instance for Azure Kubernetes Service (AKS). Optionally, you can also delete the AKS cluster or entire resource group to clean up resources.

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). If you have Azure Container Storage (version 1.x.x) installed on your AKS cluster, remove it by following [these steps](remove-container-storage-version-1.md).

## Delete extension instance

Follow these steps to remove Azure Container Storage from your AKS cluster.

1. Delete all Persistent Volume Claims (PVCs) and Persistent Volumes (PVs) before uninstalling the extension. Removing Azure Container Storage without cleaning up these resources could disrupt your running workloads. To avoid disruptions, ensure that there are no existing workloads or storage classes relying on Azure Container Storage.

1. Delete the extension by running the following Azure CLI command. Be sure to replace `<cluster-name>` and `<resource-group>` with your own values.

   ```azurecli
   az aks update -n <cluster-name> -g <resource-group> --disable-azure-container-storage
   ```

## Delete AKS cluster

To delete an AKS cluster and all persistent volumes, run the following Azure CLI command. Replace `<resource-group>` and `<cluster-name>` with your own values.

```azurecli
az aks delete --resource-group <resource-group> --name <cluster-name>
```

## Delete resource group

You can also use the [`az group delete`](/cli/azure/group) command to delete the resource group and all resources it contains. Replace `<resource-group>` with your resource group name.

```azurecli
az group delete --name <resource-group>
```

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)