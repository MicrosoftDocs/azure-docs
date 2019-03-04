---
title: Monitor Azure File Sync | Microsoft Docs
description: How to monitor Azure File Sync.
services: storage
author: jeffpatt24
ms.service: storage
ms.topic: article
ms.date: 01/31/2019
ms.author: jeffpatt
ms.subservice: files
---

# Monitor Azure File Sync

Use Azure File Sync to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms Windows Server into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally, including SMB, NFS, and FTPS. You can have as many caches as you need across the world.

This article describes how to monitor your Azure File Sync deployment using the Azure portal and Windows Server.

The following monitoring options are available currently:

## Azure portal

In the Azure portal, you can view registered server health, server endpoint health (sync health), and metrics.

### Storage Sync Service

To view registered server health, server endpoint health and metrics, go to the Storage Sync Service in the Azure portal. Registered server health is viewable in the Registered servers blade. Server endpoint health is viewable in the Sync groups blade.

Registered Server Health
- If the Registered server state is Online, the server is successfully communicating with the service.
- If Registered server state is Appears Offline, verify the Storage Sync Monitor (AzureStorageSyncMonitor.exe) process on the server is running. If the server is behind a firewall or proxy, configure the firewall and proxy per [documentation](https://docs.microsoft.com/azure/storage/files/storage-sync-files-firewall-and-proxy).

Server Endpoint Health
- The server endpoint health in the portal is based on the sync events that are logged in the Telemetry event log on the server (ID 9102 and 9302). If a sync session fails due to a transient error (for example, error canceled), sync may still show healthy in the portal as long as the current sync session is making progress (Event ID 9302 is used to determine if files are being applied). See the following documentation for more information: [Sync Health](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=server%2Cazure-portal#broken-sync) & [Sync Progress](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=server%2Cazure-portal#how-do-i-monitor-the-progress-of-a-current-sync-session).
- If the portal shows a sync error due to sync not making progress, check the [Troubleshooting documentation](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cazure-portal#common-sync-errors) for guidance.

Metrics
- The following metrics are viewable in the Storage Sync Service portal:

  | Metric name | Description | Portal blade(s) | 
  |-|-|-|
  | Bytes synced | Size of data transferred (upload and download) | Sync group, Server endpoint |
  | Cloud tiering recall | Size of data recalled | Registered servers |
  | Files not syncing | Count of files that are failing to sync | Server endpoint |
  | Files synced | Count of files transferred (upload and download) | Sync group, Server endpoint |
  | Server online status | Count of heartbeats received from the server | Registered servers |

- To learn more, see [Azure Monitor](https://docs.microsoft.com/azure/storage/files/storage-sync-files-monitoring#azure-monitor) section. 

  > [!Note]  
  > The charts in the Storage Sync Service portal have a time range of 24 hours. To view different time ranges or dimensions, use Azure Monitor.


### Azure Monitor

Use [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview) to monitor sync, cloud tiering, and server connectivity. Metrics for Azure File Sync are enabled by default and are sent to Azure Monitor every 15 minutes.

To view Azure File Sync metrics in Azure Monitor, select the Storage Sync Services resource type.

The following metrics for Azure File Sync are available in Azure Monitor:

| Metric name | Description |
|-|-|
| Bytes synced | Size of data transferred (upload and download).<br><br>Unit: Bytes<br>Aggregation Type: Sum<br>Applicable dimensions: Server Endpoint Name, Sync Direction, Sync Group Name |
| Cloud tiering recall | Size of data recalled.<br><br>Unit: Bytes<br>Aggregation Type: Sum<br>Applicable dimension: Server Name |
| Files not syncing | Count of files that are failing to sync.<br><br>Unit: Count<br>Aggregation Type: Sum<br>Applicable dimensions: Server Endpoint Name, Sync Direction, Sync Group Name |
| Files synced | Count of files transferred (upload and download).<br><br>Unit: Count<br>Aggregation Type: Sum<br>Applicable dimensions: Server Endpoint Name, Sync Direction, Sync Group Name |
| Server online status | Count of heartbeats received from the server.<br><br>Unit: Count<br>Aggregation Type: Maximum<br>Applicable dimension: Server Name |
| Sync session result | Sync session result (1=successful sync session; 0=failed sync session)<br><br>Unit: Count<br>Aggregation Types: Maximum<br>Applicable dimensions: Server Endpoint Name, Sync Direction, Sync Group Name |

## Windows Server

On the Windows Server, you can view cloud tiering, registered server, and sync health.

### Event logs

Use the Telemetry event log on the server to monitor registered server, sync, and cloud tiering health. The Telemetry event log is located under Applications and Services\Microsoft\FileSync\Agent in Event Viewer.

Sync Health
- Event ID 9102 is logged once a sync session completes. This event should be used to determine if sync sessions are completing successfully (HResult = 0) and if there are per-item sync errors. See the following documentation for more information: [Sync Health](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=server%2Cazure-portal#broken-sync) & [Per-Item Errors](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=server%2Cazure-portal#how-do-i-see-if-there-are-specific-files-or-folders-that-are-not-syncing).

  > [!Note]  
  > Sometimes sync sessions fail overall or have a non-zero PerItemErrorCount but still make forward progress, with some files syncing successfully. This can be seen in the Applied fields (AppliedFileCount, AppliedDirCount, AppliedTombstoneCount, and AppliedSizeBytes), which tell you how much of the session is succeeding. If you see multiple sync sessions in a row that are failing but have an increasing Applied count, then you should give sync time to try again before opening a support ticket.

- Event ID 9302 is logged every 5 to 10 minutes if there’s an active sync session. This event should be used to determine if the current sync session is making progress (AppliedItemCount > 0). If sync is not making progress, the sync session should eventually fail and an Event ID 9102 will be logged with the error. See the following documentation for more information: [Sync Progress](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=server%2Cazure-portal#how-do-i-monitor-the-progress-of-a-current-sync-session)

Registered Server Health
- Event ID 9301 is logged every 30 seconds when a server queries the service for jobs. If GetNextJob completes with status = 0, the server is able to communicate with the service. If GetNextJob completes with an error, check the [Troubleshooting documentation](https://docs.microsoft.com/azure/storage/files/storage-sync-files-troubleshoot?tabs=portal1%2Cazure-portal#common-sync-errors) for guidance.

Cloud Tiering Health
- To monitor tiering activity on a server, use Event ID 9003, 9016 and 9029 in the Telemetry event log (located under Applications and Services\Microsoft\FileSync\Agent in Event Viewer).

  - Event ID 9003 provides error distribution for a server endpoint. For example, Total Error Count, ErrorCode, etc. Note, one event is logged per error code.
  - Event ID 9016 provides ghosting results for a volume. For example, Free space percent is, Number of files ghosted in session, Number of files failed to ghost, etc.
  - Event ID 9029 provides ghosting session information for a server endpoint. For example, Number of files attempted in the session, Number of files tiered in the session, Number of files already tiered, etc.
  
- To monitor recall activity on a server, use Event ID 9005, 9006, 9009 and 9059 in the Telemetry event log (located under Applications and Services\Microsoft\FileSync\Agent in Event Viewer).

  - Event ID 9005 provides recall reliability for a server endpoint. For example, Total unique files accessed, Total unique files with failed access, etc.
  - Event ID 9006 provides recall error distribution for a server endpoint. For example, Total Failed Requests, ErrorCode, etc. Note, one event is logged per error code.
  - Event ID 9009 provides recall session information for a server endpoint. For example, DurationSeconds, CountFilesRecallSucceeded, CountFilesRecallFailed, etc.
  - Event ID 9059 provides application recall distribution for a server endpoint. For example, ShareId, Application Name, and TotalEgressNetworkBytes.

### Performance counters

Use the Azure File Sync performance counters on the server to monitor sync activity.

To view Azure File Sync performance counters on the server, launch Performance Monitor (Perfmon.exe) and the counters can be found under the AFS Bytes Transferred and AFS Sync Operations objects.

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
