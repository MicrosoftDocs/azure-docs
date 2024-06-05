---
title: View topology
description: Learn how to use Network Insights topology to get a visual representation of Azure resources with connectivity and traffic insights for monitoring. 
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 04/30/2024
ms.custom: subject-monitoring

#CustomerIntent: As an Azure administrator, I want to see my resources across multiple resource groups, regions, and subscriptions so that I can easily manage resource inventory and have connectivity and traffic insights.
---

# View topology

Topology provides an interactive interface to view resources and their relationships in Azure across multiple subscriptions, regions, and resource groups. It helps you manage and monitor your cloud network infrastructure with interactive graphical interface that provides you with insights from Azure Network Watcher [connection monitor](connection-monitor-overview.md) and [traffic analytics](traffic-analytics.md). Topology helps you diagnose and troubleshoot network issues by providing contextual access to Network Watcher diagnostic tools such as [connection troubleshoot](connection-troubleshoot-overview.md), [packet capture](packet-capture-overview.md), and [next hop](next-hop-overview.md).

In this article, you learn how to use topology to visualize virtual networks and connected resources.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The necessary [role-based access control (RBAC) permissions](required-rbac-permissions.md) to use Azure Network Watcher capabilities.

## Supported resource types

Topology supports the following resource types:

- Application Gateways
- Azure Bastion hosts
- Azure DDoS Protection plans
- Azure DNS zones
- Azure Firewalls
- Azure Front Door profiles
- Azure NAT Gateways
- Connections
- DNS Private Resolvers
- ExpressRoute circuits
- Load balancers
- Local network gateways
- Network interfaces
- Network security groups
- Private DNS zones
- Private endpoints
- Private Link services
- Public IP addresses
- Service endpoints
- Traffic Manager profiles
- Virtual hubs
- Virtual machine scale sets
- Virtual machines
- Virtual network gateways (VPN and ExpressRoute)
- Virtual networks
- Virtual WANs
- Web Application Firewall policies

## Get started with topology

In this section, you learn how to view a region's topology and insights.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter ***network watcher***. Select **Network Watcher** from the search results.

   :::image type="content" source="./media/network-insights-topology/portal-search.png" alt-text="Screenshot shows how to search for Network Watcher in the Azure portal." lightbox="./media/network-insights-topology/portal-search.png":::
    
1. Under **Monitoring**, select **Topology**. 

    > [!NOTE]
    > You can also get to the topology from:
     > - **Monitor**: **Insights > Networks > Topology**.
    > - **Virtual networks**: **Monitoring > Diagram**.

1. Select **Scope** to define the scope of the topology. 

1. In the **Select scope** pane, select the list of **Subscriptions**, **Resource groups**, and **Locations** of the resources for which you want to view the topology, then select **Save**.

   :::image type="content" source="./media/network-insights-topology/select-topology-scope.png" alt-text="Screenshot shows how to select the scope of the topology." lightbox="./media/network-insights-topology/select-topology-scope.png":::

1. Select **Resource type** to choose the resource types that you want to include in the topology and select **Apply**. See [supported resource types](#supported-resource-types).

1. Use the mouse wheel to zoom in or out, or select the plus or minus sign. You can also use the mouse to drag the topology to move it around or use the arrows on the screen.

   :::image type="content" source="./media/network-insights-topology/zoom.png" alt-text="Screenshot of topology zoomed in view." lightbox="./media/network-insights-topology/zoom.png":::

1. Select **Download topology** if you want to download the topology view to your computer. A file with the .svg extension is downloaded.

   :::image type="content" source="./media/network-insights-topology/download-topology.png" alt-text="Screenshot shows how to download the topology." lightbox="./media/network-insights-topology/download-topology.png":::

1. Select a region to see its information and insights. The **Insights** tab provides a snapshot of connectivity and traffic insights for the selected region.

   :::image type="content" source="./media/network-insights-topology/region-insights.png" alt-text="Screenshot of the Insights tab of topology." lightbox="./media/network-insights-topology/region-insights.png":::

    > [!NOTE]
    > - Connectivity insights are available when connection monitor is enabled. For more information, see [connection monitor](connection-monitor-overview.md). 
    > - Traffic insights are available when Flow logs and traffic analytics are enabled. For more information, see [NSG flow logs](nsg-flow-logs-overview.md), [VNet flow logs](vnet-flow-logs-overview.md) and [traffic analytics](traffic-analytics.md).

1. Select the **Traffic** tab to see detailed traffic information about the selected region. The insights presented in this tab are fetched from Network Watcher flow logs and traffic analytics. You see **Set up Traffic Analytics** with no insights if traffic analytics isn't enabled.

   :::image type="content" source="./media/network-insights-topology/region-traffic.png" alt-text="Screenshot of the Traffic tab of topology." lightbox="./media/network-insights-topology/region-traffic.png":::

1. Select the **Connectivity** tab to see detailed connectivity information about the selected region. The insights presented in this tab are fetched from Network Watcher connection monitor. You see **Set up Connection Monitor** with no insights if connection monitor isn't enabled.

   :::image type="content" source="./media/network-insights-topology/region-connectivity.png" alt-text="Screenshot of the Connectivity tab of topology." lightbox="./media/network-insights-topology/region-connectivity.png":::

## Drilldown resources

In this section, you learn how to navigate the topology view from regions to the individual Azure resource such as a virtual machine (VM). Once you drill down to the VM, you can see its traffic and connectivity insights. From the VM view, you have access to Network Watcher diagnostic tools such as connection troubleshoot, packet capture and next hop to help in troubleshooting any issues you have with the VM.

1. Select **Scope** to choose the subscriptions and regions of the resources that you want to navigate to. The following example shows one subscription and region selected.

   :::image type="content" source="./media/network-insights-topology/scope.png" alt-text="Screenshot of the topology scope selected." lightbox="./media/network-insights-topology/scope.png":::

1. Select the plus sign of the region that has the resource that you want to see to navigate to the region view.

   :::image type="content" source="./media/network-insights-topology/region-view.png" alt-text="Screenshot of the region view." lightbox="./media/network-insights-topology/region-view.png":::

    In the region view, you see virtual networks and other Azure resources in the region. You see any virtual network peerings in the region so you can understand the traffic flow from and to resources within the region. You can navigate to the virtual network view to see its subnets.

1. Select the plus sign of the virtual network that has the resource that you want to see to navigate to the virtual network view. If the region has multiple virtual networks, you might see **Virtual Networks**. Select the plus sign of **Virtual Networks** to drill down to the virtual networks in your region and then select the plus sign of the virtual network that has the resource that you want to see.   

   :::image type="content" source="./media/network-insights-topology/virtual-network-view.png" alt-text="Screenshot of the virtual network view." lightbox="./media/network-insights-topology/virtual-network-view.png":::

    In the virtual network view of **myVNet**, you see all five subnets that **myVNet** has.

1. Select the plus sign of a subnet to see all the resources that exist in it and their relationships.

   :::image type="content" source="./media/network-insights-topology/subnet-view.png" alt-text="Screenshot of the subnet view." lightbox="./media/network-insights-topology/subnet-view.png":::

    In the subnet view of **mySubnet**, you see Azure resources that exist in it and their relationships. For example, you see **myVM** and its network interface **myvm36** and IP configuration **ipconfig1**.  

1. Select the virtual machine that you want to see its insights. 

   :::image type="content" source="./media/network-insights-topology/vm-insights.png" alt-text="Screenshot of the virtual machine's insights tab." lightbox="./media/network-insights-topology/vm-insights.png":::

    In insights tab, you see essential insights. Scroll down to see connectivity and traffic insights and resource metrics.

    > [!NOTE]
    > - Connectivity insights are available when connection monitor is enabled. For more information, see [Connection monitor](connection-monitor-overview.md). 
    > - Traffic insights are available when flow logs and traffic analytics are enabled. For more information, see [NSG flow logs](nsg-flow-logs-overview.md), [VNet flow logs](vnet-flow-logs-overview.md) and [traffic analytics](traffic-analytics.md).

1. Select the **Traffic** tab to see detailed traffic information about the selected VM. The insights presented in this tab are fetched from Network Watcher flow logs and traffic analytics. You see **Set up Traffic Analytics** with no insights if traffic analytics isn't enabled.

   :::image type="content" source="./media/network-insights-topology/vm-traffic.png" alt-text="Screenshot of the virtual machine's traffic tab." lightbox="./media/network-insights-topology/vm-traffic.png":::

1. Select the **Connectivity** tab to see detailed connectivity information about the selected VM. The insights presented in this tab are fetched from Network Watcher connection monitor. You see **Set up Connection Monitor** with no insights if connection monitor isn't enabled.

   :::image type="content" source="./media/network-insights-topology/vm-connectivity.png" alt-text="Screenshot of the virtual machine's connectivity tab." lightbox="./media/network-insights-topology/vm-connectivity.png":::

1. Select the **Insights + Diagnostics** tab to see the summary of the VM and to use Network Watcher diagnostic tools such as connection troubleshoot, packet capture and next hop to help in troubleshooting any issues you have with the VM.

   :::image type="content" source="./media/network-insights-topology/vm-insights-diagnostics.png" alt-text="Screenshot of the virtual machine's insights and diagnostics tab." lightbox="./media/network-insights-topology/vm-insights-diagnostics.png"::: 

## Related content

- [Connection monitor](connection-monitor-overview.md)
- [NSG flow logs](nsg-flow-logs-overview.md) and [VNet flow logs](vnet-flow-logs-overview.md)
- [Network Watcher diagnostic tools](network-watcher-overview.md#network-diagnostic-tools)
