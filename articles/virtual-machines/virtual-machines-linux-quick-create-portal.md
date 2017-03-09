---
title: Azure Quick Start - Create VM Portal | Microsoft Docs
description: Azure Quick Start - Create VM Portal
services: virtual-machines-linux
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/08/2017
ms.author: nepeters
---

# Create a Linux virtual machine with the Azure portal

Azure virtual machines can be created through the Azure portal. This method provides a browser-based user interface for creating and configuring VMs, and all related Azure resources.

Before you start, both a private and public SSH key is needed. For detailed information on creating SSH keys for Azure, see [Create SSH keys for Azure](./virtual-machines-linux-mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Create virtual machine

1. Log in to the Azure portal at http://portal.azure.com.

2. Click the **New** button found on the upper left-hand corner of the Azure portal.

3. Select **Compute** from the Marketplace screen, select **Ubuntu Server 16.04 LTS** from the featured apps screen, and then click the **Create** button.

4. Fill out the virtual machine basics form. For **Authentication type**, SSH is recommended. When pasting in your SSH public key, take care to remove any leading or trailing white space. For **Resource group**, create a new one. A resource group is a logical container into which Azure resources are created and collectively managed.

    ![Enter basic information about your VM in the portal blade](./media/virtual-machine-quick-start/create-vm-portal-basic-blade.png)  

5. Choose a size for the VM and click **Select**. 

    ![Select a size for your VM in the portal blade](./media/virtual-machine-quick-start/create-vm-portal-size-blade.png)

6. On the settings pane, select **Yes** under **Use managed disks**, keep the defaults for the rest of the settings, and click **OK**.

7. On the summary page, click **Ok** to start the virtual machine deployment.

## Connect to virtual machine

After the deployment has completed, create an SSH connection with the virtual machine.

1. Click the virtual machine. The VM can be found on the home screen of the Azure portal, or by selecting **Virtual Machines** from the left-hand menu.

2. Click the **connect** button. The connect button displays an SSH connection string that can be used to connect to the virtual machine.

    ![Portal 9](./media/virtual-machine-quick-start/portal-quick-start-9.png) 

3. Run the following command to create an SSH session. Replace the connection string with the one you copied from the Azure portal.

```bash 
ssh <replace with IP address>
```
## Delete virtual machine

When no longer needed, delete the resource group, virtual machine, and all related resources. To do so, select the resource group from the virtual machine blade and click **Delete**.

## Next steps

[Create highly available virtual machines tutorial](./virtual-machines-linux-create-cli-complete.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

[Explore VM deployment CLI samples](./virtual-machines-linux-cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
