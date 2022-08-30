---
title: Troubleshoot Azure Virtual Network NAT connectivity
titleSuffix: Azure Virtual Network
description: Troubleshoot connectivity issues with Virtual Network NAT.
author: asudbring
ms.service: virtual-network
ms.subservice: nat
ms.topic: troubleshooting
ms.date: 08/29/2022
ms.author: allensu
---

# Troubleshoot Azure Virtual Network NAT connectivity 

This article provides guidance on how to troubleshoot and resolve common outbound connectivity issues with your NAT gateway resource. This article also provides guidance on best practices for designing applications to use outbound connections efficiently. 

## SNAT exhaustion due to NAT gateway configuration 

Common SNAT exhaustion issues with NAT gateway typically have to do with the configurations on the NAT gateway. Common SNAT exhaustion issues include: 
* Outbound connectivity on NAT gateway not scaled out with enough public IP addresses. 
* NAT gateway's configurable TCP idle timeout timer is set higher than the default value of 4 minutes.

### Outbound connectivity not scaled out enough 

Each public IP address provides 64,512 SNAT ports to subnets attached to NAT gateway. From those available SNAT ports, NAT gateway can support up to 50,000 concurrent connections to the same destination endpoint. If outbound connections are dropping because SNAT ports are being exhausted, then NAT gateway may not be scaled out enough to handle the workload. More public IP addresses may need to be added to NAT gateway in order to provide more SNAT ports for outbound connectivity. 

The table below describes two common scenarios in which outbound connectivity may not be scaled out enough and how to validate and mitigate these issues: 

| Scenario | Evidence |Mitigation | 
|---|---|---| 
| You're experiencing contention for SNAT ports and SNAT port exhaustion during periods of high usage. | You run the following [metrics](nat-metrics.md) in Azure Monitor: **Total SNAT Connection**: "Sum" aggregation shows high connection volume. "Failed" connection state shows transient or persistent failures over time. **Dropped Packets**: "Sum" aggregation shows packets dropping consistent with high connection volume. | Determine if you can add more public IP addresses or public IP prefixes. This addition will allow for up to 16 IP addresses in total to your NAT gateway. This addition will provide more inventory for available SNAT ports (64,000 per IP address) and allow you to scale your scenario further. |
| You've already given 16 IP addresses and still are experiencing SNAT port exhaustion. | Attempt to add more IP addresses fails. Total number of IP addresses from public IP address resources or public IP prefix resources exceeds a total of 16. | Distribute your application environment across multiple subnets and provide a NAT gateway resource for each subnet. | 

>[!NOTE] 
>It is important to understand why SNAT exhaustion occurs. Make sure you are using the right patterns for scalable and reliable scenarios. Adding more SNAT ports to a scenario without understanding the cause of the demand should be a last resort. If you do not understand why your scenario is applying pressure on SNAT port inventory, adding more SNAT ports to the inventory by adding more IP addresses will only delay the same exhaustion failure as your application scales.  You may be masking other inefficiencies and anti-patterns. 

### TCP idle timeout timers set higher than the default value 

The NAT gateway TCP idle timeout timer is set to 4 minutes by default but is configurable up to 120 minutes. If this setting is changed to a higher value than the default, NAT gateway will hold on to flows longer and can create [additional pressure on SNAT port inventory](/azure/virtual-network/nat-gateway/nat-gateway-resource#timers). The table below describes a common scenario in which a high TCP idle timeout may be causing SNAT exhaustion and provides possible mitigation steps to take: 

| Scenario | Evidence | Mitigation | 
|---|---|---| 
| You would like to ensure that TCP connections stay active for long periods of time without idle timing out so you increase the TCP idle timeout timer setting. After a while you start to notice that connection failures occur more often. You suspect that you may be exhausting your inventory of SNAT ports since connections are holding on to them longer. | You check the following [NAT gateway metrics](nat-metrics.md) in Azure Monitor to determine if SNAT port exhaustion is happening: **Total SNAT Connection**: "Sum" aggregation shows high connection volume. "Failed" connection state shows transient or persistent failures over time. **Dropped Packets**: "Sum" aggregation shows packets dropping consistent with high connection volume. | You have a few possible mitigation steps that you can take to resolve SNAT port exhaustion: - **Reduce the TCP idle timeout** to a lower value to free up SNAT port inventory earlier. The TCP idle timeout timer cannot be set lower than 4 minutes. - Consider **[asynchronous polling patterns](/azure/architecture/patterns/async-request-reply)** to free up connection resources for other operations. - **Use TCP keepalives or application layer keepalives** to avoid intermediate systems timing out. For examples, see [.NET examples](/dotnet/api/system.net.servicepoint.settcpkeepalive). - For connections going to Azure PaaS services, use **[Private Link](../../private-link/private-link-overview.md)**. Private Link eliminates the need to use public IPs of your NAT gateway which frees up more SNAT ports for outbound connections to the internet. |

## Connection failures due to idle timeouts 

### TCP idle timeout 

As described in the [TCP timers](#tcp-idle-timeout-timers-set-higher-than-the-default-value) section above, TCP keepalives should be used instead to refresh idle flows and reset the idle timeout. TCP keepalives only need to be enabled from one side of a connection in order to keep a connection alive from both sides. When a TCP keepalive is sent from one side of a connection, the other side automatically sends an ACK packet. The idle timeout timer is then reset on both sides of the connection. To learn more, see [Timer considerations](/azure/virtual-network/nat-gateway/nat-gateway-resource#timer-considerations). 

>[!Note] 
>Increasing the TCP idle timeout is a last resort and may not resolve the root cause. A long timeout can cause low-rate failures when timeout expires and introduce delay and unnecessary failures. 

### UDP idle timeout 

UDP idle timeout timers are set to 4 minutes. Unlike TCP idle timeout timers for NAT gateway, UDP idle timeout timers are not configurable. The table below describes a common scenario encountered with connections dropping due to UDP traffic idle timing out and steps to take to mitigate the issue. 

| Scenario | Evidence | Mitigation | 
|---|---|---| 
| You notice that UDP traffic is dropping connections that need to be maintained for long periods of time. | You check the following [NAT gateway metrics](nat-metrics.md) in Azure Monitor, **Dropped Packets**: "Sum" aggregation shows packets dropping consistent with high connection volume. | A few possible mitigation steps that can be taken: - **Enable UDP keepalives**. Keep in mind that when a UDP keepalive is enabled, it is only active for one direction in a connection. This means that the connection can still time-out from going idle on the other side of a connection. To prevent a UDP connection from going idle and timing out, UDP keepalives should be enabled for both directions in a connection flow. - **Application layer keepalives** can also be used to refresh idle flows and reset the idle timeout. Check the server side for what options exist for application specific keepalives. | 

## NAT gateway public IP not being used for outbound traffic 

### VMs hold on to prior SNAT IP with active connection after NAT gateway added to a VNet 

[Virtual Network NAT gateway](nat-overview.md) supersedes outbound connectivity for a subnet. When transitioning from default SNAT or load balancer outbound SNAT to NAT gateway, new connections will immediately begin using the IP address(es) associated with the NAT gateway resource. However, if a virtual machine still has an established connection during the switch to NAT gateway, the connection will continue using the old SNAT IP address that was assigned when the connection was established.  

Test and resolve issues with VMs holding on to old SNAT IP addresses by:  
1. Make sure you are really establishing a new connection and that connections are not being reused due to having already existed in the OS or because the browser was caching the connections in a connection pool. For example, when using curl in PowerShell, make sure to specify the -DisableKeepalive parameter to force a new connection. If you are using a browser, connections may also be pooled.  
2. It is not necessary to reboot a virtual machine in a subnet configured to NAT gateway. However, if a virtual machine is rebooted, the connection state is flushed. When the connection state has been flushed, all connections will begin using the NAT gateway resource's IP address(es). However, this is a side effect of the virtual machine being rebooted and not an indicator that a reboot is required.  

If you are still having trouble, open a support case for further troubleshooting.  

### Virtual appliance UDRs and ExpressRoute override NAT gateway for routing outbound traffic 

When forced tunneling with a custom UDR is enabled to direct traffic to a virtual appliance or VPN through ExpressRoute, the UDR or ExpressRoute takes precedence over NAT gateway for directing internet bound traffic. To learn more, see [custom UDRs](../virtual-networks-udr-overview.md#custom-routes).  

The order of precedence for internet routing configurations is as follows:  
Virtual appliance UDR / ExpressRoute >> NAT gateway >> instance level public IP addresses >> outbound rules on Load balancer >> default system  

Test and resolve issues with a virtual appliance UDR or VPN ExpressRoute overriding your NAT gateway by:  
1. [Testing that the NAT gateway public IP](./quickstart-create-nat-gateway-portal.md#test-nat-gateway) is used for outbound traffic. If a different IP is being used, it could be because of a custom UDR, follow the remaining steps on how to check for and remove custom UDRs. 
2. Check for UDRs in the virtual network’s route table, refer to [view route tables](../manage-route-table.md#view-route-tables). 
3. Remove the UDR from the route table by following [create, change, or delete an Azure route table](../manage-route-table.md#change-a-route-table). 

Once the custom UDR is removed from the routing table, the NAT gateway public IP should now take precedence in routing outbound traffic to the internet.  

### Private IPs are used to connect to Azure services by Private Link 

[Private Link](../../private-link/private-link-overview.md) connects your Azure virtual networks privately to Azure PaaS services such as Storage, SQL, or Cosmos DB over the Azure backbone network instead of over the internet. Private Link uses the private IP addresses of virtual machine instances in your virtual network to connect to these Azure platform services instead of the public IP of NAT gateway. As a result, when looking at the source IP address used to connect to these Azure services, you will notice that the private IPs of your instances are used. See [Azure services listed here](../../private-link/availability.md) for all services supported by Private Link.  

To check which Private Endpoints you have set up with Private Link: 
1. From the Azure portal, search for Private Link in the search box. 
2. In the Private Link center, select Private Endpoints or Private Link services to see what configurations have been set up. See [Manage private endpoint connections](../../private-link/manage-private-endpoint.md#manage-private-endpoint-connections-on-azure-paas-resources) for more details. 

Service endpoints can also be used to connect your virtual network to Azure PaaS services. To check if you have service endpoints configured for your virtual network: 
1. From the Azure portal, navigate to your virtual network and select "Service endpoints" from Settings. 
2. All Service endpoints created will be listed along with which subnets they are configured. See [logging and troubleshooting Service endpoints](../virtual-network-service-endpoints-overview.md#logging-and-troubleshooting) for more details. 

>[!NOTE] 
>Private Link is the recommended option over Service endpoints for private access to Azure hosted services. 

## Connection failures at the public internet destination 

Connection failures at the internet destination endpoint could be due to multiple possible factors. Some  factors that can impact connectivity success are: 
* Firewall or other traffic management components at the destination. 
* API rate limiting imposed by the destination side. 
* Volumetric DDoS mitigations or transport layer traffic shaping. 

Use NAT gateway [metrics]((nat-metrics.md) in Azure monitor to diagnose connection issues: 
* Look at packet count at the source and the destination (if available) to determine how many connection attempts were made. 
* Look at dropped packets to see how many packets were dropped by NAT gateway. 

What else to check for: 
* Check for [SNAT exhaustion]((#snat-exhaustion-due-to-nat-gateway-configuration). 
* Validate connectivity to an endpoint in the same region or elsewhere for comparison. 
* If you are creating high volume or transaction rate testing, explore if reducing the rate reduces the occurrence of failures. 
* If changing rate impacts the rate of failures, check if API rate limits or other constraints on the destination side might have been reached. 

### Additional network captures 

If your investigation is inconclusive, open a support case for further troubleshooting and collect the following information for a quicker resolution. Choose a single virtual machine in your NAT gateway configured subnet to perform the following tests: 
* Use ps ping from one of the backend VMs within the VNet to test the probe port response (example: ps ping 10.0.0.4:3389) and record results. 
* If no response is received in these ping tests, run a simultaneous Netsh trace on the backend VM and the VNet test VM while you run PsPing then stop the Netsh trace. 

## Best practices for efficient use of outbound connections 

Azure monitors and operates its infrastructure with great care. However, transient failures can still occur from deployed applications, there is no guarantee that transmissions are lossless. AT gateway is the preferred option to connect outbound from Azure deployments in order to ensure highly reliable and resilient outbound connectivity. In addition to using NAT gateway to connect outbound, use the guidance below for additional steps that can be taken to ensure that applications are using connections efficiently.  

### Modify the application to use connection pooling 

When you pool your connections, you avoid opening new network connections for calls to the same address and port. You can implement a connection pooling scheme in your application where requests are internally distributed across a fixed set of connections and reused when possible. This setup constrains the number of SNAT ports in use and creates a predictable environment. Connection pooling helps reduce latency and resource utilization and ultimately improve the performance of your applications. 

To learn more on pooling HTTP connections, see [Pool HTTP connections](/aspnet/core/performance/performance-best-practices?view=aspnetcore-6.0#pool-http-connections-with-httpclientfactory) with HttpClientFactory.

### Modify the application to reuse connections 

Rather than generating individual, atomic TCP connections for each request, configure your application to reuse connections. Connection reuse results in more performant TCP transactions and is especially relevant for protocols like HTTP/1.1, where connection reuse is the default. This reuse applies to other protocols that use HTTP as their transport such as REST. 

### Modify the application to use less aggressive retry logic 

When SNAT ports are exhausted or application failures occur, aggressive or brute force retries without delay and back-off logic cause exhaustion to occur or persist. You can reduce demand for SNAT ports by using a less aggressive retry logic. 

Depending on the configured idle timeout, if retries are too aggressive, connections may not have enough time to close and release SNAT ports for reuse. 

For additional guidance and examples, see [Retry pattern](/azure/app-service/troubleshoot-intermittent-outbound-connection-errors). 

### Use keepalives to reset the outbound idle timeout 

See [TCP idle timeout timers set higher than the default value](#tcp-idle-timeout-timers-set-higher-than-the-default-value) for more information on use of keepalives. 

### Use Private link to reduce SNAT port usage for connecting to other Azure services  

When possible, Private Link should be used to connect directly from your virtual networks to Azure platform services in order to [reduce the demand](/azure/virtual-network/nat-gateway/troubleshoot-nat#tcp-idle-timeout-timers-set-higher-than-the-default-value) on SNAT ports. Reducing the demand on SNAT ports can help reduce the risk of SNAT port exhaustion. 

To create a Private Link, see the following Quickstart guides to get started: 
* [Create a Private Endpoint](/azure/private-link/create-private-endpoint-portal?tabs=dynamic-ip) 
* [Create a Private Link](/azure/private-link/create-private-link-service-portal)

## Next steps 

We are always looking to improve the experience of our customers. If you are experiencing issues with NAT gateway that are not listed or resolved by this article, submit feedback through GitHub via the bottom of this page and we will address your feedback as soon as possible. 

To learn more about NAT gateway, see: 
* [Virtual Network NAT](/azure/virtual-network/nat-gateway/nat-overview) 
* [NAT gateway resource](/azure/virtual-network/nat-gateway/nat-gateway-resource) 
* [Metrics and alerts for NAT gateway resources](/azure/virtual-network/nat-gateway/nat-metrics) 



