---
title: Mount Azure File share over SMB with macOS | Microsoft Docs
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
ms.date: 05/27/2017
ms.author: renash
---

# Mount Azure File share over SMB with macOS
[Azure File Storage](storage-dotnet-how-to-use-files.md) is Microsoft's service that enables you to create and use network file shares in the Azure using the industry standard. Azure File shares can be mounted in macOS Sierra (10.12) and El Capitan (10.11). This article shows two different ways to mount an Azure File share on macOS with the Finder UI and using the Terminal.

> [!Note]  
> Before mounting an Azure File share over SMB, we recommend disabling SMB packet signing. Not doing so may yield poor performance when accessing the Azure File share from macOS. From the terminal, the following commands will disable SMB packet signing, as described by this [Apple support article on disabling SMB packet signing](https://support.apple.com/HT205926):  
>    ```
>    sudo -s
>    echo "[default]" >> /etc/nsmb.conf
>    echo "signing_required=no" >> /etc/nsmb.conf
>    exit
>    ```

## Prerequisites for mounting an Azure File share on macOS
* **Storage account name**: To mount an Azure File share, you will need the name of the storage account.

* **Storage account key**: To mount an Azure File share, you will need the primary (or secondary) storage key. SAS keys are not currently supported for mounting.

* **Ensure port 445 is open**: SMB communicates over TCP port 445. On your client machine (the Mac), check to make sure your firewall is not blocking TCP port 445.

## Mount an Azure File share via Finder
1. **Open Finder**: Finder is open on macOS by default, but you can ensure it is the currently selected application by clicking the "macOS face icon" on the dock:  
    ![The macOS face icon](media/storage-file-how-to-use-files-mac/mount-via-finder-1.png)

2. **Select "Connect to Server" from the "Go" Menu**: Using the UNC path from the [prerequisites](#preq), convert the beginning double backslash (`\\`) to `smb://` and all other backslashes (`\`) to forwards slashes (`/`). Your link should look like the following:
    ![The "Connect to Server" dialog](./media/storage-file-how-to-use-files-mac/mount-via-finder-2.png)

3. **Use the share name and storage account key when prompted for a username and password**: When you click "Connect" on the "Connect to Server" dialog, you will be prompted for the username and password (This will be autopopulated with your macOS username). You have the option of placing the share name/storage account key in your macOS Keychain.

4. **Use the Azure File share as desired**: After substituting the share name and storage account key in for the username and password, the share will be mounted. You may use this as you would normally use a local folder/file share, including dragging and dropping files into the file share:

    ![A snapshot of a mounted Azure File share](./media/storage-file-how-to-use-files-mac/mount-via-finder-3.png)

## Mount an Azure File share via Terminal
1. Replace `<storage-account-name>` with the name of your storage account. Provide Storage Account Key as password when prompted. 

    ```
    mount_smbfs //<storage-account-name>@<storage-account-name>.file.core.windows.net/<share-name> <desired-mount-point>
    ```

2. **Use the Azure File share as desired**: The Azure File share will be mounted at the mount point specified by the previous command.  

    ![A snapshot of the mounted Azure File share](./media/storage-file-how-to-use-files-mac/mount-via-terminal-1.png)

## Next steps
See these links for more information about Azure File storage.

* [Apple Support Article - How to connect with File Sharing on your Mac](https://support.apple.com/HT204445)
* [FAQ](storage-files-faq.md)
* [Troubleshooting](storage-troubleshoot-file-connection-problems.md)