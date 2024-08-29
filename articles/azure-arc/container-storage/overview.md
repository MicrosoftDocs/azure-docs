---
title: What is Azure Container Storage enabled by Azure Arc? (preview)
description: Learn about Azure Container Storage enabled by Azure Arc.
author: sethmanheim
ms.author: sethm
ms.topic: overview
ms.date: 08/26/2024
ms.custom: references_regions

---

# What is Azure Container Storage enabled by Azure Arc? (preview)

> [!IMPORTANT]
> Azure Container Storage enabled by Azure Arc is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Container Storage enabled by Azure Arc is a first-party storage system designed for Arc-connected Kubernetes clusters. Azure Container Storage enabled by Azure Arc can be deployed to write files to a "ReadWriteMany" persistent volume claim (PVC) where they are then transferred to Azure Blob Storage. Azure Container Storage enabled by Azure Arc offers a range of features to support Azure IoT Operations and other Arc services. Azure Container Storage enabled by Azure Arc with high availability and fault-tolerance will be fully supported and generally available (GA) in the second half of 2024.

## What does Azure Container Storage enabled by Azure Arc do?

Azure Container Storage enabled by Azure Arc serves as a native persistent storage system for Arc-connected Kubernetes clusters. Its primary role is to provide a reliable, fault-tolerant file system that allows data to be tiered to Azure. For Azure IoT Operations (AIO) and other Arc Services, Azure Container Storage enabled by Azure Arc is crucial in making Kubernetes clusters stateful. Key features of Azure Container Storage enabled by Azure Arc for Arc-connected K8s clusters include:

- **Tolerance to node failures:** When configured as a 3 node cluster, Azure Container Storage enabled by Azure Arc replicates data between nodes (triplication) to ensure high availability and tolerance to single node failures.
- **Data synchronization to Azure:** Azure Container Storage enabled by Azure Arc is configured with a storage target, so data written to volumes is automatically tiered to Azure Blob (block blob, ADLSgen-2 or OneLake) in the cloud.
- **Low latency operations:** Arc services, such as AIO, can expect low latency for read and write operations.
- **Simple connection:** Customers can easily connect to an Azure Container Storage enabled by Azure Arc volume using a CSI driver to start making Persistent Volume Claims against their storage.
- **Flexibility in deployment:** Azure Container Storage enabled by Azure Arc can be deployed as part of AIO or as a standalone solution.
- **Observable:** Azure Container Storage enabled by Azure Arc supports industry standard Kubernetes monitoring logs and metrics facilities, and supports Azure Monitor Agent observability.
- **Designed with integration in mind:** Azure Container Storage enabled by Azure Arc integrates seamlessly with AIO's Data Processor to ease the shuttling of data from your edge to Azure.  
- **Platform neutrality:** Azure Container Storage enabled by Azure Arc is a Kubernetes storage system that can run on any Arc Kubernetes supported platform. Validation was done for specific platforms, including Ubuntu + CNCF K3s/K8s, Windows IoT + AKS-EE, and Azure Stack HCI + AKS-HCI.

## What are the different Azure Container Storage enabled by Azure Arc offerings?

The original Azure Container Storage enabled by Azure Arc offering is [*Cache Volumes*](cache-volumes-overview.md). The newest offering is [*Edge Volumes*](install-edge-volumes.md).

## What are Azure Container Storage enabled by Azure Arc Edge Volumes?

The first addition to the Edge Volumes offering is *Local Shared Edge Volumes*, providing highly available, failover-capable storage, local to your Kubernetes cluster. This shared storage type remains independent of cloud infrastructure, making it ideal for scratch space, temporary storage, and locally persistent data unsuitable for cloud destinations.

The second new offering is *Cloud Ingest Edge Volumes*, which facilitates limitless data ingestion from edge to Blob, including ADLSgen2 and OneLake. Files written to this storage type are seamlessly transferred to Blob storage and subsequently purged from the local cache once confirmed uploaded, ensuring space availability for new data. Moreover, this storage option supports data integrity in disconnected environments, enabling local storage and synchronization upon reconnection to the network.

Tailored for IoT applications, Edge Volumes not only eliminates local storage concerns and ingest limitations, but also optimizes local resource utilization and reduces storage requirements.

### How does Edge Volumes work?

You write to Edge Volumes as if it was your local file system. For a Local Shared Edge Volume, your data is stored and left untouched. For a Cloud Ingest Edge Volume, the volume checks for new data to mark for upload every minute, and then uploads that new data to your specified cloud destination. Five minutes after the confirmed upload to the cloud, the local copy is purged, allowing you to keep your local volume clear of old data and continue to receive new data.

Get started with [Edge Volumes](prepare-linux-edge-volumes.md).

### Supported Azure regions for Azure Container Storage enabled by Azure Arc

Azure Container Storage enabled by Azure Arc is only available in the following Azure regions:

- East US
- East US 2
- West US
- West US 2
- West US 3
- North Europe
- West Europe

## Next steps

- [Prepare Linux](prepare-linux-edge-volumes.md)
- [How to install Azure Container Storage enabled by Azure Arc](install-edge-volumes.md)
