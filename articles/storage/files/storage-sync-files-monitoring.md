---
title: Monitor Azure File Sync | Microsoft Docs
description: How to monitor Azure File Sync.
services: storage
author: roygara
ms.service: storage
ms.topic: article
ms.date: 06/28/2019
ms.author: rogarana
ms.subservice: files
---

# Monitor Azure File Sync

Use Azure File Sync to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms Windows Server into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally, including SMB, NFS, and FTPS. You can have as many caches as you need across the world.

This article describes how to monitor your Azure File Sync deployment by using Azure Monitor, Storage Sync Service and Windows Server.

The following monitoring options are currently available.

## Azure Monitor

Use [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview) to view metrics and to configure alerts for sync, cloud tiering, and server connectivity.  

### Metrics

Metrics for Azure File Sync are enabled by default and are sent to Azure Monitor every 15 minutes.

To view Azure File Sync metrics in Azure Monitor, select the **Storage Sync Services** resource type.

The following metrics for Azure File Sync are available in Azure Monitor:

| Metric name | Description |
|-|-|
| Bytes synced | Size of data transferred (upload and download).<br><br>Unit: Bytes<br>Aggregation Type: Sum<br>Applicable dimensions: Server Endpoint Name, Sync Direction, Sync Group Name |
| Cloud tiering recall | Size of data recalled.<br><br>**Note**: This metric will be removed in the future. Use the Cloud tiering recall size metric to monitor size of data recalled.<br><br>Unit: Bytes<br>Aggregation Type: Sum<br>Applicable dimension: Server Name |
| Cloud tiering recall size | Size of data recalled.<br><br>Unit: Bytes<br>Aggregation Type: Sum<br>Applicable dimension: Server Name, Sync Group Name |
| Cloud tiering recall size by application | Size of data recalled by application.<br><br>Unit: Bytes<br>Aggregation Type: Sum<br>Applicable dimension: Application Name, Server Name, Sync Group Name |
| Cloud tiering recall throughput | Size of data recall throughput.<br><br>Unit: Bytes<br>Aggregation Type: Sum<br>Applicable dimension: Server Name, Sync Group Name |
| Files not syncing | Count of files that are failing to sync.<br><br>Unit: Count<br>Aggregation Type: Sum<br>Applicable dimensions: Server Endpoint Name, Sync Direction, Sync Group Name |
| Files synced | Count of files transferred (upload and download).<br><br>Unit: Count<br>Aggregation Type: Sum<br>Applicable dimensions: Server Endpoint Name, Sync Direction, Sync Group Name |
| Server online status | Count of heartbeats received from the server.<br><br>Unit: Count<br>Aggregation Type: Maximum<br>Applicable dimension: Server Name |
| Sync session result | Sync session result (1=successful sync session; 0=failed sync session)<br><br>Unit: Count<br>Aggregation Types: Maximum<br>Applicable dimensions: Server Endpoint Name, Sync Direction, Sync Group Name |

### Alerts

To configure alerts in Azure Monitor, select the Storage Sync Service and then select the [Azure File Sync metric](https://docs.microsoft.com/azure/storage/files/storage-sync-files-monitoring#metrics) to use for the alert.  

The following table lists some example scenarios to monitor and the proper metric to use for the alert:

| Scenario | Metric to use for alert |
|-|-|
| Server endpoint health in the portal = Error | Sync session result |
| Files are failing to sync to a server or cloud endpoint | Files not syncing |
| Registered server is failing to communicate with the Storage Sync Service | Server online status |
| Cloud tiering recall size has exceeded 500GiB in a day  | Cloud tiering recall size |

To learn more about configuring alerts in Azure Monitor, see [Overview of alerts in Microsoft Azure]( https://docs.microsoft.com/azure/azure-monitor/platform/alerts-overview).

## Storage Sync Service

To view registered server health, server endpoint health, and metrics, go to the Storage Sync Service in the Azure portal. You can view registered server health in the **Registered servers** blade and server endpoint health in the **Sync groups** blade.

### Registered server health

- If the **Registered server** state is **Online**, the server is successfully communicating with the service.
- If the **Registered server** state is **Appears Offline**, verify that the Storage Sync Monitor (AzureStorageSyncMonitor.exe) process on the server is running. If the server is behind a firewall or proxy, see [this article](https://docs.microsoft.com/azure/storage/files/storage-sync-files-firewall-and-proxy) to configure the firewall and proxy.

### Server endpoint health

- The server endpoint health in the portal is based on the sync events that are logged in the Telemetry event log on the server (ID 9102 and 9302). If a sync session fails because of a transient error, such as error canceled, sync might still appear healthy in the portal as long as the current sync session is making progress. Event ID 9302 is used to determine if files are being applied. For more information, see [sync health](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=server%2Cazure-portal#broken-sync) and [sync progress](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=server%2Cazure-portal#how-do-i-monitor-the-progress-of-a-current-sync-session).
- If the portal shows a sync error because sync is not making progress, see the [troubleshooting documentation](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cazure-portal#common-sync-errors) for guidance.

### Metric charts

- The following metric charts are viewable in the Storage Sync Service portal:

  | Metric name | Description | Blade name |
  |-|-|-|
  | Bytes synced | Size of data transferred (upload and download) | Sync group, Server endpoint |
  | Cloud tiering recall | Size of data recalled | Registered servers |
  | Files not syncing | Count of files that are failing to sync | Server endpoint |
  | Files synced | Count of files transferred (upload and download) | Sync group, Server endpoint |
  | Server online status | Count of heartbeats received from the server | Registered servers |

- To learn more, see [Azure Monitor](https://docs.microsoft.com/azure/storage/files/storage-sync-files-monitoring#azure-monitor).

  > [!Note]  
  > The charts in the Storage Sync Service portal have a time range of 24 hours. To view different time ranges or dimensions, use Azure Monitor.

## Windows Server

On Windows Server, you can view cloud tiering, registered server, and sync health.

### Event logs

Use the Telemetry event log on the server to monitor registered server, sync, and cloud tiering health. The Telemetry event log is located in Event Viewer under *Applications and Services\Microsoft\FileSync\Agent*.

Sync health:

- Event ID 9102 is logged after a sync session finishes. Use this event to determine if sync sessions are successful (**HResult = 0**) and if there are per-item sync errors. For more information, see the [sync health](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=server%2Cazure-portal#broken-sync) and  [per-item errors](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=server%2Cazure-portal#how-do-i-see-if-there-are-specific-files-or-folders-that-are-not-syncing) documentation.

  > [!Note]  
  > Sometimes sync sessions fail overall or have a non-zero PerItemErrorCount. However, they still make forward progress, and some files sync successfully. You can see this in the Applied fields such as AppliedFileCount, AppliedDirCount, AppliedTombstoneCount, and AppliedSizeBytes. These fields tell you how much of the session succeeded. If you see multiple sync sessions fail in a row, and they have an increasing Applied count, give sync time to try again before you open a support ticket.

- Event ID 9302 is logged every 5 to 10 minutes if there’s an active sync session. Use this event to determine if the current sync session is making progress (**AppliedItemCount > 0**). If sync is not making progress, the sync session should eventually fail, and an Event ID 9102 will be logged with the error. For more information, see the [sync progress documentation](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=server%2Cazure-portal#how-do-i-monitor-the-progress-of-a-current-sync-session).

Registered server health:

- Event ID 9301 is logged every 30 seconds when a server queries the service for jobs. If GetNextJob finishes with **status = 0**, the server is able to communicate with the service. If GetNextJob finishes with an error, check the [troubleshooting documentation](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cazure-portal#common-sync-errors) for guidance.

Cloud tiering health:

- To monitor tiering activity on a server, use Event ID 9003, 9016 and 9029 in the Telemetry event log, which is located in Event Viewer under *Applications and Services\Microsoft\FileSync\Agent*.

  - Event ID 9003 provides error distribution for a server endpoint. For example: Total Error Count and  ErrorCode. One event is logged per error code.
  - Event ID 9016 provides ghosting results for a volume. For example: Free space percent is, Number of files ghosted in session, and Number of files failed to ghost.
  - Event ID 9029 provides ghosting session information for a server endpoint. For example: Number of files attempted in the session, Number of files tiered in the session, and Number of files already tiered.
  
- To monitor recall activity on a server, use Event ID 9005, 9006, 9009 and 9059 in the Telemetry event log, which is located in Event Viewer under *Applications and Services\Microsoft\FileSync\Agent*.

  - Event ID 9005 provides recall reliability for a server endpoint. For example: Total unique files accessed, and Total unique files with failed access.
  - Event ID 9006 provides recall error distribution for a server endpoint. For example: Total Failed Requests, and ErrorCode. One event is logged per error code.
  - Event ID 9009 provides recall session information for a server endpoint. For example: DurationSeconds, CountFilesRecallSucceeded, and CountFilesRecallFailed.
  - Event ID 9059 provides application recall distribution for a server endpoint. For example: ShareId, Application Name, and TotalEgressNetworkBytes.

### Performance counters

Use the Azure File Sync performance counters on the server to monitor sync activity.

To view Azure File Sync performance counters on the server, open Performance Monitor (Perfmon.exe). You can find the counters under the **AFS Bytes Transferred** and **AFS Sync Operations** objects.

The following performance counters for Azure File Sync are available in Performance Monitor:

| Performance Object\Counter Name | Description |
|-|-|
| AFS Bytes Transferred\Downloaded Bytes/sec | Number of bytes downloaded per second. |
| AFS Bytes Transferred\Uploaded Bytes/sec | Number of bytes uploaded per second. |
| AFS Bytes Transferred\Total Bytes/sec | Total bytes per second (upload and download). |
| AFS Sync Operations\Downloaded Sync Files/sec | Number of files downloaded per second. |
| AFS Sync Operations\Uploaded Sync Files/sec | Number of files uploaded per second. |
| AFS Sync Operations\Total Sync File Operations/sec | Total number of files synced (upload and download). |

## Next steps
- [Planning for an Azure File Sync deployment](storage-sync-files-planning.md)
- [Consider firewall and proxy settings](storage-sync-files-firewall-and-proxy.md)
- [Deploy Azure File Sync](storage-sync-files-deployment-guide.md)
- [Troubleshoot Azure File Sync](storage-sync-files-troubleshoot.md)
- [Azure Files frequently asked questions](storage-files-faq.md)
