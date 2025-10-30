---
title: Introduction to Azure Container Storage
description: An overview of Azure Container Storage, a service built natively for containers that enables customers to create and manage volumes for running production-scale stateful container applications.
author: khdownie
ms.service: azure-container-storage
ms.date: 09/04/2025
ms.author: kendownie
ms.topic: overview
ms.custom: references_regions
# Customer intent: "As a DevOps engineer, I want to use a managed volume orchestration service for my Kubernetes applications, so that I can efficiently provision and manage persistent storage for stateful workloads without the operational overhead of configuring individual storage interfaces."
---

# What is Azure Container Storage?

Azure Container Storage is a cloud-based volume management, deployment, and orchestration service built natively for containers. It integrates with Kubernetes, allowing you to dynamically and automatically provision persistent volumes to store data for stateful applications running on Kubernetes clusters.

To get started using Azure Container Storage, see [Install Azure Container Storage for use with Azure Kubernetes Service](install-container-storage-aks.md).

> [!IMPORTANT]
> This article covers features and capabilities available in Azure Container Storage (version 2.x.x), which currently only supports local NVMe disk as backing storage. For details about earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md).

## Why Azure Container Storage is useful

Azure Container Storage gives your container workloads access to high-performance storage that was previously only available to virtual machines. It supports fast local NVMe disks, which are ideal for latency-sensitive workloads like PostgreSQL, and compute-intensive AI and ML frameworks like Ray and Kubeflow.

You can create and manage storage volumes using standard Kubernetes tools. You don’t need to switch between different portals or set up CSI drivers on your own. This simplicity makes storage tasks easier and helps teams stay focused on running their apps.

Azure Container Storage works with Azure Kubernetes Service and self-managed Kubernetes clusters. Because it uses open-source components, it supports deployments across Azure and other clouds, providing flexibility for hybrid and multicloud setups.

## Key benefits

- **Seamless scaling of stateful pods:** Azure Container Storage enables rapid scaling by mounting persistent volumes using high-performance network block storage protocols such as NVMe-oF or iSCSI. This approach ensures fast attach and detach operations, allowing you to dynamically scale resources up or down without risking application disruption. During pod initialization or failover, persistent volumes can be quickly reassigned across the cluster, enhancing application resiliency and supporting high-scale, stateful workloads on Kubernetes.

- **Optimized performance for stateful workloads:** Azure Container Storage delivers high read throughput and near-native disk write speeds by using NVMe-oF over TCP. This architecture enables cost-effective performance for a wide range of containerized workloads—including tier 1 I/O-intensive, general-purpose, throughput-sensitive, and development/test scenarios. It also accelerates persistent volume attach and detach operations, reducing pod failover times and improving application resiliency.

- **Kubernetes-native volume orchestration:** Seamlessly create storage classes and persistent volumes, manage the full lifecycle of volumes—including provisioning, expansion, deletion, and perform operations such as capturing snapshots, all using familiar `kubectl` commands. This unified approach eliminates the need to switch between different tools or interfaces, streamlining storage management within your Kubernetes environment.

- **Open source and community-driven:** Azure Container Storage is developed as an open-source project. It can be installed either through an AKS extension, as described in the [tutorial](install-container-storage-aks.md), or via Helm using the [local-csi-driver](https://github.com/Azure/local-csi-driver) repository. This open approach enables users to contribute, customize, and integrate with existing Kubernetes workflows and patterns.

## Supported storage types

Azure Container Storage provides a Kubernetes-native orchestration and management layer for persistent volumes on Linux-based Kubernetes clusters. It uses existing Azure Storage offerings as the underlying data store. Currently, Azure Container Storage v2 only supports local NVMe disks for backing storage.

| **Storage type** | **Description** | **Workloads** | **Offerings** | **Provisioning model** |
|------------------|-----------------|---------------|---------------|------------------------|
| **Local NVMe Disk** | Utilizes local NVMe disks on AKS nodes | Best for applications that require ultra-low latency and can tolerate no data durability or have built-in replication (for example, PostgreSQL). | Available on select Azure VM sizes, such as [Storage optimized VM sizes](/azure/virtual-machines/sizes/overview#storage-optimized) and [GPU accelerated VM sizes](/azure/virtual-machines/sizes/overview#gpu-accelerated). | Deployed within a Kubernetes cluster. Automatically discovers and acquires local NVMe disks on cluster nodes for volume deployment. |

### Feature support for different storage types

The following table lists key features of Azure Container Storage and indicates if they are supported on local NVMe disks.

| **Feature** | **Local NVMe** |
|-------------|----------------|
| Ephemeral volumes | Supported |
| Persistent volumes | Supported<sup>1</sup> |
| PV expansion/resize | Supported |
| Snapshots | Not supported |
| Replication | Not supported |

<sup>1</sup> By default, Azure Container Storage uses generic ephemeral volumes for local NVMe disks, meaning data isn't retained after pod deletion. To enable persistent volumes that aren't linked to the lifecycle of the pod, add the appropriate annotation to your Persistent Volume Claim. For details, see [Create persistent volumes with local NVMe disks](use-container-storage-with-local-disk.md).

## Regional availability

[!INCLUDE [container-storage-regions](../../../includes/container-storage-regions.md)]

## Considerations for choosing a major version

Azure Container Storage offers two major versions: v1 and v2. Choose the appropriate version based on your underlying storage option.

- **Local NVMe disks**: Choose Azure Container Storage v2.
- **Azure Disks**: Choose Azure Container Storage v1. Azure Container Storage v2 doesn't have Azure Disks support yet.
- **Azure Elastic SAN**: Choose Azure Container Storage v1. Azure Container Storage v2 doesn't have Azure Elastic SAN support yet.

## Glossary

To better navigate Azure Container Storage and Kubernetes concepts, familiarize yourself with these essential terms:

-   **Containerization**

    Packing application code with only the operating system and required dependencies to create a single executable.

-  **Kubernetes**

    Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.

-  **Azure Kubernetes Service (AKS)**

    [Azure Kubernetes Service](/azure/aks/intro-kubernetes) is a hosted Kubernetes service that simplifies deploying a managed Kubernetes cluster in Azure by offloading the operational overhead to Azure. Azure handles critical tasks, like health monitoring and maintenance.

-  **Cluster**

    A Kubernetes cluster is a set of compute nodes (VMs) that run containerized applications. Each node is managed by the control plane and contains the services necessary to run pods.

-  **Pod**

    A pod is a group of one or more containers, with shared storage and network resources, and a specification for how to run the containers. A pod is the smallest deployable unit in a Kubernetes cluster.

-   **Storage class**

    A Kubernetes storage class defines how a unit of storage is dynamically created with a persistent volume. For more information, see [Kubernetes Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/).

-  **Volume**

    A Kubernetes volume is a directory containing data accessible to containers in a given pod. Volumes can be persistent or ephemeral. Volumes are thinly provisioned within a storage pool and share the performance characteristics (IOPS, bandwidth, and capacity) of the storage pool.

-   **Persistent volume**

    Persistent volumes are like disks in a VM. They represent a raw block device that you can use to mount any file system. Application developers create persistent volumes alongside their application or pod definitions, and the volumes are often tied to the lifecycle of the stateful application. For more information, see [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/).

-   **Persistent volume claim (PVC)**

    A persistent volume claim is used to automatically provision storage based on a storage class.

## Next steps

- [Install Azure Container Storage for use with AKS](install-container-storage-aks.md)
- [Azure Container Storage pricing](https://aka.ms/AzureContainerStoragePricingPage)
- [Azure Container Storage (version 1.x.x)](container-storage-introduction-version-1.md)
- [Overview of deploying a highly available PostgreSQL database on Azure Kubernetes Service (AKS)](/azure/aks/postgresql-ha-overview#storage-considerations)