---
title: Network security using private endpoints in IoT Central
description: Use private endpoints to limit and secure device connectivity to your IoT Central application instead of using public URLs.
author: dominicbetts
ms.author: dobett
ms.date: 05/22/2023
ms.topic: conceptual
ms.service: iot-central
services: iot-central
---

# Network security for IoT Central using private endpoints

The standard IoT Central endpoints for device connectivity are accessed using public URLs. Any device with a valid identity can connect to your IoT Central application from any location.

Use private endpoints to limit and secure device connectivity to your IoT Central application and only allow access through your private virtual network.

Private endpoints use private IP addresses from a virtual network address space to connect your devices privately to your IoT Central application. Network traffic between devices on the virtual network and the IoT platform traverses the virtual network and a private link on the [Microsoft backbone network](../../networking/microsoft-global-network.md), eliminating exposure on the public internet.

To learn more about Azure Virtual Networks, see:

- [Azure Virtual Networks](../../virtual-network/virtual-networks-overview.md)
- [Azure private endpoints](../../private-link/private-endpoint-overview.md)
- [Azure private links](../../private-link/private-link-overview.md)

Private endpoints in your IoT Central application enable you to:

- Secure your cluster by configuring the firewall to block all device connections on the public endpoint.
- Increase security for the virtual network by enabling you to protect data on the virtual network.
- Securely connect devices to IoT Central from on-premises networks that connect to the virtual network by using a [VPN gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoute](../../expressroute/index.yml) private peering.

The use of private endpoints in IoT Central is appropriate for devices connected to an on-premises network. You shouldn't use private endpoints for devices deployed in a wide-area network such as the internet.

## What is a private endpoint?

A private endpoint is a special network interface for an Azure service in your virtual network that's assigned IP address(es) from the IP address range of your virtual network. Private endpoint provides secure connectivity between your devices on the virtual network and the IoT platform they connect to. The connection between private endpoint and the Azure IoT platform uses a secure private link:

:::image type="content" source="media/concepts-private-endpoints/private-endpoints.png" alt-text="Diagram that shows the use of a private endpoint.":::

Devices connected to the virtual network can seamlessly connect to the cluster over the private endpoint. The authorization mechanisms are the same ones you'd use to connect to the public endpoints. However, you need to update the DPS connection URL because the global provisioning host `global.azure-devices-provisioning.net` URL doesn't resolve when public network access is disabled for your application.

When you create a private endpoint for a cluster in your virtual network, a consent request is sent for approval by the subscription owner. If the user requesting the creation of the private endpoint is also an owner of the subscription, the request is automatically approved. Subscription owners can manage consent requests and private endpoints for the cluster in the Azure portal, under **Private endpoints**.

Each IoT Central application can support multiple private endpoints, each of which can be located in a virtual network in a different region. If you plan to use multiple private endpoints, take extra care to configure your DNS and to plan the size of your virtual network subnets.

## Plan the size of the subnet in your virtual network

The size of the subnet in your virtual network can't be altered after the subnet is created. Therefore, it's important to plan for the size of subnet and allow for future growth.

IoT Central creates multiple customer visible FQDNs as part of a private endpoint deployment. In addition to the FQDN for IoT Central, there are FQDNs for underlying IoT Hub, Event Hubs, and Device Provisioning Service resources.

:::image type="content" source="media/concepts-private-endpoints/visible-fqdns.png" alt-text="Screenshot from the Azure portal that shows the customer visible FQDNs.":::

The IoT Central private endpoint uses multiple IP addresses from your virtual network and subnet. Also, based on application's load profile, IoT Central [autoscales its underlying IoT Hubs](/azure/iot-central/core/concepts-scalability-availability) so the number of IP addresses used by a private endpoint may increase. Plan for this possible increase when you determine the size for the subnet.

Use the following information to help determine the total number of IP addresses required in your subnet:

| Use                                  | Number of IP addresses per private endpoint |
|--------------------------------------|---------------------------------------------|
| IoT Central URL                      | 1                                           |
| Underlying IoT hubs                  | 2-50                                        |
| Event Hubs corresponding to IoT hubs | 2-50                                        |
| Device Provisioning Service          | 1                                           |
| Azure reserved addresses             | 5                                           |
| Total                                | 11-107                                      |

To learn more, see the Azure [Azure Virtual Network FAQ](../../virtual-network/virtual-networks-faq.md).

> [!NOTE]
> The minimum size for the subnet is `/28` (14 usable IP addresses). For use with an IoT Central private endpoint `/24` is recommended, which helps with extreme workloads.

## Next steps

Now that you've learned about using private endpoints to connect device to your application, here's the suggested next step:

> [!div class="nextstepaction"]
> [Create a private endpoint for Azure IoT Central application](howto-create-private-endpoint.md).
