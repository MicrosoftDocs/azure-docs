<properties
	pageTitle="Create an Azure virtual machine running Linux in the Azure Portal"
	description="Use the Azure Portal to create an Azure virtual machine (VM) running Linux with the Azure resource groups."
	services="virtual-machines"
	documentationCenter=""
	authors="squillace"
	manager="timlt"
	editor="tysonn"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/13/2015"
	ms.author="kathydav"/>

# Create a Virtual Machine Running Linux using the Azure Portal

> [AZURE.SELECTOR]
- [Azure CLI](virtual-machines-linux-tutorial.md)
- [PowerShell](virtual-machines-ps-create-preconfigure-linux-vms.md)

Creating an Azure virtual machine (VM) that runs Linux is easy to do. This tutorial shows you how to use the Azure portal to create one quickly, and uses the `~/.ssh/id_rsa.pub` public key file to secure your **SSH** connection to the VM. You can also create Linux VMs using [your own images as templates](virtual-machines-linux-create-upload-vhd.md). 

[AZURE.NOTE] This topic creates an Azure virtual machine that is managed by the Azure resource group API. For details, see [Azure resource group overview](resource-group-overview.md).

[AZURE.INCLUDE [free-trial-note](../includes/free-trial-note.md)]

## How to create the Linux virtual machine

This tutorial uses the **From Gallery** method to create a virtual machine because it gives you more options than the **Quick Create** method. You can choose connected resources, the DNS name, and the network connectivity if needed.

**Important**: This tutorial creates a virtual machine that's not connected to a virtual network. If you want your virtual machine to use a virtual network, you must specify the virtual network when you create the virtual machine. For more information about virtual networks, see [Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

	cat ~/.ssh/id_rsa.pub                                                                                                      [14:17:02]
	ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDnX2FPYQWFgPR2uG0eZ/0Ooy6UccK6xFp32TmQTqWJ+79cbUyHVfa4yvJ+mXGBLQGdDIDzhXi/K8S3lhBNzJEHNF+psfMfuTokMGcD5Z9QuLeV3J7il3vW56gWhF1Mb1H0tVeqBcyRwiFPNNGqdRRJ0aRHrwqdgPcSDp9K2QTTzmy8Umk1r6PR7qD2SQvOFQcLTP26RAUn6PjzpRROIb6wnpeF35nZ1zTTGXRxd693IcZxfNc2mKUqmx/HrLjU0iaqsN6pIrj/9ckJbyi89lf9buL8djo5VHlnlkUN/l+2WWlibIFqSHyunt+NnCJjHzCOE9+lc/owh/9QJGYcvRBl ralph@local


## Connect to your Azure Linux VM using **ssh**

	ssh ops@23.96.106.1 -p 22                                                                                                  [14:29:54]
	The authenticity of host '23.96.106.1 (23.96.106.1)' can't be established.
	ECDSA key fingerprint is bc:ee:50:2b:ca:67:b0:1a:24:2f:8a:cb:42:00:42:55.
	Are you sure you want to continue connecting (yes/no)? yes
	Warning: Permanently added '23.96.106.1' (ECDSA) to the list of known hosts.
	Welcome to Ubuntu 14.04.2 LTS (GNU/Linux 3.16.0-43-generic x86_64)
	
	 * Documentation:  https://help.ubuntu.com/
	
	  System information as of Mon Jul 13 21:36:28 UTC 2015
	
	  System load: 0.31              Memory usage: 5%   Processes:       208
	  Usage of /:  42.1% of 1.94GB   Swap usage:   0%   Users logged in: 0
	
	  Graph this data and manage this system at:
	    https://landscape.canonical.com/
	
	  Get cloud support with Ubuntu Advantage Cloud Guest:
	    http://www.ubuntu.com/business/services/cloud
	
	0 packages can be updated.
	0 updates are security updates.
		
	The programs included with the Ubuntu system are free software;
	the exact distribution terms for each program are described in the
	individual files in /usr/share/doc/*/copyright.
	
	Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
	applicable law.
	
	ops@ubuntuvm:~$


> [AZURE.NOTE] You can also connect to your Linux virtual machine using an SSH key for identification. For details, see [How to Use SSH with Linux on Azure](virtual-machines-linux-use-ssh-key.md).

## Next Steps

To learn more about Linux on Azure, see:

- [Linux and Open-Source Computing on Azure](virtual-machines-linux-opensource.md)

- [How to use the Azure Command-Line Tools for Mac and Linux](virtual-machines-command-line-tools.md)

- [Deploy a LAMP app using the Azure CustomScript Extension for Linux](virtual-machines-linux-script-lamp.md)

- [About Azure VM configuration settings](http://msdn.microsoft.com/library/azure/dn763935.aspx)

- [The Docker Virtual Machine Extension for Linux on Azure](virtual-machines-docker-vm-extension.md)
