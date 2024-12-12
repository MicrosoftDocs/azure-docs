---
title: Monitor Azure File Sync
description: Learn how to monitor Azure File Sync using Azure Monitor, including data collection, analysis, and alerting.
ms.date: 12/12/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: khdownie
ms.author: kendownie
ms.service: azure-file-storage
---

<!-- 
According to the Content Pattern guidelines, all comments must be removed before publication!!!
IMPORTANT 
When using this template, first:
1. Search and replace [TODO-replace-with-service-name] with the official name of your service.
2. Search and replace [TODO-replace-with-service-filename] with the service name to use in GitHub filenames.-->

<!-- VERSION 4.0 November 2024
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Add service-specific information after the includes.
Your service should have the following two articles:
1. The overview monitoring article (based on this template)
   - Title: "Monitor [TODO-replace-with-service-name]"
   - TOC title: "Monitor [TODO-replace-with-service-name]"
   - Filename: "monitor-[TODO-replace-with-service-filename].md"
2. A reference article that lists all the metrics and logs for your service (based on the template data-reference-template.md).
   - Title: "[TODO-replace-with-service-name] monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-[TODO-replace-with-service-filename]-reference.md".
-->

# Monitor Azure File Sync

[!INCLUDE [azmon-horz-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-intro.md)]

## Collect data with Azure Monitor

This table describes how you can collect data to monitor your service, and what you can do with the data once collected:

|Data to collect|Description|How to collect and route the data|Where to view the data|Supported data|
|---------|---------|---------|---------|---------|
|Metric data|Metrics are numerical values that describe an aspect of a system at a particular point in time. Metrics can be aggregated using algorithms, compared to other metrics, and analyzed for trends over time.|- Collected automatically at regular intervals.</br> - You can route some platform metrics to a Log Analytics workspace to query with other data. Check the **DS export** setting for each metric to see if you can use a diagnostic setting to route the metric data.|[Metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started)| [Azure File Sync metrics supported by Azure Monitor](monitor-file-sync-reference.md#metrics)|
|Resource log data|Logs are recorded system events with a timestamp. Logs can contain different types of data, and be structured or free-form text. You can route resource log data to Log Analytics workspaces for querying and analysis.|[Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to collect and route resource log data.| [Log Analytics](/azure/azure-monitor/learn/quick-create-workspace)|[Azure File Sync resource log data supported by Azure Monitor](monitor-file-sync-reference#resource-logs)  |
|Activity log data|The Azure Monitor activity log provides insight into subscription-level events. The activity log includes information like when a resource is modified or a virtual machine is started.|- Collected automatically.</br> - [Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to a Log Analytics workspace at no charge.|[Activity log](/azure/azure-monitor/essentials/activity-log)|  |

[!INCLUDE [azmon-horz-supported-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-supported-data.md)]

## Built in monitoring for Azure File Sync

To view the health of your Azure File Sync deployment in the **Azure portal**, navigate to the **Storage Sync Service**. The following information is available:

- Registered server health
- Server endpoint health

  - Persistent sync errors
  - Transient sync errors
  - Sync activity (Upload to cloud, Download to server)
  - Cloud tiering space savings
  - Tiering errors
  - Recall errors

- Metrics

### Registered server health

To view the **registered server health** in the portal, navigate to the **Registered servers** section of the **Storage Sync Service**.

:::image type="content" source="media/storage-sync-files-troubleshoot/file-sync-registered-servers.png" alt-text="Screenshot shows the registered servers page with server name and state.":::

- If the **Registered server** state is **Online**, the server is successfully communicating with the service.
- If the **Registered server** state is **Appears Offline**, the Storage Sync Monitor process (AzureStorageSyncMonitor.exe) isn't running or the server is unable to access the Azure File Sync service. For more information, see the [troubleshooting documentation](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-group-management?toc=/azure/storage/file-sync/toc.json#server-endpoint-noactivity).

### Server endpoint health

To view the health of a **server endpoint** in the portal, navigate to the **Sync groups** section of the **Storage Sync Service** and select a **sync group**.

:::image type="content" source="media/storage-sync-files-troubleshoot/file-sync-server-endpoint-health.png" alt-text="Screenshot that shows the server endpoint health in the Azure portal." border="true":::

- The **server endpoint health** and **sync activity** (Upload to cloud, Download to server) in the portal is based on the sync events that are logged in the Telemetry event log at the server (ID 9102 and 9302). If a sync session fails because of a transient error, such as error canceled, the server endpoint still shows as **Healthy** in the portal as long as the current sync session is making progress (files are applied). Event ID 9302 is the sync progress event and Event ID 9102 is logged once a sync session completes. For more information, see [sync health](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#broken-sync) and [sync progress](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#how-do-i-monitor-the-progress-of-a-current-sync-session). If the server endpoint health shows a status other than **Healthy**, see the [troubleshooting documentation](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#broken-sync) for guidance.
- The **Persistent sync errors** and **Transient sync errors** count in the portal is based on the Event ID 9121 that is logged in the Telemetry event log at the server. This event is logged for each per-item error once the sync session completes. To view the errors in the portal, go to the **Server Endpoint Properties** and navigate to the **Errors + troubleshooting** section. To resolve per-item errors, see [How do I see if there are specific files or folders that aren't syncing?](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#how-do-i-see-if-there-are-specific-files-or-folders-that-are-not-syncing).
- The **Cloud tiering space savings** provides the amount of disk space saved by cloud tiering. The data provided for **Cloud tiering space savings** is based on Event ID 9071 that is logged in the Telemetry event log at the server. To view other cloud tiering information and metrics, go to the **Server Endpoint Properties** and navigate to the **Cloud tiering status** section. To learn more, see [Monitor cloud tiering](file-sync-monitor-cloud-tiering.md).
- To view **Tiering errors** and **Recall errors** in the portal, go to the **Server Endpoint Properties** and navigate to the **Errors + troubleshooting** section. **Tiering errors** is based on Event ID 9003 that is logged in the Telemetry event log at the server and **Recall errors** is based on Event ID 9006. For more information about files that fail to tier or recall, see [How to troubleshoot files that fail to tier](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-cloud-tiering?toc=/azure/storage/file-sync/toc.json#how-to-troubleshoot-files-that-fail-to-tier) and [How to troubleshoot files that fail to be recalled](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-cloud-tiering?toc=/azure/storage/file-sync/toc.json#how-to-troubleshoot-files-that-fail-to-be-recalled).

### Metric charts

The following metric charts are viewable in the Storage Sync Service portal:

| Metric name | Description | Page name |
|-|-|-|
| Bytes synced | Size of data transferred (upload and download). | Server endpoint - Sync status |
| Files not syncing | Count of files that are failing to sync. | Server endpoint - Sync status |
| Files synced | Count of files transferred (upload and download). | Server endpoint - Sync status |
| Cloud tiering cache hit rate | Percentage of bytes, not whole files, that have been served from the cache vs. recalled from the cloud. | Server endpoint - Cloud tiering status |
| Cache data size by last access time | Size of data by last access time. | Server endpoint - Cloud tiering status |
| Cloud tiering size of data tiered by last maintenance job | Size of data tiered during last maintenance job. | Server endpoint - Cloud tiering status |
| Cloud tiering recall size by application | Size of data recalled by application. | Server endpoint - Cloud tiering status |  
| Cloud tiering recall | Size of data recalled. | Server endpoint - Cloud tiering status, Registered servers |
| Server online status | Count of heartbeats received from the server. | Registered servers |

> [!NOTE]
> The charts in the Storage Sync Service portal have a time range of 24 hours. To view different time ranges or dimensions, use Azure Monitor.

### Windows Server

On the **Windows Server** that has the Azure File Sync agent installed, you can view the health of the server endpoints on that server using the **event logs** and **performance counters**.

#### Event logs

To monitor registered server, sync, and cloud tiering health, use the Telemetry event server log. The Telemetry event log is located in Event Viewer under *Applications and Services\Microsoft\FileSync\Agent*.

- Sync health

  - Event ID 9102 is logged once a sync session completes. Use this event to determine if sync sessions are successful (**HResult = 0**) and if there are per-item sync errors (**PerItemErrorCount**). For more information, see the [sync health](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#broken-sync) and  [per-item errors](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#how-do-i-see-if-there-are-specific-files-or-folders-that-are-not-syncing) documentation.

    > [!NOTE]
    > Sometimes sync sessions fail overall or have a non-zero PerItemErrorCount. However, they still make forward progress, and some files sync successfully. You can see this in the Applied fields such as AppliedFileCount, AppliedDirCount, AppliedTombstoneCount, and AppliedSizeBytes. These fields tell you how much of the session succeeded. If you see multiple sync sessions fail in a row, and they have an increasing Applied count, give sync time to try again before you open a support ticket.

  - Event ID 9121 is logged for each per-item error once the sync session completes. Use this event to determine the number of files that are failing to sync with this error (**PersistentCount** and **TransientCount**). You should investigate persistent per-item errors. For more information, see [How do I see if there are specific files or folders that aren't syncing?](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#how-do-i-see-if-there-are-specific-files-or-folders-that-are-not-syncing).

  - Event ID 9302 is logged every 5 to 10 minutes if there's an active sync session. Use this event to determine how many items are to be synced (**TotalItemCount**), number of items that synced so far (**AppliedItemCount**) and number of items that failed to sync due to a per-item error (**PerItemErrorCount**). If sync isn't making progress (**AppliedItemCount=0**), the sync session eventually fails and an Event ID 9102 will be logged with the error. For more information, see the [sync progress documentation](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#how-do-i-monitor-the-progress-of-a-current-sync-session).

- Registered server health

  - Event ID 9301 is logged every 30 seconds when a server queries the service for jobs. If GetNextJob finishes with **status = 0**, the server is able to communicate with the service. If GetNextJob finishes with an error, check the [troubleshooting documentation](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-group-management?toc=/azure/storage/file-sync/toc.json#server-endpoint-noactivity) for guidance.

- Cloud tiering health

  - To monitor tiering activity on a server, use Event ID 9003, 9016 and 9029 in the Telemetry event log, which is located in Event Viewer under *Applications and Services\Microsoft\FileSync\Agent*.

    - Event ID 9003 provides error distribution for a server endpoint. For example: Total Error Count and ErrorCode. One event is logged per error code.
    - Event ID 9016 provides ghosting results for a volume. For example: Free space percent is, Number of files ghosted in session, and Number of files failed to ghost.
    - Event ID 9029 provides ghosting session information for a server endpoint. For example: Number of files attempted in the session, Number of files tiered in the session, and Number of files already tiered.

  - To monitor recall activity on a server, use Event ID 9005, 9006, 9009, 9059 and 9071 in the Telemetry event log, which is located in Event Viewer under *Applications and Services\Microsoft\FileSync\Agent*.

    - Event ID 9005 provides recall reliability for a server endpoint. For example: Total unique files accessed, and Total unique files with failed access.
    - Event ID 9006 provides recall error distribution for a server endpoint. For example: Total Failed Requests, and ErrorCode. One event is logged per error code.
    - Event ID 9009 provides recall session information for a server endpoint. For example: DurationSeconds, CountFilesRecallSucceeded, and CountFilesRecallFailed.
    - Event ID 9059 provides application recall distribution for a server endpoint. For example: ShareId, Application Name, and TotalEgressNetworkBytes.
    - Event ID 9071 provides cloud tiering efficiency for a server endpoint. For example: TotalDistinctFileCountCacheHit, TotalDistinctFileCountCacheMiss, TotalCacheHitBytes, and TotalCacheMissBytes.

#### Performance counters

Use the Azure File Sync performance counters on the server to monitor sync activity.

To view Azure File Sync (AFS) performance counters on the server, open Performance Monitor (Perfmon.exe). You can find the counters under the **AFS Bytes Transferred** and **AFS Sync Operations** objects.

The following performance counters for Azure File Sync are available in Performance Monitor:

| Performance Object\Counter Name | Description |
|-|-|
| AFS Bytes Transferred\Downloaded Bytes/sec | Number of bytes downloaded per second. |
| AFS Bytes Transferred\Uploaded Bytes/sec | Number of bytes uploaded per second. |
| AFS Bytes Transferred\Total Bytes/sec | Total bytes per second (upload and download). |
| AFS Sync Operations\Downloaded Sync Files/sec | Number of files downloaded per second. |
| AFS Sync Operations\Uploaded Sync Files/sec | Number of files uploaded per second. |
| AFS Sync Operations\Total Sync File Operations/sec | Total number of files synced (upload and download). |

[!INCLUDE [azmon-horz-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-tools.md)]

[!INCLUDE [azmon-horz-export-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-export-data.md)]

[!INCLUDE [azmon-horz-kusto](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-kusto.md)]

### Recommended Kusto queries for Azure File Sync

[!INCLUDE [azmon-horz-alerts-part-one](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-one.md)]

### Recommended Azure Monitor alert rules for Azure File Sync

The following table lists common and recommended alert rules for Azure File Sync.

| Scenario | Metric to use for alert |
|:-|:-|
| Server endpoint health shows an error in the portal | Sync session result |
| Files are failing to sync to a server or cloud endpoint | Files not syncing |
| Registered server is failing to communicate with the Storage Sync Service | Server online status |
| Cloud tiering recall size exceeded 500 GiB in a day  | Cloud tiering recall size |

[!INCLUDE [azmon-horz-alerts-part-two](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-two.md)]

### Alert Examples

This section provides some example alerts for Azure File Sync.

> [!NOTE]
> If you create an alert and it's too noisy, adjust the threshold value and alert logic.

To create an alert if the server endpoint health shows an error in the portal:

1. In the **Azure portal**, navigate to respective **Storage Sync Service**.
1. Go to the **Monitoring** section and select **Alerts**.
1. Select **+ New alert rule** to create a new alert rule.
1. Configure condition by clicking **Select condition**.
1. Within **Configure signal logic** section, select **Sync session result** under signal name.  
1. Select the following dimension configuration:
     - Dimension name: **Server Endpoint Name**  
     - Operator: **=**
     - Dimension values: **All current and future values**  
1. Navigate to **Alert Logic** and complete the following:
     - Threshold set to **Static**
     - Operator: **Less than**
     - Aggregation type: **Maximum**  
     - Threshold value: **1**
     - Evaluated based on: Aggregation granularity = **24 hours** | Frequency of evaluation = **Every hour**
     - Select **Done.**
1. Select **Select action group** to add an action group (email, SMS, etc.) to the alert either by selecting an existing action group or creating a new action group.
1. Fill in the **Alert details** like **Alert rule name**, **Description**, and **Severity**.
1. Select **Create alert rule**.

To create an alert if files are failing to sync to a server or cloud endpoint:

1. In the **Azure portal**, navigate to respective **Storage Sync Service**.
1. Go to the **Monitoring** section and select **Alerts**.
1. Select **+ New alert rule** to create a new alert rule.
1. Configure condition by selecting **Select condition**.
1. Within **Configure signal logic** section, select **Files not syncing** under signal name.  
1. Select the following dimension configuration:
     - Dimension name: **Server Endpoint Name**  
     - Operator: **=**
     - Dimension values: **All current and future values**  
1. Navigate to **Alert Logic** and complete the following:
     - Threshold set to **Static**
     - Operator: **Greater than**
     - Aggregation type: **Average**  
     - Threshold value: **100**
     - Evaluated based on: Aggregation granularity = **5 minutes** | Frequency of evaluation = **Every 5 minutes**
     - Select **Done.**
1. Select **Select action group** to add an action group (email, SMS, etc.) to the alert either by selecting an existing action group or creating a new action group.
1. Fill in the **Alert details** like **Alert rule name**, **Description**, and **Severity**.
1. Select **Create alert rule**.

To create an alert if a registered server is failing to communicate with the Storage Sync Service:

1. In the **Azure portal**, navigate to respective **Storage Sync Service**.
1. Go to the **Monitoring** section and select **Alerts**.
1. Select **+ New alert rule** to create a new alert rule.
1. Configure condition by selecting **Select condition**.
1. Within **Configure signal logic** section, select **Server online status** under signal name.  
1. Select the following dimension configuration:
     - Dimension name: **Server name**  
     - Operator: **=**
     - Dimension values: **All current and future values**  
1. Navigate to **Alert Logic** and complete the following:
     - Threshold set to **Static**
     - Operator: **Less than**
     - Aggregation type: **Maximum**  
     - Threshold value (in bytes): **1**
     - Evaluated based on: Aggregation granularity = **1 hour** | Frequency of evaluation = **Every 30 minutes**
         - The metrics are sent to Azure Monitor every 15 to 20 minutes. Don't set the **Frequency of evaluation** to less than 30 minutes, because doing so generates false alerts.
     - Select **Done.**
1. Select **Select action group** to add an action group (email, SMS, etc.) to the alert either by selecting an existing action group or creating a new action group.
1. Fill in the **Alert details** like **Alert rule name**, **Description**, and **Severity**.
1. Select **Create alert rule**.

To create an alert if the cloud tiering recall size excedes 500 GiB in a day:

1. In the **Azure portal**, navigate to respective **Storage Sync Service**.
1. Go to the **Monitoring** section and select **Alerts**.
1. Select **+ New alert rule** to create a new alert rule.
1. Configure condition by selecting **Select condition**.
1. Within **Configure signal logic** section, select **Cloud tiering recall size** under signal name.  
1. Select the following dimension configuration:
     - Dimension name: **Server name**  
     - Operator: **=**
     - Dimension values: **All current and future values**  
1. Navigate to **Alert Logic** and complete the following:
     - Threshold set to **Static**
     - Operator: **Greater than**
     - Aggregation type: **Total**  
     - Threshold value (in bytes): **67108864000**
     - Evaluated based on: Aggregation granularity = **24 hours** | Frequency of evaluation = **Every hour**
     - Select **Done.** 
1. Select **Select action group** to add an action group (email, SMS, etc.) to the alert either by selecting an existing action group or creating a new action group.
1. Fill in the **Alert details** like **Alert rule name**, **Description**, and **Severity**.
1. Select **Create alert rule**.

[!INCLUDE [azmon-horz-advisor](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-advisor.md)]

## Related content

- [Azure File Sync monitoring data reference](monitor-file-sync-reference.md)
- [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource)
- [Consider firewall and proxy settings](file-sync-firewall-and-proxy.md)
- [Troubleshoot Azure File Sync](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json)
