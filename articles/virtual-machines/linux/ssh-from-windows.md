---
title: Use SSH keys with Windows for Linux VMs | Microsoft Docs
description: Learn how to generate and use SSH keys on a Windows computer to connect to a Linux virtual machine on Azure.
services: virtual-machines-linux
documentationcenter: ''
author: dlepow
manager: jeconnoc
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: 2cacda3b-7949-4036-bd5d-837e8b09a9c8
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 08/20/2018
ms.author: danlep

---
# How to use SSH keys with Windows on Azure

This article introduces ways to generate and use secure shell (SSH) keys on a Windows computer to create and connect to a Linux virtual machine (VM) in Azure. To use SSH keys from a Linux or macOS client, see the [quick](mac-create-ssh-keys.md) or [detailed](create-ssh-keys-detailed.md) guidance.

[!INCLUDE [virtual-machines-common-ssh-overview](../../../includes/virtual-machines-common-ssh-overview.md)]

[!INCLUDE [virtual-machines-common-ssh-support](../../../includes/virtual-machines-common-ssh-support.md)]

## Windows packages and SSH clients
You connect to and manage Linux VMs in Azure using an *SSH client*. Computers running Linux or macOS usually have a suite of SSH commands to generate and manage SSH keys and to make SSH connections. 

Windows computers do not always have comparable SSH commands installed. Recent versions of Windows 10 provide [OpenSSH client commands](https://blogs.msdn.microsoft.com/commandline/2018/03/07/windows10v1803/) to create and manage SSH keys and make SSH connections from a Command Prompt. Recent Windows 10 versions also include the [Windows Subsystem for Linux](https://docs.microsoft.com/windows/wsl/about) to run and access utilities such as an SSH client natively within a Bash shell. 

If you wish to use another SSH tool for Windows, common Windows SSH clients you can install locally are included in the following packages:

* [PuTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/)
* [Git For Windows](https://git-for-windows.github.io/)
* [MobaXterm](http://mobaxterm.mobatek.net/)
* [Cygwin](https://cygwin.com/)

Another option is to use the SSH utilities available in Bash in the [Azure Cloud Shell](../../cloud-shell/overview.md). 

* Access Cloud Shell in your web browser at [https://shell.azure.com](https://shell.azure.com) or in the [Azure portal](https://portal.azure.com). 
* Access Cloud Shell as a terminal from within Visual Studio Code by installing the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account).

## Create an SSH key pair
This section shows you two options to create an SSH key pair on Windows.

### Create SSH keys with ssh-keygen

If you run a command shell on Windows that supports SSH client tools (or you use Azure Cloud Shell), create an SSH key pair using the `ssh-keygen` command. Type the following command, and answer the prompts. If an SSH key pair exists in the current location, those files are overwritten. 

```bash
ssh-keygen -t rsa -b 2048
```

For more background and information, see the [quick](mac-create-ssh-keys.md) or [detailed](create-ssh-keys-detailed.md) steps to create the keys with `ssh-keygen`.

### Create SSH keys with PuTTYgen

If you prefer to use a GUI-based tool to create SSH keys, you can use the PuTTYgen key generator, included with the [PuTTY download package](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html). 

To create an SSH RSA key pair with PuTTYgen:

1. Start PuTTYgen.

2. Click **Generate**. By default PuTTYgen generates a 2048-bit SSH-2 RSA key.

4. Mouse over the blank area to generate some randomness for the key.

5. After the public key is generated, optionally enter and confirm a passphrase. You will be prompted for the passphrase when you authenticate to the VM with your SSH key. Without a passphrase, if someone obtains your private key, they can log in to any VM or service that uses that key. We recommend you create a passphrase. However, if you forget the passphrase, there is no way to recover it.

6. The public key is displayed at the top of the window. You copy and paste this one-line format public key into the Azure portal or an Azure Resource Manager template when you create a Linux VM. You can also click **Save public key** to save a copy to your computer:

    ![Save PuTTY public key file](./media/ssh-from-windows/save-public-key.png)

7. Optionally, to save the private key in PuTTy private key format (.ppk file), click **Save private key**. You need the .ppk file of you want to use PuTTY later to make an SSH connection to the VM.

    ![Save PuTTY private key file](./media/ssh-from-windows/save-ppk-file.png)

    If you want to save the private key in the OpenSSH format, the private key format used by many SSH clients, click **Conversions** > **Export OpenSSH key**.

## Provide SSH public key when deploying a VM

To create a Linux VM that uses SSH keys for authentication, provide your SSH public key when creating the VM using the Azure portal or other methods.

The following example shows how you would copy and paste this public key into the Azure portal when you create a Linux VM. The public key is typically then stored in `~/.ssh/authorized_keys` on your new VM.

   ![Use public key when you create a VM in the Azure portal](./media/ssh-from-windows/use-public-key-azure-portal.png)


## Connect to your VM

One way to make an SSH connection to your Linux VM from Windows is to use an SSH client. This is the preferred method if you have an SSH client installed on your Windows system, or you use SSH tools in Bash in Azure Cloud Shell. If you prefer a GUI-based tool, you can connect with PuTTY.  

### Use an SSH client
With the public key deployed on your Azure VM, and the private key on your local system, SSH to your VM using the IP address or DNS name of your VM. Replace *azureuser* and *myvm.westus.cloudapp.azure.com* in the following command with the administrator user name and the fully qualified domain name (or IP address):

```bash
ssh azureuser@myvm.westus.cloudapp.azure.com
```

If you configured a passphrase when you created your key pair, enter the passphrase when prompted during the login process.

### Connect with PuTTY

If you installed the [PuTTY download package](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html) and previously generated a PuTTY private key (.ppk file), you can connect to the Linux VM with PuTTY.

1. Start PuTTy.

2. Fill in the host name or IP address of your VM from the Azure portal:

    ![Open new PuTTY connection](./media/ssh-from-windows/putty-new-connection.png)

3. Before selecting **Open**, click **Connection** > **SSH** > **Auth** tab. Browse to and select your PuTTY private key (.ppk file):

    ![Select your PuTTY private key for authentication](./media/ssh-from-windows/putty-auth-dialog.png)

4. Click **Open** to connect to your VM.

## Next steps

* For detailed steps, options, and advanced examples of working with SSH keys, see [detailed steps to create SSH key pairs](create-ssh-keys-detailed.md).

* You can also use PowerShell in Azure Cloud Shell to generate SSH keys and make SSH connections to Linux VMs. See the [PowerShell quickstart](../../cloud-shell/quickstart-powershell.md#ssh).

* If you have trouble using SSH to connect to your Linux VMs, see [Troubleshoot SSH connections to an Azure Linux VM](troubleshoot-ssh-connection.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
