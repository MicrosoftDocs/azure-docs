---
title: Introduction to Azure File Storage | Microsoft Docs
description: An overview of Azure File Storage, Microsoft's cloud file system. Learn how to mount Azure File shares over SMB and lift classic on-premises workloads to the cloud without rewriting any code.
services: storage
documentationcenter: ''
author: RenaShahMSFT
manager: aungoo
editor: tysonn

ms.assetid: a4a1bc58-ea14-4bf5-b040-f85114edc1f1
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/21/2017
ms.author: renash
---

Use PowerShell to Manage a file share

Alternatively, you can use Azure PowerShell to create and manage file shares.

Install the PowerShell cmdlets for Azure Storage

To prepare to use PowerShell, download and install the Azure PowerShell cmdlets.
See [How to install and configure Azure
PowerShell](https://azure.microsoft.com/en-us/documentation/articles/powershell-install-configure/) for
the install point and installation instructions.

**Note:**

It's recommended that you download and install or upgrade to the latest Azure
PowerShell module.

Open an Azure PowerShell window by clicking **Start** and typing **Windows
PowerShell**. The PowerShell window loads the Azure Powershell module for you.

Create a context for your storage account and key

Now, create the storage account context. The context encapsulates the storage
account name and account key. For instructions on copying your account key from
the [Azure Portal](https://portal.azure.com/), see [View and copy storage access
keys](https://azure.microsoft.com/en-us/documentation/articles/storage-create-storage-account/#view-and-copy-storage-access-keys).

Replace storage-account-name and storage-account-key with your storage account
name and key in the following example.

Copy

\# create a context for account and key

\$ctx=New-AzureStorageContext storage-account-name storage-account-key

Create a new file share

Next, create the new share, named logs.

Copy

\# create a new share

\$s = New-AzureStorageShare logs -Context \$ctx

You now have a file share in File storage. Next we'll add a directory and a
file.

**Important:**

The name of your file share must be all lowercase. For complete details about
naming file shares and files, see [Naming and Referencing Shares, Directories,
Files, and Metadata](https://msdn.microsoft.com/library/azure/dn167011.aspx).

Create a directory in the file share

Next, create a directory in the share. In the following example, the directory
is named CustomLogs.

Copy

\# create a directory in the share

New-AzureStorageDirectory -Share \$s -Path CustomLogs

Upload a local file to the directory

Now upload a local file to the directory. The following example uploads a file
from C:\\temp\\Log1.txt. Edit the file path so that it points to a valid file on
your local machine.

Copy

\# upload a local file to the new directory

Set-AzureStorageFileContent -Share \$s -Source C:\\temp\\Log1.txt -Path
CustomLogs

List the files in the directory

To see the file in the directory, you can list all of the directory's files.
This command returns the files and subdirectories (if there are any) in the
CustomLogs directory.

Copy

\# list files in the new directory

Get-AzureStorageFile -Share \$s -Path CustomLogs \| Get-AzureStorageFile

Get-AzureStorageFile returns a list of files and directories for whatever
directory object is passed in. "Get-AzureStorageFile -Share \$s" returns a list
of files and directories in the root directory. To get a list of files in a
subdirectory, you have to pass the subdirectory to Get-AzureStorageFile. That's
what this does -- the first part of the command up to the pipe returns a
directory instance of the subdirectory CustomLogs. Then that is passed into
Get-AzureStorageFile, which returns the files and directories in CustomLogs.
