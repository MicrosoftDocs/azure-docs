---
title: Create an SSH key pair for Linux VMs on Azure | Microsoft Docs
description: Securely create an SSH public and private key pair for Azure Linux VMs.
services: virtual-machines-linux
documentationcenter: ''
author: vlivech
manager: timlt
editor: ''
tags: ''

ms.assetid: 34ae9482-da3e-4b2d-9d0d-9d672aa42498
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/08/2017
ms.author: rasquill
experiment_id: "rasquill-ssh-20170308"


---

# Create an SSH public and private key pair for Linux VMs

This article shows you how to generate an SSH protocol version 2 RSA public and private key file pair to use with Linux VMs.  With an SSH key pair, you can create Virtual Machines on Azure that default to using SSH keys for authentication, eliminating the need for passwords to log in.  Passwords can be guessed, and open your VMs up to relentless brute force attempts to guess your password. VMs created with Azure Templates or the `azure-cli` can include your SSH public key as part of the deployment, removing a post deployment configuration step of disabling password logins for SSH.

## Quick Commands

Run the following commands from a Bash shell, replacing the examples with your own choices.

Your SSH public key file is by default created at `~/.ssh/id_rsa.pub`. When prompted using the following command, you should create a "passphrase" to secure your private key. (The passphrase is a password used to encrypt your private key.)

```bash
ssh-keygen -t rsa -b 2048 
```

Add the newly created key to `ssh-agent`:

```bash
ssh-add ~/.ssh/id_rsa
```

> [!IMPORTANT] 
> The above commands work on Linux operating systems of almost all distributions, but do not necessarily work in containers, as the environment can be radically constrained. 

## Detailed Walkthrough

Using SSH public and private keys is the easiest way to log in to your Linux servers. [Public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) provides a much more secure way to log in to your Linux or BSD VM in Azure than passwords, which can be brute-forced far more easily.

> [!IMPORTANT]
> Your public key can be shared with anyone; but only you (or your local security infrastructure) possess your private key.  The SSH private key should have a [very secure password](https://www.xkcd.com/936/) (source:[xkcd.com](https://xkcd.com)) to safeguard it.  This password is just to access the private SSH key and **is not** the user account password.  When you add a password to your SSH key, it encrypts the private key using 128-bit AES, so that the private key is useless without the password to decrypt it.  If an attacker stole your private key and that key did not have a password, they would be able to use that private key to log in to any servers that have the corresponding public key.  If a private key is password protected it cannot be used by that attacker, providing an additional layer of security for your infrastructure on Azure.

This article creates SSH protocol version 2 RSA public and private key files, which are recommended for deployments on the Resource Manager.  *ssh-rsa* keys are required on the [portal](https://portal.azure.com) for both classic and Resource Manager deployments.

## Disable SSH passwords by using SSH keys

Azure requires at least 2048-bit, ssh-rsa format public and private keys. To create the keys use `ssh-keygen`, which asks a series of questions and then writes a private key and a matching public key. When an Azure VM is created, the public key is copied to `~/.ssh/authorized_keys`.  SSH keys in `~/.ssh/authorized_keys` are used to challenge the client to match the corresponding private key on an SSH login connection.  When an Azure Linux VM is created using SSH keys for authentication, Azure configures the SSHD server to not allow password logins, only SSH keys.  Therefore, by creating Azure Linux VMs with SSH keys, you can help secure the VM deployment and save yourself the typical post-deployment configuration step of disabling passwords in the sshd_config config file.

## Using ssh-keygen

This command creates a password secured (encrypted) SSH key pair using 2048-bit RSA and it is commented to easily identify it.  

SSH keys are by default kept in the `~/.ssh` directory.  If you do not have a `~/.ssh` directory, the `ssh-keygen` command creates it for you with the correct permissions.

```bash
ssh-keygen \
-t rsa \
-b 2048 
```

*Command explained*

`ssh-keygen` = the program used to create the keys

`-t rsa` = type of key to create which is the RSA format [wikipedia](https://en.wikipedia.org/wiki/RSA_(cryptosystem)

`-b 2048` = bits of the key


## Classic portal and X.509 certs

If you are using the Azure [classic portal](https://manage.windowsazure.com/), it requires X.509 certs for the SSH keys.  No other types of SSH public keys are allowed, they *must* be X.509 certs.

To create an X.509 cert from your existing SSH-RSA private key:

```bash
openssl req -x509 \
-key ~/.ssh/id_rsa \
-nodes \
-days 365 \
-newkey rsa:2048 \
-out ~/.ssh/id_rsa.pem
```

## Classic deploy using `asm`

If you are using the classic deploy model (Azure service management CLI `asm`), you can use an SSH-RSA public key or an RFC4716 formatted key in a **.pem** container.  The SSH-RSA public key is what was created earlier in this article using `ssh-keygen`.

To create a RFC4716 formatted key from an existing SSH public key:

```bash
ssh-keygen \
-f ~/.ssh/id_rsa.pub \
-e \
-m RFC4716 > ~/.ssh/id_ssh2.pem
```

## Example of ssh-keygen

```bash
ssh-keygen -t rsa -b 2048 -C "ahmet@myserver"
Generating public/private rsa key pair.
Enter file in which to save the key (/home/ahmet/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/ahmet/.ssh/id_rsa.
Your public key has been saved in /home/ahmet/.ssh/id_rsa.pub.
The key fingerprint is:
14:a3:cb:3e:78:ad:25:cc:55:e9:0c:08:e5:d1:a9:08 ahmet@myserver
The keys randomart image is:
+--[ RSA 2048]----+
|        o o. .   |
|      E. = .o    |
|      ..o...     |
|     . o....     |
|      o S =      |
|     . + O       |
|      + = =      |
|       o +       |
|        .        |
+-----------------+
```

Saved key files:

`Enter file in which to save the key (/home/ahmet/.ssh/id_rsa): ~/.ssh/id_rsa`

The key pair name for this article.  Having a key pair named **id_rsa** is the default and some tools might expect the **id_rsa** private key file name so having one is a good idea. The directory `~/.ssh/` is the default location for SSH key pairs and the SSH config file.  If not specified with a full path, `ssh-keygen` will create the keys in the current working directory, not the default `~/.ssh`.

A listing of the `~/.ssh` directory.

```bash
ls -al ~/.ssh
-rw------- 1 ahmet staff  1675 Aug 25 18:04 id_rsa
-rw-r--r-- 1 ahmet staff   410 Aug 25 18:04 rsa.pub
```

Key Password:

`Enter passphrase (empty for no passphrase):`

`ssh-keygen` refers to a password used to encrypt the private key as "a passphrase."  It is *strongly* recommended to add a passphrase to your key pairs. Without a passphrase protecting the private key, anyone with the key file can use it to log in to any server that has the corresponding public key. Adding a passphrase offers more protection in case someone is able to gain access to your private key file, giving you time to change the keys used to authenticate you.

## Using ssh-agent to store your private key password

To avoid typing your private key file passphrase with every SSH login, you can use `ssh-agent` to cache your private key file password. If you are using a Mac, the OSX Keychain securely stores the private key passwords when you invoke `ssh-agent`.

Verify and use `ssh-agent` and `ssh-add` to inform the SSH system about the key files so that the passphrase will not need to be used interactively.

```bash
eval "$(ssh-agent -s)"
```

Now add the private key to `ssh-agent` using the command `ssh-add`.

```bash
ssh-add ~/.ssh/id_rsa
```

The private key password is now stored in `ssh-agent`.

## Using `ssh-copy-id` to install the new key
If you have already created a VM you can install the new SSH public key to your Linux VM with the following command, replacing the VM username and the server address with your own values:

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub ahmet@myserver
```

## Create and configure an SSH config file

It is a best practice to create and configure an `~/.ssh/config` file to speed up log ins and for optimizing your SSH client behavior.

The following example shows a standard configuration.

### Create the file

```bash
touch ~/.ssh/config
```

### Edit the file to add the new SSH configuration:

```bash
vim ~/.ssh/config
```

### Example `~/.ssh/config` file:

```bash
# Azure Keys
Host fedora22
  Hostname 102.160.203.241
  User ahmet
# ./Azure Keys
# Default Settings
Host *
  PubkeyAuthentication=yes
  IdentitiesOnly=yes
  ServerAliveInterval=60
  ServerAliveCountMax=30
  ControlMaster auto
  ControlPath ~/.ssh/SSHConnections/ssh-%r@%h:%p
  ControlPersist 4h
  IdentityFile ~/.ssh/id_rsa
```

This SSH config gives you sections for each server to enable each to have its own dedicated key pair. The default settings (`Host *`) are for any hosts that do not match any of the specific hosts higher up in the config file.

### Config file explained

`Host` = the name of the host being called on the terminal.  `ssh fedora22` tells `SSH` to use the values in the settings block labeled `Host fedora22`  NOTE: Host can be any label that is logical for your usage and does not represent the actual hostname of any server.

`Hostname 102.160.203.241` = the IP address or DNS name for the server being accessed.

`User ahmet` = the remote user account to use when logging in to the server.

`PubKeyAuthentication yes` = tells SSH you want to use an SSH key to log in.

`IdentityFile /home/ahmet/.ssh/id_id_rsa` = the SSH private key and corresponding public key to use for authentication.

## SSH into Linux without a password

Now that you have an SSH key pair and a configured SSH config file, you are able to log in to your Linux VM quickly and securely. The first time you log in to a server using an SSH key the command prompts you for the passphrase for that key file.

```bash
ssh fedora22
```

### Command explained

When `ssh fedora22` is executed SSH first locates and loads any settings from the `Host fedora22` block, and then loads all the remaining settings from the last block, `Host *`.

## Next Steps

Next up is to create Azure Linux VMs using the new SSH public key.  Azure VMs that are created with an SSH public key as the login are better secured than VMs created with the default login method, passwords.  Azure VMs created using SSH keys are by default configured with passwords disabled, avoiding brute-forced guessing attempts. If you need more assistance in creating your SSH key pair or require additional certificates, such as for use with the classic portal, see [Detailed steps to create SSH key pairs and certificates](create-ssh-keys-detailed.md).

* [Create a secure Linux VM using an Azure template](create-ssh-secured-vm-from-template.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Create a secure Linux VM using the Azure portal](quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Create a secure Linux VM using the Azure CLI](quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
