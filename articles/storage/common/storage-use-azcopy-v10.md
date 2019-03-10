---
title: Copy or move data to Azure Storage with AzCopy v10 (Preview) | Microsoft Docs
description: Use the AzCopy v10 (Preview) utility to move or copy data to or from blob, data lake, and file content. Copy data to Azure Storage from local files, or copy data within or between storage accounts. Easily migrate your data to Azure Storage.
services: storage
author: artemuwka
ms.service: storage
ms.topic: article
ms.date: 02/24/2019
ms.author: artemuwka
ms.subservice: common
---
# Transfer data with the AzCopy v10 (Preview)

AzCopy v10 (Preview) is the next-generation command-line utility for copying data to/from Microsoft Azure Blob and File storage, which offers a redesigned command-line interface and new architecture for high-performance reliable data transfers. Using AzCopy you can copy data between a file system and a storage account, or between storage accounts.

## What's new in AzCopy v10

- Synchronize a file system to Azure Blob or vice versa. Use `azcopy sync <source> <destination>`. Ideal for incremental copy scenarios.
- Supports Azure Data Lake Storage Gen2 APIs. Use `myaccount.dfs.core.windows.net` as a URI to call the ADLS Gen2 APIs.
- Supports copying an entire account (Blob service only) to another account.
- Account to account copy is now using the new [Put Block from URL](https://docs.microsoft.com/rest/api/storageservices/put-block-from-url) APIs. No data transfer to the client is needed which makes the transfer faster!
- List/Remove files and blobs in a given path.
- Supports wildcard patterns in a path as well as in --exclude flag.
- Improved resiliency: every AzCopy instance will create a job order and a related log file. You can view and restart previous jobs and resume failed jobs. AzCopy will also automatically retry a transfer after a failure.
- General performance improvements.

## Download and install AzCopy

### Latest preview version (v10)

Download the latest preview version of AzCopy:
- [Windows](https://aka.ms/downloadazcopy-v10-windows) (zip)
- [Linux](https://aka.ms/downloadazcopy-v10-linux) (tar)
- [MacOS](https://aka.ms/downloadazcopy-v10-mac) (zip)

### Latest production version (v8.1)

Download the [latest production version of AzCopy for Windows](https://aka.ms/downloadazcopy).

### AzCopy supporting Table storage service (v7.3)

Download the [AzCopy v7.3 supporting copying data to/from Microsoft Azure Table storage service](https://aka.ms/downloadazcopynet).

## Post-installation Steps

AzCopy v10 does not require an installation. Open a preferred command-line application and navigate to the folder where `azcopy.exe` (Windows) or `azcopy` (Linux) executable is located. If desired, you can add the AzCopy folder location to your system path.

## Authentication Options

AzCopy v10 allows you to use the following options when authenticating with Azure Storage:
- **Azure Active Directory [Supported for Blob and ADLS Gen2 services]**. Use ```.\azcopy login``` to sign in using Azure Active Directory.  The user should have ["Storage Blob Data Contributor" role assigned](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac) to write to Blob storage using Azure Active Directory authentication. For authenticating using Managed Service Identity (MSI), use `azcopy login --identity` after granting the Azure compute instance the data contributor role.
- **SAS tokens [Supported for Blob and File services]**. Append the SAS token to the blob path on the command line to use it. You can generate SAS token using Azure Portal, [Storage Explorer](https://blogs.msdn.microsoft.com/jpsanders/2017/10/12/easily-create-a-sas-to-download-a-file-from-azure-storage-using-azure-storage-explorer/), [PowerShell](https://docs.microsoft.com/powershell/module/az.storage/new-azstorageblobsastoken), or other tools of your choice. For more information, see [examples](https://docs.microsoft.com/azure/storage/blobs/storage-dotnet-shared-access-signature-part-2).

## Getting started

> [!TIP]
> **Prefer a graphical user interface ?**
>
> Try [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/), a desktop client that simplifies managing Azure Storage data, and **now uses AzCopy** to accelerate data transfer to and out of Azure Storage.
>
> Simply enable AzCopy feature in Storage Explorer under 'Preview' menu. Storage Explorer will then use AzCopy when uploading and downloading data to Blob storage for improved performance.
> ![Enable AzCopy as a transfer engine in Azure Storage Explorer](media/storage-use-azcopy-v10/enable-azcopy-storage-explorer.jpg)

AzCopy v10 has a simple self-documented syntax. The general syntax looks as follows when logged into the Azure Active Directory:

```azcopy
.\azcopy <command> <arguments> --<flag-name>=<flag-value>
# Examples if you have logged into the Azure Active Directory:
.\azcopy copy <source path> <destination path> --<flag-name>=<flag-value>
.\azcopy cp "C:\local\path" "https://account.blob.core.windows.net/container" --recursive=true
.\azcopy cp "C:\local\path\myfile" "https://account.blob.core.windows.net/container/myfile"
.\azcopy cp "C:\local\path\*" "https://account.blob.core.windows.net/container"

# Examples if you are using SAS tokens to authenticate:
.\azcopy cp "C:\local\path" "https://account.blob.core.windows.net/container?sastoken" --recursive=true
.\azcopy cp "C:\local\path\myfile" "https://account.blob.core.windows.net/container/myfile?sastoken"
```

Here's how you can get a list of available commands:

```azcopy
.\azcopy --help
# Using the alias instead
.\azcopy -h
```

To see the help page and examples for a specific command run the command below:

```azcopy
.\azcopy <cmd> --help
# Example:
.\azcopy cp -h
```

## Create a Blob container or File share 

**Create a Blob container**

```azcopy
.\azcopy make "https://account.blob.core.windows.net/container-name"
```

**Create a File share**

```azcopy
.\azcopy make "https://account.file.core.windows.net/share-name"
```

**Create a Blob container using ADLS Gen2**

If you've enabled hierarchical namespaces on your blob storage account, you can use the following command to create a new file system (Blob container) so that you can upload files to it.

```azcopy
.\azcopy make "https://account.dfs.core.windows.net/top-level-resource-name"
```

## Copy data to Azure Storage

Use the copy command to transfer data from the source to the destination. The source/destination can be a:
- Local file system
- Azure Blob/Virtual Directory/Container URI
- Azure File/Directory/File Share URI
- Azure Data Lake Storage Gen2 Filesystem/Directory/File URI

```azcopy
.\azcopy copy <source path> <destination path> --<flag-name>=<flag-value>
# Using alias instead
.\azcopy cp <source path> <destination path> --<flag-name>=<flag-value>
```

The following command uploads all files under the folder `C:\local\path` recursively to the container `mycontainer1` creating `path` directory in the container:

```azcopy
.\azcopy cp "C:\local\path" "https://account.blob.core.windows.net/mycontainer1<sastoken>" --recursive=true
```

The following command uploads all files under the folder `C:\local\path` (without recursing into the subdirectories) to the container `mycontainer1`:

```azcopy
.\azcopy cp "C:\local\path\*" "https://account.blob.core.windows.net/mycontainer1<sastoken>"
```

To get more examples, use the following command:

```azcopy
.\azcopy cp -h
```

## Copy data between two storage accounts

Copying data between two storage accounts uses the [Put Block From URL](https://docs.microsoft.com/rest/api/storageservices/put-block-from-url) API and does not utilize the client machine's network bandwidth. Data is copied between two Azure Storage servers directly while AzCopy simply orchestrates the copy operation. This option currently is only available for Blob storage.

To copy the data between two storage accounts, use the following command:
```azcopy
.\azcopy cp "https://account.blob.core.windows.net/<sastoken>" "https://otheraccount.blob.core.windows.net/<sastoken>" --recursive=true
```

> [!NOTE]
> The command will enumerate all blob containers and copy them to the destination account. At this time AzCopy v10 supports copying only block blobs between two storage accounts. All other storage account objects (append blobs, page blobs, files, tables and queues) will be skipped.

## Copy a VHD image to a storage account

Use `--blob-type=PageBlob` to upload a disk image to Blob storage as a Page Blob.

```azcopy
.\azcopy cp "C:\myimages\diskimage.vhd" "https://account.blob.core.windows.net/mycontainer/diskimage.vhd<sastoken>" --blob-type=PageBlob
```

## Sync: incremental copy and (optional) delete (Blob storage only)

Sync command synchronizes contents of a source directory to a directory in the destination comparing file names and last modified timestamps. Optionally this operation includes deletion of destination files if those do not exist in the source when `--delete-destination=prompt|true` flag is provided. By default the delete behavior is disabled.

> [!NOTE]
> Use `--delete-destination` flag with caution. Enable [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) feature before you enable delete behavior in sync to prevent accidental deletes in your account.
>
> When `--delete-destination` is set to true, AzCopy will delete files that do not exist in the source from destination without any prompt to the user. If you would like to be prompted for confirmation, use `--delete-destination=prompt`.

To sync your local file system to a storage account, use the following command:

```azcopy
.\azcopy sync "C:\local\path" "https://account.blob.core.windows.net/mycontainer<sastoken>"
```

In the same way you can sync a Blob container down to a local file system:

```azcopy
# If you're using Azure Active Directory authentication the sastoken is not required
.\azcopy sync "https://account.blob.core.windows.net/mycontainer" "C:\local\path"
```

The command allows you to incrementally sync the source to the destination based on last modified timestamps. If you add or delete a file in the source, AzCopy v10 will do the same in the destination. If the delete behavior is enabled in the sync command, AzCopy will delete files from the destination if they do not exist in the source anymore.

## Advanced configuration

### Configure proxy settings

To configure the proxy settings for AzCopy v10, set the environment variable https_proxy using the following command:

```cmd
# For Windows:
set https_proxy=<proxy IP>:<proxy port>
# For Linux:
export https_proxy=<proxy IP>:<proxy port>
# For MacOS
export https_proxy=<proxy IP>:<proxy port>
```

### Optimize throughput

Set the environment variable AZCOPY_CONCURRENCY_VALUE to configure the number of concurrent requests and control the throughput performance and resource consumption. The value is set to 300 by default. Reducing the value will limit the bandwidth and CPU used by AzCopy v10.

```cmd
# For Windows:
set AZCOPY_CONCURRENCY_VALUE=<value>
# For Linux:
export AZCOPY_CONCURRENCY_VALUE=<value>
# For MacOS
export AZCOPY_CONCURRENCY_VALUE=<value>
# To check the current value of the variable on all the platforms
.\azcopy env
# If the value is blank then the default value is currently in use
```

### Change the location of the log files

You can change the location of the log files if needed or to avoid filling up the OS disk.

```cmd
# For Windows:
set AZCOPY_LOG_LOCATION=<value>
# For Linux:
export AZCOPY_LOG_LOCATION=<value>
# For MacOS
export AZCOPY_LOG_LOCATION=<value>
# To check the current value of the variable on all the platforms
.\azcopy env
# If the value is blank then the default value is currently in use
```

### Change the default log level

By default AzCopy log level is set to INFO. If you would like to reduce the log verbosity to save disk space, overwrite the setting using ``--log-level`` option. Available log levels are: DEBUG, INFO, WARNING, ERROR, PANIC, and FATAL

## Troubleshooting

AzCopy v10 creates log files and plan files for all the jobs. You can use the logs to investigate and troubleshoot any potential problems. The logs will contain the status of failure (UPLOADFAILED, COPYFAILED, and DOWNLOADFAILED), the full path, and the reason of the failure. The job logs and plan files are located in the %USERPROFILE%\\.azcopy folder on Windows or $HOME\\.azcopy folder on Mac and Linux.

> [!IMPORTANT]
> When submitting a support request to Microsoft Support (or troubleshooting the issue involving any 3rd party) please share the redacted version of the command you’re trying to execute to ensure the SAS is not accidentally shared with anybody. You can find the redacted version at the start of the log file.

### Review the logs for errors

The following command will get all errors with UPLOADFAILED status from the 04dc9ca9-158f-7945-5933-564021086c79 log:

```azcopy
cat 04dc9ca9-158f-7945-5933-564021086c79.log | grep -i UPLOADFAILED
```

Alternatively you can see the file names that failed to transfer using `azcopy jobs show <jobid> --with-status=Failed` command.

### View and resume jobs

Each transfer operation will create an AzCopy job. You can view the history of jobs using the following command:

```azcopy
.\azcopy jobs list
```

To view the job statistics, use the following command:

```azcopy
.\azcopy jobs show <job-id>
```

To filter the transfers by status, use the following command:

```azcopy
.\azcopy jobs show <job-id> --with-status=Failed
```

You can resume a failed/cancelled job using its identifier along with the SAS token (it is not persistent for security reasons):

```azcopy
.\azcopy jobs resume <jobid> --sourcesastokenhere --destinationsastokenhere
```

## Next steps

Your feedback is always welcomed. If you have any questions, issues or general feedback submit them at https://github.com/Azure/azure-storage-azcopy. Thank you!
