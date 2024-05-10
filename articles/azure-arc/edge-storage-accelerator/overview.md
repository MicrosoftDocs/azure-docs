---
title: What is Edge Storage Accelerator? (preview)
description: Learn about Edge Storage Accelerator.
author: sethmanheim
ms.author: sethm
ms.topic: overview
ms.date: 04/08/2024

---

# What is Edge Storage Accelerator? (preview)

> [!IMPORTANT]
> Edge Storage Accelerator is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> For access to the preview, you can [complete this questionnaire](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR19S7i8RsvNAg8hqZuHbEyxUNTEzN1lDT0s3SElLTDc5NlEzQTE2VVdKNi4u) with details about your environment and use case. Once you submit your responses, one of the ESA team members will get back to you with an update on your request.

Edge Storage Accelerator (ESA) is a first-party storage system designed for Arc-connected Kubernetes clusters. ESA can be deployed to write files to a "ReadWriteMany" persistent volume claim (PVC) where they are then transferred to Azure Blob Storage. ESA offers a range of features to support Azure IoT Operations and other Arc Services. ESA with high availability and fault-tolerance will be fully supported and generally available (GA) in the second half of 2024.

## What does Edge Storage Accelerator do?

Edge Storage Accelerator (ESA) serves as a native persistent storage system for Arc-connected Kubernetes clusters. Its primary role is to provide a reliable, fault-tolerant file system that allows data to be tiered to Azure. For Azure IoT Operations (AIO) and other Arc Services, ESA is crucial in making Kubernetes clusters stateful. Key features of ESA for Arc-connected K8s clusters include:

- **Tolerance to Node Failures:** When configured as a 3 node cluster, ESA replicates data between nodes (triplication) to ensure high availability and tolerance to single node failures.
- **Data Synchronization to Azure:** ESA is configured with a storage target, so data written to ESA volumes is automatically tiered to Azure Blob (block blob, ADLSgen-2 or OneLake) in the cloud.
- **Low Latency Operations:** Arc services, such as AIO, can expect low latency for read and write operations.
- **Simple Connection:** Customers can easily connect to an ESA volume using a CSI driver to start making Persistent Volume Claims against their storage.
- **Flexibility in Deployment:** ESA can be deployed as part of AIO or as a standalone solution.
- **Observable:** ESA supports industry standard Kubernetes monitoring logs and metrics facilities, and supports Azure Monitor Agent observability.
- **Designed with Integration in Mind:** ESA integrates seamlessly with AIO's Data Processor to ease the shuttling of data from your edge to Azure.  
- **Platform Neutrality:** ESA is a Kubernetes storage system that can run on any Arc Kubernetes supported platform. Validation was done for specific platforms, including Ubuntu + CNCF K3s/K8s, Windows IoT + AKS-EE, and Azure Stack HCI + AKS-HCI.

## How does Edge Storage Accelerator work?

- **Write** - Your file is processed locally and saved in the cache. When the file doesn't change within 3 seconds, ESA automatically uploads it to your chosen blob destination.
- **Read** - If the file is already in the cache, the file is served from the cache memory. If it isn't available in the cache, the file is pulled from your chosen blob storage target.

## Supported Azure Regions

Edge Storage Accelerator is only available in the following Azure regions:

- East US
- East US 2
- West US 3
- West Europe

## Next steps

- [Prepare Linux](prepare-linux.md)
- [How to install Edge Storage Accelerator](install-edge-storage-accelerator.md)
- [Create a persistent volume](create-pv.md)
- [Monitor your deployment](azure-monitor-kubernetes.md)
