---
title: Design virtual networks with Azure NAT Gateway
description: Learn about how to design virtual networks with Azure NAT Gateway.
author: alittleton
ms.author: alittleton
ms.service: azure-nat-gateway
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.customs: references_regions
ms.date: 11/04/2025
# Customer intent: "As a network architect, I want to design virtual networks using a NAT gateway so that I can ensure efficient outbound connectivity and manage SNAT port inventory for scalable production workloads."
---

# Design virtual networks with Azure NAT Gateway

Review this article to familiarize yourself with considerations for designing virtual networks with NAT gateway.

> [!IMPORTANT]
> Standard V2 SKU Azure NAT Gateway is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Connect to the internet with a NAT gateway

NAT Gateway is recommended for all production workloads where you need to connect to a public endpoint over the internet. Outbound connectivity takes place right away upon deployment of a NAT gateway with a subnet and at least one public IP address. No routing configurations are required to start connecting outbound with the NAT gateway. The NAT gateway becomes the subnet’s default route to the internet.

In the presence of other outbound configurations within a virtual network, such as a load balancer or instance-level public IPs (IL PIPs), the NAT gateway takes precedence for outbound connectivity. New outbound initiated traffic and return traffic uses the NAT gateway. There's no down time on outbound connectivity after adding a NAT gateway to a subnet with existing outbound configurations.

## Use StandardV2 NAT gateway for zone-redundancy

[Availability zones](/azure/reliability/availability-zones-overview) are physically separate groups of datacenters within each Azure region. When one zone fails, services can fail over to one of the remaining healthy zones. 

StandardV2 NAT Gateway supports availability zone scenarios. 

When StandardV2 NAT gateway is deployed, outbound connections can flow out of any zone in the region. When a zone goes down, some in flight connections from the failed zone may be impacted, but all new connections flow out of the remaining healthy zones.   

To learn more information, see [NAT gateway availability zones](/azure/nat-gateway/nat-availability-zones). 

## Scale a NAT gateway to meet the demand of a dynamic workload

Scaling NAT Gateway is primarily a function of managing the shared, available SNAT port inventory.

When you scale your workload, assume that each flow requires a new SNAT port, and then scale the total number of available IP addresses for outbound traffic. Carefully consider the scale you're designing for, and then allocate IP addresses. NAT Gateway needs sufficient SNAT port inventory for expected peak outbound flows for all subnets that are attached to a NAT gateway.

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

A NAT gateway, load balancer, and instance-level public IPs are flow direction aware and can coexist in the same virtual network to provide outbound and inbound connectivity seamlessly. Inbound traffic through a load balancer or instance-level public IPs is translated separately from outbound traffic through the NAT gateway.

Private instances use the NAT gateway for outbound traffic and any response traffic to the **outbound originated flow**. Private instances use instance-level public IPs or a load balancer for inbound traffic and any response traffic to the **inbound originated flow**.

The following examples demonstrate coexistence of a load balancer or instance-level public IPs with a NAT gateway. Inbound traffic traverses the load balancer or public IP. Outbound traffic traverses the NAT gateway.

### A NAT gateway and VM with an instance-level public IP

:::image type="content" source="./media/nat-gateway-design/nat-gateway-instance-level-ip.png" alt-text="Diagram of a NAT gateway with a virtual machine that has an instance level IP address.":::

*Figure: A NAT gateway and VM with an instance-level public IP*

| Resource | Traffic flow direction | Connectivity method used |
| --- | --- | --- |
| VM (Subnet 1) | Inbound </br> Outbound | Instance-level public IP </br> NAT gateway |
| Virtual machine scale set (Subnet 1) | Inbound </br> Outbound | NA </br> NAT gateway |
| VMs (Subnet 2) | Inbound </br> Outbound |  NA </br> NAT gateway |

The virtual machine uses the NAT gateway for outbound and return traffic. Inbound originated traffic passes through the instance level public IP directly associated with the virtual machine in subnet 1. The virtual machine scale set from subnet 1 and VMs from subnet 2 can only egress and receive response traffic through the NAT gateway. No inbound originated traffic can be received.

### A NAT gateway and VM with a standard public load balancer

:::image type="content" source="./media/nat-gateway-design/nat-gateway-load-balancer.png" alt-text="Diagram that depicts a NAT gateway that supports outbound traffic to the internet from a virtual network and inbound traffic with a public load balancer.":::

*Figure: A NAT gateway and VM with a standard public load balancer*

| Resource | Traffic flow direction | Connectivity method used |
| --- | --- | --- |
|VM and virtual machine scale set (Subnet 1) | Inbound </br> Outbound | Load balancer </br> NAT gateway |
|VMs (Subnet 2) | Inbound </br> Outbound | NA </br> NAT gateway |

NAT Gateway supersedes any outbound configuration from a load-balancing rule or outbound rules on the load balancer. VM instances in the backend pool use the NAT gateway to send outbound traffic and receive return traffic. Inbound originated traffic passes through the load balancer for all VM instances (Subnet 1) within the load balancer’s backend pool. VMs from subnet 2 can only egress and receive response traffic through the NAT gateway. No inbound originated traffic can be received.

### A NAT gateway and VM with an instance-level public IP and a standard public load balancer

:::image type="content" source="./media/nat-gateway-design/nat-gateway-instance-level-ip-load-balancer.png" alt-text="Diagram of a NAT gateway that supports outbound traffic to the internet from a virtual network. Inbound traffic is depicted with an instance-level public IP and a public load balancer.":::

*Figure: NAT Gateway and VM with an instance-level public IP and a standard public load balancer*

| Resource | Traffic flow direction | Connectivity method used |
| --- | --- | --- |
| VM (Subnet 1) | Inbound </br> Outbound | Instance-level public IP </br> NAT gateway |
| Virtual machine scale set (Subnet 1) | Inbound </br> Outbound | Load balancer </br> NAT gateway |
| VMs (Subnet 2) | Inbound </br> Outbound | NA </br> NAT gateway |

The NAT gateway supersedes any outbound configuration from a load-balancing rule or outbound rules on a load balancer and instance level public IPs on a virtual machine. All virtual machines in subnets 1 and 2 use the NAT gateway exclusively for outbound and return traffic. Instance-level public IPs take precedence over load balancer. The VM in subnet 1 uses the instance level public IP for inbound originating traffic. Virtual machine scale-sets don't have instance-level public IPs.

## How to use service tagged public IPs with NAT Gateway
[Service tags](/azure/virtual-network/service-tags-overview) represent a group of IP addresses from a given Azure service. Microsoft manages the address prefix encompassed by the service tag and automatically updates the service tag as addresses change, which reduces the complexity of managing network security rules. 

Service tagged public IP addresses can be used with NAT gateway for providing outbound connectivity to the internet. To add a service tagged public IP to a NAT gateway, you can attach it using any of the available clients in Azure, such as the portal, CLI, or PowerShell. See [how to add and remove public IPs for NAT gateway](/azure/nat-gateway/manage-nat-gateway?tabs=manage-nat-portal#add-or-remove-a-public-ip-address) for detailed guidance.

> [!NOTE]
> NAT gateway doesn't support Public IP addresses with [routing preference "Internet"](/azure/virtual-network/ip-services/routing-preference-overview#routing-over-public-internet-isp-network). NAT gateway only supports public IPs that route over the Microsoft global network.

## Monitor outbound network traffic with VNet flow logs

  To gather traffic insights for your Standard SKU NAT Gateway, it's recommended to use Virtual network flow logs. [Virtual network (VNet) flow logs](../network-watcher/vnet-flow-logs-overview.md) are a feature of Azure Network Watcher that logs information about IP traffic flowing through a virtual network. To monitor outbound traffic flowing from the virtual machine behind your NAT gateway, enable VNet flow logs.

For guides on how to enable VNet flow logs, see [Manage virtual network flow logs](../network-watcher/vnet-flow-logs-portal.md).

It's recommended to access the log data on [Log Analytics workspaces](/azure/azure-monitor/logs/log-analytics-overview) where you can also query and filter the data for outbound traffic. To learn more about using Log Analytics, see [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial).

For more information on the VNet flow log schema, see [Traffic analytics schema and data aggregation](../network-watcher/traffic-analytics-schema.md).

> [!NOTE]
> Virtual network flow logs only show the private IPs of your VM instances connecting outbound to the internet. VNet flow logs don't show you which NAT gateway public IP address the VM’s private IP has SNATed to for connecting outbound.

StandardV2 NAT Gateway supports NAT gateway flow logs through Azure Monitor. NAT gateway flow logs provide IP level traffic information for traffic flowing through the StandardV2 NAT Gateway. For more information, see [Analyze NAT Gateway traffic with flow logs](./nat-gateway-flow-logs.md). 

## NAT gateway and user defined routes 

A NAT gateway relies on the subnet’s default route 0.0.0.0/0 to next hop internet to source NAT (SNAT) outbound traffic to the internet. 

If you create a user-defined route (UDR) that sends 0.0.0.0/0 traffic to a virtual appliance as the next hop, the system’s default “Internet” route is overridden. As a result, all outbound traffic is sent to the virtual appliance instead of through the NAT gateway. 

A common use of this pattern is forced tunneling: forwarding all 0.0.0.0/0 traffic to a virtual appliance such as a VPN gateway or ExpressRoute. The appliance can then redirect the traffic to an on-premises network, where it exits to the internet under on-premises security, monitoring, and compliance controls. In this scenario, the NAT gateway is bypassed and doesn't provide outbound internet connectivity. 

If you instead configure a UDR with next hop = Internet, outbound traffic continues to flow through the NAT gateway. The NAT gateway performs SNAT for that traffic. 

This approach is especially useful in scenarios where certain destinations, such as a Key Management Service (KMS) endpoint, must be reached over the internet. In this case, you can create a UDR with: 

* Destination = KMS service address 

* Next hop = Internet 

With this configuration, the NAT gateway handles SNAT, and traffic to the KMS endpoint successfully flows over the internet. 

## Use NAT gateway instead of default outbound access

When a virtual machine is deployed in a virtual network without an explicitly defined outbound connectivity method, it’s assigned a default outbound public IP address. This IP address enables outbound connectivity from the resources to the internet and to other public endpoints within Microsoft and is known as a default outbound IP. The default outbound access IP is owned by Microsoft and is subject to change without notice. The end user has no visibility of this default outbound access public IP address. This default outbound access public IP isn’t recommended for production workloads. 

Secure outbound connectivity to the internet by [enabling private subnet](/azure/virtual-network/ip-services/default-outbound-access#how-can-i-transition-to-an-explicit-method-of-public-connectivity-and-disable-default-outbound-access). Private subnet prevents the creation of new default outbound IPs for virtual machines in your subnet. Instead use an explicit method of outbound connectivity like NAT gateway. 

> [!IMPORTANT]
> On March 31, 2026, new virtual networks will default to using private subnets, meaning that default outbound access will no longer be provided by default, and that explicit outbound method must be enabled in order to reach public endpoints on the Internet and within Microsoft. It's recommended to use an explicit form of outbound connectivity instead, like NAT gateway. 

Certain services don’t function on a virtual machine in a private subnet without an explicit method of outbound connectivity, such as Windows Activation and Windows Updates. To activate or update virtual machine operating systems, such as Windows, an explicit method of outbound connectivity is required, like NAT gateway. 

## Limitations

* NAT Gateway isn't supported in a vWAN hub configuration.

* StandardV2 NAT Gateway requires StandardV2 SKU Public IP addresses and prefixes. Standard SKU public IPs aren’t supported. 

* StandardV2 NAT Gateway doesn’t support custom IP prefixes (BYOIP) 

* StandardV2 NAT Gateway can’t be deployed as a managed NAT Gateway for AKS workloads. It's only supported when configured as a user-assigned NAT Gateway. For more information, see [Create NAT Gateway for your AKS cluster](Create a managed or user-assigned NAT gateway for your Azure Kubernetes Service (AKS) cluster - Azure Kubernetes Service | Microsoft Learn 

* StandardV2 NAT Gateway is available in select Azure regions. It’s not available in the following regions:  
    * Canada East   
    * Central India   
    * Chile Central   
    * Indonesia Central   
    * Israel Northwest   
    * Malaysia West   
    * Qatar Central   
    * UAE Central  

## Related content

- [Azure NAT Gateway resource](nat-gateway-resource.md).

- [SNAT and Azure NAT Gateway](nat-gateway-snat.md).

- [Azure NAT Gateway FAQ](faq.yml).
