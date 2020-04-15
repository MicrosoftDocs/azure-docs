---
title: Health probes to scale and provide HA for your service
titleSuffix: Azure Load Balancer
description: In this article, learn how to use health probes to monitor instances behind Azure Load Balancer
services: load-balancer
documentationcenter: na
author: asudbring
manager: kumudD
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.custom: seodec18
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/17/2019
ms.author: allensu
---

# Load Balancer health probes

When using load-balancing rules with Azure Load Balancer, you need to specify health probes to allow Load Balancer to detect the backend endpoint status.  The configuration of the health probe and probe responses determine which backend pool instances will receive new flows. You can use health probes to detect the failure of an application on a backend endpoint. You can also generate a custom response to a health probe and use the health probe for flow control to manage load or planned downtime. When a health probe fails, Load Balancer will stop sending new flows to the respective unhealthy instance. Outbound connectivity is not impacted, only inbound connectivity is impacted.

Health probes support multiple protocols. The availability of a specific health probe protocol varies by Load Balancer SKU.  Additionally, the behavior of the service varies by Load Balancer SKU as shown in this table:

| | Standard SKU | Basic SKU |
| --- | --- | --- |
| [Probe types](#types) | TCP, HTTP, HTTPS | TCP, HTTP |
| [Probe down behavior](#probedown) | All probes down, all TCP flows continue. | All probes down, all TCP flows expire. | 


>[!IMPORTANT]
>Review this document in its entirety, including important [design guidance](#design) below to create a reliable service.

>[!IMPORTANT]
>Load Balancer health probes originate from the IP address 168.63.129.16 and must not be blocked for probes to mark up your instance.  Review [probe source IP address](#probesource) for details.

>[!IMPORTANT]
>Regardless of configured time-out threshold, HTTP(S) Load Balancer health probes will automatically probe down an instance if the server returns any status code that is not HTTP 200 OK or if the connection is terminated via TCP reset.

## <a name="probes"></a>Probe configuration

Health probe configuration consists out of the following elements:

- Duration of the interval between individual probes
- Number of probe responses which have to be observed before the probe transitions to a different state
- Protocol of the probe
- Port of the probe
- HTTP path to use for HTTP GET when using HTTP(S) probes

>[!NOTE]
>A probe definition is not mandatory or checked for when using Azure PowerShell, Azure CLI, Templates or API. Probe validation tests are only done when using the Azure Portal.

## Understanding application signal, detection of the signal, and reaction of the platform

The number of probe responses applies to both

- the number of successful probes that allow an instance to be marked as up, and
- the number of timed-out probes that cause an instance to be marked as down.

The timeout and interval values specified determine whether an instance will be marked as up or down.  The duration of the interval multiplied by the number of probe responses determines the duration during which the probe responses have to be detected.  And the service will react after the required probes have been achieved.

We can illustrate the behavior further with an example. If you have set the number of probe responses to 2 and the interval to 5 seconds, this means 2 probe time-out failures must be observed within a 10 second interval.  Because the time at which a probe is sent is not synchronized when your application may change state, we can bound the time to detect by two scenarios:

1. If your application starts producing a time-out probe response just before the first probe arrives, the detection of these events will take 10 seconds (2 x 5 second intervals) plus the duration of the the application starting to signal a time-out to when the the first probe arrives.  You can assume this detection to take slightly over 10 seconds.
2. If your application starts producing a time-out probe response just after the first probe arrives, the detection of these events will not begin until the next probe arrives (and times out) plus another 10 seconds (2 x 5 second intervals).  You can assume this detection to take just under 15 seconds.

For this example, once detection has occurred, the platform will then take a small amount of time to react to this change.  This means a depending on 

1. when the application begins changing state and
2. when this change is detected and met the required criteria (number of probes sent at the specified interval) and
3. when the detection has been communicated across the platform 

you can assume the reaction to a time-out probe response will take between a minimum of just over 10 seconds and a maximum of slightly over 15 seconds to react to a change in the signal from the application.  This example is provided to illustrate what is taking place, however, it is not possible to forecast an exact duration beyond the above rough guidance illustrated in this example.

>[!NOTE]
>The health probe will probe all running instances in the backend pool. If an instance is stopped it will not be probed until it has been started again.

## <a name="types"></a>Probe types

The protocol used by the health probe can be configured to one of the following:

- [TCP listeners](#tcpprobe)
- [HTTP endpoints](#httpprobe)
- [HTTPS endpoints](#httpsprobe)

The available protocols depend on the Load Balancer SKU used:

|| TCP | HTTP | HTTPS |
| --- | --- | --- | --- |
| Standard SKU | 	&#9989; | 	&#9989; | 	&#9989; |
| Basic SKU | 	&#9989; | 	&#9989; | &#10060; |

### <a name="tcpprobe"></a> TCP probe

TCP probes initiate a connection by performing a three-way open TCP handshake with the defined port.  TCP probes terminate a connection with a four-way close TCP handshake.

The minimum probe interval is 5 seconds and the minimum number of unhealthy responses is 2.  The total duration of all intervals cannot exceed 120 seconds.

A TCP probe fails when:
* The TCP listener on the instance doesn't respond at all during the timeout period.  A probe is marked down based on the number of timed-out probe requests, which were configured to go unanswered before marking down the probe.
* The probe receives a TCP reset from the instance.

The following illustrates how you could express this kind of probe configuration in a Resource Manager template:

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

>[!NOTE]
>HTTPS probe is only available for [Standard Load Balancer](load-balancer-standard-overview.md).

HTTP and HTTPS probes build on the TCP probe and issue an HTTP GET with the specified path. Both of these probes support relative paths for the HTTP GET. HTTPS probes are the same as HTTP probes with the addition of a Transport Layer Security (TLS, formerly known as SSL) wrapper. The health probe is marked up when the instance responds with an HTTP status 200 within the timeout period.  The health probe attempts to check the configured health probe port every 15 seconds by default. The minimum probe interval is 5 seconds. The total duration of all intervals cannot exceed 120 seconds.

HTTP / HTTPS probes can also be useful to implement your own logic to remove instances from load balancer rotation if the probe port is also the listener for the service itself. For example, you might decide to remove an instance if it's above 90% CPU and return a non-200 HTTP status. 

> [!NOTE] 
> The HTTPS Probe requires the use of certificates based that have a minimum signature hash of SHA256 in the entire chain.

If you use Cloud Services and have web roles that use w3wp.exe, you also achieve automatic monitoring of your website. Failures in your website code return a non-200 status to the load balancer probe.

An HTTP / HTTPS probe fails when:
* Probe endpoint returns an HTTP response code other than 200 (for example, 403, 404, or 500). This will mark down the health probe immediately. 
* Probe endpoint doesn't respond at all during the minimum of the probe interval and 30-second timeout period. Multiple probe requests might go unanswered before the probe gets marked as not running and until the sum of all timeout intervals has been reached.
* Probe endpoint closes the connection via a TCP reset.

The following illustrates how you could express this kind of probe configuration in a Resource Manager template:

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

Cloud service roles (worker roles and web roles) use a guest agent for probe monitoring by default.  A guest agent probe is a last resort configuration.  Always use a health probe explicitly with a TCP or HTTP probe. A guest agent probe is not as effective as explicitly defined probes for most application scenarios.

A guest agent probe is a check of the guest agent inside the VM. It then listens and responds with an HTTP 200 OK response only when the instance is in the Ready state. (Other states are Busy, Recycling, or Stopping.)

For more information, see [Configure the service definition file (csdef) for health probes](https://msdn.microsoft.com/library/azure/ee758710.aspx) or [Get started by creating a public load balancer for cloud services](https://docs.microsoft.com/azure/load-balancer/load-balancer-get-started-internet-classic-cloud#check-load-balancer-health-status-for-cloud-services).

If the guest agent fails to respond with HTTP 200 OK, the load balancer marks the instance as unresponsive. It then stops sending flows to that instance. The load balancer continues to check the instance. 

If the guest agent responds with an HTTP 200, the load balancer sends new flows to that instance again.

When you use a web role, the website code typically runs in w3wp.exe, which isn't monitored by the Azure fabric or guest agent. Failures in w3wp.exe (for example, HTTP 500 responses) aren't reported to the guest agent. Consequently, the load balancer doesn't take that instance out of rotation.

<a name="health"></a>
## <a name="probehealth"></a>Probe up behavior

TCP, HTTP, and HTTPS health probes are considered healthy and mark the backend endpoint as healthy when:

* The health probe is successful once after the VM boots.
* The specified number of probes required to mark the backend endpoint as healthy has been achieved.

Any backend endpoint which has achieved a healthy state is eligible for receiving new flows.  

> [!NOTE]
> If the health probe fluctuates, the load balancer waits longer before it puts the backend endpoint back in the healthy state. This extra wait time protects the user and the infrastructure and is an intentional policy.

## <a name="probedown"></a>Probe down behavior

### TCP connections

New TCP connections will succeed to remaining healthy backend endpoint.

If a backend endpoint's health probe fails, established TCP connections to this backend endpoint continue.

If all probes for all instances in a backend pool fail, no new flows will be sent to the backend pool. Standard Load Balancer will permit established TCP flows to continue.  Basic Load Balancer will terminate all existing TCP flows to the backend pool.
 
Load Balancer is a pass through service (does not terminate TCP connections) and the flow is always between the client and the VM's guest OS and application. A pool with all probes down will cause a frontend to not respond to TCP connection open attempts (SYN) as there is no healthy backend endpoint to receive the flow and respond with an SYN-ACK.

### UDP datagrams

UDP datagrams will be delivered to healthy backend endpoints.

UDP is connectionless and there is no flow state tracked for UDP. If any backend endpoint's health probe fails, existing UDP flows will move to another healthy instance in the backend pool.

If all probes for all instances in a backend pool fail, existing UDP flows will terminate for Basic and Standard Load Balancers.

<a name="source"></a>
## <a name="probesource"></a>Probe source IP address

Load Balancer uses a distributed probing service for its internal health model. The probing service resides on each host where VMs and can be programmed on-demand to generate health probes per the customer's configuration. The health probe traffic is directly between the probing service that generates the health probe and the customer VM. All Load Balancer health probes originate from the IP address 168.63.129.16 as their source.  You can use  IP address space inside of a VNet that is not RFC1918 space.  Using a globally reserved, Microsoft owned IP address reduces the chance of an IP address conflict with the IP address space you use inside the VNet.  This IP address is the same in all regions and does not change and is not a security risk because only the internal Azure platform component can source a packet from this IP address. 

The AzureLoadBalancer service tag identifies this source IP address in your [network security groups](../virtual-network/security-overview.md) and permits health probe traffic by default.

In addition to Load Balancer health probes, the [following operations use this IP address](../virtual-network/what-is-ip-address-168-63-129-16.md):

- Enables the VM Agent to communicating with the platform to signal it is in a “Ready” state
- Enables communication with the DNS virtual server to provide filtered name resolution to customers that do not define custom DNS servers.  This filtering ensures that customers can only resolve the hostnames of their deployment.
- Enables the VM to obtain a dynamic IP address from the DHCP service in Azure.

## <a name="design"></a> Design guidance

Health probes are used to make your service resilient and allow it to scale. A misconfiguration or bad design pattern can impact the availability and scalability of your service. Review this entire document and consider what the impact to your scenario is when this probe response is marked down or marked up, and how it impacts the availability of your application scenario.

When you design the health model for your application, you should probe a port on a backend endpoint that reflects the health of that instance __and__ the application service you are providing.  The application port and the probe port are not required to be the same.  In some scenarios, it may be desirable for the probe port to be different than the port your application provides service on.  

Sometimes it can be useful for your application to generate a health probe response to not only detect your application health, but also signal directly to Load Balancer whether your instance should receive or not receive new flows.  You can manipulate the probe response to allow your application to create backpressure and throttle delivery of new flows to an instance by failing the health probe or prepare for maintenance of your application and initiate draining your scenario.  When using Standard Load Balancer, a [probe down](#probedown) signal will always allow TCP flows to continue until idle timeout or connection closure. 

For UDP load balancing, you should generate a custom health probe signal from the backend endpoint and use either a TCP, HTTP, or HTTPS health probe targeting the corresponding listener to reflect the health of your UDP application.

When using [HA Ports load-balancing rules](load-balancer-ha-ports-overview.md) with [Standard Load Balancer](load-balancer-standard-overview.md), all ports are load balanced and a single health probe response must reflect the status of the entire instance.

Do not translate or proxy a health probe through the instance that receives the health probe to another instance in your VNet as this  configuration can lead to cascading failures in your scenario.  Consider the following scenario: a set of third-party appliances is deployed in the backend pool of a Load Balancer resource to provide scale and redundancy for the appliances and the health probe is configured to probe a port that the third-party appliance proxies or translates to other virtual machines behind the appliance.  If you probe the same port you are using to translate or proxy requests to the other virtual machines behind the appliance, any probe response from a single virtual machine behind the appliance will mark the appliance itself dead. This configuration can lead to a cascading failure of the entire application scenario as a result of a single backend endpoint behind the appliance.  The trigger can be an intermittent probe failure that will cause Load Balancer to mark down the original destination (the appliance instance) and in turn can disable your entire application scenario. Probe the health of the appliance itself instead. The selection of the probe to determine the health signal is an important consideration for network virtual appliances (NVA) scenarios and you must consult your application vendor for what the appropriate health signal is for such scenarios.

If you don't allow the [source IP](#probesource) of the probe in your firewall policies, the health probe will fail as it is unable to reach your instance.  In turn, Load Balancer will mark down your instance due to the health probe failure.  This misconfiguration can cause your load balanced application scenario to fail.

For Load Balancer's health probe to mark up your instance, you **must** allow this IP address in any Azure [network security groups](../virtual-network/security-overview.md) and local firewall policies.  By default, every network security group includes the [service tag](../virtual-network/security-overview.md#service-tags) AzureLoadBalancer to permit health probe traffic.

If you wish to test a health probe failure or mark down an individual instance, you can use a [network security groups](../virtual-network/security-overview.md) to explicitly block the health probe (destination port or [source IP](#probesource)) and simulate the failure of a probe.

Do not configure your VNet with the Microsoft owned IP address range that contains 168.63.129.16.  Such configurations will collide with the IP address of the health probe and can cause your scenario to fail.

If you have multiple interfaces on your VM, you need to insure you respond to the probe on the interface you received it on.  You may need to source network address translate this address in the VM on a per interface basis.

Do not enable [TCP timestamps](https://tools.ietf.org/html/rfc1323).  Enabling TCP timestamps can cause health probes to fail due to TCP packets being dropped by the VM's guest OS TCP stack, which results in Load Balancer marking down the respective endpoint.  TCP timestamps are routinely enabled by default on security hardened VM images and must be disabled.

## Monitoring

Both public and internal [Standard Load Balancer](load-balancer-standard-overview.md) expose per endpoint and backend endpoint health probe status as multi-dimensional metrics through Azure Monitor. These metrics can be consumed by other Azure services or partner applications. 

Basic public Load Balancer exposes health probe status summarized per backend pool via Azure Monitor logs.  Azure Monitor logs are not available for internal Basic Load Balancers.  You can use [Azure Monitor logs](load-balancer-monitor-log.md) to check on the public load balancer probe health status and probe count. Logging can be used with Power BI or Azure Operational Insights to provide statistics about load balancer health status.

## Limitations

- HTTPS probes do not support mutual authentication with a client certificate.
- You should assume Health probes will fail when TCP timestamps are enabled.

## Next steps

- Learn more about [Standard Load Balancer](load-balancer-standard-overview.md)
- [Get started creating a public load balancer in Resource Manager by using PowerShell](quickstart-create-standard-load-balancer-powershell.md)
- [REST API for health probes](https://docs.microsoft.com/rest/api/load-balancer/loadbalancerprobes/)
- Request new health probe abilities with [Load Balancer's Uservoice](https://aka.ms/lbuservoice)
