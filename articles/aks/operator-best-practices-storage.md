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


| Use case | Volume plugin | ReadWriteOnce | ReadOnlyMany | ReadWriteMany |
|----------|---------------|---------------|--------------|---------------|
| Shared configuration       | AzureFile      | Yes | Yes | Yes |
| App structured data        | AzureDisk      | Yes | No  | No  |
| App data, read-only shares | Dysk (preview) | Yes | Yes | No  |
| Unstructured data, file system operations | BlobFuse (preview) | Yes | Yes | Yes |


Azure Files, Azure Disk, Dysk, BlobFuse
Storage classes to control fast and slow tiers, available sizes, etc. Tie in with resource quotas

## Size the nodes for performance and attached disks

**Best practice guidance** - Each node VM size supports a maximum number of disks. Different node sizes also provide different amounts of local storage and network bandwidth. Plan for your application demands to deploy the appropriate sized nodes.

AKS nodes use Azure VMs, with a choice of different types and sizes available. Each VM size provides a different amount of core resources such as CPU and memory. Different VM sizes also have a maximum number of disks that can be attached. The storage performance varies between VM sizes for the maximum local and attached disk IOPS.

If your applications require Azure Disks as their storage solution, plan for and choose an appropriate node VM size. CPU and memory isn't the only factor when you choose a VM size. For example, both the *Standard_B2ms* and *Standard_DS2_v2* VM sizes include a similar amount of CPU and memory resources. Their potential storage performance is quite different, as shown in the following table:

| Node type and size | vCPU | Memory (GiB) | Max data disks | Max uncached disk IOPS | Max uncached throughput (MBps) |
|--------------------|------|--------------|----------------|------------------------|--------------------------------|
| Standard_B2ms      | 2    | 8            | 4              | 1,920                  | 22.5                           |
| Standard_DS2_v2    | 2    | 7            | 8              | 6,400                  | 96                             |

The *Standard_DS2_v2* allows double the number of 

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
