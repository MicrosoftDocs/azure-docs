---
title: Network security for Azure Service Bus
description: This article describes network security features such as service tags, IP firewall rules, service endpoints, and private endpoints. 
services: service-bus-messaging
documentationcenter: .net
author: axisc
editor: spelluru

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/10/2020
ms.author: aschhab

---



# Network security for Azure Service Bus 
This article describes how to use the following security features with Azure Service Bus: 

- Service tags
- IP Firewall rules
- Network service endpoints
- Private endpoints (preview)


## Service tags
A service tag represents a group of IP address prefixes from a given Azure service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change, minimizing the complexity of frequent updates to network security rules. For more information about service tags, see [Service tags overview](../virtual-network/service-tags-overview.md).

You can use service tags to define network access controls on [network security groups](../virtual-network/security-overview.md#security-rules) or [Azure Firewall](../firewall/service-tags.md). Use service tags in place of specific IP addresses when you create security rules. By specifying the service tag name (for example, **ServiceBus**) in the appropriate *source* or *destination* field of a rule, you can allow or deny the traffic for the corresponding service.

| Service tag | Purpose | Can use inbound or outbound? | Can be regional? | Can use with Azure Firewall? |
| --- | -------- |:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **ServiceBus** | Azure Service Bus traffic that uses the Premium service tier. | Outbound | Yes | Yes |


> [!NOTE]
> You can use service tags only for **premium** namespaces. If you are using a **standard** namespace, use the IP address that you see when you run the following command: `nslookup <host name for the namespace>`. For example: `nslookup contosons.servicebus.windows.net`. 

## IP firewall 
By default, Service Bus namespaces are accessible from internet as long as the request comes with valid authentication and authorization. With IP firewall, you can restrict it further to only a set of IPv4 addresses or IPv4 address ranges in [CIDR (Classless Inter-Domain Routing)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation.

This feature is helpful in scenarios in which Azure Service Bus should be only accessible from certain well-known sites. Firewall rules enable you to configure rules to accept traffic originating from specific IPv4 addresses. For example, if you use Service Bus with [Azure Express Route][express-route], you can create a **firewall rule** to allow traffic from only your on-premises infrastructure IP addresses or addresses of a corporate NAT gateway. 

The IP firewall rules are applied at the Service Bus namespace level. Therefore, the rules apply to all connections from clients using any supported protocol. Any connection attempt from an IP address that does not match an allowed IP rule on the Service Bus namespace is rejected as unauthorized. The response does not mention the IP rule. IP filter rules are applied in order, and the first rule that matches the IP address determines the accept or reject action.

For more information, see [How to configure IP firewall for a Service Bus namespace](service-bus-ip-filtering.md)

## Network service endpoints
The integration of Service Bus with [Virtual Network (VNet) service endpoints](service-bus-service-endpoints.md) enables secure access to messaging capabilities from workloads like virtual machines that are bound to virtual networks, with the network traffic path being secured on both ends.

Once configured to be bound to at least one virtual network subnet service endpoint, the respective Service Bus namespace will no longer accept traffic from anywhere but authorized virtual network(s). From the virtual network perspective, binding a Service Bus namespace to a service endpoint configures an isolated networking tunnel from the virtual network subnet to the messaging service.

The result is a private and isolated relationship between the workloads bound to the subnet and the respective Service Bus namespace, in spite of the observable network address of the messaging service endpoint being in a public IP range.

> [!IMPORTANT]
> Virtual Networks are supported only in [Premium tier](service-bus-premium-messaging.md) Service Bus namespaces.
> 
> When using VNet service endpoints with Service Bus, you should not enable these endpoints in applications that mix Standard and Premium tier Service Bus namespaces. Because Standard tier does not support VNets. The endpoint is restricted to Premium tier namespaces only.

### Advanced security scenarios enabled by VNet integration 

Solutions that require tight and compartmentalized security, and where virtual network subnets provide the segmentation between the compartmentalized services, generally still need communication paths between services residing in those compartments.

Any immediate IP route between the compartments, including those carrying HTTPS over TCP/IP, carries the risk of exploitation of vulnerabilities from the network layer on up. Messaging services provide completely insulated communication paths, where messages are even written to disk as they transition between parties. Workloads in two distinct virtual networks that are both bound to the same Service Bus instance can communicate efficiently and reliably via messages, while the respective network isolation boundary integrity is preserved.
 
That means your security sensitive cloud solutions not only gain access to Azure industry-leading reliable and  scalable asynchronous messaging capabilities, but they can now use messaging to create communication paths between secure solution compartments that are inherently more secure than what is achievable with any peer-to-peer communication mode, including HTTPS and other TLS-secured socket protocols.

### Bind Service Bus to Virtual Networks

*Virtual network rules* are the firewall security feature that controls whether your Azure Service Bus server accepts connections from a particular virtual network subnet.

Binding a Service Bus namespace to a virtual network is a two-step process. You first need to create a **Virtual Network service endpoint** on a Virtual Network subnet and enable it for **Microsoft.ServiceBus** as explained in the [service endpoint overview](service-bus-service-endpoints.md). Once you have added the service endpoint, you bind the Service Bus namespace to it with a **virtual network rule**.

The virtual network rule is an association of the Service Bus namespace with a virtual network subnet. While the rule exists, all workloads bound to the subnet are granted access to the Service Bus namespace. Service Bus itself never establishes outbound connections, does not need to gain access, and is therefore never granted access to your subnet by enabling this rule.

For more information, see [How to configure virtual network service endpoints for a Service Bus namespace](service-bus-service-endpoints.md)

## Private endpoints

Azure Private Link Service enables you to access Azure services (for example, Azure Service Bus, Azure Storage, and Azure Cosmos DB) and Azure hosted customer/partner services over a **private endpoint** in your virtual network.

A private endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. The private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute or VPN connections, or public IP addresses are needed. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can connect to an instance of an Azure resource, giving you the highest level of granularity in access control.

For more information, see [What is Azure Private Link?](../private-link/private-link-overview.md)

> [!NOTE]
> This feature is supported with the **premium** tier of Azure Service Bus. For more information about the premium tier, see the [Service Bus Premium and Standard messaging tiers](service-bus-premium-messaging.md) article.
>
> This feature is currently in **preview**. 


For more information, see [How to configure private endpoints for a Service Bus namespace](private-link-service.md)


## Next steps
See the following articles:

- [How to configure IP firewall for a Service Bus namespace](service-bus-ip-filtering.md)
- [How to configure virtual network service endpoints for a Service Bus namespace](service-bus-service-endpoints.md)
- [How to configure private endpoints for a Service Bus namespace](private-link-service.md)
