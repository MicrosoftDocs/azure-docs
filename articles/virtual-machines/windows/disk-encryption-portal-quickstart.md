---
title: Create and encrypt a Windows VM with the Azure portal
description: In this quickstart, you learn how to use the Azure portal to create and encrypt a Windows virtual machine
author: msmbaldwin
ms.author: mbaldwin
ms.service: virtual-machines-windows
ms.subservice: security
ms.topic: quickstart
ms.date: 10/02/2019
---

# Quickstart: Create and encrypt a Windows virtual machine with the Azure portal

Azure virtual machines (VMs) can be created through the Azure portal. The Azure portal is a browser-based user interface to create VMs and their associated resources. In this quickstart you will use the Azure portal to deploy a Windows virtual machine, create a key vault for the storage of encryption keys, and encrypt the VM.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).


## Create a virtual machine

1. Choose **Create a resource** in the upper left corner of the Azure portal.
1. In the New page, under Popular, select **Windows Server 2016 Datacenter**.
1. In the Basics tab, under Project details, make sure the correct subscription is selected and then choose to **Create new resource group**. Enter *myResourceGroup* as the name.
1. For **Virtual machine name**, enter *MyVM*.
1. For **Region**, select the same region you used when making your key vault above (e.g., *East US*).
1. Make sure the **Size** is *Standard D2s v3*.
1. Under **Administrator account**, select **Password**. Enter a user name and a password.

    :::image type="content" source="../media/disk-encryption/portal-qs-windows-vm-creation.png" alt-text="ResourceGroup creation screen":::

    > [!WARNING]
    > The "Disks" tab features an "Encryption Type" field under **Disk options**. This field is used to specify encryption options for [Managed Disks](managed-disks-overview.md) + CMK, not for Azure Disk Encryption. 
    >
    > To avoid confusion, we suggest you skip the *Disks* tab entirely while completing this tutorial. 

1. Select the "Management" tab and verify that you have a Diagnostics Storage Account. If you have no storage accounts, select "Create New", give your new account a name, and select "Ok"

    :::image type="content" source="../media/disk-encryption/portal-qs-vm-creation-storage.png" alt-text="ResourceGroup creation screen":::

1. Click "Review + Create".
1. On the **Create a virtual machine** page, you can see the details about the VM you are about to create. When you are ready, select **Create**.

It will take a few minutes for your VM to be deployed. When the deployment is finished, move on to the next section.

## Encrypt the virtual machine

1. When the VM deployment is complete, select **Go to resource**.
1. On the left-hand sidebar, select **Disks**.
1. On the Disks screen, select **Encryption**. 

    :::image type="content" source="../media/disk-encryption/portal-qs-disks-to-encryption.png" alt-text="disks and encryption selection":::

1. On the encryption screen, under **Disks to encrypt**, choose **OS and data disks**.
1. Under **Encryption settings**, choose **Select a key vault and key for encryption**.
1. On the **Select key from Azure Key Vault** screen, select **Create New**.

    :::image type="content" source="../media/disk-encryption/portal-qs-keyvault-create.png" alt-text="disks and encryption selection":::

1. On the **Create key vault** screen, ensure that the Resource Group is the same as the one you used to create the VM.
1. Give your key vault a name.  Every key vault across Azure must have an unique name.
1. On the **Access Policies** tab, check the **Azure Disk Encryption for volume encryption** box.

    :::image type="content" source="../media/disk-encryption/portal-qs-keyvault-enable.png" alt-text="disks and encryption selection":::

1. Select **Review + create**.  
1. After the key vault has passed validation, select **Create**. This will return you to the **Select key from Azure Key Vault** screen.
1. Leave the **Key** field blank and choose **Select**.
1. At the top of the encryption screen, click **Save**. A popup will warn you that the VM will reboot. Click **Yes**.


## Clean up resources

When no longer needed, you can delete the resource group, virtual machine, and all related resources. To do so, select the resource group for the virtual machine, select Delete, then confirm the name of the resource group to delete.

## Next steps

In this quickstart, you created a Key Vault that was enable for encryption keys, created a virtual machine, and enabled the virtual machine for encryption.  

> [!div class="nextstepaction"]
> [Azure Disk Encryption overview](disk-encryption-overview.md)
