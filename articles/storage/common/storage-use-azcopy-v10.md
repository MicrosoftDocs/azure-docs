---
title: Copy or move data to Azure Storage by using AzCopy v10
description: AzCopy is a command-line utility that you can use to copy data to, from, or between storage accounts. This article helps you download AzCopy, connect to your storage account, and then transfer data.
author: normesta
ms.service: azure-storage
ms.topic: how-to
ms.date: 01/27/2025
ms.author: normesta
ms.subservice: storage-common-concepts
ms.custom: ai-video-demo
ai-usage: ai-assisted
---

# Get started with AzCopy

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article helps you download AzCopy, connect to your storage account, and then transfer data.

> [!NOTE]
> AzCopy **V10** is the currently supported version of AzCopy. The tool is not supported on versions of Windows, Linux, or macOS that are no longer officially maintained.
> 
> If you need to use a previous version of AzCopy, see the [Use the previous version of AzCopy](#previous-version) section of this article.

<a id="download-and-install-azcopy"></a>This video shows you how to download and run the AzCopy utility.

> [!VIDEO 4238a2be-881a-4aaa-8ccd-07a6557a05ef]

The steps in the video are also described in the following sections.

## Use cases for AzCopy

AzCopy can be used to copy your data to, from, or between Azure storage accounts. Common use cases include:

- Copying data from an on-premises source to an Azure storage account
- Copying data from an Azure storage account to an on-premises source
- Copying data from one storage account to another storage account

Each of these use cases has unique options. For example, AzCopy has native commands for copying and/or synchronizing data. This makes AzCopy a flexible tool that can be used for one-time copy activities and ongoing synchronization scenarios. AzCopy also allows you to target specific storage services such as Azure Blob Storage or Azure Files. This allows you to copy data from blob to file, file to blob, file to file, etc.

To learn more about these scenarios, see:

- [Upload files to Azure Blob storage by using AzCopy](storage-use-azcopy-blobs-upload.md)
- [Download blobs from Azure Blob Storage by using AzCopy](storage-use-azcopy-blobs-download.md)
- [Copy blobs between Azure storage accounts by using AzCopy](storage-use-azcopy-blobs-copy.md)
- [Synchronize with Azure Blob storage by using AzCopy](storage-use-azcopy-blobs-synchronize.md)

[!INCLUDE [storage-azcopy-change-support](includes/storage-azcopy-change-support.md)]

## Install AzCopy on Linux by using a package manager

You can install AzCopy by using a Linux package that is hosted on the [Linux Software Repository for Microsoft Products](/linux/packages).

### [dnf (RHEL)](#tab/dnf)

1. Download the repository configuration package.

   > [!IMPORTANT]
   > Make sure to replace the distribution and version with the appropriate strings.

   ```bash
   curl -sSL -O https://packages.microsoft.com/config/<distribution>/<version>/packages-microsoft-prod.rpm
   ```

2. Install the repository configuration package.

   ```bash
   sudo rpm -i packages-microsoft-prod.rpm
   ````

3. Delete the repository configuration package after you've installed it.

   ```bash
   rm packages-microsoft-prod.rpm
   ````

4. Update the package index files.

   ```bash
   sudo dnf update
   ```
5. Install AzCopy.

   ```bash
   sudo dnf install azcopy
   ```


### [zypper (OpenSUSE, SLES)](#tab/zypper)

1. Download the repository configuration package.

   > [!IMPORTANT]
   > Make sure to replace the distribution and version with the appropriate strings.

   ```bash
   curl -sSL -O https://packages.microsoft.com/config/<distribution>/<version>/packages-microsoft-prod.rpm
   ```

2. Install the repository configuration package.

   ```bash
   sudo rpm -i packages-microsoft-prod.rpm
   ```

3. Delete the repository configuration package after you've installed it.

   ```bash
   rm packages-microsoft-prod.rpm
   ```

4. Update the package index files.

   ```bash
   sudo zypper --gpg-auto-import-keys refresh
   ```
   
5. Install AzCopy.
   
   ```bash
   sudo zypper install -y azcopy
   ```

### [apt (Ubuntu, Debian)](#tab/apt)

1. Download the repository configuration package.

   > [!IMPORTANT]
   > Make sure to replace the distribution and version with the appropriate strings.

   ```bash
   curl -sSL -O https://packages.microsoft.com/config/<distribution>/<version>/packages-microsoft-prod.deb
   ```

2. Install the repository configuration package.
   
   ```bash
   sudo dpkg -i packages-microsoft-prod.deb
   ```

3. Delete the repository configuration package after you've installed it.

   ```bash
   rm packages-microsoft-prod.deb
   ```

4. Update the package index files.

   ```bash
   sudo apt-get update
   ```

5. Install AzCopy.
   
   ```bash
   sudo apt-get install azcopy
   ```

# [tdnf (Azure Linux)](#tab/tdnf)

Install AzCopy.

```bash
sudo tdnf install azcopy
```

---

<a id="download-azcopy"></a>

## Download the AzCopy portable binary

As an alternative to installing a package, you can download the AzCopy V10 executable file to any directory on your computer. 

- [Windows 64-bit](https://aka.ms/downloadazcopy-v10-windows) (zip)
- [Windows 32-bit](https://aka.ms/downloadazcopy-v10-windows-32bit) (zip)
- [Windows ARM64 Preview](https://aka.ms/downloadazcopy-v10-windows-arm64) (zip)
- [Linux x86-64](https://aka.ms/downloadazcopy-v10-linux) (tar)
- [Linux ARM64](https://aka.ms/downloadazcopy-v10-linux-arm64) (tar)
- [macOS](https://aka.ms/downloadazcopy-v10-mac) (zip)
- [macOS ARM64 Preview](https://aka.ms/downloadazcopy-v10-mac-arm64) (zip)

These files are compressed as a zip file (Windows and Mac) or a tar file (Linux). To download and decompress the tar file on Linux, see the documentation for your Linux distribution.

For detailed information on AzCopy releases, see the [AzCopy release page](https://github.com/Azure/azure-storage-azcopy/releases).

> [!NOTE]
> If you want to copy data to and from your [Azure Table storage](../tables/table-storage-overview.md) service, then install [AzCopy version 7.3](/previous-versions/azure/storage/storage-use-azcopy#azcopy-with-table-support-v73).

## Run AzCopy

For convenience, consider adding the directory location of the AzCopy executable to your system path for ease of use. That way you can type `azcopy` from any directory on your system.

If you choose not to add the AzCopy directory to your path, you'll have to change directories to the location of your AzCopy executable and type `azcopy` or `.\azcopy` in Windows PowerShell command prompts.

As an owner of your Azure Storage account, you aren't automatically assigned permissions to access data. Before you can do anything meaningful with AzCopy, you need to decide how you'll provide authorization credentials to the storage service.

<a id="choose-how-youll-provide-authorization-credentials"></a>

## Authorize AzCopy

You can provide authorization credentials by using Microsoft Entra ID, or by using a Shared Access Signature (SAS) token.

<a name='option-1-use-azure-active-directory'></a>

#### Option 1: Use Microsoft Entra ID

By using Microsoft Entra ID, you can provide credentials once instead of having to append a SAS token to each command.

#### Option 2: Use a SAS token

You can append a SAS token to each source or destination URL that use in your AzCopy commands.

This example command recursively copies data from a local directory to a blob container. A fictitious SAS token is appended to the end of the container URL.

```azcopy
azcopy copy "C:\local\path" "https://account.blob.core.windows.net/mycontainer1/?sv=2018-03-28&ss=bjqt&srt=sco&sp=rwddgcup&se=2019-05-01T05:01:17Z&st=2019-04-30T21:01:17Z&spr=https&sig=MGCXiyEzbtttkr3ewJIh2AR8KrghSy1DGM9ovN734bQF4%3D" --recursive=true
```

To learn more about SAS tokens and how to obtain one, see [Using shared access signatures (SAS)](./storage-sas-overview.md).

> [!NOTE]
> The [Secure transfer required](storage-require-secure-transfer.md) setting of a storage account determines whether the connection to a storage account is secured with Transport Layer Security (TLS). This setting is enabled by default.

<a id="transfer-data"></a>

## Transfer data

After you've authorized your identity or obtained a SAS token, you can begin transferring data.

To find example commands, see any of these articles.

| Service | Article |
|--------|-----------|
|Azure Blob Storage|[Upload files to Azure Blob Storage](storage-use-azcopy-blobs-upload.md) |
|Azure Blob Storage|[Download blobs from Azure Blob Storage](storage-use-azcopy-blobs-download.md)|
|Azure Blob Storage|[Copy blobs between Azure storage accounts](storage-use-azcopy-blobs-copy.md)|
|Azure Blob Storage|[Synchronize with Azure Blob Storage](storage-use-azcopy-blobs-synchronize.md)|
|Azure Files |[Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)|
|Amazon S3|[Copy data from Amazon S3 to Azure Storage](storage-use-azcopy-s3.md)|
|Google Cloud Storage|[Copy data from Google Cloud Storage to Azure Storage (preview)](storage-use-azcopy-google-cloud.md)|
|Azure Stack storage|[Transfer data with AzCopy and Azure Stack storage](/azure-stack/user/azure-stack-storage-transfer#azcopy)|

## Get command help

To see a list of commands, type `azcopy -h` and then press the ENTER key.

To learn about a specific command, just include the name of the command (For example: `azcopy list -h`).

> [!div class="mx-imgBorder"]
> ![Inline help](media/storage-use-azcopy-v10/azcopy-inline-help.png)

### List of commands

The following table lists all AzCopy v10 commands. Each command links to a reference article.

|Command|Description|
|---|---|
|[azcopy bench](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_bench)|Runs a performance benchmark by uploading or downloading test data to or from a specified location.|
|[azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy)|Copies source data to a destination location|
|[azcopy doc](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_doc)|Generates documentation for the tool in Markdown format.|
|[azcopy env](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_env)|Shows the environment variables that can configure AzCopy's behavior.|
|[azcopy jobs](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_jobs)|Subcommands related to managing jobs.|
|[azcopy jobs clean](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_jobs_clean)|Remove all log and plan files for all jobs.|
|[azcopy jobs list](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_jobs_list)|Displays information on all jobs.|
|[azcopy jobs remove](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_jobs_remove)|Remove all files associated with the given job ID.|
|[azcopy jobs resume](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_jobs_resume)|Resumes the existing job with the given job ID.|
|[azcopy jobs show](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_jobs_show)|Shows detailed information for the given job ID.|
|[azcopy list](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_list)|Lists the entities in a given resource.|
|[azcopy login](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_login)|Logs in to Microsoft Entra ID to access Azure Storage resources.|
|[azcopy login status](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_login_status)|Lists the entities in a given resource.|
|[azcopy logout](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_logout)|Logs the user out and terminates access to Azure Storage resources.|
|[azcopy make](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_make)|Creates a container or file share.|
|[azcopy remove](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_jobs_remove)|Delete blobs or files from an Azure storage account.|
|[azcopy sync](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_sync)|Replicates the source location to the destination location.|
|[azcopy set-properties](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_set-properties)|Change the access tier of one or more blobs and replace (overwrite) the metadata, and index tags of one or more blobs.|

> [!NOTE]
> AzCopy does not have a command to rename files.

## Use in a script

#### Obtain a static download link

Over time, the AzCopy [download link](#download-and-install-azcopy) will point to new versions of AzCopy. If your script downloads AzCopy, the script might stop working if a newer version of AzCopy modifies features that your script depends upon.

To avoid these issues, obtain a static (unchanging) link to the current version of AzCopy. That way, your script downloads the same exact version of AzCopy each time that it runs.

> [!NOTE]
> The static link to AzCopy binaries is subject to change over time due to our content delivery infrastructure. If you must use a specific version of AzCopy for any reason, we recommend using AzCopy with an operating system that leverages a [published package](#install-azcopy-on-linux-by-using-a-package-manager). This method ensures that you can reliably install and maintain the desired version of AzCopy.

To obtain the link, run this command:

| Operating system  | Command |
|--------|-----------|
| **Linux** | `curl -s -D- https://aka.ms/downloadazcopy-v10-linux \| grep ^Location` |
| **Windows PowerShell** | `(Invoke-WebRequest -Uri https://aka.ms/downloadazcopy-v10-windows -MaximumRedirection 0 -ErrorAction SilentlyContinue).headers.location` |
| **PowerShell 6.1+** | `(Invoke-WebRequest -Uri https://aka.ms/downloadazcopy-v10-windows -MaximumRedirection 0 -ErrorAction SilentlyContinue -SkipHttpErrorCheck).headers.location` |

> [!NOTE]
> For Linux, `--strip-components=1` on the `tar` command removes the top-level folder that contains the version name, and instead extracts the binary directly into the current folder. This allows the script to be updated with a new version of `azcopy` by only updating the `wget` URL.

The URL appears in the output of this command. Your script can then download AzCopy by using that URL.

**Linux**
```bash
wget -O azcopy_v10.tar.gz https://aka.ms/downloadazcopy-v10-linux && tar -xf azcopy_v10.tar.gz --strip-components=1
```
**Windows PowerShell** 
```PowerShell
Invoke-WebRequest -Uri <URL from the previous command> -OutFile 'azcopyv10.zip'
Expand-archive -Path '.\azcopyv10.zip' -Destinationpath '.\'
$AzCopy = (Get-ChildItem -path '.\' -Recurse -File -Filter 'azcopy.exe').FullName
# Invoke AzCopy 
& $AzCopy
```
**PowerShell 6.1+**
```PowerShell
Invoke-WebRequest -Uri <URL from the previous command> -OutFile 'azcopyv10.zip'
$AzCopy = (Expand-archive -Path '.\azcopyv10.zip' -Destinationpath '.\' -PassThru | where-object {$_.Name -eq 'azcopy.exe'}).FullName
# Invoke AzCopy
& $AzCopy
``` 

#### Escape special characters in SAS tokens

In batch files that have the `.cmd` extension, you'll have to escape the `%` characters that appear in SAS tokens. You can do that by adding an extra `%` character next to existing `%` characters in the SAS token string. The resulting character sequence appears as `%%`. Make sure to add an extra `^` before each `&` character to create the character sequence `^&`.

#### Run scripts by using Jenkins

If you plan to use [Jenkins](https://jenkins.io/) to run scripts, make sure to place the following command at the beginning of the script.

```
/usr/bin/keyctl new_session
```

## Use in Azure Storage Explorer

[Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) uses AzCopy to perform all of its data transfer operations. You can use [Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) if you want to apply the performance advantages of AzCopy, but you prefer to use a graphical user interface rather than the command line to interact with your files.

Storage Explorer uses your account key to perform operations, so after you sign into Storage Explorer, you won't need to provide additional authorization credentials.

<a id="previous-version"></a>

## Configure, optimize, and fix

See any of the following resources:

- [AzCopy configuration settings](storage-ref-azcopy-configuration-settings.md)

- [Optimize the performance of AzCopy](storage-use-azcopy-optimize.md)

- [Find errors and resume jobs by using log and plan files in AzCopy](storage-use-azcopy-configure.md)

- [Troubleshoot problems with AzCopy v10](storage-use-azcopy-troubleshoot.md)

## Use a previous version (deprecated)

If you need to use the previous version of AzCopy, see either of the following links:

- [AzCopy on Windows (v8)](/previous-versions/azure/storage/storage-use-azcopy)

- [AzCopy on Linux (v7)](/previous-versions/azure/storage/storage-use-azcopy-linux)

> [!NOTE]
> These versions AzCopy are been deprecated. Microsoft recommends using AzCopy v10.

## Next steps

If you have questions, issues, or general feedback, submit them [on GitHub](https://github.com/Azure/azure-storage-azcopy) page.
