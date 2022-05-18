---
title: Troubleshoot Azure Virtual Network NAT connectivity
titleSuffix: Azure Virtual Network
description: Troubleshoot issues with Virtual Network NAT.
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
ms.service: virtual-network
# Customer intent: As an IT administrator, I want to troubleshoot Virtual Network NAT.
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/20/2020
ms.author: allensu
---

# Troubleshoot Azure Virtual Network NAT connectivity

This article provides guidance on how to configure your NAT gateway to ensure outbound connectivity. This article also provides mitigating steps to resolve common configuration and connectivity issues with NAT gateway.

## Common connection issues with NAT gateway

* [Configuration issues with NAT gateway](#configuration-issues-with-nat-gateway)
* [Configuration issues with your subnets and virtual network](#configuration-issues-with-subnets-and-virtual-networks-using-nat-gateway)
* [SNAT exhaustion due to NAT gateway configuration](#snat-exhaustion-due-to-nat-gateway-configuration)
* [Connection failures due to idle timeouts](#connection-failures-due-to-idle-timeouts)
* [Connection issues with NAT gateway and integrated services](#connection-issues-with-nat-gateway-and-integrated-services)
* [NAT gateway public IP not being used for outbound traffic](#nat-gateway-public-ip-not-being-used-for-outbound-traffic)
* [Connection failures in the Azure infrastructure](#connection-failures-in-the-azure-infrastructure)
* [Connection failures outside of the Azure infrastructure](#connection-failures-outside-of-the-azure-infrastructure)

## Configuration issues with NAT gateway

### NAT gateway configuration basics

Check the following configurations to ensure that NAT gateway can be used to direct traffic outbound:
1. At least one public IP address or one public IP prefix is attached to NAT gateway. At least one public IP address must be associated with the NAT gateway for it to provide outbound connectivity. 
2. At least one subnet is attached to a NAT gateway. You can attach multiple subnets to a NAT gateway for going outbound, but those subnets must exist within the same virtual network. NAT gateway cannot span beyond a single virtual network. 
3. No [NSG rules](../network-security-groups-overview.md#outbound) or [UDRs](#virtual-appliance-udrs-and-vpn-expressroute-override-nat-gateway-for-routing-outbound-traffic) are blocking NAT gateway from directing traffic outbound to the internet.

### How to validate connectivity

[Virtual Network NAT gateway](./nat-overview.md#virtual-network-nat-basics) supports IPv4 UDP and TCP protocols. ICMP is not supported and is expected to fail. 

To validate end-to-end connectivity of NAT gateway, follow these steps: 
1. Validate that your [NAT gateway public IP address is being used](./quickstart-create-nat-gateway-portal.md#test-nat-gateway).
2. Conduct TCP connection tests and UDP-specific application layer tests.
3. Look at NSG flow logs to analyze outbound traffic flows from NAT gateway.

Refer to the table below for which tools to use to validate NAT gateway connectivity.

| Operating system | Generic TCP connection test | TCP application layer test | UDP |
|---|---|---|---|
| Linux | nc (generic connection test) | curl (TCP application layer test) | application specific |
| Windows | [PsPing](/sysinternals/downloads/psping) | PowerShell [Invoke-WebRequest](/powershell/module/microsoft.powershell.utility/invoke-webrequest) | application specific |

To analyze outbound traffic from NAT gateway, use NSG flow logs.
* To learn more about NSG flow logs, see [NSG flow log overview](../../network-watcher/network-watcher-nsg-flow-logging-overview.md).
* For guides on how to enable NSG flow logs, see [Enabling NSG flow logs](../../network-watcher/network-watcher-nsg-flow-logging-overview.md#enabling-nsg-flow-logs).
* For guides on how to read NSG flow logs, see [Working with NSG flow logs](../../network-watcher/network-watcher-nsg-flow-logging-overview.md#working-with-flow-logs).

## Configuration issues with subnets and virtual networks using NAT gateway

### Basic SKU resources cannot exist in the same subnet as NAT gateway

NAT gateway is not compatible with basic resources, such as Basic Load Balancer or Basic Public IP. Basic resources must be placed on a subnet not associated with a NAT Gateway. Basic Load Balancer and Basic Public IP can be upgraded to standard to work with NAT gateway. 
* To upgrade a basic load balancer to standard, see [upgrade from basic public to standard public load balancer](../../load-balancer/upgrade-basic-standard.md).
* To upgrade a basic public IP to standard, see [upgrade from basic public to standard public IP](../ip-services/public-ip-upgrade-portal.md).

### NAT gateway cannot be attached to a gateway subnet

NAT gateway cannot be deployed in a gateway subnet. VPN gateway uses gateway subnets for VPN connections between site-to-site Azure virtual networks and local networks or between two Azure virtual networks. See [VPN gateway overview](../../vpn-gateway/vpn-gateway-about-vpngateways.md) to learn more about how gateway subnets are used.

### IPv6 coexistence

[Virtual Network NAT gateway](nat-overview.md) supports IPv4 UDP and TCP protocols. NAT gateway cannot be associated to an IPv6 Public IP address or IPv6 Public IP Prefix. NAT gateway can be deployed on a dual stack subnet, but will still only use IPv4 Public IP addresses for directing outbound traffic. Deploy NAT gateway on a dual stack subnet when you need IPv6 resources to exist in the same subnet as IPv4 resources.

## SNAT exhaustion due to NAT gateway configuration

Common SNAT exhaustion issues with NAT gateway typically have to do with the configurations on the NAT gateway. Common SNAT exhaustion issues include: 
* Outbound connectivity on NAT gateway not scaled out enough. 
* NAT gateway's configurable TCP idle timeout timer is set higher than the default value of 4 minutes. 

### Outbound connectivity not scaled out enough

Each public IP address provides 64,512 SNAT ports to subnets attached to NAT gateway. From those available SNAT ports, NAT gateway can support up to 50,000 concurrent connections to the same destination endpoint. If outbound connections are dropping because SNAT ports are being exhausted, then NAT gateway may not be scaled out enough to handle the workload. More public IP addresses may need to be added to NAT gateway in order to provide more SNAT ports for outbound connectivity.

The table below describes two common scenarios in which outbound connectivity may not be scaled out enough and how to validate and mitigate these issues: 

| Scenario | Evidence |Mitigation |
|---|---|---|
| You're experiencing contention for SNAT ports and SNAT port exhaustion during periods of high usage. | You run the following [metrics](nat-metrics.md) in Azure Monitor: **Total SNAT Connection**: "Sum" aggregation shows high connection volume. "Failed" connection state shows transient or persistent failures over time. **Dropped Packets**: "Sum" aggregation shows packets dropping consistent with high connection volume.  | Determine if you can add more public IP addresses or public IP prefixes. This addition will allow for up to 16 IP addresses in total to your NAT gateway. This addition will provide more inventory for available SNAT ports (64,000 per IP address) and allow you to scale your scenario further.|
| You've already given 16 IP addresses and still are experiencing SNAT port exhaustion. | Attempt to add more IP addresses fails. Total number of IP addresses from public IP address resources or public IP prefix resources exceeds a total of 16. | Distribute your application environment across multiple subnets and provide a NAT gateway resource for each subnet. |

>[!NOTE]
>It is important to understand why SNAT exhaustion occurs. Make sure you are using the right patterns for scalable and reliable scenarios.  Adding more SNAT ports to a scenario without understanding the cause of the demand should be a last resort. If you do not understand why your scenario is applying pressure on SNAT port inventory, adding more SNAT ports to the inventory by adding more IP addresses will only delay the same exhaustion failure as your application scales.  You may be masking other inefficiencies and anti-patterns.

### TCP idle timeout timers set higher than the default value

The NAT gateway TCP idle timeout timer is set to 4 minutes by default but is configurable up to 120 minutes. If this setting is changed to a higher value than the default, NAT gateway will hold on to flows longer and can create [additional pressure on SNAT port inventory](nat-gateway-resource.md#timers). The table below describes a common scenarion in which a high TCP idle timeout may be causing SNAT exhaustion and provides possible mitigation steps to take:

| Scenario | Evidence | Mitigation |
|---|---|---|
| You would like to ensure that TCP connections stay active for long periods of time without idle timing out so you increase the TCP idle timeout timer setting. After a while you start to notice that connection failures occur more often. You suspect that you may be exhausting your inventory of SNAT ports since connections are holding on to them longer. | You check the following [NAT gateway metrics](nat-metrics.md) in Azure Monitor to determine if SNAT port exhaustion is happening: **Total SNAT Connection**: "Sum" aggregation shows high connection volume. "Failed" connection state shows transient or persistent failures over time. **Dropped Packets**: "Sum" aggregation shows packets dropping consistent with high connection volume. | You have a few possible mitigation steps that you can take to resolve SNAT port exhaustion: - **Reduce the TCP idle timeout** to a lower value to free up SNAT port inventory earlier. The TCP idle timeout timer cannot be set lower than 4 minutes. - Consider **[asynchronous polling patterns](/azure/architecture/patterns/async-request-reply)** to free up connection resources for other operations. - **Use TCP keepalives or application layer keepalives** to avoid intermediate systems timing out. For examples, see [.NET examples](/dotnet/api/system.net.servicepoint.settcpkeepalive). - For connections going to Azure PaaS services, use **[Private Link](../../private-link/private-link-overview.md)**. Private Link eliminates the need to use public IPs of your NAT gateway which frees up more SNAT ports for outbound connections to the internet.|

## Connection failures due to idle timeouts

### TCP idle timeout

As described in the [TCP timers](#tcp-idle-timeout-timers-set-higher-than-the-default-value) section above, TCP keepalives should be used instead to refresh idle flows and reset the idle timeout. TCP keepalives only need to be enabled from one side of a connection in order to keep a connection alive from both sides. When a TCP keepalive is sent from one side of a connection, the other side automatically sends an ACK packet. The idle timeout timer is then reset on both sides of the connection. To learn more, see [Timer considerations](/azure/virtual-network/nat-gateway-resource#timers). 

>[!NOTE]
>Increasing the TCP idle timeout is a last resort and may not resolve the root cause. A long timeout can cause low rate failures when timeout expires and introduce delay and unnecessary failures.

### UDP idle timeout

UDP idle timeout timers are set to 4 minutes. Unlike TCP idle timeout timers for NAT gateway, UDP idle timeout timers are not configurable. The table below describes a common scenario encountered with connections dropping due to UDP traffic idle timing out and steps to take to mitigate the issue.

| Scenario | Evidence | Mitigation |
|---|---|---|
| You notice that UDP traffic is dropping connections that need to be maintained for long periods of time. | You check the following [NAT gateway metrics](nat-metrics.md) in Azure Monitor, **Dropped Packets**: "Sum" aggregation shows packets dropping consistent with high connection volume. | A few possible mitigation steps that can be taken: - **Enable UDP keepalives**. Keep in mind that when a UDP keepalive is enabled, it is only active for one direction in a connection. This means that the connection can still time-out from going idle on the other side of a connection. To prevent a UDP connection from going idle and timing out, UDP keepalives should be enabled for both directions in a connection flow. - **Application layer keepalives** can also be used to refresh idle flows and reset the idle timeout. Check the server side for what options exist for application specific keepalives. |

## Connection issues with NAT gateway and integrated services

### Azure App Service regional Virtual network integration turned off

NAT gateway can be used with Azure app services to allow applications to make outbound calls from a virtual network. To use this integration between Azure app services and NAT gateway, regional virtual network integration must be enabled. See [how regional virtual network integration works](../../app-service/overview-vnet-integration.md#how-regional-virtual-network-integration-works) to learn more.

To use NAT gateway with Azure App services, follow these steps: 
1. Ensure that your application(s) have virtual network integration configured, see [Enable virtual network integration](../../app-service/configure-vnet-integration-enable.md). 
2. Ensure that **Route All** is enabled for your virtual network integration, see [Configure virtual network integration routing](../../app-service/configure-vnet-integration-routing.md).
3. Create a NAT gateway resource. 
4. Create a new public IP address or attach an existing public IP address in your network to NAT gateway.
5. Assign NAT gateway to the same subnet being used for Virtual network integration with your application(s). 

To see step-by-step instructions on how to configure NAT gateway with virtual network integration, see [Configuring NAT gateway integration](../../app-service/networking/nat-gateway-integration.md#configuring-nat-gateway-integration)

A couple important notes about the NAT gateway and Azure App Services integration: 
* Virtual network integration does not provide inbound private access to your app from the virtual network. 
* Because of the nature of how virtual network integration operates, the traffic from virtual network integration does not show up in Azure Network Watcher or NSG flow logs. 

### Port 25 cannot be used for regional VNet integration with NAT gateway

Port 25 is an SMTP port that is used to send email. Azure app services regional Virtual network integration cannot use port 25 by design. In a scenario where regional Virtual network integration is enabled for NAT gateway to connect an application to an email SMTP server, traffic will be blocked on port 25 despite NAT gateway working with all other ports for outbound traffic. This block on port 25 cannot be removed.

**Work around solution:**
* Set up port forwarding to a Windows VM to route traffic to Port 25. 

## NAT gateway public IP not being used for outbound traffic

### VMs hold on to prior SNAT IP with active connection after NAT gateway added to a VNet

[Virtual Network NAT gateway](nat-overview.md) supersedes outbound connectivity for a subnet. When transitioning from default SNAT or load balancer outbound SNAT to using NAT gateway, new connections will immediately begin using the IP address(es) associated with the NAT gateway resource. However, if a virtual machine still has an established connection during the switch to NAT gateway, the connection will continue using the old SNAT IP address that was assigned when the connection was established. 

Test and resolve issues with VMs holding on to old SNAT IP addresses by: 
1. Make sure you are really establishing a new connection and that connections are not being reused due to having already existed in the OS or because the browser was caching the connections in a connection pool. For example, when using curl in PowerShell, make sure to specify the -DisableKeepalive parameter to force a new connection. If you are using a browser, connections may also be pooled. 
2. It is not necessary to reboot a virtual machine in a subnet configured to NAT gateway. However, if a virtual machine is rebooted, the connection state is flushed. When the connection state has been flushed, all connections will begin using the NAT gateway resource's IP address(es). However, this is a side effect of the virtual machine being rebooted and not an indicator that a reboot is required. 

If you are still having trouble, open a support case for further troubleshooting. 

### Virtual appliance UDRs and VPN ExpressRoute override NAT gateway for routing outbound traffic

When forced tunneling with a custom UDR is enabled to direct traffic to a virtual appliance or VPN through ExpressRoute, the UDR or ExpressRoute takes precedence over NAT gateway for directing internet bound traffic. To learn more, see [custom UDRs](../virtual-networks-udr-overview.md#custom-routes). 

The order of precedence for internet routing configurations is as follows: 

Virtual appliance UDR / VPN ExpressRoute >> NAT gateway >> default system 

Test and resolve issues with a virtual appliance UDR or VPN ExpressRoute overriding your NAT gateway by: 
1. [Testing that the NAT gateway public IP](./quickstart-create-nat-gateway-portal.md#test-nat-gateway) is used for outbound traffic. If a different IP is being used, it could be because of a custom UDR, follow the remaining steps on how to check for and remove custom UDRs.
2. Check for UDRs in the virtual network’s route table, refer to [view route tables](../manage-route-table.md#view-route-tables).
3. Remove the UDR from the route table by following [create, change, or delete an Azure route table](../manage-route-table.md#change-a-route-table).

Once the custom UDR is removed from the routing table, the NAT gateway public IP should now take precedence in routing outbound traffic to the internet. 

### Private IPs are used to connect to Azure services by Private Link

[Private Link](../../private-link/private-link-overview.md) connects your Azure virtual networks privately to Azure PaaS services such as Storage, SQL, or Cosmos DB over the Azure backbone network instead of over the internet. Private Link uses the private IP addresses of virtual machine instances in your virtual network to connect to these Azure platform services instead of the public IP of NAT gateway. As a result, when looking at the source IP address used to connect to these Azure services, you will notice that the private IPs of your instances are used. See [Azure services listed here](../../private-link/availability.md) for all services supported by Private Link.   

When possible, Private Link should be used to connect directly from your virtual networks to Azure platform services in order to [reduce the demand on SNAT ports](#tcp-idle-timeout-timers-set-higher-than-the-default-value). Reducing the demand on SNAT ports can help reduce the risk of SNAT port exhaustion. 

To create a Private Link, see the following Quickstart guides to get started: 
- [Create a Private Endpoint](../../private-link/create-private-endpoint-portal.md)
- [Create a Private Link](../../private-link/create-private-link-service-portal.md)

To check which Private Endpoints you have set up with Private Link:
1. From the Azure portal, search for Private Link in the search box.
2. In the Private Link center, select Private Endpoints or Private Link services to see what configurations have been set up. See [Manage private endpoint connections](../../private-link/manage-private-endpoint.md#manage-private-endpoint-connections-on-azure-paas-resources) for more details.

Service endpoints can also be used to connect your virtual network to Azure PaaS services. To check if you have service endpoints configured for your virtual network:
1. From the Azure portal, navigate to your virtual network and select "Service endpoints" from Settings.
2. All Service endpoints created will be listed along with which subnets they are configured. See [logging and troubleshooting Service endpoints](../virtual-network-service-endpoints-overview.md#logging-and-troubleshooting) for more details.

>[!NOTE]
>Private Link is the recommended option over Service endpoints for private access to Azure hosted services.

## Connection failures in the Azure infrastructure

Azure monitors and operates its infrastructure with great care. However, transient failures can still occur, there is no guarantee that transmissions are lossless.  Use design patterns that allow for SYN retransmissions for TCP applications. Use connection timeouts large enough to permit TCP SYN retransmission to reduce transient impacts caused by a lost SYN packet.

**What to check for:**

* Check for [SNAT exhaustion](#snat-exhaustion-due-to-nat-gateway-configuration).
* The configuration parameter in a TCP stack that controls the SYN retransmission behavior is called RTO ([Retransmission Time-Out](https://tools.ietf.org/html/rfc793)). The RTO value is adjustable but typically 1 second or higher by default with exponential back-off.  If your application's connection time-out is too short (for example 1 second), you may see sporadic connection timeouts.  Increase the application connection time-out.
* If you observe longer, unexpected timeouts with default application behaviors, open a support case for further troubleshooting.

We don't recommend artificially reducing the TCP connection timeout or tuning the RTO parameter.

## Connection failures outside of the Azure infrastructure

### Connection failures with public internet transit

The chances of transient failures increases with a longer path to the destination and more intermediate systems. It's expected that transient failures can increase in frequency over [Azure infrastructure](#connection-failures-in-the-azure-infrastructure). 

Follow the same guidance as preceding [Azure infrastructure](#connection-failures-in-the-azure-infrastructure) section.

### Connection failures at the public internet destination

The previous sections apply, along with the internet endpoint that communication is established with. Other factors that can impact connectivity success are:

* Traffic management on destination side, including,
- API rate limiting imposed by the destination side.
- Volumetric DDoS mitigations or transport layer traffic shaping.
* Firewall or other components at the destination. 

Use NAT gateway [metrics](nat-metrics.md) in Azure monitor to diagnose connection issues: 
* Look at packet count at the source and the destination (if available) to determine how many connection attempts were made.  
* Look at dropped packets to see how many packets were dropped by NAT gateway. 

What else to check for:
* Check for [SNAT exhaustion](#snat-exhaustion-due-to-nat-gateway-configuration).
* Validate connectivity to an endpoint in the same region or elsewhere for comparison. 
* If you are creating high volume or transaction rate testing, explore if reducing the rate reduces the occurrence of failures. 
* If changing rate impacts the rate of failures, check if API rate limits or other constraints on the destination side might have been reached. 

If your investigation is inconclusive, open a support case for further troubleshooting.

## Next steps

We are always looking to improve the experience of our customers. If you are experiencing issues with NAT gateway that are not listed or resolved by this article, submit feedback through GitHub via the bottom of this page and we will address your feedback as soon as possible. 

To learn more about NAT gateway, see:

* [Virtual Network NAT](nat-overview.md)
* [NAT gateway resource](nat-gateway-resource.md)
* [Metrics and alerts for NAT gateway resources](nat-metrics.md).
