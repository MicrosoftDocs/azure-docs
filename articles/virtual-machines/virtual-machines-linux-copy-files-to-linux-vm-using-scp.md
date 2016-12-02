---
title: Copy files to a Linux VM using SCP | Microsoft Docs
description: Copy files to a Azure Linux VM using SCP.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: vlivech
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.workload: infrastructure
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 12/01/2016
ms.author: v-livech

---

# Copy files to a Linux VM using SCP

This article shows how to copy files from your workstation up to an Azure Linux VM, or from the Azure Linux VM down to your workstation, using SCP.  SCP is based on the BSD RCP protocol.  SCP uses SSH for the transport layer.  By using SSH for the transport, SCP uses SSH for authentication on the destination host while also moving the file in an encrypted tunnel provided by default by SSH.  SCP is the best practice way to move files to and from Azure Linux VMs as its secure and uses the existing SSH authentication that is already configured on the Linux VM.  For SSH authentication usernames and passwords can be used but SSH public and private key authentication is strongly suggested as a security best practice.  

For this article the requirements are:

- [an Azure account](https://azure.microsoft.com/pricing/free-trial/)

- [SSH public and private key files](virtual-machines-linux-mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Quick commands

Copy file up to the Linux VM

```bash
scp file user@host:directory/targetfile
```

Copy file down from the Linux VM

```bash
scp user@host:directory/file targetfile
```

## Detailed walkthrough
