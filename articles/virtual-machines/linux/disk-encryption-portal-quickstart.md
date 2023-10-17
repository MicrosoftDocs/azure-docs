---
title: Create and encrypt a Linux VM with the Azure portal
description: In this quickstart, you learn how to use the Azure portal to create and encrypt a Linux virtual machine
author: msmbaldwin
ms.author: mbaldwin
ms.service: virtual-machines
ms.subservice: disks
ms.topic: quickstart
ms.date: 01/04/2023
ms.custom: mode-ui, devx-track-linux
---

# Quickstart: Create and encrypt a virtual machine with the Azure portal

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

Azure virtual machines (VMs) can be created through the Azure portal. The Azure portal is a browser-based user interface to create VMs and their associated resources. In this quickstart you will use the Azure portal to deploy a Linux virtual machine (VM) running Ubuntu 18.04 LTS, create a key vault for the storage of encryption keys, and encrypt the VM. However, any [ADE supported Linux image version](/azure/virtual-machines/linux/disk-encryption-overview#supported-operating-systems) could be used instead of an Ubuntu VM.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual machine

1. Choose **Create a resource** in the upper left corner of the Azure portal.
1. In the New page, under Popular, select **Ubuntu Server 18.04 LTS**.
1. In the Basics tab, under Project details, verify sure the correct subscription is selected.
1. For "Resource Group", select **Create new**. Enter *myResourceGroup* as the name and select **Ok**.
1. For **Virtual machine name**, enter *MyVM*.
1. For **Region**, select *(US) East US*.
1. Make sure the **Size** is *Standard D2s v3*.
1. Under **Administrator account**, select *Password* as the **Authentication type**. Enter a user name and a password.

    :::image type="content" source="../media/disk-encryption/portal-quickstart-linux-vm-creation.png" alt-text="Linux VM creation screen":::

    > [!WARNING]
    > The "Disks" tab features an "Encryption Type" field under **Disk options**. This field is used to specify encryption options for [Managed Disks](../managed-disks-overview.md) + CMK, **not** for Azure Disk Encryption.
    >
    > To avoid confusion, we suggest you skip the *Disks* tab entirely while completing this tutorial.

1. Select the "Management" tab and verify that you have a Diagnostics Storage Account. If you have no storage accounts, select *Create New*, name your storage account *myStorageAccount*, and select "Ok"

    :::image type="content" source="../media/disk-encryption/portal-quickstart-vm-creation-storage.png" alt-text="ResourceGroup creation screen":::

1. Click "Review + Create".
1. On the **Create a virtual machine** page, you can see the details about the VM you are about to create. When you are ready, select **Create**.

It will take a few minutes for your VM to be deployed. When the deployment is finished, move on to the next section.

## Encrypt the virtual machine

1. When the VM deployment is complete, select **Go to resource**.
1. On the left-hand sidebar, select **Disks**.
1. On the top bar, select **Additional Settings** .
1. Under **Encryption settings** > **Disks to encrypt**, select **OS and data disks**.

    :::image type="content" source="../media/disk-encryption/portal-quickstart-disks-to-encryption.png" alt-text="Screenshot that highlights OS and data disks.":::

1. Under **Encryption settings**, choose **Select a key vault and key for encryption**.
1. On the **Select key from Azure Key Vault** screen, select **Create New**.

    :::image type="content" source="../media/disk-encryption/portal-qs-keyvault-create.png" alt-text="Screenshot that highlights Create new.":::

1. To the left of **Key vault and key**, select **Click to select a key**.
1. On the **Select key from Azure Key Vault**, under the **Key Vault** field, select **Create new**.
1. On the **Create key vault** screen, ensure that the Resource Group is *myResourceGroup*, and give your key vault a name.  Every key vault across Azure must have an unique name.
1. On the **Access Policies** tab, check the **Azure Disk Encryption for volume encryption** box.

    :::image type="content" source="../media/disk-encryption/portal-quickstart-keyvault-enable.png" alt-text="disks and encryption selection":::

1. Select **Review + create**.  
1. After the key vault has passed validation, select **Create**. This will return you to the **Select key from Azure Key Vault** screen.
1. Leave the **Key** field blank and choose **Select**.
1. At the top of the encryption screen, click **Save**. A popup will warn you that the VM will reboot. Click **Yes**.

## Clean up resources

When no longer needed, you can delete the resource group, virtual machine, and all related resources. To do so, select the resource group for the virtual machine, select Delete, then confirm the name of the resource group to delete.

## Next steps

In this quickstart, you created a Key Vault that was enabled for encryption keys, created a virtual machine, and enabled the virtual machine for encryption.  

> [!div class="nextstepaction"]
> [Azure Disk Encryption overview](disk-encryption-overview.md)
