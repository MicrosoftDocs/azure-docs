---
title: Create an SMB Azure file share and connect it to a Windows VM
description: This tutorial covers how to create an SMB Azure file share using the Azure portal, connect it to a Windows VM, and upload a file to the file share.
author: khdownie
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 10/22/2024
ms.author: kendownie
ms.custom: mode-ui
#Customer intent: As an IT admin new to Azure Files, I want to try out Azure file shares so I can determine whether I want to subscribe to the service.
---

# Tutorial: Create an SMB Azure file share and connect it to a Windows VM using the Azure portal

Azure Files offers fully managed file shares in the cloud that are accessible via the industry standard [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) or [Network File System (NFS) protocol](https://en.wikipedia.org/wiki/Network_File_System). In this tutorial, you'll learn a few ways you can use an SMB Azure file share in a Windows virtual machine (VM).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!div class="checklist"]
> * Create an Azure storage account
> * Create an SMB Azure file share
> * Deploy a VM
> * Connect to the VM
> * Mount the file share to your VM

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
1. In the service menu, under **Data storage**, select **File shares**.

   :::image type="content" source="media/storage-files-quick-create-use-windows/click-files.png" alt-text="Screenshot showing how to select file shares from the service menu.":::

1. Select **+ File Share**.

   :::image type="content" source="media/storage-files-quick-create-use-windows/create-file-share.png" alt-text="Screenshot showing how to create a new file share.":::

1. Name the new file share *qsfileshare* and leave **Transaction optimized** selected for **Tier**.
1. Select the **Backup** tab. By default, [backup is enabled](../../backup/backup-azure-files.md) when you create an Azure file share using the Azure portal. If you want to disable backup for the file share, uncheck the **Enable backup** checkbox. If you want backup enabled, you can either leave the defaults or create a new Recovery Services Vault in the same region and subscription as the storage account. To create a new backup policy, select **Create a new policy**.

   :::image type="content" source="media/storage-files-quick-create-use-windows/create-file-share-backup.png" alt-text="Screenshot showing how to enable or disable file share backup." border="true":::

1. Select **Review + create** and then **Create** to create the file share.
1. Create a new txt file called *qsTestFile* on your local machine.
1. Select the new file share, then on the file share location, select **Upload**.

   :::image type="content" source="media/storage-files-quick-create-use-windows/create-file-share-portal5.png" alt-text="Screenshot showing how to upload a file to the new file share.":::

1. Browse to the location where you created your .txt file > select *qsTestFile.txt* > select **Upload**.

### Deploy a VM

So far, you've created an Azure storage account and a file share with one file in it. Next, create an Azure VM to represent the on-premises server.

1. Select **Home**, and then select **Create a resource** in the upper left-hand corner of the Azure portal.
1. Under **Popular services**, select **Virtual machine**.
1. In the **Basics** tab, under **Project details**, select the resource group you created earlier.

   :::image type="content" source="media/storage-files-quick-create-use-windows/vm-resource-group-and-subscription.png" alt-text="Screenshot of the Basic tab with VM information filled out.":::

1. Under **Instance details**, name the VM *qsVM*.
1. Under **Availability options**, select **No infrastructure redundancy required**.
1. For **Security type**, select **Standard**.
1. For **Image**, select **Windows Server 2022 Datacenter: Azure Edition - x64 Gen2**.
1. Leave the default settings for **Region**, **VM architecture**, and **Size**.
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

1. You might receive a certificate warning during the sign-in process. Select **Yes** or **Continue** to create the connection.

### Map the Azure file share to a Windows drive

1. In the Azure portal, navigate to the *qsfileshare* fileshare and select **Connect**.
1. Select a drive letter and then **Show script**.
1. Copy the script from the Azure portal and paste it into **Notepad**, as in the following example.

   :::image type="content" source="media/storage-how-to-use-files-windows/files-portal-mounting-cmdlet-resize.png" alt-text="Screenshot that shows the script that you should copy from the Azure portal and paste into Notepad." lightbox="media/storage-how-to-use-files-windows/files-portal-mounting-cmdlet-resize.png":::

1. In the VM, open **PowerShell** and paste in the contents of the **Notepad**, then press enter to run the command. It should map the drive.

## Clean up resources

[!INCLUDE [storage-files-clean-up-portal](../../../includes/storage-files-clean-up-portal.md)]

## Next step

> [!div class="nextstepaction"]
> [Use an Azure file share with Windows](storage-how-to-use-files-windows.md)
