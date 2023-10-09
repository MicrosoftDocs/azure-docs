---
title: Tutorial - Create an SMB Azure file share and connect it to a Windows virtual machine using the Azure portal
description: This tutorial covers how to create an SMB Azure file share using the Azure portal, connect it to a Windows VM, upload a file to the file share, create a snapshot, and restore the share from the snapshot.
author: khdownie
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 10/09/2023
ms.author: kendownie
ms.custom: mode-ui
#Customer intent: As an IT admin new to Azure Files, I want to try out Azure file shares so I can determine whether I want to subscribe to the service.
---

# Tutorial: Create an SMB Azure file share and connect it to a Windows VM using the Azure portal

Azure Files offers fully managed file shares in the cloud that are accessible via the industry standard [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) or [Network File System (NFS) protocol](https://en.wikipedia.org/wiki/Network_File_System). In this tutorial, you'll learn a few ways you can use an SMB Azure file share in a Windows virtual machine (VM).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!div class="checklist"]
> * Create a storage account
> * Create a file share
> * Deploy a VM
> * Connect to the VM
> * Mount an Azure file share to your VM
> * Create and delete a share snapshot

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Getting started

### Create a storage account

Before you can work with an Azure file share, you must create an Azure storage account.

[!INCLUDE [storage-files-create-storage-account-portal](../../../includes/storage-files-create-storage-account-portal.md)]

### Create an Azure file share

Next, create an SMB Azure file share.

1. When the Azure storage account deployment is complete, select **Go to resource**.
1. Select **File shares** from the storage account pane.

   :::image type="content" source="media/storage-files-quick-create-use-windows/click-files.png" alt-text="Screenshot showing how to select file shares from the storage account pane.":::

1. Select **+ File Share**.

   :::image type="content" source="media/storage-files-quick-create-use-windows/create-file-share.png" alt-text="Screenshot showing how to create a new file share.":::

1. Name the new file share *qsfileshare* and leave **Transaction optimized** selected for **Tier**.
1. Select the **Backup** tab. By default, backup is enabled when you create an Azure file share using the Azure portal. To disable backup, uncheck the **Enable backup** checkbox. If backup is enabled, you can either leave the defaults or create a new Recovery Services Vault. To create a new backup policy, select **Create a new policy**.

   :::image type="content" source="media/storage-files-quick-create-use-windows/create-file-share-backup.png" alt-text="Screenshot showing how to enable or disable file share backup." border="true":::

1. Select **Review + create** and then **Create** to create the file share.
1. Create a new txt file called *qsTestFile* on your local machine.
1. Select the new file share, then on the file share location, select **Upload**.

   :::image type="content" source="media/storage-files-quick-create-use-windows/create-file-share-portal5.png" alt-text="Screenshot showing how to upload a file to the new file share.":::

1. Browse to the location where you created your .txt file > select *qsTestFile.txt* > select **Upload**.

### Deploy a VM

So far, you've created an Azure storage account and a file share with one file in it. Next, create an Azure VM with Windows Server 2019 Datacenter to represent the on-premises server.

1. Expand the menu on the left side of the portal and select **Create a resource** in the upper left-hand corner of the Azure portal.
1. Under **Popular services** select **Virtual machine**.
1. In the **Basics** tab, under **Project details**, select the resource group you created earlier.

   :::image type="content" source="media/storage-files-quick-create-use-windows/vm-resource-group-and-subscription.png" alt-text="Screenshot of the Basic tab with VM information filled out.":::

1. Under **Instance details**, name the VM *qsVM*.
1. For **Security type**, select **Standard**.
1. For **Image**, select **Windows Server 2019 Datacenter - x64 Gen2**.
1. Leave the default settings for **Region**, **Availability options**, and **Size**.
1. Under **Administrator account**, add a **Username** and enter a **Password** for the VM.
1. Under **Inbound port rules**, choose **Allow selected ports** and then select **RDP (3389)** and **HTTP** from the drop-down.
1. Select **Review + create**.
1. Select **Create**. Creating a new VM will take a few minutes to complete.
1. Once your VM deployment is complete, select **Go to resource**.

### Connect to your VM

Now that you've created the VM, connect to it so you can mount your file share.

1. Select **Connect** on the virtual machine properties page.

   :::image type="content" source="media/storage-files-quick-create-use-windows/connect-vm.png" alt-text="Screenshot of the VM tab, +Connect is highlighted.":::

1. In the **Connect to virtual machine** page, keep the default options to connect by **IP address** over **port number** *3389* and select **Download RDP file**.
1. Open the downloaded RDP file and select **Connect** when prompted.
1. In the **Windows Security** window, select **More choices** and then **Use a different account**. Type the username as *localhost\username*, where &lt;username&gt; is the VM admin username you created for the virtual machine. Enter the password you created for the virtual machine, and then select **OK**.

   :::image type="content" source="media/storage-files-quick-create-use-windows/local-host2.png" alt-text="Screenshot of the VM log in prompt, more choices is highlighted.":::


1. You may receive a certificate warning during the sign-in process. Select **Yes** or **Continue** to create the connection.

### Map the Azure file share to a Windows drive

1. In the Azure portal, navigate to the *qsfileshare* fileshare and select **Connect**.
1. Select a drive letter and then **Show script**.
1. Copy the script and paste it in **Notepad**.

   :::image type="content" source="media/storage-how-to-use-files-windows/files-portal-mounting-cmdlet-resize.png" alt-text="Screenshot that shows the contents of the box that you should copy and paste in Notepad." lightbox="media/storage-how-to-use-files-windows/files-portal-mounting-cmdlet-resize.png":::

1. In the VM, open **PowerShell** and paste in the contents of the **Notepad**, then press enter to run the command. It should map the drive.

## Create a share snapshot

Now that you've mapped the drive, create a snapshot.

1. In the portal, navigate to your file share, select **Snapshots**, then select **+ Add snapshot** and then **OK**.

   :::image type="content" source="media/storage-files-quick-create-use-windows/create-snapshot.png" alt-text="Screenshot of the storage account snapshots tab.":::


1. In the VM, open the *qstestfile.txt* and type "this file has been modified". Save and close the file.
1. Create another snapshot.

## Browse a share snapshot

1. On your file share, select **Snapshots**.
1. On the **Snapshots** tab, select the first snapshot in the list.

   :::image type="content" source="media/storage-files-quick-create-use-windows/snapshot-list.png" alt-text="Screenshot of the Snapshots tab, the first snapshot is highlighted.":::

1. Open that snapshot, and select *qsTestFile.txt*.

## Restore from a snapshot

1. From the file share snapshot tab, right-click the *qsTestFile*, and select the **Restore** button.

    :::image type="content" source="media/storage-files-quick-create-use-windows/restore-share-snapshot.png" alt-text="Screenshot of the snapshot tab, qstestfile is selected, restore is highlighted.":::

1. Select **Overwrite original file** and then select **OK**.

   :::image type="content" source="media/storage-files-quick-create-use-windows/snapshot-download-restore-portal.png" alt-text="Screenshot of the Restore pop up, overwrite original file is selected.":::

1. In the VM, open the file. The unmodified version has been restored.

## Delete a share snapshot

1. Before you can delete a share snapshot, you'll need to remove any locks on the storage account. Navigate to the storage account you created for this tutorial and select **Settings** > **Locks**. If any locks are listed, delete them.
1. On your file share, select **Snapshots**.
1. On the **Snapshots** tab, select the last snapshot in the list and select **Delete**.

   :::image type="content" source="media/storage-files-quick-create-use-windows/portal-snapshots-delete.png" alt-text="Screenshot of the Snapshots tab, the last snapshot is selected and the delete button is highlighted.":::

## Use a share snapshot in Windows

Just like with on-premises VSS snapshots, you can view the snapshots from your mounted Azure file share by using the **Previous versions** tab.

1. In File Explorer, locate the mounted share.

   :::image type="content" source="media/storage-files-quick-create-use-windows/snapshot-windows-mount.png" alt-text="Screenshot of a mounted share in File Explorer.":::

1. Select *qsTestFile.txt* and > right-click and select **Properties** from the menu.

   :::image type="content" source="media/storage-files-quick-create-use-windows/snapshot-windows-previous-versions.png" alt-text="Screenshot of the right click menu for a selected directory.":::

1. Select **Previous Versions** to see the list of share snapshots for this directory.

1. Select **Open** to open the snapshot.

   :::image type="content" source="media/storage-files-quick-create-use-windows/snapshot-windows-list.png" alt-text="Screenshot of the Previous versions tab.":::

## Restore from a previous version

1. Select **Restore**. This copies the contents of the entire directory recursively to the original location at the time the share snapshot was created.

   :::image type="content" source="media/storage-files-quick-create-use-windows/snapshot-windows-restore.png" alt-text="Screenshot of the Previous versions tab, the restore button in warning message is highlighted.":::
    
    > [!NOTE]
    > If your file hasn't changed, you won't see a previous version for that file because that file is the same version as the snapshot. This is consistent with how this works on a Windows file server.

## Clean up resources

[!INCLUDE [storage-files-clean-up-portal](../../../includes/storage-files-clean-up-portal.md)]

## Next steps

> [!div class="nextstepaction"]
> [Use an Azure file share with Windows](storage-how-to-use-files-windows.md)
