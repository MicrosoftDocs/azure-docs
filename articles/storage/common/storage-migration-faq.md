---
title: Azure Storage migration FAQ | Microsoft Docs
description: Answers to common questions about migrating Azure Storage
services: storage
author: genlin
ms.service: storage
ms.topic: article
ms.date: 05/11/2018
ms.author: genli
ms.component: common
---
# Frequently asked questions about Azure Storage migration

This article answers common questions about Azure Storage migration. 

## FAQ

**How do I create a script to copy files from one container to
another?**

To copy files between containers, you can use AzCopy. See the following
example:

    AzCopy /Source:https://xxx.blob.core.windows.net/xxx
    /Dest:https://xxx.blob.core.windows.net/xxx /SourceKey:xxx /DestKey:xxx
    /S

AzCopy uses the [Copy Blob API](https://docs.microsoft.com/rest/api/storageservices/copy-blob) to
copy each file in the container.  
  
You can use any virtual machine or local machine that has internet access to run AzCopy. You can also use an Azure Batch schedule to do this automatically, but it's more complicated.  
  
The automation script is designed for Azure Resource Manager deployment instead of storage content manipulation. For more information, see [Deploy
resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/resource-group-template-deploy.md).

**Is there any charge for copying data between two file shares on the same storage account within the same region?**

No. There is no charge for this process.

**How do I back up my entire storage account to another storage account?**

There is no option to back up an entire storage account directly. But
you can manually move the container in that storage account to another
account by using AzCopy or Storage Explorer. The following steps show
how to use AzCopy to move the container:  
 

1.  Install the [AzCopy](storage-use-azcopy.md) command-line tool. This tool helps you move the VHD file between storage accounts.

2.  After you install AzCopy on Windows by using the installer, open a
    Command Prompt window and then browse to the AzCopy installation
    folder on your computer. By default, AzCopy is installed to
    **%ProgramFiles(x86)%\Microsoft SDKs\Azure\AzCopy** or
    **%ProgramFiles%\Microsoft SDKs\Azure\AzCopy**.

3.  Run the following command to move the container. You must replace
    the text with the actual values.   
     
            AzCopy /Source:https://sourceaccount.blob.core.windows.net/mycontainer1
            /Dest:https://destaccount.blob.core.windows.net/mycontainer2
            /SourceKey:key1 /DestKey:key2 /S

    - `/Source`: Provide the URI for the source storage account (up to the container).  
    - `/Dest`: Provide the URI for the target storage account (up to the container).  
    - `/SourceKey`: Provide the primary key for the source storage account. You can copy this key from the Azure portal by selecting the storage account.  
    - `/DestKey`: Provide the primary key for the target storage account. You can copy this key from the portal by selecting the storage account.

After you run this command, the container files are moved to the
target storage account.

> [!NOTE]
> The AzCopy CLI does not work together with the **Pattern** switch when you copy from one Azure blob to another.
>
> You can directly copy and edit the AzCopy command, and cross-check to make sure that **Pattern** matches the source. Also make sure that **/S** wildcards are in effect. For more information, see [AzCopy parameters](storage-use-azcopy.md).

**How do I move data from one storage container to another?**

Follow these steps:

1.  Create the container (folder) in the destination blob.

2.  Use [AzCopy](https://azure.microsoft.com/blog/azcopy-5-1-release/) to copy the contents from the original blob container to a different blob container.

**How do I create a PowerShell script to move data from one Azure file share to another in Azure Storage?**

Use AzCopy to move the data from one Azure file share to another in Azure
Storage. For more information, see [Transfer data with AzCopy on Windows](storage-use-azcopy.md) and [Transfer data with AzCopy on Linux](storage-use-azcopy-linux.md).

**How do I upload large .csv files to Azure Storage?**

Use AzCopy to upload large .csv files to Azure Storage. For more information, see [Transfer data with AzCopy on Windows](storage-use-azcopy.md) and [Transfer data with AzCopy on Linux](storage-use-azcopy-linux.md).

**I have to move the logs from drive D to my Azure storage account every day. How do I automate this?**

You can use AzCopy and create a task in Task Scheduler. Upload files to an Azure storage account by using an AzCopy batch script. For more information, see [How to configure and run startup tasks for a cloud
service](../../cloud-services/cloud-services-startup-tasks.md).

**How do I move my storage account between subscriptions?**

Use AzCopy to move your storage account between subscriptions. For more
information, see [Transfer data with AzCopy on Windows](storage-use-azcopy.md) and [Transfer data with AzCopy on Linux](storage-use-azcopy-linux.md).

**How can I move about 10 TB of data to storage at another region?**

Use AzCopy to move the data. For more information, see [Transfer data
with AzCopy on Windows](storage-use-azcopy.md) and [Transfer data with AzCopy on Linux](storage-use-azcopy-linux.md).

**How can I copy data from on-premises to Azure Storage?**

Use AzCopy to copy the data. For more information, see [Transfer data with AzCopy on Windows](storage-use-azcopy.md) and [Transfer data with AzCopy on Linux](storage-use-azcopy-linux.md).

**How can I move data from on-premises to Azure Files?**

Use AzCopy to move data. For more information, see [Transfer data with AzCopy on Windows](storage-use-azcopy.md) and [Transfer data with AzCopy on Linux](storage-use-azcopy-linux.md).

**How do I map a container folder on a virtual machine?**

Use an Azure file share.

**How do I back up Azure file storage?**

There is no backup solution. However, Azure Files also supports asynchronous copy. So, you can copy files:

- From a share to another share within a storage account or to a different storage account.

- From a share to a blob container within a storage account or to a different storage account.

For more information, see [Transfer data with AzCopy on Windows](storage-use-azcopy.md).

**How do I move managed disks to another storage account?**

Follow these steps:

1.  Stop the virtual machine that the managed disk is attached to.

2.  Copy the managed disk VHD from one area to another by running the
    following Azure PowerShell script:

    ```
    Connect-AzureRmAccount

    Select-AzureRmSubscription -SubscriptionId <ID>

    $sas = Grant-AzureRmDiskAccess -ResourceGroupName <RG name> -DiskName <Disk name> -DurationInSecond 3600 -Access Read

    $destContext = New-AzureStorageContext –StorageAccountName contosostorageav1 -StorageAccountKey <your account key>

    Start-AzureStorageBlobCopy -AbsoluteUri $sas.AccessSAS -DestContainer 'vhds' -DestContext $destContext -DestBlob 'MyDestinationBlobName.vhd'
    ```

3.  Create a managed disk by using the VHD file in another region to which you copied the VHD. To do this, run the following Azure PowerShell script:  

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

For more information about how to deploy a virtual machine from a managed disk, see [CreateVmFromManagedOsDisk.ps1](https://github.com/Azure-Samples/managed-disks-powershell-getting-started/blob/master/CreateVmFromManagedOsDisk.ps1).

**How can I download 1-2 TB of data from the Azure portal?**

Use AzCopy to download the data. For more information, see [Transfer data
with AzCopy on Windows](storage-use-azcopy.md) and [Transfer data with AzCopy on Linux](storage-use-azcopy-linux.md).

**How do I change the secondary location to the Europe region for a storage account?**

When you create a storage account, you select the primary region for the
account. The selection of the secondary region is based on the primary region, and it cannot be changed. For more information, see [Geo-redundant storage (GRS): Cross-regional replication for Azure Storage](storage-redundancy.md).

**Where can I get more information about Azure Storage Service Encryption (SSE)?**  
  
See the following articles:

-  [Azure Storage security guide](storage-security-guide.md)

-  [Azure Storage Service Encryption for Data at Rest](storage-service-encryption.md)

**How do I move or download data from a storage account?**

Use AzCopy to download the data. For more information, see [Transfer data with AzCopy on Windows](storage-use-azcopy.md) and [Transfer data with AzCopy on Linux](storage-use-azcopy-linux.md).


**How do I encrypt data in a storage account?**

After you enable encryption in a storage account, the existing data is not encrypted. To encrypt the existing data, you must upload it again to the storage account.

Use AzCopy to copy the data to a different storage account and then
move the data back. You can also use [encryption at
rest](storage-service-encryption.md).

**How can I download a VHD to a local machine, other than by using the download option in the portal?**

You can use [Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to download a VHD.

**Are there any prerequisites for changing the replication of a storage account from geo-redundant storage to locally redundant storage?**

No. 

**How do I access Azure Files redundant storage?**

Read-access geo-redundant storage is required to access redundant storage. However, Azure Files supports only locally redundant storage and standard geo-redundant storage that does not allow read-only access. 

**How do I move from a premium storage account to a standard storage account?**

Follow these steps:

1.  Create a standard storage account. (Or use an existing
    standard storage account in your subscription.)

2.  Download AzCopy. Run one of the following AzCopy commands.
      
    To copy whole disks in the storage account:

        AzCopy /Source:https://sourceaccount.blob.core.windows.net/mycontainer1
        /Dest:https://destaccount.blob.core.windows.net/mycontainer2
        /SourceKey:key1 /DestKey:key2 /S 

    To copy only one disk, provide the name of the disk in **Pattern**:

        AzCopy /Source:https://sourceaccount.blob.core.windows.net/mycontainer1
        /Dest:https://destaccount.blob.core.windows.net/mycontainer2
        /SourceKey:key1 /DestKey:key2 /Pattern:abc.vhd

   
The operation might take several hours to finish.

To make sure that the transfer finished successfully, examine the
destination storage account container in the Azure portal. After the
disks are copied to the standard storage account, you can attach them to
the virtual machine as an existing disk. For more information, see [How to attach a managed data disk to a Windows virtual machine in the Azure
portal](../../virtual-machines/windows/attach-managed-disk-portal.md).  
  
**How do I convert to Azure Premium Storage for a file share?**

Premium Storage is not allowed on an Azure file share.

**How do I upgrade from a standard storage account to a premium storage account? How do I downgrade from a premium storage account to a standard storage account?**

You must create the destination storage account, copy data from the source account to the destination account, and then delete the source account. You can use a tool such as AzCopy to copy the data.

If you have virtual machines, you must take additional steps before you migrate the storage account data. For more information, see [Migrating to Azure Premium Storage (unmanaged disks)](storage-migration-to-premium-storage.md).

**How do I move from a classic storage account to an Azure Resource Manager storage account?**

You can use the **Move-AzureStorageAccount** cmdlet. This cmdlet has multiple steps (validate, prepare, commit). You can validate the move before you make it.

If you have virtual machines, you must take additional steps before you migrate the storage account data. For more information, see [Migrate IaaS resources from classic to Azure Resource Manager by using Azure PowerShell](../..//virtual-machines/windows/migration-classic-resource-manager-ps.md).

**How do I download data to a Linux-based computer from an Azure storage account, or upload data from a Linux machine?**

You can use the Azure CLI.

- Download a single blob:

      azure storage blob download -k "<Account Key>" -a "<Storage Account Name>" --container "<Blob Container Name>" -b "<Remote File Name>" -d "<Local path where the file will be downloaded to>"

- Upload a single blob: 

      azure storage blob upload -k "<Account Key>" -a "<Storage Account Name>" --container "<Blob Container Name>" -f "<Local File Name>"

**How can I give other people access to my storage resources?**

To give other people access to the storage resources:

-   Use a shared access signature (SAS) token to provide access to a
    resource. 

-   Provide a user with the primary or secondary key for the
    storage account. For more information, see [Manage your storage
    account](storage-account-manage.md#access-keys).

-   Change the access policy to allow anonymous access. For more
    information, see [Grant anonymous users permissions to containers
    and blobs](../blobs/storage-manage-access-to-resources.md#grant-anonymous-users-permissions-to-containers-and-blobs).

**Where is AzCopy installed?**

-   If you access AzCopy from the Microsoft Azure Storage command
    line, type **AzCopy**. The command line is installed alongside AzCopy.

-   If you installed the 32-bit version, it's located
    here: **%ProgramFiles(x86)%\\Microsoft SDKs\\Azure\\AzCopy**.

-   If you installed the 64-bit version, it's located
    here: **%ProgramFiles%\\Microsoft SDKs\\Azure\\AzCopy**.

**For a replicated storage account (such as zone-redundant storage, geo-redundant storage, or read-access geo-redundant storage), how do I access data that is stored in the secondary region?**

-   If you're using zone-redundant storage or geo-redundant storage, you cannot access data from the secondary region unless a failover occurs. For more information about the failover process, see [What to expect if a storage failover occurs](storage-disaster-recovery-guidance.md#what-to-expect-if-a-storage-failover-occurs).

-   If you're using read-access geo-redundant storage, you can access data from the secondary region at any time. Use one of the following methods:  
      
    - **AzCopy**: Append **-secondary** to the storage account name in the URL to access the secondary endpoint. For example:  
     
      https://storageaccountname-secondary.blob.core.windows.net/vhds/BlobName.vhd

    - **SAS token**: Use an SAS token to access data from the endpoint. For more information, see [Using shared access signatures](storage-dotnet-shared-access-signature-part-1.md).

**How do I use an HTTPS custom domain with my storage account? For example, how do I make "https://mystorageaccountname.blob.core.windows.net/images/image.gif" appear as "https://www.contoso.com/images/image.gif"?**

SSL is not currently supported on storage accounts with custom domains.
But you can use non-HTTPS custom domains. For more information,
see [Configure a custom domain name for your Blob storage endpoint](../blobs/storage-custom-domain-name.md).

**How do I use FTP to access data that is in a storage account?**

There is no way to access a storage account directly by using FTP. However, you can set up an Azure virtual machine, and then install an FTP server on the virtual machine. You can have the FTP server store files on an Azure Files share or on a data disk that is available to the virtual machine.

If you want only to download data without having to use Storage Explorer or a similar application, you might be able to use an SAS token. For more information, see [Using shared access signatures](storage-dotnet-shared-access-signature-part-1.md).

**How do I migrate Blobs from one storage account to another?**

 You can do this using our [Blob migration script](../scripts/storage-common-transfer-between-storage-accounts.md).

## Need help? Contact support.

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
