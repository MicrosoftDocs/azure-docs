---
title: Monitor Azure DDoS Protection
description: Learn how to monitor Azure DDoS Protection using Azure Monitor, including data collection, analysis, and alerting.
ms.date: 10/21/2026
ms.custom: horz-monitor
ms.topic: concept-article
author: duongau
ms.author: duau
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

Azure DDoS Protection provides visibility into attack traffic and mitigation actions through metrics, reports, and flow logs. For eligible protected public IP addresses, peacetime telemetry also makes DDoS metrics available during normal operation, when mitigation isn't active.

> [!NOTE]
> Upcoming changes to the diagnostic log schema (starting ~mid-August 2026) retire `DDoSMitigationReports` and add new fields to `DDoSMitigationFlowLogs`. For the full migration guidance, see [DDoS Mitigation Reports](ddos-view-diagnostic-logs.md#ddos-mitigation-reports).

Use Azure Monitor to view metrics, compare traffic patterns, and configure alerts. Peacetime metric availability doesn't change when mitigation flow logs, reports, or protection notifications are generated.

### Peacetime telemetry availability (preview)

Peacetime telemetry extends the availability of the existing DDoS-specific metrics to normal operation for eligible protected public IP addresses. This scope includes incoming, forwarded, and dropped traffic, mitigation triggers, and attack status. Traffic metrics can contain data while **Under DDoS attack or not** reports **0**. The mitigation-trigger metrics already support peacetime monitoring.

Peacetime telemetry supports the same [resource types as Azure DDoS Protection](ddos-protection-reference-architectures.md#protected-resources). It is enabled automatically for supported resources protected by either DDoS Network Protection or DDoS IP Protection.

> [!IMPORTANT]
> Peacetime telemetry is in public preview. Use a protected public IP address that's eligible for the feature. Protection alone doesn't establish preview availability for every region, cloud, or IP version. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for applicable terms.

Peacetime telemetry uses the existing metric names and monitoring interfaces. It doesn't change the underlying protection or mitigation-policy behavior. For metric definitions and supported aggregations, see the [monitoring data reference](monitor-ddos-protection-reference.md#supported-metrics-for-microsoftnetworkpublicipaddresses).

You can open the monitoring experience from a DDoS protection plan, virtual network, or public IP address. Confirm that the metric scope identifies the intended protected public IP address.

Logging can be further integrated with [Microsoft Sentinel](/azure/sentinel/data-connectors-reference#azure-ddos-protection), Splunk (Azure Event Hubs), OMS Log Analytics, and Azure Storage for advanced analysis via the Azure Monitor Diagnostics interface.

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

Use peacetime telemetry to understand normal TCP, UDP, SYN, and aggregate traffic patterns without waiting for an attack. You need an eligible protected public IP address and permission to read its metrics. A Log Analytics workspace or diagnostic setting isn't required to view platform metrics.

1. In the [Azure portal](https://portal.azure.com/), open **Public IP addresses** and select the protected public IP address.
1. Under **Monitoring**, select **Metrics**. Confirm that **Scope** identifies the intended public IP address.
1. Select a recent time range, such as the last hour. Set **Time granularity** to **1 minute** and apply the settings.
1. Add **Inbound TCP packets DDoS** with **Max** aggregation.
1. Add **Inbound UDP packets DDoS** and **Inbound SYN packets DDoS**, also with **Max** aggregation.
1. Add a separate chart for **Under DDoS attack or not**, using the same public IP address, time range, granularity, and **Max** aggregation.
1. Compare traffic and attack status. During normal operation, traffic metrics can contain data while the attack-status metric reports **0**.

For aggregate traffic, use **Inbound packets DDoS** or **Inbound bytes DDoS**. Add the corresponding forwarded and dropped metrics when investigating filtering. Keep packet rates, byte rates, and attack status on separate charts.

For traffic that isn't TCP or UDP, use the existing **Inbound other packets DDoS** and **Inbound other bytes DDoS** metrics.

> [!NOTE]
> DDoS traffic metrics already report bytes per second or packets per second. Don't divide these rates by 60. General public-IP metrics such as **Packet Count**, **SYN Count**, and **Byte Count** are separate measurements with different units and aggregations.

A reported attack-status value of **0** means no attack was reported for that measurement; **1** means an attack was reported. With **Max**, a displayed **1** means at least one reported value in that chart interval was **1**, not necessarily that an attack is still active when you view the chart.

Missing data isn't the same as zero. If no data points appear, check protection and feature eligibility, public-IP scope, permissions, the selected time range, and reporting delay. Don't generate an attack to make metrics appear. For interpretation and timing guidance, see [Interpret DDoS metrics](monitor-ddos-protection-reference.md#interpret-ddos-metrics).

### Validate and test

Validate peacetime visibility with ordinary application traffic:

1. Select an eligible protected test resource that's receiving ordinary application traffic.
1. Follow the [peacetime viewing procedure](#view-peace-time-traffic-telemetry) and allow for reporting delay.
1. Confirm that relevant traffic metrics contain data and that **Under DDoS attack or not** reports **0** for the test period.
1. Investigate missing values by checking feature eligibility, scope, permissions, the time range, and reporting delay.

This test validates metric visibility, not mitigation effectiveness or application health. Attack and mitigation validation are separate activities. Follow the approved [DDoS simulation-testing process](test-through-simulations.md) for those tests.

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
