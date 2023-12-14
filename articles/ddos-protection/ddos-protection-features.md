---
title: Azure DDoS Protection features
description: Learn Azure DDoS Protection features
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: conceptual
ms.custom: ignite-2022
ms.workload: infrastructure-services
ms.date: 11/06/2023
ms.author: abell
---
# Azure DDoS Protection features

The following sections outline the key features of the Azure DDoS Protection service.

## Always-on traffic monitoring

Azure DDoS Protection monitors actual traffic utilization and constantly compares it against the thresholds defined in the DDoS Policy. When the traffic threshold is exceeded, DDoS mitigation is initiated automatically. When traffic returns below the thresholds, the mitigation is stopped.

:::image type="content" source="./media/ddos-protection-overview/mitigation.png" alt-text="Screenshot of Azure DDoS Protection Mitigation." lightbox="./media/ddos-protection-overview/mitigation.png":::

During mitigation, traffic sent to the protected resource is redirected by the DDoS protection service and several checks are performed, such as:

- Ensure packets conform to internet specifications and are not malformed.
- Interact with the client to determine if the traffic is potentially a spoofed packet (e.g: SYN Auth or SYN Cookie or by dropping a packet for the source to retransmit it).
- Rate-limit packets, if no other enforcement method can be performed.

Azure DDoS Protection drops attack traffic and forwards the remaining traffic to its intended destination. Within a few minutes of attack detection, you are notified using Azure Monitor metrics. By configuring logging on DDoS Protection telemetry, you can write the logs to available options for future analysis. Metric data in Azure Monitor for DDoS Protection is retained for 30 days.

## Adaptive real time tuning

The complexity of attacks (for example, multi-vector DDoS attacks) and the application-specific behaviors of tenants call for per-customer, tailored protection policies. The service accomplishes this by using two insights:

- Automatic learning of per-customer (per-Public IP) traffic patterns for Layer 3 and 4.

- Minimizing false positives, considering that the scale of Azure allows it to absorb a significant amount of traffic.

:::image type="content" source="./media/ddos-best-practices/ddos-protection-real-time-tuning.png" alt-text="Diagram of how DDoS Protection works." lightbox="./media/ddos-best-practices/ddos-protection-real-time-tuning.png":::

## DDoS Protection telemetry, monitoring, and alerting

Azure DDoS Protection exposes rich telemetry via [Azure Monitor](../azure-monitor/overview.md). You can configure alerts for any of the Azure Monitor metrics that DDoS Protection uses. You can integrate logging with Splunk (Azure Event Hubs), Azure Monitor logs, and Azure Storage for advanced analysis via the Azure Monitor Diagnostics interface.

### Azure DDoS Protection mitigation policies

In the Azure portal, select **Monitor** > **Metrics**. In the **Metrics** pane, select the resource group, select a resource type of **Public IP Address**, and select your Azure public IP address. DDoS metrics are visible in the **Available metrics** pane.

DDoS Protection applies three auto-tuned mitigation policies (TCP SYN, TCP, and UDP) for each public IP of the protected resource, in the virtual network that has DDoS enabled. You can view the policy thresholds by selecting the metric **Inbound packets to trigger DDoS mitigation**.

:::image type="content" source="./media/ddos-best-practices/ddos-protection-mitigation-metrics.png" alt-text="Screenshot of available metrics and metrics chart." lightbox="./media/ddos-best-practices/ddos-protection-mitigation-metrics.png":::

The policy thresholds are auto-configured via machine learning-based network traffic profiling. DDoS mitigation occurs for an IP address under attack only when the policy threshold is exceeded.

For more information, see [View and configure DDoS Protection telemetry](telemetry.md).

### Metric for an IP address under DDoS attack

If the public IP address is under attack, the value for the metric **Under DDoS attack or not** changes to 1 as DDoS Protection performs mitigation on the attack traffic.

:::image type="content" source="./media/ddos-best-practices/ddos-protection-ddos-attack.png" alt-text="Screenshot of Under DDoS attack or not metric and chart." lightbox="./media/ddos-best-practices/ddos-protection-ddos-attack.png":::

We recommend configuring an alert on this metric. You'll then be notified when there’s an active DDoS mitigation performed on your public IP address.

For more information, see [Manage Azure DDoS Protection using the Azure portal](manage-ddos-protection.md).

## Web application firewall for resource attacks

Specific to resource attacks at the application layer, you should configure a web application firewall (WAF) to help secure web applications. A WAF inspects inbound web traffic to block SQL injections, cross-site scripting, DDoS, and other Layer 7 attacks. Azure provides [WAF as a feature of Application Gateway](../web-application-firewall/ag/ag-overview.md) for centralized protection of your web applications from common exploits and vulnerabilities. There are other WAF offerings available from Azure partners that might be more suitable for your needs via the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?search=WAF&page=1).

Even web application firewalls are susceptible to volumetric and state exhaustion attacks. We strongly recommend enabling DDoS Protection on the WAF virtual network to help protect from volumetric and protocol attacks. For more information, see the [Azure DDoS Protection reference architectures](ddos-protection-reference-architectures.md) section.

## Protection Planning

Planning and preparation are crucial to understand how a system will perform during a DDoS attack. Designing an incident management response plan is part of this effort.

If you have DDoS Protection, make sure that it's enabled on the virtual network of internet-facing endpoints. Configuring DDoS alerts helps you constantly watch for any potential attacks on your infrastructure.

Monitor your applications independently. Understand the normal behavior of an application. Prepare to act if the application is not behaving as expected during a DDoS attack.

Learn how your services will respond to an attack by [testing through DDoS simulations](test-through-simulations.md).

## Next steps

- Learn more about [reference architectures](ddos-protection-reference-architectures.md).
