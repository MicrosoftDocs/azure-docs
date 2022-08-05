---
title: Release notes for the Azure Storage Mover service | Microsoft Docs
description: Read the release notes for the Azure Storage Mover service, which allows you to migrate your on-premises unstructured data to the Azure Storage service.
services: storage-mover
author: stevenmatthew

ms.service: storage
ms.topic: conceptual
ms.date: 06/21/2022
ms.author: shaas
---

# Release notes for the Azure Storage Mover service

Azure Storage Mover allows you to do some cool stuff.

This article provides the release notes for the supported versions of the hybrid Azure Storage Mover service.

## Supported versions

The following Azure Storage Mover versions are supported:

| Milestone | Version number | Release date | Status |
|----|----------------------|--------------|------------------|
| V1 Release | 1.0.0.0 | August 1, 2022 | Supported |

## Unsupported versions

The following Azure Storage Mover versions have expired and are no longer supported:

| Milestone | Version number | Release date | Status |
|----|----------------------|--------------|------------------|
| V0.5 Release | 0.0.1 - 0.5 | N/A | Not Supported - Resource versions expired on July 1, 2022 |

### Azure Storage Mover update policy

The Azure Storage Mover is updated on a regular basis to add new functionality and to address issues. We recommend updating the Azure Storage Mover as new versions are available.

#### Major vs. minor versions

* Major agent versions often contain new features and have an increasing number as the first part of the version number. For example: 1.0.0.0
* Minor agent versions are also called "patches" and are released more frequently than major versions. They often contain bug fixes and smaller improvements but no new features. For example: 1.1.0.0

#### Upgrade paths

There are several approved and tested ways to install the Azure Storage Mover updates.

1. **Use Azure Storage Mover auto-upgrade feature to install updates.**  
    The Azure Storage Mover will auto-upgrade. You can select to install the latest agent version when available or update when the currently installed agent is near expiration. To learn more, see [Automatic agent lifecycle management](#automatic-agent-lifecycle-management).
1. **Configure Microsoft Update to automatically download and install agent updates.**  
    We recommend installing every Azure File Sync update to ensure you have access to the latest fixes for the server agent. Microsoft Update makes this process seamless, by automatically downloading and installing updates for you.
1. **Download the newest Azure Storage Mover agent installer from the [Microsoft Download Center](https://go.microsoft.com/fwlink/?linkid=000000).**  
    To upgrade an existing Azure Storage Mover agent, unregister the older agent and then register the latest version of the agent from the downloaded installer. The agent registration, job definitions, and any other settings are maintained by the Azure Storage Mover service.

#### Automatic agent lifecycle management

The Azure Storage Mover will auto-upgrade. You can select either of two modes and specify a maintenance window in which the upgrade shall be attempted on the server. This feature is designed to help you with the agent lifecycle management by either providing a guardrail preventing your agent from expiration or allowing for a no-hassle, stay current setting.

1. The **default setting** will attempt to prevent the agent from expiration. Within 21 days of the posted expiration date of an agent, the agent will attempt to self-upgrade. It will start an attempt to upgrade once a week within 21 days prior to expiration and in the selected maintenance window. **This option does not eliminate the need for taking regular Microsoft Update patches.**
1. Optionally, you can select that the agent will automatically upgrade itself as soon as a new agent version becomes available (currently not applicable to clustered servers). This update will occur during the selected maintenance window and allow your server to benefit from new features and improvements as soon as they become generally available. This is the recommended, worry-free setting that will provide major agent versions as well as regular update patches to your server. Every agent released is at GA quality. If you select this option, Microsoft will flight the newest agent version to you. Clustered servers are excluded. Once flighting is complete, the agent will also become available on [Microsoft Download Center](https://go.microsoft.com/fwlink/?linkid=858257) aka.ms/AFS/agent.

##### Changing the auto-upgrade setting

The following instructions describe how to change the settings after you've completed the installer, if you need to make changes.

Open a PowerShell console and navigate to the directory where you installed the sync agent then import the server cmdlets. By default this would look something like this:

```powershell
cd 'C:\Program Files\Azure\StorageSyncAgent'
Import-Module -Name .\StorageSync.Management.ServerCmdlets.dll
```

You can run `Get-StorageSyncAgentAutoUpdatePolicy` to check the current policy setting and determine if you want to change it.

To change the current policy setting to the delayed update track, you can use:

```powershell
Set-StorageSyncAgentAutoUpdatePolicy -PolicyMode UpdateBeforeExpiration
```

To change the current policy setting to the immediate update track, you can use:

```powershell
Set-StorageSyncAgentAutoUpdatePolicy -PolicyMode InstallLatest
```

#### Lifecycle and change management guarantees

Azure File Sync is a hybrid service which continuously introduces new features and improvements. This means that a specific Azure Storage Mover version can only be supported for a limited time. To facilitate your deployment, the following rules guarantee you have enough time and notification to accommodate agent updates/upgrades in your change management process:

- Major versions are supported for at least six months from the date of initial release.
- We guarantee there is an overlap of at least three months between the support of major agent versions.
- Warnings are issued for registered servers using a soon-to-be expired agent at least three months prior to expiration. You can check if a registered server is using an older version of the agent under the registered servers section of a Storage Sync Service.

> [!NOTE]
> Installing an agent version with an expiration warning will display a warning but succeed. Attempting to install or connect with an expired agent version is not supported and will be blocked.

## Version 15.0.0.0

The following release notes are for version 15.0.0.0 of the Azure Storage Mover (released March 30, 2022).

### Improvements and issues that are fixed

- Reduced transactions when cloud change enumeration job runs
	- Azure File Sync has a cloud change enumeration job that runs every 24 hours to detect changes made directly in the Azure file share and sync those changes to servers in your sync groups. In the v14 release, we made improvements to reduce the number of transactions when this job runs and in the v15 release we made further improvements. The transaction cost is also more predictable, each job will now produce 1 List transaction per directory, per day.
 
- View Cloud Tiering status for a server endpoint or volume
	- The Get-StorageSyncCloudTieringStatus cmdlet will show cloud tiering status for a specific server endpoint or for a specific volume (depending on path specified). The cmdlet will show current policies, current distribution of tiered vs. fully downloaded data, and last tiering session statistics if the server endpoint path is specified. If the volume path is specified, it will show the effective volume free space policy, the server endpoints located on that volume, and whether these server endpoints have cloud tiering enabled.
	
	To get the cloud tiering status for a server endpoint or volume, run the following PowerShell commands:

 	```powershell
	Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
	Get-StorageSyncCloudTieringStatus -Path <server endpoint path or volume>
 	```

- New diagnostic and troubleshooting tool
    - The Debug-StorageSyncServer cmdlet will diagnose common issues like certificate misconfiguration and incorrect server time. Also, we have simplified Azure Files Sync troubleshooting by merging the functionality of some of existing scripts and cmdlets (AFSDiag.ps1, FileSyncErrorsReport.ps1, Test-StorageSyncNetworkConnectivity) into the Debug-StorageSyncServer cmdlet.
 
	To run diagnostics on the server, run the following PowerShell commands:

	```powershell
	Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
	Debug-StorageSyncServer -Diagnose
	```

	To test network connectivity on the server, run the following PowerShell commands:

	```powershell
	Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
	Debug-StorageSyncServer -TestNetworkConnectivity
	```

	To identify files that are failing to sync on the server, run the following PowerShell commands:
		
    ```powershell
	Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
	Debug-StorageSyncServer -FileSyncErrorsReport
	```
	
    To collect logs and traces on the server, run the following PowerShell commands:

	```powershell
	Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
	Debug-StorageSyncServer -AFSDiag -OutputDirectory C:\output -KernelModeTraceLevel Verbose -UserModeTraceLevel Verbose
	```

- Miscellaneous improvements
	- Reliability and telemetry improvements for cloud tiering and sync.

### Evaluation Tool

Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](overview.md) section in the planning guide.

### Agent installation and server configuration

For more information on how to install and configure the Azure Storage Mover with Windows Server, see [Planning for an Azure File Sync deployment](overview.md) and [How to deploy Azure File Sync](overview.md).

- A restart is required for servers that have an existing Azure Storage Mover installation if the agent version is less than version 12.0.
- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, Windows Server 2012 R2, and Windows Server 2022.
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory. See [Recommended system resources](overview.md) for more information.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability

- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](overview.md).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure Storage Mover installed is not supported and can lead to unexpected results. The Azure Storage Mover should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations

The following items don't sync, but the rest of the system continues to operate normally:

- Files with unsupported characters. See [Troubleshooting guide](overview.md) for list of unsupported characters.
- Files or directories that end with a period.
- Paths that are longer than 2,048 characters.
- The system access control list (SACL) portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data.

    > [!Note]  
    > Azure File Sync always encrypts data in transit. Data is always encrypted at rest in Azure.
 
### Server endpoint

- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- Cloud tiering is not supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Do not store an OS or application paging file within a server endpoint location.

### Cloud endpoint

- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the  storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](overview.md)).

    > [!Note]  
    > When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.

### Cloud tiering

- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.

## Agent version 14.1.0.0

The following release notes are for version 14.1.0.0 of the Azure Storage Mover released December 1, 2021. These notes are in addition to the release notes listed for version 14.0.0.0.

### Improvements and issues that are fixed 

- Tiered files deleted on Windows Server 2022 are not detected by cloud tiering filter driver
	- This issue occurs because the DeleteFile API on Windows Server 2022 uses the FILE_DISPOSITION_INFORMATION_EX class to delete files. The v14.1 release adds support for detecting tiered files deleted using the FILE_DISPOSITION_INFORMATION_EX class.
    
    > [!Note]  
    > This issue can also impact Windows 2016 and Windows Server 2019 if a tiered file is deleted using the FILE_DISPOSITION_INFORMATION_EX class.

## Agent version 14.0.0.0

The following release notes are for version 14.0.0.0 of the Azure Storage Mover (released October 29, 2021).

### Improvements and issues that are fixed

- Reduced transactions when cloud change enumeration job runs
	- Azure File Sync has a cloud change enumeration job that runs every 24 hours to detect changes made directly in the Azure file share and sync those changes to servers in your sync groups. We have made improvements to reduce the number of transactions when this job runs.

- Improved server endpoint deprovisioning guidance in the portal
	- When removing a server endpoint via the portal, we now provide step by step guidance based on the reason behind deleting the server endpoint, so that you can avoid data loss and ensure your data is where it needs to be (server or Azure file share). This feature also includes new PowerShell cmdlets (Get-StorageSyncStatus & New-StorageSyncUploadSession) that you can use on your local server to aid you through the deprovisioning process.

- Invoke-AzStorageSyncChangeDetection cmdlet improvements
	- Prior to the v14 release, if you made changes directly in the Azure file share, you could use the Invoke-AzStorageSyncChangeDetection cmdlet to detect the changes and sync them to the servers in your sync group. However, the cmdlet would fail to run if the path specified contained more than 10,000 items. We have improved the Invoke-AzStorageSyncChangeDetection cmdlet and the 10,000 item limit no longer applies when scanning the entire share. To learn more, see the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) documentation.

- Miscellaneous improvements
	- Azure File Sync is now supported in West US 3 region.
	- Fixed a bug that caused the FileSyncErrorsReport.ps1 script to not provide the list of all per-item errors.
	- Reduced transactions when a file consistently fails to upload due to a per-item sync error.
	- Reliability and telemetry improvements for cloud tiering and sync.

### Evaluation Tool

Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](overview.md) section in the planning guide.

### Agent installation and server configuration

For more information on how to install and configure the Azure Storage Mover with Windows Server, see [Planning for an Azure File Sync deployment](overview.md) and [How to deploy Azure File Sync](overview.md).

- A restart is required for servers that have an existing Azure Storage Mover installation if the agent version is less than version 12.0.
- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, Windows Server 2012 R2, and Windows Server 2022.
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory. See [Recommended system resources](overview.md) for more information.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability

- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](overview.md).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure Storage Mover installed is not supported and can lead to unexpected results. The Azure Storage Mover should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations

The following items don't sync, but the rest of the system continues to operate normally:
- Files with unsupported characters. See [Troubleshooting guide](overview.md) for list of unsupported characters.
- Files or directories that end with a period.
- Paths that are longer than 2,048 characters.
- The system access control list (SACL) portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data.

    > [!Note]  
    > Azure File Sync always encrypts data in transit. Data is always encrypted at rest in Azure.

### Server endpoint

- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- Cloud tiering is not supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Do not store an OS or application paging file within a server endpoint location.

### Cloud endpoint

- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the  storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](overview.md)).

    > [!Note]  
    > When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.

### Cloud tiering

- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.

## Agent version 13.0.0.0

The following release notes are for version 13.0.0.0 of the Azure Storage Mover (released July 12, 2021).

### Improvements and issues that are fixed

- Authoritative upload  
	- Authoritative upload is a new mode available when creating the first server endpoint in a sync group. It is useful for the scenario where the cloud (Azure file share) has some/most of the data but is outdated and needs to be caught up with the more recent data on the new server endpoint. This is the case in offline migration scenarios like DataBox, for instance. When a DataBox is filled and sent to Azure, the users of the local server will keep changing / adding / deleting files on the local server. That makes the data in the DataBox and thus the Azure file share, slightly outdated. With Authoritative Upload, you can now tell the server and cloud, how to resolve this case and get the cloud seamlessly updated with the latest changes on the server.

		No matter how the data got to the cloud, this mode can update the Azure file share if the data stems from the matching location on the server. Be sure to avoid large directory restructures between the initial copy to the cloud and catching up with Authoritative Upload. This will ensure you are only transporting updates. Changes to directory names will cause all files in these renamed directories to be uploaded again. This functionality is comparable to semantics of RoboCopy /MIR = mirror source to target, including removing files on the target that no longer exist on the source.
		
		Authoritative Upload replaces the "Offline Data Transfer" feature for DataBox integration with Azure File Sync via a staging share. A staging share is no longer required to use DataBox. New Offline Data Transfer jobs can no longer be started with the AFS V13 agent. Existing jobs on a server will continue even with the upgrade to agent version 13.

- Portal improvements to view cloud change enumeration and sync progress  
	- When a new sync group is created, any connected server endpoint can only begin sync, when cloud change enumeration is complete.  In case files already exist in the cloud endpoint (Azure file share) of this sync group, change enumeration of content in the cloud can take some time. The more items (files and folders) exist in the namespace, the longer this process can take. Admins will now be able to obtain cloud change enumeration progress in the Azure portal to estimate an eta for completion / sync to start with servers.

- Support for server rename  
	- If a registered server is renamed, Azure File Sync will now show the new server name in the portal. If the server was renamed prior to the v13 release, the server name in the portal will now be updated to show the correct server name.

- Support for Windows Server 2022  
	- The Azure Storage Mover is now supported on Windows Server 2022.

	> [!Note]  
	> Windows Server 2022 adds support for TLS 1.3 which is not currently supported by Azure File Sync.  If the [TLS settings](/windows-server/security/tls/tls-ssl-schannel-ssp-overview) are managed via group policy, the server must be configured to support TLS 1.2.

- Miscellaneous improvements
	- Reliability improvements for sync, cloud tiering and cloud change enumeration.
	- If a large number of files is changed on the server, sync upload is now performed from a VSS snapshot which reduces per-item errors and sync session failures.
	- The Invoke-StorageSyncFileRecall cmdlet will now recall all tiered files associated with a server endpoint, even if the file has moved outside the server endpoint location.
	- Explorer.exe is now excluded from cloud tiering last access time tracking.
	- New telemetry (Event ID 6664) to monitor the orphaned tiered files cleanup progress after removing a server endpoint with cloud tiering enabled.


### Evaluation Tool

Before deploying Azure File Sync, you should evaluate whether it is compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](overview.md) section in the planning guide.

### Agent installation and server configuration

For more information on how to install and configure the Azure Storage Mover with Windows Server, see [Planning for an Azure File Sync deployment](overview.md) and [How to deploy Azure File Sync](overview.md).

- A restart is required for servers that have an existing Azure Storage Mover installation if the agent version is less than version 12.0.
- The agent installation package must be installed with elevated (admin) permissions.
- The agent is not supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, Windows Server 2012 R2, and Windows Server 2022.
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory. See [Recommended system resources](overview.md) for more information.
- The Storage Sync Agent (FileSyncSvc) service does not support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability

- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](overview.md).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure Storage Mover installed is not supported and can lead to unexpected results. The Azure Storage Mover should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations

The following items don't sync, but the rest of the system continues to operate normally:
- Files with unsupported characters. See [Troubleshooting guide](overview.md) for list of unsupported characters.
- Files or directories that end with a period.
- Paths that are longer than 2,048 characters.
- The system access control list (SACL) portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data.

    > [!Note]  
    > Azure File Sync always encrypts data in transit. Data is always encrypted at rest in Azure.
 
### Server endpoint

- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- Cloud tiering is not supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Do not store an OS or application paging file within a server endpoint location.

### Cloud endpoint

- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share. In addition, changes made to an Azure file share over the REST protocol will not update the SMB last modified time and will not be seen as a change by sync.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the  storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](overview.md)).

    > [!Note]  
    > When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.

### Cloud tiering

- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.
