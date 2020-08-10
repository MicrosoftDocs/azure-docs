---
title: Azure boot diagnostics
description: Overview of Azure boot diagnostics and managed boot diagnostics
services: virtual-machines
ms.service: virtual-machines
author: mimckitt
ms.author: mimckitt
ms.topic: conceptual
ms.date: 08/04/2020
---

# Azure boot diagnostics

Boot diagnostics is a debugging feature for Azure virtual machines (VM) that allows diagnosis of VM boot failures. Boot diagnostics enables a user to observe the state of their VM as it is booting up by collecting serial log information and screenshots.

## Boot diagnostics storage account
By default, boot diagnostics is enabled for all VMs created using the Azure portal and utilizes a managed storage account. By using a managed storage account users gain a significant improvement in VM deployment time. For this reason, we recommend customers use boot diagnostics with a managed storage account for all VMs.

> [!NOTE]
> Azure customers will not be charged for storage when opting to use boot diagnostics with a managed storage account until November 2020. 

An alternative boot diagnostics experience is to use a custom storage account. A user can either create a new storage account or use an existing one. For more information on custom storage accounts, see [storage account overview](https://docs.microsoft.com/azure/storage/common/storage-account-overview).

:::image type="content" source="./media/boot-diagnostics/boot-diagnostics-portal.png" alt-text="Screenshot to show how to enable boot diagnostics":::

## Boot diagnostics View
Located in the virtual machine blade, the boot diagnostics option is under the *Support and Troubleshooting* section in the Azure portal. Selecting boot diagnostics will display a screenshot and serial log information. The serial log contains kernel messaging and the screenshot is a snapshot of your VMs current state. Based on if the VM is running Windows or Linux determines what the expected screenshot would look like. For Windows, users will see a desktop background and for Linux, users will see a login prompt.

:::image type="content" source="./media/boot-diagnostics/boot-diagnostics-linux.png" alt-text="Screenshot of Linux boot diagnostics":::
:::image type="content" source="./media/boot-diagnostics/boot-diagnostics-windows.png" alt-text="Screenshot of Windows boot diagnostics":::


## Limitations
- Boot diagnostics is only available for Azure Resource Manager (ARM) VMs. 
- Boot diagnostics does not support premium storage accounts, if a premium storage account is used for boot diagnostics users will receive an `StorageAccountTypeNotSupported` error when starting the VM. 
- Azure Serial Console does not currently support a managed storage account for boot diagnostics.

## Next Steps

Learn more about the [Azure Serial Console](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/serial-console-overview) and how to use boot diagnostics to [troubleshoot virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/boot-diagnostics).
