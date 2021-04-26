---
title: 'Azure Virtual WAN: About Network Virtual Appliance in the hub'
description: In this article, you will learn about Network Virtual Appliances in the Virtual WAN hub.
services: virtual-wan
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 09/22/2020
ms.author: scottnap
# Customer intent: As someone with a networking background, I want to learn about Network Virtual Appliances in the Virtual WAN hub.
---
# About Network Virtual Appliance in an Azure Virtual WAN hub (Preview)

Azure Virtual WAN has worked with networking partners to build automation that makes it easy to connect their Customer Premise Equipment (CPE) to an Azure VPN gateway in the virtual hub. Azure is working with select networking partners to enable customers to deploy a third-party Network Virtual Appliance (NVA) directly into the virtual hub. This allows customers who want to connect their branch CPE to the same brand NVA in the virtual hub so that they can take advantage of proprietary end-to-end SD-WAN capabilities.

Barracuda Networks and Cisco Systems are the first partners to provide the NVAs that can be deployed directly to the Virtual WAN hub.  See [Barracuda CloudGen WAN](https://www.barracuda.com/products/cloudgenwan), [Cisco Cloud OnRamp for Multi-Cloud](https://www.cisco.com/c/en/us/td/docs/routers/sdwan/configuration/cloudonramp/ios-xe-17/cloud-onramp-book-xe/cloud-onramp-multi-cloud.html#Cisco_Concept.dita_c61e0e7a-fff8-4080-afee-47b81e8df701) and [VMware SD-WAN](https://kb.vmware.com/s/article/82746) for their respective product documentation. Azure is working with more partners so expect to see other offerings follow.

> [!NOTE]
> Only NVA offers that are available to be deployed into the Virtual WAN hub can deployed into the Virtual WAN hub. They cannot be deployed into an arbitrary virtual network in Azure.

## <a name="how"></a>How does it work?

The NVAs that are available to be deployed directly into the Azure Virtual WAN hub are engineered specifically to be used in the virtual hub. The NVA offer is published to Azure Marketplace as a Managed Application, and customers can deploy the offer directly from Azure Marketplace, or they can deploy the offer from the virtual hub via the Azure portal.

:::image type="content" source="./media/about-nva-hub/high-level-process.png" alt-text="Process overview":::

Each partner's NVA offering will have a slightly different experience and functionality based on their deployment requirements. However there are some things that are common across all partner offerings for NVA in the Virtual WAN hub.

* A Managed Application experience offered through Azure Marketplace.
* NVA Infrastructure Unit-based capacity and billing.
* Health Metrics surfaced through Azure Monitor.

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

Unlike Azure VPN Gateway configurations, you do not need to create **Site** resources, **Site-to-Site connection** resources, or **point-to-site connection** resources to connect your branch sites to your NVA in the Virtual WAN hub. This is all managed via the NVA partner.

You still need to create Hub-to-VNet connections to connect your Virtual WAN hub to your Azure virtual networks.

## <a name="regions"></a>Supported regions

NVA in the virtual hub is available for Preview in the following regions:

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
## FAQ

### I am a network appliance partner and want to get our NVA in the hub.  Can I join this partner program?

Unfortunately, we do not have capacity to on-board any new partner offers at this time. Check back with us in November!

### Can I deploy any NVA from Azure Marketplace into the Virtual WAN hub?

At this time, only [Barracuda CloudGen WAN](https://aka.ms/BarracudaMarketPlaceOffer)  [Cisco Cloud vWAN Application](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/cisco.cisco_cloud_vwan_app?tab=Overview) and [VMware Sd-WAN](https://aka.ms/vmwareMarketplaceLink) are available to be deployed into the Virtual WAN hub.

### What is the cost of the NVA?

You must purchase a license for the NVA from the NVA vendor.  For your Barracuda CloudGen WAN NVA from Barracuda license, see [Barracuda's CloudGen WAN page](https://www.barracuda.com/products/cloudgenwan). Cisco currently only offers BYOL (Bring Your Own License) licensing model that needs to be procured directly from Cisco. In addition, you will also incur charges from Microsoft for the NVA Infrastructure Units you consume, and any other resources you use. For more information, see [Pricing Concepts](pricing-concepts.md).

### Can I deploy an NVA to a Basic hub?

No. You must use a Standard hub if you want to deploy an NVA.

### Can I deploy an NVA into a Secure hub?

Yes. Partner NVA's can be deployed into a hub with Azure Firewall.

### Can I connect any CPE device in my branch office to Barracuda CloudGen WAN NVA in the hub?

No. Barracuda CloudGen WAN is only compatible with Barracuda CPE devices. To learn more about CloudGen WAN requirements, see [Barracuda's CloudGen WAN page](https://www.barracuda.com/products/cloudgenwan). For Cisco, there a several SD-WAN CPE devices that are compatable. Please see [Cisco Cloud OnRamp for Multi-Cloud](https://www.cisco.com/c/en/us/td/docs/routers/sdwan/configuration/cloudonramp/ios-xe-17/cloud-onramp-book-xe/cloud-onramp-multi-cloud.html#Cisco_Concept.dita_c61e0e7a-fff8-4080-afee-47b81e8df701) documenation for compatable CPEs.

### What routing scenarios are supported with NVA in the hub?

All routing scenarios supported by Virtual WAN are supported with NVAs in the hub.

## Next steps

To learn more about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) article.
