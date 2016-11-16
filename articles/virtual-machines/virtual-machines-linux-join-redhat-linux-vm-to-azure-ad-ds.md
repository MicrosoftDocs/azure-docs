<properties
    pageTitle="Join a RedHat Linux VM to an Azure Active Directory | Microsoft Azure"
    description="How to join an existing RedHat Enterprise Linux 7 VM to an Azure Active Directory."
    services="virtual-machines-linux"
    documentationCenter=""
    authors="vlivech"
    manager="timlt"
    editor=""
    tags="azure-resource-manager"
/>

<tags
    ms.service="virtual-machines-linux"
    ms.workload="infrastructure-services"
    ms.tgt_pltfrm="vm-linux"
    ms.devlang="na"
    ms.topic="hero-article"
    ms.date="11/16/2016"
    ms.author="v-livech"
/>

# Join a RedHat Linux VM to an Azure Active Directory

This article shows you how to join a Red Hat Enterprise Linux (RHEL) 7 virtual machine to an Azure AD Domain Services managed domain.  The requirements are:

- [an Azure account](https://azure.microsoft.com/pricing/free-trial/)

- [SSH public and private key files](virtual-machines-linux-mac-create-ssh-keys.md)

## Quick Commands

### Create a Redhat Linux VM

```bash
azure vm quick-create \
-n myVM \
-g myResourceGroup \
-l westus \
-y Linux \
-u ahmet \
-M ~/.ssh/id_rsa \
-Q RHEL
```

### Update YUM packages

```bash
sudo yum update
```

### Install packages needed

```bash
sudo yum install realmd sssd krb5-workstation krb5-libs
```

Now that the required packages are installed on the Linux virtual machine, the next task is to join the virtual machine to the managed domain.

### Discover the AAD Domain Services managed domain

```bash
sudo realm discover CONTOSO100.COM
```

### Initialize kerberos.

Ensure that you specify a user who belongs to the 'AAD DC Administrators' group. Only these users can join computers to the managed domain.

```bash
kinit bob@CONTOSO100.COM
```

### Join the machine to the domain

```bash
sudo realm join --verbose CONTOSO100.COM -U 'bob@CONTOSO100.COM'
```

### Verify the machine is joined to the domain

```bash
ssh -l bob@CONTOSO100.COM contoso-rhel.cloudapp.net
```
