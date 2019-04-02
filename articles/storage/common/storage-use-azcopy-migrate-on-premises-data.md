---
title: 'Tutorial: Migrate on-premises data to Azure Storage by using AzCopy| Microsoft Docs'
description: In this tutorial, you use AzCopy to migrate data or copy data to or from blob, table, and file content. Easily migrate data from your local storage to Azure Storage.
services: storage
author: roygara

ms.service: storage
ms.topic: tutorial
ms.date: 12/14/2017
ms.author: rogarana
ms.subservice: common
#Customer intent: As a customer with data, I want to move my data from its existing location so that I can have access to that data in my storage account.
---

#  Tutorial: Migrate on-premises data to cloud storage by using AzCopy

AzCopy is a command-line tool for copying data to or from Azure Blob storage, Azure Files, and Azure Table storage, by using simple commands. The commands are designed for optimal performance. Using AzCopy, you can either copy data between a file system and a storage account, or between storage accounts. AzCopy may be used to copy data from local (on-premises) data to a storage account.

Download the version of AzCopy appropriate for your operating system:

* [AzCopy on Linux](storage-use-azcopy-linux.md) is built with .NET Core Framework. It targets Linux platforms by offering POSIX-style command-line options. 
* [AzCopy on Windows](storage-use-azcopy.md) is built with .NET Framework. It offers Windows-style command-line options. 
 
In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a storage account. 
> * Use AzCopy to upload all your data.
> * Modify the data for test purposes.
> * Create a scheduled task or cron job to identify new files to upload.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this tutorial, download the latest version of AzCopy on [Linux](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-linux#download-and-install-azcopy) or [Windows](https://aka.ms/downloadazcopy).

If you're on Windows, you will require [Schtasks](https://msdn.microsoft.com/library/windows/desktop/bb736357(v=vs.85).aspx) as this tutorial makes use of it in order to schedule a task. Linux users will make use of the crontab command, instead.

[!INCLUDE [storage-create-account-portal-include](../../../includes/storage-create-account-portal-include.md)]

## Create a container

The first step is to create a container, because blobs must always be uploaded into a container. Containers are used as a method of organizing groups of blobs like you would files on your computer, in folders. 

Follow these steps to create a container:

1. Select the **Storage accounts** button from the main page, and select the storage account that you created.
2. Select **Blobs** under **Services**, and then select **Container**. 

   ![Create a container](media/storage-azcopy-migrate-on-premises-data/CreateContainer.png)
 
Container names must start with a letter or number. They can contain only letters, numbers, and the hyphen character (-). For more rules about naming blobs and containers, see [Naming and referencing containers, blobs, and metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

## Upload contents of a folder to Blob storage

You can use AzCopy to upload all files in a folder to Blob storage on [Windows](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy#upload-blobs-to-blob-storage) or [Linux](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-linux#blob-download). To upload all blobs in a folder, enter the following AzCopy command:

# [Linux](#tab/linux)

    azcopy \
        --source /mnt/myfolder \
        --destination https://myaccount.blob.core.windows.net/mycontainer \
        --dest-key <key> \
        --recursive

# [Windows](#tab/windows)

    AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:<key> /S
---

Replace `<key>` and `key` with your account key. In the Azure portal, you can retrieve your account key by selecting **Access keys** under **Settings** in your storage account. Select a key, and paste it into the AzCopy command. If the specified destination container does not exist, AzCopy creates it and uploads the file into it. Update the source path to your data directory, and replace **myaccount** in the destination URL with your storage account name.

To upload the contents of the specified directory to Blob storage recursively, specify the `--recursive` (Linux) or `/S` (Windows) option. When you run AzCopy with one of these options, all subfolders and their files are uploaded as well.

## Upload modified files to Blob storage

You can use AzCopy to [upload files](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy#other-azcopy-features) based on their last-modified time. To try this, modify or create new files in your source directory for test purposes. To upload only updated or new files, add the `--exclude-older` (Linux) or `/XO` (Windows) parameter to the AzCopy command.

If you only want to copy source resources that do not exist in the destination, specify both `--exclude-older` and `--exclude-newer` (Linux) or `/XO` and `/XN` (Windows) parameters in the AzCopy command. AzCopy uploads only the updated data, based on its time stamp.

# [Linux](#tab/linux)

    azcopy \
    --source /mnt/myfolder \
    --destination https://myaccount.blob.core.windows.net/mycontainer \
    --dest-key <key> \
    --recursive \
    --exclude-older

# [Windows](#tab/windows)

    AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:<key> /S /XO
---

## Create a scheduled task

You can create a scheduled task or cron job that runs an AzCopy command script. The script identifies and uploads new on-premises data to cloud storage at a specific time interval.

Copy the AzCopy command to a text editor. Update the parameter values of the AzCopy command to the appropriate values. Save the file as `script.sh` (Linux) or `script.bat` (Windows) for AzCopy.

# [Linux](#tab/linux)

    azcopy --source /mnt/myfiles --destination https://myaccount.blob.core.windows.net/mycontainer --dest-key <key> --recursive --exclude-older --exclude-newer --verbose >> Path/to/logfolder/`date +\%Y\%m\%d\%H\%M\%S`-cron.log

# [Windows](#tab/windows)

    cd C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy
    AzCopy /Source: C:\myfolder  /Dest:https://myaccount.blob.core.windows.net/mycontainer /DestKey:<key> /V /XO /XN >C:\Path\to\logfolder\azcopy%date:~-4,4%%date:~-7,2%%date:~-10,2%%time:~-11,2%%time:~-8,2%%time:~-5,2%.log
---

AzCopy is run with the verbose `--verbose` (Linux) or `/V` (Windows) option. The output is redirected into a log file.

In this tutorial, [Schtasks](https://msdn.microsoft.com/library/windows/desktop/bb736357(v=vs.85).aspx) is used to create a scheduled task on Windows. The [Crontab](http://crontab.org/) command is used to create a cron job on Linux.
 **Schtasks** enables an administrator to create, delete, query, change, run, and end scheduled tasks on a local or remote computer. **Cron** enables Linux and Unix users to run commands or scripts at a specified date and time by using [cron expressions](https://en.wikipedia.org/wiki/Cron#CRON_expression).

# [Linux](#tab/linux)

To create a cron job on Linux, enter the following command on a terminal:

```bash
crontab -e
*/5 * * * * sh /path/to/script.sh
```

Specifying the cron expression `*/5 * * * * ` in the command indicates that the shell script `script.sh` should run every five minutes. You can schedule the script to run at a specific time daily, monthly, or yearly. To learn more about setting the date and time for job execution, see [cron expressions](https://en.wikipedia.org/wiki/Cron#CRON_expression).

# [Windows](#tab/windows)

To create a scheduled task on Windows, enter the following command at a command prompt or in PowerShell:

```cmd
schtasks /CREATE /SC minute /MO 5 /TN "AzCopy Script" /TR C:\Users\username\Documents\script.bat
```

The command uses:
- The `/SC` parameter to specify a minute schedule.
- The `/MO` parameter to specify an interval of five minutes.
- The `/TN` parameter to specify the task name.
- The `/TR` parameter to specify the path to the `script.bat` file.

To learn more about creating a scheduled task on
Windows, see [Schtasks](https://technet.microsoft.com/library/cc772785(v=ws.10).aspx#BKMK_minutes).

---

To validate that the scheduled task/cron job runs correctly, create new files in your `myfolder` directory. Wait five minutes to confirm that the new files have been uploaded to your storage account. Go to your log directory to view output logs of the scheduled task or cron job.

## Next steps

To learn more about ways to move on-premises data to Azure Storage and vice versa, follow this link:

> [!div class="nextstepaction"]
> [Move data to and from Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-moving-data?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).  

For more information about AzCopy explicitly, choose the appropriate article for your operating system:

> [!div class="nextstepaction"]
> [Transfer data with AzCopy on Windows](storage-use-azcopy.md)
> [Transfer data with AzCopy on Linux](storage-use-azcopy-linux.md)
