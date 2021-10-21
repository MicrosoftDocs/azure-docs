---

title: What is Azure Virtual Network NAT?
titlesuffix: Azure Virtual Network
description: Overview of Virtual Network NAT features, resources, architecture, and implementation. Learn how Virtual Network NAT works and how to use NAT gateway resources in the cloud.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: nat
ms.topic: conceptual
ms.date: 10/20/2021
ms.author: allensu
# Customer intent: As an IT administrator, I want to learn more about Virtual Network NAT, its NAT gateway resources, and what I can use them for. 
---
# What is Virtual Network NAT?

Virtual Network NAT is a fully managed and highly resilient Network Address Translation (NAT) service. VNet NAT simplifies outbound Internet connectivity for virtual networks. When configured on a subnet, all outbound connectivity uses the VNet NAT's static public IP addresses. 

:::image type="content" source="./media/nat-overview/flow-map.png" alt-text="Figure shows a NAT receiving traffic from internal subnets and directing it to a public IP (PIP) and an IP prefix.":::

*Figure: Virtual Network NAT*

## VNet NAT benefits

* Fully managed, highly resilient - NAT is fully scaled out from the start. There's no ramp up or scale-out operation required.  Azure manages the operation of NAT for you.  NAT always has multiple fault domains and can sustain multiple failures without service outage.
* Static IP addresses for outbound-only


## VNet NAT basics

NAT can be created in a specific Availability Zone and has redundancy built in within the specificed zone. NAT is non zonal by default. When creating [availability zones](../../availability-zones/az-overview.md) scenarios, NAT can be isolated in a specific zone. This is known as a zonal deployment.

* Outbound connectivity can be defined for each subnet with NAT.  Multiple subnets within the same virtual network can have different NATs. A subnet is configured by specifying which NAT gateway resource to use.  All outbound traffic for the subnet is processed by NAT automatically without any customer configuration.  User-defined routes aren't necessary. NAT takes precedence over other outbound scenarios and replaces the default Internet destination of a subnet.
* NAT supports TCP and UDP protocols only. ICMP is not supported.
* A NAT gateway resource can use a:

  * Public IP
  * Public IP prefix
* NAT is compatible with Standard SKU public IP address or public IP prefix resources or a combination of both. You can use a public IP prefix directly or distribute the public IP addresses of the prefix across multiple NAT gateway resources. NAT will groom all traffic to the range of IP addresses of the prefix. Basic resources, such as Basic Load Balancer or Basic Public IP aren't compatible with NAT.  Basic resources must be placed on a subnet associated to a NAT Gateway.
* NAT cannot be associated to an IPv6 Public IP address or IPv6 Public IP Prefix. However, it can be associated to a dual stack subnet.
* NAT allows flows to be created from the virtual network to the services outside your VNet. Return traffic from the Internet is only allowed in response to an active flow. Services outside your VNet cannot initiate a connection to instances.
* NAT can't span multiple virtual networks.
* NAT cannot be deployed in a [Gateway Subnet](../../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsub)
* The private side of NAT (virtual machine instances or other compute resources) sends TCP Reset packets for attempts to communicate on a TCP connection that doesn't exist. One example is connections that have reached idle timeout. The next packet received will return a TCP Reset to the private IP address to signal and force connection closure. The public side of NAT doesn't generate TCP Reset packets or any other traffic.  Only traffic produced by the customer's virtual network is emitted.
* A default TCP idle timeout of 4 minutes is used and can be increased to up to 120 minutes. Any activity on a flow can also reset the idle timer, including TCP keepalives.

## Pricing and SLA

For pricing details, see [Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network). NAT data path is at least 99.9% available.

## Next steps

* Learn [how to get better outbound connectivity using an Azure NAT Gateway](https://www.youtube.com/watch?v=2Ng_uM0ZaB4).
* Learn about [NAT gateway resource](./nat-gateway-resource.md).
* Learn more about [NAT gateway metrics](./nat-metrics.md).
