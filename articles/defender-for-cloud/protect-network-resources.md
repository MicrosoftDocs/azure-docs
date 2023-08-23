---
title: Protecting your network resources
description: This document addresses recommendations in Microsoft Defender for Cloud that help you protect your Azure network resources and stay in compliance with security policies.
ms.topic: conceptual
ms.date: 10/23/2022
---
# Protect your network resources

Microsoft Defender for Cloud continuously analyzes the security state of your Azure resources for network security best practices. When Defender for Cloud identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls to harden and protect your resources.

For a full list of the recommendations for Networking, see [Networking recommendations](recommendations-reference.md#recs-networking).

This article addresses recommendations that apply to your Azure resources from a network security perspective. Networking recommendations center around next generation firewalls, Network Security Groups, JIT VM access, overly permissive inbound traffic rules, and more. For a list of networking recommendations and remediation actions, see [Managing security recommendations in Microsoft Defender for Cloud](review-security-recommendations.md).

The **Networking** features of Defender for Cloud include: 

- Network map (requires [Microsoft Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features))
- [Adaptive network hardening](adaptive-network-hardening.md) (requires [Microsoft Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features))
- Networking security recommendations
 
## View your networking resources and their recommendations

From the [asset inventory page](asset-inventory.md), use the resource type filter to select the networking resources that you want to investigate:

:::image type="content" source="./media/protect-network-resources/network-filters-inventory.png" alt-text="Asset inventory network resource types." lightbox="./media/protect-network-resources/network-filters-inventory.png":::


## Network map

The interactive network map provides a graphical view with security overlays giving you recommendations and insights for hardening your network resources. Using the map you can see the network topology of your Azure workloads, connections between your virtual machines and subnets, and the capability to drill down from the map into specific resources and the recommendations for those resources.

To open the Network map:

1. From Defender for Cloud's menu, open the **Workload protections** dashboard.

1. Select **Network map**.

:::image type="content" source="media/protect-network-resources/workload-protection-network-map.png" alt-text="Screenshot showing selection of network map from workload protections." lightbox="media/protect-network-resources/workload-protection-network-map.png":::

1. Select the **Layers** menu choose **Topology**.
 
The default view of the topology map displays:

- Currently selected subscriptions - The map is optimized for the subscriptions you selected in the portal. If you modify your selection, the map is regenerated with the new selections.
- VMs, subnets, and VNets of the Resource Manager resource type ("classic" Azure resources are not supported)
- Peered VNets
- Only resources that have [network recommendations](review-security-recommendations.md) with a high or medium severity
- Internet-facing resources

:::image type="content" source="./media/protect-network-resources/network-map-info.png" alt-text="Screenshot of the Defender for Cloud networking topology map." lightbox="./media/protect-network-resources/network-map-info.png":::

## Understanding the network map

The network map can show you your Azure resources in a **Topology** view and a **Traffic** view. 

### The topology view

In the **Topology** view of the networking map, you can view the following insights about your networking resources:

- In the inner circle, you can see all the VNets within your selected subscriptions, the next circle is all the subnets, the outer circle is all the virtual machines.
- The lines connecting the resources in the map let you know which resources are associated with each other, and how your Azure network is structured. 
- Use the severity indicators to quickly get an overview of which resources have open recommendations from Defender for Cloud.
- You can click any of the resources to drill down into them and view the details of that resource and its recommendations directly, and in the context of the Network map.  
- If there are too many resources being displayed on the map, Microsoft Defender for Cloud uses its proprietary algorithm to 'smart cluster' your resources, highlighting the ones that are in the most critical state, and have the most high severity recommendations.

Because the map is interactive and dynamic, every node is clickable, and the view can change based on the filters:

1. You can modify what you see on the network map by using the filters at the top. You can focus the map based on:

   -  **Security health**: You can filter the map based on Severity (High, Medium, Low) of your Azure resources.
   - **Recommendations**: You can select which resources are displayed based on which recommendations are active on those resources. For example, you can view only resources for which Defender for Cloud recommends you enable Network Security Groups.
   - **Network zones**: By default, the map displays only Internet facing resources, you can select internal VMs as well.
 
2. You can click **Reset** in top left corner at any time to return the map to its default state.

To drill down into a resource:

1. When you select a specific resource on the map, the right pane opens and gives you general information about the resource, connected security solutions if there are any, and the recommendations relevant to the resource. It's the same type of behavior for each type of resource you select. 
2. When you hover over a node in the map, you can view general information about the resource, including subscription, resource type, and resource group.
3. Use the link to zoom into the tool tip and refocus the map on that specific node. 
4. To refocus the map away from a specific node, zoom out.

### The Traffic view

The **Traffic** view provides you with a map of all the possible traffic between your resources. This provides you with a visual map of all the rules you configured that define which resources can communicate with whom. This enables you to see the existing configuration of the network security groups as well as quickly identify possible risky configurations within your workloads.

### Uncover unwanted connections

The strength of this view is in its ability to show you these allowed connections together with the vulnerabilities that exist, so you can use this cross-section of data to perform the necessary hardening on your resources. 

For example, you might detect two machines that you weren’t aware could communicate, enabling you to better isolate the workloads and subnets.

### Investigate resources

To drill down into a resource:

1. When you select a specific resource on the map, the right pane opens and gives you general information about the resource, connected security solutions if there are any, and the recommendations relevant to the resource. It's the same type of behavior for each type of resource you select. 
2. Click **Traffic** to see the list of possible outbound and inbound traffic on the resource - this is a comprehensive list of who can communicate with the resource and who it can communicate with, and through which protocols and ports. For example, when you select a VM, all the VMs it can communicate with are shown, and when you select a subnet, all the subnets which it can communicate with are shown.

**This data is based on analysis of the Network Security Groups as well as advanced machine learning algorithms that analyze multiple rules to understand their crossovers and interactions.** 

[![Networking traffic map.](./media/protect-network-resources/network-map-traffic.png)](./media/protect-network-resources/network-map-traffic.png#lightbox)


## Next steps

To learn more about recommendations that apply to other Azure resource types, see the following:

- [Protecting your machines and applications in Microsoft Defender for Cloud](./asset-inventory.md)
