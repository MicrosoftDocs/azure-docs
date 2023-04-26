---
title: Troubleshoot Azure File Sync cloud tiering
description: Troubleshoot common issues with cloud tiering in an Azure File Sync deployment.
author: khdownie
ms.service: storage
ms.topic: troubleshooting
ms.date: 4/21/2023
ms.author: kendownie
ms.subservice: files 
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
  - *Azure File Sync file system filter (StorageSync.sys) isn't loaded*. In order to respond to tiering/recall requests, the Azure File Sync file system filter must be loaded. The filter not being loaded can happen for several reasons, but the most common reason is that an administrator unloaded it manually. The Azure File Sync file system filter must be loaded at all times for Azure File Sync to properly function.
  - *Missing, corrupt, or otherwise broken reparse point*. A reparse point is a special data structure on a file that consists of two parts:
    1. A reparse tag, which indicates to the operating system that the Azure File Sync file system filter (StorageSync.sys) might need to do some action on IO to the file. 
    2. Reparse data, which indicates to the file system filter the URI of the file on the associated cloud endpoint (the Azure file share). 
        
       The most common way a reparse point could become corrupted is if an administrator attempts to modify either the tag or its data. 
  - *Network connectivity issues*. In order to tier or recall a file, the server must have internet connectivity.

The following sections indicate how to troubleshoot cloud tiering issues and determine if an issue is a cloud storage issue or a server issue.

## How to monitor tiering activity on a server  
To monitor tiering activity on a server, use Event ID 9003, 9016, and 9029 in the Telemetry event log (located under `Applications and Services\Microsoft\FileSync\Agent` in Event Viewer).

- Event ID 9003 provides error distribution for a server endpoint. For example, Total Error Count, ErrorCode, etc. Note, one event is logged per error code.
- Event ID 9016 provides ghosting results for a volume. For example, Free space percent is, Number of files ghosted in session, Number of files failed to ghost, etc.
- Event ID 9029 provides ghosting session information for a server endpoint. For example, Number of files attempted in the session, Number of files tiered in the session, Number of files already tiered, etc.

## How to monitor recall activity on a server
To monitor recall activity on a server, use Event ID 9005, 9006, 9009, and 9059 in the Telemetry event log (located under Applications and Services\Microsoft\FileSync\Agent in Event Viewer).

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
| 0x80c80241 | -2134375871 | ECS_E_GHOSTING_EXCLUDED_BY_SYNC | The file failed to tier because it's excluded by sync. | No action required. Files in the sync exclusion list can't be tiered. |
| 0x80c86042 | -2134351806 | ECS_E_GHOSTING_FILE_NOT_FOUND | The file failed to tier because it wasn't found on the server. | No action required. If the error persists, check if the file exists on the server. |
| 0x80c83053 | -2134364077 | ECS_E_CREATE_SV_FILE_DELETED | The file failed to tier because it was deleted in the Azure file share. | No action required. The file should be deleted on the server when the next download sync session runs. |
| 0x80c8600e | -2134351858 | ECS_E_AZURE_SERVER_BUSY | The file failed to tier due to a network issue. | No action required. If the error persists, check network connectivity to the Azure file share. |
| 0x80072ee7 | -2147012889 | WININET_E_NAME_NOT_RESOLVED | The file failed to tier due to a network issue. | No action required. If the error persists, check network connectivity to the Azure file share. |
| 0x80070005 | -2147024891 | ERROR_ACCESS_DENIED | The file failed to tier due to access denied error. This error can occur if the file is located on a DFS-R read-only replication folder. | Azure File Sync doesn't support server endpoints on DFS-R read-only replication folders. See [planning guide](file-sync-planning.md#distributed-file-system-dfs) for more information. |
| 0x80072efe | -2147012866 | WININET_E_CONNECTION_ABORTED | The file failed to tier due to a network issue. | No action required. If the error persists, check network connectivity to the Azure file share. |
| 0x80c80261 | -2134375839 | ECS_E_GHOSTING_MIN_FILE_SIZE | The file failed to tier because the file size is less than the supported size. | The minimum supported file size is based on the file system cluster size (double file system cluster size). For example, if the file system cluster size is 4 KiB, the minimum file size is 8 KiB. |
| 0x80c83007 | -2134364153 | ECS_E_STORAGE_ERROR | The file failed to tier due to an Azure storage issue. | If the error persists, open a support request. |
| 0x800703e3 | -2147023901 | ERROR_OPERATION_ABORTED | The file failed to tier because it was recalled at the same time. | No action required. The file will be tiered when the recall completes and the file is no longer in use. |
| 0x80c80264 | -2134375836 | ECS_E_GHOSTING_FILE_NOT_SYNCED | The file failed to tier because it hasn't synced to the Azure file share. | No action required. The file will tier once it has synced to the Azure file share. |
| 0x80070001 | -2147942401 | ERROR_INVALID_FUNCTION | The file failed to tier because the cloud tiering filter driver (storagesync.sys) isn't running. | To resolve this issue, open an elevated command prompt and run the following command: `fltmc load storagesync`<br>If the Azure File Sync filter driver fails to load when running the `fltmc` command, uninstall the Azure File Sync agent, restart the server, and reinstall the Azure File Sync agent. |
| 0x80070070 | -2147024784 | ERROR_DISK_FULL | The file failed to tier due to insufficient disk space on the volume where the server endpoint is located. | To resolve this issue, free at least 100 MiB of disk space on the volume where the server endpoint is located. |
| 0x80070490 | -2147023728 | ERROR_NOT_FOUND | The file failed to tier because it hasn't synced to the Azure file share. | No action required. The file will tier once it has synced to the Azure file share. |
| 0x80c80262 | -2134375838 | ECS_E_GHOSTING_UNSUPPORTED_RP | The file failed to tier because it's an unsupported reparse point. | If the file is a Data Deduplication reparse point, follow the steps in the [planning guide](file-sync-planning.md#data-deduplication) to enable Data Deduplication support. Files with reparse points other than Data Deduplication aren't supported and won't be tiered.  |
| 0x80c83052 | -2134364078 | ECS_E_CREATE_SV_STREAM_ID_<br>MISMATCH | The file failed to tier because it has been modified. | No action required. The file will tier once the modified file has synced to the Azure file share. |
| 0x80c80269 | -2134375831 | ECS_E_GHOSTING_REPLICA_NOT_<br>FOUND | The file failed to tier because it hasn't synced to the Azure file share. | No action required. The file will tier once it has synced to the Azure file share. |
| 0x80072ee2 | -2147012894 | WININET_E_TIMEOUT | The file failed to tier due to a network issue. | No action required. If the error persists, check network connectivity to the Azure file share. |
| 0x80c80017 | -2134376425 | ECS_E_SYNC_OPLOCK_BROKEN | The file failed to tier because it has been modified. | No action required. The file will tier once the modified file has synced to the Azure file share. |
| 0x800705aa | -2147023446 | ERROR_NO_SYSTEM_RESOURCES | The file failed to tier due to insufficient system resources. | If the error persists, investigate which application or kernel-mode driver is exhausting system resources. |
| 0x8e5e03fe | -1906441218 | JET_errDiskIO | The file failed to tier due to an I/O error when writing to the cloud tiering database. | If the error persists, run chkdsk on the volume and check the storage hardware. |
| 0x8e5e0442 | -1906441150 | JET_errInstanceUnavailable | The file failed to tier because the cloud tiering database isn't running. | To resolve this issue, restart the FileSyncSvc service or server. If the error persists, run chkdsk on the volume and check the storage hardware. |
| 0x80C80285 | -2134375803 | ECS_E_GHOSTING_SKIPPED_BY_<br>CUSTOM_EXCLUSION_LIST | The file can't be tiered because the file type is excluded from tiering. | To tier files with this file type, modify the GhostingExclusionList registry setting which is located under HKEY_LOCAL_MACHINE\SOFTWARE<br>\Microsoft\Azure\StorageSync |
| 0x80C86050 | -2134351792 | ECS_E_REPLICA_NOT_READY_FOR_<br>TIERING | The file failed to tier because the current sync mode is initial upload or reconciliation. | No action required. The file will be tiered once sync completes initial upload or reconciliation. |
| 0x80c8304e | -2134364082 | ECS_E_WORK_FRAMEWORK_ACTION_<br>RETRY_NOT_SUPPORTED | An unexpected error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x80c8309c | -2134364004 | ECS_E_CREATE_SV_BATCHED_CHANGE_<br>DETECTION_FAILED | An unexpected error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x8000ffff | -2147418113 | E_UNEXPECTED | An unexpected error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x80c80220 | -2134375904 | ECS_E_SYNC_METADATA_IO_ERROR | The sync database has encountered an IO error. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x80c830a7 | -2134363993 | ECS_E_AZURE_FILE_SNAPSHOT_LIMIT_<br>REACHED | The Azure file snapshot limit has been reached. | Upgrade the Azure File Sync agent to the latest version. After upgrading the agent, run the `DeepScrubbingScheduledTask` located under \Microsoft\StorageSync. |
| 0x80c80367 | -2134375577 | ECS_E_FILE_SNAPSHOT_OPERATION_<br>EXECUTION_MAX_ATTEMPTS_REACHED | An unexpected error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x80c8306f | -2134364049 | ECS_E_ETAG_MISMATCH | An unexpected error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x80c8304c | -2134364084 | ECS_E_ASYNC_POLLING_TIMEOUT | Timeout error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x299 | N/A | ERROR_FILE_SYSTEM_LIMITATION | An unexpected error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x80c83054 | -2134364076 | ECS_E_CREATE_SV_UNKNOWN_<br>GLOBAL_ID | An unexpected error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x80c8309b | -2134364005 | ECS_E_CREATE_SV_PER_ITEM_CHANGE_<br>DETECTION_FAILED | An unexpected error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x80c83034 | -2134364108 | ECS_E_FORBIDDEN | Access is denied. | Please check the access policies on the storage account, and also check your proxy settings. [Learn more](file-sync-firewall-and-proxy.md#test-network-connectivity-to-service-endpoints). |
| 0x34 | 52 | ERROR_DUP_NAME | An unexpected error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x1128 | 4392 | ERROR_INVALID_REPARSE_DATA | The data is corrupted and unreadable. | Run chkdsk on the volume. [Learn more](/windows-server/administration/windows-commands/chkdsk?tabs=event-viewer). |
| 0x8e5e0450 | -1906441136 | JET_errInvalidSesid | An unexpected error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x80092004 | -2146885628 | CRYPT_E_NOT_FOUND | Certificate required for Azure File Sync authentication is missing. | Run this PowerShell command on the server to reset the certificate `Reset-AzStorageSyncServerCertificate -ResourceGroupName <string> -StorageSyncServiceName <string>` |
| 0x80c80020 | -2134376416 | ECS_E_CLUSTER_NOT_RUNNING | The Failover Cluster service is not running. | Verify the cluster service (clussvc) is running. [Learn more](/troubleshoot/windows-server/high-availability/troubleshoot-cluster-service-fails-to-start). |
| 0x80c83036 | -2134364106 | ECS_E_NOT_FOUND | An unexpected error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x801f0005 | -2145452027 | ERROR_FLT_INVALID_NAME_REQUEST | An unexpected error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x1126 | 4390	| ERROR_NOT_A_REPARSE_POINT | An internal error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x718 | N/A | ERROR_NOT_ENOUGH_QUOTA | Not enough server memory resources available to process this command. | Monitor memory usage on your server. [Learn more](file-sync-planning.md#recommended-system-resources). |
| 0x46a | N/A | ERROR_NOT_ENOUGH_SERVER_MEMORY | Not enough server memory resources available to process this command. | Monitor memory usage on your server. [Learn more](file-sync-planning.md#recommended-system-resources). |
| 0x80070026 | -2147024858 | COR_E_ENDOFSTREAM | An external error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x80131501 | -2146233087 | COR_E_SYSTEM | An external error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x80c86040 | -2134351808 | ECS_E_AZURE_FILE_SHARE_INVALID_<br>HEADER | An unexpected error occurred. | If the error persists for more than a day, create a support request. |
| 0x80c80339 | -2134375623 | ECS_E_CERT_DATE_INVALID | The server's SSL certificate is expired. | Check with your organization's tech support to get help. If you need further investigation, create a support request. |
| 0x80c80337 | -2134375625 | ECS_E_INVALID_CA | The server's SSL certificate was issued by a certificate authority that isn't trusted by this PC. | Check with your organization's tech support to get help. If you need further investigation, create a support request. |
| 0x80c80001 | -2134376447 | ECS_E_SYNC_INVALID_PROTOCOL_FORMAT | A connection with the service could not be established. | Please check and configure the proxy setting correctly or remove the proxy setting. [Learn more](file-sync-firewall-and-proxy.md#test-network-connectivity-to-service-endpoints). |
| 0x6d9 | N/A | EPT_S_NOT_REGISTERED | An external error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x35 | 53 | ERROR_BAD_NETPATH | An external error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x571 | N/A | ERROR_DISK_CORRUPT | The disk structure is corrupted and unreadable. | Run chkdsk on the volume. [Learn more](/windows-server/administration/windows-commands/chkdsk?tabs=event-viewer). |
| 0x52e | N/A | ERROR_LOGON_FAILURE | Operation failed due to an authentication failure. | If the error persists for more than a day, create a support request. |
| 0x8002802b | -2147319765 | TYPE_E_ELEMENTNOTFOUND | An unexpected error occurred. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |
| 0x80072f00 | -2147012864 | WININET_E_FORCE_RETRY | A connection with the service could not be established. | No action required. This error should automatically resolve. If the error persists for several days, create a support request. |

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
| 0x80070079 | -2147942521 | ERROR_SEM_TIMEOUT | The file failed to recall due to an I/O timeout. This issue can occur for several reasons: server resource constraints, poor network connectivity, or an Azure storage issue (for example, throttling). | No action required. If the error persists for several hours, please open a support case. |
| 0x80070036 | -2147024842 | ERROR_NETWORK_BUSY | The file failed to recall due to a network issue.  | If the error persists, check network connectivity to the Azure file share. |
| 0x80c80037 | -2134376393 | ECS_E_SYNC_SHARE_NOT_FOUND | The file failed to recall because the server endpoint was deleted. | To resolve this issue, see [Tiered files aren't accessible on the server after deleting a server endpoint](?tabs=portal1%252cazure-portal#tiered-files-are-not-accessible-on-the-server-after-deleting-a-server-endpoint). |
| 0x80070005 | -2147024891 | ERROR_ACCESS_DENIED | The file failed to recall due to an access denied error. This issue can occur if the firewall and virtual network settings on the storage account are enabled and the server does not have access to the storage account. | To resolve this issue, add the Server IP address or virtual network by following the steps documented in the [Configure firewall and virtual network settings](file-sync-deployment-guide.md?tabs=azure-portal#optional-configure-firewall-and-virtual-network-settings) section in the deployment guide. |
| 0x80c86002 | -2134351870 | ECS_E_AZURE_RESOURCE_NOT_FOUND | The file failed to recall because it's not accessible in the Azure file share. | To resolve this issue, verify the file exists in the Azure file share. If the file exists in the Azure file share, upgrade to the latest Azure File Sync [agent version](file-sync-release-notes.md#supported-versions). |
| 0x80c8305f | -2134364065 | ECS_E_EXTERNAL_STORAGE_ACCOUNT_<br>AUTHORIZATION_FAILED | The file failed to recall due to authorization failure to the storage account. | To resolve this issue, verify [Azure File Sync has access to the storage account](file-sync-troubleshoot-sync-errors.md?tabs=portal1%252cazure-portal#troubleshoot-rbac). |
| 0x80c86030 | -2134351824 | ECS_E_AZURE_FILE_SHARE_NOT_FOUND | The file failed to recall because the Azure file share isn't accessible. | Verify the file share exists and is accessible. If the file share was deleted and recreated, perform the steps documented in the [Sync failed because the Azure file share was deleted and recreated](file-sync-troubleshoot-sync-errors.md?tabs=portal1%252cazure-portal#-2134375810) section to delete and recreate the sync group. |
| 0x800705aa | -2147023446 | ERROR_NO_SYSTEM_RESOURCES | The file failed to recall due to insufficient system resources. | If the error persists, investigate which application or kernel-mode driver is exhausting system resources. |
| 0x8007000e | -2147024882 | ERROR_OUTOFMEMORY | The file failed to recall due to insufficient memory. | If the error persists, investigate which application or kernel-mode driver is causing the low memory condition. |
| 0x80070070 | -2147024784 | ERROR_DISK_FULL | The file failed to recall due to insufficient disk space. | To resolve this issue, free up space on the volume by moving files to a different volume, increase the size of the volume, or force files to tier by using the `Invoke-StorageSyncCloudTiering` cmdlet. |
| 0x80072f8f | -2147012721 | WININET_E_DECODING_FAILED | The file failed to recall because the server was unable to decode the response from the Azure File Sync service. | This error typically occurs if a network proxy is modifying the response from the Azure File Sync service. Please check your proxy configuration. |
| 0x80090352 | -2146892974 | SEC_E_ISSUING_CA_UNTRUSTED | The file failed to recall because your organization is using a TLS terminating proxy or a malicious entity is intercepting the traffic between your server and the Azure File Sync service. | If you're certain this is expected (because your organization is using a TLS terminating proxy), follow the steps documented for error [CERT_E_UNTRUSTEDROOT](file-sync-troubleshoot-sync-errors.md#-2146762487) to resolve this issue. |
| 0x80c86047 | -2134351801 | ECS_E_AZURE_SHARE_SNAPSHOT_NOT_FOUND | The file failed to recall because it's referencing a version of the file which no longer exists in the Azure file share. | This issue can occur if the tiered file was restored from a backup of the Windows Server. To resolve this issue, restore the file from a snapshot in the Azure file share. |
| 0x32 | 50 | ERROR_NOT_SUPPORTED | An internal error occurred. | Please upgrade to the latest Azure File Sync agent version. If the error persists after upgrading the agent, create a support request. |
| 0x6 | N/A | ERROR_INVALID_HANDLE | An internal error occurred. | If the error persists for more than a day, create a support request. |
| 0x80c80310 | -2134375664 | ECS_E_INVALID_DOWNLOAD_RESPONSE | Azure File sync error. | If the error persists for more than a day, create a support request. |
| 0x45d | N/A | ERROR_IO_DEVICE | An internal error occurred. | If the error persists for more than a day, create a support request. |
| 0x80c8604b | -2134351797 | ECS_E_AZURE_FILE_SHARE_FILE_NOT_FOUND | File not found in the file share. | You have likely performed an unsupported operation. [Learn more](file-sync-disaster-recovery-best-practices.md). Please find the original copy of the file and overwrite the tiered file in the server endpoint. |
| 0x21 | 33 | ERROR_LOCK_VIOLATION | The process cannot access the file because another process has locked a portion of the file. | No action required. Once the application closes the handle to the file, recall should succeed. |
| 0x80c8604c | -2134351796 | ECS_E_AZURE_FILE_SNAPSHOT_NOT_FOUND_<br>SYNC_PENDING | An internal error occurred. | No action required. If the error persists for more than a day, create a support request. Recall should succeed after the sync session completes. |
| 0x80c80312 | -2134375662 | ECS_E_DOWNLOAD_SESSION_STREAM_INTERRUPTED | Couldn't finish downloading files. Sync will try again later. | If the error persists, use the `Test-StorageSyncNetworkConnectivity` cmdlet to check network connectivity to the service endpoints. [Learn more](file-sync-firewall-and-proxy.md#test-network-connectivity-to-service-endpoints). |
| 0x80c8600c | -2134351860 | ECS_E_AZURE_INTERNAL_ERROR | The server encountered an internal error. | No action required. If the error persists for more than a day, create a support request. |
| 0x80c8600b | -2134351861 | ECS_E_AZURE_INVALID_RANGE | The server encountered an internal error. | No action required. If the error persists for more than a day, create a support request. |
| 0x45b | N/A | ERROR_SHUTDOWN_IN_PROGRESS | A system shutdown is in progress. | No action required. If the error persists for more than a day, create a support request. |
| 0x80072efd | -2147012867 | WININET_E_CANNOT_CONNECT | A connection with the service could not be established. | Use the `Test-StorageSyncNetworkConnectivity` cmdlet to check network connectivity to the service endpoints. [Learn more](file-sync-firewall-and-proxy.md#test-network-connectivity-to-service-endpoints). |
| 0x800703ee | -2147023890 | ERROR_FILE_INVALID | The volume for a file has been externally altered so that the opened file is no longer valid. | If the error persists for more than a day, create a support request. |
| 0x80c86048 | -2134351800 | ECS_E_AZURE_FILE_SNAPSHOT_NOT_FOUND | An internal error occurred. | You have likely performed an unsupported operation. [Learn more](file-sync-disaster-recovery-best-practices.md). Please find the original copy of the file and overwrite the tiered file in the server endpoint. |
| 0x80072f78 | -2147012744 | WININET_E_INVALID_SERVER_RESPONSE | A connection with the service could not be established. | Use the `Test-StorageSyncNetworkConnectivity` cmdlet to check network connectivity to the service endpoints. [Learn more](file-sync-firewall-and-proxy.md#test-network-connectivity-to-service-endpoints). |
| 0x8007139f | -2147019873 | ERROR_INVALID_STATE | An internal error occurred. | No action required. If the error persists for more than a day, create a support request. |
| 0x570 | N/A | ERROR_FILE_CORRUPT | The file or directory is corrupted and unreadable. | Run chkdsk on the volume. [Learn more](/windows-server/administration/windows-commands/chkdsk?tabs=event-viewer). |
| 0x5ad | N/A | ERROR_WORKING_SET_QUOTA | Insufficient quota to complete the requested service. | Monitor memory usage on your server. If the error persists for more than a day, create a support request. |
| 0x8 | N/A | ERROR_NOT_ENOUGH_MEMORY | Not enough memory resources are available to process this command. | Monitor memory usage on your server. If the error persists for more than a day, create a support request. |
| 0x80c80072 | -2134376334 | ECS_E_BAD_GATEWAY | A connection with the service could not be established. | Use the `Test-StorageSyncNetworkConnectivity` cmdlet to check network connectivity to the service endpoints. [Learn more](file-sync-firewall-and-proxy.md#test-network-connectivity-to-service-endpoints). |
| 0x80190193 | -2145844845 | HTTP_E_STATUS_FORBIDDEN | Forbidden (403) error occurred. | Update Azure file share access policy. [Learn more](../../role-based-access-control/built-in-roles.md). |
| 0x80c8604e | -2134351794 | ECS_E_AZURE_FILE_SNAPSHOT_NOT_FOUND_ON_<br>CONFLICT_FILE | Unable to recall sync conflict loser file from Azure file share. | If this error is happening for a tiered file that is a sync conflict file, this file might not be needed by end users anymore. If the original file is available and valid, you may remove this file from the server endpoint. |
| 0x80c80075 | -2134376331 | ECS_E_ACCESS_TOKEN_CATASTROPHIC_FAILURE | An internal error occurred. | No action required. If the error persists for more than a day, create a support request. |
| 0x80c8005b | -2134376357 | ECS_E_AZURE_FILE_SERVICE_UNAVAILABLE | The Azure File Service is currently unavailable. | If the error persists for more than a day, create a support request. |
| 0x80c83099 | -2134364007 | ECS_E_PRIVATE_ENDPOINT_ACCESS_BLOCKED | Private endpoint configuration access blocked. | Check the private endpoint configuration and allow access to the Azure File Sync service. [Learn more](file-sync-firewall-and-proxy.md#test-network-connectivity-to-service-endpoints). |
| 0x80c86000 | -2134351872 | ECS_E_AZURE_AUTHENTICATION_FAILED | Server failed to authenticate the request. | Check the network configuration and make sure the storage account accepts the server IP address. You can do this by adding the server IP, adding the server's IP subnet, or adding the server vnet to the authorized access control list to access the storage account. [Learn more](file-sync-deployment-guide.md#optional-configure-firewall-and-virtual-network-settings). |
| 0x2ef1 | 12017 | ERROR_WINHTTP_OPERATION_CANCELLED | A connection with the service could not be established. | If the error persists, use the `Test-StorageSyncNetworkConnectivity` cmdlet to check network connectivity to the service endpoints. [Learn more](file-sync-firewall-and-proxy.md#test-network-connectivity-to-service-endpoints). |
| 0x80c80338 | -2134375624 | ECS_E_CERT_CN_INVALID | The server's SSL certificate contains incorrect hostnames. The certificate can't be used to establish the SSL connection. | Check with your organization's tech support to get help. If you need further investigation, create a support request. |
| 0x80c8000c | -2134376436 | ECS_E_SYNC_UNKNOWN_URI | An internal error occurred. | No action required. If the error persists for more than a day, create a support request. |
| 0x80c8033a | -2134375622 | ECS_E_SECURITY_CHANNEL_ERROR | There was a problem validating the server's SSL certificate. | Check with your organization's tech support to get help. If you need further investigation, create a support request. |
| 0x80131509 | -2146233079 | COR_E_INVALIDOPERATION | An unexpected error occurred. | If the error persists for more than a day, create a support request. |
| 0x80c8603d | -2134351811 | ECS_E_AZURE_UNKNOWN_FAILURE | An unexpected error occurred. | No action required. If the error persists for more than a day, create a support request. |
| 0x80c8033f | -2134375617 | ECS_E_TOKEN_LIFETIME_IS_TOO_LONG | An internal error occurred. | No action required. If the error persists for more than a day, create a support request. |
| 0x80190190 | -2145844848 | HTTP_E_STATUS_BAD_REQUEST | A connection with the service could not be established. | No action required. If the error persists for more than a day, create a support request. |
| 0x80c86036 | -2134351818 | ECS_E_AZURE_FILE_PARENT_NOT_FOUND | The specified parent path for the file does not exist | You have likely performed an unsupported operation. [Learn more](file-sync-disaster-recovery-best-practices.md). Please find the original copy of the file and overwrite the tiered file in the server endpoint. |
| 0x80c86049 | -2134351799 | ECS_E_AZURE_SHARE_SNAPSHOT_FILE_NOT_FOUND | File not found in the share snapshot. | You have likely performed an unsupported operation. [Learn more](file-sync-disaster-recovery-best-practices.md). Please find the original copy of the file and overwrite the tiered file in the server endpoint. |
| 0x80c80311 | -2134375663 | ECS_E_DOWNLOAD_SESSION_HASH_CONFLICT | An internal error occurred. | If the error persists for more than a day, create a support request. |
| 0x800700a4 | -2147024732 | ERROR_MAX_THRDS_REACHED | An internal error occurred. | No action required. If the error persists for more than a day, create a support request. |
| 0x80070147 | -2147024569 | ERROR_OFFSET_ALIGNMENT_VIOLATION | An internal error occurred. | If the error persists for more than a day, create a support request. |
| 0x80090321 | -2146893023 | SEC_E_BUFFER_TOO_SMALL | An internal error occurred. | If the error persists for more than a day, create a support request. |
| 0x801901a0 | -2145844832 | HTTP_E_STATUS_RANGE_NOT_SATISFIABLE | An internal error occurred. | If the error persists for more than a day, create a support request. |
| 0x80c80066 | -2134376346 | ECS_E_CLUSTER_ID_MISMATCH | There is a mismatch between the cluster ID returned from cluster API and the cluster ID saved during the registration. | Please create a support request for further investigation of the issue. |
| 0x80c8032d | -2134375635 | ECS_E_PROXY_AUTH_REQUIRED | The proxy server used to access the internet needs your current credentials. | If your proxy requires authentication, update the proxy credentials. [Learn more](file-sync-firewall-and-proxy.md#proxy). |
| 0x7a | 122 | ERROR_INSUFFICIENT_BUFFER | An internal error occurred. | No action required. If the error persists for more than a day, create a support request. |
| 0x8019012e | -2145844946 | HTTP_E_STATUS_REDIRECT | Azure File Sync does not support HTTP redirection. | Disable HTTP redirect on your proxy server or network device. |
| 0x6be | N/A | RPC_S_CALL_FAILED | An unknown error occurred. | If the error persists, use the `Test-StorageSyncNetworkConnectivity` cmdlet to check network connectivity to the service endpoints. [Learn more](file-sync-firewall-and-proxy.md#test-network-connectivity-to-service-endpoints). |
| 0x2747 | 10055 | WSAENOBUFS | An internal error occurred. | If the error persists, use the `Test-StorageSyncNetworkConnectivity` cmdlet to check network connectivity to the service endpoints. [Learn more](file-sync-firewall-and-proxy.md#test-network-connectivity-to-service-endpoints). |

## Tiered files are not accessible on the server after deleting a server endpoint
Tiered files on a server will become inaccessible if the files aren't recalled prior to deleting a server endpoint.

Errors logged if tiered files aren't accessible
- When syncing a file, error code -2147942467 (0x80070043 - ERROR_BAD_NET_NAME) is logged in the ItemResults event log
- When recalling a file, error code -2134376393 (0x80c80037 - ECS_E_SYNC_SHARE_NOT_FOUND) is logged in the RecallResults event log

Restoring access to your tiered files is possible if the following conditions are met:
- Server endpoint was deleted within past 30 days
- Cloud endpoint wasn't deleted 
- File share wasn't deleted
- Sync group wasn't deleted

If the above conditions are met, you can restore access to the files on the server by recreating the server endpoint at the same path on the server within the same sync group within 30 days. 

If the above conditions aren't met, restoring access isn't possible as these tiered files on the server are now orphaned. Follow these instructions to remove the orphaned tiered files.

**Notes**
- When tiered files aren't accessible on the server, the full file should still be accessible if you access the Azure file share directly.
- To prevent orphaned tiered files in the future, follow the steps documented in [Remove a server endpoint](file-sync-server-endpoint-delete.md) when deleting a server endpoint.

<a id="get-orphaned"></a>**How to get the list of orphaned tiered files** 

1. Run the following PowerShell commands to list orphaned tiered files:
```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
$orphanFiles = Get-StorageSyncOrphanedTieredFiles -path <server endpoint path>
$orphanFiles.OrphanedTieredFiles > OrphanTieredFiles.txt
```
2. Save the OrphanTieredFiles.txt output file in case files need to be restored from backup after they're deleted.

<a id="remove-orphaned"></a>**How to remove orphaned tiered files** 

*Option 1: Delete the orphaned tiered files*

This option deletes the orphaned tiered files on the Windows Server but requires removing the server endpoint if it exists due to re-creation after 30 days or is connected to a different sync group. File conflicts will occur if files are updated on the Windows Server or Azure file share before the server endpoint is recreated.

1. Back up the Azure file share and server endpoint location.
2. Remove the server endpoint in the sync group (if it exists) by following the steps documented in [Remove a server endpoint](file-sync-server-endpoint-delete.md).

> [!Warning]  
> If the server endpoint isn't removed prior to using the `Remove-StorageSyncOrphanedTieredFiles` cmdlet, deleting the orphaned tiered file on the server will delete the full file in the Azure file share. 

3. Run the following PowerShell commands to list orphaned tiered files:

```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
$orphanFiles = Get-StorageSyncOrphanedTieredFiles -path <server endpoint path>
$orphanFiles.OrphanedTieredFiles > OrphanTieredFiles.txt
```
4. Save the OrphanTieredFiles.txt output file in case files need to be restored from backup after they're deleted.
5. Run the following PowerShell commands to delete orphaned tiered files:

```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
$orphanFilesRemoved = Remove-StorageSyncOrphanedTieredFiles -Path <folder path containing orphaned tiered files> -Verbose
$orphanFilesRemoved.OrphanedTieredFiles > DeletedOrphanFiles.txt
```
**Notes** 
- Tiered files modified on the server that aren't synced to the Azure file share will be deleted.
- Tiered files that are accessible (not orphan) won't be deleted.
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
- [Troubleshoot Azure Files](../files/files-troubleshoot.md)
