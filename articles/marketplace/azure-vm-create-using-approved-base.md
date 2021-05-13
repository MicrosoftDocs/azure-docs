---
title: Create an Azure virtual machine offer (VM) from an approved base, Azure Marketplace
description: Learn how to create a virtual machine (VM) offer from an approved base.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: emuench
ms.author: krsh
ms.date: 04/16/2021
---

# How to create a virtual machine using an approved base

This article describes how to use Azure to create a virtual machine (VM) containing a pre-configured, endorsed operating system. If this isn't compatible with your solution, it's possible to [create and configure an on-premises VM](azure-vm-create-using-own-image.md) using an approved operating system.

> [!NOTE]
> Before you start this procedure, review the [technical requirements](marketplace-virtual-machines.md#technical-requirements) for Azure VM offers, including virtual hard disk (VHD) requirements.

## Select an approved base Image

Select one of the following Windows or Linux images as your base.

### Windows

- [Windows Server](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview)
- SQL Server [2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2019-ws2019?tab=Overview), [2014](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2014sp3-ws2012r2?tab=Overview), [2012](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2012sp4-ws2012r2?tab=Overview)

### Linux

Azure offers a range of approved Linux distributions. For a current list, see [Linux on distributions endorsed by Azure](../virtual-machines/linux/endorsed-distros.md).

## Create VM on the Azure portal

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
2. Select **Virtual machines**.
3. Select **+ Add** to open the **Create a virtual machine** screen.
4. Select the image from the dropdown list or select **Browse all public and private images** to search or browse all available virtual machine images.
5. To create a **Gen 2** VM, go to the **Advanced** tab and select the **Gen 2** option.

    :::image type="content" source="media/create-vm/vm-gen-option.png" alt-text="Select Gen 1 or Gen 2.":::

6. Select the size of the VM to deploy.

    :::image type="content" source="media/create-vm/create-virtual-machine-sizes.png" alt-text="Select a recommended VM size for the selected image.":::

7. Provide the other required details to create the VM.
8. Select **Review + create** to review your choices. When the **Validation passed** message appears, select  **Create**.

Azure begins provisioning the virtual machine you specified. Track its progress by selecting the **Virtual Machines** tab in the left menu. After it's created, the status of Virtual Machine changes to **Running**.

## Configure the VM

This section describes how to size, update, and generalize an Azure VM. These steps are necessary to prepare your VM to be deployed on Azure Marketplace.

### Connect to your VM

Refer to the following documentation to connect to your [Windows](../virtual-machines/windows/connect-logon.md) or [Linux](../virtual-machines/linux/ssh-from-windows.md#connect-to-your-vm) VM.

### Install the most current updates

[!INCLUDE [Discussion of most current updates](includes/most-current-updates.md)]

### Perform additional security checks

[!INCLUDE [Discussion of addition security checks](includes/additional-security-checks.md)]

### Perform custom configuration and scheduled tasks

[!INCLUDE [Discussion of custom configuration and scheduled tasks](includes/custom-config.md)]

[!INCLUDE [Discussion of addition security checks](includes/size-connect-generalize.md)]

## Next steps

- Recommended next step: [Test your VM image](azure-vm-image-test.md) to ensure it meets Azure Marketplace publishing requirements. This is optional.
- If you don't want to test your VM image, sign in to [Partner Center](https://partner.microsoft.com/) to publish your image.
- If you encountered difficulty creating your new Azure-based VHD, see [VM FAQ for Azure Marketplace](azure-vm-create-faq.md).
