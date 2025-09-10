---
title: How to remove Azure Container Storage (version 1.x.x)
description: Remove Azure Container Storage (version 1.x.x) by deleting the extension instance for Azure Kubernetes Service (AKS).
author: khdownie
ms.service: azure-container-storage
ms.date: 09/03/2025
ms.author: kendownie
ms.topic: how-to
# Customer intent: "As a cloud administrator, I want to remove Azure Container Storage (version 1.x.x) from my AKS environment, so that I can clean up resources and ensure no unnecessary costs are incurred for unused components."
---

# Remove Azure Container Storage (version 1.x.x)

This article shows you how to remove Azure Container Storage (version 1.x.x) by deleting the extension instance for Azure Kubernetes Service (AKS). Optionally, you can also delete the AKS cluster or entire resource group to clean up resources.

> [!IMPORTANT]
> This article explains how to remove Azure Container Storage (version 1.x.x). [Azure Container Storage (version 2.x.x)](container-storage-introduction.md) is now available. If you're already using Azure Container Storage (version 2.x.x) and want to remove it, see [this article](remove-container-storage.md).

## Delete extension instance

To remove Azure Container Storage (version 1.x.x) from your AKS cluster, delete the extension by running the following Azure CLI command. Be sure to replace `<cluster-name>` and `<resource-group>` with your own values. Deleting the extension will delete any existing storage pools, which can affect any applications you're running.
  
```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group> --disable-azure-container-storage all
```

## Delete AKS cluster

To delete an AKS cluster and all persistent volumes, run the following Azure CLI command. Replace `<resource-group>` and `<cluster-name>` with your own values.

```azurecli-interactive
az aks delete --resource-group <resource-group> --name <cluster-name>
```

## Delete resource group

You can also use the [`az group delete`](/cli/azure/group) command to delete the resource group and all resources it contains. Replace `<resource-group>` with your resource group name.

```azurecli-interactive
az group delete --name <resource-group>
```

## See also

- [What is Azure Container Storage (version 1.x.x)?](container-storage-introduction-version-1.md)
