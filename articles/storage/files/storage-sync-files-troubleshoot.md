---
title: Troubleshoot Azure File Sync (preview) | Microsoft Docs
description: Troubleshoot common issues with Azure File Sync
services: storage
documentationcenter: ''
author: wmgries
manager: klaasl
editor: jgerend

ms.assetid: 297f3a14-6b3a-48b0-9da4-db5907827fb5
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/08/2017
ms.author: wgries
---

# Troubleshoot Azure File Sync (preview)
Azure File Sync (preview) allows you to centralize your organization's file shares in Azure Files without giving up the flexibility, performance, and compatibility of an on-premises file server. It does this by transforming your Windows Servers into a quick cache of your Azure File share. You can use any protocol available on Windows Server to access your data locally (including SMB, NFS, and FTPS) and you can have as many caches as you need across the world.

This article is designed to help you troubleshoot and resolve issues encountered with your Azure File Sync deployment. Failing that, this guide illustrates how to collect important logs from the system to aid in a deeper investigation of the issues. If you don't see the answer to your question here, don't hesitate to reach out to us through the following channels (in escalating order):

1. In the comments section of this article.
2. [Azure Storage Forum](https://social.msdn.microsoft.com/Forums/home?forum=windowsazuredata)
3. [Azure Files UserVoice](https://feedback.azure.com/forums/217298-storage/category/180670-files) 
4. Microsoft Support: To create a new support case, navigate to the "Help + support" tab on the Azure portal and click "New support request".

## Agent installation and server registration
<a id="agent-installation-failures"></a>**How to troubleshoot agent installation failures**  
If the Azure File Sync agent installation is failing, run the following command from an elevated command prompt to enable logging during the agent installation:

```
StorageSyncAgent.msi /l*v Installer.log
```

Once the installation fails, review the installer.log to determine the cause. 

> [!Note]  
> The agent installation will fail if you select to use Microsoft Update and the Windows Update service is not running.

<a id="server-registration-missing"></a>**Server is not listed under Registered Servers in the Azure portal**  
If a server is not listed under Registered Servers for a Storage Sync Service, perform the following steps:
1. Login to the server that you want to register.
2. Open File Explorer and navigate to the Storage Sync Agent installation directory (default location is `C:\Program Files\Azure\StorageSyncAgent`). 
3. Run ServerRegistration.exe and follow the wizard to register the server with a Storage Sync Service.

<a id="server-already-registered"></a>**Server Registration displays the following message after installing the Azure File Sync agent: "This server is already registered"**  
![A screenshot of the Server Registration dialog with the "server is already registered" error message](media/storage-sync-files-troubleshoot/server-registration-1.png)

This message is displayed if the server was previously registered with a Storage Sync Service. To unregister the server with the current Storage Sync Service and register with a new Storage Sync Service, follow the steps to [Unregister a server with Azure File Sync](storage-sync-files-server-registration.md#unregister-the-server-with-storage-sync-service).

If the server is not listed under Registered Servers in the Storage Sync Service, run the following PowerShell commands on the server that you want to unregister:

```PowerShell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
Reset-StorageSyncServer
```

> [!Note]  
> If the server is part of a cluster, there is an optional `Reset-StorageSyncServer -CleanClusterRegistration` parameter that will also remove the cluster registration.

<a id="web-site-not-trusted"></a>**When registering a server I get numerous "web site not trusted" responses, why?**  
This error occurs because the **Enhanced Internet Explorer Security** policy is enabled during server registration. For more information on how to properly disable the **Enhanced Internet Explorer Security** policy, see [Prepare Windows Servers for use with Azure File Sync](storage-sync-files-deployment-guide.md#prepare-windows-servers-for-use-with-azure-file-sync) and [How to deploy Azure File Sync (preview)](storage-sync-files-deployment-guide.md).

## Sync Group management
<a id="cloud-endpoint-using-share"></a>**Cloud Endpoint creation fails with the following error: "The specified Azure FileShare is already in use by a different CloudEndpoint"**  
This error occurs if the Azure File share is already in use by another Cloud Endpoint. 

If you're receiving this error and the Azure File share is not currently in use by a Cloud Endpoint, perform the following steps below to clear the Azure File Sync metadata on the Azure File share:

> [!Warning]  
> Deleting the metadata on an Azure File share that is currently in use by a Cloud endpoint will cause Azure File Sync operations to fail. 

1. Navigate to your Azure File share in the Azure Portal.  
2. Right click the Azure File share and select **Edit metadata**
3. Right click SyncService and select **Delete**.

<a id="cloud-endpoint-authfailed"></a>**Cloud Endpoint creation fails with error: AuthorizationFailed**  
This issue occurs if your user account doesn't have sufficient rights to create a Cloud Endpoint. 

To create a Cloud Endpoint, your user account must have the following Microsoft Authorization permissions:  
* Read: Get role definition
* Write: Create or update custom role definition
* Read: Get role assignment
* Write: Create role assignment

The following built-in roles have the appropriate Microsoft Authorization permissions:  
* Owner
* User Access Administrator

To determine if your user account role has the appropriate permissions, perform the following:  
* Click **Resource Groups** in the Azure portal
* Select the resource group where the storage account is located and click **Access control (IAM)**
* Click the **role** (e.g., Owner, Contributor) for your user account.
* In the **Resource Provider** list, select **Microsoft Authorization** 
* **Role assignment** should have **Read** and **Write permissions**
* **Role definition** should have **Read** and **Write permissions**

<a id="cloud-endpoint-deleteinternalerror"></a>**Endpoint deletion fails with error: MgmtInternalError**  
This issue can occur if the Azure File share or storage account was deleted prior to deleting the Cloud Endpoint. This issue will be fixed in a future update and the Cloud Endpoint can be deleted.

To prevent this issue from occurring, delete the Cloud Endpoint prior to deleting the Azure File share or storage account.

## Sync
<a id="afs-change-detection"></a>**I created a file directly in my Azure File share over SMB or through the portal. How long until the file is synced to the servers in the Sync Group?**  
[!INCLUDE [storage-sync-files-change-detection](../../../includes/storage-sync-files-change-detection.md)]

<a id="broken-sync"></a>**How to troubleshoot sync not working on a server**  
If sync is failing on a server, perform the following:
- Verify a Server Endpoint exists in the Azure portal for the directory you want to sync to an Azure File share:
    
    ![A screenshot of a Sync Group with both a Cloud and Server Endpoint in the Azure portal](media/storage-sync-files-troubleshoot/sync-troubleshoot-1.png)

- Review the Operational and Diagnostic event logs with Event Viewer, located under `Applications and Services\Microsoft\FileSync\Agent`.
- Confirm the server has internet connectivity.
- Verify the Azure File Sync service is running on the server by opening up the Services MMC snap-in and verify the Storage Sync Agent service (FileSyncSvc) is running.

<a id="replica-not-ready"></a>**Sync fails with error: 0x80c8300f - The replica is not ready to perform the required operation**  
This error is expected if you create a Cloud Endpoint and use an Azure File share which contains data. Once change detection completes on the Azure File share (may take up to 24 hours), sync should start working properly.

<a id="broken-sync-files"></a>**How to troubleshoot individual files failing to sync**  
If individual files are failing to sync, perform the following:
- Review the Operational and Diagnostic event logs under `Applications and Services\Microsoft\FileSync\Agent` in Event Viewer
- Verify there are no open handles on the file
    - Note: Azure File Sync will periodically take VSS snapshots to sync files with open handles

## Cloud tiering 
<a id="files-fail-tiering"></a>**How to troubleshoot files that fail to tier**  
If file(s) fail to tier to Azure Files, perform the following steps:

- Verify the file(s) exist in the Azure file share
    - Note: A file must be synced to an Azure file share before it can be tiered
- Review the Operational and Diagnostic event logs, located under `Applications and Services\Microsoft\FileSync\Agent` in Event Viewer
- Confirm the server has internet connectivity 
- Verify the Azure File Sync filter drivers (StorageSync.sys & StorageSyncGuard.sys) are running
    - Open an elevated command prompt, run `fltmc` and verify the StorageSync.sys and StorageSyncGuard.sys file system filter drivers are listed

<a id="files-fail-recall"></a>**How to troubleshoot files that fail to be recalled**  
If files fail to be recalled, perform the following steps:
- Review the Operational and Diagnostic event logs, located under `Applications and Services\Microsoft\FileSync\Agent` in Event Viewer
- Verify the file(s) exists in the Azure File Share
- Confirm the server has internet connectivity 
- Verify the Azure File Sync filter drivers (StorageSync.sys & StorageSyncGuard.sys) are running
    - Open an elevated command prompt, run `fltmc` and verify the StorageSync.sys and StorageSyncGuard.sys file system filter drivers are listed

<a id="files-unexpectedly-recalled"></a>**How to troubleshoot files being unexpectedly recalled on a server**  
Anti-virus, backup, and other applications that read large numbers of files will cause undesirable recalls unless they respect the offline attribute and skip reading the content of those files. Skipping offline files for those products that support it helps avoid undesirable recalls when performing operations such as anti-virus scans or backup jobs.

Consult with your software vendor regarding how to configure their solution to skip reading offline files.

Further undesired recalls may happen in other scenarios like browsing files in File Explorer. Opening a folder with cloud-tiered files in File Explorer on the server may result in undesired recalls, more so if anti-virus is enabled on the server.

## General troubleshooting
If you encounter issues with Azure File Sync on a server, start by performing the following:
- Review the Diagnostic and Operational event logs in Event Viewer
    - Sync, Tiering, and Recall issues are logged in the diagnostic and operational event logs under `Applications and Services\Microsoft\FileSync\Agent`
    - Issues managing a server (for example, configuration settings) are logged in the diagnostic and operational event logs under `Applications and Services\Microsoft\FileSync\Management`
- Verify the Azure File Sync service is running on the server
    - Open the Services MMC snap-in and verify the Storage Sync Agent service (FileSyncSvc) is running
- Verify the Azure File Sync filter drivers (StorageSync.sys & StorageSyncGuard.sys) are running
    - Open an elevated command prompt, run fltmc and verify the StorageSync.sys and StorageSyncGuard.sys file system filter drivers are listed

If the issue is not resolved after performing the steps above, run the AFSDiag tool by performing the following steps:
1. Create a directory that will be used to save the AFSDiag output (for example, c:\output).
2. Open an elevated PowerShell window and run the following commands (hit enter after each command):

    ```PowerShell
    cd "c:\Program Files\Azure\StorageSyncAgent"
    Import-Module .\afsdiag.ps1
    Debug-Afs c:\output # Note: use the path created in step 1
    ```

3. For the Azure File Sync kernel mode trace level, enter 1 (unless specified to create more verbose traces) and hit enter.
4. For the Azure File Sync user mode trace level, enter 1 (unless specified to create more verbose traces) and hit enter.
5. Reproduce the issue and press D when done.
6. A .zip file containing logs and trace files will be in the output directory specified.

## See also
- [Azure Files frequently asked questions](storage-files-faq.md)
- [Troubleshoot Azure Files problems in Windows](storage-troubleshoot-windows-file-connection-problems.md)
- [Troubleshoot Azure Files problems in Linux](storage-troubleshoot-linux-file-connection-problems.md)
