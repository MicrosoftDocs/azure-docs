---
title: Azure Quick Start - Create Windows VM Portal | Microsoft Docs
description: Azure Quick Start - Create Windows VM Portal
services: virtual-machines-windows
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 03/21/2017
ms.author: nepeters
---

# Create a Windows virtual machine with the Azure portal

Azure virtual machines can be created through the Azure portal. This method provides a browser-based user interface for creating and configuring virtual machines and all related resources. This Quickstart steps through creating a virtual machine using the Azure portal. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Log in to Azure 

Log in to the Azure portal at http://portal.azure.com.

## Create virtual machine

2. Click the **New** button found on the upper left-hand corner of the Azure portal.

3. Select **Compute** from the **New** blade, select **Windows Server 2016 Datacenter** from the **Compute** blade, and then click the **Create** button.

4. Fill out the virtual machine **Basics** form. The user name and password entered here is used to log in to the virtual machine. For **Resource group**, create a new one. A resource group is a logical container into which Azure resources are created and collectively managed. When complete, click **OK**.

    ![Enter basic information about your VM in the portal blade](./media/virtual-machine-quick-start/create-windows-vm-portal-basic-blade.png)  

5. Choose a size for the VM and click **Select**. 

6. On the settings blade, select **Yes** under **Use managed disks**, keep the defaults for the rest of the settings, and click **OK**.

7. On the summary page, click **Ok** to start the virtual machine deployment.

8. To monitor deployment status, click the virtual machine. The VM can be found on the Azure portal dashboard, or by selecting **Virtual Machines** from the left-hand menu. When the VM has been created, the status changes from **Deploying** to **Running**.

## Connect to virtual machine

After the deployment has completed, create a remote desktop connection to the virtual machine.

1. Click the **Connect** button on the virtual machine blade. A Remote Desktop Protocol file (.rdp file) is created and downloaded.

    ![Portal 9](./media/virtual-machine-quick-start/portal-quick-start-9.png) 

2. To connect to your VM, open the downloaded RDP file. If prompted, click **Connect**. On a Mac, you need an RDP client such as this [Remote Desktop Client](https://itunes.apple.com/us/app/microsoft-remote-desktop/id715768417?mt=12) from the Mac App Store.

3. Enter the user name and password you specified when creating the virtual machine, then click **Ok**.

4. You may receive a certificate warning during the login process. Click **Yes** or **Continue** to proceed with the connection.

## Delete virtual machine

When no longer needed, delete the resource group, virtual machine, and all related resources. To do so, select the resource group from the virtual machine blade and click **Delete**.

## Next steps

[Install a role and configure firewall tutorial](./virtual-machines-windows-hero-role.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

[Explore VM deployment CLI samples](./virtual-machines-windows-cli-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)