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

Sharing data between containers is often a necessary component of container-based services and applications. You usually have various pods that need access to the same information on an external persistent volume. If a single pod needs access to storage, you can use Azure Blob storage to present a native volume for application use. 

This article shows you how to manually create an Azure Blob storage container and attach it to a pod in AKS.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

Your AKS Cluster will need to live in the same or peered virtual networks as the NFS Server. The cluster must be created in an existing VNET, which can be the same VNET as your VM.

The steps for configuring with an existing VNET are described in the documentation: [creating AKS Cluster in existing VNET][aks-virtual-network] and [connecting virtual networks with VNET peering][peer-virtual-networks]

It also assumes you've created an Ubuntu Linux Virtual Machine (for example, 18.04 LTS). Settings and size can be to your liking and can be deployed through Azure. For Linux quickstart, see [Linux VM management][linux-create].

If you deploy your AKS Cluster first, Azure will automatically populate the virtual network field when deploying your Ubuntu machine, making them live within the same VNET. But if you want to work with peered networks instead, consult the documentation above.


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
