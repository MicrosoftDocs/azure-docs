---
title: Azure Firewall best practices for performance
description: Learn how to configure Azure Firewall to maximize performance and minimize latency using best practices for rules, SNAT, IDPS, and monitoring.
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 03/28/2026
ms.author: duau
# Customer intent: As a network administrator, I want to implement best practices for Azure Firewall configuration, so that I can optimize its performance and ensure efficient network traffic management while maintaining security.
---

# Best practices for Azure Firewall performance

To maximize the [performance](firewall-performance.md) of your Azure Firewall and Firewall policy, it’s important to follow best practices. However, certain network behaviors or features can affect the firewall’s performance and latency, despite its performance optimization capabilities.

## Common causes of performance problems

- **Exceeding rule limitations**

   If you exceed limitations, such as using more than 20,000 unique source or destination combinations in rules, you can affect firewall traffic processing and cause latency. Even though this limit is soft, surpassing it can affect overall firewall performance. For more information, see the [documented limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-firewall-limits).

- **High traffic throughput**

    Azure Firewall Standard supports up to 30 Gbps, while Premium supports up to 100 Gbps. For more information, see the [throughput limitations](firewall-performance.md#performance-data). You can monitor your throughput or data processing in Azure Firewall metrics. For more information, see [Azure Firewall metrics and alerts](monitor-firewall-reference.md).

- **High number of connections**

   An excessive number of connections passing through the firewall can lead to SNAT (Source Network Address Translation) port exhaustion.

- **IDPS Alert + Deny mode**

   If you enable IDPS Alert + Deny mode, the firewall drops packets that match an IDPS signature. This action affects performance.

## Recommendations

- **Optimize rule configuration and processing**

   - Organize rules by using firewall policy into Rule Collection Groups and Rule Collections, and prioritize them based on how often they're used.
   - Use [IP Groups](ip-groups.md) or IP prefixes to reduce the number of IP table rules.
   - Prioritize rules with the highest number of hits.
   - Make sure you're within the following [rule limitations](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-firewall-limits).
- **Use or migrate to Azure Firewall Premium**
   - Azure Firewall Premium uses advanced hardware and offers a higher-performing underlying engine.
   - It's best for heavier workloads and higher traffic volumes.
   - It also includes built-in accelerated networking software, which can achieve throughput of up to 100 Gbps, unlike the Standard version.
- **Add multiple public IP addresses to the firewall to prevent SNAT port exhaustion**
   - To prevent SNAT port exhaustion, consider adding multiple public IP addresses (PIPs) to your firewall. Azure Firewall provides [2,496 SNAT ports per each additional PIP](../nat-gateway/tutorial-hub-spoke-nat-firewall.md).
   - If you prefer not to add more PIPs, you can add an Azure NAT Gateway to scale SNAT port usage. This solution provides advanced SNAT port allocation capabilities.
- **Start with IDPS Alert mode before you enable Alert + Deny mode**
   - While the *Alert + Deny* mode offers enhanced security by blocking suspicious traffic, it can also introduce more processing overhead. If you disable this mode, you might observe performance improvement, especially in scenarios where the firewall is primarily used for routing and not deep packet inspection.
   - It's essential to remember that traffic through the firewall is denied by default until you explicitly configure *allow* rules. Therefore, even when IDPS *Alert + Deny* mode is disabled, your network remains protected, and only explicitly permitted traffic is allowed to pass through the firewall. It can be a strategic choice to disable this mode to optimize performance without compromising the core security features provided by the Azure Firewall.

> [!NOTE]
> Avoid bulk *deny all signatures* overrides. Some signatures set context for later detections and can't be overridden to prevent silent drops. For details, see [Override behavior and limitations](idps-signature-categories.md#override-behavior-and-limitations).

## Testing and monitoring

To ensure optimal performance for your Azure Firewall, continuously and proactively monitor it. Regularly assess the health and key metrics of your firewall to identify potential issues and maintain efficient operation, especially during configuration changes.

Use the following best practices for testing and monitoring:

- **Test latency introduced by the firewall**
   - To assess the latency added by the firewall, measure the latency of your traffic from the source to the destination by temporarily bypassing the firewall. To do this, reconfigure your routes to bypass the firewall. Compare the latency measurements with and without the firewall to understand its effect on traffic.
- **Measure firewall latency using latency probe metrics**
   - Use the *latency probe* metric to measure the average latency of the Azure Firewall. This metric provides an indirect metric of the firewall’s performance. Remember that intermittent latency spikes are normal.
- **Measure traffic throughput metric**
   - Monitor the *traffic throughput* metric to understand how much data passes through the firewall. This metric helps you gauge the firewall's capacity and its ability to handle the network traffic.
- **Measure data processed**
   - Keep track of the *data processed* metric to assess the volume of data processed by the firewall.
- **Identify rule hits and performance spikes**
   - Look for spikes in network performance or latency. Correlate rule hit timestamps, such as application rules hit count and network rules hit count, to determine if rule processing is a significant factor contributing to performance or latency issues. By analyzing these patterns, you can identify specific rules or configurations that you might need to optimize.
- **Add alerts to key metrics**
   - In addition to regular monitoring, set up alerts for key firewall metrics. This step ensures that you're promptly notified when specific metrics surpass predefined thresholds. To configure alerts, see [Azure Firewall logs and metrics](monitor-firewall.md#alert-on-azure-firewall-metrics) for detailed instructions about setting up effective alerting mechanisms. Proactive alerting enhances your ability to respond swiftly to potential issues and maintain optimal firewall performance.
- **Implement governance and compliance**
   - Use [Azure Policy](firewall-azure-policy.md) to enforce consistent configuration standards across your Azure Firewall deployments, including explicit proxy settings and other security configurations.
   - Track configuration changes using [Azure Resource Graph](rule-set-change-tracking.md) to maintain compliance and operational visibility.

## Next steps

- [Azure Firewall performance](firewall-performance.md)
