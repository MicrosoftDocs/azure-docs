---
title: Frequently asked questions (FAQ) for Azure Files
description: Get answers to Azure Files frequently asked questions. You can mount Azure file shares concurrently on cloud or on-premises Windows, Linux, or macOS deployments.
author: khdownie
ms.service: azure-file-storage
ms.date: 11/28/2023
ms.author: kendownie
ms.topic: conceptual
---

# Frequently asked questions (FAQ) about Azure Files
[Azure Files](storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the industry-standard [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) and the [Network File System (NFS) protocol](https://en.wikipedia.org/wiki/Network_File_System). You can mount Azure file shares concurrently on cloud or on-premises deployments of Windows, Linux, and macOS. You also can cache Azure file shares on Windows Server machines by using Azure File Sync for fast access close to where the data is used.

## Azure File Sync

* <a id="cross-domain-sync"></a>
  **Can I have domain-joined and non-domain-joined servers in the same sync group?**  
    Yes. A sync group can contain server endpoints that have different Active Directory memberships, even if they aren't domain-joined. Although this configuration technically works, we don't recommend this as a typical configuration because access control lists (ACLs) that are defined for files and folders on one server might not be able to be enforced by other servers in the sync group. For best results, we recommend syncing between servers that are in the same Active Directory forest, between servers that are in different Active Directory forests but have [established trust relationships](storage-files-identity-multiple-forests.md#how-forest-trust-relationships-work), or between servers that aren't in a domain. We recommend that you avoid using a mix of these configurations.

* <a id="afs-change-detection"></a>
  **I created a file directly in my Azure file share by using SMB or in the portal. How long does it take for the file to sync to the servers in the sync group?**  
    [!INCLUDE [storage-sync-files-change-detection](../../../includes/storage-sync-files-change-detection.md)]


* <a id="afs-conflict-resolution"></a>
  **If the same file is changed on two servers at approximately the same time, what happens?**  
    File conflicts are created when the file in the Azure file share doesn't match the file in the server endpoint location (size and/or last modified time is different). 
    
    The following scenarios can cause file conflicts:
    - A file is created or modified in an endpoint (for example, Server A). If the same file is modified on a different endpoint before the change on Server A is synced to that endpoint, a conflict file is created.  
    - The file existed in the Azure file share and server endpoint location prior to the server endpoint creation. If the file size and/or last modified time is different between the file on the server and Azure file share when the server endpoint is created, a conflict file is created.  
    - Sync database was recreated due to corruption or knowledge limit reached. Once the database is recreated, sync enters a mode called reconciliation. If the file size and/or last modified time is different between the file on the server and Azure file share when reconciliation occurs, a conflict file is created. 
  
    Azure File Sync uses a simple conflict-resolution strategy: we keep both changes to files that are changed in two endpoints at the same time. The most recently written change keeps the original file name. The older file (determined by LastWriteTime) has the endpoint name and the conflict number appended to the file name. For server endpoints, the endpoint name is the name of the server. For cloud endpoints, the endpoint name is **Cloud**. The name follows this taxonomy:
   
    \<FileNameWithoutExtension\>-\<endpointName\>\[-#\].\<ext\>  

    For example, the first conflict of CompanyReport.docx would become CompanyReport-CentralServer.docx if CentralServer is where the older write occurred. The second conflict would be named CompanyReport-CentralServer-1.docx. Azure File Sync supports 100 conflict files per file. Once the maximum number of conflict files is reached, the file will fail to sync until the number of conflict files is less than 100.
  
* <a id="afs-tiered-files-tiering-disabled"></a>
  **I have cloud tiering disabled, why are there tiered files in the server endpoint location?**  
    There are two reasons why tiered files might exist in the server endpoint location:

    - When adding a new server endpoint to an existing sync group, if you choose either the recall namespace first option or recall namespace only option for initial download mode, files will show up as tiered until they're downloaded locally. To avoid this, select the **avoid tiered files** option for initial download mode. To manually recall files, use the [`Invoke-StorageSyncFileRecall`](../file-sync/file-sync-how-to-manage-tiered-files.md#how-to-recall-a-tiered-file-to-disk) cmdlet.

    - If cloud tiering was enabled on the server endpoint and then disabled, files will remain tiered until they're accessed.

* <a id="afs-tiered-files-not-showing-thumbnails"></a>
  **Why are my tiered files not showing thumbnails or previews in Windows File Explorer?**  
    For tiered files, thumbnails and previews won't be visible at your server endpoint. This is expected behavior because the thumbnail cache feature in Windows intentionally skips reading files with the offline attribute. With Cloud Tiering enabled, reading through tiered files would cause them to be downloaded (recalled).

    This behavior isn't specific to Azure File Sync. Windows File Explorer displays a "grey X" for any files that have the offline attribute set. You'll see the X icon when accessing files over SMB. For a detailed explanation of this behavior, refer to [Why don’t I get thumbnails for files that are marked offline?](https://devblogs.microsoft.com/oldnewthing/20170503-00/?p=96105)

    For questions on how to manage tiered files, see [How to manage tiered files](../file-sync/file-sync-how-to-manage-tiered-files.md).

* <a id="afs-tiered-files-out-of-endpoint"></a>
  **Why do tiered files exist outside of the server endpoint namespace?**  
    Prior to Azure File Sync agent version 3, Azure File Sync blocked the move of tiered files outside the server endpoint but on the same volume as the server endpoint. Copy operations, moves of non-tiered files, and moves of tiered files to other volumes were unaffected. The reason for this behavior was the implicit assumption that File Explorer and other Windows APIs have that move operations on the same volume are (nearly) instantaneous rename operations. This means moves will make File Explorer or other move methods (such as command line or PowerShell) appear unresponsive while Azure File Sync recalls the data from the cloud. Starting with [Azure File Sync agent version 3.0.12.0](../file-sync/file-sync-release-notes.md#supported-versions), Azure File Sync will allow you to move a tiered file outside of the server endpoint. We avoid the negative effects previously mentioned by allowing the tiered file to exist as a tiered file outside of the server endpoint and then recalling the file in the background. This means that moves on the same volume are instantaneous, and we do all the work to recall the file to disk after the move is complete.

* <a id="afs-do-not-delete-server-endpoint"></a>
  **I'm having an issue with Azure File Sync on my server (sync, cloud tiering, etc.). Should I remove and recreate my server endpoint?**  
    [!INCLUDE [storage-sync-files-remove-server-endpoint](../../../includes/storage-sync-files-remove-server-endpoint.md)]
    
* <a id="afs-resource-move"></a>
  **Can I move the storage sync service and/or storage account to a different resource group, subscription, or Microsoft Entra tenant?**  
   Yes, you can move the storage sync service and/or storage account to a different resource group, subscription, or Microsoft Entra tenant. After you move the storage sync service or storage account, you need to give the Microsoft.StorageSync application access to the storage account. Follow these steps:
   
   1. Sign in to the Azure portal and select **Access control (IAM)** from the left-hand navigation.
   1. Select the **Role assignments** tab to list the users and applications (*service principals*) that have access to your storage account.
   1. Verify **Microsoft.StorageSync** or **Hybrid File Sync Service** (old application name) appears in the list with the **Reader and Data Access** role.

      If **Microsoft.StorageSync** or **Hybrid File Sync Service** doesn't appear in the list, perform the following steps:
      
      - Select **Add**.
      - In the **Role** field, select **Reader and Data Access**.
      - In the **Select** field, type **Microsoft.StorageSync**, select the role and then select **Save**.
    
      > [!Note]  
      > When creating the cloud endpoint, the storage sync service and storage account must be in the same Microsoft Entra tenant. Once the cloud endpoint is created, the storage sync service and storage account can be moved to different Microsoft Entra tenants.
    
* <a id="afs-ntfs-acls"></a>
  **Does Azure File Sync preserve directory/file level NTFS ACLs along with data stored in Azure Files?**

    As of February 24, 2020, new and existing ACLs tiered by Azure file sync will be persisted in NTFS format, and ACL modifications made directly to the Azure file share will sync to all servers in the sync group. Any changes on ACLs made to Azure file shares will sync down via Azure File Sync. When copying data to Azure Files, make sure you use a copy tool that supports the necessary "fidelity" to copy attributes, timestamps, and ACLs into an Azure file share - either via SMB or REST. When using Azure copy tools such as AzCopy, it's important to use the latest version. Check the [file copy tools table](storage-files-migration-overview.md#file-copy-tools) to get an overview of Azure copy tools to ensure you can copy all of the important metadata of a file.

    If you've enabled Azure Backup on your Azure File Sync managed file shares, file ACLs can continue to be restored as part of the backup restore workflow. This works either for the entire share or individual files/directories.

    If you're using snapshots as part of the self-managed backup solution for file shares managed by Azure File Sync, your ACLs might not be restored properly to NTFS ACLs if the snapshots were taken before February 24, 2020. If this occurs, consider contacting Azure Support.

* <a id="afs-lastwritetime"></a>
  **Does Azure File Sync sync the LastWriteTime for directories? Why isn't the *date modified* timestamp on a directory updated when files within it are changed?**  
    No, Azure File Sync doesn't sync the LastWriteTime for directories. Furthermore, Azure Files doesn't update the **date modified** timestamp (LastWriteTime) for directories when files within the directory are changed. This is expected behavior.
    
## Security, authentication, and access control

* <a id="file-auditing"></a>
**How can I audit file access and changes in Azure Files?**

  There are two options that provide auditing functionality for Azure Files:
  - If users are accessing the Azure file share directly, you can use [Azure Storage logs](../blobs/monitor-blob-storage.md?tabs=azure-powershell#analyzing-logs) to track file changes and user access for troubleshooting purposes. Requests are logged on a best-effort basis.
  - If users are accessing the Azure file share via a Windows Server that has the Azure File Sync agent installed, use an [audit policy](/windows/security/threat-protection/auditing/apply-a-basic-audit-policy-on-a-file-or-folder) or third-party product to track file changes and user access on the Windows Server. 

* <a id="access-based-enumeration"></a>
**Does Azure Files support using Access-Based Enumeration (ABE) to control the visibility of the files and folders in SMB Azure file shares?**

  Using ABE with Azure Files isn't currently supported, but you can [use DFS-N with SMB Azure file shares](files-manage-namespaces.md#access-based-enumeration-abe).
   
### Identity-based authentication
* <a id="ad-support-devices"></a>
**Does Microsoft Entra Domain Services support SMB access using Microsoft Entra credentials from devices joined to or registered with Microsoft Entra ID?**

    No, this scenario isn't supported.

* <a id="ad-file-mount-cname"></a>
**Can I use the canonical name (CNAME) to mount an Azure file share while using identity-based authentication?**

    Yes, this scenario is now supported in both [single-forest](storage-files-identity-ad-ds-mount-file-share.md#mount-file-shares-using-custom-domain-names) and [multi-forest](storage-files-identity-multiple-forests.md) environments for SMB Azure file shares. However, Azure Files only supports configuring CNAMEs using the storage account name as a domain prefix. If you don't want to use the storage account name as a prefix, consider using [DFS Namespaces](files-manage-namespaces.md) instead.

* <a id="ad-vm-subscription"></a>
**Can I access Azure file shares with Microsoft Entra credentials from a VM under a different subscription?**

    If the subscription under which the file share is deployed is associated with the same Microsoft Entra tenant as the Microsoft Entra Domain Services deployment to which the VM is domain-joined, you can then access Azure file shares using the same Microsoft Entra credentials. The limitation is imposed not on the subscription but on the associated Microsoft Entra tenant.
    
* <a id="ad-support-subscription"></a>
**Can I enable either Microsoft Entra Domain Services or on-premises AD DS authentication for Azure file shares using a Microsoft Entra tenant that's different from the Azure file share's primary tenant?**

    No. Azure Files only supports Microsoft Entra Domain Services or on-premises AD DS integration with a Microsoft Entra tenant that resides in the same subscription as the file share. A subscription can only be associated with one Microsoft Entra tenant. When using on-premises AD DS for authentication, [the AD DS credential should be synced to the Microsoft Entra ID](../../active-directory/hybrid/how-to-connect-install-roadmap.md) that the storage account is associated with.

* <a id="ad-multiple-forest"></a>
**Does on-premises AD DS authentication for Azure file shares support integration with an AD DS environment using multiple forests?**

    Azure Files on-premises AD DS authentication only integrates with the forest of the domain service that the storage account is registered to. To support authentication from another forest, your environment must have a forest trust configured correctly. For detailed instructions, see [Use Azure Files with multiple Active Directory forests](storage-files-identity-multiple-forests.md).

   > [!Note]  
   > In a multi-forest setup, don't use File Explorer to configure Windows ACLs/NTFS permissions at the root, directory, or file level. [Use icacls](storage-files-identity-ad-ds-configure-permissions.md#configure-windows-acls-with-icacls) instead.

   
* <a id="ad-aad-smb-files"></a>
**Is there any difference in creating a computer account or service logon account to represent my storage account in AD?**

    Creating either a [computer account](/windows/security/identity-protection/access-control/active-directory-accounts#manage-default-local-accounts-in-active-directory) (default) or a [service logon account](/windows/win32/ad/about-service-logon-accounts) has no difference on how authentication works with Azure Files. You can make your own choice on how to represent a storage account as an identity in your AD environment. The default DomainAccountType set in `Join-AzStorageAccountForAuth` cmdlet is computer account. However, the password expiration age configured in your AD environment can be different for computer or service logon account and you need to take that into consideration for [Update the password of your storage account identity in AD](./storage-files-identity-ad-ds-update-password.md).

* <a id="ad-support-rest-apis"></a>
**How to remove cached credentials with storage account key and delete existing SMB connections before initializing new connection with Microsoft Entra ID or AD credentials?**

    Follow the two step process below to remove the saved credential associated with the storage account key and remove the SMB connection:

    1. Run the following command from a Windows command prompt to remove the credential. If you can't find one, it means that you haven't persisted the credential and can skip this step.
    
       cmdkey /delete:Domain:target=storage-account-name.file.core.windows.net
    
    2. Delete the existing connection to the file share. You can specify the mount path as either the mounted drive letter or the `storage-account-name.file.core.windows.net` path.
    
       net use <drive-letter/share-path> /delete

* <a id="ad-sid-to-upn"></a>
**Is it possible to view the userPrincipalName (UPN) of a file/directory owner in File Explorer instead of the security identifier (SID)?**

    File Explorer calls an RPC API directly to the server (Azure Files) to translate the SID to a UPN. Azure Files doesn't support this API, so in File Explorer, the SID of a file/directory owner is displayed instead of the UPN for files and directories hosted on Azure Files. However, you can use the following PowerShell command to view all items in a directory and their owner, including UPN:

    ```PowerShell
    Get-ChildItem <Path> | Get-ACL | Select Path, Owner
    ```

## Network File System (NFS v4.1)

* <a id="when-to-use-nfs"></a>
**When should I use NFS Azure file shares?**

    See [NFS shares](files-nfs-protocol.md).

* <a id="backup-nfs-data"></a>
**How do I backup data stored in NFS shares?**

    Backing up your data on NFS shares can either be orchestrated using familiar tooling like rsync or products from one of our third-party backup partners. Multiple backup partners including [Commvault](https://documentation.commvault.com/commvault/v11/article?p=92634.htm), [Veeam](https://www.veeam.com/blog/?p=123438), and [Veritas](https://players.brightcove.net/4396107486001/default_default/index.html?videoId=6189967101001) and have extended their solutions to work with both SMB 3.x and NFS 4.1 for Azure Files.

* <a id="migrate-nfs-data"></a>
**Can I migrate existing data to an NFS share?**

    Within a region, you can use standard tools like scp, rsync, or SSHFS to move data. Because NFS Azure file shares can be accessed from multiple compute instances concurrently, you can improve copying speeds with parallel uploads. If you want to bring data from outside of a region, use a VPN or a ExpressRoute to mount to your file system from your on-premises data center.
    
* <a id=nfs-ibm-mq-support></a>
**Can you run IBM MQ (including multi-instance) on NFS Azure file shares?**
    * Azure Files NFS v4.1 file shares meet the three requirements set by IBM MQ:
       - https://www.ibm.com/docs/en/ibm-mq/9.2?topic=multiplatforms-requirements-shared-file-systems
          + Data write integrity
          + Guaranteed exclusive access to files
          + Release locks on failure
    * The following test cases run successfully:
        1. https://www.ibm.com/docs/en/ibm-mq/9.2?topic=multiplatforms-verifying-shared-file-system-behavior
        2. https://www.ibm.com/docs/en/ibm-mq/9.2?topic=multiplatforms-running-amqsfhac-test-message-integrity


## Share snapshots

### Create share snapshots

* <a id="geo-redundant-snaphsots"></a>
**Are my share snapshots geo-redundant?**  
    Share snapshots have the same redundancy as the Azure file share for which they were taken. If you've selected geo-redundant storage for your account, your share snapshot also is stored redundantly in the paired region.
  
### Clean up share snapshots
* <a id="delete-share-keep-snapshots"></a>
**Can I delete my share but not delete my share snapshots?**  
    If you have active share snapshots on your share, you can't delete your share. You can use an API to delete share snapshots, along with the share. You also can delete both the share snapshots and the share in the Azure portal.

## Billing and pricing

* <a id="transactions-billing"></a>
**What are transactions in Azure Files, and how are they billed?**
    Protocol transactions occur any time a user, application, script, or service interacts with Azure file shares (writing, reading, listing, deleting files, etc.). It's important to remember that some actions that you might perceive as a single operation might actually involve multiple transactions. For standard Azure file shares billed on a pay-as-you-go model, different types of transactions have different prices based on their impact on the file share. Transactions don't affect billing for premium file shares, which are billed using a provisioned model. For more information, see [Understanding billing](understanding-billing.md).

* <a id="share-snapshot-price"></a>
**How much do share snapshots cost?**  
    Share snapshots are incremental in nature. The base share snapshot is the share itself. All subsequent share snapshots are incremental and store only the difference from the preceding share snapshot. You're billed only for the changed content. If you have a share with 100 GiB of data but only 5 GiB has changed since your last share snapshot, the share snapshot consumes only 5 additional GiB, and you're billed for 105 GiB. For more information about transaction and standard egress charges, see the [Pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

## Interoperability with other services
* <a id="cluster-witness"></a>
**Can I use my Azure file share as a *File Share Witness* for my Windows Server Failover Cluster?**  
    This configuration isn't currently supported for Azure Files. To learn how to set this up using Azure Blob storage, see [Deploy a Cloud Witness for a Failover Cluster](/windows-server/failover-clustering/deploy-cloud-witness).

## See also
* [Troubleshoot Azure Files](/troubleshoot/azure/azure-storage/files-troubleshoot?toc=/azure/storage/files/toc.json)
* [Troubleshoot Azure File Sync](/troubleshoot/azure/azure-storage/file-sync-troubleshoot?toc=/azure/storage/file-sync/toc.json)
