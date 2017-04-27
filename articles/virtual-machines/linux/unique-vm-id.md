---
title: Get an Azure Linux VM ID  | Microsoft Docs
description: Describes how to get and use an Azure Linux VM Unique ID.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: kmouss
manager: timlt
editor: ''

ms.assetid: 136c5d28-ff6b-4466-b27f-7a29785b5d27
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 01/23/2017
ms.author: kmouss

---
# Accessing and Using Azure VM Unique ID
Azure VM unique ID is a 128bits identifier encoded and stored in all Azure IaaS VM’s SMBIOS and can currently be read using platform BIOS commands.

Azure VM unique ID is a Read-only property. Azure Unique VM ID won’t change upon reboot shutdown (either planned for unplanned), Start/Stop de-allocate, service healing or restore in place. However, if the VM is a snapshot and copied to create a new instance, new Azure VM ID is configured.

> [!NOTE]
> If you have older VMs created and running since this new feature got rolled out (September 18, 2014), please restart your VM to automatically get an Azure unique ID.
> 
> 

To access Azure Unique VM ID from within the VM:

## Create a VM
For more information, see [Create a Virtual Machine](../windows/creation-choices.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Connect to the VM
For more information, see [SSH from Linux](mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Query VM Unique ID
Command (example uses **Ubuntu**):

```bash
sudo dmidecode | grep UUID
```

Example Expected Results:

```bash
UUID: 090556DA-D4FA-764F-A9F1-63614EDA019A
```

Due to Big Endian bit ordering, the actual Unique VM ID in this case will be:

```bash
DA 56 05 09 – FA D4 – 4f 76 - A9F1-63614EDA019A
```

Azure VM unique ID can be used in different scenarios whether the VM is running on Azure or on-premises and can help your licensing, reporting or general tracking requirements you may have on your Azure IaaS deployments. Many independent software vendors building applications and certifying them on Azure may require to identify an Azure VM throughout its lifecycle and to tell if the VM is running on Azure, on-Premises or on other cloud providers. This platform identifier can for example help detect if the software is properly licensed or help to correlate any VM data to its source such as to assist on setting the right metrics for the right platform and to track and correlate these metrics amongst other uses.

