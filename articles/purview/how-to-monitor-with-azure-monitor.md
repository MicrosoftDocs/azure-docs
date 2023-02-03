---
title: How to monitor Microsoft Purview
description: Learn how to configure Microsoft Purview metrics, alerts, and diagnostic settings by using Azure Monitor.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.topic: how-to
ms.date: 04/07/2022
ms.custom: subject-rbac-steps
---
# Microsoft Purview metrics in Azure Monitor

This article describes how to configure metrics, alerts, and diagnostic settings for Microsoft Purview using Azure Monitor.

## Monitor Microsoft Purview

Microsoft Purview admins can use Azure Monitor to track the operational state of Microsoft Purview account. Metrics are collected to provide data points for you to track potential problems, troubleshoot, and improve the reliability of the Microsoft Purview account. The metrics are sent to Azure monitor for events occurring in Microsoft Purview.

## Aggregated metrics

The metrics can be accessed from the Azure portal for a Microsoft Purview account. Access to the metrics is controlled by the role assignment of Microsoft Purview account. Users need to be part of the "Monitoring Reader" role in Microsoft Purview to see the metrics. Check out [Monitoring Reader Role permissions](../azure-monitor/roles-permissions-security.md#built-in-monitoring-roles) to learn more about the roles access levels.

The person who created the Microsoft Purview account automatically gets permissions to view metrics. If anyone else wants to see metrics, add them to the **Monitoring Reader** role, by following these steps:

### Add a user to the Monitoring Reader role

To add a user to the **Monitoring Reader** role, the owner of Microsoft Purview account or the Subscription owner can follow these steps:

1. Go to the [Azure portal](https://portal.azure.com) and search for the Microsoft Purview account name.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | Role | Monitoring Reader |
    | Assign access to | User, group, or service principal |
    | Members | &lt;Azure AD account user&gt; |

    :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-page.png" alt-text="Screenshot showing Add role assignment page in Azure portal.":::

## Metrics visualization

Users in the **Monitoring Reader** role can see the aggregated metrics and diagnostic logs sent to Azure Monitor. The metrics are listed in the Azure portal for the corresponding Microsoft Purview account. In the Azure portal, select the Metrics section to see the list of all available metrics.

   :::image type="content" source="./media/how-to-monitor-with-azure-monitor/purview-metrics.png" alt-text="Screenshot showing available Microsoft Purview metrics section." lightbox="./media/how-to-monitor-with-azure-monitor/purview-metrics.png":::

Microsoft Purview users can also access the metrics page directly from the management center of the Microsoft Purview account. Select Azure Monitor in the main page of Microsoft Purview management center to launch Azure portal.

   :::image type="content" source="./media/how-to-monitor-with-azure-monitor/launch-metrics-from-management.png" alt-text="Screenshot to launch Microsoft Purview metrics from management center." lightbox="./media/how-to-monitor-with-azure-monitor/launch-metrics-from-management.png":::

### Available metrics

To get familiarized with how to use the metric section in the Azure portal pre read the following two documents. [Getting started with Metric Explorer](../azure-monitor/essentials/metrics-getting-started.md) and [Advanced features of Metric Explorer](../azure-monitor/essentials/metrics-charts.md).

The following table contains the list of metrics available to explore in the Azure portal:

| Metric Name | Metric Namespace | Aggregation type | Description |
| ------------------- | ------------------- | ------------------- | ----------------- |
| Data Map Capacity Units | Elastic data map | Sum <br> Count | Aggregate the elastic data map capacity units over time period |
| Data Map Storage Size | Elastic data map | Sum <br> Avg | Aggregate the elastic data map storage size over time period |
| Scan Canceled | Automated scan | Sum <br> Count | Aggregate the canceled data source scans over time period |
| Scan Completed | Automated scan | Sum <br> Count | Aggregate the completed data source scans over time period |
| Scan Failed | Automated scan | Sum <br> Count | Aggregate the failed data source scans over time period |
| Scan time taken | Automated scan | Min <br> Max <br> Sum <br> Avg | Aggregate the total time taken by scans over time period |

## Sending Diagnostic Logs

Raw telemetry events are emitted to Azure Monitor. Events can be sent to a Log Analytics Workspace, archived to a customer storage account of choice, streamed to an event hub or sent to a partner solution for further analysis. Exporting of logs is done via the Diagnostic settings for the Microsoft Purview account on the Azure portal.

Follow the steps to create a Diagnostic setting for your Microsoft Purview account and send to your preferred destination.

Create a new diagnostic setting to collect platform logs and metrics by following this article: [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md).

   :::image type="content" source="./media/how-to-monitor-with-azure-monitor/step-one-diagnostic-setting.png" alt-text="Screenshot showing creating diagnostic log." lightbox="./media/how-to-monitor-with-azure-monitor/step-one-diagnostic-setting.png":::

You can send your logs to: 
- [A log analytics workspace](#destination---log-analytics-workspace)
- [A storage account](#destination---storage-account)
   
#### Destination - Log Analytics Workspace
Select the destination to a log analytics workspace to send the event to. Create a name for the diagnostic setting, select the applicable log category group and select the right subscription and workspace, then click save. The workspace doesn't have to be in the same region as the resource being monitored. Follow this article to [Create a New Log Analytics Workspace](../azure-monitor/logs/quick-create-workspace.md).

   :::image type="content" source="./media/how-to-monitor-with-azure-monitor/step-two-diagnostic-setting.png" alt-text="Screenshot showing assigning log analytics workspace to send event to." lightbox="./media/how-to-monitor-with-azure-monitor/step-two-diagnostic-setting.png":::

   :::image type="content" source="./media/how-to-monitor-with-azure-monitor/step-two-one-diagnostic-setting.png" alt-text="Screenshot showing saved diagnostic log event to log analytics workspace." lightbox="./media/how-to-monitor-with-azure-monitor/step-two-one-diagnostic-setting.png":::

Verify the changes in **Log Analytics Workspace** by perfoming some operations to populate data such as creating/updating/deleting policy. After which you can open the **Log Analytics Workspace**, navigate to **Logs**, enter query filter as **"purviewsecuritylogs"**, then click **"Run"** to execute the query. 

   :::image type="content" source="./media/how-to-monitor-with-azure-monitor/step-two-two-diagnostic-setting.png" alt-text="Screenshot showing log results in the Log Analytics Workspace after a query was run." lightbox="./media/how-to-monitor-with-azure-monitor/step-two-two-diagnostic-setting.png":::

#### Destination - Storage account
To log the events to a storage account; create a diagnostic setting name, select the log category,. select the destination as archieve to a storage account, select the right subscription and storage account then click save. A dedicated storage account is recommended for archiving the diagnostic logs. Following this article to [Create a storage account](../storage/common/storage-account-create.md?tabs=azure-portal).

   :::image type="content" source="./media/how-to-monitor-with-azure-monitor/step-three-diagnostic-setting.png" alt-text="Screenshot showing assigning storage account for diagnostic log." lightbox="./media/how-to-monitor-with-azure-monitor/step-three-diagnostic-setting.png":::

   :::image type="content" source="./media/how-to-monitor-with-azure-monitor/step-three-one-diagnostic-setting.png" alt-text="Screenshot showing saved log events to storage account." lightbox="./media/how-to-monitor-with-azure-monitor/step-three-one-diagnostic-setting.png":::
   
To see logs in the **Storage Account**, create/update/delete a policy, then open the **Storage Account**, navigate to **Containers**, and click on the container name

   :::image type="content" source="./media/how-to-monitor-with-azure-monitor/step-three-two-diagnostic-setting.png" alt-text="Screenshot showing container in storage account where the diagnostic logs have been sent to." lightbox="./media/how-to-monitor-with-azure-monitor/step-three-two-diagnostic-setting.png":::

Navigate to the flie and download it to see the logs

   :::image type="content" source="./media/how-to-monitor-with-azure-monitor/step-three-three-diagnostic-setting.png" alt-text="Screenshot showing folders with details of logs." lightbox="./media/how-to-monitor-with-azure-monitor/step-three-three-diagnostic-setting.png":::

   :::image type="content" source="./media/how-to-monitor-with-azure-monitor/step-three-four-diagnostic-setting.png" alt-text="Screenshot showing details of logs." lightbox="./media/how-to-monitor-with-azure-monitor/step-three-four-diagnostic-setting.png":::

## Next steps

[Elastic data map in Microsoft Purview](concept-elastic-data-map.md)
