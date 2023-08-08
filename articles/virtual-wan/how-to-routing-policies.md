---
title: 'How to configure Virtual WAN Hub routing policies'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Virtual WAN routing policies
author: wtnlee
ms.service: virtual-wan
ms.topic: how-to
ms.date: 02/13/2023
ms.author: wellee

---
# How to configure Virtual WAN Hub routing intent and routing policies

Virtual WAN Hub routing intent allows you to set up simple and declarative routing policies to send traffic to bump-in-the-wire security solutions like Azure Firewall, Network Virtual Appliances or software-as-a-service (SaaS) solutions deployed within the Virtual WAN hub.

## Background

Routing Intent and Routing Policies allow you to configure the Virtual WAN hub to forward Internet-bound and Private (Point-to-site VPN, Site-to-site VPN, ExpressRoute, Virtual Network and Network Virtual Appliance) Traffic to an Azure Firewall,  Next-Generation Firewall Network Virtual Appliance (NGFW-NVA) or security software-as-a-service (SaaS) solution deployed in the virtual hub. 

There are two types of Routing Policies: Internet Traffic and Private Traffic Routing Policies. Each Virtual WAN Hub may have at most one Internet Traffic Routing Policy and one Private Traffic Routing Policy, each with a single Next Hop resource. While Private Traffic includes both branch and Virtual Network address prefixes, Routing Policies considers them as one entity within the Routing Intent concepts.

* **Internet Traffic Routing Policy**:  When an Internet Traffic Routing Policy is configured on a Virtual WAN hub, all branch (Remote User VPN (Point-to-site VPN), Site-to-site VPN, and ExpressRoute) and Virtual Network connections to that Virtual WAN Hub forwards Internet-bound traffic to the **Azure Firewall**, **Third-Party Security provider**, **Network Virtual Appliance** or **SaaS solution** specified as part of the Routing Policy.

    In other words, when an Internet Traffic Routing Policy is configured on a Virtual WAN hub, the Virtual WAN advertises a default (0.0.0.0/0) route to all spokes, Gateways and Network Virtual Appliances (deployed in the hub or spoke).
 
* **Private Traffic Routing Policy**: When a Private Traffic Routing Policy is configured on a Virtual WAN hub, **all** branch and Virtual Network traffic in and out of the Virtual WAN Hub including inter-hub traffic is forwarded to the Next Hop **Azure Firewall**, **Network Virtual Appliance** or **SaaS solution**  resource.

    In other words, when a Private Traffic Routing Policy is configured on the Virtual WAN Hub,  all branch-to-branch, branch-to-virtual network, virtual network-to-branch and inter-hub traffic is sent via Azure Firewall, Network Virtual Appliance or SaaS solution deployed in the Virtual WAN Hub.

## Use Cases

The following section describes two common scenarios where Routing Policies are applied to Secured Virtual WAN hubs.

### All Virtual WAN Hubs are secured (deployed with Azure Firewall, NVA or SaaS solution)

In this scenario, all Virtual WAN hubs are deployed with an Azure Firewall, NVA or SaaS solution in them. In this scenario, you may configure an Internet Traffic Routing Policy, a Private Traffic Routing Policy or both on each Virtual WAN Hub.

:::image type="content" source="./media/routing-policies/two-secured-hubs-diagram.png"alt-text="Screenshot showing architecture with two secured hubs."lightbox="./media/routing-policies/two-secured-hubs-diagram.png":::

Consider the following configuration where Hub 1 and Hub 2  have Routing Policies for both Private and Internet Traffic. 

**Hub 1 configuration:**
* Private Traffic  Policy with Next Hop Hub 1 Azure Firewall, NVA or SaaS solution
* Internet Traffic Policy with Next Hop Hub 1 Azure Firewall,  NVA or SaaS solution 

**Hub 2 configuration:**
* Private Traffic  Policy with Next Hop Hub 2 Azure Firewall, NVA or SaaS solution
* Internet Traffic Policy with Next Hop Hub 2 Azure Firewall, NVA or SaaS solution

The following are the traffic flows that result from such a configuration.

> [!NOTE]
> Internet Traffic must egress through the **local** security solution in the hub as the default route (0.0.0.0/0) does **not** propagate across hubs.

| From |   To |  Hub 1 VNets | Hub 1 branches | Hub 2 VNets | Hub 2 branches| Internet|
| -------------- | -------- | ---------- | ---| ---| ---| ---|
| Hub 1 VNets     | &#8594;| Hub 1 AzFW  or NVA|   Hub 1 AzFW or NVA    | Hub 1 and 2 AzFW, NVA or SaaS | Hub 1 and 2 AzFW, NVA or SaaS | Hub 1 AzFW, NVA or SaaS |
| Hub 1 Branches   | &#8594;|  Hub 1 AzFW, NVA or SaaS |   Hub 1 AzFW, NVA or SaaS    | Hub 1 and 2 AzFW, NVA or SaaS | Hub 1 and 2 AzFW, NVA or SaaS | Hub 1 AzFW, NVA or SaaS|
| Hub 2 VNets     | &#8594;| Hub 1 and 2 AzFW, NVA or SaaS|   Hub 1 and 2 AzFW, NVA or SaaS    | Hub 2 AzFW, NVA or SaaS | Hub 2 AzFW, NVA or SaaS| Hub 2 AzFW, NVA or SaaS|
| Hub 2 Branches   | &#8594;|   Hub 1 and 2 AzFW, NVA or SaaS|    Hub 1 and 2 AzFW, NVA or SaaS   | Hub 2 AzFW, NVA or SaaS |  Hub 2 AzFW, NVA or SaaS | Hub 2AzFW, NVA or SaaS|


### Deploying both secured and regular Virtual WAN Hubs 

In this scenario, not all hubs in the WAN are Secured Virtual WAN Hubs (hubs that have a security solution deployed in them).

Consider the following configuration where Hub 1 (Normal) and Hub 2 (Secured) are deployed in a Virtual WAN. Hub 2 has Routing Policies for both Private and Internet Traffic. 

**Hub 1 Configuration:**
* N/A (can't configure Routing Policies if hub isn't deployed with Azure Firewall, NVA or SaaS solution)

**Hub 2 Configuration:**
* Private Traffic  Policy with Next Hop Hub 2 Azure Firewall, NVA or SaaS solution.
* Internet Traffic Policy with Next Hop Hub 2 Azure Firewall, NVA or SaaS solution.

:::image type="content" source="./media/routing-policies/one-secured-one-normal-diagram.png"alt-text="Screenshot showing architecture with one secured hub one normal hub."lightbox="./media/routing-policies/one-secured-one-normal-diagram.png":::

 The following are the traffic flows that result from such a configuration. Branches and Virtual Networks connected to Hub 1 **can't** access the Internet via a security solution deployed in the Hub because the default route (0.0.0.0/0) does **not** propagate across hubs.

| From |   To |  Hub 1 VNets | Hub 1 branches | Hub 2 VNets | Hub 2 branches| Internet |
| -------------- | -------- | ---------- | ---| ---| ---| --- |
| Hub 1 VNets     | &#8594;| Direct |   Direct   | Hub 2 AzFW, NVA or SaaS| Hub 2 AzFW, NVA or SaaS | - |
| Hub 1 Branches   | &#8594;|  Direct |   Direct    | Hub 2 AzFW, NVA or SaaS | Hub 2 AzFW, NVA or SaaS | - |
| Hub 2 VNets     | &#8594;| Hub 2 AzFW, NVA or SaaS|   Hub 2 AzFW, NVA or SaaS    | Hub 2 AzFW, NVA or SaaS| Hub 2 AzFW, NVA or SaaS | Hub 2 AzFW, NVA or SaaS|
| Hub 2 Branches   | &#8594;|   Hub 2 AzFW, NVA or SaaS  |    Hub 2 AzFW, NVA or SaaS    | Hub 2 AzFW, NVA or SaaS|  Hub 2 AzFW, NVA or SaaS | Hub 2 AzFW, NVA or SaaS|


## <a name="knownlimitations"></a>  Known Limitations

* Routing Intent is currently available in Azure public. Microsoft Azure operated by 21Vianet and Azure Government are currently in roadmap.
* Routing Intent simplifies routing by managing route table associations and propagations for all connections (Virtual Network, Site-to-site VPN, Point-to-site VPN and ExpressRoute). Virtual WANs with custom route tables and customized policies therefore can't be used with the Routing Intent constructs.
* Encrypted ExpressRoute (Site-to-site VPN tunnels running over ExpressRoute circuits) is supported in hubs where routing intent is configured if Azure Firewall is configured to allow traffic between VPN tunnel endpoints (Site-to-site VPN Gateway private IP and on-premises VPN device private IP). For more information on the required configurations, see [Encrypted ExpressRoute with routing intent](#encryptedER).
* The following connectivity use cases are **not** supported with Routing Intent:
  * Static routes in the defaultRouteTable that point to a Virtual Network connection can't be used in conjunction with routing intent. However, you can use the [BGP peering feature](scenario-bgp-peering-hub.md).
  * The ability to deploy both a SD-WAN connectivity NVA and a separate Firewall NVA or SaaS solution in the **same** Virtual WAN hub is currently in the road-map. Once routing intent is configured with next hop SaaS solution or Firewall NVA, connectivity between the SD-WAN NVA and Azure is impacted. Instead, deploy the SD-WAN NVA and Firewall NVA or SaaS solution in different Virtual Hubs. Alternatively, you can also deploy the SD-WAN NVA in a spoke Virtual Network connected to the hub and leverage the virtual hub [BGP peering](scenario-bgp-peering-hub.md) capability.
  * Network Virtual Appliances (NVAs) can only be specified as the next hop resource for routing intent if they're Next-Generation Firewall or dual-role Next-Generation Firewall and SD-WAN NVAs. Currently, **checkpoint**, **fortinet-ngfw** and **fortinet-ngfw-and-sdwan** are the only NVAs eligible to be configured to be the next hop for routing intent. If you attempt to specify another NVA, Routing Intent creation fails. You can check the type of the NVA by navigating to your Virtual Hub -> Network Virtual Appliances and then looking at the **Vendor** field.
  * Routing Intent users who want to connect multiple ExpressRoute circuits to Virtual WAN and want to send traffic between them via a security solution deployed in the hub can enable open up a support case to enable this use case. Reference [enabling connectivity across ExpressRoute circuits](#expressroute) for more information.

## Considerations

Customers who are currently using Azure Firewall in the Virtual WAN hub without Routing Intent may enable routing intent using Azure Firewall Manager, Virtual WAN hub routing portal or through other Azure management tools (PowerShell, CLI, REST API).

Before enabling routing intent, consider the following:
* Routing intent can only be configured on hubs where there are no custom route tables and no static routes in the defaultRouteTable with next hop Virtual Network Connection. For more information, see [prerequisites](#prereq).
* Save a copy of your gateways, connections and route tables prior to enabling routing intent. The system won't automatically save and apply previous configurations. For more information, see [rollback strategy](#rollback).
* Routing intent changes the static routes in the defaultRouteTable. Due to Azure portal optimizations, the state of the defaultRouteTable after routing intent is configured may be different if you configure routing intent using REST, CLI or PowerShell. For more information, see [static routes](#staticroute).
* Enabling routing intent affects the advertisement of prefixes to on-premises. See [prefix advertisements](#prefixadvertisments) for more information.
* You may open a support case to enable connectivity across ExpressRoute  circuits via a Firewall appliance in the hub. Enabling this connectivity pattern modifies the prefixes advertised to ExpressRoute circuits. See [About ExpressRoute](#expressroute) for more information.

### <a name="prereq"></a> Prerequisites

To enable routing intent and policies, your Virtual Hub must meet the below prerequisites: 

* There are no custom route tables deployed with the Virtual Hub. The only route tables that exist are the noneRouteTable and the defaultRouteTable.
* You can't have static routes with next hop Virtual Network Connection. You may have static routes in the defaultRouteTable have next hop Azure Firewall. 

The option to configure routing intent is greyed out for hubs that don't meet the above requirements.

Using routing intent (enable inter-hub option) in Azure Firewall Manager has an additional requirement:

* Routes created by Azure Firewall Manager  follow the naming convention of **private_traffic**, **internet_traffic** or **all_traffic**. Therefore, all routes in the defaultRouteTable must follow this convention.

###  <a name="rollback"></a> Rollback strategy

> [!NOTE]
> Note that when routing intent configuration is completely removed from a hub, all connections to the hub are set to propagate to the default label (which applies to 'all' defaultRouteTables in the Virtual WAN). As a result, if you're considering implementing Routing Intent in Virtual WAN, you should save a copy of your existing configurations (gateways, connections, route tables) to apply if you wish to revert back to the original configuration. The system doesn't automatically restore your previous configuration.

Routing Intent simplifies routing and configuration by managing route associations and propagations of all connections in a hub.

The following table describes  the associated route table and propagated route tables of all connections once routing intent is configured.

|Routing Intent configuration | Associated route table| Propagated route tables|
| --| --| --|
|Internet|defaultRouteTable| default label (defaultRouteTable of all hubs in the Virtual WAN)|
| Private| defaultRouteTable| noneRouteTable|
|Internet and Private| defaultRouteTable| noneRouteTable|

###  <a name="staticroute"></a> Static routes in defaultRouteTable

The following section describes how routing intent manages static routes in the defaultRouteTable when  routing intent is enabled on a hub. The modifications that Routing Intent makes to the defaultRouteTable is irreversible. 

If you remove routing intent, you'll have to manually restore your previous configuration. Therefore, we recommend saving a snapshot of your configuration before enabling routing intent.

#### Azure Firewall Manager and Virtual WAN Hub Portal

When routing intent is enabled on the hub, static routes corresponding to the configured routing policies are created automatically in the defaultRouteTable. These routes are: 

| Route Name | Prefixes | Next Hop Resource| 
|--|--|--|
| _policy_PrivateTraffic | 10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12| Azure Firewall | 
 | _policy_PublicTraffic| 0.0.0.0/0| Azure Firewall |

> [!NOTE]
> Any static routes in the defaultRouteTable containing prefixes that aren't exact matches with 0.0.0.0/0 or the RFC1918 super-nets (10.0.0.0/8, 192.168.0.0/16 and 172.16.0.0/12) are automatically consolidated into a single static route, named **private_traffic**. Prefixes in the defaultRouteTable that match RFC1918 supernets or 0.0.0.0/0 are always automatically removed once routing intent is configured, regardless of the policy type.

For example, consider the scenario where the defaultRouteTable has the following routes prior to configuring routing intent:

| Route Name | Prefixes | Next Hop Resource| 
|--|--|--|
| private_traffic |  192.168.0.0/16, 172.16.0.0/12, 40.0.0.0/24, 10.0.0.0/24| Azure Firewall | 
 to_internet | 0.0.0.0/0| Azure Firewall |
  additional_private | 10.0.0.0/8, 50.0.0.0/24| Azure Firewall |

Enabling routing intent on this hub would result in the following end state of the defaultRouteTable. All prefixes that aren't RFC1918 or 0.0.0.0/0 are consolidated into a single route named private_traffic.

| Route Name | Prefixes | Next Hop Resource| 
|--|--|--|
| _policy_PrivateTraffic | 10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12| Azure Firewall | 
 | _policy_PublicTraffic| 0.0.0.0/0| Azure Firewall |
| private_traffic | 40.0.0.0/24, 10.0.0.0/24, 50.0.0.0/24| Azure Firewall | 

#### Other methods (PowerShell, REST, CLI)

Creating routing intent using non-Portal methods  automatically creates the corresponding policy routes in the defaultRouteTable and  also removes any prefixes in static routes that are exact matches with 0.0.0.0/0 or RFC1918 supernets (10.0.0.0/8, 192.168.0.0/16 or 172.16.0.0/12). However, other static routes are **not** automatically consolidated.

For example, consider the scenario where the defaultRouteTable has the following routes prior to configuring routing intent:

| Route Name | Prefixes | Next Hop Resource| 
|--|--|--|
| firewall_route_ 1 | 10.0.0.0/8|Azure Firewall |
| firewall_route_2 | 192.168.0.0/16, 10.0.0.0/24 | Azure Firewall|
| firewall_route_3 | 40.0.0.0/24| Azure Firewall|
| to_internet | 0.0.0.0/0| Azure Firewall |

The following table represents the final state of the defaultRouteTable after routing intent creation succeeds. Note that firewall_route_1 and to_internet was automatically removed as the only prefix in those routes were 10.0.0.0/8 and 0.0.0.0/0. firewall_route_2 was modified to remove 192.168.0.0/16 as that prefix is an RFC1918 aggregate prefix.
 
| Route Name | Prefixes | Next Hop Resource|
|--|--|--|
| _policy_PrivateTraffic | 10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12| Azure Firewall |
| _policy_PublicTraffic| 0.0.0.0/0| Azure Firewall |
| firewall_route_2 | 10.0.0.0/24 | Azure Firewall|
| firewall_route_3 | 40.0.0.0/24| Azure Firewall|

##  <a name="prefixadvertisments"></a> Prefix advertisement to on-premises

The following section describes how Virtual WAN advertises routes to on-premises after Routing Intent has been configured on a Virtual Hub. 

### Internet routing policy
> [!NOTE]
> The 0.0.0.0/0 default route is **not** advertised across virtual hubs. 

If you enable Internet routing policies on the Virtual Hub, 0.0.0.0/0 default route is advertised to all connections to the hub (Virtual Network ExpressRoute, Site-to-site VPN, Point-to-site VPN, NVA in the hub and BGP connections) where the **Propagate default route** or **Enable internet security** flag is set to true. You may set this flag to false for all connections that shouldn't learn the default route.


### Private routing policy

When a Virtual hub is configured with a Private Routing policy Virtual WAN advertises routes to local on-premises connections in the following manner:

* Routes corresponding to prefixes learned from local hub's Virtual Networks, ExpressRoute, Site-to-site VPN, Point-to-site VPN, NVA-in-the-hub or BGP connections connected to the current hub.
* Routes corresponding to prefixes learned from remote hub Virtual Networks, ExpressRoute, Site-to-site VPN, Point-to-site VPN, NVA-in-the-hub or BGP connections where Private Routing policies are configured.
* Routes corresponding to prefixes learned from remote hub Virtual Networks, ExpressRoute, Site-to-site VPN, Point-to-site VPN, NVA-in-the-hub and  BGP connections where Routing Intent isn't configured **and** the remote connections propagate to the defaultRouteTable of the local hub.
* Prefixes learned from one ExpressRoute circuit aren't advertised to other ExpressRoute circuits unless Global Reach is enabled. If you want to enable ExpressRoute to ExpressRoute transit through a security solution deployed in the hub, open a support case. For more information, see [Enabling connectivity across ExpressRoute circuits](#expressroute).

###  <a name="expressroute"></a> Transit connectivity between ExpressRoute circuits with routing intent

Transit connectivity between ExpressRoute circuits within Virtual WAN is provided through ExpressRoute Global Reach capabilities. Traffic between Global Reach enabled ExpressRoute circuits is sent directly between the two circuits and doesn't transit the Virtual Hub.

>[!NOTE]
>However, you may raise a support case with Azure to one ExpressRoute circuit to send traffic to another ExpressRoute circuit via a security solution deployed in the hub with routing intent private routing policies. Note that this capability doesn't require Global Reach to be enabled on the circuit.

Connectivity across ExpressRoute circuits via a Firewall appliance in the hub is available in the following configurations:

* Both ExpressRoute circuits are connected to the same hub and a private routing policy is configured on that hub.
* ExpressRoute circuits are connected to different hubs and private routing policies are configured on both hubs. Therefore, both hubs must have a security solution deployed.

#### Routing considerations with ExpressRoute

> [!NOTE]
> The routing considerations below apply to all Virtual hubs in the subscription(s) that are enabled by Microsoft Support to allow ExpressRoute to ExpressRoute connectivity via a security appliance in the hub. 

After transit connectivity across ExpressRoute circuits using a firewall appliance deployed in the Virtual Hub is enabled, you can expect the following changes in behavior in how routes are advertised to ExpressRoute on-premises:
* Virtual WAN automatically advertises RFC1918 aggregate prefixes (10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12) to the ExpressRoute-connected on-premises. These aggregate routes are advertised in addition to the routes described in the previous section.
* Virtual WAN automatically advertises all static routes in the defaultRouteTable to ExpressRoute circuit-connected on-premises. This means Virtual WAN advertises the routes specified in the private traffic prefix text box to on-premises.

 Because of these route advertisement changes, this means that ExpressRoute-connected on-premises can't advertise exact address ranges for RFC1918 aggregate address ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16). Please ensure you're advertising more specific subnets (within RFC1918 ranges) as opposed to aggregate super-nets and any prefixes in the Private Traffic text box.

Additionally, if your ExpressRoute circuit is advertising a non-RFC1918 prefix to Azure, please make sure the address ranges that you put in the Private Traffic Prefixes text box are less specific than ExpressRoute advertised routes. For example, if the ExpressRoute Circuit is advertising 40.0.0.0/24 from on-premises, put a /23 CIDR range or larger in the Private Traffic Prefix text box (example: 40.0.0.0/23).


### <a name="encryptedER"></a> Encrypted ExpressRoute

To use Encrypted ExpressRoute (Site-to-site VPN tunnel running over an ExpressRoute circuit) with routing intent private routing policies, configure a firewall rule to **allow** traffic between the tunnel private IP addresses of the Virtual WAN Site-to-site VPN Gateway (source) and the on-premises VPN device (destination). For customers that are using deep-packet inspection on the Firewall device, it is recommended to exclude traffic between these private IP's from deep-packet inspection.

You can obtain the tunnel private IP addresses of the Virtual WAN Site-to-site VPN Gateway by [downloading the VPN config](virtual-wan-site-to-site-portal.md) and viewing **vpnSiteConnections -> gatewayConfiguration -> IPAddresses**. The IP addresses listed in the IPAddresses field are the private IP addresses assigned to each instance of the Site-to-site VPN Gateway that is used  to terminate VPN tunnels over ExpressRoute. In the example below, the tunnel IPs on the Gateway are 192.168.1.4 and 192.168.1.5.

```json
 "vpnSiteConnections": [
      {
        "hubConfiguration": {
          "AddressSpace": "192.168.1.0/24",
          "Region": "South Central US",
          "ConnectedSubnets": [
            "172.16.1.0/24",
            "172.16.2.0/24",
            "172.16.3.0/24",
            "192.168.50.0/24",
            "192.168.0.0/24"
          ]
        },
        "gatewayConfiguration": {
          "IpAddresses": {
            "Instance0": "192.168.1.4",
            "Instance1": "192.168.1.5"
          },
          "BgpSetting": {
            "Asn": 65515,
            "BgpPeeringAddresses": {
              "Instance0": "192.168.1.15",
              "Instance1": "192.168.1.12"
            },
            "CustomBgpPeeringAddresses": {
              "Instance0": [
                "169.254.21.1"
              ],
              "Instance1": [
                "169.254.21.2"
              ]
            },
            "PeerWeight": 0
          }
        }
```

The private IP addresses the on-premises devices uses for VPN termination are the IP addresses that are specified as part of the VPN site link connection.

:::image type="content" source="./media/routing-policies/on-premises-device.png"alt-text="Screenshot showing VPN site on-premises device tunnel IP address."lightbox="./media/routing-policies/on-premises-device.png":::

Using the sample VPN configuration and VPN site from above, create firewall rules to allow the following traffic. Note that the VPN Gateway IP's must be the source IP and the on-premises VPN device must be the destination IP in the configured rules.

| Rule Parameter| Value|
|--|--|
|Source IP|192.168.1.4 and 192.168.1.5|
|Source Port|*|
| Destination IP|10.100.0.4|
|Destination Port| * |
|Protocol| ANY|

In addition, if your firewall device supports deep-packet inspection, it is recommended to exclude traffic between 192.168.1.4, 192.168.1.5 and 10.100.0.4 from deep-packet inspection. For information on how to configure Azure Firewall to exclude traffic from deep-packet inspection, reference [IDPS bypass list documentation](../firewall/premium-features.md#idps).


## Configuring routing intent through Azure portal

Routing intent and routing policies can be configured through Azure portal using [Azure Firewall Manager](#azurefirewall) or [Virtual WAN portal](#nva). Azure Firewall Manager portal allows you to configure routing policies with next hop resource  Azure Firewall. Virtual WAN portal allows you to configure routing policies with the next hop resource  Azure Firewall, Network Virtual Appliances deployed within the Virtual hub or SaaS solutions.

Customers using Azure Firewall in Virtual WAN secured hub can either set Azure Firewall Manager's 'Enable inter-hub' setting to 'Enabled' to use routing intent or use Virtual WAN portal to directly configure Azure Firewall as the next hop resource for routing intent and policies. Configurations in either portal experience are equivalent and changes in Azure Firewall Manager are automatically reflected in Virtual WAN portal and vice versa.

### <a name="azurefirewall"></a> Configure routing intent and policies through Azure Firewall Manager

The following steps describe how to configure routing intent and routing policies on your Virtual Hub using Azure Firewall Manager. Note that Azure Firewall Manager only supports next hop resources of type Azure Firewall. 

1. Navigate to the Virtual WAN Hub that you want to configure Routing Policies on.
1. Under Security, select **Secured Virtual hub settings** and then **Manage security provider and route settings for this Secured virtual hub in Azure Firewall Manager**.
:::image type="content" source="./media/routing-policies/secured-hub-settings.png"alt-text="Screenshot showing how to modify secured hub settings."lightbox="./media/routing-policies/secured-hub-settings.png":::
1. Select the Hub you want to configure your Routing Policies on from the menu.
1. Select **Security configuration** under **Settings**
1. If you want to configure an Internet Traffic Routing Policy, select **Azure Firewall** or the relevant Internet Security provider from the dropdown for **Internet Traffic**. If not, select **None**
1. If you want to configure a Private Traffic Routing Policy (for branch and Virtual Network traffic) via Azure Firewall, select **Azure Firewall** from the dropdown for **Private Traffic**. If not, select **Bypass Azure Firewall**.

    :::image type="content" source="./media/routing-policies/configure-intents.png"alt-text="Screenshot showing how to configure routing policies."lightbox="./media/routing-policies/configure-intents.png":::

7. If you want to configure a Private Traffic Routing Policy and have branches or virtual networks advertising non-IANA RFC1918 Prefixes, select **Private Traffic Prefixes** and specify the non-IANA RFC1918 prefix ranges in the text box that comes up. Select **Done**. 

    :::image type="content" source="./media/routing-policies/private-prefixes.png"alt-text="Screenshot showing how to edit private traffic prefixes."lightbox="./media/routing-policies/private-prefixes.png":::

8. Select **Inter-hub** to be **Enabled**. Enabling this option ensures your Routing Policies are applied to the Routing Intent of this Virtual WAN Hub. 
9. Select **Save**. 
10. Repeat steps 2-8 for other Secured Virtual WAN hubs that you want to configure Routing policies for.
11. At this point, you're ready to send test traffic. Please make sure your Firewall Policies are configured appropriately to allow/deny traffic based on your desired security configurations. 

### <a name="nva"></a> Configure routing intent and policies through Virtual WAN portal

The following steps describe how to configure routing intent and routing policies on your Virtual Hub using Virtual WAN portal. 

1. From the custom portal link provided in the confirmation email from Step 3 in the **Prerequisites** section, navigate to the Virtual WAN hub that you want to configure routing policies on.
1. Under Routing, select **Routing Policies**.

    :::image type="content" source="./media/routing-policies/routing-policies-vwan-ui.png"alt-text="Screenshot showing how to navigate to routing policies."lightbox="./media/routing-policies/routing-policies-vwan-ui.png":::

3. If you want to configure a Private Traffic Routing Policy (for branch and Virtual Network Traffic), select **Azure Firewall**, **Network Virtual Appliance** or **SaaS solutions**  under **Private Traffic**. Under **Next Hop Resource**, select the relevant next hop resource.

    :::image type="content" source="./media/routing-policies/routing-policies-private-nva.png"alt-text="Screenshot showing how to configure NVA private routing policies."lightbox="./media/routing-policies/routing-policies-private-nva.png":::

4. If you want to configure a Private Traffic Routing Policy and have branches or virtual networks using non-IANA RFC1918 Prefixes, select **Additional Prefixes** and specify the non-IANA RFC1918 prefix ranges in the text box that comes up. Select **Done**. Make sure you add the same prefix to the Private Traffic prefix text box in all Virtual Hubs configured with Private Routing Policies to ensure the correct routes are advertised to all hubs.

    :::image type="content" source="./media/routing-policies/private-prefixes-nva.png"alt-text="Screenshot showing how to configure additional private prefixes for NVA  routing policies."lightbox="./media/routing-policies/private-prefixes-nva.png":::

5. If you want to configure an Internet Traffic Routing Policy, select **Azure Firewall**, **Network Virtual Appliance** or **SaaS solution**. Under **Next Hop Resource**, select the relevant next hop resource.

    :::image type="content" source="./media/routing-policies/public-routing-policy-nva.png"alt-text="Screenshot showing how to configure public routing policies for NVA."lightbox="./media/routing-policies/public-routing-policy-nva.png":::

6. To apply your routing intent and routing policies configuration, click **Save**.

    :::image type="content" source="./media/routing-policies/save-nva.png"alt-text="Screenshot showing how to save routing policies configurations."lightbox="./media/routing-policies/save-nva.png":::

7. Repeat for all hubs you would like to configure routing policies for.

8. At this point, you're ready to send test traffic. Ensure your Firewall Policies are configured appropriately to allow/deny traffic based on your desired security configurations. 

## Troubleshooting

The following section describes common ways to troubleshoot when you configure routing intent and policies on your Virtual WAN Hub.  

### Effective Routes

When private routing policies are configured on the Virtual Hub, all traffic between on-premises and Virtual Networks are inspected by Azure Firewall, Network Virtual Appliance or SaaS solution in the Virtual hub.

Therefore, the effective routes of the defaultRouteTable show the RFC1918 aggregate prefixes (10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12) with next hop Azure Firewall or Network Virtual Appliance. This reflects that all traffic between Virtual Networks and branches is routed to  Azure Firewall, NVA or SaaS solution in the hub for inspection.

  :::image type="content" source="./media/routing-policies/default-route-table-effective-routes.png"alt-text="Screenshot showing effective routes for defaultRouteTable."lightbox="./media/routing-policies/public-routing-policy-nva.png":::

After the Firewall inspects the packet (and the packet is allowed per Firewall rule configuration), Virtual WAN forwards the packet to its final destination. To see which routes Virtual WAN uses to forward inspected packets, view the effective route table of the Firewall or Network Virtual Appliance.

 :::image type="content" source="./media/routing-policies/firewall-nva-effective-routes.png"alt-text="Screenshot showing effective routes for Azure Firewall."lightbox="./media/routing-policies/public-routing-policy-nva.png":::

The Firewall effective route table helps narrow down and isolate issues in your network such as mis-configurations or issues with certain branches and Virtual networks.

### Troubleshooting configuration issues
If you're troubleshooting configuration issues consider the following:
* Make sure you don't have custom route tables or  static routes in the defaultRouteTable with next hop Virtual Network connection.
  * The option to configure routing intent is greyed out in Azure portal if your deployment doesn't meet the requirements above.
  * If you're using CLI, PowerShell or REST, the routing intent creation operation fails. Delete the failed routing intent, remove the custom route tables and static routes and then try re-creating. 
  * If you're using Azure Firewall Manager, ensure existing routes in the defaultRouteTable are named private_traffic, internet_traffic or all_traffic. Option to configure routing intent (enable inter-hub) is greyed out if routes are named differently.
* After configuring routing intent on a hub, ensure any updates to existing connections or new connections to the hub are created with the optional associated and propagated route table fields set to empty. Setting the optional associations and propagations as empty is done automatically for all operations performed through Azure portal.

### Troubleshooting data path

Assuming you have already reviewed  the [Known Limitations](#knownlimitations) section, here are some ways to troubleshoot datapath and connectivity:

* Troubleshooting with Effective Routes:
  * **If Private Routing Policies are configured**, you should see routes with next hop Firewall in the effective routes of the defaultRouteTable for RFC1918 aggregates (10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12) as well as any prefixes specified in the private traffic text box. Ensure that all Virtual Network and on-premises prefixes are subnets within the static routes in the defaultRouteTable. If an on-premises or Virtual Network is using an address space that isn't a subnet within the effective routes in the defaultRouteTable, add the prefix into the private traffic textbox.
  * **If Internet Traffic Routing Policies are configured**, you should see a default (0.0.0.0/0) route in the effective routes of the defaultRouteTable.
  * Once you have verified that the effective routes of the defaultRouteTable have the correct prefixes, **view the Effective Routes of the Network Virtual Appliance or Azure Firewall**. Effective routes on the Firewall show which routes Virtual WAN has selected and determines which destinations Firewall can forward packets to. Figuring out which prefixes are missing or in an incorrect state helps narrow down data-path issues and point to the right VPN, ExpressRoute, NVA or BGP connection to troubleshoot.
* Scenario-specific troubleshooting:
  * **If you have a non-secured hub (hub without Azure Firewall or NVA) in your Virtual WAN**, make sure connections to the nonsecured hub are propagating to the defaultRouteTable of the hubs with routing intent configured. If propagations aren't set to the defaultRouteTable, connections to the secured hub won't be able to send packets to the nonsecured hub.
  * **If you have Internet Routing Policies configured**, make sure the 'Propagate Default Route' or 'Enable Internet Security' setting is set to 'true' for all connections that should learn the 0.0.0.0/0 default route. Connections where this setting is set to 'false' won't learn the 0.0.0.0/0 route, even if Internet Routing Policies are configured.
  * **If you're using Private Endpoints deployed in Virtual Networks connected to the Virtual Hub**, traffic from on-premises destined for Private Endpoints deployed in Virtual Networks connected to the Virtual WAN hub by default **bypasses** the routing intent next hop Azure Firewall, NVA or SaaS. However, this results in asymmetric routing (which can lead to loss of connectivity between on-premises and Private Endpoints) as Private Endpoints in Spoke Virtual Networks forward on-premises traffic to the Firewall. To ensure routing symmetry, enable [Route Table network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md) on the subnets where Private Endpoints are deployed. Configuring  /32 routes corresponding to  Private Endpoint private IP addresses in the Private Traffic text box **will not** ensure traffic symmetry when private routing policies are configured on the hub.
  * **If you're using Encrypted ExpressRoute with Private Routing Policies**, ensure that your Firewall device has a rule configured to allow traffic between the Virtual WAN Site-to-site VPN Gateway private IP tunnel endpoint and on-premises VPN device. ESP  (encrypted outer) packets should log in Azure Firewall logs. For more information on Encrypted ExpressRoute with routing intent, see [Encrypted ExpressRoute documentation](#encryptedER).

### Troubleshooting Azure Firewall routing issues

* Make sure the provisioning state of the Azure Firewall is **succeeded** before trying to configure routing intent.
* If you're using non-[IANA RFC1918](https://datatracker.ietf.org/doc/html/rfc1918) prefixes in your branches/Virtual Networks, make sure you have specified those prefixes in the "Private Prefixes" text box. Note that the configured "Private Prefixes" do not propagate automatically to other hubs in the Virtual WAN that was configured with routing intent. To ensure connectivity, add these prefixes to the "Private Prefixes" textbox in every single hub that has routing intent.
* If you have specified non RFC1918 addresses as part of the **Private Traffic Prefixes** text box in Firewall Manager, you may need to configure SNAT policies on your Firewall to disable SNAT for non-RFC1918 private traffic. For more information,  reference [Azure Firewall SNAT ranges](../firewall/snat-private-range.md).
* Configure and view Azure Firewall logs to help troubleshoot and analyze your network traffic. For more information on how to set-up monitoring for Azure Firewall,  reference [Azure Firewall diagnostics](../firewall/firewall-diagnostics.md). For an  overview of the different types of Firewall logs, see [Azure Firewall logs and metrics](../firewall/logs-and-metrics.md).
* For more information on Azure Firewall, review [Azure Firewall Documentation](../firewall/overview.md).

### Troubleshooting Network Virtual Appliances

* Make sure the provisioning state of the Network Virtual Appliance is **succeeded** before trying to configure routing intent.
* If you're using non [IANA RFC1918](https://datatracker.ietf.org/doc/html/rfc1918) prefixes in your connected on-premises or Virtual Networks, make sure you have specified those prefixes in the "Private Prefixes" text box.  Note that the configured "Private Prefixes" do not propagate automatically to other hubs in the Virtual WAN that was configured with routing intent. To ensure connectivity, add these prefixes to the "Private Prefixes" textbox in every single hub that has routing intent.
* If you have specified non RFC1918 addresses as part of the **Private Traffic Prefixes** text box, you may need to configure SNAT policies on your NVA to disable SNAT for certain non-RFC1918 private traffic.
* Check NVA Firewall logs to see if traffic is being dropped or denied by your Firewall rules.
* Reach out to your NVA provider for more support and guidance on troubleshooting.

### Troubleshooting software-as-a-service

* Make sure the SaaS solution's provisioning state is **succeeded** before trying to configure routing intent.
* For more troubleshooting tips, see the troubleshooting section in [Virtual WAN documentation](how-to-palo-alto-cloud-ngfw.md) or see [Palo Alto Networks Cloud NGFW documentation](https://docs.paloaltonetworks.com/cloud-ngfw/azure/cloud-ngfw-for-azure).

## Next steps

For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
