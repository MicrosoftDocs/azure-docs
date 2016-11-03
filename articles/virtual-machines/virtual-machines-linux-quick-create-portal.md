---
title: Create a Linux VM using the Azure Portal | Microsoft Docs
description: Create a Linux VM using the Azure Portal.
services: virtual-machines-linux
documentationcenter: ''
author: vlivech
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: cc5dc395-dc54-4402-8804-2bb15aba8ea2
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: hero-article
ms.date: 10/28/2016
ms.author: v-livech

---
# Create a Linux VM on Azure using the Portal
This article shows you how to use the [Azure portal](https://portal.azure.com/) to create a Linux Virtual Machine.

The requirements are:

* [an Azure account](https://azure.microsoft.com/pricing/free-trial/)
* [SSH public and private key files](virtual-machines-linux-mac-create-ssh-keys.md)

## Sign in
Signed into the Azure portal with your Azure account identity, click **+ New** in the upper left corner:

![screen1](../media/virtual-machines-linux-quick-create-portal/screen1.png)

## Choose VM
Click **Virtual Machines** in the **Marketplace** then **Ubuntu Server 14.04 LTS** from the **Featured Apps** images list.  Verify at the bottom that the deployment model is `Resource Manager` and then click **Create**.

![screen2](../media/virtual-machines-linux-quick-create-portal/screen2.png)

## Enter VM options
On the **Basics** page, enter:

* a name for the VM
* a username for the Admin User
* the Authentication Type set to **SSH public key**
* your SSH public Key as a string (from your `~/.ssh/` directory)
* a resource group name or select an existing group

and Click **OK** to continue and choose the VM size; it should look something like the following screenshot:

![screen3](../media/virtual-machines-linux-quick-create-portal/screen3.png)

## Choose VM size
Choose the **DS1** size, which installs Ubuntu on a Premium SSD, and click **Select** to configure settings.

![screen4](../media/virtual-machines-linux-quick-create-portal/screen4.png)

## Storage and network
In **Settings**, leave the defaults for Storage and Network values, and click **OK** to view the summary.  Notice the disk type has been set to Premium SSD by choosing DS1, the **S** notates SSD.

![screen5](../media/virtual-machines-linux-quick-create-portal/screen5.png)

## Confirm VM settings and launch
Confirm the settings for your new Ubuntu VM, and click **OK**.

![screen6](../media/virtual-machines-linux-quick-create-portal/screen6.png)

## Find the VM NIC
Open the Portal Dashboard and in **Network interfaces** choose your NIC

![screen7](../media/virtual-machines-linux-quick-create-portal/screen7.png)

## Find the public IP
Open the Public IP addresses menu under the NIC settings

![screen8](../media/virtual-machines-linux-quick-create-portal/screen8.png)

## SSH to the VM
SSH into the public IP using your SSH public key.  From a Mac or Linux workstation, you can SSH directly from the Terminal. If you are on a Windows workstation, you need to use PuTTY, MobaXTerm or Cygwin to SSH to Linux.  If you have not already, here is a doc that gets your Windows workstation ready to SSH to Linux.

[How to Use SSH keys with Windows on Azure](virtual-machines-linux-ssh-from-windows.md)

```
ssh -i ~/.ssh/azure_id_rsa ubuntu@13.91.99.206
```

## Next Steps
Now you've created a Linux VM quickly to use for testing or demonstration purposes. To create a Linux VM customized for your infrastructure, you can follow any of these articles.

* [Create a Linux VM on Azure using Templates](virtual-machines-linux-cli-deploy-templates.md)
* [Create an SSH Secured Linux VM on Azure using Templates](virtual-machines-linux-create-ssh-secured-vm-from-template.md)
* [Create a Linux VM using the Azure CLI](virtual-machines-linux-create-cli-complete.md)

