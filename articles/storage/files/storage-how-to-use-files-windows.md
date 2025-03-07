---
title: Mount Azure file share on Windows
description: Learn to use Azure file shares with Windows and Windows Server. Use Azure file shares with SMB 3.x on Windows installations running on-premises or on Azure VMs.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 02/19/2025
ms.author: kendownie
ms.custom: ai-video-demo
ai-usage: ai-assisted
---

# Mount SMB Azure file share on Windows

[Azure Files](storage-files-introduction.md) is Microsoft's easy-to-use cloud file system. Azure file shares work seamlessly with Windows and Windows Server. This article shows you how to use an SMB Azure file share with Windows and Windows Server.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

This video shows you how to mount an SMB Azure file share on Windows.
> [!VIDEO c057ece1-3ba7-409b-8cee-5492a4ad4ee4]

The steps in the video are also described in the following sections.

In order to use an Azure file share via the public endpoint outside of the Azure region it's hosted in, such as on-premises or in a different Azure region, the OS must support SMB 3.x. Older versions of Windows that support only SMB 2.1 can't mount Azure file shares via the public endpoint.

Azure Files supports [SMB Multichannel](files-smb-protocol.md#smb-multichannel) on premium file shares only.

| Windows version | SMB version | Azure Files SMB Multichannel | Maximum SMB channel encryption |
|-|-|-|-|
| Windows Server 2025 | SMB 3.1.1 | Yes | AES-256-GCM |
| Windows 11, version 24H2 | SMB 3.1.1 | Yes | AES-256-GCM |
| Windows 11, version 23H2 | SMB 3.1.1 | Yes | AES-256-GCM |
| Windows 11, version 22H2 | SMB 3.1.1 | Yes | AES-256-GCM |
| Windows 10, version 22H2 | SMB 3.1.1 | Yes | AES-128-GCM |
| Windows Server 2022 | SMB 3.1.1 | Yes | AES-256-GCM |
| Windows 11, version 21H2 | SMB 3.1.1 | Yes | AES-256-GCM |
| Windows 10, version 21H2 | SMB 3.1.1 | Yes | AES-128-GCM |
| Windows 10, version 21H1 | SMB 3.1.1 | Yes, with KB5003690 or newer | AES-128-GCM |
| Windows Server, version 20H2 | SMB 3.1.1 | Yes, with KB5003690 or newer | AES-128-GCM |
| Windows 10, version 20H2 | SMB 3.1.1 | Yes, with KB5003690 or newer | AES-128-GCM |
| Windows Server, version 2004 | SMB 3.1.1 | Yes, with KB5003690 or newer | AES-128-GCM |
| Windows 10, version 2004 | SMB 3.1.1 | Yes, with KB5003690 or newer | AES-128-GCM |
| Windows Server 2019 | SMB 3.1.1 | Yes, with KB5003703 or newer | AES-128-GCM |
| Windows 10, version 1809 | SMB 3.1.1 | Yes, with KB5003703 or newer | AES-128-GCM |
| Windows Server 2016 | SMB 3.1.1 | Yes, with KB5004238 or newer and [applied registry key](files-smb-protocol.md#windows-server-2016-and-windows-10-version-1607) | AES-128-GCM |
| Windows 10, version 1607 | SMB 3.1.1 | Yes, with KB5004238 or newer and [applied registry key](files-smb-protocol.md#windows-server-2016-and-windows-10-version-1607) | AES-128-GCM |
| Windows 10, version 1507 | SMB 3.1.1 | Yes, with KB5004249 or newer and [applied registry key](files-smb-protocol.md#windows-10-version-1507) | AES-128-GCM |
| Windows Server 2012 R2<sup>1</sup> | SMB 3.0 | No | AES-128-CCM |
| Windows Server 2012<sup>1</sup> | SMB 3.0 | No | AES-128-CCM |
| Windows 8.1<sup>2</sup> | SMB 3.0 | No | AES-128-CCM |
| Windows Server 2008 R2<sup>2</sup> | SMB 2.1 | No | Not supported |
| Windows 7<sup>2</sup> | SMB 2.1 | No | Not supported |

<sup>1</sup>Regular Microsoft support for Windows Server 2012 and Windows Server 2012 R2 has ended. It's possible to purchase additional support for security updates only through the [Extended Security Update (ESU) program](https://support.microsoft.com/help/4497181/lifecycle-faq-extended-security-updates).

<sup>2</sup>Microsoft support for Windows 7, Windows 8, and Windows Server 2008 R2 has ended. We strongly recommend migrating off of these operating systems.

> [!NOTE]
> We recommend taking the most recent KB for your version of Windows.

## Prerequisites

Ensure port 445 is open: The SMB protocol requires TCP port 445 to be open. Connections will fail if port 445 is blocked. You can check if your firewall or ISP is blocking port 445 by using the `Test-NetConnection` PowerShell cmdlet. For more information, see [Port 445 is blocked](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-connectivity?toc=/azure/storage/files/toc.json#cause-1-port-445-is-blocked).

## Using an Azure file share with Windows

To use an Azure file share with Windows, you must either mount it, which means assigning it a drive letter or mount point path, or [access it via its UNC path](#access-an-azure-file-share-via-its-unc-path).

This article uses the storage account key to access the file share. A storage account key is an administrator key for a storage account, including administrator permissions to all files and folders within the file share you're accessing, and for all file shares and other storage resources (blobs, queues, tables, etc.) contained within your storage account. Shared access signature (SAS) tokens aren't currently supported for mounting Azure file shares.

A common pattern for lifting and shifting line-of-business (LOB) applications that expect an SMB file share to Azure is to use an Azure file share as an alternative for running a dedicated Windows file server in an Azure virtual machine (VM). One important consideration for successfully migrating an LOB application to use an Azure file share is that many applications run under the context of a dedicated service account with limited system permissions rather than the VM's administrative account. Therefore, you must ensure that you mount/save the credentials for the Azure file share from the context of the service account rather than your administrative account.

### Mount the Azure file share

The Azure portal provides a PowerShell script that you can use to mount your file share directly to a host using the storage account key.

> [!IMPORTANT]
> Connecting to a file share using the storage account key is only appropriate for admin access. Mounting the share with the Active Directory or Micosoft Entra identity of the user is preferred. See [identity-based authentication overview](storage-files-active-directory-overview.md).

To get this script:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to the storage account that contains the file share you'd like to mount.
1. Select **File shares**.
1. Select the file share you'd like to mount.

    :::image type="content" source="media/storage-how-to-use-files-windows/select-file-shares.png" alt-text="Screenshot of file shares blade, file share is highlighted." lightbox="media/storage-how-to-use-files-windows/select-file-shares.png":::

1. Select **Connect**.

    :::image type="content" source="media/storage-how-to-use-files-windows/file-share-connect-icon.png" alt-text="Screenshot of the connect icon for your file share.":::

1. Select the drive letter to mount the share to.
1. Copy the provided script.

    :::image type="content" source="media/storage-how-to-use-files-windows/files-portal-mounting-script.png" alt-text="Screenshot of connect blade, copy button on script is highlighted.":::

1. Paste the script into a shell on the host you'd like to mount the file share to, and run it.

You have now mounted your Azure file share.

### Mount the Azure file share with File Explorer

> [!NOTE]
> The following instructions are shown on Windows 10 and might differ slightly on other releases.

1. Open File Explorer by opening it from the Start Menu, or by pressing the Win+E shortcut.

1. Navigate to **This PC** on the left-hand side of the window. This will change the menus available in the ribbon. Under the Computer menu, select **Map network drive**.

    :::image type="content" source="media/storage-how-to-use-files-windows/1_MountOnWindows10.png" alt-text="Screenshot of the Map network drive drop-down menu.":::

1. Select the drive letter and enter the UNC path to your Azure file share. The UNC path format is `\\<storageAccountName>.file.core.windows.net\<fileShareName>`. For example: `\\anexampleaccountname.file.core.windows.net\file-share-name`. Check the **Connect using different credentials** checkbox. Select **Finish**.

    :::image type="content" source="media/storage-how-to-use-files-windows/2_MountOnWindows10.png" alt-text="Screenshot of the Map Network Drive dialog.":::

1. Select **More choices** > **Use a different account**. Under **Email address**, use the storage account name, and use a storage account key as the password. Select **OK**.

    :::image type="content" source="media/storage-how-to-use-files-windows/credentials-use-a-different-account.png" alt-text="Screenshot of the network credential dialog selecting use a different account.":::

1. Use Azure file share as desired.

    :::image type="content" source="media/storage-how-to-use-files-windows/4_MountOnWindows10.png" alt-text="Screenshot showing that the Azure file share is now mounted.":::

1. When you're ready to dismount the Azure file share, right-click on the entry for the share under the **Network locations** in File Explorer and select **Disconnect**.

### Access an Azure file share via its UNC path

You don't need to mount the Azure file share to a drive letter to use it. You can directly access your Azure file share using the [UNC path](/windows/win32/fileio/naming-a-file) by entering the following into File Explorer. Be sure to replace *storageaccountname* with your storage account name and *myfileshare* with your file share name:

`\\storageaccountname.file.core.windows.net\myfileshare`

You'll be asked to sign in with your network credentials. Sign in with the Azure subscription under which you've created the storage account and file share. If you don't get prompted for credentials, you can add the credentials using the following command:

`cmdkey /add:StorageAccountName.file.core.windows.net /user:localhost\StorageAccountName /pass:StorageAccountKey`

For Azure Government Cloud, change the servername to:

`\\storageaccountname.file.core.usgovcloudapi.net\myfileshare`

## Next steps

See these links for more information about Azure Files:

- [Planning for an Azure Files deployment](storage-files-planning.md)
- [FAQ](storage-files-faq.md)
- [Troubleshoot Azure Files](/troubleshoot/azure/azure-storage/files-troubleshoot?toc=/azure/storage/files/toc.json)
