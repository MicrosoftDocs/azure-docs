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
ms.topic: article
ms.date: 11/21/2016
ms.author: v-livech

---

# Configure SSHD on Azure Linux VMs

This article shows how to lockdown the SSH Server on Linux, to provide best practices security and also to speed up the SSH login process by using SSH keys instead of passwords.  To further lockdown SSHD we are going to disable the root user from being able to login, limit the users that are allowed to login via an approved group list, disabling SSH protocol version 1, set a minimum key bit, and configure auto-logout of idle users.  The requirements for this article are: an Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/)) and [SSH public and private key files](mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Quick Commands

Configure `/etc/ssh/sshd_config` with the following settings:

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

### Disable SSH protocol version 1

```bash
Protocol 2
```

### Minimum key bits

```bash
ServerKeyBits 2048
```

### Disconnect idle users

```bash
ClientAliveInterval 300
ClientAliveCountMax 0
```

## Detailed Walkthrough

SSHD is the SSH Server that runs on the Linux VM.  SSH is a client that runs from a shell on your MacBook, Linux workstation, or from a Bash on Windows.  SSH is also the protocol used to secure and encrypt the communication between your workstation and the Linux VM making SSH also a VPN (Virtual Private Network).

For this article, it is very important to keep one login to your Linux VM open for the entire walk-through.  Once an SSH connection is established, it remains as an open session as long as the window is not closed.  Having one terminal logged in, allows for changes to be made to the SSHD service without being locked out if a breaking change is made.  If you do get locked out of your Linux VM with a broken SSHD configuration, Azure offers the ability to reset a broken SSHD configuration with the [Azure VM Access Extension](using-vmaccess-extension.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

For this reason we open two terminals and SSH to the Linux VM from both of them.  We use the first terminal to make the changes to SSHDs configuration file and restart the SSHD service.  We use the second terminal to test those changes once the service is restarted.  Because we are disabling SSH passwords and relying strictly on SSH keys, if your SSH keys are not correct and you close the connection to the VM, the VM will be permanently locked and no one will be able to login to it requiring it to be deleted and recreated.

## Disable password logins

The quickest way to secure you Linux VM is to disable password logins.  When password logins are enabled, bots crawling the web will immediately start attempting to brute force guess the password for your Linux VM using SSH.  Disabling password logins completely, enables the SSH server to ignore all password login attempts.

```bash
PasswordAuthentication no
```

## Disable login by the root user

Following Linux best practices, the `root` user should never be logged into over SSH or using `sudo su`.  All commands needing root level permissions should always be run through the `sudo` command, which logs all actions for future auditing.  Disabling the `root` user from logging in via SSH is a security best practices step that ensures only authorized users are allowed to SSH.

```bash
PermitRootLogin no
```

## Allowed groups list

SSH offers a method of restricting users and group that are allowed or disallowed from logging in over SSH.  This feature uses lists to approve or deny specific users and groups from logging in.  Setting the wheel group to the `AllowGroups` list restricts approved logins over SSH to just user accounts that are in the wheel group.

```bash
AllowGroups wheel
```

## Allowed users list

Restricting SSH logins to just users is a more specific way to accomplish the same task that `AllowGroups` is.  

```bash
AllowUsers ahmet ralph
```

## Disable SSH protocol version 1

SSH protocol version 1 is insecure and should be disabled.  SSH protocol version 2 is the current version that offers a secure way to SSH to your server.  Disabling SSH version 1 denies any SSH clients that are attempting to establish a connection with the SSH server using SSH version 1.  Only SSH version 2 connections are allowed to negotiate a connection with the SSH server.

```bash
Protocol 2
```

## Minimum key bits

Following security best practices, password SSH logins are disabled and only SSH keys are allowed to be used to authenticate with the SSH server.  These SSH keys can be created using different length keys, measured in bits.  Best practices states that keys of 2048 bits in length are the minimum acceptable key strength.  Keys of less than 2048 bits could theoretically be broken.  Setting the `ServerKeyBits` to `2048` allows any connections using keys of 2048 bits or greater and deny connections of less than 2048 bits.

```bash
ServerKeyBits 2048
```

## Disconnect idle users

SSH has the ability to disconnect users that have open connections that have remained idle for more than a set period of seconds.  Keeping open sessions to only those users who are active limits the exposure of the Linux VM.

```bash
ClientAliveInterval 300
ClientAliveCountMax 0
```

## Restart SSHD

To enable the settings in `/etc/ssh/sshd_config` restart the SSHD process which restarts the SSH server.  The terminal window you use to restart the SSH server remain open without losing the open SSH session.  To test the new SSH server settings use a second terminal window or tab.  Using a separate terminal to test the SSH connection allows you to go back and make additional changes to the `/etc/ssh/sshd_config` in the first terminal, without being locked out by a breaking SSHD change.  

### On Redhat, Centos and Fedora

```bash
service sshd restart
```

### On Debian & Ubuntu

```bash
service ssh restart
```

## Reset SSHD using Azure reset-access

If you are locked out from a breaking change to the SSHD configuration you can use the Azure VM access-extension to reset the SSHD configuration back to the original configuration.

Replace any example names with your own.

```azurecli
azure vm reset-access \
--resource-group myResourceGroup \
--name myVM \
--reset-ssh
```

## Install Fail2ban

It is strongly recommended to install and setup the open source app Fail2ban, which blocks repeated attempts to login to your Linux VM over SSH using brute force.  Fail2ban logs repeated failed attempts to login over SSH and then creates firewall rules to block the IP address that the attempts are originating from.

* [Fail2ban homepage](http://www.fail2ban.org/wiki/index.php/Main_Page)

## Next Steps

Now that you have configured and locked down the SSH server on your Linux VM there are additional security best practices you can follow.  

* [Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](using-vmaccess-extension.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

* [Encrypt disks on a Linux VM using the Azure CLI](encrypt-disks.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

* [Access and security in Azure Resource Manager templates](dotnet-core-3-access-security.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
