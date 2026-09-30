---
title: Network Security for Azure Service Bus
description: This article describes network security features such as service tags, IP firewall rules, service endpoints, and private endpoints. 
ms.topic: concept-article
ms.date: 06/08/2023
---

# Network security for Azure Service Bus

This article describes how to use security features with Azure Service Bus.

## Service tags

A service tag represents a group of IP address prefixes from an Azure service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change. This management minimizes the complexity of frequent updates to network security rules. For more information about service tags, see [Azure service tags overview for virtual network security](../virtual-network/service-tags-overview.md).

Use service tags to define network access controls on [network security groups](../virtual-network/network-security-groups-overview.md#security-rules) or [Azure Firewall](../firewall/service-tags.md). Use service tags in place of specific IP addresses when you create security rules. By specifying the service tag name (for example, `ServiceBus`) in the appropriate *source* or *destination* field of a rule, you can allow or deny the traffic for the corresponding service.

In the context of service tags, the term *outbound* refers to traffic that's outbound from an Azure virtual network. This traffic represents inbound traffic to Service Bus. In other words, the service tag contains the IP addresses that are used for traffic flowing into Service Bus from your virtual network.

| Service tag | Purpose | Can use inbound or outbound? | Can be regional? | Can use with Azure Firewall? |
| --- | -------- |:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `ServiceBus` | Azure Service Bus traffic | Outbound | Yes | Yes |

> [!NOTE]
> Previously, Service Bus service tags included only the IP addresses of namespaces on the Premium tier. They now include the IP addresses of all namespaces, regardless of the tier.

## IP firewall rules

By default, users can access Service Bus namespaces from the internet as long as the request comes with valid authentication and authorization. By using the IP firewall, you can restrict access to only a set of IPv4 addresses or IPv4 address ranges in CIDR (Classless Inter-Domain Routing) notation.

This feature is helpful in scenarios where Azure Service Bus should be accessible only from certain well-known sites. You can use firewall rules to configure rules to accept traffic that originates from specific IPv4 addresses. For example, if you use Service Bus with [Azure ExpressRoute](../expressroute/expressroute-introduction.md), you can create a firewall rule to allow traffic from only your on-premises infrastructure IP addresses or addresses of a corporate NAT gateway.

The Service Bus namespace applies the IP firewall rules. The rules apply to all connections from clients that use any supported protocol. The Service Bus namespace rejects any connection attempt from an IP address that doesn't match an allowed IP rule as unauthorized. The response doesn't mention the IP rule. IP filter rules are applied in order, and the first rule that matches the IP address determines the acceptance or rejection.

For more information, see [Configure an IP firewall for an existing namespace](service-bus-ip-filtering.md#configure-ip-firewall-for-an-existing-namespace).

## Network service endpoints

By integrating Service Bus with [virtual network service endpoints](service-bus-service-endpoints.md), you can securely access messaging capabilities from workloads like virtual machines that are bound to virtual networks. The network traffic path is secured on both ends.

When you configure a Service Bus namespace to be bound to at least one service endpoint for a virtual network subnet, the Service Bus namespace no longer accepts traffic from anywhere but authorized virtual networks. From the virtual network perspective, binding a Service Bus namespace to a service endpoint configures an isolated networking tunnel from the virtual network subnet to the messaging service.

The result is a private and isolated relationship between the workloads bound to the subnet and the respective Service Bus namespace, even though the observable network address of the messaging service endpoint is in a public IP range.

> [!IMPORTANT]
> Virtual networks are supported only in [Premium-tier](service-bus-premium-messaging.md) Service Bus namespaces.
>
> When you use virtual network service endpoints with Service Bus, don't enable these endpoints in applications that mix Standard-tier and Premium-tier Service Bus namespaces. Because the Standard tier doesn't support virtual networks, the endpoints are restricted to Premium-tier namespaces only.

### Advanced security scenarios for virtual network integration

Solutions that require tight and compartmentalized security, and where virtual network subnets provide the segmentation between the compartmentalized services, generally still need communication paths between those services.

Any immediate IP route between the compartments, including those carrying HTTPS over TCP/IP, carries the risk of exploitation of vulnerabilities from the network layer and higher layers. Messaging services provide completely insulated communication paths, where messages are even written to disk as they transition between parties. Workloads in two distinct virtual networks that are both bound to the same Service Bus instance can communicate efficiently and reliably via messages, while preserving the integrity of the respective network isolation boundary.

This messaging is inherently more secure than what's achievable with any peer-to-peer communication mode, including HTTPS and other TLS-secured socket protocols.

### Binding Service Bus to virtual networks

*Virtual network rules* are the firewall security feature that controls whether your Azure Service Bus server accepts connections from a particular virtual network subnet.

Binding a Service Bus namespace to a virtual network is a two-step process. First, create a virtual network service endpoint on a virtual network subnet and enable it for `Microsoft.ServiceBus`, as explained in the [service endpoint overview](service-bus-service-endpoints.md). After you add the service endpoint, bind the Service Bus namespace to it by using a virtual network rule.

The virtual network rule associates the Service Bus namespace with a virtual network subnet. While the rule exists, all workloads bound to the subnet are granted access to the Service Bus namespace. Service Bus itself never establishes outbound connections, doesn't need to gain access, and is never granted access to your subnet when you enable this rule.

For more information, see [Allow access to an Azure Service Bus namespace from specific virtual networks](service-bus-service-endpoints.md).

## Private endpoints

By using the Azure Private Link service, you can access Azure services (for example, Azure Service Bus, Azure Storage, and Azure Cosmos DB) and Azure-hosted customer or partner services over a private endpoint in your virtual network.

A private endpoint is a network interface that connects you privately to a service that's related to Azure Private Link. The private endpoint uses a private IP address from your virtual network to effectively bring the service into your virtual network.

You can route all traffic to the service through the private endpoint, so you don't need any gateways, NAT devices, ExpressRoute or VPN connections, or public IP addresses. Traffic between your virtual network and the service traverses the Microsoft backbone network to eliminate exposure from the public internet. You can connect to an instance of an Azure resource for the highest level of granularity in access control.

For more information, see [What is Azure Private Link?](../private-link/private-link-overview.md).

> [!NOTE]
> The Premium tier of Azure Service Bus supports this feature. For more information about the Premium tier, see the [article about Service Bus Premium and Standard messaging tiers](service-bus-premium-messaging.md).

For more information, see [Allow access to Azure Service Bus namespaces via private endpoints](private-link-service.md).

## Network security perimeter

Another way to help secure your Service Bus namespace is to include it in a network security perimeter. A network security perimeter establishes a logical boundary for platform as a service (PaaS) resources. This boundary restricts communication to resources within the perimeter and controls public access through explicit rules. This technique can be particularly useful when you want to establish a security boundary around Service Bus and other PaaS resources like Azure Key Vault.

For more information, see [Network security perimeter for Azure Service Bus](network-security-perimeter.md).

## Related content

- [Configure an IP firewall for a Service Bus namespace](service-bus-ip-filtering.md)
- [Configure virtual network service endpoints for a Service Bus namespace](service-bus-service-endpoints.md)
- [Configure private endpoints for a Service Bus namespace](private-link-service.md)
