---
title: Uninstall the Open Service Mesh (OSM) add-on from your Azure Kubernetes Service (AKS) cluster
description: How to uninstall the Open Service Mesh on Azure Kubernetes Service (AKS) using Azure CLI.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 06/19/2023
---

# Uninstall the Open Service Mesh (OSM) add-on from your Azure Kubernetes Service (AKS) cluster

This article shows you how to uninstall the OMS add-on and related resources from your AKS cluster.

## Disable the OSM add-on from your cluster

* Disable the OSM add-on from your cluster using the [`az aks disable-addon`][az-aks-disable-addon] command and the `--addons` parameter.

    ```azurecli-interactive
    az aks disable-addons \
      --resource-group myResourceGroup \
      --name myAKSCluster \
      --addons open-service-mesh
    ```

## Remove OSM resources

* Uninstall the remaining resources on the cluster using the `osm uninstall cluster-wide-resources` command.

    ```console
    osm uninstall cluster-wide-resources
    ```

    > [!NOTE]
    > For version 1.1, the command is `osm uninstall mesh --delete-cluster-wide-resources`

    > [!IMPORTANT]
    > You must remove these additional resources after you disable the OSM add-on. Leaving these resources on your cluster may cause issues if you enable the OSM add-on again in the future.

## Next steps

Learn more about [Open Service Mesh][osm].

<!-- LINKS - Internal -->
[az-aks-disable-addon]: /cli/azure/aks#az_aks_disable_addons
[osm]: ./open-service-mesh-about.md
