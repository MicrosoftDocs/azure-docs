---
title: Azure Load Balancer health probes
description: Azure Load Balancer health probes and configuration for detecting application failures, managing load, and planned downtime. Includes probe properties and SKU comparison.
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: concept-article
ms.date: 12/06/2024
ms.author: mbender
# Customer intent: As a network engineer, I want to understand how to configure health probes for Azure Load Balancer so that I can detect application failures, manage load, and plan for downtime.
---

# Azure Load Balancer health probes

An Azure Load Balancer health probe is a feature that detects the health status of your application instances. It sends a request to the instances to check if they're available and responding to requests. The health probe can be configured to use different protocols such as TCP, HTTP, or HTTPS. It's an important feature because it helps you to detect application failures, manage load, and plan for downtime.

Azure Load Balancer rules require a health probe to detect the endpoint status. The configuration of the health probe and probe responses determines which backend pool instances receive new connections. Use health probes to detect the failure of an application. Generate a custom response to a health probe. Use the health probe for flow control to manage load or planned downtime. When a health probe fails, the load balancer stops sending new connections to the respective unhealthy instance. Outbound connectivity isn't affected, only inbound.

## Probe protocols

Health probes support multiple protocols. The availability of a specific health probe protocol varies by Load Balancer SKU. Additionally, the behavior of the service varies by Load Balancer SKU as shown in this table:

| SKU | [Probe protocol](#probe-protocol) | [Probe down behavior](#probe-down-behavior) |
| --- | --- | --- |
| Standard | TCP, HTTP, HTTPS | All probes down, all TCP flows continue. |
| Basic | TCP, HTTP | All probes down, all TCP flows expire. |

## Probe properties

Health probes have the following properties:

| Health Probe property name | Details|
| --- | --- | 
| Name | Name of the health probe. This is a name you get to define for your health probe |
| Protocol | Protocol of health probe. This is the protocol type you would like the health probe to use. Options are: TCP, HTTP, HTTPS |
| Port | Port of the health probe. The destination port you would like the health probe to use when it connects to the virtual machine to check its health |
| Interval (seconds) | Interval of health probe. The amount of time (in seconds) between different probes on two consecutive health check attempts to the virtual machine |
| Used by | The list of load balancer rules using this specific health probe. You should have at least one rule using the health probe for it to be effective |

## Probe configuration

Health probe configuration consists of the following elements:

| Health Probe configuration | Details |
| --- | --- | 
| Protocol | Protocol of health probe. This is the protocol type you would like the health probe to use. Available options are: TCP, HTTP, HTTPS |
| Port | Port of the health probe. The destination port you would like the health probe to use when it connects to the virtual machine to check the virtual machine's health status. You must ensure that the virtual machine is also listening on this port (that is, the port is open). |
| Interval | Interval of health probe. The amount of time (in seconds) between consecutive health check attempts to the virtual machine |

## Probe protocol

The protocol used by the health probe can be configured to one of the following options: TCP, HTTP, HTTPS.

| Scenario | TCP probe | HTTP/HTTPS probe |
| --- | --- | --- | 
| Overview | TCP probes initiate a connection by performing a three-way open TCP handshake with the defined port. TCP probes terminate a connection with a four-way close TCP handshake. | HTTP and HTTPS issue an HTTP GET with the specified path. Both of these probes support relative paths for the HTTP GET. HTTPS probes are the same as HTTP probes with the addition of a Transport Layer Security (TLS). HTTP / HTTPS probes can be useful to implement your own logic to remove instances from load balancer if the probe port is also the listener for the service. |
| Probe failure behavior | A TCP probe fails when:</br> 1. The TCP listener on the instance doesn't respond at all during the timeout period. A probe is marked down based on the number of timed-out probe requests, which were configured to go unanswered before marking down the probe.</br> 2. The probe receives a TCP reset from the instance. | An HTTP/HTTPS probe fails when:</br> 1. Probe endpoint returns an HTTP response code other than 200 (for example, 403, 404, or 500).</br> 2. Probe endpoint doesn't respond at all during the minimum of the probe interval and 30-second timeout period. Multiple probe requests can go unanswered before the probe gets marked as not running and until the sum of all timeout intervals is reached.</br> 3. Probe endpoint closes the connection via a TCP reset.
| Probe up behavior | TCP health probes are considered healthy and mark the backend endpoint as healthy when:</br> 1. The health probe is successful once after the VM boots.</br> 2. Any backend endpoint in a healthy state is eligible for receiving new flows. | The health probe is marked up when the instance responds with an HTTP status 200 within the timeout period. HTTP/HTTPS health probes are considered healthy and mark the backend endpoint as healthy when:</br> 1. The health probe is successful once after the VM boots.</br> 2. Any backend endpoint in a healthy state is eligible for receiving new flows.

> [!NOTE] 
> The HTTPS probe requires the use of certificates based that have a minimum signature hash of SHA256 in the entire chain.

## Probe down behavior
| Scenario | TCP connections | UDP datagrams |
| --- | --- | --- | 
| Single instance probes down |  New TCP connections succeed to remaining healthy backend endpoint. Established TCP connections to this backend endpoint continue. |   Existing UDP flows move to another healthy instance in the backend pool.|
| All instances probe down | No new flows are sent to the backend pool. Standard Load Balancer allows established TCP flows to continue given that a backend pool has more than one backend instance. Basic Load Balancer terminates all existing TCP flows to the backend pool. |  All existing UDP flows terminate. |

## Probe interval & timeout

The interval value determines how frequently the health probe checks for a response from your backend pool instances. If the health probe fails, your backend pool instances are immediately marked as unhealthy. If the health probe succeeds on the next healthy probe up, Azure Load Balancer marks your backend pool instances as healthy. The health probe attempts to check the configured health probe port every 5 seconds by default in the Azure portal, but can be explicitly set to another value.

In order to ensure a timely response is received, HTTP/S health probes have built-in timeouts. The following are the timeout durations for TCP and HTTP/S probes:
- TCP probe timeout duration: N/A (probes will fail once the configured probe interval duration is passed and the next probe is sent)
- HTTP/S probe timeout duration: 30 seconds

For HTTP/S probes, if the configured interval is longer than the above timeout period, the health probe times out and fails if no response is received during the timeout period. For example, if an HTTP health probe is configured with a probe interval of 120 seconds (every 2 minutes), and no probe response is received within the first 30 seconds, the probe reaches its timeout period and fails. When the configured interval is shorter than the above timeout period, the health probe will fail if no response is received before the configured interval period completes and the next probe will be sent immediately.

## Design guidance

- When you design the health model for your application, probe a port on a backend endpoint that reflects the health of the instance and the application service. The application port and the probe port aren't required to be the same. In some scenarios, it can be desirable for the probe port to be different than the port your application uses but generally it's recommended that probes use the same port.

- It can be useful for your application to generate a health probe response, and signal the load balancer whether your instance should receive new connections. You can manipulate the probe response to throttle delivery of new connections to an instance by failing the health probe. You can prepare for maintenance of your application and initiate draining of connections to your application. A [probe down](#probe-down-behavior) signal always allows TCP flows to continue until idle timeout or connection closure in a Standard Load Balancer. 

- For a UDP load-balanced application, generate a custom health probe signal from the backend endpoint. Use either TCP, HTTP, or HTTPS for the health probe that matches the corresponding listener.

- [HA Ports load-balancing rule](load-balancer-ha-ports-overview.md) with [Standard Load Balancer](./load-balancer-overview.md). All ports are load balanced and a single health probe response must reflect the status of the entire instance.

- Don't translate or proxy a health probe through the instance that receives the health probe to another instance in your virtual network. This configuration can lead to failures in your scenario. For example: A set of third-party appliances is deployed in the backend pool of a load balancer to provide scale and redundancy for the appliances. The health probe is configured to probe a port that the third-party appliance proxies or translates to other virtual machines behind the appliance. If you probe the same port used to translate or proxy requests to the other virtual machines behind the appliance, any probe response from a single virtual machine marks down the appliance. This configuration can lead to a cascading failure of the application. The trigger can be an intermittent probe failure that causes the load balancer to mark down the appliance instance. This action can disable your application. Probe the health of the appliance itself. The selection of the probe to determine the health signal is an important consideration for network virtual appliances (NVA) scenarios. Consult your application vendor for the appropriate health signal is for such scenarios.

- If you have multiple interfaces configured in your virtual machine, ensure you respond to the probe on the interface you received it on. You may need to source network address translate this address in the VM on a per interface basis.

- A probe definition isn't mandatory or checked for when using Azure PowerShell, Azure CLI, Templates, or API. Probe validation tests are only done when using the Azure portal.

- If the health probe fluctuates, the load balancer waits longer before it puts the backend endpoint back in the healthy state. This extra wait time protects the user and the infrastructure and is an intentional policy.

- Ensure your virtual machine instances are running. For each running instance in the backend pool, the health probe checks for availability. If an instance is stopped, it will not be probed until it has been started again.

- Don't configure your virtual network with the Microsoft owned IP address range that contains 168.63.129.16. The configuration collides with the IP address of the health probe and can cause your scenario to fail.
 
- To test a health probe failure or mark down an individual instance, use a [network security group](../virtual-network/network-security-groups-overview.md) to explicitly block the health probe. Create an NSG rule to block the destination port or [source IP](#probe-source-ip-address) to simulate the failure of a probe.

- Unlike load balancing rules, inbound NAT rules don't need a health probe attached to it.

- It isn't recommended to block the Azure Load Balancer health probe IP or port with NSG rules. This is an unsupported scenario and can cause the NSG rules to take delayed effect, resulting in the health probes to inaccurately represent the availability of your backend instances.

## Monitoring

[Standard Load Balancer](./load-balancer-overview.md) exposes per endpoint and backend endpoint health probe status through [Azure Monitor](./monitor-load-balancer.md). Other Azure services or partner applications can consume these metrics. Azure Monitor logs aren't supported for Basic Load Balancer.

## Probe source IP address

For Azure Load Balancer's health probe to mark up your instance, you must allow 168.63.129.16 IP address in any Azure [network security groups](../virtual-network/network-security-groups-overview.md) and local firewall policies. The `AzureLoadBalancer` service tag identifies this source IP address in your [network security groups](../virtual-network/network-security-groups-overview.md) and permits health probe traffic by default. You can learn more about this IP [here](../virtual-network/what-is-ip-address-168-63-129-16.md).

If you don't allow the [source IP](#probe-source-ip-address) of the probe in your firewall policies, the health probe fails as it is unable to reach your instance. In turn, Azure Load Balancer marks your instance as -down- due to the health probe failure. This misconfiguration can cause your load balanced application scenario to fail. All IPv4 Load Balancer health probes originate from the IP address 168.63.129.16 as their source. IPv6 probes use a link-local address (fe80::1234:5678:9abc) as their source. For a dual-stack Azure Load Balancer, you must [configure a Network Security Group](./virtual-network-ipv4-ipv6-dual-stack-standard-load-balancer-cli.md#create-a-network-security-group-rule-for-inbound-and-outbound-connections) for the IPv6 health probe to function.

 ## Limitations

- HTTPS probes don't support mutual authentication with a client certificate.

- HTTP probes don't support using hostnames for probes backends.

- Enabling TCP timestamps can cause throttling or other performance issues, which can then cause health probes to time out.

- A Basic SKU load balancer health probe isn't supported with a virtual machine scale set.

- HTTP probes don't support probing on the following ports due to security concerns: 19, 21, 25, 70, 110, 119, 143, 220, 993. 

## Next steps

- Learn more about [Standard Load Balancer](./load-balancer-overview.md)
- Learn [how to manage health probes](../load-balancer/manage-probes-how-to.md)
- [Get started creating a public load balancer in Resource Manager by using PowerShell](quickstart-load-balancer-standard-public-powershell.md)
- [REST API for health probes](/rest/api/load-balancer/loadbalancerprobes/)