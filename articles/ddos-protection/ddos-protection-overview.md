---
title: Azure DDoS Protection Standard Overview
description: Learn how the Azure DDoS Protection Standard, when combined with application design best practices, provides defense against DDoS attacks.
services: ddos-protection
documentationcenter: na
author: AbdullahBell
ms.service: ddos-protection
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/17/2022
ms.author: abell

---
# What is Azure DDoS Protection Standard?

Distributed denial of service (DDoS) attacks are some of the largest availability and security concerns facing customers that are moving their applications to the cloud. A DDoS attack attempts to exhaust an application's resources, making the application unavailable to legitimate users. DDoS attacks can be targeted at any endpoint that is publicly reachable through the internet.

Azure DDoS Protection Standard, combined with application design best practices, provides enhanced DDoS mitigation features to defend against DDoS attacks. It's automatically tuned to help protect your specific Azure resources in a virtual network. Protection is simple to enable on any new or existing virtual network, and it requires no application or resource changes.

:::image type="content" source="./media/ddos-best-practices/image-11.png" alt-text="Diagram of the reference architecture for a DDoS Protection Standard protected PaaS web application.":::
## Key benefits

### Always-on traffic monitoring
 Your application traffic patterns are monitored 24 hours a day, 7 days a week, looking for indicators of DDoS attacks. DDoS Protection Standard instantly and automatically mitigates the attack, once it's detected.

### Adaptive real time tuning
 Intelligent traffic profiling learns your application's traffic over time, and selects and updates the profile that is the most suitable for your service. The profile adjusts as traffic changes over time.

### DDoS Protection telemetry, monitoring, and alerting
DDoS Protection Standard applies three auto-tuned mitigation policies (TCP SYN, TCP, and UDP) for each public IP of the protected resource, in the virtual network that has DDoS enabled. The policy thresholds are auto-configured via machine learning-based network traffic profiling. DDoS mitigation occurs for an IP address under attack only when the policy threshold is exceeded.

### Azure DDoS Rapid Response
 During an active attack, Azure DDoS Protection Standard customers have access to the DDoS Rapid Response (DRR) team, who can help with attack investigation during an attack and post-attack analysis. For more information, see [Azure DDoS Rapid Response](ddos-rapid-response.md).
 
## SKUs

Azure DDoS Protection has one available SKU named DDoS Protection Standard. For more information about configuring DDoS Protection Standard, see [Quickstart: Create and configure Azure DDoS Protection Standard](manage-ddos-protection.md).

The following table shows features. 

| Feature |   DDoS infrastructure protection | DDoS Protection Standard |
|---|---|---|
| Active traffic monitoring & always on detection| Yes |  Yes|
| Automatic attack mitigation | Yes | Yes |
| Availability guarantee| Not available | Yes |
| Cost protection | Not available | Yes |
| Application based mitigation policies | Not available | Yes|
| Metrics & alerts | Not available  | Yes |
| Mitigation reports | Not available | Yes |
| Mitigation flow logs| Not available  | Yes|
| Mitigation policy customizations | Not available | Yes|
| DDoS rapid response support | Not available| Yes|

## Features

### Native platform integration
 Natively integrated into Azure. Includes configuration through the Azure portal. DDoS Protection Standard understands your resources and resource configuration.
### Turnkey protection
Simplified configuration immediately protects all resources on a virtual network as soon as DDoS Protection Standard is enabled. No intervention or user definition is required.

### Multi-Layered protection:
When deployed with a web application firewall (WAF), DDoS Protection Standard protects both at the network layer (Layer 3 and 4, offered by Azure DDoS Protection Standard) and at the application layer (Layer 7, offered by a WAF). WAF offerings include Azure [Application Gateway WAF SKU](../web-application-firewall/ag/ag-overview.md?toc=/azure/virtual-network/toc.json) and third-party web application firewall offerings available in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?page=1&search=web%20application%20firewall).

### Extensive mitigation scale
 All L3/L4 attack vectors can be mitigated, with global capacity, to protect against the largest known DDoS attacks.
### Attack analytics
Get detailed reports in five-minute increments during an attack, and a complete summary after the attack ends. Stream mitigation flow logs to [Microsoft Sentinel](../sentinel/data-connectors-reference.md#azure-ddos-protection) or an offline security information and event management (SIEM) system for near real-time monitoring during an attack. See [View and configure DDoS diagnostic logging](diagnostic-logging.md) to learn more.

### Attack metrics
 Summarized metrics from each attack are accessible through Azure Monitor. See [View and configure DDoS protection telemetry](telemetry.md) to learn more.

### Attack alerting
 Alerts can be configured at the start and stop of an attack, and over the attack's duration, using built-in attack metrics. Alerts integrate into your operational software like Microsoft Azure Monitor logs, Splunk, Azure Storage, Email, and the Azure portal. See [View and configure DDoS protection alerts
](alerts.md) to learn more.

### Cost guarantee
 Receive data-transfer and application scale-out service credit for resource costs incurred as a result of documented DDoS attacks.



## Architecture

DDoS Protection Standard is designed for [services that are deployed in a virtual network](../virtual-network/virtual-network-for-azure-services.md). For other services, the default infrastructure-level DDoS protection applies, which defends against common network-layer attacks. To learn more about supported architectures, see [DDoS Protection reference architectures](./ddos-protection-reference-architectures.md).
## Pricing

Under a tenant, a single DDoS protection plan can be used across multiple subscriptions, so there's no need to create more than one DDoS protection plan.

To learn about Azure DDoS Protection Standard pricing, see [Azure DDoS Protection Standard pricing](https://azure.microsoft.com/pricing/details/ddos-protection/).

## DDoS Protection FAQ

For frequently asked questions, see the [DDoS Protection FAQ](ddos-faq.yml).

## Next steps

* [Quickstart: Create a DDoS Protection Plan](manage-ddos-protection.md)
* [Learn module: Introduction to Azure DDoS Protection](/learn/modules/introduction-azure-ddos-protection/)
