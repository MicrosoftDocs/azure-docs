---
title: Use Azure File Storage with macOS | Microsoft Docs
description: Learn how to mount an Azure File share over SMB with macOS.
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

# Use Azure File Storage with macOS
[Azure File Storage](storage-file-storage.md) is Microsoft's easy to use cloud file system. Azure File shares can be mounted in macOS Sierra (10.12) and El Capitan (10.11). This article shows two different ways to mount an Azure File share on macOS: with the Finder UI and via the Terminal.

> [!Note]  
> Before mounting an Azure File share over SMB, we recommend disabling SMB packet signing. Not doing so may yield poor performance when accessing the Azure File share from macOS. From the terminal, the following commands will disable SMB packet signing, as described by this [Apple Support article](https://support.apple.com/en-us/HT205926):  
>    ```
>    sudo -s
>    echo "[default]" >> /etc/nsmb.conf
>    echo "signing_required=no" >> /etc/nsmb.conf
>    exit
>    ```

## <a id="preq"></a>Prerequisites for mounting an Azure File share on macOS
* **Storage Account Name**: To mount an Azure File share, you will need the name of the storage account.

* **Storage Account Key**: To mount an Azure File share, you will need the storage account name and the primary (or secondary) storage key. SAS keys are not currently supported for mounting.

* **Ensure port 445 is open**: SMB communicates over TCP port 445 - check to see if your firewall is not blocking TCP ports 445 from client machine.

## <a id="viafinder"/></a>Mount an Azure File share via Finder
1. **Open Finder**: Finder is open on macOS by default, but you can ensure it is the currently selected application by clicking the "macOS face icon" on the dock:  
    ![The macOS face icon](media/storage-file-how-to-use-files-mac/mount-via-finder-1.png)

2. **Select "Connect to Server" from the "Go" Menu**: Using the UNC path from the [prerequisites](#preq), convert the beginning double backslash (`\\`) to `smb://` and all other backslashes (`\`) to forwards slashes (`/`), like the following: 
    ![The "Connect to Server" dialog](./media/storage-file-how-to-use-files-mac/mount-via-finder-2.png)

3. **Use the Share Name and Storage Account Key when prompted for a username and password**: When you click "Connect" on the "Connect to Server" dialog, you will be prompted for the username and password (This will be autopopulated with your macOS username). You may store have the option of placing the share name/storage account key in your macOS Keychain. 

4. **Use Azure File share as desired**: After inserting the share name/storage account key in for the username and password, the share will be mounted. You may use this as you would normally use a local folder/file share, including dragging and dropping files into the file share:

    ![A snapshot of a mounted Azure File share](./media/storage-file-how-to-use-files-mac/mount-via-finder-3.png)

## <a id="viaterminal"/></a>Mount an Azure File share via Terminal
1. Replace `<storage-account-name>` with the name of your storage account. Provide Storage Account Key as password when prompted. 

    ```
    mount_smbfs //<storage-account-name>@<storage-account-name>.file.core.windows.net/<share-name> <desired-mount-point>
    ```

2. **Use the Azure File share as desired**: The Azure File share will be mounted at the mount point specified by the previous command.  

    ![A snapshot of the mounted Azure File share](./media/storage-file-how-to-use-files-mac/mount-via-terminal-1.png)

## Next Steps
See these links for more information about Azure File storage.

* [Apple Support Article - How to connect with File Sharing on your Mac](https://support.apple.com/en-us/HT204445)
* [FAQ](storage-files-faq.md)
* [Troubleshooting](storage-troubleshoot-file-connection-problems.md)

### Conceptual articles and videos
* [Azure File Storage: a frictionless cloud SMB file system for Windows and Linux](https://azure.microsoft.com/documentation/videos/azurecon-2015-azure-files-storage-a-frictionless-cloud-smb-file-system-for-windows-and-linux/)
* [How to use Azure File Storage with Linux](storage-how-to-use-files-linux.md)

### Tooling support for File storage
* [Using Azure PowerShell with Azure Storage](storage-powershell-guide-full.md)
* [How to use AzCopy with Microsoft Azure Storage](storage-use-azcopy.md)
* [Using the Azure CLI with Azure Storage](storage-azure-cli.md#create-and-manage-file-shares)
* [Troubleshooting Azure File storage problems](https://docs.microsoft.com/en-us/azure/storage/storage-troubleshoot-file-connection-problems)

### Blog posts
* [Azure File storage is now generally available](https://azure.microsoft.com/blog/azure-file-storage-now-generally-available/)
* [Inside Azure File Storage](https://azure.microsoft.com/blog/inside-azure-file-storage/)
* [Introducing Microsoft Azure File Service](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/12/introducing-microsoft-azure-file-service.aspx)
* [Migrating data to Azure File ](https://azure.microsoft.com/en-us/blog/migrating-data-to-microsoft-azure-files/)

### Reference
* [Storage Client Library for .NET reference](https://msdn.microsoft.com/library/azure/dn261237.aspx)
* [File Service REST API reference](http://msdn.microsoft.com/library/azure/dn167006.aspx)