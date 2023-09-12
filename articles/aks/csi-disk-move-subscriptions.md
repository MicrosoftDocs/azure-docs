---
title: Move Azure Disk Persistent Volumes in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to move a persistent volume between Azure Kubernetes Service clusters in the same or different subscription and in the same region. 
ms.topic: article
ms.date: 09/11/2023
---

# Move Azure Disk persistent volumes to same or different subscription

This article describes how to safely move Azure Disk persistent volumes from an Azure Kubernetes Service (AKS) cluster to another cluster in the same subscription or in a different subscription that are in the same region.

The sequence of steps to complete this move are:

* Confirm the Azure Disk resource state on the source AKS cluster is not in an **Attached** state to avoid data loss.
* Move the Azure Disk resource to the target resource group in the same or different subscription.
* Validate the Azure Disk resource move succeeded.
* Create the persistent volume (PV), persistent volume claim (PVC) and mount the moved disk as a volume on a pod on the target cluster  

## Before you begin

* You need an Azure [storage account][azure-storage-account].
* Make sure you have Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* Review details and requirements about moving resources between different regions in [Move resources to a new resource group or subsription][move-resources-new-subscription-resource-group].
* You have an AKS cluster in the target subscription and the source cluster has persistent volumes with Azure Disks attached.

## 

<!-- LINKS - external -->

<!-- LINKS - internal -->
[move-resources-new-subscription-resource-group]: ../azure-resource-manager/management/move-resource-group-and-subscription.md