---
title: What is Edge Storage Accelerator?
description: Learn about Edge Storage Accelerator.
author: sethmanheim
ms.author: sethm
ms.topic: overview
ms.date: 02/06/2024

---

# What is Edge Storage Accelerator?

Edge Storage Accelerator (ESA) is a 1P storage system designed for Arc-connected Kubernetes clusters. ESA can be deployed to write files to a "ReadWriteMany" persistent volume claim (PVC) where they are then transferred to Azure Blob Storage. ESA offers a range of features to support Azure IoT Operations and other Arc Services. ESA with high availability and fault-tolerance is set to be fully supported and generally available (GA) in the Summer of 2024.

## What does Edge Storage Accelerator do?

Edge Storage Accelerator (ESA) serves as a native persistent storage system for Arc-connected Kubernetes clusters. Its primary role is to provide a reliable, fault-tolerant file system that allows data to be tiered to Azure. For Azure IoT Operations (AIO) and other Arc Services, ESA is crucial in making Kubernetes clusters stateful. Key features of ESA for Arc-connected K8s clusters include:

- **Tolerance to Node Failures:** When configured as a 3 node cluster, ESA replicates data between nodes (triplication) to ensure high availability and tolerance to single node failures.
- **Data Synchronization to Azure:** ESA is configured with a storage target, so data written to ESA volumes will be automatically tiered to Azure Blob (block blob, ADLSgen-2 or OneLake) in the cloud.
- **Low Latency Operations:** Arc services, such as AIO, can expect low latency for read and write operations.
- **Simple Connection:** Customers can easily connect to an ESA volume using a CSI driver to start making Persistent Volume Claims against their storage.
- **Flexibility in Deployment:** ESA can be deployed as part of AIO or as a standalone solution.
- **Observable:** ESA supports industry standard Kubernetes monitoring logs and metrics facilities. ESA will support Azure Monitor Agent observability.
- **Designed with Integration in Mind:** ESA will integrate seamlessly with AIO's Data Processor to ease the shuttling of data from your edge to Azure.  
- **Platform Neutrality:** ESA is a Kubernetes storage system that can run on any Arc Kubernetes supported platform. Validation has been done for specific platforms, including Ubuntu + CNCF K3s/K8s, Windows IoT + AKS-EE, and Azure Stack HCI + AKS-HCI.

## How does Edge Storage Accelerator work?

- **Write** - Your file will be processed locally and saved in the cache. When your file hasn't changed in 3 seconds, ESA will automatically upload it to your chosen blob destination.
- **Read** - If the file is already in the cache, the file will be served from the cache memory. If it isn't available in the cache, the file will be pulled from your chosen blob storage target.

The following diagram shows the end-to-end flow of the Edge Storage Accelerator configuration and installation experience.

:::image type="content" source="media/arc-connected-aks-on-azure.png" alt-text="Diagram showing the flow of Edge Storage Accelerator." lightbox="media/arc-connected-aks-on-azure.png":::

## Next steps

- [Prepare Linux](prepare-linux.md)
- [How to install Edge Storage Accelerator](install-edge-storage-accelerator.md)
- [Create a persistent volume](create-pv.md)
- [Monitor your deployment](azure-monitor-kubernetes.md)
