---
title: Azure Boot Diagnostics
description: Overview of Azure Boot Diagnostics and Managed Boot Diagnostics
services: virtual-machines
ms.service: virtual-machines
author: mimckitt
ms.author: mimckitt
ms.topic: conceptual
ms.date: 08/04/2020
---

# Azure Boot Diagnostics

Boot diagnostics is a debugging feature for Azure Virtual Machines (VM) that allows diagnosis of VM boot failures. Boot diagnostics enables a user to observe the state of their VM as it is booting up by collecting serial log information and screenshots.

## Boot Diagnostics Storage Account
By default, boot diagnostics is enabled for all VMs created using the Azure portal and utilizes a managed storage account. By using a managed storage account users gain a significant improvement in the time, it takes to create a VM. For this reason, we recommend customers use Boot Diagnostics with a managed storage account for all VMs.

> [!NOTE]
> Azure customers will not be charged for storage when opting to use boot diagnostics with a managed storage account until October 1, 2020.

An alternative Boot Diagnostics experience is to use a user-managed storage account. A user can either create a new storage account or use an existing one. For more information on user-managed storage accounts, see [storage account overview](https://docs.microsoft.com/azure/storage/common/storage-account-overview).

:::image type="content" source="./media/boot-diagnostics/boot-diagnostics-portal.png" alt-text="Screenshot to show how to enable boot diagnostics":::

## Boot Diagnostics View
Located in the Virtual Machine blade in the Azure portal, the Boot Diagnostics option is under the Support and Troubleshooting section. By viewing the boot diagnostics information users will find a screenshot and serial log tab. The serial log contains kernel messaging and the screenshot is a snapshot of your VMs current state. Based on if the VM is running Windows or Linux determines what the expected screenshot would look like. For Windows, if your VM creation is successful you will see a desktop background, and for Linux you will see a login prompt.

:::image type="content" source="./media/boot-diagnostics/boot-diagnostics-linux.png" alt-text="Screenshot of Linux boot diagnostics":::
:::image type="content" source="./media/boot-diagnostics/boot-diagnostics-windows.png" alt-text="Screenshot of Windows boot diagnostics":::


## Limitations
- The boot diagnostics is enabled for all Azure Resource Manager VMs. 
- This feature does not support premium storage accounts, if a premium storage account is used for boot diagnostics users may receive the `StorageAccountTypeNotSupported` error when starting the VM. 
- Serial Console is incompatible with a managed storage account for Boot Diagnostics

## Next Steps

Learn more about the [Azure Serial Console](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/serial-console-overview)
