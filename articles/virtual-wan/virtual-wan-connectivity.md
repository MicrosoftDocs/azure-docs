---
title: Virtual WAN to Virtual WAN Connectivity
description: Learn about the different available options for connecting your Azure Virtual WAN to another Virtual WAN.
author: halkazwini
ms.author: halkazwini
ms.service: azure-virtual-wan
ms.topic: concept-article
ms.date: 05/29/2025
---

# Virtual WAN to Virtual WAN connectivity options

In some enterprise environments, there might be a need to connect one Azure Virtual WAN to another. Common scenarios include:

- Mergers and acquisitions
- Decentralized business units requiring interconnectivity

In this article, you learn about the various connection options available to link multiple Virtual WAN environments.

## IPsec tunnels using virtual network gateways

In this option, you can use IPsec tunnels to connect Virtual WANs by deploying a virtual network gateway in each virtual hub withing your Virtual WAN environment.


Because the virtual network gateway ASN is always 65515, you can't have BGP over IPsec due to BGP loop prevention mechanism as the remote virtual hub will receive routes from the source virtual hub with 65515 in the AS-PATH and BGP will drop that. Therefore, if you want to connect two different Virtual WANs, the tunnels must use static routing.

:::image type="content" source="./media/virtual-wan-connectivity/vwan-connectivity-using-vpn-gateway.png" alt-text="Diagram shows Virtual WAN connectivity using virtual network gateways." lightbox="./media/virtual-wan-connectivity/vwan-connectivity-using-vpn-gateway.png":::

This option is ideal if you want to connect two Virtual WANs using virtual network gateways. However, it has the following limitations:

- No BGP support.
- Max throughput per tunnel is 2.3 Gbps, depending on ciphers. For more information, see [What is the max throughput supported in a single tunnel?](virtual-wan-faq.md#packets)

## IPsec tunnels using SD-WAN NVAs in virtual hubs

If you're already using SD-WAN network virtual appliances (NVAs) to connect your Virtual WANs to on-premises environments, you can also use them to interconnect Virtual WANs. By deploying an SD-WAN NVA in each Virtual WAN hub, you can run BGP over IPsec between virtual hubs.

In this scenario, you must replace ASNs 65520 and 65515 with the ones used by your SD-WAN to avoid BGP loop prevention. This approach is similar to the first connectivity option, but here you have the flexibility to perform BGP manipulation on third-party appliances.

:::image type="content" source="./media/virtual-wan-connectivity/vwan-connectivity-using-sdwan-nva.png" alt-text="Diagram shows Virtual WAN connectivity using SD-WAN devices in the virtual hubs." lightbox="./media/virtual-wan-connectivity/vwan-connectivity-using-sdwan-nva.png":::

This option is ideal if you want to connect two Virtual WANs using SD-WAN NVAs. However, it comes with the following limitations:

- Only certain SD-WAN NVAs can be deployed into Virtual WAN hubs. For more information, see [NVAs in a Virtual WAN hub](about-nva-hub.md).
- SD-WAN NVAs can't be combined with other NVAs in Virtual WAN hubs.
- SD-WAN NVAs can be more expensive than virtual network gateways.

## IPsec tunnels using SD-WAN NVAs in peered spokes

This option is similar to the previous one, except you place the SD-WAN NVA in a spoke virtual network that is peered to the virtual hub, rather than deploying it in the virtual hub. This setup allows you to configure BGP peering between the SD-WAN NVA and the virtual hub route server.

This approach is suitable for scenarios where SD-WAN NVAs can't be deployed into Virtual WAN hubs but still support BGP. As in the second option, you must replace ASNs 65520 and 65515 with the ones used by your SD-WAN to avoid BGP loop prevention.

:::image type="content" source="./media/virtual-wan-connectivity/vwan-connectivity-using-spoke-sdwan.png" alt-text="Diagram shows Virtual WAN connectivity using SD-WAN devices in spoke virtual networks." lightbox="./media/virtual-wan-connectivity/vwan-connectivity-using-spoke-sdwan.png":::

This option is ideal if you want to connect two Virtual WANs using SD-WAN NVAs in the spoke virtual networks because virtual hub doesn't support them. However, this option comes with the following limitations:

- Complexity to set up and maintain.
- SD-WAN NVAs can be more expensive than virtual network gateways.

## Related content

- [NVAs in a Virtual WAN hub](about-nva-hub.md)
- [SD-WAN connectivity architecture with Azure Virtual WAN](sd-wan-connectivity-architecture.md)
