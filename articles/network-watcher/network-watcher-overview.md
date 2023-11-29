---
title: Azure Network Watcher overview
description: Learn about Azure Network Watcher's monitoring, diagnostics, logging, and metrics capabilities in a virtual network.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: overview
ms.date: 09/15/2023

# CustomerIntent: As someone with basic Azure network experience, I want to understand how Azure Network Watcher can help me resolve some of the network-related problems I've encountered and provide insight into how I use Azure networking.
---

# What is Azure Network Watcher?

Azure Network Watcher provides a suite of tools to monitor, diagnose, view metrics, and enable or disable logs for Azure IaaS (Infrastructure-as-a-Service) resources. Network Watcher enables you to monitor and repair the network health of IaaS products like virtual machines (VMs), virtual networks (VNets), application gateways, load balancers, etc. Network Watcher isn't designed or intended for PaaS monitoring or Web analytics.

Network Watcher consists of three major sets of tools and capabilities:

- [Monitoring](#monitoring)
- [Network diagnostic tools](#network-diagnostic-tools)
- [Traffic](#traffic)

:::image type="content" source="./media/network-watcher-overview/network-watcher-capabilities.png" alt-text="Diagram showing Azure Network Watcher's capabilities.":::

> [!NOTE] 
> When you create or update a virtual network in your subscription, Network Watcher is automatically enabled in your virtual network's region. There's no impact on your resources or associated charge for automatically enabling Network Watcher. For more information, see [Enable or disable Network Watcher](network-watcher-create.md).

## Monitoring

Network Watcher offers two monitoring tools that help you view and monitor resources:

- Topology
- Connection monitor

### Topology

**Topology** provides a visualization of the entire network for understanding network configuration. It provides an interactive interface to view resources and their relationships in Azure spanning across multiple subscriptions, resource groups, and locations. For more information, see [Topology overview](network-insights-topology.md).

### Connection monitor

**Connection monitor** provides end-to-end connection monitoring for Azure and hybrid endpoints. It helps you understand network performance between various endpoints in your network infrastructure. For more information, see [Connection monitor overview](connection-monitor-overview.md) and [Monitor network communication between two virtual machines](monitor-vm-communication.md).

## Network diagnostic tools

Network Watcher offers seven network diagnostic tools that help troubleshoot and diagnose network issues:

- IP flow verify
- NSG diagnostics
- Next hop
- Effective security rules
- Connection troubleshoot
- Packet capture
- VPN troubleshoot

### IP flow verify

**IP flow verify** allows you to detect traffic filtering issues at a virtual machine level. It checks if a packet is allowed or denied to or from an IP address (IPv4 or IPv6 address). It also tells you which security rule allowed or denied the traffic. For more information, see [IP flow verify overview](ip-flow-verify-overview.md) and [Diagnose a virtual machine network traffic filter problem](diagnose-vm-network-traffic-filtering-problem.md).

### NSG diagnostics

**NSG diagnostics** allows you to detect traffic filtering issues at a virtual machine, virtual machine scale set, or application gateway level. It checks if a packet is allowed or denied to or from an IP address, IP prefix, or a service tag. It tells you which security rule allowed or denied the traffic. It also allows you to add a new security rule with a higher priority to allow or deny the traffic. For more information, see [NSG diagnostics overview](network-watcher-network-configuration-diagnostics-overview.md) and [Diagnose network security rules](diagnose-network-security-rules.md).

### Next hop

**Next hop** allows you to detect routing issues. It checks if traffic is routed correctly to the intended destination. It provides you with information about the Next hop type, IP address, and Route table ID for a specific destination IP address. For more information, see [Next hop overview](network-watcher-next-hop-overview.md) and [Diagnose a virtual machine network routing problem](diagnose-vm-network-routing-problem.md).

### Effective security rules

**Effective security rules** allows you to view the effective security rules applied to a network interface. It shows you all security rules applied to the network interface, the subnet the network interface is in, and the aggregate of both. For more information, see [Effective security rules overview](effective-security-rules-overview.md) and [View details of a security rule](diagnose-vm-network-traffic-filtering-problem.md#view-details-of-a-security-rule).

### Connection troubleshoot

**Connection troubleshoot** enables you to test a connection between a virtual machine, a virtual machine scale set, an application gateway, or a Bastion host and a virtual machine, an FQDN, a URI, or an IPv4 address. The test returns similar information returned when using the [connection monitor](#connection-monitor) capability, but tests the connection at a point in time instead of monitoring it over time, as connection monitor does. For more information, see [Connection troubleshoot overview](connection-troubleshoot-overview.md) and [Troubleshoot connections with Azure Network Watcher](network-watcher-connectivity-portal.md). 

### Packet capture

**Packet capture** allows you to remotely create packet capture sessions to track traffic to and from a virtual machine (VM) or a virtual machine scale set. For more information, see [packet capture](network-watcher-packet-capture-overview.md) and [Manage packet captures in virtual machines](network-watcher-packet-capture-manage-portal.md).

### VPN troubleshoot

**VPN troubleshoot** enables you to troubleshoot virtual network gateways and their connections. For more information, see [VPN troubleshoot overview](network-watcher-troubleshoot-overview.md) and [Diagnose a communication problem between networks](diagnose-communication-problem-between-networks.md).

## Traffic

Network Watcher offers two traffic tools that help you log and visualize network traffic:

- Flow logs
- Traffic analytics

### Flow logs

**Flow logs** allows you to log information about your Azure IP traffic and stores the data in Azure storage. You can log IP traffic flowing through a network security group or Azure virtual network. For more information, see:
- [NSG flow logs](network-watcher-nsg-flow-logging-overview.md) and [Log network traffic to and from a virtual machine](network-watcher-nsg-flow-logging-portal.md).
- [VNet flow logs (preview)](vnet-flow-logs-overview.md) and [Manage VNet flow logs](vnet-flow-logs-powershell.md).

### Traffic analytics

**Traffic analytics** provides rich visualizations of flow logs data. For more information about traffic analytics, see [traffic analytics](traffic-analytics.md) and [Manage traffic analytics using Azure Policy](traffic-analytics-policy-portal.md).

:::image type="content" source="./media/network-watcher-overview/traffic-analytics.png" alt-text="Screenshot showing Traffic analytics feature of Network Watcher.":::

## Usage + quotas

The **Usage + quotas** capability of Network Watcher provides a summary of how many of each network resource you've deployed in a subscription and region and what the limit is for the resource. For more information, see [Networking limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=/azure/network-watcher/toc.json#azure-resource-manager-virtual-networking-limits) to the number of network resources that you can create within an Azure subscription and region. This information is helpful when planning future resource deployments as you can't create more resources if you reach their limits within the subscription or region.

:::image type="content" source="./media/network-watcher-overview/subscription-limits.png" alt-text="Screenshot showing Networking resources usage and limits per subscription in the Azure portal.":::

## Network Watcher limits

Network Watcher has the following limits:

[!INCLUDE [network-watcher-limits](../../includes/network-watcher-limits.md)]

## Pricing

For pricing details, see [Network Watcher pricing](https://azure.microsoft.com/pricing/details/network-watcher/).

## Service Level Agreement (SLA)

For service level agreement details, see [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Frequently asked questions (FAQ)

To get answers to most frequently asked questions about Network Watcher, see [Azure Network Watcher frequently asked questions (FAQ)](frequently-asked-questions.yml).

## What's new? 

To view the latest Network Watcher feature updates, see [Service updates](https://azure.microsoft.com/updates/?query=network%20watcher).

## Related content

- To get started using Network Watcher diagnostic tools, see [Quickstart: Diagnose a virtual machine network traffic filter problem](diagnose-vm-network-traffic-filtering-problem.md).
- To learn more about Network Watcher, see [Training module: Introduction to Azure Network Watcher](/training/modules/intro-to-azure-network-watcher).