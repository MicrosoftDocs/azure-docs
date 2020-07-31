---
title: Use SSH keys to connect to Linux VMs 
description: Learn how to generate and use SSH keys from a Windows computer to connect to a Linux virtual machine on Azure.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.date: 07/09/2020
ms.topic: how-to
ms.author: cynthn

---
# How to use SSH keys with Windows on Azure

This article is for Windows users who want to create and use *secure shell* (SSH) keys to connect to Linux virtual machines (VMs) in Azure. To use SSH keys from a Linux or macOS client, see the [quick](mac-create-ssh-keys.md) or [detailed](create-ssh-keys-detailed.md) guidance.

## Overview of SSH and keys

[SSH](https://www.ssh.com/ssh/) is an encrypted connection protocol that allows secure sign-ins over unsecured connections. SSH is the default connection protocol for Linux VMs hosted in Azure. Although SSH itself provides an encrypted connection, using passwords with SSH still leaves the VM vulnerable to brute-force attacks. We recommend connecting to a VM over SSH using a public-private key pair, also known as *SSH keys*. 

The public-private key pair is like the lock on your front door. The lock is exposed to the **public**, anyone with the right key can open the door. The key is **private**, and only given to people you trust because it can be used to unlock the door. 

- The *public key* is placed on your Linux VM when you create the VM. 

- The *private key* remains on your local system. Protect this private key. Do not share it.

When you connect to your Linux VM, the VM tests the SSH client to make sure it has the correct private key. If the client has the private key, it's granted access to the VM. 

Depending on your organization's security policies, you can reuse a single key pair to access multiple Azure VMs and services. You do not need a separate pair of keys for each VM. 

Your public key can be shared with anyone, but only you (or your local security infrastructure) should have access to your private key.

[!INCLUDE [virtual-machines-common-ssh-support](../../../includes/virtual-machines-common-ssh-support.md)]

## SSH clients

Recent versions of Windows 10 include [OpenSSH client commands](https://blogs.msdn.microsoft.com/commandline/2018/03/07/windows10v1803/) to create and manage SSH keys and make SSH connections from a command prompt or a PowerShell prompt. This is the easiest way to create an SSH connection to your Linux VM, from a Windows computer. 

You can also install the [Windows Subsystem for Linux](https://docs.microsoft.com/windows/wsl/about) to connect to your VM over SSH and use other native Linux tools within a Bash shell. This can be useful if you need to develop and test something locally, before moving it to your VM.

You can also use Bash in the [Azure Cloud Shell](../../cloud-shell/overview.md) to connect to your VM. 

- Access Cloud Shell in your web browser at [https://shell.azure.com](https://shell.azure.com) or from the [Azure portal](https://portal.azure.com). 
- Access Cloud Shell as a terminal in Visual Studio Code by installing the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account).

## Create an SSH key pair

Create an SSH key pair using the `ssh-keygen` command. Enter a filename, or use the default shown in parenthesis (for example `C:\Users\username/.ssh/id_rsa`).  Enter a passphrase for the file, or leave the passphrase blank if you do not want to use a passphrase. 

```
ssh-keygen -m PEM -t rsa -b 4096
```

## Create a VM using your key

To create a Linux VM that uses SSH keys for authentication, provide your SSH public key when creating the VM.

Using the Azure CLI, you specify the path and filename for the public key using `az vm create` and the `--ssh-key-value` parameter.

```azurecli
az vm create \
   --resource-group myResourceGroup \
   --name myVM \
   --image UbuntuLTS\
   --admin-username azureuser \
   --ssh-key-value ~/.ssh/id_rsa.pub
```

With Powershell, use `New-AzVM` and add the SSH key to the VM configuration using`. For an example, see [Quickstart: Create a Linux virtual machine in Azure with PowerShell](quick-create-powershell.md).

If you do a lot of deployments using the portal, you might want to upload your public key to Azure, where it can be easily selected when creating a VM from the portal. For more information, see [Upload an SSH key](../ssh-keys-portal.md#upload-an-ssh-key).


## Connect to your VM

With the public key deployed on your Azure VM, and the private key on your local system, SSH to your VM using the IP address or DNS name of your VM. Replace *azureuser* and *10.111.12.123* in the following command with the administrator user name and the IP address (or fully qualified domain name):

```bash
ssh -i ~/.ssh/id_rsa.pub azureuser@10.111.12.123
```

If you configured a passphrase when you created your key pair, enter the passphrase when prompted.

If the VM is using the just-in-time access policy, you need to request access before you can connect to the VM. For more information about the just-in-time policy, see [Manage virtual machine access using the just in time policy](../../security-center/security-center-just-in-time.md).

### Connect with PuTTY

If you installed the [PuTTY download package](https://www.chiark.greenend.org.uk/~sgtatham/putty/download.html) and previously generated a PuTTY private key (.ppk) file, you can connect to a Linux VM with PuTTY.

1. Start PuTTy.

2. Fill in the host name or IP address of your VM from the Azure portal:

    ![Open new PuTTY connection](./media/ssh-from-windows/putty-new-connection.png)

3. Select the **Connection** > **SSH** > **Auth** category. Browse to and select your PuTTY private key (.ppk file):

    ![Select your PuTTY private key for authentication](./media/ssh-from-windows/putty-auth-dialog.png)

4. Click **Open** to connect to your VM.

## Next steps

* For detailed steps, options, and advanced examples of working with SSH keys, see [Detailed steps to create SSH key pairs](create-ssh-keys-detailed.md).

* You can also use PowerShell in Azure Cloud Shell to generate SSH keys and make SSH connections to Linux VMs. See the [PowerShell quickstart](../../cloud-shell/quickstart-powershell.md#ssh).

* If you have difficulty using SSH to connect to your Linux VMs, see [Troubleshoot SSH connections to an Azure Linux VM](../troubleshooting/troubleshoot-ssh-connection.md?toc=/azure/virtual-machines/linux/toc.json).
