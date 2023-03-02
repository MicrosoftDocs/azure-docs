---
title: Detailed steps to create an SSH key pair
description: Learn detailed steps to create and manage an SSH public and private key pair for Linux VMs in Azure.
author: mattmcinnes
ms.service: virtual-machines
ms.collection: linux
ms.topic: how-to
ms.date: 08/18/2022
ms.author: mattmcinnes
ms.reviewer: jamesser
ms.custom: GGAL-freshness822
---

# Detailed steps: Create and manage SSH keys for authentication to a Linux VM in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

With a secure shell (SSH) key pair, you can create a Linux virtual machine that uses SSH keys for authentication. This article shows you how to create and use an SSH RSA public-private key file pair for SSH client connections.

If you want quick commands rather than a more in-depth explaination of SSH keys, see [How to create an SSH public-private key pair for Linux VMs in Azure](mac-create-ssh-keys.md).

To create SSH keys and use them to connect to a Linux VM from a **Windows** computer, see [How to use SSH keys with Windows on Azure](ssh-from-windows.md). You can also use the [Azure portal](../ssh-keys-portal.md) to create and manage SSH keys for creating VMs in the portal.

[!INCLUDE [virtual-machines-common-ssh-overview](../../../includes/virtual-machines-common-ssh-overview.md)]

[!INCLUDE [virtual-machines-common-ssh-support](../../../includes/virtual-machines-common-ssh-support.md)]

## SSH keys use and benefits

When you create an Azure VM by specifying the public key, Azure copies the public key (in the `.pub` format) to the `~/.ssh/authorized_keys` folder on the VM. SSH keys in `~/.ssh/authorized_keys` ensure that connecting clients present the corresponding private key during an SSH connection. In an Azure Linux VM that uses SSH keys for authentication, Azure disables the SSH server's password authentication system and only allows for SSH key authentication. By creating an Azure Linux VM with SSH keys, you can help secure the VM deployment and save yourself the typical post-deployment configuration step of disabling passwords in the `sshd_config` file.

If you do not wish to use SSH keys, you can set up your Linux VM to use password authentication. If your VM is not exposed to the Internet, using passwords may be sufficient. However, you still need to manage your passwords for each Linux VM and maintain healthy password policies and practices, such as minimum password length and regular system updates. 

## Generate keys with ssh-keygen

To create the keys, a preferred command is `ssh-keygen`, which is available with OpenSSH utilities in the Azure Cloud Shell, a macOS or Linux host, and Windows (10 & 11). `ssh-keygen` asks a series of questions and then writes a private key and a matching public key. 

SSH keys are by default kept in the `~/.ssh` directory.  If you do not have a `~/.ssh` directory, the `ssh-keygen` command creates it for you with the correct permissions. An SSH key is created as a resource and stored in Azure for later use.

> [!NOTE]
> You can also create keys with the [Azure CLI](/cli/azure) with the [az sshkey create](/cli/azure/sshkey#az-sshkey-create) command, as described in [Generate and store SSH keys](../ssh-keys-azure-cli.md).

### Basic example

The following `ssh-keygen` command generates 4096-bit SSH RSA public and private key files by default in the `~/.ssh` directory. If an existing SSH key pair is found in the current location, those files are overwritten.

```bash
ssh-keygen -m PEM -t rsa -b 4096
```

### Detailed example
The following example shows additional command options to create an SSH RSA key pair. If an SSH key pair exists in the current location, those files are overwritten. 

```bash
ssh-keygen \
    -m PEM \
    -t rsa \
    -b 4096 \
    -C "azureuser@myserver" \
    -f ~/.ssh/mykeys/myprivatekey \
    -N mypassphrase
```

**Command explained**

`ssh-keygen` = the program used to create the keys

`-m PEM` = format the key as PEM

`-t rsa` = type of key to create, in this case in the RSA format

`-b 4096` = the number of bits in the key, in this case 4096

`-C "azureuser@myserver"` = a comment appended to the end of the public key file to easily identify it. Normally an email address is used as the comment, but use whatever works best for your infrastructure.

`-f ~/.ssh/mykeys/myprivatekey` = the filename of the private key file, if you choose not to use the default name. A corresponding public key file appended with `.pub` is generated in the same directory. The directory must exist.

`-N mypassphrase` = an additional passphrase used to access the private key file. 

### Example of ssh-keygen

```bash
ssh-keygen -t rsa -m PEM -b 4096 -C "azureuser@myserver"
Generating public/private rsa key pair.
Enter file in which to save the key (/home/azureuser/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/azureuser/.ssh/id_rsa.
Your public key has been saved in /home/azureuser/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:vFfHHrpSGQBd/oNdvNiX0sG9Vh+wROlZBktNZw9AUjA azureuser@myserver
The key's randomart image is:
+---[RSA 4096]----+
|        .oE=*B*+ |
|          o+o.*++|
|           .oo++*|
|       .    .B+.O|
|        S   o=BO.|
|         . .o++o |
|        . ... .  |
|         ..  .   |
|           ..    |
+----[SHA256]-----+
```

#### Saved key files

`Enter file in which to save the key (/home/azureuser/.ssh/id_rsa): ~/.ssh/id_rsa`

The key pair name for this article. Having a key pair named `id_rsa` is the default; some tools might expect the `id_rsa` private key file name, so having one is a good idea. The directory `~/.ssh/` is the default location for SSH key pairs and the SSH config file. If not specified with a full path, `ssh-keygen` creates the keys in the current working directory, not the default `~/.ssh`.

#### List of the `~/.ssh` directory

To view existing files in the `~/.ssh` directory, run the following command. If no files are found in the directory or the directory itself is missing, make sure that all previous commands were successfully run. You may require root access to modify files in this directory on certain Linux distributions.

```bash
ls -al ~/.ssh
-rw------- 1 azureuser staff  1675 Aug 25 18:04 id_rsa
-rw-r--r-- 1 azureuser staff   410 Aug 25 18:04 id_rsa.pub
```

#### Key passphrase

`Enter passphrase (empty for no passphrase):`

It is *strongly* recommended to add a passphrase to your private key. Without a passphrase to protect the key file, anyone with the file can use it to sign in to any server that has the corresponding public key. Adding a passphrase offers more protection in case someone is able to gain access to your private key file, giving you time to change the keys.

## Generate keys automatically during deployment

If you use the [Azure CLI](/cli/azure) to create your VM, you can optionally generate both public and private SSH key files by running the [az vm create](/cli/azure/vm) command with the `--generate-ssh-keys` option. The keys are stored in the ~/.ssh directory. Note that this command option does not overwrite keys if they already exist in that location, such as with some pre-configured Compute Gallery images.

## Provide SSH public key when deploying a VM

To create a Linux VM that uses SSH keys for authentication, provide your SSH public key when creating the VM using the Azure portal, CLI, Resource Manager templates, or other methods. When using the portal, you enter the public key itself. If you use the [Azure CLI](/cli/azure) to create your VM with an existing public key, specify the value or location of this public key by running the [az vm create](/cli/azure/vm) command with the `--ssh-key-value` option. 

If you're not familiar with the format of an SSH public key, you can see your public key by running `cat` as follows, replacing `~/.ssh/id_rsa.pub` with your own public key file location:

```bash
cat ~/.ssh/id_rsa.pub
```

Output is similar to the following (redacted example below):

```
ssh-rsa XXXXXXXXXXc2EAAAADAXABAAABAXC5Am7+fGZ+5zXBGgXS6GUvmsXCLGc7tX7/rViXk3+eShZzaXnt75gUmT1I2f75zFn2hlAIDGKWf4g12KWcZxy81TniUOTjUsVlwPymXUXxESL/UfJKfbdstBhTOdy5EG9rYWA0K43SJmwPhH28BpoLfXXXXXG+/ilsXXXXXKgRLiJ2W19MzXHp8z3Lxw7r9wx3HaVlP4XiFv9U4hGcp8RMI1MP1nNesFlOBpG4pV2bJRBTXNXeY4l6F8WZ3C4kuf8XxOo08mXaTpvZ3T1841altmNTZCcPkXuMrBjYSJbA8npoXAXNwiivyoe3X2KMXXXXXdXXXXXXXXXXCXXXXX/ azureuser@myserver
```

If you copy and paste the contents of the public key file into the Azure portal or a Resource Manager template, make sure you don't copy any additional whitespace or introduce additional line breaks. For example, if you use macOS, you can pipe the public key file (by default, `~/.ssh/id_rsa.pub`) to **pbcopy** to copy the contents (there are other Linux programs that do the same thing, such as `xclip`).

If you prefer to use a public key that is in a multiline format, you can generate an RFC4716 formatted key in a 'pem' container from the public key you previously created.

To create a RFC4716 formatted key from an existing SSH public key:

```bash
ssh-keygen \
-f ~/.ssh/id_rsa.pub \
-e \
-m RFC4716 > ~/.ssh/id_ssh2.pem
```

## SSH to your VM with an SSH client
With the public key deployed on your Azure VM, and the private key on your local system, SSH to your VM using the IP address or DNS name of your VM. Replace *azureuser* and *myvm.westus.cloudapp.azure.com* in the following command with the administrator user name and the fully qualified domain name (or IP address):

```bash
ssh azureuser@myvm.westus.cloudapp.azure.com
```

If you provided a passphrase when you created your key pair, enter the passphrase when prompted during the sign-in process. (The server is added to your `~/.ssh/known_hosts` folder, and you won't be asked to connect again until the public key on your Azure VM changes or the server name is removed from `~/.ssh/known_hosts`.)

If the VM is using the just-in-time access policy, you need to request access before you can connect to the VM. For more information about the just-in-time policy, see [Manage virtual machine access using the just in time policy](../../security-center/security-center-just-in-time.md).

## Use ssh-agent to store your private key passphrase

To avoid typing your private key file passphrase with every SSH sign-in, you can use `ssh-agent` to cache your private key file passphrase on your local system. If you are using a Mac, the macOS Keychain securely stores the private key passphrase when you invoke `ssh-agent`.

Verify and use `ssh-agent` and `ssh-add` to inform the SSH system about the key files so that you do not need to use the passphrase interactively.

```bash
eval "$(ssh-agent -s)"
```

Now add the private key to `ssh-agent` using the command `ssh-add`.

```bash
ssh-add ~/.ssh/id_rsa
```

The private key passphrase is now stored in `ssh-agent`.

## Use ssh-copy-id to copy the key to an existing VM

If you have already created a VM, you can add a new SSH public key to your Linux VM using `ssh-copy-id`.

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub azureuser@myserver
```

## Create and configure an SSH config file

You can create and configure an SSH config file (`~/.ssh/config`) to speed up log-ins and to optimize your SSH client behavior. 

The following example shows a simple configuration that you can use to quickly sign in as a user to a specific VM using the default SSH private key. 

Create the file.

```bash
touch ~/.ssh/config
```

Edit the file to add the new SSH configuration

```bash
vim ~/.ssh/config
```

Add configuration settings appropriate for your host VM. In this example, the VM name (Host) is *myvm*, the account name (User) is *azureuser* and the IP Address or FQDN (Hostname) is 192.168.0.255.

```bash
# Azure Keys
Host myvm
  Hostname 192.168.0.255
  User azureuser
# ./Azure Keys
```

You can add configurations for additional hosts to enable each to use its own dedicated key pair. See [SSH config file](https://www.ssh.com/ssh/config/) for more advanced configuration options.

Now that you have an SSH key pair and a configured SSH config file, you are able to remotely access your Linux VM quickly and securely. When you run the following command, SSH locates and loads any settings from the `Host myvm` block in the SSH config file.

```bash
ssh myvm
```

The first time you sign in to a server using an SSH key, the command prompts you for the passphrase for that key file.

## Next steps

Next up is to create Azure Linux VMs using the new SSH public key. Azure VMs that are created with an SSH public key as the sign-in are better secured than VMs created with the default sign-in method, passwords.

* [Create a Linux virtual machine with the Azure portal](quick-create-portal.md)
* [Create a Linux virtual machine with the Azure CLI](quick-create-cli.md)
* [Create a Linux VM using an Azure template](create-ssh-secured-vm-from-template.md)
