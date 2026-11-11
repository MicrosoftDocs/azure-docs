---
title: Configure dual-stack route maps in Azure Route Server
description: Learn how to use the Azure portal to filter and summarize IPv4 and IPv6 routes and modify BGP attributes with Azure Route Server route maps.
author: fabferri
ms.author: fabferri
ms.service: azure-route-server
ms.topic: how-to
ms.date: 11/06/2026
ms.custom: references_regions
ai-usage: ai-assisted
#CustomerIntent: As an Azure network administrator, I want to configure dual-stack route maps in the Azure portal so that I can control IPv4 and IPv6 route advertisements to gateways and an NVA.
---

# Configure dual-stack route maps in Azure Route Server by using the Azure portal

In this article, you use the Azure portal to configure route maps on an existing dual-stack Azure Route Server. You filter an IPv6 prefix, summarize IPv4 and IPv6 prefixes, replace an autonomous system (AS) path, and add a BGP community. You apply the route maps in the outbound direction to an ExpressRoute connection, two VPN connections, and a BGP peering with a network virtual appliance (NVA).

> [!IMPORTANT]
> Azure Route Server IPv4/IPv6 dual-stack mode is in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features in preview.

Route maps control route advertisements, not data packets. The verification steps in this article show the resulting advertisements; they don't verify end-to-end packet delivery. For route-map concepts and limitations, see [About route maps for Azure Route Server](route-maps-about.md).

## Regional availability

Azure Route Server IPv4/IPv6 dual-stack mode is available in preview only in the following Azure regions:

| Region | Programmatic name |
| --- | --- |
| East US 2 EUAP | `eastus2euap` |
| Central US EUAP | `centraluseuap` |
| West Central US | `westcentralus` |
| East Asia | `eastasia` |
| UK South | `uksouth` |
| Central US | `centralus` |
| Australia Central | `australiacentral` |
| Korea Central | `koreacentral` |
| Central India | `centralindia` |
| Brazil South | `brazilsouth` |
| Malaysia West | `malaysiawest` |

## Prerequisites

- An Azure account with an active subscription where Route Server dual-stack preview access is enabled. Use a region listed in [Regional availability](#regional-availability).
- Permissions to configure Route Server and route maps. For more information, see [Roles and permissions](roles-permissions.md).
- An existing dual-stack virtual network with the following resources:
  - Azure Route Server with dual-stack mode enabled.
  - An ExpressRoute gateway and a VPN gateway in the same virtual network as Route Server.
  - An ExpressRoute connection and two site-to-site VPN connections that exchange the example routes.
  - An NVA in the hub virtual network with established BGP peering to Route Server and the example route advertisements configured.
- [Route exchange with virtual network gateways](configure-route-server.md?tabs=portal#configure-route-exchange-with-virtual-network-gateways) enabled on Route Server.
- Familiarity with BGP peers, autonomous system numbers (ASNs), route advertisements, and BGP communities.

To prepare Route Server, see [Enable IPv4/IPv6 dual-stack mode](enable-route-server-dual-stack.md). For an example deployment and NVA peering, see [Configure dual-stack Azure Route Server with PowerShell](tutorial-configure-route-server-nva-dual-stack-powershell.md). That tutorial doesn't deploy the ExpressRoute or VPN gateways required for this example.

Review the [route-map considerations and limitations](route-maps-about.md#considerations-and-limitations), including charges and the restriction on point-to-site VPN configurations. Record existing route-map associations and expected routes before you make changes. Use an isolated test environment to evaluate these example policies before applying them to production connections.

## Understand the example

The following diagram shows the dual-stack hub virtual network, gateways, and NVA. The dashed green lines represent BGP sessions. The solid green arrow shows the routes that the NVA advertises to Route Server.

:::image type="complex" source="./media/route-maps-dual-stack-portal/network-diagram.png" alt-text="Diagram of a dual-stack hub with outbound route maps for ExpressRoute, VPN, and an NVA." lightbox="./media/route-maps-dual-stack-portal/network-diagram.png":::
   The hub contains Route Server `rs1`, an NVA named `hub100-nva`, an ExpressRoute gateway, and a VPN gateway. The NVA advertises two IPv4 and two IPv6 prefixes to Route Server. An outbound ExpressRoute route map drops `fd00:0:91::/48`. An outbound VPN route map summarizes the NVA prefixes as `10.90.0.0/15` and `fd00:0:90::/47`. An outbound NVA route map replaces AS path `65020` with `9001` and adds community `100:100` to `fd00:0:200::/48`. The following tables provide the resource names, address spaces, and route advertisements.
:::image-end:::

### Resources and address spaces

| Resource | Example name | Address space |
| --- | --- | --- |
| Hub virtual network | `hub100` | `10.100.0.0/16`, `fd00:0:100::/48` |
| Route Server | `rs1` | Uses **RouteServerSubnet** |
| Route Server subnet | `RouteServerSubnet` | `10.100.1.0/26`, `fd00:0:100:1::/64` |
| Gateway subnet | `GatewaySubnet` | `10.100.0.192/26`, `fd00:0:100:e::/64` |
| NVA subnet | `nvasubnet` | `10.100.0.128/28`, `fd00:0:100:128::/64` |
| NVA BGP peering | `hub100-nva` | NVA ASN `9000` |
| ExpressRoute connection | `er-conn100` | Routes from the ExpressRoute remote site |
| VPN connections | `vpn-gw-to-site20-1`, `vpn-gw-to-site20-2` | Routes from site20, ASN `65020` |

Replace these example names and prefixes with the values for your environment.

### Route advertisements before applying route maps

| Source | IPv4 prefixes | IPv6 prefixes | Example AS path |
| --- | --- | --- | --- |
| NVA | `10.90.0.0/24`, `10.91.0.0/24` | `fd00:0:90::/48`, `fd00:0:91::/48` | `9000` |
| ExpressRoute remote site | `10.200.0.0/24`, `10.201.0.0/24` | `fd00:0:200::/48`, `fd00:0:201::/48` | `12076-12076` in the supplied example |
| VPN remote site, site20 | `10.20.0.0/24` | `fd00:0:20::/48` | `65020` |

Confirm these routes are available before you apply the example policies. If your baseline differs, the verification results also differ.

### Route-map policies

| Route map | Outbound connection | Intended change |
| --- | --- | --- |
| `rmap-er` | `er-conn100` | Drop the NVA prefix `fd00:0:91::/48`. |
| `rmap-vpn` | Both VPN connections | Summarize the NVA's IPv4 and IPv6 prefixes. |
| `rmap-hub100-nva` | `rs1/hub100-nva` | Replace AS path `65020` with `9001`, and add community `100:100` to `fd00:0:200::/48`. |

Each connection supports one route map per direction. The example changes only outbound associations. Preserve the existing inbound association when you save each connection. If an outbound route map already exists, review its rules before replacing it.

## Configure the ExpressRoute route map

Create a route map that filters one IPv6 prefix from the routes advertised toward ExpressRoute.

1. In the [Azure portal](https://portal.azure.com), open your Azure Route Server resource.
1. Under **Routing**, select **Route Maps**, and then select **Add Route-map**.
1. Enter `rmap-er` for the route-map name, and then select **Add rule**.
1. Configure the rule with the following settings:

   | Setting | Value |
   | --- | --- |
   | Name | `discard-ipv6` |
   | Next step | **Continue** |
   | Match conditions: Property | **Route prefix** |
   | Match conditions: Criterion | **Equals** |
   | Match conditions: Value | `fd00:0:91::/48` |
   | Action on matched routes | **Drop** |

   :::image type="content" source="./media/route-maps-dual-stack-portal/create-expressroute-rule.png" alt-text="Screenshot of the discard-ipv6 rule matching fd00:0:91::/48 with the Drop action." lightbox="./media/route-maps-dual-stack-portal/create-expressroute-rule.png":::

1. Select **Add** to add the rule, and then select **Save** to save the route map.
1. Wait until **Provisioning state** shows **Succeeded**. Select **Refresh** if needed.

   The first route-map creation can trigger a Route Server upgrade. Wait for provisioning to complete before applying the map.

   :::image type="content" source="./media/route-maps-dual-stack-portal/expressroute-map-created.png" alt-text="Screenshot of rmap-er with provisioning succeeded and no connection associations." lightbox="./media/route-maps-dual-stack-portal/expressroute-map-created.png":::

### Apply the route map to ExpressRoute

1. On **Route Maps**, select **Apply Route-maps to connections**.
1. For **Outbound Route-map**, select **rmap-er**. Preserve the existing **Inbound Route-map** selection. If no inbound policy is configured, leave it set to **None**.
1. Select **er-conn100**. The **Connection type** column identifies ExpressRoute connections as **Exr**.

   :::image type="content" source="./media/route-maps-dual-stack-portal/apply-expressroute-map.png" alt-text="Screenshot of rmap-er selected as the outbound route map for er-conn100." lightbox="./media/route-maps-dual-stack-portal/apply-expressroute-map.png":::

1. Select **Save**. After the operation completes, select **Refresh** and confirm that `rmap-er` has one outbound connection.

   :::image type="content" source="./media/route-maps-dual-stack-portal/expressroute-map-applied.png" alt-text="Screenshot of rmap-er with provisioning succeeded and one outbound connection." lightbox="./media/route-maps-dual-stack-portal/expressroute-map-applied.png":::

## Configure the VPN route map

Create a route map with two rules: one for IPv6 summarization and one for IPv4 summarization.

> [!IMPORTANT]
> A summary prefix can cover more address space than the original routes. In this example, `10.90.0.0/15` covers more than the two advertised /24 prefixes, and `fd00:0:90::/47` covers both advertised /48 prefixes. Confirm that advertising these summaries is appropriate for your network. Summarization doesn't create connectivity to every address in a summary.
>
> Route summarization strips the original AS path and BGP community attributes. Don't expect the summaries to retain the NVA's ASN or original communities.

1. On **Route Maps**, select **Add Route-map**, enter `rmap-vpn`, and then select **Add rule**.
1. Configure the IPv6 rule:

   | Setting | Value |
   | --- | --- |
   | Name | `summ-ipv6` |
   | Next step | **Continue** |
   | Match conditions: Property | **Route prefix** |
   | Match conditions: Criterion | **Equals** |
   | Match conditions: Value | `fd00:0:90::/48,fd00:0:91::/48` |
   | Action on matched routes | **Modify** |
   | Route modifications: Property | **Route prefix** |
   | Route modifications: Action | **Replace** |
   | Route modifications: Value | `fd00:0:90::/47` |

   :::image type="content" source="./media/route-maps-dual-stack-portal/create-vpn-version-6-summary-rule.png" alt-text="Screenshot of the summ-ipv6 rule replacing two IPv6 prefixes with fd00:0:90::/47." lightbox="./media/route-maps-dual-stack-portal/create-vpn-version-6-summary-rule.png":::

1. Select **Add**, and then select **Add rule** to configure the IPv4 rule:

   | Setting | Value |
   | --- | --- |
   | Name | `summ-ipv4` |
   | Next step | **Continue** |
   | Match conditions: Property | **Route prefix** |
   | Match conditions: Criterion | **Equals** |
   | Match conditions: Value | `10.90.0.0/24,10.91.0.0/24` |
   | Action on matched routes | **Modify** |
   | Route modifications: Property | **Route prefix** |
   | Route modifications: Action | **Replace** |
   | Route modifications: Value | `10.90.0.0/15` |

   :::image type="content" source="./media/route-maps-dual-stack-portal/create-vpn-version-4-summary-rule.png" alt-text="Screenshot of the summ-ipv4 rule replacing two IPv4 prefixes with 10.90.0.0/15." lightbox="./media/route-maps-dual-stack-portal/create-vpn-version-4-summary-rule.png":::

1. Select **Add**. Confirm that `summ-ipv6` is the first rule and `summ-ipv4` is the second rule.
1. Select **Save**, and then wait until **Provisioning state** shows **Succeeded**.

### Apply the route map to both VPN connections

1. Select **Apply Route-maps to connections**.
1. For **Outbound Route-map**, select **rmap-vpn**. Preserve the existing inbound policy.
1. Select **vpn-gw-to-site20-1** and **vpn-gw-to-site20-2**. Their **Connection type** is **VPN**.

   :::image type="content" source="./media/route-maps-dual-stack-portal/apply-vpn-map.png" alt-text="Screenshot of both site20 VPN connections selected for the outbound rmap-vpn route map." lightbox="./media/route-maps-dual-stack-portal/apply-vpn-map.png":::

1. Select **Save**. After saving finishes, select **Refresh** and confirm that both VPN connections use `rmap-vpn` in the outbound direction.

## Configure the NVA route map

Create a route map with two rules. The first rule replaces the AS path for routes learned from site20. The second rule adds a community to an IPv6 prefix learned through ExpressRoute.

1. On **Route Maps**, select **Add Route-map**, enter `rmap-hub100-nva`, and then select **Add rule**.
1. Configure the AS-path rule:

   | Setting | Value |
   | --- | --- |
   | Name | `as-replace` |
   | Next step | **Continue** |
   | Match conditions: Property | **AS Path** |
   | Match conditions: Criterion | **Equals** |
   | Match conditions: Value | `65020` |
   | Action on matched routes | **Modify** |
   | Route modifications: Property | **AS Path** |
   | Route modifications: Action | **Replace** |
   | Route modifications: Value | `9001` |

   :::image type="content" source="./media/route-maps-dual-stack-portal/create-virtual-appliance-path-rule.png" alt-text="Screenshot of the as-replace rule matching AS path 65020 and replacing it with 9001." lightbox="./media/route-maps-dual-stack-portal/create-virtual-appliance-path-rule.png":::

   This rule matches routes whose complete AS path is `65020` and sets that path to `9001`. Routes with a longer AS path don't match this rule.

1. Select **Add**, and then select **Add rule** to configure the community rule:

   | Setting | Value |
   | --- | --- |
   | Name | `set-bgp-community` |
   | Next step | **Continue** |
   | Match conditions: Property | **Route prefix** |
   | Match conditions: Criterion | **Equals** |
   | Match conditions: Value | `fd00:0:200::/48` |
   | Action on matched routes | **Modify** |
   | Route modifications: Property | **Community** |
   | Route modifications: Action | **Add** |
   | Route modifications: Value | `100:100` |

   :::image type="content" source="./media/route-maps-dual-stack-portal/create-virtual-appliance-community-rule.png" alt-text="Screenshot of the set-bgp-community rule adding community 100:100 to fd00:0:200::/48." lightbox="./media/route-maps-dual-stack-portal/create-virtual-appliance-community-rule.png":::

1. Select **Add**, and then select **Save**. Wait until **Provisioning state** shows **Succeeded**.

### Apply the route map to the NVA peering

The NVA is in the same virtual network as Route Server, so apply the route map to the existing BGP peering. You don't need to create a virtual network connection.

1. Select **Apply Route-maps to connections**.
1. For **Outbound Route-map**, select **rmap-hub100-nva**. Preserve the existing inbound policy.
1. Select **rs1/hub100-nva**. Its **Connection type** is **Hub BGP Peering**.

   :::image type="content" source="./media/route-maps-dual-stack-portal/apply-virtual-appliance-map.png" alt-text="Screenshot of the hub100-nva BGP peering selected for the outbound rmap-hub100-nva route map." lightbox="./media/route-maps-dual-stack-portal/apply-virtual-appliance-map.png":::

1. Select **Save**. After the operation completes, refresh the page and confirm the outbound association.

## Verify the route advertisements

Under **Routing**, open **Connections Dashboard**. For each connection, select **In the outbound direction** under **View routes for Route-maps applied**. Display both IP versions, and compare the results with the baseline routes.

### ExpressRoute connection

Select **ExpressRoute** for the connection type and **er-conn100** for the connection.

| Route | Expected result |
| --- | --- |
| `fd00:0:91::/48` | Absent because `rmap-er` drops it. |
| `fd00:0:90::/48` | Present with the NVA AS path `9000`. |
| `10.90.0.0/24`, `10.91.0.0/24` | Present and unchanged by the route map. |
| `10.20.0.0/24`, `fd00:0:20::/48` | Site20 routes remain unchanged by the route map. |

:::image type="content" source="./media/route-maps-dual-stack-portal/verify-expressroute-routes.png" alt-text="Screenshot of outbound ExpressRoute routes with fd00:0:90::/48 present and fd00:0:91::/48 filtered out." lightbox="./media/route-maps-dual-stack-portal/verify-expressroute-routes.png":::

### VPN connections

Select **VPN** for the connection type. Select **vpn-gw-to-site20-1**, and then repeat the checks for **vpn-gw-to-site20-2**.

| Route | Expected result |
| --- | --- |
| `10.90.0.0/15` | Present instead of the two NVA /24 prefixes. |
| `fd00:0:90::/47` | Present instead of the two NVA /48 prefixes. |
| Original NVA AS path | Not retained on either summary. |
| ExpressRoute remote-site prefixes | Unchanged by these summarization rules. |

The following example shows the first VPN connection. Other routes, such as the hub virtual network prefixes, can also appear.

:::image type="content" source="./media/route-maps-dual-stack-portal/verify-vpn-routes.png" alt-text="Screenshot of outbound VPN routes with the IPv4 summary 10.90.0.0/15 and IPv6 summary fd00:0:90::/47." lightbox="./media/route-maps-dual-stack-portal/verify-vpn-routes.png":::

### NVA BGP peering

Select the hub BGP peering connection type, shown as **Hub Bgp Peers** in the dashboard, and then select **hub100-nva**.

| Route | Expected result |
| --- | --- |
| `10.20.0.0/24`, `fd00:0:20::/48` | AS path is `9001` instead of `65020`. |
| `fd00:0:200::/48` | Community list includes `100:100`. Its ExpressRoute AS path is unchanged by the AS-path rule. |
| Other ExpressRoute remote-site prefixes | Unchanged by these rules. |

:::image type="content" source="./media/route-maps-dual-stack-portal/verify-virtual-appliance-routes.png" alt-text="Screenshot of outbound NVA routes with AS path 9001 for site20 and community 100:100 on fd00:0:200::/48." lightbox="./media/route-maps-dual-stack-portal/verify-virtual-appliance-routes.png":::

If a result differs, check the selected connection and direction, provisioning state, rule order, and baseline route advertisements. For more information, see [Troubleshoot route maps](route-maps-how-to.md#route-map-changes-arent-taking-effect). Check routes at the receiving peer when you need to verify propagation beyond Route Server.

## Restore the previous route-map associations

If you applied these policies only for testing, restore the outbound route-map association you recorded for each connection. On **Apply Route-maps to connections**, select the previous outbound route map, or **None** if there was no previous association. Preserve the inbound policy, select the intended connection, and save. Repeat for connections with different previous policies.

Verify the resulting advertisements after restoring the associations. Don't delete the existing gateways, NVA, or Route Server to remove an example policy.

## Related content

- [Enable IPv4/IPv6 dual-stack mode on Azure Route Server](enable-route-server-dual-stack.md)
- [Configure dual-stack Azure Route Server with PowerShell](tutorial-configure-route-server-nva-dual-stack-powershell.md)
- [About route maps for Azure Route Server](route-maps-about.md)
- [Configure route maps for Azure Route Server](route-maps-how-to.md)
- [View effective routes](view-route-server-effective-routes.md)
