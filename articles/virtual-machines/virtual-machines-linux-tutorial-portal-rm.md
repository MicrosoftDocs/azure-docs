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

[AZURE.INCLUDE [free-trial-note](../../includes/free-trial-note.md)]

## How to create the Linux virtual machine

This tutorial uses the **From Gallery** method to create a virtual machine because it gives you more options than the **Quick Create** method. You can choose connected resources, the DNS name, and the network connectivity if needed.

## Choose Ubuntu VM

![choosing a VM image](media/virtual-machines-linux-tutorial-portal-rm/chooseubuntuvm.png)

## Change to the Resource Manager compute stack

At the bottom of the Ubuntu Server 14.04. LTS image summary, look for and select **Use the Resource Manager stack** in the **Select a compute stack** text box: 

![change to the resource manager compute stack](media/virtual-machines-linux-tutorial-portal-rm/changetoresourcestack.png)

and click the ![create button](media/virtual-machines-linux-tutorial-portal-rm/createbutton.png) button.

## Enter the basic configuration

You must enter basic VM information, such as the name of the VM, the username of the first user, the authentication type and authentication information, choose a subscription, select a resource group for the deployment (or create a new one), and select a location for the deployment. 

This article uses `ubuntuvm`, `ops`, enters a public key file (in **ssh-rsa** format, in this case from the `~/.ssh/id_rsa.pub` file), chooses a specific Azure subscription, and the location `East US`.

	cat ~/.ssh/id_rsa.pub                                                                                          

> [AZURE.NOTE] You may also choose username/password authentication here and enter that information if you do not want to secure your **ssh** session with a public and private key exchange.

![](media/virtual-machines-linux-tutorial-portal-rm/step-1-thebasics.png)


## Select the size

In this step, choose the pricing tier that you want for your VM, and click the ![select button](media/virtual-machines-linux-tutorial-portal-rm/selectbutton-size.png) button at the bottom.

## Step three

Modify the other values needed to get your Azure VM up and running, including disk types, storage accounts for the VM disk, networking values, and others. When you're ready, press the ![OK button](media/virtual-machines-linux-tutorial-portal-rm/okbutton.png) button.

![](media/virtual-machines-linux-tutorial-portal-rm/step-3-settings.png)

When you press the ![OK button](media/virtual-machines-linux-tutorial-portal-rm/okbutton.png) button you can see the summary of activities that will be performed. It should look like the following image (although you may have chosen different values):

![creation summary](media/virtual-machines-linux-tutorial-portal-rm/summarybeforecreation.png)

> [AZURE.NOTE] Note that the summary does not contain a public DNS name the way it does when a VM is created inside a Cloud Service using the service management compute stack. 

To create the VM and its supporting resources, click the ![OK button](media/virtual-machines-linux-tutorial-portal-rm/createbutton.png) button at the bottom of the summary. It should only be a few moments to wait for the VM to be ready to use.

## Connect to your Azure Linux VM using **ssh**

Now you can connect to your Ubuntu VM using **ssh** in the standard way. However, you're going to need to discover the IP address allocated to the Azure VM by opening the tile for the VM and its resources. You can either do this by clicking **Browse**, then selecting **Recent** and looking for the VM you created, or clicking the tile created for you on the home screen. In either case, locate and copy the **Public IP Address** value, shown in the following graphic.

![summary of successful creation](media/virtual-machines-linux-tutorial-portal-rm/successresultwithip.png)

Now you can **ssh** into your Azure VM, and you're ready to go.

	ssh ops@23.96.106.1 -p 22
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


## Next Steps

To learn more about Linux on Azure, see:

- [Linux and Open-Source Computing on Azure](virtual-machines-linux-opensource.md)

- [How to use the Azure Command-Line Tools for Mac and Linux](virtual-machines-command-line-tools.md)

- [Deploy a LAMP app using the Azure CustomScript Extension for Linux](virtual-machines-linux-script-lamp.md)

- [About Azure VM configuration settings](http://msdn.microsoft.com/library/azure/dn763935.aspx)

- [The Docker Virtual Machine Extension for Linux on Azure](virtual-machines-docker-vm-extension.md)
