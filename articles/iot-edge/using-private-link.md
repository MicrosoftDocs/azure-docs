---
title: Use Azure Private Link and Private Endpoints to secure Azure IoT traffic - Azure IoT Edge
description: Learn how to use IoT Edge while completely isolating your network from the internet traffic using various Azure services such as Azure ExpressRoute, Private Link, and DNS Private Resolver
author: sethmanheim
ms.author: sethm
ms.date: 01/29/2026
ms.topic: concept-article
ms.service: azure-iot-edge
services: iot-edge
ms.custom: sfi-image-nochange
---

# Using Private Link with IoT Edge

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

In Industrial IoT (IIoT) scenarios, you might want to use IoT Edge and completely isolate your network from internet traffic. You achieve this by using different Azure services. The following diagram shows a reference architecture for a factory network scenario.

:::image type="content" source="./media/using-private-link/iot-edge-private-link.png" alt-text="Diagram of how to use Azure Private Link and Private Endpoints to secure Azure IoT traffic.":::

In the preceding diagram, the network for the IoT Edge device and the PaaS services is isolated from internet traffic. ExpressRoute or a Site-to-Site VPN creates an encrypted tunnel for traffic between on-premises and Azure by using Azure Private Link service. Azure IoT services like IoT Hub, Device Provisioning Service (DPS), Container Registry, and Blob Storage all support Private Link.

### ExpressRoute

ExpressRoute lets you extend your on-premises networks into the Microsoft cloud over a private connection with a connectivity provider. In IIoT, connection reliability for devices at the edge to the cloud can be important, and ExpressRoute meets this need with a connection uptime SLA (service level agreement). To learn more about how Azure ExpressRoute provides secure connectivity for edge devices in a private network, see [What is Azure ExpressRoute?](../expressroute/expressroute-introduction.md).

### Azure Private Link

Azure Private Link lets you use Azure PaaS services and Azure-hosted customer-owned or partner services over a [private endpoint](../private-link/private-endpoint-overview.md) in your virtual network. You can use your services running in Azure over ExpressRoute private peering, [Site-to-Site (S2S) VPN](../vpn-gateway/tutorial-site-to-site-portal.md), and peered virtual networks. In IIoT, private links give you flexibility to connect devices in different regions. With a private endpoint, you can disable access to the external PaaS resource and configure to send your traffic through the firewall. To learn more about Azure Private Link, see [What is Azure Private Link?](../private-link/private-link-overview.md).

### Azure DNS Private Resolver

Azure DNS Private Resolver lets you query Azure DNS private zones from an on-premises environment and the other way around without deploying VM-based DNS servers. Azure DNS Private Resolver makes it easier to manage both private and public IPs. The DNS forwarding ruleset feature in Azure DNS Private Resolver helps an IoT admin easily configure rules and manage which address an endpoint should resolve. To learn more about Azure DNS Private Resolver, see [What is Azure DNS Private Resolver?](../dns/dns-private-resolver-overview.md).

### Configure IoT Edge endpoints when using Private Link

When Private Link is enabled, you must configure IoT Edge to use the **private endpoint FQDNs**, not the public service hostnames. If public hostnames are used, IoT Edge modules fail to connect after public network access is disabled.

#### Which hostname should be used?

| Azure service | Public FQDN | Private Link FQDN | What IoT Edge should use |
|---------------|-------------|-------------------|---------------------------|
| IoT Hub | `<hubname>.azure-devices.net` | `<hubname>.privatelink.azure-devices.net` | Use Private Link FQDN |
| DPS | `global.azure-devices-provisioning.net` | `global.privatelink.azure-devices-provisioning.net` | Use Private Link FQDN |
| Azure Container Registry (ACR) | `<registry>.azurecr.io` | `<registry>.privatelink.azurecr.io` | Use Private Link FQDN |
| Storage (Blob) | `<account>.blob.core.windows.net` | `<account>.privatelink.blob.core.windows.net` | Use Private Link FQDN |

#### Example IoT Edge `config.yaml`

```yaml
provisioning:
  source: "dps"
  global_endpoint: "global.privatelink.azure-devices-provisioning.net"
  scope_id: "<scope-id>"

agent:
  env:
    IOTEDGE_IOTHUBHOSTNAME: "<hubname>.privatelink.azure-devices.net"
```

#### DNS requirement

Your environment must correctly resolve private endpoint hostnames. Ensure:

- Private DNS zones for IoT Hub, DPS, ACR, and Storage are configured.
- Private DNS zones are linked to your VNET.
- On-premises systems forward DNS queries via Azure DNS Private Resolver (if applicable).

If DNS isn't configured, IoT Edge won't be able to resolve the private endpoint FQDNs.

For a walkthrough example scenario, see [Using Azure Private Link and Private Endpoints to secure Azure IoT traffic](https://kevinsaye.wordpress.com/2020/09/30/using-azure-private-link-and-private-endpoints-to-secure-azure-iot-traffic/). This example shows a possible configuration for a factory network and isn't intended as a production-ready reference.
