---
title: Azure Load Balancer algorithm
description: Discover the concepts behind the Azure Load Balancer algorithm, including its five-tuple algorithm, session affinity modes, and traffic distribution strategies.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: concept-article
ms.date: 07/17/2026
ms.author: mbender
ms.reviewer: mbender
# Customer intent: As a cloud architect, I want to understand the load balancing algorithm used by Azure Load Balancer so that I can effectively distribute traffic and ensure high availability for my applications.
---

# Azure Load Balancer algorithm

Azure Load Balancer is Azure's most performant Load Balancer all while keeping latency ultra-low. To learn more about Azure Load Balancer, visit [Azure Load Balancer overview](load-balancer-overview.md) or Azure Load balancer [components](components.md).

Azure Load Balancer uses a tuple-based hashing as the load-balancing algorithm.

## Load balancing algorithm

By creating a load-balancing rule, you can distribute inbound traffic flows from a load balancer's frontend to its backend pools. When the load balancer's health probe indicates a healthy backend endpoint, backend instances are available to receive new traffic flows.

### Five-tuple flow distribution

By default, Azure Load Balancer uses a five-tuple hash to distribute inbound flows, rather than individual bytes. The five fields are:

- Source IP address
- Source port
- Destination IP address
- Destination port
- IP protocol

For other distribution modes and more details about the algorithm, see [hash-based distribution](distribution-mode-concepts.md#hash-based).

You can also use session affinity [distribution mode](distribution-mode-concepts.md) which uses two-tuple or three-tuple based load balancing.

### Layer 4 and TLS behavior

Azure Load Balancer operates at Layer 4 and supports TCP and UDP applications. It doesn't close or originate flows, inspect application payloads, rewrite HTTP or HTTPS headers, provide application-layer gateway functionality, or offload TLS. It rewrites TCP and UDP flow headers when directing traffic to backend instances, while protocol and TLS handshakes occur directly between the client and the selected backend instance. Ending TLS on the backend VMs lets TLS session capacity scale with the type and number of VMs in the backend pool.

### Source IP address preservation

A backend VM generates a response to an inbound flow, and the original source IP address is preserved when the flow reaches that VM. For example, a TCP handshake occurs between the client and the selected backend VM. Successfully validating connectivity to a frontend therefore validates connectivity to at least one backend VM.


## Next steps

- Learn more about [Azure Load Balancer](load-balancer-overview.md).
- Learn about the [components](components.md) that make up Azure Load Balancer.
- Learn about [Health Probes](load-balancer-custom-probe-overview.md).
- Learn about Azure Load Balancer's traffic [distribution modes](distribution-mode-concepts.md)
- See [Create a public Standard Load Balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a Load Balancer: create one, create VMs with a custom IIS extension installed, and load balance the web app between the VMs.
- Learn about [Azure Load Balancer outbound connections](load-balancer-outbound-connections.md).
