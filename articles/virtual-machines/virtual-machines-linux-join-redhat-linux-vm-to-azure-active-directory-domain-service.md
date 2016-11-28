---
title: Join a RedHat Linux VM to an Azure Active Directory DS | Microsoft Docs
description: How to join an existing RedHat Enterprise Linux 7 VM to an Azure Active Directory Domain Service.
services: virtual-machines-linux
documentationcenter: virtual-machines-linux
author: vlivech
manager: timlt
editor: ''

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 11/17/2016
ms.author: v-livech

---

# Join a RedHat Linux VM to an Azure Active Directory Domain Service

This article shows you how to join a Red Hat Enterprise Linux (RHEL) 7 virtual machine to an Azure Active Directory Domain Services (AADDS) managed domain.  The requirements are:

- [an Azure account](https://azure.microsoft.com/pricing/free-trial/)

- [SSH public and private key files](virtual-machines-linux-mac-create-ssh-keys.md)

- [an Azure Active Directory Domain Services DC](../active-directory-domain-services/active-directory-ds-getting-started.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Quick Commands

Replace any examples with your own settings.

### Switch the azure-cli to classic deployment mode

```azurecli
azure config mode asm
```

### Search for a RHEL version and image

```azurecli
azure vm image list | grep "Red Hat"
```

### Create a Redhat Linux VM

```azurecli
azure vm create myVM \
-o a879bbefc56a43abb0ce65052aac09f3__RHEL_7_2_Standard_Azure_RHUI-20161026220742 \
-g ahmet \
-p P@ssw0rd! \
-z "Small" \
-e \
-l "West US"
```

### SSH to the VM

```bash
ssh -i ~/.ssh/id_rsa ahmet@
```

### Update YUM packages

```bash
sudo yum update
```

### Install packages needed

```bash
sudo yum -y install realmd sssd krb5-workstation krb5-libs
```

Now that the required packages are installed on the Linux virtual machine, the next task is to join the virtual machine to the managed domain.

### Discover the AAD Domain Services managed domain

```bash
sudo realm discover mydomain.com
```

### Initialize kerberos

Ensure that you specify a user who belongs to the 'AAD DC Administrators' group. Only these users can join computers to the managed domain.

```bash
kinit ahmet@mydomain.com
```

### Join the machine to the domain

```bash
sudo realm join --verbose mydomain.com -U 'ahmet@mydomain.com'
```

### Verify the machine is joined to the domain

```bash
ssh -l ahmet@mydomain.com mydomain.cloudapp.net
```

## Next Steps

* [Red Hat Update Infrastructure (RHUI) for on-demand Red Hat Enterprise Linux VMs in Azure](virtual-machines-linux-update-infrastructure-redhat?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Set up Key Vault for virtual machines in Azure Resource Manager](virtual-machines-linux-key-vault-setup?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Deploy and manage virtual machines by using Azure Resource Manager templates and the Azure CLI](virtual-machines-linux-cli-deploy-templates?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
