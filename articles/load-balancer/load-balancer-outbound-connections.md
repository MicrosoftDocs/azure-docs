---
title: Outbound proxy Azure Load Balancer
description: Describes how Azure Load Balancer is used as a proxy for outbound internet connectivity
services: load-balancer
author: asudbring
ms.service: load-balancer
ms.topic: conceptual
ms.custom: contperfq1
ms.date: 10/06/2020
ms.author: allensu
---

# Outbound proxy Azure Load Balancer

The load balancer (LB) can be used as a proxy for outbound internet connectivity on behalf of your backend compute resources. This configuration uses **source network address translation (SNAT)** to rewrite the IP address of the backend instances to the public IP address of your load balancer. SNAT enables **IP masquerading** of the backend instance. This masquerading prevents outside sources from having a direct address to the backend instances. 

Sharing an IP address between backend instances also reduces the cost of static public IPs and supports scenarios such as simplifying IP allow lists with traffic from known public IPs. 

## <a name ="snat"></a> Sharing ports across resources

If the backend resources of a load balancer don't have instance-level public IP (ILPIP) addresses, they establish outbound connectivity to the internet via the frontend IP of the public load balancer.

Ports are used to generate unique identifiers used to maintain distinct flows. The internet uses a five-tuple to provide this distinction.

The five-tuple consists of:

* Destination IP
* Destination port
* Source IP
* Source port and protocol to provide this distinction.

If a port is used for inbound connections, it will have a **listener** for inbound connection requests on that port and cannot be used for outbound connections. To establish an outbound connection an **ephemeral port** must be used to provide the destination with a port on which to communicate and maintain a distinct traffic flow. 

Each IP address has 65,535 ports. The first 1024 ports are reserved as **system ports**. Each port can either be used for inbound or outbound connections for TCP and UDP. 

Of the remaining ports, Azure gives 64,000 for use as **ephemeral ports**. When an IP address is added as a frontend IP configuration, these ephemeral ports can be used for SNAT.

Through outbound rules, these SNAT ports can be distributed to backend instances to enable them to share the public IP(s) of the load balancer for outbound connections.

Networking on the host for each backend instance will do SNAT to packets that are part of an outbound connection. The host rewrites the source IP to one of the public IPs. The host rewrites the source port of each outbound packet to one of the SNAT ports.

## <a name="scenarios"></a> Exhausting ports

Every connection to the same destination IP and destination port will use a SNAT port. This connection maintains a distinct **traffic flow** from the backend instance or **client** to a **server**. This process gives the server a distinct port on which to address traffic. Without this process, the client machine is unaware of which flow a packet is part of.

Imagine having multiple browsers going to https://www.microsoft.com, which is:

* Destination IP = 23.53.254.142
* Destination Port = 443
* Protocol = TCP

Without different destination ports for the return traffic (the SNAT port used to establish the connection), the client will have no way to separate one query result from another.

When **connection reuse** isn't enabled and outbound connections burst or a backend instance is allocated a small number of ports, the risk of SNAT **port exhaustion** is increased.

New outbound connections to a destination IP will fail when port exhaustion occurs. Connections will succeed when a port becomes available. This exhaustion occurs when the 64,000 ports from an IP address are spread thin across many backend instances. For guidance on mitigation of SNAT port exhaustion, see the [troubleshooting guide](https://docs.microsoft.com/azure/load-balancer/troubleshoot-outbound-connection).  

For TCP connections, the LB will use a single SNAT port for every destination IP and port. This multiuse enables multiple connections to the same destination IP with the same SNAT port. This multiuse is limited if the connection isn't to different destination ports.

For UDP connections, the LB uses a **port-restricted cone NAT** algorithm, which consumes one SNAT port per destination IP whatever the destination port. 

A port is reused for an unlimited number of connections. The port is only reused if the destination IP or port is different.

## Allocating ports

For each public IP assigned as a frontend IP configuration of your LB, you can allocate 64,000 SNAT ports to its backend pool members. Ports can't be shared amongst backend pool members. A range of SNAT ports can only be used by a single backend instance to ensure return packets are routed correctly. 

When using your LB as a proxy, it is strongly recommended you use an outbound rule to explicitly configure SNAT port allocation. This will maximize the number of SNAT ports each backend instance has available for outbound connections. 

Should you use the automatic allocation of outbound SNAT through a load-balancing rule, the allocation table will define your port allocation.

The following <a name="snatporttable"></a>table shows the SNAT port <a name="preallocatedports"></a>preallocations for tiers of backend pool sizes:

| Pool size (VM instances) | Preallocated SNAT ports per IP configuration |
| --- | --- |
| 1-50 | 1,024 |
| 51-100 | 512 |
| 101-200 | 256 |
| 201-400 | 128 |
| 401-800 | 64 |
| 801-1,000 | 32 | 

>[!NOTE]
> If you have a backend pool with a max size of 6, each instance can have 64,000/10 = 6,400 ports if you define an explicit outbound rule. According to the above table each will only have 1,024 if you choose automatic allocation.

## <a name="outboundrules"></a> Outbound rules and Virtual Network NAT

Azure Load Balancer outbound rules and Virtual Network NAT are options available for egress from a virtual network.

<!---Will add link here when the outbound rules doc is published and link is available in the branch--->
For more information about outbound rules, see **Outbound rules**.

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

## Next Steps

*	[Troubleshoot outbound connection failures because of SNAT exhaustion](https://docs.microsoft.com/azure/load-balancer/troubleshoot-outbound-connection)
*	[Review SNAT metrics](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-diagnostics#how-do-i-check-my-snat-port-usage-and-allocation) and familiarize yourself with the correct way to filter, split, and view them.

