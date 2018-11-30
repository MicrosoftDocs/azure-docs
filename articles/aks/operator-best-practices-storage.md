---
title: Operator best practices - Storage in Azure Kubernetes Services (AKS)
description: Learn the cluster operator best practices for storage, data encryption, and backups in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 11/30/2018
ms.author: iainfou
---

# Best practices for storage and backups in Azure Kubernetes Service (AKS)

As you create and manage clusters in Azure Kubernetes Service (AKS), your applications often need storage.

This best practices article focuses on storage considerations for cluster operators. In this article, you learn:

> [!div class="checklist"]
> * 

## Choose the appropriate storage type

Azure Files, Azure Disk, Dysk, BlobFuse
Storage classes to control fast and slow tiers, available sizes, etc. Tie in with resource quotas

## Size the nodes for performance and attached disks

Max number of disks, IOPS per disk, local storage, network bandwidth, etc.

## Dynamically provision volumes

Don't statically create PVs, use dynamic creation to allow for scale
Set reclaim policy appropriately using storage classes

## Secure and backup your data

Manually back up volumes by taking snapshot of the volume
Use Heptio Ark or Azure Site Recovery - flush writes in app before taking snapshot
Azure Storage Service Encryption automatically encrypts data at rest, cannot currently use Azure Disk Encryption
Verify security of backups

## Next steps

This article focused on storage best practices in AKS. For more information about storage basics in Kubernetes, see [Storage concepts for applications in AKS][aks-concepts-storage].

<!-- LINKS - External -->

<!-- LINKS - Internal -->
[aks-concepts-storage]: concepts-storage.md
