---
title: Multiple frontends
titleSuffix: Azure Load Balancer
description: Learn when and why to use multiple frontends on Azure Load Balancer, how frontend-to-backend mapping works, and key design considerations.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: concept-article
ms.date: 05/04/2026
ms.author: mbender
# Customer intent: As a cloud architect, I want to understand when and how to use multiple frontends on Azure Load Balancer so I can design scalable, multi-service load balancing topologies.
---

# Multiple frontends for Azure Load Balancer

Azure Load Balancer supports multiple frontend IP configurations on a single resource. Each frontend provides an independent entry point for inbound traffic, so you can expose multiple services, domains, or protocols through one load balancer.

This article explains when multiple frontends are useful, how traffic flows from frontends through rules to backend pools, and what to consider when designing a multi-frontend topology.

> [!TIP]
> If you only need a single frontend, start with the [public load balancer quickstart](./quickstart-load-balancer-standard-public-portal.md) or [internal load balancer quickstart](./quickstart-load-balancer-standard-internal-portal.md). You can add frontends later without recreating the resource.

## When to use multiple frontends

Use multiple frontends when you need to:

- **Host multiple websites or services** — Assign a dedicated public IP to each service (for example, `app1.contoso.com` and `app2.contoso.com`) while sharing a single backend pool.
- **Separate protocols on different IPs** — Expose HTTP on one frontend IP and TCP/UDP on another to simplify network security group rules and monitoring.
- **Scale beyond single-IP inbound NAT port limits** — A single IP supports up to 65,535 ports per protocol. In large-scale deployments that use inbound NAT rules to map a unique port to each backend instance (for example, per-VM SSH or RDP access), a second frontend IP provides an additional full port range.

> [!NOTE]
> Each load balancer supports a maximum number of frontend configurations. See [Load Balancer service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#load-balancer) for current limits. Each public frontend IP also incurs a charge. See [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses/) for details.

## How multiple frontends work

A frontend IP configuration is the entry point for traffic into the load balancer. Each frontend is referenced by one or more rules that determine how traffic is handled:

| Rule type | Relationship to frontend |
|-----------|--------------------------|
| **Load balancing rule** | Distributes inbound traffic arriving on a frontend IP:port across all healthy instances in a backend pool. |
| **Inbound NAT rule** | Maps a specific frontend IP:port to a single backend instance:port, enabling direct access to individual VMs. |
| **Outbound rule** | Designates which frontend IP(s) provide SNAT ports for outbound connections initiated by backend instances. |

Multiple rules of any type can reference the same frontend, and multiple frontends can target the same backend pool. When multiple rules share a backend pool, those rules can share a single health probe as long as they target the same backend port and protocol.

### Same backend port versus different backend port

When multiple load balancing rules from different frontends target the same backend pool, you can route to:

- **Different backend ports** — Each rule specifies a unique backend port. No extra configuration is needed.
- **The same backend port** — You must enable Floating IP on each rule.

Without Floating IP, the load balancer translates the destination address to the backend VM's private IP. When two frontends both route to the same backend port, the VM receives traffic on the same IP:port regardless of which frontend it arrived on. The VM has no way to distinguish between the two flows or respond on the correct frontend IP.

Enabling Floating IP changes this behavior because the load balancer delivers packets with the original frontend IP preserved as the destination address. When you use Floating IP, you must configure the targeted backend VMs with a loopback interface or secondary IP that matches each frontend IP so the VMs can accept and respond to traffic correctly. For more information, see [Floating IP configuration](load-balancer-floating-ip.md).

## Next steps

- Learn how to [manage rules for Azure Load Balancer](manage-rules-how-to.md), including adding and removing frontend IP configurations.
- Learn about [Floating IP configuration](load-balancer-floating-ip.md) for same-port scenarios.
- Learn about [Azure Load Balancer outbound connections](load-balancer-outbound-connections.md).