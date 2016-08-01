<properties
	pageTitle="SSH connection to a Linux VM is refused, fails or errors out | Microsoft Azure"
	description="Troubleshoot and fix SSH errors like SSH connection failed or SSH connection refused for an Azure virtual machine running Linux."
	keywords="ssh connection refused, ssh error, azure ssh, SSH connection failed"
	services="virtual-machines-linux"
	documentationCenter=""
	authors="iainfoulds"
	manager="timlt"
	editor=""
	tags="top-support-issue,azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/06/2016"
	ms.author="iainfou"/>

# Troubleshoot SSH connection to a Azure Linux VM that fails, errors out or is refused

There are various reasons that you might get Secure Shell (SSH) errors, SSH connection fails or is refused when you try to connect to a Linux-based Azure virtual machine (VM). This article will help you find and correct the problems.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and Stack Overflow forums](http://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](http://azure.microsoft.com/support/options/) and select **Get support**. For information about using Azure Support, read the [Microsoft Azure support FAQ](http://azure.microsoft.com/support/faq/).

## VMs created by using the Resource Manager deployment model

You can reset credentials or SSHD using either Azure CLI commands directly or using the [Azure VMAccessForLinux extension](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess). After each troubleshooting step, try connecting to your VM again.

### Azure CLI pre-reqs

If you haven't already, [install the Azure CLI and connect to your Azure subscription](../xplat-cli-install.md). Sign in by using the `azure login` command and make sure you are in Resource Manager mode (`azure config mode arm`).

Make sure [Microsoft Azure Linux Agent](virtual-machines-linux-agent-user-guide.md) version 2.0.5 or later is installed.

### Reset SSHD
The SSHD configuration itself may be misconfigured or the service encountered an error. You can reset SSHD to make sure the SSH configuration itself is valid.

#### Azure CLI
```bash
azure vm reset-access -g <resource group> -n <vm name> -r
```

#### VM Access Extension
Access extensions read in a json file that defines which action to carry out, such as resetting SSH, resetting an SSH key, adding a new user, etc. First, create a file named PrivateConf.json with the following content:

```bash
{  
	"reset_ssh":"True"
}
```

Then manually run the `VMAccessForLinux` extension to reset your SSHD connection:

```bash
azure vm extension set <resource group> <vm name> VMAccessForLinux Microsoft.OSTCExtensions "1.2" --private-config-path PrivateConf.json
```

### Reset SSH credentials for a user
If SSHD appears to functioning correctly, you can reset the password for a giver user.

#### Azure CLI
```bash
azure vm reset-access -g <resource group> <vm name> -u <username> -p <new password>
```

If using SSH key authentication, you can reset the SSH key for a given user:

```bash
azure vm reset-access -g <resource group> -n <vm name> -u <username> -M <~/.ssh/azure_id_rsa.pub>
```

#### VM Access Extension
Create a file named PrivateConf.json with the following contents:

```bash
{
	"username":"Username", "password":"NewPassword"
}
```

Or to reset the SSH key for a given user, create a file named PrivateConf.json with the following contents:

```bash
{
	"username":"Username", "ssh_key":"ContentsOfNewSSHKey"
}
```

After either of the above steps, you then manually run the `VMAccessForLinux` extension to reset your SSH user credentials:

```
azure vm extension set <resource group> <vmname> VMAccessForLinux Microsoft.OSTCExtensions "1.2" --private-config-path PrivateConf.json
```

### Redeploy a VM
You can redeploy a VM to another node within Azure, which may correct any underlying networking issues. To redeploy a VM using the Azure portal, select **Browse** > **Virtual machines** > *your Linux virtual machine* > **Redeploy**. For information about how to do this, see [Redeploy virtual machine to new Azure node](virtual-machines-windows-redeploy-to-new-node.md). You cannot currently redeploy a VM using the Azure CLI.

> [AZURE.NOTE] Note that after this operation finishes, ephemeral disk data will be lost and dynamic IP addresses that are associated with the virtual machine will be updated.


## VMs created by using the Classic deployment model

Try these steps to resolve the most common SSH connection failures for VMs that were created by using the classic deployment model. After each step, try reconnecting to the VM.

- Reset remote access from the [Azure portal](https://portal.azure.com). On the Azure portal, select **Browse** > **Virtual machines (classic)** > *your Linux virtual machine* > **Reset Remote...**.

- Restart the VM. On the [Azure portal](https://portal.azure.com), select **Browse** > **Virtual machines (classic)** > *your Linux virtual machine* > **Restart**.

	-OR-

	On the [Azure classic portal](https://manage.windowsazure.com), select **Virtual machines** > **Instances** > **Restart**.

- Redeploy the VM to a new Azure node. For information about how to do this, see [Redeploy virtual machine to new Azure node](virtual-machines-windows-redeploy-to-new-node.md).

	Note that after this operation finishes, ephemeral disk data will be lost and dynamic IP addresses that are associated with the virtual machine will be updated.

- Follow the instructions in [How to reset a password or SSH for Linux-based virtual machines](virtual-machines-linux-classic-reset-access.md) to:
	- Reset the password or SSH key.
	- Create a new _sudo_ user account.
	- Reset the SSH configuration.

- Check the VM's resource health for any platform issues.<br>
	 Select **Browse** > **Virtual Machines (classic)** > *your Linux virtual machine* > **Settings** > **Check Health**.


## Additional resources

- If you are still unable to SSH to your VM after following the after steps, you can follow [more detailed troubleshooting steps](virtual-machines-linux-detailed-troubleshoot-ssh-connection.md) to review additional networking configurations and steps to resolve your issue.

- For more information about troubleshooting application access, see [Troubleshoot access to an application running on an Azure virtual machine](virtual-machines-linux-troubleshoot-app-connection.md)

- For more information about troubleshooting virtual machines that were created by using the classic deployment model, see [How to reset a password or SSH for Linux-based virtual machines](virtual-machines-linux-classic-reset-access.md).
