---
title: Connection troubleshoot overview
titleSuffix: Azure Network Watcher
description: Learn about Azure Network Watcher connection troubleshoot capability.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 02/15/2023
ms.author: halkazwini
ms.custom: template-concept, engagement-fy23
---

# Connection troubleshoot overview

With the increase of sophisticated and high-performance workloads in Azure, there's a critical need for increased visibility and control over the operational state of complex networks running these workloads. Such complex networks are implemented using network security groups, firewalls, user-defined routes, and resources provided by Azure. Complex configurations make troubleshooting connectivity issues challenging.

The connection troubleshoot feature of Azure Network Watcher helps reduce the amount of time to diagnose and troubleshoot network connectivity issues. The results returned can provide insights about the root cause of the connectivity problem and whether it's due to a platform or user configuration issue.

Connection troubleshoot reduces the Mean Time To Resolution (MTTR) by providing a comprehensive method of performing all connection major checks to detect issues pertaining to network security groups, user-defined routes, and blocked ports. It provides the following results with actionable insights where a step-by-step guide or corresponding documentation is provided for faster resolution:

- Connectivity test with different destination types (VM, URI, FQDN, or IP Address)
- Configuration issues that impact reachability
- All possible hop by hop paths from the source to destination
- Hop by hop latency
- Latency (minimum, maximum, and average between source and destination)
- Graphical topology view from source to destination
- Number of probes failed during the connection troubleshoot check

## Supported source and destination types

Connection troubleshoot provides the capability to check TCP or ICMP connections from any of these Azure resources:

- Virtual machines
- Azure Bastion instances
- Application gateways (except v1)

Connection troubleshoot can test connections to any of these destinations:

- Virtual machines
- Fully qualified domain names (FQDNs)
- Uniform resource identifiers (URIs)
- IP addresses

## Issues detected by connection troubleshoot

Connection troubleshoot can detect the following types of issues that can impact connectivity:

- High VM CPU utilization
- High VM memory utilization
- Virtual machine (guest) firewall rules blocking traffic
- DNS resolution failures
- Misconfigured or missing routes
- Network security group (NSG) rules that are blocking traffic
- Inability to open a socket at the specified source port
- Missing address resolution protocol entries for Azure ExpressRoute circuits
- Servers not listening on designated destination ports

> [!IMPORTANT]
> Connection troubleshoot requires that the virtual machine you troubleshoot from has the `AzureNetworkWatcherExtension` extension installed. The extension is not required on the destination virtual machine.
> - To install the extension on a Windows VM, see [Azure Network Watcher Agent virtual machine extension for Windows](../virtual-machines/extensions/network-watcher-windows.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).
> - To install the extension on a Linux VM, see [Azure Network Watcher Agent virtual machine extension for Linux](../virtual-machines/extensions/network-watcher-linux.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

### Next steps

- Learn more about [Network Watcher](network-watcher-monitoring-overview.md).
- Learn how to use connection troubleshoot using the [Azure portal](network-watcher-connectivity-portal.md), [PowerShell](network-watcher-connectivity-powershell.md), the [Azure CLI](network-watcher-connectivity-cli.md), or [REST API](network-watcher-connectivity-rest.md).