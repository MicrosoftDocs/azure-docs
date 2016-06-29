<properties
		pageTitle="Add a user to a Linux VM on Azure | Microsoft Azure"
		description="Add a user to a Linux VM on Azure."
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
		ms.topic="article"
		ms.date="03/04/2016"
		ms.author="v-livech"
/>

# Add a user to an Azure VM

With any newly launched Linux VM one of the first tasks is to create a new user.  In this article we will walk through creating a sudo user account, setting the password, adding SSH Public Keys, and finally use `visudo` to allow sudo without a password.

Prerequisites are: [an Azure account](https://azure.microsoft.com/pricing/free-trial/), [SSH public and private keys](virtual-machines-linux-mac-create-ssh-keys.md), an Azure resource group, and the Azure CLI installed and switched to Azure Resource Manager mode using `azure config mode arm`.

## Quick Commands

```bash
# Add a new user on RedHat family distros
bill@slackware$ sudo useradd -G wheel exampleUser

# Add a new user on Debian family distros
bill@slackware$ sudo useradd -G sudo exampleUser

# Set a password
bill@slackware$ sudo passwd exampleUser
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully

# Copy the SSH Public Key to the new user
bill@slackware$ ssh-copy-id -i ~/.ssh/id_rsa exampleuser@exampleserver

# Change sudoers to allow no password
# Execute visudo as root to edit the /etc/sudoers file
bill@slackware$ visudo

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
exampleuser@exampleserver$ sudo top
```

## Detailed Walkthrough

### Introduction

One of the first and most common tasks with a new server is to add a user account.  Root logins should always be disabled and even the root account itself should not ever be used with your Linux server, only sudo.  Creating a new user and then giving that new user root escalation privileges using sudo is the proper way to administer and use Linux.  

The command we will be using is `useradd` which modifies `/etc/passwd`, `/etc/shadow`, `/etc/group` and `/etc/gshadow` to create the new Linux user.  We will add a command line flag to the `useradd` command to also add the new user to the proper sudo group on Linux.  Although `useradd` creates an entry into `/etc/passwd` it does not give the new user account a password.  We will create an initial password for the new user using the very simple `passwd` command.  The last step will be to modify the sudo rules to allow our user to execute commands with sudo privileges without having to enter a password for every command.  Since the user has logged in using the Public and Private key pair we are assuming that user account is safe from bad actors and will allow sudo access without a password.  

### Adding a single sudo user to an Azure VM

Login to the Azure VM using SSH keys.  If you have not setup SSH public key access complete this article first [Using Public Key Authentication with Azure](http://link.to/article).  

The `useradd` command will complete the following tasks:

- create a new user account
- create a new user group with the same name
- add a blank entry to `/etc/passwd`
- add a blank entry to `/etc/gpasswd`

The `-G` command line flag will add the new user account to the proper Linux group giving the new user account root escalation privileges.

#### Add the user

```bash
# On RedHat family distros
bill@slackware$ sudo useradd -G wheel exampleUser

# On Debian family distros
bill@slackware$ sudo useradd -G sudo exampleUser
```

#### Set a password

The `useradd` command creates the new user and adds an entry to both `/etc/passwd` and `/etc/gpasswd` but does not actually set the password.  We will do that now using the `passwd` command.

```bash
bill@slackware$ sudo passwd exampleUser
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
```

We now have a user with sudo privileges on the server.

### Add your SSH Public Key to the new user account

From your machine use the `ssh-copy-id` command with the new password you just just set.

```bash
bill@slackware$ ssh-copy-id -i ~/.ssh/id_rsa exampleuser@exampleserver
```

### Using visudo to allow sudo usage without a password

Using `visudo` to edit the `/etc/sudoers` file adds a few layers of protection against incorrectly modifying this very important file.  Upon executing `visudo` the `/etc/sudoers` file is locked to ensure noone else can make changes while it is actively being edited.  The `/etc/sudoers` file is also checked for mistakes by `visudo` when you attempt to save or exit.  This ensures that you cannot leave a broken sudoers file on the system.

We already have users in the correct default group for sudo access.  Now we will enable those groups to use sudo with no password.

```bash
# Execute visudo as root to edit the /etc/sudoers file
bill@slackware$ visudo

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

### Verify the user, ssh keys and sudo

```bash
# Verify the SSH keys & User account
bill@slackware$ ssh -i ~/.ssh/id_rsa exampleuser@exampleserver

# Verify sudo access
exampleuser@exampleserver$ sudo top
```
