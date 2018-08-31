---
title: Quickstart - Create a Linux VM in the Azure portal | Microsoft Docs
description: In this quickstart, you learn how to use the Azure portal to create a Linux virtual machine
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/03/2018
ms.author: cynthn
ms.custom: mvc
---

# Quickstart: Create a Linux virtual machine in the Azure portal

Azure virtual machines (VMs) can be created through the Azure portal. This method provides a browser-based user interface to create VMs and their associated resources. This quickstart shows you how to use the Azure portal to deploy a Linux virtual machine (VM) in Azure that runs Ubuntu. To see your VM in action, you then SSH to the VM and install the NGINX web server.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create SSH key pair

You need an SSH key pair to complete this quickstart. If you have an existing SSH key pair, this step can be skipped.

To create an SSH key pair and log into Linux VMs, run the following command from a Bash shell and follow the on-screen directions. For example, you can use the [Azure Cloud Shell](../../cloud-shell/overview.md) or the [Windows Substem for Linux](/windows/wsl/install-win10). The command output includes the file name of the public key file. Copy the contents of the public key file (`cat ~/.ssh/id_rsa.pub`) to the clipboard:

```bash
ssh-keygen -t rsa -b 2048
```

For more detailed information on how to create SSH key pairs, including the use of PuTTy, see [How to use SSH keys with Windows](ssh-from-windows.md).

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com

## Create virtual machine

1. Choose **Create a resource** in the upper left-hand corner of the Azure portal.

2. In the search box above the list of Azure Marketplace resources, search for and select **Ubuntu Server 16.04 LTS** by Canonical, then choose **Create**.

3. Provide a VM name, such as *myVM*, leave the disk type as *SSD*, then provide a username, such as *azureuser*.

4. For **Authentication type**, select **SSH public key**, then paste your public key into the text box. Take care to remove any leading or trailing white space in your public key.

    ![Enter basic information about your VM in the portal blade](./media/quick-create-portal/create-vm-portal-basic-blade.png)

5. Choose to **Create new** resource group, then provide a name, such as *myResourceGroup*. Choose your desired **Location**, then select **OK**.

4. Select a size for the VM. You can filter by *Compute type* or *Disk type*, for example. A suggested VM size is *D2s_v3*.

    ![Screenshot that shows VM sizes](./media/quick-create-portal/create-linux-vm-portal-sizes.png)

5. On the **Settings** page, in **Network** > **Network Security Group** > **Select public inbound ports**, select **HTTP** and **SSH (22)**. Leave the rest of the defaults and select **OK**.

6. On the summary page, select **Create** to start the VM deployment.

7. The VM is pinned to the Azure portal dashboard. Once the deployment has completed, the VM summary automatically opens.

## Connect to virtual machine

Create an SSH connection with the VM.

1. Select the **Connect** button on the overview page for your VM. 

    ![Portal 9](./media/quick-create-portal/portal-quick-start-9.png)

2. In the **Connect to virtual machine** page, keep the default options to connect by DNS name over port 22. In **Login using VM local account** a connection command is shown. Click the button to copy the command. The following example shows what the SSH connection command looks like:

    ```bash
    ssh azureuser@myvm-123abc.eastus.cloudapp.azure.com
    ```

3. Paste the SSH connection command into a shell, such as the Azure Cloud Shell or Bash on Ubuntu on Windows to create the connection. 

## Install web server

To see your VM in action, install the NGINX web server. To update package sources and install the latest NGINX package, run the following commands from your SSH session:

```bash
# update packages
sudo apt-get -y update

# install NGINX
sudo apt-get -y install nginx
```

When done, `exit` the SSH session and return to the VM properties in the Azure portal.


## View the web server in action

With NGINX installed and port 80 open to your VM, the web server can now be accessed from the internet. Open a web browser, and enter the public IP address of the VM. The public IP address can be found on the VM overview page, or at the top of the *Networking* page where you add the inbound port rule.

![NGINX default site](./media/quick-create-cli/nginx.png)

## Clean up resources

When no longer needed, you can delete the resource group, virtual machine, and all related resources. To do so, select the resource group for the virtual machine, select **Delete**, then confirm the name of the resource group to delete.

## Next steps

In this quickstart, you deployed a simple virtual machine, created a Network Security Group and rule, and installed a basic web server. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.

> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)
