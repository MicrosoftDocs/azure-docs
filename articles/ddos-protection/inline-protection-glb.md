---
title: Inline L7 DDoS Protection with Gateway Load Balancer and partner NVAs
description: Learn how to create and enable inline L7 DDoS Protection with Gateway Load Balancer and Partner NVAs
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: how-to
ms.workload: infrastructure-services
ms.author: abell
ms.date: 10/12/2022
ms.custom: ignite-fall-2021, ignite-2022
---

# Inline L7 DDoS Protection with Gateway Load Balancer and Partner NVAs

Azure DDoS Protection is always-on but not inline and takes 30-60 seconds from the time an attack is detected until it's mitigated. Azure DDoS Protection also works at L3/4 (network layer) and doesn't inspect the packet payload that is, application layer (L7).  

Workloads that are highly sensitive to latency and can't tolerate 30-60 seconds of on-ramp time for DDoS protection to kick in requires inline protection. Inline protection entails that all the traffic always goes through the DDoS protection pipeline. Further, for scenarios such as web protection or gaming workload protection (UDP) it becomes crucial to inspect the packet payload to mitigate against extreme low volume attacks, which exploit the vulnerability in the application layer (L7). 

Partner NVAs deployed with Gateway Load Balancer and integrated with Azure DDoS Protection offers comprehensive inline L7 DDoS Protection for high performance and high availability scenarios. Inline L7 DDoS Protection combined with Azure DDoS Protection provides comprehensive L3-L7 protection against volumetric and low-volume DDoS attacks. 

## What is a Gateway Load Balancer?
Gateway Load Balancer is a SKU of Azure Load Balancer catered specifically for high performance and high availability scenarios with third-party Network Virtual Appliances (NVAs).

With the capabilities of Gateway LB, you can deploy, scale, and manage NVAs with ease – chaining a Gateway LB to your public endpoint merely requires one select.  You can insert appliances for various scenarios such as firewalls, advanced packet analytics, intrusion detection and prevention systems, or custom scenarios that suit your needs into the network path with Gateway LB. In scenarios with NVAs, it's especially important that flows are ‘symmetrical’ – this ensures sessions are maintained and symmetrical. Gateway LB maintains flow symmetry to a specific instance in the backend pool.

For more information on Gateway Load Balancer, see the [Gateway load balancer](../load-balancer/gateway-overview.md) product and documentation. 

## Inline DDoS protection with Gateway Load Balancer and Partner NVAs

DDoS attacks on high latency sensitive workloads (e.g., gaming) can cause outage ranging from 2-10 seconds resulting in availability disruption. Gateway Load Balancer enables protection of such workloads by ensuring the relevant NVAs are injected into the ingress path of the internet traffic. Once chained to a Standard Public Load Balancer frontend or IP configuration on a virtual machine, no additional configuration is needed to ensure traffic to, and from the application endpoint is sent to the Gateway LB. 

Inbound traffic is always inspected via the NVAs in the path and the clean traffic is returned to the backend infrastructure (gamer servers). 

Traffic flows from the consumer virtual network to the provider virtual network and then returns to the consumer virtual network. The consumer virtual network and provider virtual network can be in different subscriptions, tenants, or regions enabling greater flexibility and ease of management.

:::image type="content" source="./media/ddos-glb.png" alt-text="Diagram of DDoS inline protection via gateway load balancer." lightbox="./media/ddos-glb.png":::
 
Enabling Azure DDoS Protection on the VNet of the Standard Public Load Balancer frontend or VNet of the virtual machine will offer protection from L3/4 DDoS attacks. 
1.	Unfiltered game traffic from the internet is directed to the public IP of the game servers Load Balancer. 
1.	Unfiltered game traffic is redirected to the chained Gateway Load Balancer private IP. 
1.	The unfiltered game traffic is inspected for DDoS attacks in real time via the partner NVAs. 
1.	Filtered game traffic is sent back to the game servers for final processing.
1.	Azure DDoS Protection on the gamer servers Load Balancer protects from L3/4 DDoS attacks and the DDoS protection policies are automatically tuned for game servers traffic profile and application scale. 

## Next steps
- Learn more about our launch partner [A10 Networks](https://www.a10networks.com/blog/introducing-l3-7-ddos-protection-for-microsoft-azure-tenants/)
- Learn more about [Azure DDoS Protection](./ddos-protection-overview.md)
- Learn more about [Gateway Load Balancer](../load-balancer/gateway-overview.md)
