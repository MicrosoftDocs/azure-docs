---
title: How to uninstall Azure Container Storage
description: Uninstall the Azure Container Storage extension instance for Azure Kubernetes Service (AKS). Optionally delete the AKS cluster or entire resource group to clean up resources.
author: khdownie
ms.service: storage
ms.date: 06/22/2023
ms.author: kendownie
ms.subservice: container-storage
ms.topic: how-to
---

# Uninstall Azure Container Storage

This article shows you how to uninstall the Azure Container Storage extension instance for Azure Kubernetes Service (AKS). Optionally, you can also delete the AKS cluster or entire resource group to clean up resources.

## Delete extension instance

To uninstall Azure Container Storage from your AKS cluster, delete the `k8s-extension` by running the following Azure CLI command. Be sure to replace `<cluster-name>`, `<resource-group>`, and `<name>` with your own values (`<name>` should be the value you specified for the `--name` parameter when you installed Azure Container Storage).
  
```azurecli-interactive
az k8s-extension delete --cluster-type managedClusters --cluster-name <cluster-name> --resource-group <resource-group> --name <extension-name>
```

## Delete AKS cluster

To delete an AKS cluster, run the following Azure CLI command:

```azurecli-interactive
az aks delete --resource-group <resource-group> --name <cluster-name>
```

## Delete resource group

You can also use the [`az group delete`](/cli/azure/group) command to delete the resource group and all resources contained in the resource group:

```azurecli-interactive
az group delete --name <resource-group>
```

## See also
- [What is Azure Container Storage?](container-storage-introduction.md)
