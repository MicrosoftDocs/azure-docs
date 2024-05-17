---
title: Release notes for Azure File Sync
description: Release notes for Azure File Sync, which lets you centralize your organization's file shares in Azure Files.
services: storage
author: wmgries
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 05/08/2024
ms.author: wgries
---

# Release notes for Azure File Sync

Azure File Sync enables centralizing your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of a Windows file server. While some users may opt to keep a full copy of their data locally, Azure File Sync additionally has the ability to transform Windows Server into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally, including SMB, NFS, and FTPS. You can have as many caches as you need across the world.

This article provides the release notes for Azure File Sync. It's important to note that major releases of Azure File Sync include service and agent improvements (for example, 15.0.0.0). Minor releases of Azure File Sync are typically for agent improvements (for example, 15.2.0.0).

## Supported versions

The following Azure File Sync agent versions are supported:

| Milestone | Agent version number | Release date | Status |
|----|----------------------|--------------|------------------|
| V18 Release - [KB5023057](https://support.microsoft.com/topic/feb374ad-6256-4eeb-9371-eb85071f756f)| 18.0.0.0 | May 8, 2024 | Supported - Flighting |
| V17.2 Release - [KB5023055](https://support.microsoft.com/topic/dfa4c285-a4cb-4561-b0ed-bbd4ae09d91d)| 17.2.0.0 | February 28, 2024 | Supported |
| V17.1 Release - [KB5023054](https://support.microsoft.com/topic/azure-file-sync-agent-v17-1-release-february-2024-security-only-update-bd1ce41c-27f4-4e3d-a80f-92f74817c55b)| 17.1.0.0 | February 13, 2024 | Supported - Security Update|
| V16.2 Release - [KB5023052](https://support.microsoft.com/topic/azure-file-sync-agent-v16-2-release-february-2024-security-only-update-8247bf99-8f51-4eb6-b378-b86b6d1d45b8)| 16.2.0.0 | February 13, 2024 | Supported - Security Update - Agent version will expire on July 29, 2024|
| V17.0 Release - [KB5023053](https://support.microsoft.com/topic/azure-file-sync-agent-v17-release-december-2023-flighting-2d8cba16-c035-4c54-b35d-1bd8fd795ba9)| 17.0.0.0 | December 6, 2023 | Supported |
| V16.0 Release - [KB5013877](https://support.microsoft.com/topic/ffdc8fe2-c653-43c8-8b47-0865267fd520)| 16.0.0.0 | January 30, 2023 | Supported - Agent version will expire on July 29, 2024 |

## Unsupported versions

The following Azure File Sync agent versions have expired and are no longer supported:

| Milestone | Agent version number | Release date | Status |
|----|----------------------|--------------|------------------|
| V15 Release | 15.0.0.0 - 15.2.0.0 | N/A | Not Supported - Agent versions expired on March 19, 2024 |
| V14 Release | 14.0.0.0 | N/A | Not Supported - Agent versions expired on February 8, 2024 |
| V13 Release | 13.0.0.0 | N/A | Not Supported - Agent versions expired on August 8, 2022 |
| V12 Release | 12.0.0.0 - 12.1.0.0 | N/A | Not Supported - Agent versions expired on May 23, 2022 |
| V11 Release | 11.1.0.0 - 11.3.0.0 | N/A | Not Supported - Agent versions expired on March 28, 2022 |
| V10 Release | 10.0.0.0 - 10.1.0.0 | N/A | Not Supported - Agent versions expired on June 28, 2021 |
| V9 Release | 9.0.0.0 - 9.1.0.0 | N/A | Not Supported - Agent versions expired on February 16, 2021 |
| V8 Release | 8.0.0.0 | N/A | Not Supported - Agent versions expired on January 12, 2021 |
| V7 Release | 7.0.0.0 - 7.2.0.0 | N/A | Not Supported - Agent versions expired on September 1, 2020 |
| V6 Release | 6.0.0.0 - 6.3.0.0 | N/A | Not Supported - Agent versions expired on April 21, 2020 |
| V5 Release | 5.0.2.0 - 5.2.0.0 | N/A | Not Supported - Agent versions expired on March 18, 2020 |
| V4 Release | 4.0.1.0 - 4.3.0.0 | N/A | Not Supported - Agent versions expired on November 6, 2019 |
| V3 Release | 3.1.0.0 - 3.4.0.0 | N/A | Not Supported - Agent versions expired on August 19, 2019 |
| Pre-GA agents | 1.1.0.0 - 3.0.13.0 | N/A | Not Supported - Agent versions expired on October 1, 2018 |

### Azure File Sync agent update policy

[!INCLUDE [storage-sync-files-agent-update-policy](../../../includes/storage-sync-files-agent-update-policy.md)]

## Windows Server 2012 R2 agent support will end on March 4, 2025

Windows Server 2012 R2 reached [end of support](/lifecycle/announcements/windows-server-2012-r2-end-of-support) on October 10, 2023. Azure File Sync will continue to support Windows Server 2012 R2 until the v17.x agent is expired on March 4, 2025. Once the v17 agent is expired, Windows Server 2012 R2 servers will stop syncing to your Azure file shares.

### Action Required

Perform one of the following options for your Windows Server 2012 R2 servers prior to v17 agent expiration on March 4, 2025:

- Option #1: Perform an [in-place upgrade](/windows-server/get-started/perform-in-place-upgrade) to a [supported operation system version](file-sync-planning.md#operating-system-requirements). Once the in-place upgrade completes, uninstall the Azure File Sync agent for Windows Server 2012 R2, restart the server, and then install the agent for the new server operating system (Windows Server 2016, Windows Server 2019, or Windows Server 2022).

- Option #2: Deploy a new Azure File Sync server that's running a [supported operation system version](file-sync-planning.md#operating-system-requirements) to replace your Windows 2012 R2 servers. For guidance, see [Replace an Azure File Sync server](file-sync-replace-server.md).

>[!NOTE]
>Azure File Sync agent v17.2 is the last agent release currently planned for Windows Server 2012 R2. To continue to receive product improvements and bug fixes, upgrade your servers to Windows Server 2016 or later.

## Version 18.0.0.0 (Flighting)

The following release notes are for Azure File Sync version 18.0.0.0 (released May 8, 2024). This release contains improvements for the Azure File Sync service and agent.

### Improvements and issues that are fixed

- Faster server provisioning and improved disaster recovery for Azure File Sync server endpoints.
	- We're reducing the time it takes for the new server endpoint to be ready to use. When a new server endpoint is provisioned, it could take hours and sometime days for the server to be ready to use. With our latest improvements, we've substantially shortened this duration for a more efficient setup process.
	- The improvement applies to the following scenarios, when the server endpoint location is empty (no files or directories):
		- Creating the first server endpoint of new sync topology after data is copied to the Azure File Share.
		- Adding a new empty server endpoint to an existing sync topology.
	- How to get started: Sign up for the public preview [here](https://forms.office.com/r/gCLr1PDZKL).
- Sync performance improvements
	- Sync upload performance has improved, and performance numbers will be posted when they are available. This improvement will mainly benefit file share migrations (initial upload) and high churn events on the server in which a large number of files need to be uploaded, for example ACL changes.
- Miscellaneous reliability and telemetry improvements for cloud tiering and sync

### Evaluation Tool

Before deploying Azure File Sync, you should evaluate whether it's compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported OS version. For installation and usage instructions, see [Evaluation Tool](file-sync-planning.md#evaluation-cmdlet) section in the planning guide.

### Agent installation and server configuration

For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](file-sync-planning.md) and [How to deploy Azure File Sync](file-sync-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent isn't supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016 and Windows Server 2022.
- The agent installation package is for a specific operating system version. If a server with an Azure File Sync agent installed is upgraded to a newer operating system version, the existing agent must be uninstalled. Restart the server and then install the agent for the new server operating system (Windows Server 2016, Windows Server 2019, or Windows Server 2022).
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory. See [Recommended system resources](file-sync-planning.md#recommended-system-resources) for more information.
- The Storage Sync Agent (FileSyncSvc) service doesn't support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.
- All supported Azure File Sync agent versions use TLS 1.2 by default and TLS 1.0 and 1.1 are not supported. Starting with v18 agent version TLS 1.3 will be supported for Windows Server 2022.

### Interoperability

- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed isn't supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations

The following items don't sync, but the rest of the system continues to operate normally:

- Azure File Sync v17 agent and later supports all characters that are supported by the [NTFS file system](/windows/win32/fileio/naming-a-file) except invalid surrogate pairs. See [Troubleshooting guide](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#handling-unsupported-characters) for more information.
- Paths that are longer than 2,048 characters.
- The system access control list (SACL) portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data.

> [!NOTE]
> Azure File Sync always encrypts data in transit. Data is always encrypted at rest in Azure.

### Server endpoint

- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- Cloud tiering isn't supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Don't store an OS or application paging file within a server endpoint location.

### Cloud endpoint

- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, use the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet to manually initiate the detection of changes in the Azure file share.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Microsoft Entra (formerly Azure AD) tenant. After moving the storage sync service or storage account, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#troubleshoot-rbac)).

> [!NOTE]
> When creating the cloud endpoint, the storage sync service and storage account must be in the same Microsoft Entra tenant. After you create the cloud endpoint, you can move the storage sync service and storage account to different Microsoft Entra tenants.

### Cloud tiering

- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using Robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.

## Version 17.2.0.0

The following release notes are for Azure File Sync version 17.2.0.0 (released February 28, 2024). This release contains improvements for the Azure File Sync service and agent.

### Improvements and issues that are fixed

The Azure File Sync v17.2 release is a rollup update for the v17.0 and v17.1 releases:

- [Azure File Sync Agent v17 Release - December 2023](https://support.microsoft.com/topic/azure-file-sync-agent-v17-release-december-2023-flighting-2d8cba16-c035-4c54-b35d-1bd8fd795ba9)
- [Azure File Sync Agent v17.1 Release - February 2024](https://support.microsoft.com/topic/azure-file-sync-agent-v17-1-release-february-2024-security-only-update-bd1ce41c-27f4-4e3d-a80f-92f74817c55b)

>[!NOTE]
>If your server has v17.1 agent installed, you don't need to install the v17.2 agent.

### Evaluation tool

Before deploying Azure File Sync, you should evaluate whether it's compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](file-sync-planning.md#evaluation-cmdlet) section in the planning guide.

### Agent installation and server configuration

For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](file-sync-planning.md) and [How to deploy Azure File Sync](file-sync-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent isn't supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, Windows Server 2012 R2, and Windows Server 2022.
- The agent installation package is for a specific operating system version. If a server with an Azure File Sync agent installed is upgraded to a newer operating system version, you must uninstall the existing agent, restart the server, and install the agent for the new server operating system (Windows Server 2016, Windows Server 2019, or Windows Server 2022).
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory. See [Recommended system resources](file-sync-planning.md#recommended-system-resources) for more information.
- The Storage Sync Agent (FileSyncSvc) service doesn't support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability

- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed isn't supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations

The following items don't sync, but the rest of the system continues to operate normally:

- Files with unsupported characters. See [Troubleshooting guide](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#handling-unsupported-characters) for a list of unsupported characters.
- Files or directories that end with a period.
- Paths that are longer than 2,048 characters.
- The system access control list (SACL) portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data.

> [!NOTE]  
> Azure File Sync always encrypts data in transit. Data is always encrypted at rest in Azure.
 
### Server endpoint

- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- Cloud tiering isn't supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Don't store an OS or application paging file within a server endpoint location.

### Cloud endpoint

- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, you can use the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet to manually initiate the detection of changes in the Azure file share.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#troubleshoot-rbac)).

> [!NOTE]
> When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.

### Cloud tiering

- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using Robocopy, use the /MIR option to preserve file timestamps. This will ensure that older files are tiered sooner than recently accessed files.

## Version 17.1.0.0 (Security Update)

The following release notes are for Azure File Sync version 17.1.0.0 (released February 13, 2024). This release contains a security update for the Azure File Sync agent. These notes are in addition to the release notes listed for version 17.0.0.0.

### Improvements and issues that are fixed

- Fixes an issue that might allow unauthorized users to create new files in locations they aren't allowed to. This is a security-only update. For more information about this vulnerability, see [CVE-2024-21397](https://msrc.microsoft.com/update-guide/en-US/advisory/CVE-2024-21397).

## Version 16.2.0.0 (Security Update)

The following release notes are for Azure File Sync version 16.2.0.0 (released February 13, 2024). This release contains security updates for the Azure File Sync agent. These notes are in addition to the release notes listed for version 16.0.0.0.

### Improvements and issues that are fixed

- Fixes an issue that might allow unauthorized users to create new files in locations they aren't allowed to. This is a security-only update. For more information about this vulnerability, see [CVE-2024-21397](https://msrc.microsoft.com/update-guide/en-US/advisory/CVE-2024-21397).

## Version 17.0.0.0 (Flighting)

The following release notes are for Azure File Sync version 17.0.0.0 (released December 6, 2023). This release contains improvements for the Azure File Sync service and agent.

### Improvements and issues that are fixed

- Sync upload performance improvements
	- Sync upload performance has improved (performance numbers to be posted in the near future). This improvement will mainly benefit file share migrations (initial upload) and high churn events on the server in which a large number of files need to be uploaded.
- Expanded character support for file and directory names
	- Azure File Sync now supports an expanded list of characters. This expansion allows for users to create and sync SMB file shares with file and directory names on par with NTFS file system, for valid Unicode characters.  For more information on unsupported characters, refer to the documentation [here](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=%2Fazure%2Fstorage%2Ffile-sync%2Ftoc.json&tabs=portal1%2Cazure-portal#handling-unsupported-characters).
- New cloud tiering low disk space mode metric
	- You can now configure an alert if a server is in low disk space mode. To learn more, see [Monitor Azure File Sync](file-sync-monitoring.md).
- Fixed an issue that caused the agent upgrade to hang
- Fixed a bug that caused the ESE database engine (also known as JET) to generate logs under C:\Windows\System32 directory
- Miscellaneous reliability and telemetry improvements for cloud tiering and sync

### Evaluation Tool

Before deploying Azure File Sync, you should evaluate whether it's compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](file-sync-planning.md#evaluation-cmdlet) section in the planning guide.

### Agent installation and server configuration

For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](file-sync-planning.md) and [How to deploy Azure File Sync](file-sync-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent isn't supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, Windows Server 2012 R2, and Windows Server 2022.
- Windows Server 2012 R2 requires .NET Framework version 4.6.2 or higher.
- The agent installation package is for a specific operating system version. If a server with an Azure File Sync agent installed is upgraded to a newer operating system version, the existing agent must be uninstalled. Restart the server and then install the agent for the new server operating system (Windows Server 2016, Windows Server 2019, or Windows Server 2022).
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory. See [Recommended system resources](file-sync-planning.md#recommended-system-resources) for more information.
- The Storage Sync Agent (FileSyncSvc) service doesn't support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability

- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed isn't supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations

The following items don't sync, but the rest of the system continues to operate normally:

- Azure File Sync v17 agent supports all characters that are supported by the [NTFS file system](/windows/win32/fileio/naming-a-file) except invalid surrogate pairs. See [Troubleshooting guide](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#handling-unsupported-characters) for more information.
- Paths that are longer than 2,048 characters.
- The system access control list (SACL) portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data.

> [!NOTE]
> Azure File Sync always encrypts data in transit. Data is always encrypted at rest in Azure.
 
### Server endpoint

- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- Cloud tiering isn't supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Don't store an OS or application paging file within a server endpoint location.

### Cloud endpoint

- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, use the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet to manually initiate the detection of changes in the Azure file share.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Microsoft Entra (formerly Azure AD) tenant. After moving the storage sync service or storage account, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#troubleshoot-rbac)).

> [!NOTE]
> When creating the cloud endpoint, the storage sync service and storage account must be in the same Microsoft Entra tenant. After you create the cloud endpoint, you can move the storage sync service and storage account to different Microsoft Entra tenants.

### Cloud tiering

- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using Robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.
  
## Version 16.0.0.0

The following release notes are for Azure File Sync version 16.0.0.0 (released January 30, 2023). This release contains improvements for the Azure File Sync service and agent.

### Improvements and issues that are fixed

- Improved Azure File Sync service availability
	- Azure File Sync is now a zone-redundant service, which means an outage in a zone has limited impact while improving the service resiliency to minimize customer impact. To fully use this improvement, configure your storage accounts to use zone-redundant storage (ZRS) or Geo-zone redundant storage (GZRS) replication. To learn more about different redundancy options for your storage accounts, see [Azure Files redundancy](../files/files-redundancy.md).
- Immediately run server change enumeration to detect files changes that were missed on the server
	- Azure File Sync uses the [Windows USN journal](/windows/win32/fileio/change-journals) feature on Windows Server to immediately detect files that were changed and upload them to the Azure file share. If files changed are missed due to journal wrap or other issues, the files won't sync to the Azure file share until the changes are detected. Azure File Sync has a server change enumeration job that runs every 24 hours on the server endpoint path to detect changes that were missed by the USN journal. If you don't want to wait until the next server change enumeration job runs, you can now use the `Invoke-StorageSyncServerChangeDetection` PowerShell cmdlet to immediately run server change enumeration on a server endpoint path.
		
		To immediately run server change enumeration on a server endpoint path, run the following PowerShell commands:

		```powershell
		Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
		Invoke-StorageSyncServerChangeDetection -ServerEndpointPath <path>
		```

	> [!NOTE]
	> By default, the server change enumeration scan will only check the modified timestamp. To perform a deeper check, use the -DeepScan parameter.

- Bug fix for the PowerShell script FileSyncErrorsReport.ps1

- Miscellaneous reliability and telemetry improvements for cloud tiering and sync

### Evaluation Tool

Before deploying Azure File Sync, you should evaluate whether it's compatible with your system using the Azure File Sync evaluation tool. This tool is an Azure PowerShell cmdlet that checks for potential issues with your file system and dataset, such as unsupported characters or an unsupported OS version. For installation and usage instructions, see [Evaluation Tool](file-sync-planning.md#evaluation-cmdlet) section in the planning guide.

### Agent installation and server configuration

For more information on how to install and configure the Azure File Sync agent with Windows Server, see [Planning for an Azure File Sync deployment](file-sync-planning.md) and [How to deploy Azure File Sync](file-sync-deployment-guide.md).

- The agent installation package must be installed with elevated (admin) permissions.
- The agent isn't supported on Nano Server deployment option.
- The agent is supported only on Windows Server 2019, Windows Server 2016, Windows Server 2012 R2, and Windows Server 2022.
- The agent installation package is for a specific operating system version. If a server with an Azure File Sync agent installed is upgraded to a newer operating system version, you must uninstall the existing agent, restart the server, and install the agent for the new server operating system (Windows Server 2016, Windows Server 2019, or Windows Server 2022).
- The agent requires at least 2 GiB of memory. If the server is running in a virtual machine with dynamic memory enabled, the VM should be configured with a minimum 2048 MiB of memory. See [Recommended system resources](file-sync-planning.md#recommended-system-resources) for more information.
- The Storage Sync Agent (FileSyncSvc) service doesn't support server endpoints located on a volume that has the system volume information (SVI) directory compressed. This configuration will lead to unexpected results.

### Interoperability

- Antivirus, backup, and other applications that access tiered files can cause undesirable recall unless they respect the offline attribute and skip reading the content of those files. For more information, see [Troubleshoot Azure File Sync](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json).
- File Server Resource Manager (FSRM) file screens can cause endless sync failures when files are blocked because of the file screen.
- Running sysprep on a server that has the Azure File Sync agent installed isn't supported and can lead to unexpected results. The Azure File Sync agent should be installed after deploying the server image and completing sysprep mini-setup.

### Sync limitations

The following items don't sync, but the rest of the system continues to operate normally:

- Files with unsupported characters. See [Troubleshooting guide](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#handling-unsupported-characters) for a list of unsupported characters.
- Files or directories that end with a period.
- Paths that are longer than 2,048 characters.
- The system access control list (SACL) portion of a security descriptor that's used for auditing.
- Extended attributes.
- Alternate data streams.
- Reparse points.
- Hard links.
- Compression (if it's set on a server file) isn't preserved when changes sync to that file from other endpoints.
- Any file that's encrypted with EFS (or other user mode encryption) that prevents the service from reading the data.

> [!NOTE]
> Azure File Sync always encrypts data in transit. Data is always encrypted at rest in Azure.

### Server endpoint

- A server endpoint can be created only on an NTFS volume. ReFS, FAT, FAT32, and other file systems aren't currently supported by Azure File Sync.
- Cloud tiering isn't supported on the system volume. To create a server endpoint on the system volume, disable cloud tiering when creating the server endpoint.
- Failover Clustering is supported only with clustered disks, but not with Cluster Shared Volumes (CSVs).
- A server endpoint can't be nested. It can coexist on the same volume in parallel with another endpoint.
- Don't store an OS or application paging file within a server endpoint location.

### Cloud endpoint

- Azure File Sync supports making changes to the Azure file share directly. However, any changes made on the Azure file share first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint once every 24 hours. To immediately sync files that are changed in the Azure file share, the [Invoke-AzStorageSyncChangeDetection](/powershell/module/az.storagesync/invoke-azstoragesyncchangedetection) PowerShell cmdlet can be used to manually initiate the detection of changes in the Azure file share.
- The storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?toc=/azure/storage/file-sync/toc.json#troubleshoot-rbac)).

> [!NOTE]  
> When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.

### Cloud tiering

- If a tiered file is copied to another location by using Robocopy, the resulting file isn't tiered. The offline attribute might be set because Robocopy incorrectly includes that attribute in copy operations.
- When copying files using Robocopy, use the /MIR option to preserve file timestamps. This will ensure older files are tiered sooner than recently accessed files.
