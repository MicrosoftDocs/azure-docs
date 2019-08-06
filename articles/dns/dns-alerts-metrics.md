---
title: Azure DNS metrics and alerts | Microsoft Docs
description: Learn about Azure DNS metrics and alerts.
services: dns
documentationcenter: na
author: vhorne
manager: jennoc
editor: ''

ms.assetid: 
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/17/2018
ms.author: victorh
---

# Azure DNS metrics and alerts
Azure DNS is a hosting service for DNS domains that provides name resolution using the Microsoft Azure infrastructure. This article describes metrics and alerts for the Azure DNS service.

## Azure DNS metrics

Azure DNS provides metrics for customers to enable them to monitor specific aspects of their DNS zones hosted in the service. In addition, with Azure DNS metrics, you can configure and receive alerts based on conditions of interest. The metrics are provided via the [Azure Monitor service](../azure-monitor/index.yml). 
Azure DNS provides the following metrics via Azure Monitor for your DNS zones:

-	QueryVolume
-	RecordSetCount
-	RecordSetCapacityUtilization

You can also see the [definition of these metrics](../azure-monitor/platform/metrics-supported.md#microsoftnetworkdnszones) on the Azure Monitor documentation page.
>[!NOTE]
> At this time, these metrics are only available for Public DNS zones hosted in Azure DNS. If you have Private Zones hosted in Azure DNS, these metrics will not provide data for those zones. In addition, the metrics and alerting feature is only supported in Azure Public cloud. Support for sovereign clouds will follow at a later time. 

The most granular element that you can see metrics for is a DNS zone. You cannot currently see metrics for individual resource records within a zone.

### Query volume

The *Query Volume* metric in Azure DNS shows the volume of DNS queries (query traffic) that is received by Azure DNS for your DNS zone. The unit of measurement is Count and the aggregation is the total of all the queries received over a period of time. 

To view this metric, select Metrics (preview) explorer experience from the Monitor tab in the Azure portal. Select your DNS zone from the Resource drop-down, select the Query Volume metric, and select Sum as the Aggregation. Below screenshot shows an example.  For more information on the Metrics Explorer experience and charting, see [Azure Monitor Metrics Explorer](../azure-monitor/platform/metrics-charts.md).

![Query volume](./media/dns-alerts-metrics/dns-metrics-query-volume.png)

*Figure: Azure DNS Query Volume metrics*

### Record Set Count
The *Record Set Count* metric shows the number of Recordsets in Azure DNS for your DNS zone. All the Recordsets defined in your zone are counted. The unit of measurement is Count and the aggregation is the Maximum of all the Recordsets. 
To view this metric, select **Metrics (preview)** explorer experience from the **Monitor** tab in the Azure portal. Select your DNS zone from the **Resource** drop-down, select the **Record Set Count** metric, and then select **Max** as the **Aggregation**. For more information on the Metrics Explorer experience and charting, see [Azure Monitor Metrics Explorer](../azure-monitor/platform/metrics-charts.md). 

![Record Set Count](./media/dns-alerts-metrics/dns-metrics-record-set-count.png)

*Figure: Azure DNS Record Set Count metrics*


### Record Set Capacity Utilization
The *Record Set Capacity Utilization* metric in Azure DNS shows the percentage of utilization of your Recordset capacity for a DNS Zone. Every DNS zone in Azure DNS is subject to a Recordset limit that defines the maximum number of Recordsets that are allowed for the Zone (see [DNS limits](dns-zones-records.md#limits)). Hence, this metric shows you how close you are to hitting the Recordset limit. 
For example, if you have 500 Recordsets configured for your DNS zone, and the zone has the default Recordset limit of 5000, the RecordSetCapacityUtilization metric will show the value of 10% (which is obtained by dividing 500 by 5000). 
The unit of measurement is **Percentage** and the **Aggregation** type is **Maximum**. 
To view this metric, select Metrics (preview) explorer experience from the Monitor tab in the Azure portal. Select your DNS zone from the Resource drop-down, select the Record Set Capacity Utilization metric, and select Max as the Aggregation. Below screenshot shows an example. For more information on the Metrics Explorer experience and charting, see [Azure Monitor Metrics Explorer](../azure-monitor/platform/metrics-charts.md). 

![Record Set Count](./media/dns-alerts-metrics/dns-metrics-record-set-capacity-uitlization.png)

*Figure: Azure DNS Record Set Capacity Utilization metrics*

## Alerts in Azure DNS
Azure Monitor provides the capability to alert against available metric values. The DNS metrics are available in the new Alert configuration experience. As described in detail in the [Azure Monitor alerts documentation](../monitoring-and-diagnostics/monitor-alerts-unified-usage.md), you can select DNS Zone as the resource, choose the Metric signal type, and configure the alert logic and other parameters such as **Period** and **Frequency**. You can further define an [Action Group](../azure-monitor/platform/action-groups.md) for when the alert condition is met, whereby the alert will be delivered via the chosen actions. 
For more information on how to configure alerting for Azure Monitor metrics, see [Create, view, and manage alerts using Azure Monitor](../monitoring-and-diagnostics/monitor-alerts-unified-usage.md). 

## Next steps
- Learn more about [Azure DNS](dns-overview.md).
