---
title: Inline L7 DDoS Protection with Gateway Load Balancer and partner NVAs
description: Learn how to create and enable inline L7 DDoS Protection with Gateway Load Balancer and Partner NVAs
services: ddos-protection
author: AbdullahBell
ms.service: azure-ddos-protection
ms.topic: how-to
ms.author: abell
ms.date: 06/18/2025
# Customer intent: As a network security engineer, I want to implement inline L7 DDoS protection using a Gateway Load Balancer and partner NVAs, so that I can ensure real-time traffic inspection and minimize latency for sensitive workloads against DDoS attacks.
---

# Inline L7 DDoS Protection with Gateway Load Balancer and Partner NVAs

This article describes how to implement inline Layer 7 (L7) DDoS protection for latency-sensitive workloads in Azure by using Gateway Load Balancer and partner network virtual appliances (NVAs). You'll learn about scenarios, architecture, deployment steps, and best practices for comprehensive DDoS mitigation.

## Overview

Azure DDoS Protection provides robust, always-on defense at the network layer (L3/4), quickly detecting and mitigating attacks within 30-60 seconds. While it focuses on protecting against volumetric and protocol-based threats, application layer (L7) inspection can be added for even greater security.

Some workloads, such as gaming, web applications, financial services, and streaming services, demand ultra-low latency, and continuous protection. For these scenarios, inline protection ensures that all traffic is proactively routed through the DDoS protection pipeline at all times. This approach not only delivers immediate mitigation but also enables deep inspection of packet payloads, helping to detect and block low-volume attacks that target vulnerabilities at the application layer (L7).

Partner NVAs deployed with Gateway Load Balancer and integrated with Azure DDoS Protection offer comprehensive inline L7 DDoS Protection for high-performance and high-availability scenarios. This combination provides L3-L7 protection against volumetric and low-volume DDoS attacks.

## Scenarios

Inline L7 DDoS protection is valuable for:

- **Web applications:** Protects against HTTP floods and slowloris attacks.
- **Financial services:** Safeguards transaction systems from targeted application-layer attacks.
- **Streaming services:** Ensures uninterrupted streaming by mitigating low-volume, targeted attacks.
- **Gaming workloads:** Prevents short outages and disruptions caused by targeted attacks on game servers.


## What is a Gateway Load Balancer?

Gateway Load Balancer is a SKU of Azure Load Balancer designed for high-performance and high-availability scenarios with third-party NVAs.

With Gateway Load Balancer, you can easily deploy, scale, and manage NVAs. You can connect a Gateway Load Balancer to your public endpoint with a single configuration step. This capability lets you add NVAs to the network path for scenarios such as firewalls, advanced packet analytics, intrusion detection systems, intrusion prevention systems, or other custom solutions. Gateway Load Balancer also maintains flow symmetry to a specific instance in the backend pool, ensuring session consistency.

For more information, see [Gateway Load Balancer](../load-balancer/gateway-overview.md).

## Architecture

DDoS attacks on latency-sensitive workloads like gaming can cause outages lasting 2-10 seconds, disrupting availability. Gateway Load Balancer enables protection of such workloads by ensuring the relevant NVAs are injected into the ingress path of the internet traffic. After you connect the Gateway Load Balancer to a Standard Public Load Balancer frontend or to the IP configuration of a virtual machine, traffic to and from the application endpoint is automatically routed through the Gateway Load Balancer—no additional configuration is required.

Inbound traffic is inspected by the NVAs, and clean traffic returns to the backend infrastructure (such as game servers).

Traffic flows from the consumer virtual network to the provider virtual network and then returns to the consumer virtual network. The consumer and provider virtual networks can be in different subscriptions, tenants, or regions, enabling greater flexibility and ease of management.

:::image type="content" source="./media/ddos-glb.png" alt-text="Screenshot of DDoS inline protection diagram via gateway load balancer.":::

**Traffic flow steps:**

1. Traffic from the internet reaches the public IP of the Standard Load Balancer.
1. Traffic is redirected to the Gateway Load Balancer, which forwards it to partner NVAs.
1. NVAs inspect and filter traffic, mitigating L7 attacks.
1. Clean traffic returns to the backend servers for processing.
1. Azure DDoS Protection provides additional L3/L4 protection at the Standard Load Balancer.

Enabling Azure DDoS Protection on the virtual network of the Standard Public Load Balancer frontend or virtual machine protects against L3/4 DDoS attacks.


For detailed deployment instructions, see [Protect your public load balancer with Azure DDoS Protection](../load-balancer/tutorial-protect-load-balancer-ddos.md).

## Best practices

To ensure effective DDoS protection using Gateway Load Balancer and partner NVAs, follow these best practices. 

- **Scale NVAs appropriately to handle peak traffic volumes:**  

    Ensure that your NVAs are sized and configured to accommodate the highest expected levels of traffic. Under-provisioned NVAs can become a bottleneck, reducing the effectiveness of DDoS mitigation and potentially impacting application performance. Use Azure monitoring tools to track traffic patterns and adjust scaling as needed. for more information, see [Azure Monitor](/azure/azure-monitor/fundamentals/overview) and [Network Watcher](/azure/network-watcher/network-watcher-monitoring-overview).

- **Deploy NVAs in a high-availability configuration to avoid single points of failure:**  

    Configure multiple NVAs in an active-active or active-passive configuration to ensure continuous protection, even if one appliance fails or requires maintenance. Use Azure Load Balancer health probes to monitor NVA health and automatically reroute traffic if an instance becomes unavailable. For more information, see [Azure Load Balancer health probes](../load-balancer/load-balancer-custom-probe-overview.md).

- **Regularly monitor and tune NVAs to maintain optimal performance:** 

    Continuously monitor the performance and health of your NVAs using Azure Monitor, Network Watcher, and NVA-specific dashboards. Review logs and alerts for unusual activity or performance degradation. Update NVA software and signatures regularly to protect against the latest threats and vulnerabilities. 

- **Test your DDoS protection setup to validate end-to-end traffic flow and mitigation:**  

     Periodically simulate DDoS attack scenarios and perform failover tests to ensure your protection setup is working as intended. Validate that traffic flows through the NVAs as expected and that mitigation actions are triggered appropriately. Document your test results and update your configuration or runbooks as needed to address any issues. For more information, see [Testing DDoS Protection](../ddos-protection/test-through-simulations.md).

## Next steps

- Learn more about our launch partner [A10 Networks](https://www.a10networks.com/blog/introducing-l3-7-ddos-protection-for-microsoft-azure-tenants/)
- Learn more about [Gateway Load Balancer](../load-balancer/gateway-overview.md).
- Learn more about [Azure Private Link](../private-link/private-link-overview.md) and how it can be used with Gateway Load Balancer.
- Learn more about [Azure DDoS Protection architecture](../ddos-protection/fundamental-best-practices.md).