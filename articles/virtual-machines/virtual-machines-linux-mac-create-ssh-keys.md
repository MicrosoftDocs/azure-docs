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
	ms.date="05/16/2016"
	ms.author="v-livech"/>

# Create SSH keys on Linux and Mac for Linux VMs in Azure

To create a password-secured SSH public and private key you need a terminal open on your workstation.  Once you have SSH keys you can create new VMs with that key by default or add the public key to existing VMs using both the Azure CLI and Azure templates.  This will allow for password-less logins over SSH using the much more secure authentication method of Keys versus passwords.

## Quick Command Listing

In the following command examples, replace the values between &lt; and &gt; with the values from your own environment.

```bash
ssh-keygen -t rsa -b 2048 -C "<your_user@yourdomain.com>"
```

Enter the name of the file that will be saved in the `~/.ssh/` directory:

```bash
<azure_fedora_id_rsa>
```

Enter passphrase for azure_fedora_id_rsa:

```bash
<correct horse battery staple>
```

Add the newly created key to `ssh-agent` on Linux and Mac (also added to OSX Keychain):

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/azure_fedora_id_rsa
```

Copy the SSH public key to your Linux Server:

```bash
ssh-copy-id -i ~/.ssh/azure_fedora_id_rsa.pub <youruser@yourserver.com>
```

Test the login using keys instead of a password:

```bash
ssh -o PreferredAuthentications=publickey -o PubkeyAuthentication=yes -i ~/.ssh/azure_fedora_id_rsa <youruser@yourserver.com>
Last login: Tue April 12 07:07:09 2016 from 66.215.22.201
$
```

## Introduction

Using SSH public and private keys is the easiest way to login into your Linux servers, but in addition [public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) also provides a much more secure way to login to your Linux or BSD VM in Azure than passwords, which can be brute-forced far more easily. Your public key can be shared with anyone; but only you (or your local security infrastructure) possess your private key.  The SSH private key created will have a [secure password](https://www.xkcd.com/936/) to safeguard it and this password is just to access the private SSH key and **is not** the user account password.  When you add a password to your SSH key it encrypts the private key so that the private key is not usable without the password to unlock it.  If an attacker were able to steal your private key and it did not have a password they would be able to use that private key to login to your servers that have the corresponding public key installed.  If private key is password protected it cannot be used by that attacker, providing an additional layer of security for your infrastructure on Azure.


This article creates *ssh-rsa* format key files, as those are recommended for deployments on the Resource Manager and required on the [portal](https://portal.azure.com) for both classic and resource manager deployments.


## Create the SSH Keys

Azure requires at least 2048-bit, ssh-rsa format public and private keys. To create the pair, we will use `ssh-keygen`, which asks a series of questions and then writes a private key and a matching public key. When you create your Azure VM, you pass the public key content, which is copied to the Linux VM and is used with your local and securely stored private key to authenticate you when you log in.

## Using ssh-keygen

This command creates a password secured (encrypted) SSH Keypair using 2048 bit RSA and it will be commented to easily identify it.

```bash
ssh-keygen -t rsa -b 2048 -C "ahmet@fedoraVMAzure"
```

_Command explained_

`ssh-keygen` = the program used to create the keys

`-t rsa` = type of key to create which is the [RSA format](https://en.wikipedia.org/wiki/RSA_(cryptosystem)

`-b 2048` = bits of the key

`-C "ahmet@fedoraVMAzure"` = a comment appended to the end of the public key file to easily identify it.  Normally a email is used as the comment but you can use whatever works best for your infrastructure.

## Walkthrough of ssh-keygen

Each step explained in detail.  Start by running `ssh-keygen`.

```bash
ssh-keygen -t rsa -b 2048 -C "ahmet@fedoraVMAzure"
Generating public/private rsa key pair.
Enter file in which to save the key (/home/ahmet/.ssh/id_rsa): azure_fedora_id_rsa
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in azure_fedora_id_rsa.
Your public key has been saved in azure_fedora_id_rsa.pub.
The key fingerprint is:
14:a3:cb:3e:78:ad:25:cc:55:e9:0c:08:e5:d1:a9:08 ahmet@fedoraVMAzure
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

`Enter file in which to save the key (/home/ahmet/.ssh/id_rsa): azure_fedora_id_rsa`

The key pair name for this article.  Having a key pair named **id_rsa** is the default and some tools might expect the **id_rsa** private key file name so having one is a good idea. (`~/.ssh/` is the typical default location for all of your SSH key pairs and the SSH config file.)

```bash
ahmet@fedora$ ls -al ~/.ssh
-rw------- 1 ahmet staff  1675 Aug 25 18:04 azure_fedora_id_rsa
-rw-r--r-- 1 ahmet staff   410 Aug 25 18:04 azure_fedora_id_rsa.pub
```
This shows your new key pairs and their permissions. `ssh-keygen` creates the `~/.ssh` directory if it is not present and also sets the correct ownership and file modes.

Key Password:

`Enter passphrase (empty for no passphrase):`

It is strongly recommended to add a password (`ssh-keygen` calls this a "passphrase") to your key pairs. Without a password protecting the key pair, anyone with a copy of the private key file can use it to login to any server -- your servers -- that have the corresponding the public key. Adding a password therefore offers much more protection in case someone is able to gain access to your private key file, given you time to change the keys used to authenticate you.

## Using ssh-agent to store your private key password

To avoid typing your private key file password with every SSH login you can use `ssh-agent` to cache your private key file password allowing for quick and secure logins to your Linux VM.  If you are using OSX, the Keychain will securely store your private key passwords when you invoke `ssh-agent`.

First verify that `ssh-agent` is running

```bash
eval "$(ssh-agent -s)"
```

Now add the private key to `ssh-agent` using the command `ssh-add`, again on OSX this will launch the Keychain which will store the credentials.

```bash
ssh-add ~/.ssh/azure_fedora_id_rsa
```

The private key password is now stored so you will not have to type the key password with every SSH login.

## Create and configure a SSH config file

While not absolutely necessary to get up and running with a Linux VM, it is a best practice to create and configure an `~/.ssh/config` file in order to prevent you from accidentally using passwords to log on with your VMs, automate using different key pairs for different Azure VMs, and configure other programs such as **git** to target multiple servers as well.

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
  PubkeyAuthentication yes
  IdentityFile /home/ahmet/.ssh/azure_fedora_id_rsa
# ./Azure Keys
# Default Settings
Host *
  PubkeyAuthentication=no
  IdentitiesOnly=yes
  ServerAliveInterval=60
  ServerAliveCountMax=30
  ControlMaster auto
  ControlPath /home/ahmet/.ssh/Connections/ssh-%r@%h:%p
  ControlPersist 4h
  StrictHostKeyChecking=no
  IdentityFile /home/ahmet/.ssh/id_rsa
  UseRoaming=no
```

This SSH config gives you sections for each service to enable each to have its own dedicated key pair. The default settings are for any hosts that you are logged into that do not match any of the above groups.


### Config file explained

`Host` = the name of the host being called on the terminal.  `ssh fedora22` tells `SSH` to use the values in the settings block labeled `Host fedora22`  NOTE: This can be any label that is logical for your usage and does not represent the actual hostname of any server.

`Hostname 102.160.203.241` = the IP address or DNS name for the server being logged into. This is used to route to the server and can be a external IP that maps to an internal IP.

`User git` = the remote user account to use when logging into the Azure VM.

`PubKeyAuthentication yes` = this tells SSH you want to use a SSH key to login.

`IdentityFile /home/ahmet/.ssh/azure_fedora_id_rsa` = this tells SSH which key pair to present to the server to authenticate the login.


## SSH into Linux without a password

Now that you have a SSH key pair and a configured SSH config file, you can login to your Linux VM quickly and securely. The first time you login to a server using a SSH key the command prompts you for the passphrase for that key file.

```bash
ssh fedora22
```

### Command explained

When `ssh fedora22` is executed SSH first locates and loads any settings from the `Host fedora22` block, and then loads all the remaining settings from the last block, `Host *`.

## Next Steps

Next up is to create Azure Linux VMs using the new SSH public key.  Azure VMs that are created with a SSH public key as the login are better secured than those created with the default login method passwords.  Azure VMs using SSH keys for logins are by default configured to disable password logins, avoiding brute-forced break in attempts.

- [Create a secure Linux VM using a Azure template](virtual-machines-linux-create-ssh-secured-vm-from-template.md)
- [Create a secure Linux VM using the Azure Portal](virtual-machines-linux-quick-create-portal.md)
- [Create a secure Linux VM using the Azure CLI](virtual-machines-linux-quick-create-cli.md)
