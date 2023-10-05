---
title: Manage your SOC better with incident metrics in Microsoft Sentinel | Microsoft Docs
description: Use information from the Microsoft Sentinel incident metrics screen and workbook to help you manage your Security Operations Center (SOC).
author: yelevin
ms.topic: how-to
ms.custom: mvc, ignite-fall-2021
ms.date: 11/09/2021
ms.author: yelevin
---

# Manage your SOC better with incident metrics

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

As a Security Operations Center (SOC) manager, you need to have overall efficiency metrics and measures at your fingertips to gauge the performance of your team. You'll want to see incident operations over time by many different criteria, like severity, MITRE tactics, mean time to triage, mean time to resolve, and more. Microsoft Sentinel now makes this data available to you with the new **SecurityIncident** table and schema in Log Analytics and the accompanying **Security operations efficiency** workbook. You'll be able to visualize your team's performance over time and use this insight to improve efficiency. You can also write and use your own KQL queries against the incident table to create customized workbooks that fit your specific auditing needs and KPIs.

## Use the security incidents table

The **SecurityIncident** table is built into Microsoft Sentinel. You'll find it with the other tables in the **SecurityInsights** collection under **Logs**. You can query it like any other table in Log Analytics.

:::image type="content" source="./media/manage-soc-with-incident-metrics/security-incident-table.png" alt-text="Security incidents table":::

Every time you create or update an incident, a new log entry will be added to the table. This allows you to track the changes made to incidents, and allows for even more powerful SOC metrics, but you need to be mindful of this when constructing queries for this table as you may need to remove duplicate entries for an incident (dependent on the exact query you are running). 

For example, if you wanted to return a list of all incidents sorted by their incident number but only wanted to return the most recent log per incident, you could do this using the KQL [summarize operator](/azure/data-explorer/kusto/query/summarizeoperator) with the `arg_max()` [aggregation function](/azure/data-explorer/kusto/query/arg-max-aggfunction):

```Kusto
SecurityIncident
| summarize arg_max(LastModifiedTime, *) by IncidentNumber
```
### More sample queries

Incident state - all incidents by status and severity in a given time frame:

```Kusto
let startTime = ago(14d);
let endTime = now();
SecurityIncident
| where TimeGenerated >= startTime
| summarize arg_max(TimeGenerated, *) by IncidentNumber
| where LastModifiedTime  between (startTime .. endTime)
| where Status in  ('New', 'Active', 'Closed')
| where Severity in ('High','Medium','Low', 'Informational')
```

Closure time by percentile:
```Kusto
SecurityIncident
| summarize arg_max(TimeGenerated,*) by IncidentNumber 
| extend TimeToClosure =  (ClosedTime - CreatedTime)/1h
| summarize 5th_Percentile=percentile(TimeToClosure, 5),50th_Percentile=percentile(TimeToClosure, 50), 
  90th_Percentile=percentile(TimeToClosure, 90),99th_Percentile=percentile(TimeToClosure, 99)
```

Triage time by percentile:
```Kusto
SecurityIncident
| summarize arg_max(TimeGenerated,*) by IncidentNumber 
| extend TimeToTriage =  (FirstModifiedTime - CreatedTime)/1h
| summarize 5th_Percentile=max_of(percentile(TimeToTriage, 5),0),50th_Percentile=percentile(TimeToTriage, 50), 
  90th_Percentile=percentile(TimeToTriage, 90),99th_Percentile=percentile(TimeToTriage, 99) 
```

## Security operations efficiency workbook

To complement the **SecurityIncidents** table, we’ve provided you with an out-of-the-box **security operations efficiency** workbook template that you can use to monitor your SOC operations. The workbook contains the following metrics: 
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

You can find this new workbook template by choosing **Workbooks** from the Microsoft Sentinel navigation menu and selecting the **Templates** tab. Choose **Security operations efficiency** from the gallery and click one of the **View saved workbook** and **View template** buttons.

:::image type="content" source="./media/manage-soc-with-incident-metrics/security-incidents-workbooks-gallery.png" alt-text="Security incidents workbook gallery":::

:::image type="content" source="./media/manage-soc-with-incident-metrics/security-operations-workbook-1.png" alt-text="Security incidents workbook complete":::

You can use the template to create your own custom workbooks tailored to your specific needs.

## SecurityIncidents schema

[!INCLUDE [SecurityIncidents schema](includes/sentinel-schema-security-incident.md)]

## Next steps

- To get started with Microsoft Sentinel, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Microsoft Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](get-visibility.md).
