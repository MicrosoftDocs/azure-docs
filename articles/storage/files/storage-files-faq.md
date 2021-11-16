---
title: Frequently asked questions (FAQ) for Azure Files | Microsoft Docs
description: Get answers to Azure Files frequently asked questions. You can mount Azure file shares concurrently on cloud or on-premises Windows, Linux, or macOS deployments.
author: roygara
ms.service: storage
ms.date: 11/5/2021
ms.author: rogarana
ms.subservice: files
ms.topic: conceptual
---

# Frequently asked questions (FAQ) about Azure Files
[Azure Files](storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the industry-standard [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) and the [Network File System (NFS) protocol](https://en.wikipedia.org/wiki/Network_File_System). You can mount Azure file shares concurrently on cloud or on-premises deployments of Windows, Linux, and macOS. You also can cache Azure file shares on Windows Server machines by using Azure File Sync for fast access close to where the data is used.

This article answers common questions about Azure Files features and functionality, including the use of Azure File Sync with Azure Files. If you don't see the answer to your question, you can contact us through the following channels (in escalating order):

1. The comments section of this article.
2. [Microsoft Q&A question page for Azure Storage](/answers/topics/azure-file-storage.html).
4. Microsoft Support. To create a new support request, in the Azure portal, on the **Help** tab, select the **Help + support** button, and then select **New support request**.

## General

* <a id="file-access-options"></a>
  **What are different ways to access files in Azure Files?**  
    SMB file shares can be mounted on your local machine by using the SMB 3.x protocol, or you can use tools like [Storage Explorer](https://storageexplorer.com/) to access files in your file share. NFS file shares can be mounted on your local machine by copy/pasting the script provided by the Azure portal. From your application, you can use storage client libraries, REST APIs, PowerShell, or Azure CLI to access your files in the Azure file share.

* <a id="file-locking"></a>
  **Does Azure Files support file locking?**  
    Yes, Azure Files fully supports SMB/Windows-style file locking, [see details](/rest/api/storageservices/managing-file-locks).

## Azure File Sync

* <a id="cross-domain-sync"></a>
  **Can I have domain-joined and non-domain-joined servers in the same sync group?**  
    Yes. A sync group can contain server endpoints that have different Active Directory memberships, even if they are not domain-joined. Although this configuration technically works, we do not recommend this as a typical configuration because access control lists (ACLs) that are defined for files and folders on one server might not be able to be enforced by other servers in the sync group. For best results, we recommend syncing between servers that are in the same Active Directory forest, between servers that are in different Active Directory forests but which have established trust relationships, or between servers that are not in a domain. We recommend that you avoid using a mix of these configurations.

* <a id="afs-change-detection"></a>
  **I created a file directly in my Azure file share by using SMB or in the portal. How long does it take for the file to sync to the servers in the sync group?**  
    [!INCLUDE [storage-sync-files-change-detection](../../../includes/storage-sync-files-change-detection.md)]

**Time (in days) for uploading files to a sync group = (Number of objects in server endpoint)/(20 * 60 * 60 * 24)**

* <a id="afs-initial-upload-server-restart"></a>
  **What is the impact if the server is stopped and restarted during initial upload**
  There is no impact. Azure File Sync will resume from sync once the server is restarted from the point it left off

* <a id="afs-initial-upload-server-changes"></a>
  **What is the impact if changes are made to the data on the server endpoint during initial upload**
  There is no impact. Azure File Sync will reconcile the changes made on the server endpoint to ensure the cloud endpoint and server endpoint are in sync

* <a id="afs-conflict-resolution"></a>**If the same file is changed on two servers at approximately the same time, what happens?**  
    Azure File Sync uses a simple conflict-resolution strategy: we keep both changes to files that are changed in two endpoints at the same time. The most recently written change keeps the original file name. The older file (determined by LastWriteTime) has the endpoint name and the conflict number appended to the filename. For server endpoints, the endpoint name is the name of the server. For cloud endpoints, the endpoint name is **Cloud**. The name follows this taxonomy: 
   
    \<FileNameWithoutExtension\>-\<endpointName\>\[-#\].\<ext\>  

    For example, the first conflict of CompanyReport.docx would become CompanyReport-CentralServer.docx if CentralServer is where the older write occurred. The second conflict would be named CompanyReport-CentralServer-1.docx. Azure File Sync supports 100 conflict files per file. Once the maximum number of conflict files has been reached, the file will fail to sync until the number of conflict files is less than 100.
  
* <a id="afs-tiered-files-tiering-disabled"></a>
  **I have cloud tiering disabled, why are there tiered files in the server endpoint location?**  
    There are two reasons why tiered files may exist in the server endpoint location:

    - When adding a new server endpoint to an existing sync group, if you choose either the recall namespace first option or recall namespace only option for initial download mode, files will show up as tiered until they're downloaded locally. To avoid this, select the avoid tiered files option for initial download mode. To manually recall files, use the [Invoke-StorageSyncFileRecall](../file-sync/file-sync-how-to-manage-tiered-files.md#how-to-recall-a-tiered-file-to-disk) cmdlet.

    - If cloud tiering was enabled on the server endpoint and then disabled, files will remain tiered until they're accessed.

* <a id="afs-tiered-files-not-showing-thumbnails"></a>
  **Why are my tiered files not showing thumbnails or previews in Windows Explorer?**  
    For tiered files, thumbnails and previews won't be visible at your server endpoint. This behavior is expected since the thumbnail cache feature in Windows intentionally skips reading files with the offline attribute. With Cloud Tiering enabled, reading through tiered files would cause them to be downloaded (recalled).

    This behavior is not specific to Azure File Sync, Windows Explorer displays a "grey X" for any files that have the offline attribute set. You will see the X icon when accessing files over SMB. For a detailed explanation of this behavior, refer to [Why don’t I get thumbnails for files that are marked offline?](https://devblogs.microsoft.com/oldnewthing/20170503-00/?p=96105)

    For questions on how to manage tiered files, please see [How to manage tiered files](../file-sync/file-sync-how-to-manage-tiered-files.md).

* <a id="afs-os-support"></a>
  **Can I use Azure File Sync with either Windows Server 2008 R2, Linux, or my network-attached storage (NAS) device?**  
    Currently, Azure File Sync supports only Windows Server 2019, Windows Server 2016, and Windows Server 2012 R2. At this time, we don't have any other plans we can share, but we're open to supporting additional platforms based on customer demand. Let us know at [Azure Files UserVoice](https://feedback.azure.com/d365community/forum/a8bb4a47-3525-ec11-b6e6-000d3a4f0f84?c=c860fa6b-3525-ec11-b6e6-000d3a4f0f84) what platforms you would like us to support.

* <a id="afs-tiered-files-out-of-endpoint"></a>
  **Why do tiered files exist outside of the server endpoint namespace?**  
    Prior to Azure File Sync agent version 3, Azure File Sync blocked the move of tiered files outside the server endpoint but on the same volume as the server endpoint. Copy operations, moves of non-tiered files, and moves of tiered to other volumes were unaffected. The reason for this behavior was the implicit assumption that File Explorer and other Windows APIs have that move operations on the same volume are (nearly) instantaneous rename operations. This means moves will make File Explorer or other move methods (such as command line or PowerShell) appear unresponsive while Azure File Sync recalls the data from the cloud. Starting with [Azure File Sync agent version 3.0.12.0](../file-sync/file-sync-release-notes.md#supported-versions), Azure File Sync will allow you to move a tiered file outside of the server endpoint. We avoid the negative effects previously mentioned by allowing the tiered file to exist as a tiered file outside of the server endpoint and then recalling the file in the background. This means that moves on the same volume are instantaneous, and we do all the work to recall the file to disk after the move has completed. 

* <a id="afs-do-not-delete-server-endpoint"></a>
  **I'm having an issue with Azure File Sync on my server (sync, cloud tiering, etc.). Should I remove and recreate my server endpoint?**  
    [!INCLUDE [storage-sync-files-remove-server-endpoint](../../../includes/storage-sync-files-remove-server-endpoint.md)]
    
* <a id="afs-resource-move"></a>
  **Can I move the storage sync service and/or storage account to a different resource group, subscription, or Azure AD tenant?**  
   Yes, the storage sync service and/or storage account can be moved to a different resource group, subscription, or Azure AD tenant. After the  storage sync service or storage account is moved, you need to give the Microsoft.StorageSync application access to the storage account (see [Ensure Azure File Sync has access to the storage account](../file-sync/file-sync-troubleshoot.md?tabs=portal1%252cportal#troubleshoot-rbac)).

    > [!Note]  
    > When creating the cloud endpoint, the storage sync service and storage account must be in the same Azure AD tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Azure AD tenants.
    
* <a id="afs-ntfs-acls"></a>
  **Does Azure File Sync preserve directory/file level NTFS ACLs along with data stored in Azure Files?**

    As of February 24th, 2020, new and existing ACLs tiered by Azure file sync will be persisted in NTFS format, and ACL modifications made directly to the Azure file share will sync to all servers in the sync group. Any changes on ACLs made to Azure Files will sync down via Azure file sync. When copying data to Azure Files, make sure you use a copy tool that supports the necessary "fidelity" to copy attributes, timestamps and ACLs into an Azure file share - either via SMB or REST. When using Azure copy tools, such as AzCopy, it is important to use the latest version. Check the [file copy tools table](storage-files-migration-overview.md#file-copy-tools) to get an overview of Azure copy tools to ensure you can copy all of the important metadata of a file.

    If you have enabled Azure Backup on your file sync managed file shares, file ACLs can continue to be restored as part of the backup restore workflow. This works either for the entire share or individual files/directories.

    If you are using snapshots as part of the self-managed backup solution for file shares managed by file sync, your ACLs may not be restored properly to NTFS ACLs if the snapshots were taken prior to February 24th, 2020. If this occurs, consider contacting Azure Support.

* <a id="afs-lastwritetime"></a>
  **Does Azure File Sync sync the LastWriteTime for directories?**  
    No, Azure File Sync does not sync the LastWriteTime for directories. This is by design.
    
## Security, authentication, and access control

* <a id="access-via-browser"></a>
**How can I provide access to a specific file by using a web browser?**  

    You can use shared access signatures to generate tokens that have specific permissions, and which are valid for a specified time interval. For example, you can generate a token that gives read-only access to a specific file, for a set period of time. Anyone who possesses the URL can access the file directly from any web browser while the token is valid. You can easily generate a shared access signature key from a UI like Storage Explorer.

* <a id="file-level-permissions"></a>
**Is it possible to specify read-only or write-only permissions on folders within the share?**  

    If you mount the file share by using SMB, you don't have folder-level control over permissions. However, if you create a shared access signature by using the REST API or client libraries, you can specify read-only or write-only permissions on folders within the share.

* <a id="ip-restrictions"></a>
**Can I implement IP restrictions for an Azure file share?**  

    Yes. Access to your Azure file share can be restricted at the storage account level. For more information, see [Configure Azure Storage Firewalls and Virtual Networks](../common/storage-network-security.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

* <a id="data-compliance-policies"></a>
**What data compliance policies does Azure Files support?**  

   Azure Files runs on top of the same storage architecture that's used in other storage services in Azure Storage. Azure Files applies the same data compliance policies that are used in other Azure storage services. For more information about Azure Storage data compliance, you can refer to [Azure Storage compliance offerings](../common/storage-compliance-offerings.md), and go to the [Microsoft Trust Center](https://microsoft.com/trustcenter/default.aspx).

* <a id="afs-power-outage"></a>
  **What is the impact to Azure File Sync if there is a power outage which shuts down the server endpoint**
  There is no impact. Azure File Sync will reconcile the changes made on the server endpoint to ensure the cloud endpoint and server endpoint are in sync once the server endpoint is back online

* <a id="file-auditing"></a>
**How can I audit file access and changes in Azure Files?**

  There are two options that provide auditing functionality for Azure Files:
  - If users are accessing the Azure file share directly, [Azure Storage logs (preview)](../blobs/monitor-blob-storage.md?tabs=azure-powershell#analyzing-logs) can be used to track file changes and user access. These logs can be used for troubleshooting purposes and the requests are logged on a best-effort basis.
  - If users are accessing the Azure file share via a Windows Server that has the Azure File Sync agent installed, use an [audit policy](/windows/security/threat-protection/auditing/apply-a-basic-audit-policy-on-a-file-or-folder) or 3rd party product to track file changes and user access on the Windows Server. 
   
### AD DS & Azure AD DS Authentication
* <a id="ad-support-devices"></a>
**Does Azure Files Azure Active Directory Domain Services (Azure AD DS) Authentication support SMB access using Azure AD credentials from devices joined to or registered with Azure AD?**

    No, this scenario is not supported.

* <a id="ad-vm-subscription"></a>
**Can I access Azure file shares with Azure AD credentials from a VM under a different subscription?**

    If the subscription under which the file share is deployed is associated with the same Azure AD tenant as the Azure AD DS deployment to which the VM is domain-joined, you can then access Azure file shares using the same Azure AD credentials. The limitation is imposed not on the subscription but on the associated Azure AD tenant.
    
* <a id="ad-support-subscription"></a>
**Can I enable either Azure AD DS or on-premises AD DS authentication for Azure file shares using an Azure AD tenant that is different from the Azure file share's primary tenant?**

    No, Azure Files only supports Azure AD DS or on-premises AD DS integration with an Azure AD tenant that resides in the same subscription as the file share. Only one subscription can be associated with an Azure AD tenant. This limitation applies to both Azure AD DS and on-premises AD DS authentication methods. When using on-premises AD DS for authentication, [the AD DS credential must be synced to the Azure AD](../../active-directory/hybrid/how-to-connect-install-roadmap.md) that the storage account is associated with.

* <a id="ad-linux-vms"></a>
**Does Azure AD DS or on-premises AD DS authentication for Azure file shares support Linux VMs?**

    No, authentication from Linux VMs is not supported.

* <a id="ad-aad-smb-afs"></a>
**Do file shares managed by Azure File Sync support either Azure AD DS or on-premises AD DS authentication?**

    Yes, you can enable Azure AD DS or on-premises AD DS authentication on a file share managed by Azure File Sync. Changes to the directory/file NTFS ACLs on local file servers will be tiered to Azure Files and vice-versa.

* <a id="ad-aad-smb-files"></a>
**How can I check if I have enabled AD DS authentication on my storage account and retrieve the domain information?**

    For instructions, see [here](./storage-files-identity-ad-ds-enable.md#confirm-the-feature-is-enabled).

* <a id=""></a>
**Does Azure Files Azure AD authentication support Linux VMs?**

    No, authentication from Linux VMs is not supported.

* <a id="ad-multiple-forest"></a>
**Does on-premises AD DS authentication for Azure file shares support integration with an AD DS environment using multiple forests?**    

    Azure Files on-premises AD DS authentication only integrates with the forest of the domain service that the storage account is registered to. To support authentication from another forest, your environment must have a forest trust configured correctly. The way Azure Files register in AD DS almost the same as a regular file server, where it creates an identity (computer or service logon account) in AD DS for authentication. The only difference is that the registered SPN of the storage account ends with "file.core.windows.net" which does not match with the domain suffix. Consult your domain administrator to see if any update to your suffix routing policy is required to enable multiple forest authentication due to the different domain suffix. We provide an example below to configure suffix routing policy.
    
    Example: When users in forest A domain want to reach an file share with the storage account registered against a domain in forest B, this will not automatically work because the service principal of the storage account does not have a suffix matching the suffix of any domain in forest A. We can address this issue by manually configuring a suffix routing rule from forest A to forest B for a custom suffix of "file.core.windows.net".
    First, you must add a new custom suffix on forest B. Make sure you have the appropriate administrative permissions to change the configuration, then follow these steps:   
    1. Logon to a machine domain joined to forest B
    2.	Open up "Active Directory Domains and Trusts" console
    3.	Right click on "Active Directory Domains and Trusts"
    4.	Click on "Properties"
    5.	Click on "Add"
    6.	Add "file.core.windows.net" as the UPN Suffixes
    7.	Click on "Apply", then "OK" to close the wizard
    
    Next, add the suffix routing rule on forest A, so that it redirects to forest B.
    1.	Logon to a machine domain joined to forest A
    2.	Open up "Active Directory Domains and Trusts" console
    3.	Right-click on the domain that you want to access the file share, then click on the "Trusts" tab and select forest B domain from outgoing trusts. If you haven't configure trust between the two forests, you need to setup the trust first
    4.	Click on "Properties…" then "Name Suffix Routing"
    5.	Check if the "*.file.core.windows.net" suffix shows up. If not, click on 'Refresh'
    6.	Select "*.file.core.windows.net", then click on "Enable" and "Apply"
    
* <a id="ad-aad-smb-afs"></a>
**Can I leverage Azure Files Active Directory (AD) authentication on file shares managed by Azure File Sync?**

    Yes, you can enable AD authentication on a file share managed by Azure file sync. Changes to the directory/file NTFS ACLs on local file servers will be tiered to Azure Files and vice-versa.

* <a id="ad-aad-smb-files"></a>
**Is there any difference in creating a computer account or service logon account to represent my storage account in AD?**

    Creating either a [computer account](/windows/security/identity-protection/access-control/active-directory-accounts#manage-default-local-accounts-in-active-directory) (default) or a [service logon account](/windows/win32/ad/about-service-logon-accounts) has no difference on how the authentication would work with Azure Files. You can make your own choice on how to represent a storage account as an identity in your AD environment. The default DomainAccountType set in Join-AzStorageAccountForAuth cmdlet is computer account. However, the password expiration age configured in your AD environment can be different for computer or service logon account and you need to take that into consideration for [Update the password of your storage account identity in AD](./storage-files-identity-ad-ds-update-password.md).
 
* <a id="ad-support-rest-apis"></a>
**Are there REST APIs to support Get/Set/Copy directory/file Windows ACLs?**

    Yes, we support REST APIs that get, set, or copy NTFS ACLs for directories or files when using the [2019-07-07](/rest/api/storageservices/versioning-for-the-azure-storage-services#version-2019-07-07) (or later) REST API. We also support persisting Windows ACLs in REST based tools: [AzCopy v10.4+](https://github.com/Azure/azure-storage-azcopy/releases).

* <a id="ad-support-rest-apis"></a>
**How to remove cached credentials with storage account key and delete existing SMB connections before initializing new connection with Azure AD or AD credentials?**

    You can follow the two step process below to remove the saved credential associated with the storage account key and remove the SMB connection： 
    1. Run the cmdlet below in Windows Cmd.exe to remove the credential. If you cannot find one, it means that you have not persisted the credential and can skip this step.
    
       cmdkey /delete:Domain:target=storage-account-name.file.core.windows.net
    
    2. Delete the existing connection to the file share. You can specify the mount path as either the mounted drive letter or the storage-account-name.file.core.windows.net path.
    
       net use <drive-letter/share-path> /delete

## Network File System (NFS v4.1)

* <a id="when-to-use-nfs"></a>
**When should I use Azure Files NFS?**

    See [NFS shares](files-nfs-protocol.md).

* <a id="backup-nfs-data"></a>
**How do I backup data stored in NFS shares?**

    Backing up your data on NFS shares can either be orchestrated using familiar tooling like rsync or products from one of our third-party backup partners. Multiple backup partners including [Commvault](https://documentation.commvault.com/commvault/v11/article?p=92634.htm), [Veeam](https://www.veeam.com/blog/?p=123438), and [Veritas](https://players.brightcove.net/4396107486001/default_default/index.html?videoId=6189967101001) and have extended their solutions to work with both SMB 3.x and NFS 4.1 for Azure Files.

* <a id="migrate-nfs-data"></a>
**Can I migrate existing data to an NFS share?**

    Within a region, you can use standard tools like scp, rsync, or SSHFS to move data. Because Azure Files NFS can be accessed from multiple compute instances concurrently, you can improve copying speeds with parallel uploads. If you want to bring data from outside of a region, use a VPN or a Expressroute to mount to your file system from your on-premises data center.

## On-premises access

* <a id="port-445-blocked"></a>
**My ISP or IT blocks Port 445 which is failing Azure Files mount. What should I do?**

    You can learn about [various ways to workaround blocked port 445 here](./storage-troubleshoot-windows-file-connection-problems.md#cause-1-port-445-is-blocked). Azure Files only allows connections using SMB 3.x (with encryption support) from outside the region or datacenter. SMB 3.x protocol has introduced many security features including channel encryption which is very secure to use over internet. However its possible that port 445 has been blocked due to historical reasons of vulnerabilities found in lower SMB versions. In ideal case, the port should be blocked for only for SMB 1.0 traffic and SMB 1.0 should be turned off on all clients.

* <a id="expressroute-not-required"></a>
**Do I have to use Azure ExpressRoute to connect to Azure Files or to use Azure File Sync on-premises?**  

    No. ExpressRoute is not required to access an Azure file share. If you are mounting an Azure file share directly on-premises, all that's required is to have port 445 (TCP outbound) open for internet access (this is the port that SMB uses to communicate). If you're using Azure File Sync, all that's required is port 443 (TCP outbound) for HTTPS access (no SMB required). However, you *can* use ExpressRoute with either of these access options.

* <a id="mount-locally"></a>
**How can I mount an Azure file share on my local machine?**  

    You can mount the file share by using the SMB protocol if port 445 (TCP outbound) is open and your client supports the SMB 3.x protocol (for example, if you're using Windows 10 or Windows Server 2016). If port 445 is blocked by your organization's policy or by your ISP, you can use Azure File Sync to access your Azure file share.

## Share snapshots

* <a id="ntfs-acls-snaphsots"></a>
**Are NTFS ACLs on directories and files persisted in share snapshots?**  
    NTFS ACLs on directories and files are persisted in share snapshots.

### Create share snapshots

* <a id="encrypted-snapshots"></a>
**Can I create share snapshots of an encrypted file share?**  
    You can take a share snapshot of Azure file shares that have encryption at rest enabled. You can restore files from a share snapshot to an encrypted file share. If your share is encrypted, your share snapshot also is encrypted.

* <a id="geo-redundant-snaphsots"></a>
**Are my share snapshots geo-redundant?**  
    Share snapshots have the same redundancy as the Azure file share for which they were taken. If you have selected geo-redundant storage for your account, your share snapshot also is stored redundantly in the paired region.

### Manage share snapshots

* <a id="copy-snapshots-to-other-storage-account"></a>
**Can I copy the share snapshots to a different storage account?**  
    You can copy files from share snapshots to another location, but you cannot copy the share snapshots themselves.

### Restore data from share snapshots
* <a id="promote-share-snapshot"></a>
**Can I promote a share snapshot to the base share?**  
    You can copy data from a share snapshot to any other destination. You cannot promote a share snapshot to the base share.

* <a id="restore-snapshotted-file-to-other-share"></a>
**Can I restore data from my share snapshot to a different storage account?**  
    Yes. Files from a share snapshot can be copied to the original location or to an alternate location that includes either the same storage account or a different storage account, in either the same region or in different regions. You also can copy files to an on-premises location or to any other cloud.    
  
### Clean up share snapshots
* <a id="delete-share-keep-snapshots"></a>
**Can I delete my share but not delete my share snapshots?**  
    If you have active share snapshots on your share, you cannot delete your share. You can use an API to delete share snapshots, along with the share. You also can delete both the share snapshots and the share in the Azure portal.

* <a id="delete-share-with-snapshots"></a>
**What happens to my share snapshots if I delete my storage account?**  
    If you delete your storage account, the share snapshots also are deleted.

## Billing and pricing
* <a id="vm-file-share-network-traffic"></a>
**Does the network traffic between an Azure VM and an Azure file share count as external bandwidth that is charged to the subscription?**  
    If the file share and VM are in the same Azure region, there is no additional charge for the traffic between the file share and the VM. If the file share and the VM are in different regions, the traffic between them are charged as external bandwidth.

* <a id="share-snapshot-price"></a>
**How much do share snapshots cost?**  
    Share snapshots are incremental in nature. The base share snapshot is the share itself. All subsequent share snapshots are incremental and store only the difference from the preceding share snapshot. You are billed only for the changed content. If you have a share with 100 GiB of data but only 5 GiB has changed since your last share snapshot, the share snapshot consumes only 5 additional GiB, and you are billed for 105 GiB. For more information about transaction and standard egress charges, see the [Pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

## Scale and performance

* <a id="lfs-performance-impact"></a>
**Does expanding my file share quota impact my workloads or Azure File Sync?**
    
    No. Expanding the quota will not impact your workloads or Azure File Sync.

* <a id="open-handles-quota"></a>
**How many clients can access the same file simultaneously?**   
    There is a quota of 2,000 open handles on a single file. When you have 2,000 open handles, an error message is displayed that says the quota is reached.

* <a id="zip-slow-performance"></a>
**My performance is slow when I unzip files in Azure Files. What should I do?**  
    To transfer large numbers of files to Azure Files, we recommend that you use AzCopy (for Windows; in preview for Linux and UNIX) or Azure PowerShell. These tools have been optimized for network transfer.

* <a id="slow-perf-windows-81-2012r2"></a>
**Why is my performance slow after I mount my Azure file share on Windows Server 2012 R2 or Windows 8.1?**  
    There is a known issue when mounting an Azure file share on Windows Server 2012 R2 and Windows 8.1. The issue was patched in the April 2014 cumulative update for Windows 8.1 and Windows Server 2012 R2. For optimum performance, ensure that all instances of Windows Server 2012 R2 and Windows 8.1 have this patch applied. (You should always receive  Windows patches through Windows Update.) For more information, see the associated Microsoft Knowledge Base article [Slow performance when you access Azure Files from Windows 8.1 or Server 2012 R2](https://support.microsoft.com/kb/3114025).

## Features and interoperability with other services
* <a id="cluster-witness"></a>
**Can I use my Azure file share as a *File Share Witness* for my Windows Server Failover Cluster?**  
    Currently, this configuration is not supported for an Azure file share. For more information about how to set this up for Azure Blob storage, see [Deploy a Cloud Witness for a Failover Cluster](/windows-server/failover-clustering/deploy-cloud-witness).

* <a id="nested-shares"></a>
**Can I set up nested shares? In other words, a share under a share?**  
    No. The file share *is* the virtual driver that you can mount, so nested shares are not supported.

## See also
* [Troubleshoot Azure Files in Windows](storage-troubleshoot-windows-file-connection-problems.md)
* [Troubleshoot Azure Files in Linux](storage-troubleshoot-linux-file-connection-problems.md)
* [Troubleshoot Azure File Sync](../file-sync/file-sync-troubleshoot.md)
