<properties
	pageTitle="Create SSH keys on Linux and Mac | Microsoft Azure"
	description="Generate and use SSH keys on Linux and Mac for the Resource Manager and classic deployment models on Azure."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="vlivech"
	manager="timlt"
	editor=""
	tags="" />

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="03/13/2016"
	ms.author="v-livech"/>

# Create SSH keys on Linux and Mac for Linux VMs in Azure

This topic discusses:

1. Create a password-protected public and private key pair using `ssh-keygen`
2. Create an `~/.ssh/config` file to speed up login and enable important security and configuration defaults
3. Log into a Linux or BSD VM in Azure using SSH

## Prerequisites

An Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/)) and a Linux or Mac terminal with SSH toolkits installed. Place the CLI into resource mode by typing `azure config mode arm`.

## Introduction

Using SSH public and private keys is the most secure **and** easiest way to login into your Linux servers.  [Public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) provides a much more secure way to login to your Linux or BSD VM in Azure than passwords, which can be brute forced far more easily. Your public key can be shared with anyone; your private key is possessed only by you (or your local security infrastructure).

This article creates *ssh-rsa* format key files, as those are recommended for deployments on the Resource Manager and required on the [portal](https://portal.azure.com) for both Classic and Resource Manager deployments.

> [AZURE.NOTE] If you are logging onto your VMs from a Windows computer, see [Use SSH keys on Windows](virtual-machines-linux-ssh-from-windows.md).

## Quick Command Listing

In the following command examples, replace the values between &lt; and &gt; with the values from your own environment. 

```bash
[username@fedora22 ~]$ ssh-keygen -t rsa -b 4096 -C "<your_user@yourdomain.com>"

#Enter the name of the file that will be saved in the `~/.ssh/` directory.

azure_fedora_id_rsa

#Enter (twice) a [secure](https://www.xkcd.com/936/) password for the SSH key.

#Enter passphrase for github_id_rsa:

correct horse battery staple

#Add the newly created key to `ssh-agent` on Linux and Mac (also added to OSX Keychain).

[username@fedora22 ~]$ eval "$(ssh-agent -s)"

[username@fedora22 ~]$ ssh-add ~/.ssh/azure_fedora_id_rsa

#Copy the SSH public key to your Linux Server.

[username@fedora22 ~]$ ssh-copy-id -i ~/.ssh/azure_fedora_id_rsa.pub <youruser@yourserver.com>

#Test the login using keys instead of a password.

[username@fedora22 ~]$ ssh -i ~/.ssh/azure_fedora_id_rsa <youruser@yourserver.com>

Last login: Tue Dec 29 07:07:09 2015 from 66.215.21.201
[username@fedora22 ~]$

```

## Create the SSH Keys

Azure requires at least 2048-bit, ssh-rsa format public and private keys. To create the pair, use `ssh-keygen`, which asks a series of questions and then writes a private key and a matching public key. When you create your Azure VM, you pass the public key content, which is copied to the Linux VM and is used with your local and securely stored private key to authenticate you when you log in.



### Using `ssh-keygen`

This command will create a SSH Keypair using 2048 bit RSA and it will be commented to easily identify it.

    username@macbook$ ssh-keygen -t rsa -b 4096 -C "username@fedoraVMAzure"

##### Command explained

`ssh-keygen` = the program used to create the keys

`-t rsa` = type of key to create which is the [RSA format](https://en.wikipedia.org/wiki/RSA_(cryptosystem))

`-b 2048` = bits of the key

`-C "username@fedoraVMAzure"` = a comment for the key to easy identify it. The comment is appended to the end of the public key file.  A commonly used comment is an email address but for this article we are going to enable using multiple SSH keys so a generic comment is suggested.

#### `ssh-keygen` walk through

```bash
username@macbook$ ssh-keygen -t rsa -b 4096 -C "username@fedoraVMAzure"
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/steve/.ssh/id_rsa): azure_fedora_id_rsa
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in azure_fedora_id_rsa.
Your public key has been saved in azure_fedora_id_rsa.pub.
The key fingerprint is:
14:a3:cb:3e:79:ad:25:cc:65:e9:0c:07:e5:d1:a9:08 username@fedoraVMAzure
The key's randomart image is:
+--[ RSA 4096]----+
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

username@macbook$ ls -al ~/.ssh
-rw------- 1 username staff  1675 Aug 25 18:04 azure_fedora_id_rsa
-rw-r--r-- 1 username staff   410 Aug 25 18:04 azure_fedora_id_rsa.pub
```

`Enter file in which to save the key (/Users/steve/.ssh/id_rsa): azure_fedora_id_rsa`
The key pair name for this article.  Having a key pair named **id_rsa** is the default and some tools might expect the **id_rsa** private key file name so having one is a good idea. (`~/.ssh/` is the typical default location for all of your SSH key pairs and the SSH config file.)

`Enter passphrase (empty for no passphrase):`
It is strongly recommended to add a password (`ssh-keygen` calls this a "passphrase") to your key pairs. Without a password protecting the key pair, anyone with a copy of the private key file can use it to login to any server -- your servers -- that have the corresponding the public key. Adding a password therefore offers much more protection in case someone is able to gain access to your private key file, given you time to change the keys used to authenticate you.

`username@macbook$ ls -al ~/.ssh`
This shows your new key pairs and their permissions. `ssh-keygen` creates the `~/.ssh` directory if it is not present and also sets the correct ownership and file modes.

## Create and configure a SSH config file

While not absolutely necessary to get up and running with a Linux VM, it is a best practice to create and configure an `~/.ssh/config` file in order to prevent you from accidentally using passwords to log on with your VMs, automate using different key pairs for different Azure VMs, and configure other programs such as **git** to target multiple servers as well.

The following example shows a standard configuration.

### Create the file

```bash
username@macbook$ touch ~/.ssh/config
```

### Edit the file to add the new SSH configuration

```bash
username@macbook$ vim ~/.ssh/config

#Azure Keys
Host fedora22
  Hostname 102.160.203.241
  User username
  PubkeyAuthentication yes
  IdentityFile /Users/steve/.ssh/azure_fedora_id_rsa
# ./Azure Keys
# GitHub keys
Host github.com
  Hostname github.com
  User git
  PubKeyAuthentication yes
  IdentityFile /Users/steve/.ssh/github_id_rsa
Host github.private
  Hostname github.com
  User git
  PubKeyAuthentication yes
  IdentityFile /Users/steve/.ssh/private_repo_github_id_rsa
# ./Github Keys
# Default Settings
Host *
  PubkeyAuthentication=no
  IdentitiesOnly=yes
  ServerAliveInterval=60
  ServerAliveCountMax=30
  ControlMaster auto
  ControlPath /Users/steve/.ssh/Connections/ssh-%r@%h:%p
  ControlPersist 4h
  StrictHostKeyChecking=no
  IdentityFile /Users/steve/.ssh/id_rsa
  UseRoaming=no
```

This SSH config gives you sections for each service to enable each to have its own dedicated key pair. The default settings are for any hosts that you are logged into that do not match any of the above groups. The SSH config also enables you to have two separate [GitHub](https://github.com) logins, one for public work and a second just for private repos that may be common at your work.


##### Config file explained

`Host` = the name of the host being called on the terminal.  `ssh fedora22` tells `SSH` to use the values in the settings block labeled `Host fedora22`  NOTE: This can be any label that is logical for your usage and does not represent the actual hostname of any server.

`Hostname 102.160.203.241` = the IP address or DNS name for the server being logged into. This is used to route to the server and can be a external IP that maps to an internal IP.

`User git` = the remote user account to use when logging into the Azure VM. 

`PubKeyAuthentication yes` = this tells SSH you want to use a SSH key to login.

`IdentityFile /Users/steve/.ssh/azure_fedora_id_rsa` = this tells SSH which key pair to present to the server to authenticate the login.


## SSH into a Linux VM without a password

Now that you have a SSH key pair and a configured SSH config file, you can login to your Linux VM quickly and securely. The first time you login to a server using a SSH key the command prompts you for the passphrase for that key file. 

`username@macbook$ ssh fedora22`

##### Command explained

When `username@macbook$ ssh fedora22` is executed SSH first locates and loads any settings from the `Host fedora22` block, and then loads all the remaining settings from the last block, `Host *`.

## Next Steps

Now you can go on to use your key files to [create a secure Linux VM in Azure using a template](virtual-machines-linux-create-ssh-secured-vm-from-template.md).
