---
title: Uninstall the Open Service Mesh (OSM) add-on
description: Deploy Open Service Mesh on Azure Kubernetes Service (AKS) using Azure CLI
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 11/10/2021
ms.author: pgibson
---

# Uninstall the Open Service Mesh (OSM) add-on from your Azure Kubernetes Service (AKS) cluster

This article shows you how to uninstall the OMS add-on and related resources from your AKS cluster.

## Disable the OSM add-on from your cluster

Disable the OSM add-on in your cluster using `az aks disable-addon`. For example:

```azurecli-interactive
az aks disable-addons \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --addons open-service-mesh
```

The above example removes the OSM add-on from the *myAKSCluster* in *myResourceGroup*.

## Remove additional OSM resources

After the OSM add-on is disabled, use `osm uninstall cluster-wide-resources` to uninstall the remaining resource on the cluster. For example:

```console
osm uninstall cluster-wide-resources
```

> [!NOTE]
> For version 1.1, the command is `osm uninstall mesh --delete-cluster-wide-resources`

> [!IMPORTANT]
> You must remove these additional resources after you disable the OSM add-on. Leaving these resources on your cluster may cause issues if you enable the OSM add-on again in the future.
