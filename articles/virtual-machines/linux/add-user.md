---
title: Add a user to a Linux VM on Azure | Microsoft Docs
description: Add a user to a Linux VM on Azure.
services: virtual-machines-linux
documentationcenter: ''
author: vlivech
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: f8aa633b-8b75-45d7-b61d-11ac112cedd5
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 08/18/2016
ms.author: v-livech

---
# Add a user to an Azure VM
One of the first tasks on any new Linux VM is to create a new user.  In this article, we walk through creating a sudo user account, setting the password, adding SSH Public Keys, and finally use `visudo` to allow sudo without a password.

Prerequisites are: [an Azure account](https://azure.microsoft.com/pricing/free-trial/), [SSH public and private keys](mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), an Azure resource group, and the Azure CLI installed and switched to Azure Resource Manager mode using `azure config mode arm`.

## Quick Commands
```bash
# Add a new user on RedHat family distros
sudo useradd -G wheel exampleUser

# Add a new user on Debian family distros
sudo useradd -G sudo exampleUser

# Set a password
sudo passwd exampleUser
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully

# Copy the SSH Public Key to the new user
ssh-copy-id -i ~/.ssh/id_rsa exampleuser@exampleserver

# Change sudoers to allow no password
# Execute visudo as root to edit the /etc/sudoers file
visudo

# On RedHat family distros uncomment this line:
## Same thing without a password
# %wheel        ALL=(ALL)       NOPASSWD: ALL

# to this
## Same thing without a password
%wheel        ALL=(ALL)       NOPASSWD: ALL

# On Debian family distros change this line:
# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL

# to this
%sudo   ALL=(ALL) NOPASSWD:ALL

# Verify everything
# Verify the SSH keys & User account
bill@slackware$ ssh -i ~/.ssh/id_rsa exampleuser@exampleserver

# Verify sudo access
sudo top
```

## Detailed Walkthrough
### Introduction
One of the first and most common task with a new server is to add a user account.  Root logins should be disabled and the root account itself should not be used with your Linux server, only sudo.  Giving a user root escalation privileges using sudo it the proper way to administer and use Linux.

Using the command `useradd` we are adding user accounts to the Linux VM.  Running `useradd` modifies `/etc/passwd`, `/etc/shadow`, `/etc/group`, and `/etc/gshadow`.  We are adding a command-line flag to the `useradd` command to also add the new user to the proper sudo group on Linux.  Even thou `useradd` creates an entry into `/etc/passwd` it does not give the new user account a password.  We are creating an initial password for the new user using the simple `passwd` command.  The last step is to modify the sudo rules to allow that user to execute commands with sudo privileges without having to enter a password for every command.  Logging in using the Private key we are assuming that user account is safe from bad actors and are going to allow sudo access without a password.  

### Adding a single sudo user to an Azure VM
Log in to the Azure VM using SSH keys.  If you have not setup SSH public key access, complete this article first [Using Public Key Authentication with Azure](http://link.to/article).  

The `useradd` command completes the following tasks:

* create a new user account
* create a new user group with the same name
* add a blank entry to `/etc/passwd`
* add a blank entry to `/etc/gpasswd`

The `-G` command-line flag adds the new user account to the proper Linux group giving the new user account root escalation privileges.

#### Add the user
```bash
# On RedHat family distros
sudo useradd -G wheel exampleUser

# On Debian family distros
sudo useradd -G sudo exampleUser
```

#### Set a password
The `useradd` command creates the user and adds an entry to both `/etc/passwd` and `/etc/gpasswd` but does not actually set the password.  The password is added to the entry using the `passwd` command.

```bash
sudo passwd exampleUser
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
```

We now have a user with sudo privileges on the server.

### Add your SSH Public Key to the new user account
From your machine, use the `ssh-copy-id` command with the new password.

```bash
ssh-copy-id -i ~/.ssh/id_rsa exampleuser@exampleserver
```

### Using visudo to allow sudo usage without a password
Using `visudo` to edit the `/etc/sudoers` file adds a few layers of protection against incorrectly modifying this important file.  Upon executing `visudo`, the `/etc/sudoers` file is locked to ensure no other user can make changes while it is actively being edited.  The `/etc/sudoers` file is also checked for mistakes by `visudo` when you attempt to save or exit so you cannot save a broken sudoers file.

We already have users in the correct default group for sudo access.  Now we are going to enable those groups to use sudo with no password.

```bash
# Execute visudo as root to edit the /etc/sudoers file
visudo

# On RedHat family distros uncomment this line:
## Same thing without a password
# %wheel        ALL=(ALL)       NOPASSWD: ALL

# to this
## Same thing without a password
%wheel        ALL=(ALL)       NOPASSWD: ALL

# On Debian family distros change this line:
# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL

# to this
%sudo   ALL=(ALL) NOPASSWD:ALL
```

### Verify the user, ssh keys, and sudo
```bash
# Verify the SSH keys & User account
ssh -i ~/.ssh/id_rsa exampleuser@exampleserver

# Verify sudo access
sudo top
```
