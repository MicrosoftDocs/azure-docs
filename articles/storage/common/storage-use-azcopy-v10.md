---
title: Copy or move data to Azure Storage with AzCopy v10 (Preview) | Microsoft Docs
description: Use the AzCopy v10 (Preview) utility to move or copy data to or from blob, table, and file content. Copy data to Azure Storage from local files, or copy data within or between storage accounts. Easily migrate your data to Azure Storage.
services: storage
author: artemuwka
ms.service: storage
ms.topic: article
ms.date: 10/09/2018
ms.author: artemuwka
ms.component: common
---
# Transfer data with the AzCopy v10 (Preview)

AzCopy v10 (Preview) is the next-generation command-line utility for copying data to/from Microsoft Azure Blob and File storage, which offers a redesigned command-line interface and new architecture for high-performance reliable data transfers. Using AzCopy you can copy data between a file system and a storage account, or between storage accounts.

## What's new in AzCopy v10

- Synchronize a file system to Azure Blob or vice versa. Use `azcopy sync <source> <destination>`. Ideal for incremental copy scenarios.
- Supports Azure Data Lake Storage Gen2 APIs. Use `myaccount.dfs.core.windows.net` as a URI to call the ADLS Gen2 APIs.
- Supports copying an entire account (Blob service only) to another account.
- Account to account copy is now using the new [Put from URL](https://docs.microsoft.com/rest/api/storageservices/put-block-from-url) APIs. No data transfer to the client is needed which makes the transfer faster!
- List/Remove files and blobs in a given path.
- Supports wildcard patterns in a path as well as --include and --exclude flags.
- Improved resiliency: every AzCopy instance will create a job order and a related log file. You can view and restart previous jobs and resume failed jobs. AzCopy will also automatically retry a transfer after a failure.
- General performance improvements.

## Download and install AzCopy

### Latest preview version (v10)

Download the latest preview version of AzCopy:
- [Windows](https://aka.ms/downloadazcopy-v10-windows)
- [Linux](https://aka.ms/downloadazcopy-v10-linux)
- [MacOS](https://aka.ms/downloadazcopy-v10-mac)

### Latest production version (v8.1)

Download the [latest production version of AzCopy for Windows](https://aka.ms/downloadazcopy).

### AzCopy supporting Table storage service (v7.3)

Download the [AzCopy v7.3 supporting copying data to/from Microsoft Azure Table storage service](https://aka.ms/downloadazcopynet).

## Post-installation Steps

AzCopy v10 does not require an installation. Open a preferred command-line application and navigate to the folder where the `azcopy.exe` executable is located. If desired, you can add the AzCopy folder location to your system path.

## Authentication Options

AzCopy v10 allows you to use the following options when authenticating with Azure Storage:
- Azure Active Directory. Use ```.\azcopy login``` to sign in using Azure Active Directory.  The user should have ["Storage Blob Data Contributor" role assigned](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac) to write to Blob storage using Azure Active Directory authentication.
- SAS token that needs to be appended to the Blob path. You can generate SAS token using Azure Portal, [Storage Explorer](https://blogs.msdn.microsoft.com/jpsanders/2017/10/12/easily-create-a-sas-to-download-a-file-from-azure-storage-using-azure-storage-explorer/), [PowerShell](https://docs.microsoft.com/powershell/module/azure.storage/new-azurestorageblobsastoken?view=azurermps-6.9.0), or other tools of your choice. For more information, see [examples](https://docs.microsoft.com/azure/storage/blobs/storage-dotnet-shared-access-signature-part-2).

## Getting started

AzCopy v10 has a simple self-documented syntax. The general syntax looks as follows:

```azcopy
.\azcopy <command> <arguments> --<flag-name>=<flag-value>
# Example:
.\azcopy copy <source path> <destination path> --<flag-name>=<flag-value>
.\azcopy cp "C:\local\path" "https://account.blob.core.windows.net/containersastoken" --recursive=true
```

Here's how you can get a list of available commands:

```azcopy
.\azcopy -help
# Using the alias instead
.\azcopy -h
```

To see the help page and examples for a specific command run the command below:

```azcopy
.\azcopy <cmd> -help
# Example:
.\azcopy cp -h
```

## Copy data to Azure Storage

Use the copy command to transfer data from the source to the destination. The source/destination can be a:
- Local file system
- Azure Blob/Virtual Directory/Container URI
- Azure File/Directory/File Share URI
- Azure Data Lake Storage Gen2 Filesystem/Directory/File URI

> [!NOTE]
> At this time AzCopy v10 supports copying only block blobs between two storage accounts.

```azcopy
.\azcopy copy <source path> <destination path> --<flag-name>=<flag-value>
# Using alias instead
.\azcopy cp <source path> <destination path> --<flag-name>=<flag-value>
```

The following command uploads all files under the folder C:\local\path recursively to the container "mycontainer1":

```azcopy
.\azcopy cp "C:\local\path" "https://account.blob.core.windows.net/mycontainer1<sastoken>" --recursive=true
```

The following command uploads all files under the folder C:\local\path (without recursing into the subdirectories) to the container "mycontainer1":

```azcopy
.\azcopy cp "C:\local\path\*" "https://account.blob.core.windows.net/mycontainer1<sastoken>"
```

To get more examples, use the following command:

```azcopy
.\azcopy cp -h
```

## Copy data between two storage accounts

Copying data between two storage accounts uses the [Put Block From URL](https://docs.microsoft.com/rest/api/storageservices/put-block-from-url) API and does not utilize the client machine's network bandwidth. Data is copied between two Azure Storage servers directly while AzCopy simply orchestrates the copy operation. 

To copy the data between two storage accounts, use the following command:
```azcopy
.\azcopy cp "https://myaccount.blob.core.windows.net/<sastoken>" "https://myotheraccount.blob.core.windows.net/<sastoken>" --recursive=true
```

> [!NOTE]
> The command will enumerate all blob containers and copy them to the destination account. At this time AzCopy v10 supports copying only block blobs between two storage accounts. All other storage account objects (append blobs, page blobs, files, tables and queues) will be skipped.

## Copy a VHD image to a storage account

AzCopy v10 by default uploads data into block blobs. However, if a source file has vhd extension, AzCopy v10 will by default upload it to a page blob. This behavior isn't configurable.

## Sync: incremental copy and delete

> [!NOTE]
> Sync command synchronizes contents from source to destination and this includes DELETION of destination files if those do not exist in the source. Make sure you use the destination you intend to synchronize.

To sync your local file system to a storage account, use the following command:

```azcopy
.\azcopy sync "C:\local\path" "https://account.blob.core.windows.net/mycontainer1<sastoken>" --recursive=true
```

In the same way you can sync a Blob container down to a local file system:

```azcopy
# If you're using Azure Active Directory authentication the sastoken is not required
.\azcopy sync "https://account.blob.core.windows.net/mycontainer1" "C:\local\path" --recursive=true
```

The command allows you to incrementally sync the source to the destination based on last modified timestamps. If you add or delete a file in the source, AzCopy v10 will do the same in the destination.

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
```

## Troubleshooting

AzCopy v10 creates log files and plan files for all the jobs. You can use the logs to investigate and troubleshoot any potential problems. The logs will contain the status of failure (UPLOADFAILED, COPYFAILED, and DOWNLOADFAILED), the full path, and the reason of the failure. The job logs and plan files are located in the %USERPROFILE\\.azcopy folder.

### Review the logs for errors

The following command will get all errors with UPLOADFAILED status from the 04dc9ca9-158f-7945-5933-564021086c79 log:

```azcopy
cat 04dc9ca9-158f-7945-5933-564021086c79.log | grep -i UPLOADFAILED
```

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