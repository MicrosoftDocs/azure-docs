---
title: Gateway load balancer (Preview)
titleSuffix: Azure Load Balancer
description: Overview of gateway load balancer SKU for Azure Load Balancer.
ms.service: load-balancer
author: asudbring
ms.author: allensu
ms.date: 10/4/2021
ms.topic: conceptual
---

# Gateway load balancer (Preview)

Azure load balancer consists of standard, basic, and gateway SKUs. Gateway load balancer is a SKU catered specifically for high performance and high availability scenarios with Network Virtual Appliances (NVAs). With the capabilities of gateway load balancer, you can easily deploy, scale, and manage NVAs. Chaining a gateway load balancer to your standard load balancer or public IP, is a simple procedure. In scenarios with NVAs, it's important that flows are "sticky". This "stickiness" ensures the sessions are maintained.

## Benefits

Gateway load balancer has the following benefits:

* Integrate virtual appliances into the network path with ease. 

* Easily add or remove network virtual appliances in the network path. 

* Scale with ease while managing costs.

* Improve network virtual appliance availability.

## Technology and components

Gateway load balancer uses the VXLAN protocol and supports a maximum transmission unit of size XXXX bytes.

Gateway load balancer consists of the following components:

* Frontend IP configuration

* Load-balancing rules

* Backend pool(s)

* Tunnel interfaces

## Limitations

* Gateway load balancer doesn't work with the cross-region load balancer tier.

## Next steps

- See [Create a gateway load balancer using the Azure portal](tutorial-gateway-portal.md) to create a cross-region load balancer.
- Learn more about [Azure Load Balancer](load-balancer-overview.md).
