---
title: Monitor Azure DDoS Protection monitoring data reference
description: This article contains important reference material you need when you monitor Azure DDoS Protection by using Azure Monitor.
ms.date: 10/21/2026
ms.custom: horz-monitor
ms.topic: reference
author: duongau
ms.author: duau
ms.service: azure-ddos-protection
# Customer intent: As a network administrator, I want to monitor Azure DDoS Protection metrics and logs, so that I can effectively manage traffic and identify potential threats to ensure the security and performance of my network.
---

# Azure DDoS Protection monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure DDoS Protection](monitor-ddos-protection.md) for details on the data you can collect for Azure DDoS Protection and how to use it.

> [!NOTE]
> The `DDoSMitigationReports` log category is being retired and `DDoSMitigationFlowLogs` is gaining new fields, starting ~mid-August 2026. See [DDoS Mitigation Reports](ddos-view-diagnostic-logs.md#ddos-mitigation-reports) for the full schema and migration guidance.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Network/publicIPAddresses

The following table lists the metrics available for the Microsoft.Network/publicIPAddresses resource type.

For eligible protected public IP addresses, [peacetime telemetry (preview)](monitor-ddos-protection.md#peacetime-telemetry-availability-preview) makes the existing DDoS-specific metrics available during normal operation as well as during mitigation. Use the shared table below for metric names, REST API names, units, supported aggregations, time grains, and export support.

General public-IP metrics such as **Byte Count**, **Packet Count**, **SYN Count**, and **Data Path Availability** are separate from DDoS-specific metrics.

The existing **Inbound other packets DDoS** and **Inbound other bytes DDoS** metrics cover traffic that isn't TCP or UDP. Peacetime telemetry extends the availability of these metrics; it doesn't introduce a new metric for other protocols.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/publicIPAddresses](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-publicipaddresses-metrics-include.md)]

### Interpret DDoS metrics

- **Incoming** metrics report total incoming traffic observed by the DDoS system, including forwarded and dropped traffic.
- **Forwarded** metrics report traffic passed onward by DDoS protection. They don't prove successful application delivery.
- **Dropped** metrics report traffic discarded by the DDoS system. Dropped data alone doesn't establish that an attack occurred.
- **Mitigation-trigger** metrics report policy thresholds, not observed traffic rates.
- **Under DDoS attack or not** (`IfUnderDDoSAttack`) reports attack status. A reported **0** means no attack was reported for that measurement; **1** means an attack was reported.

With **Maximum** aggregation, an attack-status value of **1** means at least one reported value in the interval was **1**. It doesn't necessarily mean an attack is still active when you view the chart or receive an alert. Missing data means no measurement is available for that interval; don't interpret it as zero or proof that no attack occurred.

#### Units and timing

DDoS byte-rate metrics use bytes per second. DDoS packet-rate metrics and mitigation triggers use packets per second (`CountPerSecond`). Attack status uses `Count` for its **0** or **1** indicator. These traffic metrics already report rates: don't divide them by 60, and don't confuse bytes per second with bits per second.

Compare charts using the same resource, time range, time zone, granularity, and supported aggregation. Separately aggregated maximum incoming, forwarded, and dropped rates might not add up because their peaks can occur at different times.

Collection, processing, and chart refresh can delay metric visibility. A one-minute time grain isn't a guarantee that data appears within one minute. Alert evaluation frequency and lookback affect notification timing separately.

> [!NOTE]
> While multiple options for **Aggregation** are displayed on Azure portal, only the aggregation types listed in the table are supported for each metric. We apologize for this confusion and we are working to resolve it.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- Direction
- Port

These dimensions apply to general public-IP metrics where the shared metric table lists them. The DDoS-specific metrics in the peacetime scope have no dimensions. Peacetime telemetry doesn't add port or direction dimensions or outbound DDoS metrics.

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

Peacetime telemetry changes metric availability, not when mitigation flow logs, reports, or protection notifications are generated. Viewing platform metrics doesn't require diagnostic logging. Exporting supported metrics and collecting resource logs are separate tasks.

### Supported resource logs for Microsoft.Network/publicIPAddresses

[!INCLUDE [Microsoft.Network/publicIPAddresses](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-publicipaddresses-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Azure DDoS Protection Microsoft.Network/publicIPAddresses

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Network resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

## Related content

- See [Monitor Azure DDoS Protection](monitor-ddos-protection.md) for a description of monitoring Azure DDoS Protection.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
