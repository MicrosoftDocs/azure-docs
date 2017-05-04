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
ms.topic: hero-article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/13/2017
ms.author: nepeters
---

# Create a Linux virtual machine with the Azure portal

Azure virtual machines can be created through the Azure portal. This method provides a browser-based user interface for creating and configuring virtual machines and all related resources. This Quickstart steps through creating a virtual machine using the Azure portal.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create SSH key pair

You need an SSH key pair to complete this quick start. If you have an existing SSH key pair, this step can be skipped. If you are using a Windows machine, follow the instructions found [here](ssh-from-windows.md). 

From a Bash shell, run this command and follow the on-screen directions. The command output includes the file name of the public key file. The contents of this file are needed when creating the virtual machine.

```bash
ssh-keygen -t rsa -b 2048
```

## Log in to Azure 

Log in to the Azure portal at http://portal.azure.com.

## Create virtual machine

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Select **Compute** from the **New** blade, select *Ubuntu Server 16.04 LTS* from the **Compute** blade, and then click the **Create** button.

3. Fill out the virtual machine **Basics** form. For **Authentication type**, select *SSH*. When pasting in your **SSH public key**, take care to remove any leading or trailing white space. For **Resource group**, create a new one. A resource group is a logical container into which Azure resources are created and collectively managed. When complete, click **OK**.

    ![Enter basic information about your VM in the portal blade](./media/quick-create-portal/create-vm-portal-basic-blade.png)  

4. Choose a size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. 

    ![Screenshot that shows VM sizes](./media/quick-create-portal/create-linux-vm-portal-sizes.png)  

5. On the settings blade, select *Yes* under **Use managed disks**, keep the defaults for the rest of the settings, and click **OK**.

6. On the summary page, click **Ok** to start the virtual machine deployment.

7. To monitor deployment status, click the virtual machine. The VM can be found on the Azure portal dashboard, or by selecting **Virtual Machines** from the left-hand menu. When the VM has been created, the status changes from *Deploying* to *Running*.


## Open port 80 for web traffic 

By default only SSH connections are allowed into Linux virtual machines deployed in Azure. If this VM is going to be a webserver, you need to open port 80 to web traffic. This step walks you through creating a network security group (NSG) rule to allow inbound connections on port 80.

1. On the blade for the virtual machine, in the **Essentials** section, click the name of the **Resource group**.
2. In the blade for the resource group, click the **Network security group** in the list of resources. The NSG name should be the VM name with *-nsg* appended to the end.
3. Click the **Inbound Security Rule** heading to open the list of inbound rules. You should see a rule for RDP already in the list.
4. Click **+ Add** to open the **Add inbound security rule** blade.
5. In **Name**, type *nginx*. Make sure **Port range** is set to *80* and **Action** is set to *Allow*. Click **OK**.


## Connect to virtual machine

After the deployment has completed, create an SSH connection with the virtual machine.

1. Click the **Connect** button on the virtual machine blade. The connect button displays an SSH connection string that can be used to connect to the virtual machine.

    ![Portal 9](./media/quick-create-portal/portal-quick-start-9.png) 

2. Run the following command to create an SSH session. Replace the connection string with the one you copied from the Azure portal.

```bash 
ssh <replace with IP address>
```

## Install NGINX

Use the following bash script to update package sources and install the latest NGINX package. 

```bash 
#!/bin/bash

# update package source
apt-get -y update

# install NGINX
apt-get -y install nginx
```

## View the NGIX welcome page

With NGINX installed and port 80 now open on your VM from the Internet - you can use a web browser of your choice to view the default NGINX welcome page. Get the *Public IP address* from the blade for the VM and use it to visit the default web page.

![NGINX default site](./media/quick-create-cli/nginx.png) 
## Delete virtual machine

When no longer needed, delete the resource group, virtual machine, and all related resources. To do so, select the resource group from the virtual machine blade and click **Delete**.

## Next steps

[Create highly available virtual machines tutorial](create-cli-complete.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

[Explore VM deployment CLI samples](../windows/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
