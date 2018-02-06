---
title: Delete an AKS cluster
description: Delete and AKS cluster with the CLI or Azure portal.
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 2/05/2018
ms.author: nepeters
ms.custom: mvc
---

# Delete an Azure Container Service (AKS) cluster

When deleting an Azure Container Service cluster, the resource group in which the cluster was deployed remains, however all AKS related service are deleted and auto-generated resource groups are deleted.

This document details how to delete an Azure Container Service cluster using both the Azure CLI and Azure portal. 

## Azure CLI

Use the [az aks delete][az-aks-delete] command to delete the AKS cluster. The following example includes the `--yes` argument which will prevent a deletion confirmation.

```azurecli-interactive
az aks delete --resource-group myAKSCluster --name myAKSCluster --yes
```

## Azure portal

While in the Azure portal, browse to the resource group containing the Azure Container Service (AKS) resource, select the resource, and click **Delete**. You are prompted to confirm the delete operation.

![Delete AKS cluster portal](media/container-service-delete-cluster/delete-aks-portal.png)

<!-- LINKS - internal -->
[az-aks-delete]: azure-files-dynamic-pv.md