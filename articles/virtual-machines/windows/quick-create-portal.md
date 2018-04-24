---
title: Azure Quick Start - Create Windows VM Portal | Microsoft Docs
description: Azure Quick Start - Create Windows VM Portal
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 04/24/2018
ms.author: cynthn
ms.custom: mvc
---

# Quickstart: Create a Linux virtual machine in the Azure portal

Azure virtual machines (VMs) can be created through the Azure portal. This method provides a browser-based user interface to create VMs and their associated resources. This quickstart shows you how to use the Azure portal to deploy a virtual machine (VM) in Azure that runs Windows Server 2016. To see your VM in action, you then RDP to the VM and install the IIS web server.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to Azure

Log in to the Azure portal at https://portal.azure.com.

## Create virtual machine

1. Choose **Create a resource** in the upper left-hand corner of the Azure portal.

2. In the search box above the list of Azure Marketplace resources, search for and select **Windows Server 2016 Datacenter**, then choose **Create**.

3. Provide a VM name, such as *myVM*, leave the disk type as *SSD*, then provide a username, such as *azureuser*. The password must be at least 12 characters long and meet the [defined complexity requirements](faq.md#what-are-the-password-requirements-when-creating-a-vm).

    ![Enter basic information about your VM in the portal blade](./media/quick-create-portal/create-windows-vm-portal-basic-blade.png)

5. Choose to **Create new** resource group, then provide a name, such as *myResourceGroup*. Choose your desired **Location**, then select **OK**.

4. Select a size for the VM. You can filter by *Compute type* or *Disk type*, for example. A suggested VM size is *D2s_v3*.

    ![Screenshot that shows VM sizes](./media/quick-create-portal/create-windows-vm-portal-sizes.png)

5. Under **Settings**, leave the defaults and select **OK**.

6. On the summary page, select **Create** to start the VM deployment.

7. The VM is pinned to the Azure portal dashboard. Once the deployment has completed, the VM summary automatically opens.

## Connect to virtual machine

Create a remote desktop connection to the virtual machine.

1. Click the **Connect** button on the virtual machine properties. A Remote Desktop Protocol file (.rdp file) is created and downloaded.

    ![Connect to an Azure VM from the portal](./media/quick-create-portal/quick-create-portal/portal-quick-start-9.png)

2. To connect to your VM, open the downloaded RDP file. If prompted, click **Connect**. On a Mac, you need an RDP client such as this [Remote Desktop Client](https://itunes.apple.com/us/app/microsoft-remote-desktop/id715768417?mt=12) from the Mac App Store.

3. Enter the user name and password you specified when creating the virtual machine, then click **Ok**.

4. You may receive a certificate warning during the sign-in process. Click **Yes** or **Continue** to proceed with the connection.

## Install web server

To see your VM in action, install the IIS web server. Open a PowerShell prompt on the VM and run the following command:

```powershell
Install-WindowsFeature -name Web-Server -IncludeManagementTools
```

When done, close the RDP connection to the VM.

## Open port 80 for web traffic

A Network Security Group (NSG) secures inbound and outbound traffic. When a VM is created from the Azure portal, an inbound rule is created on port 3389 for RDP connections. Because this VM hosts a web server, an NSG rule needs to be created for port 80.

1. On the VM overview page, select **Networking**.
2. The list of existing inbound and outbound rules are shown. Choose to **Add inbound port rule**.
3. Select the **Basic** option across the top, then choose *HTTP* from the list of available services. Port 80, a priority, and name, are provided for you.
4. To create the rule, select **Add**.

## View the IIS welcome page

With IIS installed and port 80 now open on your VM from the Internet, use a web browser of your choice to view the default IIS welcome page. Use the public IP address of your VM obtained in a previous step. The following example shows the default IIS web site:

![IIS default site](./media/quick-create-powershell/default-iis-website.png)

## Clean up resources

When no longer needed, you can delete the resource group, virtual machine, and all related resources. To do so, select the resource group for the virtual machine, select **Delete**, then confirm the name of the resource group to delete.

## Next steps

In this quick start, you deployed a simple virtual machine, open a network port for web traffic, and installed a basic web server. To learn more about Azure virtual machines, continue to the tutorial for Windows VMs.

> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](./tutorial-manage-vm.md)
