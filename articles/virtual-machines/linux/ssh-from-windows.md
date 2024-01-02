---
title: Use SSH keys to connect to Linux VMs
description: Learn how to generate and use SSH keys from a Windows computer to connect to a Linux virtual machine on Azure.
author: mattmcinnes
ms.service: virtual-machines
ms.collection: linux
ms.workload: infrastructure-services
ms.date: 12/13/2021
ms.topic: how-to
ms.author: mattmcinnes
ms.custom: devx-track-azurecli
ms.devlang: azurecli
ms.reviewer: jamesser
---
# How to use SSH keys with Windows on Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

This article is for Windows users who want to [create](#create-an-ssh-key-pair) and use *secure shell* (SSH) keys to [connect](#connect-to-your-vm) to Linux virtual machines (VMs) in Azure. You can also [generate and store SSH keys in the Azure portal](../ssh-keys-portal.md) to use when creating VMs in the portal.


To use SSH keys from a Linux or macOS client, see the [quick steps](mac-create-ssh-keys.md). For a more detailed overview of SSH, see [Detailed steps: Create and manage SSH keys for authentication to a Linux VM in Azure](create-ssh-keys-detailed.md).

## Overview of SSH and keys

[SSH](https://www.ssh.com/ssh/) is an encrypted connection protocol that allows secure sign-ins over unsecured connections. SSH is the default connection protocol for Linux VMs hosted in Azure. Although SSH itself provides an encrypted connection, using passwords with SSH still leaves the VM vulnerable to brute-force attacks. We recommend connecting to a VM over SSH using a public-private key pair, also known as *SSH keys*.

The public-private key pair is like the lock on your front door. The lock is exposed to the **public**, anyone with the right key can open the door. The key is **private**, and only given to people you trust because it can be used to unlock the door.

- The *public key* is placed on your Linux VM when you create the VM.

- The *private key* remains on your local system. Protect this private key. Don't share it.

When you connect to your Linux VM, the VM tests the SSH client to make sure it has the correct private key. If the client has the private key, it's granted access to the VM.

Depending on your organization's security policies, you can reuse a single key pair to access multiple Azure VMs and services. You don't need a separate pair of keys for each VM.

Your public key can be shared with anyone, but only you (or your local security infrastructure) should have access to your private key.

[!INCLUDE [virtual-machines-common-ssh-support](../../../includes/virtual-machines-common-ssh-support.md)]

## SSH clients

Recent versions of Windows 10 include [OpenSSH client commands](https://blogs.msdn.microsoft.com/commandline/2018/03/07/windows10v1803/) to create and use SSH keys and make SSH connections from PowerShell or a command prompt.

You can also use Bash in the [Azure Cloud Shell](../../cloud-shell/overview.md) to connect to your VM. You can use Cloud Shell in a [web browser](https://shell.azure.com/bash), from the [Azure portal](https://portal.azure.com), or as a terminal in Visual Studio Code using the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account).

You can also install the [Windows Subsystem for Linux](/windows/wsl/about) to connect to your VM over SSH and use other native Linux tools within a Bash shell.

## Create an SSH key pair

The easiest way to create and manage your SSH keys is to [use the portal to create and store them](../ssh-keys-portal.md) for reuse.

You can also create key pairs with the [Azure CLI](/cli/azure) with the [az sshkey create](/cli/azure/sshkey#az-sshkey-create) command, as described in [Generate and store SSH keys](../ssh-keys-azure-cli.md).

To create an SSH key pair on your local computer using the `ssh-keygen` command from PowerShell or a command prompt, type the following command:

```powershell
ssh-keygen -m PEM -t rsa -b 2048
```

Enter a filename, or use the default shown in parenthesis (for example `C:\Users\username/.ssh/id_rsa`).  Enter a passphrase for the file, or leave the passphrase blank if you don't want to use a passphrase.

## Create a VM using your key

To create a Linux VM that uses SSH keys for authentication, provide your SSH public key when creating the VM.

Using the Azure CLI, you specify the path and filename for the public key using `az vm create` and the `--ssh-key-value` parameter.

```azurecli
az vm create \
   --resource-group myResourceGroup \
   --name myVM \
   --image Ubuntu2204\
   --admin-username azureuser \
   --ssh-key-value ~/.ssh/id_rsa.pub
```

With PowerShell, use `New-AzVM` and add the SSH key to the VM configuration using`. For an example, see [Quickstart: Create a Linux virtual machine in Azure with PowerShell](quick-create-powershell.md).

If you do many deployments using the portal, you might want to upload your public key to Azure, where it can be easily selected when creating a VM from the portal. For more information, see [Upload an SSH key](../ssh-keys-portal.md#upload-an-ssh-key).


## Connect to your VM

With the public key deployed on your Azure VM, and the private key on your local system, SSH to your VM using the IP address or DNS name of your VM. Replace *azureuser* and *10.111.12.123* in the following command with the administrator user name, the IP address (or fully qualified domain name), and the path to your private key:

```bash
ssh -i ~/.ssh/id_rsa azureuser@10.111.12.123
```

If you've never connected to this VM before you'll be asked to verify the hosts fingerprint. It's tempting to accept the fingerprint presented, however, this exposes you to a possible person in the middle attack. You should always validate the hosts fingerprint. You only need to do this on the first time you connect from a client. To obtain the host fingerprint via the portal, use the Run Command with the following command: `ssh-keygen -lf /etc/ssh/ssh_host_ecdsa_key.pub | awk '{print $2}'`.

:::image type="content" source="media/ssh-from-windows/run-command-validate-host-fingerprint.png" alt-text="Screenshot showing using the Run Command to validate the host fingerprint.":::

To run the command using CLI, use the [`az vm run-command invoke` command](/cli/azure/vm/run-command).

If you configured a passphrase when you created your key pair, enter the passphrase when prompted.

If the VM is using the just-in-time access policy, you need to request access before you can connect to the VM. For more information about the just-in-time policy, see [Manage virtual machine access using the just in time policy](../../security-center/security-center-just-in-time.md).


## Next steps

- For information about SSH keys in the Azure portal to use when creating VMs, see [Generate and store SSH keys in the Azure portal](../ssh-keys-portal.md).

- For information about SSH keys in the Azure CLI to use when creating VMs, see [Generate and store SSH keys with the Azure CLI](../ssh-keys-azure-cli.md).

- For detailed steps, options, and advanced examples of working with SSH keys, see [Detailed steps to create SSH key pairs](create-ssh-keys-detailed.md).

- If you have difficulty using SSH to connect to your Linux VMs, see [Troubleshoot SSH connections to an Azure Linux VM](/troubleshoot/azure/virtual-machines/troubleshoot-ssh-connection?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
