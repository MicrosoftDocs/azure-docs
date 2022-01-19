---
title: 'Azure Virtual WAN: About Network Virtual Appliance in the hub'
description: Learn about Network Virtual Appliances in the Virtual WAN hub.
services: virtual-wan
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 06/02/2021
ms.author: wellee
# Customer intent: As someone with a networking background, I want to learn about Network Virtual Appliances in the Virtual WAN hub.
---
# Network Virtual Appliances in the Virtual WAN hub

Customers can deploy select Network Virtual Appliances directly into the Virtual WAN hub in a solution that is jointly managed by Microsoft Azure and third-party Network Virtual Appliance vendors. Not all Network Virtual Appliances in Azure Marketplace can be deployed into the Virtual WAN hub. For a full list of available partners, please reference the [Partners](#partner) section.

## Key benefits

When a Network Virtual Appliance is deployed into the Virtual WAN hub, it can serve as a third-party gateway with various functionalities. It could serve as an SD-WAN gateway, Firewall or a combination of both.  

Deploying Network Virtual Appliances into the Virtual WAN Hub allows customers to enjoy the following benefits:

* **Pre-defined and pre-tested selection of infrastructure choices ([NVA Infrastructure Units](#units))**: Microsoft and the partner work together to validate throughput and bandwidth limits prior to solution being made available to customers.
* **Built-in availability and resiliency**: Virtual WAN Network Virtual Appliance deployments are Availability Zone (AZ) aware and are automatically configured to be highly available.
* **No-hassle provisioning and boot-strapping**: A Managed Application is pre-qualified for provisioning and boot-strapping for the Virtual WAN platform. This Managed Application is available through the Azure Marketplace link.
* **Simplified routing**: Leverage Virtual WAN's intelligent routing systems. NVA solutions peer with the Virtual WAN Hub router and participate in the Virtual WAN routing decision process similarly to Microsoft Gateways.
* **Integrated support**: Partners have a special support agreement with Microsoft Azure Virtual WAN to quickly diagnose and resolve any customer problems.
* **Platform-provided lifecycle management**: Upgrades and patches are a part of the Azure Virtual WAN service. This takes away the complexity of lifecycle management from a customer deploying Virtual Appliance solutions.
* **Integrated with platform features**: Transit connectivity with Microsoft gateways and Virtual Networks, Encrypted ExpressRoute (SD-WAN overlay running over an ExpressRoute circuit) and Virtual Hub route tables interact seamlessly.


## <a name ="partner"></a> Partners

[!INCLUDE [NVA PARTNERS](../../includes/virtual-wan-nva-hub-partners.md)]

## Basic use cases

### Any-to-any connectivity

Customers can deploy a Network Virtual Appliance in every Azure region where they have a footprint. Branch sites are connected to Azure via SD-WAN tunnels terminating on the closest Network Virtual Appliance deployed in an Azure Virtual WAN Hub.

Branch sites can then access workloads in Azure deployed in Virtual Networks in the same region or other regions through the Microsoft global-backbone. SD-WAN connected sites can also communicate with other branches that are connected to Azure via ExpressRoute, Site-to-site VPN or Remote User Connectivity.


:::image type="content" source="./media/about-nva-hub/global-transit-nva.png" alt-text="Global transit architecture." lightbox="./media/about-nva-hub/global-transit-nva.png":::


### Security provided by Azure Firewall along with Connectivity NVA

Customers can deploy a Azure Firewall along side their connectivity-based Network Virtual Appliances. Virtual WAN routing can be configured to send all traffic to Azure Firewall for inspection. You may also configure Virtual WAN to send all internet-bound traffic to Azure Firewall for inspection.

:::image type="content" source="./media/about-nva-hub/global-transit-firewall.png" alt-text="Global transit architecture with Azure Firewall." lightbox="./media/about-nva-hub/global-transit-firewall.png":::

### Security provided by Network Virtual Appliance Firewalls

Customers can also deploy Network Virtual Appliances into the Virtual WAN Hub that perform both SD-WAN connectivity and Next-Generation Firewall capabilities. Customers can connect on-premises devices to the Network Virtual Appliance in the hub and also use the same appliance to inspect all North-South, East-West and Internet-bound traffic. Routing to enable these scenarios can be configured via [Routing Intent and Routing Policies](./how-to-routing-policies.md).

Partners that support these traffic flows are listed as **dual-role SD-WAN connectivity and security (Next-Generation Firewall) Network Virtual Appliances** in the [Partners section](#partner).

  
:::image type="content" source="./media/about-nva-hub/global-transit-ngfw.png" alt-text="Global transit architecture with third-party NVA." lightbox="./media/about-nva-hub/global-transit-ngfw.png":::

## <a name="how"></a>How does it work?

The NVAs that are available to be deployed directly into the Azure Virtual WAN hub are engineered specifically to be used in the Virtual WAN Hub. The NVA offer is published to Azure Marketplace as a Managed Application, and customers can deploy the offer directly from Azure Marketplace.

:::image type="content" source="./media/about-nva-hub/high-level-process.png" alt-text="Process overview":::

Each partner's NVA offering will have a slightly different experience and functionality based on their deployment requirements.

### <a name="managed"></a>Managed Application

All NVA offerings that are available to be deployed into the Virtual WAN hub will have a **Managed Application** that is available in Azure Marketplace. Managed Applications allow partners to do the following:

* Build a custom deployment experience for their NVA.
* Provide a specialized Resource Manager template that allows them to create the NVA directly in the Virtual WAN hub.
* Bill software licensing costs directly, or through Azure Marketplace.
* Expose custom properties and resource meters.

NVA Partners may create different resources depending on their appliance deployment, configuration licensing, and management needs. When a customer creates an NVA in the Virtual WAN hub, like all Managed Applications, there will be two Resource Groups created in their subscription.

* **Customer Resource Group** - This will contain an application placeholder for the Managed Application. Partners can use this to expose whatever customer properties they choose here.
* **Managed Resource Group** - Customers cannot configure or change resources in this resource group directly, as this is controlled by the publisher of the Managed Application. This Resource Group will contain the **NetworkVirtualAppliances** resource.

:::image type="content" source="./media/about-nva-hub/managed-app.png" alt-text="Managed Application resource groups":::

### <a name="units"></a>NVA Infrastructure Units

When you create an NVA in the Virtual WAN hub, you must choose the number of NVA Infrastructure Units you want to deploy it with. An **NVA Infrastructure Unit** is a unit of aggregate bandwidth capacity for an NVA in the Virtual WAN hub. An **NVA Infrastructure Unit** is similar to a VPN [Scale Unit](pricing-concepts.md#scale-unit) in terms of the way you think about capacity and sizing.

* 1 NVA Infrastructure Unit represents 500 Mbps of aggregate bandwidth for all branch site connections coming into this NVA, at a cost of $0.25/hour.
* Azure supports from 1-80 NVA Infrastructure Units for a given NVA virtual hub deployment.
* Each partner may offer different NVA Infrastructure Unit bundles that are a subset of all supported NVA Infrastructure Unit configurations.

Similar to VPN Scale Units, if you pick *1 NVA Infrastructure Unit = 500 Mbps*, it implies that two instances for redundancy will be created, each having a maximum throughput of 500 Mbps. For example, if you had five branches, each doing 10 Mbps at the branch, you will need an aggregate of 50 Mbps at the head end. Planning for aggregate capacity of the NVA should be done after assessing the capacity needed to support the number of branches to the hub.

## <a name="configuration"></a>Network Virtual Appliance configuration process

Partners have worked to provide an experience that configures the NVA automatically as part of the deployment process. Once the NVA has been provisioned into the virtual hub, any additional configuration that may be required for the NVA must be done via the NVA partners portal or management application. Direct access to the NVA is not available.

## <a name="resources"></a>Site and Connection resources with NVAs

Unlike Virtual WAN Site-to-site VPN Gateway configurations, you do not need to create **Site** resources, **Site-to-Site connection** resources, or **point-to-site connection** resources to connect your branch sites to your NVA in the Virtual WAN hub.

You still need to create Hub-to-VNet connections to connect your Virtual WAN hub to your Azure virtual networks as well as connect ExpressRoute, Site-to-site VPN or Remote User VPN connections.

## <a name="regions"></a>Supported regions

NVA in the virtual hub is available in the following regions:

|Geopolitical region | Azure regions|
|---|---|
| North America| Canada Central, Canada East, Central US, East US, East US 2, South Central US, North Central US, West Central US, West US, West US 2 |
| South America | Brazil South, Brazil Southeast |
| Europe | France Central, France South, Germany North, Germany West Central, North Europe, Norway East, Norway West, Switzerland North, Switzerland West, UK South, UK West, West Europe|
|  Middle East | UAE North |
| Asia |  East Asia, Japan East, Japan West, Korea Central, Korea South, Southeast Asia | 
| Australia | Australia South East, Australia East, Australia Central, Australia Central 2|
| Africa | South Africa North |
| India | South India, West India, Central India |

## NVA FAQ

[!INCLUDE [NVA FAQ](../../includes/virtual-wan-nva-hub-faq.md)]

## Next steps

To learn more about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) article.
