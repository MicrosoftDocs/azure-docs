---
title: Troubleshoot Azure Load Balancer outbound connectivity issues  
description: Learn troubleshooting guidance for outbound connections in Azure Load Balancer. This includes issues of SNAT exhaustion and connection timeouts.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.custom: ignite-2022
ms.topic: troubleshooting
ms.date: 08/24/2023
ms.author: mbender
---

# Troubleshoot Azure Load Balancer outbound connectivity issues

Learn troubleshooting guidance for outbound connections in Azure Load Balancer. This includes understanding source network address translation (SNAT) and it's impact on connections, using individual public IPs on VMs, and designing applications for connection efficiency to avoid SNAT port exhaustion. Most problems with outbound connectivity that customers experience is due to SNAT port exhaustion and connection timeouts leading to dropped packets. 

To learn more about SNAT ports, see [Source Network Address Translation for outbound connections](load-balancer-outbound-connections.md).

## Understand your SNAT port usage

Follow [Standard load balancer diagnostics with metrics, alerts, and resource health](load-balancer-standard-diagnostics.md) to monitor your existing load balancer’s SNAT port usage and allocation. Monitor to confirm or determine the risk of SNAT exhaustion. If you're having trouble understanding your outbound connection behavior, use IP stack statistics (netstat) or collect packet captures. You can perform these packet captures in the guest OS of your instance or use [Network Watcher for packet capture](../network-watcher/network-watcher-packet-capture-manage-portal.md). For most scenarios, Azure recommends using a NAT gateway for outbound connectivity to reduce the risk of SNAT exhaustion. A NAT gateway is highly recommended if your service is initiating repeated TCP or UDP outbound connections to the same destination.

## Optimize your Azure deployments for outbound connectivity

It's important to optimize your Azure deployments for outbound connectivity. Optimization can prevent or alleviate issues with outbound connectivity.

### Deploy NAT gateway for outbound Internet connectivity

Azure NAT Gateway is a highly resilient and scalable Azure service that provides outbound connectivity to the internet from your virtual network. A NAT gateway’s unique method of consuming SNAT ports helps resolve common SNAT exhaustion and connection issues. For more information about Azure NAT Gateway, see [What is Azure NAT Gateway?](../virtual-network/nat-gateway/nat-overview.md).

* **How does a NAT gateway reduce the risk of SNAT port exhaustion?**

    Azure Load Balancer allocates fixed amounts of SNAT ports to each virtual machine instance in a backend pool. This method of allocation can lead to SNAT exhaustion, especially if uneven traffic patterns result in a specific virtual machine sending a higher volume of outgoing connections. Unlike load balancer, a NAT gateway dynamically allocates SNAT ports across all VM instances within a subnet. 

    A NAT gateway makes available SNAT ports accessible to every instance in a subnet. This dynamic allocation allows VM instances to use the number of SNAT ports each need from the available pool of ports for new connections. The dynamic allocation reduces the risk of SNAT exhaustion.

    :::image type="content" source="./media/troubleshoot-outbound-connection/load-balancer-vs-nat.png" alt-text="Diagram of Azure Load Balancer vs. Azure NAT Gateway.":::

* **Port selection and reuse behavior.**
    
    A NAT gateway selects ports at random from the available pool of ports. If there aren't available ports, SNAT ports are reused as long as there's no existing connection to the same destination public IP and port. This port selection and reuse behavior of a NAT gateway makes it less likely to experience connection timeouts. 

    To learn more about how SNAT and port usage works for NAT gateway, see [SNAT fundamentals](../virtual-network/nat-gateway/nat-gateway-resource.md#fundamentals). There are a few conditions in which you won't be able to use NAT gateway for outbound connections. For more information on NAT gateway limitations, see [NAT Gateway limitations](../virtual-network/nat-gateway/nat-gateway-resource.md#limitations).

    If you're unable to use a NAT gateway for outbound connectivity, refer to the other migration options described in this article.

### Configure load balancer outbound rules to maximize SNAT ports per VM

If you’re using a public standard load balancer and experience SNAT exhaustion or connection failures, ensure you’re using outbound rules with manual port allocation. Otherwise, you’re likely relying on load balancer’s default outbound access. Default outbound access automatically allocates a conservative number of ports, which is based on the number of instances in your backend pool. Default outbound access isn't a recommended method for enabling outbound connections. When your backend pool scales, your connections may be impacted if ports need to be reallocated. 

To learn more about default outbound access and default port allocation, see [Source Network Address Translation for outbound connections](load-balancer-outbound-connections.md).

To increase the number of available SNAT ports per VM, configure outbound rules with manual port allocation on your load balancer. For example, if you know you have a maximum of 10 VMs in your backend pool, you can allocate up to 6,400 SNAT ports per VM rather than the default 1,024. If you need more SNAT ports, you can add multiple frontend IP addresses for outbound connections to multiply the number of SNAT ports available. Make sure you understand why you're exhausting SNAT ports before adding more frontend IP addresses. 

For detailed guidance, see [Design your applications to use connections efficiently](#design-connection-efficient-applications) later in this article. To add more IP addresses for outbound connections, create a frontend IP configuration for each new IP. When outbound rules are configured, you're able to select multiple frontend IP configurations for a backend pool. It's recommended to use different IP addresses for inbound and outbound connectivity. Different IP addresses isolate traffic for improved monitoring and troubleshooting.

### Configure an individual public IP on VM

For smaller scale deployments, you can consider assigning a public IP to a VM. If a public IP is assigned to a VM, all ports provided by the public IP are available to the VM. Unlike with a load balancer or a NAT gateway, the ports are only accessible to the single VM associated with the IP address. 

We highly recommend considering utilizing NAT gateway instead, as assigning individual public IP addresses isn't a scalable solution.

> [!NOTE]
> If you need to connect your Azure virtual network to Azure PaaS services like Azure Storage, Azure SQL, Azure Cosmos DB, or other [available Azure services](../private-link/availability.md), you can use Azure Private Link to avoid SNAT entirely. Azure Private Link sends traffic from your virtual network to Azure services over the Azure backbone network instead of over the internet.
>
>Private Link is the recommended option over service endpoints for private access to Azure hosted services. For more information on the difference between Private Link and service endpoints, see [Compare Private Endpoints and Service Endpoints](../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).

## Design connection-efficient applications

When you design your applications, ensure they use connections efficiently. Connection efficiency can reduce or eliminate SNAT port exhaustion in your deployed applications.

### Modify the application to reuse connections

Rather than generating individual, atomic TCP connections for each request, we recommend configuring your application to reuse connections. Connection reuse results in more performant TCP transactions and is especially relevant for protocols like HTTP/1.1, where connection reuse is the default. This reuse applies to other protocols that use HTTP as their transport such as REST.

### Modify the application to use connection pooling

Employ a connection pooling scheme in your application, where requests are internally distributed across a fixed set of connections and reused when possible. This scheme constrains the number of SNAT ports in use and creates a more predictable environment. 

This scheme can increase the throughput of requests by allowing multiple simultaneous operations when a single connection is blocking on the reply of an operation.

Connection pooling might already exist within the framework that you're using to develop your application or the configuration settings for your application. You can combine connection pooling with connection reuse. Your multiple requests then consume a fixed, predictable number of ports to the same destination IP address and port. 

The requests benefit from efficient use of TCP transactions, reducing latency and resource utilization. UDP transactions can also benefit. The management of the number of UDP flows can avoid exhaust conditions and manage the SNAT port utilization.

### Modify the application to use less aggressive retry logic

When SNAT ports are exhausted or application failures occur, aggressive or brute force retries without decay and back-off logic cause exhaustion to occur or persist. You can reduce demand for SNAT ports by using a less aggressive retry logic.

Depending on the configured idle timeout, if retries are too aggressive, connections may not have enough time to close and release SNAT ports for reuse.

### Use keepalives to reset the outbound idle timeout

Load balancer outbound rules have a 4-minute idle timeout by default that is adjustable up to 100 minutes. You can use TCP keepalives to refresh an idle flow and reset this idle timeout if necessary. When using TCP keepalives, it's sufficient to enable them on one side of the connection. 

For example, it's sufficient to enable them on the server side only to reset the idle timer of the flow and it's not necessary for both sides to initiate TCP keepalives. Similar concepts exist for application layer, including database client-server configurations. Check the server side for what options exist for application-specific keepalives.

## Next steps

For more information about SNAT port exhaustion, outbound connectivity options, and default outbound access see:

* [Use Source Network Address Translation (SNAT) for outbound connections](load-balancer-outbound-connections.md)

* [Default outbound access in Azure](../virtual-network/ip-services/default-outbound-access.md)
