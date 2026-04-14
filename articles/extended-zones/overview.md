---
title: What is Azure Extended Zones?
description: Learn about Azure Extended Zones and how it can help you run latency-sensitive and throughput-intensive applications close to users.
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: overview
ms.date: 12/08/2025
---

# What is Azure Extended Zones?

Azure Extended Zones provides small-footprint extensions of Azure that you can place in metropolitan areas, industry centers, or a specific jurisdiction to serve low latency and data residency workloads. Azure Extended Zones supports virtual machines (VMs), containers, storage, and a selected set of Azure services. Azure Extended Zones can run latency-sensitive and throughput-intensive applications close to users and within approved data residency boundaries.

Azure Extended Zones is part of the Microsoft global network that provides secure, reliable, high-bandwidth connectivity between applications that run on an extended zone close to the user. Extended zones address low latency and data residency by bringing all the advantages of the Azure ecosystem closer to the customer or their jurisdiction. These advantages include access, user experience, automation, and security. Azure customers can provision and manage their Azure Extended Zones resources, services, and workloads through the Azure portal and other essential Azure tools.

## Key scenarios

Azure Extended Zones enables the following key scenarios:

- **Latency**: Users want to run their resources remotely with low latency. An example is media editing software.
- **Data residency**: Users want their application data to stay within a specific geography. They also might want to host locally for various privacy, regulatory, and compliance reasons.

The following diagram shows some of the industries and use cases where Azure Extended Zones can provide benefits.

:::image type="content" source="./media/overview/azure-extended-zones-industries.png" alt-text="Diagram that shows industries and use cases where Azure Extended Zones can provide benefits." lightbox="./media/overview/azure-extended-zones-industries.png":::

## Availability and access

To learn how to request access to Azure Extended Zones, see [Request access to Azure Extended Zones](request-access.md). In the process, a comprehensive list of extended zones is generated.

## Service offerings for Azure Extended Zones

Extended zones enable some key Azure services for customers to deploy. The control plane for these services remains in the region. The data plane is deployed at the Azure Extended Zones site, which results in a smaller Azure footprint.

The following diagram shows how Azure services are deployed at the Azure Extended Zones location.

:::image type="content" source="./media/overview/azure-extended-zone-services.png" alt-text="Diagram that shows available Azure services at an extended zone." lightbox="./media/overview/azure-extended-zone-services.png":::

The following table lists key services that are available in extended zones.

| Service category | Available Azure services and features |
| ------------------ | ------------------- |
| Compute | [Azure Kubernetes Service](/azure/aks/extended-zones?tabs=azure-resource-manager)* <br> [Azure Virtual Desktop](/azure/virtual-desktop/azure-extended-zones)* <br> [Azure Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/overview) <br> [Azure Virtual Machines](/azure/virtual-machines/overview) (general purpose: A, B, D, E, and F series and GPU NVadsA10 v5 series**) |
| Networking | [Distributed denial of service](../ddos-protection/ddos-protection-overview.md) (Standard protection) <br> [Azure ExpressRoute](../expressroute/expressroute-introduction.md) <br> [Azure Private Link](../private-link/private-link-overview.md) <br> [Azure Standard Load Balancer](../load-balancer/load-balancer-overview.md) <br> [Standard public IP](../virtual-network/ip-services/public-ip-addresses.md) <br> [Azure Virtual Networks](../virtual-network/virtual-networks-overview.md) <br> [Azure Virtual Networks peering](../virtual-network/virtual-network-peering-overview.md) <br> Azure Firewall (API version) |
| Storage | [Managed disks](/azure/virtual-machines/managed-disks-overview) <br> - Premium SSD <br> - Standard SSD <br> [Premium page blobs](../storage/blobs/storage-blob-pageblob-overview.md) <br> [Premium block blobs](../storage/blobs/storage-blob-block-blob-premium.md) <br> [Premium files](../storage/files/storage-files-introduction.md) <br> [Azure Data Lake Storage Gen2 hierarchical namespace](../storage/blobs/data-lake-storage-namespace.md) <br>Data Lake Storage Gen2 flat namespace <br> [Change feed](/azure/cosmos-db/change-feed) <br> Blob features <br> - [Secure File Transfer Protocol](../storage/blobs/secure-file-transfer-protocol-support.md) <br> - [Network File System](../storage/files/files-nfs-protocol.md) |
| Business continuity and disaster recovery | [Azure Site Recovery](../site-recovery/site-recovery-overview.md)* (extended zone to parent region) <br> [Azure Backup](../backup/backup-overview.md) |
| Azure Arc-enabled PaaS | [Azure Container Apps](/azure/extended-zones/arc-enabled-workloads-container-apps)* <br> [Azure SQL Managed Instance](/azure/extended-zones/arc-enabled-workloads-managed-sql)* |
| Other | [Azure Key Vault](/azure/extended-zones/key-vault-encrypt-azure-extended-zone-disk) (with encryption resources in the parent region, targeting the extended zone) <br> [Azure Policy](/azure/extended-zones/create-azure-policy) <br> [Reserved instances](/azure/extended-zones/purchase-reservations-savings-plans) (through recommendations flow) <br> [Savings plans](/azure/extended-zones/purchase-reservations-savings-plans) |

\* Although these services are generally available in Azure regions, they're currently in preview in extended zones.

\** [Learn more about sizes for virtual machines in Azure](/azure/virtual-machines/sizes/overview?tabs=breakdownseries%2Cgeneralsizelist%2Ccomputesizelist%2Cmemorysizelist%2Cstoragesizelist%2Cgpusizelist%2Cfpgasizelist%2Chpcsizelist). You can obtain a detailed VM list in the Azure Extended Zones environment.

## Supported software development companies

The following table lists the key software development companies that are supported in extended zones.

| Service provider | Supported services and features |
| ------------------ | ------------------- |
| Aviatrix | Cloud Native Security Fabric |
| Check Point | Firewall |
| Fortinet | Firewall |
| HPE Aruba Networking | [EdgeConnect SD-WAN](https://arubanetworking.hpe.com/techdocs/sdwan-PDFs/deployments/dg_ECV-Azure_latest.pdf) |

## Frequently asked questions

To get answers to frequently asked questions about Azure Extended Zones, see [Azure Extended Zones FAQ](faq.md).

## Related content

- [Quickstart: Deploy a virtual machine in an extended zone](deploy-vm-portal.md)
- [Tutorial: Back up an Azure Extended Zones virtual machine](backup-virtual-machine.md)
- [Azure Extended Zones frequently asked questions (FAQ)](faq.md)
