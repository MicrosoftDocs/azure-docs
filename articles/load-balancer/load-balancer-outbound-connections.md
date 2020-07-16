---
title: Outbound connections in Azure
titleSuffix: Azure Load Balancer
description: This article explains how Azure enables VMs to communicate with public internet services.
services: load-balancer
documentationcenter: na
author: asudbring
ms.service: load-balancer
ms.custom: seodec18
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/24/2020
ms.author: allensu
---

# Outbound connections in Azure

Azure Load Balancer provides outbound connectivity through different mechanisms. This article describes the scenarios and how to manage them. If you are experiencing issue with outbound connectivity through an Azure Load Balancer, see the [troubleshooting guide for outbound connections](../load-balancer/troubleshoot-outbound-connection.md).

>[!NOTE]
>This article covers Resource Manager deployments. Microsoft recommends Resource Manager for production workloads.

## Terminology

| Term | Applicable protocol(s) | Details|
| ---------|---------| -------|
| Source network address translation (SNAT) | TCP, UDP | A deployment in Azure can communicate with endpoints outside Azure in the public IP address space. When an instance initiates an outbound flow to a destination in the public IP address space, Azure dynamically maps the private IP address to a public IP address. After this mapping is created, return traffic for this outbound originated flow can also reach the private IP address where the flow originated. Azure uses **source network address translation (SNAT)** to perform this function.|
| Port masquerading SNAT (PAT)| TCP, UDP |  When multiple private IP addresses are masquerading behind a single public IP address, Azure uses **port address translation (PAT)** to masquerade/hide private IP addresses. Ephemeral ports are used for PAT and are [preallocated](#preallocatedports) based on pool size. When a public Load Balancer resource is associated with VM instances, which do not have dedicated Public IP addresses, each outbound connection source is rewritten. The source is rewritten from the virtual network private IP address space to the frontend Public IP address of the load balancer. In the public IP address space, the 5-tuple of the flow (source IP address, source port, IP transport protocol, destination IP address, destination port) must be unique. Port masquerading SNAT can be used with either TCP or UDP IP protocols. Ephemeral ports (SNAT ports) are used to achieve this after rewriting the private source IP address, because multiple flows originate from a single public IP address. The port masquerading SNAT algorithm allocates SNAT ports differently for UDP versus TCP.|
| SNAT Ports| TCP | SNAT ports are ephemeral ports available for a particular public IP source address. One SNAT port is consumed per flow to a single destination IP address, port. For multiple TCP flows to the same destination IP address, port, and protocol, each TCP flow consumes a single SNAT port. This ensures that the flows are unique when they originate from the same public IP address and go to the same destination IP address, port, and protocol. Multiple flows, each to a different destination IP address, port, and protocol, share a single SNAT port. The destination IP address, port, and protocol make flows unique without the need for additional source ports to distinguish flows in the public IP address space.|
|SNAT Ports | UDP | UDP SNAT ports are managed by a different algorithm than TCP SNAT ports.  Load Balancer uses an algorithm known as "port-restricted cone NAT" for UDP.  One SNAT port is consumed for each flow, irrespective of destination IP address, port.|
| Exhaustion | - | When SNAT port resources are exhausted, outbound flows fail until existing flows release SNAT ports. Load Balancer reclaims SNAT ports when the flow closes and uses a [4-minute idle timeout](../load-balancer/troubleshoot-outbound-connection.md#idletimeout) for reclaiming SNAT ports from idle flows. UDP SNAT ports generally exhaust much faster than TCP SNAT ports due to the difference in algorithm used. You must design and scale test with this difference in mind.|
| SNAT port release behavior | TCP | If either server/client sends FINACK, SNAT port will be released after 240 seconds. If an RST is seen, SNAT port will be released after 15 seconds. If idle timeout has been reached, port is released.|
| SNAT port release behavior | UDP |If idle timeout has been reached, port is released.|
| SNAT port reuse | TCP, UDP | Once a port has been released, the port is available for reuse as needed.  You can think of SNAT ports as a sequence from lowest to highest available for a given scenario, and the first available SNAT port is used for new connections.|

### <a name="preallocatedports"></a>Port allocation algorithm

Azure uses an algorithm to determine the number of preallocated SNAT ports available based on the size of the backend pool when using PAT. For each Public IP address associated with a load balancer there are 64,000 ports available as SNAT ports for each IP transport protocol. The same number of SNAT ports are preallocated for UDP and TCP respectively and consumed independently per IP transport protocol.  However, the SNAT port usage is different depending on whether the flow is UDP or TCP. When outbound flows are created, these ports are consumed dynamically (up to the preallocated limit) and released when the flow closes or [idle timeouts](../load-balancer/troubleshoot-outbound-connection.md#idletimeout) happen. Ports are consumed only if it's necessary to make flows unique.

#### <a name="snatporttable"></a> Default SNAT ports allocated

The following table shows the SNAT port preallocations for tiers of backend pool sizes:

| Pool size (VM instances) | Preallocated SNAT ports per IP configuration |
| --- | --- |
| 1-50 | 1,024 |
| 51-100 | 512 |
| 101-200 | 256 |
| 201-400 | 128 |
| 401-800 | 64 |
| 801-1,000 | 32 |

Changing the size of your backend pool might affect some of your established flows:

- If the backend pool size increases and transitions into the next tier, half of your preallocated SNAT ports are reclaimed during the transition to the next larger backend pool tier. Flows that are associated with a reclaimed SNAT port will time out and must be reestablished. If a new flow is attempted, the flow will succeed immediately as long as preallocated ports are available.
- If the backend pool size decreases and transitions into a lower tier, the number of available SNAT ports increases. In this case, existing allocated SNAT ports and their respective flows are not affected.

## <a name="scenarios"></a>Outbound connections scenario overview

| Scenario | Method | IP protocols | Description |
|  --- | --- | --- | --- |
|  1. VM with a Public IP address (with or without Azure Load Balancer | SNAT, port masquerading not used | TCP, UDP, ICMP, ESP | Azure uses the public IP assigned to the IP configuration of the instance's NIC for all outbound flows. The instance has all ephemeral ports available. It doesn't matter whether the VM is load balanced or not. This scenario takes precedence over the others. A public IP assigned to a VM is a 1:1 relationship (rather than 1: many) and implemented as a stateless 1:1 NAT. |
| 2. Public Load Balancer associated with a VM (no Public IP address on the VM/instance) | SNAT with port masquerading (PAT) using the Load Balancer frontends | TCP, UDP | In this scenario, the Load Balancer resource must be configured with a load balancer rule to create a link between the public IP frontend with the backend pool. If you do not complete this rule configuration, the behavior is as described in scenario 3. It is not necessary for the rule to have a working listener in the backend pool for the health probe to succeed. When VM creates an outbound flow, Azure translates the private source IP address of the outbound flow to the public IP address of the public Load Balancer frontend via SNAT. Ephemeral ports of the load balancer's frontend public IP address are used to distinguish individual flows originated by the VM. SNAT dynamically uses [preallocated ephemeral ports](#preallocatedports) when outbound flows are created. In this context, the ephemeral ports used for SNAT are called SNAT ports. SNAT ports are pre-allocated as described in the [Default SNAT ports allocated table](#snatporttable). |
| 3. VM (no Load Balancer, no Public IP address) or VM associated with Basic Internal Load Balancer | SNAT with port masquerading (PAT) | TCP, UDP | When the VM creates an outbound flow, Azure translates the private source IP address of the outbound flow to a public source IP address. This public IP address is **not configurable**, cannot be reserved, and does not count against the subscription's public IP resource limit. If you redeploy the VM or Availability Set or virtual machine scale set, this public IP address will be released and a new public IP address requested. Do not use this scenario for whitelisting IP addresses. Instead, use scenario 1 or 2 where you explicitly declare outbound behavior. SNAT ports are preallocated as described in the [Default SNAT ports allocated table](#snatporttable).

## <a name="outboundrules"></a>Outbound rules

 Outbound rules make it simple to configure public [Standard Load Balancer](load-balancer-standard-overview.md)'s outbound network address translation.  You have full declarative control over outbound connectivity to scale and tune this ability to your specific needs. This section expand scenario 2 (B) in described above.

![Load Balancer outbound rules](media/load-balancer-outbound-rules-overview/load-balancer-outbound-rules.png)

With outbound rules, you can use Load Balancer to define outbound NAT from scratch. You can also scale and tune the behavior of existing outbound NAT.

Outbound rules allow you to control:

- which virtual machines should be translated to which public IP addresses.
- how outbound SNAT ports should be allocated.
- which protocols to provide outbound translation for.
- what duration to use for outbound connection idle timeout (4-120 minutes).
- whether to send a TCP Reset on idle timeout
- both TCP and UDP transport protocols with a single rule

### Outbound rule definition

Like all Load Balancer rules, outbound rules follow the same familiar syntax as load balancing and inbound NAT rules: **frontend** + **parameters** + **backend pool**. 
An outbound rule configures outbound NAT for _all virtual machines identified by the backend pool_ to be translated to the _frontend_.  The _parameters_ provide additional fine grained control over the outbound NAT algorithm.

### <a name="scale"></a> Scale outbound NAT with multiple IP addresses

Each additional IP address provided by a frontend provides additional 64,000 ephemeral ports for Load Balancer to use as SNAT ports. You can use multiple IP addresses to plan for large-scale scenarios and you can use outbound rules to mitigate [SNAT exhaustion](troubleshoot-outbound-connection.md#snatexhaust) prone patterns.  

You can also use a [public IP prefix](https://aka.ms/lbpublicipprefix) directly with an outbound rule.  Using public IP prefix provides for easier scaling and simplified white-listing of flows originating from your Azure deployment. You can configure a frontend IP configuration within the Load Balancer resource to reference a public IP address prefix directly.  This allows Load Balancer exclusive control over the public IP prefix and the outbound rule will automatically use all public IP addresses contained within the public IP prefix for outbound connections.  Each of the IP addresses within public IP prefix provide an additional 64,000 ephemeral ports per IP address for Load Balancer to use as SNAT ports.

### <a name="idletimeout"></a> Outbound flow idle timeout and TCP reset

Outbound rules provide a configuration parameter to control the outbound flow idle timeout and match it to the needs of your application. Outbound idle timeouts default to 4 minutes. You can learn to [configure idle timeouts](load-balancer-tcp-idle-timeout.md#tcp-idle-timeout). The default behavior of Load Balancer is to drop the flow silently when the outbound idle timeout has been reached.  With the `enableTCPReset` parameter, you can enable a more predictable application behavior and control whether to send bidirectional TCP Reset (TCP RST) at the time out of outbound idle timeout. Review [TCP Reset on idle timeout](https://aka.ms/lbtcpreset) for details including region availability.

### <a name="preventoutbound"></a>Preventing outbound connectivity

Load balancing rules provide automatic programming of outbound NAT. However, some scenarios benefit or require you to disable the automatic programming of outbound NAT by the load balancing rule to allow you to control or refine the behavior.  
You can use this parameter in two ways:

1. Optional suppression of using the inbound IP address for outbound SNAT via disabling outbound SNAT for a load balancing rule
  
2. Tune the outbound SNAT parameters of an IP address used for inbound and outbound simultaneously.  The automatic outbound NAT programming must be disabled to allow an outbound rule to take control.  For example, in order to change the SNAT port allocation of an address also used for inbound, the `disableOutboundSnat` parameter must be set to true.  If you attempt to use an outbound rule to redefine the parameters of an IP address also used for inbound and have not released outbound NAT programming of the load balancing rule, the operation to configure an outbound rule will fail.

>[!IMPORTANT]
> Your virtual machine will not have outbound connectivity if you set this parameter to true and do not have an outbound rule to define outbound connectivity.  Some operations of your VM or your application may depend on having outbound connectivity available. Make sure you understand the dependencies of your scenario and have considered impact of making this change.

Sometimes it's undesirable for a VM to be allowed to create an outbound flow. Or there might be a requirement to manage which destinations can be reached with outbound flows, or which destinations can begin inbound flows. In this case, you can use [network security groups](../virtual-network/security-overview.md) to manage the destinations that the VM can reach. You can also use NSGs to manage which public destination can initiate inbound flows.

When you apply an NSG to a load-balanced VM, pay attention to the [service tags](../virtual-network/security-overview.md#service-tags) and [default security rules](../virtual-network/security-overview.md#default-security-rules). You must ensure that the VM can receive health probe requests from Azure Load Balancer.

If an NSG blocks health probe requests from the AZURE_LOADBALANCER default tag, your VM health probe fails and the VM is marked down. Load Balancer stops sending new flows to that VM.

## Scenarios with outbound rules

| # | Scenario| Details|
|---|---|---|
| I | Groom outbound connections to a specific set of public IP addresses| You can use an outbound rule to groom outbound connections to appear to originate from a specific set of public IP addresses to ease whitelisting scenarios.  This source public IP address can be the same as used by a load balancing rule or a different set of public IP addresses than used by a load balancing rule.  1. Create [public IP prefix](https://aka.ms/lbpublicipprefix) (or public IP addresses from public IP prefix) 2. Create a public Standard Load Balancer 3. Create frontends referencing the public IP prefix (or public IP addresses) you wish to use 4. Reuse a backend pool or create a backend pool and place the VMs into a backend pool of the public Load Balancer 5. Configure an outbound rule on the public Load Balancer to program outbound NAT for these VMs using the frontends. If you do not wish for the load balancing rule to be used for outbound, you need to disable outbound SNAT on the load balancing rule.
| II | Modify SNAT port allocation| You can use outbound rules to tune the [automatic SNAT port allocation based on backend pool size](load-balancer-outbound-connections.md#preallocatedports). For example, if you have two virtual machines sharing a single public IP address for outbound NAT, you may wish to increase the number of SNAT ports allocated from the default 1024 ports if you are experiencing SNAT exhaustion. Each public IP address can contribute up to 64,000 ephemeral ports.  If you configure an outbound rule with a single public IP address frontend, you can distribute a total of 64,000 SNAT ports to VMs in the backend pool.  For two VMs, a maximum of 32,000 SNAT ports can be allocated with an outbound rule (2x 32,000 = 64,000). You can use outbound rules to tune the SNAT ports allocated by default. You allocate more or less than the default SNAT port allocation provides.Each public IP address from all frontends of an outbound rule contributes up to 64,000 ephemeral ports for use as SNAT ports.  Load Balancer allocates SNAT ports in multiples of 8. If you provide a value not divisible by 8, the configuration operation is rejected.  If you attempt to allocate more SNAT ports than are available based on the number of public IP addresses, the configuration operation is rejected.  For example, if you allocate 10,000 ports per VM and 7 VMs in a backend pool would share a single public IP address, the configuration is rejected (7 x 10,000 SNAT ports > 64,000 SNAT ports).  You can add more public IP addresses to the frontend of the outbound rule to enable the scenario. You can revert back to [default SNAT port allocation based on backend pool size](load-balancer-outbound-connections.md#preallocatedports) by specifying 0 for number of ports. In that case the first 50 VM instances will get 1024 ports, 51-100 VM instances will get 512 and so on according to the [table](#snatporttable).|
| III| Enable outbound only | You can use a public Standard Load Balancer to provide outbound NAT for a group of VMs. In this scenario, you can use an outbound rule by itself, without the need for any additional rules.|
| IV | Outbound NAT for VMs only (no inbound) | Define a public Standard Load Balancer, place the VMs into the backend pool, and configure an outbound rule to program outbound NAT and groom the outbound connections to originate from a specific public IP address. You can also use a public IP prefix simplify white-listing the source of outbound connections. 1. Create a public Standard Load Balancer. 2. Create a backend pool and place the VMs into a backend pool of the public Load Balancer. 3. Configure an outbound rule on the public Load Balancer to program outbound NAT for these VMs.
| V| Outbound NAT for internal Standard Load Balancer scenarios| When using an internal Standard Load Balancer, outbound NAT is not available until outbound connectivity has been explicitly declared. You can define outbound connectivity using an outbound rule to create outbound connectivity for VMs behind an internal Standard Load Balancer with these steps: 1. Create a public Standard Load Balancer. 2. Create a backend pool and place the VMs into a backend pool of the public Load Balancer in addition to the internal Load Balancer. 3. Configure an outbound rule on the public Load Balancer to program outbound NAT for these VMs.|
| VI | Enable both TCP & UDP protocols for outbound NAT with a public Standard Load Balancer | When using a public Standard Load Balancer, the automatic outbound NAT programming provided matches the transport protocol of the load balancing rule. 1. Disable outbound SNAT on the load balancing rule. 2. Configure an outbound rule on the same Load Balancer. 3. Reuse the backend pool already used by your VMs. 4. Specify "protocol": "All" as part of the outbound rule. When only inbound NAT rules are used, no outbound NAT is provided. 1. Place VMs in a backend pool. 2. Define one or more frontend IP configurations with public IP address(es) or public IP prefix 3. Configure an outbound rule on the same Load Balancer. 4. Specify "protocol": "All" as part of the outbound rule |

## <a name="discoveroutbound"></a>Discovering the public IP that a VM uses

There are many ways to determine the public source IP address of an outbound connection. OpenDNS provides a service that can show you the public IP address of your VM.

By using the nslookup command, you can send a DNS query for the name myip.opendns.com to the OpenDNS resolver. The service returns the source IP address that was used to send the query. When you run the following query from your VM, the response is the public IP used for that VM:

    nslookup myip.opendns.com resolver1.opendns.com

## Connections to Azure Storage in the same region

Having outbound connectivity via the scenarios above is not necessary to connect to Storage in the same region as the VM. If you do not want this, use network security groups (NSGs) as explained above. For connectivity to Storage in other regions, outbound connectivity is required. Please note that when connecting to Storage from a VM in the same region, the source IP address in the Storage diagnostic logs will be an internal provider address, and not the public IP address of your VM. If you wish to restrict access to your Storage account to VMs in one or more Virtual Network subnets in the same region, use [Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) and not your public IP address when configuring your storage account firewall. Once service endpoints are configured, you will see your Virtual Network private IP address in your Storage diagnostic logs and not the internal provider address.

## Limitations

- The maximum number of usable ephemeral ports per frontend IP address is 64,000.
- The range of the configurable outbound idle timeout is 4 to 120 minutes (240 to 7200 seconds).
- Load Balancer does not support ICMP for outbound NAT.
- Outbound rules can only be applied to primary IP configuration of a NIC.  Multiple NICs are supported.
- Web Worker Roles without a VNet and other Microsoft platform services can be accessible when only an internal Standard Load Balancer is used due to a side effect from how pre-VNet services and other platform services function. Do not rely on this side effect as the respective service itself or the underlying platform may change without notice. You must always assume you need to create outbound connectivity explicitly if desired when using an internal Standard Load Balancer only. Scenario 3 described in this article is not available.

## Next steps

- Learn more about [Standard Load Balancer](load-balancer-standard-overview.md).
- Learn more about [outbound rules](load-balancer-outbound-rules-overview.md) for Standard public Load Balancer.
- Learn more about [Load Balancer](load-balancer-overview.md).
- Learn more about [network security groups](../virtual-network/security-overview.md).
- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) in Azure.
