---
title: Configure SSHD on Azure Linux Virtual Machines | Microsoft Docs
description: Configure SSHD for security best practices and to lockdown SSH to Azure Linux Virtual Machines.
services: virtual-machines-linux
documentationcenter: ''
author: vlivech
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: hero-article
ms.date: 11/21/2016
ms.author: v-livech

---

# Configure SSHD on Azure Linux VMs

This article shows how to lockdown the SSH Server on Linux, to provide best practices security and also to speed up the SSH login process by using SSH keys instead of passwords.  To further lockdown SSHD we are going to disable the root user from being able to login, limit the users that are allowed to login via a approved group list, disabling SSH protocol v1, set a minimum key bit, and configure auto-logout of idle users.  The requirements for this article are: an Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/)) and [SSH public and private key files](virtual-machines-linux-mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Quick Commands

Configure `/etc/ssh/sshd_config` with the following settings.

### Disable password logins

```bash
PasswordAuthentication no
```

### Disable login by the root user

```bash
PermitRootLogin no
```

### Allowed groups list

```bash
AllowGroups wheel
```

### Allowed users list

```bash
AllowUsers ahmet ralph
```

### Disable SSH protocol V1

```bash
Protocol 2
```

### Minimum key bits

```bash
ServerKeyBits 2048
```

### Logout idle users

```bash
ClientAliveInterval 300
ClientAliveCountMax 0
```
