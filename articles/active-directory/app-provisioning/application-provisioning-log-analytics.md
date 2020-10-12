---
title: Understand how Application Provisioning integrates with Azure Monitor logs in Azure Active Directory.
description: Understand how Application Provisioning integrates with Azure Monitor logs in Azure Active Directory.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: conceptual
ms.workload: identity
ms.date: 10/12/2020
ms.author: kenwith
ms.reviewer: arvinh,luleon
---

# Understand how Application Provisioning integrates with Azure Monitor logs

Application Provisioning integrates with Azure Monitor logs and Log Analytics. With Azure Monitoring you can do things like create workbooks, also known as dashboards, store provisioning logs for 30+ days, and create custom queries and alerts.

## Enabling Application Provisioning logs

You should already be familiar with Azure Monitoring and Log Analytics. If not, jump over to learn about them and then come back to learn about Application Provisioning logs. To learn more about Azure Monitoring, see [Azure Monitor overview](../../azure-monitor/overview.md). To learn more about Azure Monitor logs and Log Analytics, see [Overview of log queries in Azure Monitor](../../azure-monitor/log-query/log-query-overview.md).

Once you've configured on Azure Monitoring, you can enable logs for Application Provisioning. The option is located on the **Diagnostics settings** page.

:::image type="content" source="media/application-provisioning-log-analytics/diagnostic-settings.png" alt-text="Access diagnostic settings" lightbox="media/application-provisioning-log-analytics/diagnostic-settings.png":::

:::image type="content" source="media/application-provisioning-log-analytics/enable-log-analytics.png" alt-text="Enable Application Provisioning logs" lightbox="media/application-provisioning-log-analytics/enable-log-analytics.png":::

> [!NOTE]
> If you have just recently provisioned a workspace, it can take some time before you can send logs to it. If you receive an error that the subscription is not registered to use *microsoft.insights* then check back after a few minutes.
 
## Understanding the data
The underlying data stream that Application Provisioning sends to Azure Monitor logs is almost the same as what you see in the provisioning logs in the Azure portal UI and Azure API. There are only a few **differences** in the log fields as outlined in the following table.

|Azure Monitor logs   |Azure portal UI   |Azure API |
|----------|-----------|------------|
|errorDescription |reason |resultDescription |
|status |resultType |resultType |
|activityDateTime |TimeGenerated |TimeGenerated |


## Azure Monitor workbooks

Azure Monitor workbooks provide a flexible canvas for data analysis. They also provide for the creation of rich visual reports within the Azure portal. To learn more, see [Azure Monitor Workbooks overview](../../azure-monitor/platform/workbooks-overview.md).

Application Provisioning comes with a set of pre-built workbooks. You can find them on the Workbooks page. To view the data, you'll need to ensure that all the filters (timeRange, jobID, appName) are populated. You'll also need to make sure you've provisioned an app, otherwise there won't be any data in the logs.

:::image type="content" source="media/application-provisioning-log-analytics/workbooks.png" alt-text="Application Provisioning workbooks" lightbox="media/application-provisioning-log-analytics/workbooks.png":::

:::image type="content" source="media/application-provisioning-log-analytics/report.png" alt-text="Application Provisioning dashboard" lightbox="media/application-provisioning-log-analytics/report.png":::

## Custom queries

You can create custom queries and show the data on Azure dashboards. To learn how, see [Create and share dashboards of Log Analytics data](../../azure-monitor/log-query/get-started-queries.md) and [Overview of log queries in Azure Monitor](../../azure-monitor/log-query/log-query-overview.md).

Here are some samples to get started with Application Provisioning.

Query the logs for a user a based on their ID in the source system:
```kusto
AADProvisioningLogs
| extend SourceIdentity = parse_json(SourceIdentity)
| where tostring(SourceIdentity.Id) == "49a4974bb-5011-415d-b9b8-78caa7024f9a"
```

Summarize count per ErrorCode:
```kusto
AADProvisioningLogs
| summarize count() by ErrorCode = ResultSignature
```

Summarize count of events per day by action:
```kusto
AADProvisioningLogs
| where TimeGenerated > ago(7d)
| summarize count() by Action, bin(TimeGenerated, 1d)
```

Take 100 events and project key properties:
```kusto
AADProvisioningLogs
| extend SourceIdentity = parse_json(SourceIdentity)
| extend TargetIdentity = parse_json(TargetIdentity)
| extend ServicePrincipal = parse_json(ServicePrincipal)
| where tostring(SourceIdentity.identityType) == "Group"
| project tostring(ServicePrincipal.Id), tostring(ServicePrincipal.Name), ModifiedProperties, JobId, Id, CycleId, ChangeId, Action, SourceIdentity.identityType, SourceIdentity.details, TargetIdentity.identityType, TargetIdentity.details, ProvisioningSteps
|take 100
```

## Custom alerts

Azure Monitor lets you configure custom alerts so that you can get notified about key events related to Application Provisioning. For example, you might want to receive an alert on spikes in failures, disables, or deletes. Another example of where you might want to be alerted is a lack of any provisioning, which indicates something is wrong.

To learn more about alerts, see [Respond to events with Azure Monitor Alerts](../../azure-monitor/learn/tutorial-response.md).

Alert when there's a spike in failures. Replace the jobID with the jobID for your application.

:::image type="content" source="media/application-provisioning-log-analytics/alert1.png" alt-text="Alert when there's a spike in failures." lightbox="media/application-provisioning-log-analytics/alert1.png":::

There may be an issue that caused the provisioning service to stop running. Use the following alert to detect when there are no provisioning events during a given time interval.

:::image type="content" source="media/application-provisioning-log-analytics/alert2.png" alt-text="There may be an issue that caused the provisioning service to stop running." lightbox="media/application-provisioning-log-analytics/alert2.png":::

Alert when there's a spike in disables or deletes.

:::image type="content" source="media/application-provisioning-log-analytics/alert3.png" alt-text="Alert when there's a spike in disables or deletes." lightbox="media/application-provisioning-log-analytics/alert3.png":::


## Community contributions

We're taking an open source and community-based approach to Application Provisioning queries and dashboards. If you've built a query, alert, or workbook that you think others would find useful, be sure to publish it to the AzureMonitorCommunity GitHub repo. Then shoot us an email with a link. We'll review and publish it to the service so others can benefit too. You can contact us at provisioningfeedback@microsoft.com.

## Next steps

- [Log analytics](../reports-monitoring/howto-analyze-activity-logs-log-analytics.md)
- [Get started with queries in Azure Monitor logs](../../azure-monitor/log-query/get-started-queries.md)
- [Create and manage alert groups in the Azure portal](../../azure-monitor/platform/action-groups.md)
- [Install and use the log analytics views for Azure Active Directory](../reports-monitoring/howto-install-use-log-analytics-views.md)
- [Provisioning logs API](https://docs.microsoft.com/graph/api/resources/provisioningobjectsummary?view=graph-rest-beta.md&preserve-view=true)
