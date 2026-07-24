---
title: 'Getting Started with Troubleshooting Virtual WAN'
titleSuffix: Azure Virtual WAN
description: Learn about the troubleshooting resources for Virtual WAN.
author: flapinski
ms.service: azure-virtual-wan
ms.topic: troubleshooting
ms.date: 12/30/2025
ms.author: flapinski
ms.custom: references_regions

---
# Getting Started with Troubleshooting Virtual WAN

There are various built-in tools and dashboards for diagnosing and resolving issues within Azure Virtual WAN environments. These resources help pinpoint problems in routing, connectivity, performance, and overall health.  

The following sections outline key troubleshooting and monitoring tools, providing guidance for analyzing routing and BGP sessions, validating datapath connectivity, monitoring resource health and logs, and managing maintenance activities.  

## Known Issues & Limitations
Review known issues and limitations that may impact your Virtual WAN deployment.
* [Virtual WAN Known Issues](whats-new.md#knownissues) - A list of known issues and limitations for Azure Virtual WAN. Validate that your Virtual WAN is not affected by any documented issues before proceeding with troubleshooting.
* Review the service limits for Virtual WAN resources to ensure your deployment is within supported thresholds.
[!INCLUDE [virtual-wan-limits](../../includes/virtual-wan-limits.md)]

## Topology, Routing, and BGP
Analyze routing logic, advertised prefixes, AS Path, and BGP session health.
* [Virtual WAN Topology via Insights](azure-monitor-insights.md) - Shows high-level topology overview of Virtual WAN and dependency-tree with insights. 
* [View Effective Routes](effective-routes-virtual-hub.md) - Use the Azure portal to view the effective routes for Virtual WAN hubs and connected resources.
* [BGP Dashboard](monitor-bgp-dashboard.md) - Displays BGP session status, advertised prefixes, and peering health for Site-to-Site connections.
* [Route Map dashboard](route-maps-dashboard.md) - Monitor routes, AS Path, and BGP communities for Virtual WAN.

## Datapath
Validate connectivity paths and troubleshoot packet-level issues. 
* [NIC Effective Routes](../virtual-network/diagnose-network-routing-problem.md) - View next-hop traffic for VM NICs. Useful for troubleshooting how routes are learned.
* [S2S Gateway VPN - Packet Captures](packet-capture-site-to-site-portal.md) - Steps for collecting packet captures on Site-to-Site VPN Gateways. 
* [ExpressRoute Traffic Collector](../expressroute/traffic-collector.md) - Samples network flows over ExpressRoute circuits.
* [Network Watcher](../network-watcher/network-watcher-overview.md) - Provides packet capture on Virtual Machines (VMs), IP flow logs, NSG diagnostics, and connection troubleshooting capabilities. For more information, see [pricing](https://azure.microsoft.com/pricing/details/network-watcher/). Note that this doesn't confirm datapath through Virtual WAN hubs.

## Health, Metrics, and Logs
Monitor resource health and analyze diagnostic data.
* [Virtual Hub Metrics](monitor-virtual-wan-reference.md) - Provides real-time performance and health metrics for Virtual WAN hub routers and gateways, including scalability, traffic, status, throughput, and connection details. 
* [Point-to-Site Connection Monitoring](monitor-point-to-site-connections.md) - Diagnostic logs for Point-to-Site connections. 
* [VPN Gateway - Resource Logs](monitor-virtual-wan-reference.md#resource-logs) - Use Resource Logs for Site-to-Site and Point-to-Site VPN gateways in Virtual WAN hubs.
* [Site-to-Site VPN Gateway - Azure Monitor Logs](monitor-virtual-wan-reference.md#azure-monitor-logs-tables) - Use Azure Monitor Logs tables for more in depth information on your Virtual WAN Site-to-Site VPN gateways.
* [Monitor your Azure Firewall/Secure Hub](monitor-virtual-wan.md#azure-firewall) - Review the logs and metrics available for troubleshooting the Azure Firewall used in your Virtual WAN secured hub. 

## Maintenance
Plan, manage, and review Virtual WAN resource maintenance. 
* [Customer-Controlled Gateway Maintenance](customer-controlled-gateway-maintenance.md) - Guidance for scheduling maintenance windows for Virtual WAN Gateways. 
* [Customer-Controlled Firewall Maintenance](../firewall/customer-controlled-maintenance.md) – Guidance for scheduling maintenance windows for the Azure Firewall in your Virtual WAN secured hub.

## Additional Resources and Related Wikis
* For more information about Virtual WAN, see the [Azure Virtual WAN documentation](virtual-wan-about.md) and the [FAQ](virtual-wan-faq.md).
* Learn more about monitoring Virtual WAN and related services in [Monitor Azure Virtual WAN](monitor-virtual-wan.md).