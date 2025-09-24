---
title: Azure virtual network TAP overview
description: Learn about virtual network TAP. Virtual network TAP provides you with a copy of virtual machine network traffic that can be streamed to a packet collector.
author: avirupcha
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 04/21/2025
ms.author: avirupcha
ms.custom: references_regions
# Customer intent: "As a network administrator, I want to stream virtual machine network traffic using a TAP configuration, so that I can analyze and monitor network performance effectively with a partner solution."
---

# Virtual network TAP

Azure virtual network TAP (Terminal Access Point) allows you to continuously stream your virtual machine network traffic to a network packet collector or analytics tool. The collector or analytics tool is provided by a [network virtual appliance](https://azure.microsoft.com/solutions/network-appliances/) partner. For a list of partner solutions that are validated to work with virtual network TAP, see [partner solutions](#virtual-network-tap-partner-solutions).

> [!IMPORTANT]
> Virtual network TAP is now in public preview in select Azure regions. For more information, see the [Supported Region](#supported-regions) section in this article.

The following diagram shows how virtual network TAP works. You can add a TAP configuration on a [network interface](virtual-network-network-interface.md) that is attached to a virtual machine deployed in your virtual network. The destination is a virtual network IP address in the same virtual network as the monitored network interface or a [peered virtual](virtual-network-peering-overview.md) network. The collector solution for virtual network TAP can be deployed behind an Azure Internal Load balancer for high availability.

:::image type="content" source="./media/virtual-network-tap/architecture.png" alt-text="Diagram of how virtual network TAP works." lightbox="./media/virtual-network-tap/architecture.png":::

## Prerequisites

You must have one or more virtual machines created with [Azure Resource Manager](../azure-resource-manager/management/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json), and a partner solution for aggregating the TAP traffic in the same Azure region. If you don't have a  partner solution in your virtual network, see [partner solutions](#virtual-network-tap-partner-solutions) to deploy one.

You can use the same virtual network TAP resource to aggregate traffic from multiple network interfaces in the same or different subscriptions. If the monitored network interfaces are in different subscriptions, the subscriptions must be associated to the same Microsoft Entra tenant. Additionally, the monitored network interfaces, and the destination endpoint for aggregating the TAP traffic can be in peered virtual networks in the same region. If you're using this deployment model, ensure that the [virtual network peering](virtual-network-peering-overview.md) is enabled before you configure virtual network TAP.

## Permissions

The accounts you use to apply TAP configuration on network interfaces must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned as the necessary actions from the following table:

| Action | Name |
|---|---|
| Microsoft.Network/virtualNetworkTaps/* | Required to create, update, read, and delete a virtual network TAP resource |
| Microsoft.Network/networkInterfaces/read | Required to read the network interface resource on which the TAP is configured |
| Microsoft.Network/tapConfigurations/* | Required to create, update, read, and delete the TAP configuration on a network interface |

## Public preview limitations
Please note, limitations tagged with **[Temporary]** will be resolved at GA. 
### Adding a source:
- Virtual network TAP only supports virtual machine's (VM) network interface as a mirroring source.
- [Temporary] v6 VM SKU aren't supported as a source. 
- [Temporary] Before adding a VM as a source, you must **first deploy a virtual network TAP resource** and **then STOP (deallocate) and START the source VM**. This is required only once for any VM that will be added as a source. **If not done, you will get an erorr stating the NIC is not on fastpath**.

### Other Limitations
- Virtual network TAP supports Load Balancer or VM's network interface as a destination resource for mirrored traffic.
- [Temporary] Virtual network doesn't support Live Migration. Live Migration will be disabled for VMs set as a source.
- [Temporary] VMs behind a Standard Load Balancer with Floating IP enabled can't be set as a mirroring source. 
- VMs behind Basic Load Balancer can't be set as a mirroring source. Basic Load Balancer is being deprecated.
- Virtual network doesn't support mirroring of inbound Private Link Service traffic.
- VMs in a virtual network with encryption enabled can't be set as mirroring source.
- Virtual network TAP doesn't support IPv6.
- [Temporary] When a VM is added or removed as a source, the VM might experience network downtime (up to 60 seconds).

## Supported Regions

- Asia East
- US West Central
- UK South
- US East
- India Central
- Germany West Central

### Coming soon
- US Central
- Australia East
- Korean Central
- Canada Central

## Virtual network TAP partner solutions

### Network packet brokers

|Partner|Product|
|-------------|----------|
|**Gigamon**|[GigaVUE Cloud Suite for Azure](https://www.gigamon.com/solutions/cloud/public-cloud/gigavue-cloud-suite-azure.html)|
|**Keysight**|[CloudLens](https://www.keysight.com/us/en/products/network-visibility/cloud-visibility/cloudlens-software-suite.html)|

### Security analytics, network/application performance management

|Partner|Product|
|-------------|----------|
|**Darktrace**|[Darktrace /NETWORK](https://www.darktrace.com/products/network)|
|**Netscout**|[Omnis Cyber Intelligence NDR](https://www.netscout.com/product/cyber-intelligence)|
|**Corelight**|[Corelight Open NDR Platform](https://corelight.com/solutions/why-open-ndr)|
|**Vectra**|[Vectra NDR](https://www.vectra.ai/products/ndr)|
|**Fortinet**|[FortiNDR Cloud](https://www.fortinet.com/products/network-detection-and-response)|
||[FortiGate VM](https://azuremarketplace.microsoft.com/en/marketplace/apps/fortinet.fortinet_fortigate-vm_v5?tab=Overview)|
|**cPacket**|[cPacket Cloud Suite](https://www.cpacket.com/cloud)|
|**TrendMicro**|[Trend Vision One™ Network Security](https://www.trendmicro.com/en_ca/business/products/network.html)|
|**Extrahop**|[Reveal(x)](https://www.extrahop.com/platform/revealx)|
|**Progress**|[Flowmon](https://www.progress.com/blogs/azure-vtap)|
|**Bitdefender**|[GravityZone Extended Detection and Response for Network](https://www.bitdefender.com/en-us/business/products/gravityzone-xdr)|
|**eSentire**|[eSentire MDR](https://www.esentire.com/how-we-do-it/signals/mdr-for-network)|
|**LinkShadow**|[LinkShadow NDR](https://www.linkshadow.com/products/network-detection-and-response)|
|**AttackFence**|[AttackFence NDR](https://www.attackfence.com/ndr)|
|**Arista Networks**|[Arista NDR](https://www.arista.com/en/products/network-detection-and-response)|

## Next Steps

Learn how to Create a virtual network TAP using [CLI](tutorial-tap-virtual-network-cli.md) or the [Azure portal](tutorial-virtual-network-tap-portal.md).
