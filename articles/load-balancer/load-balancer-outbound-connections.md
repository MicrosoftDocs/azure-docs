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
ms.date: 08/07/2019
ms.author: allensu
---

# Outbound connections in Azure

The Azure Load Balancer provides outbound connectivity for customer deployments through several different mechanisms. This article describes what the scenarios are, when they apply, how they work, and how to manage them. If you are experiencing issue with outbound connectivity through an Azure Load Balancer, see the [troubleshooting guide for outbound connections] (../load-balancer/troubleshoot-outbound-connection.md).

>[!NOTE] 
>This article covers Resource Manager deployments only. Review [Outbound connections (Classic)](load-balancer-outbound-connections-classic.md) for all Classic deployment scenarios in Azure.

A deployment in Azure can communicate with endpoints outside Azure in the public IP address space. When an instance initiates an outbound flow to a destination in the public IP address space, Azure dynamically maps the private IP address to a public IP address. After this mapping is created, return traffic for this outbound originated flow can also reach the private IP address where the flow originated.

Azure uses source network address translation (SNAT) to perform this function. When multiple private IP addresses are masquerading behind a single public IP address, Azure uses [port address translation (PAT)](#pat) to masquerade private IP addresses. Ephemeral ports are used for PAT and are [preallocated](#preallocatedports) based on pool size.

There are multiple [outbound scenarios](#scenarios). You can combine these scenarios as needed. Review them carefully to understand the capabilities, constraints, and patterns as they apply to your deployment model and application scenario. Review guidance for [managing these scenarios](../load-balancer/troubleshoot-outbound-connection.md#snatexhaust).

>[!IMPORTANT] 
>Standard Load Balancer and Standard Public IP introduce new abilities and different behaviors to outbound connectivity.  They are not the same as Basic SKUs.  If you want outbound connectivity when working with Standard SKUs, you must explicitly define it either with Standard Public IP addresses or Standard public Load Balancer.  This includes creating outbound connectivity when using an internal Standard Load Balancer.  We recommend you always use outbound rules on a Standard public Load Balancer.  [Scenario 3](#defaultsnat) is not available with Standard SKU.  That means when an internal Standard Load Balancer is used, you need to take steps to create outbound connectivity for the VMs in the backend pool if outbound connectivity is desired.  In the context of outbound connectivity, a single standalone VM, all the VM's in an Availability Set, all the instances in a VMSS behave as a group. This means, if a single VM in an Availability Set is associated with a Standard SKU, all VM instances within this Availability Set now behave by the same rules as if they are associated with Standard SKU, even if an individual instance is not directly associated with it. This behavior is also observed in the case of a standalone VM with multiple network interface cards attached to a load balancer. If one NIC is added as a standalone, it will have the same behavior. Carefully review this entire document to understand the overall concepts, review [Standard Load Balancer](load-balancer-standard-overview.md) for differences between SKUs, and review [outbound rules](load-balancer-outbound-rules-overview.md).  Using outbound rules allows you fine grained control over all aspects of outbound connectivity.

## <a name="scenarios"></a>Scenario overview

Azure Load Balancer and related resources are explicitly defined when you're using [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview).  Azure currently provides three different methods to achieve outbound connectivity for Azure Resource Manager resources. 

| SKUs | Scenario | Method | IP protocols | Description |
| --- | --- | --- | --- | --- |
| Standard, Basic | [1. VM with an Instance Level Public IP address (with or without Load Balancer)](#ilpip) | SNAT, port masquerading not used | TCP, UDP, ICMP, ESP | Azure uses the public IP assigned to the IP configuration of the instance's NIC. The instance has all ephemeral ports available. When using Standard Load Balancer, [outbound rules](load-balancer-outbound-rules-overview.md) are not supported if a public IP is assigned to the Virtual Machine. |
| Standard, Basic | [2. Public Load Balancer associated with a VM (no Public IP address on the instance)](#lb) | SNAT with port masquerading (PAT) using the Load Balancer frontends | TCP, UDP |Azure shares the public IP address of the public Load Balancer frontends with multiple private IP addresses. Azure uses ephemeral ports of the frontends to PAT. When using Standard Load Balancer, you should use [outbound rules](load-balancer-outbound-rules-overview.md) to explicitly define outbound connectivity. |
| none or Basic | [3. Standalone VM (no Load Balancer, no Public IP address)](#defaultsnat) | SNAT with port masquerading (PAT) | TCP, UDP | Azure automatically designates a public IP address for SNAT, shares this public IP address with multiple private IP addresses of the availability set, and uses ephemeral ports of this public IP address. This scenario is a fallback for the preceding scenarios. We don't recommend it if you need visibility and control. |

If you don't want a VM to communicate with endpoints outside Azure in public IP address space, you can use network security groups (NSGs) to block access as needed. The section [Preventing outbound connectivity](#preventoutbound) discusses NSGs in more detail. Guidance on designing, implementing, and managing a virtual network without any outbound access is outside the scope of this article.

### <a name="ilpip"></a>Scenario 1: VM with Public IP address

In this scenario, the VM has a Public IP assigned to it. As far as outbound connections are concerned, it doesn't matter whether the VM is load balanced or not. This scenario takes precedence over the others. When a Public IP address is used, the VM uses the Public IP address for all outbound flows.  

A public IP assigned to a VM is a 1:1 relationship (rather than 1: many) and implemented as a stateless 1:1 NAT.  Port masquerading (PAT) is not used, and the VM has all ephemeral ports available for use.

If your application initiates many outbound flows and you experience SNAT port exhaustion, consider assigning a [Public IP address to mitigate SNAT constraints](../load-balancer/troubleshoot-outbound-connection.md#assignilpip). Review [Managing SNAT exhaustion](../load-balancer/troubleshoot-outbound-connection.md#snatexhaust) in its entirety.

### <a name="lb"></a>Scenario 2: Load-balanced VM without a Public IP address

In this scenario, the VM is part of a public Load Balancer backend pool. The VM does not have a public IP address assigned to it. The Load Balancer resource must be configured with a load balancer rule to create a link between the public IP frontend with the backend pool.

If you do not complete this rule configuration, the behavior is as described in the scenario for [Standalone VM with no Public IP](#defaultsnat). It is not necessary for the rule to have a working listener in the backend pool for the health probe to succeed.

When the load-balanced VM creates an outbound flow, Azure translates the private source IP address of the outbound flow to the public IP address of the public Load Balancer frontend. Azure uses SNAT to perform this function. Azure also uses [PAT](#pat) to masquerade multiple private IP addresses behind a public IP address. 

Ephemeral ports of the load balancer's public IP address frontend are used to distinguish individual flows originated by the VM. SNAT dynamically uses [preallocated ephemeral ports](#preallocatedports) when outbound flows are created. In this context, the ephemeral ports used for SNAT are called SNAT ports.

SNAT ports are pre-allocated as described in the [Understanding SNAT and PAT](#snat) section. They're a finite resource that can be exhausted. It's important to understand how they are [consumed](#pat). To understand how to design for this consumption and mitigate as necessary, review [Managing SNAT exhaustion](../load-balancer/troubleshoot-outbound-connection.md#snatexhaust).

When [multiple public IP addresses are associated with Load Balancer Basic](load-balancer-multivip-overview.md), any of these public IP addresses are a candidate for outbound flows, and one is selected at random.  

To monitor the health of outbound connections with Load Balancer Basic, you can use [Azure Monitor logs for Load Balancer](load-balancer-monitor-log.md) and [alert event logs](load-balancer-monitor-log.md#alert-event-log) to monitor for SNAT port exhaustion messages.

### <a name="defaultsnat"></a>Scenario 3: Standalone VM without a Public IP address

In this scenario, the VM is not part of a public Load Balancer pool (and not part of an internal Standard Load Balancer pool) and does not have a Public IP address assigned to it. When the VM creates an outbound flow, Azure translates the private source IP address of the outbound flow to a public source IP address. The public IP address used for this outbound flow is not configurable and does not count against the subscription's public IP resource limit. This public IP address does not belong to you and cannot be reserved. If you redeploy the VM or Availability Set or virtual machine scale set, this public IP address will be released and a new public IP address requested. Do not use this scenario for whitelisting IP addresses. Instead, use one of the other two scenarios where you explicitly declare the outbound scenario and the public IP address to be used for outbound connectivity.

>[!IMPORTANT] 
>This scenario also applies when __only__ an internal Basic Load Balancer is attached. Scenario 3 is __not available__ when an internal Standard Load Balancer is attached to a VM.  You must explicitly create [scenario 1](#ilpip) or [scenario 2](#lb) in addition to using an internal Standard Load Balancer.

Azure uses SNAT with port masquerading ([PAT](#pat)) to perform this function. This scenario is similar to [scenario 2](#lb), except there is no control over the IP address used. This is a fallback scenario for when scenarios 1 and 2 do not exist. We don't recommend this scenario if you want control over the outbound address. If outbound connections are a critical part of your application, you should choose another scenario.

SNAT ports are preallocated as described in the [Understanding SNAT and PAT](#snat) section.  The number of VMs sharing an Availability Set determines which preallocation tier applies.  A standalone VM without an Availability Set is effectively a pool of 1 for the purposes of determining preallocation (1024 SNAT ports). SNAT ports are a finite resource that can be exhausted. It's important to understand how they are [consumed](#pat). To understand how to design for this consumption and mitigate as necessary, review [Managing SNAT exhaustion](../load-balancer/troubleshoot-outbound-connection.md#snatexhaust).

### <a name="combinations"></a>Multiple, combined scenarios

You can combine the scenarios described in the preceding sections to achieve a particular outcome. When multiple scenarios are present, an order of precedence applies: [scenario 1](#ilpip) takes precedence over [scenario 2](#lb) and [3](#defaultsnat). [Scenario 2](#lb) overrides [scenario 3](#defaultsnat).

An example is an Azure Resource Manager deployment where the application relies heavily on outbound connections to a limited number of destinations but also receives inbound flows over a Load Balancer frontend. In this case, you can combine scenarios 1 and 2 for relief. For additional patterns, review [Managing SNAT exhaustion](../load-balancer/troubleshoot-outbound-connection.md#snatexhaust).

### <a name="multife"></a> Multiple frontends for outbound flows

#### Standard Load Balancer

Standard Load Balancer uses all candidates for outbound flows at the same time when [multiple (public) IP frontends](load-balancer-multivip-overview.md) is present. Each frontend multiplies the number of available preallocated SNAT ports if a load balancing rule is enabled for outbound connections.

You can choose to suppress a frontend IP address from being used for outbound connections with a new load balancing rule option:

```json    
      "loadBalancingRules": [
        {
          "disableOutboundSnat": false
        }
      ]
```

Normally, the `disableOutboundSnat` option defaults to _false_ and signifies that this rule programs outbound SNAT for the associated VMs in the backend pool of the load balancing rule. The `disableOutboundSnat` can be changed to _true_ to prevent Load Balancer from using the associated frontend IP address for outbound connections for the VMs in the backend pool of this load balancing rule.  And you can also still designate a specific IP address for outbound flows as described in [Multiple, combined scenarios](#combinations) as well.

#### Load Balancer Basic

Load Balancer Basic chooses a single frontend to be used for outbound flows when [multiple (public) IP frontends](load-balancer-multivip-overview.md) are candidates for outbound flows. This selection is not configurable, and you should consider the selection algorithm to be random. You can designate a specific IP address for outbound flows as described in [Multiple, combined scenarios](#combinations).

### <a name="az"></a> Availability Zones

When using [Standard Load Balancer with Availability Zones](load-balancer-standard-availability-zones.md), zone-redundant frontends can provide zone-redundant outbound SNAT connections and SNAT programming survives zone failure.  When zonal frontends are used, outbound SNAT connections share fate with the zone they belong to.

## <a name="snat"></a>Understanding SNAT and PAT

### <a name="pat"></a>Port masquerading SNAT (PAT)

When a public Load Balancer resource is associated with VM instances, which do not have dedicated Public IP addresses, each outbound connection source is rewritten. The source is rewritten from the virtual network private IP address space to the frontend Public IP address of the load balancer. In the public IP address space, the 5-tuple of the flow (source IP address, source port, IP transport protocol, destination IP address, destination port) must be unique. Port masquerading SNAT can be used with either TCP or UDP IP protocols.

Ephemeral ports (SNAT ports) are used to achieve this after rewriting the private source IP address, because multiple flows originate from a single public IP address. The port masquerading SNAT algorithm allocates SNAT ports differently for UDP versus TCP.

#### <a name="tcp"></a>TCP SNAT Ports

One SNAT port is consumed per flow to a single destination IP address, port. For multiple TCP flows to the same destination IP address, port, and protocol, each TCP flow consumes a single SNAT port. This ensures that the flows are unique when they originate from the same public IP address and go to the same destination IP address, port, and protocol. 

Multiple flows, each to a different destination IP address, port, and protocol, share a single SNAT port. The destination IP address, port, and protocol make flows unique without the need for additional source ports to distinguish flows in the public IP address space.

#### <a name="udp"></a> UDP SNAT Ports

UDP SNAT ports are managed by a different algorithm than TCP SNAT ports.  Load Balancer uses an algorithm known as "port-restricted cone NAT" for UDP.  One SNAT port is consumed for each flow, irrespective of destination IP address, port.

#### SNAT port reuse

Once a port has been released, the port is available for reuse as needed.  You can think of SNAT ports as a sequence from lowest to highest available for a given scenario, and the first available SNAT port is used for new connections. 
 
#### Exhaustion

When SNAT port resources are exhausted, outbound flows fail until existing flows release SNAT ports. Load Balancer reclaims SNAT ports when the flow closes and uses a [4-minute idle timeout](../load-balancer/troubleshoot-outbound-connection.md#idletimeout) for reclaiming SNAT ports from idle flows.

UDP SNAT ports generally exhaust much faster than TCP SNAT ports due to the difference in algorithm used. You must design and scale test with this difference in mind.

For patterns to mitigate conditions that commonly lead to SNAT port exhaustion, review the [Managing SNAT](../load-balancer/troubleshoot-outbound-connection.md#snatexhaust) section.

### <a name="preallocatedports"></a>Ephemeral port preallocation for port masquerading SNAT (PAT)

Azure uses an algorithm to determine the number of preallocated SNAT ports available based on the size of the backend pool when using port masquerading SNAT ([PAT](#pat)). SNAT ports are ephemeral ports available for a particular public IP source address. For each Public IP address associated with a load balancer there are 64,000 ports available as SNAT ports for each IP transport protocol.

The same number of SNAT ports are preallocated for UDP and TCP respectively and consumed independently per IP transport protocol.  However, the SNAT port usage is different depending on whether the flow is UDP or TCP.

>[!IMPORTANT]
>Standard SKU SNAT programming is per IP transport protocol and derived from the load balancing rule.  If only a TCP load balancing rule exists, SNAT is only available for TCP. If you have only a TCP load balancing rule and need outbound SNAT for UDP, create a UDP load balancing rule from the same frontend to the same backend pool.  This will trigger SNAT programming for UDP.  A working rule or health probe is not required.  Basic SKU SNAT always programs SNAT for both IP transport protocol, irrespective of the transport protocol specified in the load balancing rule.

Azure preallocates SNAT ports to the IP configuration of the NIC of each VM. When an IP configuration is added to the pool, the SNAT ports are preallocated for this IP configuration based on the backend pool size. When outbound flows are created, [PAT](#pat) dynamically consumes (up to the preallocated limit) and releases these ports when the flow closes or [idle timeouts](../load-balancer/troubleshoot-outbound-connection.md#idletimeout) happen.

The following table shows the SNAT port preallocations for tiers of backend pool sizes:

| Pool size (VM instances) | Preallocated SNAT ports per IP configuration|
| --- | --- |
| 1-50 | 1,024 |
| 51-100 | 512 |
| 101-200 | 256 |
| 201-400 | 128 |
| 401-800 | 64 |
| 801-1,000 | 32 |

>[!NOTE]
> When using Standard Load Balancer with [multiple frontends](load-balancer-multivip-overview.md), each frontend IP address multiplies the number of available SNAT ports in the previous table. For example, a backend pool of 50 VM's with 2 load balancing rules, each with a separate frontend IP address, will use 2048 (2x 1024) SNAT ports per rule. See details for [multiple frontends](#multife).

Remember that the number of SNAT ports available does not translate directly to number of flows. A single SNAT port can be reused for multiple unique destinations. Ports are consumed only if it's necessary to make flows unique. For design and mitigation guidance, refer to the section about [how to manage this exhaustible resource](../load-balancer/troubleshoot-outbound-connection.md#snatexhaust) and the section that describes [PAT](#pat).

Changing the size of your backend pool might affect some of your established flows. If the backend pool size increases and transitions into the next tier, half of your preallocated SNAT ports are reclaimed during the transition to the next larger backend pool tier. Flows that are associated with a reclaimed SNAT port will time out and must be reestablished. If a new flow is attempted, the flow will succeed immediately as long as preallocated ports are available.

If the backend pool size decreases and transitions into a lower tier, the number of available SNAT ports increases. In this case, existing allocated SNAT ports and their respective flows are not affected.

SNAT ports allocations are IP transport protocol specific (TCP and UDP are maintained separately) and are released under the following conditions:

### TCP SNAT port release

- If either server/client sends FINACK, SNAT port will be released after 240 seconds.
- If a RST is seen, SNAT port will be released after 15 seconds.
- If idle timeout has been reached, port is released.

### UDP SNAT port release

- If idle timeout has been reached, port is released.

## <a name="discoveroutbound"></a>Discovering the public IP that a VM uses
There are many ways to determine the public source IP address of an outbound connection. OpenDNS provides a service that can show you the public IP address of your VM. 

By using the nslookup command, you can send a DNS query for the name myip.opendns.com to the OpenDNS resolver. The service returns the source IP address that was used to send the query. When you run the following query from your VM, the response is the public IP used for that VM:

    nslookup myip.opendns.com resolver1.opendns.com

## <a name="preventoutbound"></a>Preventing outbound connectivity
Sometimes it's undesirable for a VM to be allowed to create an outbound flow. Or there might be a requirement to manage which destinations can be reached with outbound flows, or which destinations can begin inbound flows. In this case, you can use [network security groups](../virtual-network/security-overview.md) to manage the destinations that the VM can reach. You can also use NSGs to manage which public destination can initiate inbound flows.

When you apply an NSG to a load-balanced VM, pay attention to the [service tags](../virtual-network/security-overview.md#service-tags) and [default security rules](../virtual-network/security-overview.md#default-security-rules). You must ensure that the VM can receive health probe requests from Azure Load Balancer. 

If an NSG blocks health probe requests from the AZURE_LOADBALANCER default tag, your VM health probe fails and the VM is marked down. Load Balancer stops sending new flows to that VM.

## Connections to Azure Storage in the same region

Having outbound connectivity via the scenarios above is not necessary to connect to Storage in the same region as the VM. If you do not want this, use network security groups (NSGs) as explained above. For connectivity to Storage in other regions, outbound connectivity is required. Please note that when connecting to Storage from a VM in the same region, the source IP address in the Storage diagnostic logs will be an internal provider address, and not the public IP address of your VM. If you wish to restrict access to your Storage account to VMs in one or more Virtual Network subnets in the same region, use [Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) and not your public IP address when configuring your storage account firewall. Once service endpoints are configured, you will see your Virtual Network private IP address in your Storage diagnostic logs and not the internal provider address.

## <a name="outboundrules"></a>Azure Load Balancer outbound rules

Azure Load Balancer provides outbound connectivity from a virtual network in addition to inbound.  Outbound rules make it simple to configure public [Standard Load Balancer](load-balancer-standard-overview.md)'s outbound network address translation.  You have full declarative control over outbound connectivity to scale and tune this ability to your specific needs.

![Load Balancer outbound rules](media/load-balancer-outbound-rules-overview/load-balancer-outbound-rules.png)

With outbound rules, you can use Load Balancer to: 
- define outbound NAT from scratch.
- scale and tune the behavior of existing outbound NAT. 

Outbound rules allow you to control:
- which virtual machines should be translated to which public IP addresses. 
- how [outbound SNAT ports](load-balancer-outbound-connections.md#snat) should be allocated.
- which protocols to provide outbound translation for.
- what duration to use for outbound connection idle timeout (4-120 minutes).
- whether to send a TCP Reset on idle timeout

Outbound rules expand [scenario 2](load-balancer-outbound-connections.md#lb) in described in the [outbound connections](load-balancer-outbound-connections.md) article and the scenario precedence remains as-is.

### Outbound rule

Like all Load Balancer rules, outbound rules follow the same familiar syntax as load balancing and inbound NAT rules:

**frontend** + **parameters** + **backend pool**

An outbound rule configures outbound NAT for _all virtual machines identified by the backend pool_ to be translated to the _frontend_.  And _parameters_ provide additional fine grained control over the outbound NAT algorithm.

API version "2018-07-01" permits an outbound rule definition structured as follows:

```json
      "outboundRules": [
        {
          "frontendIPConfigurations": [ list_of_frontend_ip_configuations ],
          "allocatedOutboundPorts": number_of_SNAT_ports,
          "idleTimeoutInMinutes": 4 through 66,
          "enableTcpReset": true | false,
          "protocol": "Tcp" | "Udp" | "All",
          "backendAddressPool": backend_pool_reference,
        }
      ]
```

>[!NOTE]
>The effective outbound NAT configuration is a composite of all outbound rules and load balancing rules. Outbound rules are incremental to load balancing rules. Review [disabling outbound NAT for a load balancing rule](#disablesnat) to manage the effective outbound NAT translation when multiple rules apply to a VM. You must [disable outbound SNAT](#disablesnat) when defining an outbound rule which is using the same public IP address as a load balancing rule.

#### <a name="scale"></a> Scale outbound NAT with multiple IP addresses

While an outbound rule can be used with just a single public IP address, outbound rules ease the configuration burden for scaling outbound NAT. You can use multiple IP addresses to plan for large-scale scenarios and you can use outbound rules to mitigate [SNAT exhaustion](troubleshoot-outbound-connection.md#snatexhaust) prone patterns.  

Each additional IP address provided by a frontend provides 64,000 ephemeral ports for Load Balancer to use as SNAT ports. While load balancing or inbound NAT rules have a single frontend, the outbound rule expands the frontend notion and allows multiple frontends per rule.  With multiple frontends per rule, the quantity of available SNAT ports is multiplied with each public IP address, and large scenarios can be supported.

Additionally, you can use a [public IP prefix](https://aka.ms/lbpublicipprefix) directly with an outbound rule.  Using public IP prefix provides for easier scaling and simplified white-listing of flows originating from your Azure deployment. You can configure a frontend IP configuration within the Load Balancer resource to reference a public IP address prefix directly.  This allows Load Balancer exclusive control over the public IP prefix and the outbound rule will automatically use all public IP addresses contained within the public IP prefix for outbound connections.  Each of the IP addresses within the range of the public IP prefix provide 64,000 ephemeral ports per IP address for Load Balancer to use as SNAT ports.   

You cannot have individual public IP address resources created from the public IP prefix when using this option as the outbound rule must have complete control of the public IP prefix.  If you need more fine grained control, you can create individual public IP address resource from the public IP prefix and assign multiple public IP addresses individually to the frontend of an outbound rule.

#### <a name="snatports"></a> Tune SNAT port allocation

You can use outbound rules to tune the [automatic SNAT port allocation based on backend pool size](load-balancer-outbound-connections.md#preallocatedports) and allocate more or less than the automatic SNAT port allocation provides.

Use the following parameter to allocate 10,000 SNAT ports per VM (NIC IP configuration).
 

          "allocatedOutboundPorts": 10000

Each public IP address from all frontends of an outbound rule contributes up to 64,000 ephemeral ports for use as SNAT ports.  Load Balancer allocates SNAT ports in multiples of 8. If you provide a value not divisible by 8, the configuration operation is rejected.  If you attempt to allocate more SNAT ports than are available based on the number of public IP addresses, the configuration operation is rejected.  For example, if you allocate 10,000 ports per VM and 7 VMs in a backend pool would share a single public IP address, the configuration is rejected (7 x 10,000 SNAT ports > 64,000 SNAT ports).  You can add more public IP addresses to the frontend of the outbound rule to enable the scenario.

You can revert back to [automatic SNAT port allocation based on backend pool size](load-balancer-outbound-connections.md#preallocatedports) by specifying 0 for number of ports. In that case the first 50 VM instances will get 1024 ports, 51-100 VM instances will get 512 and so on according to the table.

#### <a name="idletimeout"></a> Control outbound flow idle timeout

Outbound rules provide a configuration parameter to control the outbound flow idle timeout and match it to the needs of your application.  Outbound idle timeouts default to 4 minutes.  The parameter accepts a value from 4 to 120 to specific the number of minutes for the idle timeout for flows matching this particular rule.

Use the following parameter to set the outbound idle timeout to 1 hour:

          "idleTimeoutInMinutes": 60

#### <a name="tcprst"></a> <a name="tcpreset"></a> Enable TCP Reset on idle timeout

The default behavior of Load Balancer is to drop the flow silently when the outbound idle timeout has been reached.  With the enableTCPReset parameter, you can enable a more predictable application behavior and control whether to send bidirectional TCP Reset (TCP RST) at the time out of outbound idle timeout. 

Use the following parameter to enable TCP Reset on an outbound rule:

           "enableTcpReset": true

Review [TCP Reset on idle timeout](https://aka.ms/lbtcpreset) for details including region availability.

#### <a name="proto"></a> Support both TCP and UDP transport protocols with a single rule

You will likely want to use "All" for the transport protocol of the outbound rule, but you can also apply the outbound rule to a specific transport protocol as well if there is a need to do so.

Use the following parameter to set the protocol to TCP and UDP:

          "protocol": "All"

#### <a name="disablesnat"></a> Disable outbound NAT for a load balancing rule

As stated previously, load balancing rules provide automatic programming of outbound NAT. However, some scenarios benefit or require you to disable the automatic programming of outbound NAT by the load balancing rule to allow you to control or refine the behavior.  Outbound rules have scenarios where it is important to stop the automatic outbound NAT programming.

You can use this parameter in two ways:
- Optional suppression of using the inbound IP address for outbound NAT.  Outbound rules are incremental to load balancing rules and with this parameter set, the outbound rule is in control.
  
- Tune the outbound NAT parameters of an IP address used for inbound and outbound simultaneously.  The automatic outbound NAT programming must be disabled to allow an outbound rule to take control.  For example, in order to change the SNAT port allocation of an address also used for inbound, this parameter must be set to true.  If you attempt to use an outbound rule to redefine the parameters of an IP address also used for inbound and have not released outbound NAT programming of the load balancing rule, the operation to configure an outbound rule will fail.

>[!IMPORTANT]
> Your virtual machine will not have outbound connectivity if you set this parameter to true and do not have an outbound rule (or [instance-level public IP scenario](load-balancer-outbound-connections.md#ilpip) to define outbound connectivity.  Some operations of your VM or your application may depend on having outbound connectivity available. Make sure you understand the dependencies of your scenario and have considered impact of making this change.

You can disable outbound SNAT on the load balancing rule with this configuration parameter:

```json
      "loadBalancingRules": [
        {
          "disableOutboundSnat": true
        }
      ]
```

The disableOutboundSNAT parameter defaults to false, which means the load balancing rule **does** provide automatic outbound NAT as a mirror image of the load balancing rule configuration.  

If you set disableOutboundSnat to true on the load balancing rule, the load balancing rule releases control of the otherwise automatic outbound NAT programming.  Outbound SNAT as a result of the load balancing rule is disabled.

#### Reuse existing or define new backend pools

Outbound rules do not introduce a new concept for defining the group of VMs to which the rule should apply.  Instead, they reuse the concept of a backend pool, which is also used for load balancing rules. You can use this to simplify the configuration by either reusing an existing backend pool definition or creating one specifically for an outbound rule.

### Scenarios

#### <a name="groom"></a> Groom outbound connections to a specific set of public IP addresses

You can use an outbound rule to groom outbound connections to appear to originate from a specific set of public IP addresses to ease whitelisting scenarios.  This source public IP address can be the same as used by a load balancing rule or a different set of public IP addresses than used by a load balancing rule.  

1. Create [public IP prefix](https://aka.ms/lbpublicipprefix) (or public IP addresses from public IP prefix)
2. Create a public Standard Load Balancer
3. Create frontends referencing the public IP prefix (or public IP addresses) you wish to use
4. Reuse a backend pool or create a backend pool and place the VMs into a backend pool of the public Load Balancer
5. Configure an outbound rule on the public Load Balancer to program outbound NAT for these VMs using the frontends
   
If you do not wish for the load balancing rule to be used for outbound, you need to [disable outbound SNAT](#disablesnat) on the load balancing rule.

#### <a name="modifysnat"></a> Modify SNAT port allocation

You can use outbound rules to tune the [automatic SNAT port allocation based on backend pool size](load-balancer-outbound-connections.md#preallocatedports).

For example, if you have two virtual machines sharing a single public IP address for outbound NAT, you may wish to increase the number of SNAT ports allocated from the default 1024 ports if you are experiencing SNAT exhaustion. Each public IP address can contribute up to 64,000 ephemeral ports.  If you configure an outbound rule with a single public IP address frontend, you can distribute a total of 64,000 SNAT ports to VMs in the backend pool.  For two VMs, a maximum of 32,000 SNAT ports can be allocated with an outbound rule (2x 32,000 = 64,000).

Review [outbound connections](load-balancer-outbound-connections.md) and the details on how [SNAT](load-balancer-outbound-connections.md#snat) ports are allocated and used.

#### <a name="outboundonly"></a> Enable outbound only

You can use a public Standard Load Balancer to provide outbound NAT for a group of VMs. In this scenario, you can use an outbound rule by itself, without the need for any additional rules.

##### Outbound NAT for VMs only (no inbound)

Define a public Standard Load Balancer, place the VMs into the backend pool, and configure an outbound rule to program outbound NAT and groom the outbound connections to originate from a specific public IP address. You can also use a public IP prefix simplify white-listing the source of outbound connections.

1. Create a public Standard Load Balancer.
2. Create a backend pool and place the VMs into a backend pool of the public Load Balancer.
3. Configure an outbound rule on the public Load Balancer to program outbound NAT for these VMs.

##### Outbound NAT for internal Standard Load Balancer scenarios

When using an internal Standard Load Balancer, outbound NAT is not available until outbound connectivity has been explicitly declared. You can define outbound connectivity using an outbound rule to create outbound connectivity for VMs behind an internal Standard Load Balancer with these steps:

1. Create a public Standard Load Balancer.
2. Create a backend pool and place the VMs into a backend pool of the public Load Balancer in addition to the internal Load Balancer.
3. Configure an outbound rule on the public Load Balancer to program outbound NAT for these VMs.

##### Enable both TCP & UDP protocols for outbound NAT with a public Standard Load Balancer

- When using a public Standard Load Balancer, the automatic outbound NAT programming provided matches the transport protocol of the load balancing rule.  

   1. Disable outbound SNAT on the load balancing rule.
   2. Configure an outbound rule on the same Load Balancer.
   3. Reuse the backend pool already used by your VMs.
   4. Specify "protocol": "All" as part of the outbound rule.

- When only inbound NAT rules are used, no outbound NAT is provided.

   1. Place VMs in a backend pool.
   2. Define one or more frontend IP configurations with public IP address(es) or public IP prefix.
   3. Configure an outbound rule on the same Load Balancer.
   4. Specify "protocol": "All" as part of the outbound rule


## Limitations
- The maximum number of usable ephemeral ports per frontend IP address is 64,000.
- The range of the configurable outbound idle timeout is 4 to 120 minutes (240 to 7200 seconds).
- Load Balancer does not support ICMP for outbound NAT.
- Outbound rules can only be applied to primary IP configuration of a NIC.  Multiple NICs are supported.
- Web Worker Roles without a VNet and other Microsoft platform services can be accessible when only an internal Standard Load Balancer is used due to a side effect from how pre-VNet services and other platform services function. Do not rely on this side effect as the respective service itself or the underlying platform may change without notice. You must always assume you need to create outbound connectivity explicitly if desired when using an internal Standard Load Balancer only. The [default SNAT](#defaultsnat) scenario 3 described in this article is not available.

## Next steps

- Learn more about [Standard Load Balancer](load-balancer-standard-overview.md).
- Learn more about [outbound rules](load-balancer-outbound-rules-overview.md) for Standard public Load Balancer.
- Learn more about [Load Balancer](load-balancer-overview.md).
- Learn more about [network security groups](../virtual-network/security-overview.md).
- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) in Azure.
