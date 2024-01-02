---
title: Network security for Azure Relay
description: This article describes how to use IP firewall rules and private endpoints with Azure Relay.
ms.topic: conceptual
ms.date: 08/10/2023
---

# Network security for Azure Relay 
This article describes how to use the following security features with Azure Relay: 

- IP firewall rules
- Private endpoints 

> [!NOTE]
> Azure Relay doesn't support network service endpoints. 


## IP firewall 
By default, Relay namespaces are accessible from internet as long as the request comes with valid authentication and authorization. With IP firewall, you can restrict it further to only a set of IPv4 addresses or IPv4 address ranges in [CIDR (Classless Inter-Domain Routing)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation.

This feature is helpful in scenarios in which Azure Relay should be only accessible from certain well-known sites. Firewall rules enable you to configure rules to accept traffic originating from specific IPv4 addresses. For example, if you use Relay with [Azure Express Route](../expressroute/expressroute-faqs.md#supported-services), you can create a **firewall rule** to allow traffic from only your on-premises infrastructure IP addresses. 

The IP firewall rules are applied at the Relay namespace level. Therefore, the rules apply to all connections from clients using any supported protocol. Any connection attempt from an IP address that doesn't match an allowed IP rule on the Relay namespace is rejected as unauthorized. The response doesn't mention the IP rule. IP filter rules are applied in order, and the first rule that matches the IP address determines the accept or reject action.

For more information, see [How to configure IP firewall for a Relay namespace](ip-firewall-virtual-networks.md)

## Private endpoints

Azure **Private Link Service** enables you to access Azure services (for example, Azure Relay, Azure Service Bus, Azure Event Hubs, Azure Storage, and Azure Cosmos DB) and Azure hosted customer/partner services over a private endpoint in your virtual network. For more information, see [What is Azure Private Link?](../private-link/private-link-overview.md)

A **private endpoint** is a network interface that allows your workloads running in a virtual network to connect privately and securely to a service that has a **private link resource** (for example, a Relay namespace). The private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute, VPN connections, or public IP addresses are needed. Traffic between your virtual network and the service traverses over the Microsoft backbone network eliminating exposure from the public Internet. You can provide a level of granularity in access control by allowing connections to specific Azure Relay namespaces.

For more information, see [How to configure private endpoints](private-link-service.md)


## Next steps
See the following articles:

- [How to configure IP firewall](ip-firewall-virtual-networks.md)
- [How to configure private endpoints](private-link-service.md)
