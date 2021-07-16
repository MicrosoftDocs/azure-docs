---
title: Mount SMB Azure file share on Windows | Microsoft Docs
description: Learn to use Azure file shares with Windows and Windows Server. Use Azure file shares with SMB 3.x on Windows installations running on-premises or on Azure VMs.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 04/15/2021
ms.author: rogarana
ms.subservice: files 
ms.custom: devx-track-azurepowershell
---

# Mount SMB Azure file share on Windows
[Azure Files](storage-files-introduction.md) is Microsoft's easy-to-use cloud file system. Azure file shares can be seamlessly used in Windows and Windows Server. This article discusses the considerations for using an Azure file share with Windows and Windows Server.

In order to use an Azure file share via the public endpoint outside of the Azure region it is hosted in, such as on-premises or in a different Azure region, the OS must support SMB 3.x. Older versions of Windows that support only SMB 2.1 cannot mount Azure file shares via the public endpoint.

| Windows version | SMB version | Maximum SMB channel encryption |
|-|-|-|-|
| Windows 10, version 21H1 | SMB 3.1.1 | AES-256-GCM |
| Windows Server semi-annual channel, version 21H1 | SMB 3.1.1 | AES-256-GCM |
| Windows Server 2019 | SMB 3.1.1 | AES-128-GCM |
| Windows 10<br />Versions: 1607, 1809, 1909, 2004, and 20H2 | SMB 3.1.1 | AES-128-GCM |
| Windows Server semi-annual channel<br />Versions: 2004 and 20H2 | SMB 3.1.1 | AES-128-GCM |
| Windows Server 2016 | SMB 3.1.1 | AES-128-GCM |
| Windows 10, version 1507 | SMB 3.0 | AES-128-GCM |
| Windows 8.1 | SMB 3.0 | AES-128-CCM |
| Windows Server 2012 R2 | SMB 3.0 | AES-128-CCM |
| Windows Server 2012 | SMB 3.0 | AES-128-CCM |
| Windows 7<sup>1</sup> | SMB 2.1 | Not supported |
| Windows Server 2008 R2<sup>1</sup> | SMB 2.1 | Not supported |

<sup>1</sup>Regular Microsoft support for Windows 7 and Windows Server 2008 R2 has ended. It is possible to purchase additional support for security updates only through the [Extended Security Update (ESU) program](https://support.microsoft.com/help/4497181/lifecycle-faq-extended-security-updates). We strongly recommend migrating off of these operating systems.

> [!Note]  
> We always recommend taking the most recent KB for your version of Windows.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Prerequisites 
Ensure port 445 is open: The SMB protocol requires TCP port 445 to be open; connections will fail if port 445 is blocked. You can check if your firewall is blocking port 445 with the `Test-NetConnection` cmdlet. To learn about ways to work around a blocked 445 port, see the [Cause 1: Port 445 is blocked](storage-troubleshoot-windows-file-connection-problems.md#cause-1-port-445-is-blocked) section of our Windows troubleshooting guide.

## Using an Azure file share with Windows
To use an Azure file share with Windows, you must either mount it, which means assigning it a drive letter or mount point path, or access it via its [UNC path](/windows/win32/fileio/naming-a-file). 

This article uses the storage account key to access the file share. A storage account key is an administrator key for a storage account, including administrator permissions to all files and folders within the file share you're accessing, and for all file shares and other storage resources (blobs, queues, tables, etc.) contained within your storage account. If this is not sufficient for your workload, [Azure File Sync](../file-sync/file-sync-planning.md) may be used, or you may use [identity-based authentication over SMB](storage-files-active-directory-overview.md).

A common pattern for lifting and shifting line-of-business (LOB) applications that expect an SMB file share to Azure is to use an Azure file share as an alternative for running a dedicated Windows file server in an Azure VM. One important consideration for successfully migrating a line-of-business application to use an Azure file share is that many line-of-business applications run under the context of a dedicated service account with limited system permissions rather than the VM's administrative account. Therefore, you must ensure that you mount/save the credentials for the Azure file share from the context of the service account rather than your administrative account.

### Mount the Azure file share

The Azure portal provides you with a script that you can use to mount your file share directly to a host. We recommend using this provided script.

To get this script:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to the storage account that contains the file share you'd like to mount.
1. Select **File shares**.
1. Select the file share you'd like to mount.

    :::image type="content" source="media/storage-how-to-use-files-windows/select-file-shares.png" alt-text="Screenshot of file shares blade, file share is highlighted.":::

1. Select **Connect**.

    :::image type="content" source="media/storage-how-to-use-files-windows/file-share-connect-icon.png" alt-text="Screenshot of the connect icon for your file share.":::

1. Select the drive letter to mount the share to.
1. Copy the provided script.

    :::image type="content" source="media/storage-how-to-use-files-windows/files-portal-mounting-cmdlet-resize.png" alt-text="Screenshot of connect blade, copy button on script is highlighted.":::

1. Paste the script into a shell on the host you'd like to mount the file share to, and run it.

You have now mounted your Azure file share.

### Mount the Azure file share with File Explorer
> [!Note]  
> Note that the following instructions are shown on Windows 10 and may differ slightly on older releases. 

1. Open File Explorer. This can be done by opening from the Start Menu, or by pressing Win+E shortcut.

1. Navigate to **This PC** on the left-hand side of the window. This will change the menus available in the ribbon. Under the Computer menu, select **Map network drive**.
    
    ![A screenshot of the "Map network drive" drop-down menu](./media/storage-how-to-use-files-windows/1_MountOnWindows10.png)

1. Select the drive letter and enter the UNC path, the UNC path format is `\\<storageAccountName>.file.core.windows.net\<fileShareName>`. For example: `\\anexampleaccountname.file.core.windows.net\example-share-name`.
    
    ![A screenshot of the "Map Network Drive" dialog](./media/storage-how-to-use-files-windows/2_MountOnWindows10.png)

1. Use the storage account name prepended with `AZURE\` as the username and a storage account key as the password.
    
    ![A screenshot of the network credential dialog](./media/storage-how-to-use-files-windows/3_MountOnWindows10.png)

1. Use Azure file share as desired.
    
    ![Azure file share is now mounted](./media/storage-how-to-use-files-windows/4_MountOnWindows10.png)

1. When you are ready to dismount the Azure file share, you can do so by right-clicking on the entry for the share under the **Network locations** in File Explorer and selecting **Disconnect**.

### Accessing share snapshots from Windows
If you have taken a share snapshot, either manually or automatically through a script or service like Azure Backup, you can view previous versions of a share, a directory, or a particular file from file share on Windows. You can take a share snapshot using [Azure PowerShell](storage-how-to-use-files-powershell.md), [Azure CLI](storage-how-to-use-files-cli.md), or the [Azure portal](storage-how-to-use-files-portal.md).

#### List previous versions
Browse to the item or parent item that needs to be restored. Double-click to go to the desired directory. Right-click and select **Properties** from the menu.

![Right-click menu for a selected directory](./media/storage-how-to-use-files-windows/snapshot-windows-previous-versions.png)

Select **Previous Versions** to see the list of share snapshots for this directory. The list might take a few seconds to load, depending on the network speed and the number of share snapshots in the directory.

![Previous Versions tab](./media/storage-how-to-use-files-windows/snapshot-windows-list.png)

You can select **Open** to open a particular snapshot. 

![Opened snapshot](./media/storage-how-to-use-files-windows/snapshot-browse-windows.png)

#### Restore from a previous version
Select **Restore** to copy the contents of the entire directory recursively at the share snapshot creation time to the original location.

 ![Restore button in warning message](./media/storage-how-to-use-files-windows/snapshot-windows-restore.png) 

## Next steps
See these links for more information about Azure Files:
- [Planning for an Azure Files deployment](storage-files-planning.md)
- [FAQ](./storage-files-faq.md)
- [Troubleshooting on Windows](storage-troubleshoot-windows-file-connection-problems.md)