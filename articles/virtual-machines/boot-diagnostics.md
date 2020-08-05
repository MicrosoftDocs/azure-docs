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

Boot diagnostics is a debugging feature for Azure Virtual Machines (VM) that allows you to easily diagnose your VM boot failures. Boot diagnostics enables a user to observe the state of their VM as it is booting up by collecting serial log information as well as screenshots. This feature is available for VMs created using the Resource Manager deployment model. 

## Boot Diagnostics Storage Account
When creating a VM in Azure Portal, Boot Diagnostics is enabled by default. The recommended Boot Diagnostics experience is to use a managed storage account, as it yields significant performance improvements in the time to create an Azure VM. This is because an Azure managed storage account will be used, removing the time it takes to create a new user storage account to store the boot diagnostics data. For this reason, we recommend customers use Boot Diagnostics enabled with a managed storage account. In this case, the user is not the owner of the storage account.

An alternative Boot Diagnostics experience is to use a user managed storage account. A user can either create a new storage account or use an existing one.

<INSERT PHOTO>

## Boot Diagnostics View
In the VM view, the Boot Diagnostics option is under the Support and Troubleshooting section. Here you will find a Screenshot and Serial Log tab. The serial log contains kernel messaging and the screenshot is an image of your VM’s current state. The screenshot will look different between Linux and Windows machines. For Windows if your VM creation is successful you will see a desktop background, and for Linux you will see a login prompt.

<INSERT PHOTO>

## Use Cases

If your VM is experiencing a boot failure you will be able to investigate and understand what happened to the VM. In order to interact with the VM and recover it, you will need to use Serial Console which supports advanced debugging operations. Serial Console requires that Boot Diagnostics be enabled. Currently, Serial Console is incompatible with a managed storage account for Boot Diagnostics. To utilize Serial Console you will need to use a custom storage account. 

## Limitations
The Boot Diagnostics feature does not support premium storage accounts. If you use a premium storage account for Boot Diagnostics you may receive the StorageAccountTypeNotSupported error when you start the VM. 
Azure customers will not be charged for storage when selecting the enabled with managed storage account option until October 1, 2020.
Link to CLI commands, PS commands

## Next Steps

Learn more about the [Azure Serial Console](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/serial-console-overview)
