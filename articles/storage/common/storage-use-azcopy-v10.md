---
title: Copy or move data to Azure Storage by using AzCopy v10 | Microsoft Docs
description: AzCopy is a command-line utility that you can use to copy data to, from, or between storage accounts. This article helps you download AzCopy, connect to your storage account, and then transfer files.
services: storage
author: normesta
ms.service: storage
ms.topic: article
ms.date: 04/23/2019
ms.author: normesta
ms.subservice: common
---

# Get started with AzCopy

AzCopy is a command-line utility that you can use to copy data to, from, or between storage accounts. This article helps you download AzCopy, connect to your storage account, and then transfer files.

## Download AzCopy

First, download the AzCopy V10 executable file. There's nothing to install.

- [Windows](https://aka.ms/downloadazcopy-v10-windows) (zip)
- [Linux](https://aka.ms/downloadazcopy-v10-linux) (tar)
- [MacOS](https://aka.ms/downloadazcopy-v10-mac) (zip)

> [!NOTE]
> If you want to copy data to and from your [Azure Table storage](https://docs.microsoft.com/azure/storage/tables/table-storage-overview) service, then install [AzCopy version 7.3](https://aka.ms/downloadazcopynet).

## Run AzCopy

From a command prompt, navigate to the directory where you downloaded the file.

To view a list of AzCopy commands, type `azCopy`, and then press the ENTER key.

To learn more about a specific command, type `azCopy` followed by the name of the command.

For example, to learn about the `copy` command, type `azcopy copy`, and then press the ENTER key.

Before you can do anything meaningful with AzCopy, you need to authenticate your identity with the storage service.

## Authenticate your identity

You can authenticate your identity by using your Azure account credentials, or by using a Shared Access Signature (SAS) token.

### Option 1: Use your Azure account credentials

First, ensure that one of these roles has been assigned to your identity:

- [Storage Blob Data Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-queue-data-contributor)
- [Storage Blob Data Owner](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner)

These roles can be assigned to your identity in any of these scopes:

- Storage account
- Resource group
- Subscription

After you've verified that your identity has one of these role assignments, open a command prompt. Then, type the following command, and press the ENTER key.

```azcopy
azcopy login
```

This command returns an authentication code and the URL of a website. Open the website, provide the code, and then choose the **Next** button.

![Create a container](media/storage-use-azcopy-v10/azcopy-login.png)

A sign-in window will appear. In that window, sign into your Azure account by using your Azure account credentials. After you've successfully signed in, you can close the browser window and begin using AzCopy.

### Option 2: Use a SAS token

An alternative way to authenticate yourself is to obtain a SAS token, and then append that token to each AzCopy command that you execute.

This example command recursively copies data from a local directory to a blob container. A fictitious SAS token is appended to the end of the of the container path. 

```azcopy
azcopy cp "C:\local\path" "https://account.blob.core.windows.net/mycontainer1/?sv=2018-03-28&ss=bjqt&srt=sco&sp=rwddgcup&se=2019-05-01T05:01:17Z&st=2019-04-30T21:01:17Z&spr=https&sig=MGCXiyEzbtttkr3ewJIh2AR8KrghSy1DGM9ovN734bQF4%3D" --recursive=true
```

To learn more about SAS tokens and how to obtain one, see [Using shared access signatures (SAS)](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1).

## Transfer files

After you've authenticated your identity or obtained a SAS token, you can begin transferring files.

To find example commands, see any of these articles.

- [Transfer data with AzCopy and blob storage](storage-use-azcopy-blobs.md)

- [Transfer data with AzCopy and Azure Data Lake Storage Gen2](storage-use-azcopy-data-lake-gen2.md)

- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

- [Transfer data with AzCopy and Amazon S3 buckets](storage-use-azcopy-s3.md)

## Configure, optimize, and troubleshoot AzCopy

See [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)

## Use AzCopy in Storage Explorer

If you want to leverage the performance advantages of AzCopy, but you prefer to use Storage Explorer rather than the command line to interact with your files, then enable AzCopy in Storage Explorer.

In Storage Explorer, choose **Preview**->**Use AzCopy for Improved Blob Upload and Download**.

![Enable AzCopy as a transfer engine in Azure Storage Explorer](media/storage-use-azcopy-v10/enable-azcopy-storage-explorer.jpg)

> [!NOTE]
> You don't have to enable this setting if you've enabled a hierarchical namespace on your storage account. That's because Storage Explorer automatically uses AzCopy on storage accounts that have a hierarchical namespace.  

## Use a previous version of AzCopy

AzCopy V10 is the currently supported version of AzCopy. However, if you need to use the previous version of AzCopy (AzCopy v8.1), see either of the following links:

- [AzCopy on Windows (v8)](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
- [AzCopy on Linux (v8)](../common/storage-use-azcopy-linux.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

## Next steps

If you have questions, issues, or general feedback, submit them [on GitHub](https://github.com/Azure/azure-storage-azcopy).
