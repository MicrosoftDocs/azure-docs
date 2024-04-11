---
title: Outbound rules Azure Load Balancer
description: This article explains how to configure outbound rules to control outbound internet traffic with Azure Load Balancer.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: conceptual
ms.date: 05/08/2023
ms.author: mbender
ms.custom: template-how-to, engagement-fy23
---

# <a name="outboundrules"></a>Outbound rules Azure Load Balancer

Outbound rules allow you to explicitly define SNAT(source network address translation) for a public standard load balancer. This configuration allows you to use the public IP(s) of your load balancer to provide outbound internet connectivity for your backend instances.

This configuration enables:

* IP masquerading
* Simplifying your allowlists.
* Reduces the number of public IP resources for deployment.

With outbound rules, you have full declarative control over outbound internet connectivity. Outbound rules allow you to scale and tune this ability to your specific needs. 

Outbound rules will only be followed if the backend VM doesn't have an instance-level public IP address (ILPIP).

:::image type="content" source="media/load-balancer-outbound-rules-overview/load-balancer-outbound-rules.png" alt-text="This diagram shows configuration of SNAT ports on virtual machines with outbound load balancer rules.":::

With outbound rules, you can explicitly define outbound **SNAT** behavior.

Outbound rules allow you to control:

* **Which virtual machines are translated to which public IP addresses.**
     * Two rules where backend pool 1 uses both blue IP addresses, and backend pool 2 uses the yellow IP prefix.
* **How outbound SNAT ports are allocated.**
     * If backend pool 2 is the only pool making outbound connections, give all SNAT ports to backend pool 2 and none to backend pool 1.
* **Which protocols to provide outbound translation for.**
     * If backend pool 2 needs UDP ports for outbound, and backend pool 1 needs TCP, give TCP ports to 1 and UDP ports to 2.
* **What duration to use for outbound connection idle timeout (4-120 minutes).**
     * If there are long running connections with keepalives, reserve idle ports for long running connections for up to 120 minutes. Assume stale connections are abandoned and release ports in 4 minutes for fresh connections 
* **Whether to send a TCP Reset on idle timeout.**
     * When timing out idle connections, do we send a TCP RST to the client and server so they know the flow is abandoned?

>[!Important]
> When a backend pool is configured by IP address, it will behave as a Basic Load Balancer with default outbound enabled. For secure by default configuration and applications with demanding outbound needs, configure the backend pool by NIC.

## Outbound rule definition

Outbound rules follow the same familiar syntax as load balancing and inbound NAT rules: **frontend** + **parameters** + **backend pool**. 

An outbound rule configures outbound NAT for _all virtual machines identified by the backend pool_ to be translated to the _frontend_.  

The _parameters_ provide fine grained control over the outbound NAT algorithm.

## <a name="scale"></a> Scale outbound NAT with multiple IP addresses

Each extra IP address provided by a frontend provides another 64,000 ephemeral ports for load balancer to use as SNAT ports. 

Use multiple IP addresses to plan for large-scale scenarios. Use outbound rules to mitigate [SNAT exhaustion](troubleshoot-outbound-connection.md#configure-load-balancer-outbound-rules-to-maximize-snat-ports-per-vm). 

You can also use a [public IP prefix](./load-balancer-outbound-connections.md#outboundrules) directly with an outbound rule. 

A public IP prefix increases scaling of your deployment. The prefix can be added to the allowlist of flows originating from your Azure resources. You can configure a frontend IP configuration within the load balancer to reference a public IP address prefix.  

The load balancer has control over the public IP prefix. The outbound rule will automatically use all public IP addresses contained within the public IP prefix for outbound connections. 

Each of the IP addresses within public IP prefix provides an extra 64,000 ephemeral ports per IP address for load balancer to use as SNAT ports.

## <a name="idletimeout"></a> Outbound flow idle timeout and TCP reset

Outbound rules provide a configuration parameter to control the outbound flow idle timeout and match it to the needs of your application. Outbound idle timeouts default to 4 minutes. For more information, see [configure idle timeouts](load-balancer-tcp-idle-timeout.md). 

The default behavior of load balancer is to drop the flow silently when the outbound idle timeout has been reached. The `enableTCPReset` parameter enables a predictable application behavior and control. The parameter dictates whether to send bidirectional TCP Reset (TCP RST) at the timeout of the outbound idle timeout. 

Review [TCP Reset on idle timeout](./load-balancer-tcp-reset.md) for details including region availability.

## <a name="preventoutbound"></a>Securing and controlling outbound connectivity explicitly

Load-balancing rules provide automatic programming of outbound NAT. Some scenarios benefit or require you to disable the automatic programming of outbound NAT by the load-balancing rule. Disabling via the rule allows you to control or refine the behavior.  

You can use this parameter in two ways:

1. Prevention of the inbound IP address for outbound SNAT. Disable outbound SNAT in the load-balancing rule.
  
2. Tune the outbound **SNAT** parameters of an IP address used for inbound and outbound simultaneously. The automatic outbound NAT must be disabled to allow an outbound rule to take control. To change the SNAT port allocation of an address also used for inbound, the `disableOutboundSnat` parameter must be set to true. 

The operation to configure an outbound rule fails if you attempt to redefine an IP address that is used for inbound.  Disable the outbound NAT of the load-balancing rule first.

>[!IMPORTANT]
> Your virtual machine will not have outbound connectivity if you set this parameter to true and do not have an outbound rule to define outbound connectivity.  Some operations of your VM or your application may depend on having outbound connectivity available. Make sure you understand the dependencies of your scenario and have considered impact of making this change.

Sometimes it's undesirable for a VM to create an outbound flow. There might be a requirement to manage which destinations receive outbound flows, or which destinations begin inbound flows. Use [network security groups](../virtual-network/network-security-groups-overview.md) to manage the destinations that the VM reaches. Use NSGs to manage which public destinations start inbound flows.

When you apply an NSG to a load-balanced VM, pay attention to the [service tags](../virtual-network/network-security-groups-overview.md#service-tags) and [default security rules](../virtual-network/network-security-groups-overview.md#default-security-rules). 

Ensure that the VM can receive health probe requests from Azure Load Balancer.

If an NSG blocks health probe requests from the AZURE_LOADBALANCER default tag, your VM health probe fails and the VM is marked unavailable. The load balancer stops sending new flows to that VM.

## Outbound rules scenarios


* [Configure outbound connections to a specific set of public IPs or prefix](#scenario1out).
* [Modify SNAT port allocation](#scenario2out).
* [Enable outbound only](#scenario3out).
* [Outbound NAT for VMs only (no inbound)](#scenario4out).
* [Outbound NAT for internal standard load balancer](#scenario5out).
* [Enable both TCP & UDP protocols for outbound NAT with a public standard load balancer](#scenario6out).


### <a name="scenario1out"></a>Scenario 1: Configure outbound connections to a specific set of public IPs or prefix


#### Details


Use this scenario to tailor outbound connections to originate from a set of public IP addresses. Add public IPs or prefixes to an allow or blocklist based on origination.


This public IP or prefix can be the same as used by a load-balancing rule. 


To use a different public IP or prefix than what is used by a load-balancing rule: 


1. Create public IP prefix or public IP address.
2. Create a public standard load balancer 
3. Create a frontend referencing the public IP prefix or public IP address you wish to use. 
4. Reuse a backend pool or create a backend pool and place the VMs into a backend pool of the public load balancer
5. Configure an outbound rule on the public load balancer to enable outbound NAT for the VMs using the frontend. It isn't recommended to use a load-balancing rule for outbound, disable outbound SNAT on the load-balancing rule.


### <a name="scenario2out"></a>Scenario 2: Modify [SNAT](load-balancer-outbound-connections.md) port allocation


#### Details


You can use outbound rules to tune the [automatic SNAT port allocation based on backend pool size](load-balancer-outbound-connections.md#preallocatedports). 


If you experience SNAT exhaustion, increase the number of [SNAT](load-balancer-outbound-connections.md) ports given from the default of 1024. 


Each public IP address contributes up to 64,000 ephemeral ports. The number of VMs in the backend pool determines the number of ports distributed to each VM. One VM in the backend pool has access to the maximum of 64,000 ports. For two VMs, a maximum of 32,000 [SNAT](load-balancer-outbound-connections.md) ports can be given with an outbound rule (2x 32,000 = 64,000). 


You can use outbound rules to tune the SNAT ports given by default. You give more or less than the default [SNAT](load-balancer-outbound-connections.md) port allocation provides. Each public IP address from a frontend of an outbound rule contributes up to 64,000 ephemeral ports for use as [SNAT](load-balancer-outbound-connections.md) ports. 


Load balancer gives [SNAT](load-balancer-outbound-connections.md) ports in multiples of 8. If you provide a value not divisible by 8, the configuration operation is rejected. Each load balancing rule and inbound NAT rule consume a range of eight ports. If a load balancing or inbound NAT rule shares the same range of 8 as another, no extra ports are consumed.


If you attempt to give out more [SNAT](load-balancer-outbound-connections.md) ports than are available (based on the number of public IP addresses), the configuration operation is rejected. For example, if you give 10,000 ports per VM and seven VMs in a backend pool share a single public IP, the configuration is rejected. Seven multiplied by 10,000 exceeds the 64,000 port limit. Add more public IP addresses to the frontend of the outbound rule to enable the scenario. 


Revert to the [default port allocation](load-balancer-outbound-connections.md#preallocatedports) by specifying 0 for the number of ports. For more information on default SNAT port allocation, see [SNAT ports allocation table](./load-balancer-outbound-connections.md#preallocatedports).


### <a name="scenario3out"></a>Scenario 3: Enable outbound only

#### Details

Use a public standard load balancer to provide outbound NAT for a group of VMs. In this scenario, use an outbound rule by itself, without configuring extra rules.

> [!NOTE]
> **Azure NAT Gateway** can provide outbound connectivity for virtual machines without the need for a load balancer. See [What is Azure NAT Gateway?](../virtual-network/nat-gateway/nat-overview.md) for more information.

### <a name="scenario4out"></a>Scenario 4: Outbound NAT for VMs only (no inbound)


> [!NOTE]
> **Azure NAT Gateway** can provide outbound connectivity for virtual machines without the need for a load balancer. See [What is Azure NAT Gateway?](../virtual-network/nat-gateway/nat-overview.md) for more information.

#### Details


For this scenario:
Azure Load Balancer outbound rules and Virtual Network NAT are options available for egress from a virtual network.


1. Create a public IP or prefix.
2. Create a public standard load balancer. 
3. Create a frontend associated with the public IP or prefix dedicated for outbound.
4. Create a backend pool for the VMs.
5. Place the VMs into the backend pool.
6. Configure an outbound rule to enable outbound NAT.



Use a prefix or public IP to scale [SNAT](load-balancer-outbound-connections.md) ports. Add the source of outbound connections to an allow or blocklist.



### <a name="scenario5out"></a>Scenario 5: Outbound NAT for internal standard load balancer


> [!NOTE]
> **Azure NAT Gateway** can provide outbound connectivity for virtual machines utilizing an internal standard load balancer. See [What is Azure NAT Gateway?](../virtual-network/nat-gateway/nat-overview.md) for more information.

#### Details


Outbound connectivity isn't available for an internal standard load balancer until it has been explicitly declared through instance-level public IPs or Virtual Network NAT, or by associating the backend pool members with an outbound-only load balancer configuration. 


For more information, see [Outbound-only load balancer configuration](./egress-only.md).




### <a name="scenario6out"></a>Scenario 6: Enable both TCP & UDP protocols for outbound NAT with a public standard load balancer


#### Details


With a public standard load balancer, the automatic outbound NAT provided matches the transport protocol of the load-balancing rule. 


1. Disable outbound [SNAT](load-balancer-outbound-connections.md) on the load-balancing rule. 
2. Configure an outbound rule on the same load balancer.
3. Reuse the backend pool already used by your VMs. 
4. Specify "protocol": "All" as part of the outbound rule. 


When only inbound NAT rules are used, no outbound NAT is provided. 


1. Place VMs in a backend pool.
2. Define one or more frontend IP configurations with public IP address(es) or public IP prefix 
3. Configure an outbound rule on the same load balancer. 
4. Specify "protocol": "All" as part of the outbound rule


## Limitations

- The maximum number of usable ephemeral ports per frontend IP address is 64,000.
- The range of the configurable outbound idle timeout is 4 to 120 minutes (240 to 7200 seconds).
- Load balancer doesn't support ICMP for outbound NAT, the only supported protocols are TCP and UDP.
- Outbound rules can only be applied to primary IP configuration of a NIC.  You can't create an outbound rule for the secondary IP of a VM or NVA. Multiple NICs are supported.
- All virtual machines within an **availability set** must be added to the backend pool for outbound connectivity. 
- All virtual machines within a **virtual machine scale set** must be added to the backend pool for outbound connectivity.

## Next steps

- Learn more about [Azure Standard Load Balancer](load-balancer-overview.md)
- See our [frequently asked questions about Azure Load Balancer](load-balancer-faqs.yml)
