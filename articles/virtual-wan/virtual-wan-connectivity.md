---
title: Virtual WAN to Virtual WAN connectivity
description: Learn about the different available options for connecting your Azure Virtual WAN to another Virtual WAN.
author: halkazwini
ms.author: halkazwini
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 05/07/2025
---

# Virtual WAN to Virtual WAN connectivity options

In this article, you learn about the various connection options available to connect multiple Virtual WAN environments.

## IPsec tunnels using virtual network gateways

In this option, you can provision a virtual network gateway in each virtual hub of your virtual WAN environment to connect virtual WANs together.

Because the virtual network gateway ASN is always 65515, you can't have BGP over IPsec due to BGP loop prevention mechanism as the remote virtual hub will receive routes from the source virtual hub with 65515 in the AS-PATH and BGP will drop that. Therefore, if you want to connect two different virtual WANs, the tunnels must use static routing.

:::image type="content" source="./media/virtual-wan-connectivity/vwan-connectivity-using-vpn-gateway.png" alt-text="Diagram shows virtual WAN connectivity using virtual network gateways." lightbox="./media/virtual-wan-connectivity/vwan-connectivity-using-vpn-gateway.png":::

This option is ideal if you want to connect two virtual WANs using virtual network gateways. However, it has the following limitations:

- No BGP support.
- Max throughput per tunnel is 2.4 Gbps, depending on ciphers (you can add more tunnels to achieve higher throughput).

## IPsec tunnels using SD-WAN devices

This option is good for you if you use your own SD-WAN network virtual appliance (NVA) to connect your Virtual WAN to on-premises environments. By using an SD-WAN NVA in each respective virtual hub to connect virtual WANs, you can run BGP over IPsec for these connections.

In this scenario, you must replace 65520 and 65515 ASNs with the SD-WAN ones to avoid BGP loop prevention. The approach is similar to the first connectivity option, except here you have the ability to perform BGP manipulation on third-party devices, unlike the Azure virtual network gateways.

:::image type="content" source="./media/virtual-wan-connectivity/vwan-connectivity-using-sdwan-nva.png" alt-text="Diagram shows virtual WAN connectivity using SD-WAN devices in the virtual hubs." lightbox="./media/virtual-wan-connectivity/vwan-connectivity-using-sdwan-nva.png":::

This option is ideal if you want to connect two virtual WANs using SD-WAN NVAs. However, it comes with the following limitations:

- Only certain SD-WAN NVAs can be deployed into Virtual WAN hubs.
- SD-WAN NVAs can't be combined with other NVAs in Virtual WAN hubs.
- SD-WAN NVAs can be more expensive than virtual network gateways.

## IPsec tunnels using SD-WAN devices in peered spokes

This option is similar to the previous one, except you place the SD-WAN NVA in a spoke virtual network that is peered to the virtual hub, rather than placing it in the virtual hub. This scenario allows you to configure BGP peering between the SD-WAN NVA and the virtual hub route server. This approach is suitable for scenarios where users have SD-WAN NVAs that can't be deployed into Virtual WAN hubs, but still support BGP. Like in the second option, you must replace 65520 and 65515 ASNs with the SD-WAN ones to avoid BGP loop prevention.

:::image type="content" source="./media/virtual-wan-connectivity/vwan-connectivity-using-spoke-sdwan.png" alt-text="Diagram shows virtual WAN connectivity using SD-WAN devices in spoke virtual networks." lightbox="./media/virtual-wan-connectivity/vwan-connectivity-using-spoke-sdwan.png":::

This option is ideal if you want to connect two virtual WANs using SD-WAN NVAs in the spoke virtual networks because virtual hub doesn't support them. However, this option comes with the following limitations:

- Complexity to set up and maintain.
- SD-WAN NVAs can be more expensive than virtual network gateways.

## Related content

- [NVAs in a Virtual WAN hub](about-nva-hub.md)
- [SD-WAN connectivity architecture with Azure Virtual WAN](sd-wan-connectivity-architecture.md)
