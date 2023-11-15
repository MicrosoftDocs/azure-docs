---
title: 'About Network Virtual Appliances - Virtual WAN hub'
titleSuffix: Azure Virtual WAN
description: Learn about Network Virtual Appliances in a Virtual WAN hub.
author: wtnlee
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 11/02/2023
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
* **No-hassle provisioning and boot-strapping**: A managed application is prequalified for provisioning and boot-strapping for the Virtual WAN platform. This managed application is available through the Azure Marketplace link.
* **Simplified routing**: Leverage Virtual WAN's intelligent routing systems. NVA solutions peer with the Virtual WAN hub router and participate in the Virtual WAN routing decision process similarly to Microsoft Gateways.
* **Integrated support**: Partners have a special support agreement with Microsoft Azure Virtual WAN to quickly diagnose and resolve any customer problems.
* **Platform-provided lifecycle management**: Upgrades and patches are a part of the Azure Virtual WAN service. This takes away the complexity of lifecycle management from a customer deploying Virtual Appliance solutions.
* **Integrated with platform features**: Transit connectivity with Microsoft gateways and Virtual Networks, Encrypted ExpressRoute (SD-WAN overlay running over an ExpressRoute circuit) and Virtual hub route tables interact seamlessly.

> [!IMPORTANT]
> To ensure you get the best support for this integrated solution, make sure you have similar levels of support entitlement with both Microsoft and your Network Virtual Appliance provider.

## Partners

The following tables describe the Network Virtual Appliances that are eligible to be deployed in the Virtual WAN hub and the relevant use cases (connectivity and/or firewall). The Virtual WAN NVA Vendor Identifier column corresponds to the NVA Vendor that is displayed in Azure portal when you deploy a new NVA or view existing NVAs deployed in the Virtual hub.
 
[!INCLUDE [NVA partners](../../includes/virtual-wan-nva-hub-partners.md)]

## Basic use cases

### Any-to-any connectivity

Customers can deploy an NVA in every Azure region where they have a footprint. Branch sites are connected to Azure via SD-WAN tunnels terminating on the closest NVA deployed in an Azure Virtual WAN hub.

Branch sites can then access workloads in Azure deployed in virtual networks in the same region or other regions through the Microsoft global-backbone. SD-WAN connected sites can also communicate with other branches that are connected to Azure via ExpressRoute, Site-to-site VPN, or Remote User connectivity.

:::image type="content" source="./media/about-nva-hub/global-transit-nva.png" alt-text="Global transit architecture." lightbox="./media/about-nva-hub/global-transit-nva.png":::

### Security provided by Azure Firewall along with connectivity NVA

Customers can deploy an Azure Firewall along side their connectivity-based NVAs. Virtual WAN routing can be configured to send all traffic to Azure Firewall for inspection. You can also configure Virtual WAN to send all internet-bound traffic to Azure Firewall for inspection.

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

NVA Partners might create different resources depending on their appliance deployment, configuration licensing, and management needs. When a customer creates an NVA in a Virtual WAN hub, like all managed applications, there will be two resource groups created in their subscription.

* **Customer resource group** - This contains an application placeholder for the managed application. Partners can use this to expose whatever customer properties they choose here.
* **Managed resource group** - Customers can't configure or change resources in this resource group directly, as this is controlled by the publisher of the managed application. This resource group contains the **NetworkVirtualAppliances** resource.

:::image type="content" source="./media/about-nva-hub/managed-app.png" alt-text="Managed Application resource groups":::


### Managed resource group permissions

By default, all managed resource groups have a deny-all Microsoft Entra assignment. Deny-all assignments prevent customers from calling write operations on any resources in the managed resource group, including Network Virtual Appliance resources.

However, partners might create exceptions for specific actions that customers are allowed to perform on resources deployed in managed resource groups.

Permissions on resources in existing managed resource groups aren't dynamically updated as new permitted actions are added by partners and require a manual refresh.

To refresh permissions on the managed resource groups, customers can leverage the [Refresh Permissions REST API ](/rest/api/managedapplications/applications/refresh-permissions).

> [!NOTE]
> To properly apply new permissions, refresh permissions API must be called with an additional query parameter **targetVersion**. The value for targetVersion is provider-specific. Please reference your provider's documentation for the latest version number.

```http-interactive
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Solutions/applications/{applicationName}/refreshPermissions?api-version=2019-07-01&targetVersion={targetVersion}
```

### <a name="units"></a>NVA Infrastructure Units

When you create an NVA in a Virtual WAN hub, you must choose the number of NVA Infrastructure Units you want to deploy it with. An **NVA Infrastructure Unit** is a unit of aggregate bandwidth capacity for an NVA in a Virtual WAN hub. An **NVA Infrastructure Unit** is similar to a VPN [Scale Unit](pricing-concepts.md#scale-unit) in terms of the way you think about capacity and sizing.

* NVA Infrastructure Units are a guideline for how much aggregate networking throughput the **virtual machine infrastructure** on which NVAs are deployed can support. 1 NVA Infrastructure Unit corresponds to 500 Mbps of aggregate throughput. This 500 Mbps number doesn't take into consideration differences between the software that runs on Network Virtual Appliances. Depending on the features turned on in the NVA or partner-specific software implementation, networking functions such as encryption/decryption, encapsulation/decapsulation or deep packet inspection might be more intensive. This means you might see less throughput than the NVA infrastructure unit. For a mapping of Virtual WAN NVA infrastructure units to expected throughputs, please contact the vendor.
* Azure supports deployments ranging from 2-80 NVA Infrastructure Units for a given NVA virtual hub deployment, but partners might choose which scale units they support. As such, you might not be able to deploy all possible scale unit configurations.

NVAs in Virtual WAN are deployed to ensure you always are able to achieve at minimum the vendor-specific throughput numbers for a particular chosen scale unit. To achieve this, NVAs in Virtual WAN are overprovisioned with additional capacity in the form of multiple instances in a 'n+1' manner. This means that at any given time you might see aggregate throughput across the instances to be greater than the vendor-specific throughput numbers. This ensures if an instance is unhealthy, the remaining 'n' instance(s) can service customer traffic and provide the vendor-specific throughput for that scale unit.

If the total amount of traffic that passes through an NVA at a given time goes above the vendor-specific throughput numbers for the chosen scale unit, events that might cause an NVA instance to be unavailable including but not limited to routine Azure platform maintenance activities or software upgrades can result in service or connectivity disruption. To minimize service disruptions, you should choose the scale unit based on your peak traffic profile and vendor-specific throughput numbers for a particular scale unit as opposed to relying on best-case throughput numbers observed during testing.
 
## <a name="configuration"></a>NVA configuration process

Partners have worked to provide an experience that configures the NVA automatically as part of the deployment process. Once the NVA is provisioned into the virtual hub, any additional configuration that might be required for the NVA must be done via the NVA partners portal or management application. Direct access to the NVA isn't available.

## <a name="resources"></a>Site and connection resources with NVAs

Unlike Virtual WAN Site-to-site VPN gateway configurations, you don't need to create **Site** resources, **Site-to-Site connection** resources, or **point-to-site connection** resources to connect your branch sites to your NVA in a Virtual WAN hub.

You still need to create Hub-to-VNet connections to connect your Virtual WAN hub to your Azure virtual networks as well as connect ExpressRoute, Site-to-site VPN, or Remote User VPN connections.

## <a name="regions"></a>Supported regions

NVA in the virtual hub is available in the following regions:

|Geopolitical region | Azure regions|
|---|---|
| North America| Canada Central, Canada East, Central US, East US, East US 2, South Central US, North Central US, West Central US, West US, West US 2 |
| South America | Brazil South, Brazil Southeast |
| Europe | France Central, France South, Germany North, Germany West Central, North Europe, Norway East, Norway West, Switzerland North, Switzerland West, UK South, UK West, West Europe, Sweden Central|
| Middle East | UAE North, Qatar Central |
| Asia | East Asia, Japan East, Japan West, Korea Central, Korea South, Southeast Asia | 
| Australia | Australia South East, Australia East, Australia Central, Australia Central 2|
| Africa | South Africa North |
| India | South India, West India, Central India |

## NVA FAQ

[!INCLUDE [NVA FAQ](../../includes/virtual-wan-nva-hub-faq.md)]

## Next steps

To learn more about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) article.
