---
title: Mount an Azure file share on macOS
description: Learn how to mount an Azure file share over SMB with macOS using Finder or Terminal.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 12/13/2024
ms.author: kendownie
---

# Mount an Azure file share on macOS

[Azure Files](storage-files-introduction.md) is Microsoft's easy-to-use cloud file system. Azure file shares can be mounted with the industry standard SMB 3 protocol by macOS High Sierra 10.13+.

> [!WARNING]
> Mounting a file share using storage account keys carries inherent security risks. For information on how to protect and manage your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md). Azure Files doesn't currently support using identity-based authentication to mount a file share on macOS.

## Applies to
| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Prerequisites for mounting an Azure file share on macOS

* **Storage account name**: To mount an Azure file share, you need the name of the storage account.

* **Storage account key**: To mount an Azure file share, you need the primary (or secondary) storage account key.

* **Ensure port 445 is open**: SMB communicates over TCP port 445. On your macOS, check to make sure your firewall doesn't block TCP port 445. If port 445 is blocked, you can set up a VPN from on-premises to your Azure file share using private endpoints. For more information, see [Networking considerations for direct Azure file share access](storage-files-networking-overview.md).

## Mount an Azure file share via Finder

1. **Open Finder**: Finder is open on macOS by default, but you can ensure that it's the currently selected application by clicking the macOS face icon on the dock:  
    ![The macOS face icon](./media/storage-how-to-use-files-mac/mount-via-finder-1.png)

1. **Select "Connect to Server" from the "Go" Menu**: Using the UNC path, convert the beginning double backslash (`\\`) to `smb://` and all other backslashes (`\`) to forward slashes (`/`).
    ![The "Connect to Server" dialog](./media/storage-how-to-use-files-mac/mount-via-finder-2.png)

1. **Use the storage account name and storage account key when prompted for a username and password**: If desired, you can persist the storage account name and storage account key in your macOS Keychain.

1. **Use the Azure file share as desired**: After substituting the share name and storage account key for the username and password, the share is be mounted. You can use the file share as you would normally use a local folder, including dragging and dropping files into the file share:

    ![A snapshot of a mounted Azure file share](./media/storage-how-to-use-files-mac/mount-via-finder-3.png)

## Mount an Azure file share via Terminal

1. Replace `<storage-account-name>`, `<storage-account-key>`, and `<share-name>` with the appropriate values for your environment.

    ```terminal
    open smb://<storage-account-name>:<storage-account-key>@<storage-account-name>.file.core.windows.net/<share-name>
    ```

1. **Use the Azure file share as desired**: The Azure file share is mounted at the mount point specified by the previous command.  

    ![A snapshot of the mounted Azure file share](./media/storage-how-to-use-files-mac/mount-via-terminal-1.png)

## Next step

* [Connect your Mac to shared computers and servers - Apple Support](https://support.apple.com/guide/mac-help/connect-mac-shared-computers-servers-mchlp1140/mac)
