---
title: Outbound rules Azure Load Balancer
description: This article explains how to configure outbound rules to control egress of internet traffic with Azure Load Balancer.
services: load-balancer
author: asudbring
ms.service: load-balancer
ms.topic: conceptual
ms.custom: contperfq1
ms.date: 10/13/2020
ms.author: allensu
---

# <a name="outboundrules"></a>Outbound rules Azure Load Balancer

Outbound rules allow you to configure public standard load balancer outbound SNAT (source network address translation). This configuration allows you to use the public IP(s) of your load balancer as a proxy.

This configuration enables:

* IP masquerading
* Simplifying your allow lists.
* Reduces the number of public IP resources for deployment.

With outbound rules, you have full declarative control over outbound internet connectivity. Outbound rules allow you to scale and tune this ability to your specific needs. 

Outbound rules will only be followed if the backend VM doesn't have an instance-level public IP address (ILPIP).

![Load Balancer outbound rules](media/load-balancer-outbound-rules-overview/load-balancer-outbound-rules.png)

With outbound rules, you can explicitly define outbound **SNAT** behavior.

Outbound rules allow you to control:

* **Which virtual machines are translated to which public IP addresses.**
     * Two rules were backend pool A uses IP address A and B, backend pool B uses IP address C and D.
* **How outbound SNAT ports are given.**
     * Backend pool B is the only pool making outbound connections, give all SNAT ports to backend pool B and none to backend pool A.
* **Which protocols to provide outbound translation for.**
     * Backend pool B needs UDP ports for outbound. Backend pool A needs TCP. Give TCP ports to A and UDP ports to B.
* **What duration to use for outbound connection idle timeout (4-120 minutes).**
     * If there are long running connections with keepalives, reserve idle ports for long running connections for up to 120 minutes. Assume stale connections are abandoned and release ports in 4 minutes for fresh connections 
* **Whether to send a TCP Reset on idle timeout.**
     * when timing out idle connections, do we send a TCP RST to the client and server so they know the flow is abandoned?

## Outbound rule definition

Outbound rules follow the same familiar syntax as load balancing and inbound NAT rules: **frontend** + **parameters** + **backend pool**. 

An outbound rule configures outbound NAT for _all virtual machines identified by the backend pool_ to be translated to the _frontend_.  

The _parameters_ provide additional fine grained control over the outbound NAT algorithm.

## <a name="scale"></a> Scale outbound NAT with multiple IP addresses

Each additional IP address provided by a frontend provides additional 64,000 ephemeral ports for load balancer to use as SNAT ports. 

Use multiple IP addresses to plan for large-scale scenarios. Use outbound rules to mitigate [SNAT exhaustion](troubleshoot-outbound-connection.md#snatexhaust). 

You can also use a [public IP prefix](https://aka.ms/lbpublicipprefix) directly with an outbound rule. 

A public IP prefix increases scaling of your deployment. The prefix can be added to the allow list of flows originating from your Azure resources. You can configure a frontend IP configuration within the load balancer to reference a public IP address prefix.  

The load balancer has control over the public IP prefix. The outbound rule will automatically use all public IP addresses contained within the public IP prefix for outbound connections. 

Each of the IP addresses within public IP prefix provides an additional 64,000 ephemeral ports per IP address for load balancer to use as SNAT ports.

## <a name="idletimeout"></a> Outbound flow idle timeout and TCP reset

Outbound rules provide a configuration parameter to control the outbound flow idle timeout and match it to the needs of your application. Outbound idle timeouts default to 4 minutes. For more information, see [configure idle timeouts](load-balancer-tcp-idle-timeout.md). 

The default behavior of load balancer is to drop the flow silently when the outbound idle timeout has been reached. The `enableTCPReset` parameter enables a predictable application behavior and control. The parameter dictates whether to send bidirectional TCP Reset (TCP RST) at the timeout of the outbound idle timeout. 

Review [TCP Reset on idle timeout](https://aka.ms/lbtcpreset) for details including region availability.

## <a name="preventoutbound"></a>Securing and controlling outbound connectivity explicitly

Load-balancing rules provide automatic programming of outbound NAT. Some scenarios benefit or require you to disable the automatic programming of outbound NAT by the load-balancing rule. Disabling via the rule allows you to control or refine the behavior.  

You can use this parameter in two ways:

1. Prevention of the inbound IP address for outbound SNAT. Disable outbound SNAT in the load-balancing rule.
  
2. Tune the outbound **SNAT** parameters of an IP address used for inbound and outbound simultaneously. The automatic outbound NAT must be disabled to allow an outbound rule to take control. To change the SNAT port allocation of an address also used for inbound, the `disableOutboundSnat` parameter must be set to true. 

The operation to configure an outbound rule will fail if you attempt to redefine an IP address that is used for inbound.  Disable the outbound NAT of the load-balancing rule first.

>[!IMPORTANT]
> Your virtual machine will not have outbound connectivity if you set this parameter to true and do not have an outbound rule to define outbound connectivity.  Some operations of your VM or your application may depend on having outbound connectivity available. Make sure you understand the dependencies of your scenario and have considered impact of making this change.

Sometimes it's undesirable for a VM to create an outbound flow. There might be a requirement to manage which destinations receive outbound flows, or which destinations begin inbound flows. Use [network security groups](../virtual-network/security-overview.md) to manage the destinations that the VM reaches. Use NSGs to manage which public destinations start inbound flows.

When you apply an NSG to a load-balanced VM, pay attention to the [service tags](../virtual-network/security-overview.md#service-tags) and [default security rules](../virtual-network/security-overview.md#default-security-rules). 

Ensure that the VM can receive health probe requests from Azure Load Balancer.

If an NSG blocks health probe requests from the AZURE_LOADBALANCER default tag, your VM health probe fails and the VM is marked unavailable. The load balancer stops sending new flows to that VM.

## Limitations

- The maximum number of usable ephemeral ports per frontend IP address is 64,000.
- The range of the configurable outbound idle timeout is 4 to 120 minutes (240 to 7200 seconds).
- Load balancer doesn't support ICMP for outbound NAT.
- Outbound rules can only be applied to primary IP configuration of a NIC.  You can't create an outbound rule for the secondary IP of a VM or NVA. Multiple NICs are supported.
- All virtual machines within an **availability set** must be added to the backend pool for outbound connectivity. 
- All virtual machines within a **virtual machine scale set** must be added to the backend pool for outbound connectivity.

## Next steps

- Learn more about [Azure Standard Load Balancer](load-balancer-overview.md)
- See our [frequently asked questions about Azure Load Balancer](load-balancer-faqs.md)

