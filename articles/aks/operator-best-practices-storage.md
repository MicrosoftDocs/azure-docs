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

**Best practice guidance** - Understand the needs of your application to pick the right storage. Use high performance, SSD-backed storage for production workloads. Plan for network-based storage when there is a need for multiple concurrent connections.

Azure Files, Azure Disk, Dysk, BlobFuse
Storage classes to control fast and slow tiers, available sizes, etc. Tie in with resource quotas

## Size the nodes for performance and attached disks

**Best practice guidance** - Each node VM size supports a maximum number of disks. Different node sizes also provide different amounts of local storage and network bandwidth. Plan for your application demands to deploy the appropriate sized nodes.

Max number of disks, IOPS per disk, local storage, network bandwidth, etc.

## Dynamically provision volumes

**Best practice guidance** - To reduce management overhead and let you scale, don't statically create and assign persistent volumes. Use dynamic provisioning. In your storage classes, define the appropriate reclaim policy to minimize unneeded storage costs once pods are deleted.

Don't statically create PVs, use dynamic creation to allow for scale
Set reclaim policy appropriately using storage classes

## Secure and backup your data

**Best practice guidance** - Back up your using an appropriate tool for your storage type, such as Heptio Ark or Azure Site Recovery. Verify the integrity, and security, of those backups.

Manually back up volumes by taking snapshot of the volume
Use Heptio Ark or Azure Site Recovery - flush writes in app before taking snapshot
Verify security of backups

## Next steps

This article focused on storage best practices in AKS. For more information about storage basics in Kubernetes, see [Storage concepts for applications in AKS][aks-concepts-storage].

<!-- LINKS - External -->

<!-- LINKS - Internal -->
[aks-concepts-storage]: concepts-storage.md
