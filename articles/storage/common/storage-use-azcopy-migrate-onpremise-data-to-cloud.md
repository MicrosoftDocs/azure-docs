--- 
title: Migrate on-premises data to cloud storage with AzCopy| Microsoft Docs
description: Use AzCopy to migrate data or copy data to or from blob, table, and file content. Easily migrate data from your local storage to Azure storage.  
services: storage
documentationcenter:
author: ruthogunnnaike
manager: timlt
editor: ''

ms.service: storage
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: azcopy
ms.topic: tutorial
ms.date: 11/2/2017
ms.author: v-ruogun
ms.custom: mvc
--- 

#  Migrate on-premises data to cloud storage with AzCopy

AzCopy is a command-line utility designed for copying data to/from Microsoft Azure Blob, File, and Table storage, using simple commands with optimal performance. You can copy data from one object to another within your storage account, or between storage accounts.   

There are two versions of AzCopy that you can download:

* [AzCopy on Linux](storage-use-azcopy.md) is built with .NET Core Framework, which targets Linux platforms offering POSIX style command-line options. 
* [AzCopy on Windows](../storage-use-azcopy.md) is built with .NET Framework, and offers Windows style command-line options. 
 
In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a storage account 
> * Use AzCopy to upload all your data
> * Modify the data for testing purposes
> * Create a scheduled task or cron job to identify new files to upload

## Prerequisites

To complete this tutorial: 

* Download the latest version of AzCopy on [Linux](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-linux#download-and-install-azcopy) or [Windows](http://aka.ms/downloadazcopy). 

Log in to the [Azure Portal](https://portal.azure.com/).

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

Log in to the [Azure Portal](https://portal.azure.com/).

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

>[!NOTE]
>If you want to be able to download blobs from a secondary region to your local storage and vice versa, set **Replication** to **Read-access-geo-redundant storage**. Selecting this option creates a [geo-redundant storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy#geo-redundant-storage) account. 
>
>

## Create a container

Blobs are always uploaded into a container. Containers allows you to organize groups of blobs like you organize your files on your computer in folders. 

Follow these steps to create a container:

1. Select the **Storage accounts** button from the main page, and select the storage account you created.
2. Select **Blobs** under **Services**, then select **Container**  

![Create a container](media/storage-azcopy-migrate-on-premises-data/CreateContainer.png)
 
Container names must start with a letter or number, and can contain only letters, numbers, and the hyphen character (-). For more rules about naming blobs and containers, see [Naming and referencing containers, blobs, and metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

## Upload all your data

There are several ways to upload data to Azure Blob Storage using AzCopy on [Windows](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy#upload-blobs-to-blob-storage) or [Linux](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-linux#blob-download). To upload all blobs in a folder, enter the following AzCopy command:

# [Linux](#tab/linux)
    azcopy \
        --source /mnt/myfolder \
        --destination https://myaccount.blob.core.windows.net/mycontainer \
        --dest-key <key> \
        --recursive

# [Windows](#tab/windows)
    azCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey: key /S
---

Replace **\<key\>** with your account key. In the Azure portal, you can retrieve your account key by selecting **Access keys** under Settings in your storage account. Select a key, and paste in the AzCopy command. If the specified destination container does not exist, AzCopy creates it and uploads the file into it.  Update the source path to your data directory, and replace **myaccount** in the destination URL to your storage account.

Specifying option `--recursive` and `/S` in the AzCopy on Linux and Windows respectivelyy, uploads the contents of the specified directory to Blob storage recursively, meaning that all subfolders and their files are uploaded as well.

## Modify the data for testing purposes
Modify or create new files in your source directory - `myfolder`for testing purpose. To upload only updated or new files, add `--exclude-older`or `/XO` parameter to the AzCopy Linux and Windows command respectively. If you only want to copy source resources that do not exist in the destination, specify both `--exclude-older` and `--exclude-newer` parameters in the AzCopy command. AzCopy uploads only the updated data based on their timestamp.
 
# [Linux](#tab/linux)
azcopy \
    --source /mnt/myfolder \
    --destination https://myaccount.blob.core.windows.net/mycontainer \
    --dest-key <key> \
    --recursive \
    --exclude-older

# [Windows](#tab/windows)
azCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey: key /S /XO
---

## Create a scheduled task or cron job 
You create a scheduled task/cron job that runs an AzCopy command script that identifies and uploads new on-premise data to the cloud storage at a specific time interval. 

Copy the AzCopy command to a text editor. Update the parameter values of AzCopy command to the appropriate values. Save the file as `script.sh` or `script.bat` for AzCopy on Linux and Windows respectively. 

# [Linux](#tab/linux)
   azcopy --source /mnt/myfiles --destination https://myaccount.blob.core.windows.net/mycontainer --dest-key <key> --recursive --exclude-older --exclude-newer --verbose >> Path/to/logfolder/`date +\%Y\%m\%d\%H\%M\%S`-cron.log

# [Windows](#tab/windows)
    cd C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy
    Azcopy /Source:C:\myfolder  /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey: key /V /XO /XN >C:\Path\to\logfolder\azcopy%date:~-4,4%%date:~-7,2%%date:~-10,2%%time:~-11,2%%time:~-8,2%%time:~-5,2%.log
---

AzCopy is run with verbose `--verbose` (Linux) and `/V` (Windows) option, and the output is redirected into a log file. 

In this tutorial, [Schtasks](https://msdn.microsoft.com/en-us/library/windows/desktop/bb736357(v=vs.85).aspx) is used to create a scheduled task on Windows, and [Crontab]((http://crontab.org/) command is used to create a cron job on Linux. 
 **Schtasks** enables administrator to create, delete, query, change, run, and end scheduled tasks on local or remote computer; and **Cron** allows Linux and Unix users to run commands or scripts at specified date and time using [cron expression](https://en.wikipedia.org/wiki/Cron#CRON_expression)

To create a cron job on Linux, enter the following command on a terminal. 

```
crontab -e 
*/5 * * * * sh /path/to/script.sh 
```

Specifying a cron expression `0 2 * * * ` in the command means that the shell script `script.sh` should execute every two hours. The script can be scheduled to run at a specific time daily, monthly, or yearly. Check [cron expressions](https://en.wikipedia.org/wiki/Cron#CRON_expression) to learn more about setting the date and time for a job execution. 
To see what crontabs are currently running on your system, open a terminal and run `crontab -l`.


To create a scheduled task on Windows, enter the following command on command prompt or PowerShell.

``` 
schtasks /CREATE /SC minute /MO 5 /TN "AzCopy Script" /TR C:\Users\username\Documents\script.bat
```

The command uses the `/SC` parameter to specify a minute schedule and the `/MO` parameter to specify an interval of five minutes. The `/TN` parameter is used to specify the task name, and `/TR` parameter to specify the path to `script.bat` file. Visit [schtasks](https://technet.microsoft.com/en-us/library/cc772785(v=ws.10).aspx#BKMK_minutes) to learn more about creating scheduled task on 
Windows.


 
To validate the scheduled task/cron job executes correctly, create new files in your directory `myfolder`. Wait for five minutes to confirm the new files have been uploaded to your storage account. Go to your log directory to view output logs of the scheduled task/cron job. 

Visit [move-on-premises-data](https://docs.microsoft.com/en-us/azure/storage/common/storage-moving-data?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) learn about varieties of ways to move on-premises data to Azure storage and vice versa.  

## Next steps
For more information about Azure Storage and AzCopy, see the following resources:

### Azure Storage documentation:
* [Introduction to Azure Storage](../storage-introduction.md)
* [Transfer data with AzCopy on Windows](storage-use-azcopy.md) 
* [Transfer data with AzCopy on Linux](storage-use-azcopy-linux.md) 
* [Create a storage account](../storage-create-storage-account.md)
* [Manage blobs with Storage Explorer](https://docs.microsoft.com/en-us/azure/vs-azure-tools-storage-explorer-blobs)  

### Azure Storage blog posts: 
* [Introducing Azure Storage Data Movement Library Preview](https://azure.microsoft.com/blog/introducing-azure-storage-data-movement-library-preview-2/)
* [AzCopy: Introducing synchronous copy and customized content type](http://blogs.msdn.com/b/windowsazurestorage/archive/2015/01/13/azcopy-introducing-synchronous-copy-and-customized-content-type.aspx)
* [AzCopy: Announcing General Availability of AzCopy 3.0 plus preview release of AzCopy 4.0 with Table and File support](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/10/29/azcopy-announcing-general-availability-of-azcopy-3-0-plus-preview-release-of-azcopy-4-0-with-table-and-file-support.aspx)
* [AzCopy: Optimized for Large-Scale Copy Scenarios](http://go.microsoft.com/fwlink/?LinkId=507682)
* [AzCopy: Support for read-access geo-redundant storage](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/04/07/azcopy-support-for-read-access-geo-redundant-account.aspx)
* [AzCopy: Transfer data with restartable mode and SAS token](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/09/07/azcopy-transfer-data-with-re-startable-mode-and-sas-token.aspx)
* [AzCopy: Using cross-account Copy Blob](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/04/01/azcopy-using-cross-account-copy-blob.aspx)
* [AzCopy: Uploading/downloading files for Azure Blobs](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/12/03/azcopy-uploading-downloading-files-for-windows-azure-blobs.aspx)






 
 

