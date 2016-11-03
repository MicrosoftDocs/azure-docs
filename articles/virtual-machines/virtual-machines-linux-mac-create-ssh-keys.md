---
title: Create SSH keys on Linux and Mac | Microsoft Docs
description: Generate and use SSH keys on Linux and Mac for the Resource Manager and classic deployment models on Azure.
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
ms.date: 10/25/2016
ms.author: v-livech

---
# Create SSH keys on Linux and Mac for Linux VMs in Azure
With an SSH keypair you can create Virtual Machines on Azure that default to using SSH keys for authentication, eliminating the need for passwords to log in.  Passwords can be guessed and open your VMs up to relentless brute force attempts to guess your password. VMs created with Azure Templates or the `azure-cli` can include your SSH public key as part of the deployment, removing a post deployment configuration.  If you are connecting to a Linux VM from Windows, see [this document.](virtual-machines-linux-ssh-from-windows.md)

The article requires:

* an Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/)).
* the [Azure CLI](../xplat-cli-install.md) logged in with `azure login`
* the Azure CLI *must be in* Azure Resource Manager mode `azure config mode arm`

## Quick Commands
In the following commands, replace the examples with your own choices.

SSH keys are by default kept in the `.ssh` directory.  

```bash
cd ~/.ssh/
```

If you do not have a `~/.ssh` directory the `ssh-keygen` command will create it for you with the correct permissions.

```bash
ssh-keygen -t rsa -b 2048 -C "myusername@myserver"
```

Enter the name of the file that is saved into the `~/.ssh/` directory:

```bash
id_rsa
```

Enter passphrase for id_rsa:

```bash
correct horse battery staple
```

There is now a `id_rsa` and `id_rsa.pub` SSH key pair in the `~/.ssh` directory.

```bash
ls -al ~/.ssh
```

Add the newly created key to `ssh-agent` on Linux and Mac (also added to OSX Keychain):

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

Copy the SSH public key to your Linux Server:

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub myusername@myserver
```

Test the login using keys instead of a password:

```bash
ssh -o PreferredAuthentications=publickey -o PubkeyAuthentication=yes -i ~/.ssh/id_rsa myusername@myserver
Last login: Tue April 12 07:07:09 2016 from 66.215.22.201
$
```

## Detailed Walkthrough
Using SSH public and private keys is the easiest way to log in to your Linux servers. [Public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) provides a much more secure way to log in to your Linux or BSD VM in Azure than passwords, which can be brute-forced far more easily. Your public key can be shared with anyone; but only you (or your local security infrastructure) possess your private key.  The SSH private key should have a [very secure password ](https://www.xkcd.com/936/) (source:[xkcd.com](https://xkcd.com)) to safeguard it.  This password is just to access the private SSH key and **is not** the user account password.  When you add a password to your SSH key, it encrypts the private key so that the private key is useless without the password to unlock it.  If an attacker stole your private key and that key did not have a password, they would be able to use that private key to log in to any servers that have the corresponding public key.  If a private key is password protected it cannot be used by that attacker, providing an additional layer of security for your infrastructure on Azure.

This article creates *ssh-rsa* formatted key files, which are recommended for deployments on the Resource Manager.  *ssh-rsa* keys are required on the [portal](https://portal.azure.com) for both Classic and Resource Manager deployments.

## Create the SSH Keys
Azure requires at least 2048-bit, ssh-rsa format public and private keys. To create the keys use `ssh-keygen`, which asks a series of questions and then writes a private key and a matching public key. When an Azure VM is created, the public key is copied to `~/.ssh/authorized_keys`.  SSH keys in `~/.ssh/authorized_keys` are used to challenge the client to match the corresponding private key on an SSH login connection.

## Using ssh-keygen
This command creates a password secured (encrypted) SSH Keypair using 2048-bit RSA and it is commented to easily identify it.  

Start by changing directories, so that all your ssh keys are created in that directory.

```bash
cd ~/.ssh
```

If you do not have a `~/.ssh` directory the `ssh-keygen` command will create it for you with the correct permissions.

```bash
ssh-keygen -t rsa -b 2048 -C "myusername@myserver"
```

*Command explained*

`ssh-keygen` = the program used to create the keys

`-t rsa` = type of key to create which is the [RSA format](https://en.wikipedia.org/wiki/RSA_(cryptosystem)

`-b 2048` = bits of the key

`-C "myusername@myserver"` = a comment appended to the end of the public key file to easily identify it.  Normally an email is used as the comment but you can use whatever works best for your infrastructure.

### Using PEM keys
If you are using the classic deploy model (Azure Classic Portal or the Azure Service Management CLI `asm`), you might need to use PEM formatted SSH keys to access your Linux VMs.  Here is how to create a PEM key from an existing SSH Public key and an existing x509 certificate.

To create a PEM formatted key from an existing SSH public key:

```bash
ssh-keygen -f ~/.ssh/id_rsa.pub -e > ~/.ssh/id_ssh2.pem
```

## Example of ssh-keygen
```bash
ssh-keygen -t rsa -b 2048 -C "myusername@myserver"
Generating public/private rsa key pair.
Enter file in which to save the key (/home/myusername/.ssh/id_rsa): id_rsa
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in id_rsa.
Your public key has been saved in id_rsa.pub.
The key fingerprint is:
14:a3:cb:3e:78:ad:25:cc:55:e9:0c:08:e5:d1:a9:08 myusername@myserver
The key's randomart image is:
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

`Enter file in which to save the key (/home/myusername/.ssh/id_rsa): id_rsa`

The key pair name for this article.  Having a key pair named **id_rsa** is the default and some tools might expect the **id_rsa** private key file name so having one is a good idea. The directory `~/.ssh/` is the default location for SSH key pairs and the SSH config file.

```bash
ls -al ~/.ssh
-rw------- 1 myusername staff  1675 Aug 25 18:04 id_rsa
-rw-r--r-- 1 myusername staff   410 Aug 25 18:04 rsa.pub
```
A listing of the `~/.ssh` directory. `ssh-keygen` creates the `~/.ssh` directory if it is not present and also sets the correct ownership and file modes.

Key Password:

`Enter passphrase (empty for no passphrase):`

`ssh-keygen` refers to a password as "a passphrase."  It is *strongly* recommended to add a password to your key pairs. Without a password protecting the key pair, anyone with the private key file can use it to log in to any server that has the corresponding public key. Adding a password offers more protection in case someone is able to gain access to your private key file, given you time to change the keys used to authenticate you.

## Using ssh-agent to store your private key password
To avoid typing your private key file password with every SSH login, you can use `ssh-agent` to cache your private key file password. If you are using a Mac, the OSX Keychain securely stores the private key passwords when you invoke `ssh-agent`.

First verify that `ssh-agent` is running

```bash
eval "$(ssh-agent -s)"
```

Now add the private key to `ssh-agent` using the command `ssh-add`.

```bash
ssh-add ~/.ssh/id_rsa
```

The private key password is now stored in `ssh-agent`.

## Create and configure an SSH config file
It is a recommended best practice to create and configure an `~/.ssh/config` file to speed up log ins and for optimizing your SSH client behavior.

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
  User myusername
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
`Host` = the name of the host being called on the terminal.  `ssh fedora22` tells `SSH` to use the values in the settings block labeled `Host fedora22`  NOTE: This can be any label that is logical for your usage and does not represent the actual hostname of any server.

`Hostname 102.160.203.241` = the IP address or DNS name for the server being accessed.

`User myusername` = the remote user account to use when logging into the server.

`PubKeyAuthentication yes` = tells SSH you want to use an SSH key to log in.

`IdentityFile /home/myusername/.ssh/id_id_rsa` = the SSH private key and corresponding public key to use for authentication.

## SSH into Linux without a password
Now that you have an SSH key pair and a configured SSH config file, you are able to log in to your Linux VM quickly and securely. The first time you log in to a server using an SSH key the command prompts you for the passphrase for that key file.

```bash
ssh fedora22
```

### Command explained
When `ssh fedora22` is executed SSH first locates and loads any settings from the `Host fedora22` block, and then loads all the remaining settings from the last block, `Host *`.

## Next Steps
Next up is to create Azure Linux VMs using the new SSH public key.  Azure VMs that are created with an SSH public key as the login are better secured than VMs created with the default login method, passwords.  Azure VMs created using SSH keys are by default configured with passwords disabled, avoiding brute-forced guessing attempts.

* [Create a secure Linux VM using an Azure template](virtual-machines-linux-create-ssh-secured-vm-from-template.md)
* [Create a secure Linux VM using the Azure portal](virtual-machines-linux-quick-create-portal.md)
* [Create a secure Linux VM using the Azure CLI](virtual-machines-linux-quick-create-cli.md)

