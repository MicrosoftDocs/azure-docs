---
title: Best practices for storage and backup
titleSuffix: Azure Kubernetes Service
description: Learn the cluster operator best practices for storage, data encryption, and backups in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: conceptual
ms.date: 5/6/2019

---

# Best practices for storage and backups in Azure Kubernetes Service (AKS)

As you create and manage clusters in Azure Kubernetes Service (AKS), your applications often need storage. It's important to understand the performance needs and access methods for pods so that you can provide the appropriate storage to applications. The AKS node size may impact these storage choices. You should also plan for ways to back up and test the restore process for attached storage.

This best practices article focuses on storage considerations for cluster operators. In this article, you learn:

> [!div class="checklist"]
> * What types of storage are available
> * How to correctly size AKS nodes for storage performance
> * Differences between dynamic and static provisioning of volumes
> * Ways to back up and secure your data volumes

## Choose the appropriate storage type

**Best practice guidance** - Understand the needs of your application to pick the right storage. Use high performance, SSD-backed storage for production workloads. Plan for network-based storage when there is a need for multiple concurrent connections.

Applications often require different types and speeds of storage. Do your applications need storage that connects to individual pods, or shared across multiple pods? Is the storage for read-only access to data, or to write large amounts of structured data? These storage needs determine the most appropriate type of storage to use.

The following table outlines the available storage types and their capabilities:

| Use case | Volume plugin | Read/write once | Read-only many | Read/write many | Windows Server container support |
|----------|---------------|-----------------|----------------|-----------------|--------------------|
| Shared configuration       | Azure Files   | Yes | Yes | Yes | Yes |
| Structured app data        | Azure Disks   | Yes | No  | No  | Yes |
| Unstructured data, file system operations | [BlobFuse][blobfuse] | Yes | Yes | Yes | No |

The two primary types of storage provided for volumes in AKS are backed by Azure Disks or Azure Files. To improve security, both types of storage use Azure Storage Service Encryption (SSE) by default that encrypts data at rest. Disks cannot currently be encrypted using Azure Disk Encryption at the AKS node level.

Both Azure Files and Azure Disks are available in Standard and Premium performance tiers:

- *Premium* disks are backed by high-performance solid-state disks (SSDs). Premium disks are recommended for all production workloads.
- *Standard* disks are backed by regular spinning disks (HDDs), and are good for archival or infrequently accessed data.

Understand the application performance needs and access patterns to choose the appropriate storage tier. For more information about Managed Disks sizes and performance tiers, see [Azure Managed Disks overview][managed-disks]

### Create and use storage classes to define application needs

The type of storage you use is defined using Kubernetes *storage classes*. The storage class is then referenced in the pod or deployment specification. These definitions work together to create the appropriate storage and connect it to pods. For more information, see [Storage classes in AKS][aks-concepts-storage-classes].

## Size the nodes for storage needs

**Best practice guidance** - Each node size supports a maximum number of disks. Different node sizes also provide different amounts of local storage and network bandwidth. Plan for your application demands to deploy the appropriate size of nodes.

AKS nodes run as Azure VMs. Different types and sizes of VM are available. Each VM size provides a different amount of core resources such as CPU and memory. These VM sizes have a maximum number of disks that can be attached. Storage performance also varies between VM sizes for the maximum local and attached disk IOPS (input/output operations per second).

If your applications require Azure Disks as their storage solution, plan for and choose an appropriate node VM size. The amount of CPU and memory isn't the only factor when you choose a VM size. The storage capabilities are also important. For example, both the *Standard_B2ms* and *Standard_DS2_v2* VM sizes include a similar amount of CPU and memory resources. Their potential storage performance is different, as shown in the following table:

| Node type and size | vCPU | Memory (GiB) | Max data disks | Max uncached disk IOPS | Max uncached throughput (MBps) |
|--------------------|------|--------------|----------------|------------------------|--------------------------------|
| Standard_B2ms      | 2    | 8            | 4              | 1,920                  | 22.5                           |
| Standard_DS2_v2    | 2    | 7            | 8              | 6,400                  | 96                             |

Here, the *Standard_DS2_v2* allows double the number of attached disks, and provides three to four times the amount of IOPS and disk throughput. If you only looked at the core compute resources and compared costs, you may choose the *Standard_B2ms* VM size and have poor storage performance and limitations. Work with your application development team to understand their storage capacity and performance needs. Choose the appropriate VM size for the AKS nodes to meet or exceed their performance needs. Regularly baseline applications to adjust VM size as needed.

For more information about available VM sizes, see [Sizes for Linux virtual machines in Azure][vm-sizes].

## Dynamically provision volumes

**Best practice guidance** - To reduce management overhead and let you scale, don't statically create and assign persistent volumes. Use dynamic provisioning. In your storage classes, define the appropriate reclaim policy to minimize unneeded storage costs once pods are deleted.

When you need to attach storage to pods, you use persistent volumes. These persistent volumes can be created manually or dynamically. Manual creation of persistent volumes adds management overhead, and limits your ability to scale. Use dynamic persistent volume provisioning to simplify storage management and allow your applications to grow and scale as needed.

![Persistent volume claims in an Azure Kubernetes Services (AKS) cluster](media/concepts-storage/persistent-volume-claims.png)

A persistent volume claim (PVC) lets you dynamically create storage as needed. The underlying Azure disks are created as pods request them. In the pod definition, you request a volume to be created and attached to a designated mount path.

For the concepts on how to dynamically create and use volumes, see [Persistent Volumes Claims][aks-concepts-storage-pvcs].

To see these volumes in action, see how to dynamically create and use a persistent volume with [Azure Disks][dynamic-disks] or [Azure Files][dynamic-files].

As part of your storage class definitions, set the appropriate *reclaimPolicy*. This reclaimPolicy controls the behavior of the underlying Azure storage resource when the pod is deleted and the persistent volume may no longer be required. The underlying storage resource can be deleted, or retained for use with a future pod. The reclaimPolicy can set to *retain* or *delete*. Understand your application needs, and implement regular checks for storage that is retained to minimize the amount of un-used storage that is used and billed.

For more information about storage class options, see [storage reclaim policies][reclaim-policy].

## Secure and back up your data

**Best practice guidance** - Back up your data using an appropriate tool for your storage type, such as Velero or Azure Site Recovery. Verify the integrity, and security, of those backups.

When your applications store and consume data persisted on disks or in files, you need to take regular backups or snapshots of that data. Azure Disks can use built-in snapshot technologies. You may need to look for your applications to flush writes to disk before you perform the snapshot operation. [Velero][velero] can back up persistent volumes along with additional cluster resources and configurations. If you can't [remove state from your applications][remove-state], back up the data from persistent volumes and regularly test the restore operations to verify data integrity and the processes required.

Understand the limitations of the different approaches to data backups and if you need to quiesce your data prior to snapshot. Data backups don't necessarily let you restore your application environment of cluster deployment. For more information about those scenarios, see [Best practices for business continuity and disaster recovery in AKS][best-practices-multi-region].

## Next steps

This article focused on storage best practices in AKS. For more information about storage basics in Kubernetes, see [Storage concepts for applications in AKS][aks-concepts-storage].

<!-- LINKS - External -->
[velero]: https://github.com/heptio/velero
[blobfuse]: https://github.com/Azure/azure-storage-fuse

<!-- LINKS - Internal -->
[aks-concepts-storage]: concepts-storage.md
[vm-sizes]: ../virtual-machines/linux/sizes.md
[dynamic-disks]: azure-disks-dynamic-pv.md
[dynamic-files]: azure-files-dynamic-pv.md
[reclaim-policy]: concepts-storage.md#storage-classes
[aks-concepts-storage-pvcs]: concepts-storage.md#persistent-volume-claims
[aks-concepts-storage-classes]: concepts-storage.md#storage-classes
[managed-disks]: ../virtual-machines/linux/managed-disks-overview.md
[best-practices-multi-region]: operator-best-practices-multi-region.md
[remove-state]: operator-best-practices-multi-region.md#remove-service-state-from-inside-containers
