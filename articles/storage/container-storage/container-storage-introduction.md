---
title: Introduction to Azure Container Storage
description: An overview of Azure Container Storage, a service built natively for containers that enables customers to create and manage volumes for running production-scale stateful container applications (preview).
author: khdownie
ms.service: storage
ms.topic: overview
ms.date: 03/07/2023
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

This public preview only supports Linux-based [Azure Kubernetes Service (AKS)](../../aks/intro-kubernetes.md) clusters.

(https://learn.microsoft.com/azure/aks/intro-kubernetes) clusters with [Azure managed disks](../../virtual-machines/managed-disks-overview.md).

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

## Next Steps
- [Deploy Azure Container Storage](container-storage-aks-quickstart.md)
- [Azure Container Storage pricing page](https://aka.ms/AzureContainerStoragePricingPage)