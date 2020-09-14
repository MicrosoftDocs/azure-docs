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

## Boot Diagnostics Storage Account
When creating a VM in Azure portal, Boot Diagnostics is enabled by default. The recommended Boot Diagnostics experience is to use a managed storage account, as it yields significant performance improvements in the time to create an Azure VM. This is because an Azure managed storage account will be used, removing the time it takes to create a new user storage account to store the boot diagnostics data.

An alternative Boot Diagnostics experience is to use a user managed storage account. A user can either create a new storage account or use an existing one.

> [!IMPORTANT]
> Azure customers will not be charged for the storage costs associated with boot diagnostics using a managed storage account through October 2020.

## Boot diagnostics view
Located in the virtual machine blade, the boot diagnostics option is under the *Support and Troubleshooting* section in the Azure portal. Selecting boot diagnostics will display a screenshot and serial log information. The serial log contains kernel messaging and the screenshot is a snapshot of your VMs current state. Based on if the VM is running Windows or Linux determines what the expected screenshot would look like. For Windows, users will see a desktop background and for Linux, users will see a login prompt.

:::image type="content" source="./media/boot-diagnostics/boot-diagnostics-linux.png" alt-text="Screenshot of Linux boot diagnostics":::
:::image type="content" source="./media/boot-diagnostics/boot-diagnostics-windows.png" alt-text="Screenshot of Windows boot diagnostics":::


## Limitations
- Boot diagnostics is only available for Azure Resource Manager VMs. 
- Boot diagnostics does not support premium storage accounts, if a premium storage account is used for boot diagnostics users will receive an `StorageAccountTypeNotSupported` error when starting the VM. 
- Managed storage accounts are supported in Resource Manager API version "2020-06-01" and later.
- Azure Serial Console is currently incompatible with a managed storage account for Boot Diagnostics. Learn more about [Azure Serial Console](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/serial-console-overview).

## Next steps

Learn more about the [Azure Serial Console](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/serial-console-overview) and how to use boot diagnostics to [troubleshoot virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/boot-diagnostics).
