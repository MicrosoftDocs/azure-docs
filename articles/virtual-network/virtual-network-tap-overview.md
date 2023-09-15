---
title: Azure virtual network TAP overview
description: Learn about virtual network TAP. Virtual network TAP provides you with a copy of virtual machine network traffic that can be streamed to a packet collector.
author: asudbring
ms.service: virtual-network
ms.topic: conceptual
ms.date: 03/28/2023
ms.author: allensu
---

# Virtual network TAP

> [!IMPORTANT]
> Virtual network TAP Preview is currently on hold in all Azure regions. You can email us at <azurevnettap@microsoft.com> with your subscription ID and we will notify you with future updates about the preview. In the interim, you can use agent based or NVA solutions that provide TAP/Network Visibility functionality through our [Packet Broker partner solutions](#virtual-network-tap-partner-solutions) available in [Azure Marketplace Offerings](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?page=1&subcategories=appliances%3Ball&search=Network%20Traffic&filters=partners).

Azure virtual network TAP (Terminal Access Point) allows you to continuously stream your virtual machine network traffic to a network packet collector or analytics tool. The collector or analytics tool is provided by a [network virtual appliance](https://azure.microsoft.com/solutions/network-appliances/) partner. For a list of partner solutions that are validated to work with virtual network TAP, see [partner solutions](#virtual-network-tap-partner-solutions).

The following diagram shows how virtual network TAP works. You can add a TAP configuration on a [network interface](virtual-network-network-interface.md) that is attached to a virtual machine deployed in your virtual network. The destination is a virtual network IP address in the same virtual network as the monitored network interface or a [peered virtual](virtual-network-peering-overview.md) network. The collector solution for virtual network TAP can be deployed behind an Azure Internal Load balancer for high availability.

:::image type="content" source="./media/virtual-network-tap/architecture.png" alt-text="Diagram of how virtual network TAP works.":::

## Prerequisites

Before you can create a virtual network TAP, ensure you've received the confirmation email that you're enrolled in the preview. You must have one or more virtual machines created with [Azure Resource Manager](../azure-resource-manager/management/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and a partner solution for aggregating the TAP traffic in the same Azure region. If you don't have a  partner solution in your virtual network, see [partner solutions](#virtual-network-tap-partner-solutions) to deploy one. 

You can use the same virtual network TAP resource to aggregate traffic from multiple network interfaces in the same or different subscriptions. If the monitored network interfaces are in different subscriptions, the subscriptions must be associated to the same Azure Active Directory tenant. Additionally, the monitored network interfaces and the destination endpoint for aggregating the TAP traffic can be in peered virtual networks in the same region. If you're using this deployment model, ensure that the [virtual network peering](virtual-network-peering-overview.md) is enabled before you configure virtual network TAP.

## Permissions

The accounts you use to apply TAP configuration on network interfaces must be assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the necessary actions from the following table:

| Action | Name |
|---|---|
| Microsoft.Network/virtualNetworkTaps/* | Required to create, update, read and delete a virtual network TAP resource |
| Microsoft.Network/networkInterfaces/read | Required to read the network interface resource on which the TAP is configured |
| Microsoft.Network/tapConfigurations/* | Required to create, update, read and delete the TAP configuration on a network interface |

## Virtual network TAP partner solutions

### Network packet brokers

- [GigaVUE Cloud Suite for Azure](https://www.gigamon.com/solutions/cloud/public-cloud/gigavue-cloud-suite-azure.html)

- [Ixia CloudLens](https://www.ixiacom.com/cloudlens/cloudlens-azure)

- [Nubeva Prisms](https://www.nubeva.com/azurevtap)

- [Big Switch Big Monitoring Fabric](https://www.arista.com/en/bigswitch)

### Security analytics, network/application performance management

- [Awake Security](https://www.arista.com/partner/technology-partners)

- [Cisco Stealthwatch Cloud](https://blogs.cisco.com/security/cisco-stealthwatch-cloud-and-microsoft-azure-reliable-cloud-infrastructure-meets-comprehensive-cloud-security)

- [Darktrace](https://www.darktrace.com)

- [ExtraHop Reveal(x)](https://www.extrahop.com/partners/tech-partners/microsoft/)

- [Fidelis Cybersecurity](https://www.fidelissecurity.com/technology-partners/microsoft-azure)

- [Flowmon](https://www.flowmon.com/en/blog/azure-vtap)

- [NetFort LANGuardian](https://www.netfort.com/languardian/solutions/visibility-in-azure-network-tap/)

- [Netscout vSTREAM]( https://www.netscout.com/marketplace-azure)

- [Noname Security](https://nonamesecurity.com/)

- [Riverbed SteelCentral AppResponse]( https://www.riverbed.com/products/steelcentral/steelcentral-appresponse-11.html)

- [RSA NetWitness&reg; Platform](https://community.netwitness.com/t5/netwitness-platform-integrations/ixia-cloudlens-rsa-netwitness-packets-implementation-guide/ta-p/564238)

- [Vectra Cognito](https://www.vectra.ai/products/cognito-platform)

## Next steps

- Learn how to [Create a virtual network TAP](tutorial-tap-virtual-network-cli.md).
