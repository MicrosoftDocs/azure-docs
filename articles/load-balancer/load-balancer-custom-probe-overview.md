---
title: Use Load Balancer custom probes to monitor health status | Microsoft Docs
description: Learn how to use custom probes for Azure Load Balancer to monitor instances behind Load Balancer
services: load-balancer
documentationcenter: na
author: KumudD
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 46b152c5-6a27-4bfc-bea3-05de9ce06a57
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/20/2018
ms.author: kumud
---

# Load Balancer health probes

Azure Load Balancer uses health probes to determine which backend pool instances will receive new flows. You can use health probes to detect the failure of an application on a backend instance. You can also generate a custom response to a health probe and use the health probe for flow control and signal to Load Balancer whether to continue to send new flows or stop sending new flows to a backend instance. This can be used to manage load or planned downtime.

When a health probe fails, Load Balancer stops sending new flows to the respective unhealthy instance. The behavior of new and existing flows depends on whether a flow is TCP or UDP as well as which Load Balancer SKU you are using.  Review [probe down behavior for details](#probedown).

## Health probe types

Health probes can observe any port on a backend instance, including the port on which the actual service is provided. The health probe supports TCP listeners or HTTP endpoints. 

For UDP load balancing, you should generate a custom health probe signal for the backend instance using either a TCP or HTTP health probe.

When using [HA Ports load balancing rules](load-balancer-ha-ports-overview.md) with [Standard Load Balancer](load-balancer-standard-overview.md), all ports are load balanced and a single health probe response should reflect the status of the entire instance.  

You should not NAT or proxy a health probe through the instance which receives the health probe to another instance in your VNet as this can lead to cascading failures in your scenario.

### TCP probe

TCP probes initiate a connection by performing a three-way open TCP handshake with the defined port.  This is then followed by a four-way close TCP handshake.

The minimum probe interval is 5 seconds and the minimum number of unhealthy responses is 2.  The total duration cannot exceed 120 seconds.

A TCP probe fails when:
* The TCP listener on the instance doesn't respond at all during the timeout period.  A probe is marked down based on the number of failed probe requests, which were configured to go unanswered before marking the probe down.
* The probe receives a TCP reset from the instance.

### HTTP probe

HTTP probes establish a TCP connection and issue an HTTP GET with the specified path. 
HTTP probes support relative paths for the HTTP GET. The health probe is marked up when the instance responds with an HTTP status 200 within the timeout period.  HTTP health probes attempt to check the configured health probe port every 15 seconds by default. The minimum probe interval is 5 seconds. The total duration cannot exceed 120 seconds. 


HTTP probes can also be useful if you want to implement your own logic to remove instances from load balancer rotation. For example, you might decide to remove an instance if it's above 90% CPU and return a non-200 HTTP status. 

If you use Cloud Services and have web roles that use w3wp.exe, you also achieve automatic monitoring of your website. Failures in your website code return a non-200 status to the load balancer probe.  The HTTP probe overrides the default guest agent probe. 

An HTTP probe fails when:
* HTTP probe endpoint returns an HTTP response code other than 200 (for example, 403, 404, or 500). This will mark the health probe down immediately. 
* HTTP probe endpoint doesn't respond at all during the a 31 second timeout period. Depending on the timeout value that is set, multiple probe requests might go unanswered before the probe gets marked as not running (that is, before SuccessFailCount probes are sent).
* HTTP probe endpoint closes the connection via a TCP reset.

### Guest agent probe (Classic only)

Cloud service roles (worker roles and web roles) use a guest agent for probe monitoring by default.   You should consider this an option of last resort.  You should always define an health probe explicitly with a TCP or HTTP probe. A guest agent probe is not as effective as explicitly defined probes for most application scenarios.  

A guest agent probe is a check of the guest agent inside the VM. It then listens and responds with an HTTP 200 OK response only when the instance is in the Ready state. (Other states are Busy, Recycling, or Stopping.)

For more information, see [Configure the service definition file (csdef) for health probes](https://msdn.microsoft.com/library/azure/ee758710.aspx) or [Get started by creating a public load balancer for cloud services](load-balancer-get-started-internet-classic-cloud.md#check-load-balancer-health-status-for-cloud-services).

If the guest agent fails to respond with HTTP 200 OK, the load balancer marks the instance as unresponsive. It then stops sending flows to that instance. The load balancer continues to check the instance. 

If the guest agent responds with an HTTP 200, the load balancer sends new flows to that instance again.

When you use a web role, the website code typically runs in w3wp.exe, which isn't monitored by the Azure fabric or guest agent. Failures in w3wp.exe (for example, HTTP 500 responses) aren't reported to the guest agent. Consequently, the load balancer doesn't take that instance out of rotation.

## Probe health

TCP and HTTP health probes are considered healthy and mark the role instance as healthy when:

* The health probe is successful 
first time the VM boots.
* The number for SuccessFailCount (described earlier) defines the value of successful probes that are required to mark the role instance as healthy. If a role instance was removed, the number of successful, successive probes must equal or exceed the value of SuccessFailCount to mark the role instance as running.

> [!NOTE]
> If the health of a role instance fluctuates, the load balancer waits longer before it puts the role instance back in the healthy state. This extra wait time protects the user and the infrastructure and is an intentional policy.

## Probe count and timeout

Probe behavior depends on:

* The number of successful probes that allow an instance to be marked as up.
* The number of failed probes that cause an instance to be marked as down.

The timeout and frequency values set in SuccessFailCount determine whether an instance is confirmed to be running or not running. In the Azure portal, the timeout is set to two times the value of the frequency.

A load balancing rule has a single health probe defined the respective backend pool.

> [!IMPORTANT]
> A load balancer health probe uses the IP address 168.63.129.16. This public IP address facilitates communication to internal platform resources for the bring-your-own-IP Azure Virtual Network scenario. The virtual public IP address 168.63.129.16 is used in all regions, and it doesn't change. We recommend that you allow this IP address in any Azure [Security Groups](../virtual-network/security-overview.md) and local firewall policies. It should not be considered a security risk because only the internal Azure platform can source a packet from that address. If you don't allow this IP address in your firewall policies, unexpected behavior occurs in a variety of scenarios, including failure of your load balanced service. You should also not configure your VNet with an IP address range containing 168.63.129.16.  If you have multiple interfaces on your VM, you need to insure you respond to the probe on the interface you received it on.  This may require uniquely source NAT'ing this address in the VM on a per interface basis.

## <a name="probedown"></a>Probe down behavior

### TCP Connections

New TCP connections will succeed to backend instance which is healthy and has a guest OS and application able to accept a new flow.

If a backend instance's health probe fails, established TCP connections to this backend instance continue.

If all probes for all instances in a backend pool fail, no new flows will be sent to the backend pool. Standard Load Balancer will permit established TCP flows to continue.  Basic Load Balancer will terminate all exisiting TCP flows to the backend pool.
 
Because the flow is always between the client and the VM's guest OS, a pool with all probes down will cause a frontend to not respond to TCP connection open attempts as there is no healthy backend instance to receive the flow.

### UDP datagrams

UDP datagrams will be delivered to healthy backend instances.

UDP is connectionless and there is no flow state tracked for UDP. If any backend instance's health probe fails, existing UDP flows may move to another healthy instance in the backend pool.

If all probes for all instances in a backend pool fail, existing UDP flows will terminate for Basic and Standard Load Balancers.

## Monitoring

All [Standard Load Balancer](load-balancer-standard-overview.md) exposes health probe status as multi-dimensional metrics per instance via Azure Monitor.

Basic Load Balancer exposes health probe status per backend pool via Log Analytics.  This is only available for public Basic Load Balancers and not available for internal Basic Load Balancers.  You can use [log analytics](load-balancer-monitor-log.md) to check on the public load balancer probe health status and probe count. Logging can be used with Power BI or Azure Operational Insights to provide statistics about load balancer health status.

## Limitations

-  HTTP health probe does not support TLS (HTTPS).  Use a TCP probe to port 443 instead.

## Next steps

- [Get started creating a public load balancer in Resource Manager by using PowerShell](load-balancer-get-started-internet-arm-ps.md)
- [REST API for health probes](https://docs.microsoft.com/en-us/rest/api/load-balancer/loadbalancerprobes/get)

