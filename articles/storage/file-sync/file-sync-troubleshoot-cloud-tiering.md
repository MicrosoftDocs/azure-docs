---
title: Troubleshoot Azure File Sync cloud tiering | Microsoft Docs
description: Troubleshoot common issues with cloud tiering in an Azure File Sync deployment.
author: khdownie
ms.service: storage
ms.topic: troubleshooting
ms.date: 7/28/2022
ms.author: kendownie
ms.subservice: files 
ms.custom: devx-track-azurepowershell
---

# Troubleshoot Azure File Sync cloud tiering

Cloud tiering, an optional feature of Azure File Sync, decreases the amount of local storage required while keeping the performance of an on-premises file server. When enabled, this feature stores only frequently accessed (hot) files on your local server. Infrequently accessed (cool) files are split into namespace (file and folder structure) and file content. 

There are two paths for failures in cloud tiering:

- Files can fail to tier, which means that Azure File Sync unsuccessfully attempts to tier a file to Azure Files.
- Files can fail to recall, which means that the Azure File Sync file system filter (StorageSync.sys) fails to download data when a user attempts to access a file that has been tiered.

There are two main classes of failures that can happen via either failure path:

- Cloud storage failures
    - *Transient storage service availability issues*. For more information, see the [Service Level Agreement (SLA) for Azure Storage](https://azure.microsoft.com/support/legal/sla/storage/v1_5/).
    - *Inaccessible Azure file share*. This failure typically happens when you delete the Azure file share when it is still a cloud endpoint in a sync group.
    - *Inaccessible storage account*. This failure typically happens when you delete the storage account while it still has an Azure file share that is a cloud endpoint in a sync group. 
- Server failures 
  - *Azure File Sync file system filter (StorageSync.sys) is not loaded*. In order to respond to tiering/recall requests, the Azure File Sync file system filter must be loaded. The filter not being loaded can happen for several reasons, but the most common reason is that an administrator unloaded it manually. The Azure File Sync file system filter must be loaded at all times for Azure File Sync to properly function.
  - *Missing, corrupt, or otherwise broken reparse point*. A reparse point is a special data structure on a file that consists of two parts:
    1. A reparse tag, which indicates to the operating system that the Azure File Sync file system filter (StorageSync.sys) may need to do some action on IO to the file. 
    2. Reparse data, which indicates to the file system filter the URI of the file on the associated cloud endpoint (the Azure file share). 
        
       The most common way a reparse point could become corrupted is if an administrator attempts to modify either the tag or its data. 
  - *Network connectivity issues*. In order to tier or recall a file, the server must have internet connectivity.

The following sections indicate how to troubleshoot cloud tiering issues and determine if an issue is a cloud storage issue or a server issue.

## How to monitor tiering activity on a server  
To monitor tiering activity on a server, use Event ID 9003, 9016 and 9029 in the Telemetry event log (located under Applications and Services\Microsoft\FileSync\Agent in Event Viewer).

- Event ID 9003 provides error distribution for a server endpoint. For example, Total Error Count, ErrorCode, etc. Note, one event is logged per error code.
- Event ID 9016 provides ghosting results for a volume. For example, Free space percent is, Number of files ghosted in session, Number of files failed to ghost, etc.
- Event ID 9029 provides ghosting session information for a server endpoint. For example, Number of files attempted in the session, Number of files tiered in the session, Number of files already tiered, etc.

## How to monitor recall activity on a server
To monitor recall activity on a server, use Event ID 9005, 9006, 9009 and 9059 in the Telemetry event log (located under Applications and Services\Microsoft\FileSync\Agent in Event Viewer).

- Event ID 9005 provides recall reliability for a server endpoint. For example, Total unique files accessed, Total unique files with failed access, etc.
- Event ID 9006 provides recall error distribution for a server endpoint. For example, Total Failed Requests, ErrorCode, etc. Note, one event is logged per error code.
- Event ID 9009 provides recall session information for a server endpoint. For example, DurationSeconds, CountFilesRecallSucceeded, CountFilesRecallFailed, etc.
- Event ID 9059 provides application recall distribution for a server endpoint. For example, ShareId, Application Name, and TotalEgressNetworkBytes.

## How to troubleshoot files that fail to tier
If files fail to tier to Azure Files:

1. In Event Viewer, review the telemetry, operational and diagnostic event logs, located under Applications and Services\Microsoft\FileSync\Agent. 
   1. Verify the files exist in the Azure file share.

      > [!NOTE]
      > A file must be synced to an Azure file share before it can be tiered.

   2. Verify the server has internet connectivity. 
   3. Verify the Azure File Sync filter drivers (StorageSync.sys and StorageSyncGuard.sys) are running:
       - At an elevated command prompt, run `fltmc`. Verify that the StorageSync.sys and StorageSyncGuard.sys file system filter drivers are listed.

> [!NOTE]
> An Event ID 9003 is logged once an hour in the Telemetry event log if a file fails to tier (one event is logged per error code). Check the [Tiering errors and remediation](#tiering-errors-and-remediation) section to see if remediation steps are listed for the error code.

## Tiering errors and remediation

| HRESULT | HRESULT (decimal) | Error string | Issue | Remediation |
|---------|-------------------|--------------|-------|-------------|
| 0x80c86045 | -2134351803 | ECS_E_INITIAL_UPLOAD_PENDING | The file failed to tier because the initial upload is in progress. | No action required. The file will be tiered once the initial upload completes. |
| 0x80c86043 | -2134351805 | ECS_E_GHOSTING_FILE_IN_USE | The file failed to tier because it's in use. | No action required. The file will be tiered when it's no longer in use. |
| 0x80c80241 | -2134375871 | ECS_E_GHOSTING_EXCLUDED_BY_SYNC | The file failed to tier because it's excluded by sync. | No action required. Files in the sync exclusion list cannot be tiered. |
| 0x80c86042 | -2134351806 | ECS_E_GHOSTING_FILE_NOT_FOUND | The file failed to tier because it was not found on the server. | No action required. If the error persists, check if the file exists on the server. |
| 0x80c83053 | -2134364077 | ECS_E_CREATE_SV_FILE_DELETED | The file failed to tier because it was deleted in the Azure file share. | No action required. The file should be deleted on the server when the next download sync session runs. |
| 0x80c8600e | -2134351858 | ECS_E_AZURE_SERVER_BUSY | The file failed to tier due to a network issue. | No action required. If the error persists, check network connectivity to the Azure file share. |
| 0x80072ee7 | -2147012889 | WININET_E_NAME_NOT_RESOLVED | The file failed to tier due to a network issue. | No action required. If the error persists, check network connectivity to the Azure file share. |
| 0x80070005 | -2147024891 | ERROR_ACCESS_DENIED | The file failed to tier due to access denied error. This error can occur if the file is located on a DFS-R read-only replication folder. | Azure File Sync doesn't support server endpoints on DFS-R read-only replication folders. See [planning guide](file-sync-planning.md#distributed-file-system-dfs) for more information. |
| 0x80072efe | -2147012866 | WININET_E_CONNECTION_ABORTED | The file failed to tier due to a network issue. | No action required. If the error persists, check network connectivity to the Azure file share. |
| 0x80c80261 | -2134375839 | ECS_E_GHOSTING_MIN_FILE_SIZE | The file failed to tier because the file size is less than the supported size. | The minimum supported file size is based on the file system cluster size (double file system cluster size). For example, if the file system cluster size is 4 KiB, the minimum file size is 8 KiB. |
| 0x80c83007 | -2134364153 | ECS_E_STORAGE_ERROR | The file failed to tier due to an Azure storage issue. | If the error persists, open a support request. |
| 0x800703e3 | -2147023901 | ERROR_OPERATION_ABORTED | The file failed to tier because it was recalled at the same time. | No action required. The file will be tiered when the recall completes and the file is no longer in use. |
| 0x80c80264 | -2134375836 | ECS_E_GHOSTING_FILE_NOT_SYNCED | The file failed to tier because it has not synced to the Azure file share. | No action required. The file will tier once it has synced to the Azure file share. |
| 0x80070001 | -2147942401 | ERROR_INVALID_FUNCTION | The file failed to tier because the cloud tiering filter driver (storagesync.sys) is not running. | To resolve this issue, open an elevated command prompt and run the following command: `fltmc load storagesync`<br>If the Azure File Sync filter driver fails to load when running the fltmc command, uninstall the Azure File Sync agent, restart the server and reinstall the Azure File Sync agent. |
| 0x80070070 | -2147024784 | ERROR_DISK_FULL | The file failed to tier due to insufficient disk space on the volume where the server endpoint is located. | To resolve this issue, free at least 100 MiB of disk space on the volume where the server endpoint is located. |
| 0x80070490 | -2147023728 | ERROR_NOT_FOUND | The file failed to tier because it has not synced to the Azure file share. | No action required. The file will tier once it has synced to the Azure file share. |
| 0x80c80262 | -2134375838 | ECS_E_GHOSTING_UNSUPPORTED_RP | The file failed to tier because it's an unsupported reparse point. | If the file is a Data Deduplication reparse point, follow the steps in the [planning guide](file-sync-planning.md#data-deduplication) to enable Data Deduplication support. Files with reparse points other than Data Deduplication are not supported and will not be tiered.  |
| 0x80c83052 | -2134364078 | ECS_E_CREATE_SV_STREAM_ID_MISMATCH | The file failed to tier because it has been modified. | No action required. The file will tier once the modified file has synced to the Azure file share. |
| 0x80c80269 | -2134375831 | ECS_E_GHOSTING_REPLICA_NOT_FOUND | The file failed to tier because it has not synced to the Azure file share. | No action required. The file will tier once it has synced to the Azure file share. |
| 0x80072ee2 | -2147012894 | WININET_E_TIMEOUT | The file failed to tier due to a network issue. | No action required. If the error persists, check network connectivity to the Azure file share. |
| 0x80c80017 | -2134376425 | ECS_E_SYNC_OPLOCK_BROKEN | The file failed to tier because it has been modified. | No action required. The file will tier once the modified file has synced to the Azure file share. |
| 0x800705aa | -2147023446 | ERROR_NO_SYSTEM_RESOURCES | The file failed to tier due to insufficient system resources. | If the error persists, investigate which application or kernel-mode driver is exhausting system resources. |
| 0x8e5e03fe | -1906441218 | JET_errDiskIO | The file failed to tier due to an I/O error when writing to the cloud tiering database. | If the error persists, run chkdsk on the volume and check the storage hardware. |
| 0x8e5e0442 | -1906441150 | JET_errInstanceUnavailable | The file failed to tier because the cloud tiering database is not running. | To resolve this issue, restart the FileSyncSvc service or server. If the error persists, run chkdsk on the volume and check the storage hardware. |
| 0x80C80285 | -2134375803 | ECS_E_GHOSTING_SKIPPED_BY_CUSTOM_EXCLUSION_LIST | The file cannot be tiered because the file type is excluded from tiering. | To tier files with this file type, modify the GhostingExclusionList registry setting which is located under HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Azure\StorageSync. |
| 0x80C86050 | -2134351792 | ECS_E_REPLICA_NOT_READY_FOR_TIERING | The file failed to tier because the current sync mode is initial upload or reconciliation. | No action required. The file will be tiered once sync completes initial upload or reconciliation. |

## How to troubleshoot files that fail to be recalled  
If files fail to be recalled:
1. In Event Viewer, review the telemetry, operational and diagnostic event logs, located under Applications and Services\Microsoft\FileSync\Agent.
    1. Verify the files exist in the Azure file share.
    2. Verify the server has internet connectivity. 
    3. Open the Services MMC snap-in and verify the Storage Sync Agent service (FileSyncSvc) is running.
    4. Verify the Azure File Sync filter drivers (StorageSync.sys and StorageSyncGuard.sys) are running:
        - At an elevated command prompt, run `fltmc`. Verify that the StorageSync.sys and StorageSyncGuard.sys file system filter drivers are listed.

> [!NOTE]
> An Event ID 9006 is logged once per hour in the Telemetry event log if a file fails to recall (one event is logged per error code). Check the [Recall errors and remediation](#recall-errors-and-remediation) section to see if remediation steps are listed for the error code.

## Recall errors and remediation

| HRESULT | HRESULT (decimal) | Error string | Issue | Remediation |
|---------|-------------------|--------------|-------|-------------|
| 0x80070079 | -2147942521 | ERROR_SEM_TIMEOUT | The file failed to recall due to an I/O timeout. This issue can occur for several reasons: server resource constraints, poor network connectivity or an Azure storage issue (for example, throttling). | No action required. If the error persists for several hours, please open a support case. |
| 0x80070036 | -2147024842 | ERROR_NETWORK_BUSY | The file failed to recall due to a network issue.  | If the error persists, check network connectivity to the Azure file share. |
| 0x80c80037 | -2134376393 | ECS_E_SYNC_SHARE_NOT_FOUND | The file failed to recall because the server endpoint was deleted. | To resolve this issue, see [Tiered files are not accessible on the server after deleting a server endpoint](?tabs=portal1%252cazure-portal#tiered-files-are-not-accessible-on-the-server-after-deleting-a-server-endpoint). |
| 0x80070005 | -2147024891 | ERROR_ACCESS_DENIED | The file failed to recall due to an access denied error. This issue can occur if the firewall and virtual network settings on the storage account are enabled and the server does not have access to the storage account. | To resolve this issue, add the Server IP address or virtual network by following the steps documented in the [Configure firewall and virtual network settings](file-sync-deployment-guide.md?tabs=azure-portal#optional-configure-firewall-and-virtual-network-settings) section in the deployment guide. |
| 0x80c86002 | -2134351870 | ECS_E_AZURE_RESOURCE_NOT_FOUND | The file failed to recall because it's not accessible in the Azure file share. | To resolve this issue, verify the file exists in the Azure file share. If the file exists in the Azure file share, upgrade to the latest Azure File Sync [agent version](file-sync-release-notes.md#supported-versions). |
| 0x80c8305f | -2134364065 | ECS_E_EXTERNAL_STORAGE_ACCOUNT_AUTHORIZATION_FAILED | The file failed to recall due to authorization failure to the storage account. | To resolve this issue, verify [Azure File Sync has access to the storage account](file-sync-troubleshoot-sync-errors.md?tabs=portal1%252cazure-portal#troubleshoot-rbac). |
| 0x80c86030 | -2134351824 | ECS_E_AZURE_FILE_SHARE_NOT_FOUND | The file failed to recall because the Azure file share is not accessible. | Verify the file share exists and is accessible. If the file share was deleted and recreated, perform the steps documented in the [Sync failed because the Azure file share was deleted and recreated](file-sync-troubleshoot-sync-errors.md?tabs=portal1%252cazure-portal#-2134375810) section to delete and recreate the sync group. |
| 0x800705aa | -2147023446 | ERROR_NO_SYSTEM_RESOURCES | The file failed to recall due to insufficient system resources. | If the error persists, investigate which application or kernel-mode driver is exhausting system resources. |
| 0x8007000e | -2147024882 | ERROR_OUTOFMEMORY | The file failed to recall due to insufficient memory. | If the error persists, investigate which application or kernel-mode driver is causing the low memory condition. |
| 0x80070070 | -2147024784 | ERROR_DISK_FULL | The file failed to recall due to insufficient disk space. | To resolve this issue, free up space on the volume by moving files to a different volume, increase the size of the volume, or force files to tier by using the Invoke-StorageSyncCloudTiering cmdlet. |
| 0x80072f8f | -2147012721 | WININET_E_DECODING_FAILED | The file failed to recall because the server was unable to decode the response from the Azure File Sync service. | This error typically occurs if a network proxy is modifying the response from the Azure File Sync service. Please check your proxy configuration. |
| 0x80090352 | -2146892974 | SEC_E_ISSUING_CA_UNTRUSTED | The file failed to recall because your organization is using a TLS terminating proxy or a malicious entity is intercepting the traffic between your server and the Azure File Sync service. | If you are certain this is expected (because your organization is using a TLS terminating proxy), follow the steps documented for error [CERT_E_UNTRUSTEDROOT](file-sync-troubleshoot-sync-errors.md#-2146762487) to resolve this issue. |
| 0x80c86047 | -2134351801 | ECS_E_AZURE_SHARE_SNAPSHOT_NOT_FOUND | The file failed to recall because it's referencing a version of the file which no longer exists in the Azure file share. | This issue can occur if the tiered file was restored from a backup of the Windows Server. To resolve this issue, restore the file from a snapshot in the Azure file share. |

## Tiered files are not accessible on the server after deleting a server endpoint
Tiered files on a server will become inaccessible if the files are not recalled prior to deleting a server endpoint.

Errors logged if tiered files are not accessible
- When syncing a file, error code -2147942467 (0x80070043 - ERROR_BAD_NET_NAME) is logged in the ItemResults event log
- When recalling a file, error code -2134376393 (0x80c80037 - ECS_E_SYNC_SHARE_NOT_FOUND) is logged in the RecallResults event log

Restoring access to your tiered files is possible if the following conditions are met:
- Server endpoint was deleted within past 30 days
- Cloud endpoint was not deleted 
- File share was not deleted
- Sync group was not deleted

If the above conditions are met, you can restore access to the files on the server by recreating the server endpoint at the same path on the server within the same sync group within 30 days. 

If the above conditions are not met, restoring access is not possible as these tiered files on the server are now orphaned. Follow the instructions below to remove the orphaned tiered files.

**Notes**
- When tiered files are not accessible on the server, the full file should still be accessible if you access the Azure file share directly.
- To prevent orphaned tiered files in the future, follow the steps documented in [Remove a server endpoint](file-sync-server-endpoint-delete.md) when deleting a server endpoint.

<a id="get-orphaned"></a>**How to get the list of orphaned tiered files** 

1. Run the following PowerShell commands to list orphaned tiered files:
```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
$orphanFiles = Get-StorageSyncOrphanedTieredFiles -path <server endpoint path>
$orphanFiles.OrphanedTieredFiles > OrphanTieredFiles.txt
```
2. Save the OrphanTieredFiles.txt output file in case files need to be restored from backup after they are deleted.

<a id="remove-orphaned"></a>**How to remove orphaned tiered files** 

*Option 1: Delete the orphaned tiered files*

This option deletes the orphaned tiered files on the Windows Server but requires removing the server endpoint if it exists due to recreation after 30 days or is connected to a different sync group. File conflicts will occur if files are updated on the Windows Server or Azure file share before the server endpoint is recreated.

1. Back up the Azure file share and server endpoint location.
2. Remove the server endpoint in the sync group (if exists) by following the steps documented in [Remove a server endpoint](file-sync-server-endpoint-delete.md).

> [!Warning]  
> If the server endpoint is not removed prior to using the Remove-StorageSyncOrphanedTieredFiles cmdlet, deleting the orphaned tiered file on the server will delete the full file in the Azure file share. 

3. Run the following PowerShell commands to list orphaned tiered files:

```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
$orphanFiles = Get-StorageSyncOrphanedTieredFiles -path <server endpoint path>
$orphanFiles.OrphanedTieredFiles > OrphanTieredFiles.txt
```
4. Save the OrphanTieredFiles.txt output file in case files need to be restored from backup after they are deleted.
5. Run the following PowerShell commands to delete orphaned tiered files:

```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
$orphanFilesRemoved = Remove-StorageSyncOrphanedTieredFiles -Path <folder path containing orphaned tiered files> -Verbose
$orphanFilesRemoved.OrphanedTieredFiles > DeletedOrphanFiles.txt
```
**Notes** 
- Tiered files modified on the server that are not synced to the Azure file share will be deleted.
- Tiered files that are accessible (not orphan) will not be deleted.
- Non-tiered files will remain on the server.

6. Optional: Recreate the server endpoint if deleted in step 3.

*Option 2: Mount the Azure file share and copy the files locally that are orphaned on the server*

This option doesn't require removing the server endpoint but requires sufficient disk space to copy the full files locally.

1. [Mount](../files/storage-how-to-use-files-windows.md?toc=/azure/storage/filesync/toc.json) the Azure file share on the Windows Server that has orphaned tiered files.
2. Run the following PowerShell commands to list orphaned tiered files:
```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
$orphanFiles = Get-StorageSyncOrphanedTieredFiles -path <server endpoint path>
$orphanFiles.OrphanedTieredFiles > OrphanTieredFiles.txt
```
3. Use the OrphanTieredFiles.txt output file to identify orphaned tiered files on the server.
4. Overwrite the orphaned tiered files by copying the full file from the Azure file share to the Windows Server.

## How to troubleshoot files unexpectedly recalled on a server  
Antivirus, backup, and other applications that read large numbers of files cause unintended recalls unless they respect the skip offline attribute and skip reading the content of those files. Skipping offline files for products that support this option helps avoid unintended recalls during operations like antivirus scans or backup jobs.

Consult with your software vendor to learn how to configure their solution to skip reading offline files.

Unintended recalls also might occur in other scenarios, like when you are browsing cloud-tiered files in File Explorer. This is likely to occur on Windows Server 2016 if the folder contains executable files. File Explorer was improved for Windows Server 2019 and later to better handle offline files.

> [!NOTE]
>Use Event ID 9059 in the Telemetry event log to determine which application(s) is causing recalls. This event provides application recall distribution for a server endpoint and is logged once an hour.

## Process exclusions for Azure File Sync

If you want to configure your antivirus or other applications to skip scanning for files accessed by Azure File Sync, configure the following process exclusions:

- C:\Program Files\Azure\StorageSyncAgent\AfsAutoUpdater.exe
- C:\Program Files\Azure\StorageSyncAgent\FileSyncSvc.exe
- C:\Program Files\Azure\StorageSyncAgent\MAAgent\MonAgentLauncher.exe
- C:\Program Files\Azure\StorageSyncAgent\MAAgent\MonAgentHost.exe
- C:\Program Files\Azure\StorageSyncAgent\MAAgent\MonAgentManager.exe
- C:\Program Files\Azure\StorageSyncAgent\MAAgent\MonAgentCore.exe
- C:\Program Files\Azure\StorageSyncAgent\MAAgent\Extensions\XSyncMonitoringExtension\AzureStorageSyncMonitor.exe

## TLS 1.2 required for Azure File Sync

You can view the TLS settings at your server by looking at the [registry settings](/windows-server/security/tls/tls-registry-settings). 

If you're using a proxy, consult your proxy's documentation and ensure it is configured to use TLS 1.2.

## See also
- [Troubleshoot Azure File Sync agent installation and server registration](file-sync-troubleshoot-installation.md)
- [Troubleshoot Azure File Sync sync group management](file-sync-troubleshoot-sync-group-management.md)
- [Troubleshoot Azure File Sync sync errors](file-sync-troubleshoot-sync-errors.md)
- [Monitor Azure File Sync](file-sync-monitoring.md)
- [Troubleshoot Azure Files problems in Windows](../files/storage-troubleshoot-windows-file-connection-problems.md)
- [Troubleshoot Azure Files problems in Linux](../files/storage-troubleshoot-linux-file-connection-problems.md)
