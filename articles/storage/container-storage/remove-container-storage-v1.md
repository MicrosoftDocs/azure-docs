---
title: How to remove Azure Container Storage (v1)
description: Remove Azure Container Storage (v1) by deleting the extension instance for Azure Kubernetes Service (AKS). Optionally delete the AKS cluster or entire resource group to clean up resources.
author: khdownie
ms.service: azure-container-storage
ms.date: 08/20/2025
ms.author: kendownie
ms.topic: how-to
# Customer intent: "As a cloud administrator, I want to remove Azure Container Storage (v1) from my AKS environment, so that I can clean up resources and ensure no unnecessary costs are incurred for unused components."
---

# Remove Azure Container Storage (v1)

This article shows you how to remove Azure Container Storage (v1) by deleting the extension instance for Azure Kubernetes Service (AKS). Optionally, you can also delete the AKS cluster or entire resource group to clean up resources.

> [!IMPORTANT]
> This article applies to Azure Container Storage v1.x releases. If you're using Azure Container Storage v2.x, see [this article](remove-container-storage.md).

## Delete extension instance

To remove Azure Container Storage from your AKS cluster, delete the extension by running the following Azure CLI command. Be sure to replace `<cluster-name>` and `<resource-group>` with your own values. Deleting the extension will delete any existing storage pools, which can affect any applications you're running.
  
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

- [What is Azure Container Storage?](container-storage-introduction-v1.md)
