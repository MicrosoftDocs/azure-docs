---
title: SNAT for outbound connections
description: Describes how Azure Load Balancer is used to perform SNAT for outbound internet connectivity
services: load-balancer
author: asudbring
ms.service: load-balancer
ms.topic: conceptual
ms.custom: contperfq1
ms.date: 10/13/2020
ms.author: allensu
---

# Using SNAT for outbound connections

The frontend IPs of an Azure public load balancer can be used to provide outbound connectivity to the internet for backend instances.This configuration uses **source network address translation (SNAT)**. SNAT rewrites the IP address of the backend to the public IP address of your load balancer. 

SNAT enables **IP masquerading** of the backend instance. This masquerading prevents outside sources from having a direct address to the backend instances. Sharing an IP address between backend instances reduces the cost of static public IPs and supports scenarios such as simplifying IP allow lists with traffic from known public IPs. 

[!Note]
> For applications with that require large numbers of outbound connections or enterprise customers who require a single set of IPs to be used from a given virtual network, 
> [Virtual Network NAT](https://docs.microsoft.com/azure/virtual-network/nat-overview) is the recommended solution. It's dynamic allocation allows for simple configuration and  > the most efficient use of SNAT ports from each IP address. It also allows all resources in the virtual network to share a set of IP addresses without a need for them to share > a load balancer.

[!Important]
> Even without outbound SNAT configured, Azure storage accounts within the same region will still be accessible and backend resources will still have access to Microsoft services such as Windows Updates.

>[!NOTE] 
>This article covers Azure Resource Manager deployments only. Review [Outbound connections (Classic)](load-balancer-outbound-connections-classic.md) for all Classic deployment scenarios in Azure.

## <a name ="snat"></a> Sharing frontend IP address across backend resources

If the backend resources of a load balancer don't have instance-level public IP (ILPIP) addresses, they establish outbound connectivity via the frontend IP of the public load balancer. Ports are used to generate unique identifiers used to maintain distinct flows. The internet uses a five-tuple to provide this distinction.

The five-tuple consists of:

* Destination IP
* Destination port
* Source IP
* Source port and protocol to provide this distinction.

If a port is used for inbound connections, it will have a **listener** for inbound connection requests on that port and cannot be used for outbound connections. To establish an outbound connection, an **ephemeral port** must be used to provide the destination with a port on which to communicate and maintain a distinct traffic flow. When these ephemeral ports are used to perform SNAT they are called **SNAT ports** 

By definition, every IP address has 65,535 ports. Each port can either be used for inbound or outbound connections for TCP(Transmission Control Protocol) and UDP(User Datagram Protocol). When an public IP address is added as a frontend IP to a load balancer, Azure gives 64,000 eligible for use as SNAT ports. 

[!NOTE]
> Each port used for a load-balancing or inbound NAT rule will consume a range of eight ports from these 64,000 ports, reducing the number of ports eligible for SNAT. If a load-> balancing or nat rule is in the same range of eight as another it will consume no additional ports. 

Through [outbound rules](https://docs.microsoft.com/azure/load-balancer/outbound-rules) and load-balancing rules, these SNAT ports can be distributed to backend instances to enable them to share the public IPs of the load balancer for outbound connections.

When [scenario 2](#scenario2) below is configured, the host for each backend instance will perform SNAT on packets that are part of an outbound connection. When performing SNAT on an outbound connection from a backend instance, the host rewrites the source IP to one of the frontend IPs. To maintain unique flows, the host rewrites the source port of each outbound packet to one of the SNAT ports allocated for the backend instance.

## Outbound connection behavior for different scenarios
  * Virtual machine with public IP.
  * Virtual machine without public IP.
  * Virtual machine without public IP and without standard load balancer.
		

 ### <a name="scenario1"></a> Scenario 1: Virtual machine with public IP


 | Associations | Method | IP protocols |
 | ---------- | ------ | ------------ |
 | Public load balancer or stand-alone | [SNAT (Source Network Address Translation)](#snat) </br> not used. | TCP (Transmission Control Protocol) </br> UDP (User Datagram Protocol) </br> ICMP (Internet Control Message Protocol) </br> ESP (Encapsulating Security Payload) |


 #### Description


 Azure uses the public IP assigned to the IP configuration of the instance's NIC for all outbound flows. The instance has all ephemeral ports available. It doesn't matter whether the VM is load balanced or not. This scenario takes precedence over the others. 


 A public IP assigned to a VM is a 1:1 relationship (rather than 1: many) and implemented as a stateless 1:1 NAT.


 ### <a name="scenario2"></a>Scenario 2: Virtual machine without public IP and behind Standard public Load Balancer


 | Associations | Method | IP protocols |
 | ------------ | ------ | ------------ |
 | Public load balancer | Use of load balancer frontend IPs for [SNAT](#snat).| TCP </br> UDP |


 #### Description


 The load balancer resource is configured with an outbound rule or a load-balancing rule that enables default SNAT. This rule is used to create a link between the public IP frontend with the backend pool. 


 If you don't complete this rule configuration, the behavior is as described in scenario 3. 


 A rule with a listener isn't required for the health probe to succeed.


 When a VM creates an outbound flow, Azure translates the source IP address to the public IP address of the public load balancer frontend. This translation is done via [SNAT](#snat). 


 Ephemeral ports of the load balancer frontend public IP address are used to distinguish individual flows originated by the VM. SNAT dynamically uses [preallocated ephemeral ports](#preallocatedports) when outbound flows are created. 


 In this context, the ephemeral ports used for SNAT are called SNAT ports. It is highly recommended that an [outbound rule](https://docs.microsoft.com/azure/load-balancer/outbound-rules) is explicitly configured. If using default SNAT through a load-balancing rule, SNAT ports are pre-allocated as described in the [Default SNAT ports allocation table](#snatporttable).


 ### <a name="scenario3"></a>Scenario 3: Virtual machine without public IP and behind Basic Load Balancer


 | Associations | Method | IP protocols |
 | ------------ | ------ | ------------ |
 |None </br> Basic load balancer | [SNAT](#snat) with instance-level dynamic IP address| TCP </br> UDP | 

 #### Description


 When the VM creates an outbound flow, Azure translates the source IP address to a dynamically allocated public source IP address. This public IP address **isn't configurable** and can't be reserved. This address doesn't count against the subscription's public IP resource limit. 


 The public IP address will be released and a new public IP requested if you redeploy the: 


 * Virtual Machine
 * Availability set
 * Virtual machine scale set 


 Don't use this scenario for adding IPs to an allow list. Use scenario 1 or 2 where you explicitly declare outbound behavior. [SNAT](#snat) ports are preallocated as described in the [Default SNAT ports allocation table](#snatporttable).


## <a name="scenarios"></a> Exhausting ports

Every connection to the same destination IP and destination port will use a SNAT port. This connection maintains a distinct **traffic flow** from the backend instance or **client** to a **server**. This process gives the server a distinct port on which to address traffic. Without this process, the client machine is unaware of which flow a packet is part of.

Imagine having multiple browsers going to https://www.microsoft.com, which is:

* Destination IP = 23.53.254.142
* Destination Port = 443
* Protocol = TCP

Without different destination ports for the return traffic (the SNAT port used to establish the connection), the client will have no way to separate one query result from another.

Outbound connections can burst. A backend instance can be allocated insufficient ports. Without **connection reuse** enabled, the risk of SNAT **port exhaustion** is increased.

New outbound connections to a destination IP will fail when port exhaustion occurs. Connections will succeed when a port becomes available. This exhaustion occurs when the 64,000 ports from an IP address are spread thin across many backend instances. For guidance on mitigation of SNAT port exhaustion, see the [troubleshooting guide](https://docs.microsoft.com/azure/load-balancer/troubleshoot-outbound-connection).  

For TCP connections, the load balancer will use a single SNAT port for every destination IP and port. This multiuse enables multiple connections to the same destination IP with the same SNAT port. This multiuse is limited if the connection isn't to different destination ports.

For UDP connections, the load balancer uses a **port-restricted cone NAT** algorithm, which consumes one SNAT port per destination IP whatever the destination port. 

A port is reused for an unlimited number of connections. The port is only reused if the destination IP or port is different.

## <a name="preallocatedports"></a> Default port allocation

Each public IP assigned as a frontend IP of your load balancer is given 64,000 SNAT ports for its backend pool members. Ports can't be shared with backend pool members. A range of SNAT ports can only be used by a single backend instance to ensure return packets are routed correctly. 

It's recommended you use an explicit outbound rule to configure SNAT port allocation. This rule will maximize the number of SNAT ports each backend instance has available for outbound connections. 

Should you use the automatic allocation of outbound SNAT through a load-balancing rule, the allocation table will define your port allocation.

The following <a name="snatporttable"></a>table shows the SNAT port preallocations for tiers of backend pool sizes:

| Pool size (VM instances) | Preallocated SNAT ports per IP configuration |
| --- | --- |
| 1-50 | 1,024 |
| 51-100 | 512 |
| 101-200 | 256 |
| 201-400 | 128 |
| 401-800 | 64 |
| 801-1,000 | 32 | 

>[!NOTE]
> If you have a backend pool with a max size of 10, each instance can have 64,000/10 = 6,400 ports if you define an explicit outbound rule. According to the above table each will only have 1,024 if you choose automatic allocation.

## <a name="outboundrules"></a> Outbound rules and Virtual Network NAT

Azure Load Balancer outbound rules and Virtual Network NAT are options available for egress from a virtual network.

For more information about outbound rules, see [Outbound rules](outbound-rules.md).

For more information about Azure Virtual Network NAT, see [What is Azure Virtual Network NAT](../virtual-network/nat-overview.md).

## Constraints

*	Ports will be released after 15 seconds if a **TCP RST** is received or sent
*	Ports will be released after 240 seconds if a **FINACK** is received or sent
*	When a connection is idle with no new packets being sent, the ports will be released after 4 – 120 minutes.
  *	This threshold can be configured via outbound rules.
*	Each IP address provides 64,000 ports that can be used for SNAT.
*	Each port can be used for both TCP and UDP connections to a destination IP address
  *	A UDP SNAT port is needed whether the destination port is unique or not. For every UDP connection to a destination IP, one UDP SNAT port is used.
  *	A TCP SNAT port can be used for multiple connections to the same destination IP provided the destination ports are different.
*	SNAT exhaustion occurs when a backend instance runs out of given SNAT Ports. A load balancer can still have unused SNAT ports. If a backend instance’s used SNAT ports exceed its given SNAT ports, it will be unable to establish new outbound connections.

## Next steps

*	[Troubleshoot outbound connection failures because of SNAT exhaustion](https://docs.microsoft.com/azure/load-balancer/troubleshoot-outbound-connection)
*	[Review SNAT metrics](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-diagnostics#how-do-i-check-my-snat-port-usage-and-allocation) and familiarize yourself with the correct way to filter, split, and view them.

