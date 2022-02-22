---
title: Tutorial - Create and use Azure NFS file shares on Linux VMs
description: This tutorial covers how to create and use an Azure file share in the Azure portal using the NFS protocol. Connect it to a Linux VM, connect to the file share, and upload a file to the file share.
author: khdownie
ms.service: storage
ms.topic: tutorial
ms.date: 02/22/2022
ms.author: kendownie
ms.subservice: files
ms.custom: mode-ui
#Customer intent: As an IT admin new to Azure Files, I want to try out Azure file share so I can determine whether I want to subscribe to the service.
---

# Tutorial: Create and manage Azure file shares with Linux virtual machines via the Azure portal

Azure Files offers fully managed file shares in the cloud that are accessible via the industry standard [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) or [Network File System (NFS) protocol](https://en.wikipedia.org/wiki/Network_File_System). In this tutorial, you will learn a few ways you can use an Azure file share in a Linux virtual machine (VM) using the NFS protocol.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!div class="checklist"]
> * Create a storage account
> * Create a virtual network
> * Create a file share
> * Deploy a VM
> * Connect to a VM
> * Mount an Azure file share to your VM
> * Create and delete a share snapshot??

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Getting started

### Create a storage account

Before you can work with an NFS Azure file share, you have to create an Azure storage account with the Premium performance tier. Premium is the only tier that supports NFS Azure file shares.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the Azure portal menu, select **All services**. In the list of resources, type **Storage Accounts**. As you begin typing, the list filters based on your input. Select **Storage Accounts**.
1. On the **Storage Accounts** window that appears, choose **+ Create**.
1. On the **Basics** tab, select the subscription in which to create the storage account.
1. Under the **Resource group** field, select your desired resource group, or select **Create new** to create a new resource group.
1. Next, enter a name for your storage account. The name you choose must be unique across Azure. The name also must be between 3 and 24 characters in length, and may include only numbers and lowercase letters.
1. Select a region for your storage account, or use the default region. Azure NFS file shares is supported in all the same regions that support premium file storage.
1. Select the *Premium* performance tier to store your data on solid-state drives (SSD). 
1. Under **Premium account type**, select *File shares*.
1. Leave replication set to its default value of *Locally-redundant storage (LRS)*.
1. Select **Review + Create** to review your storage account settings and create the account.
1. When you see the **Validation passed** notification appear, select **Create**. You should see a notification that deployment is in progress.

The following image shows the settings on the **Basics** tab for a new storage account:

:::image type="content" source="media/storage-files-quick-create-use-linux/account-create-portal.png" alt-text="Screenshot showing how to create a storage account in the Azure portal." lightbox="media/storage-files-quick-create-use-linux/account-create-portal.png":::

### Create a virtual network

The NFS protocol can only be used from a machine inside of a virtual network, so for this tutorial, you'll create a virtual network using the same Azure subscription and region as your storage account.

1. Select **Home** and then **Create a resource**.

### Create an NFS Azure file share

Next, create an NFS file share.

1. Select **Home** and then **Storage accounts**.
1. Select **File shares** from the storage account pane.

    :::image type="content" source="media/storage-files-quick-create-use-linux/click-files.png" alt-text="Screenshot showing how to select file shares from the storage account pane.":::

1. Select **+ File Share**.

    :::image type="content" source="media/storage-files-quick-create-use-linux/create-file-share.png" alt-text="Screenshot showing how to select + file share to create a new file share.":::

1. Name the new file share *qsfileshare* and enter "100" for the minimum **Provisioned capacity**, or provision more capacity (up to 102,400 GiB) to get more performance. Select NFS protocol, leave **No Root Squash** selected, and select **Create**.

    :::image type="content" source="media/storage-files-quick-create-use-linux/create-nfs-share.png" alt-text="Screenshot showing how to name the file share and provision capacity to create a new NFS file share." lightbox="media/storage-files-quick-create-use-linux/create-nfs-share.png" border="true":::

1. Select the file share *qsfileshare* or click on the message *You can only access NFS shares from trusted networks. To complete the storage account configuration, review your options below*. You should see a dialog that says *Connect to this NFS share from Linux*.

    :::image type="content" source="media/storage-files-quick-create-use-linux/connect-from-linux.png" alt-text="Screenshot showing how to configure network and secure transfer settings to connect the NFS share from Linux." lightbox="media/storage-files-quick-create-use-linux/connect-from-linux.png" border="true":::

1. Under **Network configuration**, select **Review options**, and then select **Setup a private endpoint**.

    :::image type="content" source="media/storage-files-quick-create-use-linux/configure-network-security.png" alt-text="Screenshot showing network-level security configurations." lightbox="media/storage-files-quick-create-use-linux/configure-network-security.png" border="true":::

1. Select **+ Private endpoint**.

    :::image type="content" source="media/storage-files-quick-create-use-linux/create-private-endpoint.png" alt-text="Screenshot showing how to select + private endpoint to create a new private endpoint.":::

1. Leave **Subscription** and **Resource group** the same. Under **Instance**, provide a name and select a region for the new private endpoint. Your private endpoint must be in the same region as your virtual network. When all the fields are complete, select **Next: Resource**.

    :::image type="content" source="media/storage-files-quick-create-use-linux/private-endpoint-basics.png" alt-text="Screenshot showing how to provide the project and instance details for a new private endpoint." lightbox="media/storage-files-quick-create-use-linux/private-endpoint-basics.png" border="true":::

1. Confirm that the **Subscription**, **Resource type** and **Resource** are correct, and then select **Next: Virtual Network**.

1. Disable secure transfer.


## Clean up resources

[!INCLUDE [storage-files-clean-up-portal](../../../includes/storage-files-clean-up-portal.md)]

## Next steps

> [!div class="nextstepaction"]
> [Use an Azure file share with Linux](storage-how-to-use-files-linux.md)