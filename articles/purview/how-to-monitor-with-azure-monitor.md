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

The metrics can be accessed from the Azure portal for a Microsoft Purview account. Access to the metrics are controlled by the role assignment of Microsoft Purview account. Users need to be part of the "Monitoring Reader" role in Microsoft Purview to see the metrics. Check out [Monitoring Reader Role permissions](../azure-monitor/roles-permissions-security.md#built-in-monitoring-roles) to learn more about the roles access levels.

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

## Diagnostic Logs to Azure Storage account

Raw telemetry events are emitted to Azure Monitor. Events can be logged to a customer storage account of choice for further analysis. Exporting of logs is done via the Diagnostic settings for the Microsoft Purview account on the Azure portal.

Follow the steps to create a Diagnostic setting for your Microsoft Purview account.

1. Create a new diagnostic setting to collect platform logs and metrics by following this article: [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md). Select the destination only as Azure storage account.

   :::image type="content" source="./media/how-to-monitor-with-azure-monitor/step-one-diagnostic-setting.png" alt-text="Screenshot showing creating diagnostic log." lightbox="./media/how-to-monitor-with-azure-monitor/step-one-diagnostic-setting.png":::

2. Log the events to a storage account. A dedicated storage account is recommended for archiving the diagnostic logs. Following this article to [Create a storage account](../storage/common/storage-account-create.md?tabs=azure-portal).

   :::image type="content" source="./media/how-to-monitor-with-azure-monitor/step-two-diagnostic-setting.png" alt-text="Screenshot showing assigning storage account for diagnostic log." lightbox="./media/how-to-monitor-with-azure-monitor/step-two-diagnostic-setting.png":::

Allow up to 15 minutes to start receiving logs in the newly created storage account. [See data retention and schema of resource logs in Azure Storage account](../azure-monitor/essentials/resource-logs.md#send-to-azure-storage). Once the diagnostic logs are configured, the events flow to the storage account.

### ScanStatusLogEvent

The event tracks the scan life cycle. A scan operation follows progress through a sequence of states, from Queued, Running and finally a terminal state of Succeeded | Failed | Canceled. An event is logged for each state transition and the schema of the event will have the following properties.

```JSON
{
  "time": "<The UTC time when the event occurred>",
  "properties": {
    "dataSourceName": "<Registered data source friendly name>",
    "dataSourceType": "<Registered data source type>",
    "scanName": "<Scan instance friendly name>",
    "assetsDiscovered": "<If the resultType is succeeded, count of assets discovered in scan run>",
    "assetsClassified": "<If the resultType is succeeded, count of assets classified in scan run>",
    "scanQueueTimeInSeconds": "<If the resultType is succeeded, total seconds the scan instance in queue>",
    "scanTotalRunTimeInSeconds": "<If the resultType is succeeded, total seconds the scan took to run>",
    "runType": "<How the scan is triggered>",
    "errorDetails": "<Scan failure error>",
    "scanResultId": "<Unique GUID for the scan instance>"
  },
  "resourceId": "<The azure resource identifier>",
  "category": "<The diagnostic log category>",
  "operationName": "<The operation that cause the event Possible values for ScanStatusLogEvent category are: 
                    |AdhocScanRun 
                    |TriggeredScanRun 
                    |StatusChangeNotification>",
  "resultType": "Queued – indicates a scan is queued. 
                 Running – indicates a scan entered a running state. 
                 Succeeded – indicates a scan completed successfully. 
                 Failed – indicates a scan failure event. 
                 Cancelled – indicates a scan was cancelled. ",
  "resultSignature": "<Not used for ScanStatusLogEvent category. >",
  "resultDescription": "<This will have an error message if the resultType is Failed. >",
  "durationMs": "<Not used for ScanStatusLogEvent category. >",
  "level": "<The log severity level. Possible values are:
            |Informational
            |Error >",
  "location": "<The location of the Microsoft Purview account>",
}
```

The Sample log for an event instance is shown in the below section.

```JSON
{
  "time": "2020-11-24T20:25:13.022860553Z",
  "properties": {
    "dataSourceName": "AzureDataExplorer-swD",
    "dataSourceType": "AzureDataExplorer",
    "scanName": "Scan-Kzw-shoebox-test",
    "assetsDiscovered": "0",
    "assetsClassified": "0",
    "scanQueueTimeInSeconds": "0",
    "scanTotalRunTimeInSeconds": "0",
    "runType": "Manual",
    "errorDetails": "empty_value",
    "scanResultId": "0dc51a72-4156-40e3-8539-b5728394561f"
  },
  "resourceId": "/SUBSCRIPTIONS/111111111111-111-4EB2/RESOURCEGROUPS/FOOBAR-TEST-RG/PROVIDERS/MICROSOFT.PURVIEW/ACCOUNTS/FOOBAR-HEY-TEST-NEW-MANIFEST-EUS",
  "category": "ScanStatusLogEvent",
  "operationName": "TriggeredScanRun",
  "resultType": "Delayed",
  "resultSignature": "empty_value",
  "resultDescription": "empty_value",
  "durationMs": 0,
  "level": "Informational",
  "location": "eastus",
}
```

## Next steps

[Elastic data map in Microsoft Purview](concept-elastic-data-map.md)
