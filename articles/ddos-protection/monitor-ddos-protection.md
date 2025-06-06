---
title: Monitor Azure DDoS Protection
description: Learn how to monitor Azure DDoS Protection using Azure Monitor, including data collection, analysis, and alerting.
ms.date: 03/17/2025
ms.custom: horz-monitor
ms.topic: concept-article
author: AbdullahBell
ms.author: abell
ms.service: azure-ddos-protection
# Customer intent: "As a security administrator, I want to monitor Azure DDoS Protection metrics and logs so that I can analyze attack patterns and ensure the effectiveness of my DDoS mitigation strategies."
---

# Monitor Azure DDoS Protection

[!INCLUDE [azmon-horz-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-intro.md)]

## Collect data with Azure Monitor

This table describes how you can collect data to monitor your service, and what you can do with the data once collected:

|Data to collect|Description|How to collect and route the data|Where to view the data|Supported data|
|---------|---------|---------|---------|---------|
|Metric data|Metrics are numerical values that describe an aspect of a system at a particular point in time. Metrics can be aggregated using algorithms, compared to other metrics, and analyzed for trends over time.|- Collected automatically at regular intervals.</br> - You can route some platform metrics to a Log Analytics workspace to query with other data. Check the **DS export** setting for each metric to see if you can use a diagnostic setting to route the metric data.|[Metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started)| [Azure DDoS Protection metrics supported by Azure Monitor](monitor-ddos-protection-reference.md#metrics)|
|Resource log data|Logs are recorded system events with a timestamp. Logs can contain different types of data, and be structured or free-form text. You can route resource log data to Log Analytics workspaces for querying and analysis.|[Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to collect and route resource log data.| [Log Analytics](/azure/azure-monitor/learn/quick-create-workspace)|[Azure DDoS Protection resource log data supported by Azure Monitor](monitor-ddos-protection-reference.md#resource-logs)  |
|Activity log data|The Azure Monitor activity log provides insight into subscription-level events. The activity log includes information like when a resource is modified or a virtual machine is started.|- Collected automatically.</br> - [Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to a Log Analytics workspace at no charge.|[Activity log](/azure/azure-monitor/essentials/activity-log)|  |

[!INCLUDE [azmon-horz-supported-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-supported-data.md)]

## Built in monitoring for Azure DDoS Protection

Azure DDoS Protection offers in-depth insights and visualizations of attack patterns through DDoS Attack Analytics. It provides customers with comprehensive visibility into attack traffic and mitigation actions via reports and flow logs. During a DDoS attack, detailed metrics are available through Azure Monitor, which also allows alert configurations based on these metrics.

You can view and configure Azure DDoS protection telemetry.

Telemetry for an attack is provided through Azure Monitor in real time. While [mitigation triggers](#view-ddos-mitigation-policies) for TCP SYN, TCP & UDP are available during peace-time, other telemetry is available only when a public IP address has been under mitigation.

You can view DDoS telemetry for a protected public IP address through three different resource types: DDoS protection plan, virtual network, and public IP address.

Logging can be further integrated with [Microsoft Sentinel](../sentinel/data-connectors-reference.md#azure-ddos-protection), Splunk (Azure Event Hubs), OMS Log Analytics, and Azure Storage for advanced analysis via the Azure Monitor Diagnostics interface.

For more information on metrics, see [Monitoring Azure DDoS Protection](monitor-ddos-protection-reference.md) for details on DDoS Protection monitoring logs.

### View metrics from DDoS protection plan

1. Sign in to the [Azure portal](https://portal.azure.com/) and select your DDoS protection plan.
1. On the Azure portal menu, select or search for and select **DDoS protection plans** then select your DDoS protection plan.
1. Under **Monitoring**, select **Metrics**.
1. Select **Add metric** then select **Scope**.
1. In the Select a scope menu, select the **Subscription** that contains the public IP address you want to log.  
1. Select **Public IP Address** for **Resource type** then select the specific public IP address you want to log metrics for, and then select **Apply**.
1. For **Metric** select **Under DDoS attack or not**.
1. Select the **Aggregation** type as **Max**.

    :::image type="content" source="./media/ddos-attack-telemetry/ddos-metrics-menu.png" alt-text="Screenshot of creating DDoS protection metrics menu." lightbox="./media/ddos-attack-telemetry/ddos-metrics-menu.png":::

### View metrics from virtual network

1. Sign in to the [Azure portal](https://portal.azure.com/) and browse to your virtual network that has DDoS protection enabled.
1. Under **Monitoring**, select **Metrics**.
1. Select **Add metric** then select **Scope**.
1. In the Select a scope menu, select the **Subscription** that contains the public IP address you want to log.  
1. Select **Public IP Address** for **Resource type** then select the specific public IP address you want to log metrics for, and then select **Apply**.
1. Under **Metric** select your chosen metric then under **Aggregation** select type as **Max**.

    :::image type="content" source="./media/ddos-attack-telemetry/vnet-ddos-metrics.png" alt-text="Screenshot of DDoS diagnostic settings within Azure." lightbox="./media/ddos-attack-telemetry/vnet-ddos-metrics.png":::

> [!NOTE]
> To filter IP Addresses, select **Add filter**. Under **Property**, select **Protected IP Address**, and the operator should be set to **=**. Under **Values**, you see a dropdown of public IP addresses, associated with the virtual network, that are protected by Azure DDoS Protection.

### View metrics from Public IP address

1. Sign in to the [Azure portal](https://portal.azure.com/) and browse to your public IP address.
1. On the Azure portal menu, select or search for and select **Public IP addresses** then select your public IP address.
1. Under **Monitoring**, select **Metrics**.
1. Select **Add metric** then select **Scope**.
1. In the Select a scope menu, select the **Subscription** that contains the public IP address you want to log.  
1. Select **Public IP Address** for **Resource type** then select the specific public IP address you want to log metrics for, and then select **Apply**.
1. Under **Metric** select your chosen metric then under **Aggregation** select type as **Max**.

> [!NOTE]
> When you change DDoS IP protection from **enabled** to **disabled**, telemetry for the public IP resource isn't available.

### View DDoS mitigation policies

Azure DDoS Protection uses three automatically adjusted mitigation policies (TCP SYN, TCP, and UDP) for each public IP address of the resource being protected. This approach applies to any virtual network with DDoS protection enabled. 

You can see the policy limits within your public IP address metrics by choosing the *Inbound SYN packets to trigger DDoS mitigation*, *Inbound TCP packets to trigger DDoS mitigation*, and *Inbound UDP packets to trigger DDoS mitigation* metrics. Make sure to set the aggregation type to *Max*.

:::image type="content" source="./media/manage-ddos-protection/view-mitigation-policies.png" alt-text="Screenshot of viewing mitigation policies." lightbox="./media/manage-ddos-protection/view-mitigation-policies.png":::

### View peace time traffic telemetry

It's important to keep an eye on the metrics for TCP SYN, UDP, and TCP detection triggers. These metrics help you know when DDoS protection starts. Make sure these triggers reflect the normal traffic levels when there's no attack. 

You can make a chart for the public IP address resource. In this chart, include the Packet Count and SYN Count metrics. The Packet count includes both TCP and UDP Packets. This shows you the sum of traffic. 

:::image type="content" source="./media/manage-ddos-protection/ddos-baseline-metrics.png" alt-text="Screenshot of viewing peace time telemetry." lightbox="./media/manage-ddos-protection/ddos-baseline-metrics.png":::

> [!NOTE]
> To make a fair comparison, you need to convert the data to packets-per-second. You can do this conversion by dividing the number you see by 60, as the data represents the number of packets, bytes, or SYN packets collected over 60 seconds. For example, if you have 91,000 packets collected over 60 seconds, divide 91,000 by 60 to get approximately 1,500 packets-per-second (pps).

### Validate and test

To simulate a DDoS attack to validate DDoS protection telemetry, see [Validate DDoS detection](test-through-simulations.md).

[!INCLUDE [azmon-horz-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-tools.md)]

[!INCLUDE [azmon-horz-export-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-export-data.md)]

[!INCLUDE [azmon-horz-kusto](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-kusto.md)]

[!INCLUDE [azmon-horz-alerts-part-one](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-one.md)]

### Recommended Azure Monitor alert rules for Azure DDoS Protection

For more information about alerts in Azure DDoS Protection, see [Configure Azure DDoS Protection metric alerts through portal](alerts.md) and [Configure Azure DDoS Protection diagnostic logging alerts](ddos-diagnostic-alert-templates.md).

[!INCLUDE [azmon-horz-alerts-part-two](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-two.md)]

## Related content

- [Azure DDoS Protection monitoring data reference](monitor-ddos-protection-reference.md)
- [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource)
- [Configure DDoS Alerts](alerts.md)
- [View alerts in Microsoft Defender for Cloud](ddos-view-alerts-defender-for-cloud.md)
- [Test with simulation partners](test-through-simulations.md)
