---
title: Traffic analytics
titleSuffix: Azure Network Watcher
description: Learn what Azure Network Watcher traffic analytics is, and how to use it for viewing network activity, securing networks, and optimizing performance.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: concept-article
ms.reviewer: harshacs
ms.date: 10/27/2023

#CustomerIntent: As an Azure administrator, I want to use Traffic analytics to analyze Network Watcher flow logs so that I can view network activity, secure my networks, and optimize performance.
---

# Traffic analytics overview

Traffic analytics is a cloud-based solution that provides visibility into user and application activity in your cloud networks. Specifically, traffic analytics analyzes Azure Network Watcher flow logs to provide insights into traffic flow in your Azure cloud. With traffic analytics, you can:

- Visualize network activity across your Azure subscriptions.
- Identify hot spots.
- Secure your network by using information about the following components to identify threats:

  - Open ports
  - Applications that attempt to access the internet
  - Virtual machines (VMs) that connect to rogue networks

- Optimize your network deployment for performance and capacity by understanding traffic flow patterns across Azure regions and the internet.
- Pinpoint network misconfigurations that can lead to failed connections in your network.

## Why traffic analytics?

It's vital to monitor, manage, and know your own network for uncompromised security, compliance, and performance. Knowing your own environment is of paramount importance to protect and optimize it. You often need to know the current state of the network, including the following information:

- Who is connecting to the network?
- Where are they connecting from?
- Which ports are open to the internet?
- What's the expected network behavior?
- Is there any irregular network behavior?
- Are there any sudden rises in traffic?

Cloud networks are different from on-premises enterprise networks. In on-premises networks, routers and switches support NetFlow and other, equivalent protocols. You can use these devices to collect data about IP network traffic as it enters or exits a network interface. By analyzing traffic flow data, you can build an analysis of network traffic flow and volume.

With Azure virtual networks, flow logs collect data about the network. These logs provide information about ingress and egress IP traffic through a network security group or a virtual network. Traffic analytics analyzes raw flow logs and combines the log data with intelligence about security, topology, and geography. Traffic analytics then provides you with insights into traffic flow in your environment.

Traffic analytics provides the following information:

- Most-communicating hosts
- Most-communicating application protocols
- Most-conversing host pairs
- Allowed and blocked traffic
- Inbound and outbound traffic
- Open internet ports
- Most-blocking rules
- Traffic distribution per Azure datacenter, virtual network, subnets, or rogue network

## Key components

To use traffic analytics, you need the following components:

- **Network Watcher**: A regional service that you can use to monitor and diagnose conditions at a network-scenario level in Azure. You can use Network Watcher to turn NSG flow logs on and off. For more information, see [What is Azure Network Watcher?](network-watcher-monitoring-overview.md)

- **Log Analytics**: A tool in the Azure portal that you use to work with Azure Monitor Logs data. Azure Monitor Logs is an Azure service that collects monitoring data and stores the data in a central repository. This data can include events, performance data, or custom data that's provided through the Azure API. After this data is collected, it's available for alerting, analysis, and export. Monitoring applications such as network performance monitor and traffic analytics use Azure Monitor Logs as a foundation. For more information, see [Azure Monitor Logs](../azure-monitor/logs/log-query-overview.md?toc=/azure/network-watcher/toc.json). Log Analytics provides a way to edit and run queries on logs. You can also use this tool to analyze query results. For more information, see [Overview of Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-overview.md?toc=/azure/network-watcher/toc.json).

- **Log Analytics workspace**: The environment that stores Azure Monitor log data that pertains to an Azure account. For more information about Log Analytics workspaces, see [Overview of Log Analytics workspace](../azure-monitor/logs/log-analytics-workspace-overview.md?toc=/azure/network-watcher/toc.json).

- Additionally, you need a network security group enabled for flow logging if you're using traffic analytics to analyze [NSG flow logs](network-watcher-nsg-flow-logging-overview.md) or a virtual network enabled for flow logging if you're using traffic analytics to analyze [VNet flow logs (preview)](vnet-flow-logs-overview.md):

    - **Network security group (NSG)**: A resource that contains a list of security rules that allow or deny network traffic to or from resources that are connected to an Azure virtual network. Network security groups can be associated with subnets, network interfaces (NICs) that are attached to VMs (Resource Manager), or individual VMs (classic). For more information, see [Network security group overview](../virtual-network/network-security-groups-overview.md?toc=/azure/network-watcher/toc.json).
    
    - **NSG flow logs**: Recorded information about ingress and egress IP traffic through a network security group. NSG flow logs are written in JSON format and include:
    
      - Outbound and inbound flows on a per rule basis.
      - The NIC that the flow applies to.
      - Information about the flow, such as the source and destination IP addresses, the source and destination ports, and the protocol.
      - The status of the traffic, such as allowed or denied.
    
      For more information about NSG flow logs, see [NSG flow logs overview](network-watcher-nsg-flow-logging-overview.md).
    
    - **Virtual network (VNet)**: A resource that enables many types of Azure resources to securely communicate with each other, the internet, and on-premises networks. For more information, see [Virtual network overview](../virtual-network/virtual-networks-overview.md?toc=/azure/network-watcher/toc.json).
    
    - **VNet flow logs (preview)**: Recorded information about ingress and egress IP traffic through a virtual network. VNet flow logs are written in JSON format and include:
    
      - Outbound and inbound flows.
      - Information about the flow, such as the source and destination IP addresses, the source and destination ports, and the protocol.
      - The status of the traffic, such as allowed or denied.
    
      For more information about VNet flow logs, see [VNet flow logs overview](vnet-flow-logs-overview.md).

      > [!NOTE]
      > For information about the differences between NSG flow logs and VNet flow logs, see [VNet flow logs compared to NSG flow logs](vnet-flow-logs-overview.md#vnet-flow-logs-compared-to-nsg-flow-logs) 

## How traffic analytics works

Traffic analytics examines raw flow logs. It then reduces the log volume by aggregating flows that have a common source IP address, destination IP address, destination port, and protocol.

An example might involve Host 1 at IP address 10.10.10.10 and Host 2 at IP address 10.10.20.10. Suppose these two hosts communicate 100 times over a period of one hour. The raw flow log has 100 entries in this case. If these hosts use the HTTP protocol on port 80 for each of those 100 interactions, the reduced log has one entry. That entry states that Host 1 and Host 2 communicated 100 times over a period of one hour by using the HTTP protocol on port 80.

Reduced logs are enhanced with geography, security, and topology information and then stored in a Log Analytics workspace. The following diagram shows the data flow:

:::image type="content" source="./media/traffic-analytics/data-flow-for-nsg-flow-log-processing.png" alt-text="Diagram that shows how network traffic data flows from an NSG log to an analytics dashboard. Middle steps include aggregation and enhancement.":::

## Prerequisites

Traffic analytics requires the following prerequisites:

- A Network Watcher enabled subscription. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md).
- NSG flow logs enabled for the network security groups you want to monitor or VNet flow logs enabled for the virtual network you want to monitor. For more information, see [Create a flow log](nsg-flow-logging.md#create-a-flow-log) or [Enable VNet flow logs](vnet-flow-logs-powershell.md#enable-vnet-flow-logs).
- An Azure Log Analytics workspace with read and write access. For more information, see [Create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md?toc=/azure/network-watcher/toc.json).

- One of the following [Azure built-in roles](../role-based-access-control/built-in-roles.md) needs to be assigned to your account:

    | Deployment model | Role |
    | ---------------- | ---- |
    | Resource Manager | [Owner](../role-based-access-control/built-in-roles.md?toc=/azure/network-watcher/toc.json#owner) |
    |                  | [Contributor](../role-based-access-control/built-in-roles.md?toc=/azure/network-watcher/toc.json#contributor) |
    |                  | [Network contributor](../role-based-access-control/built-in-roles.md?toc=/azure/network-watcher/toc.json#network-contributor) <sup>1</sup> and [Monitoring contributor](../role-based-access-control/built-in-roles.md?toc=/azure/network-watcher/toc.json#monitoring-contributor) <sup>2</sup> |

    If none of the preceding built-in roles are assigned to your account, assign a [custom role](../role-based-access-control/custom-roles.md?toc=/azure/network-watcher/toc.json) to your account. The custom role should support the following actions at the subscription level:
    
    - `Microsoft.Network/applicationGateways/read`
    - `Microsoft.Network/connections/read`
    - `Microsoft.Network/loadBalancers/read`
    - `Microsoft.Network/localNetworkGateways/read`
    - `Microsoft.Network/networkInterfaces/read`
    - `Microsoft.Network/networkSecurityGroups/read`
    - `Microsoft.Network/publicIPAddresses/read`
    - `Microsoft.Network/routeTables/read`
    - `Microsoft.Network/virtualNetworkGateways/read`
    - `Microsoft.Network/virtualNetworks/read`
    - `Microsoft.Network/expressRouteCircuits/read`
    - `Microsoft.OperationalInsights/workspaces/*` <sup>1</sup>
    - `Microsoft.Insights/dataCollectionRules/read` <sup>2</sup>
    - `Microsoft.Insights/dataCollectionRules/write` <sup>2</sup>
    - `Microsoft.Insights/dataCollectionRules/delete` <sup>2</sup>
    - `Microsoft.Insights/dataCollectionEndpoints/read` <sup>2</sup>
    - `Microsoft.Insights/dataCollectionEndpoints/write` <sup>2</sup>
    - `Microsoft.Insights/dataCollectionEndpoints/delete` <sup>2</sup>

    <sup>1</sup> Network contributor doesn't cover `Microsoft.OperationalInsights/workspaces/*` actions.

    <sup>2</sup> Only required when using traffic analytics to analyze VNet flow logs (preview). For more information, see [Data collection rules in Azure Monitor](../azure-monitor/essentials/data-collection-rule-overview.md?toc=/azure/network-watcher/toc.json) and [Data collection endpoints in Azure Monitor](../azure-monitor/essentials/data-collection-endpoint-overview.md?toc=/azure/network-watcher/toc.json).

    To learn how to check roles assigned to a user for a subscription, see [List Azure role assignments using the Azure portal](../role-based-access-control/role-assignments-list-portal.md?toc=/azure/network-watcher/toc.json). If you can't see the role assignments, contact the respective subscription admin.

    > [!CAUTION]
    > Data collection rule and data collection endpoint resources are created and managed by traffic analytics. If you perform any operation on these resources, traffic analytics may not function as expected.
    
## Pricing

For pricing details, see [Network Watcher pricing](https://azure.microsoft.com/pricing/details/network-watcher/) and [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Traffic analytics (FAQ)

To get answers to the most frequently asked questions about traffic analytics, see [Traffic analytics FAQ](traffic-analytics-faq.yml).

## Related content

- To learn how to use traffic analytics, see [Usage scenarios](usage-scenarios-traffic-analytics.md).
- To understand the schema and processing details of traffic analytics, see [Schema and data aggregation in Traffic Analytics](traffic-analytics-schema.md).