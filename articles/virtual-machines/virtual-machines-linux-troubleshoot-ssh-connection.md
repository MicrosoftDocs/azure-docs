<properties
	pageTitle="Troubleshoot SSH connection to an Azure VM | Microsoft Azure"
	description="Troubleshoot and fix SSH errors like SSH connection failed or SSH connection refused for an Azure virtual machine running Linux."
	keywords="ssh connection refused,ssh error,azure ssh,SSH connection failed"
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
	ms.topic="support-article"
	ms.date="06/14/2016"
	ms.author="iainfou"/>

# Troubleshoot SSH connection to an Azure VM

There are various reasons that you might get Secure Shell (SSH) errors when you try to connect to a Linux-based Azure virtual machine (VM). This article will help you find and correct the problems.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and Stack Overflow forums](http://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](http://azure.microsoft.com/support/options/) and select **Get support**. For information about using Azure Support, read the [Microsoft Azure support FAQ](http://azure.microsoft.com/support/faq/).

## VMs created by using the Resource Manager deployment model

You can reset credentials or SSHD using either Azure CLI commands directly or the [Azure VMAccessForLinux extension](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess). The Azure CLI provides a direct way to interact with the VM.

### Azure CLI pre-reqs

If you haven't already, [install the Azure CLI and connect to your Azure subscription](../xplat-cli-install.md). Sign in by using the `azure login` command and make sure you are in Resource Manager mode (`azure config mode arm`).

Make sure [Microsoft Azure Linux Agent](virtual-machines-linux-agent-user-guide.md) version 2.0.5 or later is installed.

## Azure CLI - Reset SSHD
You can reset SSHD to make sure the SSH configuration itself is valid:

```bash
azure vm reset-access -g <resource group> -n <vm name> -r
```

## Azure CLI - Reset SSH credentials for a user
Reset the password for a giver user:

```bash
azure vm reset-access -g <resource group> <vm name> -u <username> -p <new password>
```

Reset the SSH key for a given user:

```bash
azure vm reset-access -g <resource group> -n <vm name> -u <usernamer> -M <~/.ssh/azure_id_rsa.pub>
```

## VM Access Extension - reset SSHD
Create a file named PrivateConf.json with the following content:

```bash
{  
	"reset_ssh":"True"
}
```

Then manually run the `VMAccessForLinux` extension to reset your SSHD connection:

```bash
azure vm extension set <resource group> <vm name> VMAccessForLinux Microsoft.OSTCExtensions "1.2" --private-config-path PrivateConf.json
```

## VM Access Extension - Reset SSH credentials for a user
To reset the password for a given user, create a file named PrivateConf.json with the following contents:

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

Then manually run the `VMAccessForLinux` extension to reset your SSH user credentials:

```
azure vm extension set <resource group> <vmname> VMAccessForLinux Microsoft.OSTCExtensions "1.2" --private-config-path PrivateConf.json
```

If you want to try other troubleshooting approaches, you can follow steps in [Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](virtual-machines-linux-using-vmaccess-extension.md).


## Troubleshoot VMs created by using the Classic deployment model

Try these steps to resolve the most common SSH connection failures for VMs that were created by using the classic deployment model. After each step, try reconnecting to the VM.

- Reset remote access from the [Azure portal](https://portal.azure.com). On the Azure portal, select **Browse** > **Virtual machines (classic)** > *your Linux virtual machine* > **Reset Remote...**.

- Restart the VM. On the [Azure portal](https://portal.azure.com), select **Browse** > **Virtual machines (classic)** > *your Linux virtual machine* > **Restart**.

	-OR-

	On the [Azure classic portal](https://manage.windowsazure.com), select **Virtual machines** > **Instances** > **Restart**.

- Redeploy the VMe to a new Azure node. For information about how to do this, see [Redeploy virtual machine to new Azure node](virtual-machines-windows-redeploy-to-new-node.md).

	Note that after this operation finishes, ephemeral disk data will be lost and dynamic IP addresses that are associated with the virtual machine will be updated.

- Follow the instructions in [How to reset a password or SSH for Linux-based virtual machines](virtual-machines-linux-classic-reset-access.md) to:
	- Reset the password or SSH key.
	- Create a new _sudo_ user account.
	- Reset the SSH configuration.

- Check the VM's resource health for any platform issues.<br>
	 Select **Browse** > **Virtual Machines (classic)** > *your Linux virtual machine* > **Settings** > **Check Health**.
	 

## Additional resources

- For more information about troubleshooting virtual machines that were created by using the classic deployment model, see [How to reset a password or SSH for Linux-based virtual machines](virtual-machines-linux-classic-reset-access.md).

- For more information about troubleshooting virtual machines that were created by using the Resource Manager deployment model, see:
	- [Troubleshoot Windows Remote Desktop connections to a Windows-based Azure virtual machine](virtual-machines-windows-troubleshoot-rdp-connection.md)
	-	[Troubleshoot access to an application running on an Azure virtual machine](virtual-machines-linux-troubleshoot-app-connection.md)