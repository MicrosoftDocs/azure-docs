---
title: Quickstart - Create a Linux VM in the Azure portal 
description: In this quickstart, you learn how to use the Azure portal to create a Linux virtual machine.
author: cynthn
ms.service: virtual-machines-linux
ms.topic: quickstart
ms.workload: infrastructure
ms.date: 11/05/2019
ms.author: cynthn
ms.custom: mvc
---

# Quickstart: Create a Linux virtual machine in the Azure portal

Azure virtual machines (VMs) can be created through the Azure portal. The Azure portal is a browser-based user interface to create Azure resources. This quickstart shows you how to use the Azure portal to deploy a Linux virtual machine (VM) running Ubuntu 18.04 LTS. To see your VM in action, you also SSH to the VM and install the NGINX web server.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create SSH key pair

You need an SSH key pair to complete this quickstart. If you already have an SSH key pair, you can skip this step.

Open a bash shell and use [ssh-keygen](https://www.ssh.com/ssh/keygen/) to create an SSH key pair. If you don't have a bash shell on your local computer, you can use the [Azure Cloud Shell](https://shell.azure.com/bash).


1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the menu at the top of the page, select the `>_` icon to open Cloud Shell.
1. Make sure the CloudShell says **Bash** in the upper left. If it says PowerShell, use the drop-down to select **Bash** and select **Confirm** to change to the Bash shell.
1. Type `ssh-keygen -t rsa -b 2048` to create the ssh key. 
1. You will be prompted to enter a file in which to save the key pair. Just press **Enter** to save in the default location, listed in brackets. 
1. You will be asked to enter a passphrase. You can type a passphrase for your SSH key or press **Enter** to continue without a passphrase.
1. The `ssh-keygen` command generates public and private keys with the default name of `id_rsa` in the `~/.ssh directory`. The command returns the full path to the public key. Use the path to the public key to display its contents with `cat` by typing `cat ~/.ssh/id_rsa.pub`.
1. Copy the output of this command and save it somewhere to use later in this article. This is your public key and you will need it when configuring your administrator account to log in to your VM.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) if you haven't already.

## Create virtual machine

1. Type **virtual machines** in the search.
1. Under **Services**, select **Virtual machines**.
1. In the **Virtual machines** page, select **Add**. The **Create a virtual machine** page opens.
1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose to **Create new** resource group. Type *myResourceGroup* for the name.*. 

	![Create a new resource group for your VM](./media/quick-create-portal/project-details.png)

1. Under **Instance details**, type *myVM* for the **Virtual machine name**, choose *East US* for your **Region**, and choose *Ubuntu 18.04 LTS* for your **Image**. Leave the other defaults.

	![Instance details section](./media/quick-create-portal/instance-details.png)

1. Under **Administrator account**, select **SSH public key**, type your user name, then paste in your public key. Remove any leading or trailing white space in your public key.

    ![Administrator account](./media/quick-create-portal/administrator-account.png)

1. Under **Inbound port rules** > **Public inbound ports**, choose **Allow selected ports** and then select **SSH (22)** and **HTTP (80)** from the drop-down. 

	![Open ports for RDP and HTTP](./media/quick-create-portal/inbound-port-rules.png)

1. Leave the remaining defaults and then select the **Review + create** button at the bottom of the page.

1. On the **Create a virtual machine** page, you can see the details about the VM you are about to create. When you are ready, select **Create**.

It will take a few minutes for your VM to be deployed. When the deployment is finished, move on to the next section.

	
## Connect to virtual machine

Create an SSH connection with the VM.

1. Select the **Connect** button on the overview page for your VM. 

    ![Portal 9](./media/quick-create-portal/portal-quick-start-9.png)

2. In the **Connect to virtual machine** page, keep the default options to connect by IP address over port 22. In **Login using VM local account** a connection command is shown. Select the button to copy the command. The following example shows what the SSH connection command looks like:

    ```bash
    ssh azureuser@10.111.12.123
    ```

3. Using the same bash shell you used to create your SSH key pair (you can reopen the Cloud Shell by selecting `>_` again or going to `https://shell.azure.com/bash`), paste the SSH connection command into the shell to create an SSH session.

## Install web server

To see your VM in action, install the NGINX web server. From your SSH session, update your package sources and then install the latest NGINX package.

```bash
sudo apt-get -y update
sudo apt-get -y install nginx
```

When done, type `exit` to leave the SSH session.


## View the web server in action

Use a web browser of your choice to view the default NGINX welcome page. Type the public IP address of the VM as the web address. The public IP address can be found on the VM overview page or as part of the SSH connection string you used earlier.

![NGINX default site](./media/quick-create-portal/nginx.png)

## Clean up resources

When no longer needed, you can delete the resource group, virtual machine, and all related resources. To do so, select the resource group for the virtual machine, select **Delete**, then confirm the name of the resource group to delete.

## Next steps

In this quickstart, you deployed a simple virtual machine, created a Network Security Group and rule, and installed a basic web server. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.

> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)
