---
title: Copy or move data to Azure Storage by using AzCopy v10 (Preview) | Microsoft Docs
description: Use the AzCopy v10 (Preview) command-line utility to move or copy data to or from blob, data lake, and file content. Copy data to Azure Storage from local files, or copy data within or between storage accounts. Easily migrate your data to Azure Storage.
services: storage
author: seguler
ms.service: storage
ms.topic: article
ms.date: 04/05/2019
ms.author: seguler
ms.subservice: common
---
# Transfer data with AzCopy v10 (Preview)

AzCopy v10 (Preview) is the command-line utility for copying data to or from Microsoft Azure Blob and File storage. AzCopy v10 offers a redesigned command-line interface, and new architecture for reliable data transfers. By using AzCopy, you can copy data between a file system and a storage account, or between storage accounts.

## What's new in AzCopy v10

- Synchronizes file systems to Azure Blob storage or vice versa. Use `azcopy sync <source> <destination>`. Ideal for incremental copy scenarios.
- Supports Azure Data Lake Storage Gen2 APIs. Use `myaccount.dfs.core.windows.net` as a URI to call the Data Lake Storage Gen2 APIs.
- Supports copying an entire account (Blob service only) to another account.
- Supports copying data from an Amazon Web Services S3 bucket.
- Uses the new [Put Block from URL](https://docs.microsoft.com/rest/api/storageservices/put-block-from-url) APIs to support account-to-account copy. The data transfer is faster, since transfer to the client isn't required.
- Lists or removes files and blobs in a given path.
- Supports wildcard patterns in a path, and --exclude flags.
- Creates a job order and a related log file with every AzCopy instance. You can view and restart previous jobs, and resume failed jobs. AzCopy will also automatically retry a transfer after a failure.
- Features general performance improvements.

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

## Post-installation steps

AzCopy v10 doesn't require an installation. Open your preferred command-line application and browse to the folder where `azcopy.exe` is located. If needed, you can add the AzCopy folder location to your system path for ease of use.

## Authentication options

AzCopy v10 supports the following options when authenticating with Azure Storage:
- **Azure Active Directory** (Supported for **Blob and Data Lake Storage Gen2 services**). Use ```.\azcopy login``` to sign in with Azure Active Directory.  The user should have ["Storage Blob Data Contributor" role assigned](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac) to write to Blob storage with Azure Active Directory authentication. For authentication via managed identities for Azure resources, use `azcopy login --identity`.
- **Shared access signature tokens [Supported for Blob and File services]**. Append the shared access signature (SAS) token to the blob path on the command line to use it. You can generate SAS tokens with the Azure portal, [Storage Explorer](https://blogs.msdn.microsoft.com/jpsanders/2017/10/12/easily-create-a-sas-to-download-a-file-from-azure-storage-using-azure-storage-explorer/), [PowerShell](https://docs.microsoft.com/powershell/module/az.storage/new-azstorageblobsastoken), or other tools of your choice. For more information, see [examples](https://docs.microsoft.com/azure/storage/blobs/storage-dotnet-shared-access-signature-part-2).

## Getting started

> [!TIP]
> **Prefer a graphical user interface?**
>
> [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/), a desktop client that simplifies managing Azure Storage data, now uses AzCopy to accelerate data transfer to and out of Azure Storage.
>
> Enable AzCopy in Storage Explorer under the **Preview** menu.
> ![Enable AzCopy as a transfer engine in Azure Storage Explorer](media/storage-use-azcopy-v10/enable-azcopy-storage-explorer.jpg)

AzCopy v10 has a self-documented syntax. When you have logged in to Azure Active Directory, the general syntax looks like the following:

```azcopy
.\azcopy <command> <arguments> --<flag-name>=<flag-value>

# Examples if you have logged into the Azure Active Directory:
.\azcopy copy <source path> <destination path> --<flag-name>=<flag-value>
.\azcopy cp "C:\local\path" "https://account.blob.core.windows.net/container" --recursive=true
.\azcopy cp "C:\local\path\myfile" "https://account.blob.core.windows.net/container/myfile"
.\azcopy cp "C:\local\path\*" "https://account.blob.core.windows.net/container"

# Examples if you're using SAS tokens to authenticate:
.\azcopy cp "C:\local\path" "https://account.blob.core.windows.net/container?st=2019-04-05T04%3A10%3A00Z&se=2019-04-13T04%3A10%3A00Z&sp=rwdl&sv=2018-03-28&sr=c&sig=Qdihej%2Bsbg4AiuyLVyQZklm9pSuVGzX27qJ508wi6Es%3D" --recursive=true
.\azcopy cp "C:\local\path\myfile" "https://account.blob.core.windows.net/container/myfile?st=2019-04-05T04%3A10%3A00Z&se=2019-04-13T04%3A10%3A00Z&sp=rwdl&sv=2018-03-28&sr=c&sig=Qdihej%2Bsbg4AiuyLVyQZklm9pSuVGzX27qJ508wi6Es%3D"
```

Here's how you can get a list of available commands:

```azcopy
.\azcopy --help
# To use the alias instead
.\azcopy -h
```

To see the help page and examples for a specific command, run the following command:

```azcopy
.\azcopy <cmd> --help
# Example:
.\azcopy cp -h
```

## Create a blob container or file share 

**Create a blob container**

```azcopy
.\azcopy make "https://account.blob.core.windows.net/container-name"
```

**Create a file share**

```azcopy
.\azcopy make "https://account.file.core.windows.net/share-name"
```

**Create a blob container by using Azure Data Lake Storage Gen2**

If you've enabled hierarchical namespaces on your Blob storage account, you can use the following command to create a new blob container for uploading files.

```azcopy
.\azcopy make "https://account.dfs.core.windows.net/top-level-resource-name"
```

## Copy data to Azure Storage

Use the copy command to transfer data from the source to the destination. The source or destination can be a:
- Local file system
- Azure Blob/Virtual Directory/Container URI
- Azure File/Directory/File Share URI
- Azure Data Lake Storage Gen2 Filesystem/Directory/File URI

```azcopy
.\azcopy copy <source path> <destination path> --<flag-name>=<flag-value>
# Using the alias instead 
.\azcopy cp <source path> <destination path> --<flag-name>=<flag-value>
```

The following command uploads all files under the folder `C:\local\path` recursively to the container `mycontainer1`, creating `path` directory in the container. When `--put-md5` flag is provided, AzCopy calculates and stores each file's md5 hash in `Content-md5` property of the corresponding blob for later use.

```azcopy
.\azcopy cp "C:\local\path" "https://account.blob.core.windows.net/mycontainer1<sastoken>" --recursive=true --put-md5
```

The following command uploads all files under the folder `C:\local\path` (without recursing into the subdirectories) to the container `mycontainer1`:

```azcopy
.\azcopy cp "C:\local\path\*" "https://account.blob.core.windows.net/mycontainer1<sastoken>" --put-md5
```

To find more examples, use the following command:

```azcopy
.\azcopy cp -h
```

## Copy Blob data between two storage accounts

Copying data between two storage accounts uses the [Put Block From URL](https://docs.microsoft.com/rest/api/storageservices/put-block-from-url) API, and doesn't use the client machine's network bandwidth. Data is copied between two Azure Storage servers directly, while AzCopy simply orchestrates the copy operation. This option is currently only available for Blob storage.

To copy the all of the Blob data between two storage accounts, use the following command:
```azcopy
.\azcopy cp "https://myaccount.blob.core.windows.net/<sastoken>" "https://myotheraccount.blob.core.windows.net/<sastoken>" --recursive=true
```

To copy a Blob container to another Blob container, use the following command:
```azcopy
.\azcopy cp "https://myaccount.blob.core.windows.net/mycontainer/<sastoken>" "https://myotheraccount.blob.core.windows.net/mycontainer/<sastoken>" --recursive=true
```

## Copy a VHD image to a storage account

AzCopy by default uploads data into block blobs. To upload files as Append Blobs, or Page Blobs use the flag `--blob-type=[BlockBlob|PageBlob|AppendBlob]`.

```azcopy
.\azcopy cp "C:\local\path\mydisk.vhd" "https://myotheraccount.blob.core.windows.net/mycontainer/mydisk.vhd<sastoken>" --blob-type=PageBlob
```

## Sync: incremental copy and delete (Blob storage only)

The sync command synchronizes contents of a source directory to a directory in the destination, comparing file names and last modified timestamps. This operation includes the optional deletion of destination files if those do not exist in the source when the `--delete-destination=prompt|true` flag is provided. By default, the delete behavior is disabled. 

> [!NOTE] 
> Use the `--delete-destination` flag with caution. Enable the [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) feature before you enable delete behavior in sync to prevent accidental deletions in your account. 
>
> When `--delete-destination` is set to true, AzCopy will delete files that do not exist in the source from destination without any prompt to the user. If you want to be prompted for confirmation, use `--delete-destination=prompt`.

To sync your local file system to a storage account, use the following command:

```azcopy
.\azcopy sync "C:\local\path" "https://account.blob.core.windows.net/mycontainer1<sastoken>" --recursive=true
```

You can also sync a blob container down to a local file system:

```azcopy
# The SAS token isn't required for Azure Active Directory authentication.
.\azcopy sync "https://account.blob.core.windows.net/mycontainer1" "C:\local\path" --recursive=true
```

This command incrementally syncs the source to the destination based on the last modified timestamps. If you add or delete a file in the source, AzCopy v10 will do the same in the destination. Before deletion, AzCopy will prompt you to confirm.

## Copy data from Amazon Web Services (AWS) S3

To authenticate with an AWS S3 bucket, set the following environment variables:

```
# For Windows:
set AWS_ACCESS_KEY_ID=<your AWS access key>
set AWS_SECRET_ACCESS_KEY=<AWS secret access key>
# For Linux:
export AWS_ACCESS_KEY_ID=<your AWS access key>
export AWS_SECRET_ACCESS_KEY=<AWS secret access key>
# For MacOS
export AWS_ACCESS_KEY_ID=<your AWS access key>
export AWS_SECRET_ACCESS_KEY=<AWS secret access key>
```

To copy the bucket to a Blob container, issue the following command:

```
.\azcopy cp "https://s3.amazonaws.com/mybucket" "https://myaccount.blob.core.windows.net/mycontainer?<sastoken>" --recursive
```

For more details on copying data from AWS S3 using AzCopy, see the page [here](https://github.com/Azure/azure-storage-azcopy/wiki/Copy-from-AWS-S3).

## Advanced configuration

### Configure proxy settings

To configure the proxy settings for AzCopy v10, set the environment variable https_proxy by using the following command:

```cmd
# For Windows:
set https_proxy=<proxy IP>:<proxy port>
# For Linux:
export https_proxy=<proxy IP>:<proxy port>
# For MacOS
export https_proxy=<proxy IP>:<proxy port>
```

### Optimize throughput

Set the environment variable AZCOPY_CONCURRENCY_VALUE to configure the number of concurrent requests, and to control the throughput performance and resource consumption. The value is set to 300 by default. Reducing the value will limit the bandwidth and CPU used by AzCopy v10.

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
# If the value is blank, then the default value is currently in use
```
### Change the default log level 

By default, AzCopy log level is set to INFO. If you would like to reduce the log verbosity to save disk space, overwrite the setting using ``--log-level`` option. Available log levels are: DEBUG, INFO, WARNING, ERROR, PANIC, and FATAL.

### Review the logs for errors

The following command will get all errors with UPLOADFAILED status from the 04dc9ca9-158f-7945-5933-564021086c79 log:

```azcopy
cat 04dc9ca9-158f-7945-5933-564021086c79.log | grep -i UPLOADFAILED
```
## Troubleshooting

AzCopy v10 creates log files and plan files for every job. You can use the logs to investigate and troubleshoot any potential problems. The logs will contain the status of failure (UPLOADFAILED, COPYFAILED, and DOWNLOADFAILED), the full path, and the reason of the failure. The job logs and plan files are located in the %USERPROFILE\\.azcopy folder on Windows or $HOME\\.azcopy folder on Mac and Linux.

> [!IMPORTANT]
> When submitting a request to Microsoft Support (or troubleshooting the issue involving any third party), share the redacted version of the command you want to execute. This ensures the SAS isn't accidentally shared with anybody. You can find the redacted version at the start of the log file.

### View and resume jobs

Each transfer operation will create an AzCopy job. Use the following command to view the history of jobs:

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

Use the following command to resume a failed/canceled job. This command uses its identifier along with the SAS token as it isn't persistent for security reasons:

```azcopy
.\azcopy jobs resume <jobid> --source-sas="<sastokenhere>"
.\azcopy jobs resume <jobid> --destination-sas="<sastokenhere>"
```

## Next steps

If you have questions, issues, or general feedback, submit them [on GitHub](https://github.com/Azure/azure-storage-azcopy).


