---
title: Quickstart - Create a Windows VM in the Azure portal
description: In this quickstart, you learn how to use the Azure portal to create a Windows virtual machine
author: cynthn
ms.service: virtual-machines
ms.collection: windows
ms.topic: quickstart
ms.workload: infrastructure
ms.date: 03/15/2021
ms.author: cynthn
ms.custom: mvc
---

# Quickstart: Create a Windows virtual machine in the Azure portal

Azure virtual machines (VMs) can be created through the Azure portal. This method provides a browser-based user interface to create VMs and their associated resources. This quickstart shows you how to use the Azure portal to deploy a virtual machine (VM) in Azure that runs Windows Server 2019. To see your VM in action, you then RDP to the VM and install the IIS web server.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create virtual machine

1. Type **virtual machines** in the search.
1. Under **Services**, select **Virtual machines**.
1. In the **Virtual machines** page, select **Add** then **Virtual machine**. 
1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose to **Create new** resource group. Type *myResourceGroup* for the name. 

    ![Screenshot of the Project details section showing where you select the Azure subscription and the resource group for the virtual machine](./media/quick-create-portal/project-details.png)

1. Under **Instance details**, type *myVM* for the **Virtual machine name** and choose *East US* for your **Region**. Choose *Windows Server 2019 Datacenter* for the **Image** and *Standard_DS1_v2* for the **Size**. Leave the other defaults.

    ![Screenshot of the Instance details section where you provide a name for the virtual machine and select its region, image and size](./media/quick-create-portal/instance-details.png)

1. Under **Administrator account**,  provide a username, such as *azureuser* and a password. The password must be at least 12 characters long and meet the [defined complexity requirements](faq.yml#what-are-the-password-requirements-when-creating-a-vm-).

    ![Screenshot of the Administrator account section where you provide the administrator username and password](./media/quick-create-portal/administrator-account.png)

1. Under **Inbound port rules**, choose **Allow selected ports** and then select **RDP (3389)** and **HTTP (80)** from the drop-down.

    ![Screenshot of the inbound port rules section where you select what ports inbound connections are allowed on](./media/quick-create-portal/inbound-port-rules.png)

1. Leave the remaining defaults and then select the **Review + create** button at the bottom of the page.

    ![Screenshot showing the Review and create button at the bottom of the page](./media/quick-create-portal/review-create.png)

1. After validation runs, select the **Create** button at the bottom of the page.

1. After deployment is complete, select **Go to resource**.

    ![Screenshot showing the next step of going to the resource](./media/quick-create-portal/next-steps.png)

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

## Connect to virtual machine

Create a remote desktop connection to the virtual machine. These directions tell you how to connect to your VM from a Windows computer. On a Mac, you need an RDP client such as this [Remote Desktop Client](https://apps.apple.com/app/microsoft-remote-desktop/id1295203466?mt=12) from the Mac App Store.

1. On the overview page for your virtual machine, select the **Connect** button then select **RDP**. 

    ![Screenshot of the virtual machine overview page showing the location of the connect button](./media/quick-create-portal/portal-quick-start-9.png)
    
2. In the **Connect with RDP** page, keep the default options to connect by IP address, over port 3389, and click **Download RDP file**.

2. Open the downloaded RDP file and click **Connect** when prompted. 

3. In the **Windows Security** window, select **More choices** and then **Use a different account**. Type the username as **localhost**\\*username*, enter the password you created for the virtual machine, and then click **OK**.

4. You may receive a certificate warning during the sign-in process. Click **Yes** or **Continue** to create the connection.

## Install web server

To see your VM in action, install the IIS web server. Open a PowerShell prompt on the VM and run the following command:

```powershell
Install-WindowsFeature -name Web-Server -IncludeManagementTools
```

When done, close the RDP connection to the VM.


## View the IIS welcome page

In the portal, select the VM and in the overview of the VM, hover over the IP address to show **Copy to clipboard**. Copy the IP address and paste it into a browser tab. The default IIS welcome page will open, and should look like this:

![Screenshot of the IIS default site in a browser](./media/quick-create-powershell/default-iis-website.png)

## Clean up resources

When no longer needed, you can delete the resource group, virtual machine, and all related resources. 

Go to the resource group for the virtual machine, then select **Delete resource group**. Confirm the name of the resource group to finish deleting the resources.

## Next steps

In this quickstart, you deployed a simple virtual machine, opened a network port for web traffic, and installed a basic web server. To learn more about Azure virtual machines, continue to the tutorial for Windows VMs.

> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](./tutorial-manage-vm.md)
