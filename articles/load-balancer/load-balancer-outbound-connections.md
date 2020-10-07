---
title: Outbound connections
titleSuffix: Azure Load Balancer
description: This article explains how Azure enables VMs to communicate with public internet services.
services: load-balancer
documentationcenter: na
author: asudbring
ms.service: load-balancer
ms.custom: contperfq1
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/30/2020
ms.author: allensu
---

# Outbound connections

Azure Load Balancer provides outbound connectivity through different mechanisms. This article describes the scenarios and how to manage them. 


## Scenarios

* Virtual machine with public IP.
* Virtual machine without public IP.
* Virtual machine without public IP and without standard load balancer.

### <a name="scenario1"></a>Virtual machine with public IP

| Associations | Method | IP protocols |
| ---------- | ------ | ------------ |
| Public load balancer or stand-alone | [SNAT (Source Network Address Translation)](#snat) </br> [PAT (Port masquerading)](#pat) not used. | TCP (Transmission Control Protocol) </br> UDP (User Datagram Protocol) </br> ICMP (Internet Control Message Protocol) </br> ESP (Encapsulating Security Payload) |

#### Description

Azure uses the public IP assigned to the IP configuration of the instance's NIC for all outbound flows. The instance has all ephemeral ports available. It doesn't matter whether the VM is load balanced or not. This scenario takes precedence over the others. 

A public IP assigned to a VM is a 1:1 relationship (rather than 1: many) and implemented as a stateless 1:1 NAT.

### <a name="scenario2"></a>Virtual machine without public IP

| Associations | Method | IP protocols |
| ------------ | ------ | ------------ |
| Public load balancer | Use of load balancer frontend for [SNAT](#snat) with [PAT (Port masquerading)](#pat).| TCP </br> UDP |

#### Description

The load balancer resource is configured with a load balancer rule. This rule is used to create a link between the public IP frontend with the backend pool. 

If you don't complete this rule configuration, the behavior is as described in scenario 3. 

A rule with a listener isn't required for the health probe to succeed.

When a VM creates an outbound flow, Azure translates the source IP address to the public IP address of the public load balancer frontend. This translation is done via [SNAT](#snat). 

Ephemeral ports of the load balancer frontend public IP address are used to distinguish individual flows originated by the VM. SNAT dynamically uses [preallocated ephemeral ports](#preallocatedports) when outbound flows are created. 

In this context, the ephemeral ports used for SNAT are called SNAT ports. SNAT ports are pre-allocated as described in the [Default SNAT ports allocation table](#snatporttable).

### <a name="scenario3"></a>Virtual machine without public IP and without standard load balancer

| Associations | Method | IP protocols |
| ------------ | ------ | ------------ |
|None </br> Basic load balancer | [SNAT](#snat) with [port masquerading (PAT)](#pat)| TCP </br> UDP | 

#### Description

When the VM creates an outbound flow, Azure translates the source IP address to a public source IP address. This public IP address **isn't configurable** and can't be reserved. This address doesn't count against the subscription's public IP resource limit. 

The public IP address will be released and a new public IP requested if you redeploy the: 

* Virtual Machine
* Availability set
* Virtual machine scale set  

Don't use this scenario for adding IPs to an allow list. Use scenario 1 or 2 where you explicitly declare outbound behavior. [SNAT](#snat) ports are preallocated as described in the [Default SNAT ports allocation table](#snatporttable).



## <a name="preallocatedports"></a>Port allocation algorithm

Azure uses an algorithm to determine the number of preallocated [SNAT](#snat) ports available. The algorithm bases the number of ports on the size of the backend pool. 

For every public IP address associated with a load balancer, 64,000 ports are available as [SNAT](#snat) ports. The same number of [SNAT](#snat) ports are preallocated for UDP and TCP. The ports are consumed independently per IP protocol. 

The [SNAT](#snat) port usage is different depending on whether the flow is UDP or TCP. 

Ports are consumed dynamically up to the preallocated limit.  The ports are released when the flow closes or an idle timeout occurs.

For more information on idle timeouts, see [Troubleshoot outbound connections in Azure Load Balancer](../load-balancer/troubleshoot-outbound-connection.md#idletimeout) 

Ports are consumed only if it's necessary to make flows unique.

### <a name="snatporttable"></a> Dynamic SNAT ports preallocation

The following table shows the [SNAT](#snat) port preallocations for tiers of backend pool sizes:

| Pool size (VM instances) | Preallocated SNAT ports per IP configuration |
| --- | --- |
| 1-50 | 1,024 |
| 51-100 | 512 |
| 101-200 | 256 |
| 201-400 | 128 |
| 401-800 | 64 |
| 801-1,000 | 32 |

Changing the size of your backend pool might affect some of your established flows:

- Backend pool size increases trigger transitions into the next tier. Half of the preallocated [SNAT](#snat) ports are reclaimed during the transition to the next tier. 

- Flows associated with a reclaimed [SNAT](#snat) port timeout and close. These flows must be reestablished. If a new flow is attempted, the flow will succeed immediately as long as preallocated ports are available.

- If the backend pool size lowers and transitions into a lower tier, the number of available [SNAT](#snat) ports increases. The existing given [SNAT](#snat) ports and their respective flows aren't affected.

## <a name="outboundrules"></a>Outbound rules

 Outbound rules enable configuration of public [standard load balancer](load-balancer-standard-overview.md)'s outbound network address translation.  

> [!NOTE]
> **Azure Virtual Network NAT** can provide outbound connectivity for virtual machines in a virtual network.  See [What is Azure Virtual Network NAT?](../virtual-network/nat-overview.md) for more information.

You have full declarative control over outbound connectivity to scale and tune this ability to your needs.

![Load balancer outbound rules](media/load-balancer-outbound-rules-overview/load-balancer-outbound-rules.png)

With outbound rules, you can use load balancer to define outbound NAT from scratch. You can also scale and tune the behavior of existing outbound NAT.

Outbound rules allow you to control:

- Which virtual machines should be translated to which public IP addresses.
- How outbound [SNAT](#snat) ports should be given.
- Which protocols to provide outbound translation for.
- What duration to use for outbound connection idle timeout (4-120 minutes).
- Whether to send a TCP Reset on idle timeout
- Both TCP and UDP transport protocols with a single rule

### Outbound rule definition

Outbound rules follow the same familiar syntax as load balancing and inbound NAT rules: **frontend** + **parameters** + **backend pool**. 
An outbound rule configures outbound NAT for _all virtual machines identified by the backend pool_ to be translated to the _frontend_.  The _parameters_ provide additional fine grained control over the outbound NAT algorithm.

### <a name="scale"></a> Scale outbound NAT with multiple IP addresses

Each additional IP address provided by a frontend provides additional 64,000 ephemeral ports for load balancer to use as SNAT ports. 

Use multiple IP addresses to plan for large-scale scenarios. Use outbound rules to mitigate [SNAT exhaustion](troubleshoot-outbound-connection.md#snatexhaust). 

You can also use a [public IP prefix](https://aka.ms/lbpublicipprefix) directly with an outbound rule. 

A public IP prefix increases scaling of your deployment. The prefix can be added to the allow list of flows originating from your Azure resources. You can configure a frontend IP configuration within the load balancer to reference a public IP address prefix.  

The load balancer has control over the public IP prefix. The outbound rule will automatically use all public IP addresses contained within the public IP prefix for outbound connections. 

Each of the IP addresses within public IP prefix provides an additional 64,000 ephemeral ports per IP address for load balancer to use as SNAT ports.

### <a name="idletimeout"></a> Outbound flow idle timeout and TCP reset

Outbound rules provide a configuration parameter to control the outbound flow idle timeout and match it to the needs of your application. Outbound idle timeouts default to 4 minutes. For more information, see [configure idle timeouts](load-balancer-tcp-idle-timeout.md). 

The default behavior of load balancer is to drop the flow silently when the outbound idle timeout has been reached. The `enableTCPReset` parameter enables a predictable application behavior and control. The parameter dictates whether to send bidirectional TCP Reset (TCP RST) at the timeout of the outbound idle timeout. 

Review [TCP Reset on idle timeout](https://aka.ms/lbtcpreset) for details including region availability.

### <a name="preventoutbound"></a>Preventing outbound connectivity

Load-balancing rules provide automatic programming of outbound NAT. Some scenarios benefit or require you to disable the automatic programming of outbound NAT by the load-balancing rule. Disabling via the rule allows you to control or refine the behavior.  

You can use this parameter in two ways:

1. Prevention of the inbound IP address for outbound SNAT. Disable outbound SNAT in the load-balancing rule.
  
2. Tune the outbound [SNAT](#snat) parameters of an IP address used for inbound and outbound simultaneously. The automatic outbound NAT must be disabled to allow an outbound rule to take control. To change the SNAT port allocation of an address also used for inbound, the `disableOutboundSnat` parameter must be set to true. 

The operation to configure an outbound rule will fail if you attempt to redefine an IP address that is used for inbound.  Disable the outbound NAT of the load-balancing rule first.

>[!IMPORTANT]
> Your virtual machine will not have outbound connectivity if you set this parameter to true and do not have an outbound rule to define outbound connectivity.  Some operations of your VM or your application may depend on having outbound connectivity available. Make sure you understand the dependencies of your scenario and have considered impact of making this change.

Sometimes it's undesirable for a VM to create an outbound flow. There might be a requirement to manage which destinations receive outbound flows, or which destinations begin inbound flows. Use [network security groups](../virtual-network/security-overview.md) to manage the destinations that the VM reaches. Use NSGs to manage which public destinations start inbound flows.

When you apply an NSG to a load-balanced VM, pay attention to the [service tags](../virtual-network/security-overview.md#service-tags) and [default security rules](../virtual-network/security-overview.md#default-security-rules). Ensure that the VM can receive health probe requests from Azure Load Balancer.

If an NSG blocks health probe requests from the AZURE_LOADBALANCER default tag, your VM health probe fails and the VM is marked unavailable. Load Balancer stops sending new flows to that VM.

## Scenarios with outbound rules

### Outbound rules scenarios

* Configure outbound connections to a specific set of public IPs or prefix.
* Modify [SNAT](#snat) port allocation.
* Enable outbound only.
* Outbound NAT for VMs only (no inbound).
* Outbound NAT for internal standard load balancer.
* Enable both TCP & UDP protocols for outbound NAT with a public standard load balancer.

### <a name="scenario1out"></a>Configure outbound connections to a specific set of public IPs or prefix

#### Details

Use this scenario to tailor outbound connections to originate from a set of public IP addresses. Add public IPs or prefixes to an allow or deny list based on origination.

This public IP or prefix can be the same as used by a load-balancing rule. 

To use a different public IP or prefix than used by a load-balancing rule:  

1. Create public IP prefix or public IP address.
2. Create a public standard load balancer 
3. Create a frontend referencing the public IP prefix or public IP address you wish to use. 
4. Reuse a backend pool or create a backend pool and place the VMs into a backend pool of the public load balancer
5. Configure an outbound rule on the public load balancer to enable outbound NAT for the VMs using the frontend. If you don't wish for the load-balancing rule to be used for outbound, disable outbound SNAT on the load-balancing rule.

### <a name="scenario2out"></a>Modify [SNAT](#snat) port allocation

#### Details

You can use outbound rules to tune the [automatic SNAT port allocation based on backend pool size](load-balancer-outbound-connections.md#preallocatedports). 

If you experience SNAT exhaustion, increase the number of [SNAT](#snat) ports given from the default of 1024. 

Each public IP address contributes up to 64,000 ephemeral ports. The number of VMs in the backend pool determines the number of ports distributed to each VM. One VM in the backend pool has access to the maximum of 64,000 ports. For two VMs, a maximum of 32,000 [SNAT](#snat) ports can be given with an outbound rule (2x 32,000 = 64,000). 

You can use outbound rules to tune the SNAT ports given by default. You give more or less than the default [SNAT](#snat) port allocation provides. Each public IP address from a frontend of an outbound rule contributes up to 64,000 ephemeral ports for use as [SNAT](#snat) ports.  

Load balancer gives [SNAT](#snat) ports in multiples of 8. If you provide a value not divisible by 8, the configuration operation is rejected. 

If you attempt to give more [SNAT](#snat) ports than are available based on the number of public IP addresses, the configuration operation is rejected.

If you give 10,000 ports per VM and seven VMs in a backend pool share a single public IP, the configuration is rejected. Seven multiplied by 10,000 exceeds the 64,000 port limit. Add more public IP addresses to the frontend of the outbound rule to enable the scenario. 

Revert to the [default port allocation](load-balancer-outbound-connections.md#preallocatedports) by specifying 0 for the number of ports. The first 50 VM instances will get 1024 ports, 51-100 VM instances will get 512 up to the maximum instances.  For more information on default SNAT port allocation, see [SNAT ports allocation table](#snatporttable).

### <a name="scenario3out"></a>Enable outbound only

#### Details

Use a public standard load balancer to provide outbound NAT for a group of VMs. In this scenario, use an outbound rule by itself, without the need for any additional rules.

> [!NOTE]
> **Azure Virtual Network NAT** can provide outbound connectivity for virtual machines without the need for a load balancer.  See [What is Azure Virtual Network NAT?](../virtual-network/nat-overview.md) for more information.

### <a name="scenario4out"></a>Outbound NAT for VMs only (no inbound)

> [!NOTE]
> **Azure Virtual Network NAT** can provide outbound connectivity for virtual machines without the need for a load balancer.  See [What is Azure Virtual Network NAT?](../virtual-network/nat-overview.md) for more information.

#### Details

For this scenario:

1. Create a public IP or prefix.
2. Create a public standard load balancer. 
3. Create a frontend associated with the public IP or prefix dedicated for outbound.
4. Create a backend pool for the VMs.
5. Place the VMs into the backend pool.
6. Configure an outbound rule to enable outbound NAT.

Use a prefix or public IP to scale [SNAT](#snat) ports. Add the source of outbound connections to an allow or deny list.

### <a name="scenario5out"></a>Outbound NAT for internal standard load balancer

> [!NOTE]
> **Azure Virtual Network NAT** can provide outbound connectivity for virtual machines utilizing an internal standard load balancer.  See [What is Azure Virtual Network NAT?](../virtual-network/nat-overview.md) for more information.

#### Details

Outbound connectivity isn't available for an internal standard load balancer until it has been explicitly declared. 

For more information, see [Outbound-only load balancer configuration](https://docs.microsoft.com/azure/load-balancer/egress-only).


### <a name="scenario6out"></a>Enable both TCP & UDP protocols for outbound NAT with a public standard load balancer

#### Details

When using a public standard load balancer, the automatic outbound NAT provided matches the transport protocol of the load-balancing rule. 

1. Disable outbound [SNAT](#snat) on the load-balancing rule. 
2. Configure an outbound rule on the same load balancer.
3. Reuse the backend pool already used by your VMs. 
4. Specify "protocol": "All" as part of the outbound rule. 

When only inbound NAT rules are used, no outbound NAT is provided. 

1. Place VMs in a backend pool.
2. Define one or more frontend IP configurations with public IP address(es) or public IP prefix 
3. Configure an outbound rule on the same load balancer. 
4. Specify "protocol": "All" as part of the outbound rule

## <a name="terms"></a> Terminology

### <a name="snat"></a>Source network address translation

| Applicable protocol(s) |
|------------------------|
| TCP </br> UDP          |

#### Details

A deployment in Azure can communicate with endpoints outside Azure in the public IP address space.

When an instance starts outbound traffic to a destination with a public ip address, Azure dynamically maps the private IP address of the resource to a public IP address. 

After this mapping is created, return traffic for this outbound originated flow reaches the private IP address where the flow originated. 

Azure uses **source network address translation (SNAT)** to do this function.

### <a name="pat"></a>Port masquerading SNAT (PAT)

| Applicable protocol(s) |
|------------------------|
| TCP </br> UDP          |

#### Details

When private IPs are behind a single public IP address, Azure uses **port address translation (PAT)** to hide the private IP addresses. 

Ephemeral ports are used for PAT and are [preallocated](#preallocatedports) based on pool size. 

When a public load balancer is associated with VMs without public IPs, each outbound connection source is rewritten. 

The source is rewritten from the virtual network private IP address to the frontend public IP address of the load balancer. 

In the public IP address space, the five-tuple of the flow must be unique:

* Source IP address
* Source port
* IP transport protocol
* Destination IP address
* Destination port 

Port masquerading SNAT can be used with either TCP or UDP protocols. SNAT ports are used after rewriting the private source IP address because multiple flows originate from a single public IP address. The port masquerading SNAT algorithm gives SNAT ports differently for UDP versus TCP.

### SNAT ports (TCP)

| Applicable protocol(s) |
|------------------------|
| TCP |

#### Details

SNAT ports are ephemeral ports available for a public IP source address. One SNAT port is consumed per flow to a single destination IP address and port. 

For multiple TCP flows to the same destination IP address, port, and protocol, each TCP flow consumes a single SNAT port. 

This consumption ensures that the flows are unique when they originate from the same public IP address and travel to the:

* Same destination IP address
* Port
* Protocol 

Multiple flows share a single SNAT port. 

The destination IP address, port, and protocol make flows unique without the need for additional source ports to distinguish flows in the public IP address space.


### SNAT ports (UDP)

| Applicable protocol(s) |
|------------------------|
| UDP |

#### Details

UDP SNAT ports are managed by a different algorithm than TCP SNAT ports.  Load balancer uses an algorithm named port-restricted cone NAT for UDP.

One SNAT port is consumed for whatever destination IP address and port for each flow.


### <a name="exhaustion"></a>Exhaustion

| Applicable protocol(s) |
|------------------------|
| N/A |

#### Details

When SNAT port resources are exhausted, outbound flows fail until existing flows release SNAT ports. Load balancer reclaims SNAT ports when the flow closes.

A [idle timeout](../load-balancer/troubleshoot-outbound-connection.md#idletimeout) of four minutes is used by the load balancer to reclaim SNAT ports.

UDP SNAT ports generally exhaust much faster than TCP SNAT ports because of the difference in algorithm used. Design and scale test because of this difference.

### SNAT port release behavior (TCP)

| Applicable protocol(s) |
|------------------------|
| TCP |

#### Details

When either a server or client sends a FINACK, a SNAT port will be released after 240 seconds. In the event an RST is seen, a SNAT port will be released after 15 seconds. If the idle timeout has been reached, the port is released.

### SNAT port release behavior (UDP)

| Applicable protocol(s) |
|------------------------|
| TCP |

#### Details

If idle timeout has been reached, the port is released.

### SNAT port reuse

| Applicable protocol(s) |
|------------------------|
| TCP </br> UDP |

#### Details

Once a port has been released, the port is available for reuse. SNAT ports are a sequence from lowest to highest available for a given scenario, and the first available SNAT port is used for new connections.

## Limitations

- The maximum number of usable ephemeral ports per frontend IP address is 64,000.
- The range of the configurable outbound idle timeout is 4 to 120 minutes (240 to 7200 seconds).
- Load balancer doesn't support ICMP for outbound NAT.
- Outbound rules can only be applied to primary IP configuration of a NIC.  You can't create an outbound rule for the secondary IP of a VM or NVA. Multiple NICs are supported.
- Web Worker Roles without a virtual network and other Microsoft platform services can be accessible when an internal standard load balancer is used. This accessibility is because of a side effect of how pre-VNet services and other platform services operate. Don't rely on this side effect as the respective service itself or the underlying platform may change without notice. Always assume you need to create outbound connectivity explicitly if wanted when using an internal standard load balancer only. Scenario 3 described in this article isn't available.

## Next steps

If you're experiencing issues with outbound connectivity through an Azure Load Balancer, see the [troubleshooting guide for outbound connections](../load-balancer/troubleshoot-outbound-connection.md).

- Learn more about [standard load balancer](load-balancer-standard-overview.md).
- See our [frequently asked questions about Azure Load Balancer](load-balancer-faqs.md).
- Learn more about [outbound rules](load-balancer-outbound-rules-overview.md) for standard public load balancer.

