---
title: 'About Network Virtual Appliances - Virtual WAN hub'
titleSuffix: Azure Virtual WAN
description: Learn about Network Virtual Appliances in a Virtual WAN hub.
author: wtnlee
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 09/14/2022
ms.author: wellee
ms.custom: references_regions
# Customer intent: As someone with a networking background, I want to learn about Network Virtual Appliances in a Virtual WAN hub.
---
# About NVAs in a Virtual WAN hub

Customers can deploy select Network Virtual Appliances (NVAs) directly into a Virtual WAN hub in a solution that is jointly managed by Microsoft Azure and third-party Network Virtual Appliance vendors. Not all Network Virtual Appliances in Azure Marketplace can be deployed into a Virtual WAN hub. For a full list of available partners, see the [Partners](#partners) section of this article.

## Key benefits

When an NVA is deployed into a Virtual WAN hub, it can serve as a third-party gateway with various functionalities. It could serve as an SD-WAN gateway, Firewall, or a combination of both.

Deploying NVAs into a Virtual WAN hub provides the following benefits:

* **Pre-defined and pre-tested selection of infrastructure choices ([NVA Infrastructure Units](#units))**: Microsoft and the partner work together to validate throughput and bandwidth limits prior to solution being made available to customers.
* **Built-in availability and resiliency**: Virtual WAN NVA deployments are Availability Zone (AZ) aware and are automatically configured to be highly available.
* **No-hassle provisioning and boot-strapping**: A managed application is pre-qualified for provisioning and boot-strapping for the Virtual WAN platform. This managed application is available through the Azure Marketplace link.
* **Simplified routing**: Leverage Virtual WAN's intelligent routing systems. NVA solutions peer with the Virtual WAN hub router and participate in the Virtual WAN routing decision process similarly to Microsoft Gateways.
* **Integrated support**: Partners have a special support agreement with Microsoft Azure Virtual WAN to quickly diagnose and resolve any customer problems.
* **Platform-provided lifecycle management**: Upgrades and patches are a part of the Azure Virtual WAN service. This takes away the complexity of lifecycle management from a customer deploying Virtual Appliance solutions.
* **Integrated with platform features**: Transit connectivity with Microsoft gateways and Virtual Networks, Encrypted ExpressRoute (SD-WAN overlay running over an ExpressRoute circuit) and Virtual hub route tables interact seamlessly.

> [!IMPORTANT]
> To ensure you get the best support for this integrated solution, make sure you have similar levels of support entitlement with both Microsoft and your Network Virtual Appliance provider.

## Partners

[!INCLUDE [NVA partners](../../includes/virtual-wan-nva-hub-partners.md)]

## Basic use cases

### Any-to-any connectivity

Customers can deploy an NVA in every Azure region where they have a footprint. Branch sites are connected to Azure via SD-WAN tunnels terminating on the closest NVA deployed in an Azure Virtual WAN hub.

Branch sites can then access workloads in Azure deployed in virtual networks in the same region or other regions through the Microsoft global-backbone. SD-WAN connected sites can also communicate with other branches that are connected to Azure via ExpressRoute, Site-to-site VPN, or Remote User connectivity.

:::image type="content" source="./media/about-nva-hub/global-transit-nva.png" alt-text="Global transit architecture." lightbox="./media/about-nva-hub/global-transit-nva.png":::

### Security provided by Azure Firewall along with connectivity NVA

Customers can deploy an Azure Firewall along side their connectivity-based NVAs. Virtual WAN routing can be configured to send all traffic to Azure Firewall for inspection. You may also configure Virtual WAN to send all internet-bound traffic to Azure Firewall for inspection.

:::image type="content" source="./media/about-nva-hub/global-transit-firewall.png" alt-text="Global transit architecture with Azure Firewall." lightbox="./media/about-nva-hub/global-transit-firewall.png":::

### Security provided by NVA firewalls

Customers can also deploy NVAs into a Virtual WAN hub that perform both SD-WAN connectivity and Next-Generation Firewall capabilities. Customers can connect on-premises devices to the NVA in the hub and also use the same appliance to inspect all North-South, East-West, and Internet-bound traffic. Routing to enable these scenarios can be configured via [Routing Intent and Routing Policies](./how-to-routing-policies.md).

Partners that support these traffic flows are listed as **dual-role SD-WAN connectivity and security (Next-Generation Firewall) Network Virtual Appliances** in the [Partners section](#partners).

:::image type="content" source="./media/about-nva-hub/global-transit-ngfw.png" alt-text="Global transit architecture with third-party NVA." lightbox="./media/about-nva-hub/global-transit-ngfw.png":::

## <a name="how"></a>How does it work?

The NVAs that are available to be deployed directly into the Azure Virtual WAN hub are engineered specifically to be used in a Virtual WAN hub. The NVA offer is published to Azure Marketplace as a managed application, and customers can deploy the offer directly from Azure Marketplace.

:::image type="content" source="./media/about-nva-hub/high-level-process.png" alt-text="Process overview":::

Each partner's NVA offering will have a slightly different experience and functionality based on their deployment requirements.

### <a name="managed"></a>Managed application

All NVA offerings that are available to be deployed into a Virtual WAN hub will have a **managed application** that is available in Azure Marketplace. Managed applications allow partners to do the following:

* Build a custom deployment experience for their NVA.
* Provide a specialized Resource Manager template that allows them to create the NVA directly in a Virtual WAN hub.
* Bill software licensing costs directly, or through Azure Marketplace.
* Expose custom properties and resource meters.

NVA Partners may create different resources depending on their appliance deployment, configuration licensing, and management needs. When a customer creates an NVA in a Virtual WAN hub, like all managed applications, there will be two resource groups created in their subscription.

* **Customer resource group** - This will contain an application placeholder for the managed application. Partners can use this to expose whatever customer properties they choose here.
* **Managed resource group** - Customers can't configure or change resources in this resource group directly, as this is controlled by the publisher of the managed application. This resource group will contain the **NetworkVirtualAppliances** resource.

:::image type="content" source="./media/about-nva-hub/managed-app.png" alt-text="Managed Application resource groups":::


### Managed resource group permissions

By default, all managed resource groups have a deny-all Azure Active Directory assignment. Deny-all assignments prevent customers from calling write operations on any resources in the managed resource group, including Network Virtual Appliance resources.

However, partners may create exceptions for specific actions that customers are allowed to perform on resources deployed in managed resource groups.

Permissions on resources in existing managed resource groups aren't dynamically updated as new permitted actions are added by partners and require a manual refresh.

To refresh permissions on the managed resource groups, customers can leverage the [Refresh Permissions REST API ](/rest/api/managedapplications/applications/refresh-permissions).

> [!NOTE]
> To properly apply new permissions, refresh permissions API must be called with an additional query parameter **targetVersion**. The value for targetVersion is provider-specific. Please reference your provider's documentation for the latest version number.

```http-interactive
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Solutions/applications/{applicationName}/refreshPermissions?api-version=2019-07-01&targetVersion={targetVersion}
```

### <a name="units"></a>NVA Infrastructure Units

When you create an NVA in a Virtual WAN hub, you must choose the number of NVA Infrastructure Units you want to deploy it with. An **NVA Infrastructure Unit** is a unit of aggregate bandwidth capacity for an NVA in a Virtual WAN hub. An **NVA Infrastructure Unit** is similar to a VPN [Scale Unit](pricing-concepts.md#scale-unit) in terms of the way you think about capacity and sizing.

* 1 NVA Infrastructure Unit represents 500 Mbps of aggregate bandwidth for all branch site connections coming into this NVA, at a cost of $0.25/hour.
* Azure supports from 1-80 NVA Infrastructure Units for a given NVA virtual hub deployment.
* Each partner may offer different NVA Infrastructure Unit bundles that are a subset of all supported NVA Infrastructure Unit configurations.

Similar to VPN Scale Units, if you pick *1 NVA Infrastructure Unit = 500 Mbps*, it implies that two instances for redundancy will be created, each having a maximum throughput of 500 Mbps. For example, if you had five branches, each doing 10 Mbps at the branch, you'll need an aggregate of 50 Mbps at the head end. Planning for aggregate capacity of the NVA should be done after assessing the capacity needed to support the number of branches to the hub.

## <a name="configuration"></a>NVA configuration process

Partners have worked to provide an experience that configures the NVA automatically as part of the deployment process. Once the NVA has been provisioned into the virtual hub, any additional configuration that may be required for the NVA must be done via the NVA partners portal or management application. Direct access to the NVA isn't available.

## <a name="resources"></a>Site and connection resources with NVAs

Unlike Virtual WAN Site-to-site VPN gateway configurations, you don't need to create **Site** resources, **Site-to-Site connection** resources, or **point-to-site connection** resources to connect your branch sites to your NVA in a Virtual WAN hub.

You still need to create Hub-to-VNet connections to connect your Virtual WAN hub to your Azure virtual networks as well as connect ExpressRoute, Site-to-site VPN, or Remote User VPN connections.

## <a name="regions"></a>Supported regions

NVA in the virtual hub is available in the following regions:

|Geopolitical region | Azure regions|
|---|---|
| North America| Canada Central, Canada East, Central US, East US, East US 2, South Central US, North Central US, West Central US, West US, West US 2 |
| South America | Brazil South, Brazil Southeast |
| Europe | France Central, France South, Germany North, Germany West Central, North Europe, Norway East, Norway West, Switzerland North, Switzerland West, UK South, UK West, West Europe|
| Middle East | UAE North |
| Asia | East Asia, Japan East, Japan West, Korea Central, Korea South, Southeast Asia | 
| Australia | Australia South East, Australia East, Australia Central, Australia Central 2|
| Africa | South Africa North |
| India | South India, West India, Central India |

## NVA FAQ

[!INCLUDE [NVA FAQ](../../includes/virtual-wan-nva-hub-faq.md)]

## Next steps

To learn more about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) article.
