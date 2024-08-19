---
title: What is Azure Virtual Network encryption?
titleSuffix: Azure Virtual Network
description: Learn about Azure Virtual network encryption. Virtual network encryption allows you to seamlessly encrypt and decrypt traffic between Azure Virtual Machines.
ms.service: azure-virtual-network
author: asudbring
ms.author: allensu
ms.topic: overview
ms.date: 07/26/2024
ms.custom: references_regions
# Customer intent: As a network administrator, I want to learn about encryption in Azure Virtual Network so that I can secure my network traffic.

---

#  What is Azure Virtual Network encryption?

Azure Virtual Network encryption is a feature of Azure Virtual Networks. Virtual network encryption allows you to seamlessly encrypt and decrypt traffic between Azure Virtual Machines by creating a DTLS tunnel. 

Virtual network encryption enables you to encrypt traffic between Virtual Machines and Virtual Machines Scale Sets within the same virtual network. Virtual network encryption encrypts traffic between regionally and globally peered virtual networks. For more information about virtual network peering, see [Virtual network peering](/azure/virtual-network/virtual-network-peering-overview).

Virtual network encryption enhances existing encryption in transit capabilities in Azure. For more information about encryption in Azure, see [Azure encryption overview](/azure/security/fundamentals/encryption-overview).

## Requirements

Virtual network encryption has the following requirements:

- Virtual Network encryption is supported on general-purpose and memory optimized virtual machine instance sizes including:

    | Type | VM Series | VM SKU |
    | --- | --- | --- |
    | General purpose workloads | D-series V4 </br> D-series V5 </br> D-series V6 | **[Dv4 and Dsv4-series](/azure/virtual-machines/dv4-dsv4-series)** </br> **[Ddv4 and Ddsv4-series](/azure/virtual-machines/ddv4-ddsv4-series)** </br> **[Dav4 and Dasv4-series](/azure/virtual-machines/dav4-dasv4-series)** </br> **[Dv5 and Dsv5-series](/azure/virtual-machines/dv5-dsv5-series)** </br> **[Ddv5 and Ddsv5-series](/azure/virtual-machines/ddv5-ddsv5-series)** </br> **[Dlsv5 and Dldsv5-series](/azure/virtual-machines/dlsv5-dldsv5-series)** </br> **[Dasv5 and Dadsv5-series](/azure/virtual-machines/dasv5-dadsv5-series)** </br> **[Dasv6 and Dadsv6-series](/azure/virtual-machines/dasv6-dadsv6-series)** </br> **[Dalsv6 and Daldsv6-series](/azure/virtual-machines/dalsv6-daldsv6-series)** |
    | General purpose and memory intensive workloads | E-series V4 </br> E-series V5 </br> E-series V6 | **[Ev4 and Esv4-series](/azure/virtual-machines/ev4-esv4-series)** </br> **[Edv4 and Edsv4-series](/azure/virtual-machines/edv4-edsv4-series)** </br> **[Eav4 and Easv4-series](/azure/virtual-machines/eav4-easv4-series)** </br> **[Ev5 and Esv5-series](/azure/virtual-machines/ev5-esv5-series)** </br> **[Edv5 and Edsv5-series](/azure/virtual-machines/edv5-edsv5-series)** </br> **[Easv5 and Eadsv5-series](/azure/virtual-machines/easv5-eadsv5-series)** </br> **[Easv6 and Eadsv6-series](/azure/virtual-machines/easv6-eadsv6-series)** |
    | Storage intensive workloads | LSv3 | **[LSv3-series](/azure/virtual-machines/lsv3-series)**  |
    | Memory intensive workloads | M-series | **[Mv2-series](/azure/virtual-machines/mv2-series)** </br> **[Msv2 and Mdsv2-series Medium Memory](/azure/virtual-machines/msv2-mdsv2-series)** </br> **[Msv3 and Mdsv3 Medium Memory Series](/azure/virtual-machines/msv3-mdsv3-medium-series)** |

- Accelerated Networking must be enabled on the network interface of the virtual machine. For more information about Accelerated Networking, see  [What is Accelerated Networking?](/azure/virtual-network/accelerated-networking-overview).

- Encryption is only applied to traffic between virtual machines in a virtual network. Traffic is encrypted from a private IP address to a private IP address.

- Traffic to unsupported Virtual Machines is unencrypted. Use Virtual Network Flow Logs to confirm flow encryption between virtual machines. For more information, see [Virtual network flow logs](../network-watcher/vnet-flow-logs-overview.md).

- The start/stop of existing virtual machines is required after enabling encryption in a virtual network.

## Availability

Azure Virtual Network encryption is generally available in all Azure public regions.

## Limitations

Azure Virtual Network encryption has the following limitations:

- In scenarios where a PaaS is involved, the virtual machine where the PaaS is hosted dictates if virtual network encryption is supported. The virtual machine must meet the listed requirements. 

- For Internal load balancer, all virtual machines behind the load balancer must be a supported virtual machine SKU.

- **AllowUnencrypted** is the only supported enforcement at general availability. **DropUnencrypted** enforcement will be supported in the future.

- Virtual networks with encryption enabled don't support [Azure DNS Private Resolver](/azure/dns/dns-private-resolver-overview).

## Supported scenarios

Virtual network encryption is supported in the following scenarios:

| Scenario | Support |
| --- | --- |
| VMs in the same virtual network (including virtual machine scale sets and their internal load balancer) | Supported on traffic between VMs from these [SKUs](#requirements). |
| Virtual network peering | Supported on traffic between VMs across regional peering. |
| Global virtual network peering | Supported on traffic between VMs across global peering. |
| Azure Kubernetes Service (AKS) | - Supported on AKS using Azure CNI (regular or overlay mode), Kubenet, or BYOCNI: node and pod traffic is encrypted.<br> - Partially supported on AKS using Azure CNI Dynamic Pod IP Assignment (podSubnetId specified): node traffic is encrypted, but pod traffic isn't encrypted.<br> - Traffic to the AKS managed control plane egresses from the virtual network and thus isn't in scope for virtual network encryption. However, this traffic is always encrypted via TLS. |

> [!NOTE]
> Other services that currently don't support virtual network encryption are included in our future roadmap.

## Related content

- [Create a virtual network with encryption using the Azure portal](how-to-create-encryption-portal.md).
- [Virtual network encryption frequently asked questions (FAQ)](virtual-network-encryption-faq.yml).
- [What is Azure Virtual Network?](virtual-networks-overview.md)
