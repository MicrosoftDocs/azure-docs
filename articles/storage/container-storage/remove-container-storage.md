---
title: How to remove Azure Container Storage Preview
description: Remove Azure Container Storage by deleting the extension instance for Azure Kubernetes Service (AKS). Optionally delete the AKS cluster or entire resource group to clean up resources.
author: khdownie
ms.service: azure-container-storage
ms.date: 03/18/2024
ms.author: kendownie
ms.topic: how-to
---

# Remove Azure Container Storage Preview

This article shows you how to remove Azure Container Storage by deleting the extension instance for Azure Kubernetes Service (AKS). Optionally, you can also delete the AKS cluster or entire resource group to clean up resources.

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

- [What is Azure Container Storage?](container-storage-introduction.md)
