---
title: Introduction to Azure Container Storage
description: An overview of Azure Container Storage, a service built for containers that enables customers to create and manage volumes for production-scale stateful container applications.
author: khdownie
ms.service: azure-container-storage
ms.date: 09/04/2025
ms.author: kendownie
ms.topic: overview
ms.custom: references_regions
# Customer intent: "As a DevOps engineer, I want to use a managed volume orchestration service for my Kubernetes applications, so that I can efficiently provision and manage persistent storage for stateful workloads without the operational overhead of configuring individual storage interfaces."
---

# What is Azure Container Storage?

Azure Container Storage is a cloud-based volume management, deployment, and orchestration service built for containers. It integrates with Kubernetes so you can dynamically provision persistent volumes for stateful applications on Kubernetes clusters.

To get started, see [Install Azure Container Storage for use with Azure Kubernetes Service](install-container-storage-aks.md).

> [!IMPORTANT]
> This article covers features and capabilities available in Azure Container Storage (version 2.x.x), which supports local NVMe disk and Elastic SAN as backing storage types. For earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md).

## Why Azure Container Storage is useful

Azure Container Storage gives your container workloads access to high-performance storage that was previously only available to virtual machines.

Local NVMe disks provide the highest performance storage in Azure. They are ideal for latency-sensitive workloads like PostgreSQL and compute-intensive AI and ML frameworks like Ray and Kubeflow.

[Elastic SAN](../elastic-san/elastic-san-introduction.md) support in Azure Container Storage lets you use durable, network-attached block storage that scales with your application. By provisioning volumes from an Elastic SAN volume group, you gain predictable throughput and built-in redundancy options such as locally redundant storage (LRS) and zone-redundant storage (ZRS). This makes Azure Container Storage a strong choice for databases, analytics engines, and any workload that needs consistent performance.

You can create and manage storage volumes using standard Kubernetes tools. You don't need to switch between portals or install Container Storage Interface (CSI) drivers yourself.

Azure Container Storage works with Azure Kubernetes Service (AKS) and self-managed Kubernetes clusters. Because it uses open-source components, it supports deployments across Azure and other clouds.

## Key benefits

- **Seamless scaling of stateful pods:** Azure Container Storage mounts persistent volumes by using NVMe over Fabrics (NVMe-oF) or iSCSI (Internet Small Computer System Interface). This speeds attach and detach operations and supports fast pod recovery. When used with Elastic SAN, Azure Container Storage can provision and attach thousands of persistent volumes per cluster. This avoids bottlenecks such as Azure Resource Manager disk attachment limits (for example, 64 disks per VM).
- **Optimized performance for stateful workloads:** Azure Container Storage delivers high read throughput and near-native disk write speeds by using NVMe-oF over TCP. This enables cost-effective performance for tier 1 I/O-intensive, general-purpose, throughput-sensitive, and development/test workloads.
- **Cost efficiency through storage consolidation:** Azure Container Storage reduces storage cost and management overhead by consolidating many smaller volumes under a single SAN. Elastic SAN tiered provisioning also helps reduce overprovisioning and lowers total cost of ownership.
- **Kubernetes-native volume orchestration:** Create StorageClass objects and persistent volumes, and manage the full lifecycle of volumes including provisioning, expansion, deletion, and snapshots using `kubectl` commands.
- **Open source and community-driven:** Azure Container Storage is developed as an open-source project. You can install it through an AKS extension, as described in the [tutorial](install-container-storage-aks.md), or through Helm using the [local-csi-driver](https://github.com/Azure/local-csi-driver) repository.

## Supported storage types

Azure Container Storage provides a Kubernetes-native orchestration and management layer for persistent volumes on Linux-based Kubernetes clusters. It uses Azure Storage offerings as the underlying data store.

| Storage type | Description | Workloads | Offerings | Provisioning model |
|---|---|---|---|---|
| Local NVMe disk | Uses local NVMe disks on AKS nodes. | Best for applications that require ultra-low latency and can tolerate no data durability or have built-in replication (for example, PostgreSQL). | Available on select Azure VM sizes, such as [storage-optimized](/azure/virtual-machines/sizes/overview#storage-optimized) and [GPU-accelerated](/azure/virtual-machines/sizes/overview#gpu-accelerated) VMs. | Deployed within a Kubernetes cluster. Automatically discovers and acquires local NVMe disks on cluster nodes for volume deployment. |
| Elastic SAN | Provisioned on demand as a fully managed resource. | General-purpose databases, streaming and messaging services, CI/CD environments, and other tier 1 and tier 2 workloads. | [Azure Elastic SAN](../elastic-san/elastic-san-introduction.md) | Provisioned on demand per created volume and volume snapshot, or with static Elastic SAN volumes. |

### Feature support for different storage types

The following table lists key features of Azure Container Storage and indicates if they are supported on local NVMe disks.

| Feature | Local NVMe | Elastic SAN |
|---|---|---|
| Ephemeral volumes | [Supported](./use-container-storage-with-local-disk.md) | Not supported |
| Persistent volumes | [Supported<sup>1</sup>](./use-container-storage-with-local-disk.md) | [Supported](./use-container-storage-with-elastic-san.md) |
| PV expansion/resize | [Supported](./resize-volume.md) | [Supported](./resize-volume.md) |
| Snapshots | Not supported | [Supported](./volume-snapshot-restore.md) |
| Replication | Not supported | Supported (LRS and ZRS) |
| ZRS option | N/A | [Supported](./enable-multi-zone-redundancy.md) |
| Encryption | N/A | [Supported](./configure-encryption-for-elastic-san.md) |

<sup>1</sup> By default, Azure Container Storage uses generic ephemeral volumes for local NVMe disks, which means data isn't retained after pod deletion. To enable persistent volumes that aren't linked to the lifecycle of the pod, add the appropriate annotation to your persistent volume claim (PVC). For details, see [Create persistent volumes with local NVMe disks](use-container-storage-with-local-disk.md).

## Regional availability

[!INCLUDE [container-storage-regions](../../../includes/container-storage-regions.md)]

Elastic SAN is available only in selected Azure regions. For the complete and up-to-date list, see [Elastic SAN regional availability](../elastic-san/elastic-san-create.md#limitations).

## Considerations for choosing a major version

Azure Container Storage offers two major versions: version 1 and version 2. Choose the appropriate version based on your underlying storage option.

- **Local NVMe disks**: Choose Azure Container Storage version 2.
- **Azure Disks**: Choose Azure Container Storage version 1. Azure Container Storage version 2 doesn't support Azure Disks.
- **Azure Elastic SAN**: Choose Azure Container Storage version 2.

## Glossary

Use these terms when you work with Azure Container Storage and Kubernetes:

- **Containerization**: Packaging application code with the operating system and required dependencies to create a single executable.
- **Kubernetes**: An open-source system for automating deployment, scaling, and management of containerized applications.
- **Azure Kubernetes Service (AKS)**: A managed Kubernetes service in Azure that offloads cluster management tasks such as health monitoring and maintenance.
- **Container Storage Interface (CSI)**: A standard for exposing storage systems to container orchestration systems like Kubernetes.
- **Cluster**: A set of compute nodes (VMs) that run containerized applications and are managed by the control plane.
- **Pod**: A group of one or more containers with shared storage and network resources. A pod is the smallest deployable unit in a Kubernetes cluster.
- **StorageClass**: A Kubernetes resource that defines how a unit of storage is dynamically created for a persistent volume. See [Kubernetes Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/).
- **Volume**: A directory containing data accessible to containers in a given pod. Volumes can be persistent or ephemeral.
- **Persistent volume (PV)**: A raw block device resource that you can mount with any file system. For more information, see [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/).
- **Persistent volume claim (PVC)**: A request for storage that Kubernetes uses to provision a persistent volume.
- **Azure Elastic SAN**: An Azure-managed, scalable storage area network (SAN) that provides durable volume groups with predictable throughput and zonal redundancy.
- **Volume group**: A grouping construct within Elastic SAN that represents a logical pool of volumes with shared policies.

## Next steps

- [Install Azure Container Storage for use with AKS](install-container-storage-aks.md)
- [Azure Container Storage pricing](https://aka.ms/AzureContainerStoragePricingPage)
- [Azure Container Storage (version 1.x.x)](container-storage-introduction-version-1.md)
- [Overview of deploying a highly available PostgreSQL database on Azure Kubernetes Service (AKS)](/azure/aks/postgresql-ha-overview#storage-considerations)
