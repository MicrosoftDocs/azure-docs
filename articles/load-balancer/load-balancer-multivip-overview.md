---
title: Multiple frontends 
titleSuffix: Azure Load Balancer
description: This article describes the fundamentals of load balancing across multiple IP addresses using the same port and protocol using multiple frontends on Azure Load Balancer.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 09/19/2022
ms.author: mbender
ms.custom: template-concept, seodec18
---

# Multiple frontends for Azure Load Balancer

Azure Load Balancer allows you to load balance services on multiple ports, multiple IP addresses, or both. You can use a public or internal load balancer to load balance traffic across a set of services like virtual machine scale sets or virtual machines (VMs).

This article describes the fundamentals of  load balancing across multiple IP addresses using the same port and protocol. If you only intend to expose services on one IP address, you can find simplified instructions for [public](./quickstart-load-balancer-standard-public-portal.md) or [internal](./quickstart-load-balancer-standard-internal-portal.md) load balancer configurations. Adding multiple frontends is incremental to a single frontend configuration. Using the concepts in this article, you can expand a simplified configuration at any time.

When you define an Azure Load Balancer, a frontend and a backend pool configuration are connected with a load balancing rule. The health probe referenced by the load balancing rule is used to determine the health of a VM on a certain port and protocol. Based on the health probe results, new flows are sent to VMs in the backend pool. The frontend is defined using a three-tuple comprised of an IP address (public or internal), a transport protocol (UDP or TCP), and a port number from the load balancing rule. The backend pool is a collection of Virtual Machine IP configurations (part of the NIC resource) which reference the Load Balancer backend pool. 

The following table contains some example frontend configurations:

| Frontend | IP address | protocol | port |
| --- | --- | --- | --- |
| 1 |65.52.0.1 |TCP |80 |
| 2 |65.52.0.1 |TCP |*8080* |
| 3 |65.52.0.1 |*UDP* |80 |
| 4 |*65.52.0.2* |TCP |80 |

The table shows four different frontend configurations. Frontends #1, #2 and #3 use the  same IP address but the port or protocol is different for each frontend. Frontends #1 and #4 are an example of multiple frontends, where the same frontend protocol and port are reused across multiple frontend IPs. 

Azure Load Balancer provides flexibility in defining the load balancing rules. A load balancing rule declares how an address and port on the frontend is mapped to the destination address and port on the backend. Whether or not backend ports are reused across rules depends on the type of the rule. Each type of rule has specific requirements that can affect host configuration and probe design. There are two types of rules: 

1. The default rule with no backend port reuse.
2. The Floating IP rule where backend ports are reused.

Azure Load Balancer allows you to mix both rule types on the same load balancer configuration. The load balancer can use them simultaneously for a given VM, or any combination, if you abide by the constraints of the rule. The rule type you choose depends on the requirements of your application and the complexity of supporting that configuration. You should evaluate which rule types are best for your scenario. We explore these scenarios further by starting with the default behavior.

## Rule type #1: No backend port reuse
:::image type="content" source="media/load-balancer-multivip-overview/load-balancer-multivip.png" alt-text="Diagram of Load Balancer traffic with no backend port reuse.":::

In this scenario, the frontends are configured as follows:

| Frontend | IP address | protocol | port |
| --- | --- | --- | --- |
| ![green frontend](./media/load-balancer-multivip-overview/load-balancer-rule-green.png) 1 |65.52.0.1 |TCP |80 |
| ![purple frontend](./media/load-balancer-multivip-overview/load-balancer-rule-purple.png) 2 |*65.52.0.2* |TCP |80 |

The backend instance IP (BIP) is the IP address of the backend service in the backend pool, each VM exposes the desired service on a unique port on the backend instance IP. This service is associated with the frontend IP (FIP) through a rule definition. 

We define two rules:

| Rule | Map frontend | To backend pool |
| --- | --- | --- |
| 1 |![green frontend](./media/load-balancer-multivip-overview/load-balancer-rule-green.png) FIP1:80 |![green backend](./media/load-balancer-multivip-overview/load-balancer-rule-green.png) BIP1:80, ![green backend](./media/load-balancer-multivip-overview/load-balancer-rule-green.png) BIP2:80 |
| 2 |![VIP](./media/load-balancer-multivip-overview/load-balancer-rule-purple.png) FIP2:80 |![purple backend](./media/load-balancer-multivip-overview/load-balancer-rule-purple.png) BIP1:81, ![purple backend](./media/load-balancer-multivip-overview/load-balancer-rule-purple.png) BIP2:81 |

The complete mapping in Azure Load Balancer is now as follows:

| Rule | Frontend IP address | protocol | port | Destination | port |
| --- | --- | --- | --- | --- | --- |
| ![green rule](./media/load-balancer-multivip-overview/load-balancer-rule-green.png) 1 |65.52.0.1 |TCP |80 |BIP IP Address |80 |
| ![purple rule](./media/load-balancer-multivip-overview/load-balancer-rule-purple.png) 2 |65.52.0.2 |TCP |80 |BIP IP Address |81 |

Each rule must produce a flow with a unique combination of destination IP address and destination port. Multiple load balancing rules can deliver flows to the same backend instance IP on different ports by varying the destination port of the flow.

Health probes are always directed to the backend instance IP of a VM. You must ensure that your probe reflects the health of the VM. 

## Rule type #2: backend port reuse by using Floating IP

Azure Load Balancer provides the flexibility to reuse the frontend port across multiple frontends configurations. Additionally, some application scenarios prefer or require the same port to be used by multiple application instances on a single VM in the backend pool. Common examples of port reuse include clustering for high availability, network virtual appliances, and exposing multiple TLS endpoints without re-encryption. 

If you want to reuse the backend port across multiple rules, you must enable Floating IP in the load balancing rule definition. 

*Floating IP* is Azure's terminology for a portion of what is known as Direct Server Return (DSR). DSR consists of two parts: a flow topology and an IP address mapping scheme. At a platform level, Azure Load Balancer always operates in a DSR flow topology regardless of whether Floating IP is enabled or not. This means that the outbound part of a flow is always correctly rewritten to flow directly back to the origin. 

With the default rule type, Azure exposes a traditional load balancing IP address mapping scheme for ease of use. Enabling Floating IP changes the IP address mapping scheme to allow for more flexibility. 

:::image type="content" source="media/load-balancer-multivip-overview/load-balancer-multivip-dsr.png" alt-text="Diagram of load balancer traffic for multiple frontend IPs with floating IP.":::

For this scenario, every VM in the backend pool has three network interfaces:

* Backend IP: a Virtual NIC associated with the VM (IP configuration of Azure's NIC resource).
* Frontend 1 (FIP1): a loopback interface within guest OS that is configured with IP address of FIP1.
* Frontend 2 (FIP2): a loopback interface within guest OS that is configured with IP address of FIP2.

Let's assume the same frontend configuration as in the previous scenario:

| Frontend | IP address | protocol | port |
| --- | --- | --- | --- |
| ![green frontend](./media/load-balancer-multivip-overview/load-balancer-rule-green.png) 1 |65.52.0.1 |TCP |80 |
| ![purple frontend](./media/load-balancer-multivip-overview/load-balancer-rule-purple.png) 2 |*65.52.0.2* |TCP |80 |

We define two floating IP rules:

| Rule | Frontend | Map to backend pool |
| --- | --- | --- |
| 1 |![green rule](./media/load-balancer-multivip-overview/load-balancer-rule-green.png) FIP1:80 |![green backend](./media/load-balancer-multivip-overview/load-balancer-rule-green.png) FIP1:80 (in VM1 and VM2) |
| 2 |![purple rule](./media/load-balancer-multivip-overview/load-balancer-rule-purple.png) FIP2:80 |![purple backend](./media/load-balancer-multivip-overview/load-balancer-rule-purple.png) FIP2:80 (in VM1 and VM2) |

The following table shows the complete mapping in the load balancer:

| Rule | Frontend IP address | protocol | port | Destination | port |
| --- | --- | --- | --- | --- | --- |
| ![green rule](./media/load-balancer-multivip-overview/load-balancer-rule-green.png) 1 |65.52.0.1 |TCP |80 |same as frontend (65.52.0.1) |same as frontend (80) |
| ![purple rule](./media/load-balancer-multivip-overview/load-balancer-rule-purple.png) 2 |65.52.0.2 |TCP |80 |same as frontend (65.52.0.2) |same as frontend (80) |

The destination of the inbound flow is now the frontend IP address on the loopback interface in the VM. Each rule must produce a flow with a unique combination of destination IP address and destination port. Port reuse is possible on the same VM by varying the destination IP address to the frontend IP address of the flow. Your service is exposed to the load balancer by binding it to the frontend’s IP address and port of the respective loopback interface. 

You'll notice the destination port doesn't change in the example. In floating IP scenarios, Azure Load Balancer also supports defining a load balancing rule to change the backend destination port and to make it different from the frontend destination port.

The Floating IP rule type is the foundation of several load balancer configuration patterns. One example that is currently available is the [Configure one or more Always On availability group listeners](/azure/azure-sql/virtual-machines/windows/availability-group-listener-powershell-configure) configuration. Over time, we'll document more of these scenarios.

> [!NOTE]
> For more detailed information on the specific Guest OS configurations required to enable Floating IP, please refer to [Azure Load Balancer Floating IP configuration](load-balancer-floating-ip.md).

## Limitations

* Multiple frontend configurations are only supported with IaaS VMs and virtual machine scale sets.
* With the Floating IP rule, your application must use the primary IP configuration for outbound SNAT flows. If your application binds to the frontend IP address configured on the loopback interface in the guest OS, Azure's outbound SNAT won't rewrite the outbound flow, and the flow fails.  Review [outbound scenarios](load-balancer-outbound-connections.md).
* Floating IP isn't currently supported on secondary IP configurations.
* Public IP addresses have an effect on billing. For more information, see [IP Address pricing](https://azure.microsoft.com/pricing/details/ip-addresses/)
* Subscription limits apply. For more information, see [Service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits) for details.

## Next steps

- Review [Outbound connections](load-balancer-outbound-connections.md) to understand the effect of multiple frontends on outbound connection behavior.