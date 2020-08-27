---
title: Manage your SOC better with incident metrics in Azure Sentinel | Microsoft Docs
description: Use information from the Azure Sentinel incident metrics screen and workbook to help you manage your Security Operations Center (SOC).
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/11/2020
ms.author: yelevin

---
# Manage your SOC better with incident metrics

> [!IMPORTANT]
> The incident metrics features are currently in public preview.
> These features are provided without a service level agreement, and are not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

As a Security Operations Center (SOC) manager, you need to have overall efficiency metrics and measures at your fingertips to gauge the performance of your team. You'll want to see incident operations over time by many different criteria, like severity, MITRE tactics, mean time to triage, mean time to resolve, and more. Azure Sentinel now makes this data available to you with the new **SecurityIncident** table and schema in Log Analytics and the accompanying **Security operations efficiency** workbook. You'll be able to visualize your team's performance over time and use this insight to improve efficiency. You can also write and use your own KQL queries against the incident table to create customized workbooks that fit your specific auditing needs and KPIs.

## Use the security incidents table

The **SecurityIncident** table is built into Azure Sentinel. You'll find it with the other tables in the **SecurityInsights** collection under **Logs**. You can query it like any other table in Log Analytics.

:::image type="content" source="./media/manage-soc-with-incident-metrics/security-incident-table.png" alt-text="Security incidents table":::

Every time you create or update an incident, a new log entry will be added to the table. This allows you to track the changes made to incidents, and allows for even more powerful SOC metrics, but you need to be mindful of this when constructing queries for this table as you may need to remove duplicate entries for an incident (dependent on the exact query you are running). 

For example, if you wanted to return a list of all incidents sorted by their incident number but only wanted to return the most recent log per incident, you could do this using the KQL [summarize operator](https://docs.microsoft.com/azure/data-explorer/kusto/query/summarizeoperator) with the `arg_max()` [aggregation function](https://docs.microsoft.com/azure/data-explorer/kusto/query/arg-max-aggfunction):


```Kusto
SecurityIncident
| summarize arg_max(LastModifiedTime, *) by IncidentNumber
```
### More sample queries

Mean time to closure:
```Kusto
SecurityIncident
| summarize arg_max(TimeGenerated,*) by IncidentNumber 
| extend TimeToClosure =  (ClosedTime - CreatedTime)/1h
| summarize 5th_Percentile=percentile(TimeToClosure, 5),50th_Percentile=percentile(TimeToClosure, 50), 
  90th_Percentile=percentile(TimeToClosure, 90),99th_Percentile=percentile(TimeToClosure, 99)
```

Mean time to triage:
```Kusto
SecurityIncident
| summarize arg_max(TimeGenerated,*) by IncidentNumber 
| extend TimeToTriage =  (FirstModifiedTime - CreatedTime)/1h
| summarize 5th_Percentile=max_of(percentile(TimeToTriage, 5),0),50th_Percentile=percentile(TimeToTriage, 50), 
  90th_Percentile=percentile(TimeToTriage, 90),99th_Percentile=percentile(TimeToTriage, 99) 
```

## Security operations efficiency workbook

To complement the **SecurityIncidents** table, we’ve provided you an out-of-the-box **security operations efficiency** workbook template that you can use to monitor your SOC operations. The workbook contains the following metrics: 
- Incident created over time 
- Incidents created by closing classification, severity, owner, and status 
- Mean time to triage 
- Mean time to closure 
- Incidents created by severity, owner, status, product, and tactics over time 
- Time to triage percentiles 
- Time to closure percentiles 
- Mean time to triage per owner 
- Recent activities 
- Recent closing classifications  

You can find this new workbook template by choosing **Workbooks** from the Azure Sentinel navigation menu and selecting the **Templates** tab. Choose **Security operations efficiency** from the gallery and click one of the **View saved workbook** and **View template** buttons.

:::image type="content" source="./media/manage-soc-with-incident-metrics/security-incidents-workbooks-gallery.png" alt-text="Security incidents workbook gallery":::

:::image type="content" source="./media/manage-soc-with-incident-metrics/security-operations-workbook-1.png" alt-text="Security incidents workbook complete":::

You can use the template to create your own custom workbooks tailored to your specific needs.

## SecurityIncidents schema

[!INCLUDE [SecurityIncidents schema](../../includes/sentinel-schema-security-incident.md)]

## Next steps

- To get started with Azure Sentinel, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Azure Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](quickstart-get-visibility.md).
