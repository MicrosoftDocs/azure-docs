---
title: Manually create and use a volume with Azure Blob storage in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to manually create an Azure Blob storage container for use with pods in Azure Kubernetes Service (AKS)
services: container-service
author: mgoedtel
ms.topic: article
ms.date: 05/25/2022
ms.author: magoedte
---

# Manually create and use a volume with Azure Blob storage in Azure Kubernetes Service (AKS)

Sharing data between containers is often a necessary component of container-based services and applications. You usually have various pods in your Azure Kubernetes Service (AKS) cluster that need access to the same information on an external persistent volume. If a single pod needs access to storage, you can use Azure Blob storage to present a native volume for application use.

This article shows you how to manually create an Azure Blob storage container and attach it to a pod in AKS.

## Before you begin

This article assumes that you have an existing AKS cluster running version 1.21 or later version. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

## Create a Blob storage container

When you create an Azure Blob storage resource for use with AKS, you can create the resource in the node resource group. This approach allows the AKS cluster to access and manage the blob storage resource. If you instead create the blob storage resource in a separate resource group, you must grant the Azure Kubernetes Service managed identity for your cluster the [Contributor][rbac-contributor-role] role to the blob storage resource group.

For this article, create the container in the node resource group. First, get the resource group name with the [az aks show][az-aks-show] command and add the `--query nodeResourceGroup` query parameter. The following example gets the node resource group for the AKS cluster named **myAKSCluster** in the resource group named **myResourceGroup**:

```bash
$ az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv

MC_myResourceGroup_myAKSCluster_eastus
```

Now create a container for storing blobs following the steps in the [Manage blob storage][manage-blob-storage] to authorize access and then create the container. 

## Mount blob storage as a volume

Create a `pv-azureblob.yaml` file with a *PersistentVolume*. Update `volumeHandle` with disk resource ID. For example:
 
## Next steps

For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

<!-- LINKS - external -->
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/volumes/
[linux-create]: ../virtual-machines/linux/tutorial-manage-vm.md
[nfs-tutorial]: https://help.ubuntu.com/community/SettingUpNFSHowTo#Pre-Installation_Setup
[aks-virtual-network]: ./configure-kubenet.md#create-an-aks-cluster-in-the-virtual-network
[peer-virtual-networks]: ../virtual-network/tutorial-connect-virtual-networks-portal.md

<!-- LINKS - internal -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[operator-best-practices-storage]: operator-best-practices-storage.md
[rbac-contributor-role]: ../role-based-access-control/built-in-roles.md#contributor
[az-aks-show]: /cli/azure/aks#az-aks-show
[manage-blob-storage]: ../storage/blobs/blob-cli.md