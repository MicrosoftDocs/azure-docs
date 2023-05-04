---
title: Introduction to Azure Container Storage Preview
description: An overview of Azure Container Storage Preview, a service built natively for containers that enables customers to create and manage volumes for running production-scale stateful container applications.
author: khdownie
ms.service: storage
ms.topic: overview
ms.date: 05/01/2023
ms.author: kendownie
ms.subservice: container-storage
ms.custom: references_regions
---

# What is Azure Container Storage? Preview

> [!IMPORTANT]
> Azure Container Storage is currently in public preview and isn't available in all Azure regions.
> This preview version is provided without a service level agreement, and isn't recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Container Storage is a cloud-based volume management, deployment, and orchestration service built natively for containers. It integrates with Kubernetes, allowing customers to dynamically and automatically provision persistent volumes to store data for stateful applications running on Kubernetes clusters.

To sign up for Azure Container Storage Preview, complete the [onboarding survey](https://aka.ms/AzureContainerStoragePreviewSignUp). To get started using Azure Container Storage, see [Quickstart: Use Azure Container Storage with AKS](container-storage-aks-quickstart.md).

## Supported storage types

Azure Container Storage utilizes existing Azure storage offerings for actual storage and offers a volume orchestration and management solution purposely built for containers. You can choose any of the supported backing storage options to create a storage pool for your persistent volumes.

Azure Container Storage Preview supports Linux-based [Azure Kubernetes Service (AKS)](../../aks/intro-kubernetes.md) clusters with block storage. The following table summarizes the supported storage types, recommended workloads, and provisioning models.

| **Storage type** | **Description** | **Workloads** | **Offerings** | **Provisioning model** |
|------------------|-----------------|---------------|---------------|------------------------|
| **[Ephemeral OS Disk](../../virtual-machines/ephemeral-os-disks.md)** | Utilizes local storage resources on AKS nodes | Ephemeral disk is extremely latency sensitive (low sub-ms latency), so it's best for applications with no data durability requirement or with built-in data replication support such as Cassandra. | Temporary storage, SSD or NVMe | Deployed as part of the VMs hosting an AKS cluster. AKS discovers the available ephemeral storage on AKS nodes and acquires them for volume deployment. |
| **[Azure Disks](../../virtual-machines/managed-disks-overview.md)** | Granular control of storage SKUs and configurations​ | Azure Disks are a good fit for tier 1 and general purpose databases such as MySQL, MongoDB, and PostgreSQL. | Premium SSD v2, Premium SSD | Provisioned per target container storage pool size and maximum volume size. |
| **[Azure Elastic SAN Preview](../elastic-san/elastic-san-introduction.md)** | Provision on demand, fully managed resource | General purpose databases, streaming and messaging services, CD/CI environments, and other tier 1/tier 2 workloads. | Azure Elastic SAN Preview | Provisioned on demand per created volume and volume snapshot. Multiple clusters can access a single SAN concurrently, however persistent volumes can only be attached by one consumer at a time. |

## Regional availability

Azure Container Storage Preview is only available in the following Azure regions:

- East US
- West Europe

## Why Azure Container Storage is useful
Until now, providing cloud storage for containers required using individual container storage interface (CSI) drivers to use storage services intended for IaaS-centric workloads and make them work for containers. This creates operational overhead and increases the risk of issues with application availability, scalability, performance, usability, and cost.

Azure Container Storage is built on [OpenEBS](https://openebs.io/), an open-source solution that provides container storage capabilities for Kubernetes. By offering a managed control plane with built-in CSI drivers and storage classes, Azure Container Storage enables true container-native storage.

You can use Azure Container Storage to:

* **Accelerate VM-to-container initiatives:** New Azure customers can accelerate time to value for Kubernetes adoption, and customers using other Azure storage services for containers can seamlessly move to Azure Container Storage volumes.

* **Simplify volume management with Kubernetes:** By providing volume orchestration via the Kubernetes control plane, Azure Container Storage makes it easy to deploy and manage volumes within Kubernetes - without the need to move back and forth between different control planes.

* **Reduce total cost of ownership (TCO):** Improve cost efficiency by packing and mounting a large number of storage volumes per node. Increase disk utilization for stateful workloads, enabling dynamic sharing of resources provisioned on the Azure Container Storage pool across all deployed persistent volumes. Dynamically scale storage resources based on demand.

## Key benefits
* **Rapid scale up and scale out without downtime:** Azure Container Storage uses thin provisioning to create volumes in less than a second. You can start small and deploy resources as needed while making sure your applications aren't starved or disrupted, either during initialization or in production.

* **Improved performance for stateful workloads:** Azure Container Storage enables superior read performance by leveraging local caches. It also provides near-disk write performance by using NVMe-oF over RDMA. This allows customers to cost-effectively meet performance requirements for various container workloads including tier 1 I/O intensive, general purpose, throughput sensitive, and dev/test. Accelerate the attach/detach time of persistent volumes and minimize pod failover time.

* **Kubernetes-native volume orchestration:** You can create storage pools and persistent volumes, capture snapshots, and manage the entire lifecycle of volumes using `kubectl` commands without switching between toolsets for different control plane operations.

## Glossary 
It's helpful to understand some key terms relating to Azure Container Storage and Kubernetes:

-   **Containerization**

    Packing application code with only the operating system and required dependencies to create a single executable.

-  **Kubernetes**

    Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications. A Kubernetes cluster is a set of nodes that run containerized applications.

-  **Azure Kubernetes Service (AKS)**

    AKS is a hosted Kubernetes service that simplifies deploying a managed Kubernetes cluster in Azure by offloading the operational overhead to Azure. Azure handles critical tasks, like health monitoring and maintenance.

-   **Mayastor**

    An adaptation of the open source OpenEBS stack based on the Mayastor data engine provides the cluster-centric software stack for Azure Container Storage.

-   **Storage pool**

    The Azure Container Storage stack attempts to unify the object model across cluster owned resources and platform abstractions. To accomplish the unified representation, the available storage capacity is aggregated into a storage pool object. The storage capacity within a storage pool is considered homogeneous. An AKS cluster can have multiple storage pools. Storage pools also serve as the authentication and provisioning boundary. They provide a logical construct for operators to manage the storage infrastructure while simplifying volume creation and management for application developers.

-   **Storage class**

    A Kubernetes storage class defines how a unit of storage is dynamically created with a persistent volume. For more information, see [Kubernetes Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/).

-   **Persistent volume**

    Persistent volumes are like disks in a virtual machine. They represent a raw block device that you can use to mount any file system. Volumes are thinly provisioned within a storage pool and share the performance characteristics (IOPS, bandwidth, and capacity) of the storage pool. Application developers create persistent volumes alongside their application or pod definitions, and the volumes are often tied to the lifecycle of the stateful application. For more information, see [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/).

-   **Persistent volume claim (PVC)**

    A persistent volume claim is used to automatically provision storage based on a storage class.

## Next steps
- [Deploy Azure Container Storage](container-storage-aks-quickstart.md)
- [Azure Container Storage pricing page](https://aka.ms/AzureContainerStoragePricingPage)