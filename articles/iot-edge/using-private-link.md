---
title: Learn how to use Azure Private Link and Private Endpoints to secure Azure IoT traffic - Azure IoT Edge
description: Overview of using IoT Edge while completely isolating your network from the internet traffic using various Azure services such as Azure ExpressRoute, Private Link, and DNS Private Resolver. 
author: PatAltimore
ms.author: patricka
ms.date: 02/15/2023
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Using Private Link with IoT Edge

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

In Industrial IoT (IIoT) scenarios, you may want to use IoT Edge and completely isolate your network from the internet traffic. You can achieve this requirement by using various services in Azure. The following diagram is an example reference architecture for a factory network scenario.

:::image type="content" source="./media/using-private-link/iot-edge-private-link.png" alt-text="Diagram of how to use Azure Private Link and Private Endpoints to secure Azure IoT traffic.":::

In the preceding diagram, the network for the IoT Edge device and the PaaS services is isolated from the internet traffic. ExpressRoute or a Site-to-Site VPN facilitates an encrypted tunnel for the traffic between on premises and Azure by using Azure Private Link service. Azure IoT services such as IoT Hub, Device Provisioning Service (DPS), Container Registry, and Blob Storage all support Private Link.

### ExpressRoute

ExpressRoute lets you extend your on-premises networks into the Microsoft cloud over a private connection with the help of a connectivity provider. In IIoT, connection reliability of the devices at the edge to the cloud could be a significant requirement, and ExpressRoute fulfills this requirement via Connection Uptime SLA (Service Level Agreement). To learn more about how Azure ExpressRoute helps provide a secure connectivity for edge devices in a private network, see [What is Azure ExpressRoute?](../expressroute/expressroute-introduction.md). 

### Azure Private Link

Azure Private Link enables you to access Azure PaaS services and Azure hosted customer-owned/partner services over a [private endpoint](../private-link/private-endpoint-overview.md) in your virtual network. You can access your services running in Azure over ExpressRoute private peering, [Site-to-Site (S2S) VPN](../vpn-gateway/tutorial-site-to-site-portal.md), and peered virtual networks. In IIoT, private links provide you with flexibility to connect your devices located in different regions. With private endpoint, you can also disable the access to the external PaaS resource and configure to send your traffic through the firewall. To learn more about Azure Private Link, see [What is Azure Private Link?](../private-link/private-link-overview.md).

### Azure DNS Private Resolver

Azure DNS Private Resolver lets you query Azure DNS private zones from an on-premises environment and vice versa without deploying VM based DNS servers. Azure DNS Private Resolver reduces the complexity of managing both private and public IPs. The DNS forwarding ruleset feature in Azure DNS private resolver helps an IoT admin to easily configure the rules and manage the clients on what specific address an endpoint should resolve. To learn more about Azure DNS Private Resolver, see [What is Azure DNS Private Resolver?](../dns/dns-private-resolver-overview.md).

For a walk-through example scenario, see [Using Azure Private Link and Private Endpoints to secure Azure IoT traffic](https://kevinsaye.wordpress.com/2020/09/30/using-azure-private-link-and-private-endpoints-to-secure-azure-iot-traffic/). This example illustrates a possible configuration for a factory network and not intended as a production ready reference.
