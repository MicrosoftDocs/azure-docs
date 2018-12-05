---
title: Operator best practices - Storage in Azure Kubernetes Services (AKS)
description: Learn the cluster operator best practices for storage, data encryption, and backups in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 12/04/2018
ms.author: iainfou
---

# Best practices for storage and backups in Azure Kubernetes Service (AKS)

As you create and manage clusters in Azure Kubernetes Service (AKS), your applications often need storage.

This best practices article focuses on storage considerations for cluster operators. In this article, you learn:

> [!div class="checklist"]
> * What types of storage are available
> * How to correctly size AKS nodes for storage performance
> * Differences between dynamic and static provisioning of volumes
> * Ways to back up and secure your data volumes

## Choose the appropriate storage type

**Best practice guidance** - Understand the needs of your application to pick the right storage. Use high performance, SSD-backed storage for production workloads. Plan for network-based storage when there is a need for multiple concurrent connections.

Applications often require different types and speeds of storage.

| Use case | Volume plugin | ReadWriteOnce | ReadOnlyMany | ReadWriteMany |
|----------|---------------|---------------|--------------|---------------|
| Shared configuration       | AzureFile      | Yes | Yes | Yes |
| App structured data        | AzureDisk      | Yes | No  | No  |
| App data, read-only shares | Dysk (preview) | Yes | Yes | No  |
| Unstructured data, file system operations | BlobFuse (preview) | Yes | Yes | Yes |

Azure Files, Azure Disk, Dysk, BlobFuse
Storage classes to control fast and slow tiers, available sizes, etc. Tie in with resource quotas

## Size the nodes for performance and attached disks

**Best practice guidance** - Each node size supports a maximum number of disks. Different node sizes also provide different amounts of local storage and network bandwidth. Plan for your application demands to deploy the appropriate size of nodes.

AKS nodes run as Azure VMs. Different types and sizes of VM are available. Each VM size provides a different amount of core resources such as CPU and memory. These VM sizes have a maximum number of disks that can be attached. Storage performance also varies between VM sizes for the maximum local and attached disk IOPS (input/output operations per second).

If your applications require Azure Disks as their storage solution, plan for and choose an appropriate node VM size. The amount of CPU and memory isn't the only factor when you choose a VM size. The storage capabilities are also important. For example, both the *Standard_B2ms* and *Standard_DS2_v2* VM sizes include a similar amount of CPU and memory resources. Their potential storage performance is quite different, as shown in the following table:

| Node type and size | vCPU | Memory (GiB) | Max data disks | Max uncached disk IOPS | Max uncached throughput (MBps) |
|--------------------|------|--------------|----------------|------------------------|--------------------------------|
| Standard_B2ms      | 2    | 8            | 4              | 1,920                  | 22.5                           |
| Standard_DS2_v2    | 2    | 7            | 8              | 6,400                  | 96                             |

Here, the *Standard_DS2_v2* allows double the number of attached disks, and provides three to four times the amount of IOPS and disk throughput. If you only looked at the core compute resources and compared costs, you may choose the *Standard_B2ms* VM size and have poor storage performance and limitations. Work with your application development team to understand their storage capacity and performance needs. Choose the appropriate VM size for the AKS nodes to meet or exceed their performance needs. Regularly baseline applications to adjust VM size as needed.

For more information about available VM sizes, see [Sizes for Linux virtual machines in Azure][vm-sizes].

## Dynamically provision volumes

**Best practice guidance** - To reduce management overhead and let you scale, don't statically create and assign persistent volumes. Use dynamic provisioning. In your storage classes, define the appropriate reclaim policy to minimize unneeded storage costs once pods are deleted.

When you need to attach storage to pods, you use persistent volumes. These persistent volumes can be created manually or dynamically. Manual creation of persistent volumes adds management overhead, and limits your ability to scale. Use dynamic persistent volume provisioning to simplify storage management and allow your applications to grow and scale as needed.

A persistent volume claim (PVC) lets you dynamically create storage as needed. The following example creates a *5Gi* volume that uses Azure Premium Disks:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: azure-managed-disk
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: managed-premium
  resources:
    requests:
      storage: 5Gi
```

The underlying Azure disks are created as pods request them. In the pod definition, you request a volume be created and attached to a designed mount path, as shown in the following example:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: nginx:1.15.7
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 250m
        memory: 256Mi
    volumeMounts:
    - mountPath: "/mnt/azure"
      name: volume
  volumes:
    - name: volume
      persistentVolumeClaim:
        claimName: azure-managed-disk
```

As part of your storage class definitions, set the appropriate *reclaimPolicy*. This reclaimPolicy controls the behavior of the underlying Azure storage resource when the pod is deleted and the persistent volume may no longer be required. The underlying storage resource can be deleted, or retained for use with a future pod. The reclaimPolicy can set to *retain* or *delete*. Understand your application needs, and implement regular checks for storage that is retained to minimize the amount of un-used storage that is used and billed.

For more information about creating volumes, see how to dynamically create and use a persistent volume with [Azure Disks][dynamic-disks] or [Azure Files][dynamic-files]. You also learn more about [storage reclaim policies][reclaim-policy].

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
[vm-sizes]: ../virtual-machines/linux/sizes.md
[dynamic-disks]: azure-disks-dynamic.md
[dynamic-files]: azure-files-dynamic-pv.md
[reclaim-policy]: concepts-storage.md#reclaim-policy
