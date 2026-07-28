---
title: What is Azure Virtual Network encryption?
titleSuffix: Azure Virtual Network
description: Learn about Azure Virtual network encryption. Virtual network encryption allows you to seamlessly encrypt and decrypt traffic between Azure Virtual Machines.
ms.service: azure-virtual-network
author: asudbring
ms.author: allensu
ms.topic: overview
ms.date: 12/11/2024
ms.custom: references_regions
# Customer intent: As a network administrator, I want to learn about encryption in Azure Virtual Network so that I can secure my network traffic.

---

#  What is Azure Virtual Network encryption?

Azure Virtual Network encryption is a feature of Azure Virtual Networks. Virtual network encryption allows you to seamlessly encrypt and decrypt traffic between Azure Virtual Machines by creating a DTLS tunnel. 

Virtual network encryption enables you to encrypt traffic between Virtual Machines and Virtual Machines Scale Sets within the same virtual network. Virtual network encryption encrypts traffic between regionally and globally peered virtual networks. For more information about virtual network peering, see [Virtual network peering](/azure/virtual-network/virtual-network-peering-overview).

Virtual network encryption enhances existing encryption in transit capabilities in Azure. For more information about encryption in Azure, see [Azure encryption overview](/azure/security/fundamentals/encryption-overview).

## Requirements

Virtual network encryption has the following requirements:

- Virtual network encryption supports the following virtual machine instance sizes: 
  - The D/E series entries in the following list are a baseline, not an exhaustive list. Virtual network encryption supports all v5 and newer generations of D-series and E-series.
  - For all other families, encryption supports the specific series listed in the following table. The product team adds new sizes as they're validated. This support includes the compute-optimized (F-series), storage-optimized (L-series), memory-optimized (M-series), and GPU-accelerated compute sizes.

    | Type | VM Series | VM SKU |
    | --- | --- | --- |
    | General purpose workloads | D-series V4 </br> D-series V5 </br> D-series V6 | **[Dv4 and Dsv4-series](/azure/virtual-machines/dv4-dsv4-series)** </br> **[Ddv4 and Ddsv4-series](/azure/virtual-machines/ddv4-ddsv4-series)** </br> **[Dav4 and Dasv4-series](/azure/virtual-machines/dav4-dasv4-series)** </br> **[Dv5 and Dsv5-series](/azure/virtual-machines/dv5-dsv5-series)** </br> **[Ddv5 and Ddsv5-series](/azure/virtual-machines/ddv5-ddsv5-series)** </br> **[Dlsv5 and Dldsv5-series](/azure/virtual-machines/dlsv5-dldsv5-series)** </br> **[Dasv5 and Dadsv5-series](/azure/virtual-machines/dasv5-dadsv5-series)** </br> **[Dasv6 and Dadsv6-series](/azure/virtual-machines/dasv6-dadsv6-series)** </br> **[Dalsv6 and Daldsv6-series](/azure/virtual-machines/dalsv6-daldsv6-series)** </br> **[Dsv6-series](/azure/virtual-machines/sizes/general-purpose/dsv6-series)** </br> **[Dplsv6 and Dpldsv6-series](/azure/virtual-machines/sizes/general-purpose/dplsv6-series)** </br> **[Dpsv6 and Dpdsv6-series](/azure/virtual-machines/sizes/general-purpose/dpsv6-series)** |
    | Memory intensive workloads | E-series V4 </br> E-series V5 </br> E-series V6 </br> M-series V2 </br> M-series V3 | **[Ev4 and Esv4-series](/azure/virtual-machines/ev4-esv4-series)** </br> **[Edv4 and Edsv4-series](/azure/virtual-machines/edv4-edsv4-series)** </br> **[Eav4 and Easv4-series](/azure/virtual-machines/eav4-easv4-series)** </br> **[Ev5 and Esv5-series](/azure/virtual-machines/ev5-esv5-series)** </br> **[Edv5 and Edsv5-series](/azure/virtual-machines/edv5-edsv5-series)** </br> **[Easv5 and Eadsv5-series](/azure/virtual-machines/easv5-eadsv5-series)** </br> **[Easv6 and Eadsv6-series](/azure/virtual-machines/easv6-eadsv6-series)** </br> **[Epsv6 and Epdsv6-series](/azure/virtual-machines/sizes/memory-optimized/epsv6-series)** </br> **[Mv2-series](/azure/virtual-machines/mv2-series)** </br> **[Msv2 and Mdsv2 Medium Memory series](/azure/virtual-machines/msv2-mdsv2-series)** </br> **[Msv3 and Mdsv3 Medium Memory series](/azure/virtual-machines/msv3-mdsv3-medium-series)** |
    | Storage intensive workloads | L-series V3 | **[LSv3-series](/azure/virtual-machines/lsv3-series)**  |
    | Compute optimized | F-series V6 | **[Falsv6-series](/azure/virtual-machines/sizes/compute-optimized/falsv6-series)** </br> **[Famsv6-series](/azure/virtual-machines/sizes/compute-optimized/famsv6-series)** </br> **[Fasv6-series](/azure/virtual-machines/sizes/compute-optimized/fasv6-series)** |
    | GPU - accelerated compute | NC-H100 series V5 </br> ND-GB200 series V6 </br> ND-GB300 series V6 | **[NC-H100 v5-series](/azure/virtual-machines/sizes/gpu-accelerated/ncadsh100v5-series)** </br> **[ND-GB200 v6-series](/azure/virtual-machines/sizes/gpu-accelerated/nd-gb200-v6-series)**  </br> **[ND-GB300 v6-series](/azure/virtual-machines/sizes/gpu-accelerated/nd-gb300-v6-series)**

- Accelerated Networking must be enabled on the network interface of the virtual machine. For more information about Accelerated Networking, see  [What is Accelerated Networking?](/azure/virtual-network/accelerated-networking-overview)

- Encryption is only applied to traffic between virtual machines in a virtual network. Traffic is encrypted from a private IP address to a private IP address.

- Traffic to unsupported Virtual Machines is unencrypted. Use Virtual Network Flow Logs to confirm flow encryption between virtual machines. For more information, see [Virtual network flow logs](../network-watcher/vnet-flow-logs-overview.md).

- The start/stop of existing virtual machines is required after enabling encryption in a virtual network.

## Availability

Azure Virtual Network encryption is generally available in all Azure public regions and is currently in public preview in Azure Government and Microsoft Azure operated by 21Vianet.

## Limitations

Azure Virtual Network encryption has the following limitations:

- **AllowUnencrypted** is the only supported enforcement at general availability.
- **DropUnencrypted** enforcement will be supported in the future.
- Don't enable Virtual Network encryption if the VM SKU doesn't support [Accelerated Networking](/azure/virtual-network/accelerated-networking-overview?tabs=NetworkManager) or Virtual Network encryption.
- Don't enable Virtual Network encryption in virtual networks that use [Azure confidential computing](/azure/confidential-computing/confidential-vm-overview) VM SKUs. If you want to use Azure confidential computing VMs in virtual networks where Virtual Network encryption is enabled, then:
    - Enable Accelerated Networking on the VM's NIC if it's supported.
    - If Accelerated Networking isn't supported, change the VM SKU to one that supports Accelerated Networking or Virtual Network encryption.

## Scenarios list
Supported - traffic connectivity is preserved when encryption is enabled.
Encrypted - traffic is encrypted on the datapath.

> [!NOTE]
> A scenario can be "Supported=Yes" and still be "Encrypted=No".
 
| Scenario | Supported | Encrypted |
| --- | --- | --- |
| Virtual machines in the same virtual network (including virtual machine scale sets and their internal load balancer) | **Yes** | **Yes** <br> - on traffic between virtual machines from these [SKUs](#requirements). |
| [Virtual network peering](/azure/virtual-network/virtual-network-peering-overview) | **Yes** | **Yes** <br> - on traffic between virtual machines across regional peering. |
| Global virtual network peering | **Yes** | **Yes** <br> - on traffic between virtual machines across global peering. |
| [Azure ExpressRoute Gateways](/azure/expressroute/expressroute-introduction) | **Yes** | **No**. <br> - Traffic to and from Azure ExpressRoute Gateways isn't encrypted. |
| [Azure Private Link service](/azure/private-link/private-link-overview) <br> [Azure Private Endpoint](/azure/private-link/private-endpoint-overview) | **Yes** | **No**. <br> - Traffic to and from Private Link Service/Private Endpoint isn't encrypted. |
| [Azure Application Gateway](/azure/application-gateway/overview) | **Yes** | **No** |
| [Azure Firewall Premium](/azure/firewall/overview) | **Yes** | **Yes** |
| [Azure Firewall Standard](/azure/firewall/overview) | **Yes** | **No** <br> - Operates on VM SKUs that don't support virtual network encryption. |
| [Internal Load Balancer](/azure/load-balancer/quickstart-load-balancer-standard-internal-portal) + Supported VM [SKUs](#requirements) for backend pool | **Yes** | **Yes**. <br> - All virtual machines behind the load balancer must be on supported VM [SKUs](#requirements) |
| [Internal Load Balancer](/azure/load-balancer/quickstart-load-balancer-standard-internal-portal) + Mixed SKUs for backend pool | **No** | N/A |
| [Internal Load Balancer](/azure/load-balancer/quickstart-load-balancer-standard-internal-portal) + backend pool with network interface secondary IPv4 configurations | **No** | N/A. <br> - The backend pool of an internal load balancer must not include any network interface secondary IPv4 configurations to prevent connection failures to the load balancer. |
| [Azure DNS Private Resolver](/azure/dns/dns-private-resolver-overview) | **No** | N/A |
| PaaS | **Yes** | The virtual machine where the PaaS is hosted dictates if virtual network encryption is supported. <br> - **Yes** - supported VM [SKUs](#requirements). <br> - **No** - unsupported VM SKUs. <br> - The virtual machine must meet the above listed requirements. |
| [Azure Kubernetes Service (AKS)](/azure/aks/) | **Yes** | - Supported on AKS using Azure CNI (regular or overlay mode), Kubenet, or BYOCNI: node and pod traffic is encrypted.<br> - Partially supported on AKS using Azure CNI Dynamic Pod IP Assignment (podSubnetId specified): node traffic is encrypted, but pod traffic isn't encrypted.<br> - Traffic to the AKS managed control plane egresses from the virtual network and thus isn't in scope for virtual network encryption. However, this traffic is always encrypted via TLS. |

> [!NOTE]
> Other services that currently don't support virtual network encryption are included in our future roadmap.

## Related content

- [Create a virtual network with encryption using the Azure portal](how-to-create-encryption-portal.md).
- [Virtual network encryption frequently asked questions (FAQ)](virtual-network-encryption-faq.yml).
- [What is Azure Virtual Network?](virtual-networks-overview.md)
