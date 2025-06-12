---
title: What are Azure Extended Zones?
description: Learn about Azure Extended Zones and how they can help you run latency-sensitive and throughput-intensive applications close to end users.
author: halkazwini
ms.author: halkazwini
ms.service: azure-extended-zones
ms.topic: overview
ms.date: 05/02/2025
---

# What are Azure Extended Zones?

Azure Extended Zones are small-footprint extensions of Azure placed in metros, industry centers, or a specific jurisdiction to serve low latency and data residency workloads. Azure Extended Zones supports virtual machines (VMs), containers, storage, and a selected set of Azure services and can run latency-sensitive and throughput-intensive applications close to end users and within approved data residency boundaries.
 
Azure Extended Zones are part of the Microsoft global network that provides secure, reliable, high-bandwidth connectivity between applications that run on an Azure Extended Zone close to the user. Extended Zones address low latency and data residency by bringing all the goodness of the Azure ecosystem (access, user experience, automation, security, etc.) closer to the customer or their jurisdiction. Azure customers can provision and manage their Azure Extended Zones resources, services, and workloads through the Azure portal and other essential Azure tools.

## Key scenarios

The key scenarios Azure Extended Zones enable are: 

- **Latency**: users want to run their resources, for example, media editing software, remotely with low latency.

- **Data residency**: users want their applications data to stay within a specific geography and might essentially want to host locally for various privacy, regulatory, and compliance reasons.

The following diagram shows some of the industries and use cases where Azure Extended Zones can provide benefits.

:::image type="content" source="./media/overview/azure-extended-zones-industries.png" alt-text="Diagram that shows industries and use cases where Azure Extended Zones can provide benefits." lightbox="./media/overview/azure-extended-zones-industries.png":::

## Availability and access

See [Request access to Azure Extended Zones](request-access.md) to learn how to request access to Extended Zones. A comprehensive list of Extended Zones will be listed in the process.

## Service offerings for Azure Extended Zones

Azure Extended Zones enable some key Azure services for customers to deploy. The control plane for these services remains in the region and the data plane is deployed at the Extended Zone site, resulting in a smaller Azure footprint.

The following diagram shows how Azure services are deployed at the Azure Extended Zones location.

:::image type="content" source="./media/overview/azure-extended-zone-services.png" alt-text="Diagram that shows available Azure services at an Azure Extended Zone." lightbox="./media/overview/azure-extended-zone-services.png":::


The following table lists key services that are available in Azure Extended Zones:

| Service category | Available Azure services and features |
| ------------------ | ------------------- |
| **Compute** | [Azure Kubernetes Service](/azure/aks/extended-zones?tabs=azure-resource-manager)* <br> [Azure Virtual Desktop](../virtual-desktop/azure-extended-zones.md)* <br> [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/overview) <br> [Virtual machines](/azure/virtual-machines/overview) (general purpose: A, B, D, E, and F series and GPU NVadsA10 v5 series**)|
| **Networking** | [DDoS](../ddos-protection/ddos-protection-overview.md) (Standard protection) <br> [ExpressRoute](../expressroute/expressroute-introduction.md) <br> [Private Link](../private-link/private-link-overview.md) <br> [Standard Load Balancer](../load-balancer/load-balancer-overview.md) <br> [Standard public IP](../virtual-network/ip-services/public-ip-addresses.md) <br> [Virtual Network](../virtual-network/virtual-networks-overview.md) <br> [Virtual network peering](../virtual-network/virtual-network-peering-overview.md) |
| **Storage** | [Managed disks](/azure/virtual-machines/managed-disks-overview) <br> [Premium Page Blobs](../storage/blobs/storage-blob-pageblob-overview.md) <br> [Premium Block Blobs](../storage/blobs/storage-blob-block-blob-premium.md) <br> [Premium Files](../storage/files/storage-files-introduction.md) <br> [Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) <br> [Hierarchical Namespace](../storage/blobs/data-lake-storage-namespace.md) <br>Data Lake Storage Gen2 Flat Namespace <br> [Change Feed](/azure/cosmos-db/change-feed) <br> Blob Features <br> - [SFTP](../storage/blobs/secure-file-transfer-protocol-support.md) <br> - [NFS](../storage/files/files-nfs-protocol.md) |
| **BCDR** | [Azure Site Recovery](../site-recovery/site-recovery-overview.md)* <br> [Azure Backup](../backup/backup-overview.md) |
| **Arc-enabled PaaS** | [ContainerApps](/azure/extended-zones/arc-enabled-workloads-container-apps)* <br> [PostgreSQL](/azure/extended-zones/arc-enabled-workloads-postgre-sql)* <br> [ManagedSQL](/azure/extended-zones/arc-enabled-workloads-managed-sql)* |

\* While these services are GA in Azure Regions, they are currently in Preview in Azure Extended Zones.  
\** [Learn more about Virtual Machine family series here](/azure/virtual-machines/sizes/overview?tabs=breakdownseries%2Cgeneralsizelist%2Ccomputesizelist%2Cmemorysizelist%2Cstoragesizelist%2Cgpusizelist%2Cfpgasizelist%2Chpcsizelist). You can obtain a detailed VM list in the Azure Extended Zones environment. 

## Frequently asked questions (FAQ)

To get answers to frequently asked questions about Azure Extended Zones, see [Azure Extended Zones FAQ](faq.md).

## Related content

- [Quickstart: Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Tutorial: Back up an Azure Extended Zone virtual machine](backup-virtual-machine.md)
- [Azure Extended Zones frequently asked questions (FAQ)](faq.md)