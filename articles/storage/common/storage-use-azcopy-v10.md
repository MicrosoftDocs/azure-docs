---
title: Copy or move data to Azure Storage by using AzCopy v10 | Microsoft Docs
description: AzCopy is a command-line utility that you can use to copy data to, from, or between storage accounts. This article helps you download AzCopy, connect to your storage account, and then transfer files.
author: normesta
ms.service: storage
ms.topic: how-to
ms.date: 07/27/2020
ms.author: normesta
ms.subservice: common
---

# Get started with AzCopy

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article helps you download AzCopy, connect to your storage account, and then transfer files.

> [!NOTE]
> AzCopy **V10** is the currently supported version of AzCopy.
>
> If you need to use a previous version of AzCopy, see the [Use the previous version of AzCopy](#previous-version) section of this article.

<a id="download-and-install-azcopy"></a>

## Download AzCopy

First, download the AzCopy V10 executable file to any directory on your computer. AzCopy V10 is just an executable file, so there's nothing to install.

- [Windows 64-bit](https://aka.ms/downloadazcopy-v10-windows) (zip)
- [Windows 32-bit](https://aka.ms/downloadazcopy-v10-windows-32bit) (zip)
- [Linux x86-64](https://aka.ms/downloadazcopy-v10-linux) (tar)
- [macOS](https://aka.ms/downloadazcopy-v10-mac) (zip)

These files are compressed as a zip file (Windows and Mac) or a tar file (Linux). To download and decompress the tar file on Linux, see the documentation for your Linux distribution.

> [!NOTE]
> If you want to copy data to and from your [Azure Table storage](../tables/table-storage-overview.md) service, then install [AzCopy version 7.3](https://aka.ms/downloadazcopynet).


## Run AzCopy

For convenience, consider adding the directory location of the AzCopy executable to your system path for ease of use. That way you can type `azcopy` from any directory on your system.

If you choose not to add the AzCopy directory to your path, you'll have to change directories to the location of your AzCopy executable and type `azcopy` or `.\azcopy` in Windows PowerShell command prompts.

To see a list of commands, type `azcopy -h` and then press the ENTER key.

To learn about a specific command, just include the name of the command (For example: `azcopy list -h`).

> [!div class="mx-imgBorder"]
> ![Inline help](media/storage-use-azcopy-v10/azcopy-inline-help.png)


To find detailed reference documentation for each command and command parameter, see [azcopy](storage-ref-azcopy.md)

> [!NOTE] 
> As an owner of your Azure Storage account, you aren't automatically assigned permissions to access data. Before you can do anything meaningful with AzCopy, you need to decide how you'll provide authorization credentials to the storage service. 

## Authorize AzCopy

You can provide authorization credentials by using Azure Active Directory (AD), or by using a Shared Access Signature (SAS) token.

Use this table as a guide:

| Storage type | Currently supported method of authorization |
|--|--|
|**Blob storage** | Azure AD & SAS |
|**Blob storage (hierarchical   namespace)** | Azure AD & SAS |
|**File storage** | SAS only |

#### Option 1: Use Azure Active Directory

By using Azure Active Directory, you can provide credentials once instead of having to append a SAS token to each command.  

> [!NOTE]
> In the current release, if you plan to copy blobs between storage accounts, you'll have to append a SAS token to each source URL. You can omit the SAS token only from the destination URL. For examples, see [Copy blobs between storage accounts](storage-use-azcopy-blobs.md).

To authorize access by using Azure AD, see [Authorize access to blobs with AzCopy and Azure Active Directory (Azure AD)](storage-use-azcopy-authorize-azure-active-directory.md).

#### Option 2: Use a SAS token

You can append a SAS token to each source or destination URL that use in your AzCopy commands.

This example command recursively copies data from a local directory to a blob container. A fictitious SAS token is appended to the end of the of the container URL.

```azcopy
azcopy copy "C:\local\path" "https://account.blob.core.windows.net/mycontainer1/?sv=2018-03-28&ss=bjqt&srt=sco&sp=rwddgcup&se=2019-05-01T05:01:17Z&st=2019-04-30T21:01:17Z&spr=https&sig=MGCXiyEzbtttkr3ewJIh2AR8KrghSy1DGM9ovN734bQF4%3D" --recursive=true
```

To learn more about SAS tokens and how to obtain one, see [Using shared access signatures (SAS)](./storage-sas-overview.md).

## Transfer data

After you've authorized your identity or obtained a SAS token, you can begin transferring data.

To find example commands, see any of these articles.

- [Transfer data with AzCopy and blob storage](storage-use-azcopy-blobs.md)

- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

- [Transfer data with AzCopy and Amazon S3 buckets](storage-use-azcopy-s3.md)

- [Transfer data with AzCopy and Azure Stack storage](/azure-stack/user/azure-stack-storage-transfer#azcopy)

## Use in a script

#### Obtain a static download link

Over time, the AzCopy [download link](#download-and-install-azcopy) will point to new versions of AzCopy. If your script downloads AzCopy, the script might stop working if a newer version of AzCopy modifies features that your script depends upon.

To avoid these issues, obtain a static (un-changing) link to the current version of AzCopy. That way, your script downloads the same exact version of AzCopy each time that it runs.

To obtain the link, run this command:

| Operating system  | Command |
|--------|-----------|
| **Linux** | `curl -s -D- https://aka.ms/downloadazcopy-v10-linux | grep ^Location` |
| **Windows** | `(curl https://aka.ms/downloadazcopy-v10-windows -MaximumRedirection 0 -ErrorAction silentlycontinue).headers.location` |

> [!NOTE]
> For Linux, `--strip-components=1` on the `tar` command removes the top-level folder that contains the version name, and instead extracts the binary directly into the current folder. This allows the script to be updated with a new version of `azcopy` by only updating the `wget` URL.

The URL appears in the output of this command. Your script can then download AzCopy by using that URL.

| Operating system  | Command |
|--------|-----------|
| **Linux** | `wget -O azcopy_v10.tar.gz https://aka.ms/downloadazcopy-v10-linux && tar -xf azcopy_v10.tar.gz --strip-components=1` |
| **Windows** | `Invoke-WebRequest https://azcopyvnext.azureedge.net/release20190517/azcopy_windows_amd64_10.1.2.zip -OutFile azcopyv10.zip <<Unzip here>>` |

#### Escape special characters in SAS tokens

In batch files that have the `.cmd` extension, you'll have to escape the `%` characters that appear in SAS tokens. You can do that by adding an additional `%` character next to existing `%` characters in the SAS token string.

#### Run scripts by using Jenkins

If you plan to use [Jenkins](https://jenkins.io/) to run scripts, make sure to place the following command at the beginning of the script.

```
/usr/bin/keyctl new_session
```

## Use in Azure Storage Explorer

[Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) uses AzCopy to perform all of its data transfer operations. You can use [Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) if you want to leverage the performance advantages of AzCopy, but you prefer to use a graphical user interface rather than the command line to interact with your files.

Storage Explorer uses your account key to perform operations, so after you sign into Storage Explorer, you won't need to provide additional authorization credentials.

<a id="previous-version"></a>

## Configure, optimize, and fix

See [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)

## Use a previous version

If you need to use the previous version of AzCopy, see either of the following links:

- [AzCopy on Windows (v8)](/previous-versions/azure/storage/storage-use-azcopy)

- [AzCopy on Linux (v7)](/previous-versions/azure/storage/storage-use-azcopy-linux)

## Next steps

If you have questions, issues, or general feedback, submit them [on GitHub](https://github.com/Azure/azure-storage-azcopy) page.