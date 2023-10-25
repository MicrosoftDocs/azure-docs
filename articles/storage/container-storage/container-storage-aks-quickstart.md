---
title: Quickstart for using Azure Container Storage Preview with Azure Kubernetes Service (AKS)
description: Learn how to install Azure Container Storage Preview on an Azure Kubernetes Service cluster using an installation script.
author: khdownie
ms.service: azure-container-storage
ms.topic: quickstart
ms.date: 09/20/2023
ms.author: kendownie
---

# Quickstart: Use Azure Container Storage Preview with Azure Kubernetes Service
[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This Quickstart shows you how to install Azure Container Storage Preview on an [Azure Kubernetes Service (AKS)](../../aks/intro-kubernetes.md) cluster using a provided installation script.

## Prerequisites

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]

- You'll need an AKS cluster with an appropriate [virtual machine type](install-container-storage-aks.md#vm-types). If you don't already have an AKS cluster, follow [these instructions](install-container-storage-aks.md#getting-started) to create one.

> [!IMPORTANT]
> If you created your AKS cluster using the Azure portal, it will likely have two node pools: a user node pool and a system/agent node pool. Before you can install Azure Container Storage, you must label the user node pool. In this article, this is done automatically by passing the user node pool name to the script as a parameter. However, if your cluster consists of only a system node pool, which is often the case with test/dev clusters, you'll need to first [add a new user node pool](../../aks/create-node-pools.md#add-a-node-pool) before running the script. This is because when you create an AKS cluster using the Azure portal, a taint `CriticalAddOnsOnly` gets added to the agent/system nodepool, which blocks installation of Azure Container Storage on the system node pool. This taint isn't added when an AKS cluster is created using Azure CLI. 

## Install Azure Container Storage

[!INCLUDE [container-storage-script-install](../../../includes/container-storage-script-install.md)]

## Choose a data storage option

Next you'll need to choose a back-end storage option to create your storage pool. Choose one of the following three options and follow the link to create a storage pool and persistent volume claim.

- **Azure Elastic SAN Preview**: Azure Elastic SAN preview is a good fit for general purpose databases, streaming and messaging services, CD/CI environments, and other tier 1/tier 2 workloads. Storage is provisioned on demand per created volume and volume snapshot. Multiple clusters can access a single SAN concurrently, however persistent volumes can only be attached by one consumer at a time. [Create a storage pool using Azure Elastic SAN Preview](use-container-storage-with-elastic-san.md#create-a-storage-pool).

- **Azure Disks**: Azure Disks are a good fit for databases such as MySQL, MongoDB, and PostgreSQL. Storage is provisioned per target container storage pool size and maximum volume size. [Create a storage pool using Azure Disks](use-container-storage-with-managed-disks.md#create-a-storage-pool).

- **Ephemeral Disk**: This option uses local NVMe drives on the AKS nodes and is extremely latency sensitive (low sub-ms latency), so it's best for applications with no data durability requirement or with built-in data replication support such as Cassandra. AKS discovers the available ephemeral storage on AKS nodes and acquires the drives for volume deployment. [Create a storage pool using Ephemeral Disk](use-container-storage-with-local-disk.md#create-a-storage-pool).
