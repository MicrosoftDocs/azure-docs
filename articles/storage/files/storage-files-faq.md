---
title: Frequently asked questions about Azure Files | Microsoft Docs
description: Find answers to frequently asked questions about Azure Files.
services: storage
documentationcenter: ''
author: RenaShahMSFT
manager: aungoo
editor: tysonn

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 10/13/2017
ms.author: renash
---

# Frequently Asked Questions about Azure Files

## General
* **What is Azure Files?**  

    Azure Files offers fully managed file shares in the cloud that are accessible via the industry standard [Server Message Block (SMB) protocol](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx) (also known as Common Internet File System or CIFS). Azure File shares can be mounted concurrently by cloud or on-premises deployments of Windows, Linux, and macOS.

* **Why is Azure Files useful?**  

   Azure Files allows you to create file shares in the cloud without having to manage the overhead of a physical server or device/appliance. This means you can spend less time applying OS updates and replacing bad disks - we do all of that monotonous work for you. To learn more about the scenarios Azure Files can help with, see [Why Azure Files is useful](storage-files-introduction.md#why-azure-files-is-useful).

* **What are different ways to access files in Azure Files?**  

    You can mount the file share on your local machine using SMB 3.0 protocol or use tools like [Storage Explorer](http://storageexplorer.com/) to access files in your file share. From your application, you can use storage client libraries, REST APIs or Powershell to access your files in Azure File share.

* **What is Azure File Sync?**  

    Azure File Sync (preview) allows you to centralize your organization's file shares in Azure Files without giving up the flexibility, performance, and compatibility of an on-premises file server. It does this by transforming your Windows Servers into a quick cache of your Azure File share. You can use any protocol available on Windows Server to access your data locally (including SMB, NFS, and FTPS) and you can have as many caches as you need across the world.

* **Why would I use an Azure File share versus Azure Blob storage for my data?**  

    Azure Files and Azure Blob storage both provide a way to store large amounts of data in the cloud, but are useful for slightly different purposes. Azure Blob storage is useful for massive-scale, cloud-native applications that need to store unstructured data. To maximize performance and scale, Azure Blob storage is a simpler storage abstraction than a true file system. Additionally, Azure Blob storage may only be accessed through REST-based client libraries (or directly through the REST-based protocol).

    Azure Files on the other hand specifically seeks to be a file system, with all of the file abstracts you know and love from years of on-premises operating systems. Like Azure Blob storage, Azure Files offers a REST interface and REST-based client libraries, but unlike Azure Blob storage, Azure Files also offers SMB access to Azure File shares. This means you can directly mount an Azure File share on Windows, Linux, or macOS, on-premises or in cloud VMs, without having to write any code or attach any special drivers to the file system. Additionally, Azure File shares may be cached on on-premises file servers using Azure File Sync for quick access near where the data is being used. 
   
    For a more in-depth discussion on the differences between Azure Files and Azure Blob storage, see [Deciding when to use Azure Blob storage, Azure Files, or Azure Disks](../common/storage-decide-blobs-files-disks.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json). To learn more about Azure Blob storage, see [Introduction to Blob storage](../blobs/storage-blobs-introduction.md).

* **Why would I use an Azure File share versus Azure Disks?**  

    An Azure Disk is just that, a disk. A standalone disk by itself, is not very useful - to get value out of an Azure Disk, you have to attach to virtual machine running in Azure. Azure Disks can be used for anything and everything you would use a disk for on an on-premises server: as an OS system disk, swap space for an OS, or as dedicated storage for an application. One interesting use for Azure Disks is to create a file server in the cloud for use in exactly the same places you might use an Azure File share. Deploying a file server in Azure VMs is a fantastic, high-performance way to get file storage in Azure when you require deployment options not currently supported by Azure Files (such as NFS protocol support or premium storage). 

    On the other hand, running a file server with Azure Disks as backend storage will typically be much more expensive than using an Azure File share for several reasons. First, in addition to paying for disk storage, you must also pay for the expense of running one or more Azure VMs. Second, you must also manage the VMs used to run the file server, such as being responsible for OS upgrades, etc. Finally, if you ultimately require data cached on-premises, it's up to you to set up and manage replication technologies (such as Distributed File System Replication) to make that happen.

    One interesting approach to get the best of both Azure Files and a file server hosted in Azure VMs with Azure Disks as back-end storage, is to install Azure File Sync on your cloud VM-hosted file server. If the Azure File share is in the same region as your file server, you can enable cloud tiering and set volume free space percentage to maximum (99%). This ensures minimal duplication of data while allowing you to use whatever applications you want against your file servers, such anything requiring NFS protocol support.

    For information on one way to set up a high performance and highly available in Azure, see [Deploying IaaS VM Guest Clusters in Microsoft Azure](https://blogs.msdn.microsoft.com/clustering/2017/02/14/deploying-an-iaas-vm-guest-clusters-in-microsoft-azure/). For a more in-depth discussion on the differences between Azure Files and Azure Disks, see [Deciding when to use Azure Blob storage, Azure Files, or Azure Disks](../common/storage-decide-blobs-files-disks.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json). To learn more about Azure Disks, see [Azure Managed Disks Overview](../../virtual-machines/windows/managed-disks-overview.md).

* **How do I get started using Azure Files?**  

    Getting started with Azure Files is easy: simply [create a file share](storage-how-to-create-file-share.md) and mount in your preferred operating system: 

    - [Mount on Windows](storage-how-to-use-files-windows.md)
    - [Mount on Linux](storage-how-to-use-files-linux.md)
    - [Mount on macOS](storage-how-to-use-files-mac.md)

    For a more in-depth guide on how to deploy an Azure File share to replace production file shares in your organization, see [Planning for an Azure Files deployment](storage-files-planning.md).

* **What storage redundancy options are supported by Azure Files?**  

    Azure Files currently only supports locally redundant storage (LRS) and geo-redundant storage (GRS) right now. We plan to support zone-redundant storage (ZRS) and read-access geo-redundant storage (RA-GRS) in the future, but don't have timelines to share at this time.

* **I really want to see *x* feature added to Azure Files, can you add it?**  

    Absolutely, the Azure Files team is interested in hearing any and all feedback you have about our service. Please vote on feature requests on the [Azure Files UserVoice](https://feedback.azure.com/forums/217298-storage/category/180670-files)! We're looking forward to delighting you with many new features.

* **Can I create File Share in cool storage?**   

    Cool storage account only supports blob at this time. It does not support File shares. You need to create standard storage account. Standard storage is very competitively priced and also, recently slashed price for Standard Azure Files ever further. For more information, see [Azure Files Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

* **I cannot access file share from on-premises?**  

    If you are trying to access the file share from your local network, the following prerequisite must be meet:

    - The port 445 must be enabled by your ISP (get in touch with your ISP to enable it).

    - on-premises client machine must have SMB 3.0 enabled.

    - When a client accesses File storage, the SMB version used depends on the SMB version supported by the operating system. 
    
    The following list provides a summary of support for Windows clients.

    - Windows Client SMB Version Supported
    - Windows 7 SMB 2.1
    - Windows Server 2008 R2 SMB 2.1
    - Windows 8 SMB 3.0
    - Windows Server 2012 SMB 3.0
    - Windows Server 2012 R2 SMB 3.0
    - Windows 10 SMB 3.0

    For more information, see [Troubleshooter for Azure Files storage problems](https://support.microsoft.com/help/4022301/azure-file-storage-connection-creation--performance-problems).

* **I cannot mount Azure File Share from On-Premises client**

    To resolve this problem, use [Troubleshooter for Azure Files storage](problemshttps://support.microsoft.com/help/4022301/azure-file-storage-connection-creation--performance-problems).

* **How to Map container folder on VM**? 

   see [Mounting an Azure file share with Azure Container Instances](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-mounting-azure-files-volume).

* **Can I increase the maximum size of File Share?**

    No. The maximum size of a File share is 5 TB.

* **Can I implement IP restrictions at File share?**

    Yes. For more information, see [Configure Azure Storage Firewalls and Virtual Networks](../common/storage-network-security.md).

* **Can I to convert to premium storage account for File share?**

    No. Premium storage is not available on Azure file share today.

## Azure File Sync
* **What regions are currently supported for Azure File Sync (preview)?**  

    Azure File Sync is currently available in West US, West Europe, Australia East, and Southeast Asia. We will add support for additional regions as we work towards general availability. For additional information, see [Region availability](storage-sync-files-planning.md#region-availability).

* **Can I have domain joined and non-domain joined servers in the same Sync Group?**  

    Yes, a Sync Group can contain Server Endpoints that have different Active Directory membership, inclusive of not being domain joined. While configuration technically works, we do not recommend this as a normal configuration as ACLs that are defined for files/folders on one server might not be able to be enforced by other servers in the Sync Group. For best results, we recommend syncing between either servers in the same Active Directory forest, servers in different Active Directory forests with established trust relationships, or servers not in a domain, but not a mix of all of the above.

* **I created a file directly in my Azure File share over SMB or through the portal. How long until the file is synced to the servers in the Sync Group?** 

    When you create or modify files in an Azure File share using the Azure portal, SMB, or REST, it can take up to 24 hours to sync the changes to the servers in the Sync Group.

* **When the same file is changed on two servers at approximately the same time, what happens?**  

    Azure File Sync uses a simple conflict resolution strategy: we keep both changes. The most recently written keeps the original file name. The older file has the 'source' machine and the conflict number appended to the name with this taxonomy: 
   
    `<FileNameWithoutExtension>-<MachineName>[-#].<ext>`  

    For example, the first conflict of `CompanyReport.docx` would become `CompanyReport-CentralServer.docx` if `CentralServer` is where the older write occurred. The second conflict would be identified as `CompanyReport-CentralServer-1.docx`.

* **When registering a server I get numerous "web site not trusted" responses, why?**  

    This error occurs because the **Enhanced Internet Explorer Security** policy is enabled during server registration. For more information on how to properly disable the **Enhanced Internet Explorer Security** policy, see [Prepare Windows Servers for use with Azure File Sync](storage-sync-files-deployment-guide.md#prepare-windows-servers-for-use-with-azure-file-sync) and [How to deploy Azure File Sync (preview)](storage-sync-files-deployment-guide.md).

* **Is geo-redundant storage (GRS) supported for Azure File Sync?**  

    Yes, both locally redundant storage (LRS) and geo-redundant storage (GRS) are supported by Azure File Sync. In the case of a GRS failover between paired regions, we recommend treating the new region as a backup of data only. Azure File Sync will not automatically start syncing with the new primary region. 

* **Why doesn't the *Size on disk* property for a file match the *Size* property after using Azure File Sync?**  

    Windows File Explorer exposes two properties, **Size** and **Size on disk** to represent the size of a file. These properties differ subtly in meaning; **Size** represents the complete size of the file, while **Size on disk** represents the size of the file stream actually stored on disk. These can differ for a variety of reasons, such as compression, use of Data Deduplication, or in our case, cloud tiering with Azure File Sync. If a file is tiered to an Azure File share, the size on disk will be zero because the file stream is stored in your Azure File share, not on disk. It is also possible for a file to be partially tiered (or partially recalled), meaning that part of the file is on disk. This can happen when files are partially read by applications such as multimedia players or by zipping utilities. 

* **How can I tell if a file has been tiered?**  

    There are several ways to check if a file has been tiered to your Azure File share:
    
    1. **Check the file attributes on the file.** To do this, right-click on a file, navigate to **Details** and scroll down to the **Attributes** property. A tiered file will have the following attributes set:     
        
        | Attribute letter | Attribute | Definition |
        |:----------------:|-----------|------------|
        | A | Archive | Indicates that the file should be backed up by backup software. This attribute is always set regardless of whether the file is tiered or stored fully on disk. |
        | P | Sparse file | Indicates that the file is a sparse file, which is a specialized type of file NTFS offers for efficient use when file's on disk stream is mostly empty. Azure File Sync uses sparse files because a file is either fully tiered, meaning its file stream is only stored in the cloud, or partially recalled, meaning that part of the file is already on disk. If a file is fully recalled to disk, Azure File Sync will convert it from a sparse file to a regular file. |
        | L | Reparse point | Indicates that the file has a reparse point, which is a special pointer for use by a file system filter. Azure File Sync uses reparse points to define to the Azure File Sync file system filter (StorageSync.sys) where in the cloud the file is stored. This enables seamless access without your end-user even needing to know Azure File Sync is being used or how to get access to the file in your Azure File share. When a file is fully recalled, Azure File Sync removes the reparse point from the file. |
        | O | Offline | Indicates that some or all of the file's content is not stored on disk. When a file is fully recalled, Azure File Sync removes this attribute. |

        ![The Properties dialog for a file with the Details tab selected](media/storage-files-faq/azure-file-sync-file-attributes.png)
        
        It is also possible to see the attributes for all of the files in a folder by adding the **Attributes** field to the table display of File Exporer. To do this, right-click on an existing column (for example, Size), select **More** and select **Attributes** from the drop-down list.
        
    2. **Use `fsutil` to check for Reparse Points on a file.** As mentioned in the previous option, a tiered file will always have a reparse point, or a special pointer for the Azure File Sync file system filter (StorageSync.sys), set. You can check if a file has a reparse point with the `fsutil` utility on an elevated command prompt or PowerShell session:
    
        ```PowerShell
        fsutil reparsepoint query <your-file-name>
        ```

        If the file has a reparse point, you should see **Reparse Tag Value : 0x8000001e**. This hexadecimal value is the reparse point value owned by Azure File Sync. The output will also contain the reparse data representing the path to your file in your Azure File share.

        > [!Warning]  
        > The `fsutil reparsepoint` utility command also contains the ability to delete a reparse point. Do not execute this command unless instructed to by the Azure File Sync engineer team - doing so may result data loss. 

* **A file I want to use has been tiered... how can I recall it to disk for use locally?**  

    The easiest way to recall a file to disk is to open it. The Azure File Sync file system filter (StorageSync.sys) will seamlessly download the file from your Azure File share without you having to do any work. For file types that can be partially read from, such as multimedia or zip files, opening a file will not result in the download of the entire file.

    It is also possible force a file to be recalled using PowerShell. For instance, this might be useful if you want to recall many files at once (such as all the files within a folder). Open a PowerShell session to the server node where Azure File Sync is installed, and run the following PowerShell commands:
    
    ```PowerShell
    Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
    Invoke-StorageSyncFileRecall -Path <file-or-directory-to-be-recalled>
    ```

* **How can I force a file or directory to be tiered?**  

    When enabled, the cloud tiering feature will automatically tier files based on last access and modify times in order to achieve the volume free space percentage specified on the cloud endpoint, however, sometimes you might like to force a file to tier manually. For instance, this might be useful if you save a large file you don't intend to use again for a long time and want the free space on your volume now for other files/folders. You can force tiering with the following PowerShell commands:

    ```PowerShell
    Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
    Invoke-StorageSyncCloudTiering -Path <file-or-directory-to-be-tiered>
    ```

* **A file or folder is being excluded by Azure File Sync... why?**

    By default, Azure File Sync excludes the following files:
    
    - desktop.ini
    - thumbs.db
    - ehthumbs.db
    - ~$\*.\*
    - \*.laccdb
    - \*.tmp
    - 635D02A9D91C401B97884B82B3BCDAEA.\*

    The following folders are also excluded by default:

    - \System Volume Information
    - \$RECYCLE.BIN
    - \SyncShareState

* **I would like to use Azure File Sync with Windows Server 2008 R2, with Linux, or with my NAS device - does Azure File Sync support that?**

    Today, Azure File Sync only supports Windows Server 2016 and Windows Server 2012 R2. At this time, we don't have any other plans we can share, but we're open and interested to support additional platforms based on customer demand. Please let us know what platforms you would like to us to support on [Azure Files UserVoice](https://feedback.azure.com/forums/217298-storage/category/180670-files).

## Security, Authentication and Access Control
* **Is Active Directory-based authentication and access control supported by Azure Files?**  

    Azure Files does not currently support AD-based authentication or ACLs, but this is something we're actively working on. For now, there are two ways you can work around the lack of AD-based authentication and access control:

    - Using SAS, you can generate tokens with specific permissions that are valid for a specified time interval. For example, you can generate a token with read-only access to a given file with 10 minutes expiry. Anyone who possesses this token while it is valid has read-only access to that file for those 10 minutes. SAS keys are only supported via the REST API or client libraries today, you must mount the Azure File share over SMB with the storage account keys.

    - Azure File Sync will preserve and replicate all ACLs (AD-based or local) to all server endpoints it syncs to. Because Windows Server can already authenticate with Active Directory, Azure File Sync can provide a great stop-gap measure until full support for AD-based authentication and ACL support arrives.

* **How can I ensure my Azure File share is encrypted at-rest?**  

    You don't have to do anything to enable encryption, [Server Side Encryption](../common/storage-service-encryption.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) is now enabled by default for Azure Files in all public regions and national clouds. 

* **How can I provide access to a specific file using a web browser?** 

    Using SAS, you can generate tokens with specific permissions that are valid for a specified time interval. For example, you can generate a token with read-only access to a particular file for a specific period of time. Anyone who possesses this url can access the file directly from any web browser while it is valid. SAS keys can be easily generated from UI like Storage Explorer.

* **Is it possible to specify read-only or write-only permissions on folders within the share?**  

    You don't have this level of control over permissions if you mount the file share via SMB. However, you can achieve this by creating a shared access signature (SAS) via the REST API or client libraries.

* **How to map Azure Files storage for all users as a network share without prompting them for credential?** 

    Azure Files does not support either AD or Azure AD. That means you typically need to map the drive for the users. A scenario where a login script maps the drive could give someone access to the storage key without prompting them for credential. 
   
   For more information, see the following documents:    
   
   - [Get started with Azure File storage on Windows (General Information)](storage-dotnet-how-to-use-files.md )
   - [Persisting connections to Microsoft Azure Files (Using CMDKey to persist the connections, mapping to other users)](https://blogs.msdn.microsoft.com/windowsazurestorage/2014/05/26/persisting-connections-to-microsoft-azure-files/ )
   - [How can I Persist connections to Microsoft Azure Files for all the users? (Discussion about the limitation of the storage key)](https://serverfault.com/questions/772168/how-can-i-persist-connections-to-microsoft-azure-files-for-all-the-users)
 
* **Can I set different permissions of different folders in a file share?** 

    All the folders in one file share would have the same one permission. To achieve this goal, you could try to create different file shares as a workaround, and set different permissions to these file shares. Then you can achieve the similar function.

* **Can I apply domain or NTFS permissions to an Azure file share? if not, what would be the best solution for this type of scenario?**

    There is no way to apply domain or NTFS permissions to an Azure File Share. Alternatively, A shared access signature (SAS) provides you with a way to grant limited access to objects in your storage account to other clients, without exposing your account key.

* **Can I access File share using Domain account credentials?**

    No. Currently the Azure File Share only support Storage keys authentication. So we cannot use domain account credentials to access them.

## On-Premises Access
* **Do I have to use Azure ExpressRoute to connect to Azure Files or to use Azure File Sync on-premises?**  

    No, ExpressRoute is not required to access an Azure File share. If you're mounting an Azure File share directly on-premises, all that is required is that you have port 445 (TCP Outbound) open for Internet access (this is the port SMB communicates on). If you're using Azure File Sync, all that's required is port 443 (TCP Outbound) for HTTPS access (no SMB required). However, ExpressRoute may be used with either access option if desired.

* **How can I mount an Azure File share on my local machine?** 

    You can mount the file share via the SMB protocol as long as port 445 (TCP Outbound) is open and your client supports the SMB 3.0 protocol (for example, you're using Windows 10 or Windows Server 2016). If port 445 is blocked by your organization's policy or by your ISP, you can use Azure File Sync to access your Azure File share.

* **How to mount the Files share in on-premises macOS?**  

    See the following articles to mount Azure file share on local macOS:
    - [Mount Azure File share over SMB with macOS](storage-how-to-use-files-mac.md)
    - [How to connect with File Sharing on your Mac](https://support.apple.com/en-us/HT204445)

## Backup
* **How do I back up my Azure File share?**  

    You can use periodic share snapshots (preview) for protection against accidental deletes. You can use AzCopy, RoboCopy, or a 3rd party backup tool that can backup a mounted file share.

* **How to back up and recover Files?**  

    You can take periodic snapshots of the file share by using [share snapshot feature](storage-how-to-use-files-snapshots.md).
 

## Share snapshots
### Share snapshots - general
* **What is file share snapshot?**

    Azure File share snapshots allows you to create a read-only versions of your file shares. It also allows you to copy an older version of your content back to the same share or an alternate location in Azure or on-premises for further modifications. To learn more about share snapshot, see at [Share Snapshot Overview](storage-snapshots-files.md).

* **Where are my share snapshots stored?**

    Share snapshots are stored in the same storage account as the file share.

* **Are there any performance implications?**

    Share snapshots do not have any performance overhead.

* **Are share snapshots application consistent?**

    No. Share snapshots are not application consistent. User will have to flush the writes from the application to the share before taking share snapshot.

* **Are there any limits on the number of share snapshots?**

    There is a limit of 200 share snapshots that Azure Files can retain. Share snapshots do not count towards the share quota so there is no per share limit on the total space utilized by all the share snapshots. Storage account limits still apply. After 200 share snapshots, older snapshots will have to be deleted in order to create new share snapshots.

### Create share snapshots
* **Can I create share snapshot of individual files?**

    Share snapshots are created at file share level. You can restore individual files from the file share snapshot but you cannot create file-level share snapshots. However, if you have taken a share level share snapshot and you want to list share snapshots where a particular file has changed, you can do so from "Previous Versions" experience on a Windows mounted share.

* **Can I create share snapshots of encrypted fileshare?**

    You can take a share snapshot of Azure File shares which has encryption at rest enabled. You can restore files from a share snapshot to an encrypted file share. If your share is encrypted, your share snapshot will also be encrypted.

* **Are my share snapshots geo-redundant?**

    Share snapshot will have the same redundancy as the Azure File share they are for. If you have selected geo-redundant storage (GRS) for your account your share snapshot will also be stored redundantly in the paired region.

### Manage share snapshots
* **Can I browse my share snapshots from Linux?**

    You can use Azure CLI 2.0 to create, list, browse and restore on Linux.

* **Can I copy the share snapshots to a different storage account?**

    You can copy files from share snapshots to another location but not the share snapshots themselves.

### Restore data from share snapshots
* **Can I promote a share snapshot to the base share?**

    You can only copy data from a share snapshot to any desired destination. However you cannot promote a share snapshot to the base share.

* **Can I restore data from my share snapshot to a different storage account?**

    Yes. Files from a share snapshot can be copied to original or an alternate location which includes same/different storage account in same or different regions. You can also copy files to on-premises or any other cloud.    
  
### Cleanup share snapshot
* **Can I delete my share but not share snapshots?**

    You will not be able to delete your share if you have active share snapshots on your share. There is an API available for deleting share snapshots along with share and you can achieve the same from Azure portal as well.

* **What happens to my share snapshots if I delete my Storage Account?**

    If you delete your storage account, the share snapshots will be deleted as well.

## Billing and Pricing
* **Does the network traffic between an Azure VM and a file share count as external bandwidth that is charged to the subscription?**  

    If the file share and VM are in the same Azure region, the traffic between them is free. If they are in different regions, the traffic between them will be charged as external bandwidth.

* **How much does share snapshots cost?**

     During Preview share snapshot capacity won't be charged. Standard Storage egress and transaction costs sill apply. After general availability, both capacity and transactions on share snapshot will be charged.
     
     Share snapshots are incremental in nature. The base share snapshot is the share itself. All the subsequent share snapshots are incremental and will only store the diff from the previous share snapshot. You are billed only for the changed content. If you have a share with 100 GB of data but only 5 GB has changed after your last share snapshot, the share snapshot will consumes only 5 additional GB and you will be billed only 105 GB. See [Pricing page](https://azure.microsoft.com/pricing/details/storage/files/) for more information on transaction and standard egress charges.

## Scale and Performance
* **What are the scale limits of Azure Files?** 

    For information on scalability and performance targets of Azure Files, see [Azure Storage Scalability and Performance Targets](../common/storage-scalability-targets.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json#scalability-targets-for-blobs-queues-tables-and-files).

* **How many clients can access the same file simultaneously?** 

    There is a 2000 open handles quota on a single file. Once you have 2000 open handles, you will get an error that quota is reached.

* **My performance was slow when trying to unzip files into Azure Files. What should I do?**  

    To transfer large numbers of files into Azure Files, we recommend that you use AzCopy(Windows, Preview for Linux/Unix) or Azure Powershell as these tools have been optimized for network transfer.

* **I've mounted my Azure File share on Windows Server 2012 R2 or Windows 8.1, and my performance is slow - why?**  

    There is a known issue when mounting an Azure File share on Windows Server 2012 R2 and Windows 8.1 that was patched in the April 2014 cumulative update for Windows 8.1 and Windows Server 2012 R2. Please ensure that all instances of Windows Server 2012 R2 and Windows 8.1 have this patch applied for optimum performance (of course, we always recommend taking all Windows patches through Windows Update). For more information, please check out the associated KB article, [Slow performance when you access Azure Files from Windows 8.1 or Server 2012 R2](https://support.microsoft.com/kb/3114025).

## Features and Interoperability with other services
* **Is a "File Share Witness" for a Failover Cluster one of the use cases for Azure Files?**  

    This is not currently supported for an Azure File share. For more information on how to set this up for Azure Blob storage, see [Deploy a Cloud Witness for a Failover Cluster](https://docs.microsoft.com/windows-server/failover-clustering/deploy-cloud-witness).

* **Is there a rename operation in the REST API?**  

    Not at this time.

* **Can you have nested shares, in other words, a share under a share?**  

    No. The file share is the virtual driver that you can mount, so nested shares are not supported.

* **Using Azure Files with IBM MQ**  

    IBM has released a document to guide IBM MQ customers when configuring Azure Files with their service. For more information, please check out [How to setup IBM MQ Multi instance queue manager with Microsoft Azure File Service](https://github.com/ibm-messaging/mq-azure/wiki/How-to-setup-IBM-MQ-Multi-instance-queue-manager-with-Microsoft-Azure-File-Service).

## See also
* [Troubleshoot Azure Files problems in Windows](storage-troubleshoot-windows-file-connection-problems.md)
* [Troubleshoot Azure Files problems in Linux](storage-troubleshoot-linux-file-connection-problems.md)
* [Troubleshoot Azure File Sync (preview)](storage-sync-files-troubleshoot.md)
