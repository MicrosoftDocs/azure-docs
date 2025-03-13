---
title: Monitoring data reference for Azure DNS
description: This article contains important reference material you need when you monitor Azure DNS by using Azure Monitor.
ms.date: 01/06/2025
ms.custom: horz-monitor
ms.topic: reference
author: greg-lindsay
ms.author: greglin
ms.service: azure-dns
---

# Azure DNS monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure DNS](monitor-dns.md) for details on the data you can collect for Azure DNS and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Network/dnsForwardingRulesets

The following table lists the metrics available for the Microsoft.Network/dnsForwardingRulesets resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/dnsForwardingRulesets](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-dnsforwardingrulesets-metrics-include.md)]

### Supported metrics for Microsoft.Network/dnsResolverDomainLists

The following table lists the metrics available for the Microsoft.Network/dnsResolverDomainLists type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/dnsResolverDomainLists](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-dnsresolverdomainlists-metrics-include.md)]

### Supported metrics for Microsoft.Network/dnsResolverPolicies

The following table lists the metrics available for the Microsoft.Network/dnsResolverPolicies type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/dnsResolverPolicies](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-dnsresolverpolicies-metrics-include.md)]

### Supported metrics for Microsoft.Network/dnsResolvers

The following table lists the metrics available for the Microsoft.Network/dnsResolvers type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/dnsResolvers](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-dnsresolvers-metrics-include.md)]

### Supported metrics for Microsoft.Network/dnszones

The following table lists the metrics available for the Microsoft.Network/dnszones type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/dnszones](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-dnszones-metrics-include.md)]

### Supported metrics for Microsoft.Network/privateDnsZones

The following table lists the metrics available for the Microsoft.Network/privateDnsZones type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/privateDnsZones](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-privatednszones-metrics-include.md)]

### Using Azure DNS metrics

Azure DNS provides metrics for you to monitor specific aspects of your DNS zones. With the metrics in Azure DNS, you can configure alerting based on conditions that are met. Azure DNS provides the following metrics to Azure Monitor for your DNS zones:

- QueryVolume
- RecordSetCount
- RecordSetCapacityUtilization

> [!NOTE]
> At this time, these metrics are only available for Public DNS zones hosted in Azure DNS. If you have Private Zones hosted in Azure DNS, these metrics don't provide data for those zones. In addition, the metrics and alerting feature is only supported in Azure Public cloud. Support for sovereign clouds will follow at a later time.

The most granular element that you can see metrics for is a DNS zone. You currently can't see metrics for individual resource records within a zone.

#### Query volume

The *Query Volume* metric shows the number of DNS queries received by Azure DNS for your DNS zone. The unit of measurement is `Count` and the aggregation is the `Sum` of all the queries received over a period of time.

To view this metric, select **Metrics** explorer experience from the **Monitor** page in the Azure portal. Scope down to your DNS zone and then select **Apply**. In the drop-down for *Metrics*, select`Query Volume`, and then select `Sum` from the drop-down for *Aggregation*.

:::image type="content" source="./media/dns-alerts-metrics/dns-metrics-query-volume.png" alt-text="Screenshot shows a graph of the Query Volume metric in the Azure portal." lightbox="./media/dns-alerts-metrics/dns-metrics-query-volume.png":::

### Record Set Count

The *Record Set Count* metric shows the number of Record sets in Azure DNS for your DNS zone. All the Record sets defined in your zone are counted. The unit of measurement is `Count` and the aggregation is the `Maximum` of all the Record sets.

To view this metric, select **Metrics** explorer experience from the **Monitor** tab in the Azure portal. Scope down to your DNS zone and then select **Apply**. In the drop-down for *Metrics*, select `Query Volume`, and then select `Sum` from the drop-down for *Aggregation*.

Select your DNS zone from the **Resource** drop-down, select the **Record Set Count** metric, and then select **Max** as the **Aggregation**. 

:::image type="content" source="./media/dns-alerts-metrics/dns-metrics-record-set-count.png" alt-text="Screenshot shows a graph of the Record Set Count metric in the Azure portal." lightbox="./media/dns-alerts-metrics/dns-metrics-record-set-count.png":::

### Record Set Capacity Utilization

The *Record Set Capacity Utilization* metric shows the percentage used of your Record set capacity for a DNS Zone. Each Azure DNS zone has a Recordset limit that defines the maximum number of Record sets allowed for the zone. For more information, see [DNS limits](dns-zones-records.md#limits) section. The unit of measurement is a `Percentage` and the aggregation type is `Maximum`.

For example, if you have 500 Record sets configured in your DNS zone, and the zone has the default Record set limit of 5000. The RecordSetCapacityUtilization metric shows the value of 10%, which is obtained by dividing 500 by 5000. 

To view this metric, select **Metrics** explorer experience from the **Monitor** tab in the Azure portal. Scope down to your DNS zone and then select **Apply**. In the drop-down for *Metrics*, select `Record Set Capacity Utilization`, and then select `Sum` from the drop-down for *Aggregation*.

:::image type="content" source="./media/dns-alerts-metrics/dns-metrics-record-set-capacity-uitlization.png" alt-text="Screenshot shows a graph of the Record Set Capacity Utilization metric in the Azure portal." lightbox="./media/dns-alerts-metrics/dns-metrics-record-set-capacity-uitlization.png":::

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- EndpointId

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Network/dnsResolverPolicies

[!INCLUDE [Microsoft.Network/dnsResolverPolicies](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-dnsresolverpolicies-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Azure DNS Microsoft.Network/dnsResolverPolicies

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [DNSQueryLogs](/azure/azure-monitor/reference/tables/dnsquerylogs#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Network resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

## Related content

- See [Monitor Azure DNS](monitor-dns.md) for a description of monitoring Azure DNS.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
