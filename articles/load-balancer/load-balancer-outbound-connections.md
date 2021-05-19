---
title: Source Network Address Translation (SNAT) for outbound connections
titleSuffix: Azure Load Balancer
description: Learn how Azure Load Balancer is used for outbound internet connectivity (SNAT).
services: load-balancer
author: asudbring
ms.service: load-balancer
ms.topic: conceptual
ms.custom: contperf-fy21q1
ms.date: 05/05/2021
ms.author: allensu
---

# Using Source Network Address Translation (SNAT) for outbound connections

Certain scenarios require virtual machines or compute instances to have outbound connectivity to the internet. The frontend IPs of an Azure public Load Balancer can be used to provide outbound connectivity to the internet for backend instances. This configuration uses **source network address translation (SNAT)** as the **source** or virtual machine's IP is translated to a Public IP address. SNAT maps the IP address of the backend to the public IP address of your load balancer. This prevents outside sources from having a direct address to the backend instances.

## <a name="scenarios"></a>Azure's outbound connectivity methods

Outbound connectivity to the internet can be enabled in the following ways:

| # | Method | Type of port allocation | Production-grade? | Rating |
| ------------ | ------------ | ------ | ------------ | ------------ |
| 1 | Leveraging the frontend IP address(es) of a Load Balancer for outbound  via Outbound rules | Static, explicit | Yes, but not at scale | OK | 
| 2 | Associating a NAT gateway to the subnet | Static, explicit | Yes | Best | 
| 3 | Assigning a Public IP to the Virtual Machine | Static, explicit | Yes | OK | 
| 4 | Leveraging the frontend IP address(es) of a Load Balancer for outbound (and inbound) | Default, implicit | No | Worst


## <a name="outboundrules"></a>Leveraging the frontend IP address of a Load Balancer for outbound via Outbound rules

Outbound rules enable you to explicitly define SNAT (source network address translation) for a Standard public load balancer. This configuration allows you to use the public IP(s) of your load balancer to provide outbound internet connectivity for your backend instances.

This configuration enables:

- IP masquerading
- Simplifying your allowlists.
- Reduces the number of public IP resources for deployment

With outbound rules, you have full declarative control over outbound internet connectivity. Outbound rules allow you to scale and tune this ability to your specific needs.

For more information about outbound rules, see [Outbound rules](outbound-rules.md).

>[!Important]
> When a backend pool is configured by IP address, it will behave as a Basic Load Balancer with default outbound enabled. 

## Associating a VNet NAT to the subnet

Virtual Network NAT  simplifies outbound-only Internet connectivity for virtual networks. When configured on a subnet, all outbound connectivity uses your specified static public IP addresses. Outbound connectivity is possible without load balancer or public IP addresses directly attached to virtual machines. NAT is fully managed and highly resilient.

Using a VNet NAT is the best method for outbound connectivity as it is highly scalable, reliable and doesn't have the concerts with respect to SNAT port exhaustion.

For more information about Azure Virtual Network NAT, see [What is Azure Virtual Network NAT](../virtual-network/nat-overview.md).

##  Assigning a Public IP to the Virtual Machine

 | Associations | Method | IP protocols |
 | ---------- | ------ | ------------ |
 | Public IP on VM's NIC | [SNAT (Source Network Address Translation)](#snat) </br> is not used. | TCP (Transmission Control Protocol) </br> UDP (User Datagram Protocol) </br> ICMP (Internet Control Message Protocol) </br> ESP (Encapsulating Security Payload) |

 All traffic will return to the requesting client from the virtual machine's public IP address (Instance Level IP).
 
 Azure uses the public IP assigned to the IP configuration of the instance's NIC for all outbound flows. The instance has all ephemeral ports available. It doesn't matter whether the VM is load balanced or not. This scenario takes precedence over the others. 

 A public IP assigned to a VM is a 1:1 relationship (rather than 1: many) and implemented as a stateless 1:1 NAT.



## <a name="snat"></a> Leveraging the frontend IP address of a Load Balancer for outbound (and inbound)
>[!NOTE]
> This method is **NOT recommended** for production workloads as it adds risk of exhausting ports. Please refrain from using this method for production workloads to avoid potential connection failures. 


If the backend resources of a Load Balancer do not have outbound rules, instance level public IP addresses or a VNet NAT configured, they establish outbound connectivity via the frontend IP of the load balancer. This is known as default SNAT.


### What are SNAT ports?
Ports are used to generate unique identifiers used to maintain distinct flows. The internet uses a five-tuple to provide this distinction.

If a port is used for inbound connections, it has a **listener** for inbound connection requests on that port. That port can't be used for outbound connections. To establish an outbound connection, an **ephemeral port** is used to provide the destination with a port on which to communicate and maintain a distinct traffic flow. When these ephemeral ports are used for SNAT, they're called **SNAT ports** 

By definition, every IP address has 65,535 ports. Each port can either be used for inbound or outbound connections for TCP (Transmission Control Protocol) and UDP (User Datagram Protocol). When a public IP address is added as a frontend IP to a load balancer, Azure gives 64,000 ports that are eligible for SNAT.

Each port used for a load balancing or inbound NAT rule will consume a range of eight ports from these 64,000 ports, reducing the number of ports eligible for SNAT. If a load-balancing or inbound NAT rule is in the same range of eight as another it will consume no additional ports. 

### How does default SNAT work?
When a VM creates an outbound flow, Azure translates the source IP address to the public IP address of the public load balancer frontend. This translation is done via [SNAT](#snat). 

If using default SNAT through a load-balancing rule, SNAT ports are pre-allocated as described in the [Default SNAT ports allocation table](#snatporttable).
 
When using a Standard Internal load balancer, there isn't use of ephemeral IP addresses for SNAT. This feature supports security by default. This feature ensures all IP addresses used by resources are configurable and can be reserved. 
To achieve outbound connectivity to the internet when using a Standard internal load balancer, configure:
- an instance level public IP address 
- VNet NAT
-  backend instances to a Standard public load balancer with an outbound rule configured.  

### What is the IP for default SNAT?
When the VM creates an outbound flow, Azure translates the source IP address to a dynamically given public source IP address. This public IP address **isn't configurable** and can't be reserved. This address doesn't count against the subscription's public IP resource limit. 

The public IP address will be released and a new public IP requested if you redeploy the: 
 * Virtual Machine
 * Availability set
 * Virtual machine scale set 

>[!NOTE]
> This method is **NOT recommended** for production workloads as it adds risk of exhausting ports. Please refrain from using this method for production workloads to avoid potential connection failures. 

| Type | Outbound behavior | 
 | ------------ | ------ | 
 | Standard Public Load balancer | Use of load balancer frontend IPs for SNAT 
 | Standard Internal Load balancer | No internet connectivity, secure by default | 
Basic Public Load balancer | Use of load balancer frontend IPs for SNAT |
Basic Internal Load balancer | SNAT with unknown dynamic IP address| 

## Exhausting ports

Every connection to the same destination IP and destination port will use a SNAT port. This connection maintains a distinct **traffic flow** from the backend instance or **client** to a **server**. This process gives the server a distinct port on which to address traffic. Without this process, the client machine is unaware of which flow a packet is part of.

Imagine having multiple browsers going to https://www.microsoft.com, which is:

* Destination IP = 23.53.254.142
* Destination Port = 443
* Protocol = TCP

Without different destination ports for the return traffic (the SNAT port used to establish the connection), the client will have no way to separate one query result from another.

Outbound connections can burst. A backend instance can be allocated insufficient ports. Without **connection reuse** enabled, the risk of SNAT **port exhaustion** is increased.

New outbound connections to a destination IP will fail when port exhaustion occurs. Connections will succeed when a port becomes available. This exhaustion occurs when the 64,000 ports from an IP address are spread thin across many backend instances. For guidance on mitigation of SNAT port exhaustion, see the [troubleshooting guide](./troubleshoot-outbound-connection.md).  

For TCP connections, the load balancer will use a single SNAT port for every destination IP and port. This multiuse enables multiple connections to the same destination IP with the same SNAT port. This multiuse is limited if the connection isn't to different destination ports.

For UDP connections, the load balancer uses a **port-restricted cone NAT** algorithm, which consumes one SNAT port per destination IP whatever the destination port. 

A port is reused for an unlimited number of connections. The port is only reused if the destination IP or port is different.

## <a name="preallocatedports"></a> Default port allocation

Each public IP assigned as a frontend IP of your load balancer is given 64,000 SNAT ports for its backend pool members. Ports can't be shared with backend pool members. A range of SNAT ports can only be used by a single backend instance to ensure return packets are routed correctly. 

Should you use the automatic allocation of outbound SNAT through a load-balancing rule, the allocation table will define your port allocation.

The following <a name="snatporttable"></a>table shows the SNAT port preallocations for tiers of backend pool sizes:

| Pool size (VM instances) | Default SNAT ports per IP configuration |
| --- | --- |
| 1-50 | 1,024 |
| 51-100 | 512 |
| 101-200 | 256 |
| 201-400 | 128 |
| 401-800 | 64 |
| 801-1,000 | 32 | 

## Constraints

*	When a connection is idle with no new packets being sent, the ports will be released after 4 – 120 minutes.
  *	This threshold can be configured via outbound rules.
*	Each IP address provides 64,000 ports that can be used for SNAT.
*	Each port can be used for both TCP and UDP connections to a destination IP address
  *	A UDP SNAT port is needed whether the destination port is unique or not. For every UDP connection to a destination IP, one UDP SNAT port is used.
  *	A TCP SNAT port can be used for multiple connections to the same destination IP provided the destination ports are different.
*	SNAT exhaustion occurs when a backend instance runs out of given SNAT Ports. A load balancer can still have unused SNAT ports. If a backend instance’s used SNAT ports exceed its given SNAT ports, it will be unable to establish new outbound connections.

## Next steps

*	[Troubleshoot outbound connection failures because of SNAT exhaustion](./troubleshoot-outbound-connection.md)
*	[Review SNAT metrics](./load-balancer-standard-diagnostics.md#how-do-i-check-my-snat-port-usage-and-allocation) and familiarize yourself with the correct way to filter, split, and view them.
