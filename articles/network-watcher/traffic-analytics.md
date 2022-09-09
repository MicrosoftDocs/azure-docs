---
title: Azure traffic analytics | Microsoft Docs
description: Learn about traffic analytics. Gain an overview of this solution for viewing network activity, securing networks, and optimizing performance.
services: network-watcher
documentationcenter: na
author: Harsha-CS
ms.service: network-watcher
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 06/01/2022
ms.author: harshacs
ms.reviewer: vinigam
ms.custom:
   - references_regions
   - devx-track-azurepowershell
   - kr2b-contr-experiment
---

# Traffic analytics

Traffic analytics is a cloud-based solution that provides visibility into user and application activity in your cloud networks. Specifically, traffic analytics analyzes Azure Network Watcher network security group (NSG) flow logs to provide insights into traffic flow in your Azure cloud. With traffic analytics, you can:

- Visualize network activity across your Azure subscriptions.
- Identify hot spots.
- Secure your network by using information about the following components to identify threats:

  - Open ports
  - Applications that attempt to access the internet
  - Virtual machines (VMs) that connect to rogue networks

- Optimize your network deployment for performance and capacity by understanding traffic flow patterns across Azure regions and the internet.
- Pinpoint network misconfigurations that can lead to failed connections in your network.

> [!NOTE]
> Traffic analytics now supports collecting NSG flow logs data at a frequency of every 10 minutes.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Why traffic analytics?

It's vital to monitor, manage, and know your own network for uncompromised security, compliance, and performance. Knowing your own environment is of paramount importance to protect and optimize it. You often need to know the current state of the network, including the following information:

- Who is connecting to the network?
- Where are they connecting from?
- Which ports are open to the internet?
- What's the expected network behavior?
- Is there any irregular network behavior?
- Are there any sudden rises in traffic?

Cloud networks are different from on-premises enterprise networks. In on-premises networks, routers and switches support NetFlow and other, equivalent protocols. You can use these devices to collect data about IP network traffic as it enters or exits a network interface. By analyzing traffic flow data, you can build an analysis of network traffic flow and volume.

With Azure virtual networks, NSG flow logs collect data about the network. These logs provide information about ingress and egress IP traffic through an NSG that's associated with individual network interfaces, VMs, or subnets. After analyzing raw NSG flow logs, traffic analytics combines the log data with intelligence about security, topology, and geography. Traffic analytics then provides you with insights into traffic flow in your environment.

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

- **Network security group (NSG)**: A resource that contains a list of security rules that allow or deny network traffic to resources that are connected to an Azure virtual network. NSGs can be associated with subnets, individual VMs (classic), or individual network interfaces (NICs) that are attached to VMs (Resource Manager). For more information, see [Network security group overview](../virtual-network/network-security-groups-overview.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

- **NSG flow logs**: Recorded information about ingress and egress IP traffic through an NSG. NSG flow logs are written in JSON format and include:

  - Outbound and inbound flows on a per rule basis.
  - The NIC that the flow applies to.
  - Information about the flow, such as the source and destination IP address, the source and destination port, and the protocol.
  - The status of the traffic, such as allowed or denied.

  For more information about NSG flow logs, see [NSG flow logs](network-watcher-nsg-flow-logging-overview.md).

- **Log Analytics**: A tool in the Azure portal that you use to work with Azure Monitor Logs data. Azure Monitor Logs is an Azure service that collects monitoring data and stores the data in a central repository. This data can include events, performance data, or custom data that's provided through the Azure API. After this data is collected, it's available for alerting, analysis, and export. Monitoring applications such as network performance monitor and traffic analytics use Azure Monitor Logs as a foundation. For more information, see [Azure Monitor Logs](../azure-monitor/logs/log-query-overview.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json). Log Analytics provides a way to edit and run queries on logs. You can also use this tool to analyze query results. For more information, see [Overview of Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-overview.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

- **Log Analytics workspace**: The environment that stores Azure Monitor log data that pertains to an Azure account. For more information about Log Analytics workspaces, see [Create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

- **Network Watcher**: A regional service that you can use to monitor and diagnose conditions at a network-scenario level in Azure. You can use Network Watcher to turn NSG flow logs on and off. For more information, see [Network Watcher](network-watcher-monitoring-overview.md).

## How traffic analytics works

Traffic analytics examines raw NSG flow logs. It then reduces the log volume by aggregating flows that have a common source IP address, destination IP address, destination port, and protocol.

An example might involve Host 1 at IP address 10.10.10.10 and Host 2 at IP address 10.10.20.10. Suppose these two hosts communicate 100 times over a period of one hour. The raw flow log has 100 entries in this case. If these hosts use the HTTP protocol on port 80 for each of those 100 interactions, the reduced log has one entry. That entry states that Host 1 and Host 2 communicated 100 times over a period of one hour by using the HTTP protocol on port 80.

Reduced logs are enhanced with geography, security, and topology information and then stored in a Log Analytics workspace. The following diagram shows the data flow:

:::image type="content" source="./media/traffic-analytics/data-flow-for-nsg-flow-log-processing.png" alt-text="Diagram that shows how network traffic data flows from an N S G log to an analytics dashboard. Middle steps include aggregation and enhancement.":::

## Prerequisites

Before you use traffic analytics, ensure your environment meets the following requirements.

### User access requirements

One of the following [Azure built-in roles](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json) needs to be assigned to your account:

|Deployment model   | Role                   |
|---------          |---------               |
|Resource Manager   | Owner                  |
|                   | Contributor            |
|                   | Reader                 |
|                   | Network Contributor    |

If none of the preceding built-in roles are assigned to your account, assign a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json) to your account. The custom role should support the following actions at the subscription level:

- `Microsoft.Network/applicationGateways/read`
- `Microsoft.Network/connections/read`
- `Microsoft.Network/loadBalancers/read`
- `Microsoft.Network/localNetworkGateways/read`
- `Microsoft.Network/networkInterfaces/read`
- `Microsoft.Network/networkSecurityGroups/read`
- `Microsoft.Network/publicIPAddresses/read"`
- `Microsoft.Network/routeTables/read`
- `Microsoft.Network/virtualNetworkGateways/read`
- `Microsoft.Network/virtualNetworks/read`
- `Microsoft.Network/expressRouteCircuits/read`

For information about how to check user access permissions, see [Traffic analytics FAQ](traffic-analytics-faq.yml).

## Frequently asked questions

To get answers to frequently asked questions about traffic analytics, see [Traffic analytics FAQ](traffic-analytics-faq.yml).

## Next steps

- To learn how to turn on flow logs, see [Enable NSG flow log](network-watcher-nsg-flow-logging-portal.md#enable-nsg-flow-log).
- To understand the schema and processing details of traffic analytics, see [Traffic analytics schema](traffic-analytics-schema.md).
