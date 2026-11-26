---
title: View Topology
description: Learn how to use Network Insights topology to get a visual representation of Azure resources with connectivity and traffic insights for monitoring. 
author: huzefafw
ms.author: hufurnit
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 11/18/2025
ms.custom:
  - subject-monitoring
  - sfi-image-nochange

# Customer intent: "As an Azure administrator, I want to visualize resource topologies and their connectivity, so that I can effectively monitor and troubleshoot network infrastructure across multiple subscriptions and regions."
---

# View topology

Topology provides an interactive interface to view resources and their relationships in Azure across multiple subscriptions, regions, and resource groups. It helps you manage and monitor your cloud network infrastructure with interactive graphical interface that provides you with insights from Azure Network Watcher [connection monitor](connection-monitor-overview.md) and [traffic analytics](traffic-analytics.md). Topology helps you diagnose and troubleshoot network issues by providing contextual access to Network Watcher diagnostic tools such as [connection troubleshoot](connection-troubleshoot-overview.md), [packet capture](packet-capture-overview.md), and [next hop](next-hop-overview.md).

In this article, you learn how to use topology to visualize virtual networks and connected resources.

[!INCLUDE [Resource Graph](~/reusable-content/ce-skilling/azure/includes/network-watcher-resource-graph-topology.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- The necessary [role-based access control (RBAC) permissions](rbac-permissions.md) to use Azure Network Watcher capabilities.

## Supported resource types

Topology supports the following resource types:

- Application Gateways
- Azure Bastion hosts
- Azure DDoS Protection plans
- Azure DNS zones
- Azure Firewalls
- Azure Front Door profiles
- Azure Kubernetes Service clusters (preview)
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

   :::image type="content" source="./media/network-watcher-portal-search.png" alt-text="Screenshot shows how to search for Network Watcher in the Azure portal." lightbox="./media/network-watcher-portal-search.png":::
    
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

## AKS cluster topology visualization 

Azure Kubernetes Service (AKS) clusters can be complex, with multiple interconnected Azure resources supporting containerized workloads. Topology in Network Watcher now supports AKS visualization, enabling you to view and understand the network architecture of your AKS clusters directly within the Azure portal.

AKS network topology visualization provides a graphical representation of the networking resources associated with your AKS cluster. This includes virtual networks (VNets), subnets, network security groups (NSGs), load balancers, NAT gateways, public IPs, and more. The visualization helps you:

- **Understand resource relationships:** See how AKS nodes, pods, and supporting infrastructure are connected, helping you visualize dependencies and architecture.
- **Diagnose connectivity issues:** Identify misconfigurations or bottlenecks in your cluster's network setup. The visualization displays connectivity details such as active connections and connection drops, allowing you to quickly spot failures or interruptions in network paths.
- **Monitor traffic:** Analyze traffic metrics including bytes forwarded and bytes dropped across network paths. This helps you assess throughput, detect bottlenecks, and understand data transmission efficiency within your AKS environment.
- **Monitor resource health:** Quickly assess the state and placement of critical networking components to ensure your AKS cluster is operating optimally.

    :::image type="content" source="./media/network-insights-topology/aks-topology.jpg" alt-text="Screenshot of the AKS cluster topology." lightbox="./media/network-insights-topology/aks-topology.jpg":::

### Supported AKS scenarios

Topology supports visualization for a wide range of AKS deployment scenarios, including:

- Default AKS clusters (Kubenet, no custom VNet/UDR)
- Kubenet with custom VNet and UDR
- Azure CNI (with or without custom VNet)
- Managed and user-managed NAT Gateway
- Private clusters and clusters with Azure Firewall
- Node pools in separate subnets
- Dynamic IP allocation for pods

### Limitations

- AKS clusters and their main network components must reside within the same subscription and region.
- Migration of clusters between subscriptions, tenants, or resource groups isn't supported.

## Diagnose network issues with Network Watcher in Support + Troubleshooting (Preview)

From topology, you can now start a network diagnosis directly in **Support + Troubleshooting**. Select the issue you're facing, and if it's a network connectivity issue that Network Watcher can diagnose, Support + Troubleshooting uses Copilot Troubleshooting Agent to choose and run the relevant Network Watcher diagnostics for you. It then correlates the results and tells you the probable cause, how confident it is, and the recommended next steps. You don't need to open each diagnostic tool separately, decide which one to run, or fill in its parameters yourself.

The findings come from Network Watcher itself. Network Watcher works out routes, checks network security group (NSG) rules, and tests connectivity. AI decides which diagnostics fit your issue, runs them, and explains the combined results in plain language.

> [!IMPORTANT]
> Diagnosing network issues with Network Watcher in Support + Troubleshooting is currently in preview. Features and functionality might change before general availability.

### Supported Network Watcher diagnostics

During the limited preview, Support + Troubleshooting can run the following Network Watcher diagnostics:

| Diagnostic | What it checks |
|---|---|
| [Next hop](next-hop-overview.md) | Finds the next hop type and IP address that traffic from a VM takes toward a destination. |
| [IP flow verify](ip-flow-verify-overview.md) | Checks whether NSG rules allow or deny a specific inbound or outbound flow. |
| [Connection troubleshoot](connection-troubleshoot-overview.md) | Tests connectivity from a source VM to a destination and finds issues along the path. |
| [NSG diagnostics](nsg-diagnostics-overview.md) | Checks how NSG rules apply to traffic between a source and a destination. |

You don't choose the diagnostic. Based on the issue you select, Support + Troubleshooting runs only the diagnostics that are relevant to it.

### Prerequisites

- **Azure Copilot access.** Azure Copilot must be enabled for your tenant, and your account must have access to it. The **Troubleshooting** preview capability must also be turned on in the **Azure Copilot admin center**. A Global Administrator can manage both settings. For more information, see [Manage access to Azure Copilot](/azure/copilot/manage-access).
- **Permissions.** You can only diagnose resources you have access to, and every diagnostic runs with your Azure role-based access control (Azure RBAC) permissions. For more information, see [Azure role-based access control permissions required to use Network Watcher capabilities](required-rbac-permissions.md).

### Diagnose an issue from topology

1. In topology, select **Diagnose network issues (Preview)** at the top of the map.

1. The **Support + Troubleshooting** pane opens. Select the issue that best describes your problem.

1. If the issue is a network connectivity issue that Network Watcher can diagnose, Support + Troubleshooting uses AI to decide which Network Watcher diagnostics to run. If it needs more information, provide the details it asks for. When it has everything it needs, it runs the diagnostics.

1. Review the results. Support + Troubleshooting correlates the output of the diagnostics it ran and shows:
    - **Probable cause**: The most likely reason for the issue, based on the Network Watcher findings.
    - **Findings**: The specific results from each diagnostic. For example, a connection troubleshoot result includes the connection status, the number of probes sent and failed, latency when available, and any issues found, such as a user-defined route that sends traffic to a `None` next hop, or an NSG rule like `DefaultRule_DenyAllOutBound` that denies outbound traffic.
    - **Recommended next steps**: Suggested actions to resolve the issue.

1. If the issue isn't one that Network Watcher can diagnose, Support + Troubleshooting continues with its standard troubleshooting guidance and support options.

### Limitations

- **Read-only.** The diagnosis runs only read-only Network Watcher diagnostics. Nothing in the experience creates, modifies, or deletes route tables, NSGs, firewalls, network interfaces, virtual networks, VMs, or other Azure resources. You decide whether to make a configuration change.
- **VM as the source.** Diagnostics run from a target VM.
- **Point in time.** Each diagnostic checks the current state of your resources when it runs. For continuous monitoring, use [connection monitor](connection-monitor-overview.md).
- **Limited to the supported diagnostics.** The AI diagnosis doesn't check application, DNS, guest OS, or firewall health beyond what the supported Network Watcher diagnostics cover.

> [!NOTE]
> AI-generated content can be incorrect. Review the Network Watcher findings before you change your network configuration. Don't include passwords, access tokens, secrets, or unrelated sensitive information in any details you provide.



## Related content

- [Connection monitor](connection-monitor-overview.md)
- [NSG flow logs](nsg-flow-logs-overview.md) and [VNet flow logs](vnet-flow-logs-overview.md)
- [Network Watcher diagnostic tools](network-watcher-overview.md#network-diagnostic-tools)
