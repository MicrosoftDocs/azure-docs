---
title: Use Load Balancer health probes to protect your service | Microsoft Docs
description: Learn how to use health probes to monitor instances behind Load Balancer
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
ms.date: 09/04/2018
ms.author: kumud
---

# Load Balancer health probes

Azure Load Balancer uses health probes to determine which backend pool instances will receive new flows. You can use health probes to detect the failure of an application on a backend instance. You can also generate a custom response to a health probe and use the health probe for flow control and signal to Load Balancer whether to continue to send new flows or stop sending new flows to a backend instance. This can be used to manage load or planned downtime. When a health probe fails, Load Balancer stops sending new flows to the respective unhealthy instance.

The types of health probes available and the way health probes behave depends on which SKU of Load Balancer you are using. For example, the behavior of new and existing flows depends on whether a flow is TCP or UDP as well as which Load Balancer SKU you are using.

| | Standard SKU | Basic SKU |
| --- | --- | --- |
| [Probe types](#types) | TCP, HTTP, HTTPS | TCP, HTTP |
| [Probe down behavior](#probedown) | All probes down, all TCP flows continue. | All probes down, all TCP flows terminate. | 

> [!IMPORTANT]
> Load Balancer health probes originate from the IP address 168.63.129.16 and must not be blocked for probes to mark your instance up.  Review [probe source IP address](#probesource) for details.

## <a name="types"></a>Probe types

Health probes can observe any port on a backend instance, including the port on which the actual service is provided. The health probe protocol can be configured for three different types of health probes:

- [TCP listeners](#tcpprobe)
- [HTTP endpoints](#httpprobe)
- [HTTPS endpoints](#httpsprobe)

The available types of health probes vary depending on the Load Balancer SKU selected:

|| TCP | HTTP | HTTPS |
| --- | --- | --- | --- |
| Standard SKU | 	&#9989; | 	&#9989; | 	&#9989; |
| Basic SKU | 	&#9989; | 	&#9989; | &#10060; |

For UDP load balancing, you should generate a custom health probe signal for the backend instance using either a TCP, HTTP, or HTTPS health probe.

When using [HA Ports load balancing rules](load-balancer-ha-ports-overview.md) with [Standard Load Balancer](load-balancer-standard-overview.md), all ports are load balanced and a single health probe response must reflect the status of the entire instance.  

You should not NAT or proxy a health probe through the instance which receives the health probe to another instance in your VNet as this can lead to cascading failures in your scenario.

If you wish to test a health probe failure or mark down an individual instance, you can use a Security Group to explicit block the health probe (destination or [source](#probesource)).

### <a name="tcpprobe"></a> TCP probe

TCP probes initiate a connection by performing a three-way open TCP handshake with the defined port.  This is then followed by a four-way close TCP handshake.

The minimum probe interval is 5 seconds and the minimum number of unhealthy responses is 2.  The total duration cannot exceed 120 seconds.

A TCP probe fails when:
* The TCP listener on the instance doesn't respond at all during the timeout period.  A probe is marked down based on the number of failed probe requests, which were configured to go unanswered before marking the probe down.
* The probe receives a TCP reset from the instance.

#### Resource Manager template

```json
    {
      "name": "tcp",
      "properties": {
        "protocol": "Tcp",
        "port": 1234,
        "intervalInSeconds": 5,
        "numberOfProbes": 2
      },
```

### <a name="httpprobe"></a> <a name="httpsprobe"></a> HTTP / HTTPS probe

> [!NOTE]
> HTTPS probe is only available for [Standard Load Balancer](load-balancer-standard-overview.md).

HTTP and HTTPS probes establish a TCP connection and issue an HTTP GET with the specified path. Both of these probes support relative paths for the HTTP GET. HTTPS probes are the same as HTTP probes with the addition of a Transport Layer Security (TLS, formerly known as SSL) wrapper. The health probe is marked up when the instance responds with an HTTP status 200 within the timeout period.  These health probes attempt to check the configured health probe port every 15 seconds by default. The minimum probe interval is 5 seconds. The total duration cannot exceed 120 seconds. 

HTTP / HTTPS probes can also be useful if you want to implement your own logic to remove instances from load balancer rotation. For example, you might decide to remove an instance if it's above 90% CPU and return a non-200 HTTP status. 

If you use Cloud Services and have web roles that use w3wp.exe, you also achieve automatic monitoring of your website. Failures in your website code return a non-200 status to the load balancer probe.  The HTTP probe overrides the default guest agent probe. 

An HTTP / HTTPS probe fails when:
* Probe endpoint returns an HTTP response code other than 200 (for example, 403, 404, or 500). This will mark the health probe down immediately. 
* Probe endpoint doesn't respond at all during the a 31 second timeout period. Depending on the timeout value that is set, multiple probe requests might go unanswered before the probe gets marked as not running (that is, before SuccessFailCount probes are sent).
* Probe endpoint closes the connection via a TCP reset.

#### Resource Manager templates

```json
    {
      "name": "http",
      "properties": {
        "protocol": "Http",
        "port": 80,
        "requestPath": "/",
        "intervalInSeconds": 5,
        "numberOfProbes": 2
      },
```

```json
    {
      "name": "https",
      "properties": {
        "protocol": "Https",
        "port": 443,
        "requestPath": "/",
        "intervalInSeconds": 5,
        "numberOfProbes": 2
      },
```

### <a name="guestagent"></a>Guest agent probe (Classic only)

Cloud service roles (worker roles and web roles) use a guest agent for probe monitoring by default.   You should consider this an option of last resort.  You should always define an health probe explicitly with a TCP or HTTP probe. A guest agent probe is not as effective as explicitly defined probes for most application scenarios.  

A guest agent probe is a check of the guest agent inside the VM. It then listens and responds with an HTTP 200 OK response only when the instance is in the Ready state. (Other states are Busy, Recycling, or Stopping.)

For more information, see [Configure the service definition file (csdef) for health probes](https://msdn.microsoft.com/library/azure/ee758710.aspx) or [Get started by creating a public load balancer for cloud services](load-balancer-get-started-internet-classic-cloud.md#check-load-balancer-health-status-for-cloud-services).

If the guest agent fails to respond with HTTP 200 OK, the load balancer marks the instance as unresponsive. It then stops sending flows to that instance. The load balancer continues to check the instance. 

If the guest agent responds with an HTTP 200, the load balancer sends new flows to that instance again.

When you use a web role, the website code typically runs in w3wp.exe, which isn't monitored by the Azure fabric or guest agent. Failures in w3wp.exe (for example, HTTP 500 responses) aren't reported to the guest agent. Consequently, the load balancer doesn't take that instance out of rotation.

## <a name="probehealth"></a>Probe health

TCP, HTTP, and HTTPS health probes are considered healthy and mark the role instance as healthy when:

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

## <a name="probedown"></a>Probe down behavior

### TCP connections

New TCP connections will succeed to backend instance which is healthy and has a guest OS and application able to accept a new flow.

If a backend instance's health probe fails, established TCP connections to this backend instance continue.

If all probes for all instances in a backend pool fail, no new flows will be sent to the backend pool. Standard Load Balancer will permit established TCP flows to continue.  Basic Load Balancer will terminate all exisiting TCP flows to the backend pool.
 
Because the flow is always between the client and the VM's guest OS, a pool with all probes down will cause a frontend to not respond to TCP connection open attempts as there is no healthy backend instance to receive the flow.

### UDP datagrams

UDP datagrams will be delivered to healthy backend instances.

UDP is connectionless and there is no flow state tracked for UDP. If any backend instance's health probe fails, existing UDP flows may move to another healthy instance in the backend pool.

If all probes for all instances in a backend pool fail, existing UDP flows will terminate for Basic and Standard Load Balancers.

## <a name="probesource"></a>Probe source IP address

Load Balancer uses a distributed probing service for its internal health model. Each host where VMs reside can be programmed to generate health probes per the customer's configuration. The health probe traffic is directly between the infrastructure component which generates the health probe and the customer VM. All Load Balancer health probes originate from the IP address 168.63.129.16 as their source.  When you bring your own IP addresses to Azure's Virtual Network, this health probe source IP address is guaranteed to be unique as it is globally reserved for Microsoft.  This address is the same in all regions and does not change. It should not be considered a security risk because only the internal Azure platform can source a packet from this IP address. 

In addition to Load Balancer health probes, the following operations use this IP address:

- Enables the VM Agent to communicating with the platform to signal it is in a “Ready” state
- Enables communication with the DNS virtual server to provide filtered name resolution to customers that do not define custom DNS servers.  This filtering ensures that customers can only resolve the hostnames of their deployment.

For Load Balancer's health probe to mark your instance up, you **must** allow this IP address in any Azure [Security Groups](../virtual-network/security-overview.md) and local firewall policies.

If you don't allow this IP address in your firewall policies, the health probe will fail as it is unable to reach your instance.  In turn, Load Balancer will mark down your instance due to the health probe failure.  This can cause your load balanced service to fail. 

You should also not configure your VNet with the Microsoft owned IP address range which contains 168.63.129.16.  This will collide with the IP address of the health probe.

If you have multiple interfaces on your VM, you need to insure you respond to the probe on the interface you received it on.  This may require uniquely source NAT'ing this address in the VM on a per interface basis.

## Monitoring

Both public and internal [Standard Load Balancer](load-balancer-standard-overview.md) expose per endpoint and backend instance health probe status as multi-dimensional metrics through Azure Monitor. This can then be consumed by other Azure services or 3rd party applications. 

Basic public Load Balancer exposes health probe status summarized per backend pool via Log Analytics.  This is not available for internal Basic Load Balancers.  You can use [log analytics](load-balancer-monitor-log.md) to check on the public load balancer probe health status and probe count. Logging can be used with Power BI or Azure Operational Insights to provide statistics about load balancer health status.

## Limitations

-  HTTPS probes do not support mutual authentication with a client certificate.
-  SDK, PowerShell do not support HTTPS probes at this time.

## Next steps

- Learn more about [Standard Load Balancer](load-balancer-standard-overview.md)
- [Get started creating a public load balancer in Resource Manager by using PowerShell](load-balancer-get-started-internet-arm-ps.md)
- [REST API for health probes](https://docs.microsoft.com/rest/api/load-balancer/loadbalancerprobes/)
- Request new health probe abilities with [Load Balancer's Uservoice](https://aka.ms/lbuservoice)
