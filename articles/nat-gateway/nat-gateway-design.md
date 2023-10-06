---
title: Design virtual networks with Azure NAT Gateway
description: Learn about how to design virtual networks with Azure NAT Gateway.
author: asudbring
ms.author: allensu
ms.service: nat-gateway
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: 07/11/2023
---

# Design virtual networks with Azure NAT Gateway

Review this article to familiarize yourself with considerations for designing virtual networks with NAT gateway.

## Connect to the internet with a NAT gateway

NAT Gateway is recommended for all production workloads where you need to connect to a public endpoint over the internet. Outbound connectivity takes place right away upon deployment of a NAT gateway with a subnet and at least one public IP address. No routing configurations are required to start connecting outbound with the NAT gateway. The NAT gateway becomes the subnet’s default route to the internet.

In the presence of other outbound configurations within a virtual network, such as a load balancer or instance-level public IPs (IL PIPs), the NAT gateway takes precedence for outbound connectivity. New outbound initiated traffic and return traffic uses the NAT gateway. There's no down time on outbound connectivity after adding a NAT gateway to a subnet with existing outbound configurations.

## Scale a NAT gateway to meet the demand of a dynamic workload

Scaling NAT Gateway is primarily a function of managing the shared, available SNAT port inventory.

When you scale your workload, assume that each flow requires a new SNAT port, and then scale the total number of available IP addresses for outbound traffic. Carefully consider the scale you're designing for, and then allocate IP addresses accordingly. NAT Gateway needs sufficient SNAT port inventory for expected peak outbound flows for all subnets that are attached to a NAT gateway.

As SNAT port exhaustion approaches, connection flows may not succeed.

### Scaling considerations

Each NAT gateway public IP address provides 64,512 SNAT ports to make outbound connections. A NAT gateway can scale up to over 1 million SNAT ports.

SNAT maps private addresses in your subnet to one or more public IP addresses attached to a NAT gateway, rewriting the source address and source port in the process. When multiple connections are made to the same destination endpoint, a new SNAT port is used. A new SNAT port must be used in order to distinguish different connection flows from one another going to the same destination.

Connection flows going to different destination endpoints can reuse the same SNAT port at the same time. SNAT port connections sent to different destinations are reused when possible. As SNAT port exhaustion approaches, flows may not succeed.

For a SNAT example, see [Example SNAT flows for NAT Gateway](nat-gateway-snat.md#example-snat-flows-for-nat-gateway).

## Connect to Azure services with Private Link

Connecting from your Azure virtual network to Azure PaaS services can be done directly over the Azure backbone and bypass the internet. When you bypass the internet to connect to other Azure PaaS services, you free up SNAT ports and reduce the risk of SNAT port exhaustion. Private Link should be used when possible to connect to Azure PaaS services in order to free up SNAT port inventory.

Private Link uses the private IP addresses of your virtual machines or other compute resources from your Azure network to directly connect privately and securely to Azure PaaS services over the Azure backbone. See a list of available Azure services that Private Link supports.

> [!NOTE]
> Microsoft recommends use of Azure Private Link for secure and private access to services hosted in Azure. [Service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview) can also be used to connect directly to Azure PaaS services over the Azure backbone.

## Provide outbound and inbound connectivity for your Azure virtual network

A NAT gateway, load balancer and instance-level public IPs are flow direction aware and can coexist in the same virtual network to provide outbound and inbound connectivity seamlessly. Inbound traffic through a load balancer or instance-level public IPs is translated separately from outbound traffic through the NAT gateway.

Private instances use the NAT gateway for outbound traffic and any response traffic to the **outbound originated flow**. Private instances use instance-level public IPs or a load balancer for inbound traffic and any response traffic to the **inbound originated flow**.

The following examples demonstrate coexistence of a load balancer or instance-level public IPs with a NAT gateway. Inbound traffic traverses the load balancer or public IP. Outbound traffic traverses the NAT gateway.

### A NAT gateway and VM with an instance-level public IP

:::image type="content" source="./media/nat-overview/flow-direction2.png" alt-text="Diagram of a NAT gateway resource that consumes all IP addresses for a public IP prefix. The NAT gateway directs traffic for two subnets of VMs and a Virtual Machine Scale Set.":::

*Figure: A NAT gateway and VM with an instance-level public IP*

| Resource | Traffic flow direction | Connectivity method used |
| --- | --- | --- |
| VM (Subnet B) | Inbound </br> Outbound | NA </br> NAT gateway |
| Virtual machine scale set (Subnet B) | Inbound </br> Outbound | NA </br> NAT gateway |
| VMs (Subnet A) | Inbound </br> Outbound | Instance-level public IP </br> NAT gateway |

The virtual machine uses the NAT gateway for outbound and return traffic. Inbound originated traffic passes through the instance level public IP directly associated with the virtual machine in subnet A. The virtual machine scale set from subnet B and VMs from subnet B can only egress and receive response traffic through the NAT gateway. No inbound originated traffic can be received.

### A NAT gateway and VM with a standard public load balancer

:::image type="content" source="./media/nat-overview/flow-direction3.png" alt-text="Diagram that depicts a NAT gateway that supports outbound traffic to the internet from a virtual network and inbound traffic with a public load balancer.":::

*Figure: A NAT gateway and VM with a standard public load balancer*

| Resource | Traffic flow direction | Connectivity method used |
| --- | --- | --- |
| VMs in backend pool | Inbound </br> Outbound | Load balancer </br> NAT gateway |
| VM and virtual machine scale set (Subnet B) | Inbound </br> Outbound | NA </br> NAT gateway |

NAT Gateway supersedes any outbound configuration from a load-balancing rule or outbound rules on the load balancer. VM instances in the backend pool use the NAT gateway to send outbound traffic and receive return traffic. Inbound originated traffic passes through the load balancer for all VM instances within the load balancer’s backend pool. VM and the virtual machine scale set from subnet B can only egress and receive response traffic through the NAT gateway. No inbound originated traffic can be received.

### A NAT gateway and VM with an instance-level public IP and a standard public load balancer

:::image type="content" source="./media/nat-overview/flow-direction4.png" alt-text="Diagram of a NAT gateway that supports outbound traffic to the internet from a virtual network. Inbound traffic is depicted with an instance-level public IP and a public load balancer.":::

*Figure: NAT Gateway and VM with an instance-level public IP and a standard public load balancer*

| Resource | Traffic flow direction | Connectivity method used |
| --- | --- | --- |
| VM (Subnet A) | Inbound </br> Outbound | Instance-level public IP </br> NAT gateway |
| Virtual machine scale set | Inbound </br> Outbound | NA </br> NAT gateway |
| VM (Subnet B) | Inbound </br> Outbound | NA </br> NAT gateway |

The NAT gateway supersedes any outbound configuration from a load-balancing rule or outbound rules on a load balancer and instance level public IPs on a virtual machine. All virtual machines in subnets A and B use the NAT gateway exclusively for outbound and return traffic. Instance level public IPs take precedence over load balancer. The VM in subnet A uses the instance level public IP for inbound originating traffic.

## Monitor outbound network traffic with NSG flow logs

A network security group allows you to filter inbound and outbound traffic to and from a virtual machine. To monitor outbound traffic flowing from the virtual machine behind your NAT gateway, enable NSG flow logs.

For information about NSG flow logs, see [NSG flow log overview](/azure/network-watcher/network-watcher-nsg-flow-logging-overview).

For guides on how to enable NSG flow logs, see [Enabling NSG flow logs](/azure/network-watcher/network-watcher-nsg-flow-logging-overview#enabling-nsg-flow-logs).

> [!NOTE]
> NSG flow logs will only show the private IPs of your VM instances connecting outbound to the internet. NSG flow logs will not show you which NAT gateway public IP address the VM’s private IP has SNATed to prior to connecting outbound.

## Limitations

* NAT Gateway isn't supported in a vWAN hub configuration.

## Related content

- [Azure NAT Gateway resource](nat-gateway-resource.md).

- [SNAT and Azure NAT Gateway](nat-gateway-snat.md).

- [Azure NAT Gateway FAQ](faq.yml).
