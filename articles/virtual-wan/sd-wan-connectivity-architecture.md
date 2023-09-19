---
title: 'Architecture: Virtual WAN and SD-WAN connectivity'
titleSuffix: Azure Virtual WAN
description: Learn about interconnecting a private SD-WAN with Azure Virtual WAN.
services: virtual-wan
author: skishen525

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 08/24/2023
ms.author: sukishen

---

# SD-WAN connectivity architecture with Azure Virtual WAN

Azure Virtual WAN is a networking service that brings together many cloud connectivity and security services with a single operational interface. These services include branch (via Site-to-site VPN), remote user (Point-to-site VPN), private (ExpressRoute) connectivity, intra-cloud transitive connectivity for VNets, VPN and ExpressRoute interconnectivity, routing, Azure Firewall, and encryption for private connectivity.

Although Azure Virtual WAN is a cloud-based SD-WAN that provides a rich suite of Azure first-party connectivity, routing, and security services, Azure Virtual WAN also is designed to enable seamless interconnection with premises-based SD-WAN and SASE technologies and services. Many such services are offered by our [Virtual WAN](virtual-wan-locations-partners.md) ecosystem and Azure Networking Managed Services partners [(MSPs)](../networking/networking-partners-msp.md). Enterprises that are transforming their private WAN to SD-WAN have options when interconnecting their private SD-WAN with Azure Virtual WAN. Enterprises can choose from these options:

* Direct Interconnect model
* Direct Interconnect model with NVA-in-VWAN-hub
* Indirect Interconnect model
* Managed Hybrid WAN model using their favorite managed service provider [MSP](../networking/networking-partners-msp.md)

In all of these cases, the interconnection of Virtual WAN with SD-WAN is similar from the connectivity side, but may vary on the orchestration and operational side.

## <a name="direct"></a>Direct Interconnect model

:::image type="content" source="./media/sd-wan-connectivity-architecture/direct.png" alt-text="Diagram of direct interconnect model." lightbox="./media/sd-wan-connectivity-architecture/direct.png":::

In this architecture model, the SD-WAN branch customer-premises equipment (CPE) is directly connected to Virtual WAN hubs via IPsec connections. The branch CPE may also be connected to other branches via the private SD-WAN, or use Virtual WAN for branch to branch connectivity. Branches that need to access their workloads in Azure will be able to directly and securely access Azure via the IPsec tunnel(s) that are terminated in the Virtual WAN hub(s).

SD-WAN CPE partners can enable automation in order to automate the normally tedious and error-prone IPsec connectivity from their respective CPE devices. Automation allows the SD-WAN controller to talk to Azure via the Virtual WAN API to configure the Virtual WAN sites, and push necessary IPsec tunnel configuration to the branch CPEs. See [Automation guidelines](virtual-wan-configure-automation-providers.md) for the description of Virtual WAN interconnection automation by various SD-WAN partners.

The SD-WAN CPE continues to be the place where traffic optimization and path selection is implemented and enforced.

In this model, some vendor proprietary traffic optimization based on real-time traffic characteristics may not be supported because the connectivity to Virtual WAN is over IPsec and the IPsec VPN is terminated on the Virtual WAN VPN gateway. For example, dynamic path selection at the branch CPE is feasible due to the branch device exchanging various network packet information with another SD-WAN node, hence identifying the best link to use for various prioritized traffic dynamically at the branch. This feature may be useful in areas where last mile optimization (branch to the closest Microsoft POP) is required.

With Virtual WAN, users can get Azure Path Selection, which is policy-based path selection across multiple ISP links from the branch CPE to Virtual WAN VPN gateways. Virtual WAN allows for the setup of multiple links (paths) from the same SD-WAN branch CPE; each link represents a dual tunnel connection from a unique public IP of the SD-WAN CPE to two different instances of Azure Virtual WAN VPN gateway. SD-WAN vendors can implement the most optimal path to Azure, based on traffic policies set by their policy engine on the CPE links. On the Azure end, all connections coming in are treated equally.

## <a name="direct-nva"></a>Direct Interconnect model with NVA-in-VWAN-hub

:::image type="content" source="./media/sd-wan-connectivity-architecture/direct-nva.png" alt-text="Diagram of direct interconnect model with NVA-in-VWAN-hub." lightbox="./media/sd-wan-connectivity-architecture/direct-nva.png":::

This architecture model supports the deployment of a third-party [Network Virtual Appliance (NVA) directly into the virtual hub](./about-nva-hub.md). This allows customers who want to connect their branch CPE to the same brand NVA in the virtual hub so that they can take advantage of proprietary end-to-end SD-WAN capabilities when connecting to Azure workloads. 

Several Virtual WAN Partners have worked to provide an experience that configures the NVA automatically as part of the deployment process. Once the NVA has been provisioned into the virtual hub, any additional configuration that may be required for the NVA must be done via the NVA partners portal or management application. Direct access to the NVA isn't available. The NVAs that are available to be deployed directly into the Azure Virtual WAN hub are engineered specifically to be used in the virtual hub. For partners that support NVA in VWAN hub and their deployment guides, please see the [Virtual WAN Partners](virtual-wan-locations-partners.md#partners-with-integrated-virtual-hub-offerings) article.

The SD-WAN CPE continues to be the place where traffic optimization and path selection is implemented and enforced.
In this model, vendor proprietary traffic optimization based on real-time traffic characteristics is supported because the connectivity to Virtual WAN is via the SD-WAN NVA in the hub.

## <a name="indirect"></a>Indirect Interconnect model

:::image type="content" source="./media/sd-wan-connectivity-architecture/indirect-interconnect.png" alt-text="Diagram of indirect interconnect model." lightbox="./media/sd-wan-connectivity-architecture/indirect-interconnect.png":::

In this architecture model, SD-WAN branch CPEs are indirectly connected to Virtual WAN hubs. As the figure shows, an SD-WAN virtual CPE is deployed in an enterprise VNet. This virtual CPE is, in turn, connected to the Virtual WAN hub(s) using IPsec. The virtual CPE serves as an SD-WAN gateway into Azure. Branches that need to access their workloads in Azure will be able access them via the v-CPE gateway.

Since the connectivity to Azure is via the v-CPE gateway (NVA), all traffic to and from Azure workload VNets to other SD-WAN branches go via the NVA. In this model, the user is responsible for managing and operating the SD-WAN NVA including high availability, scalability, and routing.
  
## <a name="hybrid"></a>Managed Hybrid WAN model

:::image type="content" source="./media/sd-wan-connectivity-architecture/hybrid.png" alt-text="Diagram of managed hybrid WAN model." lightbox="./media/sd-wan-connectivity-architecture/hybrid.png":::

In this architecture model, enterprises can leverage a managed SD-WAN service offered by a Managed Service Provider (MSP) partner. This model is similar to the direct or indirect models described above. However, in this model, the SD-WAN design, orchestration, and operations are delivered by the SD-WAN Provider.

[Azure Networking MSP partners](../networking/networking-partners-msp.md) can use [Azure Lighthouse](https://azure.microsoft.com/services/azure-lighthouse/) to implement the SD-WAN and Virtual WAN service in the enterprise customer’s Azure subscription, as well as operate the end-to-end hybrid WAN on behalf of the customer. These MSPs may also be able to implement Azure ExpressRoute into the Virtual WAN and operate it as an end-to-end managed service.

## Additional information

* [Azure Virtual WAN FAQ](virtual-wan-faq.md)
* [Solving Remote Connectivity](work-remotely-support.md)
