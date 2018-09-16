---
title: Protecting your network resources in Azure Security Center  | Microsoft Docs
description: This document addresses recommendations in Azure Security Center that help you protect your Azure network resources and stay in compliance with security policies.
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: 96c55a02-afd6-478b-9c1f-039528f3dea0
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 9/12/2018
ms.author: rkarlin

---
# Protect your network resources in Azure Security Center
Azure Security Center analyzes the security state of your network resources. When Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls to harden and protect your resources.

This article addresses recommendations that apply to your network resources. Network recommendations center around next generation firewalls, Network Security Groups, virtual machines, endpoints, configuring inbound traffic rules, and more. For a list of network recommendations and remediation actions, see [Managing security recommendations in Azure Security Center](security-center-recommendations.md).

> [!NOTE]
> The **Networking** page lets you deep dive into your network resource health. This enhanced feature is available for the Azure Security Center standard tier only. [If you use the free tier, you can click the button to **View legacy networking** and receive networking resource recommendations](#legacy-networking).
>

The **Networking** page tiles provide an overview of the sections you can deep dive into, to get more information about the health of your network resources:

- Network map (Azure Security Center Standard tier only)
- NSG hardening (Coming soon. Register for the preview)
- JIT virtual machine access
- Networking security recommendations and link to that page. 
 
![Networking pane](./media/security-center-network-recommendations/networking-pane.png)

## Network map
The interactive network map provides a topology view with security overlays giving you recommendations and insights for hardening your network resources. Using the map you can see the connections between your virtual machines, subnets, and vnets, and enables you to drill down from the map into specific resources and the recommendations for those resources.

To open the Network map:

1. In Security Center, under Resource Security Hygiene, select **Networking**.
2. Under **Network map** click **See topology**.
 
By default the topology view displays:
- Subscriptions you selected in Azure. The map supports multiple subscriptions.
- VMs, subnets, and Vnets of the Resource Manager resource type (Classic Azure resources in which the NIC and IP address are bundled into a single resource are not supported)
- Only resources that have [network recommendations](security-center-recommendations.md) with a high or medium severity  
- Internet facing resources
- The map is optimized for the subscriptions you selected in Azure. If you modify your selection, the map is recalculated and re-optimized based on your new settings.  

![Networking topology map](./media/security-center-network-recommendations/network-map-info.png)

## Understanding the Network map

The Network map can show you your networking resources in a **Topology** view and based on **Traffic**.

### The topology map

In the **Topology** view of the networking map, you can view the following insights about your networking resources:
- In the inner circle, you can see all the vnets within your selected subscriptions, the next circle is all the subnets, the outer circle is all the virtual machines.
- The lines connecting the resources in the map let you know which resources are associated with each other. 
- Use the red and yellow dots to quickly get an overview of which resources have open High and Medium severity recommendations from Security Center.
- You can click any of the resources to drill down into them and view the details of that resource and its recommendations directly in the Network Map blade.  
- If there are too many resources being displayed on the map, it smart clusters them, highlighting the resources that are in the most critical state, and have the most high severity recommendations. 

To refocus the Network map:

1. You can modify what you see on the network map by using the filters at the top. You can focus the map based on:
   -  **Security health**: You can filter the map based on Severity (High, Medium, Low) of the recommendations that exist for the resources.
   - **Recommendations**: You can select which resources are displayed based on which recommendations are active on those resources. For example, you can view only resources for which Security Center recommends you enable Network Security Groups.
   - **Network zones**: By default, the map displays only Internet facing resources, you can select internal VMs as well.
 
2. You can click **Reset** in top left corner at any time to return the map to its default state.

To drill down into a resource:
1. When you select a specific resource on the map, the right pane opens and gives you general information about the resource, connected security solutions if there are any, and the recommendations relevant to the resource. It's the same type of behavior for each type of resource you select. 
2. When you hover over a node in the map, you can view general information about the resource, including subscription, resource type, and resource group.
3. Use the link to zoom into the tool tip and refocus the map on that specific node. 
4. To refocus the map away from a specific node, zoom out, or use the breadcrumbs at the top left to view the broader map.

### The Traffic map

The **Traffic** map provides you with a map of all the possible traffic within the resources. This provides you with a visual map of all the rules you configured that define which resources can communicate with whom. This enables you to see the existing configuration of the network security groups as well as possible risky configurations within the groups.

The strength of this map is in its ability to show you these allowed connections together with the vulnerabilities that exist, so you can use this cross-section of data to perform the necessary hardening on your resources. 

For example, you might detect two machines that you weren’t aware could communicate, enabling you to better isolate the workloads and subnets.

To drill down into a resource:
1. When you select a specific resource on the map, the right pane opens and gives you general information about the resource, connected security solutions if there are any, and the recommendations relevant to the resource. It's the same type of behavior for each type of resource you select. 
2. Click **Traffic** to see the list of outbound and inbound traffic on the resource - this is a comprehensive list of who can communicate with the resource and who it can communicate with.
3. In the map, select a specific node to see who the resource can communicate with and whether it's TCP or UDP traffic across port ranges. This data is based on analysis of the Network Security Groups as well as advanced machine learning algorithms that analyze multiple rules to understand their crossovers and interactions.  

![Networking traffic map](./media/security-center-network-recommendations/network-map-traffic.png)

## JIT virtual machine access

Just in time virtual machine (VM) access can be used to lock down inbound traffic to your Azure VMs, reducing exposure to attacks while providing easy access to connect to VMs when needed.

For more information, see [Manage virtual machine access using just in time](security-center-just-in-time.md)

## Legacy networking <a name ="legacy-networking"></a>

If you don't have Security Center Standard tier, this section explains how to view free Networking recommendations.

To access this information, in the Networking blade, click **View legacy networking**. 
When you click a recommendation, you see more details about the recommendation, as shown in the following example:

![Details for a recommendation in the Networking](./media/security-center-monitoring/security-center-monitoring-fig9-ga.png)

In this example, the **Configure Missing Network Security Groups for Subnets** has a list of subnets and virtual machines that are missing network security group protection. If you click the subnet to which you want to apply the network security group, you see the **Choose network security group**. Here you can select the most appropriate network security group for the subnet, or you can create a new network security group.

### Internet facing endpoints section
In the **Internet facing endpoints** section, you can see the virtual machines that are currently configured with an Internet facing endpoint and its current status.

![Virtual machines configured with Internet facing endpoint and status](./media/security-center-monitoring/security-center-monitoring-fig10-ga.png)

This table has the endpoint name that represents the virtual machine, the Internet facing IP address, and the current severity status of the network security group and the NGFW. The table is sorted by severity:

* Red (on top): High priority and should be addressed immediately
* Orange: Medium priority and should be addressed as soon as possible
* Green (last one): Healthy state

### Networking topology section
The **Networking topology** section has a hierarchical view of the resources.

![Hierarchical view of resources in Networking topology section](./media/security-center-monitoring/security-center-monitoring-fig121-new4.png)

This table is sorted (virtual machines and subnets) by severity:

* Red (on top): High priority and should be addressed immediately
* Orange: Medium priority and should be addressed as soon as possible
* Green (last one): Healthy state

In this topology view, the first level has [virtual networks](../virtual-network/virtual-networks-overview.md), [virtual network gateways](../vpn-gateway/vpn-gateway-howto-site-to-site-classic-portal.md), and [virtual networks (classic)](../virtual-network/virtual-networks-create-vnet-classic-pportal.md). The second level has subnets, and the third level has the virtual machines that belong to those subnets. The right column has the current status of the network security group for those resources, as shown in the following example:

![Status of the network security group in Networking topology section](./media/security-center-monitoring/security-center-monitoring-fig12-ga.png)

The bottom part of this blade has the recommendations for this virtual machine, which is similar to what is described previously. You can click a recommendation to learn more or apply the needed security control or configuration.

## See also
To learn more about recommendations that apply to other Azure resource types, see the following:

* [Protecting your virtual machines in Azure Security Center](security-center-virtual-machine-recommendations.md)
* [Protecting your applications in Azure Security Center](security-center-application-recommendations.md)
* [Protecting your Azure SQL service in Azure Security Center](security-center-sql-service-recommendations.md)

To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
* [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
