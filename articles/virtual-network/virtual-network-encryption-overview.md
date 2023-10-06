---
title: What is Azure Virtual Network encryption? (Preview)
description: Overview of Azure Virtual Network encryption
ms.service: virtual-network
author: asudbring
ms.author: allensu
ms.topic: overview
ms.date: 07/07/2023
ms.custom: template-overview, references_regions

---

#  What is Azure Virtual Network encryption? (Preview)

Azure Virtual Network encryption is a feature of Azure Virtual Networks. Virtual network encryption allows you to seamlessly encrypt and decrypt traffic between Azure Virtual Machines. 

Whenever Azure customer traffic moves between datacenters, Microsoft applies a data-link layer encryption method using the IEEE 802.1AE MAC Security Standards (MACsec). This encryption is implemented to secure the traffic outside physical boundaries not controlled by Microsoft or on behalf of Microsoft. This method is applied from point-to-point across the underlying network hardware. Virtual network encryption enables you to encrypt traffic between Virtual Machines and Virtual Machines Scale Sets within the same virtual network. It also encrypts traffic between regionally and globally peered virtual networks. Virtual network encryption enhances existing encryption in transit capabilities in Azure.

For more information about encryption in Azure, see [Azure encryption overview](/azure/security/fundamentals/encryption-overview).

> [!IMPORTANT]
> Azure Virtual Network encryption is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Requirements

Virtual network encryption has the following requirements:

- Virtual Network encryption is supported on general-purpose and memory optimized VM instance sizes including:

    | VM Series | VM SKU |
    | --- | --- |
    | D-series | **[Dv4 and Dsv4-series](/azure/virtual-machines/dv4-dsv4-series)**, **[Ddv4 and Ddsv4-series](/azure/virtual-machines/ddv4-ddsv4-series)**, **[Dav4 and Dasv4-series](/azure/virtual-machines/dav4-dasv4-series)** |
    | E-series | **[Ev4 and Esv4-series](/azure/virtual-machines/ev4-esv4-series)**, **[Edv4 and Edsv4-series](/azure/virtual-machines/edv4-edsv4-series)**, **[Eav4 and Easv4-series](/azure/virtual-machines/eav4-easv4-series)** |
    | M-series | **[Mv2-series](/azure/virtual-machines/mv2-series)** |

- Accelerated Networking must be enabled on the network interface of the virtual machine. For more information about Accelerated Networking, see  [What is Accelerated Networking?](/azure/virtual-network/accelerated-networking-overview).

- Encryption is only applied to traffic between virtual machines in a virtual network. Traffic is encrypted from a private IP address to a private IP address.

- Global Peering is supported in regions where virtual network encryption is supported.

- Traffic to unsupported Virtual Machines is unencrypted. Use Virtual Network Flow Logs to confirm flow encryption between virtual machines. For more information, see [VNet flow logs](../network-watcher/vnet-flow-logs-overview.md).

- The start/stop of existing virtual machines may be required after enabling encryption in a virtual network.
## Availability

Azure Virtual Network encryption is available in the following regions during the preview:

- East US 2 EUAP

- Central US EUAP

- West Central US

- East US

- East US 2

- West US

- West US 2

To sign up to obtain access to the public preview, see [Virtual Network Encryption - Public Preview Sign Up](https://aka.ms/vnet-encryption-sign-up).

## Limitations

Azure Virtual Network encryption has the following limitations during the public preview:

- In scenarios where a PaaS is involved, the virtual machine where the PaaS is hosted dictates if virtual network encryption is supported. The virtual machine must meet the listed requirements. 

- For Internal load balancer, all virtual machines behind the load balancer must be a supported virtual machine SKU. 

## Next steps

- For more information about Azure Virtual Networks, see [What is Azure Virtual Network?](/azure/virtual-network/virtual-networks-overview)


