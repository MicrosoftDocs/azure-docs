---
title: Frequently asked questions (FAQ) about Azure Network Watcher | Microsoft Docs
description: This article answers frequently asked questions about the Azure Network Watcher service.
services: network-watcher
documentationcenter: na
author: damendo
manager:
editor:
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 10/10/2019
ms.author: damendo


---

# Frequently asked questions (FAQ) about Azure Network Watcher
The [Azure Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview) service provides a suite of tools to monitor, diagnose, view metrics, and enable or disable logs for resources in an Azure virtual network. This article answers common questions about the service.

## General

### What is Network Watcher?
Network Watcher is designed to monitor and repair the network health of IaaS (Infrastructure-as-a-Service) components, which includes Virtual Machines, Virtual Networks, Application Gateways, Load balancers, and other resources in an Azure virtual network. It is not a solution for monitoring PaaS (Platform-as-a-Service) infrastructure or getting web/mobile analytics.

### What tools does Network Watcher provide?
Network Watcher provides three major sets of capabilities
* Monitoring
  * [Topology view](https://docs.microsoft.com/azure/network-watcher/view-network-topology) shows you the resources in your virtual network and the relationships between them.
  * [Connection Monitor](https://docs.microsoft.com/azure/network-watcher/connection-monitor) allows you to monitor connectivity and latency between a VM and another network resource.
  * [Network performance monitor](https://docs.microsoft.com/azure/azure-monitor/insights/network-performance-monitor) allows you to monitor connectivity and latencies across hybrid network architectures, Expressroute circuits, and service/application endpoints.  
* Diagnostics
  * [IP Flow Verify](https://docs.microsoft.com/azure/network-watcher/network-watcher-ip-flow-verify-overview) allows you to detect traffic filtering issues at a VM level.
  * [Next Hop](https://docs.microsoft.com/azure/network-watcher/network-watcher-next-hop-overview) helps you verify traffic routes and detect routing issues.
  * [Connection Troubleshoot](https://docs.microsoft.com/azure/network-watcher/network-watcher-connectivity-portal) enables a one-time connectivity and latency check between a VM and another network resource.
  * [Packet Capture](https://docs.microsoft.com/azure/network-watcher/network-watcher-packet-capture-overview) enables you to capture all traffic on a VM in your virtual network.
  * [VPN Troubleshoot](https://docs.microsoft.com/azure/network-watcher/network-watcher-troubleshoot-overview) runs multiple diagnostics checks on your VPN gateways and connections to help debug issues.
* Logging
  * [NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-overview) allows you to log all traffic in your [Network Security Groups (NSGs)](https://docs.microsoft.com/azure/virtual-network/security-overview)
  * [Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics) processes your NSG Flow Log data enabling you to visualize, query, analyze, and understand your network traffic.


For more detailed information, see the [Network Watcher overview page](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview).


### How does Network Watcher pricing work?
Visit the [Pricing page](https://azure.microsoft.com/pricing/details/network-watcher/) for Network Watcher components and their pricing.

### Which regions is Network Watcher available in?
You can view the latest regional availability on the [Azure Service availability page](https://azure.microsoft.com/global-infrastructure/services/?products=network-watcher)

### What are resource limits on Network Watcher?
See the [Service limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#network-watcher-limits) page for all limits.  

### Why is only one instance of Network Watcher allowed per region?
Network Watcher just needs to be enabled once for a subscription for it's features to work, this is a not a service limit.

## NSG Flow Logs

### What does NSG Flow Logs do?
Azure network resources can be combined and managed through [Network Security Groups (NSGs)](https://docs.microsoft.com/azure/virtual-network/security-overview). NSG Flow Logs enable you to log 5-tuple flow information about all traffic through your NSGs. The raw flow logs are written to an Azure Storage account from where they can be further processed, analyzed, queried, or exported as needed.

### Are there any caveats to using NSG Flow Logs?
There are no pre-requisites for using NSG Flow Logs. However, there are two limitations
- **Service Endpoints must not be present on your VNET**: NSG Flow Logs are emitted from agents on your VMs to Storage accounts. However, today you can only emit logs directly to storage accounts and cannot use a service endpoint added to your VNET.

- **Storage Account must not be firewalled**: Due to internal limitations, Storage accounts must be accessible through the public internet for NSG Flow Logs to work with them. Traffic will still be routed through Azure internally and you will not face extra egress charges.

See the next two questions for instructions on how to work around these issues. Both of these limitations are expected to be addressed by Jan 2020.

### How do I use NSG Flow Logs with Service Endpoints?

*Option 1: Reconfigure NSG flow logs to emit to Azure Storage account without VNET endpoints*

* Find subnets with endpoints:

	- On the Azure portal, search for **Resource Groups** in the global search at the top
	- Navigate to the Resource Group containing the NSG you are working with
	- Use the second dropdown to filter by type and select **Virtual Networks**
	- Click on the Virtual Network containing the Service Endpoints
	- Select **Service endpoints** under **Settings** from the left pane
	- Make a note of the subnets where **Microsoft.Storage** is enabled

* Disable service endpoints:

	- Continuing from above, select **Subnets** under **Settings** from the left pane
	* Click on the subnet containing the Service Endpoints
	- In the **Service endpoints** section, under **Services**, uncheck **Microsoft.Storage**

You can check the storage logs after a few minutes, you should see an updated TimeStamp or a new JSON file created.

*Option 2: Disable NSG flow logs*

If the Microsoft.Storage service endpoints are a must, you will have to disable NSG Flow Logs.

### How do I disable the  firewall on my storage account?

This issue is resolved by enabling "All networks" to access the storage account:

* Find the name of the storage account by locating the NSG on the [NSG Flow Logs overview page](https://ms.portal.azure.com/#blade/Microsoft_Azure_Network/NetworkWatcherMenuBlade/flowLogs)
* Navigate to the storage account by typing the storage account's name in the global search on the portal
* Under the **SETTINGS** section, select **Firewalls and virtual networks**
* Select **All networks** and save it. If it is already selected, no change is needed.  

### What is the difference between flow logs versions 1 & 2?
Flow Logs version 2 introduces the concept of *Flow State* & stores information about bytes and packets transmitted. [Read more](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-overview#log-file).

## Next Steps
 - Head over to our [documentation overview page](https://docs.microsoft.com/azure/network-watcher/) for some tutorials to get you started with Network Watcher.
