---

title: What is Azure Virtual Network NAT?
titlesuffix: Azure Virtual Network
description: Overview of Virtual Network NAT features, resources, architecture, and implementation. Learn how Virtual Network NAT works and how to use NAT gateway resources in Azure.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: nat
ms.topic: conceptual
ms.date: 03/17/2022
ms.author: allensu
---

# What is Virtual Network NAT?

Virtual Network NAT is a fully managed and highly resilient Network Address Translation (NAT) service. Virtual Network NAT simplifies outbound Internet connectivity for virtual networks. When configured on a subnet, all outbound connectivity uses the Virtual Network NAT's static public IP addresses. 

:::image type="content" source="./media/nat-overview/flow-map.png" alt-text="Figure shows a NAT receiving traffic from internal subnets and directing it to a public IP (PIP) and an IP prefix.":::

*Figure: Virtual Network NAT*

## Virtual Network NAT benefits

### Security

With a NAT gateway, individual VMs or other compute resources, don't need public IP addresses and can remain private. Resources without a public IP address can still reach external sources outside the virtual network. You can associate a public IP prefix to ensure that a contiguous set of IPs will be used for outbound. Destination firewall rules can be configured based on this predictable IP list.

### Resiliency 

Virtual Network NAT is a fully managed and distributed service. It doesn't depend on individual compute instances such as VMs or a single physical gateway device. Software defined networking makes a NAT gateway highly resilient. 

### Scalability

Virtual Network NAT is scaled out from creation. There isn't a ramp up or scale-out operation required. Azure manages the operation of Virtual Network NAT for you. A NAT gateway always has multiple fault domains and can sustain multiple failures without service outage.

A NAT gateway resource can be associated to a subnet and can be used by all compute resources in that subnet. All subnets in a virtual network can use the same resource. When a NAT gateway is associated to a public IP prefix, it automatically scales to the number of IP addresses needed for outbound.

### Performance

Virtual Network NAT is a software defined networking service. A NAT gateway won't affect the network bandwidth of your compute resources. Learn more about [NAT gateway's performance](nat-gateway-resource.md#performance).

## Virtual Network NAT basics

### Outbound connectivity

* Virtual Network NAT (NAT gateway) is the recommended method for outbound connectivity. NAT gateway doesn't have the same limitations of SNAT port exhaustion as does [default outbound access](../ip-services/default-outbound-access.md) and [outbound rules of a load balancer](../../load-balancer/outbound-rules.md).

* NAT gateway allows flows to be created from the virtual network to the services outside your virtual network. Return traffic from the internet is only allowed in response to an active flow. Services outside your virtual network can’t initiate an inbound connection through NAT gateway.

  * To migrate outbound access to a NAT gateway from default outbound access or load balancer outbound rules, see [Migrate outbound access to Azure Virtual Network NAT](./tutorial-migrate-outbound-nat.md).

* NAT gateway takes precedence over other outbound scenarios (including Load balancer and instance-level public IP addresses) and replaces the default Internet destination of a subnet.

* When NAT gateway is configured to a virtual network where standard Load balancer with outbound rules already exists, NAT gateway will take over all outbound traffic moving forward. There will be no drops in traffic flow for existing connections on Load balancer. All new connections will use NAT gateway. 

* Presence of custom UDRs for virtual appliances and ExpressRoute override NAT gateway for directing internet bound traffic (route to the 0.0.0.0/0 address prefix).

* The order of operations for outbound connectivity follows this order of precedence:
Virtual appliance UDR / ExpressRoute >> NAT gateway >> Instance-level public IP addresses on virtual machines >> Load balancer outbound rules >> default system

* NAT gateway supports TCP and UDP protocols only. ICMP isn't supported.

* When virtual machine instances or other compute resources attempt to communicate on a TCP connection that doesn't exist, they send TCP reset packets. An example is connections that have reached idle timeout. The next packet received will return a TCP reset to the private IP address of the virtual machine to signal and force connection closure. The public side of a NAT gateway doesn't generate TCP reset packets or any other traffic. Only traffic produced by the customer's virtual network is emitted.

### NAT gateway configurations

* Outbound connectivity can be defined for each subnet with a NAT gateway. All outbound traffic for the subnet is processed by the NAT gateway without any customer configuration. 

* A NAT gateway can’t span multiple virtual networks.

* Multiple subnets within the same virtual network can either use different NAT gateways or the same NAT gateway.

* Multiple NAT gateways can’t be attached to a single subnet.

* A NAT gateway can’t be deployed in a [gateway subnet](../../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsub).

* A NAT gateway resource can use up to 16 IP addresses in any combination of:

  * Public IP addresses

  * Public IP prefixes

  * Public IP addresses and prefixes derived from custom IP prefixes (BYOIP), to learn more, see [Custom IP address prefix (BYOIP)](../ip-services/custom-ip-address-prefix.md)

* NAT gateway can’t be associated to an IPv6 public IP address or IPv6 public IP prefix. It can be associated to a dual stack subnet, but will only be able to direct outbound traffic with an IPv4 address.

### Availability zones

* A NAT gateway can be created in a specific availability zone or placed in 'no zone'. 

* NAT gateway can be isolated in a specific zone when you create [zone isolation scenarios](/azure/virtual-network/nat-gateway/nat-availability-zones). This deployment is called a zonal deployment. After NAT gateway is deployed, the zone selection cannot be changed.

* NAT gateway is placed in no zone by default. A [non-zonal NAT gateway](/azure/virtual-network/nat-gateway/nat-availability-zones#non-zonal) is placed in a zone for you by Azure.

### NAT gateway and basic SKU resources

* NAT gateway is compatible with standard SKU public IP addresses or public IP prefix resources or a combination of both. You can use a public IP prefix directly or distribute the public IP addresses of the prefix across multiple NAT gateway resources. The NAT gateway will groom all traffic to the range of IP addresses of the prefix. 

* Basic resources, such as basic load balancer or basic public IPs aren't compatible with Virtual Network NAT.  Basic resources must be placed on a subnet not associated to a NAT gateway. Basic load balancer and basic public IP can be upgraded to standard to work with a NAT gateway
  
  * To upgrade a basic load balancer to standard, see [Upgrade a public basic Azure Load Balancer](../../load-balancer/upgrade-basic-standard.md).

  * To upgrade a basic public IP to standard, see [Upgrade a public IP address](../ip-services/public-ip-upgrade-portal.md).

### NAT gateway timers

* NAT gateway holds on to SNAT ports after a connection closes before it is available to reuse to connect to the same destination endpoint over the internet. SNAT port reuse timer durations for TCP traffic vary depending on how the connection closes. To learn more, see [Port Reuse Timers](./nat-gateway-resource.md#port-reuse-timers).

* A default TCP idle timeout of 4 minutes is used and can be increased to up to 120 minutes. Any activity on a flow can also reset the idle timer, including TCP keepalives. To learn more, see [Idle Timeout Timers](./nat-gateway-resource.md#idle-timeout-timers).

* UDP traffic has an idle timeout timer of 4 minutes that cannot be changed.
 
* UDP traffic has a port reset timer of 65 seconds for which a port is in hold down before it is available for reuse to the same destination endpoint.

## Pricing and SLA

For Azure Virtual Network NAT pricing, see [NAT gateway pricing](https://azure.microsoft.com/pricing/details/virtual-network/#pricing).

For information on the SLA, see [SLA for Virtual Network NAT](https://azure.microsoft.com/support/legal/sla/virtual-network-nat/v1_0/).

## Next steps

* To create and validate a NAT gateway, see [Quickstart: Create a NAT gateway using the Azure portal](quickstart-create-nat-gateway-portal.md).

* To view a video on more information about Azure Virtual Network NAT, see [How to get better outbound connectivity using an Azure NAT gateway](https://www.youtube.com/watch?v=2Ng_uM0ZaB4).

* Learn about the [NAT gateway resource](./nat-gateway-resource.md).

* [Learn module: Introduction to Azure Virtual Network NAT](/learn/modules/intro-to-azure-virtual-network-nat).
