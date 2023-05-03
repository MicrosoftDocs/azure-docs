---
title: What is Azure Virtual Network encryption? (Preview)
description: Overview of Azure Virtual Network encryption
ms.service: virtual-network
author: asudbring
ms.author: allensu
ms.topic: overview
ms.date: 05/24/2023
ms.custom: template-overview, references_regions

---

#  What is Azure Virtual Network encryption? (Preview)

Azure Virtual Network encryption is a feature of Azure Virtual Network. Virtual network encryption allows you to seamlessly encrypt and decrypt internal network traffic over the wire, with minimal effect to performance and scale. Virtual network encryption utilizes CPU offload technology to perform the encryption on an FPGA to avoid expensive cryptographic calculations, achieving the same CPU and network performance as without encryption. 

The underlying encryption technology uses DTLS v1.2 RFC 6347 with AES-GCM-256 as the cipher. During the preview, Microsoft manages the certificates that DTLS uses to create encrypted tunnels. 

With the addition of virtual network encryption, end-to-end encryption between on-premisses and Azure workloads is now possible. VPN gateway and Application gateway encrypt data from outside the cloud. MACsec encrypts data in-transit between datacenters and regions. Data traversing within private virtual networks can now be encrypted through virtual network encryption. 


> [!IMPORTANT]
> Azure Virtual Network encryption is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

:::image type="content" source="./media/virtual-network-encryption-overview/virtual-network-encryption.png" alt-text="Diagram of virtual network encryption.":::


## Requirements

Virtual network encryption is designed to provide encryption with no performance effect. Virtual network encryption uses a SmartNIC attached to the Azure platform that’s hosting your virtual machine. 

Virtual network encryption has the following requirements:

- The virtual machine hosted on compatible hardware that has an FPGA SmartNIC. The following virtual machine SKUs are currently supported.
    
    - Dv4
    - Ev4
    - Mv2
    - Fv2

- Accelerated Networking must be enabled on the network interface of the virtual machine. For more information about Accelerated Networking, see [What is Accelerated Networking?](/azure/virtual-network/accelerated-networking-overview).

Virtual Network encryption provides two methods of control when it includes virtual machine sizes that don't meet the minimum requirements:

- **DropUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware is **dropped**. The traffic drop happens if a virtual machine, such as an A-series or B-series, or an older D-series such as Dv2, is in the virtual network.

- **AllowUnencrypted** - In this scenario, network traffic that isn’t encrypted by the underlying hardware is allowed. This scenario allows incompatible virtual machine sizes to communicate with compatible virtual machine sizes.

Public IP traffic isn't dropped or encrypted in either scenario. IP fragmented packets aren't supported. This scenario happens in jumbo frame scenarios. Global Peering is supported in regions where virtual network encryption is supported.

## Use cases

The use cases for Azure Virtual Network encryption are for scenarios where virtual machine to virtual machine encryption and virtual machine to on-premises is required. Azure Virtual Network encryption protects data traversing your virtual network virtual machine to virtual machine and virtual machine to on-premises.

## Availability

Azure Virtual Network encryption is available in the following regions during the preview:

- East US 2 EUAP

- Central US EUAP

- West Central US

- North Central US

- East US 2

- West US 2

Email **VNetEncryptionPM@microsoft.com** to obtain access to the public preview.

## Limitations

Azure Virtual Network encryption has the following limitations:

- In scenarios where a PaaS is involved, the virtual machine where the PaaS is hosted dictates if virtual network encryption is supported. The virtual machine must meet the listed requirements. 

- Swift - Services using swift observes connectivity failure to swift containers injected in a virtual network. A fix is currently in progress.

- Gen8 behind internal load balancer - If you enable virtual network encryption after provisioning virtual machines, it may cause connectivity problems due to the unavailability of this feature on Gen8 clusters. Virtual machines on Gen8 clusters behind an internal load balancer see connectivity loss accessing the virtual machines via the internal load balancer. Once support is extended to Gen8 clusters, ILB connectivity functions, but existing connections drop.

## Next steps

- For more information about Azure Virtual Networks, see [What is Azure Virtual Network?](/azure/virtual-network/virtual-networks-overview)


