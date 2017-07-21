---
title: Overview of backing up and restoring Windows VMs in Azure | Microsoft Docs
description: Overview of protecting your Windows VMs by backing them up using Azure Backup.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/20/2017
ms.author: cynthn
---

# Backup and restore options for Windows virtual machines in Azure
You can protect your data by taking backups at regular intervals. Azure Backup creates recovery points that are stored in geo-redundant recovery vaults. When you restore from a recovery point, you can restore the whole VM or just specific files. 

## Recovery Services


Recovery services vaults protect:

Azure Resource Manager-deployed VMs
Classic VMs
Standard storage VMs
Premium storage VMs
VMs running on Managed Disks
VMs encrypted using Azure Disk Encryption, with BEK and KEK
Application consistent backup of Windows VMs using VSS and Linux VMs using custom pre-snapshot and post-snapshot scripts

For more information on protecting Premium storage VMs, see the article, Back up and Restore Premium Storage VMs. For more information on support for managed disk VMs, see Back up and restore VMs on managed disks. For more information on pre and post-script framework for Linux VM backup see Application consistent Linux VM backup using pre-script and post-script.

To find out more about what can you backup and what you can't, refer here

## Backup extension

Once the VM Agent is installed on the virtual machine, the Azure Backup service installs the backup extension to the VM Agent. The Azure Backup service seamlessly upgrades and patches the backup extension without additional user intervention.

The Backup service installs the backup extension, even if the VM is not running. A running VM provides the greatest chance of getting an application-consistent recovery point. However, the Azure Backup service continues to back up the VM even if it is turned off, and the extension could not be installed. This type of backup is known as Offline VM, and the recovery point is crash consistent.