---
title: 'Tutorial: Migrate on-premises data to Azure Storage with AzCopy'
description: In this tutorial, you use AzCopy to migrate data or copy data to or from blob, table, and file content. Easily migrate data from your local storage to Azure Storage.
author: normesta
ms.service: azure-storage
ms.topic: tutorial
ms.date: 05/14/2019
ms.author: normesta
ms.reviewer: seguler
ms.subservice: storage-common-concepts
#Customer intent: As a customer with data, I want to move my data from its existing location so that I can have access to that data in my storage account.
---

#  Tutorial: Migrate on-premises data to cloud storage with AzCopy

AzCopy is a command-line tool for copying data to or from Azure Blob storage, Azure Files, and Azure Table storage, by using simple commands. The commands are designed for optimal performance. Using AzCopy, you can either copy data between a file system and a storage account, or between storage accounts. AzCopy may be used to copy data from local (on-premises) data to a storage account.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a storage account.
> - Use AzCopy to upload all your data.
> - Modify the data for test purposes.
> - Create a scheduled task or cron job to identify new files to upload.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this tutorial, download the latest version of AzCopy. See [Get started with AzCopy](storage-use-azcopy-v10.md).

If you're on Windows, you will require [Schtasks](/windows/win32/taskschd/schtasks) as this tutorial makes use of it in order to schedule a task. Linux users will make use of the crontab command, instead.

[!INCLUDE [storage-create-account-portal-include](../../../includes/storage-create-account-portal-include.md)]

## Create a container

The first step is to create a container, because blobs must always be uploaded into a container. Containers are used as a method of organizing groups of blobs like you would files on your computer, in folders.

Follow these steps to create a container:

1. Select the **Storage accounts** button from the main page, and select the storage account that you created.
2. Select **Blobs** under **Services**, and then select **Container**.

   ![Screenshot showing container creation](media/storage-azcopy-migrate-on-premises-data/CreateContainer.png)

Container names must start with a letter or number. They can contain only letters, numbers, and the hyphen character (-). For more rules about naming blobs and containers, see [Naming and referencing containers, blobs, and metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

## Download AzCopy

Download the AzCopy V10 executable file.

- [Windows](https://aka.ms/downloadazcopy-v10-windows) (zip)
- [Linux](https://aka.ms/downloadazcopy-v10-linux) (tar)
- [macOS](https://aka.ms/downloadazcopy-v10-mac) (zip)

Place the AzCopy file anywhere on your computer. Add the location of the file to your system path variable so that you can refer to this executable file from any folder on your computer.

<a name='authenticate-with-azure-ad'></a>

## Authenticate with Microsoft Entra ID

First, assign the [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-queue-data-contributor) role to your identity. See [Assign an Azure role for access to blob data](../blobs/assign-azure-role-data-access.md).

Then, open a command prompt, type the following command, and press the ENTER key.

```azcopy
azcopy login
```

This command returns an authentication code and the URL of a website. Open the website, provide the code, and then choose the **Next** button.

![Screenshot showing the login prompt](media/storage-use-azcopy-v10/azcopy-login.png)

A sign-in window will appear. In that window, sign into your Azure account by using your Azure account credentials. After you've successfully signed in, you can close the browser window and begin using AzCopy.

## Upload contents of a folder to Blob storage

You can use AzCopy to upload all files in a folder to Blob storage on [Windows](./storage-use-azcopy-v10.md) or [Linux](./storage-use-azcopy-v10.md). To upload all blobs in a folder, enter the following AzCopy command:

```azcopy
azcopy copy "<local-folder-path>" "https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>" --recursive=true
```

- Replace the `<local-folder-path>` placeholder with the path to a folder that contains files (For example: `C:\myFolder` or `/mnt/myFolder`).

- Replace the `<storage-account-name>` placeholder with the name of your storage account.

- Replace the `<container-name>` placeholder with the name of the container that you created.

To upload the contents of the specified directory to Blob storage recursively, specify the `--recursive` option. When you run AzCopy with this option, all subfolders and their files are uploaded as well.

## Upload modified files to Blob storage

You can use AzCopy to upload files based on their last-modified time.

To try this, modify or create new files in your source directory for test purposes. Then, use the AzCopy `sync` command.

```azcopy
azcopy sync "<local-folder-path>" "https://<storage-account-name>.blob.core.windows.net/<container-name>" --recursive=true
```

- Replace the `<local-folder-path>` placeholder with the path to a folder that contains files (For example: `C:\myFolder` or `/mnt/myFolder`.

- Replace the `<storage-account-name>` placeholder with the name of your storage account.

- Replace the `<container-name>` placeholder with the name of the container that you created.

To learn more about the `sync` command, see [Synchronize files](./storage-use-azcopy-v10.md#transfer-data).

## Create a scheduled task

You can create a scheduled task or cron job that runs an AzCopy command script. The script identifies and uploads new on-premises data to cloud storage at a specific time interval.

Copy the AzCopy command to a text editor. Update the parameter values of the AzCopy command to the appropriate values. Save the file as `script.sh` (Linux) or `script.bat` (Windows) for AzCopy.

These examples assume that your folder is named `myFolder`, your storage account name is `mystorageaccount` and your container name is `mycontainer`.

> [!NOTE]
> The Linux example appends a SAS token. You'll need to provide one in your command. To utilize Microsoft Entra authentication in cron jobs, ensure you configure the AZCOPY_AUTO_LOGIN_TYPE environment variable appropriately.

# [Linux](#tab/linux)

```bash
azcopy sync "/mnt/myfiles" "https://mystorageaccount.blob.core.windows.net/mycontainer?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-05-30T06:57:40Z&st=2019-05-29T22:57:40Z&spr=https&sig=BXHippZxxx54hQn/4tBY%2BE2JHGCTRv52445rtoyqgFBUo%3D" --recursive=true
```

# [Windows](#tab/windows)

```bash
azcopy sync "C:\myFolder" "https://mystorageaccount.blob.core.windows.net/mycontainer" --recursive=true
```

---

In this tutorial, [Schtasks](/windows/win32/taskschd/schtasks) is used to create a scheduled task on Windows. The [Crontab](http://crontab.org/) command is used to create a cron job on Linux.

 **Schtasks** enables an administrator to create, delete, query, change, run, and end scheduled tasks on a local or remote computer. **Cron** enables Linux and Unix users to run commands or scripts at a specified date and time by using [cron expressions](https://en.wikipedia.org/wiki/Cron#CRON_expression).

# [Linux](#tab/linux)

To create a cron job on Linux, enter the following command on a terminal:

```bash
crontab -e
*/5 * * * * sh /path/to/script.sh
```

Specifying the cron expression `*/5 * * * *` in the command indicates that the shell script `script.sh` should run every five minutes. You can schedule the script to run at a specific time daily, monthly, or yearly. To learn more about setting the date and time for job execution, see [cron expressions](https://en.wikipedia.org/wiki/Cron#CRON_expression).

# [Windows](#tab/windows)

To create a scheduled task on Windows, enter the following command at a command prompt or in PowerShell:

This example assumes that your script is located in the root drive of your computer, but your script can be anywhere that you want.

```cmd
schtasks /CREATE /SC minute /MO 5 /TN "AzCopy Script" /TR C:\script.bat
```

The command uses:
- The `/SC` parameter to specify a minute schedule.
- The `/MO` parameter to specify an interval of five minutes.
- The `/TN` parameter to specify the task name.
- The `/TR` parameter to specify the path to the `script.bat` file.

To learn more about creating a scheduled task on
Windows, see [Schtasks](/previous-versions/orphan-topics/ws.10/cc772785(v=ws.10)#BKMK_minutes).

---

To validate that the scheduled task/cron job runs correctly, create new files in your `myFolder` directory. Wait five minutes to confirm that the new files have been uploaded to your storage account. Go to your log directory to view output logs of the scheduled task or cron job.

## Next steps

To learn more about ways to move on-premises data to Azure Storage and vice versa, follow this link:

- [Move data to and from Azure Storage](./storage-choose-data-transfer-solution.md?toc=/azure/storage/files/toc.json).

For more information about AzCopy, see any of these articles:

- [Get started with AzCopy](storage-use-azcopy-v10.md)

- [Transfer data with AzCopy and blob storage](./storage-use-azcopy-v10.md#transfer-data)

- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

- [Transfer data with AzCopy and Amazon S3 buckets](storage-use-azcopy-s3.md)

- [AzCopy configuration settings](storage-ref-azcopy-configuration-settings.md)

- [Optimize the performance of AzCopy](storage-use-azcopy-optimize.md)

- [Find errors and resume jobs by using log and plan files in AzCopy](storage-use-azcopy-configure.md)

- [Troubleshoot problems with AzCopy v10](storage-use-azcopy-troubleshoot.md)
