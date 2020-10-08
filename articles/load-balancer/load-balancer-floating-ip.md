---
title: Azure Load Balancer Floating IP configuration
description: Overview of Azure Load Balancer Floating IP
services: load-balancer
documentationcenter: na
author: asudbring
ms.service: load-balancer
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/13/2020
ms.author: allensu

---

# Azure Load Balancer Floating IP configuration

Load balancer provides several capabilities for both UDP and TCP applications.

## Floating IP

Some application scenarios prefer or require the same port to be used by multiple application instances on a single VM in the backend pool. Common examples of port reuse include clustering for high availability, network virtual appliances, and exposing multiple TLS endpoints without re-encryption. If you want to reuse the backend port across multiple rules, you must enable Floating IP in the rule definition.

**Floating IP** is Azure's terminology for a portion of what is known as Direct Server Return (DSR). DSR consists of two parts:

- Flow topology
- An IP address mapping scheme

At a platform level, Azure Load Balancer always operates in a DSR flow topology regardless of whether Floating IP is enabled or not. This means that the outbound part of a flow is always correctly rewritten to flow directly back to the origin.
Without Floating IP, Azure exposes a traditional load balancing IP address mapping scheme for ease of use (the VM instances' IP). Enabling Floating IP changes the IP address mapping to the Frontend IP of the load Balancer to allow for additional flexibility. Learn more [here](load-balancer-multivip-overview.md).

## <a name = "limitations"></a>Limitations

- Floating IP is not currently supported on secondary IP configurations for Load Balancing scenarios

## Next steps

- See [Create a public Standard Load Balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a Load Balancer.
- Learn about [Azure Load Balancer outbound connections](load-balancer-outbound-connections.md).
- Learn more about [Azure Load Balancer](load-balancer-overview.md).
- Learn about [Health Probes](load-balancer-custom-probe-overview.md).
- Learn about [Standard Load Balancer Diagnostics](load-balancer-standard-diagnostics.md).
- Learn more about [Network Security Groups](../virtual-network/security-overview.md).
