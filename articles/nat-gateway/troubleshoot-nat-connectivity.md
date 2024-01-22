---
title: Troubleshoot Azure NAT Gateway connectivity
description: Troubleshoot connectivity issues with a NAT gateway.
author: asudbring
ms.service: nat-gateway
ms.custom: ignite-2022, linux-related-content
ms.topic: troubleshooting
ms.date: 04/24/2023
ms.author: allensu
---

# Troubleshoot Azure NAT Gateway connectivity

This article provides guidance on how to troubleshoot and resolve common outbound connectivity issues with your NAT gateway. This article also provides best practices on how to design applications to use outbound connections efficiently.

## Datapath availability drop on NAT gateway with connection failures

**Scenario**

You observe a drop in the datapath availability of NAT gateway, which coincides with connection failures.

**Possible causes**
* SNAT port exhaustion
* Reached simultaneous SNAT connection limits
* Connection timeouts

**How to troubleshoot**
* Check the [datapath availability metric](/azure/nat-gateway/nat-metrics#datapath-availability) to assess the health of the NAT gateway.
* Check the SNAT Connection Count metric and [split the connection state](/azure/nat-gateway/nat-metrics#snat-connection-count) by attempted and failed connections. More than zero failed connections may indicate SNAT port exhaustion or reaching the SNAT connection count limit of NAT gateway.
* Verify the [Total SNAT Connection Count metric](/azure/nat-gateway/nat-metrics#total-snat-connection-count) to ensure it is within limits. NAT gateway supports 50,000 simultaneous connections per IP address to a unique destination and up to 2 million connections in total. For more information, see [NAT Gateway Performance](/azure/nat-gateway/nat-gateway-resource#performance).
* Check the [dropped packets metric](/azure/nat-gateway/nat-metrics#dropped-packets) for any packet drops that align with connection failures or high connection volume.
* Adjust the [TCP idle timeout timer](./nat-gateway-resource.md#tcp-idle-timeout) settings as needed. An idle timeout timer set higher than the default (4 minutes) holds on to flows longer, and can create [extra pressure on SNAT port inventory](./nat-gateway-resource.md#timers).

### Possible solutions for SNAT port exhaustion or hitting simultaneous connection limits
* Add public IP addresses to your NAT gateway up to a total of 16 to scale your outbound connectivity. Each public IP provides 64,512 SNAT ports and supports up to 50,000 simultaneous connections per unique destination endpoint for NAT gateway.
* Distribute your application environment across multiple subnets and provide a NAT gateway resource for each subnet.
* Reduce the [TCP idle timeout timer](./nat-gateway-resource.md#idle-timeout-timers) to a lower value to free up SNAT port inventory earlier. The TCP idle timeout timer can't be set lower than 4 minutes.
*  Consider **[asynchronous polling patterns](/azure/architecture/patterns/async-request-reply)** to free up connection resources for other operations.
* Make connections to Azure PaaS services over the Azure backbone using [Private Link](/azure/private-link/private-link-overview). Private link frees up SNAT ports for outbound connections to the internet.
* If your investigation is inconclusive, open a support case to [further troubleshoot](#more-troubleshooting-guidance).

>[!NOTE]
>It is important to understand why SNAT port exhaustion occurs. Make sure you use the right patterns for scalable and reliable scenarios. Adding more SNAT ports to a scenario without understanding the cause of the demand should be a last resort. If you do not understand why your scenario is applying pressure on SNAT port inventory, adding more SNAT ports by adding more IP addresses will only delay the same exhaustion failure as your application scales.  You may be masking other inefficiencies and anti-patterns. For more informations, see [best practices for efficient use of outbound connections](#outbound-connectivity-best-practices).

### Possible solutions for TCP connection timeouts

Use TCP keepalives or application layer keepalives to refresh idle flows and reset the idle timeout timer. For examples, see [.NET examples](/dotnet/api/system.net.servicepoint.settcpkeepalive).

TCP keepalives only need to be enabled from one side of a connection in order to keep a connection alive from both sides. When a TCP keepalive is sent from one side of a connection, the other side automatically sends an ACK packet. The idle timeout timer is then reset on both sides of the connection.

>[!Note]
>Increasing the TCP idle timeout is a last resort and may not resolve the root cause of the issue. A long timeout can introduce delay and cause unnecessary low-rate failures when timeout expires.

### Possible solutions for UDP connection timeouts

UDP idle timeout timers are set to 4 minutes and aren't configurable. Enable UDP keepalives for both directions in a connection flow to maintain long connections. When a UDP keepalive is enabled, it's only active for one direction in a connection. The connection can still go idle and time out on the other side of a connection. To prevent a UDP connection from idle time-out, UDP keepalives should be enabled for both directions in a connection flow.

Application layer keepalives can also be used to refresh idle flows and reset the idle timeout. Check the server side for what options exist for application specific keepalives.

## Datapath availability drop on NAT gateway but no connection failures

**Scenario**

The datapath availability of NAT gateway drops but no failed connections are observed.

**Possible cause**

Transient drop in datapath availability caused by noise in the datapath.

**How to troubleshoot**

If you observe no impact on your outbound connectivity but see a drop in datapath availability, NAT gateway may be picking up noise in the datapath that shows as a transient drop.

### Recommended alert setup

Set up an [alert for datapath availability drops](/azure/nat-gateway/nat-metrics#alerts-for-datapath-availability-degradation) or use [Azure Resource Health](/azure/nat-gateway/resource-health#resource-health-alerts) to alert on NAT Gateway health events.

## No outbound connectivity to the internet

**Scenario**

You observe no outbound connectivity on your NAT gateway.

**Possible causes**
* NAT gateway misconfiguration
* Internet traffic is redirected away from NAT gateway and force-tunneled to a virtual appliance or to an on-premises destination with a VPN or ExpressRoute.
* NSG rules are configured that block internet traffic
* NAT gateway datapath availability is degraded
* DNS misconfiguration

**How to troubleshoot**
* Check that NAT gateway is configured with at least one public IP address or prefix and attached to a subnet. NAT gateway isn't operational without a public IP and subnet attached. For more information, see [NAT gateway configuration basics](/azure/nat-gateway/troubleshoot-nat#nat-gateway-configuration-basics).
* Check the routing table of the subnet attached to NAT gateway. Any 0.0.0.0/0 traffic being force-tunneled to an NVA, ExpressRoute, or VPN Gateway will take priority over NAT gateway. For more information, see [how Azure selects a route](/azure/virtual-network/virtual-networks-udr-overview#how-azure-selects-a-route).
* Check if there are any NSG rules configured for the NIC on your virtual machine that blocks internet access.
* Check if the datapath availability of NAT gateway is in a degraded state. Refer to [connection failure troubleshooting guidance](#datapath-availability-drop-on-nat-gateway-with-connection-failures) if NAT gateway is in a degraded state.
* Check your DNS settings if DNS isn't resolving properly.

### Possible solutions for loss of outbound connectivity
* Attach a public IP address or prefix to NAT gateway. Also make sure that NAT gateway is attached to subnets from the same virtual network. [Validate that NAT gateway can connect outbound](/azure/nat-gateway/troubleshoot-nat#how-to-validate-connectivity).
* Carefully consider your traffic routing requirements before making any changes to traffic routes for your virtual network. UDRs that send 0.0.0.0/0 traffic to a virtual appliance or virtual network gateway override NAT gateway. See [custom routes](/azure/virtual-network/virtual-networks-udr-overview#custom-routes) to learn more about how custom routes impact the routing of network traffic. To explore options for updating your traffic routes on your subnet routing table, see:
  * [Add a custom route](/azure/virtual-network/manage-route-table#create-a-route)
  * [Change a route](/azure/virtual-network/manage-route-table#change-a-route)
  * [Delete a route](/azure/virtual-network/manage-route-table#delete-a-route)
* Update NSG security rules that block internet access for any of your VMs. For more information, see [manage network security groups](/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal).
* DNS not resolving correctly can happen for many reasons. Refer to the [DNS troubleshooting guide](/azure/dns/dns-troubleshoot) to help investigate why DNS resolution may be failing.

## NAT gateway public IP isn't used to connect outbound

**Scenario**

NAT gateway is deployed in your Azure virtual network but unexpected IP addresses are used for outbound connections.

**Possible causes**
* NAT gateway misconfiguration
* Active connection with another Azure outbound connectivity method such as Azure Load balancer or instance-level public IPs on virtual machines. Active connection flows continue to use the old public IP address that was assigned when the connection was established. When NAT gateway is deployed, new connections start using NAT gateway right away.
* Private IPs are used to connect to Azure services by service endpoints or Private Link
* Connections to storage accounts come from the same region as the VM you're making a connection from.
* Internet traffic is being redirected away from NAT gateway and force-tunneled to an NVA or firewall.

**How to troubleshoot**
* Check that your NAT gateway has at least one public IP address or prefix associated and at least one subnet.
* Check if any previous outbound connectivity method that you previously used before deploying NAT gateway, like a public Load balancer, is still deployed.
* Check if connections being made to other Azure services is coming from a private IP address in your Azure virtual network.
* Check if you have [Private Link](/azure/private-link/manage-private-endpoint?tabs=manage-private-link-powershell#manage-private-endpoint-connections-on-azure-paas-resources) or [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md#logging-and-troubleshooting) enabled for connecting to other Azure services.
* If connecting to Azure storage, check if your VM is in the same region as Azure storage.
* Check if the public IP address being used to make connections is coming from another Azure service in your Azure virtual network, such as an NVA.

### Possible solutions for NAT gateway public IP not used to connect outbound
* Attach a public IP address or prefix to NAT gateway. Also make sure that NAT gateway is attached to subnets from the same virtual network. [Validate that NAT gateway can connect outbound](/azure/nat-gateway/troubleshoot-nat#how-to-validate-connectivity).
* Test and resolve issues with VMs holding on to old SNAT IP addresses from another outbound connectivity method by:
  * Ensure you establish a new connection and that existing connections aren't being reused in the OS or that the browser is caching the connections. For example, when using curl in PowerShell, make sure to specify the -DisableKeepalive parameter to force a new connection. If you're using a browser, connections may also be pooled.
  * It isn't necessary to reboot a virtual machine in a subnet configured to NAT gateway. However, if a virtual machine is rebooted, the connection state is flushed. When the connection state is flushed, all connections begin using the NAT gateway resource's IP address(es). This behavior is a side effect of the virtual machine reboot and not an indicator that a reboot is required.
  * If you're still having trouble, [open a support case](#more-troubleshooting-guidance) for further troubleshooting.
* Custom routes directing 0.0.0.0/0 traffic to an NVA will take precedence over NAT gateway for routing traffic to the internet. To have NAT gateway route traffic to the internet instead of the NVA, [remove the custom route](/azure/virtual-network/manage-route-table#delete-a-route) for 0.0.0.0/0 traffic going to the virtual appliance. The 0.0.0.0/0 traffic resumes using the default route to the internet and NAT gateway is used instead.
> [!IMPORTANT]
> Consider the routing requirements of your cloud architecture before making any changes to how traffic is routed.
* Services deployed in the same region as an Azure storage account use private Azure IP addresses for communication. You can't restrict access to specific Azure services based on their public outbound IP address range. For more information, see [restrictions for IP network rules](/azure/storage/common/storage-network-security?tabs=azure-portal#restrictions-for-ip-network-rules).
* Private Link and service endpoints use the private IP addresses of virtual machine instances in your virtual network to connect to Azure platform services instead of the public IP of NAT gateway. It's recommended to use Private Link to connect to other Azure services over the Azure backbone instead of over the internet with NAT gateway.
>[!NOTE]
>Private Link is the recommended option over Service endpoints for private access to Azure hosted services.

## Connection failures at the public internet destination

**Scenario**

NAT gateway connections to internet destinations fail or time out.

**Possible causes**
* Firewall or other traffic management components at the destination.
* API rate limiting imposed by the destination side.
* Volumetric DDoS mitigations or transport layer traffic shaping.
* The destination endpoint responds with fragmented packets

**How to troubleshoot**
* Validate connectivity to an endpoint in the same region or elsewhere for comparison.
* Conduct packet capture from source and destination sides.
* Look at [packet count](/azure/nat-gateway/nat-metrics#packets) at the source and the destination (if available) to determine how many connection attempts were made.
* Look at [dropped packets](/azure/nat-gateway/nat-metrics#dropped-packets) to see how many packets dropped by NAT gateway.
* Analyze the packets. TCP packets with fragmented IP protocol packets indicate IP fragmentation. **NAT gateway does not support IP fragmentation** and so connections with fragmented packets fail.
* Check that the NAT gateway public IP is allow listed at partner destinations with Firewalls or other traffic management components

### Possible solutions for connection failures at internet destination
* Verify if NAT gateway public IP is allow listed at destination.
* If you're creating high volume or transaction rate testing, explore if reducing the rate reduces the occurrence of failures.
* If changing rate impacts the rate of failures, check if API rate limits, or other constraints on the destination side might have been reached.

## Connection failures at FTP server for active or passive mode

**Scenario**

You see connection failures at an FTP server when using NAT gateway with active or passive FTP mode.

**Possible causes**
* Active FTP mode is enabled.
* Passive FTP mode is enabled and NAT gateway is using more than one public IP address.

### Possible solution for Active FTP mode

FTP uses two separate channels between a client and server, the command and data channels. Each channel communicates on separate TCP connections, one for sending the commands and the other for transferring data.

In active FTP mode, the client establishes the command channel and the server establishes the data channel.

**NAT gateway isn't compatible with active FTP mode**. Active FTP uses a PORT command from the FTP client that tells the FTP server what IP address and port for the server to use on the data channel to connect back to the client. The PORT command uses the private address of the client, which can't be changed. Client side traffic is SNATed by NAT gateway for internet-based communication so the PORT command is seen as invalid by the FTP server.

An alternative solution to active FTP mode is to use passive FTP mode instead. However, in order to use NAT gateway in passive FTP mode, [some considerations](#possible-solution-for-passive-ftp-mode) must be made.

### Possible solution for Passive FTP mode

In passive FTP mode, the client establishes connections on both the command and data channels. The client requests that the server listen on a port rather than try to establish a connection back to the client.

Outbound Passive FTP may not work for NAT gateway with multiple public IP addresses, depending on your FTP server configuration. When a NAT gateway with multiple public IP addresses sends traffic outbound, it randomly selects one of its public IP addresses for the source IP address. FTP may fail when data and control channels use different source IP addresses, depending on your FTP server configuration.

To prevent possible passive FTP connection failures, do the following steps:

1. Check that your NAT gateway is attached to a single public IP address rather than multiple IP addresses or a prefix.
2. Make sure that the passive port range from your NAT gateway is allowed to pass any firewalls that may be at the destination endpoint.

>[!NOTE]
>Reducing the amount of public IP addresses on your NAT gateway reduces the SNAT port inventory available for making outbound connections and may increase the risk of SNAT port exhaustion. Consider your SNAT connectivity needs before removing public IP addresses from NAT gateway.
>It is not recommended to change the FTP server settings to accept control and data plane traffic from different source IP addresses.

## Outbound connections on port 25 are blocked

**Scenario**

Unable to connect outbound with NAT gateway on port 25 for SMTP traffic.

**Cause**

The Azure platform blocks outbound SMTP connections on TCP port 25 for deployed VMs. This block is to ensure better security for Microsoft partners and customers, protect Microsoft’s Azure platform, and conform to industry standards.

### Recommended guidance for sending email

It's recommended you use authenticated SMTP relay services to send email from Azure VMs or from Azure App Service. For more information, see [troubleshoot outbound SMTP connectivity problems](/azure/virtual-network/troubleshoot-outbound-smtp-connectivity).

## More troubleshooting guidance

### Extra network captures

If your investigation is inconclusive, open a support case for further troubleshooting and collect the following information for a quicker resolution. Choose a single virtual machine in your NAT gateway configured subnet to perform the following tests:

* Use **`ps ping`** from one of the backend VMs within the virtual network to test the probe port response (example: **`ps ping 10.0.0.4:3389`**) and record results.

* If no response is received in these ping tests, run a simultaneous Netsh trace on the backend VM, and the virtual network test VM while you run PsPing then stop the Netsh trace.

## Outbound connectivity best practices

Azure monitors and operates its infrastructure with great care. However, transient failures can still occur from deployed applications, there's no guarantee that transmissions are lossless. NAT gateway is the preferred option to connect outbound from Azure deployments in order to ensure highly reliable and resilient outbound connectivity. In addition to using NAT gateway to connect outbound, use the guidance later in the article for how to ensure that applications are using connections efficiently.

### Modify the application to use connection pooling

When you pool your connections, you avoid opening new network connections for calls to the same address and port. You can implement a connection pooling scheme in your application where requests are internally distributed across a fixed set of connections and reused when possible. This setup constrains the number of SNAT ports in use and creates a predictable environment. Connection pooling helps reduce latency and resource utilization and ultimately improve the performance of your applications.

To learn more on pooling HTTP connections, see [Pool HTTP connections](/aspnet/core/performance/performance-best-practices#pool-http-connections-with-httpclientfactory) with HttpClientFactory.

### Modify the application to reuse connections

Rather than generating individual, atomic TCP connections for each request, configure your application to reuse connections. Connection reuse results in more performant TCP transactions and is especially relevant for protocols like HTTP/1.1, where connection reuse is the default. This reuse applies to other protocols that use HTTP as their transport such as REST.

### Modify the application to use less aggressive retry logic

When SNAT ports are exhausted or application failures occur, aggressive or brute force retries without delay and back-off logic cause exhaustion to occur or persist. You can reduce demand for SNAT ports by using a less aggressive retry logic.

Depending on the configured idle timeout, if retries are too aggressive, connections may not have enough time to close and release SNAT ports for reuse.

For extra guidance and examples, see [Retry pattern](../app-service/troubleshoot-intermittent-outbound-connection-errors.md).

### Use keepalives to reset the outbound idle timeout

For more information about keepalives, see [TCP idle timeout](/azure/nat-gateway/nat-gateway-resource#tcp-idle-timeout).

### Use Private link to reduce SNAT port usage for connecting to other Azure services

When possible, Private Link should be used to connect directly from your virtual networks to Azure platform services in order to [reduce the demand](./troubleshoot-nat.md) on SNAT ports. Reducing the demand on SNAT ports can help reduce the risk of SNAT port exhaustion.

To create a Private Link, see the following Quickstart guides to get started:

* [Create a Private Endpoint](../private-link/create-private-endpoint-portal.md?tabs=dynamic-ip)

* [Create a Private Link](../private-link/create-private-link-service-portal.md)

## Next steps

We always strive to enhance our customers' experience. If you encounter NAT gateway issues that not addressed or resolved by this article, provide feedback through GitHub at the bottom of this page.

To learn more about NAT gateway, see:

* [Azure NAT Gateway](./nat-overview.md)

* [NAT gateway resource](./nat-gateway-resource.md)

* [Metrics and alerts for NAT gateway resources](./nat-metrics.md)
