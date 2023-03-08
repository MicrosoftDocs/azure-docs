---
title: Introduction to Azure Container Storage
description: An overview of Azure Container Storage, a service built natively for containers that enables customers to create and manage volumes for running production-scale stateful container applications (preview).
author: khdownie
ms.service: storage
ms.topic: overview
ms.date: 03/08/2023
ms.author: kendownie
ms.subservice: container-storage
ms.custom: references_regions
---

# What is Azure Container Storage?

> [!IMPORTANT]
> Azure Container Storage is currently in public preview and isn't available in all Azure regions.
> This preview version is provided without a service level agreement, and isn't recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Container Storage is a cloud-based volume management offering built natively for containers. It integrates volume management and deployment with Kubernetes, allowing customers to dynamically and automatically provision persistent volumes so they can focus on running workloads instead of managing storage.

This public preview only supports Linux-based [Azure Kubernetes Service (AKS)](../../aks/intro-kubernetes.md) clusters with [Azure managed disks](../../virtual-machines/managed-disks-overview.md).

To get started using Azure Container Storage, see [Quickstart: Use Azure Container Storage with AKS](container-storage-aks-quickstart.md).

## Regional availability

The Azure Container Storage preview is only available in the following Azure regions:

- East US
- East US 2
- West US
- West US 2
- South Central US
- UK South
- Southeast Asia
- Australia East
- North Europe
- West Europe
- Sweden Central
- France Central

## Why Azure Container Storage is useful
Until now, providing cloud storage for containers required using individual container storage interface (CSI) drivers to use storage services intended for IaaS-centric workloads and make them work for containers. This creates operational overhead and increases the risk of issues with application availability, scalability, performance, usability, and cost.

Azure Container Storage is built on OpenEBS, an open-source solution that provides container storage capabilities for Kubernetes. By offering a managed control plane with built-in CSI drivers and storage classes, Azure Container Storage enables true container-native storage.

You can use Azure Container Storage to:

* **Accelerate VM-to-container initiatives**:  
    New Azure customers can accelerate time to value for Kubernetes adoption, and customers using other Azure storage services for containers can seamlessly move to Azure Container Storage volumes.

* **Simplify volume management with Kubernetes**:  
    By providing volume orchestration via the Kubernetes control plane, Azure Container Storage makes it easy to deploy and manage volumes within Kubernetes - without the need to move back and forth between different control planes.

* **Reduce total cost of ownership (TCO)**:
    Improve cost efficiency by packing and mounting a large number of storage volumes per node. Increase disk utilization for stateful workloads, enabling dynamic sharing of resources provisioned on the Azure Container Storage Pool across all deployed persistent volumes.

## Key benefits
* **Rapid scale up and scale out**. Start small and deploy resources as needed while making sure that applications aren't starved or disrupted during initialization or in production. Azure Container Storage enables sub-second volume creation using thin provisioning, making it easy to scale up or out.
* **Maximize stateful workload performance**. Azure Container Storage enables superior read performance by leveraging local caches where possible. It also provides near-disk write performance by using NVMe-oF over RDMA. This allows customers to cost-effectively meet performance requirements for various container workloads including tier 1 I/O intensive, general purpose, throughput sensitive, and dev/test. Accelerate the attach/detach time of persistent volumes and minimize pod failover time.
* **Integrated data protection with recoverability**. Recover stateful workloads within a cluster, across clusters, or across regions at different granularities, including per pod, per application, or cluster-wide.

## Glossary 
It's helpful to understand some key terms relating to Azure Container Storage and related technologies:

-   **Containerization**

    Packing application code with only the operating system and required dependencies to create a single executable.

-  **Kubernetes**

    Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications. A Kubernetes cluster is a set of nodes that run containerized applications.

-  **Azure Kubernetes Service (AKS)**

    AKS is a hosted Kubernetes service that simplifies deploying a managed Kubernetes cluster in Azure by offloading the operational overhead to Azure. Azure handles critical tasks, like health monitoring and maintenance.

-   **Mayastor**

    An adaptation of the open source openEBS stack based on the Mayastor data engine provides the cluster-centric software stack for Azure Container Storage.

-   **Storage pool**

    The Azure Container Storage stack attempts to unify the object model across cluster owned resources and platform abstractions. To accomplish the unified representation, the available storage capacity is aggregated into a storage pool object. The storage capacity within a storage pool is considered homogeneous. An AKS cluster can have multiple storage pools. Storage pools also serve as the authentication and provisioning boundary. They provide a logical construct for operators to manage the storage infrastructure while simplifying volume creation and management for application developers.

-   **Storage class**

    A Kubernetes storage class defines how a unit of storage is dynamically created with a persistent volume. For more information, see [Kubernetes Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/).

-   **Persistent volume**

    Persistent volumes are like disks in a virtual machine. They represent a raw block device that you can use to mount any file system. Volumes are thinly provisioned within a storage pool and share the performance characteristics (IOPS, bandwidth, and capacity) of the storage pool. Application developers create persistent volumes alongside their application or pod definitions, and the volumes are often tied to the lifecycle of the stateful application.

-   **Persistent volume claim (PVC)**

    A persistent volume claim is used to automatically provision storage based on a storage class.


## Next Steps
- [Deploy Azure Container Storage](container-storage-aks-quickstart.md)
- [Azure Container Storage pricing page](https://aka.ms/AzureContainerStoragePricingPage)