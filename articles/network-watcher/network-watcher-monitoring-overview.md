---
title: Introduction to Azure Network Watcher | Microsoft Docs
description: This page provides an overview of the Network Watcher service for monitoring and visualizing network connected resources in Azure
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: 14bc2266-99e3-42a2-8d19-bd7257fec35e
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace
---

# Azure network monitoring overview

Customers build an end-to-end network in Azure by orchestrating and composing various individual network resources such as VNet, ExpressRoute, Application Gateway, Load balancers, and more. Monitoring is available on each of the network resources. We refer to this monitoring as resource level monitoring.

The end to end network can have complex configurations and interactions between resources, creating complex scenarios that need scenario-based monitoring through Network Watcher.

This article covers scenario and resource level monitoring. Network monitoring in Azure is comprehensive and covers two broad categories:

* [**Network Watcher**](#network-watcher) - Scenario-based monitoring is provided with the features in Network Watcher. This service includes packet capture, next hop, IP flow verify, security group view, NSG flow logs. Scenario level monitoring provides an end to end view of network resources in contrast to individual network resource monitoring.
* [**Resource monitoring**](#network-resource-level-monitoring) - Resource level monitoring comprises of four features, diagnostic logs, metrics, troubleshooting, and resource health. All these features are built at the network resource level.

## Network Watcher

Network Watcher is a regional service that enables you to monitor and diagnose conditions at a network scenario level in, to, and from Azure. Network diagnostic and visualization tools available with Network Watcher help you understand, diagnose, and gain insights to your network in Azure.

Network Watcher currently has the following capabilities:

* **[Topology](network-watcher-topology-overview.md)** - Provides a network level view showing the various interconnections and associations between network resources in a resource group.
* **[Variable Packet capture](network-watcher-packet-capture-overview.md)** - Captures packet data in and out of a virtual machine. Advanced filtering options and fine-tuned controls such as being able to set time and size limitations provide versatility. The packet data can be stored in a blob store or on the local disk in .cap format.
* **[IP flow verify](network-watcher-ip-flow-verify-overview.md)** - Checks if a packet is allowed or denied based on flow information 5-tuple packet parameters (Destination IP, Source IP, Destination Port, Source Port, and Protocol). If the packet is denied by a security group, the rule and group that denied the packet is returned.
* **[Next hop](network-watcher-next-hop-overview.md)** - Determines the next hop for packets being routed in the Azure Network Fabric, enabling you to diagnose any misconfigured user-defined routes.
* **[Security group view](network-watcher-security-group-view-overview.md)** - Gets the effective and applied security rules that are applied on a VM.
* **[NSG Flow logging](network-watcher-nsg-flow-logging-overview.md)** - Flow logs for Network Security Groups enable you to capture logs related to traffic that are allowed or denied by the security rules in the group. The flow is defined by a 5-tuple information – Source IP, Destination IP, Source Port, Destination Port and Protocol.
* **[Virtual Network Gateway and Connection troubleshooting](network-watcher-troubleshoot-manage-rest.md)** - Provides the ability to troubleshoot Virtual Network Gateways and Connections.
* **[Network subscription limits](#network-subscription-limits)** - Enables you to view network resource usage against limits.
* **[Configuring Diagnostics Log](#diagnostic-logs)** – Provides a single pane to enable or disable Diagnostics logs for network resources in a resource group.

### Role-based Access Control (RBAC) in Network Watcher

Network watcher uses the [Azure Role-Based Access Control (RBAC) model](../active-directory/role-based-access-control-what-is.md). The following permissions are required by the Network Watcher. It is important to make sure that the role used for initiating Network Watcher APIs or using Network Watcher from the portal has the required access.

|Resource| Permission|
|---|---|
|Microsoft.Storage/ |Read|
|Microsoft.Authorization/| Read|
|Microsoft.Resources/subscriptions/resourceGroups/| Read|
|Microsoft.Storage/storageAccounts/listServiceSas/ | Action|
|Microsoft.Storage/storageAccounts/listAccountSas/ |Action|
|Microsoft.Storage/storageAccounts/listKeys/ | Action|
|Microsoft.Compute/virtualMachines/ |Read|
|Microsoft.Compute/virtualMachines/ |Write|
|Microsoft.Compute/virtualMachineScaleSets/ |Read|
|Microsoft.Compute/virtualMachineScaleSets/ |Write|
|Microsoft.Network/networkWatchers/packetCaptures/| Read|
|Microsoft.Network/networkWatchers/packetCaptures/| Write|
|Microsoft.Network/networkWatchers/packetCaptures/| Delete|
|Microsoft.Network/networkWatchers/ |Write|
|Microsoft.Network/networkWatchers/| Read|
|Microsoft.Insights/alertRules/ |*|
|Microsoft.Support/| *|

### Network subscription limits

Network subscription limits provide you with details of the usage of each of the network resource in a subscription in a region against the maximum number of resources available.

![network subscription limit][nsl]

## Network resource level monitoring

The following features are available for resource level monitoring:

### Audit log

Operations performed as part of the configuration of networks are logged. These logs can be viewed in the Azure portal or retrieved using Microsoft tools such as Power BI or third-party tools. Audit logs are available through the portal, PowerShell, CLI, and Rest API. For more information on Audit logs, see [Audit operations with Resource Manager](../resource-group-audit.md)

Audit logs are available for operations done on all network resources.

### Metrics

Metrics are performance measurements and counters collected over a period of time. Metrics are currently available for Application Gateway. Metrics can be used to trigger alerts based on threshold. See [Application Gateway Diagnostics](../application-gateway/application-gateway-diagnostics.md) to view how metrics can be used to create alerts.

![metrics view][metrics]

### Diagnostic logs

Periodic and spontaneous events are created by network resources and logged in storage accounts, sent to an Event Hub, or Log Analytics. These logs provide insights into the health of a resource. These logs can be viewed in tools such as Power BI and Log Analytics. To learn how to view diagnostic logs, visit [Log Analytics](../log-analytics/log-analytics-azure-networking-analytics.md).

Diagnostic logs are available for [Load Balancer](../load-balancer/load-balancer-monitor-log.md), [Network Security Groups](../virtual-network/virtual-network-nsg-manage-log.md), Routes, and [Application Gateway](../application-gateway/application-gateway-diagnostics.md).

Network Watcher provides a diagnostic logs view. This view contains all networking resources that support diagnostic logging. From this view, you can enable and disable networking resources conveniently and quickly.

![logs][logs]

### Troubleshooting

The troubleshooting blade, an experience in the portal, is provided on network resources today to diagnose common problems associated with an individual resource. This experience is available for the following network resources - ExpressRoute, VPN Gateway, Application Gateway, Network Security Logs, Routes, DNS, Load Balancer, and Traffic Manager. To learn more about resource level troubleshooting, visit [Diagnose and resolve issues with Azure Troubleshooting](https://azure.microsoft.com/blog/azure-troubleshoot-diagonse-resolve-issues/)

![troubleshooting info][TS]

### Resource health

The health of a network resource is provided on a periodic basis. Such resources include VPN Gateway and VPN tunnel. Resource health is accessible on the Azure portal. To learn more about resource health, visit [Resource Health Overview](../resource-health/resource-health-overview.md)

## Next steps

After learning about Network Watcher, you can learn to:

Do a packet capture on your VM by visiting [Variable packet capture in the Azure portal](network-watcher-packet-capture-manage-portal.md)

Perform proactive monitoring and diagnostics using [alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md).

Detect security vulnerabilities with [Analyzing packet capture with Wireshark](network-watcher-deep-packet-inspection.md), using open source tools.

<!--Image references-->
[TS]: ./media/network-watcher-monitoring-overview/troubleshooting.png
[logs]: ./media/network-watcher-monitoring-overview/logs.png
[metrics]: ./media/network-watcher-monitoring-overview/metrics.png
[nsl]: ./media/network-watcher-monitoring-overview/nsl.png











