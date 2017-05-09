---
title: Disable SSH passwords on your Linux VM by configuring SSHD | Microsoft Docs
description: Secure your Linux VM on Azure by disabling password logins for SSH.
services: virtual-machines-linux
documentationcenter: ''
author: vlivech
manager: timlt
editor: ''
tags: ''

ms.assetid: 46137640-a7d2-40e5-a1e9-9effef7eb190
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 08/26/2016
ms.author: v-livech

---
# Disable SSH passwords on your Linux VM by configuring SSHD
This article focuses on how to lock down the login security of your Linux VM.  As soon as the SSH port 22 is opened to the world bots start trying to login by guessing passwords.  What we will do in this article is disable password logins over SSH.  By completely removing the ability to use passwords we protect the Linux VM from this type of brute force attack.  The added bonus is we will configure Linux SSHD to only allow logins via SSH public & private keys, by far the most secure way to login to Linux.  The possible combinations of it would require to guess the private key is immense and therefore discourages bots from even bothering to try to brute force SSH keys.

## Goals
* Configure SSHD to disallow:
  * Password logins
  * Root user login
  * Challenge-response authentication
* Configure SSHD to allow:
  * only SSH key logins
* Restart SSHD while still logged in
* Test the new SSHD configuration

## Introduction
[SSH defined](https://en.wikipedia.org/wiki/Secure_Shell)

SSHD is the SSH Server that runs on the Linux VM.  SSH is a client that runs from a shell on your MacBook or Linux workstation.  SSH is also the protocol used to secure and encrypt the communication between your workstation and the Linux VM.

For this article it is very important to keep one login to your Linux VM open for the entire walk through.  For this reason we will open two terminals and SSH to the Linux VM from both of them.  We will use the first terminal to make the changes to SSHDs configuration file and restart the SSHD service.  We will use the second terminal to test those changes once the service is restarted.  Because we are disabling SSH passwords and relying strictly on SSH keys, if your SSH keys are not correct and you close the connection to the VM, the VM will be permanently locked and no one will be able to login to it requiring it to be deleted and recreated.

## Prerequisites
* [Create SSH keys on Linux and Mac for Linux VMs in Azure](mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* Azure account
  * [free trial signup](https://azure.microsoft.com/pricing/free-trial/)
  * [Azure portal](http://portal.azure.com)
* Linux VM running on azure
* SSH public & private key pair in `~/.ssh/`
* SSH public key in `~/.ssh/authorized_keys` on the Linux VM
* Sudo rights on the VM
* Port 22 open

## Quick Commands
*Seasoned Linux Admins who just want the TLDR version start here.  For everyone else that wants the detailed explanation and walk through skip this section.*

```bash
sudo vim /etc/ssh/sshd_config
```

Edit the config file as follows:

```sh
# Change PasswordAuthentication to this:
PasswordAuthentication no

# Change PubkeyAuthentication to this:
PubkeyAuthentication yes

# Change PermitRootLogin to this:
PermitRootLogin no

# Change ChallengeResponseAuthentication to this:
ChallengeResponseAuthentication no
```

Restart the SSHD service. On Debian-based distros:

```bash
sudo service ssh restart
```

On Red Hat-based distros:

```bash
sudo service sshd restart
```

## Detailed Walk Through
Login to the Linux VM on terminal 1 (T1).  Login to the Linux VM on terminal 2 (T2).

On T2 we are going to edit the SSHD configuration file.  

```bash
sudo vim /etc/ssh/sshd_config
```

From here we will edit just the settings to disable passwords and enable SSH key logins.  There are many settings in this file that you should research and change to make Linux & SSH as secure as you need.

#### Disable Password logins

```sh
# Change PasswordAuthentication to this:
PasswordAuthentication no
```

#### Enable Public Key Authentication

```sh
# Change PubkeyAuthentication to this:
PubkeyAuthentication yes
```

#### Disable Root Login

```sh
# Change PermitRootLogin to this:
PermitRootLogin no
```

#### Disable Challenge-response Authentication
```sh
# Change ChallengeResponseAuthentication to this:
ChallengeResponseAuthentication no
```

### Restart SSHD
From the T1 shell verify that you are still logged in.  This is critical so you do not get locked out of your VM if your SSH keys are not correct since passwords are now disabled.  If any setting are incorrect on your Linux VM you can use T1 to fix sshd_config as you will still be logged in and SSH will keep the connection alive during the SSHD service restart.

From T2 run:

##### On the Debian Family
```bash
sudo service ssh restart
```

##### On the RedHat Family
```bash
sudo service sshd restart
```

Passwords are now disabled on your VM protecting it from brute force password login attempts.  With only SSH Keys allowed you will be able to login faster and much more secure.

