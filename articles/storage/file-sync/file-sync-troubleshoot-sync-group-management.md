---
title: Troubleshoot Azure File Sync sync group management
description: Troubleshoot common issues in managing Azure File Sync sync groups, including cloud endpoint creation and server endpoint creation, deletion, and health.
author: khdownie
ms.service: storage
ms.topic: troubleshooting
ms.date: 10/25/2022
ms.author: kendownie
ms.subservice: files 
ms.custom: devx-track-azurepowershell
---

# Troubleshoot Azure File Sync sync group management
A sync group defines the sync topology for a set of files. Endpoints within a sync group are kept in sync with each other. A sync group must contain one cloud endpoint, which represents an Azure file share, and one or more server endpoints, which represents a path on a registered server. This article is designed to help you troubleshoot and resolve issues that you might encounter when managing sync groups.

## Cloud endpoint creation errors

<a id="cloud-endpoint-mgmtinternalerror"></a>**Cloud endpoint creation fails, with this error: "MgmtInternalError"**  
This error can occur if the Azure File Sync service cannot access the storage account due to SMB security settings. To enable Azure File Sync to access the storage account, the SMB security settings on the storage account must allow **SMB 3.1.1** protocol version, **NTLM v2** authentication and **AES-128-GCM** encryption. To check the SMB security settings on the storage account, see [SMB security settings](../files/files-smb-protocol.md#smb-security-settings).

<a id="cloud-endpoint-mgmtforbidden"></a>**Cloud endpoint creation fails, with this error: "MgmtForbidden"**  
This error occurs if the Azure File Sync service cannot access the storage account. 

To resolve this issue, perform the following steps:
- Verify the "Allow trusted Microsoft services to access this storage account" setting is checked on your storage account. To learn more, see [Restrict access to the storage account public endpoint](file-sync-networking-endpoints.md#restrict-access-to-the-storage-account-public-endpoint).
- Verify the SMB security settings on your storage account. To enable Azure File Sync to access the storage account, the SMB security settings on the storage account must allow **SMB 3.1.1** protocol version, **NTLM v2** authentication and **AES-128-GCM** encryption. To check the SMB security settings on the storage account, see [SMB security settings](../files/files-smb-protocol.md#smb-security-settings).

<a id="cloud-endpoint-authfailed"></a>**Cloud endpoint creation fails, with this error: "AuthorizationFailed"**  
This error occurs if your user account doesn't have sufficient rights to create a cloud endpoint. 

To create a cloud endpoint, your user account must have the following Microsoft Authorization permissions:  
* Read: Get role definition
* Write: Create or update custom role definition
* Read: Get role assignment
* Write: Create role assignment

The following built-in roles have the required Microsoft Authorization permissions:  
* Owner
* User Access Administrator

To determine whether your user account role has the required permissions:  
1. In the Azure portal, select **Resource groups**.
2. Select the resource group where the storage account is located, and then select **Access control (IAM)**.
3. Select the **Role assignments** tab.
4. Select the **Role** (for example, Owner or Contributor) for your user account.
5. In the **Resource Provider** list, select **Microsoft Authorization**. 
    * **Role assignment** should have **Read** and **Write** permissions.
    * **Role definition** should have **Read** and **Write** permissions.

<a id="cloud-endpoint-using-share"></a>**Cloud endpoint creation fails, with this error: "The specified Azure FileShare is already in use by a different CloudEndpoint"**  
This error occurs if the Azure file share is already in use by another cloud endpoint. 

If you see this message and the Azure file share currently is not in use by a cloud endpoint, complete the following steps to clear the Azure File Sync metadata on the Azure file share:

> [!Warning]  
> Deleting the metadata on an Azure file share that is currently in use by a cloud endpoint causes Azure File Sync operations to fail. If you then use this file share for sync in a different sync group, data loss for files in the old sync group is almost certain.

1. In the Azure portal, go to your Azure file share.  
2. Right-click the Azure file share, and then select **Edit metadata**.
3. Right-click **SyncService**, and then select **Delete**.

## Server endpoint creation and deletion errors

<a id="-2134375898"></a>**Server endpoint creation fails, with this error: "MgmtServerJobFailed" (Error code: -2134375898 or 0x80c80226)**  
This error occurs if the server endpoint path is on the system volume and cloud tiering is enabled. Cloud tiering is not supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.

<a id="-2147024894"></a>**Server endpoint creation fails, with this error: "MgmtServerJobFailed" (Error code: -2147024894 or 0x80070002)**  
This error occurs if the server endpoint path specified is not valid. Verify the server endpoint path specified is a locally attached NTFS volume. Note, Azure File Sync does not support mapped drives as a server endpoint path.

<a id="-2134375640"></a>**Server endpoint creation fails, with this error: "MgmtServerJobFailed" (Error code: -2134375640 or 0x80c80328)**  
This error occurs if the server endpoint path specified is not an NTFS volume. Verify the server endpoint path specified is a locally attached NTFS volume. Note, Azure File Sync does not support mapped drives as a server endpoint path.

<a id="-2134347507"></a>**Server endpoint creation fails, with this error: "MgmtServerJobFailed" (Error code: -2134347507 or 0x80c8710d)**  
This error occurs because Azure File Sync does not support server endpoints on volumes, which have a compressed System Volume Information folder. To resolve this issue, decompress the System Volume Information folder. If the System Volume Information folder is the only folder compressed on the volume, perform the following steps:

1. Download [PsExec](/sysinternals/downloads/psexec) tool.
2. Run the following command from an elevated command prompt to launch a command prompt running under the system account: **PsExec.exe -i -s -d cmd**
3. From the command prompt running under the system account, type the following commands and hit enter:   
    **cd /d "drive letter:\System Volume Information"**  
    **compact /u /s**

<a id="-2134376345"></a>**Server endpoint creation fails, with this error: "MgmtServerJobFailed" (Error code: -2134376345 or 0x80C80067)**  
This error occurs if the limit of server endpoints per server is reached. Azure File Sync currently supports up to 30 server endpoints per server. For more information, see 
[Azure File Sync scale targets](../files/storage-files-scale-targets.md?toc=/azure/storage/filesync/toc.json#azure-file-sync-scale-targets).

<a id="-2134376427"></a>**Server endpoint creation fails, with this error: "MgmtServerJobFailed" (Error code: -2134376427 or 0x80c80015)**  
This error occurs if another server endpoint is already syncing the server endpoint path specified. Azure File Sync does not support multiple server endpoints syncing the same directory or volume.

<a id="-2160590967"></a>**Server endpoint creation fails, with this error: "MgmtServerJobFailed" (Error code: -2160590967 or 0x80c80077)**  
This error occurs if the server endpoint path contains orphaned tiered files. If a server endpoint was recently removed, wait until the orphaned tiered files cleanup has completed. An Event ID 6662 is logged to the Telemetry event log once the orphaned tiered files cleanup has started. An Event ID 6661 is logged once the orphaned tiered files cleanup has completed and a server endpoint can be recreated using the path. If the server endpoint creation fails after the tiered files cleanup has completed or if Event ID 6661 cannot be found in the Telemetry event log due to event log rollover, remove the orphaned tiered files by performing the steps documented in [Tiered files are not accessible on the server after deleting a server endpoint](file-sync-troubleshoot-cloud-tiering.md#tiered-files-are-not-accessible-on-the-server-after-deleting-a-server-endpoint).

<a id="-2134347757"></a>**Server endpoint deletion fails, with this error: "MgmtServerJobExpired" (Error code: -2134347757 or 0x80c87013)**  
This error occurs if the server is offline or doesn't have network connectivity. If the server is no longer available, unregister the server in the portal, which will delete the server endpoints. To delete the server endpoints, follow the steps that are described in [Unregister a server with Azure File Sync](file-sync-server-registration.md#unregister-the-server-with-storage-sync-service).

## Server endpoint health

<a id="server-endpoint-provisioningfailed"></a>**Unable to open server endpoint properties page or update cloud tiering policy**  
This issue can occur if a management operation on the server endpoint fails. If the server endpoint properties page does not open in the Azure portal, updating server endpoint using PowerShell commands from the server may fix this issue. 

```powershell
# Get the server endpoint id based on the server endpoint DisplayName property
Get-AzStorageSyncServerEndpoint `
    -ResourceGroupName myrgname `
    -StorageSyncServiceName storagesvcname `
    -SyncGroupName mysyncgroup | `
Tee-Object -Variable serverEndpoint

# Update the free space percent policy for the server endpoint
Set-AzStorageSyncServerEndpoint `
    -InputObject $serverEndpoint
    -CloudTiering `
    -VolumeFreeSpacePercent 60
```
<a id="server-endpoint-noactivity"></a>**Server endpoint has a health status of "No Activity" or "Pending" and the server state on the registered servers blade is "Appears offline"**  

This issue can occur if the Storage Sync Monitor process (AzureStorageSyncMonitor.exe) is not running or the server is unable to access the Azure File Sync service.

On the server that is showing as "Appears offline" in the portal, look at Event ID 9301 in the Telemetry event log (located under Applications and Services\Microsoft\FileSync\Agent in Event Viewer) to determine why the server is unable to access the Azure File Sync service. 

- If **GetNextJob completed with status: 0** is logged, the server can communicate with the Azure File Sync service. 
    - Open Task Manager on the server and verify the Storage Sync Monitor (AzureStorageSyncMonitor.exe) process is running. If the process is not running, first try restarting the server. If restarting the server does not resolve the issue, upgrade to the latest Azure File Sync [agent version](file-sync-release-notes.md). 

- If **GetNextJob completed with status: -2134347756** is logged, the server is unable to communicate with the Azure File Sync service due to a firewall, proxy, or TLS cipher suite order configuration. 
    - If the server is behind a firewall, verify port 443 outbound is allowed. If the firewall restricts traffic to specific domains, confirm the domains listed in the Firewall [documentation](file-sync-firewall-and-proxy.md#firewall) are accessible.
    - If the server is behind a proxy, configure the machine-wide or app-specific proxy settings by following the steps in the Proxy [documentation](file-sync-firewall-and-proxy.md#proxy).
    - Use the Test-StorageSyncNetworkConnectivity cmdlet to check network connectivity to the service endpoints. To learn more, see [Test network connectivity to service endpoints](file-sync-firewall-and-proxy.md#test-network-connectivity-to-service-endpoints).
    - If the TLS cipher suite order is configured on the server, you can use group policy or TLS cmdlets to add cipher suites:
        - To use group policy, see [Configuring TLS Cipher Suite Order by using Group Policy](/windows-server/security/tls/manage-tls#configuring-tls-cipher-suite-order-by-using-group-policy).
        - To use TLS cmdlets, see [Configuring TLS Cipher Suite Order by using TLS PowerShell Cmdlets](/windows-server/security/tls/manage-tls#configuring-tls-cipher-suite-order-by-using-tls-powershell-cmdlets).
    
        Azure File Sync currently supports the following cipher suites for TLS 1.2 protocol:  
        - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
        - TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
        - TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256  

> [!Note]
> Different Windows versions support different TLS cipher suites and priority order. See [TLS Cipher Suites in Windows](/windows/win32/secauthn/cipher-suites-in-schannel) for the corresponding Windows version and the supported cipher suites and default order in which they are chosen by the Microsoft Schannel Provider.

- If **GetNextJob completed with status: -2134347764** is logged, the server is unable to communicate with the Azure File Sync service due to an expired or deleted certificate.  
    - Run the following PowerShell command on the server to reset the certificate used for authentication:
    ```powershell
    Reset-AzStorageSyncServerCertificate -ResourceGroupName <string> -StorageSyncServiceName <string>
    ```
<a id="endpoint-noactivity-sync"></a>**Server endpoint has a health status of "No Activity" and the server state on the registered servers blade is "Online"**  

A server endpoint health status of "No Activity" means the server endpoint has not logged sync activity in the past two hours.

To check current sync activity on a server, see [How do I monitor the progress of a current sync session?](file-sync-troubleshoot-sync-errors.md#how-do-i-monitor-the-progress-of-a-current-sync-session)

A server endpoint may not log sync activity for several hours due to a bug or insufficient system resources. Verify the latest Azure File Sync [agent version](file-sync-release-notes.md) is installed. If the issue persists, open a support request.

> [!Note]  
> If the server state on the registered servers blade is "Appears Offline," perform the steps documented in the [Server endpoint has a health status of "No Activity" or "Pending" and the server state on the registered servers blade is "Appears offline"](#server-endpoint-noactivity) section.

## See also
- [Troubleshoot Azure File Sync sync errors](file-sync-troubleshoot-sync-errors.md)
- [Troubleshoot Azure File Sync agent installation and server registration](file-sync-troubleshoot-installation.md)
- [Troubleshoot Azure File Sync cloud tiering](file-sync-troubleshoot-cloud-tiering.md)
- [Monitor Azure File Sync](file-sync-monitoring.md)
- [Troubleshoot Azure Files problems in Windows](../files/storage-troubleshoot-windows-file-connection-problems.md)
- [Troubleshoot Azure Files problems in Linux](../files/storage-troubleshoot-linux-file-connection-problems.md)
