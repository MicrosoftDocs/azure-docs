---
title: Azure Storage migration FAQ | Microsoft Docs
description: Anwesers the commonad  questions about migrating Azure Storage
services: storage
documentationcenter: na
author: genlin
manager: timlt
editor: tysonn


ms.service: storage
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage
ms.date: 11/16/2017
ms.author: genli

---
# Frequently asked questions about Azure Storage migration

This article answers common questions about Azure Storage migration. 

## FAQ

**How do I create a script to copy files from one container to
another?**

To copy files between containers, you can use **AzCopy**. See the following
example:

    AzCopy /Source:https://xxx.blob.core.windows.net/xxx
    /Dest:https://xxx.blob.core.windows.net/xxx /SourceKey:xxx /DestKey:xxx
    /S

AzCopy uses [Copy Blob
API](https://docs.microsoft.com/rest/api/storageservices/copy-blob) to
do the copy for each file in the container.  
  
You can use any virtual machine or local machine that has Internet access to run
AzCopy. You can also use Azure Batch Schedule to do this automatically,
but it's more complicated.  
  
The Automation script is designed for Azure Resource Manager deployment instead of
storage content manipulation. For more information, see [Deploy
resources with Resource Manager templates and Azure
PowerShell](../../azure-resource-manager/resource-group-template-deploy.md).

**Is there any charge involved for copying  data between two
different file shares on the same storage account within the same
region?**

No. There is no charge for this process.

**How do I back up my entire storage account to other storage account?**

There is no option to back up an entire storage account directly. But
you can manually move the container in that storage account to another
account by using AzCopy or Storage Explorer. The following steps show
how to use AzCopy to move the container:  
 

1.  Install the [AzCopy](storage-use-azcopy.md) command-line tool. This tool helps you move
    the VHD file between storage accounts.

2.  After you install AzCopy on Windows by using the installer, open a
    Command POromprt window and then navigate to the AzCopy installation
    folder on your computer. By default, AzCopy is installed to
    **%ProgramFiles(x86)%\Microsoft SDKs\Azure\AzCopy** or
    **%ProgramFiles%\Microsoft SDKs\Azure\AzCopy**.

3.   Run the following command to move the container. You must replace
    the text with the actual value.   
     
            AzCopy /Source:https://sourceaccount.blob.core.windows.net/mycontainer1
            /Dest:https://destaccount.blob.core.windows.net/mycontainer2
            /SourceKey:key1 /DestKey:key2 /S

- /source: provide source storage account URI (up to container)  
- /dest: provide target storage account URI (up to container)  
- /sourcekey: provide source storage account primary key, you can copy
this key from the portal by selecting the storage account.  
- /destkey: provide target storage account primary key , you can copy
this key from the portal by selecting the storage account.

After you execute this command, the container files are moved to the
target storage account.

**The AzCopy CLI does not work together with the "Pattern" switch when you copy
from one Azure blob to another.**

You can directly copy and edit the AzCopy cmd, and cross-check to make sure that the Pattern matches the Source. Also make sure that **/S** wildcards are in
effect. For more information, see [AzCopy Parameters](storage-use-azcopy.md).

**How do I move data from one storage container to another?**

To do this, follow these steps:

1.  Create the container (folder) in the destination blob.

2.  Use [Azcopy](https://azure.microsoft.com/en-us/blog/azcopy-5-1-release/) to copy the contents from the original blob container to a different Blob container.

**How do I create a PowerShell script to move data from one Azure file
share to another Azure storage?**

Use AzCopy to move the data from one Azure file share to another azure
storage. For more information, see [Transfer data with the AzCopy on
Windows](storage-use-azcopy.md) and [Transfer
data with AzCopy on
Linux](storage-use-azcopy-linux.md).

**How do I upload large .csv files to Azure storage?**

Use AzCopy to upload large .csv files to Azure Storage. For more
information, see [Transfer data with the AzCopy on
Windows](storage-use-azcopy.md) and [Transfer
data with AzCopy on
Linux](storage-use-azcopy-linux.md).

**I have to move the logs from "drive D" to my Azure storage account
every day. How do I automate this?**

You can use AzCopy, and create a task in Task Scheduler. Upload files to an Azure storage account by using an AzCopy batch script. For more information, see [How to configure and run startup tasks for a cloud
service](../../cloud-services/cloud-services-startup-tasks.md).

**How do I move my storage account between subscriptions?**

Use AzCopy to move your storage account between subscriptions. For more
information, see [Transfer data with the AzCopy on
Windows](storage-use-azcopy.md) and [Transfer
data with AzCopy on
Linux](storage-use-azcopy-linux.md).

**How can I move about 10 TB of data to storage at another region?**

Use AzCopy to move the data. For more information, see [Transfer data
with the AzCopy on
Windows](storage-use-azcopy.md) and [Transfer
data with AzCopy on
Linux](storage-use-azcopy-linux.md).

**How can I copy data from on-premises to Azure storage?**

Use AzCopy to copy the data. For more information, see [Transfer data
with the AzCopy on
Windows](storage-use-azcopy.md) and [Transfer
data with AzCopy on
Linux](storage-use-azcopy-linux.md).

**How can I move data from on-premises to Azure File Service?**

Use AzCopy to move data. For more information, For more information, see [Transfer data
with the AzCopy on
Windows](storage-use-azcopy.md) and [Transfer
data with AzCopy on
Linux](storage-use-azcopy-linux.md).

**How do I map a container folder on a virtual machine?**

Use Azure file share.

**How do I back up Azure file storage?**

There is no backup solution. However Azure Files also support async
copy. So, you can copy files from a share to another share (within a
storage account or to a different storage account) or to a blob
container (within a storage account or to a different storage account).
For more information, see [Transfer data with the AzCopy on Windows](storage-use-azcopy.md).

**How do I move managed disks to another storage account?**

To do this, follow these steps:

1.  Stop the virtual machine that the managed disk is attached to.

2.  Copy the managed disk VHD from one area to another by running the
    following Azure PowerShell script:

    ```
    Login-AzureRmAccount

    Select-AzureRmSubscription -SubscriptionId <ID>

    $sas = Grant-AzureRmDiskAccess -ResourceGroupName <RG name> -DiskName <Disk name> -DurationInSecond 3600 -Access Read

    $destContext = New-AzureStorageContext –StorageAccountName contosostorageav1 -StorageAccountKey <your account key>

    Start-AzureStorageBlobCopy -AbsoluteUri $sas.AccessSAS -DestContainer 'vhds' -DestContext $destContext -DestBlob 'MyDestinationBlobName.vhd'
    ```

3.  Create a managed disk by using the VHD file in another region to which you
    copied the VHD. To do this, run following Azure PowerShell script:  

    ```
    $resourceGroupName = 'MDDemo'

    $diskName = 'contoso\_os\_disk1'

    $vhdUri = 'https://contoso.storageaccou.com.vhd

    $storageId = '/subscriptions/<ID>/resourceGroups/<RG name>/providers/Microsoft.Storage/storageAccounts/contosostorageaccount1'

    $location = 'westus'

    $storageType = 'StandardLRS'

    $diskConfig = New-AzureRmDiskConfig -AccountType $storageType -Location $location -CreateOption Import -SourceUri $vhdUri -StorageAccountId $storageId -DiskSizeGB 128

    $osDisk = New-AzureRmDisk -DiskName $diskName -Disk $diskConfig -ResourceGroupName $resourceGroupName
    ``` 

For more information about how to deploy a virtual machine from a managed disk,
see [CreateVmFromManagedOsDisk.ps1](https://github.com/Azure-Samples/managed-disks-powershell-getting-started/blob/master/CreateVmFromManagedOsDisk.ps1).

**How can I download about 1-2 TB of data from the Azure portal?**

Use AzCopy to download the data. For more information, see [Transfer data
with the AzCopy on
Windows](storage-use-azcopy.md) and [Transfer
data with AzCopy on
Linux](storage-use-azcopy-linux.md).

**How do I change the secondary location to the Europe region for a
storage account?**

When you create a storage account, you select the primary region for the
account. The selection of the secondary region is based on the primary region
and it cannot be changed. See [Azure Storage
replication](storage-redundancy.md).

**Where can I get more information about Azure Storage Service
Encryption (SSE)?**  
  
See the following articles:

-  [Azure Storage security
    guide](storage-security-guide.md)

-   [Azure Storage Service Encryption for Data at
    Rest](storage-service-encryption.md)

**How do I move or download data from a storage account?**

Use AzCopy to download the data. For more information, For more information, see [Transfer data
with the AzCopy on
Windows](storage-use-azcopy.md) and [Transfer
data with AzCopy on
Linux](storage-use-azcopy-linux.md).


**How do I encrypt data in a storage account?**

After you enable encryption in the storage account, the existing data is not encrypted. To encrypt the existing data, you must upload again to the data to the storage account.  To do this, follow these steps:

Use *AZcopy* to copy the data to a different storage account and then
move back to a storage account. You can also use [Encryption at
Rest](storage-service-encryption.md).

**How can I download a VHD to a local machine, other than by using the
download option on the portal?**

You can use [Storage
Explorer](https://azure.microsoft.com/features/storage-explorer/) to
download a VHD.

**Are there any prerequisites for changing the replication of a storage
account from GRS to LRS?**

No. 

**How do I access Azure Files redundant storage?**

Read-Access Geo-Redundant Storage (RA-GRS) is required to access redundant storage. However, Azure Files supports only LRS and standard GRS that does not allow read-only access. 

**How do I move from Premium Storage to Standard Storage?**

To do this, follow these steps:

1.  Create a new Standard Storage account (or you can use an existing
    Standard Storage account in your subscription).

2.  Download AzCopy. Run one of the following AzCopy commands.
      
    To copy whole disks in the storage account:

        AzCopy /Source:https://sourceaccount.blob.core.windows.net/mycontainer1
        /Dest:https://destaccount.blob.core.windows.net/mycontainer2
        /SourceKey:key1 /DestKey:key2 /S 

    To copy only one disk, provide the name of the disk in pattern

        AzCopy /Source:https://sourceaccount.blob.core.windows.net/mycontainer1
        /Dest:https://destaccount.blob.core.windows.net/mycontainer2
        /SourceKey:key1 /DestKey:key2 /Pattern:abc.vhd

   
It may take several hours to complete the operation.

To make sure that the transfer completed successfully, you examine the
destination storage account container in the Azure portal. After the
disks are copied to the standard storage account, you can attach them to
the virtual machine as an existing disk. For more information, see [How to attach a
managed data disk to a Windows virtual machine in the Azure
portal](../../virtual-machines/windows/attach-managed-disk-portal.md).  
  
**How do I convert to Premium Storage for a file share?**

Premium storage is not allowed on Azure File Share.

**How do I upgrade from a Standard Storage to a Premium Storage
account? How do I downgrade from a Premium Storage to a Standard
Storage account?**

- You must create the destination storage account, copy data from the
    source account to the destination account, and then delete the
    source account.

- You can use a tool such as AzCopy to perform the data copy.

- If you also have virtual machines, there are several additional
    steps that you must take before you migrate the storage account data. For more
    information, see [Migrating to Azure Premium Storage
    (Unmanaged Disks)](storage-migration-to-premium-storage.md).

**How do I move from a classic storage account to an Azure Resource Manager Storage
account?**

1.  You can use the Move-AzureStorageAccount cmdlet.

2.  This cmdlet has multiple steps (Validate, Prepare, Commit) and you can validate the
    move before you actually make it.

3.  If you also have virtual machines, there are several additional
    steps you must take before you migrate the storage account data. For more
    information, see [Migrate IaaS resources from classic to Azure
    Resource Manager by using Azure
    PowerShell](../..//virtual-machines/windows/migration-classic-resource-manager-ps.md).

**How do I download data to a Linux-based computer from an Azure storage
account, or upload data from a Linux machine?**

You can use the Azure CLI.

-   Download a single blob

        azure storage blob download -k "<Account Key>" -a "<Storage Account Name>" --container "<Blob Container Name>" -b "<Remote File Name>" -d "<Local path where the file will be downloaded to>"

-   Upload a single blob: 

        azure storage blob upload -k "<Account Key>" -a "<Storage Account Name>" --container "<Blob Container Name>" -f "<Local File Name>"

**How can I give other people access to my storage resources?**

To give other people access to the storage
resources:

-   Use a Shared Access Signature (SAS) token to provide access to a
    resource. 

-   Provide a user with the primary or secondary key for the
    storage account. For more information, see [Manage your storage
    account](storage-create-storage-account.md#manage-your-storage-account).

-   Change the access policy to allow anonymous access. For more
    information, see [Grant anonymous users permissions to containers
    and
    blobs](../blobs/storage-manage-access-to-resources.md#grant-anonymous-users-permissions-to-containers-and-blobs).

**Where is AzCopy installed?**

-   If you access AzCopy from the "Microsoft Azure Storage command
    line," type 'AzCopy.' The command-line is
    installed alongside AzCopy.

-   If you installed the 32-bit version, it will be located
    here: **%ProgramFiles(x86)%\\Microsoft SDKs\\Azure\\AzCopy.**

-   If you installed the 64-bit version, it will be located
    here: **%ProgramFiles%\\Microsoft SDKs\\Azure\\AzCopy**.

**For a replicated storage account (such as ZRS, GRS, or
RA-GRS), how do I access data that is stored in the secondary region?**

-   If you are using Zone-Redundant Storage (ZRS) or Geo-Redundant
    Storage (GRS), you cannot access data from the secondary region
    unless a failover occurs. For more information about the failover
    process, see [What to expect if a storage failover
    occurs](storage-disaster-recovery-guidance.md#what-to-expect-if-a-storage-failover-occurs).

-   If you are using Read-Access Geo-Redundant Storage (**RA-GRS**), you
    can access data from the secondary region at any time. To do this, use one of the following methods:  
      
    AzCopy: append '-secondary' to the Storage Account name in the URL
    to access the secondary endpoint. For example:  
     
    https://storageaccountname-secondary.blob.core.windows.net/vhds/BlobName.vhd

    SAS Token: use a SAS token to access data from the endpoint. For more
    information, see [Using shared access signatures
    (SAS)](storage-dotnet-shared-access-signature-part-1.md).

**How do I use an HTTPS custom domain with my Storage Account? For
example, how do I make
"https://mystorageaccountname.blob.core.windows.net/images/image.gif"
appear as "https://www.contoso.com/images/image.gif"?**

SSL is not currently supported on Storage Accounts with custom domains.
But you can use non-HTTPS custom domains. For more information,
see [Configure a custom domain name for your Blob storage
endpoint](../blobs/storage-custom-domain-name.md).

**How do I use FTP to access data that is in a Storage Account?**

There is no way to access a storage account directly by using FTP. However, you can set up an Azure virtual machine, and then install an FTP server on the virtual machine. You can have the FTP server store files in an Azure Files share or in a data disk that is available to the virtual machine.
If you want only to download data without having to use Storage Explorer or a similar application, they may be able to use an SAS token. For more information, see [Using shared access signatures
(SAS)](storage-dotnet-shared-access-signature-part-1.md).

## Need help? Contact support.

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.