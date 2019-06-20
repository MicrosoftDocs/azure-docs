---
title: Copy or move data to Azure Storage by using AzCopy v10 | Microsoft Docs
description: AzCopy is a command-line utility that you can use to copy data to, from, or between storage accounts. This article helps you download AzCopy, connect to your storage account, and then transfer files.
services: storage
author: normesta
ms.service: storage
ms.topic: article
ms.date: 05/14/2019
ms.author: normesta
ms.subservice: common
---

# Get started with AzCopy

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article helps you download AzCopy, connect to your storage account, and then transfer files.

> [!NOTE]
> AzCopy **V10** is the currently supported version of AzCopy.
>
> If you need to use AzCopy **v8.1**, see the [Use the previous version of AzCopy](#previous-version) section of this article.

<a id="download-and-install-azcopy" />

## Download AzCopy

First, download the AzCopy V10 executable file to any directory on your computer. 

- [Windows](https://aka.ms/downloadazcopy-v10-windows) (zip)
- [Linux](https://aka.ms/downloadazcopy-v10-linux) (tar)
- [MacOS](https://aka.ms/downloadazcopy-v10-mac) (zip)

> [!NOTE]
> If you want to copy data to and from your [Azure Table storage](https://docs.microsoft.com/azure/storage/tables/table-storage-overview) service, then install [AzCopy version 7.3](https://aka.ms/downloadazcopynet).

## Run AzCopy

For convenience, consider adding the directory location of the AzCopy executable to your system path for ease of use. That way you can type `azcopy` from any directory on your system.

If you choose not to add the AzCopy directory to your path, you'll have to change directories to the location of your AzCopy executable and type `azcopy` or `.\azcopy` in Windows PowerShell command prompts.

To see a list of commands, type `azcopy -h` and then press the ENTER key.

To learn about a specific command, just include the name of the command (For example: `azcopy list -h`).

![Inline help](media/storage-use-azcopy-v10/azcopy-inline-help.png)

> [!NOTE] 
> As an owner of your Azure Storage account, you aren't automatically assigned permissions to access data. Before you can do anything meaningful with AzCopy, you need to decide how you'll provide authorization credentials to the storage service. 

## Choose how you'll provide authorization credentials

You can provide authorization credentials by using Azure Active Directory (AD), or by using a Shared Access Signature (SAS) token.

Use this table as a guide:

| Storage type | Currently supported method of authorization |
|--|--|
|**Blob storage** | Azure AD & SAS |
|**Blob storage (hierarchial namespace)** | Azure AD only |
|**File storage** | SAS only |

### Option 1: Use Azure AD

The level of authorization that you need is based on whether you plan to upload files or just download them.

If you just want to download files, then verify that the [Storage Blob Data Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-reader) has been assigned to your identity.

If you want to upload files, then verify that one of these roles has been assigned to your identity:

- [Storage Blob Data Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-queue-data-contributor)
- [Storage Blob Data Owner](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner)

These roles can be assigned to your identity in any of these scopes:

- Container (file system)
- Storage account
- Resource group
- Subscription

To learn how to verify and assign roles, see [Grant access to Azure blob and queue data with RBAC in the Azure portal](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac-portal?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

You don't need to have one of these roles assigned to your identity if your identity is added to the access control list (ACL) of the target container or directory. In the ACL, your identity needs write permission on the target directory, and execute permission on container and each parent directory.

To learn more, see [Access control in Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control).

#### Authenticate your identity

After you've verified that your identity has been given the necessary authorization level, open a command prompt, type the following command, and then press the ENTER key.

```azcopy
azcopy login
```

If you belong to more than one organization, include the tenant ID of the organization to which the storage account belongs.

```azcopy
azcopy login --tenant-id=<tenant-id>
```

Replace the `<tenant-id>` placeholder with the tenant ID of the organization to which the storage account belongs. To find the tenant ID, select **Azure Active Directory > Properties > Directory ID** in the Azure portal.

This command returns an authentication code and the URL of a website. Open the website, provide the code, and then choose the **Next** button.

![Create a container](media/storage-use-azcopy-v10/azcopy-login.png)

A sign-in window will appear. In that window, sign into your Azure account by using your Azure account credentials. After you've successfully signed in, you can close the browser window and begin using AzCopy.

### Option 2: Use a SAS token

You can append a SAS token to each source or destination URL that use in your AzCopy commands.

This example command recursively copies data from a local directory to a blob container. A fictitious SAS token is appended to the end of the of the container URL.

```azcopy
azcopy cp "C:\local\path" "https://account.blob.core.windows.net/mycontainer1/?sv=2018-03-28&ss=bjqt&srt=sco&sp=rwddgcup&se=2019-05-01T05:01:17Z&st=2019-04-30T21:01:17Z&spr=https&sig=MGCXiyEzbtttkr3ewJIh2AR8KrghSy1DGM9ovN734bQF4%3D" --recursive=true
```

To learn more about SAS tokens and how to obtain one, see [Using shared access signatures (SAS)](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1).

## Transfer files

After you've authenticated your identity or obtained a SAS token, you can begin transferring files.

To find example commands, see any of these articles.

- [Transfer data with AzCopy and blob storage](storage-use-azcopy-blobs.md)

- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

- [Transfer data with AzCopy and Amazon S3 buckets](storage-use-azcopy-s3.md)

## Use AzCopy in a script

Over time, the AzCopy [download link](#download-and-install-azcopy) will point to new versions of AzCopy. If your script downloads AzCopy, the script might stop working if a newer version of AzCopy modifies features that your script depends upon. 

To avoid these issues, obtain a static (un-changing) link to the current version of AzCopy. That way, your script downloads the same exact version of AzCopy each time that it runs.

To obtain the link, run this command:

| Operating system  | Command |
|--------|-----------|
| **Linux** | `curl -v https://aka.ms/downloadazcopy-v10-linux` |
| **Windows** | `(curl https://aka.ms/downloadazcopy-v10-windows -MaximumRedirection 0 -ErrorAction silentlycontinue).RawContent` |

> [!NOTE]
> For Linux, `--strip-components=1` on the `tar` command removes the top-level folder that contains the version name, and instead extracts the binary directly into the current folder. This allows the script to be updated with a new version of `azcopy` by only updating the `wget` URL.

The URL appears in the output of this command. Your script can then download AzCopy by using that URL.

| Operating system  | Command |
|--------|-----------|
| **Linux** | `wget -O azcopyv10.tar https://azcopyvnext.azureedge.net/release20190301/azcopy_linux_amd64_10.0.8.tar.gz tar -xf azcopyv10.tar --strip-components=1 ./azcopy` |
| **Windows** | `Invoke-WebRequest https://azcopyvnext.azureedge.net/release20190517/azcopy_windows_amd64_10.1.2.zip -OutFile azcopyv10.zip <<Unzip here>>` |

## Use AzCopy in Storage Explorer

If you want to leverage the performance advantages of AzCopy, but you prefer to use Storage Explorer rather than the command line to interact with your files, then enable AzCopy in Storage Explorer. 

In Storage Explorer, choose **Preview**->**Use AzCopy for Improved Blob Upload and Download**.

![Enable AzCopy as a transfer engine in Azure Storage Explorer](media/storage-use-azcopy-v10/enable-azcopy-storage-explorer.jpg)

> [!NOTE]
> You don't have to enable this setting if you've enabled a hierarchical namespace on your storage account. That's because Storage Explorer automatically uses AzCopy on storage accounts that have a hierarchical namespace.  

Storage Explorer uses your account key to perform operations, so after you sign into Storage Explorer, you won't need to provide additional authorization credentials.

<a id="previous-version" />

## Use the previous version of AzCopy

If you need to use the previous version of AzCopy (AzCopy v8.1), see either of the following links:

- [AzCopy on Windows (v8)](https://docs.microsoft.com/previous-versions/azure/storage/storage-use-azcopy)

- [AzCopy on Linux (v8)](https://docs.microsoft.com/previous-versions/azure/storage/storage-use-azcopy-linux)

## Configure, optimize, and troubleshoot AzCopy

See [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)

## Next steps

If you have questions, issues, or general feedback, submit them [on GitHub](https://github.com/Azure/azure-storage-azcopy) page.
