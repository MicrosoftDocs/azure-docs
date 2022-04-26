---

title: What is Azure Virtual Network NAT?
titlesuffix: Azure Virtual Network
description: Overview of Virtual Network NAT features, resources, architecture, and implementation. Learn how Virtual Network NAT works and how to use NAT gateway resources in Azure.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: nat
ms.topic: conceptual
ms.date: 02/25/2022
ms.author: allensu
---

# What is Virtual Network NAT?

Virtual Network NAT is a fully managed and highly resilient Network Address Translation (NAT) service. Virtual Network NAT simplifies outbound Internet connectivity for virtual networks. When configured on a subnet, all outbound connectivity uses the Virtual Network NAT's static public IP addresses. 

:::image type="content" source="./media/nat-overview/flow-map.png" alt-text="Figure shows a NAT receiving traffic from internal subnets and directing it to a public IP (PIP) and an IP prefix.":::

*Figure: Virtual Network NAT*

## Virtual Network NAT benefits

### Security

With NAT, individual VMs (or other compute resources) don't need public IP addresses and can remain fully private. Resources without a public IP address can still reach external sources outside the virtual network. You can associate a public IP prefix to ensure that a contiguous set of IPs will be used for outbound. Destination firewall rules can be configured based on this predictable IP list.

### Resiliency 

NAT is a fully managed and distributed service. It doesn't depend on any individual compute instances such as VMs or a single physical gateway device. NAT uses software defined networking making it highly resilient. 

### Scalability

NAT can be associated to a subnet and can be used by all compute resources in that subnet. Further, all subnets in a virtual network can use the same resource. When associated to a public IP prefix, it automatically scales to the number of IP addresses needed for outbound.

### Performance

NAT won't affect the network bandwidth of your compute resources since it's a software defined networking service. Learn more about [NAT gateway's performance](nat-gateway-resource.md#performance).

## Virtual Network NAT basics

NAT can be created in a specific availability zone and has redundancy built in within the specified zone. NAT is non-zonal by default. When you create [availability zones](../../availability-zones/az-overview.md) scenarios, NAT can be isolated in a specific zone. This deployment is called a zonal deployment.

NAT is fully scaled out from the start. There's no ramp up or scale-out operation required. Azure manages the operation of NAT for you. NAT always has multiple fault domains and can sustain multiple failures without service outage.

* Outbound connectivity can be defined for each subnet with NAT. Multiple subnets within the same virtual network can have different NATs. Or multiple subnets within the same virtual network can use the same NAT. A subnet is configured by specifying which NAT gateway resource to use.  All outbound traffic for the subnet is processed by NAT automatically without any customer configuration. NAT takes precedence over other outbound scenarios and replaces the default Internet destination of a subnet.

* UDRs that have been set up to direct traffic outbound to the internet take precedence over NAT gateway. See [Troubleshooting NAT gateway](./troubleshoot-nat.md#udr-supersedes-nat-gateway-for-going-outbound) to learn more.

* NAT supports TCP and UDP protocols only. ICMP isn't supported.

* A NAT gateway resource can use a:

  * Public IP

  * Public IP prefix

* NAT is compatible with standard SKU public IP addresses or public IP prefix resources or a combination of both. You can use a public IP prefix directly or distribute the public IP addresses of the prefix across multiple NAT gateway resources. NAT will groom all traffic to the range of IP addresses of the prefix. Basic resources, such as basic load balancer or basic public IPs aren't compatible with NAT.  Basic resources must be placed on a subnet not associated to a NAT Gateway. Basic load balancer and basic public IP can be upgraded to standard to work with NAT gateway.
  
* To upgrade a basic load balancer to standard, see [Upgrade a public Azure Load Balancer](../../load-balancer/upgrade-basic-standard.md)

* To upgrade a basic public IP to standard, see [Upgrade a public IP address](../ip-services/public-ip-upgrade-portal.md)

* NAT is the recommended method for outbound connectivity. A NAT gateway doesn't have the same limitations of SNAT port exhaustion as does [default outbound access](../ip-services/default-outbound-access.md) and [outbound rules of a load balancer](../../load-balancer/outbound-rules.md). 

  * To migrate outbound access to a NAT gateway from default outbound access or from load balancer outbound rules, see [Migrate outbound access to Azure Virtual Network NAT](./tutorial-migrate-outbound-nat.md)

* NAT can’t be associated to an IPv6 public IP address or IPv6 public IP prefix. It can be associated to a dual stack subnet.

* NAT allows flows to be created from the virtual network to the services outside your virtual network. Return traffic from the Internet is only allowed in response to an active flow. Services outside your virtual network can’t initiate an inbound connection through NAT gateway.

* NAT can’t span multiple virtual networks.

* Multiple NATs can’t be attached to a single subnet. 

* NAT can’t be deployed in a [gateway subnet](../../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsub)

* The private side of NAT (virtual machine instances or other compute resources) sends TCP reset packets for attempts to communicate on a TCP connection that doesn't exist. One example is connections that have reached idle timeout. The next packet received will return a TCP reset to the private IP address to signal and force connection closure. The public side of NAT doesn't generate TCP reset packets or any other traffic. Only traffic produced by the customer's virtual network is emitted.

* A default TCP idle timeout of 4 minutes is used and can be increased to up to 120 minutes. Any activity on a flow can also reset the idle timer, including TCP keepalives.

## Next steps

* Learn [how to get better outbound connectivity using an Azure NAT Gateway](https://www.youtube.com/watch?v=2Ng_uM0ZaB4).
* Learn about [NAT gateway resource](./nat-gateway-resource.md).
* Learn more about [NAT gateway metrics](./nat-metrics.md).