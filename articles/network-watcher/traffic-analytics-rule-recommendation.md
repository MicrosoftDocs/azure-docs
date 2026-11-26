---
title: Get Rule Recommendations in Traffic Analytics
titleSuffix: Azure Network Watcher
description: Use Rule Recommendation in Traffic Analytics to generate and review NSG rule recommendations based on observed flow logs, helping you clean up legacy rules and improve least-privilege network access.
author: huzefafw
ms.author: srijanch
ms.service: azure-network-watcher
ms.date: 10/29/2026
ms.topic: how-to
---

# Get rule recommendations in Traffic Analytics

As your environment grows, you often accumulate security rules for new applications, temporary exceptions, migrations, troubleshooting, and legacy systems. These rules can become difficult to maintain. They might be too permissive, which increases the attack surface, or too restrictive, which causes application connectivity issues. Rule Recommendation helps you clean up legacy or unused rules, move toward least-privilege segmentation, and refine security policies without disrupting legitimate traffic.

In this article, you learn how to use the Azure portal to configure the scope of a Rule Recommendation analysis, run it across selected subscriptions and virtual networks, and review the recommended security rules. To be considered for analysis, virtual networks or subnets must have associated flow logs with Traffic Analytics enabled.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Traffic analytics enabled for your virtual network flow logs or network security group flow logs. For more information, see [Enable traffic analytics on virtual network flow logs](vnet-flow-logs-manage.md#enable-or-disable-traffic-analytics) or [Enable traffic analytics on network security group flow logs](nsg-flow-logs-manage.md#enable-or-disable-traffic-analytics).

- Advanced Analytics must be enabled on the virtual network flow logs for the target virtual networks or subnets before you can use Rule Recommendation. If advanced analytics isn't enabled, those resources aren't eligible for recommendation analysis. 

- Required role-based access control (RBAC) permissions. At a minimum, you need permissions to read the target virtual networks, network security groups (NSGs), and the Traffic Analytics workspace. To apply recommendations, you also need permissions to create and update NSGs and NSG security rules. For more information, see [Traffic analytics RBAC Permissions](rbac-permissions.md#traffic-analytics).

## Get rule recommendations in the Azure portal

Use rule recommendation in the Azure portal to generate security rules based on the traffic observed across your virtual networks.

### Configure analysis scope

1. In the search box at the top of the portal, enter **Network Watcher**, and then select **Network Watcher** from the search results.
2. Under **Monitoring**, select **Traffic Analytics**.
3. Select **Open Rule Recommendation**.
4. Select **Configure Analysis Scope**.
   1. On the **Scope definition** tab, select a **Time range**.
   2. Under **Select subnets**, choose the subnets to analyze. The portal groups subnets by the NSG attached to them.
   3. Use the filter box and filter chips, such as **Subscription**, **Region**, **Traffic analytics status**, and **NSG**, to narrow the list.
   4. Select **Next** to review data availability.
   5. Review **Data Availability**.

> [!NOTE]
   > The portal also supports subnets without an associated NSG. The portal groups these subnets separately in the subnet list. A Traffic Analytics state of disabled means either that flow logs exist but traffic analytics is disabled, or that neither flow logs nor traffic analytics is enabled.

> [!IMPORTANT]
> Only subnets with Traffic Analytics fully enabled are evaluated.  
   > The portal excludes the following special-purpose subnets from Rule Recommendation evaluation because these configurations can result in incomplete or inaccurate results:
> - `GatewaySubnet`
> - `AzureFirewallSubnet`
> - `AzureFirewallManagementSubnet`
> - `RouteServerSubnet`
> - `AzureBastionSubnet`
> - AKS-injected subnets

The **Data availability** tab summarizes whether selected subnets have enough traffic data for recommendation generation.

| Status | Description |
| --- | --- |
| Ready for analysis | Subnets that have enough Traffic Analytics data in the selected time range. |
| Limited data | Subnets where traffic data is available for fewer days than expected in the selected time range. |

### Review recommendations

When the analysis finishes, the **Rule Recommendation** page lists the recommended NSG rules. You see results grouped by the NSG and affected subnets.  
Each recommendation includes the following details:

| Column | Description |
| --- | --- |
| Rule Name | The suggested rule name. |
| Priority | The suggested NSG rule priority. |
| Rule Direction | The direction of traffic for the rule: inbound or outbound. |
| Source | The source address prefix, IP address, or service tag for the observed traffic. |
| Destination | The destination address prefix, IP address, or service tag for the observed traffic. |
| Destination Port | The destination port or ports used by the observed traffic. |
| Rule Action | The recommended action for the rule, such as allow or deny. |
| Status | The recommendation status, when available. |

If the recommended rules align with your expected traffic patterns and security requirements, use them to create a new NSG. Before you continue, review the rule names, priorities, sources, destinations, ports, and actions to ensure they accurately represent the access you want to allow or deny.

### Create an NSG from recommendations

1. On the **Rule Recommendation** page, select **Create NSG** for a recommendation group.
2. In the **Create NSG** pane, review the affected subnets and recommended rules.
3. Review the **Rule recommendations**, **Old NSG rules**, and **New NSG** tabs before you create the NSG.
4. Select **Create NSG**.
5. Select **Regenerate rules** to run the recommendation process again for the configured scope.

> [!IMPORTANT]
> Review rule recommendations before you apply them. Recommendations are based on observed traffic in the selected time range. Traffic that didn't occur during the observation period might not be represented in the generated rules.

Rule Recommendation gives you a practical starting point for tightening NSG rules based on actual traffic. By reviewing the recommendations and the underlying data availability, you can move toward least-privilege network access while reducing the risk of blocking valid application traffic.

## Related content

- [Traffic Analytics overview](traffic-analytics.md)
- [Create a security admin rule using network groups](../virtual-network-manager/how-to-create-security-admin-rule-network-group.md)
- [View configurations applied by Azure Virtual Network Manager](../virtual-network-manager/how-to-view-applied-configurations.md)

