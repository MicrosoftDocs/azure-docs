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

When a Network Virtual Appliance is deployed into the Virtual WAN hub, it can serve as a third-party gateway to which on-premises devices can connect via proprietary SD-WAN protocols. Network Virtual Appliances in the Virtual WAN hub can also serve as a security appliance, allowing customers to send traffic to the appliance for inspection.

Deploying Network Virtual Appliances into the Virtual WAN Hub allows customers to enjoy the following benefits:

1. Choose from a pre-defined and pre-tested selection of infrastructure choices ([NVA Infrastructure Units](#units)) to meet  throughput needs.
1. Availability-zone aware and highly-available (HA) deployments.
1. No-hazard provisioning and boot-strapping through a Managed Application.
1. One-touch routing with Virtual WAN's fully meshed hubs, advanced routing capabilities and the Microsoft global backbone.
1. Most partners have a tightly integrated support handshake between Microsoft Azure and the Network Virtual Appliance Vendor.


## <a name ="partner"></a> Partners

The following SD-WAN connectivity Network Virtual Appliances can be deployed in the Virtual WAN hub.

|Partners|Configuration/How-to/Deployment Guide| Dedicated Support Model |
|---|---| --- |
|[Barracuda Networks](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/barracudanetworks.barracuda_cloudgenwan_gateway?tab=Overviewus/marketplace/apps/barracudanetworks.barracuda_cloudgenwan_gateway?tab=Overview)| [Barracuda CloudGen WAN Deployment Guide](https://campus.barracuda.com/product/cloudgenwan/doc/91980640/deployment/)| Yes|
|[Cisco Cloud Service Router(CSR) VWAN](https://aka.ms/ciscoMarketPlaceOffer)| The integration of the Cisco SD-WAN solution with Azure virtual WAN enhances Cloud OnRamp for Multi-Cloud deployments and enables configuring Cisco Catalyst 8000V Edge Software (Cisco Catalyst 8000V) as a network virtual appliance (NVA) in Azure Virtual WAN Hubs. [View  Cisco SD-WAN Cloud OnRamp, Cisco IOS XE Release 17.x Configuration Guide](https://www.cisco.com/c/en/us/td/docs/routers/sdwan/configuration/cloudonramp/ios-xe-17/cloud-onramp-book-xe/cloud-onramp-multi-cloud.html#Cisco_Concept.dita_c61e0e7a-fff8-4080-afee-47b81e8df701) | Yes|
|[VMware SD-WAN ](https://sdwan.vmware.com/partners/microsoft) | [VMware SD-WAN in Virtual WAN Hub Deployment Guide](https://kb.vmware.com/s/article/82746). The managed application for deployment can be found [here](https://azuremarketplace.microsoft.com/marketplace/apps/velocloud.vmware_sdwan_in_vwan).| Yes|
| Versa Networks | Versa Deployment Guide | Yes |


The following dual-role SD-WAN connectivity and network security (Next-Generation Firewall) Network Virtual Appliances can be deployed in the Virtual WAN hub.

|Partners|Configuration/How-to/Deployment Guide| Dedicated Support Model |
|---|---| --- | 
| [Fortinet Next-Generation Firewall (NGFW)](https://www.fortinet.com/products/next-generation-firewall) | To access the preview of Fortinet NGFW deployed in the Virtual WAN hub, please reach out to vwan@fortinet.com. For more information about the offering, please see the following [document](https://www.fortinet.com/blog/business-and-technology/fortigate-vm-first-ngfw-and-secure-sd-wan-integration-in-microsoft-azure-virtual-wan). | No|


The following Partners are coming soon: Aviatrix, Citrix, Cisco Meraki and Silver Peak.
## Basic use cases

### Any-to-any connectivity

Customers can deploy a Network Virtual Appliance in every Azure region where they have a footprint. Branch sites are connected to Azure via SD-WAN tunnels terminating on the nearest Network Virtual Appliance.

Branch sites can then access workloads in Azure deployed in Virtual Networks in the same region or other regions through the Microsoft global-backbone. SD-WAN connected sites can also talk to other branches that are connected to Azure via ExpressRoute, Site-to-site VPN or Remote User Connectivity.


:::image type="content" source="./media/about-nva-hub/global-transit-nva.png" alt-text="Global transit architecture.":::


### Security provided by Azure Firewall

Customers can deploy a Azure Firewall along side their connectivity-based Network Virtual Appliances. Virtual WAN routing can be configured to send all traffic to Azure Firewall for inspection. You may also configure Virtual WAN to send all internet-bound traffic to Azure Firewall for inspection. 

:::image type="content" source="./media/about-nva-hub/global-transit-firewall.png" alt-text="Global transit architecture with Azure Firewall.":::



### Security provided by third-party NGFW

Customers can deploy Network Virtual Appliances into the Virtual WAN Hub that perform both SD-WAN connectivity and Next-Generation Firewall capabilities. Customers can connect on-premises devices to the Network Virtual Appliance in the hub and also use the same appliance to inspect all North-South, East-West and Internet-bound traffic. Routing to enable these scenarios can be configured via [Routing Intent and Routing Policies](./how-to-routing-policies.md). 

  
:::image type="content" source="./media/about-nva-hub/global-transit-ngfw.png" alt-text="Global transit architecture with third-party NVA.":::

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
